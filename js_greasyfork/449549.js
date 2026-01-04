// ==UserScript==
// @name         Positive Arena Finder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  for you, stuff-a-roo
// @author       ben (mushroom), mandi
// @match        https://www.grundos.cafe/games/foodclub/bet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449549/Positive%20Arena%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/449549/Positive%20Arena%20Finder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var content = document.getElementById("page_content");
    var options = content.getElementsByTagName("option")

    for (var i=0; i<5; i++){
        console.log('Arena ' + (i + 1).toString())
        var positivity = 0;
        for (var j=0; j<4; j++){
            var thisOption = options[5*i + j + 1]
            var leftEnd = thisOption.innerText.indexOf('(');
            var rightEnd = thisOption.innerText.indexOf(')');
            var oddsString = thisOption.innerText.substr(leftEnd + 1, rightEnd - leftEnd - 1);
            console.log(oddsString)
            var denom = oddsString.split(':')[0]
            positivity += 1 / denom
        }
        console.log(positivity)

        var thisSelect = document.getElementsByName('winner' + (i + 1).toString())[0]
        thisSelect.insertAdjacentHTML('afterEnd', `<br>Odds sum: ` + (Math.round(positivity*1000)/1000).toString())

                if ( (Math.round(positivity*1000)/1000) < 1) {
            $('select[name=winner' + (i+1) + ']').parent().css('background-color', 'rgba(0,255,0,.25)');
        } else {
            $('select[name=winner' + (i+1) + ']').parent().css('background-color', 'rgba(255,0,0,.25)');
        }
    }
})();