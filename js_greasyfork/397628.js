// ==UserScript==
// @name         Wanikani Review Forecast 24H Format
// @namespace    AksUWK24HF
// @version      0.61
// @description  24H format for WaniKani review forecast
// @author       AksU
// @match        https://www.wanikani.com/
// @match        https://www.wanikani.com/dashboard
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397628/Wanikani%20Review%20Forecast%2024H%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/397628/Wanikani%20Review%20Forecast%2024H%20Format.meta.js
// ==/UserScript==


// Little handling, we retry a few times as it can execute the code a bit too fast
function translateTo24HStyle(timeOutInterval) {
    var cpt = 0
    const maxTimeout = 20
    const timeout = setTimeout(() => {
        if (document && document.getElementsByClassName("review-forecast-widget__title").length) {
            for (let timer of document.getElementsByClassName("review-forecast-widget__title")) {
                if (timer.innerHTML.indexOf("AM") > 0) {
                    timer.innerHTML = timer.innerHTML.substring(0, timer.innerHTML.length - 3);
                    if (parseInt(timer.innerHTML, 10) < 10) {
                        timer.innerHTML = "0" + timer.innerHTML;
                    } else if (parseInt(timer.innerHTML, 10) === 12) {
                        timer.innerHTML = "00";
                    }
                    timer.innerHTML += "h";
                } else if (timer.innerHTML.indexOf("PM") > 0) {
                    timer.innerHTML = timer.innerHTML.substring(0, timer.innerHTML.length - 3);
                    var toAdd = 12;
                    if (parseInt(timer.innerHTML, 10) === 12) {
                        toAdd = 0;
                    }
                    timer.innerHTML = parseInt(timer.innerHTML, 10) + toAdd;
                    timer.innerHTML += "h";
                }
            }
            clearTimeout(timeout)
        } else {
            cpt++
            if (cpt >= maxTimeout) {
                clearTimeout(timeout)
            }
        }
    }, timeOutInterval)
}

// Check that the widget frame has been reloaded
document.addEventListener("turbo:before-fetch-response", (e) => {
    // We don't care if it is not a review forecast
    const turboFrameUrl = e.detail.fetchResponse.response.url
    if (!turboFrameUrl.includes("review-forecast")) {
        return
    }

    // Get the matching frame and check if it is complete
    const frame = document.getElementById(e.target.id);
    if (frame && frame.complete) {
        translateTo24HStyle(200)
    }
});

// It may happens that the script is executed a bit after the frame is loaded
// This is only trigerred at start and should fix the 24H Style on the first render.
window.onload = () => {
    translateTo24HStyle(500)
}