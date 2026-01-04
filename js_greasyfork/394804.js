// ==UserScript==
// @name         獨立樣本計算器 - excel貼上工具
// @version      1.2.0
// @description  去除excel的低能空白
// @author       NDM
// @include      https://pulipulichen.github.io/HTML5-t-test-calculator/

// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/180333
// @downloadURL https://update.greasyfork.org/scripts/394804/%E7%8D%A8%E7%AB%8B%E6%A8%A3%E6%9C%AC%E8%A8%88%E7%AE%97%E5%99%A8%20-%20excel%E8%B2%BC%E4%B8%8A%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/394804/%E7%8D%A8%E7%AB%8B%E6%A8%A3%E6%9C%AC%E8%A8%88%E7%AE%97%E5%99%A8%20-%20excel%E8%B2%BC%E4%B8%8A%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
 

(function() {
    document.getElementsByClassName("item")[0].onclick = () =>{
        input_data.value = input_data.value.split("	").join(",")
    }
    document.querySelector('#input_data').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            input_data.value = input_data.value.split("	").join(",")
        }
    });

})();