// ==UserScript==
// @name        Infinite scroller
// @namespace   Violentmonkey Scripts
// @match       https://*.arca.live/*
// @grant       none
// @version     1.0.3
// @author      awk
// @description 2021. 1. 6. 오전 11:17:30
// @downloadURL https://update.greasyfork.org/scripts/419731/Infinite%20scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/419731/Infinite%20scroller.meta.js
// ==/UserScript==

// bounce-back element size
const bounceBackBuffer = 96;

// last-checked page
let scrolledPage = 1;
let isLoading = false;

// from Arca Refresher@LeKAKiD v2.6.8
function getTimeStr(datetime) {
  const date = new Date(datetime);
  let hh = date.getHours();
  let mm = date.getMinutes();

  if (hh.toString().length == 1) {
    hh = `0${hh}`;
  }

  if (mm.toString().length == 1) {
    mm = `0${mm}`;
  }

  return `${hh}:${mm}`;
}

function in24(datetime) {
  const target = new Date(datetime);
  const criteria = new Date();
  criteria.setHours(criteria.getHours() - 24);
  if (target > criteria) return true;
  return false;
}

const bounceBack = () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    scrollBy({
      'top': -bounceBackBuffer,
      'left': 0,
      'behavior': 'smooth'
    });
  }
};

const getArticleId = elem => ~~elem.href.match(/\/b\/[^/]+\/(\d+)/)[1];

const loadMore = async () => {
  if(isLoading) return;
  isLoading = true;
  
  // true if scrolledPage value is reached to unread page
  let reached = false;
  
  const currentArticles = [...document.querySelectorAll('.vrow')];
  const currentLastArticleId = getArticleId(currentArticles[currentArticles.length - 1]);
  
  // determine if current page doesn't include any article
  if(!currentLastArticleId) {
    isLoading = false;
    return;
  }
  
  while(!reached) {
    
    ++scrolledPage;
    // get next-page url
    const nextPage = (() => {
      // determine if current url includes page information
      if(location.href.match(/[&?]p=(\d+)/)) {
        return location.href.replace(/[&?]p=\d+/, pageString => {
          return pageString.replace(/\d+/, scrolledPage);
        });
      }
      // determine if current url includes query string
      else if(location.href.match(/\?.+?=.+?/)){
        return `${location.href}&p=${scrolledPage}`;
      }
      // it might be first-page of the board
      else {
        return `${location.href}?p=${scrolledPage}`;
      }
    })();
    
    console.log(nextPage);

    // fetch and parse next-page DOM
    const nextPageDOM = await fetch(nextPage)
      .then(res => res.text())
      .then(pageText => new DOMParser().parseFromString(pageText, 'text/html'));

    const nextPageArticles = [...nextPageDOM.querySelectorAll('.vrow:last-child')];
    const nextPageLastArticle = nextPageArticles[nextPageArticles.length - 1];
    // determine if reached to end
    if(!nextPageLastArticle || nextPageLastArticle.classList.length != 1) {
      // reached to end
      bounceBack();
      break;
    }
    
    // determine if reached to unread page
    const nextPageLastArticleId = getArticleId(nextPageLastArticle);
    if(currentLastArticleId > nextPageLastArticleId) {
      // filter unread articles
      const unreadArticles = [...nextPageDOM.querySelectorAll('.vrow')].filter(article => {
        // filter out notices
        if(article.classList.length != 1) return false;
        return getArticleId(article) < currentLastArticleId;
      });
      
      // attach unread articles with applying <time> js
      const articleList = document.querySelector('.list-table');
      unreadArticles.forEach(article => {
        const time = article.querySelector('time');

        if (time && in24(time.dateTime)) {
          time.innerText = getTimeStr(time.dateTime);
        }
        articleList.appendChild(article)
      });
      break;
    }
  }
  
  document.dispatchEvent(new Event('ar_article'));
  isLoading = false;
  return;
}

window.addEventListener('load', e => {
  // load current page
  const pageMatch = location.href.match(/[&?]p=(\d+)/);
  console.log(location.href);
  scrolledPage = pageMatch ? ~~pageMatch[1] : 1;
  
  // attach bounce-back element
  const bounceBackElement = document.createElement('div');
  bounceBackElement.style.width = 'inherit';
  bounceBackElement.style.height = `${bounceBackBuffer}px`;
  // center-align text
  bounceBackElement.style.textAlign = 'center';
  bounceBackElement.style.lineHeight = `${bounceBackBuffer}px`;
  // element color
  bounceBackElement.style.backgroundColor = 'grey';
  bounceBackElement.style.color = 'white';
  // element text
  bounceBackElement.innerText = 'Loading next page...';
  bounceBackElement.fontWeight = 'bold';
  document.body.appendChild(bounceBackElement);
  
  // apply smooth-scroll for bounce-back
  document.body.style.scrollBehavior = 'smooth';
});

window.addEventListener('scroll', e => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    loadMore();
  }
});