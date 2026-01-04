// ==UserScript==
// @name                7zap Reveal
// @version             1.0
// @namespace           https://github.com/XDleader555
// @description         Reveals the part numbers on the 7zap rip of ETKA.
// @license             MIT
// @match               https://*.7zap.com/*
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/484110/7zap%20Reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/484110/7zap%20Reveal.meta.js
// ==/UserScript==

var part_table = document.getElementsByClassName("copyPartNumberWrap")

for(var i = 0; i < part_table.length; i++) {
  replace_hidden_pn(part_table[i])

  // Replace the search button action with a Google search
  part_table[i].children[1].setAttribute("href", "https://www.google.com/search?q=" + get_pn(part_table[i]).replaceAll(" ", "+"));
  
  // Replace the clipboard button action
  part_table[i].children[0].setAttribute("onclick", "navigator.clipboard.writeText(\"" + get_pn(part_table[i]) + "\")");
}

// Extract part number from copy button
function get_pn(e) {
  var idx_s = e.innerHTML.indexOf("('") + 2;
  var idx_e = e.innerHTML.indexOf("')", idx_s);
  var ret = e.innerHTML.substr(idx_s, idx_e - idx_s).replaceAll("&nbsp;","");
  return ret
}

function replace_hidden_pn(e) {
  var ret = "";
  
	var idx_s = e.innerHTML.indexOf("</i>") + 4;
  var idx_e = e.innerHTML.indexOf("&nbsp", idx_s);
  
  ret += e.innerHTML.substr(0, idx_s);
  ret += get_pn(e);
  ret += e.innerHTML.substr(idx_e);
  
  e.innerHTML = ret;
}