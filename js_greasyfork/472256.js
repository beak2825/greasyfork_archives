// ==UserScript==
// @name         Qzone AutoLike
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.1
// @description  网页版QQ空间自动点赞工具
// @author       Albert Z
// @match        *://*.qzone.qq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/472256/Qzone%20AutoLike.user.js
// @updateURL https://update.greasyfork.org/scripts/472256/Qzone%20AutoLike.meta.js
// ==/UserScript==

var duration = 180;
var blocked = getCookie('al-blocked').split(','); //3378491536, 2151420951, 1592304225
var dict = ['点赞', '转发', '评论']; // 像极了转发游戏的奇怪词汇
var select = Boolean(getCookie('al-select'));
var nextTime = Date.now();
var isScrolling = false;
var timeout = setTimeout(function() {
    isScrolling = false;
}, 100);

// 监听scroll事件
window.addEventListener('scroll', function() {
    // 将isScrolling标记为true表示页面正在滚动
    isScrolling = true;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
        isScrolling = false;
    }, 100);
});

function setCookie(name, value, iDay) {
  var oDate=new Date();
  oDate.setDate(oDate.getDate()+iDay);
  document.cookie=name+'='+value+';expires='+oDate;
};

function getCookie(name) {
	var arr=document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		var ars=arr[i].split('=');
		if(ars[0]==name) return ars[1];
	}
	return '';
}

function refresh() {
    document.querySelector('#feed_friend_refresh').click();
}

function like() {
    let btns = document.querySelectorAll('.qz_like_btn_v3'); // 所有点赞按钮
    let ars = document.querySelectorAll('.f-info'); // 所有文章
    let users = document.querySelectorAll('.f-name'); // 所有作者
    for (let i=0; i<btns.length; i++) {
        if(!btns[i]) continue;
        let btn = btns[i];
        let ar = ars[i] ? ars[i].innerHTML: '';
        let user = users[i] && users[i].getAttribute('link')?
            users[i].getAttribute('link').replace('nameCard_', ''): '';
        // 先判断是否已点赞或者是屏蔽用户
        if (btn.classList.contains('item-on') || blocked.indexOf(user) > -1) continue;
        let flag = false;
        if (select) {
            for (let j=0; j<dict.length; j++) {
                let word = dict[j];
                if (ar.includes(word)) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag) continue;
        btn.click();
        console.log('Liked: ' + ar);
    }
}

function setConfig() {
    let max = Number.MAX_SAFE_INTEGER;
    alert("Auto Like 需要您填写一些必要的信息~");
    let blk = prompt('请输入你不想点赞的用户的QQ号（可输入多个，用英文逗号","分隔）').replaceAll(' ', '');
    blocked = blk.split(',');
    setCookie('al-blocked', blk, max);
    select = confirm('是否不点赞转发游戏类内容？');
    if (select == true) setCookie('al-select', 'true', max);
    alert('如果需要再次设置，可以双击页面任意处调用。');
    alert('操作说明：\n需保持浏览器窗口打开qqzone好友动态页面状态， \
每隔3分钟会自动刷新点赞（会在帖子发出后6分钟内点赞完成，除了被屏蔽用户和类似转发游戏的帖子）。\n滑动页面浏览时也会自动点赞。');
    setCookie('al-setted', 'true', max);
}

unsafeWindow.setConfig = setConfig;
unsafeWindow.getCookie = getCookie;
unsafeWindow.setCookie = setCookie;

onload = function () {
    if (!getCookie('al-setted')) setConfig();
    setInterval( function() {
        let time = Date.now();
        if (time >= nextTime) {
            // 当到达设定时间时执行
            like();
            refresh();
            nextTime += duration * 1000;
        } else if (isScrolling) {
            like();
        }
    }, 800);
};

ondblclick = function () {
    setConfig();
};

(function () {
    console.log('Auto Link Running...');
})();