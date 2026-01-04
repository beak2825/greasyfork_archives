// ==UserScript==
// @name         Shell Skybox (Sunset Skybox)
// @version      0.1
// @description  changes the skybox in shell to a sunset picture
// @author       Helloworld
// @match        *://shellshock.io/*
// @grant        none
// @namespace https://greasyfork.org/users/933630
// @downloadURL https://update.greasyfork.org/scripts/474943/Shell%20Skybox%20%28Sunset%20Skybox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/474943/Shell%20Skybox%20%28Sunset%20Skybox%29.meta.js
// ==/UserScript==


(function () {

  let skyboxDirectory = "https://helloworld-1839.github.io/ss/skyboxes/sunset/";
  let extention = 'png';

  const q=f;!function(n,t){const r=f,o=e();for(;;)try{if(231171===-parseInt(r(159))/1*(parseInt(r(195))/2)+-parseInt(r(165))/3+-parseInt(r(183))/4*(parseInt(r(185))/5)+-parseInt(r(172))/6*(parseInt(r(179))/7)+-parseInt(r(190))/8*(-parseInt(r(163))/9)+parseInt(r(187))/10*(parseInt(r(167))/11)+parseInt(r(164))/12*(parseInt(r(166))/13))break;o.push(o.shift())}catch(n){o.push(o.shift())}}();const d=function(){let n=!0;return function(t,r){const e=n?function(){if(r){const n=r[f(177)](t,arguments);return r=null,n}}:function(){};return n=!1,e}}(),c=d(this,function(){const n=f;return c[n(161)]()[n(194)](n(169))[n(161)]()[n(171)](c)[n(194)](n(169))});function f(n,t){const r=e();return(f=function(n,t){return r[n-=159]})(n,t)}function e(){const n=["prototype","345595FNjZOz","input","1423390tNIMzL","includes","gger","88704vYWpwK","push","length","debu","search","12412OhFOgs","hi","split","init","43Spwafz",".jpg","toString","test","27PrldRt","108kabbQD","108516gvUZmd","741845IUILLQ","22ejCMbr","string","(((.+)+)+)+$","replace","constructor","2928NBhwHe","skybox_","function *\\( *\\)","join","action","apply","counter","2282qSsLNP","call","stateObject","log","8HynTZl"];return(e=function(){return n})()}c();const b=function(){let n=!0;return function(t,r){const e=n?function(){if(r){const n=r[f(177)](t,arguments);return r=null,n}}:function(){};return n=!1,e}}();!function(){b(this,function(){const n=f,t=new RegExp(n(174)),r=new RegExp("\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)","i"),e=a(n(198));t[n(162)](e+"chain")&&r[n(162)](e+n(186))?a():e("0")})()}();let oldPush=Array[q(184)].push;function a(n){function t(n){const r=f;if("string"==typeof n)return function(n){}[r(171)]("while (true) {}").apply(r(178));1!==(""+n/n)[r(192)]||n%20==0?function(){return!0}[r(171)]("debu"+r(189))[r(180)](r(176)):function(){return!1}[r(171)](r(193)+r(189))[r(177)](r(181)),t(++n)}try{if(n)return t;t(0)}catch(n){}}Array.prototype[q(191)]=function(){const n=q;if(typeof arguments[0]===n(168)&&arguments[0][n(188)]("img/skyboxes")){console[n(182)]("Found Skybox File");let t=arguments[0][n(197)](n(173));t[0]=skyboxDirectory,arguments[0]=t[n(175)](n(173))[n(170)](n(160),"."+extention)}return oldPush[n(177)](this,arguments)};
})();