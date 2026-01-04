// ==UserScript==
// @name         Power+ Userscript Loader
// @namespace    https://powerplus.app/
// @version      1.2
// @description  An alternate, customizable loader for Power+ (powerplus.app)
// @author       jottocraft
// @license      MIT
// @icon         https://powerplus.app/favicon.png
// @grant        none
// @run-at       document-start
// @match        https://*.instructure.com/*
// @downloadURL https://update.greasyfork.org/scripts/438558/Power%2B%20Userscript%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/438558/Power%2B%20Userscript%20Loader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if ((window.location.pathname === "/power+/") || (window.location.pathname === "/power+")) {
        var s;

        //Check for light or dark theme
        var light = false;
        if (window.localStorage.fluidTheme == "light") {
            light = true;
        } else if (((window.localStorage.fluidTheme == "system") || (window.localStorage.fluidTheme == "auto")) && !window.matchMedia("(prefers-color-scheme: dark)").matches) {
            light = true;
        }

        //Replace canvas 404 page with Power+
        const observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    //Power+ preloader
                    if (node.nodeType === 1 && node.tagName === 'BODY') {
                        node.innerHTML = /*html*/`
                          <div dtps="true" id="dtpsNativeOverlay" style="background-color: inherit; position: fixed; top: 0px; left: 0px; width: 100%; height: 100vh; z-index: 99;text-align: center;z-index: 999;transition: opacity 0.2s;">
                            <img dtps="true" style="height: 100px; margin-top: 132px;" src="${light ? "https://i.imgur.com/0WzWwb1.png" : "https://i.imgur.com/7dDUVh2.png"}" />
		                	        <br dtps="true" />
                            <div dtps="true" class="progress"><div id="dtpsLoadingScreenBar" dtps="true" class="indeterminate"></div></div>
                            <style dtps="true">body {background-color: ${light ? "white" : "#151515"}; --crxElements: ${light ? "#ececec" : "#2b2b2b"}; --crxText: ${light ? "#333" : "#efefef"}; overflow: hidden;}*,:after,:before{box-sizing:border-box}.progress{background:var(--crxElements);position:relative;width:600px;height:5px;overflow:hidden;border-radius:12px;backdrop-filter:opacity(.4);display:inline-block;margin-top:75px}.progress .indeterminate{position:absolute;background:#e3ba4b;height:5px;animation:indeterminate 1.4s infinite;animation-timing-function:linear}@keyframes indeterminate{0%{width:5%;left:-15%}to{width:100%;left:110%}}p{font-family:BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;color: var(--crxText);margin-top: 24px;}</style>
                          </div>
                        `;
                    } else if (node.nodeType === 1 && node.tagName === 'HEAD') {
                        node.innerHTML = /*html*/`
                             <link dtps="true" rel="shortcut icon" href="https://powerplus.app/favicon.png" type="image/png">
                             <meta dtps="true" name="viewport" content="width=device-width, initial-scale=1">
                             <meta dtps="true" charset="utf-8">
                             <title dtps="true">Power+</title>
                             <meta dtps="true" name="description" content="A better UI for Canvas LMS">
                             <meta dtps="true" name="author" content="jottocraft">
                        `;
                    } else if (node.nodeType === 1 && node.tagName === 'SCRIPT' && (node.textContent && node.textContent.includes('"current_user"'))) {
                        //Do nothing for node containing enviornment data for faster load times
                    } else if (node.nodeType === 1 && node.getAttribute("dtps") != "true") {
                        //Node is not added by dtps
                        node.remove();
                    }
                })
            })
        })

        //Start MutationObserver
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        //Get Power+ base URL
        var baseURL = "https://powerplus.app";
        if (window.localStorage.dtpsLoaderPref === "local") {
            baseURL = "http://localhost:2750";
        }

        //Set DTPS loader parameters
        s = document.createElement("script");
        s.textContent = "window.dtpsPreLoader = true;window.dtpsBaseURL = '" + baseURL + "'";
        s.async = false;
        s.setAttribute("dtps", "true");
        document.documentElement.appendChild(s);

        //Load jQuery
        s = document.createElement("script");
        s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
        s.async = false;
        s.setAttribute("dtps", "true");
        document.documentElement.appendChild(s);

        //Wait for page to load
        window.onload = function () {
            //Stop observer
            observer.disconnect();

            //Determine LMS script to load
            var lmsScript = null;
            if (window.location.hostname.startsWith("dtechhs")) {
                lmsScript = "dtech";
            } else {
                lmsScript = "canvas";
            }

            //Check for debugging LMS overrides
            if (window.localStorage.dtpsLMSOverride) lmsScript = window.localStorage.dtpsLMSOverride;

            //Add script to DOM
            s = document.createElement("script");
            s.src = baseURL + "/scripts/lms/" + lmsScript + ".js";
            s.async = false;
            s.setAttribute("dtps", "true");
            document.documentElement.appendChild(s);
            s.onerror = function () {
                //Couldn't load debugging script, fallback to production
                if (window.localStorage.dtpsLoaderPref && (window.localStorage.dtpsLoaderPref !== "prod")) {
                    console.log("[DTPS CHROME] Failed to load debugging script. Falling back to production.");
                    window.localStorage.dtpsLoaderPref = "prod";
                    window.location.reload();
                } else {
                    document.getElementById("dtpsLoadingScreenBar").style.animationPlayState = "paused";
                    document.getElementById("dtpsLoadingScreenStatus").innerText = "Could not load Power+. Please try again later.";
                }
            };
        }
    } else {
        var releaseType = null;
        if (window.localStorage.dtpsLoaderPref == "local") releaseType = "Power+ (local)";

        const observer = new MutationObserver(mutations => {
            mutations.forEach(({ addedNodes }) => {
                addedNodes.forEach(node => {
                    //Power+ button
                    if (node.nodeType === 1 && node.id == "menu") {
                        node.insertAdjacentHTML("beforeend", /*html*/`
                          <li class="menu-item ic-app-header__menu-list-item ">
                            <a id="global_nav_dtps_link" role="button" href="/power+/" class="ic-app-header__menu-list-link">
                              <div class="menu-item-icon-container" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" class="ic-icon-svg ic-icon-svg--dtps" version="1.1" viewBox="0 0 48 63.999"><path d="m5.333 0c-2.946 0-5.333 2.4-5.333 5.333v48c0 2.933 2.388 5.333 5.333 5.333h5.333v5.333l6.667-5.333 6.667 5.333v-5.333h18.667c2.947 0 5.333-2.4 5.333-5.333v-2.667c0 2.933-2.387 5.333-5.333 5.333h-18.667v-5.333h-13.333v5.333h-4c-2.209 0-4-1.867-4-4 0-2.4 1.791-4 4-4h36c2.947 0 5.333-2.4 5.333-5.333v-37.333c0-2.933-2.387-5.333-5.333-5.333h-37.333z"/></svg>
                              </div>
                              <div class="menu-item__text">${releaseType || "Power+"}</div>
                            </a>
                          </li>
                        `);
                    }
                })
            })
        })

        // Starts the monitoring
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        })
    }
})();