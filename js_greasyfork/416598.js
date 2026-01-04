// ==UserScript==
// @name              电信维基网优化
// @name:zh           电信维基网优化
// @name:zh-CN        电信维基网优化
// @name:en           电信维基网优化
// @namespace         ouka2020
// @version           1.1
// @description       电信维基网去除遮挡的二维码
// @description:en    remove QRCode
// @author            Ouka2020
// @include           *://www.telewiki.cn/*
// @grant             GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/416598/%E7%94%B5%E4%BF%A1%E7%BB%B4%E5%9F%BA%E7%BD%91%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/416598/%E7%94%B5%E4%BF%A1%E7%BB%B4%E5%9F%BA%E7%BD%91%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    'use strict';

    let main = document.getElementById("line_question");
    if (main){
        main.parentNode.style.visibility="hidden";
    }

    let welcome = document.getElementById("questionnaire_er_code");
    if (welcome){
        welcome.style.visibility="hidden";
    }

    let list1 = document.getElementsByClassName("list1");
    if (list1){
        for (let item of list1){
            if (item.style.width != ""){
                item.style.width = "48%";
            }
        }
    }

    let tbl = document.getElementById("mainTab");
    if (tbl){
        tbl.parentNode.style.width="100%";
    }

    GM_addStyle ( `
        #gmcc {
        width: 98% !important;
        }

        #order {
        width: 98% !important;
        }

        .top {
        width: 100% !important;
        }

        .right {
        width: calc(100% - 250px) !important;
        }

        .copyright {
        width: 100% !important;
        }

        .order_top {
        width: 100% !important;
        }

        .msg {
        width: 100% !important;
        }
    `);
})();