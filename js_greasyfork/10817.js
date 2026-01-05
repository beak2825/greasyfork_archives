// ==UserScript==
// @name         Redirect Old Oblivion / Skyrim Nexus Mods and Tesnexus Links
// @namespace    https://greasyfork.org/en/scripts/10817-redirect-old-oblivion-nexus-mods-links
// @icon         https://www.nexusmods.com/favicon.ico
// @version      2.1
// @description  Redirects old oblivion nexus links to the proper place
// @author       Axer128
// @match        http://*.nexusmods.com/mods/*
// @match        https://*.nexusmods.com/mods/*
// @match        http://*.nexusmods.com/users/*
// @match        https://*.nexusmods.com/users/*
// @match        http://www.tesnexus.com/downloads/file.php?id=*
// @match        https://www.tesnexus.com/downloads/file.php?id=*
// @match        http://www.nexusmods.com/?id=*
// @match        https://www.nexusmods.com/?id=*
// @grant        none
// @run-at       document-start

// @downloadURL https://update.greasyfork.org/scripts/10817/Redirect%20Old%20Oblivion%20%20Skyrim%20Nexus%20Mods%20and%20Tesnexus%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/10817/Redirect%20Old%20Oblivion%20%20Skyrim%20Nexus%20Mods%20and%20Tesnexus%20Links.meta.js
// ==/UserScript==
    // This is to ensure your browsers back button still works even with high script lag, might need to click back a few times
window.setTimeout(doRedirect, 750);

function doRedirect()
{
    // This one fixes very old oblivion links to tesnexus.com
    var url = new URL(window.location.href);
    var id = url.searchParams.get("id");
    if (id != null)
    {
        window.location.href="https://www.nexusmods.com/oblivion/mods/"+id;
    }
    // This one fixes oblivion.nexusmods.com
    else if (window.location.href.startsWith("https://oblivion.nexusmods.com/mods"))
    {
        window.location.href="https://www.nexusmods.com/oblivion"+window.location.pathname;
    }
     // This one fixes skyrim.nexusmods.com
    else if (window.location.href.startsWith("https://skyrim.nexusmods.com/mods"))
    {
        window.location.href="https://www.nexusmods.com/skyrim"+window.location.pathname;
    }
         // This one fixes morrowind.nexusmods.com
    else if (window.location.href.startsWith("https://morrowind.nexusmods.com/mods"))
    {
        window.location.href="https://www.nexusmods.com/morrowind"+window.location.pathname;
    }
}