// ==UserScript==
// @name         Readouble Laravel Index
// @namespace    https://greasyfork.org/ja/scripts/374649-readouble-laravel-index
// @version      0.2
// @description  ReadDoubleのLaravel日本語ドキュメントに公式英語ドキュメントのような見出しリンクを追加する
// @author       tobigumo
// @match        https://readouble.com/laravel/*.*/*/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374649/Readouble%20Laravel%20Index.user.js
// @updateURL https://update.greasyfork.org/scripts/374649/Readouble%20Laravel%20Index.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const index = document.createElement('ul');

  const content_container = document.getElementById('contentContainer');
  const headers = content_container.querySelectorAll('a[name] + h2,a[name] + h3');
  const anchors = content_container.querySelectorAll('a[name]');

  headers.forEach( function (value, i) {

    if(value.tagName === 'H2') {
      const ul = document.createElement('ul');
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.innerHTML = value.textContent;
      a.href = '#' + anchors[i].name;

      li.appendChild(a);
      index.appendChild(li);
    }

    if(value.tagName === 'H3') {
      const li = document.createElement('li');
      const a = document.createElement('a');

      a.innerHTML = value.textContent;
      a.href = '#' + anchors[i].name;

      li.appendChild(a);

      const last_li = index.lastElementChild;
      const last_element = last_li.lastElementChild;
      if (last_element.tagName === 'UL') {
        last_element.appendChild(li);
      }
      else {
        const ul = document.createElement('ul');
        ul.appendChild(li);
        last_li.appendChild(ul);
      }
    }

  });

  content_container.insertBefore(index, content_container.firstChild);

})();
