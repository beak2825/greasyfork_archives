// ==UserScript==
// @name         Total Resource Amount In Queue
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Serhat Yücel
// @match        https://s46-tr.ikariam.gameforge.com/?view=city*
// @grant        GM_xmlhttpRequest
// @require https://code.jquery.com/jquery-3.5.1.min.js


// @downloadURL https://update.greasyfork.org/scripts/416493/Total%20Resource%20Amount%20In%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/416493/Total%20Resource%20Amount%20In%20Queue.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){

        $("#locations .building").click(function() {
            calculateInQueueResources();
        });

        function calculateInQueueResources() {
            var resourceType = ["wood","wine","marble","glass","sulfur"];
            var totalResourcesInQueue = {"wood": 0, "wine":0, "marble":0, "glass": 0, "sulfur": 0}
            var resourceAmountOwn = {"wood": 0, "wine":0, "marble":0, "glass": 0, "sulfur": 0}
            resourceAmountOwn["wood"] = parseInt($("#js_GlobalMenu_wood").text().replace(",",""));
            resourceAmountOwn["wine"] = parseInt($("#js_GlobalMenu_wine").text().replace(",",""));
            resourceAmountOwn["marble"] = parseInt($("#js_GlobalMenu_marble").text().replace(",",""));
            resourceAmountOwn["glass"] = parseInt($("#js_GlobalMenu_crystal").text().replace(",",""));
            resourceAmountOwn["sulfur"] = parseInt($("#js_GlobalMenu_sulfur").text().replace(",",""));
            var resourceIcons = {"wood": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_wood.png",
                                 "marble": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_marble.png",
                                 "wine": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_wine.png",
                                 "glass": "https://s46-tr.ikariam.gameforge.com/skin/resources/icon_glass.png",
                                 "sulfur":"https://s46-tr.ikariam.gameforge.com/skin/resources/icon_sulfur.png"}


            setTimeout(function() {
                $("#constructionList li").each(function( index ) {
                    $(this).find(".tooltip").find("div").each(function(ind){
                        if(ind >= 2) {
                            var resourceType = $(this).find("img").attr("src").split("_")[1];
                            if(resourceType == "crystal") {
                                resourceType = "glass";
                            }
                            var resourceAmount = parseInt($(this).find("span").html().replace(",",""));
                            totalResourcesInQueue[resourceType] += resourceAmount;
                        }
                    });
                });

                var htmlOutput = '<li><table>';
                resourceType.forEach(function(element, index){
                    if(totalResourcesInQueue[element] > 0 ) {
                        var minusDiff = '';
                        if(totalResourcesInQueue[element] > resourceAmountOwn[element]) {
                            minusDiff = '<span style="color: red; font-wieght:bold">('+(resourceAmountOwn[element] - totalResourcesInQueue[element]).toLocaleString()+')</span>';
                        }
                        htmlOutput += '<tr><td><img src="'+resourceIcons[element]+'" style="margin-right: 5px;"></td><td>'+totalResourcesInQueue[element].toLocaleString()+ ' ' + minusDiff + '</td></tr>';
                    }
                });
                htmlOutput += '</table></li>';

                $("#constructionList").after("<h4>Toplam Malzeme İhtiyacı</h4>" + htmlOutput);
            }, 1500);
        }
    });

})();