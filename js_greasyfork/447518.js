// ==UserScript==
// @name         Options for arithmetic.zetamac.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set options for the game arithmetic.zetamac.com
// @author       Anakojm
// @match        http*://arithmetic.zetamac.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zetamac.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/447518/Options%20for%20arithmeticzetamaccom.user.js
// @updateURL https://update.greasyfork.org/scripts/447518/Options%20for%20arithmeticzetamaccom.meta.js
// ==/UserScript==

(function() {
    'use strict';
//--------------------------------------------------------------------
// These are the defaults, modify them to your liking
    let addition=true
    let additionLeftMin=2
    let additionLeftMax=100
    let additionRightMin=2
    let additionRightMax=100
    let substraction=true
    let multiplication=true
    let multiplicationLeftMin=2
    let multiplicationLeftMax=12
    let multiplicationRightMin=2
    let multiplicationRightMax=100
    let division=true
    let time=120
//--------------------------------------------------------------------

    document.getElementsByName("add").item(0).checked=addition;
    document.getElementById("add_left_min").value=additionLeftMin;
    document.getElementById("add_left_max").value=additionLeftMax;
    document.getElementById("add_right_min").value=additionRightMin;
    document.getElementById("add_right_max").value=additionRightMax;

    document.getElementsByName("sub").item(0).checked=substraction;

    document.getElementsByName("mul").item(0).checked=multiplication;
    document.getElementById("mul_left_min").value=multiplicationLeftMin;
    document.getElementById("mul_left_max").value=multiplicationLeftMax;
    document.getElementById("mul_right_min").value=multiplicationRightMin;
    document.getElementById("mul_right_max").value=multiplicationRightMax;

    document.getElementsByName("div").item(0).checked=division;
    // Compatibility with https://greasyfork.org/en/scripts/447512-custom-time-for-arithmetic-zetamac-com
    if (document.querySelector("div#welcome form.game-options p input")){
    document.getElementsByName("duration").item(0).value=time;
    } else{
    document.getElementsByTagName("option").item(0).remove();
    document.getElementsByTagName("option").item(0).remove();
    document.getElementsByTagName("option").item(1).remove();
    document.getElementsByTagName("option").item(1).remove();
    document.getElementsByTagName("option").item(0).value=time;
    document.getElementsByTagName("option").item(0).text=time+" seconds";
    }
})();