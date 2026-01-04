// ==UserScript==
// @name         Uncompleted Steam Games
// @namespace    Violentmonkey Scripts
// @version      0.1.1
// @description  Fetch uncompleted games from showcases and export to CSV
// @author       Rejedai
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547639/Uncompleted%20Steam%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/547639/Uncompleted%20Steam%20Games.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

(function () {
    'use strict';

    // always uncompleted games, even if you complete it previously.
    const completely_removed_games = new Set([
        1541780
    ]);

    const lang = document.documentElement.lang || 'en';

    function getAvatarHref() {
        // from pc interface
        let link = document.querySelector('a.user_avatar.playerAvatar');
        if (link && link.href) {
            return link.href.replace(/\/$/, "");
        }

        // from mobile interface
        link = document.querySelector('.playerAvatar a');
        if (link && link.href) {
            return link.href.replace(/\/$/, "");
        }

        return null;
    }

    const userUrl = getAvatarHref();
    if (!userUrl) {
        console.log("Can't get user url");
        return;
    }
    const currentUrl = location.href;
    if (!currentUrl.startsWith(userUrl)) {
        console.log('Not main user.');
        return;
    }

    const menu = document.querySelector('#global_action_menu');
    if (!menu) {
        console.log("Can't find #global_action_menu.");
        return;
    }

    const button = document.createElement('a');
    if (lang === "en") {
      button.textContent = 'Uncompleted games';
    } else {
       button.textContent = 'Незаконченные игры';
    }
    button.style.cssText = 'margin-left:10px;padding:5px 10px;background:#5c7e10;color:#fff;border:none;';
    button.href = '#';
    button.classList.add('global_action_link'); // чтобы стиль совпадал с остальными
    button.style.color = '#fff';
    menu.prepend(button);

    button.addEventListener('click', async () => {
        const targetUrl = `${userUrl}/edit/showcases`;

        try {
            const response = await fetch(targetUrl, {credentials: 'include'});
            if (!response.ok) {
                alert("Can't load page");
                return;
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const scripts = doc.querySelectorAll('script');
            let achievedScript = null;
            let completeScript = null;

            for (const script of scripts) {
                if (script.textContent.includes('g_rgAchievementShowcaseGamesWithAchievements')) {
                    achievedScript = script.textContent;
                }
                if (script.textContent.includes('g_rgAchievementsCompletionshipShowcasePerfectGames')) {
                    completeScript = script.textContent;
                }
                if (achievedScript && completeScript) break;
            }

            if (!achievedScript || !completeScript) {
                alert("Can't find games data.");
                return;
            }

            function extractVar(scriptText, varName) {
                const regex = new RegExp(`${varName}\\s*=\\s*(\\[.*?\\]);`, 's');
                const match = scriptText.match(regex);
                if (match && match[1]) {
                    try {
                        return JSON.parse(match[1]);
                    } catch (e) {
                        console.error('JSON parsing error:', e);
                    }
                }
                return [];
            }

            const achievedList = extractVar(achievedScript, 'g_rgAchievementShowcaseGamesWithAchievements');
            const completedList = extractVar(completeScript, 'g_rgAchievementsCompletionshipShowcasePerfectGames');

            const completedAppids = new Set(completedList.map(game => game.appid));

            const filteredGames = achievedList.filter(game => !completedAppids.has(game.appid) && !completely_removed_games.has(game.appid));

            if (filteredGames.length === 0) {
                alert('Have no 10 level or no games found.');
                return;
            }

            let csvContent = 'appid,name\n';
            filteredGames.forEach(game => {
                const name = game.name.replace(/"/g, '""');
                csvContent += `${game.appid},"${name}"\n`;
            });

            // Скачиваем CSV
            const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'uncompleted.csv';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

        } catch (err) {
            console.error('Error:', err);
            alert('Data fetch error.');
        }
    });
})();
