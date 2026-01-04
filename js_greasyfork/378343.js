// ==UserScript==
// @name         自动学习脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  电子科技大学网上学习自动切换脚本
// @author       ljx
// @include      http://learning.uestcedu.com*
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @match        http://ispace.remotedu.com/ispace2_upload*
// @match        http://ispace.uestcedu.com/ispace2_upload*
// @match        http://learning.uestcedu.com/learning3/scorm/scoplayer/?course_id*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/378343/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/378343/%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
jQuery.noConflict();
(function( $ ) {
    //debugger;
    if (location.href.indexOf('/scorm/scoplayer/?course_id')>-1){
        alert('自动学习脚本加载成功!')
        var time = 0;
        setInterval(function() {
            time += 5;
            console.log('正在学习中...'+time);
            var doc = window.top.frames[1].frames[1].document;
            var text = doc.querySelector('#tdRemark') || doc.querySelector('[style="height: 26px;"]');
            var timeText = text.innerText;
            if (timeText.indexOf('学习完毕') > -1) {
                time = 0;
                window.top.document.getElementsByName('w_main')[0].contentWindow.document.getElementById("w_code").contentWindow.loadNextSCO()
            }
        }, 5000);
    }else{
        if (location.pathname.indexOf('ispace2_upload')>-1){
            $('.chapter>span:last').click();
            setTimeout(function(){
                $('.chapter>span:last').click();
                console.log('延时再次切换视频');
            },3*10000)
        }
    }
})( jQuery );