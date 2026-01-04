// ==UserScript==
// @name         Copy html
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Copy email html, subjet and name for email development
// @author       You
// @match        https://news-dev.bpost.be/emails/*
// @match        https://bpost2.loca.lt/emails/*
// @match        https://stacrmprwemktnewslrs.azureedge.net/emails/*
// @match        http://localhost:8080/emails/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bpost.be
// @grant        none
// @license    GPL-3.0-onl
// @downloadURL https://update.greasyfork.org/scripts/456895/Copy%20html.user.js
// @updateURL https://update.greasyfork.org/scripts/456895/Copy%20html.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const str = window.location.href;
    let parts = str.split('/');
    parts = parts.filter(part => part.trim() !== '')

    const lastPart = parts.slice(-1)[0];
    const secondToLastPart = parts.slice(-2, -1)[0];
    const result = secondToLastPart + '_' + lastPart;

    function copyPageSource() {
        // Obtenir la source HTML de la page
        let pageSource = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

        // Copier la source dans le presse-papiers
        navigator.clipboard.writeText(pageSource);
    }
    let mybutton = document.createElement("div");
    mybutton.textContent = '📋 Copy HTML';
    mybutton.style.position = 'fixed';
    mybutton.style.top = '0';
    mybutton.style.right = '40%';
    mybutton.style.background = '#555';
    mybutton.style.font = '11px Verdana';
    mybutton.style.cursor = 'pointer';
    mybutton.style.padding = '10px';
    mybutton.style.color = '#fff';
    mybutton.style.borderBottomLeftRadius = '5px';
    mybutton.style.borderBottomRightRadius = '5px';
    mybutton.style.width = '120px';
    mybutton.style.textAlign = 'center';
    mybutton.style.backgroundImage = 'linear-gradient(#ccc, #aaa)';
    document.querySelector('body').prepend(mybutton);
    mybutton.addEventListener('click', () => {
        document.querySelector('body').removeChild(mybutton);
        document.querySelector('body').removeChild(pagetitle);
        document.querySelector('body').removeChild(btnCopyName);
        document.querySelectorAll('script').forEach(function(e) {
            document.querySelector('body').removeChild(e);
        });
        copyPageSource();
        document.querySelector('body').prepend(pagetitle);
        document.querySelector('body').prepend(mybutton);
        document.querySelector('body').prepend(btnCopyName);
        mybutton.textContent = '✔️ HTML copied!';
    });

    function copyPageName() {

        // Copier la source dans le presse-papiers
        navigator.clipboard.writeText(result);
    }
    let btnCopyName = document.createElement("div");
    btnCopyName.textContent = '📋 Copy name';
    btnCopyName.style.position = 'fixed';
    btnCopyName.style.top = '0';
    btnCopyName.style.right = '60%';
    btnCopyName.style.background = '#555';
    btnCopyName.style.font = '11px Verdana';
    btnCopyName.style.cursor = 'pointer';
    btnCopyName.style.padding = '10px';
    btnCopyName.style.color = '#fff';
    btnCopyName.style.borderBottomLeftRadius = '5px';
    btnCopyName.style.borderBottomRightRadius = '5px';
    btnCopyName.style.width = '120px';
    btnCopyName.style.textAlign = 'center';
    btnCopyName.style.backgroundImage = 'linear-gradient(#ccc, #aaa)';
    document.querySelector('body').prepend(btnCopyName);
    btnCopyName.addEventListener('click', () => {
        document.querySelector('body').removeChild(mybutton);
        document.querySelector('body').removeChild(pagetitle);
        document.querySelector('body').removeChild(btnCopyName);
        copyPageName();
        document.querySelector('body').prepend(pagetitle);
        document.querySelector('body').prepend(mybutton);
         document.querySelector('body').prepend(btnCopyName);
        btnCopyName.textContent = '✔️ Name copied!';
    });

    function copyPageTitle() {
        // Obtenir la source HTML de la page
        const pageSource = document.title;

        // Copier la source dans le presse-papiers
        navigator.clipboard.writeText(pageSource);
    }
    let pagetitle = document.createElement("div");
    pagetitle.textContent = '📋 Copy subject';
    pagetitle.style.position = 'fixed';
    pagetitle.style.top = '0';
    pagetitle.style.right = '50%';
    pagetitle.style.background = '#aaa';
    pagetitle.style.font = '11px Verdana';
    pagetitle.style.cursor = 'pointer';
    pagetitle.style.padding = '10px';
    pagetitle.style.color = '#fff';
    pagetitle.style.borderBottomLeftRadius = '5px';
    pagetitle.style.borderBottomRightRadius = '5px';
    pagetitle.style.width = '120px';
    pagetitle.style.textAlign = 'center';
    pagetitle.style.backgroundImage = 'linear-gradient(#ccc, #aaa)';
    document.querySelector('body').prepend(pagetitle);
    pagetitle.addEventListener('click', () => {
        document.querySelector('body').removeChild(mybutton);
        document.querySelector('body').removeChild(pagetitle);
        document.querySelector('body').removeChild(btnCopyName);
        copyPageTitle();
        document.querySelector('body').prepend(pagetitle);
        document.querySelector('body').prepend(mybutton);
        document.querySelector('body').prepend(btnCopyName);
        pagetitle.textContent = '✔️ Subject copied!';
    });
})();