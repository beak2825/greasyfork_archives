// ==UserScript==
// @name         Backpack.tf Keyboard Navigator
// @author       https://github.com/Matt-RJ
// @namespace    https://github.com/Matt-RJ/tampermonkey-scripts/blob/master/backpack-tf-page-navigator
// @version      1.6.0
// @description  Allows for the use of the left and right keyboard keys to navigate backpack.tf classifieds and premium search pages.
// @match        *.backpack.tf/*
// @downloadURL https://update.greasyfork.org/scripts/386858/Backpacktf%20Keyboard%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/386858/Backpacktf%20Keyboard%20Navigator.meta.js
// ==/UserScript==

function goToPage(dir) {
  if (dir.toLowerCase() !== 'next' && dir.toLowerCase() !== 'prev') {
    console.error('Backpack.tf Page Navigator | Invalid direction');
    return;
  }
  console.log(`Backpack.tf Page Navigator | Going to ${dir} page`);
  const url = new URL(window.location.href);
  if (url.searchParams.has('page')) { // For regular backpack.tf
    const currentPage = parseInt(url.searchParams.get('page'), 10);
    if (dir.toLowerCase() === 'next') {
      url.searchParams.set('page', currentPage + 1);
    } else {
      url.searchParams.set('page', currentPage - 1 < 1 ? 1 : currentPage - 1);
    }
  } else if (url.searchParams.has('first') && url.searchParams.has('rows')) { // For next.backpack.tf
    const first = parseInt(url.searchParams.get('first'), 10);
    const rows = parseInt(url.searchParams.get('rows'), 10);
    if (dir.toLowerCase() === 'next') {
      url.searchParams.set('first', first + rows);
    } else {
      url.searchParams.set('first', first - rows < 0 ? 0 : first - rows);
    }
  } else {
    // Some next.backpack.tf features do not contain URL pagination - clicking any next/prev buttons instead.
    let button = document.querySelector(`.p-paginator-${dir.toLowerCase()}`) || 
      document.getElementsByClassName(`fa fa-angle-${dir === 'next' ? 'right' : 'left'}`)[0];
    if (!button) {
      console.log(`Backpack.tf Page Navigator | No ${dir} button`);
      return;
    }
    button.click();
    return;
  }
  window.location.href = url.toString();
}

(function () {
  'use strict';
  window.onkeydown = (e) => {
    // Ignore key presses if the user is typing in a text box
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
      return;
    }

    if (e.keyCode === 37) { // Left arrow
      goToPage('prev');
    } else if (e.keyCode === 39) { // Right arrow
      goToPage('next');
    }
  };
})();
