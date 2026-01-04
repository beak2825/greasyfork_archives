// ==UserScript==
// @name         GGn Infinite Scroll
// @namespace    https://greasyfork.org
// @description  Infinitely scroll on paginated GGn pages
// @version      1.4.01
// @author       SB100, small update by drlivog to fix tables
// @copyright    2021, SB100 (https://openuserjs.org/users/SB100)
// @license      MIT
// @match        https://gazellegames.net/torrents.php*
// @match        https://gazellegames.net/collections.php*
// @match        https://gazellegames.net/requests.php*
// @exclude      https://gazellegames.net/requests.php?*action=view*
// @match        https://gazellegames.net/forums.php*action=viewforum*
// @match        https://gazellegames.net/user.php*action=inventory*
// @match        https://gazellegames.net/user.php?*action=userlog*
// @match        https://gazellegames.net/user.php?*action=crafteditems*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/471626/GGn%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/471626/GGn%20Infinite%20Scroll.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author SB100
// ==/OpenUserJS==

/* jshint esversion: 6 */

/**
 * Different pages have different table ids/classnames - lets set them up here
 */
let tableSelector;

function setTableSelector() {
  const href = window.location.href;

  // HnR page / Seeding page
  if (href.includes('torrents.php') && (href.includes('type=viewseed') || href.includes('type=hitnrun'))) {
    tableSelector = '.torrent_history > table';
    return true;
  }

  // potential HnR
  if (href.includes('torrents.php') && href.includes('type=potential_hnr')) {
    tableSelector = '#torrent_history_table';
    return true;
  }

  // ignore individual torrent pages
  if (href.includes('torrents.php') && href.includes('id=')) {
    return false;
  }

  // torrent list page
  if (href.includes('torrents.php')) {
    tableSelector = '#torrent_table';
    return true;
  }

  // collection individual view page
  if (href.includes('collections.php') && href.includes('id=')) {
    tableSelector = '#torrent_table';
    return true;
  }

  // collection list page
  if (href.includes('collections.php')) {
    tableSelector = '.collections_art_display';
    return true;
  }

  // request list page
  if (href.includes('requests.php')) {
    tableSelector = '#requests_list';
    return true;
  }

  // forum thread view page
  if (href.includes('forums.php')) {
    tableSelector = '.forum_index';
    return true;
  }

  // inventory page
  if (href.includes('user.php') && href.includes('action=inventory')) {
    tableSelector = '#items_list';
    return true;
  }

  // userlog page
  if (href.includes('user.php') && href.includes('action=userlog')) {
    tableSelector = '.thin > table';
    return true;
  }

  if (href.includes('user.php') && href.includes('action=crafteditems')) {
    tableSelector = '#content > table';
    return true;
  }

  return false;
}

/**
 * Create a loading indicator to show the user we're doing something
 */
let loadingElementReference;

function getLoadingElementReference() {
  if (!loadingElementReference) {
    loadingElementReference = document.createElement('div');
    loadingElementReference.innerHTML = 'Loading ...';
    loadingElementReference.style.color = '#fff';
    loadingElementReference.style.lineHeight = '30px';
  }

  return loadingElementReference;
}

/**
 * Turn a HTML string into a HTML element so that we can run querySelector calls against it
 */
function htmlToElement(html) {
  var template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content;
}

/**
 * Append all "rows" to "tableElement"
 */
function appendRowsToTable(tableElement, rows) {
    if (tableElement != null && tableElement.tagName === "TABLE") { //if its a table, add rows to tbody
        tableElement = tableElement.getElementsByTagName("tbody")[0];
    }
    rows.forEach(row => {
      tableElement.appendChild(row);
    });
}

/**
 * Find the "next" anchor element from the pagination element.
 */
function findNextLinkFromPagination(paginationElement) {
  const nextAnchorArray = Array.from(paginationElement.querySelectorAll('a')).filter(a => a.innerText.startsWith('Next'));
  return nextAnchorArray.length > 0 ? nextAnchorArray[0] : null;
}

/**
 * On successful xmlRequest, process the results
 */
function xmlOnLoad(linkBox, successCallback, result) {
  // must be a successful page load
  if (result.status !== 200) {
    return;
  }

  // remove the loading indicator
  linkBox.removeChild(getLoadingElementReference());

  // turn into html
  const html = htmlToElement(result.response);
  // get all the trs, minus the column header
  const trs = Array.from(html.querySelectorAll(`${tableSelector} tr, ${tableSelector} li`)).filter(tr => tr.classList.contains('colhead') === false && tr.classList.contains('colhead_dark') === false);
  // get the next href link
  const nextHref = findNextLinkFromPagination(html.querySelector(`${tableSelector} + .linkbox`));

  // append to the current table
  appendRowsToTable(document.querySelector(`${tableSelector}`), trs);

  // in the case of the inventory page, we also need to find the hidden dialog boxes, and append those
  const dialogs = Array.from(html.querySelectorAll(`.inventory + .hidden > div`)).filter(div => div.id !== 'titlepreview_dialog' && div.id !== 'avatarpreview_dialog');
  appendRowsToTable(document.querySelector('.inventory + .hidden'), dialogs);

  // update old next href with new next href
  successCallback(nextHref);
}

