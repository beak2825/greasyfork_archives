// ==UserScript==
// @name         伪装安卓平台fix
// @version      0.2
// @description  AndroidPlatform
// @author       You
// @include      *
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/237658
// @downloadURL https://update.greasyfork.org/scripts/452868/%E4%BC%AA%E8%A3%85%E5%AE%89%E5%8D%93%E5%B9%B3%E5%8F%B0fix.user.js
// @updateURL https://update.greasyfork.org/scripts/452868/%E4%BC%AA%E8%A3%85%E5%AE%89%E5%8D%93%E5%B9%B3%E5%8F%B0fix.meta.js
// ==/UserScript==

(function() {
Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
})();