// ==UserScript==
// @name         Torrent Game Copier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds unique, styled copy buttons to each torrent group on the right side with improved text formatting.
// @author       SleepingGiant
// @license      MIT
// @match        https://gazellegames.net/torrents.php*
// @exclude      https://gazellegames.net/torrents.php*id=*
// @exclude      https://gazellegames.net/torrents.php*action=basic*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/517082/Torrent%20Game%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/517082/Torrent%20Game%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a styled button element
    function createStyledButton(text, formatFunction, torrentId, groupName, groupYear) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.display = 'block';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        button.style.marginBottom = '20px';

        // Ensure the text stays within the button box
        button.style.whiteSpace = 'nowrap';
        button.style.overflow = 'hidden';
        button.style.textOverflow = 'ellipsis';
        button.style.width = '100%';

        button.onclick = function() {
            let formattedText = formatFunction(torrentId, groupName, groupYear);
            GM_setClipboard(formattedText);
            button.textContent = 'Copied!';
        };

        button.onmouseover = function() {
            button.style.backgroundColor = '#0056b3';
        };
        button.onmouseout = function() {
            button.style.backgroundColor = '#007BFF';
        };

        return button;
    }

    // Function for ByGenre format
    function byGenreFormat(torrentId, groupName, groupYear) {
        return `[url=https://gazellegames.net/torrents.php?id=${torrentId}]${groupName} ${groupYear}[/url]`;
    }

    // Function for TitleChain/Name format
    function titleChainFormat(torrentId, groupName) {
        return `[url=https://gazellegames.net/torrents.php?id=${torrentId}]${groupName}[/url]`;
    }

    // Attach styled buttons to each #displayname element
    document.querySelectorAll('#displayname').forEach(el => {
        let groupName = el.querySelector('#groupname a').textContent.trim();
        let groupYear = el.querySelector('#groupyear') ? el.querySelector('#groupyear').textContent.trim() : '';
        let linkElement = el.querySelector('#groupname a');
        let torrentId = new URLSearchParams(linkElement.href.split('?')[1]).get('id');

        if (torrentId) {
            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'column';

            let byGenreButton = createStyledButton('ByGenre', byGenreFormat, torrentId, groupName, groupYear);
            let titleChainButton = createStyledButton('TitleChain/Name', titleChainFormat, torrentId, groupName);
            buttonContainer.appendChild(byGenreButton);
            buttonContainer.appendChild(titleChainButton);

            el.parentNode.insertBefore(buttonContainer, el.nextSibling);
        }
    });
})();
