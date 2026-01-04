// ==UserScript==
// @name         WaniKani Reorder Simple
// @namespace    juniormint
// @version      0.0.2
// @description  Back-to-back meaning/reading during reviews
// @author       Junior Mint
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1426722
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523555/WaniKani%20Reorder%20Simple.user.js
// @updateURL https://update.greasyfork.org/scripts/523555/WaniKani%20Reorder%20Simple.meta.js
// ==/UserScript==
if (typeof wkQueue !== 'undefined' && wkQueue) {
  wkQueue.completeSubjectsInOrder = true;
  wkQueue.questionOrder = 'meaningFirst';
  wkQueue.addReorder((queue, data) => {
    return queue.sort((x, y) => Math.random() < 0.5 ? -1 : 1);
  });
}
