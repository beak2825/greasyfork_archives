// ==UserScript==
// @name         Script by Vlad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bla-bla-bla
// @author       u/vlad
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417577/Script%20by%20Vlad.user.js
// @updateURL https://update.greasyfork.org/scripts/417577/Script%20by%20Vlad.meta.js
// ==/UserScript==

const lines = document.body.getElementsByClassName('CodeMirror-line');
const fields = document.body.getElementsByClassName('mt-1');
let i = 0
while (lines.length >= 7) {
    const texts = lines[0].children[0];
    const regex = /(<([^>]+)>)/ig
    ,   result = texts.innerHTML.replace(regex, '').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
    fields[i].innerHTML = result;
    i++;
}
