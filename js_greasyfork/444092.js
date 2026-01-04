// ==UserScript==
// @name         Zisson Wave Extension
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Improve the desktop experience of Zisson Wave
// @author       Kristian Gregersen
// @match        *zissoninteract.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ikomm.no
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444092/Zisson%20Wave%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/444092/Zisson%20Wave%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("ZWE - Initializing Zisson Wave Extension userscript...");
    const sound = new Audio ("data:audio/mp3;base64,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/XQ0F5IZ02SDoNlsXoeUtnOLbFEXPeZyydac5R4ySMgFRpZijAjMEkby8yvS9fsyJVr8bzaHFxIkF0O9NftowAAG2uAwICBf/96y9dX//f////tv7e/+/9W/b9vovRv//r/+1nnrkVMjMzVFIgmgHTwRdQIlAAyUDA5pbQ+V2HSjkOppxxr7OYFZdMwI9A0xjAbYgFQApwAAiFgGTFHBs6HHAs4sYN3CGhlg4GKSBhfQhAwCRMcZoXCkLmUQw2JlEvmlNNkqDmK5eeyLMkhNWWmbIoLdkGRQW7XuzKX+hbbdKr2UdmzXPrUgaVCgAAUC0UAADf//p//Tr////Sn////97//p/2////////uSZEwAA8VDVcViQAIyTXidoIgAW60vPvm9gABsgCODACAA///pbb89r0MikIjvGBqdRZ1ETgQAAAAAAAADhnMGRtyGYweHciRtAUcKNGGGgsPrDm7rAjBAgGLsJPmMhgqFFwVUzGQAyVyMGBDeZAGGJhxAb2jiVQZ8VmDQJEvGpRYFPTERBQUyUOL1DSuCQoaMDHhMlDkdDBwctGXoL5EIit1nLdV2gIcCCYcB1TszTtTe0+DjVmuSFsinTCVUGGs+aekMvGM3PjsPOSzGGX/k8itdaQuloUGu9ZjcFVuxavjjrs1jqzOSiP3pTupUqy6bpN3Zmr//VjjWZuig/v///8thqJz3////0s1dd/pU3/u6f////////+v2f//+XMfA6H/F1pN//hYSf/jzygAAYAAAImCEhz0feHViByqpZUsyg6zqBqru2XRcFL1IlLD5DUjhVONqVDYZyqGAhyqLqBdAIRxJEekhJ0sr1Wq2NBTqGoay0Yk891bf9rWrr+2/mvrX4tv1/9t+sF7aJQVBUGgaiUFn/lg5wad8SgqCo//7kmQ5D/OLLctnYeAAMMAYjeAIAIAAAaQAAAAgAAA0gAAABOt21ttt0CYKwoDQlBUFQVOlQViXxYGj3EQNA0e1A19YK1/EQNf/lf//5Y9wa//+CtVMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=");
    const defaultNotificationFrequency = 60; // in seconds (default = 60)
    const maximumNotificationFrequency = 20; // in seconds (default = 20)
    const notificationFrequencyIncrease = 5; // in seconds (default = 5)
    const scriptUsersName = "Helena";
    const trackedStatuses = {
        "Lunsj": 30, // in minutes
        "Pause": 20
    };

    let notificationFrequency = defaultNotificationFrequency;

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    var trackedStatusChecker = function() {
        //console.log("ZWE - Tick");
        let agentContainer = getElementByXpath('/html/body/wave-app/wave-core/wave-main/wave-sidebar-container/div[2]/div/wave-home/section[2]/wave-tabs/div[2]/div/wave-agent-monitor/wave-sidebar-container/div[2]/div/wave-table/div/wave-virtual-scroll/div[2]/table/tbody');
        if (agentContainer != null) {
            agentContainer.childNodes.forEach(function(row){
                let queueStatusElement = null;
                let correctUserFound = false;
                row.childNodes.forEach(function(column){
                    if (column != "[object Comment]") {
                        if (column.classList.contains('firstName')) {
                            if (column.firstChild.innerHTML.trim().startsWith(scriptUsersName)) {
                                correctUserFound = true;
                            }
                        }
                        else if (column.classList.contains('queueStatus')) {
                            queueStatusElement = column;
                        }
                    }
                });
                if (correctUserFound) {
                    //console.log("ZWE - Correct user found");
                    let minutesOnStatus = 0;
                    let trackedStatusFound = null;
                    queueStatusElement.firstChild.firstChild.childNodes.forEach(function(element){
                        if (element != "[object Comment]") {
                            if (element.classList.contains('queue-status')) {
                                element.childNodes.forEach(function(status){
                                    if (status != "[object Comment]") {
                                        if (status.nodeName == "WAVE-TIMESPAN") {
                                            let hms = String(status.innerHTML).split(':');
                                            if (hms.length == 3) {
                                                minutesOnStatus += parseInt(hms[0]) * 60;
                                                minutesOnStatus += parseInt(hms[1]);
                                            }
                                            else if (hms.length == 2) {
                                                minutesOnStatus += parseInt(hms[0]);
                                            }
                                            else
                                            {
                                                console.log("ZWE - Invalid time format for queue status");
                                            }
                                        }
                                        else if (status.nodeName == "SPAN") {
                                            for (const [statusToTrack, statusDurationTreshold] of Object.entries(trackedStatuses)) {
                                                if (status.innerHTML.includes(statusToTrack)) {
                                                    trackedStatusFound = statusToTrack;
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                    if (trackedStatusFound != null) {
                        //console.log("ZWE - Tracked status found");
                        //console.log("ZWE - Time on tracked status: " + minutesOnStatus + " minutes");
                        if (minutesOnStatus >= trackedStatuses[trackedStatusFound]) {
                            sound.play();
                            notificationFrequency -= notificationFrequencyIncrease;
                            if (notificationFrequency < maximumNotificationFrequency) {
                                notificationFrequency = maximumNotificationFrequency;
                            }
                        }
                    }
                    else
                    {
                        notificationFrequency = defaultNotificationFrequency;
                    }
                }
            });
        }
        setTimeout(trackedStatusChecker, notificationFrequency * 1000);
    }
    setTimeout(trackedStatusChecker, notificationFrequency * 1000);
})();