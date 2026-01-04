// ==UserScript==
// @name        HWM Art Repair Info
// @version     1.3
// @description HWM Mod - На странице инфы арта добавляет подсчёт суммы его ремонта и длительность ремонта
// @author      - SAURON -
// @namespace   Mefistophel_Gr
// @include     http://heroeswm.ru/art_info.php*
// @include     http://178.248.235.15/art_info.php*
// @include     http://lordswm.com/art_info.php*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/536329/HWM%20Art%20Repair%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/536329/HWM%20Art%20Repair%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    try {
        // Получаем стоимость ремонта
        const repairCostText = document.body.innerHTML.split("Стоимость ремонта:")[1]?.replace(",", "");
        if (!repairCostText) throw new Error("Could not find repair cost section");
        
        const costMatch = /<td>(\d+)<\/td>/.exec(repairCostText);
        if (!costMatch) throw new Error("Could not extract repair cost");
        
        const price = parseInt(costMatch[1], 10);
        
        // Получаем время ремонта
        const timeElement = document.evaluate(
            "//b[contains(text(),'\u0440\u0435\u043C\u043E\u043D\u0442')]/following-sibling::table", 
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;
        
        if (!timeElement) throw new Error("Could not find repair time element");
        
        const repairTime = parseInt(timeElement.textContent.replace(',', ''), 10);
        const timeInMinutes = (repairTime * 0.015).toFixed(0);
        
        // Добавляем информацию на страницу
        const headers = document.body.getElementsByTagName('b');
        
        for (const header of headers) {
            if (header.innerHTML === ' Стоимость ремонта:') {
                const div = document.createElement('div');
                div.innerHTML = `
                    <br>40% = ${Math.round(price * 0.4)}
                    <br>50% = ${Math.round(price * 0.5)}
                    <br>60% = ${Math.round(price * 0.6)}
                    <br>70% = ${Math.round(price * 0.7)}
                    <br>80% = ${Math.round(price * 0.8)}
                    <br>90% = ${Math.round(price * 0.9)}
                    <br>101% = ${Math.round(price * 1.01)}
                    <br>102% = ${Math.round(price * 1.02)}
                    <br>103% = ${Math.round(price * 1.03)}
                    <br>104% = ${Math.round(price * 1.04)}
                    <br>105% = ${Math.round(price * 1.05)}
                    <br>
                    <br>Время ремонта ${timeInMinutes} минут(ы) ${timeInMinutes > 60 ? `или ${(timeInMinutes/60).toFixed(2)} часа(ов)` : ''}
                    <br><br>
                `;
                
                header.parentNode.appendChild(div);
                break;
            }
        }
    } catch (error) {
        console.error('HWM Art Repair Info script error:', error);
    }
})();