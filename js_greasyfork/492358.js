// ==UserScript==
// @name         Sales Dashboard
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Improve visual appeal and add the option of getting rid of bells
// @author       Aurel
// @match        https://www.clickandboat.com/en/back-office/salesDashboard*
// @match        https://www.clickandboat.com/us/back-office/salesDashboard*
// @match        https://www.clickandboat.com/de/back-office/salesDashboard*
// @match        https://www.clickandboat.com/fr/back-office/salesDashboard*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492358/Sales%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/492358/Sales%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Votre SVG
    const customSvg = `
    <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.97883 9.68508C2.99294 8.89073 2 8.49355 2 8C2 7.50645 2.99294 7.10927 4.97883 6.31492L7.7873 5.19153C9.77318 4.39718 10.7661 4 12 4C13.2339 4 14.2268 4.39718 16.2127 5.19153L19.0212 6.31492C21.0071 7.10927 22 7.50645 22 8C22 8.49355 21.0071 8.89073 19.0212 9.68508L16.2127 10.8085C14.2268 11.6028 13.2339 12 12 12C10.7661 12 9.77318 11.6028 7.7873 10.8085L4.97883 9.68508Z" stroke="#1C274C" stroke-width="1.5"/>
<path d="M22 12C22 12 21.0071 12.8907 19.0212 13.6851L16.2127 14.8085C14.2268 15.6028 13.2339 16 12 16C10.7661 16 9.77318 15.6028 7.7873 14.8085L4.97883 13.6851C2.99294 12.8907 2 12 2 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
<path d="M22 16C22 16 21.0071 16.8907 19.0212 17.6851L16.2127 18.8085C14.2268 19.6028 13.2339 20 12 20C10.7661 20 9.77318 19.6028 7.7873 18.8085L4.97883 17.6851C2.99294 16.8907 2 16 2 16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"/>
</svg>
    `;

    // Créer l'URL de l'icône à partir du SVG
    const svgBlob = new Blob([customSvg], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);

    // Changer le favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/svg+xml';
    link.rel = 'shortcut icon';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);

    window.addEventListener('load', function() {
         // Trouve l'élément <h4> et son parent pour pouvoir manipuler leur position dans le DOM
        var titleElement = document.querySelector('h4.title#Myinprogressclients');
        var parentElement = titleElement.parentNode;

        // Crée une nouvelle <div> qui va contenir le <h4> et le bouton
        var flexContainer = document.createElement('div');
        flexContainer.style.display = 'flex';
        flexContainer.style.flexDirection = 'row';

        // Insère la nouvelle <div> dans le DOM juste avant le <h4>
        parentElement.insertBefore(flexContainer, titleElement);

        // Déplace le <h4> dans la <div>
        flexContainer.appendChild(titleElement);
        titleElement.style.marginTop = '0'; // Applique margin-top: 0 au <h4>

        // Crée un nouveau bouton
        var newButton = document.createElement('button');
        newButton.style.marginLeft = '10px';
        newButton.className = 'btn btn-secondary btn-flat'; // Classes du bouton

        // Ajoute une icône au bouton
        var icon = document.createElement('i');
        icon.className = 'fa fa-bell'; // Classe de l'icône Font Awesome
        newButton.appendChild(icon); // Ajoute l'icône au bouton

        // Ajoute du texte au bouton après l'icône
        var buttonText = document.createTextNode(' Make Bells Disappear');
        newButton.appendChild(buttonText);

        // Fonction qui sera exécutée lorsque le bouton est cliqué
        newButton.onclick = function() {
            // Sélectionne tous les éléments à cliquer
            var icons = document.querySelectorAll('cab-icon.columnLeadState__notif.ng-star-inserted');
            icons.forEach(function(icon) {
                icon.click(); // Clique sur l'élément
            });
        };

        // Trouve l'élément après lequel le bouton doit être inséré
        var insertAfterElement = document.querySelector('h4.title#Myinprogressclients');

        // Insère le bouton dans le DOM, juste après l'élément spécifié
        if (insertAfterElement) {
            insertAfterElement.parentNode.insertBefore(newButton, insertAfterElement.nextSibling);
        }
    });

    
    function delayedAction() {
    console.log("Préparation à exécuter des actions...");

    // Utilise setTimeout pour retarder l'exécution de la fonction de callback
    setTimeout(function() {
        // Les actions à exécuter après 1 seconde
        console.log("Action exécutée après un délai de 1 seconde.");
        const myNewClientsText = document.getElementById('Mynewclients');
        myNewClientsText.style.color = '#197de1';

        const myInProgressClientsText = document.getElementById('Myinprogressclients');
        myInProgressClientsText.style.color = '#e7b111';
    }, 800); // 1000 millisecondes = 1 seconde
    }

    delayedAction();

})();
