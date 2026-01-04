// ==UserScript==
// @name         Restore App Bar
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Restores the appbar used in the classic Hitchhiker YouTube layout
// @author       BowDown097 and whoever made it originally
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/482137/Restore%20App%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/482137/Restore%20App%20Bar.meta.js
// ==/UserScript==

if (typeof GM_addStyle !== "function") {
    function GM_addStyle(css) {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        const head = document.getElementsByTagName('head')[0];
        if (head) head.appendChild(style);
        else document.documentElement.appendChild(style);
    }
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    });
}

function navigate(url, browseId) {
    document.querySelector("ytd-app").insertAdjacentHTML("beforeend", '<ytd-guide-entry-renderer class="ytd-guide-entry-renderer navigateTemp"></ytd-guide-entry-renderer>');
    document.querySelector(".navigateTemp").data = {};
    document.querySelector(".navigateTemp").data.navigationEndpoint = {
        "clickTrackingParams": "CJEBELUsGAIiEwi3y-qlp9bxAhVchuUHHSLSCts=",
        "commandMetadata": {
            "webCommandMetadata": {
                "url": url,
                "webPageType": "WEB_PAGE_TYPE_BROWSE",
                "rootVe": 6827,
                "apiUrl": "/youtubei/v1/browse"
            }
        },
        "browseEndpoint": {
            "browseId": browseId
        }
    };
    document.querySelector(".navigateTemp").click();
    document.querySelector(".navigateTemp").remove();
}

function navBar() {
    const hasMyChannel = document.querySelector("#items > ytd-guide-entry-renderer:nth-child(2) .guide-icon").getComputedStyleValue("content") == "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAOFJREFUeJztlL0Ng0AMhWlSZ5QMkU0o6KjpIlLAHSNkgkyQLbICA6RPT/hEAk8WxwWJKoolS5Z/3vnZhiT5y0cuvtiXZXny3t/run6i2PiIrQKrqvPROdf22gW0JWcN2FhMV3mRH1BsjUVBoaKd9TQ7pYeNTztdpM98tAPmZnPwaQ41QUBLaaDl0mkcLrVxaoKA9nUtmnssxCIG2DZNc0PnNr8IqF0AwGZtDr43eJyyLOWRZdkulEeMnOhS9Gx0GVZkOctnMyRPh93P5wpFOkKx8X192AZ0m09P6W/2c/hteQFIL1T2NRIk0wAAAABJRU5ErkJggg==\")";
    let headers = [{
        text: document.querySelector("ytd-guide-entry-renderer:first-child yt-formatted-string").innerHTML
    }, {
        text: hasMyChannel ? document.querySelector("ytd-guide-entry-renderer:nth-child(3) yt-formatted-string").innerHTML : document.querySelector("ytd-guide-entry-renderer:nth-child(2) yt-formatted-string").innerHTML
    }, {
        text: hasMyChannel ? document.querySelector("ytd-guide-entry-renderer:nth-child(5) yt-formatted-string").innerHTML : document.querySelector("ytd-guide-entry-renderer:nth-child(4) yt-formatted-string").innerHTML
    }];
    
    let appbar = document.createElement("div");
    let appbarNav = document.createElement("ul");
    
    for (const header of headers)
    {
        let item = document.createElement("li");
        let text = document.createElement("span");
        text.href = header.href;
        text.innerHTML = header.text;
        item.appendChild(text);
        appbarNav.appendChild(item);
    }
    
    let home = document.querySelector(`ytd-browse[role="main"][page-subtype="home"]`);
    let trending = document.querySelector(`ytd-browse[role="main"][page-subtype="trending"]`);
    let subscriptions = document.querySelector(`ytd-browse[role="main"][page-subtype="subscriptions"]`);
    
    home?.appendChild(appbar).appendChild(appbarNav);
    trending?.appendChild(appbar).appendChild(appbarNav);
    subscriptions?.appendChild(appbar).appendChild(appbarNav);
    
    appbar.className = "ytcp-main-appbar";
    appbarNav.className = "ytcp-appbar-nav";
    appbarNav.childNodes[0].className = "ytcp-nav-home ytcp-nav-item";
    appbarNav.childNodes[1].className = "ytcp-nav-trending ytcp-nav-item";
    appbarNav.childNodes[2].className = "ytcp-nav-subs ytcp-nav-item";
    
    appbarNav.childNodes[0].addEventListener("click", () => navigate("/", "FEwhat_to_watch"));
    appbarNav.childNodes[1].addEventListener("click", () => navigate("/feed/trending", "FEexplore"));
    appbarNav.childNodes[2].addEventListener("click", () => navigate("/feed/subscriptions", "FEsubscriptions"));
}

