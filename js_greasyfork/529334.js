// ==UserScript==
// @name        Beta Boss
// @namespace   Violentmonkey Scripts
// @match       https://opfrontier.fr/*
// @grant       none
// @version     1.1
// @author      -
// ==/UserScript==


const socket = new WebSocket('wss://bot-discord-ckbl.onrender.com');

    function resetVariables() {
        console.log("Réinitialisation des variables...");
        localStorage.setItem("etapeCombat", "0");
    }


// Récupérer l'ID unique depuis le localStorage (ou cookie) et s'assurer que le joueur envoie cet ID au serveur
const playerId = localStorage.getItem('playerId') || generateUniqueId();  // Si pas trouvé, générer un nouvel ID

// Stocker cet ID dans localStorage pour qu'il persiste après actualisation
localStorage.setItem('playerId', playerId);

let scriptRunning = localStorage.getItem('scriptRunning') === 'true'; // Vérifier si le script était en cours avant l'actualisation

socket.onopen = () => {
    console.log("Connexion WebSocket ouverte.");
    // Envoie l'ID du joueur pour rétablir la session
    socket.send(JSON.stringify({ type: 'handshake', playerId }));

    // Si le script était en cours avant l'actualisation, le redémarrer
    if (scriptRunning) {
        console.log("Redémarrage du script.");
        socket.send("start_script");
        allscript(); // Remplace par la fonction que tu veux exécuter
    }
};

socket.onmessage = (event) => {
    console.log("📨 Message reçu :", event.data);
    if (event.data === "start_script") {
        console.log("🚀 Exécution du script !");
        allscript(); // Remplace par la fonction que tu veux exécuter
        scriptRunning = true; // Mettre à jour l'état du script
        localStorage.setItem('scriptRunning', 'true'); // Persister l'état du script
    }

    if (event.data === "stop_script") {
        console.log("Le script a été arrêté.");
        scriptRunning = false; // Mettre à jour l'état du script
        resetVariables();
        localStorage.setItem('scriptRunning', 'false'); // Persister l'état du script
    }

      try {
        const data = JSON.parse(event.data);
        if (data.type === "activePlayers") {
          console.log(`Nombre de joueurs actifs : ${data.count}`);
          localStorage.setItem('nb_membres_ge', data.count); // Persister l'état du script
        }
        if (data.type === "executionLink") {
        // Redirige l'utilisateur vers l'URL dans le même onglet
          window.location.href = data.url;
        }

    } catch (e) {
        console.log("Message reçu :", event.data);
    }

};






socket.onerror = (error) => {
    console.error("❌ Erreur WebSocket :", error);
};

socket.onclose = () => {
    console.log("🔴 Connexion WebSocket fermée.");
};

// Fonction pour générer un ID unique
function generateUniqueId() {
    const timestamp = Date.now(); // Récupère le temps actuel en millisecondes
    const randomNum = Math.floor(Math.random() * 1000000); // Génère un nombre aléatoire entre 0 et 999999
    return `${timestamp}-${randomNum}`; // Combine le timestamp et le nombre aléatoire pour obtenir un ID unique
}



