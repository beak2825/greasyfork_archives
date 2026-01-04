// ==UserScript==
// @name         Developer Forum Old Top Design
// @namespace    http://devforum.roblox.com/
// @version      1.1
// @description  Title Inserter
// @author       TheRealANDRO
// @match        https://devforum.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @license      GNU GPLv3
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/493259/Developer%20Forum%20Old%20Top%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/493259/Developer%20Forum%20Old%20Top%20Design.meta.js
// ==/UserScript==

function getScroll() {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}

function fromHTML(html, trim = true) {
    html = trim ? html.trim() : html;
    if (!html) return null;

    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;

    if (result.length === 1) return result[0];
    return result;
}

(function() {
    'use strict';

    const elementList = document.getElementsByClassName("wrap")
    if (!elementList) return

    const element = Array.from(elementList)[0]
    if (!element) return

    const newElement = fromHTML('<a href="https://devforum.roblox.com">Developer</a>')
    newElement.style = "color: var(--header_primary-very-high); font-size: 28px; padding-left: 54px; position: relative; bottom: 44px"
    element.insertBefore(newElement, element.childNodes[3]);

    window.addEventListener("scroll", () => {
        if (document.URL == "https://devforum.roblox.com/") {
            newElement.style = "color: var(--header_primary-very-high); font-size: 28px; padding-left: 54px; position: relative; bottom: 44px;"
            return
        }

        let scrollY = getScroll()[1]
        if (scrollY > 0) {
            newElement.style = "color: var(--header_primary-very-high); font-size: 28px; padding-left: 54px; position: relative; bottom: 44px; visibility: hidden;"
        } else if (scrollY <= 0) {
            newElement.style = "color: var(--header_primary-very-high); font-size: 28px; padding-left: 54px; position: relative; bottom: 44px;"
        }
    });

    GM_addStyle('#creator_hub_navigation_rbx { display: none; } .d-header .title { margin-bottom: 3px; } .d-header>.wrap { margin-bottom: 8px; } .d-header { height: 4em; background: var(--header_background); box-shadow: 0 2px 4px -1px rgba(0,0,0,0.25); } #site-text-logo { height: 42px; width: 42px; background: url(https://devforum-uploads.s3.dualstack.us-east-2.amazonaws.com/uploads/original/5X/0/8/6/c/086c9e061acfa60d9ab99815107f9a95479aa9aa.png); text-indent: -9999px; background-size: contain; } .contents.clearfix { border: none; border-bottom-width: 0px; }')

    const sElementList = document.getElementsByClassName("d-header clearfix")
    if (!sElementList) return

    const sElement = Array.from(sElementList)[0]
    if (!sElement) return

    sElement.style = "background: var(--header_background)"
})();