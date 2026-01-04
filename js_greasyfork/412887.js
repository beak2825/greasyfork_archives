// ==UserScript==
// @name         国际服旅行莫古力奖励列表翻译
// @namespace    undefined
// @version      0.3
// @description  国际服旅行莫古力奖励列表翻译（日翻译为中）
// @author       Sirius(@NGA yanlongtuan)
// @match        https://jp.finalfantasyxiv.com/lodestone/special/mogmog-collection/*
// @compatible   chrome
// @grant        none
// @require      https://greasyfork.org/scripts/412886-jp2ch/code/JP2CH.js?version=978289
// @downloadURL https://update.greasyfork.org/scripts/412887/%E5%9B%BD%E9%99%85%E6%9C%8D%E6%97%85%E8%A1%8C%E8%8E%AB%E5%8F%A4%E5%8A%9B%E5%A5%96%E5%8A%B1%E5%88%97%E8%A1%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412887/%E5%9B%BD%E9%99%85%E6%9C%8D%E6%97%85%E8%A1%8C%E8%8E%AB%E5%8F%A4%E5%8A%9B%E5%A5%96%E5%8A%B1%E5%88%97%E8%A1%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var temp;
    var temp_split;

    //====================================================================================//
    for (var ia=0;ia<$("p.item__list__name").size();ia++)
    {
        var JPtext = $("p.item__list__name").eq(ia).text();
        var type_CN=item_JP2CH($("p.item__list__name").eq(ia).text());

        if(type_CN!==undefined){
            var ENDtext = type_CN + '   <br><b>（' + JPtext + '）</b>'
            $("p.item__list__name").eq(ia).html(ENDtext);
            //alert($("p.item__list__name").eq(ia).text(type_CN));//
        }
    }
})();