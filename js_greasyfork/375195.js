// ==UserScript==
// @name         AnandTech Forums Jump
// @namespace    https://sites.google.com/site/kenscode/
// @version      0.1
// @description  Add a Read link to the Ask The Community block, to jump to each forum.
// @author       Ken g6 (Ken Brazier)
// @match        https://forums.anandtech.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375195/AnandTech%20Forums%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/375195/AnandTech%20Forums%20Jump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeReadLink() {
        var readlink = document.getElementById('askblockreadlink');
        var bselect = document.querySelector("form[data-xf-init*='future-quick-thread-widget draft'] select");
        var h = bselect.options[bselect.selectedIndex].dataset.actionUrl;
        h = h.substr(0, h.lastIndexOf('/')) + '/';
        readlink.href = h;
    }
    var bform = document.querySelector("form[data-xf-init*='future-quick-thread-widget draft']");
    if(bform != null) {
        var bselect = bform.querySelector("select");
        var bbgroup = bform.querySelector(".formButtonGroup");
        var readlink = document.createElement('a');
        readlink.innerHTML = '<span class="button-text">Read</span>';
        readlink.href = '#';
        readlink.className = 'button--primary button button--icon button--icon--search rippleButton';
        readlink.id = 'askblockreadlink';
        bbgroup.insertBefore(readlink, bbgroup.firstChild);
        changeReadLink();
        bselect.addEventListener("change", changeReadLink);
    }
})();