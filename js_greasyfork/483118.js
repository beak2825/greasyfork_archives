// ==UserScript==
// @name         下单
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  下单辅助
// @author       You
// @run-at       document-end
// @match        http://wh.798cx.com/indexPc.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=798cx.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483118/%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/483118/%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log(document.URL)
    // 定义一个处理路由变化的函数
    function handleHashChange() {
        // 获取当前的路由信息
        var currentHash = window.location.hash;
        // 在这里添加你的路由处理逻辑
        //console.log('Hash changed to: ' + currentHash);
        //console.log(document.URL)
        if(currentHash.includes('#/goods')){
            setTimeout(()=>{
                button_monitoring()
            },3000);
        }

    }

    // 添加hashchange事件监听器，bug：只能触发一次,改用定时器
    // window.addEventListener('hashchange', handleHashChange);

    // 设置定时器，每3秒执行一次路由变化检测
    let intervalTimer = setInterval(function() {
        // 获取当前的路由信息
        let currentHash = window.location.hash;

        // 在这里检查路由是否发生变化
        if (currentHash !== window.lastHash) {
            // 触发路由变化时执行的函数
            handleHashChange();

            // 更新最后的路由信息
            window.lastHash = currentHash;
        }
    }, 3000);

    // 在需要停止定时器的地方调用 clearInterval(intervalTimer);
    // 初始加载时触发一次，以处理初始路由
    handleHashChange();


    function button_monitoring(){
        let button_xiadan=document.querySelector("#app > div.page > div.goods.main_flex > div.goods_right.main_flex_item > div.goods_btn > button.el-button.el-button--primary.goods_btn_item.btn1");
        console.log('确认支付按钮',button_xiadan)
        // 添加点击事件监听器
        if(!button_xiadan) return

        button_xiadan.addEventListener('click', function() {
            // 在这里添加你想要执行的代码
            //alert('button_xiadan clicked!');

            setTimeout(()=>{
                let button_queren = document.querySelector("#app > div > div > div > footer > span > button");
                console.log('确认按钮',button_queren)
                // 添加点击事件监听器
                if(!button_queren) return
                button_queren.addEventListener('click', function() {
                    setTimeout(()=>{
                        // 在这里添加你想要执行的代码
                        //alert('button_queren clicked!');
                        alert('请手动刷新');
                    },3000);
                });
            },3000);

        });


    }

    // Your code here...
})();