// ==UserScript==
// @name         外链自动跳转
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  第三方链接自动跳转 支持掘金、简书、CSDN、Gitee、QQ
// @author       weiliang
// @match        *://*.zhihu.com/*
// @match        *://*.jianshu.com/*
// @match        *://*.csdn.net/*
// @match        *://*.juejin.im/*
// @match        *://*.juejin.cn/*
// @match        *://*.gitee.com/*
// @match        *://*.developers.weixin.qq.com/*
// @match        *://*.c.pc.qq.com/*
// @match             *://*.baidu.com/*
// @match             *://*.baidu.com/*
// @match             *://*.baidu.com/*
// @match             *://*.baidu.com/*
// @include           *://*.google*
// @match             *://*.google.com/*
// @match             *://*.google.com/*
// @match             *://*.google.com/*
// @match             *://*.google.com/*
// @match             *://*.youtube.com/*
// @match             *://*.google.com/*
// @match             *://*.so.com/*
// @match             *://weibo.com/*
// @match             *://twitter.com/*
// @match             *://www.sogou.com/*
// @match             *://mail.qq.com/*
// @match             *://addons.mozilla.org/*
// @match             *://*.jianshu.com/*
// @match             *://*.douban.com/*
// @match             *://getpocket.com/*
// @match             *://www.dogedoge.com/*
// @match             *://51.ruyo.net/*
// @match             *://steamcommunity.com/*
// @match             *://mijisou.com/*
// @match             *://blog.csdn.net/*
// @match             *://*.blog.csdn.net/*
// @match             *://*.oschina.net/*
// @match             *://app.yinxiang.com/*
// @match             *://www.logonews.cn/*
// @match             *://afdian.net/*
// @match             *://blog.51cto.com/*
// @match             *://xie.infoq.cn/*
// @match             *://gitee.com/*
// @match             *://sspai.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABJpJREFUeF7tm11IFFEUx8+UkK5proZKubimFGSEQQrqS9iDUJaCFNJLZhEEEdg3IdGDIAX5UG9RSW9SVCpFCGVPWo8ZGhVJhtqHlJaKRUkT/xtnuWzu7szuHWcm94LMzP3y/H/n3HPvLjsaLfKiLXL9FAcQj4BFTiDmJTA6MXxGJ72KNMpYCJY9HzqG9q5v3Kbqf8UEYGRy+B6Rvl2VMUbmuTHUSj7PmgeqIEQNYGzybfVvog4jRqvsAwAoqiBED+Dr25bfOp1WKc7IXAxAFYSoAYxODrfqpDcaMVplHxmACgiuBxArhP8CQCwQ/hsA0UJwHYDb767SzNxUyLRidnewHcDH7yPU/f4WLU9IpdrcAxHzJfpiTLhiBoKtAFg8izECAd7vHrsZNgrMLAfbAMjis5N8NPPrmxBlFMKbqUH69GM0fCQk51+u9NceCdfJFgDB4itX7RLi2bNGIERcK6KDdt/n9Vc5CsB84tlA9RAcCODN9CD1jncTwp49D49zQRv6oCApym3GvC73ciAAeBlRUJBSKLI/7gECQGTxXGdetAMBQGT/5FPKSsyhovRSYSGLh4crV++m/oknAc+rEe+QHDDfmpfFl2dW0tD0CwvEOwCAEfEcDbiq8zwvAxtzgBHxYv+fmyLs6dlJOSIPqC02AQi11SHJoY3DPjkhNZAT1Aq3OQLkbL43/+g/2rhd3YEnFD6bIiDcgUb9Vhf2nGffSXA+CAsr3gG7QKhPbuqzvcOWgGxOMISFE++ACJA/5OCkl5+y3oKtzqE5wJptzeysNu0CZs20rn8cgH3boHVeNTNzPALiEeC47wTNBHDsfRUtgYbOmnOk6bmyQXlpBcVpy9ILYzWyKKuE/CsKYp0mxHgFABq6auqJ9DaLLKS0xHRqLD5r0fQKAOzrqn6sEW2RLVyXsUE8vvoyIK7lvgr6PDseeEYd+nz5Pi7a0cZ1PEaeb9/GwxZFgUUAru3oCAiGyJ1r66jrdTt1vmoPAGkoOkK9Iz200pMp6gEJf+gHIGjj4ioA1evqAoIhHEJYGAM4WdYsooE9DwhlORVCb99oj7sBnN96ha4/uyTEQCg8ChAQjD9AACQWjAhBPT/jnse7LgLgSZQTpc3iiucLfU0CBIRh3UMc7hkUooPXPwtG1MgQXLUEIBpCscbZmxCLSHj5eUBAQTuEc8LjNY/IQEGUyMnQVQA46wMAvI8QZwCcAwAAUQEvcwRgXEbS3whCHuC+eHYVAAhi8fAiPB4MgOsQ6rxlnnp0UIxDcW0OgPG8tjmEQwFAnuC8wFd57wcQVyTBhq5qnALrOenx1sbGc2KU61GHZ77Kwue7x0kQJ0L1RcFBqP5ujV9bqrcFnwZVGbspq4Rq1u5RNV3QPAoA8IwAIc9+aPOxJk+CZ38sllvjddkihQCChdr1W2FzwOMArPtGaMymn8ubjIA7Pq+/NtyYqH8mZ9cLE2YAaKQdz/H6L1oCAJPa8cqMCQDPp9Jmiwu1wp+WAcDE4qWpJXoV6Qvz0lQkADrRjKbTwzmNWvK8eV8j9Y96CUSa2C3tcQBu8ZRVdsYjwCqybpn3D3Ecam41OfmyAAAAAElFTkSuQmCC
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449643/%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449643/%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    // 主站URL
    var origin = window.location.origin
    // 将URL参数转换为对象
    function getParams(){
        var params = {}
        var string = window.location.search
        var arr = string.substring(1).split('&')
        arr.forEach(function(_n) {
            var _t = _n.split('=')
            params[ _t[0] ] = _t[1]
        })
        return params
    }
    // 对第三方URL进行Base64转义
    var targetUrl = getParams().target || getParams().url || getParams().href || getParams().pfurl || ''
    targetUrl = decodeURIComponent(targetUrl)
 
    // 确定当前跳转的页面为第三方站点
    function isOtherSite(origin, targetUrl) {
       if(!targetUrl) return
       var isCSDN = document.getElementById("csdn-toolbar")
       if(isCSDN){
          isCSDN.remove()
       }
       if(origin != targetUrl) {
           document.write(
           `
<div class='body'>
  <span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </span>
  <div class='base'>
    <span></span>
    <div class='face'></div>
  </div>
</div>
<div class='longfazers'>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
<h1>正在跳转中...</h1>
 
           `
           )
               addStyle();
           return true
       } else {
           return false
       }
    }
    var isJump = isOtherSite(origin, targetUrl)
    if (isJump) {
        window.location.replace(targetUrl)
    }
 
    function createStyle(){
        let styleOne =
        `
body {
  background-color: #f1c40f;
  overflow: hidden;
}
 
h1 {
  position: absolute;
  font-family: "Open Sans";
  font-weight: 600;
  font-size: 20px;
  text-transform: uppercase;
  left: 50%;
  top: 58%;
  margin-left: -20px;
}
 
.body {
  position: absolute;
  top: 50%;
  margin-left: -50px;
  left: 50%;
  animation: speeder 0.4s linear infinite;
}
.body > span {
  height: 5px;
  width: 35px;
  background: #000;
  position: absolute;
  top: -19px;
  left: 60px;
  border-radius: 2px 10px 1px 0;
}
 
.base span {
  position: absolute;
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-right: 100px solid #000;
  border-bottom: 6px solid transparent;
}
.base span:before {
  content: "";
  height: 22px;
  width: 22px;
  border-radius: 50%;
  background: #000;
  position: absolute;
  right: -110px;
  top: -16px;
}
.base span:after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-top: 0 solid transparent;
  border-right: 55px solid #000;
  border-bottom: 16px solid transparent;
  top: -16px;
  right: -98px;
}
 
.face {
  position: absolute;
  height: 12px;
  width: 20px;
  background: #000;
  border-radius: 20px 20px 0 0;
  transform: rotate(-40deg);
  right: -125px;
  top: -15px;
}
.face:after {
  content: "";
  height: 12px;
  width: 12px;
  background: #000;
  right: 4px;
  top: 7px;
  position: absolute;
  transform: rotate(40deg);
  transform-origin: 50% 50%;
  border-radius: 0 0 0 2px;
}
 
.body > span > span:nth-child(1),
.body > span > span:nth-child(2),
.body > span > span:nth-child(3),
.body > span > span:nth-child(4) {
  width: 30px;
  height: 1px;
  background: #000;
  position: absolute;
  animation: fazer1 0.2s linear infinite;
}
 
.body > span > span:nth-child(2) {
  top: 3px;
  animation: fazer2 0.4s linear infinite;
}
 
.body > span > span:nth-child(3) {
  top: 1px;
  animation: fazer3 0.4s linear infinite;
  animation-delay: -1s;
}
 
.body > span > span:nth-child(4) {
  top: 4px;
  animation: fazer4 1s linear infinite;
  animation-delay: -1s;
}
 
@keyframes fazer1 {
  0% {
    left: 0;
  }
  100% {
    left: -80px;
    opacity: 0;
  }
}
@keyframes fazer2 {
  0% {
    left: 0;
  }
  100% {
    left: -100px;
    opacity: 0;
  }
}
@keyframes fazer3 {
  0% {
    left: 0;
  }
  100% {
    left: -50px;
    opacity: 0;
  }
}
@keyframes fazer4 {
  0% {
    left: 0;
  }
  100% {
    left: -150px;
    opacity: 0;
  }
}
@keyframes speeder {
  0% {
    transform: translate(2px, 1px) rotate(0deg);
  }
  10% {
    transform: translate(-1px, -3px) rotate(-1deg);
  }
  20% {
    transform: translate(-2px, 0px) rotate(1deg);
  }
  30% {
    transform: translate(1px, 2px) rotate(0deg);
  }
  40% {
    transform: translate(1px, -1px) rotate(1deg);
  }
  50% {
    transform: translate(-1px, 3px) rotate(-1deg);
  }
  60% {
    transform: translate(-1px, 1px) rotate(0deg);
  }
  70% {
    transform: translate(3px, 1px) rotate(-1deg);
  }
  80% {
    transform: translate(-2px, -1px) rotate(1deg);
  }
  90% {
    transform: translate(2px, 1px) rotate(0deg);
  }
  100% {
    transform: translate(1px, -2px) rotate(-1deg);
  }
}
.longfazers {
  position: absolute;
  width: 100%;
  height: 100%;
}
.longfazers span {
  position: absolute;
  height: 2px;
  width: 20%;
  background: #000;
}
.longfazers span:nth-child(1) {
  top: 20%;
  animation: lf 0.6s linear infinite;
  animation-delay: -5s;
}
.longfazers span:nth-child(2) {
  top: 40%;
  animation: lf2 0.8s linear infinite;
  animation-delay: -1s;
}
.longfazers span:nth-child(3) {
  top: 60%;
  animation: lf3 0.6s linear infinite;
}
.longfazers span:nth-child(4) {
  top: 80%;
  animation: lf4 0.5s linear infinite;
  animation-delay: -3s;
}
 
@keyframes lf {
  0% {
    left: 200%;
  }
  100% {
    left: -200%;
    opacity: 0;
  }
}
@keyframes lf2 {
  0% {
    left: 200%;
  }
  100% {
    left: -200%;
    opacity: 0;
  }
}
@keyframes lf3 {
  0% {
    left: 200%;
  }
  100% {
    left: -100%;
    opacity: 0;
  }
}
@keyframes lf4 {
  0% {
    left: 200%;
  }
  100% {
    left: -100%;
    opacity: 0;
  }
}
 
        `
        return styleOne
    }
    function addStyle(){
        var style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = createStyle();
        window.document.head.appendChild(style);
    }

})();