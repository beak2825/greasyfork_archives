// ==UserScript==
// @name         RegExr: toggle sidebar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to toggle sidebar on RegExr.com
// @author       Himalay
// @match        http://regexr.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26846/RegExr%3A%20toggle%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/26846/RegExr%3A%20toggle%20sidebar.meta.js
// ==/UserScript==

(function () {
  'use strict';

  document.head.appendChild(Object.assign(document.createElement('style'), {
    innerText: `#menuToggle {
                    font-weight: 900;
                    color: #101113;
                    margin-right: 10px;
                  }

                  .sidemenu {
                    position:absolute;
                    float: none;
                    left: -352px;
                  }

                  .mainarea {
                    float: none;
                    width: 100%;
                  }`
  }));

  toggleSidemenu();

  document.querySelector('#docview  .title').prepend(Object.assign(document.createElement('a'), {
    id: 'menuToggle',
    innerText: '☰'
  }));

  document.querySelector('#menuToggle').addEventListener('click', toggleSidemenu);

  function toggleSidemenu() {
    document.querySelector('#libview').classList.toggle('sidemenu');
    document.querySelector('#docview').classList.toggle('mainarea');
  }
})();
