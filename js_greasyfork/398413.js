// ==UserScript==
// @name         topcoder部リダイレクター
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       hotman
// @match       https://www.google.com/search?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398413/topcoder%E9%83%A8%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/398413/topcoder%E9%83%A8%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var list = Array.prototype.slice.call(document.getElementsByTagName('a'));
    for(var i=0;i<list.length;i++){
        if(list[i].hasAttribute('href')){
            list[i].setAttribute('href',list[i].getAttribute('href').replace("topcoder.g.hatena.ne.jp","topcoder-g-hatena-ne-jp.jag-icpc.org"));
        }
    }
})();