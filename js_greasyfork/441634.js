// ==UserScript==
// @name        网页缩放助手（竖屏用户的福音）
// @include     *
// @grant       none
// @version     1.1
// @author      w
// @description 2022/3/17 12:45:47
// @license MIT
// @namespace https://greasyfork.org/users/114146
// @downloadURL https://update.greasyfork.org/scripts/441634/%E7%BD%91%E9%A1%B5%E7%BC%A9%E6%94%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E7%AB%96%E5%B1%8F%E7%94%A8%E6%88%B7%E7%9A%84%E7%A6%8F%E9%9F%B3%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/441634/%E7%BD%91%E9%A1%B5%E7%BC%A9%E6%94%BE%E5%8A%A9%E6%89%8B%EF%BC%88%E7%AB%96%E5%B1%8F%E7%94%A8%E6%88%B7%E7%9A%84%E7%A6%8F%E9%9F%B3%EF%BC%89.meta.js
// ==/UserScript==
(window.onresize=function(){
var w=document.body.clientWidth;
if(w<1600&&w>800)
    document.getElementsByTagName('body')[0].style.zoom=0.75;
else document.getElementsByTagName('body')[0].style.zoom=1;
  //console.log(w+'缩放'+document.getElementsByTagName('body')[0].style.zoom)
})()