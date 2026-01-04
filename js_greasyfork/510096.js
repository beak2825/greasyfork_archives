// ==UserScript==
// @name         浏览器背景-适配手机
// @namespace    https://viayoo.com/
// @version      0.1
// @description  修改浏览器背景，请自行修改图片链接
// @author       呆毛飘啊飘2171802813
// @run-at       document-start
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/510096/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%83%8C%E6%99%AF-%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/510096/%E6%B5%8F%E8%A7%88%E5%99%A8%E8%83%8C%E6%99%AF-%E9%80%82%E9%85%8D%E6%89%8B%E6%9C%BA.meta.js
// ==/UserScript==

(function() {

var tpurl = 'https://raw.githubusercontent.com/wwdboy/imgrepo/refs/heads/main/1714183528066%7E01.jpg';
//修改图片url就好了
var viestyle = document.createElement("style");
viestyle.type = "text/css";
GM_registerMenuCommand("亮色调",() => {GM_setValue('Vie背景',1);});
GM_registerMenuCommand("暗色调",() => {GM_setValue('Vie背景',4);});
var k = GM_getValue('Vie背景',1);
if(k==1){
viestyle.innerHTML='*{background-color:rgba(0,0,0,0)!important;}#app,strong,i,b,th,tbody,small,blockquote,label,html,ul,ol,form,article,article[class],footer,footer[class],header,header[class],aside,li,span,nav,main,tr,td,table,body:after,body:before,div:after,div:before,div[class]:after,div[class]:before{background:rgba(0,0,0,0)!important;}body{background-size: contain;background-image: url("'+tpurl+'");!important;}input,div,h1,h2,h3,h4,h5,h6,dd,dl,section{background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:#dddddd!important;}a:not([style]){background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:rgb(156,198,255)!important;}input[type="submit"],button{background:rgba(0,0,0,0.3)!important;text-shadow:none!important;color:#fff!important;border-left-color:rgba(255,255,255,0.3)!important;border-top-color:rgba(255,255,255,0.3)!important;border-right-color:rgba(255,255,255,0.3)!important;border-bottom-color:rgba(255,255,255,0.3)!important;}p{background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:#bbb!important;}div#menu.mdui-drawer.mdui-drawer-open,div[id][class][style*="top"],div[id][class][style*="bottom"],div[id][class][style*="z-index"],div[id][class][style*="height"],div[aria-hidden],div[id][class][style*="max-height"]{background-color:rgba(0,0,0,0.8)!important}textarea{background-color: rgba(0,0,0,0.4)!important;}div[class]:not([style]),nav[class],main[class],section[class],aside[class],section[id],aside[id],main[id]{background:rgba(0,0,0,0)!important;box-shadow:rgba(0,0,0,0)0px 0px 0px!important;}pre{background-color:rgba(0,0,0,0.5)!important;}div[class],div[id],h1[class],h2[class],h3[class],h4[class],h5[class],h6[class]{background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:#dddddd}div[style*="max-height"][style*="overflow"]{background-color:rgba(0,0,0,1)!important;}textarea,pre,li{color:#fff!important;}';
}
else{
viestyle.innerHTML='*{background-color:rgba(0,0,0,0)!important;}#app,strong,i,b,th,tbody,small,blockquote,label,html,ul,ol,form,article,article[class],footer,footer[class],header,header[class],aside,li,span,nav,main,tr,td,table,body:after,body:before,div:after,div:before,div[class]:after,div[class]:before{background:rgba(0,0,0,0)!important;}body{background-size: contain;background-image: url("'+tpurl+'");!important;}input,div,h1,h2,h3,h4,h5,h6,dd,dl,section{background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:#222222!important;}a:not([style]){background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:rgb(156,198,255)!important;}input[type="submit"],button{background:rgba(255,255,255,0.3)!important;text-shadow:none!important;color:#000!important;border-left-color:rgba(0,0,0,0.3)!important;border-top-color:rgba(0,0,0,0.3)!important;border-right-color:rgba(0,0,0,0.3)!important;border-bottom-color:rgba(0,0,0,0.3)!important;}p{background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:#bbb!important;}div#menu.mdui-drawer.mdui-drawer-open,div[id][class][style*="top"],div[id][class][style*="bottom"],div[id][class][style*="z-index"],div[id][class][style*="height"],div[aria-hidden],div[id][class][style*="max-height"]{background-color:rgba(255,255,255,0.8)!important}textarea{background-color: rgba(255,255,255,0.4)!important;}div[class]:not([style]),nav[class],main[class],section[class],aside[class],section[id],aside[id],main[id]{background:rgba(0,0,0,0)!important;box-shadow:rgba(0,0,0,0)0px 0px 0px!important;}pre{background-color:rgba(255,255,255,0.5)!important;}div[class],div[id],h1[class],h2[class],h3[class],h4[class],h5[class],h6[class]{background-color:rgba(0,0,0,0)!important;text-shadow:none!important;color:#222222}div[style*="max-height"][style*="overflow"]{background-color:rgba(0,0,0,1)!important;}textarea,pre,li{color:#000!important;}';
}
document.getElementsByTagName('head')[0].appendChild(viestyle);

})();