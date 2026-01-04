// ==UserScript==
// @name         普信虾头蝻
// @namespace    http://tampermonkey.net/
// @version      2024-10-19
// @description  让狗东见识见识普信男的铁拳
// @author       whoisit
// @license      MIT
// @match        https://myivc.jd.com/fpzz/hkfpReqForIvcCenter.action?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513188/%E6%99%AE%E4%BF%A1%E8%99%BE%E5%A4%B4%E8%9D%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/513188/%E6%99%AE%E4%BF%A1%E8%99%BE%E5%A4%B4%E8%9D%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let customerName = "yourname"
    let provinceNum = "0"  // 省份代号，自行用F12查看，下两项同
    let cityNum = "0"
    let countyNum = "0"
    let customerTel = "" // 填写你的手机号
    let address =  "" //填写详细邮寄地址

    window.onload = function(){
        // 获取 select 元素
        var selectElement = document.getElementById('ivcType');
        // 创建新的 option 元素
        var newOption = document.createElement("option");
        // 设置 option 的值和文本
        newOption.value = "1";
        newOption.textContent = "纸质普票";
        // 将新的 option 添加到 select 元素中
        selectElement.appendChild(newOption);
        // 设置 select 元素的值为新增的选项值
        selectElement.value = "1";

        // 模拟 change 事件
        var event = new Event('change', { bubbles: true, cancelable: true });
        selectElement.dispatchEvent(event);

        document.querySelector("#customerName").value = customerName

        document.querySelector("#provinceNum").value = provinceNum
        document.querySelector("#provinceNum").dispatchEvent(event);
        setTimeout(()=>{
            document.querySelector("#cityNum").value = cityNum
            document.querySelector("#cityNum").dispatchEvent(event);
            setTimeout(()=>{
                document.querySelector("#countyNum").value = countyNum
                document.querySelector("#countyNum").dispatchEvent(event);
                setTimeout(()=>{
                    document.getElementsByClassName('btn-1 mr20')[0].click()
                },500)
            }, 1500)
        }, 500)

        document.querySelector("#customerTel").value = customerTel

        document.querySelector("#address").value = address
    }
    // Your code here...
})();