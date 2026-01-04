// ==UserScript==
// @name         权限管理小助手
// @namespace    http://tampermonkey.net/
// @description  简化权限管理界面
// @version      0.1
// @author       ddrrcc
// @match        *://*.club.hihonor.com/cn/thread*
// @match        *://*.club.huawei.com/thread*
// @match        *://*.cn.club.vmall.com/thread*
// @icon         http://demo.sc.chinaz.com/Files/pic/icons/6081/shield-13.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.6.9/vue.min.js
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/419532/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419532/%E6%9D%83%E9%99%90%E7%AE%A1%E7%90%86%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function(){(()=>{var a=document.createElement("style");if(a.setAttribute("type","text/css"),a.styleSheet)a.styleSheet.cssText="#rushToBuyBox{z-index: 9999;background-color:#FFFFFF;width:70px;font-size:14px;position:fixed;top:25%;right:28%;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}.title{font-size:16px;font-weight:bold;margin:3px 0;padding:0}.box{height:30px}";else{var b=document.createTextNode(`#rushToBuyBox{z-index: 9999;background-color:#FFFFFF;width:70px;font-size:14px;position:fixed;top:25%;right:28%;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}.title{font-size:16px;font-weight:bold;margin:3px 0;padding:0}.box{height:30px}`);a.appendChild(b)}var c=document.createElement("div");c.innerHTML=`<div id='rushToBuyBox' v-if="msgs.length != 0"><div class="box" v-html="msg.outerHTML" v-for="msg in msgs" >{{msg.outerHTML}}</div></div>`,document.head.appendChild(a),document.body.appendChild(c)})(),new Vue({el:"#rushToBuyBox",data:{msgs:$("#modmenu > a")}})})();