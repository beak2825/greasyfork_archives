// ==UserScript==
// @name         MangaDex Reader fullscreen
// @namespace    Teasday
// @version      0.3.4.1
// @license      CC-BY-NC-SA-4.0
// @description  Adds a fullscreen viewer to MangaDex
// @author       Teasday, Eva
// @match        https://mangadex.com/chapter/*
// @icon         https://mangadex.com/favicon.ico
// @homepage     https://ewasion.github.io/userscripts/mangadex-fullscreen/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37800/MangaDex%20Reader%20fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/37800/MangaDex%20Reader%20fullscreen.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // add css

  const addStyle = function (css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) return;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  };

  addStyle(`
#reader-container {
  position: relative;
  width: calc(100vw - 15px);
  left: calc(-50vw + 50%);
  padding: 0 5px;
}
#reader-container.fullscreen {
  z-index: 2000;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  margin: 0;
  background: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column nowrap;
  height: 100%;
  min-height: 100%;
  width: auto;
}
#reader-container.fullscreen.fitwidth {
  height: auto;
}
img.reader {
  width: auto;
  max-height: calc(100vh - 50px);
}
#reader-container.fullscreen img.reader {
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  max-width: none;
}
#reader-container.fitwidth img.reader {
  height: auto;
  max-height: none;
  max-width: 100%;
}

.reader-hover-menu {
  display: none;
  cursor: pointer;
  margin: 5px;
  font-size: 2em;
  color: #ddd;
  text-shadow: #000 1px 1px 4px;
  transition: all 0.4s;
}
#reader-container.fullscreen ~ .reader-hover-menu {
  z-index: 2020;
  position: fixed;
  display: block;
  top: 5px;
  opacity: 0.3;
}
#reader-container.fullscreen ~ .reader-hover-menu:hover {
  opacity: 1;
  background: rgba(0, 0, 0, .25);
  box-shadow: 0 0 15px 15px rgba(0, 0, 0, .25);
  border-radius: 50%;
}
#reader-container.fullscreen ~ .reader-hover-menu > div:hover {
  color: #fff;
  text-shadow: #fff 0 0 10px;
  transition: all 0.25s;
}
#reader-container.fullscreen ~ .reader-hover-menu.pull-right {
  right: 5px;
  float: right;
  text-align: right;
}
#reader-container.fullscreen ~ .reader-hover-menu.pull-left {
  left: 5px;
  float: left;
  text-align: left;
}

#reader-page-controls,
#reader-page-controls div {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  /* to help leave a little gap in the middle to make the image right-clickable */
  pointer-events: none;
}
#reader-page-controls div {
  pointer-events: auto;
}
#reader-page-controls .prev-page { left: 0;  width: 45%; }
#reader-page-controls .next-page { right: 0; width: 45%; }
#reader-page-controls .prev-chapter { left: 0;  width: 15%; }
#reader-page-controls .next-chapter { right: 0; width: 15%; }

#reader-page-controls .prev-chapter,
#reader-page-controls .next-chapter {
  opacity: 0;
  font-weight: bold;
  font-size: 5vh;
  background: radial-gradient(ellipse at center, rgba(10, 10, 10, .6) 0%, rgba(10, 10, 10, 0) 60%);
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, .8);
}
#reader-page-controls .prev-chapter:before {
  content: '\xAB';
  left: 0;
}
#reader-page-controls .next-chapter:before {
  content: '\xBB';
  right: 0;
}
#reader-page-controls .prev-chapter:hover,
#reader-page-controls .next-chapter:hover {
  opacity: 0.9;
}

.footer { height: auto; }
.footer > p { margin-bottom: 0; }
`);

  // control button data

  const controls = {
    fullscreen: {
      icon: 'expand-arrows-alt',
      titles: ['Enter fullscreen', 'Exit fullscreen'],
      shortcut: 'F'.charCodeAt(0),
    },
    fitwidth: {
      icon: 'expand',
      titles: ['Fit to width (or auto)', 'Fit to height'],
      shortcut: 'R'.charCodeAt(0),
    }
  };

  // add html

  const content = document.querySelector('#content');
  const jumpCols = content.querySelectorAll('.row .col-sm-3');
  const mangaLink = jumpCols[0].querySelector('a'); // works for now

  const sizeControls = document.createElement('div');
  sizeControls.id = 'reader-size-controls';
  sizeControls.classList.add('reader-hover-menu', 'pull-right');
  sizeControls.innerHTML = Object.entries(controls).reduce(function(acc, ctrl) {
    return `${acc}<div class="control-${ctrl[0]}"><i class="fas fa-${ctrl[1].icon}"></i></div>`;
  }, '');
  const linkControls = document.createElement('div');
  linkControls.id = 'reader-link-controls';
  linkControls.classList.add('reader-hover-menu', 'pull-left');
  linkControls.innerHTML = `<div><a href="${mangaLink.href}"><i class="fas fa-book" title="Back to Title"></i></a></div>`;

  const newCol = document.createElement('div');
  newCol.classList.add('col-sm-2');
  newCol.innerHTML = Object.entries(controls).reduce(function(acc, ctrl, i) {
    return `${acc}<button type="button" role="button" class="btn btn-default pull-right control-${ctrl[0]}"><i class="fas fa-${ctrl[1].icon}"></i></button>`;
  }, '');

  jumpCols[2].classList.replace('col-sm-3', 'col-sm-2');
  jumpCols[3].classList.replace('col-sm-3', 'col-sm-2');
  jumpCols[0].parentNode.appendChild(newCol);

  const readerContainer = document.createElement('div');
  readerContainer.id = 'reader-container';
  readerContainer.appendChild(document.querySelector('#current_page'));
  content.appendChild(readerContainer);
  content.appendChild(linkControls);
  content.appendChild(sizeControls);

  const pageControls = document.createElement('div');
  pageControls.id = 'reader-page-controls';
  pageControls.innerHTML = `<div class="prev-page"><div class="prev-chapter"></div></div><div class="next-page"><div class="next-chapter"></div></div>`;
  readerContainer.appendChild(pageControls);

  pageControls.querySelector('.prev-page').addEventListener('click', function(evt) {
    const cur = document.querySelector('[data-id="jump_page"] + .dropdown-menu .selected');
    if (cur.previousElementSibling) {
      cur.previousElementSibling.firstElementChild.click();
    } else {
      this.firstElementChild.click();
    }
  });
  pageControls.querySelector('.prev-chapter').addEventListener('click', function(evt) {
    evt.stopPropagation();
    const cur = document.querySelector('[data-id="jump_chapter"] + .dropdown-menu .selected');
    if (cur.previousElementSibling) {
      cur.previousElementSibling.firstElementChild.click();
    } else {
      mangaLink.click();
    }
  });
  pageControls.querySelector('.next-page').addEventListener('click', function(evt) {
    const cur = document.querySelector('[data-id="jump_page"] + .dropdown-menu .selected');
    if (cur.nextElementSibling) {
      cur.nextElementSibling.firstElementChild.click();
    } else {
      this.firstElementChild.click();
    }
  });
  pageControls.querySelector('.next-chapter').addEventListener('click', function(evt) {
    evt.stopPropagation();
    const cur = document.querySelector('[data-id="jump_chapter"] + .dropdown-menu .selected');
    if (cur.nextElementSibling) {
      cur.nextElementSibling.firstElementChild.click();
    } else {
      mangaLink.click();
    }
  });

  // actual js

  const updateCtrl = function(ctrl, val) {
    localStorage.setItem(`reader.${ctrl}`, val);
    for (const btn of document.querySelectorAll(`.control-${ctrl}`)) {
      btn.title = controls[ctrl].titles[val ? 1 : 0];
      readerContainer.classList.toggle(`${ctrl}`, val);
    }
  };
  const updateAll = function() {
    for (let ctrl of Object.keys(controls)) {
      updateCtrl(ctrl, localStorage.getItem(`reader.${ctrl}`) === 'true');
    }
  };
  const listenBtnClick = function(ctrl) {
    for (const btn of document.querySelectorAll(`.control-${ctrl}`)) {
      btn.addEventListener('click', function() {
        updateCtrl(ctrl, localStorage.getItem(`reader.${ctrl}`) !== 'true');
      }, false);
    }
  };

  Object.keys(controls).map(listenBtnClick);
  window.addEventListener('focus', updateAll, false);
  updateAll();
})();