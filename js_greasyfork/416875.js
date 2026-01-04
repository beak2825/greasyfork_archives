// ==UserScript==
// @name         Document Modification Display
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Shows when the document was last modified
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416875/Document%20Modification%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/416875/Document%20Modification%20Display.meta.js
// ==/UserScript==
(function() {
    'use strict';

    buildAndAddModificationDisplay();
})();

function buildAndAddModificationDisplay() {
    document.getElementsByTagName("BODY")[0].appendChild(createModificationContainer());
}

function createModificationContainer() {
    var modification_display = document.createElement("div");
    modification_display.setAttribute("id", "modification-container");
    addMinMaxButton(modification_display);

    var modification_content = document.createElement("div");
    modification_content.setAttribute("id", "modification_content");
    modification_display.appendChild(modification_content);

    addLastModified(modification_content);
    addSitemapXml(modification_content);

    return modification_display;
}

var modification_display_open = true;

function addMinMaxButton(container) {
    var minMaxButton = document.createElement("div");
    minMaxButton.setAttribute("id", "min-max-button");
    minMaxButton.appendChild(document.createTextNode("-"));
    minMaxButton.setAttribute("style", "position: absolute;right: 0;top: 0;line-height: 9px;border-left: solid 2px;border-bottom: solid 2px;height: 14px;width: 15px;text-align: center;");

    minMaxButton.addEventListener("click", function(e) {
        var modContainer = document.getElementById("modification-container");

        if (modification_display_open) {
            minimizeModContainer(modContainer, minMaxButton);
        } else {
            maximizeModContainer(modContainer, minMaxButton);
        }
    });

    container.appendChild(minMaxButton);
    maximizeModContainer(container, minMaxButton);
}

var cached_modification_content;

function minimizeModContainer(elem, button) {
    button.innerHTML = '';
    button.appendChild(document.createTextNode("+"));

    cached_modification_content = document.getElementById("modification_content").innerHTML;

    var minimized_css = "position: fixed;height: 20px;bottom: -3px;left: -3px;padding-right: 20px;border: solid grey;border-radius: 3px;background-color: lightgray;z-index:1001;color:grey!important;";
    elem.setAttribute("style", minimized_css);
    document.getElementById("modification_content").innerHTML = '';

    modification_display_open = false;
}

function maximizeModContainer(elem, button) {
    button.innerHTML = '';
    button.appendChild(document.createTextNode("-"));

    var maximized_css = "position: fixed;bottom: -3px;left: -3px;padding: 5px;padding-right: 20px;border: solid grey;border-radius: 3px;background-color: lightgray;z-index:1001;color:grey!important;";
    elem.setAttribute("style", maximized_css);

    if (cached_modification_content) {
        document.getElementById("modification_content").innerHTML = cached_modification_content;
    }

    modification_display_open = true;
}

function addLastModified(container) {
    var last_modified_container = document.createElement("div");
    last_modified_container.setAttribute("id", "last_modified_container");
    var last_modfied_text = getLastModifiedText();
    var last_modified_content = document.createTextNode(last_modfied_text);
    last_modified_container.appendChild(last_modified_content);
    
    if (last_modfied_text.indexOf("Now") !== -1) {
        addHintToLastModified(last_modified_container);
    }

    container.appendChild(last_modified_container);
}

function getLastModifiedText() {
    var now = Date.now();
    var lastModifiedDate = Date.parse(document.lastModified);
    var secondsSinceModified = (now - lastModifiedDate) / 1000;
    var lastModifiedData = secondsSinceModified > 3 ? document.lastModified : "Now";

    return 'Last Modified: ' + lastModifiedData;
}

function addHintToLastModified(container) {
    var hintHoverable = document.createElement("sup");
    hintHoverable.setAttribute("style", "margin-left: 3px;cursor: help;");
    hintHoverable.appendChild(document.createTextNode("?"));
    hintHoverable.appendChild(getTooltip());

    addHintHoverEvents(hintHoverable);

    container.appendChild(hintHoverable);
}

function addHintHoverEvents(hintElem) {
    var css_show = "display: block;background: #C8C8C8;margin-left: 28px;padding: 5px;position: fixed;z-index: 1000;width: 183px;left: 95px;bottom: 43px;border: darkgrey dotted;font-size:12px;text-align:center;";

    hintElem.addEventListener("mouseenter", function(event) {
        var tooltip = document.getElementById("now-hint-tooltip");
        tooltip.setAttribute("style", css_show);
    });

    hintElem.addEventListener("mouseleave", function(event) {
        var tooltip = document.getElementById("now-hint-tooltip");
        tooltip.setAttribute("style", "display: none");
    });
}

function getTooltip() {
    var tooltip = document.createElement("div");
    tooltip.setAttribute("id", "now-hint-tooltip");
    tooltip.setAttribute("style", "display: none");
    tooltip.appendChild(document.createTextNode("This is likely a dynamic page."));

    return tooltip;
}

var sitemap_loaded = false;

function addSitemapXml(container) {
    var getUrl = window.location;
    var sitemapUrl = getUrl.protocol + "//" + getUrl.host + "/sitemap.xml";

    var sitemap_container = document.createElement("div");
    sitemap_container.setAttribute("id", "sitemap_xml_link");
    animateSitemapLoad(sitemap_container, 1, 0);
    container.append(sitemap_container);

    checkIfSitemapExists(
        sitemapUrl,
        function() {
            addSitemapXmlSuccess(sitemap_container, sitemapUrl);
        },
        function() {
            addSitemapXmlFailure(sitemap_container);
        });
}

function addSitemapXmlSuccess(container, url) {
    var sitemap_link = document.createElement("a");
    sitemap_link.setAttribute("href", url);
    sitemap_link.setAttribute("target", "_blank");
    sitemap_link.setAttribute("style", "color: green!important;text-decoration: underline;");

    var sitemap_text = document.createTextNode("Sitemap");
    sitemap_link.appendChild(sitemap_text);

    container.innerHTML = '';
    container.appendChild(sitemap_link);
}

function addSitemapXmlFailure(container) {
    var sitemap_link = document.createElement("a");
    sitemap_link.setAttribute("style", "color: red!important;text-decoration: underline;text-decoration-style: dotted;");

    var sitemap_text = document.createTextNode("Sitemap not found");
    sitemap_link.appendChild(sitemap_text);

    container.innerHTML = '';
    container.appendChild(sitemap_link);
}

function animateSitemapLoad(sitemap_container, direction, iteration) {
    sitemap_container.innerHTML = "";
    sitemap_container.appendChild(
        document.createTextNode(
            getLoadingMessageForFrame(iteration)));
    sitemap_container.setAttribute("style", "color: darkgrey!important;");

    iteration += direction;
    if (iteration === 3) {
        direction = -1;
    } else if (iteration === 0) {
        direction = 1;
    }

    setTimeout(function () {
        if (!sitemap_loaded) {
            animateSitemapLoad(sitemap_container, direction, iteration);
        }
    }, 250);
}

function getLoadingMessageForFrame(numDots) {
    var msg = "Loading";

    for (var i = 0; i < numDots; i++) {
        msg += ".";
    }

    return msg;
}

function checkIfSitemapExists(url, success, failure) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 200 || this.status == 302)) {
            sitemap_loaded = true;
            success();
        } else if (this.readyState == 4) {
            sitemap_loaded = true;
            failure();
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}
