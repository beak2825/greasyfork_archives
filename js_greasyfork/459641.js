// ==UserScript==
// @name         New Bing in Google Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Bing AI results to Google Search results page
// @author       agou
// @license      MIT
// @match        https://www.google.com*/search*
// @match        https://www.bing.com*/search*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459641/New%20Bing%20in%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/459641/New%20Bing%20in%20Google%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // if is search results page
    let urlHost = window.location.hostname;
    if (urlHost.includes("google")) {
        if (window.location.href.includes("search")) {
            // get query
            let query = window.location.href.split("q=")[1].split("&")[0];
            // request bing search results
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.bing.com/search?q=" + query,
                onload: function (response) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, "text/html");
                    if (doc.querySelector("#b_wpt_bg") != null) {
                        let iframe = document.createElement("iframe");
                        iframe.className = "bingIframe";
                        iframe.src = "https://www.bing.com/search?agouchatgpt&q=" + query;
                        let style = document.createElement("style");
                        if (doc.querySelector("aside #b_wpt_bg") == null) {
                            style.innerHTML = `.bingIframe {
                            width: calc(100% + 400px);
                            margin-left: -20px;
                            min-height: 565px;
                            border: none;
                        }`;
                            document.head.appendChild(style);
                            let atvcap = document.querySelector("#taw");
                            atvcap.appendChild(iframe);
                        }
                        else {
                            if (document.querySelector("#rcnt > div:nth-child(2)") == null) {
                                let div = document.createElement("div");
                                div.className = "TQc1id rhstc4";
                                div.id = "rhs";
                                div.setAttribute("jscontroller", "cSX9Xe");
                                div.setAttribute("data-pws", "1300");
                                div.setAttribute("data-spe", "true");
                                div.setAttribute("jsaction", "rcuQ6b:npT2md");
                                div.setAttribute("jsdata", "MdeVKb;_;AVqDoQ");
                                div.setAttribute("role", "complementary");
                                div.setAttribute("data-hveid", "CAgQAA");
                                div.appendChild(iframe);
                                document.querySelector("#rcnt").appendChild(div);
                            }
                            style.innerHTML = `.bingIframe {
                            width: 100%;
                            min-height: 565px;
                            border: none;
                        }`;
                            document.head.appendChild(style);
                            let div2 = document.querySelector("#rcnt > div:nth-child(2)");
                            div2.appendChild(iframe);
                        }
                    }
                }
            });
        }
    }
    else if (urlHost.includes("bing")) {
        if (window.location.href.includes("agouchatgpt")) {
            if (document.querySelector("#b_wpt_bg") != null) {
                console.log("bing chatgpt");
                let style = document.createElement("style");
                style.innerHTML = `
                    html, body {
                        overflow: hidden!important;
                    }
                    #b_syd_sm_chat {
                        position: fixed!important;
                        top: 0!important;
                        bottom: 0!important;
                        left: 0!important;
                        right: 0!important;
                        overflow: auto!important;
                        z-index: 9999999999999999!important;
                        background-color: #fff!important;
                    }`;
                document.head.appendChild(style);
            }
        }
    }
})();