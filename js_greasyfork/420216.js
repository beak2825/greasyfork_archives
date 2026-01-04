// ==UserScript==
// @name         Oib.io: Rewritten ONLY USE IF U HAVE RING
// @namespace    http://tampermonkey.net/
// @version      69.420
// @description  kmccord1's latest in oib technology!!!
// @author       kmccord1.
// @match        http://oib.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420216/Oibio%3A%20Rewritten%20ONLY%20USE%20IF%20U%20HAVE%20RING.user.js
// @updateURL https://update.greasyfork.org/scripts/420216/Oibio%3A%20Rewritten%20ONLY%20USE%20IF%20U%20HAVE%20RING.meta.js
// ==/UserScript==
// Feel free to make improvments or add your own features to the script. Thats why nothing is obfuscated! :)
(function() {
    // Config - Edit below here
    // Note: all keys MUST be put in the config in lowercase or else it wont work!
    window.config = {
        MAX_QUEUE_SIZE: 1, // How many actions the queue can hold before it stops accepting new ones. An action is processed every 160 ms. (Only affects manual inputs)
        HEALTH_ALERT_THRESHOLD: 50, // If your health drops below this percentage your oibs and queen will turn orange.
        AUTO_HEAL_THRESHOLD: 99, // If your health drops below this percentage you will activate healing if you have healing set to automatic.
        OIB_SIZE_ANIMATION: 0.2, // How many seconds your oibs take to shrink and grow.
        NUKE_LEVEL: 5, // The default level of oibs the nuke maker will make.
        keys: {
            SHOW_LEVELS: "n", // The key used to show all oib levels.
            REAL_SIZE: "u", // Shows the true sizes of oibs beyond level 36 (Not 100% Accurate)
            AUTOSPLIT: "c", // Splits and moves your oibs as fast as possible.
            HEAL_MODE: "m", // Switch between automatic and manual healing.
            HEAL: "f", // Used to activate manual healing. (Not a toggle)
            NUKE: "x", // Key used for making nukes. (Groups of certain level oibs. Has heal nuke built-in)
            NUKE_UP: "]", // Increase nuke level
            NUKE_DOWN: "[" // Decrease nuke level
        }
    };

    // Remember: when copying this please remember to SCROLL DOWN! there is more code than this!!!
    // To copy all of it you can use:     Ctrl + A     this selects everything




























    // DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOURE DOING!
    window.config.version = 3;
    window.stop();
    window.document.documentElement.innerHTML = `
<!DOCTYPE html>
<html>
<head>
<title>Oib.io</title>
<link rel="stylesheet" type="text/css" href="css/game_style.css">
<link rel="shortcut icon" type="image/x-icon" href="img/favicon.ico" />
</head>
<body id="game_body">
<canvas id="game_canvas"></canvas>
<script src="js/client.min.js"></script>
<div id="follow_us">
<div id="fb-root"></div>
<div id='MFN_oib-io_300x250'>
</div>
</body>
</html>
`;
    if (window.location.href == "https://oib.io/") { location.href = "http://oib.io"; };
    var scriptList = ["https://dl.dropboxusercontent.com/s/eddw8rjarz7d0jn/oibclient.js"];
    var loadingScript = 0;
    var insertion = setInterval(function(){
        if (loadingScript == 0) {
            loadingScript = 1;
            var script = document.createElement('script');
            script.onload = function() {
                loadingScript = 0;
            }
            script.src = scriptList.splice(0, 1);
            document.body.appendChild(script);
        }
        if (scriptList.length < 1) {
            clearInterval(insertion);
        }
    }, 10);
})();