/**
 * On a failed xmlRequest, show an error message and cancel the observer
 */
function xmlOnFailure(linkBox, failureCallback) {
  linkBox.removeChild(getLoadingElementReference());

  const errorDiv = document.createElement('div');
  errorDiv.innerHTML = 'There was an error loading the next page. Aborting infinite scroll';
  errorDiv.style.color = '#ff3232';
  errorDiv.style.lineHeight = '30px';

  linkBox.insertBefore(errorDiv, linkBox.firstChild);

  failureCallback();
}

/**
 * Loads the next page by:
 * - Loading the URL
 * - Turning the result into a HTML element
 * - Finding the results table and appending its rows to the current table
 * - Running a callback to update the "next" link to the "next" link thst was loaded from this call
 */
function loadNextPage(url, linkBox, successCallback, failureCallback) {
  GM_xmlhttpRequest({
    method: 'get',
    url: url,
    timeout: 5000,
    onloadstart: function () {
      linkBox.insertBefore(getLoadingElementReference(), linkBox.firstChild);
    },
    onload: xmlOnLoad.bind(null, linkBox, successCallback),
    onerror: xmlOnFailure.bind(null, linkBox, failureCallback),
    ontimeout: xmlOnFailure.bind(null, linkBox, failureCallback)
  });
}

/**
 * Overwrite the current inventory dialog display box with one that works with infnite scroll as well
 */
function newItemInfo(id, title) {
  const itemId = document.querySelector(`form[data-itemname="${title}"]`).dataset.itemid;

  const dialogOptions = {
    "title": unsafeWindow.$('<div/>').html(title).text(),
    "width": 800,
    "height": 620,
    "show": {
      effect: 'fold',
      duration: 'fast'
    },
    "hide": {
      effect: 'fold',
      duration: 'fast'
    },
    "resizable": true,
    "draggable": true,
    "position": {
      my: 'center',
      at: 'center'
    },
    "close": function () {
      unsafeWindow.$(this).dialog("close");
    }
  };
  const dialogExtendOptions = {
    "closable": true,
    "maximizable": true,
    "minimizable": true,
    "collapsable": false,
    "dblclick": "collapse",
    "icons": {
      "maximize": "ui-icon-arrow-4-diag"
    },
    "load": function () {
      const $itemlink = document.createElement('a');
      $itemlink.classList.add("ui-corner-all", "ui-state-default");
      $itemlink.style.width = "19px";
      $itemlink.style.height = "18px";
      $itemlink.role = "button";
      $itemlink.innerHTML = '<span class="ui-icon ui-icon-link">item link</span>';
      $itemlink.href = `/shop.php?ItemID=${itemId}`;
      $itemlink.target = '_blank';
      this.previousElementSibling.querySelector('.ui-dialog-titlebar-buttonpane').appendChild($itemlink);
    },
  };

  if (document.querySelector(`.hidden div[data-itemid="${itemId}"]`)) {
    unsafeWindow.$(`.hidden div[data-itemid="${itemId}"]`).dialog(dialogOptions).dialogExtend(dialogExtendOptions);
  }
  else {
    unsafeWindow.$('#' + id).dialog(dialogOptions).dialogExtend(dialogExtendOptions);
  }
}

/**
 * Setup the intersection observer, and load the next page when we get to the bottom of the page
 */
(function () {
  'use strict';

  // check we have observers available to us
  if (!IntersectionObserver) return;

  // check we're on a compatible page
  if (!setTableSelector()) {
    console.log('[GGn Infinite Scroll] Not on a compatible page');
    return;
  }

  // find the pagination element
  const linkBox = document.querySelector(`${tableSelector} + .linkbox`);

  // what to do when we find the element in the root element
  const callback = function (entries, observer) {
    entries.forEach(entry => {
      // we're intersecting the pagination - find the next page and load it
      if (entry.isIntersecting !== true) {
        return;
      }

      // find the "next" page link from the results
      const nextAnchorElem = findNextLinkFromPagination(entry.target);

      // if there is no next page, there is nothing more to do!
      if (!nextAnchorElem || nextAnchorElem.href.endsWith('null')) {
        // stop observing
        observer.unobserve(linkBox);

        // return early
        return;
      }

      // otherwise:
      // success: append the results of the next page to the current table and update "next" link
      // failure: stop observing the page - there are no more pages to load
      loadNextPage(nextAnchorElem.href, linkBox, (nextHref) => {
        // update the "next" link with the next "next" link!
        nextAnchorElem.href = nextHref;
      }, () => {
        // stop observing
        observer.unobserve(linkBox);
      });
    });
  };

  const options = {
    root: document,
    rootMargin: '0px',
    threshold: 1.0
  };

  // create the observer
  const observer = new IntersectionObserver(callback, options);

  // Start observing the target node for mutations
  observer.observe(linkBox, options);

  // overwrite the item info function in the inventory to make it infinite scroll compatible
  unsafeWindow.ItemInfo = newItemInfo;
})();
