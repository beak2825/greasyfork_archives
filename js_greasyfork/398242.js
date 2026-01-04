// ==UserScript==
// @name          Adblock For Moomoo.io and More .io games
// @description   Modded Script to remove ads
// @author        TideSwagger
// @namespace     https://greasyfork.org/en/users/462507-tideswagger
// @version       0.4
// @match         *://google.com/*
// @match         *://yahoo.com/*
// @match         *://bing.com/*
// @match         *://greasyfork.org/*
// @match         *://sandbox.moomoo.io/*
// @match         *://deeeep.io/*
// @match         *://diep.io/*
// @match         *://moomoo.io/*
// @grant         none
// @icon          https://cdn0.iconfinder.com/data/icons/universal-signs-symbols/128/stop-sign-hand-512.png
// @copyright     2019+, GrimStudioZ
// @downloadURL https://update.greasyfork.org/scripts/398242/Adblock%20For%20Moomooio%20and%20More%20io%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/398242/Adblock%20For%20Moomooio%20and%20More%20io%20games.meta.js
// ==/UserScript==

    // Loads jQuery and triggers a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");
    script.addEventListener('load', function() { callback(); }, false);
    document.body.appendChild(script);
}

// The main script
function main() {

    const $ = (unsafeWindow || window).$;

    // For domains that follow the standard way of blocking AdBlockers typically with a full-page block and overlay.
    var arrayStandardBlockerDomains = [ "www.vg247.com",
                                        "www.eurogamer.net",
                                        "www.gamesradar.com",
                                        "www.usatoday.com",
                                        "www.cnn.com"].map(String);

    // For domains that follow a nonstandard way of blocking AdBlockers by typically blocking the content area only, or some other unique way.
    var arrayAbnormalBlockerDomains = [ "www.makeuseof.com",
                                        "www.businessinsider.com",
                                        "www.thedailybeast.com"].map(String);

    // For domains that typically launch third-party modals for random stuff like sign-ups.
    var arrayAuxiliaryBlockerDomains = [ "www.gamesradar.com"].map(String);

    /*
    // keeping for future use
    function DomainCheck() {
        var i, domain = window.location.hostname;
        for (i = 0; i < arrayStandardBlockerDomains.length; i++)
        {
            if (domain == arrayStandardBlockerDomains[i])
            {
                return arrayStandardBlockerDomains[i];
                break;
            }
        }
        for (i = 0; i < arrayAbnormalBlockerDomains.length; i++)
        {
            if (domain == arrayAbnormalBlockerDomains[i])
            {
                return arrayAbnormalBlockerDomains[i];
                break;
            }
        }
        for (i = 0; i < arrayAuxiliaryBlockerDomains.length; i++)
        {
            if (domain == arrayAuxiliaryBlockerDomains[i])
            {
                return arrayAuxiliaryBlockerDomains[i];
                break;
            }
        }
    }
    var domain = DomainCheck();
    */

    function DOMStatusCheck() {
        if (arrayStandardBlockerDomains.indexOf(window.location.hostname) > -1)
        {
            var isHTMLBlocked = $("html").attr("style");
            var isBodyBlocked = $("body").attr("style");
            var isHTMLClassBlocked = $("html").hasClass("sp-message-open");

            if (isHTMLBlocked !== undefined || isBodyBlocked !== undefined || isHTMLClassBlocked)
            {
                clearInterval(currentStatus1);
                // We're on a page that is blocked

                $("html").removeAttr("style");
                $("body").removeAttr("style");
                $("html").removeClass("sp-message-open");

                switch(window.location.hostname)
                {
                    case arrayStandardBlockerDomains[0]:    // vg247
                    case arrayStandardBlockerDomains[1]:    // eurogamer
                    case arrayStandardBlockerDomains[2]:    // gamesradar
                    case arrayStandardBlockerDomains[3]:    // usatoday
                    case arrayStandardBlockerDomains[4]:    // cnn
                        $("[class*='sp_veil']").remove();
                        $("[id*='sp_message_id']").remove();
                        break;
                }
            }

            console.clear();
        }

        if (arrayAuxiliaryBlockerDomains.indexOf(window.location.hostname) > -1)
        {
            switch(window.location.hostname)
            {
                case arrayAuxiliaryBlockerDomains[0]:    // gamesradar
                    if ($(".raleigh-optin-visible").is(":visible"))
                    {
                        $("[class*='raleigh-optin-']").remove();
                    }
                    clearInterval(currentStatus2);
                    break;
            }
        }

        if (arrayAbnormalBlockerDomains.indexOf(window.location.hostname) > -1)
        {
            switch(window.location.hostname)
            {
                case arrayAbnormalBlockerDomains[0]:    // makeuseof
                    $("[class*='unblockplease-overlay']").remove();
                    $(".unblockplease").removeAttr("style");
                    break;
                case arrayAbnormalBlockerDomains[1]:    // businessinsider
                    $(".tp-modal").remove();
                    $(".tp-backdrop").remove();
                    $("body").removeClass("tp-modal-open");
                    break;
            }
        }

    }

    function SledgehammerRemoval() {
        if (window.location.hostname == arrayAbnormalBlockerDomains[2])    // dailybeast
        {
            $(".tp-modal").remove();
            $(".tp-backdrop").remove();
            $("body").removeClass("tp-modal-open");
            $("[id*='offer-0-']").remove();
            $("[displayname*='PianoTag']").remove();
            $("[src*='tinypass.min.js']").remove();
            $("#piano_bottom_ribbon_wrapper").remove();
            console.clear();
            console.log("blocker code removed");
        }
    }

    SledgehammerRemoval();

    function ClearAllIntervals()
    {
        console.clear();

        if (window.location.hostname != arrayAbnormalBlockerDomains[2])    // dailybeast
        {
            clearInterval("SledgehammerRemoval");
            console.log("Sledgehammer interval cleared");
        }
        for (var i = 1; i <= 6; i++)
        {
            var intervalName = "currentStatus" + i;
            clearInterval(intervalName);
        }
        clearInterval(ci);
        console.log("all intervals cleared");
    }

    // Sets up listeners to supercede any blocker shenanigans
    if (arrayStandardBlockerDomains.indexOf(window.location.hostname) > -1) { var currentStatus1 = setInterval(DOMStatusCheck, 50); }
    if (arrayAuxiliaryBlockerDomains.indexOf(window.location.hostname) > -1) { var currentStatus2 = setInterval(DOMStatusCheck, 50); }

    // Second pass after 1.5 seconds
    if (arrayStandardBlockerDomains.indexOf(window.location.hostname) > -1) { var currentStatus3 = setTimeout(DOMStatusCheck, 1500); }
    if (arrayAbnormalBlockerDomains.indexOf(window.location.hostname) > -1) { var currentStatus4 = setTimeout(DOMStatusCheck, 1500); }

    // Third pass after 2.5 seconds
    if (arrayStandardBlockerDomains.indexOf(window.location.hostname) > -1) { var currentStatus5 = setTimeout(DOMStatusCheck, 2500); }
    if (arrayAbnormalBlockerDomains.indexOf(window.location.hostname) > -1) { var currentStatus6 = setTimeout(DOMStatusCheck, 2500); }

    // Last-pass guarantee after 7 seconds
    var ci = setTimeout(ClearAllIntervals, 7000);

    // Perpetual check and removal every 2.5 seconds - The Peter Gabriel Sledgehammer Special
    if (arrayAbnormalBlockerDomains.indexOf(window.location.hostname) > -1) { var ABStatus = setInterval(SledgehammerRemoval, 2500); }


    console.clear();
}

// Load jQuery and then execute the main function
addJQuery(main);