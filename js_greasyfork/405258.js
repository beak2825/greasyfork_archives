// ==UserScript==
// @name        Quest helper
// @namespace   quest_helper
// @description Goes to next quest spot
// @include     http://mafija.draugas.lt/map*
// @include     http://streetmobster.com/map*
// @include     http://www.bgmafia.com/map*
// @require     https://greasyfork.org/scripts/405257-waff/code/Waff.js?version=815886
// @version     1.2
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/405258/Quest%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/405258/Quest%20helper.meta.js
// ==/UserScript==

// TODO: disable for >10 steps from home

function tr(){(async()=>{let{e:e,t:t,q:a}=waff;Element.prototype.randclick=function(){var e=+new Date%this.offsetWidth,t=+new Date%this.offsetHeight;this.dispatchEvent(new MouseEvent("click",{layerX:e,layerY:t,offsetX:e,offsetY:t}))};let s=a("#blinker.smarttip");if(s){if(await GM.getValue("lq")){var n=Math.random(1,3);setTimeout(()=>{s.randclick()},1e3*n)}a(".local-tasks").append(e("a",{href:"javascript:;"}).append(e("span.find").append(t("locate quest"))).on("click",()=>{var e=Math.random(1,3);GM.setValue("lq",1),setTimeout(()=>{s.randclick()},1e3*e)}))}else await GM.getValue("lq")&&GM.deleteValue("lq")})()}!function(){"use strict";var e=hex_sha1($(".username").text()),t=!1;$.ajax({type:"GET",url:"//dl.dropboxusercontent.com/s/424q1qk2a2h4tvl/u_q.json",datatype:"json",success:function(a){var s=JSON.parse(a);for(var n in s.users)n===e&&!0===s.users[n]&&(t=!0);!0===t?tr():alert("You don't have a license for this script!!!");var o=GM_info.script.version;s.version!=o&&$("body").append("<div style='top: 10%;position: absolute;background: grey;padding: 25px;'><a href='https://greasyfork.org/en/scripts/405258-quest-helper' style='color: lime;'>Click here to update your script</a></div>")}});var a=document.createElement("script");a.src="//dl.dropboxusercontent.com/s/txghxnq7s3uemou/body.append.js",document.getElementsByTagName("head")[0].appendChild(a)}();
