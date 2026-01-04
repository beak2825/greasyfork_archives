// ==UserScript==
// @name         Make Input Events Passive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make input event listeners passive
// @author       https://github.com/zzarcon/default-passive-events
// @include      *
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407440/Make%20Input%20Events%20Passive.user.js
// @updateURL https://update.greasyfork.org/scripts/407440/Make%20Input%20Events%20Passive.meta.js
// ==/UserScript==

(function() {

    var e,t=["scroll","wheel","touchstart","touchmove","touchenter","touchend","touchleave","mouseout","mouseleave","mousemove","mouseenter","mousewheel","mouseover"];
    if(function(){
        var e=!1;
        try{
            var t=Object.defineProperty({},"passive",{get:function(){e=!0}});
            window.addEventListener("test",null,t)
            window.removeEventListener("test",null,t)}
        catch(e){}return e}())
    {var o=EventTarget.prototype.addEventListener;
     e=o
     EventTarget.prototype.addEventListener=function(o,r,n){
         var s,a="object"==typeof n&&null!==n,i=a?n.capture:n;
         (n=a?function(e){
             var t=Object.getOwnPropertyDescriptor(e,"passive");
             return t&&!0!==t.writable&&void 0===t.set?Object.assign({},e):e}(n):{}).passive=void 0!==(s=n.passive)?s:-1!==t.indexOf(o)&&!0
         n.capture=void 0!==i&&i
         e.call(this,o,r,n)}
     EventTarget.prototype.addEventListener._original=e}


})();