// ==UserScript==
// @name         Тест скрипта№1
// @namespace    Тест скрипта№1
// @version      1.7
// @name        Greasemonkey set-and-get Example
// @description Stores and logs a counter of executions.
// @match        http://petridish.pw/ru*
// @match        http://petridish.pw/en*
// @grant       GM.setValue
// @grant       GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/398232/%D0%A2%D0%B5%D1%81%D1%82%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B0%E2%84%961.user.js
// @updateURL https://update.greasyfork.org/scripts/398232/%D0%A2%D0%B5%D1%81%D1%82%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%D0%B0%E2%84%961.meta.js
// ==/UserScript==

(async () => {
  let count_before = await GM.getValue('count', 0);

  // Note awaiting the set -- required so the next get sees this set.
  await GM.setValue('count', count_before + 1);

  // Get the value again, just to demonstrate order-of-operations.
  let count_after = await GM.getValue('count');

  console.log('Greasemonkey set-and-get Example has run', count_after, 'times');
})();