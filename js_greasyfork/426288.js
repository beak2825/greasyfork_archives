// ==UserScript==
// @name        WebpToJpg
// @author      RobotOilInc
// @version     2.0
// @description Dirty script to convert a WEBP base64 URI to a JPG base64 URI
// @homepageURL https://greasyfork.org/en/scripts/426288-webptopng
// @supportURL  https://greasyfork.org/en/scripts/426288-webptopng
// ==/UserScript==

/* jshint esversion: 8 */

const WebpToJpg = async function (base64Data) {
    return await new Promise(resolve => {
        const image = new Image();
        image.src = base64Data;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage(image, 0, 0);

            resolve(canvas.toDataURL('image/jpeg'));
        };
    });
};