function setupNavbar() {
    if (!["/", "/feed/trending", "/feed/subscriptions"].includes(window.location.pathname)) return;
    waitForElement("ytd-guide-entry-renderer").then(() => navBar());
    document.querySelector("[hidden] .ytcp-main-appbar")?.remove();
}

(function() {
    'use strict';
    window.addEventListener("yt-page-data-updated", setupNavbar, false);
    GM_addStyle(`
.ytcp-main-appbar {
    margin: -12px;
	width: 100%;
	text-align: center;
	line-height: 40px;
	height: 40px;
	border-bottom: 1px solid #e8e8e8;
	border-left: 1px solid #e8e8e8;
	background-color: #fff;
	position: fixed;
	z-index: 2001;
	font-size: 13px;
	font-family: Roboto, arial, sans-serif;
}

html:not([dark]) .ytcp-nav-item {
	display: inline-block;
	margin-left: 30px;
}

html:not([dark]) .ytcp-nav-item span {
	display: inline-block;
	color: #666;
	text-decoration: none;
	cursor: pointer;
}

html:not([dark]) .ytcp-nav-item span:hover {
	box-shadow: inset 0 -3px #cc181e;
}

html:not([dark]) [page-subtype="home"] .ytcp-nav-home span,
html:not([dark]) [page-subtype="subscriptions"] .ytcp-nav-subs span,
html:not([dark]) [page-subtype="trending"] .ytcp-nav-trending span {
	box-shadow: inset 0 -3px #cc181e;
	color: #333;
}

html:not([dark]) .ytcp-appbar-nav {
	display: inline-block;
	vertical-align: top;
	overflow: hidden;
}

html[dark] .ytcp-main-appbar {
	width: 100%;
	text-align: center;
	line-height: 40px;
	height: 40px;
	background-color: var(--yt-spec-brand-background-primary);
    border-bottom: 1px solid var(--yt-spec-10-percent-layer);
    border-left: 1px solid var(--yt-spec-10-percent-layer);
	position: fixed;
	z-index: 2001;
	font-size: 13px;
	font-family: Roboto, arial, sans-serif;
	box-shadow: inset 0 1px #0f0f0f;
}

html[dark] .ytcp-nav-item {
	display: inline-block;
	margin-left: 30px;
}

html[dark] .ytcp-nav-item span {
	display: inline-block;
	color: #8f8f8f;
	text-decoration: none;
	cursor: pointer;
}

html[dark] .ytcp-nav-item span:hover {
	box-shadow: inset 0 -3px #dcdcdc;
}

html[dark] [page-subtype="home"] .ytcp-nav-home span,
html[dark] [page-subtype="subscriptions"] .ytcp-nav-subs span,
html[dark] [page-subtype="trending"] .ytcp-nav-trending span {
	box-shadow: inset 0 -3px #dcdcdc;
	color: #c1c1c1;
}

html[dark] .ytcp-appbar-nav {
	display: inline-block;
	vertical-align: top;
	overflow: hidden;
}

.ytcp-load-more-button {
	margin: 20px auto;
	display: block;
	height: 28px;
	border-radius: 2px;
	cursor: pointer;
	font: 11px Roboto, arial, sans-serif;
	padding: 0 10px;
	font-weight: 500;
	outline: 0;
}

.ytcp-load-more-button.ytcp-related {
	margin: 0 auto !important;
}

html:not([dark]) .ytcp-load-more-button {
	border: 1px solid #d3d3d3;
	box-shadow: 0 1px 0 rgba(0, 0, 0, .05);
	background-color: #f8f8f8;
	color: #333;
}

html:not([dark]) .ytcp-load-more-button:hover {
	border-color: #c6c6c6;
	background-color: #f0f0f0;
	box-shadow: 0 1px 0 rgba(0, 0, 0, .1);
}

html:not([dark]) .ytcp-load-more-button:active {
	border-color: #c6c6c6;
	background-color: #e9e9e9;
	box-shadow: inset 0 1px 0 #ddd;
}

html[dark] .ytcp-load-more-button {
	border: 0;
	background-color: #2e2e2e;
	color: #c1c1c1;
}

html[dark] .ytcp-load-more-button:hover {
	background-color: #353535;
}

html[dark] .ytcp-load-more-button:active {
	background-color: #292929;
}

[page-subtype="home"] ytd-two-column-browse-results-renderer,
[page-subtype="trending"] ytd-two-column-browse-results-renderer,
[page-subtype="subscriptions"] ytd-two-column-browse-results-renderer,
[page-subtype="trending"] tp-yt-app-header {
	margin-top: 60px !important;
}`);
})();