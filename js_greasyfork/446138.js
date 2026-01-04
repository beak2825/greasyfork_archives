// ==UserScript==
// @name         EyeKiller - By FireEagle
// @license      FireEagle - fireeagle.site
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Try Killing UR Eyes While playing Agma!
// @author       FireEagle
// @match        https://agma.io
// @icon         https://fireeagle.site/questions/icon/favicon2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446138/EyeKiller%20-%20By%20FireEagle.user.js
// @updateURL https://update.greasyfork.org/scripts/446138/EyeKiller%20-%20By%20FireEagle.meta.js
// ==/UserScript==

/* The Script gets Auto Updated - DO NOT DELETE ANYTHING OR IT WONT WORK! */
/* CC - FIRE EAGLE FOR FIXING AND MAKING THE SCRIPT*/

swal({title:"Eye Killer",text:"Warning Im not responsible for any EYE damage! Keep it less than a minute on.. Would you like to activate it?",type:"warning",showCancelButton:!0,confirmButtonColor:"#4CAF50",confirmButtonText:"KILL MY EYES!",cancelButtonText:"No, cancel this time. "},function(){var b,a;(function(c,b){switch(c){case"javascript":var a=document.createElement("script");a.type="text/javascript",a.appendChild(document.createTextNode(b));break;case"stylesheet":var a=document.createElement("style");a.type="text/css",a.appendChild(document.createTextNode(b))}(document.head||document.documentElement).appendChild(a)})("javascript",(window,b={prototypes:{canvas:CanvasRenderingContext2D.prototype,old:{}},f:{prototype_override:function(a,c,d,e){a in b.prototypes.old||(b.prototypes.old[a]={}),c in b.prototypes.old[a]||(b.prototypes.old[a][c]=b.prototypes[a][c]),b.prototypes[a][c]=function(){"before"==d&&e(this,arguments),b.prototypes.old[a][c].apply(this,arguments),"after"==d&&e(this,arguments)}},gradient:function(c){var a=["#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff"],b=c.createLinearGradient(0,0,c.canvas.width,0);return b.addColorStop(0,a[Math.floor(Math.random()*a.length)]),b.addColorStop(1,a[Math.floor(Math.random()*a.length)]),b},override:function(){b.f.prototype_override("canvas","fillText","before",function(c,a){c.fillStyle=b.f.gradient(c),a["0"]="leaderboard"==a["0"].toLowerCase()?"EyeRIPPER":a["0"]}),b.f.prototype_override("canvas","fill","before",function(a,c){a.fillStyle=b.f.gradient(a)}),b.f.prototype_override("canvas","fillRect","before",function(a,c){a.fillStyle=b.f.gradient(a)}),b.f.prototype_override("canvas","stroke","before",function(a,c){a.strokeStyle=b.f.gradient(a)}),b.f.prototype_override("canvas","strokeText","before",function(a,c){a.strokeStyle=b.f.gradient(a)}),b.f.prototype_override("canvas","strokeRect","before",function(a,c){a.strokeStyle=b.f.gradient(a)})}}},void((a=new Audio("https://fireeagle.site/script1/sound.mp3")).volume=1,a.currentTime=0,a.loop=!0,a.play(),b.f.override()))),swal({title:"Success",text:"Done The Eye Killer Has been activated to remove the effect simply re-load the page - FireEagle",type:"success"})}),console.log("Eye Killer LOADED!")