// ==UserScript==
// @name         JavLibrary Cast Name Fixer
// @namespace    https://greasyfork.org/en/users/68133-nevertheless
// @version      1.02
// @description  Convert cast members names into my video filing format
// @author       Nevertheless
// @match        *://*.javlibrary.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/38333/JavLibrary%20Cast%20Name%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/38333/JavLibrary%20Cast%20Name%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const vidID = $('#video_id').find('.text').first().text();
    $('#video_cast').find('.star a').each(function(index, element){ element.text = '[' + element.text.split(" ").reverse().join(" ") + '][' + vidID + ']'; }); 

})();
