// ==UserScript==
// @name         头条助手(分享) 废弃
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  头条助手，自动分享
// @author       myaijarvis
// @run-at       document-end
// @match        https://www.toutiao.com/w/*
// @match        https://www.toutiao.com/article/*
// @match        https://www.toutiao.com/video/*
// @match        https://www.ixigua.com/*
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/458212/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%28%E5%88%86%E4%BA%AB%29%20%E5%BA%9F%E5%BC%83.user.js
// @updateURL https://update.greasyfork.org/scripts/458212/%E5%A4%B4%E6%9D%A1%E5%8A%A9%E6%89%8B%28%E5%88%86%E4%BA%AB%29%20%E5%BA%9F%E5%BC%83.meta.js
// ==/UserScript==
/*
只能实现两次，控制台直接输入代码也只能成功两次,元素点击成功了（监控元素点击），但没有触发弹窗 （有【已复制文章链接 去分享吧】弹窗才算成功）
但每次在控制台输一次  $('.ttp-interact-item.copy.icon-copy').click(); 也可以

解决办法：点击【复制链接】自动弹出分享窗口，然后手动点击
*/
(async function() {
    'use strict';
    return;
    const url=document.URL
    const num=10;
    const print= console.log;


    //addStyle();
    //addBtn();

    $("#myShareBtn").click(async function () {
        $('.share-btn').eq(0).click();
        await sleep(2000);
        //$('.share-tools.panel-top').addClass('pop-anime');
        $('.ttp-interact-item.copy.icon-copy').click();
        //$('.weitoutiao-html').click();
        await sleep(1000);
        for (let i = 0; i < num; i++) {
            print(i);
            shareOperate();
            await sleep(2000);
        }
    });

    async function shareOperate(){
        //$('.share-btn').click();
        await sleep(2000);
        //print( $('.ttp-interact-item.copy.icon-copy'));
        $('.ttp-interact-item.copy.icon-copy').click();
        //$('.weitoutiao-html').click();
    }

    let i=0;
    $('.ttp-interact-item.copy.icon-copy').click(async function(){
        print('dian ji:'+i);
        i++;
        await sleep(100);
        $('.share-btn').eq(0).click();
    })

    //debugger
    // wtt and article

    // Your code here...
})();
async function sleep(time){
    return new Promise((resolve) => setTimeout(resolve, time));
}

function addStyle(){
    //debugger;
    let layui_css = `.layui-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}
                   .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
    GM_addStyle(layui_css);
}

//创建复制按钮
function addBtn() {
    let element = $(
        `<button style="bottom: 130px;right:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="myShareBtn">分享</button>`
  );
    $("body").append(element);
}