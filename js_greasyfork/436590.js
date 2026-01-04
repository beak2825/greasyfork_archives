// ==UserScript==
// @name         JustLightNovels New UI
// @version      2.0.1
// @namespace    https://sharadcodes.github.io
// @author       sharadcodes
// @license      MIT
// @description  A new UI layout for JustLightNovels
// @supportURL   https://github.com/sharadcodes/UserScripts/issues
// @match        https://www.justlightnovels.com/custom/grid
// @downloadURL https://update.greasyfork.org/scripts/436590/JustLightNovels%20New%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/436590/JustLightNovels%20New%20UI.meta.js
// ==/UserScript==

let number = 0;
const options = { year: 'numeric', month: 'long', day: 'numeric' };

const generateGrid = (entry) => {
  const article = document.createElement('article');
  article.innerHTML = `<div class='series-cover' style='background-image: url(${entry.image});'></div>
                            <div class='series-title-container'>
                              <h5>${entry.date.toLocaleDateString('en-us', options)}</h5>
                              <br/>
                              <h4><a href='${entry.href}' target='_blank'>${entry.title}</a></h4>
                          </div>`;
  document.querySelector('#main').appendChild(article);
};

const tryAndGetImageFromPage = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const tmp = document.createElement('html');
    tmp.innerHTML = html;
    const images = tmp.querySelectorAll('#content figure img');
    if (images.length > 0) {
      return images[0].src;
    }
    return null;
  } catch (err) {
    return err;
  }
};

const getDataForPage = async (url) => {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const tmp = document.createElement('html');
    tmp.innerHTML = html;

    const articles = tmp.querySelectorAll('#content article');
    articles.forEach((article) => {
      const { href } = article.querySelectorAll('a')[0];
      const title = article.querySelectorAll('h2')[0].innerText;
      const images = article.querySelectorAll('img');
      const date = new Date(article.querySelector('span.date').innerText);
      if (images.length === 0 || !images) {
        tryAndGetImageFromPage(href).then((pimg) => {
          if (pimg !== null) {
            generateGrid({ title, href, date, image: pimg });
          } else {
            generateGrid({ title, href, date, image: '' });
          }
        });
      } else {
        generateGrid({ title, href, date, image: images[0].src });
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err);
  }
};
const increment = () => {
  // eslint-disable-next-line no-plusplus
  ++number;
};

const loadPage = async () => {
  if (number === 0) {
    increment();
    getDataForPage('https://www.justlightnovels.com/');
  }
  increment();
  getDataForPage(`https://www.justlightnovels.com/page/${number}/`);
};

window.onload = () => {
  document.querySelector('html').innerHTML = '<body><main id="main"/></main></body>';
  fetch('https://sharadcodes.github.io/UserScripts/www.justlightnovels.com/JLN_grid.css' + '?time=' + Date.now())
    .then(res=>res.text())
    .then(text => {
        const style = document.createElement('style');
        style.textContent = text;
        document.head.appendChild(style);
     })
  loadPage();
  loadPage();
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      loadPage();
      loadPage();
      loadPage();
    }
  });
};
