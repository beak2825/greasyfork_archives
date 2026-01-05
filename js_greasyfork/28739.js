// ==UserScript==
// @name RemoveLJLicensePopup
// @description remove license popup on LJ
// @version 0.3
// @author germes
// @license MIT
// @match http://*.livejournal.com/*
// @match https://*.livejournal.com/*
// @run-at document-end
// @grant none
// @namespace https://greasyfork.org/users/115181
// @downloadURL https://update.greasyfork.org/scripts/28739/RemoveLJLicensePopup.user.js
// @updateURL https://update.greasyfork.org/scripts/28739/RemoveLJLicensePopup.meta.js
// ==/UserScript==


    function gebi(id) {
        return document.getElementById(id);
    }

    function gebcn(className) {
        return [].slice.call(document.getElementsByClassName(className));
    }

    function removeNode(nodeElement) {
        if (nodeElement) {
            nodeElement.parentNode.removeChild(nodeElement);
        }
    }

    var
        popup = gebcn('flatblue rutos'),
        overlay = gebcn('b-fader');

    if (popup.length) {
        removeNode(popup[0]);
    }

    if (overlay.length) {
        removeNode(overlay[0]);
    }
