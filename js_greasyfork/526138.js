// ==UserScript==
// @name         armory bonuses
// @namespace    armory-bonuses.zero.nao
// @version      0.4
// @description  shows bonuses in the armory
// @author       nao [2669774]
// @match        https://www.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/526138/armory%20bonuses.user.js
// @updateURL https://update.greasyfork.org/scripts/526138/armory%20bonuses.meta.js
// ==/UserScript==

let api = "";
let url = window.location.href;
let rfc = getRFC();

function getRFC() {
    var rfc = $.cookie("rfc_v");
    if (!rfc) {
        var cookies = document.cookie.split("; ");
        for (var i in cookies) {
            var cookie = cookies[i].split("=");
            if (cookie[0] == "rfc_v") {
                return cookie[1];
            }
        }
    }
    return rfc;
}

const originalAjax = $.ajax;
$.ajax = function (options) {
    console.log("[ARMORYBONAOS] :", options);
    if (options.url.includes("factions.php")) {

        const originalSuccess = options.success;
        options.success = function (response, textStatus, jqXHR) {
            try {
                const jsonResponse = JSON.parse(response);

                console.log("[ARMORYBONAOS] Original Response:", jsonResponse);
                jsonResponse.items.forEach((item) => {
                    let bonusString = [];
                    console.log(item);
                    item.bonuses.forEach((bonus) => {
                        if (bonus.title) {
                            console.log(bonus.title);
                            const bonusTitle =
                                  bonus.title
                            .match(/<b>(.*?)<\/b>/)[0]
                            ?.replace(/<b>|<\/b>/g, "") || "";
                            const bonusValue = bonus.title.match(/[0-9]+/)?.[0] || "";
                            if (bonusValue){
                                bonusString.push(`${bonusTitle.slice(0, 6)}:${bonusValue}`);
                            }

                        }
                    });
                    bonusString = bonusString.join(", ");
                    item.name = bonusString + ` [${item.name}]`;
                });

                let modifiedResponse = { ...response, items: jsonResponse.items };
                modifiedResponse = JSON.stringify(modifiedResponse);
                console.log("[ARMORYBONAOS] Modified Response:", modifiedResponse);

                if (originalSuccess) {
                    originalSuccess(modifiedResponse, textStatus, jqXHR);
                }
            } catch (error) {
                console.error("[ARMORYBONAOS] Error processing response:", error);
                if (originalSuccess) {
                    originalSuccess(response, textStatus, jqXHR); // Return the original response if JSON parsing fails
                }
            }
        };
    }

    return originalAjax(options);
};
