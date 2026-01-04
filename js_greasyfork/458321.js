// ==UserScript==
// @name         TwitterSHB
// @namespace    https://rinrin.me/
// @version      0.2
// @description  Twitter Slim Home Bar
// @author       rin4046
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458321/TwitterSHB.user.js
// @updateURL https://update.greasyfork.org/scripts/458321/TwitterSHB.meta.js
// ==/UserScript==

{
    const getElementByXPath = (parent, xpath) => {
        return document.evaluate(xpath, parent, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    };

    const observer = new MutationObserver((muataions, observer) => {
        const wrapper = getElementByXPath(document, "/html/body/div[1]/div/div/div[2]/main/div/div/div/div[1]/div/div[1]/div[1]");

        if (wrapper && window.location.pathname === "/home") {
            const top = wrapper.children[0];
            const bottom = wrapper.children[1];

            const tab = getElementByXPath(wrapper, "div[2]/nav/div/div[2]/div");
            if (!tab.getAttribute("swapped") && tab.children[0].children[0].nodeName === "A") {
                tab.appendChild(tab.children[0]);
                tab.children[0].children[0].click();
                tab.setAttribute("swapped", true);
            }

            wrapper.style.flexDirection = "row";
            bottom.style.flexGrow = 1;

            const { borderBottomWidth, borderBottomStyle, borderBottomColor } = window.getComputedStyle(bottom.children[0]);
            top.style.borderBottomWidth = borderBottomWidth;
            top.style.borderBottomStyle = borderBottomStyle;
            top.style.borderBottomColor = borderBottomColor;
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
