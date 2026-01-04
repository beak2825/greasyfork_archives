// ==UserScript==
// @name         Mare Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Plaster lewd mares onto your YouTube webpage!
// @author       Hoover
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/498055/Mare%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/498055/Mare%20Background.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const bgSources = [
        "https://cdn.twibooru.org/img/2022/7/26/2759442/full.png",
        "https://cdn.twibooru.org/img/2023/1/24/2877508/full.png",
        "https://cdn.twibooru.org/img/2024/5/25/3235753/full.png",
        "https://derpicdn.net/img/view/2019/10/23/2176935.png",
        "https://derpicdn.net/img/view/2017/2/20/1368546.png",
        "https://derpicdn.net/img/view/2017/1/30/1351451.png",
        "https://derpicdn.net/img/view/2016/12/8/1312441.png",
        "https://derpicdn.net/img/view/2018/6/18/1760892.png",
        "https://derpicdn.net/img/view/2017/11/15/1587154.png",
        "https://derpicdn.net/img/view/2018/3/14/1679745.png",
        "https://derpicdn.net/img/view/2017/4/11/1409508.png",
        "https://derpicdn.net/img/view/2016/10/26/1282218.png",
        "https://derpicdn.net/img/view/2016/12/13/1316825.png",
        "https://derpicdn.net/img/view/2015/6/23/922414.png",
        "https://derpicdn.net/img/view/2017/2/3/1354205.png",
        "https://derpicdn.net/img/view/2015/11/24/1029455.png",
        "https://derpicdn.net/img/view/2021/6/14/2635297.jpg",
        "https://derpicdn.net/img/view/2018/10/12/1854739.jpg",
        "https://derpicdn.net/img/view/2022/5/1/2856366.jpg",
        "https://derpicdn.net/img/view/2022/12/25/3014192.jpg",
        "https://derpicdn.net/img/view/2018/3/7/1673755.png",
        "https://derpicdn.net/img/view/2022/3/14/2825493.png",
        "https://derpicdn.net/img/view/2019/8/29/2130837.png",
        "https://derpicdn.net/img/view/2017/8/17/1513227.png",
        "https://derpicdn.net/img/view/2019/10/15/2169752.png",
        "https://derpicdn.net/img/view/2015/12/26/1052887.png",
        "https://derpicdn.net/img/view/2021/12/20/2768601.png",
        "https://derpicdn.net/img/view/2018/10/5/1848263.png"
    ]

    function getRandomImageUrl(images) {
        const randomIndex = Math.floor(Math.random() * images.length);
        return images[randomIndex];
    }

    // Select only one image from the array every load
    let bgImage = getRandomImageUrl(bgSources);

    function applyBackground() {
        var primaryElement = document.getElementById('content');
        if (primaryElement) {
            primaryElement.style.backgroundImage = `url(${bgImage})`;
            primaryElement.style.backgroundAttachment = 'fixed';
            primaryElement.style.backgroundSize = 'cover';
            primaryElement.style.backgroundRepeat = 'no-repeat';
            primaryElement.style.backgroundPosition = 'center';
        }
    }

    function applyTransparency(divName) {
        var divElem = document.getElementById(divName);
        if (divElem) {
            divElem.style.opacity = 0.9;
        }
    }

    function applyTransparentElems() {
        applyTransparency('guide');
        applyTransparency('chips-wrapper');
    }

    // Function to remove elements by class name
    function removeElementsByID(id) {
        var element = document.getElementById(id);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }


    // Initial removal on page load
    removeElementsByID('cinematics-container');

    applyTransparentElems();

    // Check for the element every 500ms until it is found
    var checkExist = setInterval(function () {
        if (document.getElementById('content')) {
            applyBackground();
            clearInterval(checkExist);
            removeElementsByID('cinematics-container');
        }
    }, 500);

    // Additionally, listen for page changes and reapply the background
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length) {
                applyBackground();
                applyTransparentElems()
                removeElementsByID('cinematics-container');
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
