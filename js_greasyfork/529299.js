// ==UserScript==
// @name         WaniKani Reorder Simple 2
// @namespace    juniormint
// @version      0.0.1
// @description  Back-to-back meaning/reading during reviews
// @author       Junior Mint
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/462049-wanikani-queue-manipulator/code/WaniKani%20Queue%20Manipulator.user.js?version=1426722
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529299/WaniKani%20Reorder%20Simple%202.user.js
// @updateURL https://update.greasyfork.org/scripts/529299/WaniKani%20Reorder%20Simple%202.meta.js
// ==/UserScript==
if (typeof wkQueue !== 'undefined' && wkQueue) {
  wkQueue.completeSubjectsInOrder = true;
  wkQueue.questionOrder = 'meaningFirst';
  wkQueue.addReorder((queue, data) => {
    const ranks = { radical: 0, kanji: 1, vocabulary: 2, kana_vocabulary: 2 };
    return queue.sort((x, y) => {
      const diff1 = ranks[x.item.object] - ranks[y.item.object];

      if (diff1 !== 0)
        return diff1;

      const diff2 = x.srs - y.srs;

      if (diff2 !== 0)
        return diff2;

      return Math.random() < 0.5 ? -1 : 1;
    });
  }, {
    openFramework: true,
    // Unsure if necessary.
    openFrameworkGetItemsConfig: 'assignments',
    // Unsure if necessary.
    subject: true
  });
}