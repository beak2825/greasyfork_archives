// ==UserScript==
// @name         InstaMotivator
// @namespace    http://tampermonkey.net/
// @version      2024-02-14.1
// @description  Hides the instagram login page (PC) and gives a motivational message
// @author       Njan.codes
// @match        https://www.instagram.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487386/InstaMotivator.user.js
// @updateURL https://update.greasyfork.org/scripts/487386/InstaMotivator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let quote = "GO DO THE RUST LAB(DS PRACTICAL) PROJECT PLEASE BRUV!! STOP LOOKING INSTAGRAM";
    // Your code here...
    setInterval(function (){
        const logo = document.querySelector("i");
        logo.remove();
        let subBtn = document.querySelector('div.x9f619 button._acan');
        subBtn.remove();
        let userIn = document.querySelector('label._aa48');
        userIn.remove();
        let login = document.querySelector("div._ab21");
        login.remove();

        let loginBox = document.querySelector("div._ab1y");
        let h1 = document.createElement('h1');
        let styleH1 = {
            background: 'gray',
            color: 'white',
            padding: '20px',
            fontSize: '100',
            textAlign: 'center',
            position: 'absolute',
            zIndex: '10000'
        }
        Object.assign(h1.style,styleH1);
        h1.innerHTML = quote;
        loginBox.insertBefore(h1,loginBox.firstChild);
    },2000
    );
    setInterval(function (){
        let loginPhone = document.querySelector("div.x9f619");
        loginPhone.remove();
    },2000);
    
})();