// ==UserScript==
// @name         IAFD Scene Pairings Search Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a filter for the paring pages
// @icon https://external-content.duckduckgo.com/ip3/www.iafd.com.ico
// @author       Janvier57
// @match        https://www.iafd.com/person.rme/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506833/IAFD%20Scene%20Pairings%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/506833/IAFD%20Scene%20Pairings%20Search%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Fonction pour créer le filtre de recherche
    function createSearchFilter() {
        // Sélectionner l'iframe #scpr
        var iframe = document.getElementById('scpr');

        // Attendez que l'iframe soit chargé
        iframe.addEventListener('load', function() {
            // Accéder au contenu de l'iframe
            var iframeContent = iframe.contentDocument;

            // Intégrer Font Awesome
            var link = iframeContent.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
            iframeContent.head.appendChild(link);

            // Sélectionner l'élément .container à l'intérieur de l'iframe
            var container = iframeContent.querySelector('.container');

            // Créer le conteneur pour le filtre total
            var filterTotalContainer = iframeContent.createElement('div');
            filterTotalContainer.classList.add('filter-total');

            // Créer l'élément de recherche pour le filtre total
            var searchInputTotal = iframeContent.createElement('input');
            searchInputTotal.type = 'search';
            searchInputTotal.placeholder = 'Rechercher...';
            searchInputTotal.classList.add('search-filter');

            // Créer le label pour l'élément de recherche pour le filtre total
            var searchLabelTotal = iframeContent.createElement('label');
            searchLabelTotal.textContent = 'Filter Total ';
            searchLabelTotal.innerHTML += '<i class="fas fa-search"></i>';
            searchLabelTotal.appendChild(searchInputTotal);

            // Créer le bouton "X" pour effacer le filtre total
            var clearButtonTotal = iframeContent.createElement('button');
            clearButtonTotal.textContent = 'X';
            clearButtonTotal.classList.add('clear-button');

            // Ajouter l'élément de recherche et le bouton "X" dans le conteneur
            filterTotalContainer.appendChild(searchLabelTotal);
            filterTotalContainer.appendChild(clearButtonTotal);

            // Ajouter le conteneur au début du conteneur principal
            container.insertBefore(filterTotalContainer, container.firstChild);

            // Fonction pour filtrer les résultats pour le filtre total
            searchInputTotal.addEventListener('input', function() {
                var searchTerm = this.value.toLowerCase();
                var rows = container.querySelectorAll('.row');

                rows.forEach(function(row) {
                    var matchupaka = row.querySelector('.matchupaka');
                    var matchuph3 = row.querySelector('.matchuph3');
                    var matchupText = (matchupaka ? matchupaka.textContent : '') + (matchuph3 ? matchuph3.textContent : '');
                    matchupText = matchupText.toLowerCase();

                    if (matchupText.includes(searchTerm)) {
                        row.style.display = 'block';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });

            // Fonction pour effacer le filtre total
            clearButtonTotal.addEventListener('click', function() {
                searchInputTotal.value = '';
                var rows = container.querySelectorAll('.row');
                rows.forEach(function(row) {
                    row.style.display = 'block';
                });

                // Réinitialiser les valeurs des autres éléments de recherche
                var searchInputs = container.querySelectorAll('.search-filter');
                searchInputs.forEach(function(searchInput) {
                    searchInput.value = '';
                });

                // Réafficher les éléments .row correspondants
                var h2s = container.querySelectorAll('h2');
                h2s.forEach(function(h2) {
                    var nextH2 = h2.nextElementSibling;
                    while (nextH2 && nextH2.tagName !== 'H2') {
                        if (nextH2.classList.contains('row')) {
                            nextH2.style.display = 'block';
                        }
                        nextH2 = nextH2.nextElementSibling;
                    }
                });
            });

            // Sélectionner les h2
            var h2s = container.querySelectorAll('h2');

            // Créer un élément de recherche pour chaque h2
            h2s.forEach(function(h2) {
                var filterContainer = iframeContent.createElement('div');
                filterContainer.classList.add('filter-particular');

                var searchInput = iframeContent.createElement('input');
                searchInput.type = 'search';
                searchInput.placeholder = 'Rechercher...';
                searchInput.classList.add('search-filter');

                // Créer le label pour l'élément de recherche
                var searchLabel = iframeContent.createElement('label');
                searchLabel.innerHTML = '<i class="fas fa-search"></i> ' + h2.textContent + ' ';
                searchLabel.appendChild(searchInput);

                // Créer le bouton "X" pour effacer le filtre
                var clearButton = iframeContent.createElement('button');
                clearButton.textContent = 'X';
                clearButton.classList.add('clear-button');

                // Ajouter l'élément de recherche et le bouton "X" dans le conteneur
                filterContainer.appendChild(searchLabel);
                filterContainer.appendChild(clearButton);

                // Ajouter le conteneur après le h2
                h2.parentNode.insertBefore(filterContainer, h2.nextSibling);

                // Fonction pour filtrer les résultats
                searchInput.addEventListener('input', function() {
                    var searchTerm = this.value.toLowerCase();
                    var nextH2 = h2.nextElementSibling;
                    while (nextH2 && nextH2.tagName !== 'H2') {
                        if (nextH2.classList.contains('row')) {
                            var matchupaka = nextH2.querySelector('.matchupaka');
                            var matchuph3 = nextH2.querySelector('.matchuph3');
                            var matchupText = (matchupaka ? matchupaka.textContent : '') + (matchuph3 ? matchuph3.textContent : '');
                            matchupText = matchupText.toLowerCase();

                            if (matchupText.includes(searchTerm)) {
                                nextH2.style.display = 'block';
                            } else {
                                nextH2.style.display = 'none';
                            }
                        }
                        nextH2 = nextH2.nextElementSibling;
                    }
                });

                // Fonction pour effacer le filtre
                clearButton.addEventListener('click', function() {
                    searchInput.value = '';
                    var nextH2 = h2.nextElementSibling;
                    while (nextH2 && nextH2.tagName !== 'H2') {
                        if (nextH2.classList.contains('row')) {
                            nextH2.style.display = 'block';
                        }
                        nextH2 = nextH2.nextElementSibling;
                    }

                    // Réinitialiser la valeur de l'élément de recherche total
                    searchInputTotal.value = '';

                    // Réafficher tous les éléments .row
                    var rows = container.querySelectorAll('.row');
                    rows.forEach(function(row) {
                        row.style.display = 'block';
                    });
                });
            });
        });
    }

    // Appeler la fonction pour créer le filtre de recherche
    createSearchFilter();
})();
