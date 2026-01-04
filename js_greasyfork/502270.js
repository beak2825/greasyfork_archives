// ==UserScript==
// @name        Frames Shmames For Cookie Clicker
// @namespace   https://cbass92.org
// @license MIT
// @match       *://orteil.dashnet.org/*
// @grant       none
// @version     1.0
// @author      Cbass92
// @description Allows the user to view the hit idle game cookie clicker in an iframe with no problems.
// @downloadURL https://update.greasyfork.org/scripts/502270/Frames%20Shmames%20For%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/502270/Frames%20Shmames%20For%20Cookie%20Clicker.meta.js
// ==/UserScript==

setTimeout(doSomething, 500);

function doSomething() {
    if (document.getElementById("offGameMessage").innerHTML == '<div class="title">Oops. Wrong address!</div>' +
            '<div>It looks like you\'re accessing Cookie Clicker from another URL than the official one.<br>' +
            'You can <a href="//orteil.dashnet.org/cookieclicker/" target="_blank">play Cookie Clicker over here</a>!<br>' +
            '<small>(If for any reason, you are unable to access the game on the official URL, we are currently working on a second domain.)</small></div>'
        ) {
            Game.Load(function () {
                Game.Init();
                if (firstLaunch) Game.showLangSelection(true);
            });
        } else {
          setTimeout (doSomething, 500)
        }
    }
