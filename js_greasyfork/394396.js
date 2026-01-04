// ==UserScript==
// @name         grimtool高级搜索汉化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于汉化GRIMTOOL的高级搜索页面。
// @author       伤寒月
// @match        https://www.grimtools.com/db/*
// @grant        用于汉化GRIMTOOL的高级搜索页面。
// @downloadURL https://update.greasyfork.org/scripts/394396/grimtool%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/394396/grimtool%E9%AB%98%E7%BA%A7%E6%90%9C%E7%B4%A2%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){

        document.getElementById("search-form").querySelectorAll("span.text")[38].innerHTML = "被遗忘的诸神";
        document.getElementById("search-form").querySelectorAll("span.text")[37].innerHTML = "马尔茅斯的灰烬";
        document.getElementById("search-form").querySelectorAll("span.text")[36].innerHTML = "本体";
        document.getElementById("search-form").querySelectorAll("div.field-header")[0].innerHTML = "名称";
        document.getElementById("search-form").querySelectorAll("div.field-header")[1].innerHTML = "类型";
        document.getElementById("search-form").querySelectorAll("div.field-header")[2].innerHTML = "品质";
        document.getElementById("search-form").querySelectorAll("div.field-header")[3].innerHTML = "物理伤害";
        document.getElementById("search-form").querySelectorAll("div.field-header")[4].innerHTML = "穿刺转换";
        document.getElementById("search-form").querySelectorAll("div.field-header")[5].innerHTML = "伤害类型";
        document.getElementById("search-form").querySelectorAll("div.field-header")[6].innerHTML = "基础护甲";
        document.getElementById("search-form").querySelectorAll("div.field-header")[7].innerHTML = "盾-格挡伤害";
        document.getElementById("search-form").querySelectorAll("div.field-header")[8].innerHTML = "盾-格挡几率";
        document.getElementById("search-form").querySelectorAll("div.field-header")[9].innerHTML = "盾-格挡恢复时间";
        document.getElementById("search-form").querySelectorAll("div.field-header")[10].innerHTML = "专精-所有技能";
        document.getElementById("search-form").querySelectorAll("div.field-header")[11].innerHTML = "技能等级";
        document.getElementById("search-form").querySelectorAll("div.field-header")[12].innerHTML = "技能变异";
        document.getElementById("search-form").querySelectorAll("div.field-header")[13].innerHTML = "基本属性";
        document.getElementById("search-form").querySelectorAll("div.field-header")[14].innerHTML = "装备穿戴要求";
        document.getElementById("search-form").querySelectorAll("div.field-header")[15].innerHTML = "攻击性";
        document.getElementById("search-form").querySelectorAll("div.field-header")[16].innerHTML = "防御性";
        document.getElementById("search-form").querySelectorAll("div.field-header")[17].innerHTML = "反击";
        document.getElementById("search-form").querySelectorAll("div.field-header")[18].innerHTML = "伤害类型转换";
        document.getElementById("search-form").querySelectorAll("div.field-header")[19].innerHTML = "其他";
        document.getElementById("search-form").querySelectorAll("div.field-header")[20].innerHTML = "基本属性";
        document.getElementById("search-form").querySelectorAll("div.field-header")[21].innerHTML = "攻击性";
        document.getElementById("search-form").querySelectorAll("div.field-header")[22].innerHTML = "防御性";
        document.getElementById("search-form").querySelectorAll("div.field-header")[23].innerHTML = "反击";
        document.getElementById("search-form").querySelectorAll("div.field-header")[24].innerHTML = "伤害类型转换";
        document.getElementById("search-form").querySelectorAll("div.field-header")[25].innerHTML = "物品等级";
        document.getElementById("search-form").querySelectorAll("div.field-header")[26].innerHTML = "玩家等级";
        document.getElementById("search-form").querySelectorAll("div.field-header")[27].innerHTML = "套装";
        document.getElementById("search-form").querySelectorAll("div.field-header")[28].innerHTML = "特绿";
        document.getElementById("search-form").querySelectorAll("div.field-header")[29].innerHTML = "物品可以被制作";
        document.getElementById("search-form").querySelectorAll("div.field-header")[30].innerHTML = "指定对象掉落";
        document.getElementById("search-form").querySelectorAll("div.field-header")[31].innerHTML = "商店出售";
        document.getElementById("search-form").querySelectorAll("div.field-header")[32].innerHTML = "声望装备";
        document.getElementById("search-form").querySelectorAll("div.field-header")[33].innerHTML = "版本";


        document.getElementById("search-form").childNodes[0].innerHTML = "高级搜索";
        document.getElementById("search-form").childNodes[2].childNodes[0].innerHTML = "重置";
        document.getElementById("search-form").childNodes[2].childNodes[2].innerHTML = "查询";

        document.getElementById("search-form").querySelectorAll("div.search-section-header")[0].innerHTML = "常规";
        document.getElementById("search-form").querySelectorAll("div.search-section-header")[1].innerHTML = "武器属性";
        document.getElementById("search-form").querySelectorAll("div.search-section-header")[2].innerHTML = "护甲/盾属性";
        document.getElementById("search-form").querySelectorAll("div.search-section-header")[3].innerHTML = "物品属性";
        document.getElementById("search-form").querySelectorAll("div.search-section-header")[4].innerHTML = "宠物装备";
        document.getElementById("search-form").querySelectorAll("div.search-section-header")[5].innerHTML = "限制条件";
        document.getElementById("search-form").querySelectorAll("div.search-section-header")[6].innerHTML = "杂项";

        //select部分
        for (var snum =0; snum<18; snum++) {
            document.getElementById("search-form").querySelectorAll("a")[snum].innerHTML = "无";
        }

        //ADD部分
        for (var num =0; num<16; num++) {
            document.getElementById("search-form").querySelectorAll("div.add-btn")[num].innerHTML = "添加"
        }
        //MIN、MAX部分
        for (var numm =0; numm<23; numm++) {
            document.getElementById("search-form").querySelectorAll("input.search-input.value-max")[numm].setAttribute("placeholder","最大值");
            document.getElementById("search-form").querySelectorAll("input.search-input.value-min")[numm].setAttribute("placeholder","最小值");
        }


    }

    // Your code here...

})();