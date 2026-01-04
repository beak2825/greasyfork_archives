// ==UserScript==
// @name         行认证证书自动打印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动打印“行”认证证书
// @author       You
// @match        http://www.xingrenzheng.org/custommanager/reportcertificate?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419341/%E8%A1%8C%E8%AE%A4%E8%AF%81%E8%AF%81%E4%B9%A6%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/419341/%E8%A1%8C%E8%AE%A4%E8%AF%81%E8%AF%81%E4%B9%A6%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#btnDiv').remove();
    window.print();
})();