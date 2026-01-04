// ==UserScript==
// @name         虎牙精简直播页
// @namespace    no
// @version      0.3.2
// @description  精简直播页、自动领宝箱、自动最高画质
// @author       superSao
// @match        www.huya.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/442029/%E8%99%8E%E7%89%99%E7%B2%BE%E7%AE%80%E7%9B%B4%E6%92%AD%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/442029/%E8%99%8E%E7%89%99%E7%B2%BE%E7%AE%80%E7%9B%B4%E6%92%AD%E9%A1%B5.meta.js
// ==/UserScript==

// 删除静态标签
delDom()
// 注入样式
addStyle()
// 自动领取宝箱
let box = setInterval(getbox, 10 * 1000)
// 循环设置动态内容
let set = setInterval(loopSet, 500)
// DOM加载完毕
window.onload = function () {
    setTimeout(function () {
        // 打开弹幕输入输入框和礼物种豆
        init()
        // 添加事件
        addEvt()
    }, 1 * 1000)
}


let setNum = 0
function loopSet() {
    setNum += 1
    if (setNum > 20) { window.clearInterval(set) }
    // $('').remove();
    // 最高清晰度
    $('.player-videotype-list li')[0].click()
    //广告等
    $('#J_tt_hd_category_ad').remove();
    $('.room-gg-chat').remove();
    $('.player-report-btn').remove();
    $('#J_hyHdNavItemGame').remove();
    $('#J_hyHdNavItemCloudGame').remove();
    $('.room-business-game')[0].style.display = "none"
    $('.banner-ab-warp')[0].style.display = "none"
    $('.room-business-game')[0].style.display = "none"
    $('.banner-ab-warp')[0].style.display = "none"
    $('.sidebar-banner').remove();
    $('#J_tt_hd_category_ad').remove();
    $('#chatRoom > div.room-gg-chat').remove();
    $('#J_hd_nav_user > b').remove();
    $('.helperbar-root--12hgWk_4zOxrdJ73vtf1YI').remove();
    $('#player-resource-wrap').remove();
    $('.duya-header-ad').remove();
}
function getbox() {
    let boxNum = 0
    for (let index = 0; index < 6; index++) {
        if ($(".player-box-stat4")[index].innerText !== "") { boxNum++ }
        if ($(".player-box-stat3")[index].style.visibility === "visible") {
            $(".player-box-stat3")[index].click()
        }
    }
    if (boxNum === 6) { window.clearInterval(box) }
}
function init() {
    // 显示弹幕输入框
    $('#player-ctrl-wrap')[0].className += " player-ctrl-wrapimportant"
    $('#player-full-input')[0].style.display = "block"
    $('#player-full-input')[0].style.left = "90px"
    $('#player-full-input-txt')[0].placeholder = "ESC关闭礼物种豆"

    // 显示礼物种豆按钮
    $('.gift-show-btn')[0].style.display = "block"

    // 礼物种豆按钮打开礼物栏
    $('.gift-show-btn')[0].onclick = function () {
        $('.player-gift-wrap')[0].style.zIndex = 0
        $('#player-ctrl-wrap')[0].className = "player-ctrl-wrap"
    }
}
function addEvt() {
    document.addEventListener("fullscreenchange", function () {
        if (document.fullscreenElement !== null) {
            $('#player-ctrl-wrap')[0].className += "player-ctrl-wrap"
        } else { open() }
    });

    document.onkeydown = function (e) {
        // 关闭礼物栏
        if (e.key == "Escape") {
            $('.player-gift-wrap')[0].style.zIndex = -1
            $('#player-ctrl-wrap')[0].className += " player-ctrl-wrapimportant"
            setTimeout(function () { open() }, 30)
        }
        // 回车发送弹幕
        if (e.key == "Enter") { $('#player-full-input-btn').click() }
    }
    $('#player-fullpage-btn')[0].onclick = function () { setTimeout(function () { open() }, 30) }

}
function delDom() {
    $('#J_spbg').remove();
    $('#J_mainRoom > div.room-wrap > div.room-footer').remove();
    $('#matchComponent2').remove();
    $('#wrap-income').remove();
    $('#J_roomGgTop').remove();
    $('#J_mainRoom > div.room-footer').remove();
    $('#J-weekRank').remove();
    $('#match-cms-content').remove();
    $('.jump-to-phone').remove();
    $('.share-entrance').remove();
    $('.mod-sidebar').remove();
    $('#player-fullpage-right-btn').remove();
    $('#J_liveListHeader').remove();
}
function addStyle() {
    GM_addStyle(`
.player-gift-wrap{
z-index:-1
}
.room-core
.room-core-l{
margin-right:0px
}
.sidebar-min .main-wrap{
padding-left:0
}
.main-room{
padding:10px 0px 0
}
.mod-list{
padding:0 10px
}
.player-ctrl-wrapimportant{
bottom:0px !important
}
.room-player-wrap .room-player-main {
background:#2b2b2b
}
.room-player-wrap .room-player-main .room-player-gift-placeholder{
background:#2b2b2b
}
#player-full-input{
top:10px；
}
.room-core-r{
display:none !important
}
#J_mainWrap{
padding:60px 0
}
`)
}
function open() {
    $('.player-gift-wrap')[0].style.zIndex = -1
    $('#player-full-input')[0].style.display = "block"
    $('.gift-show-btn')[0].style.display = "block"
    $('#player-ctrl-wrap')[0].className += " player-ctrl-wrapimportant"
}