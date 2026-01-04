// ==UserScript==
// @name         Idle Infinity - ShowItemPrice
// @version      1.0
// @description  显示拍卖行价格
// @author       小黄不会擦屁股
// @match        https://www.idleinfinity.cn/Auction/Query?*
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/478103/Idle%20Infinity%20-%20ShowItemPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/478103/Idle%20Infinity%20-%20ShowItemPrice.meta.js
// ==/UserScript==
function showMoney(){
    $(".panel .equip-name").each(function() {
        var eid = $(this).data("id");
        var contentDiv = $(".equip-content-container > [data-id='" + eid + "']");
        var equipSpan = contentDiv.find(".equip");
        var equipP = equipSpan.find(".equip-price");
        var equipS1 = equipP.children().html()
        $(this).append("<br>"+equipS1)
    })
}

(function() {
   showMoney();
})();