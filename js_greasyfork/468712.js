// ==UserScript==
// @name         Better Guiderz.com / MVPtracker.net
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Calcul la différence entre l'heure de mort du MVP et l'heure actuelle
// @author       Fri
// @license      MIT
// @match        http://mvptracker.net/tracker/*
// @match        http://guiderz.com/tracker/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/468712/Better%20Guiderzcom%20%20MVPtrackernet.user.js
// @updateURL https://update.greasyfork.org/scripts/468712/Better%20Guiderzcom%20%20MVPtrackernet.meta.js
// ==/UserScript==

//Configuration noms des MVPs
const types = {
  //const Neutral = ["", ""];
  Water: ["Golden Thief Bug", "Boitata", "Ifrit", "Assassin", "SinX", "Lord Knight", "LK", "Eddga", "Egnigem", "Ygnizem", "Cenia", "Moonlight"],
  Earth: ["Lady Tanee", "Bacsojin", "Assassin", "SinX", "Stormy Knight", "Mistress", "Sniper"],
  Fire: ["Turtle General", "Maya", "Gopinich", "Amon Ra", "Whitesmith", "WS", "Dark Lord", "Drake", "Hardrock", "Mammoth", "Orc Hero", "Orc Lord", "Osiris", "Scaraba Queen", "Tendrillion"],
  Wind: ["Ktullanux", "Garm", "Assassin", "SinX", "Kraken", "Mastering"],
  //Poison: ["", ""],
  Holy: ["Incantation Samurai", "Fallen Bishop Hibram", "Leak", "Baphomet", "Kiel D-01", "Lord Of Death", "Atroce", "Dark Lord", "Dracula", "Drake", "Osiris", "Pharaoh", "Satan", "Detale", "Doppelganger", "Assassin", "SinX", "Nidhogg"],
  Shadow: ["Valkyrie Randgris", "Vesper", "High Priest", "HP", "Angeling", "Archangeling", "Deviling"],
  Ghost: ["Beelzebub", "High Wizard", "HW", "Evil Snake Lord", "ESL", "Thanatos", "Ghostring", "Gloom Under Night"],
  Undead: ["High Priest", "HP", "Angeling", "Archangeling", "Deviling"]
};


let checkboxAutoConnexion;
let nomDuServerInput;
let pseudoInput;
let checkboxAfficherFaiblesse;




function calculerDifferenceTemps(heureSaisie) {
  if (heureSaisie === "") {
    return 0;
  }

  const heureActuelle = new Date();

  const heureSaisieSplit = heureSaisie.split("h");
  const heureSaisieHeure = parseInt(heureSaisieSplit[0]);
  const heureSaisieMinute = parseInt(heureSaisieSplit[1]);

  const dateAvecHeureSaisie = new Date(
    heureActuelle.getFullYear(),
    heureActuelle.getMonth(),
    heureActuelle.getDate(),
    heureSaisieHeure,
    heureSaisieMinute
  );
  if (dateAvecHeureSaisie > heureActuelle) {
    dateAvecHeureSaisie.setDate(dateAvecHeureSaisie.getDate() - 1);
  }
  const differenceMinutes = Math.round(
    (heureActuelle - dateAvecHeureSaisie) / (1000 * 60)
  );
  return differenceMinutes;
}






