// ==UserScript==
// @name         Steam Link Dropdown - Adds Clean Links to Various Safe Sites in a neat dropdown
// @namespace    Karma
// @version      1.1
// @description  Adds a quick and easy to access way of finding links to games.
// @author       Karma
// @match        http://store.steampowered.com/app/*
// @match        https://store.steampowered.com/app/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523078/Steam%20Link%20Dropdown%20-%20Adds%20Clean%20Links%20to%20Various%20Safe%20Sites%20in%20a%20neat%20dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/523078/Steam%20Link%20Dropdown%20-%20Adds%20Clean%20Links%20to%20Various%20Safe%20Sites%20in%20a%20neat%20dropdown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to create a styled link
    const createLink = (href, text) => {
        const link = document.createElement('a');
        link.href = href;
        link.textContent = text;
        link.target = '_blank';
        link.style.display = 'block';
        link.style.padding = '5px 10px';
        link.style.textDecoration = 'none';
        link.style.color = '#5095c1';
        link.style.backgroundColor = '#2d5071';
        link.style.borderBottom = '1px solid #c6d4df';
        link.addEventListener('mouseover', () => {
            link.style.backgroundColor = '#1b2838';
        });
        link.addEventListener('mouseout', () => {
            link.style.backgroundColor = '#2d5071';
        });
        return link;
    };

    // Retrieve the game name
    const gameName = document.querySelector('.apphub_AppName')?.textContent.trim();
    if (!gameName) return;

    // Get the container for app actions
    const appActionContainer = document.querySelector('.apphub_OtherSiteInfo');
    if (!appActionContainer) return;

    // Create the dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.style.position = 'absolute';
    dropdownContainer.style.top = '100%';
    dropdownContainer.style.right = '0';
    dropdownContainer.style.backgroundColor = '#2d5071';
    dropdownContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    dropdownContainer.style.border = '1px solid #c6d4df';
    dropdownContainer.style.borderRadius = '0px';
    dropdownContainer.style.display = 'none';
    dropdownContainer.style.zIndex = '1000';
    dropdownContainer.style.minWidth = '200px';
    document.addEventListener('click', (event) => {
        if (!dropdownContainer.contains(event.target) && !dropdownButton.contains(event.target)) {
            dropdownContainer.style.display = 'none';
        }
    });

    // Button
    const dropdownButton = document.createElement('div');
    dropdownButton.textContent = 'Safe Sites';
    dropdownButton.style.cursor = 'pointer';
    dropdownButton.style.padding = '7px 14px';
    dropdownButton.style.margin = '2 0px';
    dropdownButton.style.backgroundColor = '#2d5071';
    dropdownButton.style.color = '#5095c1';
    dropdownButton.style.borderRadius = '2px';
    dropdownButton.style.textAlign = 'center';
    dropdownButton.style.fontfamily = 'arial'
    dropdownButton.style.fontSize = '15px';
    dropdownButton.style.fontWeight = 'bold';
    dropdownButton.style.display = 'inline-block';
    dropdownButton.style.border = '0px solid rgba(0, 0, 0, 10)';
    dropdownButton.style.position = 'relative';
    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        dropdownContainer.style.display = dropdownContainer.style.display === 'none' ? 'block' : 'none';
        dropdownContainer.style.top = `${dropdownButton.offsetHeight}px`;
        dropdownContainer.style.right = '0';
    });

    // List of links to add
    const links = [
        // Its not hard to add new sites
        { href: `https://gog-games.to/?q=${gameName}`, text: 'GOG Games' },
        { href: `https://cs.rin.ru/forum/search.php?keywords=${gameName}&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=Search`, text: 'CS.RIN.RU' },
        { href: `https://steamrip.com/?s=${gameName}`, text: 'SteamRip' },
        { href: `https://fitgirl-repacks.site/?s=${gameName}`, text: 'FitGirl Repacks' },
        { href: `https://ankergames.net/search/${gameName}`, text: 'AnkerGames' },
        { href: `https://online-fix.me/index.php?do=search&subaction=search&story=${gameName}`, text: 'Online-Fix' },
        { href: `https://gamebounty.world/?s${gameName}`, text: 'GameBounty' },
        { href: `https://www.ovagames.com/?s=${gameName}&x=0&y=0`, text: 'OVA Games' },
        { href: `https://www.youtube.com/results?search_query=${encodeURIComponent(gameName)}+gameplay+no+commentary`, text: 'Gameplay Vid' },
    ];

    // Append links to the dropdown container
    links.forEach(({ href, text }) => {
        dropdownContainer.appendChild(createLink(href, text));
    });

    // Append the dropdown button and container beside the "Community Hub" button
    appActionContainer.appendChild(dropdownButton);
    dropdownButton.appendChild(dropdownContainer);
})();
