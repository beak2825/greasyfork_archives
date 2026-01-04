// ==UserScript==
// @name         Feedly Sponsor Unmasking
// @namespace    http://mzsanford.com/
// @version      0.2
// @description  Highlight the sponsored content
// @author       Matt Sanford
// @match        https://feedly.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411043/Feedly%20Sponsor%20Unmasking.user.js
// @updateURL https://update.greasyfork.org/scripts/411043/Feedly%20Sponsor%20Unmasking.meta.js
// ==/UserScript==

(function() {
    // Your code here...
    setInterval(function() {
        let selected = document.getElementsByClassName('SponsorPrompt__sponsored');
        console.log('Found:', selected);
        for (var i=0; i < selected.length; i++) {
            let elem = selected[i];
            console.log('Change', elem);
            elem.style.backgroundColor = '#FFC300';
            elem.style.color = '#fff';
            elem.style.padding = '0.2em 0.5em';
            elem.style.borderRadius = '1em';
            elem.style.display = 'inline';
        }
    }, 2000);

})();