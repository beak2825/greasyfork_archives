// ==UserScript==
// @name         Abs0rb.me Ad Block
// @namespace    http://abs0rb.me/
// @version      0.1
// @description  Bypass the abs0rb.me adblock blocking!
// @author       DaFudgeWizzad
// @match        http://abs0rb.me/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19206/Abs0rbme%20Ad%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/19206/Abs0rbme%20Ad%20Block.meta.js
// ==/UserScript==

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

$(document).ready(function(){
    $('#mainModal').modal('hide');
    document.getElementById("nick").disabled = false;
    document.getElementById("clanPicker").disabled = false;
    setserver("69.195.128.162:1501"); ServerPlayers(); ServerTotal();
});