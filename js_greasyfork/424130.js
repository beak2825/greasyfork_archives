// ==UserScript==
// @name         Bluegq check
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sdfsung
// @run-at       document-idle
// @match        https://www.bluegq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.focus
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/424130/Bluegq%20check.user.js
// @updateURL https://update.greasyfork.org/scripts/424130/Bluegq%20check.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const format = function date2str(x, y) {
    var z = {
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
      return x.getFullYear().toString().slice(-v.length)
    });
  }

  const CHECKED_DATE_VAR_NAME = 'checked_date';

  const isChecked = function(node) {
    const img = node.querySelector('#fx_checkin_b');
    return !/.*mini.gif$/.test(img.src);
  };

  const node = document.querySelector('#fx_checkin_topb');
  // console.log(node);
  if(node) {
    if(isChecked(node)) {
      console.log('checked');
      // window.focus();
      // setTimeout(function(){
      //   window.close();
      // }, 1000);
    } else {
      console.log('not check');
      node.children[0].click();
      const status = isChecked(node) ? 'succeed' : 'failed';
      console.log(status);
    }
  }
})();