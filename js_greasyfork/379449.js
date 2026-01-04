// ==UserScript==
// @name         SuyongsoAutoLottery
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  autoPlayLottery
// @author       You
// @match        https://www.suyongso.com/lottery
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379449/SuyongsoAutoLottery.user.js
// @updateURL https://update.greasyfork.org/scripts/379449/SuyongsoAutoLottery.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    drawLottery(0);
});

function drawLottery(count) {
	if (count >= 11) return;
	$.ajax({
    		type: 'POST',
    		url: 'https://www.suyongso.com/index.php',
    		data : {moduel : "loterrylotto", act : "procLotterylottoBuyLottery"},
            success: function(){
        		count++;
                drawLottery(count);
    		}
    });
}
