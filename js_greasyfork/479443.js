// ==UserScript==
// @name         Confetti Changer
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hijack submitty's confetti with our own colors (and more features soon™)
// @author       Colin SF
// @match        https://submit.scss.tcd.ie/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tcd.ie
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479443/Confetti%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/479443/Confetti%20Changer.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */ // so the linter doesn't complain about my formatting :)

// to test or preview these hex colors you can use https://www.w3schools.com/colors/colors_hexadecimal.asp or https://www.color-hex.com/
// color themes can be added just by adding a new const list on a new line

const JANUARY_COLORS   = ['#406BC9','#FFFFFF','#809BCE','#9AC8DE','#B6C7BE'];
const FEBRUARY_COLORS  = ['#DF3B57','#EE4B6A','#7D2335','#86CEC5','#B2E6F1'];
const MARCH_COLORS     = ['#8DB62F','#7B9233','#034121','#022607','#FFCC00'];
const APRIL_COLORS     = ['#EED149','#3BCA8B','#9EE0E7','#EBB8AA','#FFFFFF'];
const MAY_COLORS       = ['#F9EAE5','#F16878','#C1DBB3','#7EBC89','#FF8154'];
const JUNE_COLORS      = ['#EC4067','#F4D35E','#F78764','#00889F','#083D77'];
const JULY_COLORS      = ['#FFFFFF','#DE1A1A','#090C9B'];
const AUGUST_COLORS    = ['#F0A202','#FF4040','#F2C940','#AB2321'];
const SEPTEMBER_COLORS = ['#8FD7FF','#316498','#34CA34','#FFFF40','#FF2929','#9C84A4'];
const OCTOBER_COLORS   = ['#000000','#FF6700','#291528'];
const NOVEMBER_COLORS  = ['#5A351E','#522B47','#912F09','#F0A202','#FBF5F3'];
const DECEMBER_COLORS  = ['#D7CDCC','#F7B11D','#1F5E00','#DE1A1A','#FFFFFF'];
const DEFAULT_COLORS   = ['#8FD7FF','#316498','#34CA34','#FFFF40','#FF2929','#9C84A4'];
const MARTINI          = ['#BB0059','#FF1493','#00BFFF','#FFF0F5','#FF69B4','#ADD8E6'];          // sweet girl
const USER_COLORS      = ['#FFFFFF','#808080','#000000'];                                        // YOUR COLORS HERE!

// CONFETTI PARAMETERS
var CONFETTI_COLORS = MARTINI;       // Set color theme here, can change to any const above or "PER_MONTH" if you want submitty's naturally updating confetti
const CONFETTI_DENSITY = 0.75;       // must be a float between [0,inf), 1.0 is submitty's original behavior (but large values will probably tank performance)

// handle per-month confetti color choice
if ( CONFETTI_COLORS == "PER_MONTH" ) {
    let month = new Date().getMonth();
    CONFETTI_COLORS = [
        JANUARY_COLORS,
        FEBRUARY_COLORS,
        MARCH_COLORS,
        APRIL_COLORS,
        MAY_COLORS,
        JUNE_COLORS,
        JULY_COLORS,
        AUGUST_COLORS,
        SEPTEMBER_COLORS,
        OCTOBER_COLORS,
        NOVEMBER_COLORS,
        DECEMBER_COLORS
    ][month];
}

// copy the page's addConfetti() func, alter it so it always uses whatever colors we want
// and then substitute it for the window's original function to customize our confetti
// ( NB: you should never have to go in here unless you're curious :) )
function addConfetti() {
    const canvas = document.getElementById('confetti_canvas');
    if (!canvas) {
        return;
    }
    let times_ran = 0;
    let frame = 0;

    //destroy the canvas animation on click or on enter
    canvas.addEventListener('click', () => {
        if (canvas.style.display !== 'none') {
            canvas.style.display = 'none';
            return;
        }
    });

    window.addEventListener('keypress', (e) => {
        if (e.code === 'Enter' && canvas.style.display !== 'none') {
            canvas.style.display = 'none';
            return;
        }
        if (e.key === 'p' || e.key === 'P'){
            confettiPaused = !confettiPaused;
        }
    });

    // Resume confetti animation when window is visible again
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && is_drawing) {
            lastUpdateTime = Date.now();
            draw();
        }
    });

    canvas.width = window.innerWidth;
    const body = document.body;
    const html = document.documentElement;
    canvas.height = Math.max( body.scrollHeight, body.offsetHeight,
                             html.clientHeight, html.scrollHeight, html.offsetHeight );

    canvas.style.display = 'block';

    const ctx = canvas.getContext('2d');
    const pieces = [];
    const numberOfPieces = 2500 * CONFETTI_DENSITY;
    let lastUpdateTime = Date.now();
    const x_const = 0.25;
    const max_times = 250;
    const size_const = 10;
    const gravity_const = 0.25;

    let is_drawing = false;

    function randomColor () {
        return CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    }

    function update () {
        const now = Date.now(),
              dt = now - lastUpdateTime;

        for (let i = pieces.length - 1; i >= 0; i--) {
            const p = pieces[i];

            if (p.y > canvas.height) {
                pieces.splice(i, 1);
                continue;
            }

            p.y += p.gravity * dt;
            p.rotation += p.rotationSpeed * dt;
            p.x += p.x_vel;
        }

        while (pieces.length < numberOfPieces && times_ran < max_times) {
            pieces.push(new Piece(Math.random() * canvas.width, -20));
        }

        lastUpdateTime = now;

        times_ran ++;

        if (times_ran >= max_times * 10) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            canvas.style.display = '';
            canvas.width = 0;
            canvas.height = 0;
        }

    }

    function draw () {

        if (canvas.style.display === 'none') {
            cancelAnimationFrame(frame);
            is_drawing = false;
            return;
        }

        is_drawing = true;

        // Stop the confetti animation if the page is not visible
        if (document.visibilityState === 'hidden') {
            cancelAnimationFrame(frame);
            return;
        }

        update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach((p) => {
            ctx.save();

            ctx.fillStyle = p.color;

            ctx.translate(p.x + p.size / 25, p.y + p.size / 2);
            ctx.rotate(p.rotation);

            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

            ctx.restore();
        });

        frame = requestAnimationFrame(draw);
    }

    function Piece (x, y) {
        this.x = x;
        this.y = y;
        this.x_vel = (Math.random() - 0.5) * x_const;
        this.size = (Math.random() * 0.5 + 0.75) * size_const;
        this.gravity = (Math.random() * 0.5 + 0.75) * gravity_const;
        this.rotation = (Math.PI * 2) * Math.random();
        this.rotationSpeed = (Math.PI * 2) * (Math.random() - 0.5) * 0.0015;
        this.color = randomColor();
    }

    while (pieces.length < numberOfPieces) {
        pieces.push(new Piece(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    draw();
}

(function() {
    'use strict';
    window.addConfetti = addConfetti;
})();