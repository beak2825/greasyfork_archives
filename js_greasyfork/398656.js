// ==UserScript==
// @name         腾讯课堂关闭讨论区
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  腾讯课堂 讨论区 蠢货太烦 我想学习  播放控件 栏 增加 网页全屏按钮
// @author       臭臭
// @match        https://ke.qq.com/webcourse/index.html*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398656/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%85%B3%E9%97%AD%E8%AE%A8%E8%AE%BA%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398656/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E5%85%B3%E9%97%AD%E8%AE%A8%E8%AE%BA%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var chat_btn = document.createElement('button')
    chat_btn.style.cssText= "height: 30px;width: 30px;  padding: 0;border-width: 0;background-color: transparent;"
    chat_btn.style.marginRight='10px'
    chat_btn.onclick = function(){
        if(document.getElementsByClassName('chat-ctn')[0].style.display!='none'){
            document.getElementsByClassName('chat-ctn')[0].style.display='none'
            document.getElementsByClassName('study-body')[0].style.right='0px'
        }else{
            document.getElementsByClassName('chat-ctn')[0].style.display='block'
            document.getElementsByClassName('study-body')[0].style.right='300px'
        }
    };
    var NS="http://www.w3.org/2000/svg";
    var img_icon=document.createElementNS(NS,"svg");
    img_icon.setAttribute('width',30)
    img_icon.setAttribute('height',30)
    img_icon.setAttribute('xmlns','http://www.w3.org/2000/svg')
    img_icon.setAttribute('viewBox',"0 0 1024 1024")
    img_icon.style.fill = 'white'

    var img_path=document.createElementNS(NS,'path')
    img_path.setAttribute('d',"M401.07 708.27L206.93 512 403.2 315.73 341.33 256l-256 256 256 256 59.74-59.73z m221.86 0L819.2 512 622.93 315.73 682.67 256l256 256-256 256-59.74-59.73z")

    img_icon.appendChild(img_path)
    chat_btn.appendChild(img_icon)
    window.setTimeout(function() {
        var panel = document.getElementsByClassName('right-panel')[0]
        panel.insertBefore(chat_btn,panel.childNodes[0])
    }, 3600);
})();