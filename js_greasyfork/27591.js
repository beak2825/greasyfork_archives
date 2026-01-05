// ==UserScript==
// @name          BiliBili直播flv.js-HTML5播放
// @description   基于Bilibili官方的flv.js实现的直播HTML5播放脚本
// @author        nftbty
// @namespace     https://greasyfork.org/zh-CN/users/101499-nftbty
// @include       *://live.bilibili.com/*
// @require       https://greasyfork.org/scripts/27590-flv/code/flv.js
// @version       1.1
// @downloadURL https://update.greasyfork.org/scripts/27591/BiliBili%E7%9B%B4%E6%92%ADflvjs-HTML5%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/27591/BiliBili%E7%9B%B4%E6%92%ADflvjs-HTML5%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
//在脚本$('#js-player-decorator').html处，此时会把FLASH播放器替换，聊天窗口和送礼不会显示（因为少了flash没法和socket连接）
//如需要聊天窗口，你可以继续自行开发，比如使用jq的jsocket等；
//我的方案（保留聊天窗口[火狐环境]），把脚本的$('#js-player-decorator').html改成$('#js-player-decorator').append，然后只需mason扩展，新建mason项目，地址填^http:\/\/live\.bilibili\.com\/api\/playurl.*?&quality=0$然后类型选阻止请求（block request）再保存即可（注意这个项目启用后，bili直播FLASH将无法播放视频流，如需复位，切记取消启用）
var cid = ROOMID;
setTimeout(function () {
var e = document.querySelector('.live-switcher.on');
if (e) { //检测到直播间已开3秒后，自动替换播放器为H5，否则瞬间替换会导致很多扩展没加载，尤其是聊天窗口
console.log('HEY！BOY！现在替换H5播放器');
live_h5_play(cid);
} else {
console.log('主播在女装中看毛线啊！');
}
}, 3000);

function live_h5_play(cid) {
$.get("http://live.bilibili.com/api/playurl?player=1&cid=" + cid + "&quality=0&t=1", function (res) {//←◡←这个API我加了点特技，曲线实现MASON阻止API的请求
var url_match = res.match(/<url><\!\[CDATA\[(.*?)\]\]><\/url>/);
if (url_match) {
var url = url_match[1];
$('#js-player-decorator').html('<video id="videoElement" style="width:100%;height:100%">'); //html会把FLASH播放器替换，缺少flash后，聊天窗口和送礼不会显示，如果使用append则会插入而不替换，此时聊天窗口仍然可以用；
//append方法是你需要你阻止flash播放器播放视频，此时我觉得最简单的方案是使用MASON阻止API，新建mason项目，地址填^http:\/\/live\.bilibili\.com\/api\/playurl.*?&quality=0$然后类型选阻止请求（block request）即可，此时H5播放器照样可以播放视频，并且聊天窗口可用，送礼可见
$('#player_object').css('width', '0%'); //flash播放器禁止播放，然后弹幕聊天窗口仍然在
console.log(url);
if (flvjs.isSupported()) {
var videoElement = document.getElementById('videoElement');
var flvPlayer = flvjs.createPlayer({
type : 'flv',
url : url
});
flvPlayer.attachMediaElement(videoElement);
flvPlayer.load();
flvPlayer.play();
}
} else {
//throw new Error('获取失败')
}
});
}