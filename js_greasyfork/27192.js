// ==UserScript==
// @name         Autobuy karnage, stop spinner test
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  enter
// @author       meatman2tasty
// @match        http://karnage.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27192/Autobuy%20karnage%2C%20stop%20spinner%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/27192/Autobuy%20karnage%2C%20stop%20spinner%20test.meta.js
// ==/UserScript==

function onPress_ENTER()
{
        var keyPressed = event.keyCode || event.which;

        //if ENTER is pressed
        if(keyPressed==13)
        {
            crateSpinner.spinVelocity = 0;
            keyPressed=null;
        }
        else
        {
            return false;
        }
}