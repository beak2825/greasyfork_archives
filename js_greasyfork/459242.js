// ==UserScript==
// @name         appleMusicLargeThumbRedirect
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  apple music large thumb link redirect
// @author       lamhing
// @match        *.mzstatic.com/image/thumb/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459242/appleMusicLargeThumbRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/459242/appleMusicLargeThumbRedirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const appleMusicLargeThumbRedirect = () => {
        let targetThumbWidth = 4000;

        const sizeReg = new RegExp(/.jpg\/(\S*)bb/);
        const pathname = location.pathname;
        let arr = pathname.match(sizeReg);
        let sizeStr = arr?.[1];

        if (!sizeStr) {
            console.error('match err');

            return;
        }

        const toTargetLink = () => {
            let newPathname = pathname;
            newPathname = newPathname.replace(
                sizeStr,
                `${targetThumbWidth}x${targetThumbWidth}`
            );

            location.pathname = newPathname;
            // location.href = `${location.origin}${newPathname}`;
        };

        let curWidth = Number(sizeStr.split('x')?.[0]);

        if (!curWidth) {
            console.error('get curWidth error');
            toTargetLink();
            return;
        }

        if (curWidth === targetThumbWidth) {
            // target width
            return;
        }

        toTargetLink();
    };

    appleMusicLargeThumbRedirect();
})();
