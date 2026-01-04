// ==UserScript==
// @name         MSPA To Go Redirect
// @namespace    aubymori
// @version      1.0.0
// @description  Redirects Homestuck.com and MSPA to MSPA To Go
// @author       You
// @match        http://*.mspaintadventures.com/*
// @match        *://*.homestuck.com/*
// @icon         http://www.mspaintadventures.com/favicon.ico
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/546592/MSPA%20To%20Go%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/546592/MSPA%20To%20Go%20Redirect.meta.js
// ==/UserScript==

const INSTANCE = "https://mspa.chadthundercock.com";

let urlParts = location.pathname.split("/").slice(1);
if (location.hostname.endsWith("homestuck.com"))
{
    let page = urlParts[0].toLowerCase();
    switch (page)
    {
        case "jailbreak":
        case "bard-quest":
        case "blood-spade":
        case "problem-sleuth":
        case "beta":
        case "story":
        {
            let uri = "/";
            uri += (page == "story") ? "homestuck" : page;
            if (urlParts[1] !== undefined)
                uri += "/" + urlParts[1];

            location.href = INSTANCE + uri;
            break;
        }
    }
}
else if (location.hostname.endsWith("mspaintadventures.com"))
{
    switch (location.pathname)
    {
        case "/testindex.php":
        case "/newindex.php":
        case "/test_index.php":
        {
            console.log("HI");
            let params = new URLSearchParams(location.search);
            if (params.get("s") !== null)
            {
                let uri = "/read/" + params.get("s");
                if (params.get("p") !== null)
                    uri += "/" + params.get("p");

                location.href = INSTANCE + uri;
            }
            break;
        }
        case "/DOTA/":
        case "/DOTA/index.html":
            location.href = INSTANCE + "/read/6/006715";
            break;
        case "/007395/":
        case "/007395/index.html":
            location.href = INSTANCE + "/read/6/007395";
            break;
        case "/007680/007680.html":
            location.href = INSTANCE + "/read/6/007680";
            break;
        case "/GAMEOVER/":
        case "/GAMEOVER/index.html":
            location.href = INSTANCE + "/read/6/008801";
            break;
        case "/shes8ack/":
        case "/shes8ack/index.html":
            location.href = INSTANCE + "/read/6/009305";
            break;
        case "/collide.html":
            location.href = INSTANCE + "/read/6/009987";
            break;
        case "/ACT7.html":
            location.href = INSTANCE + "/read/6/10027";
            break;
        case "/endcredits.html":
            location.href = INSTANCE + "/read/6/10030";
            break;
    }
}