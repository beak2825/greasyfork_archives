// ==UserScript==
// @name        eurovisionworld.com times to local time
// @namespace   jvbf Userscripts
// @match       https://eurovisionworld.com/*
// @grant       none
// @version     1.0
// @author      jvbf
// @description 3/2/2024, 10:37:36 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/488811/eurovisionworldcom%20times%20to%20local%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/488811/eurovisionworldcom%20times%20to%20local%20time.meta.js
// ==/UserScript==

function convertTime(hour, minute) {
    return new Date(
        Date.UTC(new Date().getFullYear(), null, null, hour, minute)
    ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}

function convertAllTimes() {
    var times = Array.from(document.querySelectorAll("*")).filter((el) => {
        var content = Array.from(el.childNodes)
            .filter((e) => e.nodeType === Node.TEXT_NODE)
            .map((e) => e.textContent)
            .join("");
        var match = content.match(/^\d\d:\d\d$/);
        if (match) {
            return true;
        }
        return false;
    });

    times.forEach((node) => {
        var time = node.textContent;
        var [hour, minute] = time.split(":");
        hour = (hour - 1 + 24) % 24;
        var newTime = convertTime(hour, minute);
        node.textContent = newTime;
    });
}

var button = document.createElement("button");
button.textContent = "Convert Times";
button.style.padding = "5px";
button.addEventListener("click", function () {
    convertAllTimes();
    button.remove();
});

var targetDiv = document.querySelector("nav.nav_scroll");
targetDiv.appendChild(button);
