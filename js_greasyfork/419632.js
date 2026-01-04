// ==UserScript==
// @name         极简百度首页
// @namespace    HangLark
// @version      0.1.3
// @description  极简百度首页，适用于登录百度账号后的界面美化
// @author       HangLark
// @match        https://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419632/%E6%9E%81%E7%AE%80%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/419632/%E6%9E%81%E7%AE%80%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("By HangLark");

    //Create navigation bar element
    function createSite(bar, title, address) {
        const site = document.createElement("a");
        site.href = address;
        site.target = "_blank";
        site.className = "mnav c-font-normal c-color-t";
        site.innerHTML = title;
        bar.appendChild(site);
    }

    // Delete useless elements
    const bottom_layer = document.getElementById("bottom_layer");
    bottom_layer.remove();
    const s_top_wrap = document.getElementById("s_top_wrap");
    s_top_wrap.remove();

    //Delete weather
    const s_weather_wrapper = document.getElementsByClassName('s-weather-wrapper')[0];
    s_weather_wrapper.remove();

    //Delete WENXINYIYAN
    const operate_wrapper = document.getElementsByClassName('operate-wrapper')[0];
    operate_wrapper.remove();

    // Hide scrollbar
    const style = document.createElement("style");
    style.innerHTML = `body::-webkit-scrollbar {display: none;}`;
    document.head.appendChild(style);

    // Delete nickname
    const nickname_bar = document.getElementById("s-top-username");
    const nickname = nickname_bar.childNodes[1];
    nickname.innerText = "";
    console.log(nickname.innerText);

    //Adjust search component position
    const head_wrapper = document.getElementById("head_wrapper");
    head_wrapper.style.height = "50%";

    // Clear original navigation bar
    const navigation_bar = document.getElementById("s-top-left");
    const navigation_list = navigation_bar.childNodes;
    for (let i = 0; i <= 7; i++) {
        navigation_bar.removeChild(navigation_list[0]);
    }
    const mnav_s_top_more_btn = document.getElementsByClassName('mnav s-top-more-btn')[0];
    mnav_s_top_more_btn.remove();


    // Customize navigation bar
    createSite(navigation_bar, "Google", "https://www.google.com/");

})();