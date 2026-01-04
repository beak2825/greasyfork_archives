// ==UserScript==
// @name         AVG Stavka!
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  avg stavky delaem!
// @author       Tishka
// @license      apache
// @match        https://marketing-jet.lux-casino.co/backend/bets*
// @match        https://marketing-sol.lux-casino.co/backend/bets*
// @match        https://marketing-rox.lux-casino.co/backend/bets*
// @match	     https://marketing.lux-casino.co/backend/bets*
// @match		 https://marketing-fresh.lux-casino.co/backend/bets*
// @match		 https://marketing-izzi.lux-casino.co/backend/bets*
// @icon         https://www.google.com/s2/favicons?domain=lux-casino.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438560/AVG%20Stavka%21.user.js
// @updateURL https://update.greasyfork.org/scripts/438560/AVG%20Stavka%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tableToObj = function(table) { // переделывает таблицу в архив, нужно для работы 3х чекера и т.д.
        var trs = table.rows,
            trl = trs.length,
            i = 0,
            j = 0,
            keys = [],
            obj, ret = [];

        for (; i < trl; i++) {
            if (i == 0) {
                for (; j < trs[i].children.length; j++) {
                    keys.push(trs[i].children[j].innerHTML);
                }
            } else {
                obj = {};
                for (j = 0; j < trs[i].children.length; j++) {
                    obj[keys[j]] = trs[i].children[j].innerHTML;
                }
                ret.push(obj);
            }
        }

        return ret;
    };
    let bets = tableToObj(document.getElementById("aggregated_data_sidebar_section").querySelector("table"));
    //console.log(typeof(bets[0].Bets));
    console.log(parseInt(bets[0].Bets) / parseInt(bets[0].Cnt));
    	function injectEnhancerBlock(){
		var enhancerBlock ;
		enhancerBlock = document.createElement( 'div' );
		enhancerBlock.innerHTML = `
		<div class="panel_contents">
            <center><h3><b><i> AVG Bet:</i></b>  ${Math.floor(parseInt(bets[0].Bets) / parseInt(bets[0].Cnt))}</h3></center>
            </div>
			` ;
		var eElement = document.getElementById( 'aggregated_data_sidebar_section' )//.querySelector("table"); // элемент, в которой вкидывает, ставит первым наследником этого объекта
		var newFirstElement = enhancerBlock; // код, который мы инжектим
		eElement.insertBefore(newFirstElement, eElement.lastChild); // инжект
	}
    injectEnhancerBlock();




    // console.log(bets[0].Bets);

    // Your code here...
    })();