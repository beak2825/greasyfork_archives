// ==UserScript==
// @name         HF ezTrust
// @namespace    http://hackforums.net/member.php?action=profile&uid=2525478
// @version      0.7
// @description  Loads the trust scan for users when their reputation is hovered over.
// @author       TyrantKingBen
// @include      *hackforums.net/showthread.php?tid=*
// @include      *hackforums.net/private.php?action=read*
// @include      *hackforums.net/usercp.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/17260/HF%20ezTrust.user.js
// @updateURL https://update.greasyfork.org/scripts/17260/HF%20ezTrust.meta.js
// ==/UserScript==

var hoverTime = GM_getValue("ezTrust hoverTime", 1000);
var trustScanTableBackground = GM_getValue("ezTrust trustScanTableBackground", "#00FFFF");
var trustScanTableWidth = GM_getValue("ezTrust trustScanTableWidth", 480);
var trustScanTableTopOffset = GM_getValue("ezTrust trustScanTableTopOffset", 0);
var trustScanTableLeftOffset = GM_getValue("ezTrust trustScanTableLeftOffset", -480);

var page = document.location.href.split(".net/")[1].split(".php")[0];

if (page == "showthread" || page == "private") {
    var pai = document.getElementsByClassName("smalltext post_author_info");

    for (var i = 0; i < pai.length; i++) {
        (function () {
            var links = pai[i].getElementsByTagName("a");
            var repLink = null;

            for (var j = 0; j < links.length; j++) {
                if (links[j].href.indexOf("reputation.php") >= 0) {
                    repLink = links[j];
                    break;
                }
            }

            if (repLink == null) return;

            var info = pai[i];
            var UID = repLink.href.split("uid=")[1];
            var timeout;

            var mouseEnter = function() {
                timeout = setTimeout(function() { trustScan(UID, info); }, hoverTime);
            };
            var mouseLeave = function() {
                clearTimeout(timeout);
            };

            repLink.addEventListener("mouseenter", mouseEnter);
            repLink.addEventListener("mouseleave", mouseLeave);
        }());
    }
} else if (page == "usercp") {
    var menu = document.getElementsByClassName("thead")[0].parentNode.parentNode;
    var settingsRow = menu.children[1].clone(true);
    var settingsLink = menu.getElementsByTagName("a")[0];

    settingsLink.href = "";
    settingsLink.className = "usercp_nav_item";
    settingsLink.style.background = "url(http://i.imgur.com/Usbu7eb.png) no-repeat left center";
    settingsLink.innerHTML = "HF ezTrust Settings";

    menu.insertBefore(settingsRow, menu.children[1]);

    var modalContainer = document.createElement("div");

    modalContainer.style.color = "#cccccc";
    modalContainer.style.position = "fixed";
    modalContainer.style.fontFamily = "Arial, Helvetica, sans-serif";
    modalContainer.style.top = "0px";
    modalContainer.style.right = "0px";
    modalContainer.style.bottom = "0px";
    modalContainer.style.left = "0px";
    modalContainer.style.background = "rgba(0, 0, 0, 0.8)";
    modalContainer.style.zIndex = "8888888";
    modalContainer.style.opacity = 0;
    modalContainer.style.WebkitTransition = "opacity 400ms ease-in";
    modalContainer.style.MozTransition = "opacity 400ms ease-in";
    modalContainer.style.transition = "opacity 400ms ease-in";
    modalContainer.style.pointerEvents = "none";

    var modal = document.createElement("div");

    modal.style.width = "400px";
    modal.style.position = "relative";
    modal.style.margin = "10% auto";
    modal.style.padding = "5px 20px 13px 20px";
    modal.style.borderRadius = "10px";
    modal.style.backgroundColor = "#072948";
    modal.style.cursor = "default";
    modal.style.MozUserSelect = "none";
    modal.style.webkitUserSelect = "none";
    modal.style.msUserSelect = "none";
    modal.style.textAlign = "left";

    var modalExit = document.createElement("div");

    modalExit.style.background = "#606061";
    modalExit.style.color = "black";
    modalExit.style.lineHeight = "25px";
    modalExit.style.position = "absolute";
    modalExit.style.right = "-12px";
    modalExit.style.textAlign = "center";
    modalExit.style.top = "-10px";
    modalExit.style.width = "24px";
    modalExit.style.textDecoration = "none";
    modalExit.style.fontWeight = "bold";
    modalExit.style.webkitBorderRadius = "12px";
    modalExit.style.MozBorderRadius = "12px";
    modalExit.style.borderRadius = "12px";
    modalExit.style.MozBoxShadow = "1px 1px 3px #000";
    modalExit.style.webkitBoxShadow = "1px 1px 3px #000";
    modalExit.style.boxShadow = "1px 1px 3px #000";
    modalExit.style.cursor = "pointer";
    modalExit.style.MozUserSelect = "none";
    modalExit.style.webkitUserSelect = "none";
    modalExit.style.msUserSelect = "none";

    modalExit.innerHTML = "X";
    modal.innerHTML = "<span style='text-align: center; display: block; font-weight: bold; font-size: 1.5em'>HF ezTrust Settings</span>\
<table><tr><td>Hover Time:</td><td><input type='textbox' size='" + hoverTime.toString().length + "' value='" + hoverTime + "' /></td></tr>\
<tr><td>Trust Scan Border Color:</td><td><input type='textbox' size='7' value='" + trustScanTableBackground + "' /></td></tr>\
<tr><td>Trust Scan Width:</td><td><input type='textbox' size='" + trustScanTableWidth.toString().length + "' value='" + trustScanTableWidth + "' /></td></tr>\
<tr><td>Trust Scan Top Offset:</td><td><input type='textbox' size='" + trustScanTableTopOffset.toString().length + "' value='" + trustScanTableTopOffset + "' /></td></tr>\
<tr><td>Trust Scan Left Offset:</td><td><input type='textbox' size='" + trustScanTableLeftOffset.toString().length + "' value='" + trustScanTableLeftOffset + "' /></td></tr></table>";

    var inputs = modal.getElementsByTagName("input");

    for (var i = 0; i < inputs.length; i++) {
        inputs[i].style.backgroundColor = "#072948";
        inputs[i].style.borderColor = "transparent";
        inputs[i].style.color = "#FF00E9";
        inputs[i].style.outline = "none";
    }

    var resetButton = document.createElement("button");
    resetButton.style.backgroundColor = "#606061";
    resetButton.style.borderColor = "#606061";
    resetButton.style.marginLeft = "calc(50% - 27px)";
    resetButton.style.width = "54px";
    resetButton.style.outline = "none";

    resetButton.innerHTML = "Reset";

    modal.appendChild(resetButton);
    modal.appendChild(modalExit);
    modalContainer.appendChild(modal);
    document.body.appendChild(modalContainer);

    var settingsClick = function(event) {
        event.preventDefault();
        modalContainer.style.opacity = 1;
        modalContainer.style.pointerEvents = "visible";
    };

    var resetButtonClick = function(event) {
        hoverTime = 1000;
        trustScanTableBackground = "#00FFFF";
        trustScanTableWidth = 480;
        trustScanTableTopOffset = 0;
        trustScanTableLeftOffset = -480;

        GM_setValue("ezTrust hoverTime", hoverTime);
        GM_setValue("ezTrust trustScanTableBackground", trustScanTableBackground);
        GM_setValue("ezTrust trustScanTableWidth", trustScanTableWidth);
        GM_setValue("ezTrust trustScanTableTopOffset", trustScanTableTopOffset);
        GM_setValue("ezTrust trustScanTableLeftOffset", trustScanTableLeftOffset);

        inputs[0].value = hoverTime;
        inputs[1].value = trustScanTableBackground;
        inputs[2].value = trustScanTableWidth;
        inputs[3].value = trustScanTableTopOffset;
        inputs[4].value = trustScanTableLeftOffset;
    };

    var modalExitClick = function(event) {
        event.preventDefault();
        modalContainer.style.opacity = 0;
        modalContainer.style.pointerEvents = "none";

        if (!isNaN(inputs[0].value)) {
            hoverTime = parseInt(inputs[0].value);
            GM_setValue("ezTrust hoverTime", hoverTime);
        }

        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputs[1].value)) {
            trustScanTableBackground = inputs[1].value;
            GM_setValue("ezTrust trustScanTableBackground", trustScanTableBackground);
        }

        if (!isNaN(inputs[2].value)) {
            trustScanTableWidth = parseInt(inputs[2].value);
            GM_setValue("ezTrust trustScanTableWidth", trustScanTableWidth);
        }

        if (!isNaN(inputs[3].value)) {
            trustScanTableTopOffset = parseInt(inputs[3].value);
            GM_setValue("ezTrust trustScanTableTopOffset", trustScanTableTopOffset);
        }

        if (!isNaN(inputs[4].value)) {
            trustScanTableLeftOffset = parseInt(inputs[4].value);
            GM_setValue("ezTrust trustScanTableLeftOffset", trustScanTableLeftOffset);
        }

        inputs[0].value = hoverTime;
        inputs[1].value = trustScanTableBackground;
        inputs[2].value = trustScanTableWidth;
        inputs[3].value = trustScanTableTopOffset;
        inputs[4].value = trustScanTableLeftOffset;
    };

    var mouseEnter = function() {
        modalExit.style.background = "#FF00E9";
    };
    var mouseLeave = function() {
        modalExit.style.background = "#606061";
    };

    modalExit.addEventListener("mouseenter", mouseEnter);
    modalExit.addEventListener("mouseleave", mouseLeave);
    modalExit.addEventListener("click", modalExitClick);
    resetButton.addEventListener("click", resetButtonClick);
    settingsLink.addEventListener("click", settingsClick);
}

