// ==UserScript==
// @name         Baka Tsuki New UI
// @version      1.0.0
// @namespace    https://sharadcodes.github.io
// @author       sharadcodes
// @license      MIT
// @description  A new UI layout for Baka Tsuki
// @supportURL   https://github.com/sharadcodes/UserScripts/issues
// @match        https://www.baka-tsuki.org/custom/grid
// @downloadURL https://update.greasyfork.org/scripts/436645/Baka%20Tsuki%20New%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/436645/Baka%20Tsuki%20New%20UI.meta.js
// ==/UserScript==

let number = 0;

const comparator = (a, b) => {
  if (a.dataset.title < b.dataset.title)
      return -1;
  if (a.dataset.title > b.dataset.title)
      return 1;
  return 0;
}
const sortData = () => {
  var titles = document.querySelectorAll("[data-title]");
  var titlesArray = Array.from(titles);
  let sorted = titlesArray.sort(comparator);
  sorted.forEach(e => document.querySelector("#main").appendChild(e));
}

const generateGrid = (entry) => {
  const article = document.createElement('article');
  article.setAttribute('data-title', entry.title.toLowerCase());
  article.innerHTML = `<div class='series-cover' style='background-image: url(${entry.image});'></div>
                            <div class='series-title-container'>
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
    let images = [];
    images = tmp.querySelectorAll('#mw-content-text img');
    for(const i of images) {
      if (i.width > 100) {
        return i.src;
      }
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
    const anchors = tmp.querySelectorAll("#mw-pages > div > div > div > ul > li > a")
    
    anchors.forEach((anchor) => {
      let images = []
      const href = anchor.href;
      const title = decodeURIComponent(anchor.href.split('title=')[1].replaceAll('_',' '));
      
      if (images.length === 0 || !images) {
        tryAndGetImageFromPage(href).then((pimg) => {
          if (pimg !== null) {
            generateGrid({ title, href, image: pimg });
          } else {
            generateGrid({ title, href, image: '' });
          }
          sortData();
        });
      }
    });
  } catch (err) {
    // eslint-disable-next-line no-alert
    alert(err);
  }
};

const loadPage = async () => {
  getDataForPage('https://www.baka-tsuki.org/project/index.php?title=Category:Light_novel_(English)');
};


window.onload = () => {
  document.querySelector('html').innerHTML = '<body><main id="main"/></main></body>';
  fetch('https://sharadcodes.github.io/UserScripts/www.justlightnovels.com/JLN_grid.css' + '?time=' + Date.now())
    .then(res=>res.text())
    .then(text => {
        const style = document.createElement('style');
        style.textContent = text;
        document.head.appendChild(style);
        loadPage();
    })
};
