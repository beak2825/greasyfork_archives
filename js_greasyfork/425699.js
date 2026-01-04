// ==UserScript==
// @name         测试点击图片复制图片地址
// @icon            http://weibo.com/favicon.
// @namespace       [url=mailto:nanqyzh@163.com]nanqyzh@163.com[/url]
// @author          南墙一枝花
// @description     快速复制图片路径
// @match           *://weibo.com/tv/v/*
// @version         0.0.1
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425699/%E6%B5%8B%E8%AF%95%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/425699/%E6%B5%8B%E8%AF%95%E7%82%B9%E5%87%BB%E5%9B%BE%E7%89%87%E5%A4%8D%E5%88%B6%E5%9B%BE%E7%89%87%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
  

 setTimeout(function ()  {
     alert("点击图片复制图片地址")
    var img = document.getElementsByTagName('img')
    var body = document.querySelector('body');
     var newipt=document.createElement("input");

      newipt.style.display="none"
      body.appendChild(newipt)

    for (var i = 0; i < img.length; i++) {
      img[i].onclick = function () {
          newipt.value = this.src
          newipt.select();
        if (document.execCommand('copy')) {
          document.execCommand('copy');
          alert('复制成功', this.src);
        }
      }
    }
  }, 300);


    // Your code here...
})();