// ==UserScript==
// @name         HumTranslate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Jose Enrique Ayala Villegas
// @match        https://translate.google.co.ve/
// @match        https://www.humanatic.com/pages/humfun/review.cfm*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22401/HumTranslate.user.js
// @updateURL https://update.greasyfork.org/scripts/22401/HumTranslate.meta.js
// ==/UserScript==

(function() {
    $(function(){
        if(location.href.indexOf('translate.google') != -1){
            if(document.referrer == "https://www.humanatic.com/pages/humfun/review.cfm"){
                console.log("Cargado");
                $('#gt-appbar').hide();
                $('#gb').hide();
                $('#gba').hide();
                $('#gt-promo-lr').hide();
                $('#gt-ft-res').hide();
                $('#gt-ft-mkt').hide();
            }
        } else if(location.href.indexOf('humanatic.com/pages/humfun/review.cfm') != -1){
            $('body').append('<div id="divT" style="position: fixed; top: 93vh; width: 98vw; left: 0px; z-index: 1000; overflow: hidden; display: block; text-align: center;"><button style="width: 5vw;height: 20px;font-size: large;z-index: 2000;" id="btnT">Show</button><iframe src="https://translate.google.co.ve/" style="width: 100%; height: 100%; display: none;" scrolling="no" id="ifT"></iframe></div>');
            btnT.onclick = function(){
                if($(ifT).is(':hidden')) $(divT).animate({top:'50vh'},function(){$(ifT).show(function(){btnT.innerHTML='Hide';});}); else
                    $(divT).animate({top:'93vh'},function(){$(ifT).hide(function(){btnT.innerHTML='Show';});});
            };
            btnT.onmousedown = function(){return false;};
        }
    });

})();