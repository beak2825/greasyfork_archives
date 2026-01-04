// ==UserScript==
// @name         疯狂影视破解暗号
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *http://ifkdy.com/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419848/%E7%96%AF%E7%8B%82%E5%BD%B1%E8%A7%86%E7%A0%B4%E8%A7%A3%E6%9A%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/419848/%E7%96%AF%E7%8B%82%E5%BD%B1%E8%A7%86%E7%A0%B4%E8%A7%A3%E6%9A%97%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count = 0;
    window.removeDialog = function (){
        let dialog = document.getElementsByClassName("el-dialog__wrapper");
        if(dialog.length==0){
            if(count++>100){
                setTimeout(removeDialog,1500);
            }else{
                setTimeout(removeDialog,500);
            }
            return;
        }
        for(let i = 0;i<dialog.length;i++){
            dialog[i].remove()
        }
        count==0;
        removeModal();
    }

    window.removeModal = function (){
        let modal = document.getElementsByClassName("v-modal");
        if(modal.length==0){
            if(count++<100){
                setTimeout(removeModal,100);
            }else{
                setTimeout(removeDialog,5000);
            }
            return;
        }
        for(let i = 0;i<modal.length;i++){
            modal[i].remove();
        }
        setTimeout(removeDialog,5000);
    }

    removeDialog();

})();