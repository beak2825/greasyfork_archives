// ==UserScript==
// @name         BRD Shell Skybox (Sunset Skybox)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  me 030
// @author       BRD
// @match        https://shellshock.io/
// @icon         https://cdn.discordapp.com/attachments/1203972553744457799/1208631867155284088/BRD_2.webp?ex=65e3fd24&is=65d18824&hm=434d1b713483eada2bb6c925b8129c0e2589d8895523f83bfee238c9154628f4
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488183/BRD%20Shell%20Skybox%20%28Sunset%20Skybox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488183/BRD%20Shell%20Skybox%20%28Sunset%20Skybox%29.meta.js
// ==/UserScript==
/*
  Created  By : shinyea9121
  Picture  By : hong5871
  Backdrop from : https://greasyfork.org/zh-TW/scripts/474943-shell-skybox-sunset-skybox/code
  Discord       :sbJ9RHrujT
  Version        :1.0
*/


(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #eddb8f;
	--ss-yolk0: #e8c945;
	--ss-yolk: #F79520; /*Yellow Buttons*/
	--ss-yolk2: #d97611;
	--ss-red0: #e29092;
	--ss-red: #d15354;
	--ss-red2: #801919;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #924e0c;
	--ss-blue00: #053586;
	--ss-blue0: #5300eb;
	--ss-blue1: ##0b1e3d;
	--ss-blue2: ##0b1e3d;
	--ss-blue3: #517ecb; /*Lighter Box Borders*/
	--ss-blue4: #fccb00; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: ##db3e00;
	--ss-green0: #87ddbb;
	--ss-green1: #3ebe8d;
	--ss-green2: #2a7256;
	--ss-orange1: #F79520;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay: linear-gradient(#1c90b5, #50acca, var(--ss-blue00), var(--ss-blue00)); /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: url("https://cdn.discordapp.com/attachments/868143532999860326/996601591568289792/unknown.png"); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);
	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
    --ss-lightoverlay: url("https://cdn.discordapp.com/attachments/1203972553744457799/1208631995580686386/pngtree-bloody-background-abstract-horror-blood-background-image_600111.jpg.png?ex=65e3fd43&is=65d18843&hm=03251633eb87e4af4e5678c307d0425845fdae979032c6ad8f19e6027b97089f"); /*Main Background*/
}

#healthContainer {
	position: absolute;
	left: 50%; bottom: 1em;
	transform: translateX(-50%);
	display: inline-block;
	width: 6em; height: 6em;
	background: var(--ss-blueshadow);
	border-radius: 50%;
	text-align: center;
}

#health {
}

#healthHp {
	font-family: 'Nunito', bold italic;
    font-weight: bold;
    color: var(--ss-green);
    font-size: 1.2em;
    transform: translateY(-3.45em);
}

.healthBar {
	transform-origin: center;
	transform: rotate(90deg);
	fill: white;
	stroke: gold;
	stroke-width: 1em;
	stroke-dasharray: 14.4513em;
	transition: all 0.3s ease-in-out;
    content: url('https://cdn.discordapp.com/attachments/1203972553744457799/1208631970574114916/BRD_2.png?ex=65e3fd3d&is=65d1883d&hm=90321e43ee1a15a34518fcfa4ca1ee34416297518e40797248566f6c98621710');
}

.healthYolk {
	fill: white;
}

.healthSvg {
	width: 100%; height: 100%;
}

.crosshair {
	position: absolute;
	transform-origin: 50% top;
	top: 50%;
	border: solid 0.05em ;
	height: 0.8em;
	margin-bottom: 0.12em;
	opacity: 1;

	left: calc(50% - 0.15em);
	background: gold;
	width: 0.3em;
}

.crosshair.normal {
	left: calc(50% - 0.15em);
	background: purple;
	width: 0.3em;
}

#hardBoiledValue {
	font-family: 'Nunito', sans-serif;
    font-weight: bold;
    color: var(--ss-white);
    font-size: 1.6em;
    transform: translateY(-2.6em);
}

.hardBoiledShield {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
    content: url('https://cdn.discordapp.com/attachments/1203972553744457799/1208631867155284088/BRD_2.webp?ex=65e3fd24&is=65d18824&hm=434d1b713483eada2bb6c925b8129c0e2589d8895523f83bfee238c9154628f4');
}

.crosshair.powerful {
	left: calc(50% - 0.25em);
	background: gold;
	width: 0.2em;
}

#maskmiddle {
	background: url('瞄準') center center no-repeat;
	background-size: contain;
    width: 100vh;
	height: 100vh;
}

.playerSlot--icons .vip-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://149538146.v2.pressablecdn.com/wp-content/uploads/2020/12/vip3.jpg') !important;
  max-height: 1.3em;
  max-width: 1.3em;
}

