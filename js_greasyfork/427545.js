// ==UserScript==
// @name         Dark Blue Theme
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Theme for Shell shockers
// @author       Penguinie
// @match        https://shellshock.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427545/Dark%20Blue%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/427545/Dark%20Blue%20Theme.meta.js
// ==/UserScript==

(function() {
    const addScript=()=>{
        document.title = 'Dark Theme';
        var style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://dark-blue.plund1991.repl.co/style.css';
        document.head.appendChild(style);
    }
    if(document.body){
        addScript();
    }else{
        document.addEventListener('DOMContentLoaded', function(e){
            addScript();
        })
    }
})();