// ==UserScript==
// @name        OneNote Clipper
// @namespace   https://github.com/vylet/OneNote
// @description The clipper Bookmarklet
// @include			http://*
// @include			https://*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/14853/OneNote%20Clipper.user.js
// @updateURL https://update.greasyfork.org/scripts/14853/OneNote%20Clipper.meta.js
// ==/UserScript==

var onenote = function() {
        var jsCode = document.createElement('script');
        jsCode.setAttribute('src', 'https://www.onenote.com/clipper/root?ClipperId=ON-6a191eef-84a2-4491-9cc2-2e4560cfb9af&ClipperType=Bookmarklet&ClipperVersion=2.0.2');
        jsCode.setAttribute('id', 'oneNoteCaptureRootScript');
        jsCode.setAttribute('type', 'text/javascript');
        document.body.appendChild(jsCode);
    };
(function(){
document.addEventListener('keydown', function(e) {
  // pressed ctrl+alt+o
  if (e.keyCode == 79 && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
	  console.log("Clipper Hotkey Pressed")
  onenote(); // Open OneNote Clipper.
  }
}, false);
})();