// ==UserScript==
// @name        QQ/SB/SV Color Thread Replies
// @description Visually separate story posts from replies, tinted background and quotes with per-theme color.
// @author      C89sd
// @version     1.8
// @match       https://questionablequesting.com/*
// @match       https://forum.questionablequesting.com/*
// @match       https://forums.spacebattles.com/*
// @match       https://forums.sufficientvelocity.com/*
// @grant       GM_addStyle
// @namespace   https://greasyfork.org/users/1376767
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536786/QQSBSV%20Color%20Thread%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/536786/QQSBSV%20Color%20Thread%20Replies.meta.js
// ==/UserScript==

'use strict';

const url = document.URL;
const IS_THREAD = url.includes('/threads/');
if (!IS_THREAD) return;

const IS_SB = url.includes('spacebattles.com');
const IS_SV = url.includes('sufficientvelocity.com');
const IS_QQ = url.includes('questionablequesting.com');

GM_addStyle(`
@media (max-width: 650px) {
  .mobile-only {
    background-color: transparent !important;
  }
}
`);

const styleChooser = document.querySelector('.p-footer-linkList a[href="/misc/style"]');
let styleName;
if (styleChooser) {
  const title = styleChooser.getAttribute('title');
  if (title?.startsWith('Style: ')) {
    styleName = title.replace(/^Style:\s*/, '').trim();
  } else {
    styleName = styleChooser.innerText.trim();
  }
}
// console.log(`title="${styleChooser.getAttribute('title')}", inner="${styleChooser.innerText.trim()}" -> extracted="${styleName}"`, styleChooser)

const DEFAULT_DARK  = 'rgb(25, 45, 27)';
const DEFAULT_LIGHT = 'rgb(254, 255, 225)';
// Old: dark "#152E18", light "#F5F6CE", gray "#424242"
const COLOR_BY_THEME = {
  "Default"                 : ['rgb(25, 45, 27)',     50],

  // SpaceBattles.com[
  "SpaceBattles"            : ['rgb(25, 45, 27)',     50], // rgb(21, 46, 24)
  "SpaceBattles - Light"    : ['rgb(254, 255, 225)', 160],

  // SufficientVelocity.com[
  "Neptune"                 : ['rgb(12, 41, 39)',     0],
  "Starscape"               : ['rgb(12, 41, 39)',     0],
  "Sunlight"                : ['rgb(254, 255, 225)', 140],
  "Industrial"              : ['rgb(26, 47, 28)',     60],

  // QuestionableQuesting.com
  "Xenforo Default"         : ['rgb(254, 255, 225)', 140],
  "Light"                   : ['rgb(235, 236, 192)',  60],
  "Dark"                    : ['rgb(36, 55, 38)',    100],
  "Blackened"               : ['rgb(70, 34, 34)',    200],
  "Blackened Green"         : ['rgb(25, 45, 27)',     20],
  "Blackened Blue"          : ['rgb(35, 44, 66)',    180], // rgb(31, 41, 66)
  "Blackened Purple"        : ['rgb(49, 37, 66)',    200],
  "Blackened High Contrast" : ['rgb(11, 32, 14)',      0],
  "Lightened"               : ['rgb(237, 238, 214)',  60],
};

let [base, quoteBias] = COLOR_BY_THEME[styleName];
if (!base) {
  console.error(`${styleName} not in COLOR_BY_THEME!`);
  const DM = IS_QQ && window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128;
  base = DM ? DEFAULT_DARK : DEFAULT_LIGHT;
  quoteBias = DM ? 255 : 0;
}
// console.log(styleName, COLOR_BY_THEME[styleName], base)

const darken = (hex, factor) => {
  const [r, g, b] = hex.replace('#', '').match(/\w\w/g).map(c => parseInt(c, 16)); // Remove #, to hex
  const toHex = c => Math.min(255, Math.max(0, Math.round(c * factor))).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
};
const rgbToHex = rgb => '#' + rgb.match(/\d+/g).map(c => (+c).toString(16).padStart(2, '0')).join('');

base = base.startsWith('#') ? base : rgbToHex(base); // convert to hex, applyBgTint() depends on it
const darker  = darken(base, 0.4);
const lighter = darken(base, 2.3);
const quoteBg = `rgba(${quoteBias}, ${quoteBias}, ${quoteBias}, 0.05)` // opaque lighten or darken, cant read color to target

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [ h, s, l ];
}
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [ r * 255, g * 255, b * 255 ];
}

const bgTintCache = new Map();

function applyBgTint(node) {
  const rgb = getComputedStyle(node).backgroundColor;

  if (bgTintCache.has(rgb)) {
    node.style.backgroundColor = bgTintCache.get(rgb);
    return;
  }

  const hex = base;
  const [r1, g1, b1] = rgb.match(/\d+/g).map(Number);
  const hexVal = hex.startsWith('#') ? hex.slice(1) : hex;
  const r2 = parseInt(hexVal.slice(0, 2), 16);
  const g2 = parseInt(hexVal.slice(2, 4), 16);
  const b2 = parseInt(hexVal.slice(4, 6), 16);

  const baseHsl = rgbToHsl(r2, g2, b2);
  const rgbHsl  = rgbToHsl(r1, g1, b1);
  const out = hslToRgb(baseHsl[0], baseHsl[1], rgbHsl[2]);

  const outputColor = `rgb(${out[0]}, ${out[1]}, ${out[2]})`;
  bgTintCache.set(rgb, outputColor);
  node.style.backgroundColor = outputColor;
}

const OP   = document.querySelector('.username.u-concealed')?.textContent || '!';
const USER = document.querySelector('.p-navgroup-linkText')?.textContent || '!';
// console.log(OP, USER);

const messages = document.getElementsByClassName('message');
for (const message of messages) {
  const author = message.getAttribute('data-author');

  if (author == USER || message.classList.contains('hasThreadmark')) continue;

  if (author === OP) {
    message.querySelector('.username')?.insertAdjacentHTML('afterbegin', '<strong style="color:crimson">AUTHOR:</strong><br/>');
  } else {
    message.style.backgroundColor = base;

    const quotes = message.querySelectorAll('blockquote');
    for (const quote of quotes) {
      const quoteTitle = quote.querySelector('div.bbCodeBlock-title');
      const quoteBlock = quote.querySelector('div.bbCodeBlock-content');

      applyBgTint(quote);
      if (quoteTitle) applyBgTint(quoteTitle);
      if (quoteBlock) quoteBlock.style.backgroundColor = quoteBg;
    }

    const left = message.querySelector('div.message-cell.message-cell--user');
    const right = message.querySelector('div.message-cell.message-cell--main');
    if (left && right) left.style.backgroundColor = getComputedStyle(right).backgroundColor;

    const reactionbar = message.querySelector('div.reactionsBar');
    if (reactionbar) applyBgTint(reactionbar);

    const rating = message.querySelector('div.sv-rating');
    if (rating) applyBgTint(rating);

    const icons = message.querySelectorAll('div.sv-rating__count');
    for (const icon of icons) { applyBgTint(icon); }

    if (IS_SB) {
      const detail1 = message.querySelector('div.message-userDetails');
      const detail2 = message.querySelector('div.message-userExtras');

      if (detail1) {
        applyBgTint(detail1);
        detail1.classList.add('mobile-only');
      }
      if (detail2) {
        applyBgTint(detail2);
        detail2.classList.add('mobile-only');
      }
    }
  }
}
