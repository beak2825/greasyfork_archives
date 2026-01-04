// ==UserScript==
// @name           Memrise Full Markdown (multimedia level)
// @description    Enables full Markdown support for multimedia levels on Memrise.com
// @match          http://*.memrise.com/*
// @match          https://*.memrise.com/*
// @run-at         document-end
// @version        1.1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/372306/Memrise%20Full%20Markdown%20%28multimedia%20level%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372306/Memrise%20Full%20Markdown%20%28multimedia%20level%29.meta.js
// ==/UserScript==

if(typeof unsafeWindow == "undefined") {
  unsafeWindow = window;
}

if(typeof unsafeWindow.level_multimedia != "undefined") {
  main();
} else if(unsafeWindow.MEMRISE.renderer) {
  unsafeWindow.MEMRISE.renderer.allowed_tags = "*";
}

function main() {
  
  // Disable Memrise's native markdown 
  var data = unsafeWindow.level_multimedia;

  unsafeWindow.MEMRISE.renderer.allowed_tags = "*";
  unsafeWindow.level_multimedia = "";
  
  // When renderer is loaded, enable all HTML tags and render Markdown
  window.addEventListener('load', function() {
    setTimeout(renderMultimedia, 100);
  }, false);

  function renderMultimedia() {
    unsafeWindow.MEMRISE.renderer.allowed_tags = "*";

    var e = unsafeWindow.MEMRISE.renderer.rich_format(data);
    unsafeWindow.$(".multimedia-wrapper").html(e);
    unsafeWindow.MEMRISE.renderer.do_embeds(unsafeWindow.$(".multimedia-wrapper"));
  }
}