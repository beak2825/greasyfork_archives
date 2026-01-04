// ==UserScript==
// fuente / autor 1N07
// Solo edite la url de descarga, ya que viddit y ripsave no me funcionan
// @edit: 		 Soadar
// @name         Reddit Video Downloader (with sound) [RedditSave]
// @namespace    1N07
// @version      0.5.4
// @description  Lets you download reddit videos with sound using RedditSave
// @author       1N07
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        https://www.reddit.com/*
// @exclude      https://www.reddit.com/message/compose/*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/427155/Reddit%20Video%20Downloader%20%28with%20sound%29%20%5BRedditSave%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/427155/Reddit%20Video%20Downloader%20%28with%20sound%29%20%5BRedditSave%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){
        AddButtons();
        setInterval(AddButtons, 200);
    });

    function AddButtons() {
        //=== post page ===//
        if(window.location.href.includes("/comments/"))
        {
            let vid = $("div[data-test-id='post-content'] video");
            if(vid.length > 0 && !vid.find("source").prop("src").includes("external-preview.redd.it"))
            {
                let bar = $("div[data-test-id=post-content] > div:last");
                if(bar.length > 0 && bar.find(".downloadVid").length == 0) {
                    let saveButt = bar.find("button .icon-save").parent().parent();
                    saveButt.prop("style", "float: left;");
                    saveButt.after(`<div class="outerForDLB"></div>`);
                    bar.find(".outerForDLB").append(saveButt.clone().addClass("downloadVid"));
                    let dlButt = bar.find(".downloadVid");
                    dlButt.find("i.icon").removeClass("icon-save").addClass("icon-downvote");
                    dlButt.find("span:last").html('Download');
                    bar.find(".outerForDLB").prop("style", "float: right;");
                    //console.log("dlb: " + dlButt.length);

                    dlButt.click(function(e){
                        e.preventDefault();
                        let dlUrl = window.location.href.split("#")[0].split("?")[0];
						let urlCompleta = 'https://redditsave.com/info?url=' + dlUrl;
                        window.open(urlCompleta, "_blank");
                    });
                }
            }
        }

        //=== browse page ===//
        let targets = $("div.scrollerItem div > video");
        targets.each(function(){
            if($(this).find("source").length > 0 && !$(this).find("source").prop("src").includes("external-preview.redd.it"))
            {
                let bar = $(this).parent().parent().parent().parent().nextAll("div:last");
                if(bar.find(".icon-save").length == 0)
                    bar = bar.prev().parent().parent().nextAll("div:last");
                if(bar.find(".downloadVid").length == 0)
                {
                    let saveButt = bar.find("button .icon-save").parent().parent();
                    if(saveButt == null) alert("saveButt null!");
                    saveButt.prop("style", "float: left;");
                    saveButt.after(`<div class="outerForDLB"></div>`);
                    bar.find(".outerForDLB").append(saveButt.clone().addClass("downloadVid"));
                    let dlButt = bar.find(".downloadVid");
                    dlButt.find("i.icon").removeClass("icon-save").addClass("icon-downvote");
                    dlButt.find("span:last").html('Download');
                    bar.find(".outerForDLB").prop("style", "float: right;");

                    dlButt.click(function(e){
                        e.preventDefault();
                        let dlUrl = $(this).closest('div[data-click-id="background"]').find("a[data-click-id=body]:first").prop("href").split("#")[0].split("?")[0];
                        let urlCompleta = 'https://redditsave.com/info?url=' + dlUrl;
                        window.open(urlCompleta, "_blank");
                    });
                }
            }
        });
    }
})();