function trustScan(UID, info) {
    var position = getOffset(info);

    var trustScanTable = document.getElementById("trustScanTable");
    if (trustScanTable != null) {
        var trustScanTableClone = trustScanTable.cloneNode(true);
        trustScanTable.parentNode.replaceChild(trustScanTableClone, trustScanTable);
        fadeOut(trustScanTableClone, UID, position);
    }

    var trustScanHTML = getPage("http://hackforums.net/trustscan.php?uid=" + UID);
    if (trustScanHTML != null) {
        trustScanTable = trustScanHTML.getElementsByTagName("table")[1];
        var tipLinks = trustScanTable.getElementsByClassName("tiplink");
        for (var i = tipLinks.length - 1; i >= 0; i--) {
            tipLinks[i].parentNode.removeChild(tipLinks[i]);
        }

        trustScanTable.id = "trustScanTable";
        trustScanTable.style.width = trustScanTableWidth + "px";
        trustScanTable.style.zIndex = "88888888";
        trustScanTable.style.position = "absolute";
        trustScanTable.style.top = (position.top + trustScanTableTopOffset) + "px";
        trustScanTable.style.left = (position.left + trustScanTableLeftOffset) + "px";
        trustScanTable.style.opacity = 1;

        var trustScanCSS = document.createElement("style");
        trustScanCSS.id = "trustScanCSS";
        trustScanCSS.setAttribute("type", "text/css");
        trustScanCSS.innerHTML = ".red, .red a { color: red; font-weight: bold; } .green, .green a { color: #00D01D; } .yellow, .yellow a { color: yellow; }";

        document.body.appendChild(trustScanTable);
        document.body.appendChild(trustScanCSS);

        var percentage = (trustScanTable.children[0].children[0].offsetHeight + 2) / trustScanTable.children[0].offsetHeight * 100;
        trustScanTable.setAttribute('style', trustScanTable.getAttribute('style') + '; ' + crossBrowserGradient(percentage, trustScanTableBackground));

        var mouseEnter = function() {
            this.id = this.id + "Entered";
        };

        var mouseLeave = function() {
            var trustScanTable = document.getElementById("trustScanTableEntered");
            var trustScanCSS = document.getElementById("trustScanCSS");
            if (trustScanTable != null) {
                trustScanTable.removeEventListener("mouseenter", mouseEnter);
                trustScanTable.removeEventListener("mouseleave", mouseLeave);
                fadeOut(trustScanTable);
                document.body.removeChild(trustScanCSS);
            }
        };

        trustScanTable.addEventListener("mouseenter", mouseEnter);
        trustScanTable.addEventListener("mouseleave", mouseLeave);
    }
}

