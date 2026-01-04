// ==UserScript==
// @name         盘古斧快速百度百科
// @namespace    http://tampermonkey.net/
// @version      2024-08-20
// @description  盘古斧针对tag快速现实百度百科内容
// @author       zicaitan
// @license      MIT 
// @match        https://annotate.ait.heytapmobi.com/*
// @icon         https://annotate.ait.heytapmobi.com/web/img/logo.8c023524.svg
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/504666/%E7%9B%98%E5%8F%A4%E6%96%A7%E5%BF%AB%E9%80%9F%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/504666/%E7%9B%98%E5%8F%A4%E6%96%A7%E5%BF%AB%E9%80%9F%E7%99%BE%E5%BA%A6%E7%99%BE%E7%A7%91.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('脚本注入成功');
    function fetchBaiduContent(tag) {
        return new Promise((resolve, reject) => {
            let apiUrl = 'https://60s.viki.moe/baike/' + tag;
            GM_xmlhttpRequest({
                method: "GET",
                url: apiUrl,
                onload: function (response) {
                    if (response.status === 200) {
                        var jsonData = JSON.parse(response.responseText);
                        resolve(jsonData);
                    } else {
                        reject(new Error("Request failed with status:" + response.status));
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    function changetagFunction() {
        let tag = document.querySelector('[class$="_column_1"]')
        console.log(tag);
        let similar_tag = document.querySelector('[class$="_column_2"]')
        console.log(similar_tag);
        fetchBaiduContent(tag.innerText).then(result => {
            similar_tag.innerHTML = result.data.itemName + "——" + result.data.description || '';
            console.log(result.data + result.itemName);
        });
    }


    var regex = new RegExp('_column_1$');
    function getResult(){
        const loadedDivs = new Set();
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // console.log(node.classList)
                    // node.nodeType === Node.ELEMENT_NODE && node.classList.contains('[class$="_column_1"]')
                    if (regex.test(node.className)) {
                        console.log('找到了'+node.classList)
                        changetagFunction();
                    }
                });
            });
        });
        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }
    getResult();


    setTimeout(() => {
        var lastValue = document.querySelector('[class$="_column_1"]').innerHTML;
        setInterval(function(){
        if(document.querySelector('[class$="_column_1"]').innerHTML !== lastValue){
            changetagFunction();
            console.log("change")
            lastValue = document.querySelector('[class$="_column_1"]').innerHTML; // 更新lastValue为当前值
        }
    }, 1000);
    }, 3000);




})();