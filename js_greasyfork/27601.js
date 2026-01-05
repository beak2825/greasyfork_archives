// ==UserScript==
// @name         Copy Hex to Clipboard | ColorHunt.co
// @namespace    http://colorhunt.co/
// @version      1.03
// @description  Make Color Hunt a little nicer to use. :P
// @author       Shaun Greiner
// @match        http://colorhunt.co/c/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27601/Copy%20Hex%20to%20Clipboard%20%7C%20ColorHuntco.user.js
// @updateURL https://update.greasyfork.org/scripts/27601/Copy%20Hex%20to%20Clipboard%20%7C%20ColorHuntco.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    var hexSpans = document.querySelectorAll('.focus .place .tran');    
    var copyInputBox = createCopyInputBox();
    createCopyAllButton();
    copySingleHexInit();

    function createCopyInputBox(){
        var copyInputBox = document.createElement("input");
        copyInputBox.type = "text";
        copyInputBox.id = "copyInputBox";
        copyInputBox.style = {"display":"none"};
        var cIB = document.body.appendChild(copyInputBox);
        return cIB;
    }

    function createCopyAllButton(){
        var copyAllBtn = document.createElement("a");
        copyAllBtn.text = "Copy";
        copyAllBtn.className = "copy button tran";
        copyAllBtn.addEventListener("click",function(){ copyToClipboard( hexesToString() ); });
        document.querySelector(".focus .actionbar .left").appendChild(copyAllBtn);
    }

    function copyToClipboard(value){
        copyInputBox.value = value;
        copyInputBox.select();
        try{
            var successful = document.execCommand('copy');  
            var msg = successful ? 'successful' : 'unsuccessful';  
            console.log('Copy was ' + msg);  
        } catch(err){
            console.error(err);
        }
        window.getSelection().removeAllRanges();
        copyInputBox.blur();
    }
    
    function copySingleHexInit(){
        for(var i=0; i<hexSpans.length; i++){
            var span = hexSpans[i];
            span.addEventListener("click", (event)=>{
                copyToClipboard(event.target.innerText);
            });
        }
    }
    
    function hexesToString(){
        var hexArray = [];
        for(var i=0; i<hexSpans.length; i++){
            hexArray.push(hexSpans[i].innerText);
        }
        console.log(hexArray);
        return hexArray.join(", ");
    }
    
})();