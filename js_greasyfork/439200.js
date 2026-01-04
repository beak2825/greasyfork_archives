// ==UserScript==
// @name         Seiya-saiga Helper
// @namespace    Seiya-saiga Helper
// @license      MIT
// @version      0.1.1
// @description  Easy to save checkbox states.
// @author       GrassSand
// @match        https://seiya-saiga.com/*
// @icon         https://seiya-saiga.com/image/favicon.ico
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/439200/Seiya-saiga%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/439200/Seiya-saiga%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const storage = {
        getGame(key) {
            games = GM_getValue('games', {});
            return games[key] || { name: '', states: '' };
        },
        getGames() {
            return GM_getValue('games', {});
        },
        setGames(value) {
            GM_setValue('games', value);
        }
    };

    let games = storage.getGames();

    if (location.pathname.startsWith('/game/')) {
        const key = location.pathname.split(/\/game\/(.+)\.html/)[1];
        let game = storage.getGame(key);
        game.name = document.querySelector('title').text.split(/.+?【(.+?)】/)[1];

        const allCheckBoxes = document.querySelectorAll('input[type=checkbox]');
        const count = allCheckBoxes.length;

        for (let i = 0; i < count; i++) {
            let input = allCheckBoxes[i];
            input.id = `cb${i}`;
            if (i < game.states.length) {
                input.checked = parseInt(game.states[i]);
            } else {
                game.states += '0';
            }
            input.addEventListener('change', function () { changedHandle(i, key, game); }, false);
        }
    }

    function changedHandle(index, key, game) {
        const input = document.getElementById(`cb${index}`);
        let states = game.states;
        states = states.substring(0, index)
            + (input.checked ? '1' : '0')
            + states.substring(index + 1, states.length);
        game.states = states;
        games[key] = game;
        storage.setGames(games);
    }


    function delGame(key) {
        console.log('delete:', key);
        delete games[key];
        storage.setGames(games);
    }

    function addHistoryView() {
        const
            div = document.createElement('div'),
            details = document.createElement('details'),
            summary = document.createElement('summary'),
            ul = document.createElement('ul');

        div.id = 'history-view-container';
        div.style = `
            position: fixed;
            z-index:999999;
            top: 10px;
            left: 10px;
            height: auto;
            width: auto;
            background-color: #acacac;
            opacity: 0.75;
            padding: 5px;
            font-size: 12px;
        `;
        details.onmouseover = function () { this.open = true; };
        details.onmouseout = function () { this.open = false; };
        summary.innerText = 'History';
        ul.style.margin = '2px';

        for (const key in games) {
            const
                li = document.createElement('li'),
                del = document.createElement('button'),
                link = document.createElement('a');

            li.id = key;
            del.style.color = 'red';
            del.innerText = 'Del';
            del.onclick = function () {
                delGame(key);
                li.remove();
            };

            link.href = `/game/${key}.html`;
            link.innerText = games[key].name;

            li.appendChild(del);
            li.appendChild(link);
            ul.appendChild(li);
        }

        details.appendChild(summary);
        details.appendChild(ul);
        div.appendChild(details);
        document.body.append(div);
    }

    addHistoryView();
})();