function ajouterTextBoxEtCalculerDifference() {
const boutons1 = document.querySelectorAll('img[src="/tracker-files/images/btnUpdate__.png"][alt="Update MVP Spawn Time"][onclick^="postSet(\'killed by me\',"]');
const boutons2 = document.querySelectorAll('button.killMVPButton.killMVPButtonNormal');

const boutons = [...boutons1, ...boutons2]; // Combinez les deux listes

boutons.forEach((bouton) => {
    const textBoxExistante = bouton.nextElementSibling;
    if (textBoxExistante && textBoxExistante.nodeName === "INPUT") {
      return;
    }
    const textBox = document.createElement("input");
    textBox.type = "text";
    textBox.size = "3"; // Augmenter la taille pour accueillir les heures et les minutes
    textBox.classList.add("custom-textbox");
    textBox.style.position = "absolute";
    textBox.style.marginLeft = "5px";
    textBox.style.marginTop = "0px";
    textBox.addEventListener("input", function () {
      let heureSaisie = this.value;
      heureSaisie = heureSaisie.replace(/\D/g, ""); // Supprimer tous les caractères non numériques
      if (heureSaisie.length >= 3) {
        const heures = heureSaisie.slice(0, -2);
        const minutes = heureSaisie.slice(-2);
        heureSaisie = `${heures}h${minutes}`;
      } else if (heureSaisie.length === 2) {
        heureSaisie = `${heureSaisie}h`;
      }
      this.value = heureSaisie;
      const differenceMinutes = calculerDifferenceTemps(heureSaisie);
      const textBoxKilled = this.parentNode.parentNode.querySelector(
        'input[name^="killed"]'
      );
      if (textBoxKilled) {
        textBoxKilled.value = differenceMinutes;
      }
    });
    textBox.addEventListener("keydown", function (event) {
      const key = event.key;
      if (key === "Backspace" || key === "Delete") {
        event.preventDefault(); // Empêche le comportement par défaut de supprimer les caractères
        const heureSaisie = this.value;
        const nouvelleHeureSaisie = heureSaisie.slice(0, -1); // Supprimer le dernier caractère
        this.value = nouvelleHeureSaisie;
        const differenceMinutes = calculerDifferenceTemps(nouvelleHeureSaisie);
        const textBoxKilled = this.parentNode.parentNode.querySelector(
          'input[name^="killed"]'
        );
        if (textBoxKilled) {
          textBoxKilled.value = differenceMinutes;
        }
      }
    });
    bouton.parentNode.insertBefore(textBox, bouton.nextSibling);
    ajouterEvenementEntree(textBox, bouton); // Appel modifié
  });

    if (GM_getValue("AfficherFaiblesse", true)) {
const elementsTexte = document.querySelectorAll(":not(script):not(style):not(textarea):not(input)");

function ajouterTexteEtStyle(element, texte, style, texteAajouter) {
  const nouvelElement = document.createElement("b");
  nouvelElement.textContent = texteAajouter;
  nouvelElement.classList.add(style);
  element.appendChild(nouvelElement);
}

function ajouterTexte(element, texte, style, type) {
  if (!texte.includes(` (${type})`)) {
    ajouterTexteEtStyle(element, texte, `${type}-text`, ` (${type})`);
  }
}

elementsTexte.forEach((element) => {
  if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
    const texte = element.childNodes[0].nodeValue;
    for (const type in types) {
      if (types[type].some((mot) => texte.includes(mot))) {
        ajouterTexte(element, texte, type, type);
      }
    }
  }
});
    }
    else {
      const textClasses = [".Neutral-text", ".Water-text", ".Earth-text", ".Fire-text", ".Wind-text", ".Poison-text", ".Holy-text", ".Shadow-text", ".Ghost-text", ".Undead-text"];
textClasses.forEach((textClass) => {
  const elements = document.querySelectorAll(textClass);
  elements.forEach((element) => {
    element.parentNode.removeChild(element);
  });
});
}
}




// Ajouter le style CSS pour les classes fire-text et vent-text
const style = document.createElement("style");
style.textContent = `
    .Neutral-text { color: Orange; }
    .Water-text { color: blue; }
    .Earth-text { color: #784212; }
    .Fire-text { color: red; }
    .Wind-text { color: green; }
    .Poison-text { color: purple; }
    .Holy-text { color: #FF00FF; }
    .Shadow-text { color: #34495E; }
    .Ghost-text { color: gray; }
    .vent-text { Undead: Yellow; }
`;
document.head.appendChild(style);





function ajouterEvenementEntree(textBox, bouton) {
  textBox.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Empêcher le comportement par défaut d'entrer une nouvelle ligne
      bouton.click(); // Simuler le clic sur le bouton
    }
  });
}

function postSet(killedBy, mvpId) {
  // Fonction vide ou votre implémentation réelle
}

function simulerClic(bouton) {
  const clicEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  bouton.dispatchEvent(clicEvent);
}


