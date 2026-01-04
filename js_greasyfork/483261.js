// ==UserScript==
// @name         Better Dashboard - New Years
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enhance dashboard appearance
// @author       Paul Braswell (Siepe)
// @match        http://manage.siepe.local/ConnectwiseTools/ServiceBoard/IT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=siepe.local
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/483261/Better%20Dashboard%20-%20New%20Years.user.js
// @updateURL https://update.greasyfork.org/scripts/483261/Better%20Dashboard%20-%20New%20Years.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `

    :root {
        --table-bg-color: #1a1a1a;
        --table-head-bg-color: #2b2b2b;
        --table-head-secondary-bg-color: #3c3c3c;
        --table-head-border-color: rgba(60, 60, 60, 0.5);
        --table-footer-border-color: #2b2b2b;
        --table-footer-cell-border-color: rgba(60, 60, 60, 0.5);
        --table-footer-bg-color: #2b2b2b;
        --table-head-color: #4d4d4d;
        --table-striped-row-color: #1a1a1a;
        --table-striped-alt-row-color: #121212;
        --table-striped-alt-row-hover-color: #0a0a0a;
        --table-border-color: #2b2b2b;
        --table-borderless-border-color: #2b2b2b;
        --table-borderless-bg-color: transparent;
        --table-foot-bg-color: transparent;
        --table-danger-bg-color: #2b1a1a;
        --table-danger-color: #3c3c3c;
        --table-warning-bg-color: #2b2b1a;
        --table-warning-color: #3c3c3c;
        --table-column-filter-color: #4d4d4d;
        --table-column-filter-active-color: #5e5e5e;
        --col-filter-active-bg-color: rgba(60, 60, 60, 0.15);
        --col-filter-active-color: #5e5e5e;
        --table-grouping-row-bg-color: #0a0a0a;
        --table-pager-border-color: rgba(60, 60, 60, 0.5);
        --cell-selected-bg-color: #3c3c3c;
        --cell-selected-border-color: #4d4d4d;
        --grid-toolbar-button-color: #4d4d4d;
        --grid-toolbar-button-bg-color: #1a1a1a;
        --grid-toolbar-border-color: #4d4d4d;
        --row-selected-bg-color: #3c3c3c;
        --empty-grid-bg-color: #3c3c3c;
        --empty-grid-border-color: rgba(77, 77, 77, 0.5);
        --empty-grid-color: #4d4d4d;
        --ag-column-resize-handle-color: #4d4d4d;
        --modal-header-color: #4d4d4d;
        --modal-header-border-color: #3c3c3c;
        --modal-header-bg-color: #1a1a1a;
        --modal-footer-bg-color: #121212;
        --modal-footer-border-color: #2b2b2b;
        --modal-content-bg-color: #1a1a1a;
        --modal-body-bg-color: #1a1a1a;
        --modal-close-btn-color: #4d4d4d;
        --modal-drop-shadow: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
        --modal-dialog-content-bg-color: #1a1a1a;
        --modal-dialog-body-bg-color: #1a1a1a;
        --modal-dialog-footer-bg-color: #1a1a1a;
        --modal-scroller-bg-color: rgba(60, 60, 60, 0.75);
        --tab-bg-color: transparent;
        --tab-color: #4d4d4d;
        --tab-border-color: #4d4d4d;
        --tab-active-color: #5e5e5e;
        --tab-active-border-color: #5e5e5e;
        --tab-active-bg-color: transparent;
        --tab-content-bg-color: transparent;
        --tab-dropdown-bg-color: #1a1a1a;
        --tab-dropdown-color: #3c3c3c;
        --tab-dropdown-hover-color: #4d4d4d;
        --tab-dropdown-hover-bg-color: #5e5e5e;
        --tab-modal-body-bg-color: #3c3c3c;
        --tab-modal-content-bg-color: transparent;
        --tab-hover-bg-color: #3c3c3c;
        --tab-dropdown-active-bg-color: #3c3c3c;
        --tab-dropdown-active-check-color: #5e5e5e;
        --panel-heading-bg-color: #1a1a1a;
        --panel-heading-color: #3c3c3c;
        --panel-footer-bg-color: #1a1a1a;
        --panel-footer-color: #2b2b2b;
        --panel-body-bg-color: #121212;
        --panel-bg-color: #121212;
        --panel-border-color: #1a1a1a;
        --list-panel-heading-bg-color: #1a1a1a;
        --list-panel-heading-color: #2b2b2b;
        --list-panel-item-bg-color: #121212;
        --list-panel-bg-color: #121212;
        --list-panel-item-color: #2b2b2b;
        --list-panel-border-color: #1a1a1a;
        --list-panel-drop-shadow: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.4));
        --list-panel-item-hover-bg-color: #0a0a0a;
        --panel-link-color: #2b2b2b;
        --panel-badge-primary-bg-color: #1a1a1a;
        --panel-badge-primary-hover-bg-color: #1a1a1a;
        --panel-link-hover-box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.4), 0 8px 10px 1px rgba(0, 0, 0, 0.3), 0 3px 14px 2px rgba(0, 0, 0, 0.2);
        --panel-empty-bg-color: #1a1a1a;
        --panel-empty-border-color: rgba(0, 0, 0, 0.5);
        --panel-empty-color: #2b2b2b;
        --panel-list-heading-bg-color: #1a1a1a;
        --pager-btn-bg-color: transparent;
        --pager-btn-border-color: #1a1a1a;
        --pager-btn-color: rgba(60, 60, 60, 0.75);
        --pager-btn-active-color: #2b2b2b;
        --pager-btn-active-bg-color: rgba(0, 0, 0, 0.25);
        --pager-btn-active-border-color: rgba(0, 0, 0, 0.75);
        --pager-btn-arrow-color: #2b2b2b;
        --pager-btn-arrow-bg-color: transparent;
        --pager-btn-hover-color: rgba(60, 60, 60, 0.75);
        --pager-btn-hover-bg-color: rgba(0, 0, 0, 0.1);
        --pager-btn-hover-border-color: rgba(0, 0, 0, 0.25);
        --pager-dropdown-border-color: rgba(0, 0, 0, 0.5);
        --pager-dropdown-active-border-color: rgba(0, 0, 0, 0.75);
        --pager-dropdown-color: #2b2b2b;
        --pager-dropdown-bg-color: #1a1a1a;
        --scroller-bg-color: #121212;
        --scroller-fg-color: #292929;
    }

    * {
        color: white !important;
    }


    .text-danger {
    color: white !important;
}

    .text-success {
    color: cyan !important;
}
/*
    .halloween-pumpkin {
    position: fixed;
    top: 33%;
    left: 5%;
    width: 170px;
    height: 170px;
    background: url('https://i.imgur.com/MzLs30I.png') no-repeat center center;
    background-size: contain;
    z-index: 9999;
    }
*/
    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    html, body {
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    body {
            background-color: black !important;
    }
    `;

    const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


    let canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '9999';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let context = canvas.getContext('2d');
    let fireworks = [];
    let maxFireworks = 7; // Maximum number of fireworks launched at the same time

    class Firework {
        constructor() {
            this.x = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1; // Launch between 10-90% width
            this.y = canvas.height;
            this.speed = Math.random() * 6 + 10; // Faster speed
            this.angle = Math.PI / 2; // Straight up
            this.color = Math.floor(Math.random() * 360);
            this.size = Math.random() * 2 + 1; // Smaller size
            this.minExplodeSpeed = 2;
        }

        update() {
            this.y -= this.speed;
            this.speed *= 0.98; // Slight reduction in speed
        }

        draw() {
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fillStyle = 'hsl(' + this.color + ', 100%, 50%)';
            context.fill();
        }

        explode() {
            for (let i = 0; i < 100; i++) {
                let particle = new Particle(this.x, this.y, this.color);
                particles.push(particle);
            }
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speed = Math.random() * 3 + 1;
            this.angle = Math.random() * Math.PI * 2;
            this.color = color;
            this.alpha = 1;
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.alpha -= 0.02; // Fade out
        }

        draw() {
            context.globalAlpha = this.alpha;
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fillStyle = 'hsl(' + this.color + ', 100%, 50%)';
            context.fill();
            context.globalAlpha = 1;
        }
    }

    let particles = [];

    function createFirework() {
        if (fireworks.length < maxFireworks) {
            let firework = new Firework();
            fireworks.push(firework);
        }
    }

    function updateFireworks() {
    for (let i = fireworks.length - 1; i >= 0; i--) {
        let firework = fireworks[i];
        firework.update();
        // Explode if the firework is above a certain height or its speed drops below the minimum
        if (firework.y < canvas.height * (Math.random() * 0.3 + 0.1) || firework.speed < firework.minExplodeSpeed) {
            firework.explode();
            fireworks.splice(i, 1);
        }
    }
}

    function updateParticles() {
        for (let i = particles.length - 1; i >= 0; i--) {
            let particle = particles[i];
            particle.update();
            if (particle.alpha <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function drawFireworks() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        fireworks.forEach(firework => firework.draw());
    }

    function drawParticles() {
        particles.forEach(particle => particle.draw());
    }

function isTopOfHour() {
    const now = new Date();
    return now.getMinutes() === 0 && now.getSeconds() === 0; // Check if it's the top of the hour
}

let grandFinaleActive = false;
let finaleStartTime;

function startGrandFinale() {
    grandFinaleActive = true;
    finaleStartTime = Date.now();
    for (let i = 0; i < 20 + Math.floor(Math.random() * 21); i++) { // Launch 20-40 fireworks
        setTimeout(createFirework, i * (10000 / 40)); // Distribute them over 10 seconds
    }
}

function checkForGrandFinale() {
    if (isTopOfHour() && !grandFinaleActive) {
        startGrandFinale();
    }
    if (grandFinaleActive && Date.now() - finaleStartTime > 10000) { // 10 seconds have passed
        grandFinaleActive = false; // Reset the finale flag after 10 seconds
    }
}

function loop() {
    requestAnimationFrame(loop);
    checkForGrandFinale(); // Check if it's time for the grand finale
    updateFireworks();
    updateParticles();
    drawFireworks();
    drawParticles();
}

    setInterval(createFirework, 1000); // Launch a new firework every second
    loop();
})();