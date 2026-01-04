// ==UserScript==
// @name           Google Drive File Link Extractor
// @description    Extract download links for files in Google Drive.
// @description:ja Google Drive 上のファイルのダウンロードリンクを抽出します。
// @author         Ginoa AI
// @namespace      https://greasyfork.org/ja/users/119008-ginoaai
// @version        1.0
// @match          https://drive.google.com/drive/folders/*
// @match          https://drive.google.com/drive/u/0/folders/*
// @icon           https://pbs.twimg.com/profile_images/1648150443522940932/4TTHKbGo_400x400.png
// @downloadURL https://update.greasyfork.org/scripts/523042/Google%20Drive%20File%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/523042/Google%20Drive%20File%20Link%20Extractor.meta.js
// ==/UserScript==
var targetElement = document.querySelector('#lZwQje') || document.querySelector('.gb_Re');

var newElement = document.createElement('div');
newElement.className = 'gb_je gb_ie';
newElement.innerHTML = `
  <div class="bMWlzf M1zY4b" data-tooltip="リンクを取得">
    <div class="CopyScript a-OkO9ve-gAsIFc-c Ewn2Sd" aria-label="リンクを取得" role="button" tabindex="0" aria-expanded="false" aria-haspopup="true" aria-controls="CustomSupportMenu" aria-disabled="false">
      <svg class="wo35tf" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="#000000" focusable="false">
        <path fill="none" d="M0 0h24v24H0z"></path>
        <path d="M3 3v18h18V8l-6-6H3zm16 16H5V5h7v5h5v9zM12 2v6h6l-6-6z"></path>
      </svg>
    </div>
  </div>
`;

newElement.querySelector('.CopyScript').onclick = function () {

  var items = document.querySelectorAll('[data-target="doc"]');
  var result = [];
  var output = '';

  items.forEach(item => {
    var dataId = item.getAttribute('data-id');
    var nameElement = item.querySelector('.KL4NAf') || item.querySelector('.DNoYtb') || item.querySelector('.Q5txwe');
    var fileName = nameElement ? nameElement.innerText.trim() : null;
    result.push({ fileName, dataId });
  });
  console.log(result);

  if (result && Array.isArray(result)) {
    result.forEach((item, index) => {
      if (item.fileName && item.dataId) {
        const downloadUrl = `https://drive.usercontent.google.com/download?id=${item.dataId}&export=download&authuser=0`;
        output += `${item.fileName}\n${downloadUrl}`;
        if (index < result.length - 1) {
          output += '\n\n';
        }
      }
    });
//    console.log(output);

    var textArea = document.createElement('textarea');
    textArea.value = output;
    textArea.style.width = '100%';
    textArea.style.height = '80%';
    textArea.style.marginBottom = '20px';
    textArea.style.fontFamily = 'monospace';
    textArea.style.fontSize = '14px';
    textArea.style.border = '1px solid #ccc';
    textArea.style.borderRadius = '5px';
    textArea.style.resize = 'none';

    var copyButton = document.createElement('button');
    copyButton.innerText = 'コピー';
    copyButton.style.padding = '10px 20px';
    copyButton.style.fontSize = '16px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.border = '1px solid #ccc';
    copyButton.style.borderRadius = '5px';
    copyButton.style.backgroundColor = '#4CAF50';
    copyButton.style.color = '#fff';

    copyButton.onclick = function () {
      textArea.select();
      document.execCommand('copy');
      container.remove();
    };

    var closeButton = document.createElement('button');
    closeButton.innerText = '閉じる';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.border = '1px solid #ccc';
    closeButton.style.borderRadius = '5px';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = '#fff';

    closeButton.onclick = function () {
      container.remove();
    };

    var container = document.createElement('div');
    container.style.width = '60%';
    container.style.height = '60%';
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.padding = '20px';
    container.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    container.style.borderRadius = '10px';
    container.style.textAlign = 'center';

    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.style.gap = '10px';

    container.appendChild(textArea);
    buttonContainer.appendChild(copyButton);
    buttonContainer.appendChild(closeButton);
    container.appendChild(buttonContainer);

    document.body.appendChild(container);
  }
};

if (targetElement && targetElement.parentNode) {
  targetElement.parentNode.insertBefore(newElement, targetElement);
}
