// ==UserScript==
// @name         Mini Map with Ghost Cells for Agar.io
// @version      1.0
// @description  Types console commands when the web page loads
// @match        https://agar.io/*
// @grant        unsafeWindow
// @author       New Jack 🕹️
// @icon         https://i.imgur.com/WehPi6T.png
// @license      MIT
// @namespace https://greasyfork.org/users/1049139
// @downloadURL https://update.greasyfork.org/scripts/462726/Mini%20Map%20with%20Ghost%20Cells%20for%20Agario.user.js
// @updateURL https://update.greasyfork.org/scripts/462726/Mini%20Map%20with%20Ghost%20Cells%20for%20Agario.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the console commands to type
    var commands = [
        'core.setMinimap(1)',
        'event.keyCode === 13',
        'core.playersMinimap(1)',
        'event.keyCode === 13'
    ];

    // Type each command in the console
    commands.forEach(function(command) {
        unsafeWindow.console.log(command);
        unsafeWindow.eval(command);
    });
})();