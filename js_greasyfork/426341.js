// ==UserScript==
// @name        woomy.arras.io no respawn cooldown
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description read the title
// @author      BZZZZ
// @include     /^https?\:\/\/woomy\.arras\.io\/([?#]|$)/
// @version     0.2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/426341/woomyarrasio%20no%20respawn%20cooldown.user.js
// @updateURL https://update.greasyfork.org/scripts/426341/woomyarrasio%20no%20respawn%20cooldown.meta.js
// ==/UserScript==

(function(){
var a=document.createElement("div");
a.setAttribute("onclick","var r=()=>0;Object.defineProperty(Object.prototype,'diedAt',{'get':r,'set':r});");
a.click();
})();