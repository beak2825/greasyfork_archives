// ==UserScript==
// @name         Colab Alive 
// @namespace    colab
// @version      0.2
// @description  Bypass limit 90 min google colab
// @author       Nguyen Khong
// @match        https://colab.research.google.com/drive/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/418770/Colab%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/418770/Colab%20Alive.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function() {
    function ClickConnect(){
        console.log("Working");
        try{
            document.querySelector("#top-toolbar > colab-connect-button").shadowRoot.querySelector("#connect").click();
        }catch(e){}
    }
    setInterval(ClickConnect,60000);
});