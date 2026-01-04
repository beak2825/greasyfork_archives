// ==UserScript==
// @name         Turn Based Jstris
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds counter for turn based jstris
// @author       Justin1L8
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451215/Turn%20Based%20Jstris.user.js
// @updateURL https://update.greasyfork.org/scripts/451215/Turn%20Based%20Jstris.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function(){

        var rect = holdCanvas.getBoundingClientRect();
        var p = document.createElement("div");
        p.id = "pace"
        p.style = ("color:#999;width:150px;position:absolute;top:"+(rect.top+200)+"px;left:"+(rect.left-50)+"px")
        p.innerHTML = `
		<table style='width:100%;height:100%;table-layout:fixed;'>
		  <tr>
		    <td>Pieces Left:</td>
		    <td id='blocksInTurn'>7</td>
		  </tr>
		</table>
		`
        document.body.appendChild(p);
    });
})();

var place_block = Game.prototype.placeBlock;
Game.prototype.placeBlock = function() {
    place_block.apply(this, arguments);
    blocksInTurn.innerHTML = 7 - this.placedBlocks % 7;
}