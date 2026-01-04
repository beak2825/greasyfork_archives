// ==UserScript==
// @name         展开云效所有的列表
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  展开云效所有的列表111
// @author       You
// @match        https://devops.aliyun.com/projex/project/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliyun.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464197/%E5%B1%95%E5%BC%80%E4%BA%91%E6%95%88%E6%89%80%E6%9C%89%E7%9A%84%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/464197/%E5%B1%95%E5%BC%80%E4%BA%91%E6%95%88%E6%89%80%E6%9C%89%E7%9A%84%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extend(){
        let iss = document.querySelectorAll('.next-icon.next-icon-arrow-right.next-xs.next-table-tree-arrow')
        for (let index = 0; index < iss.length; index++) {
            let i  = iss[index]
            if (i.getAttribute('aria-label') === '已折叠'){
                i.click()
                setTimeout(() => {extend()}, 1500)
                break
            }
        }
    }

    function tip(content){
        var tip = document.createElement("div");
        tip.id = "onceTip"
        tip.style = "border: 1px solid rgb(221, 227, 231); border-radius: 14px; z-index: 9999; right: 40%; top: 10%; width: 20%; padding: 12px;/* height: 8%; */ background-color: rgba(99, 143, 180, 0.53); cursor: pointer; text-align: center; font-size: 30px; /* line-height: 40px; */ position: fixed !important;";
        tip.innerText=content
        document.body.appendChild(tip);
        setTimeout(function(){
            document.getElementById('onceTip').hidden = true
        }, 3000)
    }

    function doSomething(){
        var divs = document.querySelectorAll('.gantt-range-time-wrap')
        for (let index = 0; index < divs.length; index++) {
            divs[index].style.backgroundColor = '#60db2a'
        }
        extend()
        tip('已展开全部')
    }
    const div = document.createElement("div");
    div.id = "tbButton"
    div.style = "border: 1px solid #dde3e7;border-radius: 4px;z-index: 9999;right: 0px;top: 120px;width: 16px;height: 16px;background-color: rgb(111 143 180);position: fixed !important; cursor: pointer;";
    div.title = '展开全部'
    div.onclick=doSomething
    document.body.appendChild(div);
})();