// ==UserScript==
// @name         鼠标移动点击出现随机颜色表情符号
// @version      1.2
// @description  242个符号随机出现，双击切换移动鼠标出现痕迹表情符号
// @author       日狗少年
// @include      /^https?\:\/\/[^\s]*/
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/2.2.0/jquery.min.js
// @run-at       document_start
// @grant        unsafeWindow
// @namespace    
// @downloadURL https://update.greasyfork.org/scripts/32155/%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E7%82%B9%E5%87%BB%E5%87%BA%E7%8E%B0%E9%9A%8F%E6%9C%BA%E9%A2%9C%E8%89%B2%E8%A1%A8%E6%83%85%E7%AC%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/32155/%E9%BC%A0%E6%A0%87%E7%A7%BB%E5%8A%A8%E7%82%B9%E5%87%BB%E5%87%BA%E7%8E%B0%E9%9A%8F%E6%9C%BA%E9%A2%9C%E8%89%B2%E8%A1%A8%E6%83%85%E7%AC%A6%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    var flag =false;
    var chars=['☺','☹','☻','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','❦','❧','☙','❥','❣','♡','♥','❤','➳','ღ','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','?','⚜','✥','✤','✻','✼','✽','✾','❀','✿','❁','❃','❇','❈','❉','❊','❋','⚘','⁕','ꙮ','ꕤ','ꕥ','☘','?','?','?','?','?','?','?','?','★','☆','✪','✫','✯','✡','⚝','⚹','✵','❉','❋','✺','✹','✸','✶','✷','✵','✴','✳','✲','✱','✧','✦','⍟','⊛','⁕','?','?','?','﹡','❃','❂','✼','✻','✰','⍣','✭'];
    jQuery(document).ready(function($) {
		$("html").mousemove(function(e) {
            if(flag){
                var color = "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                var id=Math.ceil(Math.random()*242);
                var xr=Math.ceil(Math.random()*400)-200;
                var yr=Math.ceil(Math.random()*400)-200;
                var $i;
                $i = $("<b></b>").text(chars[id]);
                var n = Math.round(Math.random() * 10 + 16);
                var x = e.pageX,
                    y = e.pageY;
                $i.css({
                    "z-index": 9999,
                    "color":color,
                    "top": y,
                    "left": x,
                    "position": "absolute",
                    "font-size": n,
                    "-moz-user-select": "none",
                    "-webkit-user-select": "none",
                    "-ms-user-select": "none"
                });
                $("body").append($i);
                $i.animate({
                    "top": y + yr,
                    "left": x + xr,
                    "opacity": 0,
                }, 1000, function() {
                    $i.remove();
                });
            }
        });
        
        $("html").click(function(e) {
            if(!flag){
                var color = "#"+("00000"+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);
                var id=Math.ceil(Math.random()*242);
                var xr=Math.ceil(Math.random()*400)-200;
                var yr=Math.ceil(Math.random()*400)-200;
                var $i;
                $i = $("<b></b>").text(chars[id]);
                var n = Math.round(Math.random() * 10 + 26);
                var x = e.pageX,
                    y = e.pageY;
                $i.css({
                    "z-index": 9999,
                    "color":color,
                    "top": y,
                    "left": x,
                    "position": "absolute",
                    "font-size": n,
                    "-moz-user-select": "none",
                    "-webkit-user-select": "none",
                    "-ms-user-select": "none"
                });
                $("body").append($i);
                $i.animate({
                    "top": y + yr,
                    "left": x + xr,
                    "opacity": 0,
                }, 1000, function() {
                    $i.remove();
                });
            }
        });
        
        $("html").dblclick(function(e) {
               flag=!flag;
         });
	});
})();