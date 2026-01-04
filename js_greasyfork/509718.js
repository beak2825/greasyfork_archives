// ==UserScript==
// @name         noodlemagazine
// @namespace   http://tampermonkey.net/
// @version   0.21
// @description   noodlemagazine miniscript
// @author   xxxxxxxxxxxxxxxxxxxxxx
// @run-at document-start
// @match   *://*.noodlemagazine.com/*
// @grant     none
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509718/noodlemagazine.user.js
// @updateURL https://update.greasyfork.org/scripts/509718/noodlemagazine.meta.js
// ==/UserScript==

const jwplayerhook = {
  apply: function(target, thisArg, args) {
    window.ads = [];
    let player = target(...args);
    player.setup_ = player.setup;
    player.setup = new Proxy(player.setup_, setuphook);
    try {
        let a = document.createElement('a');
        let r = window.location.href.match(/watch\/(.*)\/*/);
        let s = null;
        r && r.at(1) && (s = `https://vk.com/video${r[1]}`);
        let e = document.querySelector("body > div.main > div > div.video_info");
        e && s && (a.innerHTML = `<a href=${s}>${s}</a>`) && e.append(a);
    } catch(ex) {}
    return player;
  }
};

const setuphook = {
  apply: function(target, thisArg, args) {
    console.log('Calling setup with arguments:', args);
    let argss = args[0];
    'autoPause' in argss && delete argss.autoPause;
    'advertising' in argss && delete argss.advertising;
    return target(argss);
  }
};

Object.defineProperty(window, 'onpopstate', {
  get() {
    return window._onpopstate;
  },
  set(v) {
      window.jwplayer_ = window.jwplayer;
      window.jwplayer = new Proxy(window.jwplayer_, jwplayerhook);
      console.log(window.jwplayer);
      //debugger;
      window._onpopstate = v;
  }
});
