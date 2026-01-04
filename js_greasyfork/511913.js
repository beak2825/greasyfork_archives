// ==UserScript==
// @name         Sxyprn enhance
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add menu to hide posts with any #tag.
// @author       @TomaszFromasz
// @match        https://sxyprn.com/*
// @icon
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511913/Sxyprn%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/511913/Sxyprn%20enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mapa do przechowywania tagów i powiązanych z nimi postów
    var tagMap = {};

    // Zbiór wszystkich unikalnych tagów
    var allTags = new Set();

    var posts = document.querySelectorAll('.post_el_small');
    posts.forEach(function(post) {
        var textContent = post.querySelector('.post_text').textContent;

        // Wyodrębnij tagi za pomocą wyrażenia regularnego
        var tags = textContent.match(/#[^\s#]+/g);

        if(tags) {
            tags.forEach(function(tag) {
                // Usuń '#' z tagu i zamień na małe litery
                var tagName = tag.substring(1).toLowerCase();

                // Dodaj do zbioru wszystkich tagów
                allTags.add(tagName);

                // Inicjalizuj tablicę dla tego tagu, jeśli nie istnieje
                if(!tagMap[tagName]) {
                    tagMap[tagName] = [];
                }

                // Dodaj ten post do listy postów z tym tagiem
                tagMap[tagName].push(post);
            });
        }
    });

    // Posortuj tagi alfabetycznie
    var sortedTags = Array.from(allTags).sort();

    // Utwórz menu z checkboxami i wyszukiwarką
    var menu = document.createElement('div');
    menu.id = 'tag-menu';
    menu.style.position = 'fixed';
    menu.style.top = '70px';
    menu.style.right = '20px';
    menu.style.backgroundColor = '#1e1e1e'; // Ciemne tło
    menu.style.color = '#ffffff'; // Biały tekst
    menu.style.padding = '15px';
    menu.style.border = '1px solid #333';
    menu.style.maxHeight = '80vh';
    menu.style.overflowY = 'auto';
    menu.style.overflowX = 'hidden'; // Ukryj poziomy scrollbar
    menu.style.zIndex = '9999';
    menu.style.fontFamily = 'Arial, sans-serif';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
    menu.style.display = 'none'; // Menu ukryte domyślnie
    menu.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Dodaj przejście
    menu.style.opacity = '0'; // Ukryj menu przezroczystością
    menu.style.transform = 'translateY(-20px)'; // Dodaj przesunięcie
    menu.style.width = '220px'; // Zmniejsz szerokość menu

    var heading = document.createElement('h3');
    heading.textContent = 'Tagi ukryte';
    heading.style.color = '#ffcc00'; // Żółty kolor nagłówka
    heading.style.marginTop = '0';
    heading.style.textAlign = 'center';
    heading.style.fontSize = '20px';
    heading.style.fontWeight = 'bold';
    menu.appendChild(heading);

    // Dodaj pole wyszukiwania tagów
    var searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Szukaj tagów...';
    searchInput.style.marginBottom = '10px';
    searchInput.style.width = '100%';
    searchInput.style.padding = '8px';
    searchInput.style.backgroundColor = '#333';
    searchInput.style.color = '#fff';
    searchInput.style.border = '1px solid #555';
    searchInput.style.borderRadius = '4px';
    searchInput.style.boxSizing = 'border-box';
    menu.appendChild(searchInput);

    // Dodaj pole do wpisywania słów, które mają być wykluczone
    var excludeInput = document.createElement('input');
    excludeInput.type = 'text';
    excludeInput.placeholder = 'Wyklucz posty zawierające... (Enter aby dodać)';
    excludeInput.style.marginBottom = '10px';
    excludeInput.style.width = '100%';
    excludeInput.style.padding = '8px';
    excludeInput.style.backgroundColor = '#333';
    excludeInput.style.color = '#fff';
    excludeInput.style.border = '1px solid #555';
    excludeInput.style.borderRadius = '4px';
    excludeInput.style.boxSizing = 'border-box';
    menu.appendChild(excludeInput);

    // Kontener na wykluczone słowa
    var excludeWordsContainer = document.createElement('div');
    excludeWordsContainer.style.marginBottom = '15px';
    menu.appendChild(excludeWordsContainer);

    // Lista wykluczonych słów z pamięci (localStorage)
    var excludeList = [];
    if(localStorage.getItem('excludeList')) {
        excludeList = JSON.parse(localStorage.getItem('excludeList'));
    }

    // Funkcja aktualizująca wyświetlanie wykluczonych słów
    function updateExcludeWords() {
        excludeWordsContainer.innerHTML = '';
        excludeList.forEach(function(word, index) {
            var wordSpan = document.createElement('span');
            wordSpan.textContent = word;
            wordSpan.style.backgroundColor = '#444';
            wordSpan.style.color = '#fff';
            wordSpan.style.padding = '5px 8px';
            wordSpan.style.marginRight = '5px';
            wordSpan.style.marginBottom = '5px';
            wordSpan.style.display = 'inline-block';
            wordSpan.style.borderRadius = '4px';
            wordSpan.style.position = 'relative';
            wordSpan.style.transition = 'background-color 0.3s';

            wordSpan.addEventListener('mouseenter', function() {
                wordSpan.style.backgroundColor = '#555';
            });

            wordSpan.addEventListener('mouseleave', function() {
                wordSpan.style.backgroundColor = '#444';
            });

            // Dodaj przycisk usuwania
            var removeBtn = document.createElement('span');
            removeBtn.textContent = '×';
            removeBtn.style.position = 'absolute';
            removeBtn.style.top = '2px';
            removeBtn.style.right = '5px';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.color = '#ff4444';
            removeBtn.addEventListener('click', function() {
                excludeList.splice(index, 1);
                localStorage.setItem('excludeList', JSON.stringify(excludeList));
                updateExcludeWords();
                filterPosts();
            });

            wordSpan.appendChild(removeBtn);
            excludeWordsContainer.appendChild(wordSpan);
        });
    }

    updateExcludeWords();

    // Funkcja filtrująca posty na podstawie wykluczonych słów i tagów
    function filterPosts() {
        posts.forEach(function(post) {
            var postText = post.querySelector('.post_text').textContent.toLowerCase();
            var shouldHide = excludeList.some(function(excludeWord) {
                return postText.includes(excludeWord);
            });

            // Sprawdź stan checkboxów tagów
            var postTags = postText.match(/#[^\s#]+/g);
            var hideByTag = false;
            if(postTags) {
                postTags.forEach(function(tag) {
                    var tagName = tag.substring(1).toLowerCase();
                    var checkbox = menu.querySelector('input[type="checkbox"][data-tag-name="' + tagName + '"]');
                    if(checkbox && checkbox.checked) {
                        hideByTag = true;
                    }
                });
            }

            if (shouldHide || hideByTag) {
                post.style.display = 'none';
            } else {
                post.style.display = '';
            }
        });
    }

    // Event listener dla pola wykluczającego słowa
    excludeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            var newWord = this.value.trim().toLowerCase();
            if (!excludeList.includes(newWord)) {
                excludeList.push(newWord);
                localStorage.setItem('excludeList', JSON.stringify(excludeList));
                updateExcludeWords();
                filterPosts();
            }
            this.value = '';
            e.preventDefault();
        }
    });

    // Inicjalne filtrowanie postów na podstawie zapisanych słów
    filterPosts();

    // Kontenery na tagi
    var matchingTagsContainer = document.createElement('div');
    var separator = document.createElement('hr');
    separator.style.border = '1px solid #444';
    separator.style.margin = '10px 0';

    var tagsContainer = document.createElement('div');

    menu.appendChild(matchingTagsContainer);
    menu.appendChild(separator);
    menu.appendChild(tagsContainer);

    // Dla każdego tagu utwórz checkbox
    var tagItems = [];

    // Lista przechowująca stan checkboxów
    var checkboxStates = {};
    if(localStorage.getItem('checkboxStates')) {
        checkboxStates = JSON.parse(localStorage.getItem('checkboxStates'));
    }

    function createTagItem(tagName) {
        var label = document.createElement('label');
        label.className = 'tag-item';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        label.style.cursor = 'pointer';
        label.style.transition = 'color 0.3s';

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = checkboxStates[tagName] || false; // Domyślnie odznaczone lub według stanu z localStorage
        checkbox.dataset.tagName = tagName;
        checkbox.style.marginRight = '5px';

        // Event listener dla checkboxa
        checkbox.addEventListener('change', function() {
            checkboxStates[tagName] = this.checked;
            localStorage.setItem('checkboxStates', JSON.stringify(checkboxStates));
            filterPosts();
        });

        label.appendChild(checkbox);

        var tagLabel = document.createElement('span');
        tagLabel.textContent = tagName;
        label.appendChild(tagLabel);

        // Efekt hover dla label
        label.addEventListener('mouseenter', function() {
            label.style.color = '#ffcc00';
        });

        label.addEventListener('mouseleave', function() {
            label.style.color = '#ffffff';
        });

        tagItems.push(label);
    }

    sortedTags.forEach(function(tagName) {
        createTagItem(tagName);
    });

    // Event listener dla wyszukiwarki tagów
    searchInput.addEventListener('input', function() {
        var filterText = this.value.toLowerCase();

        matchingTagsContainer.innerHTML = '';
        tagsContainer.innerHTML = '';

        var matchingTags = [];
        var nonMatchingTags = [];

        tagItems.forEach(function(item) {
            var tagName = item.querySelector('span').textContent.toLowerCase();
            if (tagName.includes(filterText)) {
                matchingTags.push(item);
                item.style.opacity = '1';
            } else {
                nonMatchingTags.push(item);
                item.style.opacity = '0.3';
            }
        });

        // Dodaj dopasowane tagi na górę
        matchingTags.forEach(function(item) {
            matchingTagsContainer.appendChild(item);
        });

        // Dodaj separator jeśli są dopasowane i niedopasowane tagi
        if (matchingTags.length > 0 && nonMatchingTags.length > 0) {
            separator.style.display = 'block';
        } else {
            separator.style.display = 'none';
        }

        // Dodaj niedopasowane tagi poniżej
        nonMatchingTags.forEach(function(item) {
            tagsContainer.appendChild(item);
        });
    });

    // Wywołaj zdarzenie input, aby zainicjować wyświetlanie tagów
    searchInput.dispatchEvent(new Event('input'));

    // Dodaj przycisk do otwierania/zamykania menu
    var toggleButton = document.createElement('div');
    toggleButton.id = 'toggle-button';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.width = '50px';
    toggleButton.style.height = '50px';
    toggleButton.style.backgroundColor = '#ffcc00'; // Żółty kolor przycisku
    toggleButton.style.borderRadius = '50%';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.display = 'flex';
    toggleButton.style.alignItems = 'center';
    toggleButton.style.justifyContent = 'center';
    toggleButton.style.boxShadow = '0 0 20px rgba(0,0,0,0.7)';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.transition = 'transform 0.3s';

    // Efekt hover dla przycisku
    toggleButton.addEventListener('mouseenter', function() {
        toggleButton.style.transform = 'scale(1.1)';
    });

    toggleButton.addEventListener('mouseleave', function() {
        toggleButton.style.transform = 'scale(1)';
    });

    // Dodaj symbol '#' do przycisku
    var buttonIcon = document.createElement('span');
    buttonIcon.textContent = '#';
    buttonIcon.style.color = '#1e1e1e';
    buttonIcon.style.fontSize = '24px';
    buttonIcon.style.fontWeight = 'bold';
    toggleButton.appendChild(buttonIcon);

    // Event listener dla przycisku
    toggleButton.addEventListener('click', function() {
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
            setTimeout(function() {
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            }, 10); // Delay to allow display change to take effect
        } else {
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(-20px)';
            setTimeout(function() {
                menu.style.display = 'none';
            }, 500); // Czas trwania przejścia
        }
    });

    document.body.appendChild(toggleButton);
    document.body.appendChild(menu);

    // Po załadowaniu strony filtruj posty na podstawie zapisanych stanów checkboxów
    filterPosts();

})();
