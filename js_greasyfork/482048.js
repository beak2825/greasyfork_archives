// ==UserScript==
// @name         LifeForm Bonus
// @namespace    http://tampermonkey.net/
// @version      2023-12-11
// @description  add shortcut button for lifeform menu
// @author       Hari Seldon
// @match        https://*.ogame.gameforge.com/game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gameforge.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482048/LifeForm%20Bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/482048/LifeForm%20Bonus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MenuLF = (function(){
			function init(){
                set_html();
			}
			function set_html(){
                var url = window.location.hostname;
				const result = `<li>
									<span class="menu_icon">
										<div class="menuImage lifeform ipiHintable">
										</div>
									</span>
									<a class="menubutton ipiHintable" href="https://${url}/game/index.php?page=ingame&component=lfbonuses" target="_self">
										<span class="textlabel">LifeForm Bonus</span>
									</a>
								</li>`;
				document.querySelector( '#menuTable' ).innerHTML += result;
			}
			return {
				init
			};
		})();
    MenuLF.init();
})();