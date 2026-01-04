// ==UserScript==
// @name         识别客户并且查找
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  识别客户并且查找123
// @author       You
// @match        https://www.e-cology.com.cn/crm/customer/4973922920472213726/customerList/all*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=e-cology.com.cn
// @grant        none
// @license      123
// @downloadURL https://update.greasyfork.org/scripts/474129/%E8%AF%86%E5%88%AB%E5%AE%A2%E6%88%B7%E5%B9%B6%E4%B8%94%E6%9F%A5%E6%89%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474129/%E8%AF%86%E5%88%AB%E5%AE%A2%E6%88%B7%E5%B9%B6%E4%B8%94%E6%9F%A5%E6%89%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        function aaa(){
            var bbb = setTimeout(aaa,1000);
            console.log("检测页面是否加载完成");
            if(document.querySelectorAll("input[weid='_c1k81h_griqrh_hdya7p_f17ut9_hhjnso_qarwfx_ftxayb']")[0] != null){
                console.log("页面加载完成!");
                clearTimeout(bbb);
                if(localStorage.getItem("customerName") != ""){
                    console.log("找到上一个页面存储的数据!");
                    setTimeout(search,1000);
                    // document.querySelectorAll("input[weid='_c1k81h_griqrh_hdya7p_f17ut9_hhjnso_qarwfx_ftxayb']")[0].value = localStorage.getItem("customerName");
                    // document.querySelectorAll("span[class='ui-icon ui-icon-wrapper ui-searchAdvanced-input-icon']")[0].click();
                    // localStorage.setItem("customerName","");
                }
            }
        }
        aaa();
        function search(){

            document.querySelectorAll("span").forEach(function(item){
                if(item.innerText == "所有客户"){
                    item.click();
                }
            })

            var name = document.querySelectorAll("input[weid='_c1k81h_griqrh_hdya7p_f17ut9_hhjnso_qarwfx_ftxayb']")[0];
            //var lastValue = input.value;
            name.value = localStorage.getItem("customerName");
            var nameevent = new Event('input', { bubbles: true });
            var nametracker = name._valueTracker;
            if (nametracker) {
                nametracker.setValue('');
            }
            name.dispatchEvent(nameevent);

            //document.querySelectorAll("input[weid='_c1k81h_griqrh_hdya7p_f17ut9_hhjnso_qarwfx_ftxayb']")[0].value = localStorage.getItem("customerName");
            setTimeout(document.querySelectorAll("span[class='ui-icon ui-icon-wrapper ui-searchAdvanced-input-icon']")[0].click(),1000);
            localStorage.setItem("customerName","");
        }
    }
    // Your code here...
})();