// ==UserScript==
// @name       Facebook動態消息精簡化顯示
// @namespace  http://blog.darkthread.net/
// @version    0.9
// @description  隱藏動態消息頁面的間接訊息（說讚、回應、被標註），只顯示64字元摘要，但可視需要展開原文
// @match      https://www.facebook.com/
// @copyright  2015+, Jeffrey Lee
// @downloadURL https://update.greasyfork.org/scripts/10288/Facebook%E5%8B%95%E6%85%8B%E6%B6%88%E6%81%AF%E7%B2%BE%E7%B0%A1%E5%8C%96%E9%A1%AF%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/10288/Facebook%E5%8B%95%E6%85%8B%E6%B6%88%E6%81%AF%E7%B2%BE%E7%B0%A1%E5%8C%96%E9%A1%AF%E7%A4%BA.meta.js
// ==/UserScript==

//REF：http://stackoverflow.com/questions/15329167/closest-ancestor-matching-selector-using-native-dom
//模擬jQuery.closest()
function closest(elem, selector) {
    var matchesSelector = elem.matches || elem.webkitMatchesSelector || 
                          elem.mozMatchesSelector || elem.msMatchesSelector;
    while (elem) {
        if (matchesSelector.bind(elem)(selector)) {
            return elem;
        } else {
            elem = elem.parentElement;
        }
    }
    return false;
}
//取得頁面總長
function getDocHeight() {
    return document.documentElement.scrollHeight;
}
var lastLen = getDocHeight();
//隱藏元素，取得64個字元作為摘要，並提供展開功能
//PS：此段很脆弱，一旦FB修改DOM格式就會失效
function hidePost(elem) {
    var content = elem.parentElement.parentElement.parentElement
                  .nextElementSibling.nextElementSibling;
    var friend = content.querySelector("h6").innerText.replace(/\n/g, "");
    var abstract = content.querySelector(".userContent").innerText;
    if (abstract.length > 64) abstract = abstract.substr(0, 64) + "...";
    abstract = abstract.replace(/\n/g, " ");
    var spn = document.createElement("a");
    spn.innerText = friend + " - " + abstract;
    spn.onclick = function() { 
        content.style.display = "";
        spn.remove();
        //更新頁面長度
        lastLen = getDocHeight();
    };
    elem.parentElement.appendChild(spn);
    content.style.display = "none";
    
}
var busy = false;
setInterval(function() {
    //長度未改變時不動作
    if (getDocHeight() == lastLen || busy) return;
    busy = true; //防止重覆執行
    var ary = document.querySelectorAll(
        "div[id^=topnews_main_stream] h5 span.fcg:not([data-shrink])");
    for (var i = 0; i < ary.length; i++) { 
        ary[i].setAttribute("data-shrink", "Y"); //處理完畢加上註記
        var t = ary[i].innerText;
        if (t.indexOf("說這個讚") > -1 || t.indexOf("被標註") > -1 || 
            t.indexOf("回應了") > -1) 
            hidePost(ary[i]);
    }    
    //移除推薦貼文
    ary = document.querySelectorAll("div[id^=topnews_main_stream] ._5g-l");
    for (var i = 0; i < ary.length; i++) {
        closest(ary[i], ".userContentWrapper").innerText = ary[i].innerText;
    }
    lastLen = getDocHeight();
    busy = false;
}, 3*1000);