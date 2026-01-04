// ==UserScript==
// @name         Spooky Google
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google Homepage, spooky redesign for Halloween
// @author       codewithmeg
// @match        https://www.google.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434352/Spooky%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/434352/Spooky%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var favicon_link_html = document.createElement('link');
    favicon_link_html.rel = 'icon';
    favicon_link_html.href = 'https://img.icons8.com/external-vitaliy-gorbachev-flat-vitaly-gorbachev/20/000000/external-pumpkin-autumn-vitaliy-gorbachev-flat-vitaly-gorbachev.png';
    favicon_link_html.type = 'image/x-icon';

    try {
    document.getElementsByTagName('head')[0].appendChild( favicon_link_html );
    }
    catch(e) { }

    window.addEventListener('load', function(){
        const feelingLuckyButton = document.querySelector("input#gbqfbb");
        feelingLuckyButton.value = "Trick or Treat"
        const linksToChangeColor = document.querySelectorAll('div.gb_Qd.gb_Sa.gb_Ed a');
        for(let i=0; i<linksToChangeColor.length; i++) {
            linksToChangeColor[i].style.color = "white";
            linksToChangeColor[i].style.fontWeight = "bold";
        }
        const background = document.querySelector('body');
        background.style.backgroundImage='url("https://images.unsplash.com/photo-1475762638009-d74671ecd29b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80")';
        const searchIcon = document.querySelector(".QCzoEc");
        searchIcon.querySelector("svg").outerHTML = `<img src="https://img.icons8.com/external-vitaliy-gorbachev-flat-vitaly-gorbachev/30/000000/external-pumpkin-autumn-vitaliy-gorbachev-flat-vitaly-gorbachev.png"/>`;
        const googleIcon = document.querySelector("img.lnXdpd");
        googleIcon.srcset = "https://i.ibb.co/ZL6yRG9/google.png";
        googleIcon.src = "https://i.ibb.co/ZL6yRG9/google.png";
        const microphoneIcon = document.querySelector(".goxjub")
        microphoneIcon.outerHTML= `<img src="https://img.icons8.com/office/30/000000/microphone--v1.png"/>`
        const linksToHide = document.querySelectorAll("a.MV3Tnb");
        for(let i=0; i <linksToHide.length; i++) {
            linksToHide[i].style.display="none";
        }
    }, false)

})();