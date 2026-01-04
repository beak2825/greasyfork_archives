// ==UserScript==
// @name         vmware免登录下载
// @namespace    zhusaidong
// @version      0.1
// @description  vmware无需登录就可以下载
// @author       zhusaidong
// @match        https://my.vmware.com/cn/web/vmware/details*
// @match        https://my.vmware.com/web/vmware/details*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392596/vmware%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392596/vmware%E5%85%8D%E7%99%BB%E5%BD%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = 'https://download3.vmware.com/software/wkst/file/';
    document.querySelectorAll('.downloadCol').forEach(function(v){
        var fileNameHolder = v.parentNode.querySelector('.fileNameHolder').innerText;
        v.querySelector('a').href=url + fileNameHolder;
    });
})();