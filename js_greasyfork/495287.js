// ==UserScript==
// @name        去除丑丑头像
// @namespace   去除丑丑头像
// @match       https://*.v2ex.com/*
// @grant       none
// @version     1.2
// @author      J.S.Patrick
// @license     MIT
// @description 2024/5/17 22:23:41
// @downloadURL https://update.greasyfork.org/scripts/495287/%E5%8E%BB%E9%99%A4%E4%B8%91%E4%B8%91%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/495287/%E5%8E%BB%E9%99%A4%E4%B8%91%E4%B8%91%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

const cache = new Set();

function analysis() {
  const imgs = document.querySelectorAll('.avatar')
  Array.from(imgs).forEach(img => {
    if(cache.has(img)) return;
    cache.add(img);
    const url = img.getAttribute('src');
    if (!url || url.startsWith('blob') || url.includes('gravatar')) return false;
    fetch(`https://is-ugly-avatar.vercel.app/api/check?url=${encodeURIComponent(url)}`).then(async res => {
      const d = await res.json();
      if (!d) return console.log('can not find pixi');
      const result = Object.keys(d).sort((a,b) => d[b] - d[a]).slice(0, 3).map(k => {
        return {
          key: k,
          value: d[k]
        }
      });
      if(result.some(t => t.key === 'rgb(255,201,169)')) {
        replaceToDefault(img)
      }
    })
  })
}

function replaceToDefault(dom) {
  const username = dom.getAttribute('alt');
  const firstStr = username.slice(0, 1);
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 48
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = getRandomColor();
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '24px Arial';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(firstStr, canvas.width / 2, canvas.height / 2);
  canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    dom.src = url;
  });
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(analysis);
observer.observe(document, config);

analysis()