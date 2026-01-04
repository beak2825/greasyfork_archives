// ==UserScript==
// @name        推荐视频翻页 - bilibili.com
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/
// @exclude     http://www.bilibili.com/**/*
// @grant       none
// @version     1.2
// @author      belowfrog@gmail.com
// @run-at      document-end
// @description 2022/2/22 21:56:43
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442155/%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E7%BF%BB%E9%A1%B5%20-%20bilibilicom.user.js
// @updateURL https://update.greasyfork.org/scripts/442155/%E6%8E%A8%E8%8D%90%E8%A7%86%E9%A2%91%E7%BF%BB%E9%A1%B5%20-%20bilibilicom.meta.js
// ==/UserScript==


/**============= lib ===================**/

/**
 * attachProps
 * 
 */
const attachProps = (ele, { style, events, attributes } = {}) => {
  style && Object.entries(style).forEach(([key, value]) => ele.style[key] = value);
  events && Object.entries(events).forEach(([ev, listen]) => ele.addEventListener(ev, listen));
  attributes && Object.entries(attributes).forEach(([key, value]) => ele[key] = value);
  
  return ele;
}

/**
 * createElement
 * element [string] DIV, Button
 */
const createElement = (element, props) => {
  const ele = document.createElement(element);
  attachProps(ele, props);
  
  return ele;
}

const cloneElement = (ele, props) => {
  const _ele = ele.cloneNode(true);
  attachProps(_ele, props);
  
  return _ele;
}

/**=========== logic =================**/
const originRecommedAreaEle = document.querySelector('.recommend-container__2-line');
const oldRecommendBtn = document.querySelector('.roll-btn');


const cachedRecommendPages = [];
let currentRecommendPage = -1;

const addRecommendPage = () => {
  const oldRecommendElements = cloneElement(originRecommedAreaEle, {
    style: {
      display: 'grid',
    }
  });
  cachedRecommendPages.push(oldRecommendElements);
}

const flipRecommends = (delta) => {
  cachedRecommendPages.forEach(page => {
    try {
      originRecommedAreaEle.parentElement.removeChild(page);
    } catch {}
  });
  
  currentRecommendPage = currentRecommendPage + delta;
  const page = cachedRecommendPages[currentRecommendPage];
  originRecommedAreaEle.parentElement.insertBefore(page, originRecommedAreaEle);
}

const initPagedRecommendElements = () => {
  addRecommendPage();
  // hide origin recommend Area
  originRecommedAreaEle.style.display = 'none';
  
  const newNextBtn = createElement('BUTTON', {
    style: {
      display: 'inline-flex',
      'align-items': 'center',
      'justify-content': 'center',
      width: '28px',
      height: '28px',
      'border-radius': '8px',
      'margin-right': '12px',
      'margin-bottom': '12px',
      'background-color': 'lightgray',
      color: 'white',
    },
    events: {
      click() {
        if (currentRecommendPage === cachedRecommendPages.length - 1) {
          oldRecommendBtn.click();
          // wait for http response
          // may can be Dom MutationObserver later
          setTimeout(() => {
            addRecommendPage();
            flipRecommends(1);
          }, 350);
        } else {
          flipRecommends(1);
        }
      }
    }, 
    attributes: {
      innerHTML: '>'
    }
  });

  const newBackBtn = cloneElement(newNextBtn, {
    events: {
      click() {
        if (currentRecommendPage > 0) {          
          flipRecommends(-1);
        }
      }
    },
    attributes: {
      innerHTML: '<'
    }
  });
  
  oldRecommendBtn.style.display = 'none';
  
  oldRecommendBtn.parentElement.appendChild(newBackBtn);
  oldRecommendBtn.parentElement.appendChild(newNextBtn);
  
  flipRecommends(1);
}

// setTimeout(() => {
  initPagedRecommendElements();
// }, 0);