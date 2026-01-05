// ==UserScript==
// @name         GitHub - Make PRs easier to diff
// @namespace    https://github.com/drKnoxy/
// @version      1.3
// @description  Add some functionality to github
// @author       DrKnoxy
// @include      https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10446/GitHub%20-%20Make%20PRs%20easier%20to%20diff.user.js
// @updateURL https://update.greasyfork.org/scripts/10446/GitHub%20-%20Make%20PRs%20easier%20to%20diff.meta.js
// ==/UserScript==

(function(){
  // Toggle headers on click
  monitorHeader();

  // Add whitespace toggle
  whitespaceToggles();

  ////////////////

  function whitespaceToggles() {
      _addToggle();
      document.addEventListener('pjax:success', _addToggle);

      ///

      function _addToggle() {
          const search = _getSearchObj();
          const isHidingWhitespace = _isHidingWhitespace(search);

          // we want the url for the otherway
          const newSearch = Object.assign({}, search, {w: _getReverse(search.w)});
          const url = _getURL(newSearch);

          const btn = `

          `;
          const tmpl = `
            <div class="diffbar-item">
              <a
                class="btn btn-sm btn-outline"
                href="${url}"
                title="Toggle whitespace visibility">
                ${isHidingWhitespace ? 'Show' : 'Hide'} whitespace
              </a>
            </div>
          `;

          // Sometimes we have a PR
          const toolbar = document.querySelector('.pr-review-tools');
          if (toolbar) {
              toolbar.insertAdjacentHTML('afterbegin', tmpl);
          }

          // Sometimes we have a commit
          const diffbar = document.querySelector('.js-details-container');
          if (diffbar) {
              //todo: more here
         //     diffbar.insertAdjacentHTML('afterbegin', tmpl);
          }
      }
  }

  function _getReverse(w) {
      return (w === 0 || typeof w === 'undefined') ? 1 : 0;
  }

  function _isHidingWhitespace(search) {
    return search.w === 1;
  }

  function _getURL(search) {
    const newQuery = Object.keys(search).map(k => `${k}=${search[k]}`).join('&');
    return `${location.pathname}?${newQuery}`;
  }

  function _getSearchObj() {
    if (location.search === '') return {};

    return location.search
        .replace(/^\?/, '')
        .split('&')
        .reduce((query, p) => {
          const [key, val, ...whatev] = p.split('=');
          if (key == 'w')
              query[key] = parseInt(val, 10);
          else
              query[key] = val;

          return query;
        }, {});
  }

  function monitorHeader() {
    // Attach this event listener up high because
    // github uses some fancy pjax to swap content
    document.addEventListener('click', _monitor);

    ///

    function _monitor(e){
      const el = e.target.closest('.file-header');

      // is this a file header
      if (!el) return;

      // is it next to a blobl-wrapper
      const next = el.nextElementSibling;
      if (!next.classList.contains('js-file-content')) return;

       // through the gauntlet
      toggleVis(next);
    }

    function toggleVis(el) {
      if(el.style.display === '') {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }
    }
  }

})();
