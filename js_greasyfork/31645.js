// ==UserScript==
// @name         xbtc
// @namespace    xbtc
// @version      1.0.0
// @description  Auto Click Xbtc
// @author       Skick
// @match        http://xbtc.eu/crypto.php?cr=BTC
// @icon         http://xbtc.eu/xbtc_fav.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @homepageURL  http://s2cancer.tk/
// @downloadURL https://update.greasyfork.org/scripts/31645/xbtc.user.js
// @updateURL https://update.greasyfork.org/scripts/31645/xbtc.meta.js
// ==/UserScript==

$(document).ready(function(){
    setInterval(function(){
        if($('.gbut').val() == "Collect")
        {
            $('.gbut').mousedown();
			$('.gbut').click();
			$('.gbut').mouseup();
        }
        if($('.counnt').css('display') != 'none'){
            location.reload();
        }
    },10000);
});