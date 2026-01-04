// ==UserScript==
// @name     Test Trygr
// @version  2025.04.18
// @description  Toggle Trygr script on Pharmashopi and Debug Mode
// @author       You
// @match        *://*.pharmashopi.com/*
// @match        *://*.lasante.net/*
// @match        *://*.wiicmenu-qrcode.com/*
// @match        *://*.lespetitsraffineurs.com/*
// @match        *://*.prestashop.eretail.io/*
// @match        *://*.pharmacodel.com/*
// @match        *://*.boticinal.com/*
// @match        *://*.laboutiqueducoiffeur.com/*
// @match        *://*.hairstore.fr/*
// @match        *://*.easypara.fr/*
// @match        *://bolpat.pp.webpick.info/*
// @match        *://*.pharmashopdiscount.com/*
// @match        *://*.parapromos.com/*
// @match        *://*.universpharmacie.fr/*
// @match        *://*.pharmaciepolygone.com/*
// @match        *://*.carre-opera.com/*
// @match        *://*.carre-opera.itekcom.dev/*
// @icon     https://www.google.com/s2/favicons?sz=64&domain=trygr.io
// @grant    none
// @namespace https://greasyfork.org/users/1292059
// @downloadURL https://update.greasyfork.org/scripts/518075/Test%20Trygr.user.js
// @updateURL https://update.greasyfork.org/scripts/518075/Test%20Trygr.meta.js
// ==/UserScript==

var trg_ids = [
    // PROD
    {'name': 'Pharmashopi', 'hostname': 'pharmashopi.com', 'id': 'ecf19652-4c19-4fe5-a1c1-c94723f3f9bc'},
    {'name': 'La Santé', 'hostname': 'lasante.net', 'id': '0358755f-00c8-413b-b809-9b5827bd6c07'},
    {'name': 'Wiic', 'hostname': 'wiicmenu-qrcode.com', 'id':'787cde82-4bb6-4119-b6ea-cf398b204f85'},
    {'name': 'Les Rafifineurs', 'hostname': 'lespetitsraffineurs.com', 'id': ''},
    {'name': 'Test Trygr', 'hostname':'eretail.io', 'id': 'b32078c5-39f7-4577-8a33-c8057bfd6b2f'},
    {'name': 'Pharmacodel', 'hostname':'pharmacodel.com', 'id': 'd2ef7fbd-2419-4b06-8fef-8260ad8aa483'},
    {'name': 'Boticinal', 'hostname':'boticinal.com', 'id': '8d0dc301-6e6a-4119-958a-6dfe7452c1bf'},
    {'name': 'La boutique du coiffeur', 'hostname':'laboutiqueducoiffeur.com', 'id': '0def8660-2197-4bac-8406-03ee4e283c30'},
    {'name': 'Hairstore', 'hostname':'hairstore.fr', 'id': 'e61b350a-adc7-479f-92c9-59e3145180b3'},
    {'name': 'EasyPara', 'hostname':'easypara.fr', 'id': '239f707f-e614-44fc-83f0-9f2c816c4c48'},
    {'name': 'Pharmashop Discount', 'hostname':'pharmashopdiscount.com', 'id': '596e4571-ac88-46eb-b087-fce0e2164eaf'},
    {'name': 'Parapromos', 'hostname':'parapromos.com', 'id': '7aa7455b-3ddf-45fa-991c-8b4881dade3a'},
    {'name': 'Univers Pharmacie', 'hostname':'universpharmacie.fr', 'id': '94324747-6c83-4e44-a239-3fd19dfabafc'},
    {'name': 'Pharmacie du Polygone', 'hostname':'pharmaciepolygone.com', 'id': '6facd24a-b8f4-496c-884f-88bf706fc847'},
    {'name': 'Carré Opéra', 'hostname':'carre-opera.com', 'id': '1d725415-38b3-4a3c-8b24-d6e8b8d9915e'},
    // PREPROD
    {'name': 'Trygr', 'hostname':'bolpat.pp.webpick.info', 'id': 'c2d95715-73e1-4795-8641-1cae83eac05a'},
    {'name': 'Carré Opéra', 'hostname':'carre-opera.itekcom.dev', 'id': '1d725415-38b3-4a3c-8b24-d6e8b8d9915e'},
    // NEW LINE
    // {'name': '', 'hostname':'', 'id': ''},
];

var trg_hstnm = window.location.hostname;

let style = document.createElement('style');
style.innerHTML = `
    #infoDiv a {
        color: #337ab7;
    }

`;

// Ajouter l'élément <style> au <head>
document.head.appendChild(style);

function getDomainParams(trg_hstnm) {
    const trg_site = trg_ids.find(item => trg_hstnm.includes(item.hostname));
    if (trg_site) {
        console.log('Id : ' + trg_site.id + ' trouvé pour le site ' + trg_site.name);
        return {
            name: trg_site.name,
            id: trg_site.id
        };
    }
    console.warn("Aucun paramètre trouvé pour ce domaine.");
    return null;
}

