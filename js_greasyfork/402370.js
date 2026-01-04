// ==UserScript==
// @name           YggTorrent amélioré
// @namespace      https://openuserjs.org/users/clemente
// @match          https://ygg.re/*
// @match          https://*.ygg.re/*
// @version        1.24
// @author         clemente
// @license        MIT
// @description    Ajoute la connexion automatique, un bouton télécharger à la recherche, et plus encore
// @inject-into    content
// @noframes
// @icon           data:image/png;base64,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
// @grant          GM_getValue
// @grant          GM_setValue
// @homepageURL    https://openuserjs.org/scripts/clemente/YggTorrent_am%C3%A9lior%C3%A9
// @supportURL     https://openuserjs.org/scripts/clemente/YggTorrent_am%C3%A9lior%C3%A9/issues
// @downloadURL https://update.greasyfork.org/scripts/402370/YggTorrent%20am%C3%A9lior%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/402370/YggTorrent%20am%C3%A9lior%C3%A9.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// login();
addDownloadButtonToTorrents();
hideSidebar();
displayLargerNfo();
fixFavicon();
searchByLatestFirst();
keepSearchWhenClickingOnSubcategoryIcon();
replaceIPTVWithRss();

function login(alreadyCalled) {
  const loginButton = document.getElementById('register');
  if (!loginButton) return; // If the user is already logged in, do nothing
  
  if (!alreadyCalled && !window.jQuery) { // If jQuery is not present, wait one second so that the scripts are loaded and the login system is active
    setTimeout(() => login(true), 1000);
    return;
  }

  let isLoginFormValid = true;
  const loginForm = document.getElementById('user-login');
  loginForm.querySelectorAll('input').forEach(input => {
    isLoginFormValid = isLoginFormValid && input.checkValidity();
  });
  if (!isLoginFormValid) return; // If the form is not valid, then autocomplete is not active and the popup should not bother the user

  loginButton.click();
  loginForm.querySelector('button').click();
  
  function closePopupIfDisplayed(mutations, observer) {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.classList.contains('alert-success')) {
          document.querySelector('button.close').click();
          observer.disconnect();
        }
      });
    });
  }

  // Wait for the confirmation popup to appear then close it
  const popupObserver = new MutationObserver(closePopupIfDisplayed);
  popupObserver.observe(document.body, { childList: true });
}

function addDownloadButtonToTorrents() {
  // For every torrent, add the download button
  const torrents = document.querySelectorAll('.results table tbody tr');
  torrents.forEach(torrent => {
    const torrentId = torrent.querySelector('a[target]').target;
    const downloadIcon = document.createElement('span');
    downloadIcon.classList.add('ico_download');
    const downloadButton = document.createElement('a');
    downloadButton.href = `/engine/download_torrent?id=${torrentId}`;
    downloadButton.append(downloadIcon);
    downloadButton.style = 'float: left;';
    
    const nameLink = torrent.querySelector('td:nth-child(3) a');
    nameLink.parentNode.insertBefore(downloadButton, nameLink);
  });
}

function hideSidebar() {
  const sidebar = document.getElementById('cat');
  if (sidebar && sidebar.classList.contains('active')) {
    sidebar.querySelector('.open').click();
  }
}

function fixFavicon() {
  const favicon = document.querySelector('link[href="/favicon.ico"]');
  favicon.href = "data:image/png;base64,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";
}


function displayLargerNfo() {
  const modal = document.getElementById('nfoModal');
  if (!modal) return; // If there is no modal, the user is not on a torrent page and nothing should be done
  const modalDialog = modal.querySelector('.modal-dialog');
  modalDialog.classList.remove('modal-sm');
  modalDialog.classList.add('modal-lg');
}

function searchByLatestFirst() {
  const searchForm = document.querySelector('form.search');
  const orderInput = document.createElement('input');
  orderInput.name = 'order';
  orderInput.value = 'desc';
  orderInput.style = 'display: none';
  const sortInput = document.createElement('input');
  sortInput.name = 'sort';
  sortInput.value = 'publish_date';
  sortInput.style = 'display: none';
  searchForm.append(orderInput);
  searchForm.append(sortInput);
}

function keepSearchWhenClickingOnSubcategoryIcon() {
  document.querySelectorAll('[class^="tag_subcat_"]').forEach(node => {
    const subcategoryId = node.className.split('tag_subcat_')[1];
    node.parentNode.href = `${document.URL}&sub_category=${subcategoryId}`;
  });
}

function replaceIPTVWithRss() {
  const iptvNode = document.evaluate('//*[text()="Regarder la télé"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
  const parentNode = iptvNode.parentNode;
  const rssNode = document.createElement('a');
  rssNode.classList = 'title';
  rssNode.href = 'https://www.ygg.re/rss';
  rssNode.text = 'Flux RSS';
  iptvNode.remove();
  parentNode.appendChild(rssNode);
}
