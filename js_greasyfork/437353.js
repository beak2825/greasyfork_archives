// ==UserScript==
// @name     VTPortal total time calculator
// @description Make VTPortal calculate the total worked time. Written by @alopez
// @copyright 2023, Aritz
// @license MIT
// @version  5
// @author Aritz Lopez
// @collaborator Marcos Ruiz
// @grant    none
// @match https://sign3910.visualtime.net/*
// @match https://vtportal.visualtime.net/*
// @namespace https://greasyfork.org/users/855840
// @downloadURL https://update.greasyfork.org/scripts/437353/VTPortal%20total%20time%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/437353/VTPortal%20total%20time%20calculator.meta.js
// ==/UserScript==

/* jshint esversion: 10 */

function update_total_time() {
    if (!document.querySelector("div#punchesList")) return;
    if (window.eval('i18nextko.i18n.lng();') !== last_language_code) {
        update_language_data().then(() => {
            update_total_time();
        });
        return;
    }

    let totalElement = document.querySelector("span#totalTimeElement");
    if (!totalElement) {
        totalElement = document.createElement("span");
        totalElement.id = "totalTimeElement"
        totalElement.style.fontSize = "1.5rem";

        if (document.querySelector('div[data-options*="punchesHome"]').nextElementSibling) {
          totalElement.style.marginLeft = '20%';
          totalElement.style.top = '1rem';
          totalElement.style.position = 'relative';
          const divider = document.querySelector('div[data-options*="punchesHome"]').nextElementSibling;
          divider.parentNode.insertBefore(totalElement, divider.nextSibling);
        } else if (document.querySelector("div#punchesList")) {
            document.querySelector("div#punchesList").appendChild(totalElement);
        }
    }

    let remainingTimeElement = document.querySelector("span#remainingTime");
    if (!remainingTimeElement)
    {
        remainingTimeElement = document.createElement("span");
        remainingTimeElement.id = "remainingTime"
        remainingTimeElement.style.fontSize = "1.5rem";
        remainingTimeElement.style.top = totalElement.style.top;
        remainingTimeElement.style.position = 'relative';
        totalElement.parentNode.insertBefore(remainingTimeElement, totalElement.nextSibling);
    }

    const punches = Array.prototype.map.call(
        document.querySelectorAll('div#punchesList div[data-bind="text: $data.Name"]'),
        function (d) { return d.innerHTML }
    )

    let totalTime = 0;
    let lastEntry = 0;

    for (let punch of punches) {
        const punchParts = punch.split(":");
        const time = parseInt(punchParts[1].trim()) * 60 + parseInt(punchParts[2]);

        if (all_enter_options.includes(punchParts[0])) {
            if (lastEntry != 0) {
                totalElement.innerHTML = "Error: Two consecutive entries";
                return
            } else {
                lastEntry = time;
            }
        } else {
            if (lastEntry > time) { // Previous entry was the day before
                totalTime += 24 * 60 - lastEntry + time;
            } else {
                // If there was no last entry, assume it was the day before, and so calculate since midnight, by subtracting 0 in lastEntry
                totalTime += (time - lastEntry);
            }
            lastEntry = 0;
        }
    }

    // If last entry was not exited, calculate until now
    if (lastEntry != 0) {
        const current = new Date();
        const exitTime = current.getHours() * 60 + current.getMinutes();
        totalTime += (exitTime - lastEntry);
    }

    let remainingTime = totalTime - theoretical_minutes;

    const remaining_hours_str = Math.floor(Math.abs(remainingTime) / 60).toString().padStart(2, "0");
    const remaining_minutes_str = (Math.abs(remainingTime) % 60).toString().padStart(2, "0");

    if (remainingTime < 0) {
        remainingTimeElement.style.color = "red";
        remainingTimeElement.innerHTML = `${remaining_message}: -${remaining_hours_str}:${remaining_minutes_str} (${remainingTime} min.)`
    } else {
        remainingTimeElement.style.color = "green";
        remainingTimeElement.innerHTML = `${remaining_message}: ${remaining_hours_str}:${remaining_minutes_str} 🍺  (${remainingTime} min.)`
    }

    const hours_str = Math.floor(totalTime / 60).toString().padStart(2, "0");
    const minutes_str = (totalTime % 60).toString().padStart(2, "0");

    totalElement.innerHTML = `${total_message}: ${hours_str}:${minutes_str} - `;
}

let all_enter_options = [];
let total_message = "Total";
let remaining_message = "Saldo";
let last_language_code = "en";
let theoretical_minutes = 8.5 * 60;

async function update_language_data() {
    const language_code = window.eval('i18nextko.i18n.lng();')
    last_language_code = language_code;
    const punch_lang_response = await fetch(`https://vtportal.visualtime.net/2/js/localization/vtportal.i18n.${language_code}.json`);
    const punch_lang_data = await punch_lang_response.json();

    const generic_lang_response = await fetch(`https://vtportal.visualtime.net/2/js/localization/dx.all.${language_code}.json`);
    const generic_lang_data = await generic_lang_response.json();

    all_enter_options = [
        punch_lang_data.roPunches_TA_in,
        punch_lang_data.roPunches_TA_in_cause,
        punch_lang_data.roPunches_TA_in_causeHome,
        punch_lang_data.roEntry
    ];

    total_message = generic_lang_data[language_code]["dxPivotGrid-total"];
    parts = total_message.split(' ');
    total_message = parts[parts.length - 1];
    total_message = total_message.charAt(0).toUpperCase() + total_message.slice(1);

    remaining_message = punch_lang_data.roAccrualLbl;
}

const get_current_day_info_promise = () => {
  return window.eval('new Promise((resolve, reject) => {new WebServiceRobotics(function (t) {resolve(t);}).getEmployeeDayInfo(undefined, - 1);})')
};

async function get_theoretical_hours() {
    const day_info = await get_current_day_info_promise();
    // The request name says "Hours" but is in fact minutes :(
    theoretical_minutes = day_info.DayInfo.DayData[0].MainShift.PlannedHours;
}

function prepare() {
    Promise.all([
        update_language_data(),
        get_theoretical_hours(),
    ]).then(() => {
        update_total_time();
        setInterval(update_total_time, 5000);
    });
}

// Wait for the #punchesList element to be present, at that point, it is ready to calculate
const observer = new MutationObserver(function(mutations_list) {
	mutations_list.forEach(function(mutation) {
		mutation.addedNodes.forEach(function(added_node) {
			if(added_node.id == 'punchesList') {
                observer.disconnect();
                setTimeout(prepare, 100);
			}
		});
	});
});
observer.observe(document.documentElement, { subtree: true, childList: true });

var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.getElementsByTagName('head')[0].appendChild(link);
}
link.href = 'data:image/png;base64,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';