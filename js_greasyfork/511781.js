// ==UserScript==
// @name         SteamPY CDK 价格查询
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  显示 SteamPY CDK 的价格，系官方插件简单移植
// @author       bGZo
// @license      MIT
// @match        https://store.steampowered.com/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      steampy.com
// @downloadURL https://update.greasyfork.org/scripts/511781/SteamPY%20CDK%20%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/511781/SteamPY%20CDK%20%E4%BB%B7%E6%A0%BC%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAppId() {
        var gameUrl = document.getElementsByClassName('apphub_OtherSiteInfo')[0].getElementsByTagName("a")[0].href
        var lastgameUrl = gameUrl.substring(gameUrl.lastIndexOf("/") + 1)
        var regexp2 = /[0-9]+/g
        var matResult = lastgameUrl.match(regexp2)
        return matResult.join("")
    }

    function getSubIdList() {
        var purchaseGame = document.getElementsByClassName('game_area_purchase_game')
        return purchaseGame
    }


    function handlePrice(res, index) {
        console.log(res)
        if (res.code !== 200){
            console.log("script run failed. check remote api!")
        }

        var gameWrapper = document.getElementsByClassName('game_area_purchase_game_wrapper')
        var game = gameWrapper[index]
        var cdkPrice = res.result.keyPrice
        var cdkId = res.result.id

        const priceElement = document.createElement('div')
        priceElement.innerHTML = `<strong>CDK on SteamPY Price:</strong> <a href='https://steampy.com/cdkDetail?name=cn&gameId=${cdkId}' target="_blank">${cdkPrice}</a>`
        priceElement.style.color = 'green'
        priceElement.style.fontSize = '14px'
        priceElement.style.marginTop = '10px'
        game.appendChild(priceElement)
    }

    var appId = getAppId()
    var subIdList = getSubIdList()
    var pyResult = []

    for (var i = 0; i < subIdList.length; i++) {
        (function(i) {
            var inputList = subIdList.item(i).getElementsByTagName("form").item(0).getElementsByTagName("input")
            if (inputList.item(inputList.length - 1).name != "subid" && "bundleid" != inputList.item(inputList.length - 1).name) {
                return
            }

            var subId = inputList.item(inputList.length - 1).value
            var type = inputList.item(inputList.length - 1).name
            var url = "https://steampy.com/xboot/common/plugIn/getGame?subId=" + subId + "&appId=" + appId + "&type=" + type

            GM.xmlHttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var result = JSON.parse(response.responseText)
                    handlePrice(result, i)
                }
            })
        })(i)
    }


})()