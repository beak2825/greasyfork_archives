// ==UserScript==
// @name         GeekHub自定义勋章
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自定义勋章
// @author       NullFeng
// @match        *://geekhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403052/GeekHub%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8B%8B%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/403052/GeekHub%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8B%8B%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const medal = ["gold","fish","senior_coder"];
    const usernameDom = document.querySelector("a[class='inline-flex items-center mr-5']");
    if(!usernameDom) return;
    const username = usernameDom.innerText;
    const medals = {
        "gold": { icon: "\ud83c\udfc5", title: "金牌会员" },
        "silver": { icon: "\ud83e\udd49", title: "银牌会员" },
        "bronze": { icon: "\ud83e\udd48", title: "铜牌会员" },
        "fish": { icon: "\ud83d\udc1f", title: "干啥啥不行，摸鱼第一名" },
        "coder": { icon: "\ud83d\udc71\u200d\u2642\ufe0f", title: "萌新码农" },
        "senior_coder": { icon: "\ud83d\udc74", title: "高级工程师" }
    };
    let page = window.location.href.match(/\/[a-zA-Z0-9]+\//);
    page && (page = page[0].replace(/[\/\\]/g, ''));
    let medalHTML = "";
    for(let i=0;i<medal.length;i++) {
        if(medals[medal[i]]) {
            medalHTML += "<span title='" + medals[medal[i]].title + "'>" + medals[medal[i]].icon + "</span>";
        }
    }
    if(page == "u")
    {
        const userDom = document.querySelector(".flex-1.p-5>div>.bold.mb-3>span");
        if(userDom && userDom.innerText.indexOf(username) !== -1) {
            let medalDom = document.querySelector(".pb-5.border-b.border-color>div:last-child>span:last-child");
            medalDom && (medalDom.innerHTML = medalHTML);
        }
    } else if(["posts","molecules","second_hands","auctions","group_buys","products"].indexOf(page) >= 0) {
        const userDoms = document.querySelectorAll("a[href='/u/"+username+"']");
        for(let i=0;i<userDoms.length;i++){
            if(userDoms[i].className == "") {
                userDoms[i].parentNode.nextElementSibling.innerHTML = medalHTML;
            }
        }
    }
})();