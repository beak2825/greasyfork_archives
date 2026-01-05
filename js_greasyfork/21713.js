// ==UserScript==
// @name        Remover
// @namespace   MegaByteRem
// @description Removes Nodes
// @run-at      document-end
// @include     *
// @version     1
// @grant       none
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
    
    function remove(selector) {
        document.querySelectorAll(selector).remove();
    }