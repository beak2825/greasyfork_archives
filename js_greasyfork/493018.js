// ==UserScript==
// @name         wenpipi
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  wenpipi.com/sim 改变一些样式
// @author       myaijarvis
// @run-at       document-end
// @match        http://www.wenpipi.com/sim
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @require      https://cdn.jsdelivr.net/npm/zhangsan-layui@1.0.3/layui.js
// @resource     https://www.layuicdn.com/layui-v2.6.8/css/layui.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wenpipi.com
// @downloadURL https://update.greasyfork.org/scripts/493018/wenpipi.user.js
// @updateURL https://update.greasyfork.org/scripts/493018/wenpipi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addStyle();
    addBtn();

    $("#operateBtn").click(async function () {
        operate1();
        operate2_1();
        await sleep(1000);
        operate3();
        layer.msg("success",{icon: 1});
    })

})();
/*
js，在<div id="resultDivId"></div>中，将所有没有style属性的<span></span>的元素都加上style="background:#f20d0d8c;
*/
function operate3(){
    // 获取目标元素
    var resultDiv = document.getElementById("resultDivId");

    // 获取所有没有 style 属性的 <span> 元素
    var spanElements = resultDiv.querySelectorAll('span:not([style])');

    // 遍历每个 <span> 元素
    spanElements.forEach(function(spanElement) {
        // 添加背景色样式
        spanElement.setAttribute('style', 'background:#f20d0d8c;'); // 红色
    });


}
/*

文字绿色底部划线表示左边缺失

js，在<div id="resultDivId"></div>中，删除所有style="background:#e6ffe6;"的元素

<ins style="background:#e6ffe6;">在中汽研进行的整车涉水(300mm涉水深度超国标3倍标准)、整车侧柱碰和整车正向托底一车三项严苛试验中</ins>

将 <ins> 元素改为 <span> 元素，需要保留原始的内容和属性style="background:#e6ffe6;"，原始的<ins> 内部可能会有<br>元素，这个也需要保留
 */
function operate2_2(){
    // 获取目标元素
    var resultDiv = document.getElementById("resultDivId");

    // 获取所有带有指定背景色样式的 <ins> 元素
    var insElements = resultDiv.querySelectorAll('ins[style="background:#e6ffe6;"]');

    // 遍历每个 <ins> 元素
    insElements.forEach(function(insElement) {
        // 创建新的 <span> 元素
        var spanElement = document.createElement('span');

        // 复制原始的内容到新的 <span> 元素中
        spanElement.innerHTML = insElement.innerHTML;

        // 复制原始的样式到新的 <span> 元素中
        spanElement.setAttribute('style', insElement.getAttribute('style'));

        // 替换 <ins> 元素为新的 <span> 元素
        insElement.parentNode.replaceChild(spanElement, insElement);
    });

}
/*

文字绿色底部划线表示左边缺失

js，在<div id="resultDivId"></div>中，删除所有style="background:#e6ffe6;"的元素

<ins style="background:#e6ffe6;">在中汽研进行的整车涉水(300mm涉水深度超国标3倍标准)、整车侧柱碰和整车正向托底一车三项严苛试验中</ins>
*/
function operate2_1(){
    // 获取目标元素
    var resultDiv = document.getElementById("resultDivId");

    // 获取所有带有 style 属性的元素
    var elements = resultDiv.querySelectorAll('[style]');

    // 遍历每个元素
    elements.forEach(function(element) {
        // 检查是否包含指定的背景色样式
        if (element.style.background === 'rgb(230, 255, 230)') {
            // 删除带有指定背景色样式的元素
            element.parentNode.removeChild(element);
        }
    });

}

/*

文字粉红中间划线表示右边的缺失
js，在<div id="resultDivId"></div>中，将所有<del style="background:#ffe6e6;">整</del>改为span元素

将 <del> 元素改为 <span> 元素，需要保留原始的内容和属性style="background:#ffe6e6;"，原始的<del> 内部可能会有<br>元素，这个也需要保留
*/
function operate1(){

    // 获取目标元素
    var resultDiv = document.getElementById("resultDivId");

    // 获取所有带有指定背景色样式的 <del> 元素
    var delElements = resultDiv.querySelectorAll('del[style="background:#ffe6e6;"]');

    // 遍历每个 <del> 元素
    delElements.forEach(function(delElement) {
        // 创建新的 <span> 元素
        var spanElement = document.createElement('span');

        // 复制原始的内容到新的 <span> 元素中
        spanElement.innerHTML = delElement.innerHTML;

        // 复制原始的样式到新的 <span> 元素中
        //spanElement.setAttribute('style', delElement.getAttribute('style'));
        spanElement.setAttribute('style', 'background:#ffffff00;');// 透明无底色

        // 替换 <del> 元素为新的 <span> 元素
        delElement.parentNode.replaceChild(spanElement, delElement);
    });
}

// 延迟函数，调用函数需要加上async
function sleep(timeout) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}

function addStyle() {
    //debugger;
    let layui_css = `
         .layui-btn{
                   display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px;
                   background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer;
                   -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;
         }
         .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
    GM_addStyle(layui_css);
}

//创建复制按钮
function addBtn() {
    let element = $(
        `<button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="operateBtn">点击</button>`
  );
    $("body").append(element);
}