// ==UserScript==
// @name         Show Steam Cards for DIG Game Bundles
// @namespace    https://victor-lange.de/
// @version      1.1.1
// @description  Shows a Emoji depending on Cards Status and Region Lock
// @author       Victor Lange
// @match        https://dailyindiegame.com/site_weeklybundle*
// @match        https://www.dailyindiegame.com/site_weeklybundle*
// @icon         https://www.google.com/s2/favicons?domain=dailyindiegame.com
// @grant        GM.xmlHttpRequest
// @connect      store.steampowered.com
// @downloadURL https://update.greasyfork.org/scripts/431991/Show%20Steam%20Cards%20for%20DIG%20Game%20Bundles.user.js
// @updateURL https://update.greasyfork.org/scripts/431991/Show%20Steam%20Cards%20for%20DIG%20Game%20Bundles.meta.js
// ==/UserScript==

(function() {


    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function GetAllBundleGames(){
        var games = getElementByXpath("/html/body/table/tbody/tr[2]/td/table[1]/tbody/tr/td/table/tbody/tr/td[2]/table[2]/tbody").getElementsByTagName("td")
        for (const [key, value] of Object.entries(games)) {
            var sAppID = value.getElementsByTagName("a")[0].href.replace("https://store.steampowered.com/app/","")
            UpdateGameBySteamAppDetails(sAppID, value.getElementsByTagName("a")[0].children[0])
        }
    }

    function UpdateGameBySteamAppDetails(id,htmlobj)
    {
        GM.xmlHttpRequest({
            method: "GET",
            url: 'https://store.steampowered.com/api/appdetails?appids=' + id,
            onload: function(response) {
                var apiJson = JSON.parse(response.response)
                if(apiJson[id].success){
                    var bhasCards = false;
                    for (const [key, value] of Object.entries(apiJson[id].data.categories)) {
                        if(value.id === 29){
                            bhasCards = true;
                        }
                    }
                    if(bhasCards){
                        htmlobj.innerText = htmlobj.innerText + "✔️"
                    }else{
                        htmlobj.innerText = htmlobj.innerText + "❌"
                    }
                }
                else
                {
                    //Region locked
                    htmlobj.innerText = htmlobj.innerText + "🚧"
                }
            }
        });
    }

    GetAllBundleGames()

})();