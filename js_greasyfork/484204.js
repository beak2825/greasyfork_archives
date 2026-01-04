// ==UserScript==
// @name         Github回到顶部
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Github return to the top(回到顶部)脚本
// @author       yangyang (https://wanzij.cn)
// @match        https://github.com/*
// @match        http://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @include      http://github.com/*
// @include      https://github.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484204/Github%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/484204/Github%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
//------- 回到顶部

function scrollToTop() {
    const scrollDuration = 300 // 滚动持续时间（毫秒）
    const scrollStep = -window.scrollY / (scrollDuration / 15)
    const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep)
        } else {
            clearInterval(scrollInterval)
        }
    }, 15)
}
function topTxt(){
    let text = 'return to the top' //lang en
    switch (navigator.language.toLowerCase()) {
      case 'zh':
      case 'zh-cn':
      case 'zh-sg':
        text = '回到顶部'
        break;
      case 'zh-tw':
      case 'zh-hk':
        text = '回到頂部'
        break;
      case 'ko':
      case 'ko_kr':
        text = '맨 위로 돌아가기'
        break;
      case 'ja':
      case 'ja_jp':
        text = 'トップに戻る'
        break
      case 'fr':
      case 'fr_be':
      case 'fr_ca':
      case 'fr_ch':
      case 'fr_fr':
      case 'fr_lu':
        text = 'retour au sommet'
        break
      default:
        break;
    }
    return text
}
//-------添加回到顶部按钮
function addGoTopBtn() {
  const jumpContainer = document.createElement('div');
  jumpContainer.className = 'jump-container';
  jumpContainer.title=topTxt();
  jumpContainer.style.display = 'none';
  const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svgIcon.setAttribute('t', '1696584351737');
  svgIcon.setAttribute('class', 'icon');
  svgIcon.setAttribute('viewBox', '0 0 1024 1024');
  svgIcon.setAttribute('version', '1.1');
  svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svgIcon.setAttribute('width', '32');
  svgIcon.setAttribute('height', '32');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M372.306898 792.431381v45.303732H296.992643v185.950064h-46.775464v-186.014052H176.95055v-45.303732H372.306898z m377.851042-1.279766c38.392993 0 100.909584 20.796205 98.478028 81.073204-2.30358 57.58949-55.925794 74.098477-94.638729 75.378243h-38.201028v76.082115H670.492479v-232.59755h79.729449z m-240.020196 0a116.522735 116.522735 0 1 1 0 232.661539 114.283143 114.283143 0 0 1-85.296434-31.418266 115.56291 115.56291 0 0 1-30.970348-84.848515 115.690886 115.690886 0 0 1 30.970348-85.168457 114.475108 114.475108 0 0 1 85.296434-31.290289z m0 46.51951a69.299353 69.299353 0 0 0-52.27846 17.468812 70.387154 70.387154 0 0 0-17.468812 52.406436 69.939236 69.939236 0 0 0 17.596789 52.150482 68.787446 68.787446 0 0 0 52.150483 17.596789 70.387154 70.387154 0 0 0 52.406435-17.596789 69.619294 69.619294 0 0 0 17.468812-52.278459 69.875248 69.875248 0 0 0-17.468812-52.406436 69.683283 69.683283 0 0 0-52.342447-17.468812z m206.874245 0v63.540404h31.994161c33.017974 0 52.598401-11.197956 53.302272-30.842371 0.703872-17.084882-18.620602-30.586418-45.623673-32.378091h-39.608772zM481.982882 7.550622a25.595329 25.595329 0 0 1 36.281378 0l367.420946 367.420946a25.595329 25.595329 0 0 1-17.852742 43.576047H691.736602a25.595329 25.595329 0 0 0-25.595329 25.595329v274.445914a25.595329 25.595329 0 0 1-25.595329 25.595328h-275.149785a25.595329 25.595329 0 0 1-25.595329-25.595328V444.206932a25.595329 25.595329 0 0 0-25.595329-25.595329H156.090357a25.595329 25.595329 0 0 1-18.428637-43.576047z');
  path.setAttribute('p-id', '5736');
  path.setAttribute('fill', '#8a8a8a');

  svgIcon.appendChild(path);

  const sideServiceItemIcon = document.createElement('div');
  sideServiceItemIcon.className = 'side-service-item-icon';
  sideServiceItemIcon.appendChild(svgIcon);

  jumpContainer.appendChild(sideServiceItemIcon);
  document.body.appendChild(jumpContainer);
  jumpContainer.addEventListener('click', scrollToTop);

  // 添加样式
  const style = document.createElement('style');
  style.innerHTML = `
    .jump-container {
        background: #fff;
        border-radius: 100%;
        bottom: 170px;
        box-shadow: 0 3px 12px rgba(0, 36, 153, .06);
        font-size: 14px;
        height: 56px;
        margin-top: 16px;
        position: fixed;
        right: 12px;
        width: 56px;
        z-index: 3001;
        cursor: pointer;
    }

    .jump-container .side-service-item-icon {
        align-items: center;
        border-radius: 56px;
        color: #8a8a8a;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        margin: 0;
        position: relative;
        text-align: center;
        width: auto;
    }

    .jump-container .side-service-item-icon svg {
        position: relative;
    }
  `;
  document.head.appendChild(style);
}
function checkScroll() {
    const scrollHeight = window.pageYOffset || document.documentElement.scrollTop
    if (scrollHeight >= 350) {
       document.querySelector('.jump-container').style.display = 'block';
    } else {
      document.querySelector('.jump-container').style.display = 'none';
    }
}
addGoTopBtn();
window.removeEventListener('scroll', checkScroll);
window.addEventListener('scroll', checkScroll)
})();