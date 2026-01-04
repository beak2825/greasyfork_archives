// ==UserScript==
// @name         外链跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简书/知乎/CSDN外链跳转
// @author       yu97@live.com
// @match        https://www.jianshu.com/go-wild?*
// @match        https://link.zhihu.com/?target=*
// @match        https://link.csdn.net/?target=*
// @downloadURL https://update.greasyfork.org/scripts/423035/%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/423035/%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

var map = {
    'www.jianshu.com': 'url',
    'link.zhihu.com': 'target',
    'link.csdn.net': 'target',
};

(function () {
    'use strict';
    var params = new URLSearchParams(location.search);
    location.href = params.get(map[location.hostname]);
})();
