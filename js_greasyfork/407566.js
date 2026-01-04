// ==UserScript==
// @namespace       Use This Script Free

// @position 1

// @lastUpdated -.-.-
// @icon      https://biqle.com/favicon
// @description     Mini update for site Biqle.COM and clear ad
// @description:ru  Мини улучшение для сайта Biqle.COM и уберает видимую рекламу.

// @name      Add Open in VK Button to Biqle.com
// @name:ru   Добавляет кнопку открыть видео в ВК

// @noframes  true
// @version    0.1beta
// @inject-into content
// @require   http://code.jquery.com/jquery-3.4.1.min.js

// @date      2020-07-22
// @author    Pr0m
// @license   CDDL-1.1 & WTFPL

// @include   *://biqle.com/watch/*

// @grant GM_*
// @downloadURL https://update.greasyfork.org/scripts/407566/Add%20Open%20in%20VK%20Button%20to%20Biqlecom.user.js
// @updateURL https://update.greasyfork.org/scripts/407566/Add%20Open%20in%20VK%20Button%20to%20Biqlecom.meta.js
// ==/UserScript==

/*
!For more enjoyment add to Your uBlock this Rules/Trackers
!                 _Only copy and paste_

!                Fuck  ↓  you
dxb.to/player/js/fuckadblock.min.js
r.remarketingpixel.com/
ie8eamus.com/
commercialvalue.org/
celeritascdn.com/
a3yqjsrczwwp.com/
counter.yadro.ru/
ads.exosrv.com/ads.js
a.adtng.com/get/10002730?time=1555364616610
psv20-1.crazycloud.ru/ip.get?callback=jQuery31107723495136048597_1594810846530&_=1594810846531
www.gstatic.com/recaptcha/releases/nuX0GNR875hMLA1LR7ayD9tc/recaptcha__ru.js
!block trackers and other turd

4690y10pvpq8.com/d5/61/18/d561181177a776f3d5a38102426f1462.js 
!biqle PopUP, Script that create invisible frame - very important to block

*/

// EN:  I do not know how to program, all the code below is an assembly from other sources of user scripts, if you want to help me, please write a comment.

// РУ:  Я не умею кодить, весь написанный код это простая сборка скриптов взятые из дргугих UserScript'ов и методом тыка собрано, если есть желающие улучшить код, дайте знать. 

(function() {
    'use strict';

  document.head.appendChild( (css => {
	const style = document.createElement("style");
	style.textContent = css;
	return style;
})(`
  .header a + form  {	justify-content:space-between;align-items: center; }
  .button_biqle_to_vk {
    right: -128px;
    top: 5px;
    font-size: 13px;
    padding: 7px;
    background: #525252;
   	text-decoration: none;
    border-radius: 25px;
    color: #fff;
    
    position: absolute;    
    z-index: 3;
}
  .button_biqle_to_vk:hover {	text-decoration:underline;font-size:12px;position:absolute;right:-125px;}
`.trim()) );

document.querySelectorAll('.header a + form ').forEach( h1 => {
	let cutURL = (window.location.pathname.replace("/watch/",''));
	const a = document.createElement("a");
	a.href = "https://vk.com/video" + cutURL ;
	a.setAttribute("rel", "nofollow");	
	a.setAttribute("target", "_blank");
    a.setAttribute("title", "Open this FUCKING video in VK.COM");
    a.textContent = "Open in VK.COM";
	a.className = "button button_biqle_to_vk";
    // a.target = "_blank";
    // a.rel = "noopener";
	h1.appendChild(a); // inject button
  
	//h1.appendChild(document.createElement('br')).cloneNode;
} ); 
        //Remove visible ads;
    var BEAUTIFY_FUCKING_PAGE = window.jQuery;
    $('script[src^="//4690y10pvpq8.com/d5/61/18/d561181177a776f3d5a38102426f1462.js"]').remove();
    $('script[src^="//ie8eamus.com/sfp.js"]').remove();
    $('iframe[name^="spot_id_10002730"]').remove();
    $('div[class*="message-container"]').remove();
    $('div[class^="prom1"]').remove();
    $('svg[id^="barcode"]').remove();
 console.clear();
 console.info("%c\n\n\t The Script %c\tFUCK_BIQLE_AD %c\twas injected%c\t→%c"+location.hostname+"←\n\n\n", "color: green; font-size:14px;","color: red; font-size:16px; font-weight: bold;","color: #00f; font-size:15px;", "color: black",'size: 20px'); 
  })();

//IF (function() DOESNTWORK) {WORK}; //Don't worry be happy
