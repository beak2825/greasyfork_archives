// ==UserScript==
// @name        5278 display m3u8 address
// @name:zh-CN        5278 display m3u8 address
// @namespace:zh-TW   5278_display_m3u8_address
// @supportURL  https://github.com/zhuzemin
// @description 5278 show m3u8 address
// @description:zh-CN 5278 show m3u8 address
// @description:zh-TW 5278 show m3u8 address
// @include     https://5278.cc/thread-*-1-1.html
// @include     https://hbo6.hboav.com/v4/public/Player.php?*
// @version     1.04
// @run-at      document-end
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @namespace https://greasyfork.org/users/400918
// @downloadURL https://update.greasyfork.org/scripts/396711/5278%20display%20m3u8%20address.user.js
// @updateURL https://update.greasyfork.org/scripts/396711/5278%20display%20m3u8%20address.meta.js
// ==/UserScript==
let config = {
  'debug': false,
  'version': GM_getValue('version') || '2.9.9'
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
    // let input = document.createElement("input");
    // input.setAttribute("type", "text");
    // input.size = window.screen.width;
    // document.body.insertBefore(input, document.body.firstChild);
    let title = document.title.replace(' - 成人線上直播一區 - 5278 / 5278論壇 / 我愛78論壇', '');
    let iframe = document.querySelector("iframe.cc5278_player");
    let src = iframe.getAttribute("src");
    let hostname = getLocation(src).hostname;
    debug(hostname);
    let idx = 1;
    let urlLst = [];
    window.addEventListener('message', function (e) {
      if (e.data.includes('hboav.com')) {
        debug(e.data);
        if (!urlLst.includes(e.data)) {
          debug(urlLst);
          urlLst.push(e.data);
          let fullTitle = title;
          if (urlLst.length > 1) {
            idx++;
            fullTitle += "_" + idx;
          }
          let N_m3u8DL = document.createElement("input");
          N_m3u8DL.setAttribute("type", "text");
          N_m3u8DL.size = window.screen.width;
          document.body.insertBefore(N_m3u8DL, document.body.firstChild);
          N_m3u8DL.setAttribute("value", 'N_m3u8DL-CLI_v' + config.version + ' "' + e.data + '" --headers "Referer:' + src + '"  --saveName "' + fullTitle + '"');
          // input.setAttribute("value", e.data);
        }
      }
    });
  }
  else {
    let video = document.querySelector('video');
    let interval = setInterval(() => {
      let script = video.querySelector('script');
      if (script) {
        //debug(script.innerHTML);
        //let url = script.innerHTML.match(/ /)[1];
        let url = unsafeWindow.player.src();
        debug(url);
        setInterval(() => { parent.postMessage(url, "*"); }, 4000);
        clearInterval(interval);
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
