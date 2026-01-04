// ==UserScript==
// @name           Douban2Mivie
// @name:en        Douban2Mivie
// @namespace      https://chat.openai.com/
// @version        0.9.15
// @author         ChatGPT & ilovemonkey
// @description    在豆瓣电影详情页加入搜索按钮，可以直接跳转至Mivie搜索资源。Written by ChatGPT, modified by ilovemonkey.
// @description:en Add a search button above Douban's movie info, allowing users to search for related resources on Mivie. Written by ChatGPT, modified by ilovemonkey.
// @match          https://movie.douban.com/subject/*
// @match          https://m.douban.com/movie/subject/*
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/460831/Douban2Mivie.user.js
// @updateURL https://update.greasyfork.org/scripts/460831/Douban2Mivie.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const button = document.createElement('button');
  button.style.cssText = `
    width: 120px;
    height: 22px;
    left: 20px;
    top: 20px;
    background: linear-gradient(265.04deg, #2B2538 0.83%, #213552 99.5%);
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    color: white;
    font-family: 'Segoe UI';
    font-weight: normal;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;

  const searchInText = document.createTextNode('Search in\u00a0');
  const mivieText = document.createElement('span');
    mivieText.style.cssText = 'background-image: url(https://s2.loli.net/2023/02/27/qvZXiaKgsU2Ocnd.gif);' +
    'background-size: 110%;' +
    'background-repeat: no-repeat;' +
    'background-position: 50% 60%;' +
    'background-clip: text;' +
    '-webkit-background-clip: text;' +
    '-webkit-text-fill-color: transparent;' +
    'text-fill-color: transparent;' +
    'color: rgb(136, 136, 136);' +
    'font-weight: bold;';
    mivieText.textContent = 'Mivie';
  button.append(searchInText, mivieText);

  const url = window.location.href;

  if (url.indexOf('https://movie.douban.com/subject/') !== -1) {
  const p1 = document.title
  const regex = /\(豆瓣\)|\b第.*?季\b/g;
  const cleanedTitle = p1.replace(regex, "");
  const h1 = document.querySelector('h1');
  const num = h1?.textContent.match(/\((\d+)\)/)?.[1] || '';
  const searchUrl = `https://mivie.io/search?q=${cleanedTitle}%20y%3A${num}`;

  let timeoutId;

  const mouseOverHandler = () => {
    clearTimeout(timeoutId);
    button.style.transform = 'translateY(-3px)';
    button.style.boxShadow = '0px 3px 3px rgba(0, 0, 0, 0.25)';
    button.style.transition = 'transform 0.2s ease';
  };

  const mouseOutHandler = () => {
    clearTimeout(timeoutId);
    button.style.transform = 'none';
    button.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.5)';
    button.style.transition = 'transform 0.2s ease';
  };

  button.addEventListener('mouseover', mouseOverHandler);
  button.addEventListener('mouseout', mouseOutHandler);
  button.addEventListener('click', () => window.open(searchUrl, '_blank'));

  const info = document.getElementById('info');
  info.insertBefore(button, info.firstElementChild);
}
else if (url.indexOf('https://m.douban.com/movie/subject/') !== -1) {
  const subMetaDiv = document.querySelector('.sub-meta');
  subMetaDiv.parentNode.insertBefore(button, subMetaDiv.nextSibling);
  button.addEventListener('click', function() {
      const subTitle = document.querySelector('.sub-title');
      const mobileTitle = subTitle.textContent.replace(/第.*?季/g, '');
      const newUrl = `https://mivie.io/search?q=${mobileTitle}`;
      window.open(newUrl, '_blank');
  });
}
})();