// ==UserScript==
// @name         吉林工程技术师范学院教务系统自动填写教学评价
// @version      1.0
// @description  适用于吉林工程技术师范学院教务系统（强智教务）的自动填写教师评价的脚本
// @include      *://jwxt-8001.vpn.jlenu.edu.cn/jsxsd/xspj/*
// @include      *://jwxt-8001.vpn.jlenu.edu.cn/jsxsd/xspj/*
// @include      *://*.webvpn.jlenu.edu.cn/jsxsd/xspj/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU_GPLv3
// @namespace https://greasyfork.org/users/1100950
// @downloadURL https://update.greasyfork.org/scripts/468774/%E5%90%89%E6%9E%97%E5%B7%A5%E7%A8%8B%E6%8A%80%E6%9C%AF%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/468774/%E5%90%89%E6%9E%97%E5%B7%A5%E7%A8%8B%E6%8A%80%E6%9C%AF%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    var now_url = window.location.href;
    var flag;
    var isEdit;
    window.onload = function auto_click_manyi(){
        if(now_url.indexOf("xspj_edit.do")!=-1)
        {
            flag = document.getElementById("pj0601id_10_1");
            isEdit = document.getElementById("tj");
            if(isEdit!=null)
            {
                if(flag==null)
                {
                    document.getElementById("pj0601id_1_1").click();
                    document.getElementById("pj0601id_2_1").click();
                    document.getElementById("pj0601id_3_1").click();
                    document.getElementById("pj0601id_4_1").click();
                    document.getElementById("pj0601id_5_2").click();
                    document.getElementById("issubmit").value = "1";
                    document.getElementById("Form1").submit();
                }
                else
                {
                    document.getElementById("pj0601id_1_1").click();
                    document.getElementById("pj0601id_2_1").click();
                    document.getElementById("pj0601id_3_1").click();
                    document.getElementById("pj0601id_4_1").click();
                    document.getElementById("pj0601id_5_2").click();
                    document.getElementById("pj0601id_6_1").click();
                    document.getElementById("pj0601id_7_1").click();
                    document.getElementById("pj0601id_8_1").click();
                    document.getElementById("pj0601id_9_1").click();
                    document.getElementById("pj0601id_10_1").click();
                    document.getElementById("pj0601id_11_1").click();
                    document.getElementById("pj0601id_12_1").click();
                    document.getElementById("pj0601id_13_1").click();
                    document.getElementById("pj0601id_14_1").click();
                    document.getElementById("pj0601id_15_1").click();
                    document.getElementById("issubmit").value = "1";
                    document.getElementById("Form1").submit();
                }
            }
        }
    }})();