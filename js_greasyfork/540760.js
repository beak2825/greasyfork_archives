// ==UserScript==
// @name         Export Poker TORN en CSV
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Capture et sauvegarde persistante des mains de poker sur torn.com
// @author       liriose [2652374]
// @match        https://www.torn.com/page.php?sid=holdem
// @grant        none
// @license CC-BY-NC-ND-4.0; https://creativecommons.org/licenses/by-nc-nd/4.0/

// @downloadURL https://update.greasyfork.org/scripts/540760/Export%20Poker%20TORN%20en%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/540760/Export%20Poker%20TORN%20en%20CSV.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CLE_STORAGE = "tornPokerHistoriqueLive";

    let historique = JSON.parse(localStorage.getItem(CLE_STORAGE)) || [
[
  "Horodatage", "GameID", "Joueur", "Action", "Round", "Position",
  "Montant", "Pot", "Stack joueur", "Cartes", "Type main",
  "Puissance main", "Résultat", "Board visible", "Durée main (s)", "Joueurs actifs"
]



  ];

   let contexteActuel = {
    gameId: null,
    startTimestamp: null,
    flop: [],
    turn: null,
    river: null,
    joueursVus: [],
    seatDealer: null,
};

function getPotActuel() {
    const potElem = document.querySelector("[class*='totalPotWrap']");
    if (!potElem) return "";
    const match = potElem.innerText.match(/\$[\d,]+/);
    return match ? match[0] : "";
}
function getRoundActuel() {
    if (contexteActuel.river) return "River";
    if (contexteActuel.turn) return "Turn";
    if (contexteActuel.flop.length) return "Flop";
    return "Preflop";
}
function categoriserCartes(cartes) {
    if (!cartes) return "";
    const [a, b] = cartes.split(" ");
    if (!a || !b) return "";

    const valeur = c => c[0];
    const couleur = c => c.slice(-1);

    const v1 = valeur(a), v2 = valeur(b);
    const s1 = couleur(a), s2 = couleur(b);

    const high = ["A", "K", "Q", "J", "T"];
    const suited = s1 === s2;
    const connectors = Math.abs(high.indexOf(v1) - high.indexOf(v2)) === 1;

    if (high.includes(v1) && high.includes(v2)) return "Broadway";
    if (suited && connectors) return "Suited Connectors";
    if (v1 === v2) return "Pocket Pair";
    if (suited) return "Suited";
    return "Other";
}

    function sauvegarder() {
        localStorage.setItem(CLE_STORAGE, JSON.stringify(historique));
    }

    function mettreAJourCompteur() {
    const compteur = document.querySelector("#pokerLiveStats");
    if (!compteur) return;

    const totalMains = historique.length - 1;
    const gainsTotaux = historique.reduce((somme, ligne) => {
        const [_, joueur, action, montant] = ligne;
        if (action === "won" && montant) {
            const n = parseInt(montant.replace(/[\$,]/g, ""));
            return somme + (isNaN(n) ? 0 : n);
        }
        return somme;
    }, 0);

    compteur.innerHTML = `
        <b>📊 Mains détectées :</b> ${totalMains}<br>
        <b>💵 Gains cumulés :</b> $${gainsTotaux.toLocaleString()}
    `;
}


function getArgentDesJoueurs() {
    const data = {};
    const blocs = document.querySelectorAll("[class*='playerPositioner']");

    blocs.forEach(bloc => {
        const lignes = bloc.innerText.split('\n').map(t => t.trim()).filter(Boolean);

        const montant = lignes.find(l => /^\$\d{1,3}(,\d{3})*$/.test(l));
        const nom = lignes.find(l => !l.includes("$") && l.length <= 20);

        if (nom && montant) {
            data[nom] = montant;
        }
    });

    return data;
}

    function QuelPuissanceMain(typeMain) {
    if (!typeMain) return "";
    const t = typeMain.toLowerCase();

    if (t.includes("high card")) return 0;
    if (t.includes("one pair")) return 1;
    if (t.includes("two pair")) return 2;
    if (t.includes("three") || t.includes("trips")) return 3;
    if (t.includes("straight flush")) return 9;
    if (t.includes("flush") && t.includes("straight") === false) return 5;
    if (t.includes("straight")) return 4;
    if (t.includes("full house")) return 6;
    if (t.includes("four")) return 7;
    return "";
}

