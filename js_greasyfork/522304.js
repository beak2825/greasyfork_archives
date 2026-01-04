// ==UserScript==
// @name         Let me download
// @namespace    http://tampermonkey.net/
// @version      2024-12-30
// @description  Block bontoon to delete canvas (or readding them) so you can load images without problem
// @author       Sylv1
// @match        https://*.bontoon.com/viewer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bontoon.com
// @grant        none
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/522304/Let%20me%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/522304/Let%20me%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const originalAppend = HTMLElement.prototype.append;

    HTMLElement.prototype.append = function (...nodes) {
        // Check if a <canvas> is being appended and if there's already a <canvas> child
        const containsCanvas = Array.from(this.children).some((child) => child.tagName === 'CANVAS');
        const isAppendingCanvas = nodes.some((node) => node instanceof HTMLCanvasElement);

        if (isAppendingCanvas && containsCanvas) {
            console.warn('Blocked appending a <canvas> because one already exists in this element.');
            return;
        }

        // Call the original append method
        return originalAppend.apply(this, nodes);
    };


    const originalRemoveChild = HTMLElement.prototype.removeChild;

    HTMLElement.prototype.removeChild = function (child) {
        const childIsCanvas = child.tagName === 'CANVAS';
        const isCanvasViewer = this.className.includes("CanvasViewer");

        if (childIsCanvas && isCanvasViewer) {
            console.warn('Blocked deleting a <canvas> because it contain data.');
            return null;
        }

        return originalRemoveChild.call(this, child);
    }

    console.log("[-] Script `Let me download` successfully loaded ! Happy downloading !")

})();