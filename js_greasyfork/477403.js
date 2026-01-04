// ==UserScript==
// @name        Blur on inactivity Extended
// @description https://greasyfork.org/en/scripts/466065-blur-on-inactivity with additional features
// @author      Sadulisten @ Greasyfork
// @author      Schimon Jehudah, Adv.
// @namespace   Sadulisten
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @exclude     devtools://*
// @match       *://*/*
// @version     25
// @run-at      document-end
// @grant       GM_addStyle
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5al77iPPC90ZXh0Pjwvc3ZnPgo=
// @downloadURL https://update.greasyfork.org/scripts/477403/Blur%20on%20inactivity%20Extended.user.js
// @updateURL https://update.greasyfork.org/scripts/477403/Blur%20on%20inactivity%20Extended.meta.js
// ==/UserScript==

let sessionBlurDisabled = false;
let originalPageTitle = document.title;
let originalFaviconSource = getFavicon();
const originalFilter = document.body.style.filter;
const blurIntensity = 75;
const inactivityThresholdSeconds = 60;
const inactivityThresholdMiliseconds = inactivityThresholdSeconds * 1000;
let isBlurred = false;

function getFavicon() {
    var favicon = undefined;
    var nodeList = document.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++)
    {
        if((nodeList[i].getAttribute("rel") == "icon")||(nodeList[i].getAttribute("rel") == "shortcut icon"))
        {
            favicon = nodeList[i].getAttribute("href");
            break;
        }
    }
    if (favicon == undefined) return null;
    let isRelative = !favicon.includes("http");
    if (isRelative) favicon = (location.protocol == "https:" ? "https://www." : "http://www.") + window.location.hostname + favicon;
    return favicon;
}
function _changeFavicon(src) {
    var link = document.createElement('link'),
        oldLink = document.getElementById('dynamic-favicon');
    if (!oldLink) { oldLink = document.querySelector('link[rel*="icon"]');}
    link.id = 'dynamic-favicon';
    link.rel = 'shortcut icon';
    link.href = src;
    if (oldLink) {
        //document.head.removeChild(oldLink);
        oldLink.href = src;
    }
    document.head.appendChild(link);
}

function changeFavicon(newFaviconUrl) {
    let currentFaviconElement = document.querySelector('link[rel*="icon"]');
    if (currentFaviconElement) {
        currentFaviconElement.href = newFaviconUrl;
        if (!currentFaviconElement.hasAttribute("id"))
            currentFaviconElement.setAttribute("id", "dynamic-favicon");
    }
    else {
        var newFaviconElement = document.createElement('link');
        newFaviconElement.rel = "shortcut icon";
        newFaviconElement.id = "dynamic-favicon";
        newFaviconElement.href = newFaviconUrl;

        let head = document.getElementsByTagName("head")[0];
        if (!head) { document.head.insertBefore(newFaviconElement, document.head.firstChild); }
        else { head.insertBefore(newFaviconElement, head.firstChild); }
    }
}
function clamp(num, min, max) {
  return num <= min
    ? min
    : num >= max
      ? max
      : num
}
function addUnblurButton() {
    const btn = document.createElement("button");
    btn.id = blurButtonId;
    btn.innerHTML = "<span>👀</span>";
    btn.onclick = function() {
        document.querySelector("body").classList.remove("preventClicks");
        document.body.style.filter = originalFilter;
        blurButton.style.display = "none";
        blurCss.remove();
        blurCss = null;
        document.title = originalPageTitle;
        changeFavicon(originalFaviconSource);
        isBlurred = false;
    }

    GM_addStyle(
       `#${blurButtonId}
        {
            z-index:9999 !important;
            position:fixed !important;

            /*
            bottom:10px;
            right:10px;
            */
            top:50% !important;
            left:47% !important;

            display: none;
            box-shadow:inset 0px 1px 0px 0px #cf866c;
	        background:linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
	        background-color:#d0451b;
            color:#ffffff;
	        border-radius:3px;
	        border:1px solid #942911;
	        cursor:pointer;
	        font-family:Arial;
	        font-size:13px;
	        padding:6px 24px;
	        text-decoration:none;
	        text-shadow:0px 1px 0px #854629;
        }
        #${blurButtonId}:hover
        {
            background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
	        background-color:#bc3315;
        }
        #${blurButtonId}:hover:after
        {
            content: " Unblur Page";
        }
      `
    );
    document.body.appendChild(btn);
    return btn;
}
function addBlurNowButton() {
    const borderRadius = 12;
    const clickArea = document.createElement("div");
    const blurNowStyleButtonName = "blurNowButtonStyle";
    clickArea.id = unBlurButtonId;
    clickArea.title = "Blur the page now";
    clickArea.innerHTML = "<p style='text-align:center;color:white;margin-top:5px;'>😈</p>";

    GM_addStyle(
        `.${blurNowStyleButtonName} {
            position:fixed !important;
            bottom:0px !important;
            right:10px !important;
            width:50px !important;
            height:25px !important;
            -webkit-border-top-left-radius: ${borderRadius}px;
            -webkit-border-top-right-radius: ${borderRadius}px;
            -moz-border-radius-topleft: ${borderRadius}px;
            -moz-border-radius-topright: ${borderRadius}px;
            border-top-left-radius: ${borderRadius}px;
            border-top-right-radius: ${borderRadius}px;
            box-shadow:inset 0px 1px 0px 0px #cf866c;
	        background:linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
	        background-color:#d0451b;
            transition: height 1s;
            z-index:9999 !important;
            text-decoration:none;
	        text-shadow:0px 1px 0px #854629;
        }

        .${blurNowStyleButtonName}:hover {
            background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
	        background-color:#bc3315;
            height:30px !important;
            cursor:pointer;
        }`);

    clickArea.classList.add("blurNowButtonStyle");
    document.body.appendChild(clickArea);
    clickArea.onclick = function() {
        blurPage();
    }
    return clickArea;
}

