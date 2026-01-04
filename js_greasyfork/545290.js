// ==UserScript==
// @name         Lichess Predator Vision Overlay
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Predator vision thermal overlay with heat shimmer, triangular reticle, numeric stream, and draggable anchored toggle button.
// @match        https://lichess.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545290/Lichess%20Predator%20Vision%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/545290/Lichess%20Predator%20Vision%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Load saved position or default
    let savedPos = localStorage.getItem('predatorVisionBtnPos');
    let pos = savedPos ? JSON.parse(savedPos) : null;

    // Default: under Terminator Vision button (shift 50px down)
    const defaultTop = pos ? pos.top : 156;
    const defaultRight = pos ? null : 154;

    // Create toggle button
    const btn = document.createElement('button');
    btn.textContent = 'Predator Vision';
    Object.assign(btn.style, {
        position: 'fixed',
        top: `${defaultTop}px`,
        right: defaultRight !== null ? `${defaultRight}px` : '',
        left: pos ? `${pos.left}px` : '',
        zIndex: 999999,
        padding: '8px 14px',
        background: '#004400',
        color: 'lime',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontFamily: 'Consolas, monospace',
        userSelect: 'none',
        boxShadow: '0 0 8px lime',
        letterSpacing: '0.05em',
        touchAction: 'none',
    });
    btn.addEventListener('mouseenter', () => btn.style.backgroundColor = '#006600');
    btn.addEventListener('mouseleave', () => btn.style.backgroundColor = '#004400');
    document.body.appendChild(btn);

    // Dragging logic
    let dragging = false, dragStartX = 0, dragStartY = 0, btnStartLeft = 0, btnStartTop = 0;
    btn.addEventListener('mousedown', e => {
        dragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const rect = btn.getBoundingClientRect();
        btnStartLeft = rect.left;
        btnStartTop = rect.top;
        e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        let newLeft = btnStartLeft + (e.clientX - dragStartX);
        let newTop = btnStartTop + (e.clientY - dragStartY);
        newLeft = Math.min(window.innerWidth - btn.offsetWidth, Math.max(0, newLeft));
        newTop = Math.min(window.innerHeight - btn.offsetHeight, Math.max(0, newTop));
        btn.style.left = `${newLeft}px`;
        btn.style.top = `${newTop}px`;
        btn.style.right = '';
        localStorage.setItem('predatorVisionBtnPos', JSON.stringify({left: newLeft, top: newTop}));
    });
    window.addEventListener('mouseup', () => dragging = false);

    // Overlay container
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 50, 0, 0.6)',  // greener overlay
        zIndex: 999998,
        pointerEvents: 'none',
        display: 'none',
        overflow: 'hidden'
    });

    // Heatmap shimmer filter
    overlay.style.backdropFilter = 'contrast(200%) saturate(250%) hue-rotate(90deg)';

    // Shimmer effect
    const shimmer = document.createElement('div');
    Object.assign(shimmer.style, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(rgba(0,255,0,0.1), transparent)',
        mixBlendMode: 'screen',
        animation: 'heatShimmer 2s infinite linear',
        opacity: 0.4
    });
    overlay.appendChild(shimmer);

    // Numeric stream box (only numeric box now)
    const numStream = document.createElement('div');
    Object.assign(numStream.style, {
        position: 'fixed',
        top: '300px',
        right: '20px',
        width: '80px',
        height: '170px',  // reduced height to fit lines better
        color: 'lime',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fontSize: '14px',
        background: 'rgba(0,0,0,0.3)',
        textShadow: '0 0 10px lime',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 40,
        userSelect: 'none',
        paddingLeft: '4px',  // slight left shift to avoid cutoff
        lineHeight: '1.2',
        letterSpacing: '0.07em',
        borderRadius: '8px 0 0 8px',
    });
    overlay.appendChild(numStream);

    const chars = '0123456789ABCDEF';
    const lineCount = 10;
    const lines = [];
    for(let i=0; i<lineCount; i++){
        const span = document.createElement('span');
        span.textContent = Array.from({length:12}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
        span.style.opacity = Math.random() * 0.5 + 0.5;
        numStream.appendChild(span);
        if (i < lineCount - 1) {
            numStream.appendChild(document.createElement('br'));  // no br after last line
        }
        lines.push(span);
    }

    function animateNumStream(){
        lines.forEach(line => {
            if(Math.random() < 0.05){ // slower updates
                line.textContent = Array.from({length:12}, () => chars[Math.floor(Math.random()*chars.length)]).join('');
            }
        });
        requestAnimationFrame(animateNumStream);
    }

    // Text labels in corners and top center
    function createTextLabel(text, styles){
        const d = document.createElement('div');
        d.textContent = text.toUpperCase();
        Object.assign(d.style, {
            position: 'fixed',
            color: 'lime',
            fontWeight: '900',
            fontFamily: 'Consolas, monospace',
            fontSize: '1.4rem',
            textShadow: '0 0 8px lime',
            userSelect: 'none',
            pointerEvents: 'none',
            letterSpacing: '0.1em',
            ...styles,
        });
        overlay.appendChild(d);
    }
    createTextLabel('PREDATOR MODE ACTIVATED', {top: '20px', left: '50%', transform: 'translateX(-50%)'});
    createTextLabel('THERMAL TARGET LOCKED', {top: '20px', left: '20px'});
    createTextLabel('SCANNING', {top: '20px', right: '20px'});

    // Triangular reticle element creation & animation
    const reticle = document.createElement('div');
    reticle.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
            <polygon points="40,5 75,75 5,75" stroke="lime" stroke-width="2" fill="none" />
            <circle cx="40" cy="50" r="5" fill="lime" />
        </svg>
    `;
    Object.assign(reticle.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 50,
    });
    overlay.appendChild(reticle);

    let reticleTime = 0;
    function animateReticle(){
        reticleTime += 0.015; // speed up slightly for smoothness
        const radius = 80;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const x = centerX + Math.cos(reticleTime) * radius;
        const y = centerY + Math.sin(reticleTime) * radius;

        reticle.style.left = `${x}px`;
        reticle.style.top = `${y}px`;

        requestAnimationFrame(animateReticle);
    }

    // Create waiting message at bottom center, big green with sharp border and pulsate
    const waitingMsg = document.createElement('div');
    waitingMsg.textContent = 'WAITING FOR GAME...';
    Object.assign(waitingMsg.style, {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'lime',
        fontWeight: '900',
        fontFamily: 'Consolas, monospace',
        fontSize: '5rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        userSelect: 'none',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        zIndex: 1000000,
        textShadow:
          '-2px -2px 0 #000,' +
          '2px -2px 0 #000,' +
          '-2px 2px 0 #000,' +
          '2px 2px 0 #000',
        animation: 'pulseSharp 2.5s ease-in-out infinite',
        display: 'none'  // initially hidden
    });
    document.body.appendChild(waitingMsg);

    // Keyframes for shimmer and pulse plus pulseSharp for waiting message
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulseGreen {
            0%, 100% { opacity: 1; text-shadow: 0 0 6px lime; }
            50% { opacity: 0.5; text-shadow: 0 0 2px green; }
        }
        @keyframes heatShimmer {
            0% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
        }
        @keyframes pulseSharp {
            0%, 100% {
                opacity: 1;
                text-shadow:
                  -2px -2px 0 #000,
                  2px -2px 0 #000,
                  -2px 2px 0 #000,
                  2px 2px 0 #000;
            }
            50% {
                opacity: 0.5;
                text-shadow:
                  -1px -1px 0 #222,
                  1px -1px 0 #222,
                  -1px 1px 0 #222,
                  1px 1px 0 #222;
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(overlay);

    // Toggle overlay on button click
    let active = false;
    btn.addEventListener('click', () => {
        active = !active;
        overlay.style.display = active ? 'block' : 'none';
        waitingMsg.style.display = active ? 'block' : 'none';  // Show waiting message only when overlay is ON
        btn.style.backgroundColor = active ? '#006600' : '#004400';
        if (active) {
            animateNumStream();
            animateReticle();
        }
    });

})();