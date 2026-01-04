// ==UserScript==
// @name         GTranslate Helper
// @namespace    https://github.com/Evi1/GTranslate-PDF-Helper
// @version      0.2.3
// @description  format the paste from pdf.
// @author       els_angel
// @match        *://translate.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38154/GTranslate%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/38154/GTranslate%20Helper.meta.js
// ==/UserScript==
var source = document.getElementById('source');
function handlePaste (e) {
    let clipboardData, pastedData;

    // Stop data actually being pasted into div
    e.stopPropagation();
    e.preventDefault();

    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');
    let lines = pastedData.split('\n');
    let lLen = lines.length;
    let out = "";
    if(lLen === 1){
        out = pastedData.replace(/[\r\n]+/g," ");
    }else{
        let maxLen = -1;
        for(let i=0;i<lLen;i++){
            let liLen = lines[i].length;
            if(liLen>maxLen){
                maxLen = liLen;
            }
        }
        let xLen = maxLen*3/4;
        for(let i=0;i<lLen;i++){
            let liLen = lines[i].length;
            let rLine = lines[i].replace(/[\r\n]+/g,"");
            let e = rLine.charAt(rLine.length-1);
            if(liLen<=xLen&&(e==='.'||e===':'||e==='?'||e==='!')){
                out+=rLine+"\n";
            }else{
                out+=rLine+" ";
            }
        }
    }
    // Do whatever with pasteddata
    let start = source.selectionStart;
    // obtain the index of the last selected character
    let finish = source.selectionEnd;
    let str = source.value;
    let final = str.substring(0,start)+out+str.substring(finish,str.length);
    // obtain the selected text
    source.value=final;
    source.focus();
    source.selectionEnd = start + out.length;
}
(function() {
    'use strict';

    // Your code here...
    source.addEventListener('paste', handlePaste);
})();




