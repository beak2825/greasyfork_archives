// ==UserScript==
// @name         F95Zone, Ryuugames, and DLsite Search Buttons for Steam
// @namespace    http://tampermonkey.net/
// @version      6.12.0
// @description  Adds buttons to search for the current game and developer on F95Zone and its forums, and search for the game on Ryuugames, OtomiGames, DLsite, and SteamPeek. Buttons in Game Searches are in a three-column grid with a modern design and no dividers.
// @author       FunkyJustin
// @match        https://store.steampowered.com/app/*
// @grant        none
// @license      MIT
// @supportURL   https://greasyfork.org/en/scripts/490884-f95zone-ryuugames-and-dlsite-search-buttons-for-steam/feedback
// @downloadURL https://update.greasyfork.org/scripts/490884/F95Zone%2C%20Ryuugames%2C%20and%20DLsite%20Search%20Buttons%20for%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/490884/F95Zone%2C%20Ryuugames%2C%20and%20DLsite%20Search%20Buttons%20for%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createF95ZoneButton() {
        const titleElement = document.querySelector('.apphub_AppName');
        if (!titleElement) return;

        const gameTitle = titleElement.innerText.trim() || 'Unknown Game';
        const developerElement = document.querySelector('#developers_list a');
        const developerName = developerElement ? developerElement.innerText.trim() : null;

        // Extract appid from the URL
        const url = window.location.href;
        const appidMatch = url.match(/app\/(\d+)/);
        const appid = appidMatch ? appidMatch[1] : '0'; // Default to 0 if not found

        // Add margin below the game title for spacing
        titleElement.style.marginBottom = '15px';

        // Container for game search buttons
        const buttonContainer = createSectionContainer('Game Searches', true, 'game-searches', true);
        const buttonWrapper = buttonContainer.querySelector('.button-wrapper');
        titleElement.parentElement.appendChild(buttonContainer);

        // Configuration for game search buttons with favicons
        const gameSearchSites = [
            { name: 'F95Zone', url: `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/search=${encodeURIComponent(gameTitle)}`, favicon: 'https://f95zone.to/favicon.ico', gridArea: '1 / 1' },
            { name: 'F95Zone Forums', url: `https://f95zone.to/search/?q=${encodeURIComponent(gameTitle)}&t=post&c[child_nodes]=1&c[nodes][0]=2&c[title_only]=1&o=relevance`, favicon: 'https://f95zone.to/favicon.ico', gridArea: '1 / 2' },
            { name: 'SteamPeek', url: `https://steampeek.hu/?appid=${appid}`, favicon: 'https://steampeek.hu/favicon-16x16-spg.png', gridArea: '1 / 3' },
            { name: 'Ryuugames', url: `https://www.ryuugames.com/?s=${encodeURIComponent(gameTitle)}`, favicon: 'https://www.ryuugames.com/favicon.ico', gridArea: '2 / 1' },
            { name: 'OtomiGames', url: `https://otomi-games.com/?s=${encodeURIComponent(gameTitle)}`, favicon: 'https://otomi-games.com/favicon.ico', gridArea: '2 / 2' },
            { name: 'DLsite (Pro)', url: `https://www.dlsite.com/pro/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/${encodeURIComponent(gameTitle).replace(/%20/g, '+')}/work_category%5B0%5D/pc/order%5B0%5D/trend/options_and_or/and/per_page/30/page/1/from/fs.header`, favicon: 'https://www.dlsite.com/images/web/common/favicon.ico', gridArea: '3 / 1' },
            { name: 'DLsite (Maniax)', url: `https://www.dlsite.com/maniax/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/${encodeURIComponent(gameTitle).replace(/%20/g, '+')}/work_category%5B0%5D/doujin/work_category%5B1%5D/books/work_category%5B2%5D/pc/work_category%5B3%5D/app/order%5B0%5D/trend/options_and_or/and/per_page/30/page/1/from/fs.header`, favicon: 'https://www.dlsite.com/images/web/common/favicon.ico', gridArea: '3 / 2' }
        ];

        // Create game search buttons in the specified order
        gameSearchSites.forEach(site => {
            const button = createButton(site.name, site.url, '#e0e8f0', 'linear-gradient(135deg, #2a4066 0%, #4a6a9a 100%)', '#00d4ff', true, site.favicon);
            button.setAttribute('aria-label', `Search ${site.name} for ${gameTitle}`);
            button.setAttribute('title', `Search for ${gameTitle} on ${site.name}`);
            if (site.gridArea) {
                button.style.gridArea = site.gridArea;
            }
            buttonWrapper.appendChild(button);
        });

        // Container for developer search buttons
        if (developerName) {
            const devContainer = createSectionContainer('Developer Searches', true, 'dev-searches', false);
            const devWrapper = devContainer.querySelector('.button-wrapper');
            titleElement.parentElement.appendChild(devContainer);

            const devSearchSites = [
                { name: 'F95Zone', url: `https://f95zone.to/sam/latest_alpha/#/cat=games/page=1/creator=${encodeURIComponent(developerName)}`, favicon: 'https://f95zone.to/favicon.ico' },
                { name: 'DLsite', url: `https://www.dlsite.com/pro/fsr/=/language/jp/sex_category%5B0%5D/male/keyword/${encodeURIComponent(developerName).replace(/%20/g, '+')}/order%5B0%5D/trend/options_and_or/and/per_page/30/page/1/from/fs.header`, favicon: 'https://www.dlsite.com/images/web/common/favicon.ico' }
            ];

            devSearchSites.forEach(site => {
                const button = createButton(`Search Developer on ${site.name}`, site.url, '#e0e8f0', 'linear-gradient(135deg, #2a4066 0%, #4a6a9a 100%)', '#00d4ff', false, site.favicon);
                button.setAttribute('aria-label', `Search ${site.name} for developer ${developerName}`);
                button.setAttribute('title', `Search for developer ${developerName} on ${site.name}`);
                devWrapper.appendChild(button);
            });
        }
    }

    function createSectionContainer(labelText, isExpandedByDefault, sectionId, isGridLayout) {
        const container = document.createElement('div');
        container.style.margin = '8px 0';
        container.style.background = 'linear-gradient(135deg, #1a2e4e 0%, #3a5a8c 100%)';
        container.style.padding = '10px';
        container.style.borderRadius = '12px';
        container.style.border = '1px solid rgba(0, 212, 255, 0.2)';
        container.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.1), inset 0 1px 3px rgba(255, 255, 255, 0.05)';
        container.style.backdropFilter = 'blur(10px)';
        container.style.webkitBackdropFilter = 'blur(10px)';
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s ease-in-out, box-shadow 0.3s ease';
        if (isGridLayout) {
            container.style.maxWidth = '650px';
        } else {
            container.style.maxWidth = '450px';
        }

        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.padding = '6px';
        header.style.cursor = 'pointer';
        header.style.borderRadius = '8px';
        header.style.transition = 'background 0.3s ease, opacity 0.3s ease';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', isExpandedByDefault.toString());
        header.setAttribute('aria-controls', sectionId);

        const toggleIcon = document.createElement('span');
        toggleIcon.innerHTML = isExpandedByDefault ? '▼' : '▶';
        toggleIcon.style.marginRight = '8px';
        toggleIcon.style.background = 'linear-gradient(90deg, #00d4ff, #a7d7f9)';
        toggleIcon.style.webkitBackgroundClip = 'text';
        toggleIcon.style.backgroundClip = 'text';
        toggleIcon.style.color = 'transparent';
        toggleIcon.style.transition = 'transform 0.2s ease';
        header.appendChild(toggleIcon);

        const label = document.createElement('span');
        label.innerText = labelText;
        label.style.fontWeight = '700';
        label.style.color = '#e0f0ff';
        label.style.fontFamily = '"Motiva Sans", Arial, sans-serif';
        label.style.fontSize = '15px';
        label.style.letterSpacing = '0.5px';
        label.style.background = 'linear-gradient(90deg, #00d4ff, #e0f0ff)';
        label.style.webkitBackgroundClip = 'text';
        label.style.backgroundClip = 'text';
        label.style.textShadow = '0 1px 2px rgba(0, 0, 0, 0.3)';
        header.appendChild(label);

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'button-wrapper';
        buttonWrapper.id = sectionId;
        buttonWrapper.style.display = isExpandedByDefault ? 'grid' : 'none';
        buttonWrapper.style.padding = '8px';
        buttonWrapper.style.justifyContent = 'flex-start';

        // Apply grid layout for Game Searches, flex for Developer Searches
        if (isGridLayout) {
            buttonWrapper.style.display = isExpandedByDefault ? 'grid' : 'none';
            buttonWrapper.style.gridTemplateColumns = '200px 200px 200px';
            buttonWrapper.style.gridTemplateRows = 'auto auto auto';
            buttonWrapper.style.gridTemplateAreas = `
                "f95 f95forums steampeek"
                "ryuugames otomi ."
                "dlsitepro dlsitemaniax ."
            `;
            buttonWrapper.style.gap = '6px';
            buttonWrapper.style.alignItems = 'center';
        } else {
            buttonWrapper.style.display = isExpandedByDefault ? 'flex' : 'none';
            buttonWrapper.style.flexWrap = 'wrap';
            buttonWrapper.style.gap = '6px';
        }

        container.appendChild(header);
        container.appendChild(buttonWrapper);

        header.addEventListener('click', () => {
            const isExpanded = buttonWrapper.style.display === (isGridLayout ? 'grid' : 'flex');
            buttonWrapper.style.display = isExpanded ? 'none' : (isGridLayout ? 'grid' : 'flex');
            toggleIcon.innerHTML = isExpanded ? '▶' : '▼';
            header.setAttribute('aria-expanded', (!isExpanded).toString());
            header.style.opacity = isExpanded ? '0.9' : '1';
        });

        header.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                header.click();
            }
        });

        header.addEventListener('mouseover', () => {
            header.style.background = 'rgba(0, 212, 255, 0.15)';
            toggleIcon.style.transform = 'scale(1.2)';
            header.style.opacity = '1';
        });

        header.addEventListener('mouseout', () => {
            header.style.background = 'transparent';
            toggleIcon.style.transform = 'scale(1)';
            header.style.opacity = '0.9';
        });

        header.addEventListener('focus', () => {
            header.style.outline = '2px solid #00d4ff';
            header.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.5)';
        });

        header.addEventListener('blur', () => {
            header.style.outline = 'none';
            header.style.boxShadow = 'none';
        });

        container.addEventListener('mouseover', () => {
            container.style.boxShadow = '0 8px 25px rgba(0, 212, 255, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.05)';
        });

        container.addEventListener('mouseout', () => {
            container.style.boxShadow = '0 6px 20px rgba(0, 212, 255, 0.1), inset 0 1px 3px rgba(255, 255, 255, 0.05)';
        });

        setTimeout(() => {
            container.style.opacity = '1';
        }, 100);

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7); }
                50% { box-shadow: 0 0 0 8px rgba(0, 212, 255, 0.3); }
                100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7); }
            }
            @keyframes hoverGlow {
                0% { box-shadow: 0 0 5px rgba(0, 212, 255, 0.3); }
                50% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.5); }
                100% { box-shadow: 0 0 5px rgba(0, 212, 255, 0.3); }
            }
        `;
        document.head.appendChild(styleSheet);

        return container;
    }

    function createButton(text, link, textColor, backgroundStyle, iconColor, isGridButton, faviconUrl) {
        const buttonContainer = document.createElement('div');
        buttonContainer.setAttribute('role', 'button');
        buttonContainer.setAttribute('tabindex', '0');
        buttonContainer.style.padding = '5px 8px'; // Slightly reduced for compactness
        buttonContainer.style.borderRadius = '10px';
        buttonContainer.style.transition = 'all 0.3s ease';
        buttonContainer.style.background = backgroundStyle;
        buttonContainer.style.color = textColor;
        buttonContainer.style.border = '1px solid rgba(0, 212, 255, 0.3)';
        buttonContainer.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.alignItems = 'center';
        buttonContainer.style.fontWeight = '600';
        buttonContainer.style.fontFamily = '"Motiva Sans", Arial, sans-serif';
        buttonContainer.style.fontSize = '12px';
        buttonContainer.style.lineHeight = '16px';
        buttonContainer.style.cursor = 'pointer';
        buttonContainer.style.opacity = '0.95';
        buttonContainer.style.backdropFilter = 'blur(5px)';
        buttonContainer.style.webkitBackdropFilter = 'blur(5px)';

        // Ensure consistent width for grid buttons
        if (isGridButton) {
            buttonContainer.style.minWidth = '180px';
            buttonContainer.style.justifyContent = 'flex-start';
        }

        // Add favicon with fallback
        const favicon = document.createElement('img');
        favicon.src = faviconUrl;
        favicon.style.width = '12px';
        favicon.style.height = '12px';
        favicon.style.marginRight = '5px';
        favicon.style.verticalAlign = 'middle';
        favicon.onerror = function() {
            console.log(`Failed to load favicon for ${faviconUrl}`);
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="gray"><rect width="24" height="24" rx="4"/><text x="12" y="14" font-size="10" text-anchor="middle" fill="white">?</text></svg>';
        };
        buttonContainer.appendChild(favicon);

        // Add magnifying glass icon
        const icon = document.createElement('span');
        icon.innerHTML = `<svg style="width: 12px; height: 12px; margin-right: 5px;" fill="${iconColor}" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;
        buttonContainer.appendChild(icon);

        const buttonText = document.createElement('span');
        buttonText.innerText = text;
        buttonText.style.whiteSpace = 'nowrap';
        buttonText.style.overflow = 'hidden';
        buttonText.style.textOverflow = 'ellipsis';
        buttonText.style.background = 'linear-gradient(90deg, #e0f0ff, #00d4ff)';
        buttonText.style.webkitBackgroundClip = 'text';
        buttonText.style.backgroundClip = 'text';
        buttonText.style.color = 'transparent';
        buttonContainer.appendChild(buttonText);

        buttonContainer.addEventListener('click', function(event) {
            event.preventDefault();
            openUniqueTab(link);
        });

        buttonContainer.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                openUniqueTab(link);
            }
        });

        buttonContainer.addEventListener('mouseover', () => {
            buttonContainer.style.background = 'linear-gradient(135deg, #3a5a8c 0%, #6a8ab6 100%)';
            buttonContainer.style.transform = 'scale(1.05)';
            buttonContainer.style.opacity = '1';
            buttonContainer.style.boxShadow = '0 5px 15px rgba(0, 212, 255, 0.4)';
            buttonContainer.style.animation = 'hoverGlow 1.5s infinite';
        });

        buttonContainer.addEventListener('mouseout', () => {
            buttonContainer.style.background = 'linear-gradient(135deg, #2a4066 0%, #4a6a9a 100%)';
            buttonContainer.style.transform = 'scale(1)';
            buttonContainer.style.opacity = '0.95';
            buttonContainer.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            buttonContainer.style.animation = 'none';
        });

        buttonContainer.addEventListener('focus', () => {
            buttonContainer.style.outline = '2px solid #00d4ff';
            buttonContainer.style.boxShadow = '0 0 12px rgba(0, 212, 255, 0.5)';
            buttonContainer.style.animation = 'pulse 1.5s infinite';
        });

        buttonContainer.addEventListener('blur', () => {
            buttonContainer.style.outline = 'none';
            buttonContainer.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.1)';
            buttonContainer.style.animation = 'none';
        });

        return buttonContainer;
    }

    function openUniqueTab(url) {
        window.open(url, '_blank');
    }

    window.addEventListener('load', createF95ZoneButton);
})();