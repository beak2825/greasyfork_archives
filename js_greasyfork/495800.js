// ==UserScript==
// @name         Vimm's Vault ROM Restore
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Restores the "Download" button (and "Play Online" button when applicable) to certain Vimm's Vault games
// @author       KirbyKidJ
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @match        https://vimm.net/vault/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/495800/Vimm%27s%20Vault%20ROM%20Restore.user.js
// @updateURL https://update.greasyfork.org/scripts/495800/Vimm%27s%20Vault%20ROM%20Restore.meta.js
// ==/UserScript==

const theLine = "Download, box art, and screen shots unavailable at the request of Nintendo of America";

if (document.body.innerHTML.indexOf(theLine) != -1) {
    // System Name
    var system;
    var links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        if (links[i].href.endsWith("/A")) {
            system = links[i].href.replace("https://vimm.net/vault/", "");
            system = system.replace("/A", "");
            break;
        }
    }

    // The Button
    var media = allMedia[allMedia.length - 1];
    var buttonHTML = '<table style="width:100%"><tbody><tr id="download-row" style="display: table-row;"><td style="width:33%"></td><td style="width:34%"><form action="https://download' + (system === "Wii" ? 2 : 3) + '.vimm.net/download/" method="POST" id="download_form" onsubmit="return submitDownload(this, &#39;tooltip4&#39;)"><input type="hidden" name="mediaId" value="' + media.ID + '"><input type="hidden" name="alt" value="0" disabled=""><button type="submit" style="width:100%">Download</button></form></td><td style="width:33%; text-align:center" id="download_size">' + media.ZippedText + '</td></tr><tr id="upload-row" style="display:none"><td colspan="3" style="text-align:center"><span class="redBorder">⚠</span> Download unavailable <span class="redBorder">⚠</span><div style="margin-top:10px">Do you have this game?<br><a href=' + document.location.href + '"/?p=upload" onclick="upload(&#39;download_form&#39;); return false">Upload it to The Vault</a></div></td></tr></tbody></table><div style="margin-top:2px">';
    if (system !== "Wii") buttonHTML += '<button type="button" title="Play Online" onclick="location.href=&#39;/vault/?p=play&amp;mediaId=&#39; + document.forms[&#39;download_form&#39;].elements[&#39;mediaId&#39;].value" style="width:33%">Play Online</button>';
    buttonHTML += '</div>';

    // Apply to HTML
    document.body.innerHTML = document.body.innerHTML.replaceAll(allMedia[0].GoodTitle, media.GoodTitle);
    document.body.innerHTML = document.body.innerHTML.replaceAll(allMedia[0].GoodHash.toLowerCase(), media.GoodHash.toLowerCase());
    document.body.innerHTML = document.body.innerHTML.replaceAll(theLine, buttonHTML);
}