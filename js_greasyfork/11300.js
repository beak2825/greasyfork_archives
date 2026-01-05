// ==UserScript==
// @name           Twitter List in Menu Bar
// @description    Userscript to add a Twitter list to the Twitter web interface's menu bar. By Mark Bao. Looks like this: http://i.imgur.com/ji9TLOU.png
// @version        1
// @namespace      https://twitter.com/
// @include        https://twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/11300/Twitter%20List%20in%20Menu%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/11300/Twitter%20List%20in%20Menu%20Bar.meta.js
// ==/UserScript==

var text = '<li class="list-item">\
                <a role="button" href="[REPLACE-ME]-https://twitter.com/username/lists/list-name" class="" data-placement="bottom" data-original-title="">\
                  <span class="text">[REPLACE-ME]-List-Name</span>\
                </a>\
              </li>'

var mbar = document.getElementById('global-actions');
mbar.insertAdjacentHTML('beforeend', text);