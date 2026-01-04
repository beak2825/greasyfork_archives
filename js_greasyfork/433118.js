// ==UserScript==
// @name        MouseEvent.prototype.x or MouseEvent.prototype.y not supported fix
// @namespace   http://bzzzzdzzzz.blogspot.com/
// @description for browsers that don't support MouseEvent.prototype.x or MouseEvent.prototype.y
// @author      BZZZZ
// @include     *
// @version     0.2
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/433118/MouseEventprototypex%20or%20MouseEventprototypey%20not%20supported%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/433118/MouseEventprototypex%20or%20MouseEventprototypey%20not%20supported%20fix.meta.js
// ==/UserScript==

(function(){
  "use strict";
  var d=Object.defineProperty,g=Object.getOwnPropertyDescriptor,p=unsafeWindow.MouseEvent.prototype,h=Object.prototype.hasOwnProperty.bind(p);
  h("x")||d(p,"x",g(p,"clientX"));
  h("y")||d(p,"y",g(p,"clientY"));
})();