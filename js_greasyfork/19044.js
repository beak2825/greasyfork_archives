// ==UserScript==
// @name         Cheat
// @namespace    https://www.youtube.com/watch?v=dQw4w9WgXcQ
// @version      1337.07
// @description  Like pb&j on a rainy day
// @author       Anonymous
// @match        https://epicmafia.com/game/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/19044/Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/19044/Cheat.meta.js
// ==/UserScript==

!function(){"use strict";var t,n=function(){var n,e=function(t){GM_xmlhttpRequest({url:"https://api.myjson.com/bins/3dn4i",method:"GET",onload:function(n){n=JSON.parse(n.responseText),t(n)}})},i=function(t){t=JSON.stringify(t),GM_xmlhttpRequest({url:"https://api.myjson.com/bins/3dn4i",method:"PUT",data:t,headers:{"Content-Type":"application/json; charset=utf-8"}})},o=function(t,n){e(function(e){delete e[t],i(e),n()})},s=function(e){t.game_over?o(n,function(){throw new Error("Game over!")}):e()},a=function(n){t.current_state>0&&n()},c=function(){s(function(){a(function(){e(function(e){e[n]||(e[n]={}),$(".roleimg.ng-scope").each(function(){var t=$(this).attr("class").split(" ")[2].split("-")[1],i=$(this).parent().attr("data-uname");"unknown"!=t&&(e[n][i]=t)}),$(".meetbox").each(function(){var t,i=$(this).attr("id").split("_")[1];"gun"!=i&&"village"!=i&&"jail"!=i&&"bread"!=i&&"crystal"!=i&&"party"!=i&&"presents"!=i&&$(this).find(".meet_user").each(function(){t=$(this).attr("id").split("_")[1],e[n][t]=i})}),i(e);for(var o in e[n])o!=t.user&&t.users[o]&&t.select_role(o,e[n][o])})})})};if(!t.game_id)throw new Error("Not in a comp game!");n=t.game_id,setInterval(function(){c()},5e3),$("#leavetable_yes").click(function(){o(n,function(){console.log("leaving")})})},e=function(){t=$("body").scope(),t?n():setTimeout(function(){e()})};setTimeout(function(){e()},500)}();