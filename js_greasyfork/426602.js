// ==UserScript==
// @name        QQ免费名片赞
// @namespace   Violentmonkey Scripts
// @license MIT
//              复制下方的链接，右键打开网址，进去领取，记得修改下方的qqNumber，这样每次打开就是自动填写你的QQ了，不然就是默认作者的了
// @match       https://amy.lysuhui.com/?cid=9&tid=110
// @match       https://syh.09sup.com/?cid=1&tid=1
// @grant       none
// @version     1.2
// @author      PiersonRao
// @description 2021/5/17 上午10:47:19
// @downloadURL https://update.greasyfork.org/scripts/426602/QQ%E5%85%8D%E8%B4%B9%E5%90%8D%E7%89%87%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/426602/QQ%E5%85%8D%E8%B4%B9%E5%90%8D%E7%89%87%E8%B5%9E.meta.js
// ==/UserScript==
var qqNumber;
qqNumber = 1187909532   //自己的QQ是多少就改成多少，  目前收录了4个刷QQ片名赞的白嫖网址，上方的match就是的，自己

window.onload=function()
{ 
  setTimeout(function()
  {
      var qq =document.getElementById('inputvalue')
      qq.value=qqNumber;  
  },1000);
}




