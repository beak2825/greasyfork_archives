// ==UserScript==
// @name         Add a stopwatch to liouh picross
// @namespace    guebosch
// @version      2025-10-28
// @description  Stopwatch to find out how quick you are.
// @author       guebosch
// @match        https://liouh.com/picross/
// @match        https://liouh.com/picross2/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=liouh.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489964/Add%20a%20stopwatch%20to%20liouh%20picross.user.js
// @updateURL https://update.greasyfork.org/scripts/489964/Add%20a%20stopwatch%20to%20liouh%20picross.meta.js
// ==/UserScript==
var gblButtonClickTime;
$("body").prepend(`
    <div id="tmStopWatchBlck">
        <button id="tmStopWatchBttn">Start</button>
        <span id="tmTimeStat"> </span>
    </div>
`);
$("#tmStopWatchBttn").click(zEvent => {
    var statusNode = $("#tmTimeStat");
    var tmrButton = $(zEvent.target);
    //--- Button text is either "Start" or "Stop".
    if (tmrButton.text() === "Start") {
        // Start the timer
        tmrButton.text("Stop");
        statusNode.css("background", "lightyellow");
        gblButtonClickTime = performance.now();
        console.log("Timer started at:", gblButtonClickTime.toFixed(0), new Date());
    } else {
        // Stop the timer
        tmrButton.text("Start");
        statusNode.css("background", "lightgreen");
        var stopTime = performance.now();
        var elapsedtime = stopTime - gblButtonClickTime; // Milliseconds

        // Convert to minutes and seconds (whole seconds only)
        var totalSeconds = Math.floor(elapsedtime / 1000);
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;

        // Format as MM:SS
        var purtyElpsdTime = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        console.log("Timer stopped at:", stopTime.toFixed(0), new Date(), "Elapsed:", purtyElpsdTime);
        statusNode.text(purtyElpsdTime);
    }
});
GM_addStyle(`
    #tmStopWatchBttn {
        font-size: 1.2em;
        padding: 0.5ex 1em;
        width: 5em;
    }
    #tmTimeStat {
        margin-left: 1em;
        padding: 0.2ex 2ex;
        border: 1px solid lightgray;
        border-radius: 0.5ex;
    }
`);