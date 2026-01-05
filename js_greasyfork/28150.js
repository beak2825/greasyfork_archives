// ==UserScript==
// @name            WME Chat Mover
// @description     Moves WME chat from the bottom-left to the bottom-right
// @namespace       vaindil
// @version         1.0
// @grant           none
// @include         https://www.waze.com/editor/*
// @include         https://www.waze.com/*/editor/*
// @include         https://beta.waze.com/editor/*
// @include         https://beta.waze.com/*/editor/*
// @exclude         https://www.waze.com/user/*
// @exclude         https://www.waze.com/*/user/*
// @author          vaindil
// @downloadURL https://update.greasyfork.org/scripts/28150/WME%20Chat%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/28150/WME%20Chat%20Mover.meta.js
// ==/UserScript==

function init() {
    try {
        var element = $('#chat-overlay');
        if ($(element).length) {
            element.css('left', 'initial');
            element.css('right', '20px');
        } else {
            setTimeout(init, 1000);
        }
    } catch (err) {
        console.log("WMEGMM - " + err);
        setTimeout(init, 1000);
    }
}

init();