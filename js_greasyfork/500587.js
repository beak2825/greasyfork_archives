// ==UserScript==
// @name         DX9
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GLORY TO DX9
// @author       @fzve
// @match        https://www.roblox.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500587/DX9.user.js
// @updateURL https://update.greasyfork.org/scripts/500587/DX9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDX9Link() {
        const targetAnchor = document.getElementById('header-develop-md-link');
        if (targetAnchor) {
            const newLi = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = 'DX9';
            link.href = 'dx9://';
            link.className = 'font-header-2 nav-menu-title text-header';
            newLi.appendChild(link);
            newLi.className = 'nav-menu-item';
            const parentUl = targetAnchor.closest('ul');
            if (parentUl) {
                parentUl.appendChild(newLi);
            } else {
                console.log('haha. <ul> gone!');
            }
        } else {
            console.log('haha. <a> gone!');
        }
    }

    function addCloseDX9Link() {
        const targetAnchor = document.getElementById('header-develop-md-link');
        if (targetAnchor) {
            const newLi = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = 'CLOSE DX9';
            link.href = 'cdx9://';
            link.className = 'font-header-2 nav-menu-title text-header';
            newLi.appendChild(link);
            newLi.className = 'nav-menu-item';
            const parentUl = targetAnchor.closest('ul');
            if (parentUl) {
                parentUl.appendChild(newLi);
            } else {
                console.log('haha. <ul> gone!');
            }
        } else {
            console.log('haha. <a> gone!');
        }
    }

    addDX9Link();
    addCloseDX9Link();
})();
