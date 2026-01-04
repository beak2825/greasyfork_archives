// ==UserScript==
// @name         gpop hitsound
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  add hitsounds to gpop
// @author       Commensalism
// @match        http*://gpop.io/settings
// @match        http*://gpop.io/settings/
// @match        http*://gpop.io/play/*
// @match        http*://gpop.io/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gpop.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457312/gpop%20hitsound.user.js
// @updateURL https://update.greasyfork.org/scripts/457312/gpop%20hitsound.meta.js
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
                <div class="settingspage-section-title">Classic Mode: Hitsounds <span style="background: linear-gradient(to right, #8803fc, #ff0090); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 1.25em;">MOD</span></div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Hit sound:</div>
                    <input id="setting-s-h">
                </div>
                <div class="settingspage-section-row">
                    <div class="settingspage-section-row-1">Miss sound:</div>
                    <input id="setting-s-m">
                </div>
                <div class="settingspage-section-note">Note: Use direct audio links<br>See audio compatibility table <a target="_blank" rel="noopener noreferrer" href="https://en.wikipedia.org/wiki/HTML5_audio#Supported_audio_coding_formats">here</a><br>Made by <a href="https://gpop.io/profile/@Commensalism" style="background: linear-gradient(to right, #8803fc, #ff0090); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">@Commensalism</a></div>
            </div>`
        document.querySelector("#settings-save").addEventListener("click", function() {document.cookie = "hitsound=" + encodeURIComponent(document.querySelector("#setting-s-h").value) + "; path=/; max-age=9999999"
                                                                                       document.cookie = "misssound=" + encodeURIComponent(document.querySelector("#setting-s-m").value) + "; path=/; max-age=9999999"})
        document.querySelector("#setting-s-h").value = decodeURIComponent(readcookies().hitsound)
        document.querySelector("#setting-s-m").value = decodeURIComponent(readcookies().misssound)
    }
    else if (document.location.href.startsWith("http://gpop.io/play/") || document.location.href.startsWith("https://gpop.io/play/") || document.location.href.startsWith("http://gpop.io/room/") || document.location.href.startsWith("https://gpop.io/room/"))
    {
        let prevscore = 0
        let hitsoundurl = decodeURIComponent(readcookies().hitsound)
        let misssoundurl = decodeURIComponent(readcookies().misssound)
        document.addEventListener("keydown", function(e)
                                  {
            //if (e.code == 65 && e.code == 83 && e.code == 75 && e.code == 76)
            //{
            let newscore = _$W.score
            if (newscore > prevscore)
            {
                let audio = new Audio(hitsoundurl);
                audio.play();
            }
            else if (newscore < prevscore)
            {
                let audio = new Audio(misssoundurl);
                audio.play();
            }
            prevscore = newscore
            //}
        })
    }
})();