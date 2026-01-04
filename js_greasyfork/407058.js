// ==UserScript==
// @name         Heat and Fish bar
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  lol2
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407058/Heat%20and%20Fish%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/407058/Heat%20and%20Fish%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $('#navigation-right-fishing > br').before(
         `<div id="heat-energy-bar-wrapper" style="display:flex;justify-content:center;margin-top:10px">
              <div id="heat-energy-bar" style="height:30px;width:400px;background:#393e46;border:1px solid orange;border-radius:5px;display:flex;flex-direction:row;">
                   <div id="heat-bar" style="margin-left:2px; width:170px;display:flex;align-items:center;"></div>
                   <div id="energy-bar" style="width:170px;display:flex;align-items:center;"></div>
                   <button style="width:70px;background:#222831;color:#eeeeee;font-family:'sans-serif';font-weight:bold" id="refresh-bar">Refresh</button>
</div>
</div>`
     )

    function lol(){
        if(window.var_username){
            document.getElementById('refresh-bar').onclick = ()=>{
                let heat = window.global_foodMap.filter(e => e.rawFoodName !== 'none' && window[`var_${e.rawFoodName}`]).map(e => window[`var_${e.rawFoodName}`] * e.heat).reduce((acc, cur)=>acc + cur)
                let energy = window.global_foodMap.filter(e => e.rawFoodName !== 'none' && window[`var_${e.rawFoodName}`]).map(e => window[`var_${e.rawFoodName}`] * e.energy).reduce((acc, cur)=>acc + cur)
                document.getElementById('heat-bar').textContent = 'Heat needed: ' + window.formatNumber(heat)
                document.getElementById('energy-bar').textContent = 'Raw energy: ' + window.formatNumber(energy)
            }
            setTimeout(()=>{document.getElementById('refresh-bar').click()}, 2000)
            document.querySelectorAll('.item-box').forEach(e=>{e.style.margin = '10px'})
        }else{
            setTimeout(lol, 1000)
        }
    }
    lol()
})();