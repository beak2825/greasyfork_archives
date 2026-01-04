// ==UserScript==
// @name         Block all Stolzmonat flag PFPs
// @namespace    http://a.cza.li/
// @source       http://a.cza.li/us/stolzmonat.user.js
// @license      MIT
// @version      0.1
// @description  Runs once a second to block authors of all on-screen Tweets whose profle picture is similar enoug to the Stolzmonat flag at the left margin. Also, mark their profile pictures in red.
// @author       Charlotte (https://cza.li)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @run-at       document-end
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @exclude      https://twitter.com/account/*
// @require      https://cdn.jsdelivr.net/npm/axios@0.25.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/qs@6.10.3/dist/qs.min.js
// @downloadURL https://update.greasyfork.org/scripts/473809/Block%20all%20Stolzmonat%20flag%20PFPs.user.js
// @updateURL https://update.greasyfork.org/scripts/473809/Block%20all%20Stolzmonat%20flag%20PFPs.meta.js
// ==/UserScript==

/* global axios $ Qs */

(function() {
    'use strict';

    function deltaE(rgbA, rgbB) {
        let labA = rgb2lab(rgbA);
        let labB = rgb2lab(rgbB);
        let deltaL = labA[0] - labB[0];
        let deltaA = labA[1] - labB[1];
        let deltaB = labA[2] - labB[2];
        let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
        let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
        let deltaC = c1 - c2;
        let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
        deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
        let sc = 1.0 + 0.045 * c1;
        let sh = 1.0 + 0.015 * c1;
        let deltaLKlsl = deltaL / (1.0);
        let deltaCkcsc = deltaC / (sc);
        let deltaHkhsh = deltaH / (sh);
        let i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
        return i < 0 ? 0 : Math.sqrt(i);
    }

    function rgb2lab(rgb){
        let r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255, x, y, z;
        r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
        g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
        b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
        x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
        y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
        z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
        x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
        y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
        z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;
        return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
    }

    function getCookie (cname) {
        const name = cname + '='
        const ca = document.cookie.split(';')
        for (let i = 0; i < ca.length; ++i) {
            const c = ca[i].trim()
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ''
    }

    const ajax = axios.create({
        baseURL: 'https://api.twitter.com',
        withCredentials: true,
        headers: {
            Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'X-Twitter-Auth-Type': 'OAuth2Session',
            'X-Twitter-Active-User': 'yes',
            'X-Csrf-Token': getCookie('ct0')
        }
    })

    function blockUser (screen_name) {
        ajax.post(
            '/1.1/blocks/create.json',
            Qs.stringify({ screen_name }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        )
    }

    const targets = [
        ...Array(6).fill([0, 0, 0]),
        ...Array(1).fill(null),
        ...Array(6).fill([73, 0, 11]),
        ...Array(1).fill(null),
        ...Array(6).fill([143, 0, 22]),
        ...Array(1).fill(null),
        ...Array(6).fill([238, 27, 36]),
        ...Array(1).fill(null),
        ...Array(6).fill([255, 126, 38]),
        ...Array(1).fill(null),
        ...Array(6).fill([255, 202, 12]),
        ...Array(1).fill(null),
        ...Array(6).fill([253, 241, 0]),
    ];

    const canvas = document.createElement("canvas");
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");

    const donePfps = {};

    const queryPfps = async () => {
        document.querySelectorAll("article img[src^='https://pbs.twimg.com/profile_images'][src$='_normal.jpg']").forEach(pfpEl => {
            if (!pfpEl.width) return;
            if (pfpEl.src in donePfps) {
                if (donePfps[pfpEl.src] < 500) {
                    const tweet = pfpEl.closest("article");
                    pfpEl.closest("[data-testid='Tweet-User-Avatar']").style.filter = "brightness(0) saturate(100%) invert(20%) sepia(89%) saturate(4590%) hue-rotate(357deg) brightness(103%) contrast(137%)";
                }

                return;
            }

            let imageData;
            fetch(pfpEl.src).then(response => response.blob())
                .then(createImageBitmap)
                .then(bmp => {
                try {
                    ctx.drawImage(bmp, 0, 0, 48, 48);
                    imageData = ctx.getImageData(0, 0, 2, 48);
                } catch (e) {
                    console.error("PFP", e)
                    return; // Operation is insecure -> image not loaded?
                }

                let diff = 0;

                targets.some((target, index) => {
                    if (target === null) return false;

                    diff += deltaE(target, [imageData.data[0 + 8 * index + 0], imageData.data[0 + 8 * index + 1], imageData.data[0 + 8 * index + 2]]) ^ 2;
                    diff += deltaE(target, [imageData.data[4 + 8 * index + 0], imageData.data[4 + 8 * index + 1], imageData.data[4 + 8 * index + 2]]) ^ 2;

                    // console.log(`PFP %c rgb(${imageData.data[0 + 8 * index + 0]}, ${imageData.data[0 + 8 * index + 1]}, ${imageData.data[0 + 8 * index + 2]})`, `background: rgb(${imageData.data[0 + 8 * index + 0]}, ${imageData.data[0 + 8 * index + 1]}, ${imageData.data[0 + 8 * index + 2]});`);
                });

                donePfps[pfpEl.src] = diff;

                if (diff < 500) {
                    const tweet = pfpEl.closest("article");

                    const href = tweet.querySelector("a[href*='/status/']").href;
                    const screenName = href.match(/(?<=\/)[^\/]+(?=\/status\/)/)[0];

                    blockUser(screenName);
                }
            });
        });

        setTimeout(queryPfps, 1000);
    };

    queryPfps();
})();