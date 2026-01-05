// ==UserScript==
// @name         Hide removed Extensions in Chrome Dashboard
// @namespace    http://junookyo.blogspot.com/
// @version      1.0.0
// @description  Help you to hide all removed extensions from Chrome Developer Dashboard
// @author       Juno_okyo
// @match        https://chrome.google.com/webstore/developer/dashboard/*
// @run_at       document_end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12407/Hide%20removed%20Extensions%20in%20Chrome%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/12407/Hide%20removed%20Extensions%20in%20Chrome%20Dashboard.meta.js
// ==/UserScript==

var el = document.getElementsByClassName('m-qb-ac-u'),
    t = el.length;

if (t > 0) {
    for (var i = 0; i < t; i++) {
        var ext = el[i];
        
        if (ext.querySelector('.m-qb-ac-Wb > div > h2').innerHTML.indexOf('<a href') === -1 &&
            ext.querySelector('.m-qb-ac-Fc > span').textContent.toLowerCase() !== 'draft')
            ext.remove();
    }
}