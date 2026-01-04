// ==UserScript==
// @name         Hash to YGGLands
// @version      0.1
// @description  Ajoute un bouton pour voir le torrent sur ygglands
// @author       Gyro3630
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/1256993
// @downloadURL https://update.greasyfork.org/scripts/495426/Hash%20to%20YGGLands.user.js
// @updateURL https://update.greasyfork.org/scripts/495426/Hash%20to%20YGGLands.meta.js
// ==/UserScript==

(function() {
    'use strict';
		var regex = /^https:\/\/.*\.ygg[a-z]{0,7}\.[a-z]{2,5}\/torrent\/.+/;
  
    function addYGGbutton() {
      	if (regex.test(window.location.href)) {
					var infoHashCell = document.evaluate('//td[text()="Info Hash"]/following-sibling::td[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      		console.log(infoHashCell.innerText);

      		infoHashCell.innerHTML = infoHashCell.innerText+'<a target="_blank" href="https://yggland.fr/FAQ-Tutos/test-torrent-tracker-ygg.php?hash='+infoHashCell.innerText+'"><img style="height:20px;width:auto;" src="https://yggland.fr/assets/img/yggland-30.png"></a>';
       }
    }


    window.addEventListener('load', addYGGbutton);
})();
