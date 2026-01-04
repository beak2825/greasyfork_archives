// ==UserScript==
// @name         不要長FB連結(No FB long url)
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  remove fbclid on you mouse down the link(讓點下去連結短一點)
// @author       You
// @match        https://*.facebook.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435784/%E4%B8%8D%E8%A6%81%E9%95%B7FB%E9%80%A3%E7%B5%90%28No%20FB%20long%20url%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435784/%E4%B8%8D%E8%A6%81%E9%95%B7FB%E9%80%A3%E7%B5%90%28No%20FB%20long%20url%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('mousedown', function () {
    // 兼容处理
    var target = event.target || event.srcElement;
    // 判断是否匹配目标元素console.log('当前点击的 a 标签: ', target);

        // 处理完 a 标签的内容，重新触发跳转，根据原来 a 标签页 target 来判断是否需要新窗口打开
        function getTopA(node){
            //console.log(node)
            if(node.nodeName.toLocaleLowerCase() === 'a'){
                return node;
            }else{
                if(node.parentElement==null){
                    return null;
                }else{
                    return getTopA(node.parentElement);
                }
            }
        }
        function prevent(){
            if (event.preventDefault) {
                             event.preventDefault();
                         } else {
                             window.event.returnValue = true;
                         }
        }
        function noMenu(e) {
            // do something here...
            e.preventDefault();
            window.removeEventListener('contextmenu',noMenu , false);
        }

        //console.log(target);
         //if(target.nodeName.toLocaleLowerCase() === 'i' || target.nodeName.toLocaleLowerCase() === 'div'){
        //alert(target.nodeName)
        //console.log(target)
        if(target.nodeName.toLocaleLowerCase() === 'i'){

         }else{
             if(target.childNodes.length>=1){
                 target=getTopA(target.childNodes[0]);
             }else{
                 target=getTopA(target);
             }
             if(target!=null){
                 var url = target.getAttribute("href");
                 if(url!=null)
                 {
                     if(url.includes("https://l.facebook.com/l.php?u=")){
                         url=decodeURIComponent(url.substring("https://l.facebook.com/l.php?u=".length));
                     }
                     if(url.match(/&*fbclid=.*&/)){
                         url=url.replace(/&*fbclid=.*&/,"")
                     }else{
                         url=url.replace(/&*fbclid=.*/,"")
                     }
                     url=url.replace(/\?$/,"")
                     target.setAttribute("href",url);
                     if (target.getAttribute("target") === '_blank') {
                         if(event.buttons==1){
                             prevent()
                             window.open(url)
                         }
                     }
                     //hack 改url
                     if(event.button==2 && event.ctrlKey){
                         prevent()
                         window.addEventListener('contextmenu',noMenu , false);
                         navigator.clipboard.writeText(url)
                         target.onmousdown=null;
                         target.onmouseup=null;
                         target.click=null;
                         //window.open(url).close()
                         //alert("複製連結成功")
                     }
                 }
             }
         }
});
})();