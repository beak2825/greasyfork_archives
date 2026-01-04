// ==UserScript==
// @name     切换到中/英讨论区
// @version    1.0.1
// @description  查看讨论区
// @author     OOHUO
// @require     http://code.jquery.com/jquery-latest.js
// @noframes
// @match    *://leetcode-cn.com/problems/*
// @match    *://leetcode.com/problems/*
// @grant    GM_addStyle
// @grant    GM.getValue
// @grant    GM_openInTab
// @grant    GM_notification
// @namespace https://greasyfork.org/users/685833
// @downloadURL https://update.greasyfork.org/scripts/412959/%E5%88%87%E6%8D%A2%E5%88%B0%E4%B8%AD%E8%8B%B1%E8%AE%A8%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/412959/%E5%88%87%E6%8D%A2%E5%88%B0%E4%B8%AD%E8%8B%B1%E8%AE%A8%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==
var lc_btn_div = document.createElement('div');
var en_host = "leetcode.com";
var cn_host = "leetcode-cn.com";

var lc_btn_div_id_en = "lc-btn-div-en";
var lc_btn_div_id_cn = "lc-btn-div-cn";

var btn_name_prefix = '<button id="lc-btn" type="button">';
var btn_name_suffix = '</button>';

if (location.hostname == en_host) {
    lc_btn_div.innerHTML = btn_name_prefix + "CN" + btn_name_suffix;
    lc_btn_div.setAttribute('id', lc_btn_div_id_en);
} else {
    lc_btn_div.innerHTML = btn_name_prefix + "EN" + btn_name_suffix;
    lc_btn_div.setAttribute('id', lc_btn_div_id_cn);
}

document.body.appendChild(lc_btn_div);

document.getElementById("lc-btn").addEventListener(
    "click", ButtonClickAction, false
);

function ButtonClickAction (event) {
    var lc_btn_p = document.createElement('p');
    var pathname_L = location.pathname.split('/');
    var leetSite = window.location.href;

    var patt1=new RegExp("(?<=https://leetcode-cn.com/problems/)[^/]+");
    var text=patt1.exec(leetSite)
    var url_en="https://leetcode.com/problems/";
    url_en+=text;
    url_en+="/discuss/?currentPage=1&orderBy=most_votes&query=";

    var patt2=new RegExp("(?<=https://leetcode.com/problems/)[^/]+");
    var text2=patt2.exec(leetSite)
    //alert(text2);
    var url_cn="https://leetcode-cn.com/problems/";
    url_cn+=text2;
    url_cn+="/solution/";
    //alert(url_cn);
    if (location.hostname==en_host) {
        window.open(url_cn);
        document.getElementById(lc_btn_div_id_en).appendChild(lc_btn_div);
    } else {
        window.open(url_en);
        document.getElementById(lc_btn_div_id_cn).appendChild(lc_btn_div);
    }
}

GM_addStyle ( `
    #lc-btn-div-en {
        position:               absolute;
        top:                    137px;
        left:                   900px;
        font-size:              15px;
        margin:                 3px;
        opacity:                0.5;
        z-index:                1100;
    }
    #lc-btn-div-cn p {
        color:                  red;
        background:             white;
    }

    #lc-btn-div-cn {

        position:               absolute;
        top:                    80px;
        left:                   250px;
        font-size:              15px;
        margin:                 3px;
        opacity:                0.5;
        z-index:                1100;
    }
    #lc-btn-div-cn p {
        color:                  red;
        background:             white;
    }

    #lc-btn {
        cursor:                 pointer;
background-color: #d7e5f5;
  background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #d7e5f5), color-stop(100%, #cbe0f5));
  background-image: -webkit-linear-gradient(top, #d7e5f5, #cbe0f5);
  background-image: -moz-linear-gradient(top, #d7e5f5, #cbe0f5);
  background-image: -ms-linear-gradient(top, #d7e5f5, #cbe0f5);
  background-image: -o-linear-gradient(top, #d7e5f5, #cbe0f5);
  background-image: linear-gradient(top, #d7e5f5, #cbe0f5);
  border-top: 1px solid #abbbcc;
  border-left: 1px solid #a7b6c7;
  border-bottom: 1px solid #a1afbf;
  border-right: 1px solid #a7b6c7;
  border-radius: 12px;
  -webkit-box-shadow: inset 0 1px 0 0 white;
  box-shadow: inset 0 1px 0 0 white;
  color: #1a3e66;
  font: normal 11px/1 "Lucida Grande", "Lucida Sans Unicode", "Lucida Sans", Geneva, Verdana, sans-serif;
  padding: 6px 0 7px 0;
  text-align: center;
  text-shadow: 0 1px 1px #fff;
  width: 100px;
    }
` );
