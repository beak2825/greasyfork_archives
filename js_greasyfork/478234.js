// ==UserScript==
// @name        Skyscrapercity Improve Pagination
// @namespace    http://skyscrapercity.com/
// @match       https://www.skyscrapercity.com/*
// @grant       none
// @version     0.2
// @author      mck
// @description Improve pagination
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/478234/Skyscrapercity%20Improve%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/478234/Skyscrapercity%20Improve%20Pagination.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const showPages = 3;
  const $navs = document.querySelectorAll('.pageNav');

  [].forEach.call($navs, function($nav) {
    const $links = Array.from($nav.querySelectorAll('.pageNav-jump:not(.pageNav-jump--prev):not(.pageNav-jump--next)')),
          $dropdownLink = $links[1],
          $lastLink = $links[2],
          currentPageData = window.location.pathname.match(/\page-(\d+)/i) || window.location.search.match(/\?page=(\d+)/i),
          currentPage = parseInt(currentPageData ? currentPageData[1] : 1);

    if($lastLink === undefined) {
      return;
    }

    const firstPage = 1,
          lastPage = ($lastLink !== undefined) ? parseInt($lastLink.innerText) : firstPage;

    if(lastPage <= 3) {
      return;
    }

    if($dropdownLink !== undefined) {
      $dropdownLink.classList.remove('button--primary');
      $dropdownLink.innerText = '...';
    }


    if(lastPage <= showPages * 2) {
      const pages = lastPage - 1;

      for(let i = 1; i < pages; i++) {
        const newPage = firstPage + i;

        let $newLink = $lastLink.cloneNode();

        $newLink.innerText = newPage;
        $newLink.setAttribute('href', $newLink.getAttribute('href').replace(new RegExp('/page-'+lastPage, 'i'), '/page-'+newPage));
        $newLink.classList.remove('button--primary');

        if(newPage === currentPage) {
          $newLink.classList.add('button--primary');
        }

        $nav.insertBefore($newLink, $dropdownLink);
      }

      $dropdownLink.remove();

      return;
    }


    if(currentPage <= showPages * 2) {
      const pages = Math.min(Math.max(showPages, currentPage + showPages - 1), lastPage - 1);

      for(let i = 1; i < pages; i++) {
        const newPage = firstPage + i;

        let $newLink = $lastLink.cloneNode(),
            newHref = $newLink.getAttribute('href')
              .replace('/page-'+lastPage, '/page-'+newPage)
              .replace('?page='+lastPage, '?page='+newPage);

        $newLink.innerText = newPage;
        $newLink.setAttribute('href', newHref);
        $newLink.classList.remove('button--primary');

        if(newPage === currentPage) {
          $newLink.classList.add('button--primary');
        }

        $nav.insertBefore($newLink, $dropdownLink);
      }

      if(currentPage > lastPage - showPages) {
        $dropdownLink.remove();
      }

      return;
    }


    if(currentPage > lastPage - showPages * 2) {
      const pages = Math.max(showPages - 1, lastPage - currentPage + showPages - 1);

      for(let i = pages; i > 0; i--) {
        const newPage = lastPage - i;

        let $newLink = $lastLink.cloneNode(),
            newHref = $newLink.getAttribute('href')
              .replace('/page-'+lastPage, '/page-'+newPage)
              .replace('?page='+lastPage, '?page='+newPage);

        $newLink.innerText = newPage;
        $newLink.setAttribute('href', newHref);
        $newLink.classList.remove('button--primary');

        if(newPage === currentPage) {
          $newLink.classList.add('button--primary');
        }

        $nav.insertBefore($newLink, $lastLink);
      }

      return;
    }


    let $secondDropdownLink = $dropdownLink.cloneNode(true);
    $secondDropdownLink.classList.add('button--disabled');
    $nav.insertBefore($secondDropdownLink, $dropdownLink);

    const startPage = Math.max(currentPage - showPages, 2),
          endPage = Math.min(currentPage + showPages - 2, lastPage - 1);

    for(let i = startPage; i <= endPage; i++) {
      const newPage = firstPage + i;

      let $newLink = $lastLink.cloneNode(),
          newHref = $newLink.getAttribute('href')
            .replace('/page-'+lastPage, '/page-'+newPage)
            .replace('?page='+lastPage, '?page='+newPage);

      $newLink.innerText = newPage;
      $newLink.setAttribute('href', newHref);
      $newLink.classList.remove('button--primary');

      if(newPage === currentPage) {
        $newLink.classList.add('button--primary');
      }

      $nav.insertBefore($newLink, $dropdownLink);
    }
  });


  let css = `
    .pageNav-jump.button--primary { margin: 0; }
    .pageNav-jump.button--disabled { pointer-events: none; }
  `;

  addStyle(css);

  function addStyle(css) {
    let $style = document.createElement('style');

    $style.type = 'text/css';

    if($style.styleSheet) {
        $style.styleSheet.cssText = css;
    } else {
        $style.appendChild(document.createTextNode(css));
    }

    document.head.appendChild($style);
  }
})();