function allscript(){

// ==UserScript==
// @name         Combat Automatique Boss opf
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatisation des combats contre les boss avec gestion d'étapes
// @author       TonNom
// @match        https://opfrontier.fr/*
// @grant        none
// ==/UserScript==


    function resetVariables() {
        console.log("Réinitialisation des variables...");
        localStorage.setItem("etapeCombat", "0");
    }


if(document.body.innerHTML.indexOf('La page demandée n\'existe pas ou a renvoyé une erreur.') == - 1 &&
document.body.innerHTML.indexOf('Un code a été envoyé pour prévenir contre toutes tentatives de triche') == - 1){
////////////////////////////////////////////////////////////////////VARIABLES A TOUCHER////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var membre = parseInt(localStorage.getItem("nb_membres_ge"));


var vie = parseInt(document.getElementById("pv_player").innerHTML);
  // Récupérer la valeur actuelle des PV
const pvPlayerElement = document.getElementById('pv_player');
const pvCurrent = parseInt(pvPlayerElement.innerText, 10);

// Récupérer la largeur du div représentant la barre de progression (en %)
const progressBar = pvPlayerElement.closest('.text-sm').querySelector('.bg-green-500');
const progressBarWidth = progressBar.style.width; // Valeur en %

const vieMax = Math.round(pvCurrent / (parseInt(progressBarWidth, 10) / 100));
console.log('Vie Max:', vieMax);


var forceTraitement = document.getElementsByClassName("w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700")[7].innerHTML
var forcenow = forceTraitement.substring(forceTraitement.indexOf('now="'), forceTraitement.indexOf('aria-valuemin'))
var force = parseInt(forcenow.substring(5, forcenow.indexOf('" ')));
var forceMaxValue = forceTraitement.substring(forceTraitement.indexOf('max="'), forceTraitement.indexOf('</div'))
var forceMax = parseInt(forceMaxValue .substring(5, forceMaxValue .indexOf('">')));

if (window.location.href.includes("index.php?page=rassemblement&lieu=")) {

  // Récupérer le texte qui contient le nombre de membres
  let membresText = document.querySelector('#load2 .font-bold').textContent.trim();

  // Utiliser une expression régulière pour extraire les nombres avant et après le "/"
  let matches = membresText.match(/^Membres : (\d+) \/ \d+$/);

  if (matches) {
    // Extraire le nombre de membres (avant le "/")
    let membresCount = parseInt(matches[1]);
    if(membresCount == membre)
    {
      const link = document.querySelector("a.font-bold.text-green-600");

      if (link && link.textContent.includes("Lancer l'assault")) {
          console.log("Élément trouvé :", link);
          link.click(); // Simule un clic si l'élément est trouvé
      } else {
          console.log("Aucun élément correspondant trouvé.");
      }

    }
else {setTimeout(function(){location.reload()}, 3000);}
    // Afficher le nombre de membres dans la console (ou l'utiliser dans d'autres logiques)
    console.log("Nombre de membres : " + membresCount);
  } else {
    console.error("Le texte des membres n'est pas dans le format attendu");
  }

}



if (window.location == "https://opfrontier.fr/index.php?page=boss") {
    // Liste des stratégies par boss
    const strategies = {
        "Wapol": ["C", "C", "C", "C", "S", "S", "S", "S", "S", "S", "S"],
        "Smoker": ["C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S", "S", "S"],
        "Ener": ["C", "C", "C", "C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S"],
        "Monster Point": ["C", "C", "C", "C", "S", "S", "S", "S", "S"],
        "Oz": ["C", "C", "C", "C", "C", "S", "S", "S", "S", "S"],
        "PX-1": ["C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S", "S"],
        "Magellan": ["C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S", "S", "S"],
        "Sengoku": ["C", "C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S", "S", "S"],
        "Hody": ["C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S", "S"],
        "Mihawk": ["C", "C", "C", "C", "C", "C", "S", "S", "S", "S", "S", "S"],
        "Smiley": ["C", "C", "C", "C", "C", "C","C","C","C","C", "S", "S", "S", "S", "S", "S"],
    };

    // Liens des attaques
    const attackLinks = {
        "P": "index.php?page=boss&a=2",
        "C": "index.php?page=boss&a=33",
        "S": "index.php?page=boss&a=39",
    };

    // Sélectionne le div contenant le combat
    const combatDiv = document.getElementById("div-combat");

    // Extraction du texte brut du combat
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = combatDiv.innerHTML;
    const textContent = tempDiv.innerText.trim();

    // Séparer chaque phrase proprement
    const sentences = textContent.split(/\.\s*|\n/).map(s => s.trim()).filter(s => s);

    // Trouver la **dernière** attaque de l'ennemi (attaque la plus récente)
    const lastEnemyAttack = sentences.find(sentence => sentence.startsWith("L'ennemi")) || "Aucune attaque trouvée";

    console.log("Dernière attaque de l'ennemi :", lastEnemyAttack);

    // Fonction pour récupérer le nom du boss sur la page
    function getBossName() {
        const enemyNameElement = document.querySelector('.flex.flex-col.mt-2.items-center span.font-bold');
        let bossNameElement = enemyNameElement ? enemyNameElement.textContent.trim() : null;
        if (bossNameElement) return bossNameElement;
        let match = document.title.match(/Boss : (\w+)/);
        return match ? match[1] : null;
    }

    // Fonction principale d'exécution de la stratégie
    async function executeStrategy() {
        const bossName = getBossName();
        if (!bossName || !strategies[bossName]) {
            console.error("Boss non reconnu ou aucune stratégie définie.");
            return;
        }

        console.log(`Détection du boss : ${bossName}`);
        const strategy = strategies[bossName];

        // Récupération de l'étape actuelle (0 par défaut)
        let etape = parseInt(localStorage.getItem("etapeCombat")) || 0;

        if (etape >= strategy.length || document.body.innerHTML.includes('Vous êtes KO...')) {
            console.log("Toutes les attaques ont été effectuées. Réinitialisation.");
            localStorage.setItem("etapeCombat", "0");
            return;
        }

        console.log(`Étape actuelle : ${etape + 1} / ${strategy.length}`);

// Vérifier si une attaque est déjà sélectionnée
if (isAttackAlreadySelected()) {
    if (!localStorage.getItem("combatRefreshed")) {
        console.log("Une attaque est déjà sélectionnée. Rafraîchissement de la page...");
        localStorage.setItem("combatRefreshed", "true"); // Marquer qu'un refresh a été fait
        location.reload();
    } else {
        console.log("Une attaque est déjà sélectionnée, mais le refresh a déjà été fait. Attente du prochain tour...");
        await waitForNextTurn();
      localStorage.removeItem("combatRefreshed");
    }
    return;
}

// Une fois une attaque exécutée correctement, on enlève le flag du refresh


        // Déterminer l'attaque à exécuter
        let attackAcronym = strategy[etape];

        // Récupérer la dernière attaque effectuée (étape précédente)
        let previousAttack = etape > 0 ? strategy[etape - 1] : null;

        // Vérifier si la stratégie contient un "P"
        let containsP = strategy.includes("P");

        // ⚡ Vérification spéciale pour "L'ennemi est paralysé"
        if (!containsP && lastEnemyAttack === "L'ennemi est paralysé" && attackAcronym !== "S" && previousAttack !== "S") {
            console.log("⚠️ Condition spéciale remplie : Exécution de 'C' sans avancer l'étape !");
            window.location.href = attackLinks["C"];
            return; // NE PAS mettre à jour l'étape
        }

        // Exécuter l'attaque normalement
        console.log(`Exécution de l'attaque ${attackAcronym}`);
        window.location.href = attackLinks[attackAcronym];

        // Mise à jour de l'étape pour la prochaine attaque
        localStorage.setItem("etapeCombat", etape + 1);

        // Attente du prochain tour
        await waitForNextTurn();
    }

    // Vérifie si une attaque est sélectionnée
    function isAttackAlreadySelected() {
        return document.querySelector('span.oi-check') !== null;
    }

    // Attend le prochain tour en surveillant l'évolution du timer
    function waitForNextTurn() {
        return new Promise(resolve => {
            const initialTimerValue = parseInt(document.getElementById('timer').innerText, 10);
            const interval = setInterval(() => {
                const currentTimerValue = parseInt(document.getElementById('timer').innerText, 10);
                if (currentTimerValue > initialTimerValue) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }

    // Lancer la stratégie dès le chargement de la page
    executeStrategy();
}




  //////////////////////////////////////////



  (function () {

    let observer = null;


    function checkAndQuit() {
        let enemyHp = document.querySelector("#pv_actu");
        let quitButton = document.querySelector("a[href*='fuite=1']");

        if (enemyHp && parseInt(enemyHp.textContent.trim()) === 0 && quitButton) {
            console.log("L'ennemi est à 0 PV, tentative de quitter...");
            quitButton.click();
        } else {
            setTimeout(checkAndQuit, 1000); // Vérifie toutes les secondes
        }
    }


if(document.body.innerHTML.indexOf('Vous êtes KO...') != - 1){
  window.location = "https://opfrontier.fr/index.php?page=auberge"
  localStorage.setItem("etapeCombat", "0");
}


if(window.location =="https://opfrontier.fr/index.php?page=accueil" && force != forceMax)
{
window.location = "https://opfrontier.fr/index.php?page=auberge"
localStorage.setItem("etapeCombat", "0");

}

  if(window.location == "https://opfrontier.fr/index.php?page=auberge" && vie != vieMax)
{
window.location = "https://opfrontier.fr/index.php?page=sac"
localStorage.setItem("etapeCombat", "0");
}

if(window.location == ("https://opfrontier.fr/index.php?page=sac") && vie != vieMax){
window.location = 'https://opfrontier.fr/index.php?page=sac&obj=155';
 }

if(document.location.href.indexOf("&obj") != -1){
document.querySelector("button[name='consommer']").click();
}

    checkAndQuit();
})();

/////////////////////
  }
else {

function Sound(url, vol, autoplay, loop)
{
    var that = this;

    that.url = (url === undefined) ? "http://mire.ipadsl.net/speedtest.php" : url;
    that.vol = (vol === undefined) ? 1.0 : vol;
    that.autoplay = (autoplay === undefined) ? true : autoplay;
    that.loop = (loop === undefined) ? false : loop;
    that.sample = null;

    if(that.url !== "http://mire.ipadsl.net/speedtest.php")
    {
        that.sync = function(){
            that.sample.volume = that.vol;
            that.sample.loop = that.loop;
            that.sample.autoplay = that.autoplay;
            setTimeout(function(){ that.sync(); }, 60);
        };

        that.sample = document.createElement("audio");
        that.sample.src = that.url;
        that.sync();

        that.play = function(){
            if(that.sample)
            {
                that.sample.play();
            }
        };

        that.pause = function(){
            if(that.sample)
            {
                that.sample.pause();
            }
        };
    }
}

var test = new Sound("https://www.cjoint.com/doc/15_09/EIyePM8cEQL_One-Piece-Opening-10-Full-Version---We-Are-.mp3");
test.play();
};

}