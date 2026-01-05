// ==UserScript==
// @name         BlackBoard
// @namespace    http://k-moeller.dk/
// @version      0.6
// @description  Autologin
// @author       KalledK
// @match        https://blackboard.au.dk/webapps/*
// @match        https://blackboard.au.dk/bbcswebdav/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/11246/BlackBoard.user.js
// @updateURL https://update.greasyfork.org/scripts/11246/BlackBoard.meta.js
// ==/UserScript==

var redirect_page = GM_getValue ("redirect_page", "");

var bb_origin   = "https://blackboard.au.dk";
var wayf_login_url = "https://blackboard.au.dk/webapps/bb-auth-provider-shibboleth-BBLEARN/execute/shibbolethLogin?returnUrl=https%3A%2F%2Fblackboard.au.dk%2Fwebapps%2Fportal%2Fframeset.jsp&authProviderId=_102_1";

var bb_path = "/webapps/portal/execute/tabs/tabAction";
var course_path = "/webapps/blackboard/";

var front_tab = "?tab_tab_group_id=_1_1";

function login(url) {
    url = typeof url !== 'undefined' ? url : "";
    if (window.confirm("Relogin?")) {
        GM_setValue("redirect_page", url);
        window.location.replace(wayf_login_url);
    }
}

function doBB() {

    pathname = document.location.pathname;

    if (pathname.indexOf(bb_path) === 0) {
        switch (document.location.search) {
            case front_tab:
                if (redirect_page) {
                    GM_setValue("redirect_page", "");
                    window.location.replace(redirect_page);
                }
                break;
        }
        return;
    }

    if (pathname.indexOf(course_path) === 0) {
        relogin = $("#topframe\\.login\\.label");
        if (relogin.length > 0) {
            login(document.location.href);
        }
        return;
    }

    if (pathname.indexOf("/bbcswebdav/") === 0) {
        if ($("h1:first").length > 0) {
            if ($("h1:first")[0].innerHTML == "Forbidden") {
                login(document.referrer);
            }
        }
    }

    if (pathname.indexOf("/webapps/cmsmain/webui/") === 0) {
        title = $("#pageTitleText");
        if (title.length > 0) {
            if (title[0].innerHTML.indexOf("Error") > 0) {
                login(document.location.href);
            }
        }
    }
}


doBB();