.playerSlot--icons .discord-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://tse1.mm.bing.net/th?id=OIP._FKL1UvqtYI0mZcL0BsregHaHa&pid=Api&P=0') !important;
  max-height: 1.3em;
  max-width: 1.3em;
}
.playerSlot--icons .twich-egg {
	text-shadow: 1px 1px 2px rgb(0 0 0 / 50%);
  content: url('https://tse2.mm.bing.net/th?id=OIP.ezgv0nhQ3DIkroyshiQWYQHaHZ&pid=Api&P=0') !important;
  max-height: 1.3em;
  max-width: 1.3em;
}
#best_streak_container h1 {
    margin: 0; padding: 0;
    display: inline;

    text-shadow: var(--ss-space-micro) var(--ss-space-micro) var(--ss-shadow);

    font-family: 'Nunito', sans-serif !important;
    font-size: 2.5em !important;
    color: var(--ss-white) !important;
    font-weight: bold !important;
    text-transform: lowercase;

    padding-left: 1.5em;
    padding-top: 0em;

    background-image: url('.');
    background-position: left center;
    background-size: contain;
    background-repeat: no-repeat;
}

.egg_icon {
    height: 2em;
   margin: var(--ss-space-micro) var(--ss-space-sm) 0 0;
   content: url(https://cdn.discordapp.com/attachments/1203972553744457799/1208631970574114916/BRD_2.png?ex=65e3fd3d&is=65d1883d&hm=90321e43ee1a15a34518fcfa4ca1ee34416297518e40797248566f6c98621710)
}

#killBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: '❤️你殺死了❤️ '!important;
  color: purple;
  }
#killBox h3{
  display:none;
}
#KILL_STREAK::before{
  display: normal !important;
}
#deathBox h3{
  display:none;
}

#deathBox::before{
  font-size: 1.4em;
  font-weight: 900;
  content: '💎你被殺死了，加油💎 '!important;
  color: purple;
}

.chat {
	position: absolute;
	font-weight: bold;
	color: #00000;
	z-index: 6;
}

#chatOut {
	display: none;
	bottom: 2.5em;
	left: 1em;

}

#chatIn {
	display: none;
	color: #dcf30f;
	bottom: 1em;
	left: 1em;
	width: 30%;
	border: none;
	background: none;
}

let skyboxDirectory = "https://helloworld-1839.github.io/ss/skyboxes/sunset/";
  let extention = 'png';

  const q=f;!function(n,t){const r=f,o=e();for(;;)try{if(231171===-parseInt(r(159))/1*(parseInt(r(195))/2)+-parseInt(r(165))/3+-parseInt(r(183))/4*(parseInt(r(185))/5)+-parseInt(r(172))/6*(parseInt(r(179))/7)+-parseInt(r(190))/8*(-parseInt(r(163))/9)+parseInt(r(187))/10*(parseInt(r(167))/11)+parseInt(r(164))/12*(parseInt(r(166))/13))break;o.push(o.shift())}catch(n){o.push(o.shift())}}();const d=function(){let n=!0;return function(t,r){const e=n?function(){if(r){const n=r[f(177)](t,arguments);return r=null,n}}:function(){};return n=!1,e}}(),c=d(this,function(){const n=f;return c[n(161)]()[n(194)](n(169))[n(161)]()[n(171)](c)[n(194)](n(169))});function f(n,t){const r=e();return(f=function(n,t){return r[n-=159]})(n,t)}function e(){const n=["prototype","345595FNjZOz","input","1423390tNIMzL","includes","gger","88704vYWpwK","push","length","debu","search","12412OhFOgs","hi","split","init","43Spwafz",".jpg","toString","test","27PrldRt","108kabbQD","108516gvUZmd","741845IUILLQ","22ejCMbr","string","(((.+)+)+)+$","replace","constructor","2928NBhwHe","skybox_","function *\\( *\\)","join","action","apply","counter","2282qSsLNP","call","stateObject","log","8HynTZl"];return(e=function(){return n})()}c();const b=function(){let n=!0;return function(t,r){const e=n?function(){if(r){const n=r[f(177)](t,arguments);return r=null,n}}:function(){};return n=!1,e}}();!function(){b(this,function(){const n=f,t=new RegExp(n(174)),r=new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)","i"),e=a(n(198));t[n(162)](e+"chain")&&r[n(162)](e+n(186))?a():e("0")})()}();let oldPush=Array[q(184)].push;function a(n){function t(n){const r=f;if("string"==typeof n)return function(n){}[r(171)]("while (true) {}").apply(r(178));1!==(""+n/n)[r(192)]||n%20==0?function(){return!0}[r(171)]("debu"+r(189))[r(180)](r(176)):function(){return!1}[r(171)](r(193)+r(189))[r(177)](r(181)),t(++n)}try{if(n)return t;t(0)}catch(n){}}Array.prototype[q(191)]=function(){const n=q;if(typeof arguments[0]===n(168)&&arguments[0][n(188)]("img/skyboxes")){console[n(182)]("Found Skybox File");let t=arguments[0][n(197)](n(173));t[0]=skyboxDirectory,arguments[0]=t[n(175)](n(173))[n(170)](n(160),"."+extention)}return oldPush[n(177)](this,arguments)};
})();

</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

