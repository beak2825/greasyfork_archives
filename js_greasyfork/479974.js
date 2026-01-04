// ==UserScript==
// @name         1337x - UX Enhancement
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Extend titles, add images to torrent list, full width site
// @author       French Bond
// @match        https://1337x.to/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479974/1337x%20-%20UX%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/479974/1337x%20-%20UX%20Enhancement.meta.js
// ==/UserScript==

const VISIBLE_IMAGES = 4; // Number of images to show initially

(function () {
  'use strict';

  // List all torrent links on the page
  function listTorrentLinks() {
    return document.querySelectorAll('.table-list a[href^="/torrent/"]');
  }

  // Clean the page title in order to get the torrent title
  function cleanTitle(title) {
    // Remove "Download " from the beginning
    if (title.startsWith('Download ')) {
      title = title.substring('Download '.length);
    }
    // Remove anything after " |"
    let pipeIndex = title.indexOf(' Torrent |');
    if (pipeIndex !== -1) {
      title = title.substring(0, pipeIndex);
    }
    return title;
  }

  // Modify the H1 content on torrent pages to show the full title
  function modifyH1ContentOnTorrentPages() {
    if (window.location.pathname.startsWith('/torrent/')) {
      let h1Element = document.querySelector('.box-info-heading h1');
      if (h1Element) {
        let cleanedTitle = cleanTitle(document.title);
        h1Element.textContent = cleanedTitle;
      }
    }
  }

  // Fetch the content of the link
  function fetchContent(link, onSuccess) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: link.href,
      onload: function (response) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(response.responseText, 'text/html');
        onSuccess(doc);
      },
    });
  }

  // Process the link to update the title and add download buttons and images
  function processLink(link) {
    fetchContent(link, (doc) => {
      updateLinkTitle(link, doc);
      appendImages(link, doc);
      addDownloadButtons(link, doc);
    });
  }

  // Update the link title
  function updateLinkTitle(link, doc) {
    let title = cleanTitle(doc.querySelector('title').innerText);
    link.innerText = title;
  }

  // Add download buttons next to the link
  function addDownloadButtons(link, doc) {
    let torrentLink = doc.querySelector("a[href*='itorrents.org/torrent/']");
    let magnetLink = doc.querySelector("a[href^='magnet:?']");

    let buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.alignItems = 'center';
    buttonsContainer.style.gap = '5px';
    buttonsContainer.style.marginTop = '10px';

    // Torrent button
    let torrentButton = document.createElement('a');
    torrentButton.href = torrentLink ? torrentLink.href.replace('http:', 'https:') : '#';
    torrentButton.title = 'Download torrent file';
    torrentButton.innerHTML =
      '<i class="flaticon-torrent-download" style="color: #89ad19; font-size: 16px"></i>';

    // Magnet button
    let magnetButton = document.createElement('a');
    magnetButton.href = magnetLink ? magnetLink.href : '#';
    magnetButton.title = 'Download via magnet';
    magnetButton.innerHTML =
      '<i class="flaticon-magnet" style="color: #da3a04; font-size: 16px"></i>';

    buttonsContainer.appendChild(torrentButton);
    buttonsContainer.appendChild(magnetButton);

    link.after(buttonsContainer);
  }

  // Append images related to the torrent
  function appendImages(link, doc) {
    let images = doc.querySelectorAll('#description img');
    if (images.length > 0) {
      let flexContainer = document.createElement('div');
      flexContainer.style.display = 'flex';
      flexContainer.style.flexWrap = 'wrap';
      flexContainer.style.gap = '10px';
      flexContainer.style.marginTop = '10px';

      let clonedImages = []; // Array to store cloned images

      images.forEach((img, index) => {
        let clonedImg = img.cloneNode(true);
        if (img.hasAttribute('data-original')) {
          clonedImg.src = img.getAttribute('data-original');
        }
        clonedImg.style.maxHeight = '100px';
        clonedImg.style.setProperty('margin', '0', 'important');

        // Show only the first VISIBLE_IMAGES images initially
        clonedImg.style.display = index < VISIBLE_IMAGES ? 'block' : 'none';
        flexContainer.appendChild(clonedImg);
        clonedImages.push(clonedImg); // Store the cloned image
      });

      // Add "Show More/Less" button if there are more than VISIBLE_IMAGES images
      if (images.length > VISIBLE_IMAGES) {
        let showMoreButton = document.createElement('button');
        showMoreButton.textContent = 'Show More';

        showMoreButton.onclick = function () {
          // Toggle visibility of additional images
          let isShowingMore = showMoreButton.textContent === 'Show Less';
          clonedImages.forEach((img, index) => {
            if (index >= VISIBLE_IMAGES) {
              img.style.display = isShowingMore ? 'none' : 'block';
            }
          });
          showMoreButton.textContent = isShowingMore ? 'Show More' : 'Show Less';
        };

        flexContainer.appendChild(showMoreButton);
      }

      link.parentNode.insertBefore(flexContainer, link.nextSibling);

      clonedImages.forEach((clonedImg) => {
        // Mouseover event to show enlarged image
        clonedImg.addEventListener('mouseover', function () {
          showEnlargedImg(clonedImg.src);
        });

        // Mousemove event to update the position of the enlarged image
        clonedImg.addEventListener('mousemove', updateEnlargedImgPosition);

        // Mouseout event to remove enlarged image
        clonedImg.addEventListener('mouseout', function () {
          removeEnlargedImg();
        });
      });
    }
  }

  // Function to show an enlarged image
  function showEnlargedImg(imgSrc) {
    const enlargedImg = document.createElement('img');
    enlargedImg.src = imgSrc;
    enlargedImg.style.position = 'fixed';
    enlargedImg.style.width = '500px';
    enlargedImg.style.height = '500px';
    enlargedImg.style.pointerEvents = 'none'; // Ignore pointer events
    enlargedImg.id = 'enlargedImg';
    document.body.appendChild(enlargedImg);
  }

  // Function to update the position of the enlarged image
  function updateEnlargedImgPosition(e) {
    const enlargedImg = document.getElementById('enlargedImg');
    if (enlargedImg) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const imgWidth = 500; // Width of the enlarged image
      const imgHeight = 500; // Height of the enlarged image
      const offsetX = 10; // Horizontal offset from the cursor
      const offsetY = 10; // Vertical offset from the cursor

      let leftPosition = e.clientX + offsetX;
      let topPosition = e.clientY + offsetY;

      // Adjust position if the image goes out of the viewport
      if (leftPosition + imgWidth > viewportWidth) {
        leftPosition = e.clientX - imgWidth - offsetX;
      }
      if (topPosition + imgHeight > viewportHeight) {
        topPosition = e.clientY - imgHeight - offsetY;
      }

      enlargedImg.style.left = leftPosition + 'px';
      enlargedImg.style.top = topPosition + 'px';
    }
  }

  // Function to remove enlarged image
  function removeEnlargedImg() {
    const enlargedImg = document.getElementById('enlargedImg');
    if (enlargedImg) {
      document.body.removeChild(enlargedImg);
    }
  }

  // Replace the link text with the title and append images
  function replaceLinkTextWithTitlesAndAppendImages() {
    let torrentLinks = listTorrentLinks();
    torrentLinks.forEach(processLink);
  }

  function injectCustomCSS() {
    // Remove the max-width on the container
    GM_addStyle('.container { max-width: none !important; }');
  }

  // Modify the function calls accordingly
  replaceLinkTextWithTitlesAndAppendImages();
  modifyH1ContentOnTorrentPages();
  injectCustomCSS();
})();
