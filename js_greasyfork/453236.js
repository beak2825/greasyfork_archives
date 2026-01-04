// ==UserScript==
// @name         gpop note colour changer
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Change note colours to new ones instead of default
// @author       Commensalism
// @match        http*://gpop.io/settings/
// @match        http*://gpop.io/settings
// @match        http*://gpop.io/play/*
// @match        http*://gpop.io/room/*
// @match        http*://gpop.io/create/
// @match        http*://gpop.io/create
// @match        http*://gpop.io/create3/
// @match        http*://gpop.io/create3
// @icon         https://gpop.io/icon.ico?v=1.16.40
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453236/gpop%20note%20colour%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/453236/gpop%20note%20colour%20changer.meta.js
// ==/UserScript==
function readcookies()
{
    var properties = document.cookie.split('; ');
    var obj = {};
    properties.forEach(function(property) {
        var tup = property.split('=');
        obj[tup[0]] = tup[1];
    });
    return obj
}
(function() {
    if (document.location.href == "http://gpop.io/settings/" || document.location.href == "https://gpop.io/settings/" || document.location.href == "http://gpop.io/settings" || document.location.href == "https://gpop.io/settings")
    {
        let panel = document.createElement("div")
        document.querySelector("#main > div:nth-child(5)").after(panel)
        panel.outerHTML = `<div class="settingspage-section">
                <div class="settingspage-section-title">Classic Mode: Key Colours <span style="background: linear-gradient(to right, #8803fc, #ff0090); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.25em;">MOD</span></div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [A]:</div>
                    <input id="setting-c-a" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [S]:</div>
                    <input id="setting-c-s" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [D]:</div>
                    <input id="setting-c-d" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [F]:</div>
                    <input id="setting-c-f" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-note">Note: Only hex colour format is supported<br><span style="color: red;">Do <span style="color: orangered;">NOT</span> leave the hashtag (#) in the code</span><br>Made by <a href="https://gpop.io/profile/@Commensalism" style="background: linear-gradient(to right, #8803fc, #ff0090); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">@Commensalism</a></div>
            </div>
            <div class="settingspage-section">
                <div class="settingspage-section-title">Tokyo Mode: Key Colours <span style="background: linear-gradient(to right, #8803fc, #ff0090); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.25em;">MOD</span></div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [A]:</div>
                    <input id="setting-ct-a" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [S]:</div>
                    <input id="setting-ct-s" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [D]:</div>
                    <input id="setting-ct-d" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [J]:</div>
                    <input id="setting-ct-j" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [K]:</div>
                    <input id="setting-ct-k" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Key [L]:</div>
                    <input id="setting-ct-l" value="ffffff" maxlength="6">
                </div>
                <div class="settingspage-section-note">Note: Only hex colour format is supported<br><span style="color: red;">Do <span style="color: orangered;">NOT</span> leave the hashtag (#) in the code</span><br>Made by <a href="https://gpop.io/profile/@Commensalism" style="background: linear-gradient(to right, #8803fc, #ff0090); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">@Commensalism</a></div>
            </div>`
        document.querySelector("#setting-c-a").onkeypress = null
        document.querySelector("#setting-c-a").addEventListener('change', function() {document.querySelector("#setting-c-a").parentElement.style.color = "#" + document.querySelector("#setting-c-a").value})

        document.querySelector("#setting-c-s").onkeypress = null
        document.querySelector("#setting-c-s").addEventListener('change', function() {document.querySelector("#setting-c-s").parentElement.style.color = "#" + document.querySelector("#setting-c-s").value})

        document.querySelector("#setting-c-d").onkeypress = null
        document.querySelector("#setting-c-d").addEventListener('change', function() {document.querySelector("#setting-c-d").parentElement.style.color = "#" + document.querySelector("#setting-c-d").value})

        document.querySelector("#setting-c-f").onkeypress = null
        document.querySelector("#setting-c-f").addEventListener('change', function() {document.querySelector("#setting-c-f").parentElement.style.color = "#" + document.querySelector("#setting-c-f").value})


        document.querySelector("#setting-ct-a").onkeypress = null
        document.querySelector("#setting-ct-a").addEventListener('change', function() {document.querySelector("#setting-ct-a").parentElement.style.color = "#" + document.querySelector("#setting-ct-a").value})

        document.querySelector("#setting-ct-s").onkeypress = null
        document.querySelector("#setting-ct-s").addEventListener('change', function() {document.querySelector("#setting-ct-s").parentElement.style.color = "#" + document.querySelector("#setting-ct-s").value})

        document.querySelector("#setting-ct-d").onkeypress = null
        document.querySelector("#setting-ct-d").addEventListener('change', function() {document.querySelector("#setting-ct-d").parentElement.style.color = "#" + document.querySelector("#setting-ct-d").value})

        document.querySelector("#setting-ct-j").onkeypress = null
        document.querySelector("#setting-ct-j").addEventListener('change', function() {document.querySelector("#setting-ct-j").parentElement.style.color = "#" + document.querySelector("#setting-ct-j").value})

        document.querySelector("#setting-ct-k").onkeypress = null
        document.querySelector("#setting-ct-k").addEventListener('change', function() {document.querySelector("#setting-ct-k").parentElement.style.color = "#" + document.querySelector("#setting-ct-k").value})

        document.querySelector("#setting-ct-l").onkeypress = null
        document.querySelector("#setting-ct-l").addEventListener('change', function() {document.querySelector("#setting-ct-l").parentElement.style.color = "#" + document.querySelector("#setting-ct-l").value})

        document.querySelector("#settings-save").addEventListener("click", function() {document.cookie = "notecolor=" + encodeURIComponent(`${document.querySelector("#setting-c-a").value};${document.querySelector("#setting-c-s").value};${document.querySelector("#setting-c-d").value};${document.querySelector("#setting-c-f").value};`) + "; path=/; max-age=9999999"
                                                                                       document.cookie = "tokyonotecolor=" + encodeURIComponent(`${document.querySelector("#setting-ct-a").value};${document.querySelector("#setting-ct-s").value};${document.querySelector("#setting-ct-d").value};${document.querySelector("#setting-ct-j").value};${document.querySelector("#setting-ct-k").value};${document.querySelector("#setting-ct-l").value};`) + "; path=/; max-age=9999999"})

        let colors = decodeURIComponent(readcookies().notecolor).split(";")
        document.querySelector("#setting-c-a").value = colors[0]
        document.querySelector("#setting-c-s").value = colors[1]
        document.querySelector("#setting-c-d").value = colors[2]
        document.querySelector("#setting-c-f").value = colors[3]
        let tokyocolors = decodeURIComponent(readcookies().tokyonotecolor).split(";")
        document.querySelector("#setting-ct-a").value = tokyocolors[0]
        document.querySelector("#setting-ct-s").value = tokyocolors[1]
        document.querySelector("#setting-ct-d").value = tokyocolors[2]
        document.querySelector("#setting-ct-j").value = tokyocolors[3]
        document.querySelector("#setting-ct-k").value = tokyocolors[4]
        document.querySelector("#setting-ct-l").value = tokyocolors[5]
    }
    else if (document.location.href.startsWith("http://gpop.io/play/") || document.location.href.startsWith("https://gpop.io/play/"))
    {
        if (window.SERVERDATA.leveldata.gamemode == "original")
        {
            let colors = decodeURIComponent(readcookies().notecolor).split(";")
            let stylesheet = document.head.appendChild(document.createElement("style")).textContent = `.pp-notes2:nth-child(1) .pp-note { color: #${colors[0]}; background-color: #${colors[0] + "33"}; } .pp-notes2:nth-child(2) .pp-note { color: #${colors[1]}; background-color: #${colors[1] + "33"}; } .pp-notes2:nth-child(3) .pp-note { color: #${colors[2]}; background-color: #${colors[2] + "33"}; } .pp-notes2:nth-child(4) .pp-note { color: #${colors[3]}; background-color: #${colors[3] + "33"}; }`
        }
        else if (window.SERVERDATA.leveldata.gamemode == "pp6")
        {
            let colors = decodeURIComponent(readcookies().tokyonotecolor).split(";")
            let stylesheet = document.head.appendChild(document.createElement("style")).textContent = `.pp6 .pp-notes2:nth-child(1) .pp-note { color: #${colors[0]}; background-color: #${colors[0] + "4d"}; } .pp6 .pp-notes2:nth-child(2) .pp-note { color: #${colors[1]}; background-color: #${colors[1] + "4d"}; } .pp6 .pp-notes2:nth-child(3) .pp-note { color: #${colors[2]}; background-color: #${colors[2] + "4d"}; } .pp6 .pp-notes2:nth-child(4) .pp-note { color: #${colors[3]}; background-color: #${colors[3] + "4d"}; } .pp6 .pp-notes2:nth-child(5) .pp-note { color: #${colors[4]}; background-color: #${colors[4] + "4d"}; } .pp6 .pp-notes2:nth-child(6) .pp-note { color: #${colors[5]}; background-color: #${colors[5] + "4d"}; }`
        }
    }
    else if (document.location.href.startsWith("http://gpop.io/room/") || document.location.href.startsWith("https://gpop.io/room/"))
    {
        let colors = decodeURIComponent(readcookies().notecolor).split(";")
        let stylesheet = document.head.appendChild(document.createElement("style")).textContent = `.pp-notes2:nth-child(1) .pp-note { color: #${colors[0]}; background-color: #${colors[0] + "33"}; } .pp-notes2:nth-child(2) .pp-note { color: #${colors[1]}; background-color: #${colors[1] + "33"}; } .pp-notes2:nth-child(3) .pp-note { color: #${colors[2]}; background-color: #${colors[2] + "33"}; } .pp-notes2:nth-child(4) .pp-note { color: #${colors[3]}; background-color: #${colors[3] + "33"}; }`
    }
    else if (document.location.href == "http://gpop.io/create/" || document.location.href == "https://gpop.io/create/" || document.location.href == "http://gpop.io/create" || document.location.href == "https://gpop.io/create")
    {
        let colors = decodeURIComponent(readcookies().notecolor).split(";")
        let stylesheet = document.head.appendChild(document.createElement("style")).textContent = `.pp-notes2:nth-child(1) .pp-note { color: #${colors[0]}; background-color: #${colors[0] + "33"}; } .pp-notes2:nth-child(2) .pp-note { color: #${colors[1]}; background-color: #${colors[1] + "33"}; } .pp-notes2:nth-child(3) .pp-note { color: #${colors[2]}; background-color: #${colors[2] + "33"}; } .pp-notes2:nth-child(4) .pp-note { color: #${colors[3]}; background-color: #${colors[3] + "33"}; }`
    }
    else if (document.location.href == "http://gpop.io/create3/" || document.location.href == "https://gpop.io/create3/" || document.location.href == "http://gpop.io/create3" || document.location.href == "https://gpop.io/create3")
    {
        let colors = decodeURIComponent(readcookies().tokyonotecolor).split(";")
        let stylesheet = document.head.appendChild(document.createElement("style")).textContent = `.pp6 .pp-notes2:nth-child(1) .pp-note { color: #${colors[0]}; background-color: #${colors[0] + "4d"}; } .pp6 .pp-notes2:nth-child(2) .pp-note { color: #${colors[1]}; background-color: #${colors[1] + "4d"}; } .pp6 .pp-notes2:nth-child(3) .pp-note { color: #${colors[2]}; background-color: #${colors[2] + "4d"}; } .pp6 .pp-notes2:nth-child(4) .pp-note { color: #${colors[3]}; background-color: #${colors[3] + "4d"}; } .pp6 .pp-notes2:nth-child(5) .pp-note { color: #${colors[4]}; background-color: #${colors[4] + "4d"}; } .pp6 .pp-notes2:nth-child(6) .pp-note { color: #${colors[5]}; background-color: #${colors[5] + "4d"}; }`
    }
})();