// Vérifie si Trygr est activé dans le localStorage et ajoute le script Trygr si besoin
if (localStorage.getItem('trygr_active') === 'true') {
    console.log("Adding Trygr script");
    addTrygrScript();
}

// Fonction pour basculer le script Trygr
function toggleTrygrScript() {
    const activeTrygr = localStorage.getItem('trygr_active');
    if (activeTrygr === 'true') {
        localStorage.setItem('trygr_active', 'false');
        removeTrygrScript();
    } else {
        localStorage.setItem('trygr_active', 'true');
        addTrygrScript();
    }
    updateToggleButton(); // Met à jour le texte du bouton
    window.location.reload();  // Rafraîchit la page après l'action
}

// Fonction pour ajouter le script Trygr
function addTrygrScript() {
    if (!document.getElementById('trygr')) {
        const trg_params = getDomainParams(trg_hstnm);
        const script = document.createElement('script');
        script.async = true;
        script.id = 'trygr';
        script.src = 'https://cdn.trygr.io/sdk_v2.min.js';
        script.setAttribute('data-client-id', trg_params.id);
        script.onerror = () => console.error("Failed to load the Trygr SDK");
        document.head.appendChild(script);
    }
}

// Fonction pour retirer le script Trygr
function removeTrygrScript() {
    const script = document.getElementById('trygr');
    if (script) {
        document.head.removeChild(script);
    }
}

// Met à jour le texte du bouton Trygr
function updateToggleButton() {
    const toggleButton = document.getElementById('toggleButton');
    const activeTrygr = localStorage.getItem('trygr_active');
    toggleButton.textContent = activeTrygr === 'true' ? 'Retirer le script Trygr' : 'Ajouter le script Trygr';
}

// Fonction pour basculer le mode débogage
function toggleDebugMode() {
    let debugMode = localStorage.getItem("eretail_debug");
    if (debugMode === "on") {
        localStorage.setItem("eretail_debug", "off");
    } else {
        localStorage.setItem("eretail_debug", "on");
    }
    updateDebugButton(); // Met à jour l'état du bouton de débogage
    window.location.reload();  // Rafraîchit la page après l'action
}

// Fonction pour basculer le mode débogage
function toggleInfoMode() {
    let infoMode = localStorage.getItem("eretail_info");
    if (infoMode === "on") {
        localStorage.setItem("eretail_info", "off");
    } else {
        localStorage.setItem("eretail_info", "on");
    }
    updateInfoButton(); // Met à jour l'état du bouton de débogage
    debug_infos();  // Rafraîchit la page après l'action
}

// Met à jour le texte du bouton de débogage
function updateDebugButton() {
    const button = document.getElementById('debugButton');
    let debugMode = localStorage.getItem("eretail_debug");
    button.textContent = debugMode === "on" ? 'Debug Mode : ON' : 'Debug Mode : OFF';
    styleButton(debugButton, localStorage.getItem("eretail_debug") === "on" ? '#28a745' : '#a74528', '45px');
}

// Met à jour le texte du bouton d'info
function updateInfoButton() {
    const button = document.getElementById('infoButton');
    let infoMode = localStorage.getItem("eretail_info");
    console.log(infoMode === "on" ? '#28a745' : '#a74528');
    button.textContent = infoMode === "on" ? 'Info Mode : ON' : 'Info Mode : OFF';
    styleButton(infoButton, localStorage.getItem("eretail_info") === "on" ? '#28a745' : '#a74528', '10px');
}

// Fonction pour créer les boutons et les ajouter au DOM
function createToggleButtons() {
    // Bouton pour le script Trygr
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleButton';
    toggleButton.textContent = localStorage.getItem('trygr_active') === 'true' ? 'Retirer le script Trygr' : 'Ajouter le script Trygr';
    toggleButton.onclick = toggleTrygrScript;
    toggleButton.setAttribute('aria-label', 'Toggle Trygr script');
    styleButton(toggleButton, '#007bff', '80px');

    // Bouton pour le mode débogage
    const debugButton = document.createElement('button');
    debugButton.id = 'debugButton';
    debugButton.textContent = localStorage.getItem("eretail_debug") === "on" ? 'Debug Mode : ON' : 'Debug Mode : OFF';
    debugButton.onclick = toggleDebugMode;
    debugButton.setAttribute('aria-label', 'Toggle Debug Mode');
    styleButton(debugButton, localStorage.getItem("eretail_debug") === "on" ? '#28a745' : '#a74528', '45px');

    // Bouton pour le mode débogage
    const infoButton = document.createElement('button');
    infoButton.id = 'infoButton';
    infoButton.textContent = localStorage.getItem("eretail_info") === "on" ? 'Info Mode : ON' : 'Info Mode : OFF';
    infoButton.onclick = toggleInfoMode;
    infoButton.setAttribute('aria-label', 'Toggle Info Mode');
    styleButton(infoButton, localStorage.getItem("eretail_info") === "on" ? '#28a745' : '#a74528', '10px');


    // Ajout des boutons au body
    document.body.appendChild(toggleButton);
    document.body.appendChild(debugButton);
    document.body.appendChild(infoButton);
}

