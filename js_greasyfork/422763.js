// ==UserScript==
// @name         CF-live-Predictor
// @version      1.3.0
// @description  This extension predicts rating changes for Codeforces. It shows approximate deltas during and after the contest. This extension only works on codeforces.ml.
// @author       Originally by WslF, edited by Kartik_715, re-edited by GGAutomaton, re-edited again by yylx
// @match        *://codeforces.live/contest/*/standings*
// @connect      codeforces.live
// @namespace    https://greasyfork.org/users/744178
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/422763/CF-live-Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/422763/CF-live-Predictor.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//cdn.jsdelivr.net/gh/jquery/jquery@1/dist/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function main() {
    "use strict";
    var partyNum = 0;
    var results = [];
    showDeltas();

    function modifyPartyHtml(index, elem) {
        var delta = '?';
        var rank = ' ';
        var seed = ' ';

        if (partyNum > 0) {
            var handle = $(elem).find("td:eq(1)").find("a").last().html();
            if (handle) {
                //next 2 lines - fix for legendary grandmaster
                handle = handle.replace('<span class="legendary-user-first-letter">','');
                handle = handle.replace('</span>','');
                if (handle in results) {
                    delta = results[handle].delta;
                    rank = results[handle].rank;
                    seed = results[handle].seed;
                }
            }
        }

        var darkClass = "";
        if (partyNum % 2 == 1) {
            darkClass = "dark ";
        }
        var text;
        if (partyNum == 0) {
            text = "<th class='top right' style='width: 4em;'><span title='Rating change''>&Delta;</span></th>";
        } else {
            if (delta > 0) {
                text = "<td class='" + darkClass + "right'><span style='color:green;font-weight:bold;'>+" + delta + "</span></td>";
            } else {
                text = "<td class='" + darkClass + "right'><span style='color:gray;font-weight:bold;'>" + delta + "</span></td>";
            }
        }

        partyNum++;
        $(elem).append(text);
    }

    function showDeltas() {
        var count = $(".standings").find("tr").length;
        if (count > 2) {
            var contestId = document.location.href.replace(/\D+/ig, ',').substr(1).split(',')[0];
            var contestants = document.getElementsByClassName("contestant-cell");
            var contestantsHandles = Array.from(contestants).map(x => x.innerText.trim());

            getDeltas(contestId, contestantsHandles, function() {
                $(".standings").find("tr").first().find("th").last().removeClass("right");
                $(".standings").find("tr").find("td").removeClass("right");
                $(".standings").find("tr").each(modifyPartyHtml);
                if (count % 2 == 0) {
                    $(".standings").find("tr").last().find("td").last().replaceWith("<td class='smaller bottom right dark'>&Delta;</td>");
                } else {
                    $(".standings").find("tr").last().find("td").last().replaceWith("<td class='smaller bottom right'>&Delta;</td>");
                }
            });
        }
    }

    function parseDeltas(data, callback) {
        for (var i = 0; i < data.result.length; i++) {
            var handle = data.result[i].handle;
            var delta = data.result[i].newRating - data.result[i].oldRating;
            var rank = data.result[i].rank;
            var seed = data.result[i].seed;
            var res = {
                delta : parseInt(delta),
                seed : parseInt(seed),
                rank : parseInt(rank)
            };
            results[handle] = res;
        }
        callback();
    }

    function getDeltas(contestId, contestantsHandles, callback) {
        var retries = 1;
        var herokuServerOld = "https://cf-predictor-frontend.codeforces.ml/";
        var pageOld = "GetNextRatingServlet?contestId=" + contestId;
        var serverOld = herokuServerOld + pageOld;

        var herokuServerNew = "https://cf-predictor.codeforces.ml/";
        var pageNew = "GetPartialRatingChangesServlet?contestId=" + contestId + "&handles="+contestantsHandles.join(",");
        var serverNew = herokuServerNew + pageNew;

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4) {
                try {
                    if (this.status == 200) {
                        var text = xhttp.responseText;
                        var data = JSON.parse(text);
                        parseDeltas(data, callback);
                        return;
                    }
                } catch(err) {
                    console.log(err);
                }
                if (retries--) {
                    xhttp.open("GET", serverOld, true);
                    xhttp.send();
                }
            }
        }

        xhttp.open("GET", serverNew, true);
        xhttp.send();
    }
};

addJQuery(main);
