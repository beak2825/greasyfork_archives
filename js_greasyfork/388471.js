// ==UserScript==
// @name               Prevent OBJECT Insertion
// @description        To avoid a problem of Amazon, maybe.  See Bug 1172205.
// @description:ja-JP  「Amazonが重い」問題を回避できるかもしれません。
// @namespace          f4cce630-3501-4d9f-a846-d69064429f02
// @include            /^https?://(?:www\.amazon\.(?:c(?:o(?:\.(?:jp|uk)|m(?:\.(?:au|br|mx))?)|[an])|de|es|fr|i[nt]|nl))/.*/
// @version            1.0
// @grant              none
// @run-at             document-start
// @copyright          No copyright. this program is in the public domain.
// @downloadURL https://update.greasyfork.org/scripts/388471/Prevent%20OBJECT%20Insertion.user.js
// @updateURL https://update.greasyfork.org/scripts/388471/Prevent%20OBJECT%20Insertion.meta.js
// ==/UserScript==

// 1172205 – Amazon preloads resources with <object> tags causing the throbber to blink heavily shortly after page load
// https://bugzilla.mozilla.org/show_bug.cgi?id=1172205

var TARGET_NAME = "OBJECT";
var ORIG_SUFFIX = "-original-f4cce630-3501-4d9f-a846-d69064429f02";

["appendChild", "insertBefore"].forEach(function(name){
  window.HTMLElement.prototype[name + ORIG_SUFFIX] = window.HTMLElement.prototype[name];
  window.HTMLElement.prototype[name] = function() {
    var node = arguments[0];
    if (node.nodeName !== TARGET_NAME)
      node = this[name + ORIG_SUFFIX].apply(this, arguments);
    else {
      // console.log("Blocked: " + node.outerHTML);
      node = null;
    }
    return node;
  }
});
