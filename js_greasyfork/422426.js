// ==UserScript==
// @name         Eval Packet Overrider
// @version      1.7
// @description  Overrides eval packet to disable debugger and increase game's speed
// @author       don_shädaman
// @match        https://diep.io
// @match        https://florr.io
// @grant        none
// @namespace    https://greasyfork.org/users/422425
// @downloadURL https://update.greasyfork.org/scripts/422426/Eval%20Packet%20Overrider.user.js
// @updateURL https://update.greasyfork.org/scripts/422426/Eval%20Packet%20Overrider.meta.js
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