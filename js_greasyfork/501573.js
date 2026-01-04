// ==UserScript==
// @name         Trackers Ticket List
// @namespace    http://tampermonkey.net/
// @require      http://code.jquery.com/jquery-2.0.3.min.js
// @version      2024-07-23
// @description  Toolkit for trackers
// @match        *://trackers.pilotsystems.net/*
// @author       Marshkalk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501573/Trackers%20Ticket%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/501573/Trackers%20Ticket%20List.meta.js
// ==/UserScript==

(function() {
    var urlParams = new URLSearchParams(window.location.search);
    var name = urlParams.get('name');

    // Déclarez une variable globale pour stocker les lignes de tableau
    window.allRowsContent = [];
    window.filteredRowsContent = [];

    if (name) {
        var urls = [
            {url:'https://trackers.pilotsystems.net/rmf-monet/@@search/show-all?q=' + name + '&search_all%3Aint=1&limit_open%3Aint%3Adefault=0&limit_open%3Aint=1&filter_in_search=1', tracker:'RMF-Monet'},
            {url:'https://trackers.pilotsystems.net/unify-run/@@search/show-all?q=' + name + '&search_all%3Aint=1&limit_open%3Aint%3Adefault=0&limit_open%3Aint=1&filter_in_search=1', tracker:'Unify-Run'},
            {url:'https://trackers.pilotsystems.net/rmf-migrations/@@search/show-all?q=' + name + '&search_all%3Aint=1&limit_open%3Aint%3Adefault=0&limit_open%3Aint=1&filter_in_search=1', tracker:'RMF-Migration'}
        ];
        console.log(urls);

        function clean() {
            var navbar = document.querySelector('.navbar');

            if (navbar) {
                var newBody = document.createElement('body');
                var clonedNavbar = navbar.cloneNode(true);
                newBody.appendChild(clonedNavbar);
                document.documentElement.replaceChild(newBody, document.body);
            } else {
                console.log("Aucun élément avec la classe 'navbar' n'a été trouvé.");
            }
        }

        function findTable(context) {
            var tables = context.querySelectorAll('table.table.table-striped.table-bordered.table-condensed');
            var rowsContent = [];

            tables.forEach(function(table) {
                var tbody = table.querySelector('tbody');
                if (tbody) {
                    var rows = tbody.querySelectorAll('tr');
                    rows.forEach(function(row) {
                        var cells = row.querySelectorAll('td');
                        if (cells.length >= 6) {
                            var rowData = {
                                issue: cells[0].innerHTML.trim(),
                                modification: cells[1].innerHTML.trim(),
                                scrum: cells[2].innerHTML.trim(),
                                tags: cells[3].innerHTML.trim(),
                                from: cells[4].innerHTML.trim(),
                                date: cells[5].innerHTML.trim()
                            };
                            rowsContent.push(rowData);
                        }
                    });
                }
            });

            return rowsContent;
        }

        function fetchForumRows(urls, callback) {
            var requests = [];

            urls.forEach(function(urlObj) {
                var request = $.ajax({
                    url: urlObj.url,
                    mimeType: 'text/html; charset=UTF-8',
                    success: function(data) {
                        var tempDiv = document.createElement('div');
                        tempDiv.innerHTML = data;
                        var rowsContent = findTable(tempDiv);
                        window.allRowsContent = window.allRowsContent.concat(rowsContent);
                        window.filteredRowsContent = window.allRowsContent; // Initialiser le filtre avec toutes les lignes
                    }
                });

                requests.push(request);
            });

            $.when.apply($, requests).then(function() {
                console.log(window.allRowsContent); // Log the variable to console
                if (typeof callback === 'function') {
                    callback(window.allRowsContent);
                }
            });
        }

        function generateTable(rowsContent) {
            var container = document.querySelector('#table-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'table-container';

                var searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Search...';
                searchInput.classList.add('search-input');
                searchInput.addEventListener('input', function() {
                    filterTable(searchInput.value);
                });

                container.appendChild(searchInput);
                document.body.appendChild(container);
            }

            // Supprimer l'ancienne table si elle existe
            var oldTable = container.querySelector('table');
            if (oldTable) {
                oldTable.remove();
            }

            var tempTable = document.createElement('table');
            tempTable.style.margin = "20px";
            tempTable.style.width = "auto";
            tempTable.classList.add('table', 'table-striped', 'table-bordered', 'table-condensed');

            var thead = document.createElement('thead');
            thead.innerHTML = `
        <tr class="lhead">
            <th><span class="sortable" data-key="issue">Issue</span></th>
            <th><span class="sortable" data-key="modification">Modification date</span></th>
            <th><span class="sortable" data-key="scrum">Scrum</span></th>
            <th>Tags</th>
            <th><span class="sortable" data-key="from">From</span></th>
            <th>Due date</span></th>
        </tr>
    `;
            tempTable.appendChild(thead);

            var tbody = document.createElement('tbody');
            rowsContent.forEach(function(row) {
                var rowHtml = `
            <tr>
                <td>${row.issue}</td>
                <td>${row.modification}</td>
                <td>${row.scrum}</td>
                <td>${row.tags}</td>
                <td>${row.from}</td>
                <td>${row.date}</td>
            </tr>
        `;
                tbody.innerHTML += rowHtml;
            });

            tempTable.appendChild(tbody);
            container.appendChild(tempTable);

            // Ajoutez des gestionnaires d'événements aux en-têtes de table
            document.querySelectorAll('thead .sortable').forEach(function(element) {
                element.addEventListener('click', function(event) {
                    var key = event.target.getAttribute('data-key');
                    sortRows(key);
                });
            });
        }

        function sortRowsContent(key) {
            window.filteredRowsContent.sort((a, b) => {
                if (a[key] < b[key]) return -1;
                if (a[key] > b[key]) return 1;
                return 0;
            });
            console.log(`Sorted rows by ${key}:`, window.filteredRowsContent);
        }

        function sortRows(key) {
            sortRowsContent(key);
            // Regenerate table with sorted rows
            generateTable(window.filteredRowsContent);
        }

        function filterTable(query) {
            query = query.toLowerCase();
            window.filteredRowsContent = window.allRowsContent.filter(function(row) {
                return Object.values(row).some(function(value) {
                    return value.toLowerCase().includes(query);
                });
            });
            // Regenerate table with filtered rows
            generateTable(window.filteredRowsContent);
        }

        clean();

        // Fetch rows and then generate table
        fetchForumRows(urls, function(rowsContent) {
            generateTable(rowsContent);
        });

        // Ajouter des styles pour les éléments .sortable et .search-input
        var style = document.createElement('style');
        style.innerHTML = `
    .sortable {
        cursor: pointer;
        color: blue;
        text-decoration: underline;
    }
    .sortable:hover {
        color: darkblue;
    }
    .search-input {
        margin-bottom: 10px;
        padding: 5px;
        width: calc(100% - 10px);
        box-sizing: border-box;
    }
`;
        document.head.appendChild(style);
    }
})();
