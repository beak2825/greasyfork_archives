// ==UserScript==
// @name         Botões de velocidade para o YouTube
// @namespace    https://greasyfork.org/pt-BR/scripts/543571
// @version      2.2.6
// @description  Botões para controlar a velocidade de reprodução no YouTube, com menu suspenso e suporte multilíngue.
// @author       Ramon Machado
// @match        *://*.youtube.com/*
// @grant        none
// @license      GNU GPLv3
// @icon         https://cdn-icons-png.flaticon.com/512/4399/4399641.png
// @downloadURL https://update.greasyfork.org/scripts/543571/Bot%C3%B5es%20de%20velocidade%20para%20o%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/543571/Bot%C3%B5es%20de%20velocidade%20para%20o%20YouTube.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Traduções
    const texts = {
        pt: {
            increase: '▲ +Vel',
            reset: '■ 1x',
            decrease: '▼ -Vel',
            speedMsg: v => `Velocidade: ${v.toFixed(2)}x`
        },
        en: {
            increase: '▲ +Speed',
            reset: '■ 1x',
            decrease: '▼ -Speed',
            speedMsg: v => `Speed: ${v.toFixed(2)}x`
        },
        es: {
            increase: '▲ +Velocidad',
            reset: '■ 1x',
            decrease: '▼ -Velocidad',
            speedMsg: v => `Velocidad: ${v.toFixed(2)}x`
        },
        fr: {
            increase: '▲ +Vitesse',
            reset: '■ 1x',
            decrease: '▼ -Vitesse',
            speedMsg: v => `Vitesse : ${v.toFixed(2)}x`
        },
        de: {
            increase: '▲ +Geschw.',
            reset: '■ 1x',
            decrease: '▼ -Geschw.',
            speedMsg: v => `Geschwindigkeit: ${v.toFixed(2)}x`
        },
        it: {
            increase: '▲ +Velocità',
            reset: '■ 1x',
            decrease: '▼ -Velocità',
            speedMsg: v => `Velocità: ${v.toFixed(2)}x`
        },
        ja: {
            increase: '▲ 速く',
            reset: '■ 1x',
            decrease: '▼ 遅く',
            speedMsg: v => `速度: ${v.toFixed(2)}x`
        }
    };

    const lang = (navigator.language || 'pt').slice(0, 2);
    const t = texts[lang] || texts.pt;

    const styles = {
        button: {
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            minWidth: '80px',
            width: '100%',
            textAlign: 'center',
            boxSizing: 'border-box'
        },
        dropdown: {
            position: 'absolute',
            right: '100%',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            padding: '5px',
            borderRadius: '5px',
            display: 'none',
            flexDirection: 'column',
            gap: '3px',
            zIndex: '9999'
        },
        option: {
            backgroundColor: '#222',
            color: 'white',
            padding: '5px 10px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            whiteSpace: 'nowrap'
        }
    };

    function applyStyle(el, styleObj) {
        Object.assign(el.style, styleObj);
    }

    function createButton(text, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        applyStyle(btn, styles.button);
        btn.addEventListener('click', onClick);
        return btn;
    }

    function showMessage(text) {
        let msg = document.getElementById('speed-message');
        if (!msg) {
            msg = document.createElement('div');
            msg.id = 'speed-message';
            Object.assign(msg.style, {
                position: 'fixed',
                bottom: '270px',
                right: '20px',
                backgroundColor: 'rgba(0,0,0,0.8)',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '16px',
                textAlign: 'center',
                pointerEvents: 'none',
                zIndex: '9999',
                display: 'none'
            });
            document.body.appendChild(msg);
        }
        msg.textContent = text;
        msg.style.display = 'block';
        clearTimeout(msg.timer);
        msg.timer = setTimeout(() => { msg.style.display = 'none'; }, 1500);
    }

    function waitForVideo(callback) {
        const checkVideo = () => {
            const video = document.querySelector('video');
            if (video) {
                callback(video);
            } else {
                setTimeout(checkVideo, 100);
            }
        };
        checkVideo();
    }

    function adjustSpeed(delta) {
        waitForVideo(video => {
            video.playbackRate = delta === 0 ? 1.0 : Math.min(Math.max(video.playbackRate + delta, 0.25), 16);
            showMessage(t.speedMsg(video.playbackRate));
        });
    }

    function setSpeed(value) {
        waitForVideo(video => {
            video.playbackRate = value;
            showMessage(t.speedMsg(value));
        });
    }

    function addSpeedControls() {
        if (!(location.pathname.startsWith('/watch') || location.pathname.startsWith('/shorts'))) {
            removeSpeedControls();
            return;
        }
        if (document.getElementById('speed-controls')) return;

        const container = document.createElement('div');
        container.id = 'speed-controls';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '140px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            zIndex: '9999'
        });

        const increaseBtn = createButton(t.increase, () => adjustSpeed(0.25));
        const decreaseBtn = createButton(t.decrease, () => adjustSpeed(-0.25));

        const resetWrapper = document.createElement('div');
        resetWrapper.style.position = 'relative';

        const resetBtn = createButton(t.reset, () => adjustSpeed(0));

        const dropdown = document.createElement('div');
        applyStyle(dropdown, styles.dropdown);

        const speeds = [3.0, 2.0, 1.5, 1.25, 1.0, 0.75, 0.5];
        speeds.forEach(spd => {
            const opt = document.createElement('button');
            opt.textContent = `${spd}x`;
            applyStyle(opt, styles.option);
            opt.addEventListener('mouseenter', () => opt.style.backgroundColor = '#444');
            opt.addEventListener('mouseleave', () => opt.style.backgroundColor = '#222');
            opt.addEventListener('click', e => {
                e.stopPropagation();
                setSpeed(spd);
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(opt);
        });

        resetWrapper.appendChild(resetBtn);
        resetWrapper.appendChild(dropdown);

        resetWrapper.addEventListener('mouseenter', () => {
            dropdown.style.display = 'flex';
        });
        resetWrapper.addEventListener('mouseleave', () => {
            dropdown.style.display = 'none';
        });

        container.appendChild(increaseBtn);
        container.appendChild(resetWrapper);
        container.appendChild(decreaseBtn);

        document.body.appendChild(container);
    }

    function removeSpeedControls() {
        const container = document.getElementById('speed-controls');
        const msg = document.getElementById('speed-message');
        if (container) container.remove();
        if (msg) msg.remove();
    }

    const observer = new MutationObserver(() => addSpeedControls());
    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', addSpeedControls);

    window.addEventListener('keydown', e => {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        if (e.key === '+') adjustSpeed(0.25);
        if (e.key === ']') adjustSpeed(0.25);
        if (e.key === '-') adjustSpeed(-0.25);
        if (e.key === '[') adjustSpeed(-0.25);
        if (e.key === '=') adjustSpeed(0);
    });
})();
