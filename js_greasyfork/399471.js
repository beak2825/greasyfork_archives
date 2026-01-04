// ==UserScript==
// @name         Filter remover
// @version      1.13
// @namespace    filter.404
// @license      GNU General Public License v3.0
// @description  用于去除网页灰色滤镜
// @author       eduarte
// @match      http://*/*
// @match      https://*/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/399471/Filter%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/399471/Filter%20remover.meta.js
// ==/UserScript==

//
// 没有真相的致哀是对牺牲者的亵渎
// 一个阻止人们自发纪念活动的政府，更没有资格搞什么「公祭日」
// 我们需要这种带着反思的具体的悼念，希望将来某天，除了反思，还有追责
//

(function() {
    'use strict';
    let style = document.createElement('style');
    style.innerHTML = "*, html, body{filter: none !important; -webkit-filter: none !important; -moz-filter: none !important; background-blend-mode: normal !important}";
    document.body.appendChild(style);
    let imgs = document.getElementsByTagName("img")
    for (let index in imgs) {
        if (imgs[index].getAttribute) {
            if (imgs[index].getAttribute("src") !== null) {
                imgs[index].setAttribute("src", imgs[index].getAttribute("src").replace("_gray", ""));
            }
            if (imgs[index].getAttribute("data-src") !== null) {
                imgs[index].setAttribute("data-src", imgs[index].getAttribute("data-src").replace("_gray", ""));
            }
        }
    }
    const removeFilter = () => {
        document.documentElement.style.setProperty('filter', 'none', 'important');
        document.body.style.setProperty('filter', 'none', 'important');
        // weibo
        let elems = document.querySelectorAll("[class*='gray']")
        for (let index in elems) {
            if (elems[index].getAttribute) {
                let classVal = elems[index].getAttribute("class");
                elems[index].setAttribute("class", classVal.replace("gray", ""));
            }
        }
    }
    let patience = 20;
    let interval;
    window.onload = () => {
        interval = setInterval(() => {
            if (document.querySelectorAll("[class*='gray']").length > 0) {
                removeFilter();
                patience = 20
            };
            patience--;
            if (patience === 0) clearInterval(interval);
        }, 100);
    }
})();