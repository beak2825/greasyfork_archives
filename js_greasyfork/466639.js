// ==UserScript==
// @name         石家庄铁道大学评教系统
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  我草真牛逼
// @author       You
// @match        https://webvpn.stdu.edu.cn/http/77726476706e69737468656265737421fae00f8f33347d1e7b0c9ce29b5b/xspjgl/xspj_cxXspjIndex.html?doType=details&gnmkdm=N401605&layout=default&su=20203164
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stdu.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466639/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/466639/%E7%9F%B3%E5%AE%B6%E5%BA%84%E9%93%81%E9%81%93%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==


(

 window.onload =function () {
    'use strict';


     // 创建按钮元素
     var button1 = document.createElement('button');

     // 设置按钮文本
     button1.innerText = '点击按钮';

     // 添加点击事件处理程序
     button1.addEventListener('click', function() {
         //var allClass = "//div//td[@title='未评']";
         //document.evaluate(allClass, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).click();


         // Your code here...
         // 使用XPath选择器选择单选框
         var xuanze = "//div//div[@class='radio-inline input-xspj input-xspj-1']//label/input";
         var result = document.evaluate(xuanze, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
         console.log(result);

         // 迭代并处理选择的单选框
         for (var i = 0; i < result.snapshotLength; i++) {
             var radioBtn = result.snapshotItem(i);
             // 在这里执行您的操作，比如设置选中状态
             radioBtn.checked = true;
         }

         document.evaluate("//div//textarea[@class='form-control']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value="无";
         // XPath选择器
         var xpathExpression = "//div//textarea[@class='form-control input-zgpj']";

         // 获取所有匹配的文本区域元素
         var textareas = document.evaluate(xpathExpression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

         // 要统一赋值的文本内容
         var textValue = "无";

         // 遍历文本区域元素并统一赋值
         for (var j = 0; j < textareas.snapshotLength; j++) {
             var textarea = textareas.snapshotItem(j);
             textarea.value = textValue;
         }
         // XPath选择器
         var buttonxpathExpression = "//div//button[@id='btn_xspj_tj']";
         // 获取按钮元素
         var button = document.evaluate(buttonxpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
         // 模拟点击操作
         if (button) {
             button.click();
         }

     });

     // 将按钮添加到页面中的某个元素中
     var container = document.getElementById('navbar_container');
     console.log(container)
     container.appendChild(button1);






}



)();