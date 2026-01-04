// ==UserScript==
// @name         JacaPraca
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Jaca praca jaca praca Jaca praca jaca praca Jaca praca jaca praca Jaca praca jaca praca Jaca praca jaca praca Jaca praca jaca praca
// @match        https://oko.widoczni.pl/zespol.php8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477178/JacaPraca.user.js
// @updateURL https://update.greasyfork.org/scripts/477178/JacaPraca.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var monkeyImageUrls = [
        "https://widoczni.com/assets/cms/Employee/1547/_resampled/ScaleWidthWyI0MDAiXQ/jacek-tylinski-widoczni.JPG",
        "https://widoczni.com/assets/cms/Employee/1547/_resampled/ScaleWidthWyI0MDAiXQ/jacek-tylinski-widoczni.JPG"
    ];

    var targetCells = document.querySelectorAll('td.dt-body-center:not(.last-col)');
    targetCells.forEach(function(cell, index) {
        var linkedinAnchor = cell.querySelector('a[href*="linkedin.com"]');
        if (!linkedinAnchor) {
            var images = cell.getElementsByTagName('img');
            for (var i = 0; i < images.length; i++) {
                var randomMonkeyIndex = Math.floor(Math.random() * monkeyImageUrls.length);

                var monkeyImage = new Image();
                monkeyImage.src = monkeyImageUrls[randomMonkeyIndex];
                monkeyImage.style.height = "176px"; // Set the desired height
                monkeyImage.style.width = "auto"; // Maintain aspect ratio and set width to 100%

                var monkeyDiv = document.createElement("div");
                monkeyDiv.appendChild(monkeyImage);

                images[i].parentNode.replaceChild(monkeyDiv, images[i]);
            }
        }
    });
})();







