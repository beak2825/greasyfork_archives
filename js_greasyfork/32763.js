// ==UserScript==
// @name         PewTube
// @namespace    http://somethingafal.com
// @version      0.1
// @description  make pewtube, the app that will kill youtube, better
// @author       Afal
// @match        https://pew.tube/user/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32763/PewTube.user.js
// @updateURL https://update.greasyfork.org/scripts/32763/PewTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.container')[1].innerHTML = '<iframe width="1120" height="630" style="text-align:center;margin: auto auto;" src="https://www.youtube.com/embed/DoRNg-iOuRk?autoplay=1" frameborder="0" allowfullscreen></iframe>';
})();