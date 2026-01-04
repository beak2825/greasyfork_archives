// ==UserScript==
// @name         Microhard IM
// @namespace    microhardmessenger.wibdows91
// @version      1.2
// @description  The Future of Communication(tm)
// @author       Elijah
// @include        http://wibdows91.ddns.net/*
// @include        http://wibdows91-devel.ddns.net/*
// @include        http://wibdows91-lite.ddns.net/*
// @license        GPL3
// @downloadURL https://update.greasyfork.org/scripts/445759/Microhard%20IM.user.js
// @updateURL https://update.greasyfork.org/scripts/445759/Microhard%20IM.meta.js
// ==/UserScript==

window.microhardIM = function(){
  var $win = make_iframe_window({
    src: "https://doors94.github.io/programs/aim/index.html",
    icons: {16: "https://doors94.github.io/images/icons/mim-16x16.png", 32: "https://doors94.github.io/images/icons/mim-32x32.png"},
    title: "Microhard Instant Messenger",
    innerWidth: 400,
    innerHeight: 600,
    resizable: false,
  });
  return new Task($win);
};
add_icon_not_via_filesystem({
  title: "Microhard Instant Messenger",
  iconID: "aim",
  open: window.microhardIM,
  shortcut: true
});