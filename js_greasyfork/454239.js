// ==UserScript==
// @name        Sticky Table of Contents - wikipedia.org
// @namespace   Violentmonkey Scripts
// @match       https://*.wikipedia.org/wiki/*
// @grant       none
// @version     1.0
// @license     GPL-3.0-only
// @author      Sidem
// @description 12/26/2021, 1:29:58 PM
// @downloadURL https://update.greasyfork.org/scripts/454239/Sticky%20Table%20of%20Contents%20-%20wikipediaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/454239/Sticky%20Table%20of%20Contents%20-%20wikipediaorg.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
  let toc = document.getElementById('toc');
  toc.style.position = 'fixed';
  toc.style.right = '0px';
  toc.style.top = '100px';
  toc.style.opacity = '0.8';
  toc.style.width = '18%';
  toc.style.maxHeight = '65%';
  toc.style.display = 'block';
  toc.style.overflowY = 'auto';
  toc.addEventListener('mouseleave', e => { toc.style.opacity = '0.8'; });
  toc.addEventListener('mouseenter', e => { toc.style.opacity = '1.0'; });
  toc.parentElement.classList.add('toclimit-3');
  toc.parentElement.classList.remove('toclimit-2');
  let content = document.getElementById('content');
  content.style.marginRight = '20%';
  content.style.marginLeft = '15%';
  let sections = toc.getElementsByTagName('a');
  let anchorSet = [];
  for (let link of sections) {
    let id = link.href.split('#')[1];
    link.parentElement.id = "anchor_"+id;
    let item = document.getElementById(id);
    let scrollOffset = item.offsetTop;
    link.parentElement.dataset.scroll = scrollOffset;
    if (item.parentElement.tagName == 'H1' || item.parentElement.tagName == 'H2' || item.parentElement.tagName == 'H3') {
      anchorSet.push({id:id, scroll: scrollOffset, item: item, anchor: link.parentElement});
    }
  }
  let setHighlightedSection = (current) => {
    for (let anchor of anchorSet) {
      if (current == anchor.id) {
        anchor.anchor.style.fontWeight = '1000';
        anchor.anchor.scrollIntoView({behavior: "smooth"});
      } else {
        anchor.anchor.style.fontWeight = '100';
      }
    }
  }; 
  let getScrollDistance = (itemScroll) => {
    return Math.abs(itemScroll - (window.scrollY-(window.outerHeight-window.innerHeight)));
  };
  let computeTimer = 0;
  window.addEventListener('scroll', (e) => {
    if(e.timeStamp-computeTimer > 100) {
      computeTimer = e.timeStamp;
      let closestItem = {id:'placeholder', scroll:999999999};
      let curDistance = getScrollDistance(closestItem.scroll);
      let itemDistance = 0;
      for (let link of anchorSet) {
        itemDistance = getScrollDistance(link.scroll)
        if(itemDistance < curDistance) { 
          closestItem = link; 
          curDistance = itemDistance;
        }
      }
      setHighlightedSection(closestItem.id);
    } 
  });
}, false);