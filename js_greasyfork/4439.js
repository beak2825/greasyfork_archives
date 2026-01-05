// ==UserScript==
// @name                GM_update Tester
// @namespace           TimidScript
// @description         GM_Update is a library that allows you to update your script from any site that support meta.js standard or the main USO alternatives: OpenUserJS, Greasy Fork and MonkeyGuts. It now should support other browsers beside FireFox, like Chrome and Opera.
// @include             www.example.com
// @version             1.0.4 GF
// @require             http://openuserjs.org/src/libs/TimidScript/TSL_-_GM_Update.js
// @icon                https://i.imgur.com/FD46Ak3.png
// @include             *//www.example.com*
// @include             *//example.com*
// @grant               GM_xmlhttpRequest
// @grant               GM_info
// @grant               GM_getMetadata
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_registerMenuCommand
// @homeurl             https://greasyfork.org/scripts/4439-gm-update-tester
// @changelog           A better tester
// @downloadURL https://update.greasyfork.org/scripts/4439/GM_update%20Tester.user.js
// @updateURL https://update.greasyfork.org/scripts/4439/GM_update%20Tester.meta.js
// ==/UserScript==

// @gm_update           manual
var notice = document.createElement("div");
notice.setAttribute("style", "position: fixed; top: 10px; right: 10px; width: 400px; color: green; background-color: #E7E7F1; z-index: 999999999999; padding: 5px 10px; border: 3px solid pink; margin: 0; text-align: left; font-size: 13px;");

notice.innerHTML = "<p>&nbsp;&nbsp;&nbsp;Example showing the two different ways of checking for online version on the main "
    + "user-scripts sites. The first is using homeURL property, the second is using the metaURL property.</p>"
    + "<p>For more information checkout the script, <a href='https://greasyfork.org/en/scripts/4439-gm-update-tester'>GM_updateTester</a> "
    + "page and <a href='https://openuserjs.org/libs/TimidScript/TSL_-_GM_Update'>GM_update</a> library page.</p>"
    + "<p>Remember you can access the update from GreaseMonkey command menu.</p>";
document.body.appendChild(notice);

CreateButton("GreasyFork", "https://greasyfork.org/scripts/4439-gm-update-tester");
CreateButton("GreasyFork", "https://greasyfork.org/scripts/4439-gm-update-tester", "https://greasyfork.org/scripts/4439-gm-update-tester/code/GM_update%20Tester.meta.js");
CreateButton("OpenUserJS", "https://openuserjs.org/scripts/TimidScript/GM_update_Tester");
CreateButton("OpenUserJS", "https://openuserjs.org/scripts/TimidScript/GM_update_Tester", "https://openuserjs.org/meta/TimidScript/GM_update_Tester.meta.js");
CreateButton("MonkeyGuts", "https://monkeyguts.com/code.php?id=397");
var btn = CreateButton("PrintOut Console Example");
btn.textContent = "Printout version check in console";
btn.onclick = PersonlisedDisplay;
btn.style.marginTop = "10px";

function CreateButton(site, home, meta)
{
    var btn = document.createElement("div");
    btn.setAttribute("style", "margin: 5px; padding:5px; text-align: center; border: 1px red solid; background-color: #FBF8C8; color: red;  border-radius: 5px; width: 380px; cursor: pointer;");

    if (meta) btn.innerHTML = "Check using " + site + " <a href='" + meta + "'>metaURL</a>";
    else btn.innerHTML = "Check using " + site + " <a href='" + home + "'>homeURL</a>";

    btn.homeURL = home;
    btn.metaURL = meta;
    btn.onclick = ShowGMUpdateDialog;

    notice.appendChild(btn);
    return btn;
}

function ShowGMUpdateDialog(e)
{
    //Reset stored information about online version
    GM_update.online = { name: "", version: "", description: "", changelog: "", date: "", userURL: "" };
    GM_update.installed.homeURL = this.homeURL;
    GM_update.installed.metaURL = this.metaURL;
    GM_update.showUpdateDialog();
    GM_update.isThereANewVersion();
}


function PersonlisedDisplay()
{
    var url = "https://greasyfork.org/scripts/4439/code/4439.meta.js";
    GM_update.installed.homeURL = "https://greasyfork.org/scripts/4439-gm-update-tester";
    delete GM_update.installed.metaURL;
    GM_update.isThereANewVersion(url, updateCallback);
}

function updateCallback(success)
{
    console.log("Has new version check succeeded: ", success);
    if (success)
    {
        console.info("Do Version Match: ", GM_update.online.version == GM_update.installed.version);
        console.log("Installed/Online: ", GM_update.installed.version + "/" + GM_update.online.version)
        console.log(GM_update.installed);
        console.log(GM_update.online);
    }
}