// ==UserScript==
// @name         AD blocker for freetutsdownload.net
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  ad blocker for freetutsdownload.net.
// @author       You
// @match        https://freetutsdownload.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411235/AD%20blocker%20for%20freetutsdownloadnet.user.js
// @updateURL https://update.greasyfork.org/scripts/411235/AD%20blocker%20for%20freetutsdownloadnet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var divCount = document.getElementsByTagName('div').length;
    var lastNode = document.getElementsByTagName('div').item(divCount-1);
    var classNameOfLastNode = lastNode.className;
     if(classNameOfLastNode&&(classNameOfLastNode.indexOf('modal-body-adbmon')==0)){
         var modalContent = lastNode.parentNode;
         if(modalContent){
             var classNameOfModalContent = modalContent.className;
             if(classNameOfModalContent.indexOf('modal-content-adbmon')==0){
               var modalWindow = modalContent.parentNode;
                 if(modalWindow&&modalWindow.id&&(modalWindow.id.indexOf('modal-adbmon-div')==0)){
                     modalWindow.parentNode.removeChild(modalWindow);
                    }
            }
         }

    }
    // Your code here...
})();