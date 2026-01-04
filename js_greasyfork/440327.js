// ==UserScript==
// @name        LRC Keyboard Nav
// @namespace   https://habs.sdf.org
// @description Keyboard navigation for LetsRun.com
// @match       https://www.letsrun.com/forum*
// @version     1.1
// @grant       none
// @license     AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/440327/LRC%20Keyboard%20Nav.user.js
// @updateURL https://update.greasyfork.org/scripts/440327/LRC%20Keyboard%20Nav.meta.js
// ==/UserScript==

(() => {
  const keys = {
    UP: 'k',
    DOWN: 'j',
    LEFT: 'h',
    RIGHT: 'l',
    NEXT: 'p',
    BACK: 'y',
  }
  const VERT = [keys.UP, keys.DOWN];
  const HORZ = [keys.LEFT, keys.RIGHT];
  const DIRS = [...VERT, ...HORZ];
  const BORDER = '3px solid red';

  const mode = {
    '/forum': 'thread',
    '/forum/flat_read.php': 'post',
  }[window.location.pathname];
  
  const selector = {
    'thread': '.thread',
    'post': '.forum-post-container',
  };
  
  if (!mode) return;
  
  let headerHeight;
  const items = document.querySelectorAll(selector[mode]);
  let selIdx = 0;
  items[selIdx].style.border = BORDER;
  document.addEventListener('keypress', e => {
    if (!headerHeight) headerHeight = document.querySelector('.page-container').getBoundingClientRect().height;
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.classList.contains('rx-editor')) return;
    const [ voteUp, voteDown ] = items[selIdx].querySelectorAll('.forum-post-vote-button');
    if (VERT.includes(e.key)) items[selIdx].style.border = '';
    switch (e.key) {
      case keys.UP: selIdx--; break;
      case keys.DOWN: selIdx++; break;
      case keys.RIGHT:
        if (mode === 'thread') window.location.href = items[selIdx].querySelector('.subject > a').href;
        else voteDown.click();
        break;
      case keys.LEFT: if (mode === 'post') voteUp.click(); break;
      case keys.NEXT: [...document.querySelectorAll('.dbr-paginated-thread')].at(-1).click(); break;
      case keys.BACK: window.location.href = 'https://www.letsrun.com/forum'; break;
    }
    if (VERT.includes(e.key)) {
      if (selIdx < 0) selIdx = 0;
      if (selIdx >= items.length) selIdx = items.length - 1;
      items[selIdx].style.border = BORDER;
      const rect = items[selIdx].getBoundingClientRect();
      if (rect.top < headerHeight) { items[selIdx].scrollIntoView(true); window.scrollBy(0, -headerHeight); }
      if (rect.bottom > window.innerHeight) items[selIdx].scrollIntoView(false); 
    }
  });
})();
