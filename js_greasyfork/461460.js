// ==UserScript==
// @name         b站（bilibili）稍后再看链接替换
// @match        https://www.bilibili.com/list/watchlater*
// @grant        none
// @version      0.0111
// @description  从 稍后再看样式播放器 进入 正常样式的播放器
// @author       toonaive2333
// @license      MIT


// @namespace https://greasyfork.org/users/1038738
// @downloadURL https://update.greasyfork.org/scripts/461460/b%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/461460/b%E7%AB%99%EF%BC%88bilibili%EF%BC%89%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
//部分思路参考了作者dyxlike
//把
// https://www.bilibili.com/list/watchlater?bvid=BV1PT411a7yH&oid=123
// 换成
// https://www.bilibili.com/BV1PT411a7yH
// 删除链接中的 list/watchlater?bvid=     &oid=123


(function() {
    'use strict';

    const relist = /list\/watchlater\?bvid\=/
    const reAnd = /&.*/

    //取得链接
    function getUrl(){
    var currentUrl = window.location.href;
    console.log(currentUrl);
    return currentUrl;
    }

    //替换链接
    function tranUrl(){
    let url = getUrl();
    url = url.replace(relist, "");
    url = url.replace(reAnd, "");
    console.log(url);
    return url;
    }

    //提示框
    function showAlert(message) {
        const alertBox = document.createElement("div");
        alertBox.style.position = "fixed";
        alertBox.style.top = "0";
        alertBox.style.left = "0";
        alertBox.style.width = "100%";
        alertBox.style.backgroundColor = "yellow";
        alertBox.style.textAlign = "gray";
        alertBox.style.padding = "10px";
        alertBox.innerText = message;
        document.body.appendChild(alertBox);
        setTimeout(() => {
          alertBox.remove();
        }, 2000);
      }

      //弹提示框然后跳转链接
      showAlert("跳转中！");
      let newUrl=tranUrl();
      window.location.href = newUrl;

})();