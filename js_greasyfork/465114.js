// ==UserScript==
// @name         Image Uploader for Torn Forums
// @version      1.01
// @description  Uploads images from clipboard and inserts the URL into the Torn forums post editor
// @match        https://www.torn.com/forums.php*
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1041152
// @downloadURL https://update.greasyfork.org/scripts/465114/Image%20Uploader%20for%20Torn%20Forums.user.js
// @updateURL https://update.greasyfork.org/scripts/465114/Image%20Uploader%20for%20Torn%20Forums.meta.js
// ==/UserScript==

const CLOUD_NAME = 'dhc6ecjkq';

const UPLOAD_PRESET = 'mswoyebz';

// Get the paste event
document.addEventListener('paste', function(event) {
  // Check if the clipboard item is an image
  if (event.clipboardData && event.clipboardData.items) {
    var imageItem = null;
    for (var i = 0; i < event.clipboardData.items.length; i++) {
      if (event.clipboardData.items[i].type.indexOf('image') !== -1) {
        imageItem = event.clipboardData.items[i];
        break;
      }
    }
    // If an image is found, upload it to Cloudinary
    if (imageItem) {
      var formData = new FormData();
      formData.append('file', imageItem.getAsFile(), 'image.png');
      formData.append('upload_preset', UPLOAD_PRESET);
      GM_xmlhttpRequest({
        method: "POST",
        url: `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        data: formData,
        onload: function(response) {
            // Image uploaded successfully, get the hosted URL
            var imageUrl = JSON.parse(response.responseText).secure_url;
            //prompt('', imageUrl);
            var toggle = $('.icon.icon-source.source:not(.active)')[0]
            if (toggle) { toggle.click() }
          document.querySelector('#editor-textarea').value += ' [img]' + imageUrl + '[/img]';
            toggle.click();
        }
      });
    }
  }
});
