// ==UserScript==
// @name         Darkflame++
// @name:en      Darkflame++
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  A script to estimate guard number for vup.darkflame.ga.
// @description:en  A script to estimate guard number for vup.darkflame.ga.
// @author       CryoVit
// @match        https://vup.darkflame.ga/ranking/*
// @match        http://vup.darkflame.ga/ranking/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=darkflame.ga
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451234/Darkflame%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/451234/Darkflame%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        var t = document.getElementsByClassName("ant-list-item-meta ng-star-inserted");
        for (let i = 0; i < t.length; i++) {
            var t0 = t[i].childNodes[3];
            // var t2 = t0.getElementsByClassName("ant-col ant-col-6");
            var t1 = t0.getElementsByClassName("ant-col ant-col-4");
            var arr = [ , , , , , , ];
            var buff = [ , , ];
            var ans = 0;
            if (t1.length > 0) {
                for (let j = 0; j < 5; j++) {
                    arr[j] = t1[j].getElementsByClassName("ant-statistic-content-value")[0].outerText;
                    if (arr[j].indexOf(',') != -1) {
                        buff = arr[j].split(',');
                        arr[j] = buff[0] + buff[1] + buff[2];
                    }
                    arr[j] = parseFloat(arr[j]);
                }
                ans = ((Math.log(arr[1])/Math.log(arr[1]/arr[2])*Math.sqrt(arr[1])+Math.sqrt(arr[4]))/Math.sqrt(arr[0])).toFixed(2);
                if (arr[0] != 0) {
                    t1[5].innerHTML =
                        "<nz-statistic _ngcontent-serverapp-c109=\"\"><div class=\"ant-statistic\"><div class=\"ant-statistic-title\">得分<!----><!----></div><div class=\"ant-statistic-content\"><!----><nz-statistic-number><span class=\"ant-statistic-content-value\"><!----><span class=\"ant-statistic-content-value-int ng-star-inserted\">"+
                        ans +
                        "</span><!----><!----><!----><!----></span></nz-statistic-number><!----></div></div></nz-statistic>";
                }
                // console.log(t0.getElementsByTagName("a")[0].innerText, arr[0], arr[1], arr[2], arr[4], ans);
            } else {
                t1 = t0.getElementsByClassName("ant-col ant-col-3");
                for (let j = 0; j < 7; j++) {
                    arr[j] = t1[j].getElementsByClassName("ant-statistic-content-value")[0].outerText;
                    if (arr[j].indexOf(',') != -1) {
                        buff = arr[j].split(',');
                        arr[j] = buff[0] + buff[1] + buff[2];
                    }
                    arr[j] = parseFloat(arr[j]);
                }
                ans = ((Math.log(arr[1])/Math.log(arr[1]/arr[2])*Math.sqrt(arr[1])+Math.sqrt(arr[6]))/Math.sqrt(arr[0])).toFixed(2);
                if (arr[0] != 0) {
                    t1[7].innerHTML =
                        "<nz-statistic _ngcontent-serverapp-c109=\"\"><div class=\"ant-statistic\"><div class=\"ant-statistic-title\">得分<!----><!----></div><div class=\"ant-statistic-content\"><!----><nz-statistic-number><span class=\"ant-statistic-content-value\"><!----><span class=\"ant-statistic-content-value-int ng-star-inserted\">"+
                        ans +
                        "</span><!----><!----><!----><!----></span></nz-statistic-number><!----></div></div></nz-statistic>";
                }
                // console.log(t0.getElementsByTagName("a")[0].innerText, arr[0], arr[1], arr[2], arr[6], ans);
            }
        }
    }, 2000)
})();