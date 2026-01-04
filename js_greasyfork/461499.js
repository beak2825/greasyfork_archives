// ==UserScript==
// @name        Moon Captcha v2 Solver
// @namespace   moon.captcha.v2.solver
// @version     0.6
// @description Moon Captcha Captcha Solver by @satology @vikiweb @stealtosvra.
// @author      stealtosvra
// @match       https://coinpayz.xyz/*
// @match       https://bits.re/*
// @match       https://claimtrx.com/*
// @match       https://dogepool.com/*
// @match       https://coinpot.in/*
// @match       https://feyorra.top/*
// @resource    hashes https://stealtosvra.github.io/udImages/hashes32.json
// @require     https://unpkg.com/jimp@0.5.2/browser/lib/jimp.min.js
// @icon        https://stealtosvra.github.io/udImages/udp.png
// @grant       GM_getResourceText
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461499/Moon%20Captcha%20v2%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/461499/Moon%20Captcha%20v2%20Solver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const captchaImgs = document.querySelectorAll('.rscapimg, .captchaOptions');
    const hashes = JSON.parse(GM_getResourceText('hashes'));

    function readAsPng(base64Src) {
        return new Promise(resolve => {
            const base64Data = base64Src.replace(/^data:image\/png;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            Jimp.read(buffer, (err, image) => {
                resolve(image);
            });
        });
    }

    async function checkImages() {
        const promises = Array.from(captchaImgs).map(async (img, i) => {
            const image = await readAsPng(img.src);
            const hash = image.hash(32);
            console.log(`IMG Hash : ${i}: ${hash}`);
            const resp = hashes.filter(x => x === hash);
            if (resp.length > 0) {
                console.log(`Matched Hash : ${i}! ${resp}`);
                img.click()
            } else {
                console.log(`Not Upside Down! ${i}!`);
            }
        });
        await Promise.all(promises);
        console.log('end');
        setTimeout(function(){
        document.querySelector("button[type='submit']").click();}, 20000);}
    

    checkImages();
})();