// ==UserScript==
// @name         hega no-high
// @name:de      hega no-high
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disables the imo annoying highcharts animations in different menus (for example in economy screen).
// @description:de Deaktiviert die mMn nervigen highcharts Animationen in verschiedenen Menüs (zum Beispiel auf dem Wirtschafts Bildschirm).
// @author       holycrumb
// @license      MIT
// @match        https://scarif.hiddenempire.de/game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hiddenempire.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473506/hega%20no-high.user.js
// @updateURL https://update.greasyfork.org/scripts/473506/hega%20no-high.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Highcharts.setOptions({
		plotOptions: {
			series: {
				animation: false
			}
		}
	})

})();