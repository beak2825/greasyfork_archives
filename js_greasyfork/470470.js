// ==UserScript==
// @name         bilibili（b站，B站）展开取消关注到左上角，一直点击即可
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站展开取消关注到左上角，一直点击即可
// @author       You
// @match        https://space.bilibili.com/*/fans/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470470/bilibili%EF%BC%88b%E7%AB%99%EF%BC%8CB%E7%AB%99%EF%BC%89%E5%B1%95%E5%BC%80%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%E5%88%B0%E5%B7%A6%E4%B8%8A%E8%A7%92%EF%BC%8C%E4%B8%80%E7%9B%B4%E7%82%B9%E5%87%BB%E5%8D%B3%E5%8F%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/470470/bilibili%EF%BC%88b%E7%AB%99%EF%BC%8CB%E7%AB%99%EF%BC%89%E5%B1%95%E5%BC%80%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8%E5%88%B0%E5%B7%A6%E4%B8%8A%E8%A7%92%EF%BC%8C%E4%B8%80%E7%9B%B4%E7%82%B9%E5%87%BB%E5%8D%B3%E5%8F%AF.meta.js
// ==/UserScript==

(function() {
        window.onload = function () {
            alert('看做上角，一个点击即可');
            var x = document.querySelectorAll("ul.relation-list")
            for(let y of x[0].querySelectorAll("ul.be-dropdown-menu.menu-align-")){
                y.style.display="block";
                //console.log(y)
            }
        }
})();