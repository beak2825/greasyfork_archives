// ==UserScript==
// @name        fs.to: skip ads
// @namespace   lainscripts_fsto_skipads
// @include     *://fs.to/*/view_iframe/*
// @include     *://cxz.to/*/view_iframe/*
// @include     *://brb.to/*/view_iframe/*
// @version     1.3
// @grant       none
// @description Attepmts to skip pre-roll video ads on fs.to, cxz.to and brb.to.
// @downloadURL https://update.greasyfork.org/scripts/12393/fsto%3A%20skip%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/12393/fsto%3A%20skip%20ads.meta.js
// ==/UserScript==
var p = document.querySelector('#player:not([preload="auto"])'),
    m = document.querySelector('.main'),
    adStepper = function(p) {
        if (p.currentTime < p.duration)
            p.currentTime++;
    },
    adSkipper = function(f, p) {
        f.click();
        p.waitAfterSkip = false;
        console.log('Пропущена.');
    },
    cl = function(p) {
        var faster = document.querySelector('.b-aplayer__html5-desktop-skip');

        function skipListener() {
            if (p.waitAfterSkip) {
                console.log('Доступен быстрый пропуск рекламы…');
                return;
            }
            p.pause();
            if (!p.classList.contains('m-hidden'))
                p.classList.add('m-hidden');
            if (faster &&
                window.getComputedStyle(faster).display == 'block' &&
                !faster.querySelector('.b-aplayer__html5-desktop-skip-timer')) {
                p.waitAfterSkip = true;
                setTimeout(adSkipper, 1000, faster, p);
            } else
                setTimeout(adStepper, 1000, p);
        }

        p.addEventListener('timeupdate', skipListener, false);
    },
    o = new MutationObserver(function (mut) {
        mut.forEach(function (e) {
            for (var i = 0; i < e.addedNodes.length; i++) {
                if (e.addedNodes[i].id === 'player' && e.addedNodes[i].nodeName === 'VIDEO' && e.addedNodes[i].getAttribute('preload') != 'auto') {
                    cl(e.addedNodes[i]);
                }
            }
        });
    });

if (p.nodeName === 'VIDEO')
    cl(p);
else
    o.observe(m, {childList: true});

var style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode('.b-aplayer-teasers>a{display:none!important}'));
document.head.appendChild(style);
