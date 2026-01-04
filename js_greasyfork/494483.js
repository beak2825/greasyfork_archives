// ==UserScript==
// @name         命运2赛季切换工具
// @namespace    https://moegarden.com/
// @version      0.0.1
// @description  命运2赛季切换工具，可前往更久远的赛季，领取对应奖励。
// @author       MoeHero
// @run-at       document-start
// @match        https://www.bungie.net/*/Seasons/PreviousSeason
// @icon         https://www.bungie.net/favicon.ico
// @license      MIT License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494483/%E5%91%BD%E8%BF%902%E8%B5%9B%E5%AD%A3%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/494483/%E5%91%BD%E8%BF%902%E8%B5%9B%E5%AD%A3%E5%88%87%E6%8D%A2%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

console.log('命运2赛季切换工具：脚本加载成功！版本：V0.0.1');
function getSeasons() {
  return new Promise((resolve, reject) => {
    let db;
    let seasons = [];
    const request = indexedDB.open('Destiny');
    request.onerror = reject;
    request.onsuccess = (event) => {
      db = event.target.result;
      const request = db.transaction(['DestinySeasonDefinition']).objectStore('DestinySeasonDefinition').openCursor();
      request.onerror = reject;
      request.onsuccess = (event) => {
        const result = event.target.result;
        if(result) {
          const data = result.value.def;
          if(isVaildSeason(data)) {
            seasons.push({seasonNumber: data.seasonNumber, hash: data.hash, name: data.displayProperties.name});
          }
          result.continue();
          return;
        }
        seasons = seasons.sort((a, b) => b.seasonNumber - a.seasonNumber);
        seasons.shift();
        resolve(seasons);
      };
    };
  });

  function isVaildSeason(season) {
    return season.endDate !== undefined && new Date(season.endDate) < Date.now() && season.displayProperties.name !== '';
  }
}

function getSeasonHash() {
  return localStorage.getItem('MOEHERO_MODIFY_SEASON_HASH');
}

function setSeasonHash(hash) {
  localStorage.setItem('MOEHERO_MODIFY_SEASON_HASH', hash);
}

async function insertSeasonSelect(element) {
  console.log('命运2赛季切换工具：插入赛季选择器...');
  const seasons = await getSeasons();

  const seasonSelect = document.createElement('select');
  seasonSelect.id = 'moehero-season-select';
  seasonSelect.options.add(new Option('【禁用修改】', ''));
  for(const season of seasons) {
    const selected = getSeasonHash() == season.hash;
    seasonSelect.options.add(new Option(season.name, season.hash, false, selected));
  }
  seasonSelect.onchange = () => {
    const hash = seasonSelect.options[seasonSelect.selectedIndex].value;
    console.log(`命运2赛季切换工具：切换赛季！Hash：${hash}`);
    setSeasonHash(hash);
    location.reload();
  }
  element.appendChild(seasonSelect);
}

function insertStyle() {
  console.log('命运2赛季切换工具：插入自定义样式...');
  const style = document.createElement('style');
  document.head.appendChild(style);
  style.textContent = `
  #main-content div[class^=SeasonsUtilityPages_wrapper] div[class^=SeasonsUtilityPage_seasonInfoContainer] div p {
    margin-bottom: 0;
  }
  #moehero-season-select {
    padding: 4px;
    font-size: 1em;
    border-radius: 4px;
    margin-top: 8px;
  }
  `;
}

console.log('命运2赛季切换工具：开始拦截fetch...');
const originFetch = fetch;
window.fetch = async (url, options) => {
  const response = await originFetch(url, options);
  const modifySeasonHash = getSeasonHash();
  if(modifySeasonHash && response.url.includes('bungie.net/Platform/Settings')) {
    const data = await response.json();
    console.log(`命运2赛季切换工具：拦截请求成功！ModifySeasonHash：${modifySeasonHash}`);
    data.Response.destiny2CoreSettings.pastSeasonHashes.push(modifySeasonHash);
    return new Response(JSON.stringify(data), response);
  }
  return response;
};

console.log('命运2赛季切换工具：等待页面加载...');
let waitElementReadyInterval = setInterval(waitElementReady, 500);
function waitElementReady() {
  const element = document.querySelector('#main-content div[class^=SeasonsUtilityPages_wrapper] div[class^=SeasonsUtilityPage_seasonInfoContainer] div');
  if(element === null) return;
  clearInterval(waitElementReadyInterval);
  waitElementReadyInterval = null;
  insertStyle();
  insertSeasonSelect(element);
}
