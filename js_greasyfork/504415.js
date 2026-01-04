// ==UserScript==
// @name         KI - Rapport privé
// @namespace    http://tampermonkey.net/
// @version      2024-08-20
// @description  retravailler le rapport privé pour permettre un meilleur suivi
// @author       Marshkalk
// @include      http://www.kraland.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kraland.org
// @downloadURL https://update.greasyfork.org/scripts/504415/KI%20-%20Rapport%20priv%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/504415/KI%20-%20Rapport%20priv%C3%A9.meta.js
// ==/UserScript==

const targetUrl = "http://www.kraland.org/report.php?p=0&p2=2"; // URL cible

// Vérifier si l'URL actuelle correspond à http://www.kraland.org/report.php
if (!window.location.href.startsWith("http://www.kraland.org/report.php")) {
    // Définir la fonction OpenReport_new
    function OpenReport_new() {
        window.open('report.php?p=0&p2=2', 'private_report', 'width=600,height=600,toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,copyhistory=yes,resizable=yes');
    }

    // Modifier le lien immédiatement
    (function() {
        // Sélectionner l'élément avec la classe et le titre spécifiés
        var link = document.querySelector('.right-boxprofile-button[title="rapport privé"]');

        // Vérification de la sélection du lien
        if (!link) {
            console.error('Le lien avec la classe .right-boxprofile-button et le titre "rapport privé" n\'a pas été trouvé.');
            return; // Arrêter si le lien n'est pas trouvé
        }

        // Change l'URL
        link.href = targetUrl;
        // Modifier la propriété onclick directement
        link.onclick = function() {
            OpenReport_new();
            return false; // Empêche l'action par défaut du lien
        };

        // Vérification après modification
        console.log('Le lien a été modifié avec succès.');
    })();

} else {
    // Injecter le style CSS pour .sl li
    const style = document.createElement('style');
    style.textContent = `
        .sl li {
            display: inline-block;
            margin-bottom: 5px;
        }
    `;
    document.head.appendChild(style);

    // Fonction pour créer une div avec une ul et ajouter des éléments li
    function createListContainerWithItems(dataObject, targetUrl) {
        // Vérifier si un élément avec l'ID 'pn' existe déjà
        if (document.getElementById('pn')) {
            console.log("La liste est déjà présente, aucune nouvelle insertion.");
            return; // Sortir de la fonction si la liste existe déjà
        }

        const formElement = document.querySelector('form.c');
        if (formElement) {
            const newDiv = document.createElement('div');
            newDiv.className = 'sl';
            newDiv.id = "pn";

            // Créer une ul dans la div sl
            const ulElement = document.createElement('ul');
            newDiv.appendChild(ulElement);

            // Ajouter des éléments li pour chaque clé dans l'objet dataObject
            Object.keys(dataObject)
                .sort() // Trier les clés par ordre alphabétique
                .forEach(key => {
                const liElement = document.createElement('li');
                const anchorElement = document.createElement('a');

                // Construire l'URL avec le paramètre name
                const url = `http://www.kraland.org/report.php?name=${encodeURIComponent(key)}`;
                anchorElement.href = url;
                anchorElement.textContent = key;

                liElement.appendChild(anchorElement);
                ulElement.appendChild(liElement);
            });

            // Insérer la nouvelle div avant le formulaire
            formElement.parentNode.insertBefore(newDiv, formElement);
            console.log("Div avec la classe 'sl' et ul avec des éléments li ajoutés avant le formulaire avec la classe 'c'.");
        } else {
            console.error("Formulaire avec la classe 'c' non trouvé.");
        }
    }

    // Fonction pour vérifier si une ligne existe déjà dans report
    function lineExistsInReport(lineHtml, report, name) {
        if (report && report[name]) {
            return report[name].some(existingLineHtml => existingLineHtml === lineHtml);
        }
        return false;
    }

    // Create a URLSearchParams object to work with the query string
    const params = new URLSearchParams(window.location.search);

     if (window.location.pathname === "/report.php" && params.get('p') === '0' && params.get('p2') === '2') {
        const report = JSON.parse(localStorage.getItem('report'));
        // Sélectionner la table avec la classe "forum"
        const table = document.querySelector("table.forum");

        if (table) {
            console.log("Table found:", table);

            const rows = Array.from(table.querySelectorAll("tr"));
            const reversedRows = rows.reverse();

            const result = {};

            const name_regex = "[\\wÀ-ÖØ-öø-ÿ\\.\\-]+(?:\\s[\\wÀ-ÖØ-öø-ÿ\\.\\-]+)*";
            const regex = new RegExp(
                `(?:(${name_regex})\\s+s'est courbée pour vous saluer et vous a dit\\s*:)|` +
                `(?:Vous venez de dire à (${name_regex})\\s*:)|` +
                `(?:(${name_regex})\\s+vous a dit\\s*:)|` +
                `(?:Vous venez de téléphoner à (${name_regex})\\s*:)|` +
                `(?:(${name_regex})\\s+vous a téléphoné\\s*:)`
            );

            reversedRows.forEach((row, index) => {
                const rowText = row.textContent.trim();
                const html = row.outerHTML;

                const match = rowText.match(regex);

                if (match) {
                    const name = match.slice(1).find(m => m !== undefined); // Trouver la première correspondance non nulle

                    if (name && name !== "votre groupe") {
                        if (!result[name]) {
                            result[name] = [];
                        }

                        result[name].push(html);
                    }
                }
            });

            console.log(result);

            // Stocker result dans le localStorage sous la clé "report"
            localStorage.setItem('report', JSON.stringify(result));

            // Créer et insérer la div avec les éléments li
            createListContainerWithItems(result, targetUrl);
        } else {
            console.error("Table with class 'forum' not found!");
        }
    }

    // Récupérer la valeur de 'report' depuis le localStorage
    var report = JSON.parse(localStorage.getItem('report'));

    // Check if the 'name' parameter is present in the URL
    if (window.location.pathname === "/report.php" && params.has('name')) {
        const name = params.get('name');

        console.log(`Mode affichage pour: ${name}`);

        // Sélectionner la table avec la classe "forum"
        const table = document.querySelector("table.forum");

        if (table) {
            console.log("Table found:", table);

            // Supprimer toutes les lignes existantes dans la table
            table.querySelectorAll("tr").forEach(row => row.remove());

            // Créer et insérer la div avec les éléments li
            createListContainerWithItems(report, targetUrl);

            if (report && report[name]) {
                report[name].forEach((rowHtml, index) => {
                    // Créer un nouvel élément tr à partir de rowHtml
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = rowHtml;

                    // Ajouter la classe forum-c1 ou forum-c2 en alternance
                    const rowClass = (index % 2 === 0) ? 'forum-c1' : 'forum-c2';
                    newRow.classList.add(rowClass);

                    // Ajouter la nouvelle ligne à la table
                    table.appendChild(newRow);
                });

                console.log(`Added ${report[name].length} rows to the table for ${name}.`);
            } else {
                console.log(`No data found in report for ${name}.`);
            }
        } else {
            console.error("Table with class 'forum' not found!");
        }
    }
}