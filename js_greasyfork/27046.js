// ==UserScript==
// @name         天猫-小米红米4A
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  红米不定时放货
// @author       You
// @match        https://detail.tmall.com/item.htm?id=541222089489*
// @grant        none
// @require      http://code.jquery.com/jquery-1.4.1.js
// @downloadURL https://update.greasyfork.org/scripts/27046/%E5%A4%A9%E7%8C%AB-%E5%B0%8F%E7%B1%B3%E7%BA%A2%E7%B1%B34A.user.js
// @updateURL https://update.greasyfork.org/scripts/27046/%E5%A4%A9%E7%8C%AB-%E5%B0%8F%E7%B1%B3%E7%BA%A2%E7%B1%B34A.meta.js
// ==/UserScript==


setInterval(function () {
    console.log($("#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-meta").children().attr("class"));
    if($("#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-meta").children().attr("class")!="sold-out-recommend"){
        $("#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-key > div > div > dl.tb-prop.tm-sale-prop.tm-clear.tm-img-prop > dd > ul > li:nth-child(1) > a").click();
        $("#J_LinkBuy").click();
    }
    else{
        location.reload();
    }
},200);
