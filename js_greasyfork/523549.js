// ==UserScript==
// @name         creativetim fix
// @description  removes the signup requirement from creativetim.
// @version      2
// @icon         https://i.imgur.com/ORAaPzD.png

// @author       VillainsRule
// @namespace    https://villainsrule.xyz

// @match        https://www.creative-tim.com/product/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/523549/creativetim%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/523549/creativetim%20fix.meta.js
// ==/UserScript==

[...document.querySelectorAll('a[onclick*="openRegisterModal"]')].forEach((button) => button.onclick = () => {
    let githubLink = document.querySelector('.fa.fa-github-alt').parentNode.href;

    GM_openInTab(githubLink, { active: true, insert: true });
    alert('creativetim fix activated, the github link has been opened!');
});