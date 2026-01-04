// ==UserScript==
// @name         Yt6 -- Snarl's YouTube Video Player (userscript)
// @namespace    yt6
// @version      202101240630
// @author       Snarl
// @description  Auto-Load Yt6 script as soon as possible
// @match        https://*.youtube.com/watch*
// @match        https://*.youtube.com/embed/*
// @match        http://*.youtube.com/watch*
// @match        http://*.youtube.com/embed/*
// @grant        none
// @run-at       document-end
// @icon         https://yt3.ggpht.com/-afBnHVG_R6E/AAAAAAAAAAI/AAAAAAAAAAA/LtE5kbPkZvE/s27-c-k-no-mo-rj-c0xffffff/photo.jpg
// @downloadURL https://update.greasyfork.org/scripts/424419/Yt6%20--%20Snarl%27s%20YouTube%20Video%20Player%20%28userscript%29.user.js
// @updateURL https://update.greasyfork.org/scripts/424419/Yt6%20--%20Snarl%27s%20YouTube%20Video%20Player%20%28userscript%29.meta.js
// ==/UserScript==

(function(){

  window['yt6'] = {}; window['yt6d'] = {}; window['yt6'].body = 1

  var idle_time = 1000 // wait some time before running the bookmarklet part

  var onComplete = function(){setTimeout( //javascript:(
    function(){var v='23383e960ffb5bcdb8c4735169a4148e049c12c6/yt6.js',w=window,d=w.document,h=d.location.href,yt6=w.yt6||{},yt6d=w.yt6d||{};if(yt6d.loaded>=4)return void 0;if(h.split('youtube.com/watch')[1]||h.split('youtube.com/embed')[1]||h.split('/base.j')[1]=='s'){var id='snarls_player',e='script',q;yt6.loaded=0;function s(x){x=x||id;return d.getElementById(x)};function c(e){return d.createElement(e)};function a(q){s().appendChild(q);s().add_subs='en,hu,de';yt6d.src=q.src};function r(){if(s()){var x;try{x=s().querySelector('#'+id)}catch(e){x=s().firstChild};if(x)s().removeChild(x)}};function b(){var i,j,o,x;o=['.githack','git','js'];for(j,x,i=o.length;i;j=Math.floor(Math.random()*i),x=o[--i],o[i]=o[j],o[j]=x);if(yt6d.src!=1)o.splice(0,0,'.githubusercontent');q=c('div');q.id=id;if(q!=s())d.body.appendChild(q);var src='https://raw'+o[0]+'.com/snarly/yt6/'+v,src0='https://cdn.jsdelivr.net/gh/snarly/yt6@'+v;function oc(ox,oy,sr){return(oy!='js')?sr.replace(ox,oy):src0};q=c(e);q.id=id;q.src=(o[0]!='js')?src:src0;q.onerror=function(){q=c(e);q.id=id;q.src=oc(o[0],o[1],src);q.onerror=function(){q=c(e);q.id=id;q.src=oc(o[0],o[2],src);q.onerror=function(){q=c(e);q.id=id;q.src=oc(o[0],o[3],src);q.onerror=function(){q=c(e);q.id=id;q.src=src.replace('https','http')};a(q);r();};a(q);r();};a(q);r();};try{a(q);}catch(f){a(q)};};function g(){try{deldiv()}catch(f){r()};yt6d.src=1;b()};if(!s()){b()};setTimeout(function(){var t=w.yt6;if(t)t.loaded=t.loaded||window['status'];if(!t||(t&&(!t.body||(t.loaded<3))))g()},3000);}else{void 0};}
    //)()/*202101240630*/
  , idle_time)
  }

  var check = function(){ // conditions to meet before loading
    var x = window['performance'];
    if (x && x.timing && x.timing.loadEventEnd > 0 && x.timing.loadEventEnd >= x.timing.domComplete) return true
  }

  if (check()) {
      onComplete()
      return
  }

  var delay = 500, timeout = 8000

  var timeoutPointer
  var intervalPointer = setInterval(function () {
      if (!check()) return

      clearInterval(intervalPointer)
      if (timeoutPointer) clearTimeout(timeoutPointer)
      if (typeof onComplete == 'function') onComplete()
  },delay)

  if (timeout) timeoutPointer=setTimeout(function () {
      clearInterval(intervalPointer)
  },timeout)

})()