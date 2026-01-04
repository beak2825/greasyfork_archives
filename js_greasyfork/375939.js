// ==UserScript==
// @name         TypeSounder
// @namespace    https://www.7gugu.com/
// @version      1.1
// @description  给按键加入机械键盘的触发声音
// @author       7gugu <gz7gugu@qq.com>
// @match        https://tampermonkey.net/documentation.php?version=4.8.5847&ext=fire&updated=true
// @grant        none
// @include *
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375939/TypeSounder.user.js
// @updateURL https://update.greasyfork.org/scripts/375939/TypeSounder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var id=1;
         console.log("typesound已启动");
document.onkeydown=function(event){
    id++;
    $("body").append("<div id='key_sound_"+id+"'><audio id='player"+id+"' src='https://www.7gugu.com/wp-content/uploads/2018/12/music.mp3' preload='auto'>您的浏览器不支持 audio 标签。</audio></div>");
			 var e = event || window.event;
			 var player = $("#player"+id)[0]; /*jquery对象转换成js对象*/
            if(e && e.keyCode){
	if (player.paused){ /*如果已经暂停*/ player.play(); /*播放*/ }
			  }

        };
})();