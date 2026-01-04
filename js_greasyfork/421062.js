// ==UserScript==
// @name         TWS-bot _Gab 0.5
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  none
// @author       atym-cash
// @match        https://talkwithstranger.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421062/TWS-bot%20_Gab%2005.user.js
// @updateURL https://update.greasyfork.org/scripts/421062/TWS-bot%20_Gab%2005.meta.js
// ==/UserScript==

var bot={username:["chasloi "],greetings1:["hello ","hi ","hey "],greetings2:["how are you ","hru ","how are u ","how r u "],greetings3:["whats up ","sup "],greetings4:["how you doing ","how u doing ","how u doin ","wyd "],greetings5:["where you from ","where are you from ","where r u from "],gender:["female ","f "],age:[18,19,20,21,22,23],social_network:["snapchat ","snap ","SC "],non1:["my "],non2:["me "],non3:["on "],keywords1:["add ","check ","look ","see ","got "]};let _r=e=>{return e[Math.floor(Math.random()*e.length)]},_structure=()=>{let e=e=>r.push(e),o=_r(["A","B","C","D"]),r=[];return"A"==o&&(e(_r(bot.greetings1)),e(_r(bot.gender)+_r(bot.age)),e(_r(bot.keywords1)+_r(bot.non1)+_r(bot.social_network)+_r(bot.username))),"B"==o&&(e(_r(bot.greetings1)+_r(bot.gender)),e(_r(bot.greetings2)),e(_r(bot.keywords1)+_r(bot.non1)+_r(bot.social_network)+_r(bot.username))),"C"==o&&(e(_r(bot.greetings4)),e(_r(bot.gender)+_r(bot.age)),e(_r(bot.keywords1)+_r(bot.non2)+_r(bot.non3)+_r(bot.social_network)+_r(bot.username))),"D"==o&&(e(_r(bot.greetings5)),e(_r(bot.gender)+_r(bot.age)),e(_r(bot.keywords1)+_r(bot.non2)+_r(bot.non3)+_r(bot.social_network)+_r(bot.username))),r},getMessage=()=>{let e=[],o=["","​","​​","​​​","​​​​","​​​​​","​​​​​​"];return _structure().map(r=>{let t="";for(let e in r)"string"==typeof r[e]&&(t+=r[e]+_r(o));e.push(t)}),e},messages=getMessage(),auto_username="Someone",i=0,start_chat=()=>{if($(".usernameInput")[0]){let e=$(".usernameInput")[0];e.value=auto_username,e.value==auto_username&&talk.click()}},send_msg=()=>{connected&&(socket.send(messages[i]),console.log("Me: "+messages[i]),i++)},exit_chat=()=>{i>messages.length-1&&window.location.reload(),1==chatMessageInput.disabled&&0==connected&&window.location.reload()};var loop=setInterval(()=>{start_chat(),send_msg(),exit_chat()},2e3);