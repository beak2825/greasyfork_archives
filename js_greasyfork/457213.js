// ==UserScript==
// @name         ipoke-auto-refresh+notice+push
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  query pokemon on twpkinfo map
// @author       Rplus
// @match        https://twpkinfo.com/ipoke.aspx*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457213/ipoke-auto-refresh%2Bnotice%2Bpush.user.js
// @updateURL https://update.greasyfork.org/scripts/457213/ipoke-auto-refresh%2Bnotice%2Bpush.meta.js
// ==/UserScript==


(function() {
window.log = [{ data: '[]', time: new Date()}];
let notiUrl = GM_getValue('notiUrl') || '';
let DesiredList = GM_getValue('list');
let names = GM_getValue('names') || {};
if (!DesiredList) {
  DesiredList = [
    '#iv100',
    '/143.', // 卡比
    '/201',
    '/26_50.', // alola 雷丘
    // '/443.',
    // '/444.',
    // '/524.',
    // '/525.',
    // '/564.',
    // '/566.',
    // '/607.',
    // '/610.',
    // '/611.',
    '/621.',
    // '/633.', // 單首
    // '/634.',
    '/744.', // 岩狗狗
    '/782.', // 心鱗寶
    // '/714.',
  ];
}

// click-event
let refreshTimer;
const refreshInterval = 1;
const msInMin = 60 * 1000;
const refreshBtn = $('#update');
refreshBtn.addEventListener('click', () => {
  console.log('click');
  refreshLoop();

  // checkLater
  setTimeout(searching, 5000);
  // setTimeout(sentNotice, 7000);
});

function searching() {
  console.log('searching');
  let imgs = findDesiredImgs();
  if (!imgs) { return; }

  let _data = [...new Set(genInfo(imgs))];
  let newLog = JSON.stringify(_data);
  console.log(imgs, _data, newLog);

  let oldLog = window.log[0].data;
  let oldData = JSON.parse(oldLog);

  if (newLog === oldLog) { return; }

  window.log.unshift({
    data: newLog,
    time: new Date(),
  });

  // compare, remove old data
  let newData = _data.filter(i => oldData.indexOf(i) === -1);
  if (!newData.length) { return; }

  sentNotice(newData);
}

function genInfo(imgs) {
  return imgs.map(i => {
    let str = i.src.match(/([^/]+)\.png/)[1];
    let is100 = /\#iv100/.test(i.src);
    let dex = str.split('_')[0];
    let sufix = is100 ? '💯' : '';
    let name = getName(dex) + sufix;
    let { pos, ang, len } = getPos(i, name, is100);
    if (!pos) {
      return undefined;
    }
    return [name, pos].join(', ');
  }).filter(Boolean);
}

function getName(dex) {
  let name = names[dex];
  if (!name) {
    updateNames(dex);
  }
  return name || dex;
}

function updateNames(dex) {
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${dex}/`)
  .then(r => r.json())
  .then(pm => {
    names[dex] = pm.names.find(n => n?.language?.name === 'zh-Hant')?.name;
    GM_setValue('names', names);
  });
}

function sentNotice(notice) {
  // // keep log smaller
  // window.log = window.log.slice(-20);

  let n = new Notification('', { body: notice.join('\n') });
  // let x = setTimeout(() => { n.close();}, 2000);
  // n.onclick = () => {
  //   // clearTimeout(x)
  //   window.focus();
  //   n.close();
  // };

  let url = notiUrl.replace('%s', notice.join('%0A'));

  // disable notification when 01:00 ~ 08:00
  if (new Date().getHours() < 8 && new Date().getHours() > 1) {
    url += '&disable_notification=true';
  }

  console.log(url, notice);
  fetch(url);
}


// loop-timer
function refreshLoop() {
  // console.log('refreshLoop');
  if (refreshTimer) {
    window.clearTimeout(refreshTimer);
    refreshTimer = null;
  }
  refreshTimer = setTimeout(fetchNewData, refreshInterval * msInMin);
}

function fetchNewData() {
  // console.log('fetchNewData');
  refreshBtn.click();
}

// notice

// helper
function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document. documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document. documentElement.clientWidth)
  );
}

// query images
function getImgsInView() {
  let iv100 = [...document.querySelectorAll('img.poke_divIcon26_iv100_img')].map(img => {
    let dexImg = img.closest('.poke_divIcon_div').querySelector('img.poke_divIcon45_img');
    if (dexImg) {
      dexImg.src += '#iv100';
    }
    return dexImg;
  });
  return [
    ...iv100,
    ...document.querySelectorAll(`
      img.leaflet-marker-icon,
      img.poke_divIcon45_img,
      div[class^="poke_divIcon45_iv_90"]
    `)
  ]
  .filter(img => isElementInViewport(img));
}

function findDesiredImgs(imgs = getImgsInView()) {
  imgs = imgs.filter(i => i.src)
    .filter(i => DesiredList.some(p => i.src.indexOf(p) !== -1));

  return imgs || false;
}

function getPos(target, name, is100) {
  let tRect = target.getBoundingClientRect();
  let bRect = $('#map').getBoundingClientRect();
  let cPos = getCenterPos(bRect);
  let unit = Math.min(bRect.width / 2, bRect.height / 2);

  let pos = {
    x: ((tRect.x - cPos.x) * 2 / bRect.width).toFixed(3),
    y: ((tRect.y - cPos.y) * 2 / -bRect.height).toFixed(3),
  };

  if (Math.sqrt(pos.x * pos.x + pos.y * pos.y) > 0.35 && !is100) {
    return {};
    // if (name === '卡比獸' || name === '單首龍' || name === '心鱗寶') {
    // }
  }
  // return `(${pos.x}, ${pos.y})`;

  let dx = (tRect.x - cPos.x) / unit;
  let dy = -(tRect.y - cPos.y) / unit;
  let ang = Number(180 * (Math.atan2( dy, dx) / Math.PI)).toFixed(1);
  let len = Math.sqrt(dx * dx + dy * dy);
  len = (len * 1.9).toFixed(2);

  return {
		pos: `🧭${ang}° 👣${len}km`,
		len,
		ang,
	};
}

function getCenterPos(bRect) {
  let c = $('img.leaflet-marker-icon') && $('img.leaflet-marker-icon').getBoundingClientRect();
  let bWh = bRect.width / 2;
  let bHh = bRect.height / 2;
  return c
      ? { x: c.x, y: c.y }
      : { x: bRect.x + bWh, y: bRect.y + bHh };
}

function $(selector) {
  return document.querySelector(selector);
}



})();
