// ==UserScript==
// @name         百度搜索页面和360搜索页面增加【多重搜索】增强搜索功能，提高搜索效率和搜索成功率 2020.1.17
// @namespace    http://so.yyyydh.com/
// @version      1.3
// @description  在百度搜索页面和360搜索页面增加多重搜索功能，提供简便的搜索引擎切换，提高搜索效率和搜索成功率
// @author       yyyy
// @include      http*://www.baidu.com/s?*
// @include      http*://www.so.com/s?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376115/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%92%8C360%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%8A%A0%E3%80%90%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2%E3%80%91%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD%EF%BC%8C%E6%8F%90%E9%AB%98%E6%90%9C%E7%B4%A2%E6%95%88%E7%8E%87%E5%92%8C%E6%90%9C%E7%B4%A2%E6%88%90%E5%8A%9F%E7%8E%87%202020117.user.js
// @updateURL https://update.greasyfork.org/scripts/376115/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%92%8C360%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%E5%A2%9E%E5%8A%A0%E3%80%90%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2%E3%80%91%E5%A2%9E%E5%BC%BA%E6%90%9C%E7%B4%A2%E5%8A%9F%E8%83%BD%EF%BC%8C%E6%8F%90%E9%AB%98%E6%90%9C%E7%B4%A2%E6%95%88%E7%8E%87%E5%92%8C%E6%90%9C%E7%B4%A2%E6%88%90%E5%8A%9F%E7%8E%87%202020117.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var URLSite = window.location.href;
    var reBD = /baidu/i;
    var re360 = /so/i;
    if(reBD.test(URLSite)){
    document.getElementById("form").style.width = "745px";
    var baiduBtn = document.getElementById("su");
    baiduBtn.style = "width:100px";
    baiduBtn.value = "百度一下";
    var yybdBtn = document.createElement('span');
    yybdBtn.className = baiduBtn.parentNode.className;
    yybdBtn.style = "width:100px;margin:0px 0px 0px 2px";
    yybdBtn.innerHTML = "<input type='button' id='yybd' value='多重搜索' class='btn bg s_btn' style='width:100px;'>";
    yybdBtn.addEventListener('click', function () {
        var input = document.getElementById("kw");
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g, "");
        if (keyword !== "") {
            return yyyySearch(keyword);
        }
    });
    var bdform = document.getElementsByClassName("fm")[0];
    bdform.appendChild(yybdBtn);
    }
    if(re360.test(URLSite)){
    document.getElementById("head").style.width = "830px";
    var soBtn = document.getElementById("su");
    soBtn.style = "width:90px";
    soBtn.value = "搜索";
    var yysoBtn = document.createElement('span');
        soBtn.after(yysoBtn);
    yysoBtn.className = soBtn.parentNode.className;
    yysoBtn.style = "width:90px;margin:0px 0px 0px 2px";
    yysoBtn.innerHTML = "<input type='button' id='yyso' value='多重搜索' class='btn bg s_btn' style='width:90px;'>";
    yysoBtn.addEventListener('click', function () {
        var input = document.getElementById("keyword");
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g, "");
        if (keyword !== "") {
            return yyyySearch(keyword);
        }
    });
    var soform = document.getElementsByClassName("form")[0];
    soform.appendChild(yysoBtn);
    }
    function yyyySearch(keyword){
        var link = "https://so.yyyydh.com/so.php?kw=" + encodeURIComponent(keyword);
        window.open(link);
    }
})();