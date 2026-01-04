// ==UserScript==
// @name         所有小写字母全部变大写
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       none
// @include        http*
// @include        ftp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393996/%E6%89%80%E6%9C%89%E5%B0%8F%E5%86%99%E5%AD%97%E6%AF%8D%E5%85%A8%E9%83%A8%E5%8F%98%E5%A4%A7%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/393996/%E6%89%80%E6%9C%89%E5%B0%8F%E5%86%99%E5%AD%97%E6%AF%8D%E5%85%A8%E9%83%A8%E5%8F%98%E5%A4%A7%E5%86%99.meta.js
// ==/UserScript==

(function() {

     function addCSS(cssText){
         var style = document.createElement('style'), //创建一个style元素
             head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
         style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
         if(style.styleSheet){ //IE
             var func = function(){
                 try{ //防止IE中stylesheet数量超过限制而发生错误
                     style.styleSheet.cssText = cssText;
                 }catch(e){

                 }
             }
             //如果当前styleSheet还不能用，则放到异步中则行
             if(style.styleSheet.disabled){
                 setTimeout(func,10);
             }else{
                 func();
             }
         }else{ //w3c
             //w3c浏览器中只要创建文本节点插入到style元素中就行了
             var textNode = document.createTextNode(cssText);
             style.appendChild(textNode);
         }
         head.appendChild(style); //把创建的style元素插入到head中
     }

    //使用
    addCSS('*{ text-transform:uppercase;}');




    // Your code here...
})();