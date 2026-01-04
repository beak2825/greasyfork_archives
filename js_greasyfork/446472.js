// ==UserScript==
// @name         哔哩哔哩回到旧版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  如果是新版使其回到旧版
// @author       xiaoxiami
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446472/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/446472/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%9E%E5%88%B0%E6%97%A7%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
     try {
       let url = window.location.href;
       // 这里简单判断了一下如果是视频页的话获取的标签和主页获取的标签，因为我主页是看这两个页面，应该都video判断的，别的页面也使用，有问题可以反馈
       if(url.indexOf("video") != -1){
          let backJiuBanOne=document.getElementsByClassName("item goback")[0];
           backJiuBanOne.dispatchEvent(new MouseEvent('click'));
       } else {
         let backJiuBanTwo = document.getElementsByClassName("primary-btn go-back")[0];
       // 让其模拟人点击这个标签，感谢道总，直接一直困惑的问题解决了
         backJiuBanTwo.dispatchEvent(new MouseEvent('click'));

       }

       // 本来是想用下面的两个方法的，但是没有成功，但是通过给的思路找到了上面的方式，参考地址https://www.codenong.com/4158847/
       //const evt = new Event('mousedown');
       //backJiuBan.dispatchEvent(evt);
    } catch (error) {
        console.error('你现在用的已经是旧版了');
    }

    },1000)

})();