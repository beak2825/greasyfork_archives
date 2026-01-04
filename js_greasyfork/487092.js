// ==UserScript==
// @name         Imgur_retro_style_images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Disable inline images in cimgur comments
// @author       You
// @match        https://imgur.com/gallery/*
// @match        https://imgur.com/user/*
// @match        https://imgur.com/account/*
// @license MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487092/Imgur_retro_style_images.user.js
// @updateURL https://update.greasyfork.org/scripts/487092/Imgur_retro_style_images.meta.js
// ==/UserScript==

// This script should run at "document-start" so we really don't render the images on the first post,
// but it might just work(TM)
function _code_to_inject() {
  var _hide_imgs = true;
  // TODO: doesn't work anymore... Update if it anoys me
  var _autoplay = false;

  // We want to ensure we hook it as soon as possible, so lets use MutationObserver to wait for scripts.
  var config = {
    attributes: false,
    childList: true,
    subtree: false,
    characterData: false
  };
  var observer = new MutationObserver(function (mutationsList) {
    for (var mutation of mutationsList) {
      var addedNodes = mutation.addedNodes;
      if (!addedNodes) continue;
      for (var i = 0; i < addedNodes.length; i++) {
        if (addedNodes[i].tagName !== 'SCRIPT') continue;
        console.log('Added', addedNodes[i], window.Imgur);
        var script = addedNodes[i];
        script.onload = script.onreadystatechange = function () {
          if (window.Imgur && Imgur.Linkifier) {
            _inject();
            observer.disconnect();
          }
        }
      }
    }
  });
  function _inject() {
    console.log('Found Linkifier');
    init();
  }
  function do_observe() {
    if (window.Imgur && Imgur.Linkifier)
    _inject();
     else
    observer.observe(document.body, config);
  }
  // Depending on browser and userscript executor the body migh not exists yet.
  if (!document.body) {
    document.onreadystatechange = function () {
      if (document.body) {
        console.log('DOMContentLoaded');
        do_observe();
        document.onreadystatechange = null; // TODO: do this nicer
      }
    }
  } else {
    do_observe();
  }

  function hookit(parent, name, func) {
    var o = parent[name];
    var f = function () {
      var x = func.apply(this, [
        o,
        arguments
      ]);
      return x
    };
    parent[name] = f;
    f.__o__ = o;
    f.__unhook__ = function () {
      parent[name] = f.__o__;
    }
  };
  function linkifier_grab_hook(o, args) {
    return o.apply(this, [
      args[0]
    ]);
  }
  function linkifier_reactionVideo_hook(o, args) {
    var x = o.apply(this, args);
    delete x.props['autoPlay'];
    return x;
  }
  function init() {
    if (_hide_imgs)
      hookit(Imgur.Linkifier.prototype, 'grab', linkifier_grab_hook);
    if (!_autoplay)
      hookit(Imgur.Linkifier.prototype, 'reactionVideo', linkifier_reactionVideo_hook);
  }
}
var s = document.createElement('script');
s.textContent = '(' + _code_to_inject + ')()';
//console.log("Inject into", document.location, ":", s.textContent);
document.head.appendChild(s);