// Fonction pour styliser les boutons
function styleButton(button, backgroundColor, bottom) {
    button.style.position = 'fixed';
    button.style.bottom = bottom;
    button.style.left = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = backgroundColor;
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';
    button.style.transition = 'background-color 0.3s ease';
    button.style.zIndex = '100000';
    button.style.maxWidth = '200px';
    button.style.maxHeight = '50px';
    button.style.fontSize = '12px';
    button.style.lineHeight = '12px';

    button.onmouseover = () => button.style.backgroundColor = shadeColor(backgroundColor, -20); // Couleur au survol
    button.onmouseout = () => button.style.backgroundColor = backgroundColor; // Couleur normale
}

// Fonction pour assombrir une couleur
function shadeColor(color, percent) {
    const num = parseInt(color.replace(/#/g, ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 + (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 + (B < 255 ? (B < 1 ? 0 : B) : 255)).toString(16).slice(1);
}

// Fonction pour ajouter des infos en mode debug
function debug_infos() {
    document.querySelectorAll('[data-trygr-insert]').forEach(el => {
        const infoDiv = el.querySelector("#infoDiv");
        if (infoDiv) {
            infoDiv.remove();
        }

        // Ajuste les dimensions de el
        if (!el.textContent.trim()) {
            el.style.minHeight = "";
            el.style.background = "";
            el.style.margin = "";
        }
    });

    if (localStorage.getItem('eretail_debug') === 'on' || localStorage.getItem('eretail_info') === 'on' ) {
        document.querySelectorAll('[data-trygr-insert]').forEach(el => {
            // Forcer position: relative si pas déjà positionné
            if (getComputedStyle(el).position === 'static') {
                el.style.position = 'relative';
            }

            // Ajuste les dimensions de el
            if (!el.textContent.trim()) {
                el.style.minHeight = "100px";
                el.style.background = "red";
                el.style.margin = "10px 0";
            }

            const insertValue = el.getAttribute('data-trygr-insert');

            // Trouver les enfants avec data-trygr-adset ou data-trygr-campaign
            const adsets = [];
            const campaigns = [];

            el.querySelectorAll('[data-trygr-adset], [data-trygr-campaign]').forEach(child => {
                const adset = child.getAttribute('data-trygr-adset');
                const campaign = child.getAttribute('data-trygr-campaign');

                if (adset) adsets.push(adset);
                if (campaign) campaigns.push(campaign);
            });

            // Créer la div de debug
            const infoDiv = document.createElement('div');
            infoDiv.id = "infoDiv";
            infoDiv.style.position = 'absolute';
            infoDiv.style.top = '0';
            infoDiv.style.right = '0';
            infoDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            infoDiv.style.color = 'white';
            infoDiv.style.fontSize = '11px';
            infoDiv.style.padding = '4px 6px';
            infoDiv.style.borderRadius = '0 0 0 6px';
            infoDiv.style.zIndex = '9999';
            infoDiv.style.maxWidth = '100%';

            // Contenu de debug
            infoDiv.innerHTML = `
            <strong>Insert:</strong> <a href="https://app.trygr.io/admin/ssp/insert/?q=${insertValue}" target="_blank">${insertValue}</a><br>
            <strong>Adsets:</strong> <a href="https://app.trygr.io/admin/dsp/lineitem/?q=${adsets}" target="_blank">${adsets}</a><br>
            <strong>Campaigns:</strong> <a href="https://app.trygr.io/admin/dsp/campaign/?q=${campaigns}" target="_blank">${campaigns}</a>
        `;

            el.appendChild(infoDiv);
        });
    }
}

// Créer les boutons immédiatement après le chargement du DOM
createToggleButtons();


// Ajoute des éléments pour appeler la fonction debug à chaque changement sur les inserts trygr

// Observer pour les changements dans le DOM
const mutationObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.hasAttribute('data-trygr-insert')) {
          observeVisibility(node); // Commence à surveiller la visibilité
          debug_infos(); // Déclenche si nécessaire à l’insertion
        }
      });
    }
  }
});

// Cible le body ou un conteneur spécifique
mutationObserver.observe(document.body, {
  childList: true,
  subtree: true
});

// Observer pour la visibilité
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      debug_infos(); // Déclenche quand l'élément devient visible
    }
  });
});

// Fonction pour surveiller la visibilité d’un élément
function observeVisibility(element) {
  intersectionObserver.observe(element);
}

// Pour les éléments déjà présents au chargement
document.querySelectorAll('[data-trygr-insert]').forEach(el => {
  observeVisibility(el);
});