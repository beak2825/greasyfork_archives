// ==UserScript==
// @name       Download Links for soundgasm.net
// @namespace  https://chrome.google.com/webstore/detail/download-links-for-soundg/bchfdaafdfgamfakeigoopdkpkpjocmc
// @version    0.0.5
// @description  show source mp4 link for soundgasm site
// @match      https://soundgasm.net/u/*/*
// @copyright  Don
// @downloadURL https://update.greasyfork.org/scripts/19506/Download%20Links%20for%20soundgasmnet.user.js
// @updateURL https://update.greasyfork.org/scripts/19506/Download%20Links%20for%20soundgasmnet.meta.js
// ==/UserScript==

//copy what Don did so well and updated to website and get it into a script.
//Thank you Don I can't reach you but if you want me to take this down I'll be glad to

(function () {
  var playerDiv = document.getElementById("jquery_jplayer_1");
  if (!playerDiv) {
    return;
  }

  function username () {
    var match = window.location.pathname.match(/\/u\/(.+)\/.+/);
    if (!match) {
      return "";
    }
    return match[1];
  }

  function title () {
    var e = document.querySelector(".jp-title").innerHTML;
    return e;
  }


  function filename (href) {
    var ext = href.match(/.+\.(.+)$/);
    if (!ext) {
      return username() + " - " + title();
    }
    return username() + " - " + title() + "." + ext[1];
  }

  var interval = setInterval(function () {
    var audio = document.getElementsByTagName("audio")[0];
    if (!audio && !audio.src) {
      return;
    }
    clearInterval(interval);
    var ul = document.querySelector(".jp-description");
    if (!ul) {
      return;
    }
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = audio.src;
    a.innerText = "download";
    a.download = filename(audio.src);
    li.appendChild(a);
    ul.appendChild(li);
  }, 1000);
})();
