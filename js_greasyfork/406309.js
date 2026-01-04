// ==UserScript==
// @name         Neopets Game 1000 NP Required Points
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      1.1 (thanks Bat!)
// @description  Changes the NP box on the Neopets game screen to show 1000np requirement points
// @author       RealisticError (Clraik)
// @match        http://www.neopets.com/games/game.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406309/Neopets%20Game%201000%20NP%20Required%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/406309/Neopets%20Game%201000%20NP%20Required%20Points.meta.js
// ==/UserScript==

(function() {
    'use strict';

  var pointsRequired = $("#gr-ctp-scores > div.neopoints-cont").children().eq(1).children().eq(0).text().match("^[0-9]*[.][0-9]*")

  var NPRequired = ((parseFloat(pointsRequired) || 0.001) * 1000);


    $("#gr-ctp-scores > div.neopoints-cont").children().eq(1).html('<div class="neopoints-cont"><div id="gr-ctp-neopoints-img"></div><div class="text"><b>' + NPRequired.toLocaleString() + ' Points =</b><br><span class="green"><b>1000 NP</b></span><br></div></div>');
    $("#gr-ctp-scores > div.neopoints-cont").children().eq(0).remove();
    $("#gr-ctp-npratio > div").html('<div class="top" style="width:100%;text-align:center;font-weight:bold;margin-top:5px;">' +  NPRequired.toLocaleString() +' POINTS = <span class="green">1000 NP</span>		</div>')
})();