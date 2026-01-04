// ==UserScript==
// @name         Torn Extensions - Company Activity
// @namespace    TornExtensions
// @version      1.2
// @description  Shows the activity of employees.
// @author       Mathias [XID 1918010]
// @match        https://www.torn.com/companies.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381012/Torn%20Extensions%20-%20Company%20Activity.user.js
// @updateURL https://update.greasyfork.org/scripts/381012/Torn%20Extensions%20-%20Company%20Activity.meta.js
// ==/UserScript==

(function() {
    //'use strict';
    let APIKey = "YOUR APIKEY HERE";
    let targetNode = document.getElementById('employees');
    let config = { childList: true };
    let callback = function(mutationsList, observer) {
        $(".days").mouseover(function() {
            $(this).text($(this).attr("data-last-activity").replace(" minute ago", "m").replace(" minutes ago", "m").replace(" hours ago", "h").replace(" hour ago", "h").replace(" days ago", "d").replace(" day ago", "d"));
        });

        $(".days").mouseout(function() {
            $(this).html(`<span class="bold t-show">Days:</span> ${$(this).attr("data-days").replace("Days:", "")}`);
        });

        $("a.user.name").each(function() {
            if($(this).closest("li").attr("data-user").length > 0 && $(this).next("img")) {
                let uID = $(this).closest("li").attr("data-user");
                let API = `https://api.torn.com/user/${uID}?selections=profile&key=${APIKey}`;
                fetch(API)
                  .then((res) => res.json())
                  .then((res) => {
                    $($($(this).parent().parent().parent()).find(".acc-body")).find(".days").attr("data-last-activity", res.last_action.relative).attr("data-days", $($($(this).parent().parent().parent()).find(".acc-body")).find(".days").text().trim().replace("Days: ", ""));
                    let days = res.last_action.relative.split(" ");
                    if(days[1].includes("day"))
                        if(parseInt(days[0]) == 1)
                            $(this).parent().css("background-color", "orange");
                        else if(parseInt(days[0]) >= 2)
                            $(this).parent().css("background-color", "red");
                  });
            }
        });
    };

    let observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
})();