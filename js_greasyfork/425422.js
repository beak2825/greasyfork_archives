// ==UserScript==
// @name        CFake.com image and link fixer
// @namespace   cfake.com/*
// @version      1.4
// @description  Prevents links from opening a new window, enables right click on videos, hides ads, and automatically loads the high res image
// @author       codingjoe
// @match        https://cfake.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/425422/CFakecom%20image%20and%20link%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/425422/CFakecom%20image%20and%20link%20fixer.meta.js
// ==/UserScript==

// cut the bs
document.body.onload = function () {};
document.body.style.overflow = "auto";

// xpath
function $x(xpath, root) {
    let doc = root ? root.evaluate ? root : root.ownerDocument : document, next;
    let got = doc.evaluate(xpath, root || doc, null, null, null), result = [];
    while (next = got.iterateNext()) result.push(next);
    return result;
}

(function() {
    'use strict';
    var strMatch = "javascript:showimage('";

    // redirect main page to image gallery
    if (location.href.replace(/\/$/,"").toLowerCase().endsWith("cfake.com")) {
        location.href = "https://cfake.com/images/gallery/";
    }

    // hide ads
    $x("//div[@id='over' and contains(text(), 'AdBlock ad')] | //div[@id='content_ban'] | //*[@id='content_square'] | //div[@id='slideblockContainer']").forEach(ad => {
        ad.style.display = "none";
    });

    // enables middle click to open page in new tab
    $x(`//a[contains(@href, "${strMatch}")]`).forEach(link => {
        var pos = link.href.indexOf(".jpg")+4;
        link.href = `https://cfake.com/${link.href.substring(strMatch.length, pos)}`;
    })

    // retrieve high res image
    $x("//img[contains(@src, 'medias/photos')]").forEach(img => {
        let btnSwitchSize = document.querySelector("img[title='Switch Size']");
        if (btnSwitchSize === null) {
            img.parentNode.href = img.src;
        } else {
            new Promise(resolve => {
                btnSwitchSize.click();
                setTimeout(resolve, 100);
            }).then(resolve => {
                setTimeout(() => {
                    document.querySelectorAll("img#content_img").forEach(r => r.parentNode.href = r.src);
                    resolve();
                }, 100);
            });
        }
    });

    // enable right click on videos
    document.querySelectorAll("video").forEach(r => r.setAttribute("oncontextmenu",""));
})();
