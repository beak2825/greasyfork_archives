// ==UserScript==
// @name         Trygr
// @namespace    http://tampermonkey.net/
// @version      2025-03-06
// @description  update the trygr platform
// @author       You
// @match        *.trygr.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trygr.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524639/Trygr.user.js
// @updateURL https://update.greasyfork.org/scripts/524639/Trygr.meta.js
// ==/UserScript==

// GLOBAL
(function() {
    // Insertion du style dans le document
    const style = document.createElement('style');
    style.textContent = `
        .module {
            margin-bottom: 5px!important;
        }

        .results {
            height: calc(100vh - 300px);
        }

        #result_list thead {
            position: sticky;
            top: 0;
            background-color: white;
            z-index: 10;
        }
    `;
    document.head.appendChild(style);

    let currentVisibleTbody = null; // Variable globale pour suivre le <tbody> visible

    document.querySelectorAll("div[class^='app-']").forEach(function(div) {
        // Récupère le lien <a> à l'intérieur de <caption>
        let link = div.querySelector("caption a");

        if (link) {
            // Récupère le texte de la balise <a> en le nettoyant (minuscules et suppression des espaces)
            let linkText = link.textContent.trim().toLowerCase();

            // Récupère l'URL actuelle en la nettoyant pour comparaison
            let currentUrl = window.location.pathname.toLowerCase();

            // Vérifie si le texte du lien est exactement dans l'URL actuelle (on utilise '/' avant et après pour éviter des correspondances partielles)
            let tbody = div.querySelector("tbody");
            if (!currentUrl.includes(`/${linkText}/`)) {
                // Cache le tbody si le texte n'est pas dans l'URL
                if (tbody) {
                    tbody.style.display = 'none';
                }
            }

            // Ajoute l'événement onclick pour basculer l'affichage du tbody
            link.onclick = function(event) {
                event.preventDefault(); // Empêche le lien de rediriger ou de provoquer un comportement par défaut

                // Cacher tous les autres <tbody> (qu'ils soient visibles ou non)
                document.querySelectorAll("div[class^='app-'] tbody").forEach(function(otherTbody) {
                    otherTbody.style.display = 'none';
                });

                // Bascule l'affichage du <tbody> correspondant
                if (tbody.style.display === "none" || tbody.style.display === "") {
                    tbody.style.display = "table-row-group"; // Afficher le tbody
                    currentVisibleTbody = tbody; // Mémoriser le tbody actuellement visible
                } else {
                    tbody.style.display = "none"; // Cacher le tbody
                    currentVisibleTbody = null; // Réinitialiser si aucun tbody n'est visible
                }
            };
        }
    });
})();

//Ouvrir les pages de modification d'éléments dans un nouvel onglet au lieu d'un popup
document.querySelectorAll('a[id^="change_id_"]').forEach(link => {
    // Ouvrir dans un nouvel onglet
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');

    // Supprimer l'attribut data-popup="yes"
    link.removeAttribute('data-popup');

    // Supprimer tous les query strings du href
    link.href = link.href.split('?')[0];
});


// INSERT PAGE
if (window.location.href.includes("https://app.trygr.io/admin/ssp/insert")) {
    const formats = {
        "sb": "SponsoredBrand",
        "sb": "SponsoredBanner",
        "sv": "SponsoredVideo",
        "sp": "SponsoredProducts",
    }

    function getSite() {
        // Sélectionne l'élément <select> par son ID
        const selectElement = document.getElementById('id_site');

        // Fonction pour obtenir la valeur sélectionnée sans la partie indésirable
        function getSelectedValue() {
            const selectedText = selectElement.selectedOptions[0].text;
            // Utilisation d'une expression régulière pour retirer la chaîne
            return selectedText.replace(/ \[\w{2}\]$/, '').trim(); // retire le texte dans les crochets
        }

        // Log la valeur sélectionnée dès le chargement de la page
        const text = getSelectedValue();
        console.log('Texte sélectionné :', text);

        // Ajoute un écouteur d'événements pour détecter les changements de sélection
        selectElement.addEventListener('change', () => {
            const newText = getSelectedValue();
            console.log('Texte sélectionné :', newText);
        });

        return text; // Retourne la valeur sélectionnée
    }

    function getFormat() {
        // Sélectionne l'élément <input> qui est coché dans la div d'id_format
        const inputElement = document.querySelector('#id_format input:checked');
        let initials = ''; // Déclare la variable initials

        if (inputElement) {
            // Extrait le texte qui se trouve juste après l'élément <input>
            const associatedText = inputElement.nextSibling.nodeValue.trim();

            // Vérifie si le texte est présent
            if (associatedText) {
                // Sépare le texte en mots en utilisant '_' comme séparateur
                const words = associatedText.split('_');

                // Prend la première lettre de chaque mot
                initials = words.map(word => word.charAt(0)).join('');

                // Log les initiales dans la console
                console.log('Initiales :', initials); // Devrait afficher 'sv' pour "sponsored_video"
            } else {
                console.log('Aucun texte associé trouvé.');
            }
        } else {
            console.log('Aucun input coché trouvé.');
        }

        return initials; // Retourne les initiales
    }

    function filterOptions(id, site, format) {
        const selectElement = document.getElementById(id);
        const options = Array.from(selectElement.options);
        const filteredOptions = options.filter(option => {
            const text = option.text.toLowerCase().split(' '); // Séparer le texte en mots
            const hasSite = text.includes(site.toLowerCase()); // Vérifie si 'texte1' est présent
            const hasFormat = text.includes(format.toLowerCase()) || text.includes(formats[format].toLowerCase()); // Vérifie si 'texte2' est présent
            const hasDefault = text.includes('default'); // Vérifie si 'default' est présent
            //console.log(text + " => hasSite : " + hasSite + ", hasFormat : " + hasFormat + ", hasDefault : " + hasDefault);

            // Vérifie les conditions pour garder l'option
            return (hasSite && hasFormat) || (hasDefault && hasFormat);
        });

        // Vider le select
        selectElement.innerHTML = '';

        // Réinjecter les options filtrées
        filteredOptions.forEach(option => {
            selectElement.add(option);
        });
    }

    const site = getSite();
    const format = getFormat()

    for (var id of ["id_template", "id_product_block"]) {
       // filterOptions(id, site, format)
    }
}