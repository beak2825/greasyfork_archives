// ==UserScript==
// @name         improved_gist_pager
// @name:ja      gistページネーション
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.25
// @description  You can move on page by pressing the left and right key.
// @description:ja ページャーをつけ、十字キーの左右で1ページ移動できます。
// @author       universato
// @license      MIT
// @match        https://gist.github.com/*
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/500678/gist%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%8D%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/500678/gist%E3%83%9A%E3%83%BC%E3%82%B8%E3%83%8D%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3.meta.js
// ==/UserScript==

addPager();

const observer = new MutationObserver(() => {
    const pager = document.querySelector('.pagination');
    if (!pager) { return; }

    if (!document.getElementById('pager_first')) {
        addPager();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

function addPager(){

  const maxPagerElementCount = 9; // Odd number

  const displayCount = 10; // the max number of gists per page
  const pager = document.querySelector('.pagination');
  const firstPath = location.pathname.split('/')[1];
  const secondPath = "/" + (location.pathname.split('/')[2] || '');
  const counters = document.getElementsByClassName('Counter');

  if(!pager){ return false; }

  let gistsCount = -1;
  if(['discover', 'forked', 'starred'].includes(firstPath)){
      gistsCount = displayCount * 100; // 1000 gists = 10 gists/page * 100 page
  }else if(secondPath === '/forked'){
      gistsCount = counters[1].innerText;
  }else if(secondPath === '/starred'){
      gistsCount = counters[2].innerText;
  }else{
      gistsCount = counters[0].innerText;
  }

  const pageCount = Math.ceil(gistsCount / displayCount);
  const pagerElementCount = Math.min(pageCount, maxPagerElementCount);

  const params = new URLSearchParams(location.search);
  const currentPageNumber = Number(params.get('page') || 1);

  let firstHTML = '';
  if(currentPageNumber <= 1){
      firstHTML = '<span id="pager_first" class="disabled">First</span>';
  }else{
      const firstParams = new URLSearchParams(location.search);
      firstParams.delete('page'); // ★ 常に1ページ目へ
      const query = firstParams.toString();
      firstHTML = `<a id="pager_first" href="${location.pathname}${query ? '?' + query : ''}">First</a>`;
  }

  let lastHTML = '';
  if(currentPageNumber === pageCount || pageCount <= 1){
      lastHTML = '<span id="pager_last" class="disabled">Last</span>';
  }else{
      params.set('page', pageCount);
      lastHTML = `<a id="pager_last" href="${location.pathname}?${params}">Last</a>`;
  }

  pager.innerHTML = firstHTML + pager.innerHTML + lastHTML;

  const startNumber = Math.max(1,
                                Math.min(pageCount - maxPagerElementCount + 1,
                                        currentPageNumber - Math.ceil((maxPagerElementCount - 1) / 2)
                                        )
                              );
  const endNumber = startNumber + pagerElementCount - 1;

  // Insert pager elements
  let anchorElement;
  for (let pagerIndex = endNumber; pagerIndex >= startNumber; pagerIndex--){
      if(pagerIndex === currentPageNumber){
          anchorElement = document.createElement('span');
          anchorElement.setAttribute('class', 'disabled');
      }else{
          anchorElement = document.createElement('a');
          params.set('page', pagerIndex);
          anchorElement.setAttribute('href', location.pathname + '?' + params);
      }
      anchorElement.textContent = pagerIndex;
      pager.insertBefore(anchorElement, pager.childNodes[2]);
  }

  return true;
}

// Add shortcuts to turn page by left and right kye
(function() {
    document.addEventListener('keydown', function (event) {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

        if (event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.isComposing) return;
        if (event.repeat) return;

        const activeElement = document.activeElement;
        if (activeElement.isContentEditable) return;
        if (activeElement.tagName === 'INPUT') return;
        if (activeElement.tagName === 'TEXTAREA') return;

        const pager_elements = document.querySelectorAll('.pagination a');
        if (pager_elements.length === 0) { return; }

        for (let element of pager_elements) {
            if(event.key === 'ArrowLeft' && element.innerText === 'Newer'){ element.click(); return; }
            if(event.key === 'ArrowRight' && element.innerText === 'Older'){ element.click(); return; }
        }
    }, false);
})();
