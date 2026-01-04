// ==UserScript==
// @name         AAAAAAAAAAA
// @version      1.2
// @namespace    AAAAAAAA.com
// @description  AAAAAAAAAAAAAAAAAA
// @author       AAAAAAAAAAAAAA
// @match        *kissanime.ru/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370296/AAAAAAAAAAA.user.js
// @updateURL https://update.greasyfork.org/scripts/370296/AAAAAAAAAAA.meta.js
// ==/UserScript==

(function() {

    var whitelist = [ // Add/remove as you please
        "kiss",
        "javascript",
        "discord",
        "novel",
        "myanimelist",
        "kitsu",
        "nyaa",
        "reddit",
        "moe",
        "twitter",
        "anichart",
        "chrome-extension"
    ];

    var server = ""; // Pick from the server list below

    var server_list = [ // Don't edit anything below unless you know what you're doing
        "RapidVideo",
        "Mp4Upload",
        "Openload",
        "Streamango",
        "HydraX",
        "Nova Server",
        "Alpha Server",
        "Beta Server"
    ];

    /****************************************************************/

    function check() { // Helper function for removal(), compares links to the whitelist
        return !whitelist.some((word) => this.href.includes(word));
    }

    function removal() { // Does the do
        $('#my_video_1').show();
        $(".divCloseBut > [href]").click();
        $("[href]").filter(check).remove();
        $("[id^='divAds']").remove();
        $("[id^=adsIfrme]:not(#adsIfrme)").remove();
        $("[sandbox]").remove();
        $("#divContentVideo > div > div > div:contains('Close ads')").click();
    }

    if (server_list.includes(server)) { // Check if chosen server is valid
        var server_index = -1, select = document.getElementById("selectServer");
        if (select) { // Check if the server selector exists
            for (var i = 0; i < select.options.length; ++i) {
                if (select.options[i].innerText == server) { // Check each option
                    server_index = i;
                }
            }
            if (select.selectedIndex != server_index && server_index != -1) { // If the requested server exists, select it
                window.location.href = select.options[server_index].value;
            }
        }
    }
    (new MutationObserver(removal)).observe(document.body, { // Check for ads everytime the page updates
        childList: true,
        subtree: true
    });
})();