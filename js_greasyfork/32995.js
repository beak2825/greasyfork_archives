// ==UserScript==
// @name        Gamdom Rain Checker
// @namespace   https://twitter.com/DasTr0nYx
// @match       https://gamdom.com/*
// @include     https://gamdom.com/*
// @version     0.0.1
// @description rainchecker for gamdom.com
// @downloadURL https://update.greasyfork.org/scripts/32995/Gamdom%20Rain%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/32995/Gamdom%20Rain%20Checker.meta.js
// ==/UserScript==
/*
    This Script sends you a Desktop Notification if Rain is coming. Not working 100%, therefor version 0.0.1
    100% legit and 100% no scam
*/
var MutationObserver = window.MutationObserver;
var myObserver       = new MutationObserver (mutationHandler);
var obsConfig        = {
    childList: true, attributes: true,
    subtree: true,   attributeFilter: ['class']
};
Notification.requestPermission();
function addObserverIfDesiredNodeAvailable() {
    var chatBox = document.getElementById("chat");
    if(!chatBox) {
        window.setTimeout(addObserverIfDesiredNodeAvailable,500);
        return;
    }
    myObserver.observe(chatBox,obsConfig);
}

addObserverIfDesiredNodeAvailable();

function mutationHandler (mutationRecords) {
    mutationRecords.forEach ( function (mutation) {
        if (    mutation.type               == "childList"
            &&  typeof mutation.addedNodes  == "object"
            &&  mutation.addedNodes.length
        ) {
            for (var J = 0, L = mutation.addedNodes.length;  J < L;  ++J) {
                checkForCSS_Class (mutation.addedNodes[J], "rain-message");
            }
        }
        else if (mutation.type == "attributes") {
            checkForCSS_Class (mutation.target, "rain-message");
        }
    } );
}

function checkForCSS_Class (node, className) {
    if (node.nodeType === 1) {
        if (node.classList.contains (className) ) {
            var details = {
                body: "rain incoming! Hurry up",
                icon: 'https://github.com/malachi26/ReviewQueueNotifier/raw/master/Resources/Icon2.jpg'
            };
            var n = new Notification("new Rain", details );
            setTimeout(n.close.bind(n), 10000);
        }
    }
}