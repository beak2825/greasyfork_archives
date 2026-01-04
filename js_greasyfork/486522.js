// ==UserScript==
// @name         Confluence SideBar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove Confluence SideBar crap
// @author       You
// @license      GPL v3
// @match        https://*.atlassian.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mozilla.org
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/486522/Confluence%20SideBar.user.js
// @updateURL https://update.greasyfork.org/scripts/486522/Confluence%20SideBar.meta.js
// ==/UserScript==

function sleep(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function shortcut_filter()
{
    return $(this).html() === "Shortcuts";
}

///////////////////////////////////////////////////
//////////////// END OF HEADER ////////////////////
///////////////////////////////////////////////////

var is_join = 0;
var is_min = 0;
var is_present = 0;

sleep(2000);

const autoAdmit = (mutation) =>
{
    if (!mutation.addedNodes)
    {
        return;
    }
    //var sh = $("div:contains('Shortcuts')");
    var sh = $("div").filter(shortcut_filter);
    var pr = sh.parent().parent().parent();
    var apps = $('div[data-testid="space-apps"]');
    var ss = $("span:contains('Space settings')");
    var ss_pr = ss.parent().parent();
    var at = $("span:contains('Automation')");
    var at_pr = at.parent().parent();
    var ac = $("span:contains('All content')");
    var ac_pr = ac.parent().parent();

    if( is_join==0 )
    {
        pr.remove();
        ss_pr.remove();
        at_pr.remove();
        ac_pr.remove();
        apps.remove();
        is_join = 1;
    }
};

const observer = new MutationObserver((mutations) => mutations.forEach(autoAdmit));

// Options for the observer (which mutations to observe)
const obs_config = { attributes: true, characterData: false, childList: true, subtree: true };

observer.observe(document.body, obs_config);