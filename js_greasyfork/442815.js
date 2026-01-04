// ==UserScript==
// @name            Instagram Notification Displayer
// @description     Display the amount of notifications on Instagram Desktop similair to Discord.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @author          KyleRifqi
// @license         MIT
// @namespace       http://github.com/kylerifqi
// @match           *.instagram.com/*
// @version         1.0
// @supportURL      https://github.com/kylerifqi/instagram-notification-display/issues
// @downloadURL https://update.greasyfork.org/scripts/442815/Instagram%20Notification%20Displayer.user.js
// @updateURL https://update.greasyfork.org/scripts/442815/Instagram%20Notification%20Displayer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /**
    * Add notification badge (pill) to favicon in browser tab
    * @url stackoverflow.com/questions/65719387/
    * MODIFIED: _drawFavicon()
    */
    class Badger {
        canvas;
        ctx;
        faviconSize;
        offset;
        img;
        badgeSize;
        backgroundColor;
        color;
        size;
        position;
        radius;
        src;
        _value;
        constructor(options) {
            this.backgroundColor = '';
            this.color = '';
            this.size = 0;
            this.position = '';
            this.radius = 0;
            this.src = '';
            Object.assign(this, {
                backgroundColor: '#f00',
                color: '#fff',
                size: 0.6,
                position: 'ne',
                radius: 8,
                src: '', // Favicon source (dafaults to the <link> icon href)
            }, options);
            this.canvas = document.createElement('canvas');
            this.src = document.querySelector('link[rel$=icon]')?.href;
            this.ctx = this.canvas.getContext('2d');
            this.faviconSize = 0;
            this.offset = { x: 0, y: 0 };
            this.badgeSize = 0;
            this._value = 0;
            this.img = new Image();
            this.img.addEventListener('load', () => {
                this.faviconSize = this.img.naturalWidth;
                this.badgeSize = this.faviconSize * this.size;
                this.canvas.width = this.faviconSize;
                this.canvas.height = this.faviconSize;
                const sd = this.faviconSize - this.badgeSize;
                const sd2 = sd / 2;
                this.offset = {
                    n: { x: sd2, y: 0 },
                    e: { x: sd, y: sd2 },
                    s: { x: sd2, y: sd },
                    w: { x: 0, y: sd2 },
                    nw: { x: 0, y: 0 },
                    ne: { x: sd, y: 0 },
                    sw: { x: 0, y: sd },
                    se: { x: sd, y: sd },
                }[this.position] || { x: 0, y: 0 };
                this._draw();
            });
            this.img.src = this.src;
        }
        _drawIcon() {
            this.ctx.clearRect(0, 0, this.faviconSize, this.faviconSize);
            this.ctx.drawImage(this.img, 0, 0, this.faviconSize, this.faviconSize);
        }
        _drawShape() {
            const r = this.radius;
            const xa = this.offset.x;
            const ya = this.offset.y;
            const xb = this.offset.x + this.badgeSize;
            const yb = this.offset.y + this.badgeSize;
            this.ctx.beginPath();
            this.ctx.moveTo(xb - r, ya);
            this.ctx.quadraticCurveTo(xb, ya, xb, ya + r);
            this.ctx.lineTo(xb, yb - r);
            this.ctx.quadraticCurveTo(xb, yb, xb - r, yb);
            this.ctx.lineTo(xa + r, yb);
            this.ctx.quadraticCurveTo(xa, yb, xa, yb - r);
            this.ctx.lineTo(xa, ya + r);
            this.ctx.quadraticCurveTo(xa, ya, xa + r, ya);
            this.ctx.fillStyle = this.backgroundColor;
            this.ctx.fill();
            this.ctx.closePath();
        }
        _drawVal() {
            const margin = (this.badgeSize * 0.18) / 2;
            this.ctx.beginPath();
            this.ctx.textBaseline = 'middle';
            this.ctx.textAlign = 'center';
            this.ctx.font = `bold ${this.badgeSize * 0.82}px Arial`;
            this.ctx.fillStyle = this.color;
            this.ctx.fillText(this.value.toString(), this.badgeSize / 2 + this.offset.x, this.badgeSize / 2 + this.offset.y + margin);
            this.ctx.closePath();
        }
        _drawFavicon() {
            document.querySelectorAll('link[rel*=\'icon\']').forEach(elm => {
                elm.parentElement.removeChild(elm);
            });
            const link = document.createElement('link');
            link.type = 'image/x-icon';
            link.rel = 'shortcut icon';
            link.href = this.dataURL;
            document.getElementsByTagName('head')[0].appendChild(link);
        }
        _draw() {
            this._drawIcon();
            if (this.value)
                this._drawShape();
            if (this.value)
                this._drawVal();
            this._drawFavicon();
        }
        // Public functions / methods:
        update() {
            this._value = Math.min(99, parseInt(this._value.toString(), 10));
            this._draw();
        }
        get dataURL() {
            return this.canvas.toDataURL();
        }
        get value() {
            return this._value;
        }
        set value(val) {
            this._value = val;
            this.update();
        }
    }
    const myBadger = new Badger({
        size: 0.65,
        position: 'se',
        radius: 100,
    });
    const updateFavicon = () => {
        const title = document.title;
        const notifs = +(title.match(/\(([^)]+)\)/) ?? [0, 0])[1];
        myBadger.value = notifs;
        // console.log(myBadger.dataURL);
        // document.querySelector('img').src = myBadger.dataURL;
    };
    window.addEventListener('load', updateFavicon, false);
    new MutationObserver(updateFavicon).observe(document.querySelector('title'), {
        subtree: true,
        characterData: true,
        childList: true
    });
})();
