// ==UserScript==
// @name         Bitcointalk Image Upload Button (TalkIMG)
// @version      0.2
// @description  Adds an button to the post creation form that uploads an image and inserts it on the post
// @author       TryNinja
// @match        https://bitcointalk.org/index.php?action=post*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointalk.org
// @grant        none
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/465886/Bitcointalk%20Image%20Upload%20Button%20%28TalkIMG%29.user.js
// @updateURL https://update.greasyfork.org/scripts/465886/Bitcointalk%20Image%20Upload%20Button%20%28TalkIMG%29.meta.js
// ==/UserScript==

const apiKey = '';
const uploadUrl = 'https://proxy.ninjastic.space/?url=https://talkimg.com/api/1/upload';

(function() {
    'use strict';

const forumImgButtonTarget = document.querySelector('a:nth-child(24)');

const imgUploadButton = document.createElement('a');
imgUploadButton.href = "javascript:void(0);";
imgUploadButton.onclick = () => document.getElementById('uploadImage').click();
imgUploadButton.innerHTML = `<img onmouseover="bbc_highlight(this, true);" onmouseout="if (window.bbc_highlight) bbc_highlight(this, false);" src="https://www.talkimg.com/images/2023/05/09/logo418d0697bfbdeac7.png" align="bottom" width="23" height="22" alt="Upload Image" title="Upload Image" style="background-image: url('https://bitcointalk.org/Themes/custom1/images/bbc/bbc_bg.gif'); margin: 1px 2px 1px 1px;">`;
forumImgButtonTarget.after(imgUploadButton);

const uploadInput = document.createElement('input');
uploadInput.id = 'uploadImage';
uploadInput.type = 'file';
uploadInput.accept = 'image/*';
uploadInput.style.display = 'none';
forumImgButtonTarget.after(uploadInput);

const insertImageUrl = imgUrl => {
    /*global replaceText, a*/
   replaceText(`[img]${imgUrl}[/img]`, document.forms.postmodify.message);
};

uploadInput.onchange = async () => {
  const { files } = uploadInput;
  if (files[0].size) {
    const formData = new FormData();
    formData.append('type', 'file');
    formData.append('format', 'json');
    formData.append('source', files[0]);

    console.log('uploading image');

    const upload = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
      mode: 'cors',
      body: formData,
    });

    const result = await upload.json();
      console.log(result)

    if (result.status_code === 200) {
      insertImageUrl(result.image.url);
    }

   uploadInput.value = undefined;
  }
};

})();