function analyserLigne(texte) {
    const now = new Date().toLocaleString();
    const joueursStacks = getArgentDesJoueurs();
    const joueursActifs = Object.keys(joueursStacks).filter(n => n.length < 20);
    const round = getRoundActuel();

    const gameStart = texte.match(/^Game\s+([a-f0-9]{16,32}) started/i);
    if (gameStart) {
        contexteActuel = {
            gameId: gameStart[1],
            startTimestamp: Date.now(),
            flop: [],
            turn: null,
            river: null,
            joueursVus: [],
            seatDealer: null,
            smallBlind: null,
            bigBlind: null,
            ordrePreflop: []
        };
        return;
    }

    const flopMatch = texte.match(/^The flop:\s+(.*)/i);
    if (flopMatch) { contexteActuel.flop = flopMatch[1].split(',').map(c => c.trim()); return; }

    const turnMatch = texte.match(/^The turn:\s+(.*)/i);
    if (turnMatch) { contexteActuel.turn = turnMatch[1].trim(); return; }

    const riverMatch = texte.match(/^The river:\s+(.*)/i);
    if (riverMatch) { contexteActuel.river = riverMatch[1].trim(); return; }

    const joueurMatch = texte.match(/^(.+?)\s+(folded|called|bet|raised|checked|reveals|won|posted small blind|posted big blind)(.*)/i);
    if (joueurMatch) {
        const joueur = joueurMatch[1].trim();
        const action = joueurMatch[2];
        const reste = joueurMatch[3].trim();

        // Blinds
        if (action === "posted small blind") {
            contexteActuel.smallBlind = joueur;
            return;
        }
        if (action === "posted big blind") {
            contexteActuel.bigBlind = joueur;
            return;
        }

        // 🔁 Construction de l'ordre preflop si applicable
if (["called", "bet", "raised", "checked"].includes(action)) {
    if (!contexteActuel.ordrePreflop) {
        contexteActuel.ordrePreflop = []; // 🧱 Sécurisation si jamais absent
    }
    if (!contexteActuel.ordrePreflop.includes(joueur)) {
        contexteActuel.ordrePreflop.push(joueur);
    }
}


        const montantMatch = reste.match(/\$[\d,]+/);
        const cartesMatch = reste.match(/\[(.*?)\]/);
        const typeMainMatch = reste.match(/\((.*?)\)/);
        const typeMain = typeMainMatch ? typeMainMatch[1] : "";

        const carteCat = categoriserCartes(cartesMatch?.[1] || "");
        const typeFinal = typeMain || carteCat;
        const puissanceMain = QuelPuissanceMain(typeMain);

        const resultat = action === "won" ? "Gagne" : (action === "reveals" ? "Showdown" : "");
        const board = [...contexteActuel.flop, contexteActuel.turn, contexteActuel.river].filter(Boolean).join(" | ");
        const pot = getPotActuel?.() || "";
        const stack = joueursStacks[joueur] || "";
        const dureeMain = contexteActuel.startTimestamp ? Math.floor((Date.now() - contexteActuel.startTimestamp) / 1000) : "";
        const nbActifs = joueursActifs.length;

        // Position sécurisée
        let position = "";
if (joueur === contexteActuel.smallBlind) position = "SB";
else if (joueur === contexteActuel.bigBlind) position = "BB";
else if (Array.isArray(contexteActuel.ordrePreflop)) {
    if (contexteActuel.ordrePreflop[0] === joueur) position = "UTG";
    else if (contexteActuel.ordrePreflop.slice(-1)[0] === joueur) position = "BTN";
    else if (contexteActuel.ordrePreflop.includes(joueur)) position = "MP";
}


        const ligne = [
            now,
            contexteActuel.gameId || "??",
            joueur,
            action,
            round,
            position,
            montantMatch?.[0] || "",
            pot,
            stack,
            cartesMatch?.[1] || "",
            typeFinal,
            puissanceMain,
            resultat,
            board,
            dureeMain,
            nbActifs
        ];

        const existe = historique.some(row => JSON.stringify(row) === JSON.stringify(ligne));
        if (!existe) {
            try {
                historique.push(ligne);
                sauvegarder?.();
                mettreAJourCompteur?.();
            } catch (e) {
                console.warn("⚠️ Historique saturé – sauvegarde d'urgence déclenchée.");
                sauvegarderHistoriqueEnUrgence?.();
                resetHistorique?.();
            }
        }
    }
}





    function exportCSV() {
        if (historique.length === 1) {
            alert("Aucune donnée enregistrée.");
            return;
        }
        const csv = historique.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const lien = document.createElement("a");
        lien.href = URL.createObjectURL(blob);
        lien.download = "torn_poker_historique_live.csv";
        document.body.appendChild(lien);
        lien.click();
        document.body.removeChild(lien);
    }

    function sauvegarderHistoriqueEnUrgence() {
    try {
        const contenu = historique.map(ligne => Array.isArray(ligne) ? ligne.join(",") : ligne).join("\n");
        const blob = new Blob([contenu], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const lien = document.createElement("a");
        const date = new Date().toISOString().slice(0,19).replaceAll(":", "-");
        lien.href = url;
        lien.download = `export_emergency_${date}.csv`;
        document.body.appendChild(lien);
        lien.click();
        document.body.removeChild(lien);
        URL.revokeObjectURL(url);

        console.warn("📦 Sauvegarde d'urgence exportée suite à dépassement de quota.");
    } catch (e) {
        console.error("❌ Échec de la sauvegarde d'urgence :", e);
    }
}

    function rendreDraggable(bouton) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        bouton.onmousedown = function (e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => document.onmousemove = null;
            document.onmousemove = function (e) {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                bouton.style.top = (bouton.offsetTop - pos2) + "px";
                bouton.style.left = (bouton.offsetLeft - pos1) + "px";
            };
        };
    }

    function injecterBouton() {
        if (document.querySelector("#exportPokerBtn")) return;
        const bouton = document.createElement("button");
        bouton.id = "exportPokerBtn";
        bouton.textContent = "💾 Export CSV + persistant";
        Object.assign(bouton.style, {
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: "999999",
            padding: "10px 15px",
            backgroundColor: "#17a2b8",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "move",
            fontSize: "14px"
        });
        bouton.onclick = exportCSV;
        document.body.appendChild(bouton);
        rendreDraggable(bouton);

        const statsDiv = document.createElement("div");
statsDiv.id = "pokerLiveStats";
Object.assign(statsDiv.style, {
    position: "fixed",
    top: "20px",
    left: "220px",
    backgroundColor: "#f8f9fa",
    color: "#212529",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    fontSize: "13px",
    zIndex: "999999",
    fontFamily: "Arial, sans-serif",
    boxShadow: "2px 2px 6px rgba(0,0,0,0.1)"
});
document.body.appendChild(statsDiv);
mettreAJourCompteur(); // initialise les stats dès le début

    }

   function resetHistorique() {
    historique.length = 0; // Vide
    historique.push([
  "Horodatage", "GameID", "Joueur", "Action", "Round", "Position",
  "Montant", "Pot", "Stack joueur", "Cartes", "Type main",
  "Puissance main", "Résultat", "Board visible", "Durée main (s)", "Joueurs actifs"
]
);
    sauvegarder?.();
    mettreAJourCompteur?.();
    console.log("🧼 Historique Excel réinitialisé avec en-têtes !");
}


    function observeFlux() {
        const scrollContainer = document.querySelector("[class*='scrollArea']");
        if (!scrollContainer) return setTimeout(observeFlux, 1000);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        const lignes = node.innerText.trim().split('\n');
                        lignes.forEach(l => analyserLigne(l.trim()));
                    }
                });
            });
        });

        observer.observe(scrollContainer, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            injecterBouton();
            observeFlux();
            window.getArgentDesJoueurs = getArgentDesJoueurs;
            window.resetHistorique = resetHistorique;
        }, 3000);
    });
})();
