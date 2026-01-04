// ==UserScript==
// @name         devtool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  my dev tool
// @author       wanli
// @match        http://localhost:*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479945/devtool.user.js
// @updateURL https://update.greasyfork.org/scripts/479945/devtool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.bubbleET = function bubbleElementType(fiber) {
        if (!fiber.return) {
            return [];
        }
        return [fiber.elementType].concat(bubbleElementType(fiber.return));
    }

    window.bubbleSelectedET = function () {
        const key = Object.keys($0).find((k) => k.startsWith('__reactInternalInstance'));
        return bubbleElementType($0[key]);
    }

    window.p2GC = function p2GC(point) {
        return `(${point.x},${point.y})`;
    };

    window.m2GC = function m2GC(item) {
        if (item.tp === 'LS2') {
            return `Segment(${p2GC(item.p0)},${p2GC(item.p1)})`;
        } else if (item.tp === 'ARC2') {
            let start = p2GC(item.startPoint);
            let end = p2GC(item.endPoint);
            if (!item.isCCW) {
                [start, end] = [end, start];
            }
            return `CircularArc(${p2GC(item.center)},${start},${end})`;
        } else {
            // TODO
            return `Segment(${p2GC(item.start)},${p2GC(item.end)})`;
        }

        throw new Error(`not supported item type`, item);
    };
})();