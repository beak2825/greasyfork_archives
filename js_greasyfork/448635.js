// ==UserScript==
// @name         定时滑至网页底部
// @namespace    http://tampermonkey.net/
// @version      666
// @description  每隔n秒，定时滑至网页底部。达到指定时间点后自动停止。
// @author       ChenShao
// @match        https://mp.weixin.qq.com/cgi-bin/message*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448635/%E5%AE%9A%E6%97%B6%E6%BB%91%E8%87%B3%E7%BD%91%E9%A1%B5%E5%BA%95%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/448635/%E5%AE%9A%E6%97%B6%E6%BB%91%E8%87%B3%E7%BD%91%E9%A1%B5%E5%BA%95%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //达到这个时间点后，就不再读取新数据
    let okTime = '22:30';

    function getFullTime(t){
        let date = new Date();
        return new Date(date.getFullYear() + ' ' + t + ':00');
    }

    $.fn.removeWithoutLeaking = function() {
        this.each(function(i,e){
            if( e.parentNode )
                e.parentNode.removeChild(e);
        });
    };

    //几秒滑1次
    let seconds = 3;
    let milliseconds = seconds * 1000;
    //是否需要删除私信
    let isDelMsg = true;

    let okDate = getFullTime(okTime);

    function toBottom(){
        let panels = $('#app .user-messages-panel');
        let lastPanel = panels.last();
        let msgTime = $.trim(lastPanel.find('.user-message-time').first().text());
        msgTime = msgTime.slice(-5)
        console.error(msgTime);
        msgTime = getFullTime(msgTime);
        console.log(msgTime);
        if(msgTime.getTime() <= okDate.getTime()){
            isDelMsg = false;
        }

        if(isDelMsg){
            //先选择
            let delPanels = panels.not(':last');
            console.log(delPanels);
            //再读取
            document.documentElement.scrollIntoView({ block: 'end' });
            //后删除
            delPanels.removeWithoutLeaking();
        }else{
            alert('已到达指定时间点（'+okTime+'）');
            clearInterval(timer);
            isRunning = false;
        }
    }

    let timer = setInterval(toBottom, milliseconds);
    let isRunning = true;

    var stop = document.getElementsByClassName('weui-desktop-online-faq__switch_content')[0];
    stop.onclick = function(){
        if(isRunning){
            clearInterval(timer);
            isRunning = false;
        }else{
            timer = setInterval(toBottom, milliseconds);
            isRunning = true;
        }
    }
})();