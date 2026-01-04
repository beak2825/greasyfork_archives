// ==UserScript==
// @name         auto-publish
// @namespace    cyzeng
// @version      0.2
// @description  自动提审
// @author       You
// @match        https://code.int.ankerjiedian.com/jiedian/mango-miniprogram
// @match        https://code.int.jiediankeji.com/jiedian/mango-miniprogram
// @match        https://gitlab.int.zhumanggroup.com/jiedian/jiedian/mango-miniprogram

// @grant        GM_xmlhttpRequest
// @connect      fe-dev.int.jiediankeji.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455636/auto-publish.user.js
// @updateURL https://update.greasyfork.org/scripts/455636/auto-publish.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const buttonGroup = `<span class="btn btn-success new-tag-btn" id="publish">微信提审</span>`;
  const temporary = document.createElement('div');
  temporary.innerHTML = buttonGroup;
  $('.project-stats').after(temporary);

  $('#publish').on('click', () => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://fe-dev.int.jiediankeji.com/wechat-auto-publish',
      onload: function (res) {
        if (res.status == 200) {
          var text = res.responseText;
          alert(text);
        }
      },
    });
  });
})();