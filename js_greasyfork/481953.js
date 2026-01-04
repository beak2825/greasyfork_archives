// ==UserScript==
// @name        Click image downloader
// @namespace   FawayTT
// @description Download images with one click in the corner
// @match       *://*/*
// @homepage    https://github.com/FawayTT/userscripts
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0
// @author      FawayTT
// @license     MIT
// @description 11/20/2023, 8:17:45 PM
// @downloadURL https://update.greasyfork.org/scripts/481953/Click%20image%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/481953/Click%20image%20downloader.meta.js
// ==/UserScript==

(() => {
  let currentImagesLength = 0;
  const addHoverDiv = (image) => {
    const imageRect = image.getBoundingClientRect();
    const topPosition = imageRect.top + window.scrollY;
    const leftPosition = imageRect.left + window.scrollX;
    const hoverDiv = document.createElement('div');
    hoverDiv.style.cssText = `
      position: absolute;
      top: ${topPosition}px;
      left: ${leftPosition}px;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      padding: 5px 10px;
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 9999;
    `;
    hoverDiv.innerText = '⇩';
    hoverDiv.addEventListener('click', () => {
      const currentUrl = window.location.href;
      setCache('prevUrl', currentUrl);
      const link = document.createElement('a');
      link.href = image.src + '?&to-dwn';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    document.body.appendChild(hoverDiv);
    // Remove the added div when the mouse leaves the image
    image.addEventListener('mouseleave', (e) => {
      setTimeout(() => {
        if (!hoverDiv.matches(':hover')) {
          hoverDiv.remove();
        }
      }, 500);
    });
  };

  const setCache = (name, url) => {
    GM_setValue(name, url);
  };
  const getCache = (name) => {
    var cache = GM_getValue(name, undefined);
    if (cache) {
      return cache;
    } else {
      return undefined;
    }
  };

  const addDownloadButtons = () => {
    if (document.hidden) return;
    const currentUrl = window.location.href;
    let images = document.getElementsByTagName('img');
    images = Array.from(images).filter((image) => {
      return image.naturalWidth > 500 || image.naturalHeight > 500;
    });
    currentImagesLength = images.length;
    if (currentUrl.slice(-6) === 'to-dwn' && images) {
      const link = document.createElement('a');
      const image = images[0];
      link.href = image.src;
      link.download = image.src.split('/').pop().split('.')[0];
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.location.replace(getCache('prevUrl'));
      setCache('prevUrl', '');
      return;
    }
    for (const image of images) {
      image.addEventListener('mouseenter', (e) => {
        addHoverDiv(image);
      });
    }
  };

  setTimeout(() => {
    addDownloadButtons();
  }, 500);

  let prevScrollPos = 0;
  let checkTimeout;
  window.addEventListener('scroll', () => {
    const currentScrollPos = window.scrollY;
    if (currentScrollPos > 1000 + prevScrollPos) {
      clearTimeout(checkTimeout);
      checkTimeout = setTimeout(addDownloadButtons, 1000);
      prevScrollPos = currentScrollPos;
    }
  });

  document.addEventListener('visibilitychange', addDownloadButtons);
})();