function ConnexionAutomatique() {
  if (GM_getValue("AutoConnexion", true)) {
    document.getElementById("txtPass").setAttribute("value", GM_getValue("NomDuServer", ""));
    var boutonImage1 = document.getElementById('btnSubmit');
    boutonImage1.click();
    setTimeout(function() {
      document.getElementById("txtDName").setAttribute("value", GM_getValue("Pseudo", ""));
      var boutonImage2 = document.getElementById('btnLogin');
      boutonImage2.click();
    }, 300);
  }
}

function afficherFenetreConfiguration() {
  const html = `
    <h2>Configuration</h2>
    <input type="checkbox" id="checkboxAfficherFaiblesse" ${
      GM_getValue("AfficherFaiblesse", true) ? "checked" : ""
    }>
    <label for="checkboxAfficherFaiblesse">Display the main weakness of the MVP</label>
    <br><br>
    <input type="checkbox" id="checkboxAutoConnexion" ${
      GM_getValue("AutoConnexion", false) ? "checked" : ""
    }>
    <label for="checkboxAutoConnexion">Enable Auto-Login</label>
    <br><br>
    <label for="nomDuServer">Server password :</label>
    <input type="text" id="nomDuServerInput" name="nomDuServer" value="${GM_getValue(
      "NomDuServer",
      ""
    )}">
    <br><br>
    <label for="pseudo">Pseudo :</label>
    <input type="text" id="pseudoInput" name="pseudo" value="${GM_getValue(
      "Pseudo",
      ""
    )}">
    <br><br>
    <button id="sauvegarderConfig">Save</button>
    <div style="position: absolute; bottom: 3px; right: 3px; text-align: right;">
      <div>Developed by Fri</div>
      <div>Discord: .fri.</div>
    </div>
  `;
  const container = document.createElement("div");
  container.innerHTML = html;
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.left = "20px";
  container.style.padding = "10px";
  container.style.backgroundColor = "white";
  container.style.border = "1px solid black";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  checkboxAutoConnexion = document.getElementById("checkboxAutoConnexion");
  nomDuServerInput = document.getElementById("nomDuServerInput");
  pseudoInput = document.getElementById("pseudoInput");
  checkboxAfficherFaiblesse = document.getElementById("checkboxAfficherFaiblesse");

  checkboxAutoConnexion.addEventListener("change", function () {
    if (this.checked) {
      nomDuServerInput.disabled = false;
      pseudoInput.disabled = false;
    } else {
      nomDuServerInput.disabled = true;
      pseudoInput.disabled = true;
    }
  });
    checkboxAfficherFaiblesse.addEventListener("change", function () {
    if (this.checked) {
      checkboxAfficherFaiblesse.disabled = false;
    } else {
      checkboxAfficherFaiblesse.disabled = true;
    }
  });

  const sauvegarderBtn = document.getElementById("sauvegarderConfig");
  sauvegarderBtn.addEventListener("click", function () {
    GM_setValue("AutoConnexion", checkboxAutoConnexion.checked);
    GM_setValue("AfficherFaiblesse", checkboxAfficherFaiblesse.checked);
    GM_setValue("NomDuServer", nomDuServerInput.value);
    GM_setValue("Pseudo", pseudoInput.value);
    container.remove();
    NomDuServer = GM_getValue("NomDuServer", "0");
    Pseudo = GM_getValue("Pseudo", "0");
    ConnexionAutomatique();
  });
}

window.addEventListener("load", function () {
  ajouterTextBoxEtCalculerDifference();
  ConnexionAutomatique();
});

function observerMutations(mutationsList) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      observer.disconnect();
      ajouterTextBoxEtCalculerDifference();
      observer.observe(document.body, config);
      break;
    }
  }
}

// Options de configuration pour l'observateur de mutations
const config = { childList: true, subtree: true };
const observer = new MutationObserver(observerMutations);
observer.observe(document.body, config);

const configBtn = document.createElement("img");
configBtn.src = "https://cdn-icons-png.flaticon.com/512/2099/2099058.png";
configBtn.style.position = "fixed";
configBtn.style.top = "30px";
configBtn.style.left = "30px";
configBtn.style.zIndex = "9999";
configBtn.style.width = "50px";
configBtn.style.height = "50px";
configBtn.style.cursor = "pointer"; // Modifier le curseur au survol
configBtn.addEventListener("click", afficherFenetreConfiguration);
document.body.appendChild(configBtn);