// ==UserScript==
// @name         MyMhGPWStats
// @author       elie
// @namespace    https://greasyfork.org/en/users/39779
// @version      1.0.3.0.0
// @description  Displays your wisdom stats in the HUD and store GoldPointWisdom for analyze
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483580/MyMhGPWStats.user.js
// @updateURL https://update.greasyfork.org/scripts/483580/MyMhGPWStats.meta.js
// ==/UserScript==

(function () {
  const storageKey = 'MyMhGPWStats';
  const noValue = 'N/A';
  const nbf = this.numberFormat;
  const bt = this.blinkText;
  const defaultValues = {
    gold: [-1, -1],
    points: [-1, -1],
    wisdom: [-1, -1],
    checkAt: [null, null]
  };
  const target = document.querySelector('.mousehuntHud-userStat-row.points');
  if (target) render(true);
  /** render wisdom html */
  function render(isInit) {
    // Remove existing div
    const existing = document.querySelector(
      '.mousehuntHud-userStat-row.wisdom'
    );
    if (existing) existing.remove();
    // Retrieve and format cached current wisdom value
    const gpwStats = localStorage.getItem(storageKey);
    const tmpGpw = gpwStats ? JSON.parse(gpwStats) : defaultValues;
    // 如果是舊的資料型態就覆蓋掉
    const gpwValues = tmpGpw.previousGold ? defaultValues : tmpGpw;
    const wisdomRaw = gpwValues.wisdom[0];
    const wisdomValue =
      wisdomRaw > -1 ? (nbf ? nbf(wisdomRaw) : wisdomRaw) : noValue;
    // Build HTML
    const wisdomDiv = document.createElement('div');
    wisdomDiv.className = 'mousehuntHud-userStat-row wisdom';
    const wisdomA = document.createElement('a');
    wisdomA.addEventListener('click', function () {
      updateGPWStats(true);
    });
    const labelSpan = document.createElement('span');
    labelSpan.className = 'label';
    labelSpan.title = 'Click to refresh!';
    labelSpan.innerText = 'Wisdom';
    wisdomA.appendChild(labelSpan);
    const wisdomSpan = document.createElement('span');
    wisdomSpan.className = 'value';
    wisdomSpan.id = 'hud_wisdom';
    wisdomSpan.innerText = wisdomValue;
    wisdomDiv.appendChild(wisdomA);
    wisdomDiv.appendChild(wisdomSpan);
    target.insertAdjacentElement('afterend', wisdomDiv);
    // Check for a previous value to calculate difference
    const prevVal = gpwValues.wisdom[1];
    const currVal = wisdomRaw;
    const diff = currVal - (prevVal > -1 ? prevVal : 0);
    if (diff > 0) {
      if (bt && !isInit) bt(wisdomSpan, '#0f0', '#fff');
    }
    const formatDiff = nbf ? nbf(diff) : diff;
    const activeDiff = diff > 25 ? (nbf ? nbf(diff - 25) : diff - 25) : 0;
    const passiveDiff = diff > 15 ? (nbf ? nbf(diff - 15) : diff - 15) : 0;
    const pointsDiff = nbf
      ? nbf(gpwValues.points[0] - gpwValues.points[1])
      : gpwValues.points[0] - gpwValues.points[1];
    const goldDiff = nbf
      ? nbf(gpwValues.gold[0] - gpwValues.gold[1])
      : gpwValues.gold[0] - gpwValues.gold[1];
    // Grab timestamps for previous and latest fetches
    const tsPrevRaw = gpwValues.checkAt[1];
    const tsPrevStr = tsPrevRaw
      ? new Date(tsPrevRaw).toLocaleString()
      : noValue;
    const tsLatestRaw = gpwValues.checkAt[0];
    const tsLatestStr = tsLatestRaw
      ? new Date(tsLatestRaw).toLocaleString()
      : noValue;
    const output = `· Wisdom Difference from last value: ${formatDiff}\n· Active Hunt ("I sounded"): ${activeDiff}\n· Friend Hunt / Trap Check: ${passiveDiff}\n· Points Difference from last value: ${pointsDiff}\n· Gold Difference from last value: ${goldDiff}\n\n· Latest fetch: ${tsLatestStr}\n· Previous fetch: ${tsPrevStr}`;
    wisdomSpan.title = output;
    wisdomSpan.addEventListener('click', function () {
      alert(output);
    });
  }
  /** Request, parse, and cache gold/points/wisdom values */
  function updateGPWStats(isUpdateWisdom) {
    if (!isUpdateWisdom) {
      updateGPStats(true);
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open(
      'GET',
      'https://www.mousehuntgame.com/item.php?item_type=wisdom_stat_item'
    );
    xhr.onload = function () {
      const data = xhr.responseText;
      const parser = new DOMParser();
      const dom = parser.parseFromString(data, 'text/html');
      const wisdomItem = dom.querySelector('.itemView-sidebar-quantity');
      if (wisdomItem) {
        const wisdomText = wisdomItem.textContent
          .split('Own: ')[1]
          .replace(/,/g, '');
        const wisdom = parseInt(wisdomText);
        const gpwValues = updateGPStats(false);
        const wisdoms = gpwValues.wisdom;
        const oldWisdom = wisdoms[0]; // updateGPStats use last wisdom as latest
        if (oldWisdom === parseInt(wisdom)) return;
        wisdoms[0] = wisdom;
        if (wisdoms.length > 5) wisdoms.splice(5);
        const checkAt = gpwValues.checkAt;
        checkAt[0] = Date.now();
        if (checkAt.length > 5) checkAt.splice(5);
        localStorage.setItem(storageKey, JSON.stringify(gpwValues));
        render(false);
      }
    };
    xhr.onerror = function () {
      console.error(xhr.statusText);
    };
    xhr.send();
  }
  /** Request, parse, and cache gold/points/wisdom values, use last wisdom as latest */
  function updateGPStats(isSave) {
    // eslint-disable-next-line no-undef
    const usr = user;
    const gpwStats = localStorage.getItem(storageKey);
    const tmpGpw = gpwStats ? JSON.parse(gpwStats) : defaultValues;
    // 如果是舊的資料型態就覆蓋掉
    const gpwValues = tmpGpw.previousGold ? defaultValues : tmpGpw;
    const gold = gpwValues.gold;
    gold.unshift(parseInt(usr.gold));
    if (gold.length > 5) gold.splice(5);
    const points = gpwValues.points;
    points.unshift(parseInt(usr.points));
    if (points.length > 5) points.splice(5);
    const wisdoms = gpwValues.wisdom;
    wisdoms.unshift(wisdoms[0]);
    if (wisdoms.length > 5) wisdoms.splice(5);
    const checkAt = gpwValues.checkAt;
    checkAt.unshift(Date.now());
    if (checkAt.length > 5) checkAt.splice(5);
    if (isSave) {
      localStorage.setItem(storageKey, JSON.stringify(gpwValues));
      render(false);
    }
    return gpwValues;
  }
})();