function crossBrowserGradient(percent, color) {
    return "background-color: " + color +";\
background-image: -moz-linear-gradient(top, #072948 " + percent + "%, " + color + " " + percent + "%);\
background-image: -o-linear-gradient(top, #072948 " + percent + "%, " + color + " " + percent + "%);\
background-image: -webkit-gradient(linear, left top, left bottom, color-stop(" + (percent / 100) + ", #072948), color-stop(" + (percent / 100) + ", " + color + "));\
background-image: -webkit-linear-gradient(top, #072948 " + percent + "%, " + color + " " + percent + "%);\
background: -ms-linear-gradient(top, #072948 " + percent + "%, " + color + " " + percent + "%);\
background: linear-gradient(top, #072948 " + percent + "%, " + color + " " + percent + "%);";
}

function fadeOut(element, UID, position) {
    UID = UID || 0;
    position = position || 0;

    element.style.opacity -= 0.02;
    if (element.style.opacity <= 0) {
        document.body.removeChild(element);
        if (UID != 0 && position != 0) {
            trustScan(UID, position);
        }
    } else {
        setTimeout(function() { fadeOut(element); }, 5);
    }
}

function getOffset(element) {
    var x = element.getBoundingClientRect().left + window.scrollX;
    var y = element.getBoundingClientRect().top + window.scrollY;
    return { top: y, left: x };
}

function getPage(url) {
    try {
        var r = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        r.open("GET", url, 0);
        r.send(null);
        var parser = new DOMParser();
        return parser.parseFromString(r.responseText, "text/html");
    } catch (e) {
        return null;
    }
}