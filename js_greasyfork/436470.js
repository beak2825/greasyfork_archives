// ==UserScript==
// @name        VSCO last media - vsco.co
// @namespace   Violentmonkey Scripts
// @match       https://vsco.co/*/gallery
// @grant       none
// @version     1.0.1
// @author      interested one
// @description 12/2/2021, 9:24:03 PM
// @license unlicense
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/436470/VSCO%20last%20media%20-%20vscoco.user.js
// @updateURL https://update.greasyfork.org/scripts/436470/VSCO%20last%20media%20-%20vscoco.meta.js
// ==/UserScript==

var d = (d = window.__PRELOADED_STATE__) && (d = d.entities) && (d = d.images);

if (!d) {
  for (var i = 0; i < document.scripts.length; i++) {
    var s_text = document.scripts[i].textContent;
    if (s_text && s_text.indexOf("window.__PRELOADED_STATE__") != -1) {
      d = JSON.parse(s_text.substr(s_text.indexOf("{")));
      d = d.entities && d.entities.images;
    }
  }
}


if (d) {
  var maxDate = 0;
  for (var key in d) {
    if (d.hasOwnProperty(key)) {
      maxDate = Math.max(d[key].uploadDate, maxDate);
    }
  }
  
  if (maxDate) {
    var label = VM.hm("div", { style: "position: relative" },
      VM.hm("div", { style: "position: absolute; top: 2em;" },
          VM.hm("div", { style: "position: fixed; z-index: 2;" }, 
            VM.hm("div", { style: "width: 10em; line-height: 2.5em; text-align: center; background: cadetblue; color: aliceblue;" }, "Last: " + new Date(maxDate).toLocaleDateString())
          )
      )
    );
    document.querySelector("header[role=banner]").prepend(label);
  }
}

