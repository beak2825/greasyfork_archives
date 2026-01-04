// ==UserScript==
// @name         Display User Info in Popup Mine-Craft.io - Mine-Craft.fun
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Like the fricking Name! :D
// @author       Junes
// @match        https://mine-craft.io/
// @match        https://mine-craft.fun/
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/513936/Display%20User%20Info%20in%20Popup%20Mine-Craftio%20-%20Mine-Craftfun.user.js
// @updateURL https://update.greasyfork.org/scripts/513936/Display%20User%20Info%20in%20Popup%20Mine-Craftio%20-%20Mine-Craftfun.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.width = '400px';
    popup.style.height = 'auto';
    popup.style.maxHeight = '80%';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = 'black';
    popup.style.color = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '9999';
    popup.style.overflowY = 'auto';
    popup.style.padding = '10px';
    popup.style.display = 'none';
    document.body.appendChild(popup);
    const closePopup = () => {
        popup.style.display = 'none';
    };
    popup.addEventListener('click', closePopup);
    function applyBBCodeFormatting(text) {
        const replacements = {
            '§0': '<span style="color: black;">',
            '§1': '<span style="color: darkblue;">',
            '§2': '<span style="color: darkgreen;">',
            '§3': '<span style="color: darkcyan;">',
            '§4': '<span style="color: darkred;">',
            '§5': '<span style="color: darkmagenta;">',
            '§6': '<span style="color: gold;">',
            '§7': '<span style="color: gray;">',
            '§8': '<span style="color: darkgray;">',
            '§9': '<span style="color: lightblue;">',
            '§a': '<span style="color: lightgreen;">',
            '§b': '<span style="color: lightcyan;">',
            '§c': '<span style="color: lightcoral;">',
            '§d': '<span style="color: pink;">',
            '§e': '<span style="color: yellow;">',
            '§f': '<span style="color: white;">',
            '§l': '<strong>',
            '§r': '</span>'
        };
        for (const [bbCode, html] of Object.entries(replacements)) {
            text = text.split(bbCode).join(html);
        }
        return text.replace(/<\/span>\s*<span>/g, '');
    }
    function showUserInfo() {
        if (popup.style.display === 'block') {
            closePopup();
            return;
        }
        const userIdElement = document.querySelector('.id-wrap .id');
        if (!userIdElement) return;
        const userId = userIdElement.textContent.replace('ID: ', '');
        const apiUrl = `https://mine-craft.io/api/users/${userId}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                const data = JSON.parse(response.responseText).user;
                const friendsElement = document.querySelector('.friends');
                const friendsCount = friendsElement ? friendsElement.textContent.replace('Friends: ', '').trim() : '0';
                const aboutFormatted = applyBBCodeFormatting(data.about);
                popup.innerHTML = `
                    <h2>${data.nickname}</h2>
                    <p><strong>Nickname:</strong> ${data.nickname}</p>
                    <p><strong>ID:</strong> ${data.id}</p>
                    <p><strong>Role ID:</strong> ${data.role_id}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Balance:</strong> ${data.balance}</p>
                    <p><strong>Date Registered:</strong> ${new Date(data.date_register * 1000).toLocaleString()}</p>
                    <p><strong>Last Login:</strong> ${new Date(data.last_login * 1000).toLocaleString()}</p>
                    <p><strong>Last Active:</strong> ${new Date(data.last_active * 1000).toLocaleString()}</p>
                    <p><strong>Friends:</strong> ${friendsCount}</p>
                    <p><strong>About:</strong><br>${aboutFormatted}</p>
                `;
                popup.style.display = 'block';
            }
        });
    }
    function replaceReportButton() {
        const targetButton = document.querySelector('.buttons .button.report');
        if (targetButton && targetButton.textContent.includes('Report')) {
            const newButtons = `
                <div class="buttons">
                    <button class="button">Report</button>
                    <button class="button" id="rawDataButton">Raw Data</button>
                </div>
            `;
            targetButton.parentElement.innerHTML = newButtons;
            const rawDataButton = document.getElementById('rawDataButton');
            rawDataButton.addEventListener('click', showUserInfo);
        }
    }
    const observer = new MutationObserver(replaceReportButton);
    observer.observe(document.body, { childList: true, subtree: true });
    replaceReportButton();
})();