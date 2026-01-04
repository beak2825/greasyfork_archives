// ==UserScript==
// @name         KING
// @description  Crown script for the KING :D
// @namespace    http://tampermonkey.net/
// @author       Havoc
// @match        http://alis.io/*
// @match        http://*.alis.io/*
// @version      2.3
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/40779/KING.user.js
// @updateURL https://update.greasyfork.org/scripts/40779/KING.meta.js
// ==/UserScript==

onMultiChat=((e,o)=>{if(""!==currentIP&&"SERVER"==e&&"/"==o[0]){var t=o.slice(1,o.length).split(": "),a=t[0];t.splice(0,1);var n=t.join().trim();"playerid"==a&&console.log(`%c  Player ID: ${n}  `,'background: #262626 ; color: #ffd700; font-size:10px; font-family: "Segoe UI"'),myid=n}}),updatePlayerID=(()=>{var e=setInterval(()=>{1===webSocket.readyState&&sendChat("/getmyid"),clearInterval(e)},200)}),setInterval(()=>{("undefined"!=typeof myCells?myCells.length:0)<=2&&!0===isJoinedGame&&1===("undefined"!=typeof myCells?webSocket.readyState:0)&&split(16)},7500);var split=e=>{var o=new DataView(new ArrayBuffer(1));o.setUint8(0,17);for(var t=0;t<e;t++)setTimeout(()=>{webSocket.send(o.buffer)},50*t)};unsafeWindow.crown=(e=>{var o;63712===("undefined"!=typeof userid&&userid)&&(o=void 0!==e?500:0,setTimeout(()=>{var e=setInterval(()=>{"undefined"!=typeof myid&&""!==myid&&(playerDetails[myid].hat="crown",$("#skinurl").val("https://cdn.discordapp.com/emojis/413082647955505173.png"),playerDetails[myid].skinUrl="https://cdn.discordapp.com/emojis/413082647955505173.png",console.log(`%c  Crown loaded for ${""===playerDetails[myid].name?"Unnamed":playerDetails[myid].name}? `,'background: #262626 ; color: #ffd700; font-size:16px; font-family: "Segoe UI"'),clearInterval(e))},50)},o))}),$("#maincard").on("click","button",e=>{""!==currentIP&&"Play"===$($(e.currentTarget)).text()&&(updatePlayerID(),console.log("%c  Loading crown...  ",'background: #262626 ; color: #ffd700; font-size:14px; font-family: "Segoe UI"'),crown())}),$("body").on("keydown",e=>{""!==currentIP&&Object.values(JSON.parse(getLocalStorage("hotkeyMapping"))).includes("hk_start_new_game")&&(e.keyCode!==Object.entries(JSON.parse(getLocalStorage("hotkeyMapping"))).find(e=>"hk_start_new_game"===e[1])[0].charCodeAt(0)||$("#input_box2").is(":focus")||(updatePlayerID(),console.log("%c  Loading crown...  ",'background: #262626 ; color: #ffd700; font-size:14px; font-family: "Segoe UI"'),crown(!0)))});