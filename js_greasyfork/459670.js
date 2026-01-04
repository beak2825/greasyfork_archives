// ==UserScript==
// @name         OGLAF assistant
// @namespace    https://www.oglaf.com/
// @version      0.3
// @description  Navigate the OGLAF comic with arrow keys, show title text, alt text, epilogue button under the image.
// @author       Anon
// @match        https://www.oglaf.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459670/OGLAF%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/459670/OGLAF%20assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extra() {
        let patreon_link = document.querySelector('a.patreon');
        let extra_link = patreon_link.nextSibling;
        if (extra_link.tagName === "A" && extra_link.href && extra_link.href !== document.location.href) {
            return extra_link;
        }
        return null;
    }

    function keydown(e) {
        if (e.keyCode == 37) {
            document.querySelector("a.button.previous").click();
        } else if (e.keyCode == 39) {
            let extra_link = extra();
            if (extra_link) {
                extra_link.click();
            } else {
                document.querySelector("a.button.next").click();
            }
        }
    }

    document.addEventListener("keydown", keydown);

    function append(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    let strip = document.getElementById("strip");
    let title = strip.getAttribute("title");
    let alt = strip.getAttribute("alt");
    let ad_btm = document.getElementById("ad_btm");

    ad_btm.innerHTML = "";

    if (title) {
        ad_btm.append(document.createTextNode(title));
    }

    if (alt) {
        ad_btm.append(document.createElement('br'));
        ad_btm.append(document.createElement('br'));
        ad_btm.append(document.createTextNode(alt));
    }

    ad_btm.style.backgroundColor = '#ccc';
    ad_btm.style.borderRadius = '12px';
    ad_btm.style.padding = '12px';

    let extra_link = extra();
    if (extra_link) {
        let extra_img = extra_link.querySelector('img');
        extra_link.style = '';
        extra_img.style = 'border: 8px solid yellow; border-radius: 8px;';
    }
})();
