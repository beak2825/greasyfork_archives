// ==UserScript==
// @name         Wanikani: Burn Celebration
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Plays a celebration sound and shows confetti when you burn an item
// @author       Alterux
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @license      MIT; http://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469231/Wanikani%3A%20Burn%20Celebration.user.js
// @updateURL https://update.greasyfork.org/scripts/469231/Wanikani%3A%20Burn%20Celebration.meta.js
// ==/UserScript==

(function ($, wkof) {
    // Constants
    const DEG_TO_RAD = Math.PI / 180;
    const FRAME_RATE = 60;
    const DT = 1.0 / FRAME_RATE;
    const COLORS = [
        ["#df0049", "#660671"],
        ["#00e857", "#005291"],
        ["#2bebbc", "#05798a"],
        ["#ffd200", "#b06c00"]
    ];

    let lastBurnedKanji = '';
    let interval;
    let confettiPapers = [];
    let settings = {};

    class Vector2 {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
    }

    class ConfettiPaper {
        constructor(_x, _y) {
            this.pos = new Vector2(_x, _y);
            this.rotationSpeed = Math.random() * 600 + 800;
            this.angle = DEG_TO_RAD * Math.random() * 360;
            this.rotation = DEG_TO_RAD * Math.random() * 360;
            this.cosA = 1.0;
            this.size = 5.0;
            this.oscillationSpeed = Math.random() * 1.5 + 0.5;
            this.xSpeed = 40.0;
            this.ySpeed = Math.random() * 60 + 50.0;
            this.time = Math.random();
            this.corners = Array.from({ length: 4 }, (_, i) => {
                let angle = this.angle + DEG_TO_RAD * (i * 90 + 45);
                return new Vector2(Math.cos(angle), Math.sin(angle));
            });
            let ci = Math.floor(Math.random() * COLORS.length);
            [this.frontColor, this.backColor] = COLORS[ci];
        }

        update() {
            this.time += DT;
            this.rotation += this.rotationSpeed * DT;
            this.cosA = Math.cos(DEG_TO_RAD * this.rotation);
            this.pos.x += Math.cos(this.time * this.oscillationSpeed) * this.xSpeed * DT;
            this.pos.y += this.ySpeed * DT;
            if (this.pos.y > window.innerHeight) {
                this.dead = true;
            }
        }

        draw(ctx) {
            ctx.fillStyle = this.cosA > 0 ? this.frontColor : this.backColor;
            ctx.beginPath();
            ctx.moveTo(
                this.pos.x + this.corners[0].x * this.size,
                this.pos.y + this.corners[0].y * this.size * this.cosA
            );
            for (let i = 1; i < 4; i++) {
                ctx.lineTo(
                    this.pos.x + this.corners[i].x * this.size,
                    this.pos.y + this.corners[i].y * this.size * this.cosA
                );
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    async function initializeWKOF() {
        if (!wkof) {
            if (confirm(`${script_name} requires WaniKani Open Framework.\nClick "OK" to be forwarded to installation instructions.`)) {
                window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
            }
            return;
        }

        await wkof.include('Menu,Settings');
        await wkof.ready('Settings,Menu');
        const defaults = {
            celebrationSound: 'enabled',
            celebrationConfetti: 'enabled'
        };
        settings = await wkof.Settings.load('burn_celebration', defaults);
        wkof.Menu.insert_script_link({
            name: 'burn_celebration',
            submenu: 'Settings',
            title: 'Burn Celebration',
            on_click: open_settings
        });
    }

    function open_settings() {
        const config = {
            script_id: 'burn_celebration',
            title: 'Burn Celebration',
            on_save: updateSettings,
            content: {
                celebrationSound: {
                    type: 'dropdown',
                    default: 'enabled',
                    label: 'Celebration Sound',
                    hover_tip: 'Play a celebration sound when you burn an item',
                    content: { disabled: 'Disabled', enabled: 'Enabled' },
                },
                celebrationConfetti: {
                    type: 'dropdown',
                    default: 'enabled',
                    label: 'Confetti Animation',
                    hover_tip: 'Show confetti when you burn an item',
                    content: { disabled: 'Disabled', enabled: 'Enabled' },
                },
            },
        };
        new wkof.Settings(config).open();
    }

    function updateSettings() {
        if (settings.celebrationSound !== 'disabled') {
            new Audio("https://toemat.com/wanikani/burnit.ogg").play();
        }
        if (settings.celebrationConfetti !== 'disabled') {
            startConfetti();
        }
    }

    function startConfetti() {
        if (interval) {
            clearInterval(interval);
            confettiPapers = [];
        }
        let confettiPaperCount = 100;
        for (let i = 0; i < confettiPaperCount; i++) {
            confettiPapers.push(new ConfettiPaper(Math.random() * window.innerWidth, Math.random() * (-50)));
        }
        interval = setInterval(updateConfetti, 1000.0 / FRAME_RATE);
    }

    function updateConfetti() {
        let canvas = document.getElementById("confettiCanvas") || createConfettiCanvas();
        let ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const paper of confettiPapers) {
            paper.update();
            paper.draw(ctx);
        }

        confettiPapers = confettiPapers.filter(paper => !paper.dead);
        if (!confettiPapers.length) {
            clearInterval(interval);
            canvas.remove();
        }
    }

    function createConfettiCanvas() {
        let canvas = document.createElement('canvas');
        canvas.id = "confettiCanvas";
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.zIndex = "9999";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.pointerEvents = "none"; // This allows click events to pass through the canvas.
        document.body.appendChild(canvas);
        return canvas;
    }

    window.addEventListener('didChangeSRS', (e) => {
        const srs = e.detail.newLevelText;
        const currentKanji = document.querySelector('.character-header__characters').textContent;

        if (/burn/i.test(srs) && currentKanji !== lastBurnedKanji) {
            lastBurnedKanji = currentKanji;
            if (settings.celebrationSound !== 'disabled') {
                new Audio("https://toemat.com/wanikani/burnit.ogg").play();
            }
            if (settings.celebrationConfetti !== 'disabled') {
                startConfetti();
            }
        }
    });

    initializeWKOF();

})(window.jQuery, window.wkof);