function addDontBlurThisSessionButton() {
    const borderRadius = 12;
    const clickArea = document.createElement("div");
    const dontBlurThiSessionButtonStyle = "dontBlurThiSessionButtonStyle";
    clickArea.id = unBlurButtonId;
    clickArea.title = "This will disable bluring for this tab";
    clickArea.innerHTML = '<p id="text" style="text-align:center;color:white;margin-top:5px;">⏸️</p>';

    GM_addStyle(
        `.${dontBlurThiSessionButtonStyle} {
            position:fixed !important;
            bottom:0px !important;
            right:65px !important;
            width:50px !important;
            height:25px !important;
            -webkit-border-top-left-radius: ${borderRadius}px;
            -webkit-border-top-right-radius: ${borderRadius}px;
            -moz-border-radius-topleft: ${borderRadius}px;
            -moz-border-radius-topright: ${borderRadius}px;
            border-top-left-radius: ${borderRadius}px;
            border-top-right-radius: ${borderRadius}px;
            box-shadow:inset 0px 1px 0px 0px #cf866c;
	        background:linear-gradient(to bottom, #d0451b 5%, #bc3315 100%);
	        background-color:#d0451b;
            transition: height 1s;
            z-index:9999 !important;
            text-decoration:none;
	        text-shadow:0px 1px 0px #854629;
        }

        .${dontBlurThiSessionButtonStyle}:hover {
            background:linear-gradient(to bottom, #bc3315 5%, #d0451b 100%);
	        background-color:#bc3315;
            height:30px !important;
            cursor:pointer;
        }`);

    clickArea.classList.add(dontBlurThiSessionButtonStyle);
    document.body.appendChild(clickArea);
    clickArea.onclick = function() {
        sessionBlurDisabled = !sessionBlurDisabled;
        dontBlurThisSessionButton.title = sessionBlurDisabled ? "This will enable bluring for this tab" : "This will disable bluring for this tab";
        dontBlurThisSessionButton.querySelector("#text").innerText = sessionBlurDisabled ? "▶️" : "⏸️";
    }
    return clickArea;
}

const blurButtonId = "unblurButton";
const unBlurButtonId = "blurNowButton";
const blurButton = addUnblurButton();
var blurCss = null;
const unBlurButton = addBlurNowButton();
const dontBlurThisSessionButton = addDontBlurThisSessionButton();

function blurPage() {
    if (isBlurred) return;

    if (blurCss == null) {
        blurCss = GM_addStyle(
            `body > *:not(#${blurButtonId}) {
                filter: blur(${clamp(blurIntensity, 1, 100)}px) !important;
                pointer-events: none !important;
            }`
        );
    }

    blurButton.style.display = "block";
    originalPageTitle = document.title;
    document.title = "Cute Kittens - Google Search";
    changeFavicon("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://google.com&size=128");
    isBlurred = true;
}

onInactive(inactivityThresholdMiliseconds, function () {
    if (sessionBlurDisabled) return;
    blurPage();
});

function onInactive(ms, cb) {
  var wait = setInterval(cb, ms);
  window.ontouchstart = 
  window.ontouchmove = 
  window.onmousemove = 
  window.onmousedown = 
  window.onmouseup = 
  window.onwheel = 
  window.onscroll = 
  window.onkeydown = 
  window.onkeyup = 
  window.onfocus = 
  function () {
    clearInterval(wait);
    wait = setInterval(cb, ms);
  };
}
