// ==UserScript==
// @name         VidLii video downloader
// @namespace    https://greasyfork.org/users/1259797
// @version      2024-02-12
// @description  Download VidLii videos
// @author       PsychopathicKiller77
// @match        https://www.vidlii.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vidlii.com
// @grant        GM_addStyle
// @grant        GM_download
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487046/VidLii%20video%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/487046/VidLii%20video%20downloader.meta.js
// ==/UserScript==

const para = document.createElement("a");
para.href = "javascript:void(0)";
const img = document.createElement("img");
img.src = "/img/uaa1.png";
para.appendChild(img);
para.innerHTML += "Download";
if (document.getElementsByClassName("w_lnks").length > 0) {
    GM_addStyle(`.w_lnks a {
  width: 19%;
}`);
    para.addEventListener("click", function() {
        var src = document.getElementsByTagName("video")[0].src;
        var split = src.split(".");
        para.innerHTML = "Downloading";
        GM_download({
            url: src,
            name: document.getElementsByClassName("w_title")[0].textContent.trim().replace(/[/\/:*?"<>|]/gi, '_') + "." + split[split.length - 1],
            saveAs: false,
            conflictAction: "prompt",
            onload: function() { para.innerHTML = "Downloaded"; },
            onerror: function() { para.innerHTML = "Failed"; },
            ontimeout: function() { para.innerHTML = "Failed"; }
        });
    });
    document.getElementsByClassName("w_lnks")[0].insertBefore(para, document.getElementsByClassName("w_lnks")[0].firstChild);
} else if (document.getElementsByClassName("pr_tp_pl_nav").length > 0) {
    var eventadded = false;
    para.addEventListener("click", function() {
        if (!eventadded) {
            const observer = new MutationObserver(() => {
                para.innerHTML = "";
                para.appendChild(img);
                para.innerHTML += "Download";
            });
            observer.observe(document.getElementsByTagName("video")[0], {
                attributes: true,
                attributeFilter: ['src']
            });
        }
        var src = document.getElementsByTagName("video")[0].src;
        var split = src.split(".");
        para.innerHTML = "Downloading";
        GM_download({
            url: src,
            name: document.getElementById("pl_inf").firstChild.textContent.replace(/[/\/:*?"<>|]/gi, '_') + "." + split[split.length - 1],
            saveAs: false,
            conflictAction: "prompt",
            onload: function() { para.innerHTML = "Downloaded"; },
            onerror: function() { para.innerHTML = "Failed"; },
            ontimeout: function() { para.innerHTML = "Failed"; }
        });
    });
    document.getElementsByClassName("pr_tp_pl_nav")[0].insertBefore(para, document.getElementsByClassName("pr_tp_pl_nav")[0].children[0]);
}