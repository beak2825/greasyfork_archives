// ==UserScript==
// @name         剧集列表（页）显示评论中“神回”的次数
// @namespace    https://jirehlov.com
// @version      0.4
// @description  列表页用评论数做缓存判定，详情页始终直接统计，评论计数范围限制在指定div
// @author       Jirehlov
// @include      /^https?://(bangumi|bgm|chii)\.(tv|in)\/subject\/\d+\/ep/
// @include      /^https?://(bangumi|bgm|chii)\.(tv|in)\/ep\/\d+$/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547693/%E5%89%A7%E9%9B%86%E5%88%97%E8%A1%A8%EF%BC%88%E9%A1%B5%EF%BC%89%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E4%B8%AD%E2%80%9C%E7%A5%9E%E5%9B%9E%E2%80%9D%E7%9A%84%E6%AC%A1%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/547693/%E5%89%A7%E9%9B%86%E5%88%97%E8%A1%A8%EF%BC%88%E9%A1%B5%EF%BC%89%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E4%B8%AD%E2%80%9C%E7%A5%9E%E5%9B%9E%E2%80%9D%E7%9A%84%E6%AC%A1%E6%95%B0.meta.js
// ==/UserScript==

const STORE = "shen_hui", DBVER = 1;

$("head").append(`<style>
.shen-hui-count{display:inline-block;padding:0 6px;margin-left:6px;border-radius:6px;
  color:#fff;font-weight:bold;font-size:13px;line-height:20px}
</style>`);

function color(c, max = 30) {
  const r = Math.min(c / max, 1);
  const s = { r: 33, g: 150, b: 243 }, e = { r: 244, g: 67, b: 54 };
  return `rgb(${s.r + (e.r - s.r) * r | 0},${s.g + (e.g - s.g) * r | 0},${s.b + (e.b - s.b) * r | 0})`;
}

function openDB() {
  return new Promise(r => {
    const q = indexedDB.open(STORE, DBVER);
    q.onupgradeneeded = e => e.target.result.createObjectStore(STORE, { keyPath: "epId" });
    q.onsuccess = () => r(q.result);
    q.onerror = () => r(null);
  });
}

async function getCache(epId, curCount) {
  const db = await openDB();
  if (!db) return null;
  return new Promise(res => {
    const r = db.transaction(STORE, "readonly").objectStore(STORE).get(epId);
    r.onsuccess = () => {
      const d = r.result;
      if (!d) return res(null);
      if (curCount != null && d.commentCount === curCount) return res(d.shenCount);
      res(null);
    };
    r.onerror = () => res(null);
  });
}

async function setCache(epId, commentCount, shenCount) {
  (await openDB())?.transaction(STORE, "readwrite").objectStore(STORE)
    .put({ epId, commentCount, shenCount });
}

function countShen(doc) {
  let sc = 0;
  doc.querySelectorAll("#comment_list .cmt_sub_content, #comment_list .message").forEach(div => {
    if (/神回/.test(div.textContent)) sc++;
  });
  return sc;
}

async function getCountForList(epId, curCount) {
  const c = await getCache(epId, curCount);
  if (c != null) return c;
  const h = await fetch(`/ep/${epId}`).then(r => r.ok ? r.text() : "");
  if (!h) return 0;
  const doc = new DOMParser().parseFromString(h, "text/html");
  const sc = countShen(doc);
  await setCache(epId, curCount, sc);
  return sc;
}

async function getCountForSingle(epId, doc) {
  const sc = countShen(doc);
  const cc = doc.querySelectorAll("#comment_list .row,#comment_list .item,#comment_list>li,#comment_list>div").length;
  await setCache(epId, cc, sc);
  return sc;
}

async function showList() {
  for (const el of $("ul.line_list>li").get()) {
    const epId = $("h6 a", el).attr("href")?.split("/").pop();
    if (!epId) continue;
    const t = $(el).find("small.grey").filter((_, x) => /\+(\d+)/.test(x.textContent)).text();
    const cur = +((t.match(/\+(\d+)/) || [])[1] || 0);
    const c = await getCountForList(epId, cur);
    if (c > 0) $("h6", el).append(`<span class="shen-hui-count" style="background:${color(c)}">神回×${c}</span>`);
  }
}

async function showSingle() {
  const h2 = $("h2.title").get(0);
  if (!h2) return;
  let epId = $("a[href^='/ep/'][href$='/edit']", h2).attr("href")?.match(/\/ep\/(\d+)/)?.[1] || location.pathname.split("/").pop();
  const c = await getCountForSingle(epId, document);
  if (c > 0) $(h2).append(`<span class="shen-hui-count" style="background:${color(c)};vertical-align:middle;">神回×${c}</span>`);
}

if (/\/subject\/\d+\/ep/.test(location.pathname)) showList();
else if (/\/ep\/\d+$/.test(location.pathname)) showSingle();