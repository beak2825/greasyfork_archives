// ==UserScript==
// @name            Highlight file types
// @name:ja         ファイルの種類を強調表示
// @namespace       https://greasyfork.org/users/783910
// @version         0.5.2
// @description     Highlight file type labels in Google search results
// @description:ja  Google検索結果でファイルの種類ラベルを強調表示する
// @author          ysnr777
// @match           https://www.google.com/search?*
// @grant           none
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/431108/Highlight%20file%20types.user.js
// @updateURL https://update.greasyfork.org/scripts/431108/Highlight%20file%20types.meta.js
// ==/UserScript==

'use strict';

const fileSettings = {
  PDF: {
    title: 'Adobe Portable Document Format (.pdf)',
    background: '#FDE3E4',
    color: '#EC1C24',
    iconSlug: 'adobeacrobatreader',
  },
  XLS: {
    title: 'Microsoft Excel (.xls, .xlsx)',
    background: '#E9F9F0',
    color: '#217346',
    iconSlug: 'microsoftexcel',
  },
  DOC: {
    title: 'Microsoft Word (.doc, .docx)',
    background: '#E1EAF7',
    color: '#2B579A',
    iconSlug: 'microsoftword',
  },
  PPT: {
    title: 'Microsoft PowerPoint (.ppt, .pptx)',
    background: '#F9EAE7',
    color: '#B7472A',
    iconSlug: 'microsoftpowerpoint',
  },
  KML: {
    title: 'Google Earth (.kml, .kmz)',
    background: '#E9F1FE',
    color: '#4285F4',
    iconSlug: 'googleearth',
  },
  default: {
    background: '#FFFF99',
    color: '#4D5156',
  },
};

const targetQuery = 'span.NaCKVc';

/**
 * 強調表示を実行する
 * @param {HTMLSpanElement[]} targets
 */
const highlighting = targets => {
  for (const el of targets) {
    const setting = fileSettings[el.textContent in fileSettings ? el.textContent : 'default'];

    // style
    el.style.fontWeight = 'bold';
    el.style.backgroundColor = setting.background;
    el.style.borderColor = setting.color;
    el.style.color = setting.color;

    // title
    if ('title' in setting) {
      el.title = setting.title;
    }

    // icon
    if ('iconSlug' in setting) {
      const span = document.createElement('span');
      const img = span.appendChild(document.createElement('img'));

      // get image from CDN
      img.src = `https://cdn.simpleicons.org/${setting.iconSlug}/${setting.color.slice(1)}`;

      // style
      span.style.marginRight = '0.5em';
      img.style.height = '1em';

      el.prepend(span);
    }
  }
};

// ページ読み込み時に実行
highlighting(document.querySelectorAll(targetQuery));

// 連続スクロールで増えた要素に実行
const observer = new MutationObserver((mutations, observer) => {
  for (const record of mutations) {
    for (const node of record.addedNodes) {
      highlighting(node.querySelectorAll(targetQuery));
    }
  }
});
observer.observe(
  document.getElementById('center_col'),
  {
    childList: true,
    subtree: true
  }
);
window.addEventListener('beforeunload', () => {
  observer.disconnect();
});
