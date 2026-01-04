// ==UserScript==
// @name         ecsa
// @name:en      ecsa
// @name:ja      ecsa
// @name:ko      ecsa
// @namespace    https://greasyfork.org/en/scripts/476919-ecsa
// @version      1.14
// @description  Clip Studio Assets 素材商店強化工具
// @author       Boni
// @match        https://assets.clip-studio.com/*/download-list
// @match        https://assets.clip-studio.com/*/starred*
// @match        https://assets.clip-studio.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=clip-studio.com
// @description:zh     Clip Studio Assets 素材商店強化工具
// @description:en     Enhancements for Clip Studio Assets
// @description:ja     Clip Studio Assets 向け拡張機能
// @description:de     Erweiterungen für Clip Studio Assets
// @description:es     Mejoras para Clip Studio Assets
// @description:fr     Améliorations pour Clip Studio Assets
// @description:ko     Clip Studio Assets 개선 도구
// @downloadURL https://update.greasyfork.org/scripts/476919/ecsa.user.js
// @updateURL https://update.greasyfork.org/scripts/476919/ecsa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= Settings System =================
    const settingsConfig = {
        settings: {
            openInNewTab: {
                type: 'checkbox',
                label: 'Open links in new tab',
                default: false
            },
            useSystemFont: {
                type: 'checkbox',
                label: 'Use system font',
                default: false
            }
        },

        init() {
            this.loadSettings();
            this.createPanel();
            this.addStyles();
            this.setupWrenchButton();
            this.applySettings();
        },

        loadSettings() {
            this.values = {};
            for (const [key, config] of Object.entries(this.settings)) {
                this.values[key] = GM_getValue(key, config.default);
            }
        },

        saveSetting(key, value) {
            GM_setValue(key, value);
            this.values[key] = value;
            this.applySettings();
        },

        applySettings() {

            if (this.values.useSystemFont) {
                document.body.classList.add('ecsa-system-font');
            } else {
                document.body.classList.remove('ecsa-system-font');
            }
        },

        createPanel() {
            // Create overlay
            this.overlay = document.createElement('div');
            this.overlay.className = 'ecsa-settings-overlay';

            // Create panel
            this.panel = document.createElement('div');
            this.panel.className = 'ecsa-settings-panel';
            this.panel.innerHTML = `
                <div class="ecsa-panel-header">
                    <h4>${this.getLocalizedText('Script Settings')}</h4>
                    <button type="button" class="ecsa-close-btn close" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="ecsa-panel-content">
                    ${Object.entries(this.settings).map(([key, config]) => `
                        <label class="setting-item">
                            <input type="${config.type}"
                                   data-key="${key}"
                                   ${this.values[key] ? 'checked' : ''}>
                            ${this.getLocalizedText(config.label)}
                        </label>
                    `).join('')}
                </div>
            `;

            // Add event listeners
            this.panel.querySelector('.ecsa-close-btn').addEventListener('click', () => this.hidePanel());
            this.overlay.addEventListener('click', () => this.hidePanel());
            document.body.appendChild(this.overlay);
            document.body.appendChild(this.panel);

            // Handle input changes
            this.panel.querySelectorAll('input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                    this.saveSetting(e.target.dataset.key, value);
                });
            });


        },

        setupWrenchButton() {
            const wrenchButton = document.createElement('a');
            wrenchButton.className = 'btn btn-default header__star hidden-xs';
            wrenchButton.innerHTML = '<i class="fa fa-cog" aria-hidden="true"></i>';
            wrenchButton.title = 'ECSA Settings'

            const starButton = document.querySelector('.header__star');
            if (starButton) {
                starButton.insertAdjacentElement('beforebegin', wrenchButton);
                wrenchButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.togglePanel();
                });
            }
        },

        togglePanel() {
            this.panel.style.display = this.panel.style.display === 'block' ? 'none' : 'block';
            this.overlay.style.display = this.panel.style.display;
        },

        hidePanel() {
            this.panel.style.display = 'none';
            this.overlay.style.display = 'none';
        },

        getLocalizedText(textKey) {
            const lang = window.location.pathname.split('/')[1] || 'en-us';
            const translations = {
                "Script Settings": {
                    "zh-tw": "脚本设置",
                    "ja-jp": "スクリプト設定",
                    "en-us": "Script Settings",
                    "de-de": "Skript-Einstellungen",
                    "es-es": "Configuración del script",
                    "fr-fr": "Paramètres du script",
                    "ko-kr": "스크립트 설정"
                },
                 "Open links in new tab": {
                     "zh-tw": "在新标签页打开素材链接",
                     "ja-jp": "素材リンクを新しいタブで開く",
                     "en-us": "Open asset links in new tab",
                     "de-de": "Asset-Links in neuem Tab öffnen",
                     "es-es": "Abrir enlaces de assets en nueva pestaña",
                     "fr-fr": "Ouvrir les liens d'assets dans un nouvel onglet",
                     "ko-kr": "에셋 링크를 새 탭에서 열기"
                 },
                "Sort by Category": {
                    "zh-tw": "按素材类型排序",
                    "ja-jp": "素材タイプ別に並べ替え",
                    "en-us": "Sort by Category",
                    "de-de": "Nach Kategorie sortieren",
                    "es-es": "Ordenar por categoría",
                    "fr-fr": "Trier par catégorie",
                    "ko-kr": "카테고리별 정렬"
                },
                "Sort in Default Order": {
                    "zh-tw": "按默认顺序排序",
                    "ja-jp": "デフォルトの順序別に並べ替え",
                    "en-us": "Sort in Default Order",
                    "de-de": "In der Standardreihenfolge sortieren",
                    "es-es": "Ordenar en el orden predeterminado",
                    "fr-fr": "Trier dans l'ordre par défaut",
                    "ko-kr": "기본 순서로 정렬"
                },
                "Use system font": {
                    "zh-tw": "使用系统字体",
                    "ja-jp": "システムフォントを使用",
                    "en-us": "Use system font",
                    "de-de": "Systemschriftart verwenden",
                    "es-es": "Usar fuente del sistema",
                    "fr-fr": "Utiliser la police système",
                    "ko-kr": "시스템 글꼴 사용"
                },
            };

            // Fallback logic
            return translations[textKey]?.[lang] ||
                translations[textKey]?.['en-us'] ||
                textKey;
        },

        addStyles() {
            GM_addStyle(`


                .translationButtonContainer {
                width: fit-content;
                }
                header .header__notification, header .header__star {
                    padding: 0px 4px;
                }

                .customDropdown {
                     min-width:180px !important;
                }
                
            
                /* System font styles */
                .ecsa-system-font {
                    font-family: system-ui, -apple-system, sans-serif !important;
                }

                /* Always use system font for settings panel */
                .ecsa-settings-panel {
                    font-family: system-ui, -apple-system, sans-serif !important;
                }
                .ecsa-close-btn.close {
                font-size: 30px;
                }

                .ecsa-settings-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 9999;
                    display: none;
                }

                .ecsa-settings-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 8px 16px;
                    border-radius: 8px;
                    box-shadow: 0 0 20px rgba(0,0,0,0.2);
                    z-index: 10000;
                    width: 80%;
                    max-width:500px;
                    display: none;
                }

                .ecsa-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #eee;
                }


                .setting-item {
                    display: block;
                    margin: 10px 0;
                    padding: 8px;
                    border-radius: 4px;
                    transition: background 0.2s;
                }

                .setting-item:hover {
                    background: #f8f9fa;
                }

                .header__wrench {
                    margin-right: 10px;
                    color: #666;
                    padding: 6px 12px;
                    transition: opacity 0.2s;
                }

                .header__wrench:hover {
                    color: #333;
                    background-color: #e6e6e6;
                }
            `);
        }
    };

    // Initialize settings system first
    settingsConfig.init();

    document.addEventListener('click', handleClick, true);

    function handleClick(event) {
        if (!settingsConfig.values.openInNewTab) return;

        let target = event.target.closest('.materialCard__thumbmailBlock');
        if (target) {
            const link = target.querySelector('a[href]');
            if (link) {
                event.preventDefault();
                window.open(link.href, '_blank');
            }
        }
    }


    const getSortBtnLabel = () => ({
        category: settingsConfig.getLocalizedText('Sort by Category'),
        time: settingsConfig.getLocalizedText('Sort in Default Order')
    });


    // text for "all" option
    const getAllText = () => {
        if (window.location.href.includes("starred")) {
            // Find the first <a> element inside the .btn-group.selectFilter
            const selectFilter = document.querySelector('.btn-group.selectFilter');
            if (selectFilter) {
                const firstOption = selectFilter.querySelector('a');
                if (firstOption) {
                    const firstOptionText = firstOption.textContent.trim();
                    return firstOptionText
                }
            }
        } else {
            // Find the <ul> element inside the .dropdown.selectFilter
            const dropdown = document.querySelector('.dropdown.selectFilter');
            if (dropdown) {
                const ul = dropdown.querySelector('ul.dropdown-menu');
                if (ul) {
                    const firstOption = ul.querySelector('li:first-child a');
                    if (firstOption) {
                        const firstOptionText = firstOption.textContent.trim();
                        return firstOptionText
                    }
                }
            }
        }
    }

    // Define liElementsByType in the global scope
    const liElementsByType = {};
    let container = document.querySelector("ul.layput__cardPanel");
    if (!container) return
    let sortAsset = false;
    let orig = container.innerHTML;
    let types = []
    let allText = getAllText()
    let sortBtnText = getSortBtnLabel()
    let currentLocation = ''
    if (window.location.href.includes("starred")) {
        currentLocation = 's'
    } else {
        currentLocation = 'd'
    }


    const toggleSort = (sort) => {
        // Set a value in localStorage
        localStorage.setItem(currentLocation + 'sorted', sort === true ? 1 : 0);
        sortAsset = sort
        const sortButton = document.getElementById("sortButton");
        sortButton.textContent = sortAsset ? sortBtnText.time : sortBtnText.category;
        // sortButton.disabled = type !== allText;
        if (sort) {
            // Clear the existing content on the page
            container.innerHTML = '';
            // Sort the <li> elements by type value (custom sorting logic)
            const sortedTypes = Object.keys(liElementsByType).sort();
            // Reconstruct the sorted list of <li> elements
            const sortedLiElements = [];
            sortedTypes.forEach((type) => {
                sortedLiElements.push(...liElementsByType[type]);
            });
            // Append the sorted <li> elements back to the container
            sortedLiElements.forEach((li) => {
                container.appendChild(li);
            });
        } else {
            container.innerHTML = orig;
        }
    }

    // Function to sort the <li> elements by type
    const preprocessAssets = () => {
        const liElements = document.querySelectorAll("li.materialCard");
        liElements.forEach((li) => {
            const materialTypeLink = li.querySelector("a[href*='/search?type=']");
            if (materialTypeLink) {
                const type = materialTypeLink.textContent.trim(); // Get the text content of the <a> tag
                if (!types.includes(type)) {
                    types.push(type)
                }
                if (type) {
                    if (!liElementsByType[type]) {
                        liElementsByType[type] = [];
                    }
                    liElementsByType[type].push(li);
                }
            }
        });
        // Find the existing button element
        const existingButton = document.querySelector(".btn.btn-default.operationButton.favoriteButton");
        if (existingButton) {
            // Create a new button element
            const sortButton = document.createElement("button");
            sortButton.type = "button";
            sortButton.className = "btn btn-primary ";
            sortButton.id = "sortButton";
            sortButton.textContent = sortBtnText.category;
            sortButton.style.marginLeft = '10px'
            sortButton.style.marginRight = '10px'
            // Add an event listener to the new button if needed
            sortButton.addEventListener("click", function() {
                // Handle button click event
                sortAsset = !sortAsset
                sortButton.textContent = sortAsset ? sortBtnText.time : sortBtnText.category;
                toggleSort(sortAsset)
            });
            // Insert the new button after the existing button
            existingButton.parentNode.insertBefore(sortButton, existingButton.nextSibling);
            const options = [...types];
            options.unshift(allText)
            const dropdown = createDropdown(options);
            existingButton.parentNode.insertBefore(dropdown, sortButton.nextSibling);
        }
        const filterBtn = document.getElementById("filterButton");
        if (filterBtn.textContent === getAllText()) {
            // Read a value from localStorage
            const sorted = localStorage.getItem(currentLocation + 'sorted');
            // Check if the value exists
            if (sorted == 1) {
                // Use the value
                toggleSort(true)
            } else {}
        }
    };

    // Create a function to generate the dropdown HTML
    function createDropdown(types) {
        const dropdown = document.createElement("div");
        dropdown.className = "dropdown selectFilter ";
        dropdown.style.display = 'inline-block'
        dropdown.style.marginTop = '10px'

        const button = document.createElement("button");
        button.className = "btn btn-default dropdown-toggle filterButton customFilterButton";
        button.id = "filterButton"
        button.type = "button";
        button.style.width = 'auto';
        button.style.paddingRight = '20px';

        button.setAttribute("data-toggle", "dropdown");
        button.setAttribute("aria-haspopup", "true");
        button.setAttribute("aria-expanded", "true");
        const filterOption = localStorage.getItem(currentLocation + 'filtered');

        //  set sort button text but only allow change when 'all' option is selected
        const sorted = localStorage.getItem(currentLocation + 'sorted');

        if (types.includes(filterOption) && filterOption !== getAllText()) {
            const sortButton = document.getElementById("sortButton");
            sortButton.disabled = true
            button.textContent = filterOption
            container.innerHTML = '';
            liElementsByType[filterOption].forEach((li) => {
                container.appendChild(li);
            });
        } else {

            button.textContent = types[0]; // Set the default text

        }
        button.style.borderRadius = '0px'
        button.style.textAlign = 'left'
        const caret = document.createElement("span");
        caret.className = "caret";


        const ul = document.createElement("ul");
        ul.className = "dropdown-menu customDropdown";
        // Create options from the 'types' array
        types.forEach((type) => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = type;
            li.appendChild(a);
            ul.appendChild(li);
            li.addEventListener("click", function(event) {
                localStorage.setItem(currentLocation + 'filtered', type);
                // Prevent the default behavior of following the link (if it's an anchor)
                event.preventDefault();
                container.innerHTML = '';
                // Enable or disable the new button based on the selected option
                const sortButton = document.getElementById("sortButton");
                sortButton.disabled = type !== allText;
                button.firstChild.textContent = type;
                const h4Element = document.querySelector("h4.text-right");
                if (type !== allText) {
                    liElementsByType[type].forEach((li) => {
                        container.appendChild(li);
                    });
                    localStorage.setItem(currentLocation + 'filtered', type);
                } else {
                    container.innerHTML = orig;
                    const sorted = localStorage.getItem(currentLocation + 'sorted');
                    // Check if the value exists
                    if (sorted == 1) {
                        // Use the value
                        toggleSort(true)
                    } else {}
                }
            });
        });
        // Append elements to the dropdown
        button.appendChild(caret);
        dropdown.appendChild(button);
        dropdown.appendChild(ul);
        return dropdown;
    }


    function shouldRunOnThisPage() {
        const path = window.location.pathname;
        return (path.includes('/download-list') || path.includes('/starred')) && !path.includes('/download-list-monthly-plan-offer-ic-screen') ;
    }

    function shouldRunFeatureToggle() {
        return window.location.pathname.includes('/search');
    }

    // Wait for the page to fully load before executing the sorting function
    // Initialize page-specific features
    window.addEventListener('load', () => {
        if (shouldRunOnThisPage()) preprocessAssets();

    });

    // Add ESC key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') settingsConfig.hidePanel();
    });



})();