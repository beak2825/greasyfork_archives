// ==UserScript==
// @name         Fishing bot SBB
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A fastly dev fishing bot
// @author       FalconX
// @match        https://www.superblablaland.com/tchat
// @icon         https://www.google.com/s2/favicons?sz=64&domain=superblablaland.com
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @run-at        document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467887/Fishing%20bot%20SBB.user.js
// @updateURL https://update.greasyfork.org/scripts/467887/Fishing%20bot%20SBB.meta.js
// ==/UserScript==

// SOURCE : https://gist.github.com/raw/2625891/waitForKeyElements.js
function waitForKeyElements(
    selectorTxt,
    actionFunction,
    bWaitOnce,
    iframeSelector
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") {
        targetNodes = $(selectorTxt);
    } else {
        targetNodes = $(iframeSelector).contents().find(selectorTxt);
    }

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;

        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data("alreadyFound") || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound) btargetsFound = false;
                else jThis.data("alreadyFound", true);
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey];
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(
                    selectorTxt,
                    actionFunction,
                    bWaitOnce,
                    iframeSelector
                );
            }, 300);
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

const logger = console.log.bind(console);

logger("[Fishing script]", "Loaded, wait for action button...");

function browseServerMessages(callback) {
    const moderatorsMsgsElements = document.querySelectorAll(
        ".map-message.role-modo"
    );

    if (moderatorsMsgsElements.length === 0) {
        callback();
    }

    for (let i = 0; i < moderatorsMsgsElements.length; i++) {
        const moderatorsMsgsElement = moderatorsMsgsElements[i];
        const authorElement = moderatorsMsgsElement.querySelector(".author");

        if (authorElement && /serveu?r/i.test(authorElement.innerText)) {
            const moderatorsMsg = moderatorsMsgsElement.innerText;
            callback(moderatorsMsgsElement, moderatorsMsg);
        }
    }
}

function checkForQuota() {
    return new Promise((resolve) => {
        let quotaCheckerID;

        const quotaChecker = () => {
            let result = {
                quota: false,
            };

            browseServerMessages((element, msg) => {
                if (
                    msg &&
                    /quota/i.test(msg) &&
                    /p[eêè]che/i.test(msg) &&
                    /revenez|revient/i.test(msg)
                ) {
                    const quota = msg.match(
                        /(\d+)\s*h(?:eures?)?\s*(\d+)[^\d]+(\d+)/i
                    );
                    result.quota = true;
                    result.time = {
                        hours: parseInt(quota[1]),
                        minutes: parseInt(quota[2]),
                        seconds: parseInt(quota[3]),
                    };

                    element.remove();

                    resolve(result);

                    return result;
                }
            });

            requestAnimationFrame(quotaChecker);
        };

        requestAnimationFrame(quotaChecker);
    });
}

waitForKeyElements(`.tchat-actions button img[src*="canne"]`, (element) => {
    const button = element[0].parentNode;
    const disabledStyle =
        "background-color: #9b9b9b; color: #FFFFFF; opacity: 0.4; cursor: default;";
    const enabledStyle = "";
    const tchatActions = document.querySelector(".tchat-actions");
    const stopButton = document.createElement("button");
    const startButton = document.createElement("button");

    startButton.innerHTML = "<p>Start Bot</p>";
    stopButton.innerHTML = "<p>Stop Bot</p>";

    stopButton.setAttribute("style", disabledStyle);

    tchatActions.appendChild(startButton);
    tchatActions.appendChild(stopButton);

    logger("[Fishing script]", "Action button found !");

    let fishingMechanicID;
    let fishingWaitID;
    let quotaID;
    let checkVisibility = false;
    let quotaReached = false;
    let started = false;

    const fishingMechanic = () => {
        logger("[Fishing script]", "Launch fishing mechanics. . .");

        clearTimeout(fishingWaitID);

        const fishing = () => {
            if (quotaReached || !started) {
                return;
            }

            if (document.visibilityState === "hidden" && !checkVisibility) {
                document.addEventListener("visibilitychange", fishing);
                checkVisibility = true;
                return;
            } else {
                document.removeEventListener("visibilitychange", fishing);
                checkVisibility = false;
            }

            logger("[Fishing script]", "Fishing !", button);

            button.click();

            browseServerMessages((element, msg) => {
                if (msg && /attend/i.test(msg) && /p[eêè]che/i.test(msg)) {
                    element.remove();
                }
            });

            fishingMechanicID = requestAnimationFrame(fishingMechanic);
        };

        logger("[Fishing script]", "Search reward popup...");

        const rewardPopup = document.querySelector(".reward-popup");

        if (rewardPopup) {
            logger("[Fishing script]", "Found reward popup");

            rewardPopup.click();

            fishingWaitID = setTimeout(fishing, (Math.random() + 1) * 1000);
            return;
        }

        setTimeout(() => {
            if (quotaReached || !started) {
                return;
            }

            new Promise((resolve) => {
                logger("[Fishing script]", "Search waiting time...");

                let found = false;

                browseServerMessages((element, msg) => {
                    if (msg && /attend/i.test(msg) && /p[eêè]che/i.test(msg)) {
                        const waitSearch = msg.match(/(\d+)/i);
                        const waitTime = parseInt(waitSearch[1]);

                        element.remove();
                        found = true;
                        resolve(waitTime);
                    }
                });

                if (!found) {
                    resolve();
                }
            }).then((waitTime) => {
                if (quotaReached || !started) {
                    return;
                }

                if (waitTime) {
                    logger(
                        "[Fishing script]",
                        "Waiting time found : ",
                        waitTime,
                        "seconds"
                    );
                    fishingWaitID = setTimeout(
                        fishing,
                        waitTime * 1000 + Math.random() * 200
                    );
                } else {
                    logger("[Fishing script]", "No waiting time found");
                    fishingWaitID = setTimeout(
                        fishing,
                        (Math.random() + 1) * 1000
                    );
                }
            });
        }, 50);
    };

    const stopBot = () => {
        logger("[Fishing script]", "Stop bot");

        startButton.addEventListener("click", launchBot);
        stopButton.removeEventListener("click", stopBot);

        started = false;

        clearTimeout(fishingWaitID);
        clearTimeout(quotaID);
        cancelAnimationFrame(fishingMechanicID);
        fishingMechanicID = -1;

        startButton.setAttribute("style", enabledStyle);
        stopButton.setAttribute("style", disabledStyle);
    };

    const launchBot = () => {
        logger("[Fishing script]", "Launch bot");

        quotaReached = false;
        started = true;

        fishingMechanic();

        checkForQuota().then((quotaResults) => {
            if (started === false) {
                return;
            }

            const waitingTime =
                quotaResults.time.hours * 3600000 +
                quotaResults.time.minutes * 60000 +
                quotaResults.time.minutes * 1000;

            clearTimeout(fishingWaitID);
            cancelAnimationFrame(fishingMechanicID);
            fishingMechanicID = -1;
            quotaReached = true;

            logger(
                "[Fishing script]",
                "Quota found wait for ",
                waitingTime,
                "ms"
            );

            quotaID = setTimeout(launchBot, waitingTime);
        });

        startButton.removeEventListener("click", launchBot);
        startButton.setAttribute("style", disabledStyle);
        stopButton.setAttribute("style", enabledStyle);

        stopButton.addEventListener("click", stopBot);
    };

    startButton.addEventListener("click", launchBot);
});