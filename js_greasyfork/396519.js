// ==UserScript==
// @name         Kahoot Keyboard Bind Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Binds the Kahoot! answer buttons
// @author       Mosomedve
// @match        https://kahoot.it/*
// @downloadURL https://update.greasyfork.org/scripts/396519/Kahoot%20Keyboard%20Bind%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/396519/Kahoot%20Keyboard%20Bind%20Script.meta.js
// ==/UserScript==

(function (){
    function setup()
    {

    }

    function findAnswers(parent, tag)
    {
        parent = document.getElementById(parent);
        var descendants = parent.getElementsByTagName(tag);
        return descendants;
    }

    function KeyPressed(event)
    {
        const keyval = 49;
        var x = event.charCode - keyval;
        var Btns = findAnswers("root","button");
        Btns[x%Btns.length].click();
    }
    window.onload = setup();
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.addEventListener("keypress", function(){ KeyPressed(event)});
    document.body.appendChild(input);
    setTimeout(() => {input.focus();}, 100);

})();