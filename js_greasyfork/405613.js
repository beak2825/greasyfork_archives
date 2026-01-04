// ==UserScript==
// @name        LeetCode 中英文站点跳转
// @description leetcode swith en and cn site
// @include     *://leetcode*.com/*
// @exclude     *://leetcode.com/*/discuss/*
// @version     1.1.2
// @author      Hansimov
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/248191
// @downloadURL https://update.greasyfork.org/scripts/405613/LeetCode%20%E4%B8%AD%E8%8B%B1%E6%96%87%E7%AB%99%E7%82%B9%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/405613/LeetCode%20%E4%B8%AD%E8%8B%B1%E6%96%87%E7%AB%99%E7%82%B9%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


var lc_btn_div = document.createElement('div');

var en_host = "leetcode.com";
var cn_host = "leetcode-cn.com";

var lc_btn_div_id_en = "lc-btn-div-en";
var lc_btn_div_id_cn = "lc-btn-div-cn";

var btn_name_prefix = '<button id="lc-btn" type="button">';
var btn_name_suffix = '</button>';

if (location.hostname == en_host) {
    lc_btn_div.innerHTML = btn_name_prefix + "前往中文站" + btn_name_suffix;
    lc_btn_div.setAttribute('id', lc_btn_div_id_en);
} else {
    lc_btn_div.innerHTML = btn_name_prefix + "前往英文站" + btn_name_suffix;
    lc_btn_div.setAttribute('id', lc_btn_div_id_cn);
}

document.body.appendChild(lc_btn_div);

document.getElementById("lc-btn").addEventListener(
    "click", ButtonClickAction, false
);

function ButtonClickAction (event) {
    var lc_btn_p = document.createElement('p');
    var pathname_L = location.pathname.split('/');
    if (location.hostname==en_host) {
        window.open("https://"+cn_host+pathname_L.slice(0,3).join('/'));
        document.getElementById(lc_btn_div_id_en).appendChild(lc_btn_div);
    } else {
        window.open("https://"+en_host+pathname_L.slice(0,3).join('/'));
        document.getElementById(lc_btn_div_id_cn).appendChild(lc_btn_div);
    }
}

GM_addStyle ( `
    #lc-btn-div-en {
        position:               absolute;
        top:                    70px;
        left:                   430px;
        font-size:              15px;
        // background:             cyan;
        // border:                 3px outset black;
        margin:                 3px;
        opacity:                0.5;
        z-index:                1100;
        // padding:                5px px;
    }
    #lc-btn-div-cn p {
        color:                  red;
        background:             white;
    }

    #lc-btn-div-cn {
        position:               absolute;
        top:                    5px;
        left:                   550px;
        font-size:              15px;
        // background:             cyan;
        // border:                 3px outset black;
        margin:                 3px;
        opacity:                0.5;
        z-index:                1100;
        // padding:                5px px;
    }
    #lc-btn-div-cn p {
        color:                  red;
        background:             white;
    }

    #lc-btn {
        cursor:                 pointer;
    }

` );