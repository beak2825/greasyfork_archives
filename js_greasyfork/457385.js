// ==UserScript==
// @name      Steam创意工坊图片替换源
// @version      0.3
// @description  修复Steam创意工坊图片显示问题
// @author       SpectreClass
// @match       http*://steamcommunity.com/*/filedetails/*
// @icon        https://store.steampowered.com/favicon.ico
// @grant        none
// @license GPL-3.0 License
// @namespace https://greasyfork.org/users/170668
// @downloadURL https://update.greasyfork.org/scripts/457385/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/457385/Steam%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E5%9B%BE%E7%89%87%E6%9B%BF%E6%8D%A2%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    if (typeof onYouTubeIframeAPIReady == 'function') {
        onYouTubeIframeAPIReady();
    }
    // var m_url = "https://img.noobzone.ru/getimg.php?url=";
    //var m_url = "https://search.pstatic.net/common?src=";
    // var m_url = "https://imageproxy.pimg.tw/resize?url=";
    // var m_url = "https://images.weserv.nl/?url=";
    // var m_url = "https://pic1.xuehuaimg.com/proxy/";
    var m_url = "https://pic1.xuehuaimg.com/proxy/";
    //<img src="https://i.imgur.com/fVVaDCS.gif">
    var imgs = document.getElementsByTagName("img");
    for (let index = 0; index < imgs.length; index++) {
        const element = imgs[index];
        console.log("CZX  " + element);
        var src_str = element.src.toString();
        if (src_str.indexOf("imgur.com") != -1) {
            document.getElementsByTagName("img")[index].src = m_url + src_str;
            console.log("CZX  " + element.src);
        }
        if (src_str.indexOf("img.youtube.com") != -1) {
            document.getElementsByTagName("img")[index].src = m_url + src_str;
            console.log("CZX  " + element.src);
        }
    }
    // alert(imgs.length);
})();