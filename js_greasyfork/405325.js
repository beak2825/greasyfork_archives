/* cspell:disable pixelmon */

// ==UserScript==
// @version      1.2.2
// @name         Youtube Search Filter
// @name:zh-CN   Youtube 搜索过滤
// @namespace    https://tools.unoiou.com
// @author       Mingshi
// @description  Remove garbage videos from Youtube search result page.
// @description:zh-CN 从 Youtube 搜索页面移除特定用户上传的视频结果
// @copyright    2020, Mingshi
// @license      MIT

// @require      https://openuserjs.org/src/libs/sizzle/GM_config.min.js
// @require      https://greasyfork.org/scripts/374849-library-onelementready-es6/code/Library%20%7C%20onElementReady%20ES6.js?version=649483

// @match        https://www.youtube.com/results?*
// @match        https://www.youtube.com
// @downloadURL https://update.greasyfork.org/scripts/405325/Youtube%20Search%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/405325/Youtube%20Search%20Filter.meta.js
// ==/UserScript==
// jshint esversion:6
/* global onElementReady */

// read blocklist keywords
const configName = 'ytd-search-block-list';
GM_config.init({
  'id': configName,
  'title': 'Youtube Search Filtr Setting',
  'fields': {
    'blocklist': {
      'label': 'Block List',
      'type': 'textarea',
      'default': '',
      'title': 'Each line represents a keyword of block list.'
    }
  },
  'css': [
      '#ytd-search-block-list_field_blocklist {min-height: 400px;}'
  ]
})
// add config btn
var button = document.createElement('button');
button.innerHTML = "Search Filter";
button.style = "bottom:1em;right:1em;position:fixed;z-index: 9999;background:red;";
button.setAttribute('type', 'button');
button.addEventListener('click', function () {
  GM_config.open();
}, false);
document.body.appendChild(button);

const keywords = GM_config.get('blocklist').split('\n').filter(e => e.length > 0);

// for easy debug
unsafeWindow.onElementReady = onElementReady;

// runs on each time `ytd-video-renderer` loaded.
onElementReady('ytd-video-renderer', false, (el) => {
  keywords.forEach((keyword) => {
    if (el.querySelector('ytd-channel-name').textContent.toLowerCase().includes(keyword)) {
      el.remove();
      console.log('removed', keyword);
    }
  });
});