// ==UserScript==
// @name         常州信息
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  常州信息课程!
// @author       AAA
// @match        http://39.106.4.51/*
// @match        http://39.106.4.51/*
// @match        http://39.106.4.51/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375217/%E5%B8%B8%E5%B7%9E%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/375217/%E5%B8%B8%E5%B7%9E%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var str = document.getElementById('zz').innerHTML;
    var re =/start_time\[(.+)\]/g;
    var r = re.exec(str);
    start_time[r[1]] = 99999;
})();
