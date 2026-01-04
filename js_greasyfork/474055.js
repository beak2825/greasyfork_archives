// ==UserScript==
// @name         add-to-stargazers
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  One click add GitHub user to Stargazers
// @author       yuyinws
// @match        https://github.com/*
// @icon         https://stargazers.dev/favicon.ico
// @grant        window.onurlchange
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474055/add-to-stargazers.user.js
// @updateURL https://update.greasyfork.org/scripts/474055/add-to-stargazers.meta.js
// ==/UserScript==


(function() {
  'use strict';
  var _wr = function(type) {
      var orig = history[type];
      return function() {
          var rv = orig.apply(this, arguments);
          var e = new Event(type);
          e.arguments = arguments;
          window.dispatchEvent(e);
          return rv;
      };
  };
  history.pushState = _wr('pushState');
  history.replaceState = _wr('replaceState');

  function addBtn() {
      const parent = document.querySelector('.js-profile-editable-area')?.parentNode
      const isBtnExist = document.querySelector('#add-to-stargazers')

      if (parent && !isBtnExist) {
          const title = document.title.replace(" ", "")
          const regex = /(.*?)\((.*?)\)/;
          const match = title.match(regex);

          const avatar_url = document.querySelector(".avatar-user")?.getAttribute('src')

          const userInfo = {
            login: match[1],
            name: match[2],
            avatar_url,
          }

          const encode = btoa(encodeURIComponent(JSON.stringify(userInfo)))


          const reference = document.querySelector('.js-profile-editable-area')
          const insert = document.createElement('a')
          insert.id = 'add-to-stargazers'
          insert.innerHTML = 'Add to Stargazers'
          insert.className = 'btn btn-block mb-md-3'
          insert.target = '_blank'
          insert.href = "https://stargazers.dev/login?encode=" + encode
          parent.insertBefore(insert, reference)
      }

  }

  window.addEventListener('replaceState', function() {
      addBtn()
  });
  window.addEventListener('pushState', function() {
      addBtn()
  });


})();
