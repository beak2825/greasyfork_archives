// ==UserScript==
// @name         Naolib
// @namespace    http://naolib.fr/
// @version      2025-07-18
// @description  Ameliore le site en rajoutant des preselections d'item (notamment votre adresse, uniquement les bus...), permettant de revenir en arrière pour modifier ses filtres, et de copier l'itinéraire via un 3e bouton
// @author       Yohann Nizon
// @match        https://naolib.fr/*
// @match        https://plan.naolib.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naolib.fr
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543327/Naolib.user.js
// @updateURL https://update.greasyfork.org/scripts/543327/Naolib.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let monAdresse = "Verlaine (Saint-Herblain)/47.23357391357422/-1.5947014093399048";
    //Vous devez remplacer la chaine de caracteres ci dessus. Pour trouver la votre, cliquez sur le bouton ? en rouge sur naolib.fr

    const parties = monAdresse.split('/');
    let inputDepart = parties[0];
    let from_lat = parseFloat(parties[1]);
    let from_lng = parseFloat(parties[2]);

    let to_lat = '';
    let to_lng = '';
    let inputArrivee = '';
    let typeTransport = 'arrival';

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from_lat') != null){
        from_lat = urlParams.get('from_lat');
    }
    if (urlParams.get('from_lng') != null){
        from_lng = urlParams.get('from_lng');
    }
    if (urlParams.get('from') != null){
        inputDepart = urlParams.get('from');
    }
    if (urlParams.get('to_lat') != null){
        to_lat = urlParams.get('to_lat');
    }
    if (urlParams.get('to_lng') != null){
        to_lng = urlParams.get('to_lng');
    }
    if (urlParams.get('to') != null){
        inputArrivee = urlParams.get('to');
    }
    if (urlParams.get('type') != null){
        typeTransport = urlParams.get('type');
    }

    const customCss = `
        .highlighted-suggestion {
            box-shadow : 0 0 0 .2rem #90e920 !important;
        }
    `;
    GM_addStyle(customCss);

    function copyDest(){
        const targetDiv = document.getElementById('nav-tabContent');
        let htmlString = targetDiv.innerHTML;
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '-9999px';
        tempDiv.innerHTML = htmlString;
        document.body.appendChild(tempDiv);
        // Sélectionnez le contenu de l'élément temporaire
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
    }

    function getSuggestionButtons() {
        return document.querySelectorAll('.js-autocomplete .js-choice');
    }

    function highlightButton(index) {
        const buttons = getSuggestionButtons();
        if (buttons.length === 0) return;

        if (currentSelectedIndex > -1 && buttons[currentSelectedIndex]) {
            buttons[currentSelectedIndex].classList.remove('highlighted-suggestion');
        }

        if (buttons[index]) {
            buttons[index].classList.add('highlighted-suggestion');
            currentSelectedIndex = index;
        }
    }

    const currentUrl = window.location.href;
    let currentSelectedIndex = -1;

    if (currentUrl.startsWith('https://naolib.fr/')) {
        window.setTimeout(function(){
            document.getElementById('nav-iti-tab').click();
            window.setTimeout(function(){
                document.getElementById('inputDepart').value = inputDepart;
                document.querySelector('input[name="from_lat"]').value = from_lat;
                document.querySelector('input[name="from_lng"]').value = from_lng;

                document.getElementById('inputArrivee').value = inputArrivee;
                document.querySelector('input[name="to_lat"]').value = to_lat;
                document.querySelector('input[name="to_lng"]').value = to_lng;

                document.querySelector('button[data-bs-target="#optionItiModal"]').click();
                document.getElementById('optionIti3').click();

                document.querySelector('input[name="type"]').value = typeTransport;
                window.setTimeout(function(){
                    document.querySelector('.js-change-option-iti').click();
                    //document.querySelector('input[name="dateArriver"]').value = '2025-07-18';
                    //document.querySelector('input[name="timeArrivee"]').value = '18:26';
                    window.setTimeout(function(){
                        document.getElementById('inputArrivee').focus();

                        let autocompleteInput = document.getElementById('inputArrivee');
                        autocompleteInput.addEventListener('keydown', (event) => {
                            const buttons = getSuggestionButtons();
                            if (buttons.length === 0) return; // Pas de suggestions, rien à faire

                            switch (event.key) {
                                case 'ArrowDown': // Flèche du bas
                                    event.preventDefault(); // Empêche le curseur de bouger dans l'input
                                    currentSelectedIndex = (currentSelectedIndex + 1) % buttons.length;
                                    highlightButton(currentSelectedIndex);
                                    break;
                                case 'ArrowUp': // Flèche du haut
                                    event.preventDefault(); // Empêche le curseur de bouger dans l'input
                                    currentSelectedIndex = (currentSelectedIndex - 1 + buttons.length) % buttons.length;
                                    highlightButton(currentSelectedIndex);
                                    break;
                                case 'Enter': // Touche Entrée
                                    if (currentSelectedIndex > -1 && buttons[currentSelectedIndex]) {
                                        event.preventDefault(); // Empêche la soumission du formulaire par défaut
                                        buttons[currentSelectedIndex].click(); // Simule un clic sur le bouton sélectionné
                                        // Après la sélection, vous pouvez vouloir cacher les suggestions ou réinitialiser l'état
                                        // currentSelectedIndex = -1;
                                        // // Supprime la mise en évidence après le clic
                                        // buttons.forEach(btn => btn.classList.remove('highlighted-suggestion'));
                                    }
                                    break;
                                case 'Escape': // Touche Échap (utile pour fermer les suggestions)
                                    // Réinitialiser la sélection et masquer les suggestions (si implémenté)
                                    // currentSelectedIndex = -1;
                                    // buttons.forEach(btn => btn.classList.remove('highlighted-suggestion'));
                                    // (Votre logique pour cacher .propositionContainer si besoin)
                                    break;
                            }
                        });

                        const setButton = document.createElement('button');

                        setButton.className = "btn btn-primary";
                        setButton.type = "button";
                        setButton.style.marginLeft = "10px";
                        setButton.style.setProperty('background-color', "#cb3e5e", "important");
                        setButton.innerHTML = "?";
                        setButton.setAttribute("data-matomo-name", "blc-iti-copy");
                        setButton.onclick = function() {
                            alert("Choisissez votre arrêt le plus proche, puis cliquez sur ce bouton. Ensuite coller la valeur qui aura été copié dans ce script tampermonkey en remplacement des valeurs de la ligne 15.");
                            let yourAdress = document.getElementById('inputDepart').value + '/' + document.querySelector('input[name="from_lat"]').value + '/' + document.querySelector('input[name="from_lng"]').value;
                            navigator.clipboard.writeText(yourAdress);
                        };
                        let existingButton = document.querySelector('button[data-matomo-name="blc-iti-rechercher"]');
                        existingButton.insertAdjacentElement('afterend', setButton);
                    },500);
                },500);
            },500);
        },500);
    }


    if (currentUrl.startsWith('https://plan.naolib.fr/')) {
        window.setTimeout(function(){
            //Selectionne juste les BUS
            document.getElementById('btn-itiTrain').click();

            //Modifie le bouton retour pour retrouver les parametres
            let newUrl = 'https://naolib.fr?1';
            for (const [key, value] of urlParams.entries()) {
                newUrl += "&" + key +"="+ value;
            }
            document.querySelector('a[href="https://naolib.fr"]').href = newUrl;

            //Rajoute un bouton de copie            
            const newButton = document.createElement('button');

            newButton.className = "btn btn-light bg-gray400 p-1 rounded mx-2 js-pdf-export";
            newButton.type = "button";
            newButton.setAttribute("data-matomo-tracking", "true");
            newButton.setAttribute("data-matomo-name", "blc-iti-copy");
            newButton.setAttribute("data-matomo-listener", "true");
            newButton.onclick = function() {
                copyDest(); // Assurez-vous que la fonction copyDest() est définie ailleurs
            };

            const icon = document.createElement('i');
            icon.className = "picto picto3x picto-email";
            newButton.appendChild(icon);

            let existingButton = document.querySelector('button[data-matomo-name="blc-iti-dlpdf"]');
            existingButton.insertAdjacentElement('afterend', newButton);
        },5000);
    }
})();