// ==UserScript==
// @name         cmx-timeline-toggle
// @namespace    https://zhuzi.dev
// @version      0.1
// @description  控制是否显示时间线
// @author       Bambooom
// @match        https://m.cmx.im/web/*
// @icon         https://www.google.com/s2/favicons?domain=m.cmx.im
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429792/cmx-timeline-toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/429792/cmx-timeline-toggle.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  var localKey = 'SHOW_TIMELINE';

  // https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e
  function divReady(selector) {
    return new Promise((resolve, reject) => {
      let el = document.querySelector(selector);
      if (el) { resolve(el); }

      new MutationObserver((_, observer) => {
        // Query for elements matching the specified selector
        Array.from(document.querySelectorAll(selector)).forEach((element) => {
          resolve(element);
          //Once we have resolved we don't need the observer anymore.
          observer.disconnect();
        });
      })
        .observe(document.documentElement, {
          childList: true,
          subtree: true
        });
    });
  }

  function toggleCols(cols, show = true) {
    cols.forEach(function(col) {
      if (show) {
        col.style.display = 'flex';
      } else {
        col.style.display = 'none';
      }
    });
  }

  await divReady('.compose-form .compose-form__publish');
  await divReady('div.column');

  var div = document.querySelector('.compose-form .compose-form__publish');
  var button = div.firstElementChild;
  var toggle = document.createElement('div');
  var localValue = localStorage.getItem(localKey) === '1' ? 1 : 0;
  toggle.innerHTML = `<label class="checkbox"><input id="show-timeline" type="checkbox" checked/>显示时间线</label>`;
  div.insertBefore(toggle, button);
  div.style.justifyContent = 'space-between';
  div.style.alignItems = 'center';

  var check = document.getElementById('show-timeline');
  check.checked = !!localValue;
  check.onclick = function (e) {
    var val = e.target.checked ? 1 : 0;
    localStorage.setItem(localKey, val);
    var cols = Array.from(document.getElementsByClassName('column'));
    toggleCols(cols, !!val);
  };

  await divReady('.column .item-list');
  setTimeout(function() {
    if (!localValue) {
      var cols = Array.from(document.getElementsByClassName('column'));
      toggleCols(cols, !!localValue);
    }
  }, 1000);
})();