// ==UserScript==
// @name         medium bypass
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  bypass medium paywall by using archive.is
// @author       The DT
// @match        https://*/*
// @icon         https://github.com/thedtvn/thedtvn/raw/main/trace.svg?raw=true
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/505072/medium%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/505072/medium%20bypass.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // archive.is Part
    if (location.href.match(/^https?:\/\/archive\.is\/[a-zA-Z0-9]{5}/)) {
        let container = document.body;
        let clone_div = document.getElementById("CONTENT");
        let clone_input_header = document.querySelector('[name="q"]');
        console.log(clone_input_header);
        for (let i of document.querySelectorAll("a")) {
            if (i.href.startsWith("https://archive.is/o/")) {
                i.href = i.href.replace(/^https?:\/\/archive\.is\/o\/[a-zA-Z0-9]{5}\//, "");
            }
            i.removeAttribute("target");
        }
        container.innerHTML = "";
        clone_div.style = "";
        clone_input_header.style = "text-align: center;"
        clone_input_header.style.width = "100%";
        container.style = "overflow-x: hidden; margin: 0px;"
        container.insertBefore(clone_div, container.firstChild);
        container.insertBefore(clone_input_header, container.firstChild);
        document.getElementById("hashtags").remove()
        let dialog_box = document.querySelector('[role="dialog"]');
        if (!dialog_box) return
        dialog_box.remove()
        return
    }

    // Medium Part
    function check_is_pre() {
        let elm = document.querySelector('[type="application/ld+json"]');
        if (!elm) return false
        let json_data_str = elm.innerText;
        let json_data = JSON.parse(json_data_str);
        return !json_data.isAccessibleForFree;
    }
    function check() {
        let is_pre = check_is_pre();
        if (!is_pre) return
        let pageurl = location.href;
        let url_obj = new URL("https://archive.is/submit/");
        url_obj.searchParams.set("submitid", "");
        url_obj.searchParams.set("url", pageurl);
        location.replace(url_obj.href);
    }
    let is_site_meta = document.querySelector('meta[property="og:site_name"]');
    if (!is_site_meta) return
    let is_medium = is_site_meta.content == "Medium";
    if (!is_medium) return
    window.addEventListener("load", check);
    window.addEventListener("pushState", async (event) => {
        await new Promise(r => setTimeout(r, 1000));
        check()
    });
})();