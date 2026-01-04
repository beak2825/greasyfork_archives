// ==UserScript==
// @name        微博终结者
// @namespace   Violentmonkey Scripts
// @match       https://weibo.com/u/*
// @grant       GM_registerMenuCommand
// @version     1.0
// @author      -
// @description 10/29/2022, 10:24:16 PM
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @downloadURL https://update.greasyfork.org/scripts/453946/%E5%BE%AE%E5%8D%9A%E7%BB%88%E7%BB%93%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/453946/%E5%BE%AE%E5%8D%9A%E7%BB%88%E7%BB%93%E8%80%85.meta.js
// ==/UserScript==

const uid = window.location.pathname.split('/')[2];
let panel;

GM_registerMenuCommand('删除所有微博', async () => {
  const allWeibo = await loadAllWeibo();
  const toDelete = allWeibo;
  const total = toDelete.length;
  let done = 0;
  await Promise.all(toDelete.map(async ({ id }) => {
    await deleteWeibo(id);
    log(`Delete weibo: ${++done}/${total}`);
  }));
  log(`Done! Deleted ${done} records.`);
});

function log(message) {
  if (!panel) {
    panel = VM.getPanel({
      theme: 'dark',
    });
    Object.assign(panel.wrapper.style, { top: 0, left: '50%', transform: 'translateX(-50%)' });
    panel.show();
  }
  panel.setContent(message);
  console.log(message);
}

function getCookies() {
  return document.cookie.split('; ').map(item => item.split('=')).reduce((prev, [key, value]) => { prev[key] = value; return prev; }, {});
}

async function deleteWeibo(id) {
  const resp = await fetch('https://weibo.com/ajax/statuses/destroy', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-xsrf-token': getCookies()['XSRF-TOKEN'],
    },
    body: JSON.stringify({ id }),
  });
  const data = await resp.json();
  if (!resp.ok) throw { resp, data };
  return data;
}

async function loadWeiboByPage(page) {
  const resp = await fetch(`https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=${page}&feature=0`);
  const data = await resp.json();
  if (!resp.ok) throw { resp, data };
  return data.data;
}

function loadAllWeibo() {
  return new Promise((resolve, reject) => {
    let page = 0;
    let pageSize = 1;
    let totalPages = 1;
    let done = 0;
    let processing = 0;
    const result = [];
    const loadPage = async page => {
      const { list, total } = await loadWeiboByPage(page);
      if (list.length) {
        result[page] = list;
        pageSize = Math.max(pageSize, list.length);
        console.log(total, pageSize);
        totalPages = Math.ceil(total / pageSize);
        log(`Loaded: ${++done}/${totalPages}`);
      }
      processing -= 1;
      check();
    };
    const check = () => {
      while (page < totalPages) {
        processing += 1;
        loadPage(++page).catch(reject);
      }
      if (!processing) resolve(result.flat());
    };
    check();
  });
}