// ==UserScript==
// @name PrivacyTestsでPassedを数える
// @name:ja PrivacyTestsでPassedを数える
// @name:en Count "Passed" on PrivacyTests
// @description -
// @description:ja -
// @description:en -
// @version 0.1
// @run-at document-idle
// @namespace https://greasyfork.org/users/181558
// @match https://privacytests.org/*
// @downloadURL https://update.greasyfork.org/scripts/493469/PrivacyTests%E3%81%A7Passed%E3%82%92%E6%95%B0%E3%81%88%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/493469/PrivacyTests%E3%81%A7Passed%E3%82%92%E6%95%B0%E3%81%88%E3%82%8B.meta.js
// ==/UserScript==

(function() {
  let good = new Array(30).fill(0);
  [...document.querySelectorAll('table[class*="comparison-table"] tbody tr td img.dataPoint.good')]?.forEach(v => good[v?.parentNode?.cellIndex]++);
  let rank = [...good].sort((a, b) => a > b ? 1 : -1).reverse();
  let minscore = good.reduce((a, b) => Math.min(a, b ? b : 9999), 9999);
  let maxscore = good.reduce((a, b) => Math.max(a, b), 0) - minscore;
  let res = good.map((v, i) => { return { rank: rank.findIndex(a => a == v) + 1, count: v, l: 100 - ((v - minscore) * 40 / maxscore) } });
  [...document.querySelectorAll('.comparison-table th')]?.forEach((e, i) => {
    if (i && good[i]) {
      e.insertAdjacentHTML("beforeend", `<br><br><div style="background-color:hsl(45,99%,${Math.max(60,Math.min(100,res[i]?.l))}%)">✔${res[i].count}<br>#${res[i].rank}</div>`);
    }
  });
})()
