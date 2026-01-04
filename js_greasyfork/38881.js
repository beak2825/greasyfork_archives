// ==UserScript==
// @name         F-List Profile Stripper
// @namespace    tag:cumgolem@gmail.com,2018-02-25:F-ListProfileStripper
// @version      1.0
// @description  Adds a button to strip most formatting information from an F-List profile description.
// @author       Cummy
// @match        https://www.f-list.net/c/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38881/F-List%20Profile%20Stripper.user.js
// @updateURL https://update.greasyfork.org/scripts/38881/F-List%20Profile%20Stripper.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var profileDescription = document.getElementsByClassName("FormattedBlock")[0];
    var savedInnerHTML = profileDescription.innerHTML;

    var button = document.createElement('button');
    button.innerHTML = 'Strip formatting';
    button.onclick = function() {
        var images = document.getElementsByClassName("FormattedBlock")[0].getElementsByTagName("img");
        while (images.length > 0) { images[0].parentNode.removeChild(images[0]); }

        var childElements = document.getElementsByClassName("FormattedBlock")[0].getElementsByTagName("*");
        for (var i = 0; i < childElements.length; i++) { childElements[i].className = ''; childElements[i].style = ''; }

        button.replaceWith(restoreButton);
    };

    var restoreButton = document.createElement('button');
    restoreButton.innerHTML = 'Restore formatting';
    restoreButton.onclick = function() {
        profileDescription.innerHTML = savedInnerHTML;
        restoreButton.replaceWith(button);
    };

    profileDescription.parentNode.insertBefore(button, profileDescription);
})();