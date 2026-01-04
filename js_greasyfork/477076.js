// ==UserScript==
// @name         echo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a echo
// @author       housebuilder13
// @match        https://heav.io
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477076/echo.user.js
// @updateURL https://update.greasyfork.org/scripts/477076/echo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
let echoList = [];

const admin = [
    'iNeonz'
]

function send(txt){
    if (WSS){
        WSS.send(`42[1,[28,"${txt}"]]`)
    }
}

function ask(question){
    let response = fetch('https://monke-bot.damcorruption.repl.co/chatbot/'+encodeURIComponent(question.replaceAll('monke','')))
    return response.then(r => r.json());
}