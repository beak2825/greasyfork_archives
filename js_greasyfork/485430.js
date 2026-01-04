// ==UserScript==
// @license MIT
// @name         poe网页市集过滤傻狗标价
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  过滤傻狗标价 类似=a/b/o 8 divine. =a/b/o 8 divine+ 等压价傻逼弱智
// @author       You
// @match        https://poe.game.qq.com/trade/search/*
// @icon         https://poecdn.game.qq.com/protected/image/trade/layout/logo.png?key=aifr8Q9qj0FYhhu8_rrfhw
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/485430/poe%E7%BD%91%E9%A1%B5%E5%B8%82%E9%9B%86%E8%BF%87%E6%BB%A4%E5%82%BB%E7%8B%97%E6%A0%87%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/485430/poe%E7%BD%91%E9%A1%B5%E5%B8%82%E9%9B%86%E8%BF%87%E6%BB%A4%E5%82%BB%E7%8B%97%E6%A0%87%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const errList = []

    var thisXhr;
    if(typeof ajax_interceptor_qoweifjqon !== 'undefined' ){
        thisXhr = ajax_interceptor_qoweifjqon.originalXHR;
    }else{
        thisXhr = unsafeWindow.XMLHttpRequest;
    }
    const origSend = thisXhr.prototype.send;
    const origOpen = thisXhr.prototype.open;
    thisXhr.prototype.open = function() {
        if(arguments[1].match('jp/c/i')){
            this.responseType = "blob";
        }else{
            this.responseType = "";
        }
        return origOpen.apply(this, arguments)
    }
    thisXhr.prototype.send = function (...args) {
        this.addEventListener('load', () => {
            if (this.status === 200) {
                customLoad(this, args);
            }
        });
        origSend.apply(this, args);
    };

    const customLoad = (xhr, ...args) => {
        const http = new URL(xhr.responseURL);
        const req = tryParseJSON(args[0]);
        const res = tryParseJSON(xhr.response);
        if(http.href.match('api/trade/search')){
            errList.length = 0
        }
        if(http.href.match('api/trade/fetch')){
            try{
                errList.push(...res.result.filter(a => {
                    const currency = a.listing.price.currency
                    if(currency){
                        const matchReg = new RegExp(".*"+currency+"$","i")
                        return !a.item.note.match(matchReg)
                    }else {
                        return false
                    }
                }))
            }catch(e){
                console.log(e)
            }
            setTimeout(() => {
                document.querySelectorAll(".resultset .row").forEach( row => {
                    const dataIdValue = row.getAttribute("data-id");
                    if(errList.some( e=> e.id == dataIdValue)){
                        row.classList.add("hidden");

                    }

                })
                const h3Title = document.querySelector(".row.row-total h3").innerText.replace(/过滤.*/g,"")
                document.querySelector(".row.row-total h3").innerText = h3Title +" 过滤"+errList.length+"条傻狗标价"
            },500)
            console.log('errList',errList)
        }
        // debugger
    }


    const tryParseJSON = text => {
    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        if (e instanceof SyntaxError) {
            return text;
        }
        throw e;
    }
    return json;
};
})();