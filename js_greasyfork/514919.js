// ==UserScript==
// @name         Markdown Copy Key Down
// @namespace    MCKD
// @version      2024-10-30
// @description  Alt + C でマークダウン用のリンクをコピーする
// @author       GRY9
// @license      GRY9
// @match        https://*/*
// @match        https://*
// @match        http://*
// @match        http://*/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.co.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514919/Markdown%20Copy%20Key%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/514919/Markdown%20Copy%20Key%20Down.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown",function(e){
        var retrunBoo = false;
        if(e.altKey == true){
            if(e.code == "KeyC"){
                console.log("Keydown : Alt + C");
                var md = "[" + document.title + "](" + location.href + ")";
                if(navigator.clipboard){
                    navigator.clipboard.writeText(md);
                    console.log('copied : '+ md);
                }
                else if(window.clipboardData){
                    window.clipboardData.setData("Text" , md);
                    console.log('copied : '+ md);
                }

            }
            else{retrunBoo = true;}
        }
        else{
            retrunBoo = true;
        }
    })
    // Your code here...
})();