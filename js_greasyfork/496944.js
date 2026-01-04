// ==UserScript==
// @name         CodeHS Cheat
// @namespace    http://tampermonkey.net/
// @version      2024-05-29 v6 skibidi version
// @description  Funny
// @author       Anghel sefu la bani
// @match        https://codehs.com/student/*/assignment/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codehs.com
// @grant    GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496944/CodeHS%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/496944/CodeHS%20Cheat.meta.js
// ==/UserScript==

(function() {

    function cleanHTMLString(htmlString) {
    // Remove comments
    htmlString = htmlString.replace(/<!--[\s\S]*?-->/g, '');

    // Remove <noscript> tags and their content
    htmlString = htmlString.replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

    // Remove <script> tags inside the <head> section
    htmlString = htmlString.replace(/(<head[\s\S]*?>[\s\S]*?)<script[\s\S]*?<\/script>/gi, (match, p1) => {
        // Remove <script> tags from the <head> section content
        return p1.replace(/<script[\s\S]*?<\/script>/gi, '');
    });

    // Clean com

    return `<!DOCTYPE html>\n` + htmlString;
}
    'use strict';
    let htmlc;

    console.log("FUNNY SKIBIDI LOADED");

    const textField = document.querySelector('.ace_text');
    const ace_content = document.querySelector('.ace_content');
    const text_area = document.querySelector('.ace_text-input');
    const xbutton = document.querySelector('.start-ex-button');
    const iframe = document.querySelector('.sample-sols');

    window.addEventListener('load', function () {

        const secondHTML = iframe.contentDocument || iframe.contentWindow.document;

        console.log(secondHTML.children[0]);
        const HTMLCode = secondHTML.children[0].outerHTML;
        htmlc = cleanHTMLString(HTMLCode);
        console.log(htmlc);
        GM_setClipboard (htmlc);
        console.log("CODE COPIED");
        xbutton.click();

        setTimeout(part2, 500);
    });

    function part2() {
        text_area.focus();
    }
})();