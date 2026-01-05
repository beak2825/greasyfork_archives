// ==UserScript==
// @name        W3C-Noto
// @description W3C site, using Noto Sans
// @namespace   https://tripu.info/
// @version     0.3.1
// @include     http://w3.org/*
// @include     http://*.w3.org/*
// @include     https://w3.org/*
// @include     https://*.w3.org/*
// @license     MIT
// @supportURL  https://tripu.info/
// @author      tripu
// @downloadURL https://update.greasyfork.org/scripts/28208/W3C-Noto.user.js
// @updateURL https://update.greasyfork.org/scripts/28208/W3C-Noto.meta.js
// ==/UserScript==

console.debug('[W3C-Noto] Start');

(() => {
    'use strict';
    if (document && document.getElementsByTagName && document.createElement) {
        var head = document.getElementsByTagName('head');
        if (head && 1 === head.length) {
            const link = document.createElement('link'),
                  style = document.createElement('style');
            head = head[0];
            link.setAttribute('href', '//www.w3.org/People/Antonio/noto/noto-tmp.css');
            link.setAttribute('rel', 'stylesheet');
            style.innerText = `
                :not(pre):not(ol):not(ul) {
                    line-height: 1.5;
                }
                pre, pre *, ol, ol *, ul, ul * {
                    line-height: 1.25;
                }
                :not(code):not(pre) {
                    font-family: 'Noto Sans', sans-serif;
                }
                code, code *, pre, pre * {
                    font-family:  'Inconsolata', monospace !important;
                }
            `;
            head.appendChild(link);
            head.appendChild(style);
            console.debug('[W3C-Noto] Done');
        } else
            console.debug('[W3C-Noto] No head');
    } else
        console.debug('[W3C-Noto] No document');
})();

console.debug('[W3C-Noto] End');
