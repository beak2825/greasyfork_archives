// ==UserScript==
// @name         Mobilism Image Uploader
// @namespace    mobilism-image-upload
// @license      MIT
// @version      1.5
// @author        SirGryphin
// @description  Double-click an image to open a context menu with options to upload and resize the image using Mobilism Image Uploader
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/470687/Mobilism%20Image%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/470687/Mobilism%20Image%20Uploader.meta.js
// ==/UserScript==

// Feature Updates
// New style menu
// auto copy to clipboard
// figure out getting right lick context menu working

(function() {
  // Event listener for double-clicking an image
  document.addEventListener('dblclick', function(event) {
    var imageUrl = getImageUrl(event.target);
    if (imageUrl) {
      createContextMenu(imageUrl, event.clientX, event.clientY);
    }
  });

  // Create the context menu with the upload and resize buttons
  function createContextMenu(imageUrl, x, y) {
    var contextMenu = document.createElement('div');
    contextMenu.style.position = 'fixed';
    contextMenu.style.top = y + 'px';
    contextMenu.style.left = x + 'px';
    contextMenu.style.backgroundColor = 'white';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.padding = '5px';
    contextMenu.style.display = 'flex';
    contextMenu.style.flexDirection = 'column';

    var singleimageButton = createButton('Single Image', function() {
      uploadToMobilism(imageUrl, null, 320, 'codehtml');
      contextMenu.remove();
    });

    var multiimageButton = createButton('Multi Image', function() {
      uploadToMobilism(imageUrl, 160, 240, 'codebb');
      contextMenu.remove();
    });

    var largeimageButton = createButton('Large Image', function() {
      uploadToMobilism(imageUrl, null, 500, 'codehtml');
      contextMenu.remove();
    });

    var cancelButton = createButton('Cancel', function() {
      contextMenu.remove();
    });

    contextMenu.appendChild(singleimageButton);
    contextMenu.appendChild(multiimageButton);
    contextMenu.appendChild(largeimageButton);
    contextMenu.appendChild(cancelButton);
    document.body.appendChild(contextMenu);
  }

  // Utility function to create a button
  function createButton(text, clickHandler) {
    var button = document.createElement('button');
    button.textContent = text;
    button.style.padding = '5px 10px';
    button.style.cursor = 'pointer';
    button.addEventListener('click', clickHandler);
    return button;
  }

  // Get the URL of the clicked image
  function getImageUrl(element) {
    if (element.tagName.toLowerCase() === 'img') {
      return element.src;
    } else if (element.parentNode) {
      return getImageUrl(element.parentNode);
    }
    return null;
  }

  // Upload the image to Mobilism Image Uploader
  function uploadToMobilism(imageUrl, newWidth, newHeight, id) {
    // Get the image from cache
    GM_xmlhttpRequest({
      method: 'GET',
      url: imageUrl,
      responseType: 'blob',
      onload: function(response) {
        var blob = response.response;
        var fileName = imageUrl.split(/[?#]/)[0].split('/').pop();

        var fd = new FormData();
        fd.append("links", "");
        fd.append("imgUrl", "");
        fd.append("fileName[]", fileName);
        fd.append("Search files", "Browse");
        fd.append("file[]", blob, fileName);
        fd.append("alt[]", fileName.replace(/[-_]/g, " ").replace(/\.[^.]*$/, ""));
        fd.append("private[0]", "1"); // "Private images.."
        //fd.append("shorturl[0]", "1"); // "Create short URLs using b54"

        if (newWidth) {
          fd.append("new_width[]", newWidth);
        }
        if (newHeight) {
          fd.append("new_height[]", newHeight);
        }

        fd.append("submit", "Upload");

        GM_xmlhttpRequest({
          method: 'POST',
          url: 'https://images.mobilism.org/upload.php',
          data: fd,
          onload: function(response) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.responseText, "text/html");
            var url = doc.getElementById(id).value; // Modified here
            prompt("URL:", url);
          }
        });
      }
    });
  }
})();