// ==UserScript==
// @name         Show Pixiv RequestPlan StandardPrice
// @namespace    https://hisaruki.ml/
// @version      3
// @description  https://i.imgur.com/GrhY0Xt.png
// @author       hisaruki
// @match        https://www.pixiv.net/request/creators/*
// @icon         https://www.pixiv.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437003/Show%20Pixiv%20RequestPlan%20StandardPrice.user.js
// @updateURL https://update.greasyfork.org/scripts/437003/Show%20Pixiv%20RequestPlan%20StandardPrice.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //https://www.pixiv.net/ajax/commission/page/users/586630/request?lang=ja
    const search = function(uid){
        let url = "https://www.pixiv.net/ajax/commission/page/users/" + uid + "/request?lang=ja";
        let root = document.querySelector('[data-gtm-value="'+uid+'"] > [title]').parentElement;
        let go = null;
        if(!root.querySelector("#sprsp_"+ uid)){
            go = true;
        }
        if(go === true){
            fetch(url)
                .then(response => response.json())
                .then(data => {
                data.body.page.plans.forEach(plan => {
                    let p = document.createElement("p");
                    p.setAttribute("id", "sprsp_"+ uid);
                    p.textContent = plan.planStandardPrice;
                    root.appendChild(p);
                });
            });
        }
    }
    const uids = function(){
        return new Set(Array.from(document.querySelectorAll("a[href]")).map(a => {
            let href = a.getAttribute("href");
            let uid = /users\/([0-9]+)/g.exec(href);
            if(uid){
                return uid[1];
            }
        }).filter(x => x));
    }
    const check = function(){
        uids().forEach(uid => {
            search(uid);
        });
    }
    setInterval(function(){
        if(document.querySelectorAll("a[href]").length > 20){
            check();
            //console.log(uids());
        }
    },2000);

    // Your code here...
})();