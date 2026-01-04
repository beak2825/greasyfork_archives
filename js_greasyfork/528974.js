// ==UserScript==
// @name         Ebremena.cz - Custom dropdown s interním vyhledáváním a requestem
// @author       Teodor Tomáš
// @namespace    http://tampermonkey.net/
// @version      1.16
// @description  Načte nejprve možnosti z původního selectu, poté je nahradí vlastním dropdownem s interním vyhledáváním. Po výběru se aktualizuje skrytý select a vyvolá se change event pro odeslání requestu. Pokud custom dropdown zmizí, periodicky se znovu vytvoří (každých 500ms). Při inicializaci se zobrazí aktuálně vybraná hodnota a při hoveru se zvýrazní položka.
// @match        *://*.ebremena.cz/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528974/Ebremenacz%20-%20Custom%20dropdown%20s%20intern%C3%ADm%20vyhled%C3%A1v%C3%A1n%C3%ADm%20a%20requestem.user.js
// @updateURL https://update.greasyfork.org/scripts/528974/Ebremenacz%20-%20Custom%20dropdown%20s%20intern%C3%ADm%20vyhled%C3%A1v%C3%A1n%C3%ADm%20a%20requestem.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funkce, která vytvoří custom dropdown pro daný select
    function initCustomDropdownForSelect(originalSelect) {
        if (!originalSelect) return;
        // Pokud již byl custom dropdown vytvořen pro tento select, přeskočíme ho
        if (originalSelect.dataset.customDropdownCreated === "true") return;

        // Počkáme, dokud select nebude obsahovat možnosti
        if (originalSelect.options.length === 0) {
            setTimeout(function() {
                initCustomDropdownForSelect(originalSelect);
            }, 500);
            return;
        }

        // Označíme select, abychom jej již dále neprocesovali
        originalSelect.dataset.customDropdownCreated = "true";

        // Získáme pole možností původního selectu
        var optionsData = Array.from(originalSelect.options).map(function(option) {
            return { value: option.value, text: option.text };
        });

        // Najdeme defaultní volbu podle textu "nerozhoduje" (ignorujeme případné mezery a velikost písmen)
        var defaultOptionIndex = optionsData.findIndex(function(opt) {
            return opt.text.trim().toLowerCase() === "nerozhoduje";
        });
        var defaultOption;
        if (defaultOptionIndex !== -1) {
            defaultOption = optionsData[defaultOptionIndex];
            // Odebereme defaultOption z pole možností, aby se neduplikoval
            optionsData.splice(defaultOptionIndex, 1);
        } else {
            defaultOption = { value: "0", text: "nerozhoduje" };
        }
        
        // Seřadíme možnosti pomocí natural sort (číselné řazení)
        var collator = new Intl.Collator('cs', { numeric: true, sensitivity: 'base' });
        optionsData.sort(function(a, b) {
            return collator.compare(a.text, b.text);
        });

        // Zjistíme šířku selectu, pokud není dostatečná, použijeme 200px
        var selectWidth = originalSelect.offsetWidth;
        if (!selectWidth || selectWidth < 50) {
            selectWidth = 200;
        }

        // Vytvoříme kontejner s unikátním id (na základě id původního selectu)
        var container = document.createElement('div');
        container.id = 'customDropdownContainer_' + originalSelect.id;
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.style.width = selectWidth + 'px';
        originalSelect.parentNode.insertBefore(container, originalSelect);

        // Skryjeme původní select, jeho hodnotu však budeme nadále aktualizovat
        originalSelect.style.display = 'none';

        // Zjistíme aktuálně vybranou možnost
        var selectedValue = originalSelect.value || defaultOption.value;
        var selectedOption = optionsData.find(function(opt) {
            return opt.value === selectedValue;
        }) || defaultOption;

        // Vytvoříme "header", který zobrazuje vybranou volbu
        var header = document.createElement('div');
        header.textContent = selectedOption.text;
        header.style.padding = '5px';
        header.style.border = '1px solid #ccc';
        header.style.borderRadius = '4px';
        header.style.backgroundColor = '#fff';
        header.style.cursor = 'pointer';
        header.style.userSelect = 'none';
        container.appendChild(header);

        // Vytvoříme dropdown panel
        var dropdown = document.createElement('div');
        dropdown.style.position = 'absolute';
        dropdown.style.top = '100%';
        dropdown.style.left = '0';
        dropdown.style.width = '100%';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.borderRadius = '4px';
        dropdown.style.backgroundColor = '#fff';
        dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        dropdown.style.zIndex = '10000';
        dropdown.style.display = 'none';
        container.appendChild(dropdown);

        // Vytvoříme vyhledávací pole uvnitř dropdownu
        var searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Vyhledat...';
        searchInput.style.width = 'calc(100% - 10px)';
        searchInput.style.margin = '5px';
        searchInput.style.padding = '5px';
        searchInput.style.boxSizing = 'border-box';
        dropdown.appendChild(searchInput);

        // Kontejner pro možnosti
        var optionsContainer = document.createElement('div');
        optionsContainer.style.maxHeight = '200px';
        optionsContainer.style.overflowY = 'auto';
        dropdown.appendChild(optionsContainer);

        // Funkce pro zvýraznění při hoveru
        function addHoverEffect(elem) {
            elem.addEventListener('mouseenter', function() {
                elem.style.backgroundColor = '#e0e0e0';
            });
            elem.addEventListener('mouseleave', function() {
                elem.style.backgroundColor = '';
            });
        }

        // Funkce pro vykreslení možností dle aktuálního vyhledávacího dotazu
        function renderOptions() {
            var query = searchInput.value.trim().toLowerCase();
            var words = query.length > 0 ? query.split(/\s+/) : [];
            optionsContainer.innerHTML = '';

            // Přidáme defaultní volbu "nerozhoduje" jako první možnost
            var defaultDiv = document.createElement('div');
            defaultDiv.textContent = defaultOption.text;
            defaultDiv.dataset.value = defaultOption.value;
            defaultDiv.style.padding = '5px';
            defaultDiv.style.cursor = 'pointer';
            defaultDiv.style.borderBottom = '1px solid #eee';
            addHoverEffect(defaultDiv);
            defaultDiv.addEventListener('click', function() {
                header.textContent = defaultOption.text;
                originalSelect.value = defaultOption.value;
                originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
                closeDropdown();
            });
            optionsContainer.appendChild(defaultDiv);

            // Vyfiltrujeme zbývající možnosti
            var filteredOptions = optionsData.filter(function(opt) {
                if (words.length === 0) return true;
                var text = opt.text.toLowerCase();
                return words.every(function(word) {
                    return text.includes(word);
                });
            });

            if (filteredOptions.length === 0) {
                var noResult = document.createElement('div');
                noResult.textContent = 'Žádné výsledky';
                noResult.style.padding = '5px';
                noResult.style.color = '#888';
                optionsContainer.appendChild(noResult);
            } else {
                filteredOptions.forEach(function(opt) {
                    var optDiv = document.createElement('div');
                    optDiv.textContent = opt.text;
                    optDiv.dataset.value = opt.value;
                    optDiv.style.padding = '5px';
                    optDiv.style.cursor = 'pointer';
                    optDiv.style.borderBottom = '1px solid #eee';
                    addHoverEffect(optDiv);
                    optDiv.addEventListener('click', function() {
                        header.textContent = opt.text;
                        originalSelect.value = opt.value;
                        originalSelect.dispatchEvent(new Event('change', { bubbles: true }));
                        closeDropdown();
                    });
                    optionsContainer.appendChild(optDiv);
                });
            }
        }

        function openDropdown() {
            dropdown.style.display = 'block';
            renderOptions();
            searchInput.focus();
        }

        function closeDropdown() {
            dropdown.style.display = 'none';
        }

        // Kliknutí na header přepíná zobrazení dropdownu
        header.addEventListener('click', function(e) {
            e.stopPropagation();
            if (dropdown.style.display === 'none') {
                openDropdown();
            } else {
                closeDropdown();
            }
        });

        // Zabráníme zavření dropdownu při kliknutí do vyhledávacího pole
        searchInput.addEventListener('click', function(e) {
            e.stopPropagation();
        });
        searchInput.addEventListener('input', function() {
            renderOptions();
        });

        // Zavřeme dropdown při kliknutí mimo kontejner
        document.addEventListener('click', function(e) {
            if (!container.contains(e.target)) {
                closeDropdown();
            }
        });

        // Pokud se hodnota původního selectu změní (např. reset), pokusíme se otevřít dropdown
        originalSelect.addEventListener('change', function() {
            if (originalSelect.value === defaultOption.value && dropdown.style.display === 'none') {
                openDropdown();
            }
        });
    }

    // Inicializace custom dropdownů pro všechny selecty s třídou "fsp"
    function initCustomDropdowns() {
        var selects = document.querySelectorAll('select.fsp');
        var allowedNames = ['NazevAkceFiltr', 'ProjektFiltr', 'KUFiltr', 'LVFiltr']; // "name" hodnota povolených seznamů pro přepsání

        selects.forEach(function(select) {
            if (allowedNames.includes(select.name)) {
                initCustomDropdownForSelect(select);
            }
        });
    }

    // Inicializace po načtení stránky a pravidelná kontrola každých 500ms
    window.addEventListener('load', initCustomDropdowns);
    setInterval(initCustomDropdowns, 500);
})();
