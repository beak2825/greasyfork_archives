// ==UserScript==
// @name         slay.one 100 Ping - 60 Fps
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  Anti-Lag Tryhards
// @author       EscudoStar
// @license      PowerStar
// @match        https://slay.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474472/slayone%20100%20Ping%20-%2060%20Fps.user.js
// @updateURL https://update.greasyfork.org/scripts/474472/slayone%20100%20Ping%20-%2060%20Fps.meta.js
// ==/UserScript==
window.Function = new Proxy(window.Function, {
  construct: function(to, args) {
    let a = args[0].match(/(\w+)=function\(\)/)[1];
    let b = args[0].match(/function\(\w+,(\w+)\){var (\w+)/);
    return new to(args[0]
                    .replace(/if\(!window\).*(\w{1,2}\[\w{1,2}\(-?'.{1,5}','.{1,5}'\)(?:\+'.{1,3}')?\])\((\w{1,2}),(\w{1,2}\[\w{1,2}\(-?'.{1,5}','.{1,5}'\)(?:\+'.{1,3}')?\])\);};.*/,`$1($2,$3);};`)
                    .replace(/function \w+\(\w+\){.*?}(?=\w)(?!else)(?!continue)(?!break)/,"")
                    .replace(/,window.*?\(\)(?=;)/,"")
                    .replace(new RegExp(`,${a}=function.*?${a}\\(\\)`),`;${b[2]}(${b[1]}+1)`)
                   );
  }
});