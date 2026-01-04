// ==UserScript==
// @name         Auto Liker for Tinder & Boo
// @namespace    http://tampermonkey.net/
// @version      4.4
// @description  Auto Like με neon κουμπί, counter, progress ring & smart pause για Tinder και Boo 🔥
// @author       ThomasT
// @match        https://tinder.com/app/recs
// @match        https://boo.world/*/match
// @grant        none
// @license      if you want to change something tell me on the mail (thomasthanos28@gmail.com)

// @downloadURL https://update.greasyfork.org/scripts/535238/Auto%20Liker%20for%20Tinder%20%20Boo.user.js
// @updateURL https://update.greasyfork.org/scripts/535238/Auto%20Liker%20for%20Tinder%20%20Boo.meta.js
// ==/UserScript==

/*
License Notice:
 
This script is provided under a permissive license similar to MIT.
 
✅ You are free to use, copy, modify, merge, publish, and distribute this software for any purpose.
 
⚠️ If you modify, fork, or publicly share a version of this script, please notify the original author at: thomasthanos28@gmail.com
 
No warranty is provided. Use at your own risk.
*/


(function () {
    'use strict';

    let intervalId = null;
    let likeCount = 0;
    let failCount = 0;
    const maxFails = 4;

    function clickLikeButton() {
        const isOnBoo = location.hostname.includes('boo.world');

        let likeBtn = null;

        if (isOnBoo) {
            // Boo: βρίσκουμε div με canvas 48x48 (καρδούλα)
            const candidates = [...document.querySelectorAll('div.cursor-pointer')];
            likeBtn = candidates.find(div =>
                div.querySelector('canvas[width="48"][height="48"]')
            );
        } else {
            // Tinder: αναζητούμε κουμπί με "Μου αρέσει"
            const buttons = [...document.querySelectorAll('button')];
            likeBtn = buttons.find(btn => btn.textContent.trim() === 'Μου αρέσει');
        }

        if (likeBtn) {
            likeBtn.click();
            likeCount++;
            failCount = 0;
            updateCounter();
            updateRing();
            console.log(`💥 Like #${likeCount}`);
        } else {
            failCount++;
            console.log(`⚠️ Δεν βρέθηκε κουμπί (${failCount}/${maxFails})`);
            if (failCount >= maxFails) autoPause();
        }
    }

    function toggleAutoLike() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
            button.classList.remove('active');
            button.classList.add('paused');
            status.textContent = 'OFF';
            console.log('⏹️ Auto Like σταμάτησε');
        } else {
            intervalId = setInterval(clickLikeButton, 3000);
            button.classList.remove('paused');
            button.classList.add('active');
            status.textContent = 'ON';
            console.log('▶️ Auto Like ξεκίνησε');
        }
    }

    function autoPause() {
        clearInterval(intervalId);
        intervalId = null;
        button.classList.remove('active');
        button.classList.add('paused');
        status.textContent = 'PAUSED';
        console.log('⏸️ Auto Like έκανε pause λόγω αποτυχιών');
    }

    function updateCounter() {
        counter.textContent = `💖 ${likeCount}`;
    }

    function updateRing() {
        const percent = (likeCount % 100) / 100;
        ring.style.strokeDashoffset = 282 - (282 * percent);
    }

    // ---------- UI ----------
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.right = '30px';
    container.style.zIndex = '9999';
    container.style.width = '100px';
    container.style.height = '100px';

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '100');
    svg.setAttribute('height', '100');
    svg.innerHTML = `<circle cx="50" cy="50" r="45" stroke="#333" stroke-width="8" fill="none"/>
                     <circle id="ring" cx="50" cy="50" r="45" stroke="#00f2fe" stroke-width="8" fill="none"
                     stroke-linecap="round" stroke-dasharray="282" stroke-dashoffset="282" transform="rotate(-90 50 50)"/>`;
    container.appendChild(svg);

    const ring = svg.querySelector('#ring');

    const button = document.createElement('div');
    button.title = '🍑 Κάνε click για Auto Like';
    button.textContent = '🍑';
    Object.assign(button.style, {
        position: 'absolute',
        top: '10px',
        left: '10px',
        width: '80px',
        height: '80px',
        fontSize: '38px',
        background: 'linear-gradient(45deg, #ff00cc, #333399)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 0 20px #ff00cc, 0 0 40px #333399',
        transition: 'all 0.3s ease',
        userSelect: 'none'
    });
    container.appendChild(button);

    const counter = document.createElement('div');
    counter.textContent = '💖 0';
    Object.assign(counter.style, {
        position: 'absolute',
        top: '-25px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#fff',
        background: 'rgba(0,0,0,0.6)',
        padding: '4px 10px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    });
    container.appendChild(counter);

    const status = document.createElement('div');
    status.textContent = 'OFF';
    Object.assign(status.style, {
        position: 'absolute',
        bottom: '-20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        fontWeight: 'bold',
        color: '#fff'
    });
    container.appendChild(status);

    button.addEventListener('click', toggleAutoLike);
    document.body.appendChild(container);

    const style = document.createElement('style');
    style.textContent = `
        div[title='🍑 Κάνε click για Auto Like']:hover {
            transform: scale(1.1);
            box-shadow: 0 0 30px #00f2fe, 0 0 60px #4facfe;
        }
        .active {
            background: linear-gradient(45deg, #00f2fe, #4facfe) !important;
            box-shadow: 0 0 20px #00f2fe, 0 0 40px #4facfe !important;
            animation: pulse 1.5s infinite;
        }
        .paused {
            background: linear-gradient(45deg, #ff416c, #ff4b2b) !important;
            box-shadow: 0 0 20px #ff416c, 0 0 40px #ff4b2b !important;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.15); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
})();
