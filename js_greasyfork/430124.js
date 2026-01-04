// ==UserScript==
// @name        woomy.arras.io always draw health bar
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description read the title
// @author      BZZZZ
// @include     /^https?\:\/\/woomy\.arras\.io\/([?#]|$)/
// @version     0.2
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/430124/woomyarrasio%20always%20draw%20health%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/430124/woomyarrasio%20always%20draw%20health%20bar.meta.js
// ==/UserScript==

(function(){
var a=document.createElement("div");
a.setAttribute("onclick","var r=()=>true;Object.defineProperty(Object.prototype,'drawsHealth',{'get':r,'set':r});");
a.click();
})();