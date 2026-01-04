// ==UserScript==
// @name        coolinet m3u8 address
// @name:zh-TW        coolinet m3u8 address
// @name:zh-CN        coolinet m3u8 address
// @supportURL  https://github.com/zhuzemin
// @description coolinet show m3u8 address
// @description:zh-CN coolinet show m3u8 address
// @description:zh-TW coolinet show m3u8 address
// @include     https://www.coolinet.net/*
// @include     https://video1.yocoolnet.in/api/player_coolinet.php?*
// @version     1.03
// @run-at      document-end
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @namespace coolinet_display_m3u8_address
// @downloadURL https://update.greasyfork.org/scripts/394787/coolinet%20m3u8%20address.user.js
// @updateURL https://update.greasyfork.org/scripts/394787/coolinet%20m3u8%20address.meta.js
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
    let allmyplayer = document.querySelector("#allmyplayer");
    let src = "https:" + allmyplayer.getAttribute("src");
    let hostname = getLocation(src).hostname;
    debug(hostname);
    window.addEventListener('message', function (e) {
      debug(e.data);
      //if (e.data.includes(hostname)) {
      if (e.data != null) {
        let div = document.querySelector("div.videoWrap");
        let title = div.querySelector("h2").innerText;
        debug(title);
        N_m3u8DL.setAttribute("value", 'N_m3u8DL-CLI_v' + config.version + ' "' + e.data + '" --headers "Referer:' + src + '"  --saveName "' + title + '"');
        input.setAttribute("value", e.data);
      }
    });
  }
  else {
    debug("iframe");
    let url = null;
    let p1 = document.querySelector('#p1');
    if (p1 != null) {
      let script = p1.querySelector("script");
      url = script.innerText.match(/url:\s"([^"\s]+)"/)[1];
      //let hostname = getLocation(window.location.href).hostname;
      //url = "https://" + hostname + url;
    }
    else {
      let mediaplayer1 = document.querySelector("#mediaplayer1");
      let script = mediaplayer1.nextElementSibling;
      url = script.innerText.match(/url:\s"([:\/\.\d\w]*)"/)[1];
    }
    if (url != null) {
      debug(url);
      setInterval(() => { parent.postMessage(url, "*"); }, 4000);

    }

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
    let val = prompt(promtText, GM_getValue(varName, defaultVal));
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
