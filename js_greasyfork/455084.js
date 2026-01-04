// ==UserScript==
// @name           Newscon Refine
// @name:en        Newscon Refine
// @license        MIT
// @namespace      https://newscon.net/
// @version        0.1.1
// @description    Newscon の最適化
// @description:en Optimizing Newscon
// @author         iniimi2170
// @require        https://code.jquery.com/jquery-3.6.1.min.js
// @match          https://*.newscon.net/d/*
// @match          https://*.newscon.net/download/hosts
// @connect        pastex.net
// @connect        newscon.net
// @grant          GM_xmlhttpRequest
// @grant          unsafeWindow
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/455084/Newscon%20Refine.user.js
// @updateURL https://update.greasyfork.org/scripts/455084/Newscon%20Refine.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let head = document.getElementsByTagName("head")[0];
    head.innerHTML += '<meta name="viewport" content="width=device-width,initial-scale=1">';

    if (!location.href.includes("/d/")) {
        return;
    }
    let resultElem = document.getElementById("result");
    let observer = new MutationObserver(function(mutationsList, observer) {
        for(let mutation of mutationsList) {
            console.log(mutation);
            if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (!node.href || !node.href.includes("pastex.net")) {
                        return;
                    }
                    let details = {
                        method: "GET",
                        url: node.href + "/raw",
                        headers: {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
                        },
                        onload: function(resp) {
                            if (resp.status !== 200) {
                                return;
                            }
                            $("body > div.homeContainer.u-clearfix.js-homepage > div > div > div:nth-child(1) > div > article").append('<div class="extremePostPreview-post u-minWidth0 u-flex1 u-marginRight24 u-textAlignLeft js-trackPostPresentation"><a class="ds-link ds-link--stylePointer u-overflowHidden u-flex0 u-width100pct" href="' + resp.responseText + '" target="_blank"><h2 class="ui-h2 ui-xs-h4 ui-clamp3" style="color: #FFD700!important;">' + resp.responseText.slice(0, 30) + '... -> direct link </h2> </a><br></div>');
                        }
                    };
                    GM_xmlhttpRequest(details);
                    observer.disconnect();
                }
            }
        }
    });
    observer.observe(resultElem, { childList: true });

    // this doesn't work on Userscripts client.
    unsafeWindow.WAITING_TIME = 2;

    if (window.matchMedia && window.matchMedia('(max-device-width: 640px)').matches) {
        let title = document.querySelector("#target > h1");
        title.innerHTML = 'Premium link generator: <a href="/download/hosts" style="color: #5897fb;"> 45+ hosts</a></span>';
        let imputElem = $("#target > div.u-marginTop8.u-width100pct");
        imputElem.removeClass("u-flexTop");
        imputElem.css({
            "display": "flex",
            "align-items": "flex-end"
        });
    }

    let targetUploader = [
        "katfile",
        "mexa",
        "rapidgator",
        "uploaded"
    ];

    let request = {
        method: "GET",
        url: "https://www.newscon.net/download/hosts",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
        },
        nocache: true,
        responseType: "text",
        onload: function(resp) {
            if (resp.status !== 200) {
                return;
            }
            let appendArea = '<section id="statusArea" style="margin-top: 3%; margin-bottom: 6%"><h5 style="padding-bottom: 7px;">Current Status:</h5>';
            let othersArea = '<div id="statusFullArea" hidden>';
            let matchAll = resp.responseText.matchAll(/<script>document\.write\('<td>' \+ '([A-Za-z0-9_\-\.]+)' \+ '<\/td>' \+ '<td>' \+ '[A-Za-z0-9\. \-_]+' \+ '<\/td>' \+ '<td>' \+ '(.+?)' \+ '<\/td>'\)<\/script>/g);
            for (let match of matchAll) {
                if (targetUploader.includes(match[1])) {
                    appendArea += '<p style="line-height: 4px !important; font-size: 14px; margin-top: 4px; margin-left: 1rem;">' + match[1] + ": " + match[2] + '<p>';
                } else {
                    othersArea += '<p style="line-height: 4px !important; font-size: 14px; margin-top: 4px; margin-left: 1rem;">' + match[1] + ": " + match[2] + '<p>';
                }
            }
            appendArea += othersArea + '</div><a id="showAllStatus" href="#" style="line-height: 4px !important; font-size: 14px; margin-top: 4px; margin-left: 1rem; color: #5897fb;">show all...</a></section>';
            $("body").append(appendArea);
            $("#showAllStatus").click(function() {
                $("#statusFullArea").toggle();
                if ($('#statusFullArea').is(':visible')) {
                    $("#showAllStatus").html("show less...");
                } else {
                    $("#showAllStatus").html("show more...");
                }
            });
        }
    };
    GM_xmlhttpRequest(request);

})();