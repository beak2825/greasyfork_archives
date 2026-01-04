// ==UserScript==
// @name         抢mate60pro
// @version      2.0
// @description  好像还不得行
// @author       Stars
// @match        https://www.vmall.com/product/*
// @icon         https://res.vmallres.com/pimages//uomcdn/CN/pms/202309/gbom/6942103109560/78_78_085E54DDF8265F682ACEA3C84D434E93mp.png
// @grant        none
// @namespace https://greasyfork.org/users/1171747
// @downloadURL https://update.greasyfork.org/scripts/475166/%E6%8A%A2mate60pro.user.js
// @updateURL https://update.greasyfork.org/scripts/475166/%E6%8A%A2mate60pro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let buID = document.querySelector("#pro-operation")
    let bun = document.createElement('button')
    bun.innerText="点击我"
     buID.insertBefore(bun,buID.children[0])
    // // 选择将观察突变的节点
    // var targetNode = document.querySelector('.product-button02');
    // // 观察者的选项(要观察哪些突变)
    // var config = { attributes: true, childList: true, subtree: true };

    // // 当观察到突变时执行的回调函数
    // var callback = function(mutationsList) {
    //     mutationsList.forEach(function(item,index){
    //         if (item.type == 'childList') {
    //             console.log('有节点发生改变，当前节点的内容是:'+ item.target.innerHTML);
    //         } else if (item.type == 'attributes') {
    //                console.log("我有在执行吗")
    //             //  console.log('修改了'+item.attributeName+'属性');
    //             handlerthing()
    //         }
    //     });
    // };

    // // 创建一个链接到回调函数的观察者实例
    // var observer = new MutationObserver(callback);

    // // 开始观察已配置突变的目标节点
    // observer.observe(targetNode, config);
    // //处理抢手机
    // function handlerthing(){
    //     targetNode.click()
    // }
})();