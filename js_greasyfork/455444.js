// ==UserScript==
// @name                                                                    抖音直播精简
// @namespace                                                                  null
// @author                                                                     null
// @version                                                                   0.0.0
// @description                                                    提供简洁的界面，只为安心看直播。
// @match                                                                *://*.douyin.com/*
// @downloadURL https://update.greasyfork.org/scripts/455444/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/455444/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==


(function () {
   var css = '{display:none !important;height:0 !important}'
//全局
    css += '.MoQWZoTN{display:none !important;}';//左侧导航栏上方动画
    css += '.pc8R5mBY{display:none !important;}';//直播页面上方“抖音直播行业自律平台”
//直播间
    css += '.ruqvqPsH{display:none !important;}';//视频底部“礼物栏”
    css += '.OAJeuZUg{display:none !important;}';//弹幕区ID前勋章
    css += '.LU6dHmmD{color: #23ADE5 !important;}';//弹幕区ID颜色
    //css += '.webcast-chatroom___content-with-emoji-text{font-size: 18px !important;}';//弹幕区字体大小
    css += '.LU6dHmmD{display: block !important;}';//ID与弹幕分两行显示
    css += '.webcast-chatroom___bottom-message{display:none !important;}';//弹幕区用户进入直播间消息
    css += '.OkoVu3vW{display:none !important;}';//视频下方相关直播
    css += '.VRcJSlv6{display:none !important;}';//视频底部网站信息


   loadStyle(css)
   function loadStyle(css) {
      var style = document.createElement('style')
      style.type = 'text/css'
      style.rel = 'stylesheet'
      style.appendChild(document.createTextNode(css))
      var head = document.getElementsByTagName('head')[0]
      head.appendChild(style);

   }
})();