// ==UserScript==
// @name        Exclude term on Google (Firefox only)
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD 3-clause
// @description Easily exclude terms from your query using the right-click context menu. v0.9.0 2015-12-20
// @include     http*://www.google.*/*
// @include     http*://encrypted.google.*/*
// @version     0.9.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15254/Exclude%20term%20on%20Google%20%28Firefox%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/15254/Exclude%20term%20on%20Google%20%28Firefox%20only%29.meta.js
// ==/UserScript==
// DISCLAIMER:     Use at your own risk. Functionality and harmlessness cannot be guaranteed.

var ETGtext = "";

// Context menu options -- Firefox only; do not replace any existing menu!
if (!document.body.hasAttribute("contextmenu") && "contextMenu" in document.documentElement){
  var cmenu = document.createElement("menu");
  cmenu.id = "ETGcontext";
  cmenu.setAttribute("type", "context");
  cmenu.innerHTML = '<menuitem id="ETGexTerm" label="Exclude term(s)"></menuitem>' + 
    '<menuitem id="ETGexPhrase" label="Exclude phrase" disable="disable"></menuitem>';
  document.body.appendChild(cmenu);
  document.getElementById("ETGexTerm").addEventListener("click", ETG_doExclude, false);
  document.getElementById("ETGexPhrase").addEventListener("click", ETG_doExclude, false);
  // attach menu and create event for filtering
  document.body.setAttribute("contextmenu", "ETGcontext");
  document.body.addEventListener("contextmenu", ETG_cmenuFilter, false);
}
function ETG_cmenuFilter(e){
  var s = window.getSelection();
  if (s.isCollapsed){
    ETGtext = ETG_getWord(e.rangeParent, e.rangeOffset);
    document.getElementById("ETGexPhrase").setAttribute("disabled","disabled");
  } else {
    ETGtext = s.getRangeAt(0).toString().trim();
    if (ETGtext.indexOf(" ") > -1) document.getElementById("ETGexPhrase").removeAttribute("disabled");
  }
}
function ETG_getWord(rnode, rstart){
  var txtFull = rnode.textContent;
  var startPos = rstart, endOffset = 1;
  // Expand to the left of the click point
  while(startPos > 0 && txtFull.substr(startPos, endOffset).indexOf(' ') != 0) {
    startPos = startPos - 1;
    endOffset += 1;
  }
  if (txtFull.substr(startPos, endOffset).indexOf(' ') == 0) {
    startPos = startPos + 1;
    endOffset = endOffset - 1;
  }
  // Expand to the right of the click point
  while(startPos + endOffset + 1 < txtFull.length && txtFull.substr(startPos, endOffset).indexOf(' ') == -1) {
    endOffset = endOffset + 1;
  }
  return txtFull.substr(startPos, endOffset).toString().trim();
}
function ETG_doExclude(e){
  if (e.target.id == "ETGexPhrase"){
    var ss = '+-"' + ETGtext.replace(/\s+/g, '+') + '"';
    ETG_reQry(ss, true);
  } else {
    var ss = '+-' + ETGtext.replace(/\s+/g, '+-');
    ETG_reQry(ss, true);    
  }
}

// query modification borrowed from "Google site: Tool (Site results / Exclude sites)"
function ETG_reQry(d, go){
  // compute new URL
  if (!d) return;
  var cancel = false;
  var qa = window.location.href.substr(window.location.href.indexOf("?")+1).split("&");
  var updated = false;
  for (var j=qa.length-1; j>=0; j--){
    if (updated == false){
      if (qa[j].split("=")[0] == "q"){
        if (qa[j].indexOf(d) > -1 || qa[j].indexOf(d.replace(":", "%3A")) > -1) cancel = true;
        else var ipq = qa[j];
        qa[j] += d;
        updated = true;
        var substqry = qa[j];
      } else {
        if (qa[j].indexOf("#q=") > -1){
          if (qa[j].indexOf(d) > -1 || qa[j].indexOf(d.replace(":", "%3A")) > -1) cancel = true;
          else var ipq = qa[j].substr(qa[j].indexOf("#q=")+1);
          qa[j] += d;
          updated = true;
          var substqry = qa[j].substr(qa[j].indexOf("#q=")+1);
        }
      }
    } else {
      if (qa[j].split("=")[0] == "q"){
        if (go) qa[j] = ipq;
        else qa[j] = substqry;
      } else {
        if (qa[j].indexOf("#q=") > -1){
          if (go) qa[j] = qa[j].substr(0, qa[j].indexOf("#q=")+1) + ipq;
          else qa[j] = qa[j].substr(0, qa[j].indexOf("#q=")+1) + substqry;
        }
      }
    }
  }
  if (cancel != true) var locnew = window.location.href.substr(0, window.location.href.indexOf("?")+1) + qa.join("&");
  else locnew = "cancel";
  if (go) window.location.href = locnew;
  else return locnew;
}
