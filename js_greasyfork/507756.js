// ==UserScript==
// @name         头条标签页显示账户名称
// @namespace    http://tampermonkey.net/
// @version      2024-09-10
// @description  获取账户名称并修改浏览器标签页的title
// @author       Star
// @match        https://ad.oceanengine.com/promotion/promote-manage/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oceanengine.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507756/%E5%A4%B4%E6%9D%A1%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%98%BE%E7%A4%BA%E8%B4%A6%E6%88%B7%E5%90%8D%E7%A7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/507756/%E5%A4%B4%E6%9D%A1%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%98%BE%E7%A4%BA%E8%B4%A6%E6%88%B7%E5%90%8D%E7%A7%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const token=window.location.href.slice(-16);
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    if(localStorage.getItem(token)==null){
        const container = document.getElementById('root-common-header')
        const options = {
            childList: true,
            subtree: true,
        }
        // 创建MutationObserver实例，返回一个观察者对象
        const mutation = new MutationObserver(function(mutationRecoards, observer) {
            if(document.getElementsByClassName("navigator-user-button")[0]!==undefined&&localStorage.getItem(token)==null){
                var str=document.getElementsByClassName("oc-typography-value-int")[0].innerText
                document.title=str
                localStorage.setItem(token,str)
            }
        })
        // 对观察者添加需要观察的元素，并设置需要观察元素的哪些方面
        mutation.observe(container, options);
    }else{
        const target = document.querySelector('title');
        const mutation = new MutationObserver(function(mutationRecoards, observer){
            if(target.innerText=="推广管理"){
                document.title=localStorage.getItem(token);
            }

            console.log("推广管理")
        })
        mutation.observe(target, {
            childList: true,
            subtree: true,
            characterData: true,
        });
            document.title=localStorage.getItem(token);
    }
})();