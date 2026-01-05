// ==UserScript==
// @name         commentsButton
// @namespace    gipppp
// @version      0.3
// @description  hide comments section and add toggle visibility button
// @author       gipppp
// @match        http://mintmanga.com/*/*
// @match        http://readmanga.me/*/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21836/commentsButton.user.js
// @updateURL https://update.greasyfork.org/scripts/21836/commentsButton.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var comments = document.querySelector('.twitter');
  var menu = document.querySelector('.reader-bottom');
  var toggleBtn = document.createElement('button');

  comments.classList.add('hide');

  toggleBtn.innerHTML = 'Комментарии';
  toggleBtn.classList.add('btn');
  toggleBtn.style.marginTop = '10px';
  menu.insertBefore(toggleBtn, comments);

  toggleBtn.addEventListener('click', function() {
    comments.classList.toggle('hide');
  });

})();