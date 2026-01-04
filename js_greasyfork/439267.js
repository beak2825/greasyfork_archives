// ==UserScript==
// @name         收文登记禁止转跳
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  新建文件处理单提交后，依旧保持在收文登记
// @author       skipto
// @match        http://www.ctnma.cn/ioop-bcs-web/main.do
// @icon         https://www.google.com/s2/favicons?domain=ctnma.cn
// @grant        none
// @license      Mozilla
// @downloadURL https://update.greasyfork.org/scripts/439267/%E6%94%B6%E6%96%87%E7%99%BB%E8%AE%B0%E7%A6%81%E6%AD%A2%E8%BD%AC%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/439267/%E6%94%B6%E6%96%87%E7%99%BB%E8%AE%B0%E7%A6%81%E6%AD%A2%E8%BD%AC%E8%B7%B3.meta.js
// ==/UserScript==

// 测试的时候使用敏感词，这样避免有短信提醒。

// https://stackoverflow.com/questions/5202296/add-a-hook-to-all-ajax-requests-on-a-page
((() => {
    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        //console.log('arguments：',arguments);
        if ( arguments[1].includes("doc/doc-in.do?searchKey=") ) {
            console.log('find!!!',arguments);
            arguments[1] = 'doc/doc-in!guide.do?randID=0.2538253825382538';
        }
        this.addEventListener('load', function() {
            //console.log(this.readyState); //will always be 4 (ajax is completed successfully)
            //console.log(this.responseText); //whatever the response was
        });
        origOpen.apply(this, arguments);
    };
}))();