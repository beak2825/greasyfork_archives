// ==UserScript==
// @name         Drawaria Engine Selector
// @namespace    drawaria.modded.fullspec
// @version      16.0.0 Final
// @description  The ultimate Engine Hub for Drawaria.online. Easily select and install other Engines (Diamond, Circle, Hexagon, Cubic, Pentagon, Triangle) with a dedicated in-game floating menu. Quick access to installation pages.
// @author       YouTubeDrawaria
// @include      https://drawaria.online/*
// @include      https://.drawaria.online/
// @grant        GM_addStyle
// @connect      images.unsplash.com
// @connect      ibb.co
// @connect      myinstants.com
// @connect      picsum.photos
// @run-at       document-start
// @icon         https://i.ibb.co/wNcMwLwx/Tri-fairy2.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541670/Drawaria%20Engine%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/541670/Drawaria%20Engine%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clickSoundUrl = "https://www.myinstants.com/media/sounds/pisseim-mund-online-audio-converter.mp3";
    const audio = new Audio(clickSoundUrl);

    const engines = [
        { name: "Diamond Engine", img: "https://i.ibb.co/zV5sXzkz/diamond2.gif", url: "https://greasyfork.org/es/scripts/557371-diamond-engine" },
        { name: "Circle Engine",  img: "https://i.ibb.co/YTZLWcNt/circle2.gif",  url: "https://greasyfork.org/es/scripts/557343-circle-engine" },
        { name: "Hexagon Engine", img: "https://i.ibb.co/ZDNJ6KN/hexagon2.gif",   url: "https://greasyfork.org/es/scripts/557367-hexagon-engine" },
        { name: "Cubic Engine",   img: "https://i.ibb.co/mLKfYmc/cube2.gif",     url: "https://greasyfork.org/es/scripts/557337-cubic-engine" },
        { name: "Pentagon Engine",img: "https://i.ibb.co/TDtBp9cr/pentagon2.gif", url: "https://greasyfork.org/es/scripts/557349-pentagon-engine" },
        { name: "Triangle Engine",img: "https://i.ibb.co/qFRdG3Gk/triangle2.gif",  url: "https://greasyfork.org/es/scripts/557256-triangle-engine" }
    ];

    GM_addStyle(`
        #eng-selector-btn {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 50px;
            height: 50px;
            background: rgba(0, 0, 0, 0.7);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 12px;
            cursor: pointer;
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s, border-color 0.2s;
            backdrop-filter: blur(5px);
        }
        #eng-selector-btn:hover {
            transform: scale(1.05);
            border-color: #ffffff;
        }
        #eng-selector-btn img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }
        #eng-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            z-index: 99998;
            display: none;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
        }
        #eng-modal-content {
            background: rgba(20, 20, 25, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 30px;
            width: 600px;
            max-width: 90%;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            box-shadow: 0 0 30px rgba(0,0,0,0.8);
            transform: translateY(20px);
            transition: transform 0.3s;
        }
        .eng-card {
            display: flex;
            align-items: center;
            background: rgba(255, 255, 255, 0.05);
            padding: 15px;
            border-radius: 12px;
            cursor: pointer;
            transition: background 0.2s, transform 0.2s;
            border: 1px solid transparent;
            text-decoration: none;
            color: white;
        }
        .eng-card:hover {
            background: rgba(255, 255, 255, 0.15);
            transform: translateY(-2px);
            border-color: rgba(255, 255, 255, 0.3);
        }
        .eng-card img {
            width: 48px;
            height: 48px;
            margin-right: 15px;
            object-fit: contain;
        }
        .eng-name {
            font-family: 'Arial', sans-serif;
            font-size: 16px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .eng-close {
            position: absolute;
            top: 20px;
            right: 20px;
            color: rgba(255, 255, 255, 0.5);
            font-size: 30px;
            cursor: pointer;
            line-height: 20px;
        }
        .eng-close:hover {
            color: white;
        }
        #eng-title {
            grid-column: 1 / -1;
            text-align: center;
            color: white;
            font-family: sans-serif;
            font-size: 24px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
    `);

    function playSound() {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    function createSelector() {
        const btn = document.createElement('div');
        btn.id = 'eng-selector-btn';
        btn.innerHTML = `<img src="${engines[0].img}" alt="Engines">`;
        document.body.appendChild(btn);

        const overlay = document.createElement('div');
        overlay.id = 'eng-modal-overlay';

        const modal = document.createElement('div');
        modal.id = 'eng-modal-content';

        const title = document.createElement('div');
        title.id = 'eng-title';
        title.innerText = 'SELECT YOUR ENGINE';
        modal.appendChild(title);

        const closeBtn = document.createElement('div');
        closeBtn.className = 'eng-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => toggleMenu(false);
        overlay.appendChild(closeBtn);

        engines.forEach(eng => {
            const card = document.createElement('a');
            card.className = 'eng-card';
            card.href = eng.url;
            card.target = '_blank';

            card.innerHTML = `
                <img src="${eng.img}" alt="${eng.name}">
                <span class="eng-name">${eng.name}</span>
            `;

            card.addEventListener('click', () => playSound());
            card.addEventListener('mouseenter', () => {

            });
            modal.appendChild(card);
        });

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        btn.addEventListener('click', () => toggleMenu(true));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) toggleMenu(false);
        });

        function toggleMenu(show) {
            playSound();
            if (show) {
                overlay.style.display = 'flex';
                setTimeout(() => {
                    overlay.style.opacity = '1';
                    modal.style.transform = 'translateY(0)';
                }, 10);
            } else {
                overlay.style.opacity = '0';
                modal.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 300);
            }
        }
    }

    window.addEventListener('load', createSelector);
})();