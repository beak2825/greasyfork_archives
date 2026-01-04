// ==UserScript==
// @name         Json.cn净化
// @namespace    http://tampermonkey.net/
// @version      0.7.7
// @description  json.cn 纯净版
// @author       aries.zhou
// @match        https://www.json.cn/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419993/Jsoncn%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/419993/Jsoncn%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

window.onload = function () {
    var style = document.createElement("style");
    style.innerHTML = 'main {height: 100%!important;} ';
    document.head.appendChild(style);

    var jsonsrc = document.getElementById('json-src');
    var alt = '请输入json数据....';
    if(jsonsrc){
      jsonsrc.setAttribute('placeholder', alt);
    }


    var topLinkArea =  document.getElementsByClassName('top-link-area');

    var navbar = document.getElementsByClassName('navbar');
    var container =  document.getElementsByClassName('container-fluid');
    var friendLink = document.getElementsByClassName('friend-link');
    var footer = document.getElementsByClassName('footer');
    var mt4 = document.getElementsByClassName('mt-4');
    if (topLinkArea) {
        topLinkArea[0].parentNode.removeChild(topLinkArea[0]);
    }
    if (navbar) {
        navbar[0].parentNode.removeChild(navbar[0]);
    }
    if (container) {
        container[0].parentNode.removeChild(container[0]);
    }
    if (friendLink) {
        friendLink[0].parentNode.removeChild(friendLink[0]);
    }
    if (footer){
        footer[0].parentNode.removeChild(footer[0]);
    }
    if (mt4){
        mt4[0].parentNode.removeChild(mt4[0]);
    }
};
