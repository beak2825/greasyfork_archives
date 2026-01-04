// ==UserScript==
// @name         Panel Coloring
// @namespace    https://wallex.ir/
// @version      1.1
// @description  Change colors in panel
// @author       amiwrpremium
// @match        https://bots.k8s.phinix.dev/configs
// @match        https://bots.k8s.phinix.dev/tether_price
// @icon         https://www.google.com/s2/favicons?domain=ecoex.ir
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432493/Panel%20Coloring.user.js
// @updateURL https://update.greasyfork.org/scripts/432493/Panel%20Coloring.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let wallex = document.querySelector('#app > main > div > div > div > div:nth-child(12) > div.card-header')
    wallex.style = 'background-color:#072A48; color: #F2B80C'


    let phinix = document.querySelector('#app > main > div > div > div > div:nth-child(13) > div.card-header')
    phinix.style = 'background-color:#212529; color: #FF2B35'

    // Your code here...
})();