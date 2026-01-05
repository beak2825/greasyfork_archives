// ==UserScript==
// @name        Refresh/Clear NBViewer Cache
// @namespace   https://peijunz.github.io
// @author      Peijun Zhu
// @description Add a button to navigation bar to refresh/clear the cache of nbviewer
// @include     *://nbviewer.jupyter.org/*.ipynb*
// @version     2.4.1
// @grant       none
// @icon        https://github.com/jupyter/design/raw/master/logos/Square%20Logo/squarelogo-greytext-orangebody-greymoons/squarelogo-greytext-orangebody-greymoons.png
// @downloadURL https://update.greasyfork.org/scripts/23855/RefreshClear%20NBViewer%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/23855/RefreshClear%20NBViewer%20Cache.meta.js
// ==/UserScript==
function flush() {
  var url = document.location.href;
  while (url.substr( - 1) === '/' || url.substr( - 1) === '#') {
    //Strip # or / in the end
    url = url.substr(0, url.length - 1);
  }
  var tail = '?flush_cache=true';
  if (!url.endsWith(tail)) {
    document.location.href = url + tail;
  } 
  else {
    document.location.reload();
  }
}
function add_flush_button() {
  var lu = document.getElementsByClassName('nav navbar-nav navbar-right') [0];
  var li = document.createElement('li');
  var a = document.createElement('a');
  li.appendChild(a);
  lu.appendChild(li);
  a.href = '#';
  a.onclick = flush;
  a.innerHTML = '⟳';
  a.style['font-size']="2.5em";
}
add_flush_button();