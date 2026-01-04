// ==UserScript==
// @name         将每个网站固定在一个窗口。如此，打开B站、知乎、淘宝、京东等网页时便不会弹出无数个窗口，影响视觉及使用体验。可单独设计适配网站，仅在需要的网站使用此功能。
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  固定在此界面
// @author       黄先生
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397396/%E5%B0%86%E6%AF%8F%E4%B8%AA%E7%BD%91%E7%AB%99%E5%9B%BA%E5%AE%9A%E5%9C%A8%E4%B8%80%E4%B8%AA%E7%AA%97%E5%8F%A3%E3%80%82%E5%A6%82%E6%AD%A4%EF%BC%8C%E6%89%93%E5%BC%80B%E7%AB%99%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E7%BD%91%E9%A1%B5%E6%97%B6%E4%BE%BF%E4%B8%8D%E4%BC%9A%E5%BC%B9%E5%87%BA%E6%97%A0%E6%95%B0%E4%B8%AA%E7%AA%97%E5%8F%A3%EF%BC%8C%E5%BD%B1%E5%93%8D%E8%A7%86%E8%A7%89%E5%8F%8A%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E3%80%82%E5%8F%AF%E5%8D%95%E7%8B%AC%E8%AE%BE%E8%AE%A1%E9%80%82%E9%85%8D%E7%BD%91%E7%AB%99%EF%BC%8C%E4%BB%85%E5%9C%A8%E9%9C%80%E8%A6%81%E7%9A%84%E7%BD%91%E7%AB%99%E4%BD%BF%E7%94%A8%E6%AD%A4%E5%8A%9F%E8%83%BD%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/397396/%E5%B0%86%E6%AF%8F%E4%B8%AA%E7%BD%91%E7%AB%99%E5%9B%BA%E5%AE%9A%E5%9C%A8%E4%B8%80%E4%B8%AA%E7%AA%97%E5%8F%A3%E3%80%82%E5%A6%82%E6%AD%A4%EF%BC%8C%E6%89%93%E5%BC%80B%E7%AB%99%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E6%B7%98%E5%AE%9D%E3%80%81%E4%BA%AC%E4%B8%9C%E7%AD%89%E7%BD%91%E9%A1%B5%E6%97%B6%E4%BE%BF%E4%B8%8D%E4%BC%9A%E5%BC%B9%E5%87%BA%E6%97%A0%E6%95%B0%E4%B8%AA%E7%AA%97%E5%8F%A3%EF%BC%8C%E5%BD%B1%E5%93%8D%E8%A7%86%E8%A7%89%E5%8F%8A%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C%E3%80%82%E5%8F%AF%E5%8D%95%E7%8B%AC%E8%AE%BE%E8%AE%A1%E9%80%82%E9%85%8D%E7%BD%91%E7%AB%99%EF%BC%8C%E4%BB%85%E5%9C%A8%E9%9C%80%E8%A6%81%E7%9A%84%E7%BD%91%E7%AB%99%E4%BD%BF%E7%94%A8%E6%AD%A4%E5%8A%9F%E8%83%BD%E3%80%82.meta.js
// ==/UserScript==

function one(){
    var a = document.getElementsByTagName('a');
    for(var i = 0, len = a.length; i < len; i++){
        a[i].target = '_self';
    }
}
one();