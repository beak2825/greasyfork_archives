// ==UserScript==
// @name         TORN: Job Check
// @namespace    dekleinekobini.jobcheck
// @version      1.1.0
// @author       DeKleineKobini
// @description  Easily check whether or not a player has a job.
// @match        https://www.torn.com/profiles.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/391828/TORN%3A%20Job%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/391828/TORN%3A%20Job%20Check.meta.js
// ==/UserScript==

setDebug(false);

/* --------------------
CODE - EDIT ON OWN RISK
-------------------- */
initScript("jobcheck", "Job Check", "JC", true);

GM_addStyle(
    ".dkk-lime { color: lime }"
    + ".dkk-green { color: green }"
    + ".dkk-red { color: red }"
    + ".dkk-white { color: white }"
    + ".dkk-orangered { color: orangered }"
    + ".dkk-widget { margin-top: 10px; }"
    + ".dkk-widget_header { background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px); background-size: 4px; display: flex; align-items: center; color: rgb(255, 255, 255); font-size: 13px; letter-spacing: 1px; text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px; padding: 6px 10px; border-radius: 5px 5px 0 0; } "
    + ".dkk-widget_header { background-color: rgb(40, 41, 138); }"
    + ".dkk-widget_title { flex-grow: 1; box-sizing: border-box; }"
    + ".dkk-widget-message { text-align: center; line-height: 1.4; }"
);


observeMutations(document, ".icons", true, (mutations, observer) => {
    let message = "UNKOWN ERROR";

    let userid = $("link[rel='canonical']").attr("href");
    userid = userid.substring(userid.indexOf("XID=") + 4);

    let icons = $(".icons");
    if (icons.find("#icon27").length || icons.find("#icon73").length) {
        sendAPIRequest("user", userid, "profile").then(response => {
            if (response.error) {
                setMessage(`in Company (API ERROR: ${response.error.code})`);
                return;
            }

            let basicicon = response.basicicons.icon27 || response.basicicons.icon73;
            let companyType = basicicon.substring(basicicon.indexOf("(") + 1, basicicon.indexOf(")"));

            let companyid = response.job.company_id;

            sendAPIRequest("company", companyid, "profile").then(response2 => {
                if (response2.error) {
                    setMessage(`in Company (${companyType})`);
                    return;
                }

                let rating = response2.company.rating;
                let ratingShow;

                if (rating >= 7) ratingShow = "7* +";
                else ratingShow = "- 7*";

                setMessage(`in Company (${companyType}, ${ratingShow})`);
            }, error => {
                setMessage(`in Company (${companyType})`);
            });
        }, error => {
            setMessage("in Company");
        });

        message = "in Company (TODO)";
    } else if (icons.find("#icon21").length) setMessage("has city job");
    else setMessage("no job");
}, { childList:true, subtree: true });

function setMessage(message) {
    if (!$("#message").length) $(".content-title").prepend(`<div style='margin-bottom: 5px;'><article class="dkk-widget"><header class="dkk-widget_header border-round"><span class="dkk-widget_title">Job Check</span><span id='message' class='dkk-white'></span></header></article></div>`);

    $("#message").html(message);
}