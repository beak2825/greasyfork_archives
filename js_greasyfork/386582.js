// ==UserScript==
// @name          HTML for Gmail
// @namespace     https://github.com/DeathHackz/HTML-for-Gmail
// @version       1.0.0
// @description   Send HTML Formatted Emails With Gmail
// @match         https://mail.google.com/*
// @author        DeathHackz
// @copyright     2019 DeathHackz
// @license       MIT
// @homepageURL   https://deathhackz.github.io/HTML-for-Gmail
// @supportURL    https://github.com/DeathHackz/HTML-for-Gmail/issues
// @icon          https://raw.githubusercontent.com/DeathHackz/HTML-for-Gmail/master/iocn.png
// @run-at        document-body
// @downloadURL https://update.greasyfork.org/scripts/386582/HTML%20for%20Gmail.user.js
// @updateURL https://update.greasyfork.org/scripts/386582/HTML%20for%20Gmail.meta.js
// ==/UserScript==

document.addEventListener(
  'click',
  event => {
    if (document.querySelectorAll('td.a8X.gU')) {
      const buttonHtml = `<div class="wG J-Z-I" id="convertText" data-tooltip="Convert to HTML" aria-label="Convert to HTML" tabindex="1" role="button" aria-pressed="false" style="-moz-user-select: none;">
      <div class="J-J5-Ji J-Z-I-Kv-H" style="-moz-user-select: none;">
        <div class="J-J5-Ji J-Z-I-J6-H" style="-moz-user-select: none;">
          <div class="aA8 aaA aMZ" style="-moz-user-select: none; background-image:url('https://www.gstatic.com/images/icons/material/system/1x/code_black_20dp.png')">
            <div class="a3I" style="-moz-user-select: none;">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </div>`;
      document.querySelectorAll('td.a8X.gU').forEach(element => {
        if (element.childNodes[0].id != 'convertText') {
          element.childNodes[0].insertAdjacentHTML('beforebegin', buttonHtml);
          element.childNodes[0].addEventListener(
            'click',
            event => {
              let editor;
              try {
                editor = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
              } catch (error) {
                editor = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0];
              }
              const classListLength = editor.classList.length;
              if (editor.classList[classListLength - 1] != 'HTML') {
                editor.classList.add('HTML');
                element.childNodes[0].dataset.tooltip = 'Convert to Text';
                element.childNodes[0].setAttribute('aria-label', 'Convert to Text');
                element.childNodes[0].childNodes[1].childNodes[1].childNodes[1].style.backgroundImage = 'url("https://www.gstatic.com/images/icons/material/system/1x/title_black_20dp.png")';
                const rawText = editor.innerText;
                editor.innerHTML = rawText;
              } else {
                editor.classList.remove('HTML');
                element.childNodes[0].dataset.tooltip = 'Convert to HTML';
                element.childNodes[0].setAttribute('aria-label', 'Convert to HTML');
                element.childNodes[0].childNodes[1].childNodes[1].childNodes[1].style.backgroundImage = 'url("https://www.gstatic.com/images/icons/material/system/1x/code_black_20dp.png")';
                const htmlText = editor.innerHTML;
                editor.innerText = htmlText;
              }
            },
            false
          );
        }
      });
    }
  },
  false
);
