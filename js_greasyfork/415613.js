// ==UserScript==
// @name         Colab Kitties
// @namespace    https://www.twitch.tv/riallymundane
// @version      0.1
// @description  add Google Colab's Kitty & Corgi modes to Twitch
// @author       Ria
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415613/Colab%20Kitties.user.js
// @updateURL https://update.greasyfork.org/scripts/415613/Colab%20Kitties.meta.js
// ==/UserScript==

let kitties = [
  'https://colab.research.google.com/v2/common/img/halloween_chocolatechip.gif',
  'https://colab.research.google.com/v2/common/img/halloween_oreo.gif',
  'https://colab.research.google.com/v2/common/img/halloween_redvelvet.gif',
  'https://colab.research.google.com/v2/common/img/xX_vampiregoth91_Xx.gif',
  'https://colab.research.google.com/v2/common/img/PUMPKINSPICELATTE.gif',
  'https://colab.research.google.com/v2/common/img/GHOSTPUFFS.gif'
];

let header = document.querySelector(".top-nav__menu");
let right = true;
let flip = (banner) => {
  if (banner.style.transform === 'scaleX(-1)') {
    banner.style.transform = '';
  } else {
    banner.style.transform = 'scaleX(-1)';
  }
}
let createBanner = () => {
  let random = Math.round(Math.random() * (kitties.length-1));
  let div = document.createElement('div');
  div.innerHTML = `<img src="${kitties[random]}">`;
  if (random === 1) {flip(div)}
  div.style.position = "absolute";
  div.style.top = "0px";
  div.style.zIndex = "0";
  div.style.width = "65px";
  div.style.left = "0px";
  return div;
}
let banner = createBanner();
header.insertAdjacentElement('beforebegin', banner);
let animate = () => {
  const len = parseInt(banner.style.left.split('px')[0]);
  let w = window.innerWidth;
  if (len === (w-65)) {
    right = false;
    flip(banner);
  } else if (len === 0) {
    right = true;
    flip(banner);
  }
  if (right) {
    banner.style.left = `${len+1}px`;
  } else {
    banner.style.left = `${len-1}px`;
  }
}
setInterval(animate, 10);



