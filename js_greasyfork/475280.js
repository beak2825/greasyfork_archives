// ==UserScript==
// @name         浙江省建筑市场监管公共服务系统网页value保存
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  浙江省建筑市场监管公共服务系统网页
// @author       chunqingyaya
// @match        https://jzsc.jist.zj.gov.cn/webserver/app/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475280/%E6%B5%99%E6%B1%9F%E7%9C%81%E5%BB%BA%E7%AD%91%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BD%91%E9%A1%B5value%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/475280/%E6%B5%99%E6%B1%9F%E7%9C%81%E5%BB%BA%E7%AD%91%E5%B8%82%E5%9C%BA%E7%9B%91%E7%AE%A1%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BD%91%E9%A1%B5value%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var btn = document.getElementById("su");
    btn.addEventListener('click', function() {
        console.log('按钮被点击了');
        const area_div = document.querySelector('div[eca-data-field-name="所属区县"]');
        const area = area_div.querySelector('input');

        var last_value_1 = area.value;
        area.disabled = false;
        area.readOnly = false;

        document.querySelector('div[eca-data-field-name="所属区县"]').querySelector('input').value = last_value_1;


        const city_div = document.querySelector('div[eca-data-field-name="所属地市"]');
        const city = city_div.querySelector('input');

        var last_value_2 = city.value;
        city.disabled = false;
        city.readOnly = false;

        document.querySelector('div[eca-data-field-name="所属地市"]').querySelector('input').value = last_value_2;


    });


})();

