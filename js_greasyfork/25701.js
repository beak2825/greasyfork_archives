// ==UserScript==
// @name         弹琴吧VIP破解脚本
// @namespace    https://github.com/ineer
// @version      1.0
// @description  突然发现弹琴吧要VIP才能看以前不要钱的谱子，就写了一个破解的脚本
// @author       ineer
// @match        http://www.tan8.com/jitapu-*.html
// @match        http://www.tan8.com/yuepu-*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25701/%E5%BC%B9%E7%90%B4%E5%90%A7VIP%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/25701/%E5%BC%B9%E7%90%B4%E5%90%A7VIP%E7%A0%B4%E8%A7%A3%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var a=0;var b=window.location.href;var c=b.split('-')[1].split('.')[0];var d='<div class="vspace" style="height:22px;"></div>'+'<div id="flash_container123" class="" style="width:711px;height:848px;padding:0px;border:0px;overflow:hidden;zoom:1;"><object type="application/x-shockwave-flash" data="http://www.77music.com/flash/'+c+'.swf" width="100%" height="100%" id="divflash" style="visibility:visible;"><param name="wmode" value="Opaque"><param name="allowNetworking" value="all"><param name="allowFullScreen" value="true"></object></div>'+'<div class="vspace" style="height:33px;"></div>';var e='<div class="jiata_yuepu_img_box"><ul id="img1" style="left:0px;"></ul></div><a href="javascript:void(0)" class="qupuPrev" id="qupuPrev"></a><a href="javascript:void(0)" class="qupuNext" id="qupuNext"></a><a href="javascript:void(0)" class="guitar_img_fangda"></a>';var f=document.querySelector('.flash_0421');if(f){if(b.indexOf('yuepu')>-1){f.innerHTML=d;}else if(b.indexOf('jitapu')>-1){var g=document.getElementById('audio_mask');if(g){g.parentNode.removeChild(g);}var h=document.querySelector('.jiata_yuepu_imgs');if(h){var i=document.querySelector('.jiata_yuepu_imgs>div>ul>li>img').src;h.innerHTML=e;var j=document.getElementById('img1');var k='';l();document.getElementById('qupuPrev').onclick=function(){if(Number(j.style.left.split('p')[0])<=-690){j.style.left=(Number(j.style.left.split('p')[0])+ 690)+'px';}};document.getElementById('qupuNext').onclick=function(){if(Number(j.style.left.split('p')[0])>=-690*(a- 3)){j.style.left=(Number(j.style.left.split('p')[0])- 690)+'px';}};}}}function l(){var m=new Image();a++;m.onload=function(){if(m){j.innerHTML+='<li><img width="690" height="970" src="'+i.split('_')[0]+'_'+i.split('_')[1]+'_'+a+'.png'+'"></li>';l();}};m.src=i.split('_')[0]+'_'+i.split('_')[1]+'_'+a+'.png';}
})();