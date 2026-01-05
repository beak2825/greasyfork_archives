// ==UserScript==
// @name         知乎一次忽略所有邀请
// @namespace    http://hktkdy.com/
// @version      0.1
// @description  之所以写这个脚本是因为有一段时间知乎服务器发疯似地每天给我推送很多邀请，后来我的被邀请攒了200多个，我又不想一个个地点忽略按钮，知乎官方竟然也没有一个全部忽略的button，简直不能忍。
// @author       zhangolve
// @match        https://www.zhihu.com/question/invited*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28200/%E7%9F%A5%E4%B9%8E%E4%B8%80%E6%AC%A1%E5%BF%BD%E7%95%A5%E6%89%80%E6%9C%89%E9%82%80%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/28200/%E7%9F%A5%E4%B9%8E%E4%B8%80%E6%AC%A1%E5%BF%BD%E7%95%A5%E6%89%80%E6%9C%89%E9%82%80%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //事件模拟
    var evt = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    /* whatever properties you want to give it */
    });
    var a=document.querySelectorAll('.zm-invite-item');
    console.log(a);
    for(var i=0;i<a.length;i++){
    var btn=a[i].querySelector('a');
     btn.dispatchEvent(evt);
    }
   if(a.length!==0)
   {
    setTimeout(history.go(),2000); //设置延时，否则会被知乎判断为机器人
   }
   
    // Your code here...
})();