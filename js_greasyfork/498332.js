// ==UserScript==
// @name        Kraland Organisations
// @description Afficher les forums d'organisation sur la page d'accueil du forum
// @include     http://www.kraland.org/*
// @require     http://code.jquery.com/jquery-2.0.3.min.js
// @version     2024-06-24
// @namespace   https://greasyfork.org/users/1320445
// @downloadURL https://update.greasyfork.org/scripts/498332/Kraland%20Organisations.user.js
// @updateURL https://update.greasyfork.org/scripts/498332/Kraland%20Organisations.meta.js
// ==/UserScript==

function inpage(code) {
    var href = new String(location);
    if ('http://www.kraland.org/main.php' == href) {
        href = new String(document.referrer);
    }
    return href.match(new RegExp(code));
} // inpage()

function ingame(code) {
    if (!$('li.on a').length)
        return false;

    var page = $('li.on a').attr('href');
    page = page.substring(page.indexOf('=') + 1);
    if ('all' === code)
        return '2_2' === page || '2_1' === page || '2_3' === page
            || '2_4' === page || '2_5' === page;
    else
        return page === code;
} // ingame()

if (ingame('2_2')) {}if (ingame('all')) {}if (inpage('map.php.p=1_[^_]+_')) {}if (inpage('main.php.p=4_4')) {}if (inpage('main.php.p=5')) {

    function fetchForumRows(callback) {
        $.ajax({
            url: 'http://www.kraland.org/main.php?p=5_1_11',
            mimeType: 'text/html; charset=ISO-8859-1',
            success: function(data) {
                // Create a temporary DOM element to parse the fetched data
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const tables = doc.querySelectorAll('table.forum');
                const summaryRows = [];

                // Retrieve or initialize headerText array from local storage
                let headerTexts = JSON.parse(localStorage.getItem('headerTexts')) || [];

                tables.forEach((table, tableIndex) => {
                    const headerText = table.querySelector('th[colspan="2"]').innerText.split(' - ')[0];

                    // Add headerText to the array if not already present
                    if (!headerTexts.includes(headerText)) {
                        headerTexts.push(headerText);
                    }

                    const rows = table.querySelectorAll('tbody tr');
                    const rowCount = rows.length - 1; // Subtract header row
                    let msgSum = 0;
                    rows.forEach((row, index) => {
                        if (index > 0) {
                            msgSum += parseInt(row.querySelector('td:nth-child(3)').innerText || '0', 10);
                        }
                    });
                    let firstRowLastMsg = rows[1] ? rows[1].querySelector('td:last-child').innerHTML : '';

                    // Update URLs in firstRowLastMsg
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = firstRowLastMsg;
                    insert_query_string(tempDiv, `&id=${tableIndex}`);
                    firstRowLastMsg = tempDiv.innerHTML;

                    const rowClass = tableIndex % 2 === 0 ? 'forum-c1' : 'forum-c2'; // Alternating class
                    const summaryRow = `
                        <tr class="${rowClass}">
                            <td style="height:40px"><p><a href="main.php?p=5_1_11&id=${tableIndex}">${headerText}</a></p></td>
                            <td class="c">${rowCount}</td>
                            <td class="c">${msgSum}</td>
                            <td class="c">${firstRowLastMsg}</td>
                        </tr>
                    `;
                    summaryRows.push(summaryRow);
                });

                // Store the updated headerTexts array in local storage
                localStorage.setItem('KI_orgas', JSON.stringify(headerTexts));

                // Call the callback function with forumRows
                callback(summaryRows);
            }
        });
    }

    function insert_query_string(div,query_string) {
        div.querySelectorAll('a').forEach((link) => {
                        let href = link.href;
                        let hashIndex = href.indexOf('#');

                        if (href.indexOf('kraland.org') !== -1) {
                            if (hashIndex !== -1) {
                                // Insert the id before the #
                                link.href = href.slice(0, hashIndex) + query_string + href.slice(hashIndex);
                            } else {
                                // Append the id at the end
                                link.href = href + query_string;
                            }
                        }
                    });
    }

    function detectElement() {
        // Select all <tr> elements with class "forum-c3"
        const elements = document.querySelectorAll('tr.forum-c3');

        // Iterate through the elements to find the one containing <th> with the text "Jeu (HRP)"
        for (let element of elements) {
            const th = element.querySelector('th[colspan="4"]');
            if (th && th.textContent.trim() === "Jeu (HRP)") {
                // If found, return the element
                return element;
            }
        }

        // If no element found, return null
        return null;
    }

    function filterSelectOptionsByText(selectName, text) {
        // Obtenir l'élément <select> par son nom
        const selectElement = document.querySelector(`select[name="${selectName}"]`);

        if (selectElement) {
            // Parcourir les options de la fin vers le début
            for (let i = selectElement.options.length - 1; i >= 0; i--) {
                // Supprimer les options dont le texte n'est pas égal au texte spécifié
                if (selectElement.options[i].text !== text) {
                    selectElement.remove(i);
                }
            }
        } else {
            console.error(`Aucun élément <select> trouvé avec le nom ${selectName}`);
        }
    }

    // Obtenir la liste des organisations à partir du local storage
    let orgs = JSON.parse(localStorage.getItem('KI_orgas')) || [];

    // Sélectionner l'élément avec la classe submenu
    let submenu = document.querySelector('.submenu');

    if (submenu) {
        // Trouver le <li> avec le texte 'Organisations'
        let orgLi = Array.from(submenu.querySelectorAll('li')).find(li => li.textContent.trim() === 'Organisations');
        let hrp = Array.from(document.querySelectorAll('p')).find(function(element) {
            return element.innerHTML === '<strong>Provinces</strong>';
        });

        if (orgLi && hrp) {
            // Créer une nouvelle liste d'éléments
            let newLiContent = '';
            orgs.forEach((org, index) => {
                newLiContent += `<li><a href="http://www.kraland.org/main.php?p=5_1_11&id=${index}">${org}</a></li>`;
            });

            // Créer un élément <p> pour 'Organisations'
            let para = document.createElement('p');
            para.innerHTML = '<strong>Organisations</strong>';
            hrp.parentNode.insertBefore(para, hrp);

            // Créer un élément <ul> pour contenir les nouveaux <li>
            let tempUl = document.createElement('ul');
            tempUl.innerHTML = newLiContent;
            hrp.parentNode.insertBefore(tempUl, hrp);

            // Supprimer le <li> avec le texte 'Organisations'
            orgLi.remove();
        }
    }

    // Example usage
    fetchForumRows(function(forumRows) {
        const foundElement = detectElement();
        if (foundElement) {
            const header = document.createElement('tr');
            header.className = 'forum-c3';
            header.innerHTML = '<th colspan="4">Organisations (RP)</th>';

            foundElement.parentNode.insertBefore(header, foundElement);

            // Insert rows before the found element
            forumRows.forEach((rowHtml, index) => {
                // Create a new element for each row
                const rowElement = document.createElement('tr');
                rowElement.innerHTML = rowHtml;
                rowElement.className = index % 2 === 0 ? 'forum-c1' : 'forum-c2'; // Alternating class

                // Insert the element before the target element
                foundElement.parentNode.insertBefore(rowElement, foundElement);
            });
        } else {
            console.log("Élément non trouvé");
        }
    });

    document.querySelectorAll('.forum-c2').forEach(function(element) {
        if (element.textContent.includes('Organisations')) {
            element.remove();
        }
    });


    // Obtenir la chaîne de requête de l'URL actuelle
    const queryString = window.location.search;

    // Analyser la chaîne de requête
    const urlParams = new URLSearchParams(queryString);

    // Vérifier l'existence du paramètre 'id'
    if (urlParams.has('id')) {
        // Obtenir la valeur du paramètre 'id'
        const id = urlParams.get('id');
        const kiOrganisations = localStorage.getItem('KI_orgas');
        const kiOrganisationArray = JSON.parse(kiOrganisations);
        const currentOrganisation = kiOrganisationArray[id];

        const centralTextElement = document.getElementById('central-text');
        insert_query_string(centralTextElement, `&id=${id}`);

        if (inpage('main.php.p=5_1_11') && !inpage('main.php.p=5_1_11.p0=3') &&!inpage('main.php.p=5_1_11_')) {
            const tables = document.querySelectorAll('table.forum');
            tables.forEach(table => {
                const ths = table.querySelectorAll('th');
                let containsGIGAS = false;
                ths.forEach(th => {
                    if (th.textContent.includes(currentOrganisation)) {
                        containsGIGAS = true;
                    }
                });
                if (!containsGIGAS) {
                   table.remove();
                }
            });
        }

        if (inpage('main.php.p=5_1_11.p0=3')) {
            filterSelectOptionsByText('p18', currentOrganisation);
        }
        console.log(currentOrganisation); // Affiche la valeur du paramètre id
    }
}
