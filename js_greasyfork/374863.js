// ==UserScript==
// @name         UI - Homepage Tracking
// @version      1.0
// @description  Automatically focus the tracking search box.
// @match        https://owaisashfaq.quickbase.com/db/bixmzbci5
// @grant        none
// @namespace https://greasyfork.org/users/228706
// @downloadURL https://update.greasyfork.org/scripts/374863/UI%20-%20Homepage%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/374863/UI%20-%20Homepage%20Tracking.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let trackingNumber;
    setTimeout(()=>{
        trackingNumber = window.prompt("Enter a tracking number");
        if (!trackingNumber) return;
        if(trackingNumber.indexOf("42014305") === 0) {
            trackingNumber = trackingNumber.slice(8);
        } else if (trackingNumber.indexOf("96220") === 0 || trackingNumber.indexOf("10019") === 0) {
            trackingNumber = trackingNumber.slice(22);
        }
    },1200);
    $(document).on("DOMNodeInserted",e => {
        let el = $(e.target).find(".SearchFieldLine[data-fid=479]:contains('PR - Purchase Tracking')");
        let fid = el.attr("data-fid");
        if (fid == "479" && el.is(":visible")) {
            let trackingInput  = el.find("input");
            setTimeout(()=>{
                if (trackingNumber) {
                    console.log("TRACKING: ",trackingNumber);
                    trackingInput.val(trackingNumber);
                    $(".SearchFieldLine:contains('PR - Purchase Tracking')").find(".DoSearch").click();
                } else trackingInput.focus();
            }, 1200)
        }
    });

    // Set Header
    $(".FirstItem").append("<p class='recvHeader'>SCRIPT RUNNING</p>").css("color", "orange")
    $(".FirstItem").css("padding-top", "5px")
})();