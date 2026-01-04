// ==UserScript==
// @name         BME K EPULET
// @namespace    https://sandros.hu/
// @version      0.00001
// @description  Vissza a K EPULETET!
// @author       Viktor Richárd Kozma
// @match        https://*.neptun.bme.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32108/BME%20K%20EPULET.user.js
// @updateURL https://update.greasyfork.org/scripts/32108/BME%20K%20EPULET.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /// ported version
    /// original: https://www.facebook.com/photo.php?fbid=10214125964728874&set=p.10214125964728874&type=3&theater
    document.getElementById('div_login_right_side').style.backgroundImage = "url('https://kozmatamasroland.hu/bme.png')";
    document.getElementById('div_login_right_side').style.backgroundSize ="contain";
})();