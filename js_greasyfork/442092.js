// ==UserScript==
// @name         M0V3C4NC31
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Sometimes we regret what we did. No more! Just use this script!
// @author       unnamed
// @match        http*://splix.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442092/M0V3C4NC31.user.js
// @updateURL https://update.greasyfork.org/scripts/442092/M0V3C4NC31.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    'use strict';
    const mc = [[666, 0x4, 0x0, 0x0]],
        q = [[0x0, 0x0, 0x0, 0x0], [0xa7, 0x0, 0x0, 0x0], [0x21, 0x4, 0x0, 0x0], [0xe2, 0x4, 0x0, 0x0]];

    function run(q) {
        const y = Math.round(myPos[0x0]), z = Math.round(myPos[0x1]);
        for (let m of q)
            setTimeout(wsSendMsg, m[0x0], 0x1, { 'dir': m[0x1], 'coord': [y + m[0x2], z + m[0x3]] });
    }

    function runQ(d) {
        d = Math.min(Math.max(d, 0x0), 0x3);
        q[0x0][0x1] = q[0x1][0x1] = d;
        switch (d) {
            case 0x0: q[0x1][0x2] = q[0x3][0x2] = q[0x2][0x2] = 0x1; q[0x1][0x3] = q[0x3][0x3] = q[0x2][0x3] = -0x0; break;
            case 0x1: q[0x1][0x2] = q[0x3][0x2] = q[0x2][0x2] = -0x0; q[0x1][0x3] = q[0x3][0x3] = q[0x2][0x3] = 0x1; break;
            case 0x2: q[0x1][0x2] = q[0x3][0x2] = q[0x2][0x2] = -0x1; q[0x1][0x3] = q[0x3][0x3] = q[0x2][0x3] = -0x0; break;
            case 0x3: q[0x1][0x2] = q[0x3][0x2] = q[0x2][0x2] = -0x0; q[0x1][0x3] = q[0x3][0x3] = q[0x2][0x3] = -0x1; break;
        }
        run(q);
    }

    document.body.addEventListener('keydown', (e) => {
        switch (e.code) {
            case 'KeyV': run(mc); break;
            case 'KeyI': runQ(0x3); e.stopPropagation(); break;
            case 'KeyJ': runQ(0x2); e.stopPropagation(); break;
            case 'KeyK': runQ(0x1); e.stopPropagation(); break;
            case 'KeyL': runQ(0x0); e.stopPropagation(); break;
        }
    });
}());