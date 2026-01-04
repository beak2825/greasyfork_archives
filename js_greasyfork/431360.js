// ==UserScript==
// @name        91porn_display_m3u8_address
// @name:zh-CN        91porn_display_m3u8_address
// @namespace:zh-TW   91porn_display_m3u8_address
// @supportURL  https://github.com/zhuzemin
// @description 91porn show m3u8 address
// @description:zh-CN 91porn show m3u8 address
// @description:zh-TW 91porn show m3u8 address
// @include     http://www.91porn.com/view_video.php?viewkey=*
// @version     1.0
// @run-at      document-end
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @namespace https://greasyfork.org/users/400918
// @downloadURL https://update.greasyfork.org/scripts/431360/91porn_display_m3u8_address.user.js
// @updateURL https://update.greasyfork.org/scripts/431360/91porn_display_m3u8_address.meta.js
// ==/UserScript==
let config = {
  'debug': false,
  'version': GM_getValue('version') || '2.9.7'
};
let debug = config.debug ? console.log.bind(console) : function () {
};
// prepare UserPrefs
setUserPref(
  'version',
  config.version,
  'Set N_m3u8DL version',
  `Set N_m3u8DL version`,
);
let init = function () {
  if (window.self === window.top) {
    let input = document.createElement("input");
    input.setAttribute("type", "text");
    input.size = window.screen.width;
    document.body.insertBefore(input, document.body.firstChild);
    let N_m3u8DL = document.createElement("input");
    N_m3u8DL.setAttribute("type", "text");
    N_m3u8DL.size = window.screen.width;
    document.body.insertBefore(N_m3u8DL, document.body.firstChild);
    let title = document.title.replace(' Chinese homemade video', '');
    let interval = setInterval(() => {
      let video = document.querySelector('video');
      if (video) {
        clearInterval(interval);
        let source = video.querySelector('source');
        let url = source.src;
        debug(url);
        N_m3u8DL.setAttribute("value", 'N_m3u8DL-CLI_v' + config.version + ' "' + url + '" --headers "Referer:' + window.location.href + '"  --saveName "' + title + '"');
        input.setAttribute("value", url);
      }
    }, 1000);
  }
}
window.addEventListener('DOMContentLoaded', init);
/**
 * Create a user setting prompt
 * @param {string} varName
 * @param {any} defaultVal
 * @param {string} menuText
 * @param {string} promtText
 * @param {function} func
 */
function setUserPref(varName, defaultVal, menuText, promtText, func = null) {
  GM_registerMenuCommand(menuText, function () {
    var val = prompt(promtText, GM_getValue(varName, defaultVal));
    if (val === null) { return; }  // end execution if clicked CANCEL
    GM_setValue(varName, val);
    if (func != null) {
      func(val);
    }
  });
}
function getLocation(href) {
  let l = document.createElement("a");
  l.href = href;
  return l;
};
