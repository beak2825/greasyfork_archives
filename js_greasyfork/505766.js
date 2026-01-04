// ==UserScript==
// @name          BetterFotoseite
// @namespace     https://photo.knuddels.de
// @version       1.1.0
// @description   Verbessert die Darstellung des AdU
// @author        Rho
// @license       Proprietary
// @match         https://photo.knuddels.de/photos-admin*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/505766/BetterFotoseite.user.js
// @updateURL https://update.greasyfork.org/scripts/505766/BetterFotoseite.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let openedUrls = [];
  let openedTabs = [];
  let highestNumber = -1;
  const noPictureUrl = 'https://photo.knuddels.de/sf/f/photos/nopic_pro_vl.jpg';

  function forceCheck(cb) {
    if (cb.disabled) return;
    if (!cb.checked) {

      cb.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

      if (!cb.checked) {
        cb.checked = true;
        cb.dispatchEvent(new Event('input', { bubbles: true }));
        cb.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }

  function checkAllIsOk(root = document) {

    const boxes = root.querySelectorAll('input[type="checkbox"][name$="-isok"]');
    boxes.forEach(forceCheck);
  }

  function setupIsOkObserver() {

    checkAllIsOk(document);


    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {

        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;


          if (node.matches && node.matches('input[type="checkbox"][name$="-isok"]')) {
            forceCheck(node);
          }


          const inner = node.querySelectorAll?.('input[type="checkbox"][name$="-isok"]');
          if (inner && inner.length) inner.forEach(forceCheck);
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function modifyUrl(url) {
    url = url.split('?')[0];
    url = url.replace('pro0', 'pro0v');
    return url;
  }

  function extractNumber(url) {
    const match = url.match(/pro0vl(\d+)/);
    return match ? parseInt(match[1], 10) : -1;
  }

  function openProfilePhotos() {
    closeOpenedTabs();
    const profilePhotoBox = document.querySelector('.box.profilephoto');
    if (profilePhotoBox) {
      const images = profilePhotoBox.querySelectorAll('.userimage');
      images.forEach(img => {
        let parentLink = img.closest('a');
        let photoUrl = parentLink ? modifyUrl(parentLink.href) : modifyUrl(img.src);
        if (photoUrl && !openedUrls.includes(photoUrl)) {
          let newTab = window.open(photoUrl, '_blank');
          monitorTab(newTab);
          openedUrls.push(photoUrl);
          openedTabs.push(newTab);

          const numberInUrl = extractNumber(photoUrl);
          if (numberInUrl > highestNumber) highestNumber = numberInUrl;
        }
      });
      openSequentialUrls();
    }
  }

  function openSequentialUrls() {
    const baseUrl = openedUrls.find(url => extractNumber(url) === highestNumber);
    if (!baseUrl) return;
    for (let i = highestNumber - 1; i >= 0; i--) {
      const sequentialUrl = baseUrl.replace(/pro0vl\d+/, `pro0vl${i}`);
      if (!openedUrls.includes(sequentialUrl)) {
        let newTab = window.open(sequentialUrl, '_blank');
        monitorTab(newTab);
        openedUrls.push(sequentialUrl);
        openedTabs.push(newTab);
      }
    }
  }

  function monitorTab(tab) {
    const checkUrlInterval = setInterval(() => {
      if (tab.closed) return clearInterval(checkUrlInterval);
      try {
        if (tab.location.href === noPictureUrl) {
          tab.close();
          clearInterval(checkUrlInterval);
        }
      } catch (e) { /* Cross-origin */ }
    }, 100);
  }

  function closeOpenedTabs() {
    openedTabs.forEach(tab => { if (tab && !tab.closed) tab.close(); });
    openedTabs = [];
  }

  function createButton() {
    const button = document.createElement('button');
    button.innerText = 'Alle Profilbilder öffnen';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px';
    button.style.backgroundColor = '#AB030F';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', openProfilePhotos);
    document.body.appendChild(button);
  }

  const onProfilePage =
    location.href.includes('photos-admin-profile.html') ||
    location.href.includes('photos-admin-profile_submit.html');

  if (onProfilePage) createButton();

  setupIsOkObserver();
})();