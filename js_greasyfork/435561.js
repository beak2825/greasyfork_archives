// ==UserScript==
// @name        Fixowa
// @namespace   Violentmonkey Scripts
// @match       https://owa.tetracore.com/owa/*
// @grant       none
// @version     1.0
// @author      mrculler
// @description 11/15/2021, 5:51:25 PM
// @license     Public domain
// @downloadURL https://update.greasyfork.org/scripts/435561/Fixowa.user.js
// @updateURL https://update.greasyfork.org/scripts/435561/Fixowa.meta.js
// ==/UserScript==
// Got the actual JS fix from: 
//  https://bugs.chromium.org/p/chromium/issues/detail?id=410989#c32
// Then copied out the minified code he references and made the change.  Here we patch the object
// Don't know why it still works after throwing the exception but it does
  SelectionRange.prototype.select = function SelectionRange$select() {
    if (this.w3c) {
        var a = this.document.defaultView.getSelection();
        if (a.removeAllRanges) {
            a.removeAllRanges();
            a.addRange(this.range)
        } else
            a.setBaseAndExtent(this.range.startContainer, this.range.startOffset, this.range.endContainer, this.range.endOffset);
        return this.range
    } else
        return this.range.select()
};
console.log("patched OWA");