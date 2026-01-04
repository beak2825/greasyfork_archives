// ==UserScript==
// @name         武软知微库
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       KEAL
// @match        http://125.221.38.2/*
// @match        http://125.221.38.4/*
// @match        http://221.234.230.10/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368036/%E6%AD%A6%E8%BD%AF%E7%9F%A5%E5%BE%AE%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/368036/%E6%AD%A6%E8%BD%AF%E7%9F%A5%E5%BE%AE%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var str = document.getElementById('zz').innerHTML;
    var re =/start_time\[(.+)\]/g;
    var r = re.exec(str);
    start_time[r[1]] = 99999;
})();