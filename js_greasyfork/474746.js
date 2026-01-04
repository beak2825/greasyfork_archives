// ==UserScript==
// @name        Drag upwards to open in new tab
// @description Click and drag a link upwards (20 pixels or more) to open it in a new tab. This script is particularly convenient if you override links to open in current tab by default using an extension or a script like https://greasyfork.org/scripts/4416
// @match       *://*/*
// @grant       none
// @run-at      document-start
// @namespace   https://greasyfork.org/en/users/2159-woxxom
// @author      wOxxOm
// @version     1.0.0
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/474746/Drag%20upwards%20to%20open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/474746/Drag%20upwards%20to%20open%20in%20new%20tab.meta.js
// ==/UserScript==

let timer, a, x, y, evtMove, evtEnd, isDragging;

addEventListener('mousedown', start, true);
addEventListener('dragstart', start, true);

function start(e) {
  stop();
  if ((a = !isDragging && !e.button && e.composedPath().find(el => el.localName === 'a'))) {
    evtMove = /drag/.test(e.type) ? 'dragover' : 'mousemove';
    addEventListener(evtMove, observe);
    startTimer();
    x = e.clientX;
    y = e.clientY;
  }
}

function startTimer() {
  if (timer)
    clearTimeout(timer);
  timer = setTimeout(stop, 1000);
}

function observe(e) {
  if (!a)
    return stop();
  e.preventDefault();
  if (Math.abs(e.clientX - x) / Math.abs(y - e.clientY || 1) > .5 || e.clientY > y) {
    stop();
  } else if (!isDragging && y - e.clientY > 20) {
    isDragging = true;
    a.style.outline = 'green solid 2px';
    a.style.outlineOffset = '5px';
    evtEnd = /drag/.test(e.type) ? 'dragend' : 'mouseup';
    addEventListener(evtEnd, open);
  }
}

function open(e) {
  if (isDragging && e.screenY > 0 && e.clientY > 0)
    Object.assign(a.cloneNode(), {target: '_blank'}).click();
  stop();
}

function stop() {
  if (timer)
    clearTimeout(timer);
  if (isDragging) {
    isDragging = false;
    a.style.outline = '';
    a.style.outlineOffset = '';
  }
  removeEventListener(evtMove, observe);
  removeEventListener(evtEnd, open);
}
