// ==UserScript==
// @name         Name Copy & Paste By 5A LD
// @namespace    Name Copy & Paste By 5A LD
// @version      2.5
// @description  Menu For Copy Names In Agar.io and other agar  by 5A LD
// @author       5A LD YouTube
// @icon         http://i.imgur.com/tow7rhz.png
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://3rb.be/*
// @match        http://dual-agar.online/*
// @match        http://agarp.me/*
// @match        http://agarz.com/en*
// @match        http://agariohub.net/*
// @match        http://agar.pro/*
// @match        http://www.agarribia.com/*
// @match        http://abs0rb.me/*
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://agar.biz/*
// @match        http://alis.io/*
// @match        http://gota.io/web/*
// @match        http://atrix.ovh/*
// @match        http://agar-network.com/*
// @match        http://abs0rb.me/*
// @match        http://en.agar.bio/*
// @match        http://agar.pro/*
// @match        http://3rb.be/
// @match        http://agar.io/*
// @match        http://agarabi.com/*
// @match        http://agarly.com/*
// @match        http://dual-agar.online/*
// @match        http://agarp.me/*
// @match        http://agarz.com/en*
// @match        http://agariohub.net/*
// @match        http://agar.pro/*
// @match        http://www.agarribia.com/*
// @match       *.agariopvp.eu/*
// @match       *.6gem.pw/*
// @match       *.ogar.pw/*
// @match       *.154.16.127.140/*
// @match       *.cellcraft.io/*
// @match       *.agarios.com/*
// @match       *.agarz.com/*
// @match       *.mgar.io/*
// @match       *.agariogame.club/*
// @match       *.old.ogarul.io/*
// @match       *.agarly.com/*
// @match       *.bubble.am/*
// @match       *.gota.io/*
// @match       *.agariohub.net/*
// @match       *.agarserv.com/*
// @match       *.agarioservers.ga/*
// @match       *.alis.io/*
// @match       *.agarioplay.org/*
// @match       *.agario.city/*
// @match       *.germs.io/*
// @match       *.agarioforums.io/*
// @match       *.agariofun.com/*
// @match       *.agar.pro/*
// @match       *.agarabi.com/*
// @match       *.warball.co/*
// @match       *.agariom.net/*
// @match       *.agar.re/*
// @match       *.agarpx.com/*
// @match       *.easyagario.com/*
// @match       *.playagario.org/*
// @match       *.agariofr.com/*
// @match       *.agario.xyz/*
// @match       *.agarios.org/*
// @match       *.agariowun.com/*
// @match       *.usagar.com/*
// @match       *.agarioplay.com/*
// @match       *.privateagario.net/*
// @match       *.agariorage.com/*
// @match       *.blong.io/*
// @match       *.agar.blue/*
// @match       *.agar.bio/*
// @match       *.agario.se/*
// @match       *.nbkio.com/*
// @match       *.agariohit.com/*
// @match       *.agariomultiplayer.com/*
// @match       *.agariogameplay.com/*
// @match       *.agariowow.com/*
// @match       *.bestagario.net/*
// @match       *.tytio.com/*
// @match       *.kralagario.com/*
// @match       *.agario.zafer2.com/*
// @match       *.agarprivateserver.net/*
// @match       *.agarca.com/*
// @match       *.agarioplay.mobi/*
// @match         http://agario.mobi/*
// @match       *.abs0rb.me/*
// @match       *.agario.us/*
// @match       *.agariojoy.com/*
// @match       *.agario.ch/*
// @match       *.ioagar.us/*
// @match       *.play.agario0.com/*
// @match       *.agario.run/*
// @match       *.agarpvp.us/*
// @match       *.agario.pw/*
// @match       *.ogario.net/*
// @match       *.ogario.net/*
// @match       *.nbk.io/*
// @match       *.agario.info/*
// @match       *.inciagario.com/*
// @match       *.agar.io.biz.tr/*
// @match       *.agariown.com/*
// @match       *.agario.dk/*
// @match       *.agario.lol/*
// @match       *.agario.gen.tr/*
// @match       *.agarioprivateserver.us/*
// @match       *.agariot.com/*
// @match       *.agarw.com/*
// @match       *.agario.city/*
// @match       *.agario.ovh/*
// @match       *.feedy.io/*
// @match       *.agar.zircon.at/*
// @match       *.xn--80aaiv4ak.xn--p1ai/*
// @match         http://agarp.me/*
// @match       *.xn--80aaiv4ak.xn--p1ai/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/27238/Name%20Copy%20%20Paste%20By%205A%20LD.user.js
// @updateURL https://update.greasyfork.org/scripts/27238/Name%20Copy%20%20Paste%20By%205A%20LD.meta.js
// ==/UserScript==
function inject(type, code) {
   switch(type) {
      case 'javascript':
         var inject  = document.createElement('script');
         inject.type = 'text/javascript';
         inject.appendChild(document.createTextNode(code));
      break;
      case 'stylesheet':
         var inject  = document.createElement('style');
         inject.type = 'text/css';
         inject.appendChild(document.createTextNode(code));
      break;
   }
   (document.head || document.documentElement).appendChild(inject);
}
inject('stylesheet', '#tcm,#tcm>#tcm-main>div>div{overflow-x:hidden;overflow-y:auto}#tcm>#tcm-header,#tcm>#tcm-main>div{text-align:center}@keyframes bounce-in{0%,100%,20%,40%,60%,80%{-webkit-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@-webkit-keyframes bounce-in{0%,100%,20%,40%,60%,80%{-webkit-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-webkit-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-webkit-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-webkit-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}@-moz-keyframes bounce-in{0%,100%,20%,40%,60%,80%{-moz-transition-timing-function:cubic-bezier(.215,.61,.355,1);transition-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;-moz-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}20%{-moz-transform:scale3d(1.1,1.1,1.1);transform:scale3d(1.1,1.1,1.1)}40%{-moz-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}60%{opacity:1;-moz-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}80%{-moz-transform:scale3d(.97,.97,.97);transform:scale3d(.97,.97,.97)}100%{opacity:1;-moz-transform:scale3d(1,1,1);transform:scale3d(1,1,1)}}#tcm{position:fixed;top:2%;left:1%;display:block;width:240px;max-height:96%;background:rgba(0,0,0,.8);border:1px solid #444;border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;z-index:999999999;animation:1s both bounce-in;-webkit-animation:1s both bounce-in;-moz-animation:1s both bounce-in}#tcm>#tcm-header,#tcm>#tcm-header>p,#tcm>#tcm-header>span{position:relative;display:block}#tcm :focus{outline:0}#tcm *{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif}#tcm>#tcm-header{width:initial;background:rgba(255,255,255,.4);padding:8px}#tcm>#tcm-header>span{font-family:Pacifico,cursive;font-size:20px;color:#FFF;text-transform:capitalize;margin:0 0 8px}#tcm>#tcm-header>p{font-size:12px;color:#222;margin:0}#tcm>#tcm-main>div>div,#tcm>#tcm-main>div>span{margin:0 0 8px;position:relative;display:block}#tcm>#tcm-main,#tcm>#tcm-main>div{position:relative;display:block;width:initial}#tcm>#tcm-main{padding:8px}#tcm>#tcm-main>div>span{font-size:14px;color:#FFF;text-transform:capitalize}#tcm>#tcm-main>div>div{width:100%;max-height:160px;min-height:20px;background:#222;border:1px solid #444;border-radius:2px;-webkit-border-radius:2px;-moz-border-radius:2px}#tcm>#tcm-main>div>div>span{position:relative;display:block;width:100%;text-align:center;font-size:12px;color:#FFF;padding:4px 0;cursor:pointer}#tcm>#tcm-main>div>div>span:hover{background:rgba(0,0,0,.2)}');
inject('javascript', !function e(o){if("undefined"!=typeof document.getElementsByTagName("head")[0]&&"undefined"!=typeof document.getElementsByTagName("body")[0]){var t={l:{score:0,names:[],leaderboard:{},toggled:!0,prototypes:{canvas:CanvasRenderingContext2D.prototype,old:{}}},f:{prototype_override:function(e,o,s,a){e in t.l.prototypes.old||(t.l.prototypes.old[e]={}),o in t.l.prototypes.old[e]||(t.l.prototypes.old[e][o]=t.l.prototypes[e][o]),t.l.prototypes[e][o]=function(){"before"==s&&a(this,arguments),t.l.prototypes.old[e][o].apply(this,arguments),"after"==s&&a(this,arguments)}},filltext_override:function(){t.f.prototype_override("canvas","fillText","before",function(e,o){var s=o[0];if(console.log(o),s.match(/^(1|2|3|4|5|6|7|8|9|10)\.(.+?)$/)){var a="",n=s.split(/\.(.+)?/);t.l.leaderboard[n[0]]=n[1];for(k in t.l.leaderboard)a+=t.u.span("leaderboard name #"+k,t.l.leaderboard[k]);document.getElementById("tcm-leaderboard").innerHTML=a}else s.match(/^score\:\s([0-9]+)$/i)?(t.l.score=parseInt(s.split(/score:\s([0-9]+)?/i)[1]),document.getElementById("tcm-score").innerHTML=t.u.span("score",t.l.score)):!(""!==s&&s.length<=15)||t.l.names.indexOf(s)>-1||s.match(/(leaderboard|connect|loading|starting\smass|xp\sboost|open\sshop|([0-9]{2})m\s(([0-9]{2})h\s)?([0-9]{2})s)/i)||s.match(/^(free\scoins|\s?([0-9]+)\scoins|\s?with\soffers|collect\sin\:|hourly\scoins|come\sback\sin|to\searn\:|starter\spack|hourly\sbonus|level\s([0-9]+)|([0-9\.]+)|.([0-9\.]+)|([0-9\.]+)\%|mass\sboost|coins|skins|shop|banana|cookie|jupiter|birdie|mercury|apple|halo|neptune|black\shole|uranus|star\sball|target|galaxy|venus|breakfast|saturn|pluto|tiger|hot\sdog|heart|mouse|wolf|goldfish|piggie|blueberry|bomb|bowling|candy|frog|hamburger|nose|seal|panda|pizza|snowman|sun|baseball|basketball|bug|cloud|moo|tomato|mushroom|donuts|terrible|ghost|apple\sface|turtle|brofist|puppy|footprint|pineapple|zebra|toon|octopus|radar|eye|owl|virus|smile|army|cat|nuclear|toxic|dog|sad|facepalm|luchador|zombie|bite|crazy|hockey|brain|evil|pirate|evil\seye|halloween|monster|scarecrow|spy|fly|spider|wasp|lizard|bat|snake|fox|coyote|hunter|sumo|bear|cougar|panther|lion|crocodile|shark|mammoth|raptor|t-rex|kraken|gingerbread|santa|evil\self|cupcake|boy\skiss|girl\skiss|cupid|shuttle|astronaut|space\sdog|alien|meteor|ufo|rocket|boot|gold\spot|hat|horseshoe|lucky\sclover|leprechaun|rainbow|choco\segg|carrot|statue|rooster|rabbit|jester|earth\sday|chihuahua|cactus|sombrero|hot\spepper|chupacabra|taco|piÃƒÂ£Ã‚Â±ata|thirteen|black\scat|raven|mask|goblin|green\sman|slime\sface|blob|invader|space\shunter)$/i)||(t.l.names.push(s),document.getElementById("tcm-names").innerHTML=document.getElementById("tcm-names").innerHTML.concat(t.u.span("cell name",s)))})},hotkeys:function(e){88==e.keyCode&&(document.getElementById("tcm").style.display=t.l.toggled?"none":"block",t.l.toggled=t.l.toggled?!1:!0)}},u:{fonts:function(){return'<link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet" type="text/css" />'},html:function(){return'<div id="tcm" style="display:block;"><div id="tcm-header"><span>:)  Copy & Paste By -- -5A LD</span><p>تم التعديل , من قبل خالد (X لاضهار القائمه و اخفائها)</p></div><div id="tcm-main"><div><span>الموجودين في الليدر بورد</span><div id="tcm-leaderboard"></div></div><div><span>اسماء اخرى</span><div id="tcm-names"></div></div><div><span>score</span><div id="tcm-score"><span onclick="javascript:prompt(\'score\', \'0\')">0</span></div></div></div></div>'},span:function(e,o){return"<span onclick=\"javascript:prompt('"+e+"', '"+o+"')\">"+o+"</span>"}}};document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend",t.u.fonts()),document.getElementsByTagName("body")[0].insertAdjacentHTML("beforeend",t.u.html()),o.addEventListener("keydown",t.f.hotkeys),t.f.filltext_override()}else o.setTimeout(function(){e(o)},100)}(window));


//                                                         -----------------------------------------------------
//                                                                           تم التعديل من قبل خالد
//                                                                           علشان تعطي سكور W
//                                                                         عشان تسوي ترك سبلت  Q
//                                                                         و عشان تسوي دبل D Or 2
//                                                                                و شكرا
//                                                         -----------------------------------------------------
//                                                                          YouTube : 5A LD
//                                                                          PIN : 7AA8055D
//                                                                      WHATSAPP : +97336141780
//                                                                           Snap : K_ishaq
//                                                                           Insta : 5a1ld
//                                                        -----------------------------------------------------