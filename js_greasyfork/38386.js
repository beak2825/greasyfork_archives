// ==UserScript==
// @name         Copy Markdown-Format Address
// @namespace    undefined
// @version      0.2.3
// @description  Copy current tab title and url, and convert to markdown syntax
// @author       https://github.com/Dream4ever
// @require      https://code.jquery.com/jquery-latest.js
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38386/Copy%20Markdown-Format%20Address.user.js
// @updateURL https://update.greasyfork.org/scripts/38386/Copy%20Markdown-Format%20Address.meta.js
// ==/UserScript==

// Thanks to https://stackoverflow.com/questions/400212/
// solved the problem of unable to select text
// of none-displayed textarea

var rndId = Math.random().toString(36).substring(5);

var styles = `
  .common-${rndId} {
    min-height: 0;
    border-radius: 5px;
    border-color: #07c;
    background: rgb(240, 240, 240);
    box-shadow: 3px 3px 3px rgba(0, 0, 0, .1);
    position: fixed;
    bottom: 20px;
    right: 100px;
    z-index: 2;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.15;
    color: #000;
  }

  .active-${rndId} {
    width: 80px;
    height: 28px;
    padding: 5px 10px;
    opacity: 1;
  }

  .unactive-${rndId} {
    width: 10px;
    height: 10px;
    padding: 10px;
    opacity: .2;
  }
`;

GM_addStyle(styles);

(function () {
  'use strict';

  window.onload = function () {
    var nodeButton = document.createElement('button');
    nodeButton.setAttribute('id', rndId);
    nodeButton.setAttribute('class', `common-${rndId} unactive-${rndId}`);
    document.body.appendChild(nodeButton);

    var id = '#' + rndId;
    var $btn = $(id);

    $btn.hover(function()
    {
      $btn.text('复制');
      $btn.removeClass(`unactive-${rndId}`).addClass(`active-${rndId}`);
      },
    function()
    {
      $btn.text('');
      $btn.removeClass(`active-${rndId}`).addClass(`unactive-${rndId}`);
    });

    $btn.on('click', function (event) {

      // get title and url
      var title = document.title;
      var url = document.URL;
      var address = '[' + title + '](' + url + ')';

      if (copyTextToClipboard(address)) {
          $btn.text('复制成功');
          $btn.css('color', 'green');
          setTimeout(function() {
            $btn.css('color', '#000');
          }, 2000);
      } else {
          $btn.text('复制失败');
          $btn.css('color', 'red');
          setTimeout(function() {
            $btn.css('color', '#000');
          }, 2000);
      }
    });
  };

})();

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';

  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  var isOK = false;

  try {
    var successful = document.execCommand('copy');
    isOK = !!successful;
  } catch (err) {}

  document.body.removeChild(textArea);

  return isOK;
}
