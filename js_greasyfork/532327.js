// ==UserScript==
// @name         Steam Pirate & Misc Links Dropdowns
// @namespace    http://tampermonkey.net/
// @version      1.8-min
// @description  Adds dropdown menus with links to game download/forum/cheat/filehost sites on Steam app pages. Fixes dropdown opening and cutoff issues. Improves search link reliability. Use responsibly and legally.
// @author       AndreyUA (enhanced by AI)
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532327/Steam%20Pirate%20%20Misc%20Links%20Dropdowns.user.js
// @updateURL https://update.greasyfork.org/scripts/532327/Steam%20Pirate%20%20Misc%20Links%20Dropdowns.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const findSites = [
        { name: "Rutracker", searchUrl: "https://rutracker.org/forum/tracker.php?nm={searchTerm}" },
        { name: "CS.RIN.RU", searchUrl: "https://cs.rin.ru/forum/search.php?keywords={searchTerm}&terms=all&author=&sc=1&sf=titleonly&sr=topics&sk=t&sd=d&st=0&ch=300&t=0&submit=Search" },
        { name: "Online-Fix.me", searchUrl: "https://online-fix.me/index.php?do=search&subaction=search&story={searchTerm}" },
        { name: "FitGirl Repacks", searchUrl: "https://fitgirl-repacks.site/?s={searchTerm}" },
        { name: "DODI Repacks", searchUrl: "https://dodi-repacks.site/?s={searchTerm}" },
        { name: "GOG-Games", searchUrl: "https://gog-games.to/?s={searchTerm}" },
        { name: "SteamRIP", searchUrl: "https://steamrip.com/?s={searchTerm}" },
        { name: "Torrminatorr Forum", searchUrl: "https://forum.torrminatorr.com/search.php?keywords={searchTerm}&terms=all&author=&sc=1&sf=titleonly&sr=topics&sk=t&sd=d&st=0&ch=300&t=0&submit=Search" },
        { name: "SteamGG", searchUrl: "https://steamgg.net/?s={searchTerm}" },
        { name: "KaosKrew", searchUrl: "https://www.kaoskrew.org/search.php?keywords={searchTerm}&terms=all&author=&sc=1&sf=titleonly&sr=topics&sk=t&sd=d&st=0&ch=300&t=0&submit=Search" },
    ];

    const miscContentConfig = [
        { type: 'header', text: 'Cheats & Saves' },
        { type: 'link', name: "FearLess Cheat Engine", searchUrl: "https://fearlessrevolution.com/search.php?keywords={searchTerm}" },
        { type: 'link', name: "FLiNG Trainer", searchUrl: "https://flingtrainer.com/search/{searchTerm}/" },
        { type: 'link', name: "MegaGames", searchUrl: "https://megagames.com/results?titles={searchTerm}" },
        { type: 'separator' },
        { type: 'header', text: 'Recommended Filehosts' },
        { type: 'link', name: "Buzzheavier", url: "https://buzzheavier.com/" },
        { type: 'link', name: "Datanodes", url: "https://datanodes.to/" },
        { type: 'link', name: "Gofile", url: "https://gofile.io/" },
        { type: 'link', name: "KrakenFiles", url: "https://krakenfiles.com/" },
        { type: 'link', name: "MediaFire", url: "https://www.mediafire.com/" },
        { type: 'link', name: "PixelDrain", url: "https://pixeldrain.com/" },
    ];

    function sanitizeGameTitle(title) {
        if (!title) return '';
        let cleanTitle = title.replace(/™|®|©/g, '').trim();
        const suffixPatterns = [
             /\s*[:\-–—]?\s+(Remastered|Remake|Definitive|Ultimate|Deluxe|GOTY|Game of the Year|Anniversary|Enhanced|Complete|Gold|Premium|Collectors|Extended|Legacy)\s+(Collection|Edition|Cut)?\s*$/i,
             /\s*\(?(VR)\)?\s*$/i,
             /\s+-\s+(Remastered|Definitive|etc...)\s*$/i,
             /\s+\d{4}\s*$/
        ];
        suffixPatterns.forEach(pattern => {
            cleanTitle = cleanTitle.replace(pattern, '').trim();
        });
        cleanTitle = cleanTitle.replace(/^Call of Duty®$/, 'Call of Duty');
        return cleanTitle;
    }

    function getGameTitle() {
        const titleElement = document.getElementById('appHubAppName');
        if (titleElement) return titleElement.textContent.trim();
        const pageTitle = document.title;
        const match = pageTitle.match(/^(.*?)\s+on Steam$/);
        if (match && match[1]) return match[1].trim();
        return '';
    }

    function createDropdownButton(buttonText, contentConfig, gameTitle = '', containerClass = '') {
        const container = document.createElement('div');
        container.className = `pirate-links-container ${containerClass}`;
        container.style.position = 'relative';
        container.style.display = 'inline-block';
        container.style.marginRight = '4px';
        container.style.verticalAlign = 'top';

        const button = document.createElement('a');
        button.href = '#';
        button.className = 'btnv6_blue_hoverfade btn_medium pirate-links-button';
        button.innerHTML = `<span>${buttonText}</span>`;

        const dropdownPanel = document.createElement('div');
        dropdownPanel.className = 'popup_block_new pirate-links-dropdown';
        dropdownPanel.style.position = 'absolute';
        dropdownPanel.style.visibility = 'hidden';
        dropdownPanel.style.display = 'none';
        dropdownPanel.style.zIndex = '1501';
        dropdownPanel.style.minWidth = '180px';

        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'popup_body popup_menu';

        contentConfig.forEach(item => {
            if (item.type === 'header') {
                const header = document.createElement('div');
                header.className = 'popup_menu_subheader pirate-links-subheader';
                header.textContent = item.text;
                dropdownContent.appendChild(header);
            } else if (item.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'pirate-links-separator';
                dropdownContent.appendChild(separator);
            } else if (item.type === 'link') {
                const link = document.createElement('a');
                link.className = 'popup_menu_item';
                let href = item.url || '#';
                if (item.searchUrl && gameTitle) {
                    href = item.searchUrl.replace('{searchTerm}', encodeURIComponent(gameTitle));
                }
                link.href = href;
                link.textContent = item.name;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                dropdownContent.appendChild(link);
            }
        });

        dropdownPanel.appendChild(dropdownContent);
        document.body.appendChild(dropdownPanel);
        container.appendChild(button);

        button.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isCurrentlyVisible = dropdownPanel.style.display === 'block';

            document.querySelectorAll('.pirate-links-dropdown').forEach(panel => {
                if (panel !== dropdownPanel) {
                    panel.style.display = 'none';
                    panel.style.visibility = 'hidden';
                }
            });

            if (isCurrentlyVisible) {
                dropdownPanel.style.display = 'none';
                dropdownPanel.style.visibility = 'hidden';
            } else {
                try {
                    const buttonRect = button.getBoundingClientRect();
                    const panelHeight = dropdownPanel.offsetHeight;
                    const panelWidth = dropdownPanel.offsetWidth;

                    const spaceBelow = window.innerHeight - buttonRect.bottom;
                    const spaceAbove = buttonRect.top;

                    let panelTop = 0;
                    let panelLeft = buttonRect.left + window.scrollX;

                    if (panelHeight > spaceBelow - 10 && panelHeight <= spaceAbove) {
                        panelTop = buttonRect.top + window.scrollY - panelHeight - 2;
                    } else {
                        panelTop = buttonRect.bottom + window.scrollY + 2;
                    }

                    dropdownPanel.style.top = `${panelTop}px`;
                    dropdownPanel.style.left = `${panelLeft}px`;
                    dropdownPanel.style.width = `${Math.max(buttonRect.width, 180)}px`;
                    dropdownPanel.style.right = 'auto';
                    dropdownPanel.style.bottom = 'auto';

                    dropdownPanel.style.display = 'block';
                    dropdownPanel.style.visibility = 'visible';

                } catch (error) {
                    console.error("Error during positioning:", error);
                    dropdownPanel.style.top = (button.getBoundingClientRect().bottom + window.scrollY + 2) + 'px';
                    dropdownPanel.style.left = (button.getBoundingClientRect().left + window.scrollX) + 'px';
                    dropdownPanel.style.display = 'block';
                    dropdownPanel.style.visibility = 'visible';
                }
            }
        });

        return container;
    }

    const globalClickListener = (e) => {
        let clickedInsideButtonOrPanel = false;
        document.querySelectorAll('.pirate-links-container').forEach(container => {
            if (container.contains(e.target)) {
                clickedInsideButtonOrPanel = true;
            }
        });
        document.querySelectorAll('.pirate-links-dropdown').forEach(panel => {
            if (panel.contains(e.target)) {
                clickedInsideButtonOrPanel = true;
            }
        });

        if (!clickedInsideButtonOrPanel) {
            document.querySelectorAll('.pirate-links-dropdown').forEach(panel => {
                panel.style.display = 'none';
                panel.style.visibility = 'hidden';
            });
        }
    };
    document.addEventListener('click', globalClickListener);


    const originalGameTitle = getGameTitle();
    if (!originalGameTitle) {
        console.error("Steam Pirate/Misc Links: Could not determine game title.");
        return;
    }
    const sanitizedGameTitle = sanitizeGameTitle(originalGameTitle);
    // console.log("Steam Pirate/Misc Links | Original Title:", originalGameTitle, "| Sanitized:", sanitizedGameTitle); // Commented out console log

    const findButtonContainer = createDropdownButton(
        'Find...',
        findSites.map(site => ({ type: 'link', ...site })),
        sanitizedGameTitle,
        'find-button-container'
    );

    const miscButtonContainer = createDropdownButton(
        'Misc',
        miscContentConfig,
        sanitizedGameTitle,
        'misc-button-container'
    );

    const insertionPointFind = document.querySelector('.apphub_OtherSiteInfo');
    if (insertionPointFind && findButtonContainer) {
        const communityHubButton = insertionPointFind.querySelector('a[href*="steamcommunity.com/app/"]');
        if (communityHubButton) {
            findButtonContainer.style.verticalAlign = 'middle';
            insertionPointFind.insertBefore(findButtonContainer, communityHubButton);
        } else {
            findButtonContainer.style.verticalAlign = 'middle';
            insertionPointFind.insertAdjacentElement('afterbegin', findButtonContainer);
        }
    } else {
        console.error("Steam Pirate/Misc Links: Could not find insertion point for 'Find...' button (.apphub_OtherSiteInfo).");
    }

    const insertionPointMisc = document.getElementById('shareEmbedRow');
    if (insertionPointMisc && miscButtonContainer) {
        const reportButton = insertionPointMisc.querySelector('#ReportAppBtn');
        if (reportButton) {
            miscButtonContainer.style.verticalAlign = 'bottom';
            miscButtonContainer.style.marginLeft = '4px';
            insertionPointMisc.insertBefore(miscButtonContainer, reportButton);
        } else {
            miscButtonContainer.style.verticalAlign = 'bottom';
            insertionPointMisc.appendChild(miscButtonContainer);
        }
    } else {
        console.error("Steam Pirate/Misc Links: Could not find insertion point for 'Misc' button (#shareEmbedRow).");
    }

    GM_addStyle(`
        .pirate-links-button span {
            vertical-align: middle;
        }
        .pirate-links-dropdown {
            background-color: #171d25;
            border: 1px solid #000;
            box-shadow: 0 0 12px rgba(0,0,0,0.7);
            color: #c7d5e0;
            border-radius: 3px;
            position: absolute;
        }
        .pirate-links-dropdown .popup_menu_item {
            display: block;
            padding: 6px 12px;
            color: #c7d5e0;
            text-decoration: none;
            font-size: 13px;
            white-space: nowrap;
        }
        .pirate-links-dropdown .popup_menu_item:hover {
            background-color: #c7d5e0;
            color: #1b2838;
            border-radius: 2px;
        }
        .pirate-links-subheader {
            padding: 8px 12px 4px 12px;
            color: #5b9ace;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
            border-top: 1px solid #3a3f44;
        }
         .pirate-links-subheader:first-child {
             border-top: none;
             padding-top: 6px;
         }
        .pirate-links-separator {
             height: 1px;
             background-color: #3a3f44;
             margin: 4px 0;
        }
    `);

    // console.log("Steam Pirate & Misc Links Dropdowns loaded successfully (v1.8-min)."); // Commented out console log

})();