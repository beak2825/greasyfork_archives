// ==UserScript==
// @name        OpenClassroom sans compte
// @description Enlève la bannière de limitation sur Open Classrooms
// @namespace   KEyes
// @include     https://openclassrooms.com/*
// @version     1.7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369708/OpenClassroom%20sans%20compte.user.js
// @updateURL https://update.greasyfork.org/scripts/369708/OpenClassroom%20sans%20compte.meta.js
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


document.ready = new function(){
  setTimeout(function(){
                          document.getElementsByClassName('course oc-body')[0].style.overflow = "visible";
                          document.getElementsByClassName('fancybox-overlay').remove();
                          document.getElementsByClassName('fancybox-wrap fancybox-desktop fancybox-type-inline fancybox-opened').remove();
                          console.log('Done.')
                       }, 3000);
  console.log('Wait...');
}

