// ==UserScript==
// @name         Purmt
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Scramble selected names
// @author       Tad Naff
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397608/Purmt.user.js
// @updateURL https://update.greasyfork.org/scripts/397608/Purmt.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const to_scramble=['Trump','Republican','Putin','Bezos','Bloomberg','Zuckerberg'];
    const cre=[];
    for(let i in to_scramble){
       cre[i] = new RegExp(to_scramble[i]);
    }
    function scramble(word){
        let i, out;
        const l = word.length,
              arr = word.toLowerCase().split('');
        for(i = 0; i < l; i++){
            let i1 = Math.floor(Math.random()*l),
                i2 = Math.floor(Math.random()*l),
                s = arr[i1];
            arr[i1] = arr[i2];
            arr[i2] = s;
        }
        arr[0] = arr[0].toUpperCase();
        out = arr.join('');
        return out;
    }
    let working=false;
    function doit(){
        if(working) return;
        working = true;
        replace(document.getElementsByTagName('body')[0]);
        working = false;
    }
    function replace(elt){
        let in1,in2;
        if(null == elt)return;
        if(elt.nodeType == 3){
            for(let ci in to_scramble){
                in1 = elt.textContent;
                in2 = in1;
                while(in1.match(cre[ci])){
                    in1 = in1.replace(cre[ci],scramble(to_scramble[ci]));
                }
                if (in1 != in2) elt.textContent = in1;
            }
        }else{
            for(let ch in elt.childNodes){
                replace(elt.childNodes[ch]);
            }
        }
    }
    const observer = new MutationObserver(doit);
    observer.observe(document.getElementsByTagName('body')[0],{attributes:false,childList:true,subtree:true});
    setTimeout(doit,500);
})();