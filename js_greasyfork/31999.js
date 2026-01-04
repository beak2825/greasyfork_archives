// ==UserScript==
// @name        微信客服中心消息提醒
// @author      rjw
// @description 显示视频下载链接
// @namespace   com.uestc.rjw
// @icon        http://mat1.gtimg.com/www/icon/favicon2.ico
// @license     Apache Licence V2
// @encoding    utf-8
// @date        20/08/2015
// @modified    20/08/2015
// @include     https://mpkf.weixin.qq.com/cgi-bin/kfindex*
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_notification
// @grant unsafeWindow
// @run-at      document-end
// @version     1.0.6
// @downloadURL https://update.greasyfork.org/scripts/31999/%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D%E4%B8%AD%E5%BF%83%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/31999/%E5%BE%AE%E4%BF%A1%E5%AE%A2%E6%9C%8D%E4%B8%AD%E5%BF%83%E6%B6%88%E6%81%AF%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==


/*
 * === 说明 ===
 *@作者:rjw
 *@Email:babyrjw@163.com
 * */
unsafeWindow.document.title = "【　　　】";
var isusing = false;
var newMessageRemind={
    _step: 0,
    _title: document.title,
    _timer: null,
    _msg: "NEW",
    //显示新消息提示
    _show:function(){
        newMessageRemind._timer = setTimeout(function() {
           newMessageRemind._show();
        }, 800);
        newMessageRemind._step++;
        if (newMessageRemind._step == 3) { newMessageRemind._step = 1;}
        if (newMessageRemind._step == 1) { document.title = "【　　　】" + newMessageRemind._msg;}
        if (newMessageRemind._step == 2) { document.title = "【新消息】" + newMessageRemind._msg;}
    },
    show:function(){
        console.log(newMessageRemind._timer);
        if(newMessageRemind._timer !== null)return;
        newMessageRemind._show();
        return [newMessageRemind._timer, newMessageRemind._title];
    },
    //取消新消息提示
    clear: function(){
        clearTimeout(newMessageRemind._timer);
        newMessageRemind._timer = null;
        unsafeWindow.document.title = newMessageRemind._title;
    }
};
unsafeWindow.document.onclick=function(event){
    event = event || window.event;
    var isone ="";
    if(!document.all){
        isone = event.target.id.toUpperCase();
    }
    else{
        isone = event.srcElement.id.toUpperCase();
    }
    if(isone!=="TEST"){
        isusing = false;
        newMessageRemind.clear();
    }
};
function playSound(isPlay){
    if(isPlay){
        audio.play();
    }else{
        audio.pause();
    }
 }
var audio = new Audio("http://dx.sc.chinaz.com/Files/DownLoad/sound1/201409/4942.mp3");

setInterval(function(){
    var number_in = $("span[data-reactid='.0.5.0.0.1.1']");
    var number_msg = $("span[data-reactid='.0.5.0.0.0.1']");
    var count_in = number_in.text();
    var count_msg = number_msg.text();
    var msg = "";
    if(count_in > 0){
        msg = msg + count_in;
        msg = msg + "人待接入  ";
    }
    if(count_msg > 0){
        msg = msg + count_msg;
        msg = msg + "人待回复  ";
    }
    if(count_in > 0 || count_msg > 0){
        msg = msg + "  赶紧去处理吧";
        GM_notification({text:msg, title:"微信客服系统", timeout:30000});
        playSound(true);
    }else{
        playSound(false);
    }
},5000);
setInterval(function(){
    unsafeWindow.location.reload();
},1800000);