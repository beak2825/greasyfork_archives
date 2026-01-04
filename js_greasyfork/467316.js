// ==UserScript==
// @name         Toolkit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Boite à outil d'internet
// @author       Hikachhu
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rentry.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467316/Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/467316/Toolkit.meta.js
// ==/UserScript==

// Styles communs
let buttonStyle = `
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    color: #212121;
    background-color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    transition: background-color 0.3s;
`;

// Crée un nouveau toolkit ou une console
function createToolkit(side) {
    let toolkit = document.createElement('div');
    toolkit.style.position = 'fixed';
    toolkit.style.bottom = '0';
    toolkit.style[side] = '0';
    toolkit.style.width = '200px';
    toolkit.style.height = 'auto';
    toolkit.style.backgroundColor = '#212121';
    toolkit.style.padding = '10px';
    toolkit.style.boxSizing = 'border-box';
    toolkit.style.zIndex = '10000';
    toolkit.style.overflow = 'auto';
    toolkit.style.textAlign = side === 'left' ? 'left' : 'right';
    toolkit.style.borderRadius = side === 'left' ? '0px 10px 0px 0px' : '10px 0px 0px 0px';
    toolkit.style.color = '#ffffff';
    return toolkit;
}

// Crée un bouton pour réduire/agrandir un toolkit
function createToggleButton(toolkit, side) {
    let toggleButton = document.createElement('button');
    toggleButton.textContent = 'Réduire';
    toggleButton.style = buttonStyle;
    toggleButton.onmouseover = function() { this.style.backgroundColor = '#dddddd'; };
    toggleButton.onmouseout = function() { this.style.backgroundColor = '#ffffff'; };
    toggleButton.onclick = function() {
        if (toggleButton.textContent === 'Réduire') {
            for (let i = 1; i < toolkit.children.length; i++) {
                toolkit.children[i].style.display = 'none';
            }
            toggleButton.textContent = 'Agrandir';
            toolkit.style.width = 'auto';
        } else {
            for (let i = 1; i < toolkit.children.length; i++) {
                toolkit.children[i].style.display = 'block';
            }
            toggleButton.textContent = 'Réduire';
            toolkit.style.width = '200px';
        }
    };
    toolkit.appendChild(toggleButton);
}

// Crée un bouton qui exécute une certaine action lorsque vous cliquez dessus
function createActionButton(text, action) {
    let button = document.createElement('button');
    button.textContent = text;
    button.style = buttonStyle;
    button.onmouseover = function() { this.style.backgroundColor = '#dddddd'; };
    button.onmouseout = function() { this.style.backgroundColor = '#ffffff'; };
    button.onclick = action;
    return button;
}

// Ajoute du texte à la console
function addToConsole(consoleToolkit, text) {
    let p = document.createElement('p');
    p.textContent = text;
    p.style.margin = '0';
    p.style.padding = '10px 0';
    p.style.borderTop = '1px solid #ffffff';
    consoleToolkit.appendChild(p);
}

// Créer le toolkit et la console
let toolkit = createToolkit('right');
let consoleToolkit = createToolkit('left');
document.body.appendChild(toolkit);
document.body.appendChild(consoleToolkit);

// Créer les boutons pour réduire/agrandir
createToggleButton(toolkit, 'right');
createToggleButton(consoleToolkit, 'left');

// Créer les boutons d'action
let bgButton = createActionButton('Changer couleur d\'arrière-plan', function() {
    document.body.style.backgroundColor = 'purple';
});
toolkit.appendChild(bgButton);

let urlButton = createActionButton('Afficher URL actuelle', function() {
    addToConsole(consoleToolkit, 'URL actuelle : ' + window.location.href);
});
toolkit.appendChild(urlButton);
// Crée un bouton qui découpe l'URL actuelle et l'affiche dans la console
let dissectUrlButton = createActionButton('Découper URL', function() {
    let url = new URL(window.location.href);

    // Ajoute l'URL complète à la console
    addToConsole(consoleToolkit, 'URL complète : ' + url.href);

    // Ajoute chaque composant de l'URL à la console
    addToConsole(consoleToolkit, 'Protocole : ' + url.protocol);
    addToConsole(consoleToolkit, 'Domaine : ' + url.hostname);
    addToConsole(consoleToolkit, 'Chemin : ' + url.pathname);
    addToConsole(consoleToolkit, 'Fragment : ' + url.hash);

    // Ajoute chaque paramètre de la chaîne de requête à la console
    for (let [key, value] of url.searchParams) {
        addToConsole(consoleToolkit, `Paramètre : ${key}, Valeur : ${value}, Longueur : ${value.length}`);
    }
});
toolkit.appendChild(dissectUrlButton);

