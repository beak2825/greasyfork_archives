// ==UserScript==
// @name         Simple Reddit Video Downloader (with sound) [Viddit/Rapidsave]
// @namespace    1N07
// @version      0.6.1
// @description  Lets you download reddit videos with sound. Supports multiple download providers
// @author       1N07
// @license      unlicense
// @icon         https://www.reddit.com/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/message/compose/*
// @compatible   firefox Tested on Firefox v122.0 and Tampermonkey 5.0.1
// @compatible   firefox Likely to work on other userscript managers, but not tested
// @compatible   chrome Latest version untested, but likely works with at least Tampermonkey
// @compatible   opera Latest version untested, but likely works with at least Tampermonkey
// @compatible   edge Latest version untested, but likely works with at least Tampermonkey
// @compatible   safari Latest version untested, but likely works with at least Tampermonkey
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/380369/Simple%20Reddit%20Video%20Downloader%20%28with%20sound%29%20%5BVidditRapidsave%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/380369/Simple%20Reddit%20Video%20Downloader%20%28with%20sound%29%20%5BVidditRapidsave%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var DLProvHandle;
    var DLProv = GM_getValue("DLProv", "https://rapidsave.com/info?url=");
    SetDLProvHandle();

    $(function(){
        AddButtons();
        setInterval(AddButtons, 200);
    });

    function AddButtons() {
        let targets = $("div[data-testid='post-container'] shreddit-player, div[data-testid='post-container'] video > source[src^='https://v.redd.it/']");
        targets.each(function(){
            if($(this).length)
            {
                let bar = $(this).closest("div[data-testid='post-container']").find("i.icon-comment:first").parent().parent();
                if(bar.length && bar.find(".downloadVid").length == 0)
                    AddDLButtonToBar(bar);
            }
        });
    }

    function AddDLButtonToBar(bar) {
        let saveButt = bar.find("button .icon-save").closest("button");
        if(saveButt == null)
            alert("Save button not found! (used to position DL button)");
        saveButt.prop("style", "float: left;");
        saveButt.after(`<div class="outerForDLB"></div>`);
        bar.find(".outerForDLB").append(saveButt.clone().addClass("downloadVid"));
        let dlButt = bar.find(".downloadVid");
        dlButt.find("i.icon").removeClass("icon-save").addClass("icon-downvote");
        dlButt.find("span:last").html('Download');
        bar.find(".outerForDLB").prop("style", "float: right;");

        dlButt.click(function(e){
            e.preventDefault();
            let url = $(this)?.closest("div[data-testid='post-container']")?.find("a[data-click-id=body]:first")?.prop("href") || window.location.href.split("#")[0].split("?")[0];
            let dlUrl = url.split("#")[0].split("?")[0];
            window.open(DLProv + encodeURIComponent(encodeURI(dlUrl)), "_blank");
        });
    }

    function SetDLProvHandle() {
        GM_unregisterMenuCommand(DLProvHandle);

        let curDLP = (DLProv == "https://viddit.red/?url=" ? "Viddit" : "Rapidsave");
        DLProvHandle = GM_registerMenuCommand("DL Provider: (" + curDLP + ") -click to change to "+ (curDLP == "Viddit" ? "Rapidsave" : "Viddit") +"-", function(){
            let curDLP = (DLProv == "https://viddit.red/?url=" ? "Viddit" : "Rapidsave");
            if(curDLP == "Viddit")
                DLProv = "https://rapidsave.com/info?url=";
            else
                DLProv = "https://viddit.red/?url=";

            GM_setValue("DLProv", DLProv);
            SetDLProvHandle();

            if(confirm('Press "OK" to refresh the page to apply new settings'))
                location.reload();
        });
    }
})();