// ==UserScript==
// @name         快手样式调整
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  快手样式调整（图片集）
// @author       myaijarvis
// @license      GPL-3.0 License
// @run-at       document-end
// @match        https://v.m.chenzhongtech.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chenzhongtech.com
// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/455378/%E5%BF%AB%E6%89%8B%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/455378/%E5%BF%AB%E6%89%8B%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==
/*
  本版本方法：手动控制swiper滑动，css偏移
  进阶方法：找到js控制器，直接操作
*/
let x,
    x_gap,
    swiper_width,
    pic_length,
    t1; // 定时器

(function() {
    'use strict';
    addStyle();
    addBtn();

    function style_change(){
        let player_width=$('.player-instance').width() * 0.9; // 播放窗口宽度
        $('img.image-main').css({'height':'auto','width':player_width + 'px'}); // 图片样式
        $('.g-common-button.open-app.g-common-button-large.g-common-button-primary.dark').remove(); // 打开快手按钮

        // 上一页下一页

        pic_length = $('.swiper-container.transform-show div').length;
        swiper_width= $('.swiper-container.transform-show').width(); // swiper的宽度
        x_gap= swiper_width / pic_length;// 每次需要移动的x距离

        x=find_x();
        if(x) clearInterval(t1); // 找到就停止
        //console.log(x);
        // console.log(x_gap);

    }
    t1 =setInterval(style_change,1000);

})();

function find_x(){
    let _x=$('.swiper-container.transform-show').css("transform");
    if (!_x) return null;
    // x 的初始值为 -x_gap 从始至终都是负值
    x=Number(_x.replace(/[^0-9\-,]/g,'').split(',')[4]); // 获取translateX值 Number转换为数字
    return x;
}

let isclick = false; // 防止过快重复点击
// 使用函数好像不行，可能是js线程的问题（关于setTimeout的异步）
function prevent__qucik_click(){
    if(isclick)  return; // 如果已经点击了直接返回
    isclick =true;
    console.log('click');
    setTimeout(()=>{
        isclick =false;
    },1000);
}

$("#pic_up").click(function () {
    // debugger
    if(isclick)  return; // 如果已经点击了直接返回
    isclick =true;
    console.log('click');
    setTimeout(()=>{
        isclick =false;
    },1000);

    pause_play()
    x=find_x();
    if(-x <= 0) return;
    //console.log(x);
    //console.log(x_gap);
    $('.swiper-container.transform-show').css("transform",`translateX(${x+x_gap}px`);
});

$("#pic_down").click(function () {
    // debugger
    if(isclick)  return; // 如果已经点击了直接返回
    isclick =true;
    console.log('click');
    setTimeout(()=>{
        isclick =false;
    },1000);

    pause_play()
    x=find_x();
    if(- x >= x_gap * (pic_length-1)) return;
    // console.log(x);
    // console.log(x_gap);
    $('.swiper-container.transform-show').css("transform",`translateX(${x-x_gap}px`);
});

function pause_play(){
    let status=$('.player').attr('data-log-action');
    if(status=='PAUSE_BUTTON') return; // 反之为 'PLAY_BUTTON'
    $('.player').click();
}

function addStyle(){
    let layui_css = `.layui-btn{display: inline-block; vertical-align: middle; height: 38px; line-height: 38px; border: 1px solid transparent; padding: 0 18px; background-color: #009688; color: #fff; white-space: nowrap; text-align: center; font-size: 14px; border-radius: 2px; cursor: pointer; -moz-user-select: none; -webkit-user-select: none; -ms-user-select: none;}
                   .layui-btn-sm{height: 30px; line-height: 30px; padding: 0 10px; font-size: 12px;}`;
    GM_addStyle(layui_css);
}

function addBtn() {
    let element = $(
        `<button style="top: 150px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="pic_up">上一页</button>
        <button style="top: 200px;left:0px; position: fixed;z-index:1000;cursor:pointer;background:green;width:auto;" class="layui-btn layui-btn-sm" id="pic_down">下一页</button>`
       );
    $("body").append(element);
}

