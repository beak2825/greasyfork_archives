// ==UserScript==
// @name           SMTH BBS ip2loc
// @namespace      http://bbs.byr.cn/
// @description    显示水木论坛用户发贴IP的物理地址
// @match          http://*.newsmth.net/*
// @match          https://*.newsmth.net/*
// @version        0.4
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/503380/SMTH%20BBS%20ip2loc.user.js
// @updateURL https://update.greasyfork.org/scripts/503380/SMTH%20BBS%20ip2loc.meta.js
// ==/UserScript==

const TAG_CLASS = "ip2loc-span";

async function addSpan(element) {
    const span = document.createElement("span");
    span.className = TAG_CLASS;
    span.style.marginLeft = "6px";
    element.appendChild(span);
    return span;
}

async function updateStatus(elements, message) {
    elements.forEach((e) => (e.textContent = `[${message}]`))
}

function extractIpFromText(text) {
    const regex = /FROM\s*\D{0,5}([0-9a-fA-F\.:]+.)/
    const result = text.match(regex)
    return result ? result[1].replace(/\*/g, "0") : null
}

// 删除所有 id 为 ad_container 的 div 及其子元素
function removeAds() {
    try {
        const ads = document.querySelectorAll('div#ad_container');
        if (ads && ads.length > 0) {
            ads.forEach(ad => ad.remove());
        }
    } catch (e) {
        console.debug('removeAds error:', e);
    }
}

async function onLoad() {
    // 先移除广告容器
    removeAds();
    const containers = document.querySelectorAll(".sp");
    const ipLocMap = new Map();

    for (const c of containers) {
      const text = c.textContent || "";
      const ip = extractIpFromText(text);
      console.log(ip)
      if (!ip) continue;

      // 已经插过就不要重复插
      if (c.querySelector("." + TAG_CLASS)) continue;

      const span = await addSpan(c);
      span.textContent = "[ LOADING... ]";
      if (!ipLocMap.has(ip)) ipLocMap.set(ip, []);
      ipLocMap.get(ip).push(span);
    }

    await sendRequests(ipLocMap)
}

async function sendRequests(ipLocMap) {
    const requests = Array.from(ipLocMap.keys()).map(async (ip) => {
        const url = `https://pytool.sinaapp.com/geo?type=json&encoding=utf-8&ip=${ip}`
        const spans = ipLocMap.get(ip)
        try {
            const response = await fetch(url)
            const ret = await response.json()
            const loc = ret.geo.loc
            await updateStatus(spans, loc)
        } catch (error) {
            await updateStatus(spans, error.message)
        }
    })

    await Promise.all(requests)
}

function left() {
  const a = Array.from(document.querySelectorAll('.sec.nav form a'))
    .find(x => x.textContent.includes('上页'));
  if (a) a.click();
}

function right() {
  const a = Array.from(document.querySelectorAll('.sec.nav form a'))
    .find(x => x.textContent.includes('下页'));
  if (a) a.click();
}

function keydown(event) {
    switch (event.key) {
        case "ArrowLeft":
            left()
            break
        case "ArrowRight":
            right()
            break
    }
}

window.addEventListener("load", onLoad, false)
window.addEventListener("AutoPagerAfterInsert", onLoad, false)

const observer = new MutationObserver(() => {
    onLoad()
})

observer.observe(document.body, { childList: true, subtree: true })

document.addEventListener("keydown", keydown, false)

