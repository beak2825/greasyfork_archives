// ==UserScript==
// @name         Jut.su Achievements UI
// @namespace    http://tampermonkey.net/
// @version      2025-04-07
// @description  Показывает достижения с jut.su которые можно получить в нынешней серии через кнопку-меню
// @author       relder1
// @match        https://jut.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jut.su
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532079/Jutsu%20Achievements%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/532079/Jutsu%20Achievements%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.pathname === '/') {
        return;
    }
    const blockedPaths = [
        /^https:\/\/jut\.su\/user\//,
        /^https:\/\/jut\.su\/pm\//,
        /^https:\/\/jut\.su\/anime\//,
        /^https:\/\/jut\.su\/rewards\//,
        /^https:\/\/jut\.su\/ninja\//
    ];

    for (const path of blockedPaths) {
        if (window.location.href.match(path)) {
            return;
        }
    }

    function formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return {"hours": hours, "minutes": minutes, "seconds": remainingSeconds};
}
    function decodeString(str) {
        const bytes = new Uint8Array(str.split('').map(char => char.charCodeAt(0)));
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(bytes);
    }

    const btn = document.createElement('button');
    btn.innerText = '🏆 Достижения';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.fontWeight = 'bold';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '10px 15px';
    btn.style.background = '#9aa777';
    btn.style.color = '#1f1f1f';
    btn.style.border = 'none';
    btn.style.borderRadius = '10px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    document.body.appendChild(btn);

    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '70px';
    panel.style.right = '20px';
    panel.style.width = '300px';
    panel.style.maxHeight = '400px';
    panel.style.overflowY = 'auto';
    panel.style.background = '#292828';
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    panel.style.padding = '10px';
    panel.style.display = 'none';
    panel.style.zIndex = '10000';
    document.body.appendChild(panel);

    btn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    const checkInterval = setInterval(function() {
        if (typeof window.some_achiv_str !== 'undefined') {
            clearInterval(checkInterval);

            try {
                const decoded = atob(window.some_achiv_str);

                const achievementsRegex = /this_anime_achievements.push\(\s*({[\s\S]*?})\s*\);/g;
                let match;
                const achievements = [];

                while ((match = achievementsRegex.exec(decoded)) !== null) {
                    let jsonString = match[1];
                    jsonString = jsonString.replace(/(js_preres_url \+ "(.*?)")/g, '"$2"');
                    jsonString = jsonString.replace(/[\r\n]/g, '').trim();
                    achievements.push(eval('(' + jsonString + ')'));
                }

                achievements.forEach(achievement => {
                    achievement.title = decodeString(achievement.title);
                    achievement.description = decodeString(achievement.description);
                });


                panel.innerHTML = '<h3 style="margin-top: 0;">🏆 Достижения которые можно получить</h3>';
                achievements.forEach(a => {
                    const item = document.createElement('div');
                    item.style.marginBottom = '10px';

                    const wheretime = formatTime(a.time_start);

                    const link = `${window.location.origin}${window.location.pathname}?t=${wheretime.hours}h${wheretime.minutes}m${wheretime.seconds}s`;


                    item.innerHTML = `
                        <strong style="color: white">${a.title}</strong><br>
                        <small style="color: white">${a.description}</small><br>
                        ${a.icon ? `<img src="${a.icon}" style="width: 50px; margin-top: 5px;">` : ''}
                        <a href="${link}" style="float: right; font-weight: bold; display: inline-block; margin-top: 10px; padding: 10px 15px; background: #9aa777; color: #1f1f1f; text-decoration: none; border-radius: 5px; text-align: center;">Перейти</a>
                        <hr>
                    `;


                    panel.appendChild(item);

                });

            } catch (error) {
                console.error('Ошибка при декодировании или выполнении кода:', error);
            }
        }
    }, 100);
})();
