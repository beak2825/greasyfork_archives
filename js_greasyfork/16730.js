// ==UserScript==
// @name FS.to del Ads
// @namespace Lain&Arch-vers
// @description Ads remove
// @include *://fs.to/*
// @include *://cxz.to/*
// @include *://brb.to/*
// @version 2.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16730/FSto%20del%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/16730/FSto%20del%20Ads.meta.js
// ==/UserScript==

var divs = document.getElementsByTagName('div');
var re = /\w{1,5}\d{1,5}\w{1,5}\d{1,5}/;
for(var i = 0; i < divs.length; i++)
    if(re.test(divs[i].className))
        divs[i].style.display = 'none';

var style = document.head.appendChild( document.createElement('style') );
style.type = 'text/css';

style.sheet.insertRule(['.b-aplayer-teasers > a',
                        '.b-player-popup__content > div[class][style="position: relative;"]',
                        'div[class^="b-adproxy"]',
                        'div[id^="admixer_async_"]'
                       ].join(',')+'{display:none!important}', 0);

if (/\/view_iframe\//i.test(document.location.pathname)) {
    var p = document.querySelector('#player:not([preload="auto"])'),
        m = document.querySelector('.main'),
        adStepper = function(p) {
            if (p.currentTime < p.duration)
                p.currentTime++;
        },
        cl = function(p) {
            function skipListener() {
                p.pause();
                p.classList.add('m-hidden');
                setTimeout(adStepper, 1000, p);
            }
            p.addEventListener('timeupdate', skipListener, false);
        },
        o = new MutationObserver(function (mut) {
            mut.forEach(function (e) {
                for (var i = 0; i < e.addedNodes.length; i++) {
                    if (e.addedNodes[i].id === 'player' &&
                        e.addedNodes[i].nodeName === 'VIDEO' &&
                        e.addedNodes[i].getAttribute('preload') != 'auto') {
                        cl(e.addedNodes[i]);
                    }
                }
            });
        });
    if (p.nodeName === 'VIDEO')
        cl(p);
    else
        o.observe(m, {childList: true});
}