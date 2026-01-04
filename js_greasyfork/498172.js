// ==UserScript==
// @name         华东理工大学（ECUST）教务系统自动填写教学评价
// @version      0.3.2
// @description  适用于华东理工大学教务系统（强智教务）的自动填写教师评价的脚本，不需要疯狂点击非常满意，延长鼠标寿命。
// @author       KamabokoWen, chinazyq
// @include      *://inquiry.ecust.edu.cn/jsxsd/xspj/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GNU_GPLv3
// @namespace https://greasyfork.org/users/1257528
// @downloadURL https://update.greasyfork.org/scripts/498172/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%88ECUST%EF%BC%89%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/498172/%E5%8D%8E%E4%B8%9C%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%88ECUST%EF%BC%89%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    var now_url = window.location.href;
    var flag;
    var isEdit;
    if(now_url.indexOf("xspj_list.do")!=-1)
    {
        alert("自动填写教学评价脚本正常运行，点击评价后会自动提交！Coded by KamabokoWen");
    }
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
                    document.getElementById("pj0601id_5_1").click();
                    document.getElementById("issubmit").value = "1";
                    document.getElementById("Form1").submit();
                }
                else
                {
                    document.getElementById("pj0601id_1_1").click();
                    document.getElementById("pj0601id_2_1").click();
                    document.getElementById("pj0601id_3_1").click();
                    document.getElementById("pj0601id_4_1").click();
                    document.getElementById("pj0601id_5_1").click();
                    document.getElementById("pj0601id_6_1").click();
                    document.getElementById("pj0601id_7_1").click();
                    document.getElementById("pj0601id_8_1").click();
                    document.getElementById("pj0601id_9_1").click();
                    document.getElementById("pj0601id_10_1").click();
                    document.getElementById("pj0601id_11_1").click();
                    document.getElementById("pj0601id_12_1").click();
                    document.getElementById("issubmit").value = "1";
                    document.getElementById("Form1").submit();
                }
            }
        }
    }})();