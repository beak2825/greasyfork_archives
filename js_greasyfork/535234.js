// ==UserScript==
// @name         Индикатор зелья фракции в Гильдии Тактиков for ыык
// @namespace    http://tampermonkey.net/
// @version      3.18
// @description  Добавляет информацию об активности зелья фракции на странице Гильдии Тактиков
// @author       Sky
// @match        *://www.heroeswm.ru/pvp_guild.php*
// @license MIT
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/535234/%D0%98%D0%BD%D0%B4%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%20%D0%B7%D0%B5%D0%BB%D1%8C%D1%8F%20%D1%84%D1%80%D0%B0%D0%BA%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%93%D0%B8%D0%BB%D1%8C%D0%B4%D0%B8%D0%B8%20%D0%A2%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%BE%D0%B2%20for%20%D1%8B%D1%8B%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/535234/%D0%98%D0%BD%D0%B4%D0%B8%D0%BA%D0%B0%D1%82%D0%BE%D1%80%20%D0%B7%D0%B5%D0%BB%D1%8C%D1%8F%20%D1%84%D1%80%D0%B0%D0%BA%D1%86%D0%B8%D0%B8%20%D0%B2%20%D0%93%D0%B8%D0%BB%D1%8C%D0%B4%D0%B8%D0%B8%20%D0%A2%D0%B0%D0%BA%D1%82%D0%B8%D0%BA%D0%BE%D0%B2%20for%20%D1%8B%D1%8B%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const playerId = '6190319';

    function getPotionStatus(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://www.heroeswm.ru/pl_info.php?id=${playerId}`, 
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const potionElement = $(doc).find("body > center > table > tbody > tr > td > table:nth-child(1) > tbody > tr:nth-child(3) > td:nth-child(3) > table > tbody > tr:nth-child(3) > td > i");

                    if (potionElement.length > 0) {
                                           const potionText = potionElement.text().trim();
                        const isActive = potionText.includes("Зелье фракции");
                        callback(isActive);
                    } else {
                        callback(false); 
                    }
                } else {
                    callback(null); 
                }
            }
        });
    }


      function addPotionInfoToGuildPage(isActive) {
        let statusText = "Зелье фракции: ";
        let color = "gray"; 

        if (isActive === true) {
            statusText += "Активно!";
            color = "green";
        } else if (isActive === false) {
            statusText += "Не активно.";
            color = "red";
        } else {
            statusText += "Не удалось получить информацию.";
        }

       
        const infoElement = $(`<div style="text-align: center; font-size: 14px; font-weight: bold; color: ${color}; margin-bottom: 5px; margin-top: 5px; font-family: 'Verdana', sans-serif;">${statusText}</div>`);

              $("center:first").prepend(infoElement); 

           }


     $(document).ready(function() {
        getPotionStatus(function(isActive) {
            addPotionInfoToGuildPage(isActive);
        });
    });

})();