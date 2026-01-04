// ==UserScript==
// @name         Trello Hour Counter
// @namespace    https://github.com/Tombez
// @version      0.2
// @description  Displays Hour Count On Trello
// @author       Tom Burris
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422489/Trello%20Hour%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/422489/Trello%20Hour%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const convert12To24 = time => {
        const [match, hours, minutes, apm] = time.match(/(\d\d?):(\d\d)(am|pm)?/);
        if (apm === undefined) return time;
        return (+hours + ((apm == "pm") ^ (+hours == 12)) * 12) % 24 + ":" + minutes;
    }

    const countHours = (input) => {
        let times = [];
        const regex = /((?:start|paus|resum|finish|end)ed):?\s*((\d{1,2}):(\d\d))(am|pm)?/ig;
        let totalHours = 0;
        let totalMinutes = 0;
        input.slice().replace(regex, (match, label, time, hour, minute, apm) => {
            let type = null;
            label = label.toLowerCase();
            if (label == "started" || label == "resumed") type = "start";
            if (label == "paused" || label == "finished" || label == "ended") type = "end";
            if (!type) throw `Unknown label: ${label}`;
            const add12 = ((apm == "pm") ^ (+hour == 12)) && apm != undefined;
            times.push({
                type,
                hour: +hour + add12 * 12,
                minute: +minute
            });
        });
        while (times.length >= 2) {
            let start = times.shift();
            if (start.type != "start") throw "Invalid times.";
            let end = times.shift();
            if (end.type != "end") throw "Invalid times.";
            if (end.hour < start.hour) end.hour += 24;
            if (end.minute >= start.minute) {
                totalHours += end.hour - start.hour;
                totalMinutes += end.minute - start.minute;
            } else {
                totalHours += (end.hour - start.hour) - 1;
                totalMinutes += end.minute + 60 - start.minute;
            }
        }
        if (times.length > 0) throw `Uneven number of times.`;
        totalHours += totalMinutes / 60 | 0;
        totalMinutes %= 60;
        return `${totalHours}h${totalMinutes}m`;
    };

    const update = () => {
        const cards = Array.from(document.getElementsByClassName("current-comment"));
        for (const card of cards) {
            if (card._countedHours) continue;
            card._countedHours = true;
            try {
                const regex = /((?:start|paus|resum|finish|end)ed)?:?\s*((\d{1,2}):(\d\d)(am|pm)?)/ig;
                let matches = card.innerText.match(regex);
                if (!matches) continue;
                let total = countHours(matches.join("\n"));
                let elm = document.createElement("div");
                elm.style.background = "lightblue";
                elm.style.width = "max-content";
                elm.style.height = "20px";
                elm.style.borderRadius = "5px";
                elm.style.color = "#fff";
                elm.style.textShadow = "0px 0px 5px #000";
                elm.style.fontWeight = "bold";
                elm.style.padding = "0px 5px";
                elm.innerHTML = total;
                card.appendChild(elm);
            } catch(e) {
                let err = document.createElement("div");
                err.style.background = "#f00";
                err.style.width = "max-content";
                err.style.height = "20px";
                err.style.borderRadius = "5px";
                err.title = "err: " + e;
                err.style.color = "#fff";
                err.style.textShadow = "0px 0px 5px #000";
                err.style.fontWeight = "bold";
                err.style.padding = "0px 5px";
                err.innerHTML = "hover";
                card.appendChild(err);
            }
        }
    };
    setInterval(update, 5000);
})();