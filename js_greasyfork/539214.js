// ==UserScript==
// @name         Cookie Clicker - Mod Menu Complet
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  AutoClick, AutoReindeer, AutoGolden (30s, sauf colère), Mute/Expand avec raccourcis clavier, UI compacte et draggable (AutoGolden ON par défaut)
// @author
// @match        *://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539214/Cookie%20Clicker%20-%20Mod%20Menu%20Complet.user.js
// @updateURL https://update.greasyfork.org/scripts/539214/Cookie%20Clicker%20-%20Mod%20Menu%20Complet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForGame = setInterval(() => {
        if (typeof Game !== 'undefined' && Game.ready) {
            clearInterval(waitForGame);
            initModMenu();
        }
    }, 500);

    function initModMenu() {
        const menu = document.createElement('div');
        menu.id = 'hackMenu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10000,
            background: 'rgba(0, 0, 0, 0.85)',
            color: '#fff',
            padding: '6px 12px',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '13px',
            boxShadow: '0 0 8px #000',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            userSelect: 'none',
            cursor: 'default'
        });

        const title = document.createElement('div');
        title.textContent = 'Mod Menu';
        title.style.fontWeight = 'bold';
        title.style.marginRight = '10px';
        title.style.cursor = 'grab';
        menu.appendChild(title);

        const createButton = (emoji, label, titleText, onclick, id) => {
            const btn = document.createElement('div');
            btn.innerHTML = `${emoji} ${label}`;
            btn.title = titleText;
            btn.id = id;
            Object.assign(btn.style, {
                cursor: 'pointer',
                padding: '4px 10px',
                border: '1px solid #ccc',
                borderRadius: '6px',
                background: '#333',
                color: '#fff',
                transition: 'background 0.2s, border 0.2s'
            });

            btn.onmouseenter = () => {
                if (btn.classList.contains('active')) btn.style.background = 'green';
                else btn.style.background = '#555';
            };
            btn.onmouseleave = () => {
                if (btn.classList.contains('active')) btn.style.background = 'green';
                else btn.style.background = '#333';
            };
            btn.onclick = () => {
                PlaySound('snd/tick.mp3');
                onclick();
            };
            return btn;
        };

        let autoclickerActive = false;
        let interval = null;
        const btnAuto = createButton('🖱️', 'AutoClick', 'Clic Auto', () => {
            autoclickerActive = !autoclickerActive;
            btnAuto.classList.toggle('active', autoclickerActive);
            updateButtonStyle(btnAuto, autoclickerActive);

            if (autoclickerActive) {
                interval = setInterval(() => Game.ClickCookie(), 10);
            } else {
                clearInterval(interval);
                setTimeout(() => {
            if (!autoclickerActive) {
                autoclickerActive = true;
                btnAuto.classList.add('active');
                updateButtonStyle(btnAuto, true);
                interval = setInterval(() => Game.ClickCookie(), 10);
            }
        }, 5000); // 🔁 Réactivation automatique après 5 secondes
    }
}, 'btnAuto');


        let autoreindeerActive = true;
        const btnAutoReindeer = createButton('🎅', 'AutoReindeer', 'Clic Auto Renne', () => {
            autoreindeerActive = !autoreindeerActive;
            btnAutoReindeer.classList.toggle('active', autoreindeerActive);
            updateButtonStyle(btnAutoReindeer, autoreindeerActive);
        }, 'btnAutoReindeer');

        let autogoldenActive = false;
        const goldenSeen = new Map();
        const btnAutoGolden = createButton('🍪', 'AutoGolden', 'Auto clic cookie doré après 30s (sauf colère)', () => {
            autogoldenActive = !autogoldenActive;
            btnAutoGolden.classList.toggle('active', autogoldenActive);
            updateButtonStyle(btnAutoGolden, autogoldenActive);
        }, 'btnAutoGolden');

        let buildingsMuted = false;
        const btnMute = createButton('↕️', 'Expand', 'Réduire/agrandir tous les bâtiments', () => {
            for (let i in Game.ObjectsById) {
                Game.ObjectsById[i].mute(!buildingsMuted);
            }
            buildingsMuted = !buildingsMuted;
        });

        const btnSave = createButton('💾', 'Save', 'Sauvegarder', () => Game.toSave = true);
        const btnExport = createButton('📤', 'Export', 'Exporter sauvegarde', () => Game.ExportSave());

        [btnAuto, btnAutoReindeer, btnAutoGolden, btnMute, btnSave, btnExport].forEach(btn => menu.appendChild(btn));
        document.body.appendChild(menu);

        let offsetX = 0, offsetY = 0, dragging = false;
        title.addEventListener('mousedown', function (e) {
            dragging = true;
            offsetX = e.clientX - menu.getBoundingClientRect().left;
            offsetY = e.clientY - menu.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
            title.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', function (e) {
            if (dragging) {
                menu.style.left = (e.clientX - offsetX) + 'px';
                menu.style.top = (e.clientY - offsetY) + 'px';
                menu.style.transform = 'none';
            }
        });
        document.addEventListener('mouseup', function () {
            if (dragging) {
                dragging = false;
                document.body.style.userSelect = '';
                title.style.cursor = 'grab';
            }
        });

        function updateButtonStyle(btn, active) {
            btn.style.background = active ? 'green' : '#333';
            btn.style.borderColor = active ? 'lime' : '#ccc';
        }

        setInterval(() => {
            if (!autoreindeerActive || Game.season !== 'christmas') return;
            Game.shimmers.forEach(shimmer => {
                if (shimmer.type === 'reindeer' && !shimmer.clickedByAuto) {
                    shimmer.clickedByAuto = true;
                    setTimeout(() => shimmer.pop(), 500);
                }
            });
        }, 500);

        setInterval(() => {
            if (!autogoldenActive) return;
            Game.shimmers.forEach(shimmer => {
                if (shimmer.type === 'golden' && !shimmer.clickedByAuto && shimmer.spawnLead && !shimmer.wrath) {
                    const id = shimmer.id || shimmer.l;
                    if (!goldenSeen.has(id)) goldenSeen.set(id, Date.now());
                    if (Date.now() - goldenSeen.get(id) >= 10000) {
                        shimmer.clickedByAuto = true;
                        shimmer.pop();
                        PlaySound('snd/click.mp3');
                        goldenSeen.delete(id);
                    }
                }
            });
        }, 1000);

        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            const toggleMuteExpand = id => {
                const isMuted = Game.ObjectsById[id].muted;
                const btn = document.getElementById(isMuted ? `mutedProduct${id}` : `productMute${id}`);
                if (btn) btn.click();
            };

            switch (e.key) {
                case 'a': case 'A': btnAuto.click(); break;
                case 'z': case 'Z': btnMute.click(); break;
                case 'e': case 'E': btnAutoGolden.click(); break;
                case '&': toggleMuteExpand(2); break;
                case 'é': toggleMuteExpand(5); break;
                case '"': toggleMuteExpand(6); break;
                case '\'': toggleMuteExpand(7); break;
            }
        });

        // ✅ Auto activation AutoClick et AutoGolden par défaut
        setTimeout(() => {
            btnAuto.click();         // AutoClick activé
            btnAutoGolden.click();   // AutoGolden activé
            updateButtonStyle(btnAuto, autoclickerActive);
            updateButtonStyle(btnAutoReindeer, autoreindeerActive);
            updateButtonStyle(btnAutoGolden, autogoldenActive);
        }, 500);
    }
})();