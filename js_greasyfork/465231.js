// ==UserScript==
// @name         Fix Asset Thumbnail [Roblox]
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Fix Asset Thumbnail in Old Roblox Marketplace Menu
// @author       Megumint
// @match        https://www.roblox.com/library/*
// @grant        none
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465231/Fix%20Asset%20Thumbnail%20%5BRoblox%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/465231/Fix%20Asset%20Thumbnail%20%5BRoblox%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getThumbnail(ID,onSuccess){
        $.ajax({
            url: `https://thumbnails.roblox.com/v1/assets?assetIds=${ID}&returnPolicy=PlaceHolder&size=250x250&format=png`,
            type: "GET",
            success: function (res) {
                if(res.data[0].state == "Completed"){
                    onSuccess(res.data[0])
                }
            }
        });
    }

    let AssetId = Number(($("html").find("link[rel='canonical']").attr("href").match(/\/(catalog|library)\/(\d+)\//) || ["", "", 0])[2])
    getThumbnail(AssetId,(Thumbnail) => {
        document.getElementsByClassName("thumbnail-span")[0].childNodes[0].setAttribute("src",Thumbnail.imageUrl)
    })
})();