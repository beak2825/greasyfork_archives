// ==UserScript==
// @name         Manga Chapter Changer
// @description  Change chapters with a hotkey. For Mangakakalot & Manganelo & ReaperScans
// @version      1.0.1
// @author       sllypper
// @homepage     https://greasyfork.org/en/users/55535-sllypper
// @namespace    sllypper
// @match        *://mangakakalot.com/chapter/*
// @match        *://manganelo.com/chapter/*
// @match        *://reaperscans.com/comics/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418594/Manga%20Chapter%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/418594/Manga%20Chapter%20Changer.meta.js
// ==/UserScript==


//
// Smooth Scrolling moved to its own script. It has been updated and is now better than ever. I'm sorry for the inconvenience.
// It can now be found at https://greasyfork.org/en/scripts/423926-smooth-scrolling
//


(function() {
    'use strict';

    // some code is borrowed/modified/inspired from Manga Reader. Manga Reader is awesome and I learned a lot from it.

    let implementations = [
        {
            name: 'mangakakalot',
            match: '^https?://mangakakalot.com/chapter/*',
            nextchap: function(prev) {
                let nextButtonSel = '.btn-navigation-chap > .back';
                let prevButtonSel = '.btn-navigation-chap > .next';

                if (!prev) return document.querySelector(nextButtonSel);
                return document.querySelector(prevButtonSel);
            },
            prevchap: function() {
                return this.nextchap(true);
            },
            imgSelector: '.container-chapter-reader > img'
        },
        {
            name: 'manganelo',
            match: '^https?://manganelo.com/chapter/*',
            nextchap: function(prev) {
                let nextButtonSel = '.navi-change-chapter-btn-next';
                let prevButtonSel = '.navi-change-chapter-btn-prev';

                if (!prev) return document.querySelector(nextButtonSel);
                return document.querySelector(prevButtonSel);
            },
            prevchap: function() {
                return this.nextchap(true);
            },
            imgSelector: '.container-chapter-reader > img'
        },
        {
            name: 'reaperscans',
            match: '^https?://reaperscans.com/comics/*',
            nextchap: function(prev) {
                let buttons = document.querySelector('div.d-flex:nth-child(4)');

                if (!prev) return buttons.querySelector('div:nth-child(3) > a');
                return buttons.querySelector('div:nth-child(1) > a');
            },
            prevchap: function() {
                return this.nextchap(true);
            }
        }
    ];


    let clickEl = el => {
        if (!el) return;
        el.click();
    }

    let loadHotkeys = imp => {
        window.addEventListener('keydown', event => {
            switch(event.code) {
                case 'KeyC':
                    clickEl(imp.nextchap());
                    break;
                case 'KeyZ':
                    clickEl(imp.prevchap());
                    break;
                case 'Minus':
                    changeZoom('-', imp.imgSelector);
                    break;
                case 'Equal':
                    changeZoom('+', imp.imgSelector);
                    break;
                case 'Digit0':
                    changeZoom('=', imp.imgSelector);
                    break;
            }
        });
    }

    let pageUrl = window.location.href;
    let imgBag;

    implementations.some(function(imp) {
        if (imp.match && (new RegExp(imp.match, 'i')).test(pageUrl)) {
            imgBag = Array.from(document.querySelectorAll(imp.imgSelector));
            loadHotkeys(imp);
            return true;
        }
    });

    // zoom
    var lastZoom, originalZoom, newZoomPostion;
    var changeZoom = function(action, imgSelector) {
        var ratioZoom = (document.documentElement.scrollTop || document.body.scrollTop)/(document.documentElement.scrollHeight || document.body.scrollHeight);
        var curImage = getCurrentImage();
        if(!lastZoom) {
            lastZoom = originalZoom = Math.round(curImage.clientWidth / window.innerWidth * 100);
        }
        var zoom = lastZoom;
        if(action === '+') zoom += 5;
        if(action === '-') zoom -= 5;
        if(action === '=') {
            lastZoom = originalZoom;
            addStyle('image-width', true, '');
            //showFloatingMsg('reset zoom', 500);
            newZoomPostion =(document.documentElement.scrollHeight || document.body.scrollHeight)*ratioZoom;
            window.scroll(0, newZoomPostion);
            return;
        }
        zoom = Math.max(10, Math.min(zoom, 100));
        lastZoom = zoom;
        addStyle('image-width', true, toStyleStr({
            width: zoom + '%'
        }, imgSelector));
        //showFloatingMsg('zoom: ' + zoom + '%', 500);
        newZoomPostion =(document.documentElement.scrollHeight || document.body.scrollHeight)*ratioZoom;
        window.scroll(0, newZoomPostion);
    };

    let SStyles = {}

    var addStyle = function(id, replace) {
        if(!SStyles[id]) {
            SStyles[id] = document.createElement('style');
            SStyles[id].dataset.name = 's-style-' + id;
            document.head.appendChild(SStyles[id]);
        }
        var style = SStyles[id];
        var css = [].slice.call(arguments, 2).join('\n');
        if(replace) {
            style.textContent = css;
        } else {
            style.textContent += css;
        }
        console.log(SStyles)
    };

    var toStyleStr = function(obj, selector) {
        var stack = [],
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                stack.push(key + ':' + obj[key]);
            }
        }
        if (selector) {
            return selector + '{' + stack.join(';') + '}';
        } else {
            return stack.join(';');
        }
    };

    var getCurrentImage = function() {
        var image;
        imgBag.some(function(img) {
            image = img;
            return img.getBoundingClientRect().bottom > 200;
        });
        return image;
    };

})();