// ==UserScript==
// @name         去除创客贴/图怪兽/比格设计去水印珍藏版V231011
// @namespace    https://greasyfork.org/en/users/1089045-tao-yan
// @version      3.2
// @description  在V3.0去除创客贴设计的基础上，新增一键去除图怪兽设计、比格设计作品的水印标签,本不再支持稿定设计去水印，作者专门更新了稿定设计的单独去水印版本，相比v3.0通用性更强。有时候遇到神器按钮不见的时候，重新从首页进入编辑设计页面试试。交流jimeizy学习！
// @author       欢迎关注我的公众号jimeizy,本代码功能仅供个人学习交流研究，不得他用，否则后果自负，请支持网站原创版权。
// @match        https://www.chuangkit.com/odyssey/*
// @match        https://ue.818ps.com/v4/?*
// @match        https://bigesj.com/bill/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467965/%E5%8E%BB%E9%99%A4%E5%88%9B%E5%AE%A2%E8%B4%B4%E5%9B%BE%E6%80%AA%E5%85%BD%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0%E7%8F%8D%E8%97%8F%E7%89%88V231011.user.js
// @updateURL https://update.greasyfork.org/scripts/467965/%E5%8E%BB%E9%99%A4%E5%88%9B%E5%AE%A2%E8%B4%B4%E5%9B%BE%E6%80%AA%E5%85%BD%E6%AF%94%E6%A0%BC%E8%AE%BE%E8%AE%A1%E5%8E%BB%E6%B0%B4%E5%8D%B0%E7%8F%8D%E8%97%8F%E7%89%88V231011.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeWatermark() {

    var classNames = ['.remove-cktTemplate-watermark','.material-water-mark','.waterMarksorb_1','div.canvas.water-mark','.image-watermark','.fixedWaterMaskButton','.water','.water-tip','.editor-watermark','.editor-remove-watermark'];

    classNames.forEach(function(className) {

        var watermarkDivs = document.querySelectorAll(className);

        watermarkDivs.forEach(function(watermarkDiv) {

            if(className==='div.canvas.water-mark'){

            var userInput = prompt('❤关注公众号❤：jimeizy,回复关键词：CKT，免费解锁↓');

             if (userInput === null || userInput.trim() === '') {

                alert('请刷新本页面重新祛除水印。');

                return;
            }
                if(userInput){

                watermarkDiv.removeAttribute(userInput);}

            }

            var commentNode = document.createComment('This div has been commented.');
            watermarkDiv.parentNode.replaceChild(commentNode, watermarkDiv);

        })
        })

        // 创建 MutationObserver 实例 阻止删除后该类的标签还自动生成
var classNamesb = ['editor-watermark','remove-cktTemplate-watermark','material-water-mark','waterMarksorb_1','canvas water-mark','image-watermark','fixedWaterMaskButton','water','water-tip']; // 你的类名数组

function removeElementsWithClass(nodeList) {
  nodeList.forEach(function(node) {
    if (node.classList && classNamesb.some(className => node.classList.contains(className))) {
      node.remove();
    }
    if (node.childNodes && node.childNodes.length) {
      removeElementsWithClass(node.childNodes);
    }
  });
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    removeElementsWithClass(mutation.addedNodes);
  });
});

observer.observe(document, { childList: true, subtree: true });



    }

    function addButton() {
    // 创建按钮元素
    var button = document.createElement('button');
    button.textContent = '祛除水印';

    // 设置按钮样式
    button.style.position = 'fixed';
    button.style.top = '80px';
    button.style.right = '270px';
    button.style.zIndex = '99999';
    button.style.backgroundColor = 'orange'; // 设置按钮背景颜色

    // 添加点击事件处理程序
    button.addEventListener('click', removeWatermark);

    // 将按钮插入页面
    document.body.appendChild(button);
}

    // 在页面加载完成后运行脚本
    window.addEventListener('load', addButton);
})();
