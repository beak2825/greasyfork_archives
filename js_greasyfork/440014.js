// ==UserScript==
// @name         ImprovedTube Style Fix
// @namespace    https://greasyfork.org/en/users/34131-velc-gf
// @version      1.0.8
// @description  Adjusts the appearance and behavior of player buttons and tooltips to match YouTube's
// @author       Velarde, Louie C.
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=improvedtube.com&sz=64
// @license      LGPL-3.0
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/440014/ImprovedTube%20Style%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/440014/ImprovedTube%20Style%20Fix.meta.js
// ==/UserScript==

function showTooltip(event) {
  document.body.lastElementChild.style.display = 'none';

  let container = document.getElementById('movie_player');
  let containerRect = container.getBoundingClientRect();
  let buttonRect = this.getBoundingClientRect();

  let tooltip = document.createElement('div');
  tooltip.classList.add('ytp-tooltip');
  tooltip.classList.add('ytp-tooltip-text');
  tooltip.style.left = buttonRect.left - containerRect.left + buttonRect.width / 2 + 'px';
  tooltip.style.top = buttonRect.top - containerRect.top - 14 + 'px';
  tooltip.style.transform = 'translate(-50%,-100%)';
  tooltip.textContent = this.dataset.title;

  container.appendChild(tooltip);

  async function hideTooltip() {
    this.removeEventListener('mouseleave', hideTooltip);
    tooltip.ariaHidden = true;
    await new Promise(r => setTimeout(r, 100));
    tooltip.remove();
  }
  this.addEventListener('mouseleave', hideTooltip);
}

function fix(nodes) {
  for (let node of nodes) {
    if (!node.classList.contains('it-player-button')) continue;

    node.classList.remove('it-player-button');
    node.style.flex = '0 0 auto';
    node.style.removeProperty('opacity');
    node.addEventListener('mouseenter', showTooltip);

    let svg = node.firstChild;
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 36 36');

    let path = svg.firstChild;
    path.classList.add('ytp-svg-fill');
    path.setAttribute('transform', 'translate(6,6)');
  }
}

function observe(mutationList, observer) {
  for (let mutation of mutationList) {
    fix(mutation.addedNodes);
  }
}

function fixAndObserve() {
  let controls = document.querySelector('#movie_player .ytp-left-controls');
  if (controls) {
    let observer = new MutationObserver(observe);
    observer.observe(controls, {childList: true});
    fix(controls.querySelectorAll('.it-player-button'));
  } else {
    setTimeout(fixAndObserve, 20);
  }
}

fixAndObserve();