// ==UserScript==
// @name         Add Battledome to Dropdown
// @author       Vaebae
// @description  Adds the Battledome to the menu dropdown
// @match        *://www.neopets.com/*
// @namespace    Vaebae@CK
// @version      1.1b
// @downloadURL https://update.greasyfork.org/scripts/458437/Add%20Battledome%20to%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/458437/Add%20Battledome%20to%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict'; 
    $($('.shopdropdownNPTab ul')[0]).append(`<a href="/dome/"><li>
								<div class="shop-dropdown-icon" style="background-image: url('https://i.imgur.com/nIrzxFn.png')"></div>
								<h4>Battledome</h4>
							</li></a>`)
})();