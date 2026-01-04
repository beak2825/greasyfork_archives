// ==UserScript==
// @name        Microsoft Edge 加载项商店 CRX 下载
// @match       https://microsoftedge.microsoft.com/addons/*
// @author      Delphox & Arnaud (Kiwi Browser) & huqiu2
// @license     MPL-2.0
// @version     2.0
// @description 允许从 Microsoft Edge 加载项商店以 CRX 格式下载扩展，以便在基于 Chromium 内核的浏览器中下载 CRX 插件使用。
// @icon        data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAADuowD/7qMA/+6jAP/uowD/7qMA/+6jAP/uowD/8KMAlQC4/5UAuP//ALj//wC4//8AuP//ALj//wC4//8AuP//7qMA/+6jAP/uowD/7qMA/+6jAP/uowD/7qMA//CjAJUAuP+VALj//wC4//8AuP//ALj//wC4//8AuP//ALj//+6jAP/uowD/7qMA/+6jAP/uowD/7qMA/+6jAP/wowCVALj/lQC4//8AuP//ALj//wC4//8AuP//ALj//wC4///uowD/7qMA/+6jAP/uowD/7qMA/+6jAP/uowD/8KMAlQC4/5UAuP//ALj//wC4//8AuP//ALj//wC4//8AuP//7qMA/+6jAP/uowD/7qMA/+6jAP/uowD/7qMA//CjAJUAuP+VALj//wC4//8AuP//ALj//wC4//8AuP//ALj//+6jAP/uowD/7qMA/+6jAP/uowD/7qMA/+6jAP/wowCVALj/lQC4//8AuP//ALj//wC4//8AuP//ALj//wC4///uowD/7qMA/+6jAP/uowD/7qMA/+6jAP/uowD/8KMAlQC4/5UAuP//ALj//wC4//8AuP//ALj//wC4//8AuP//8KQAlfCkAJXwpACV8KQAlfCkAJXwpACV8KQAmPKkAFcAuP9XALj/mAC4/5UAuP+VALj/lQC4/5UAuP+VALj/lR9P85UfT/OVH0/zlR9P85UfT/OVH0/zlR9P85gfTvRXALp8VwC5fZgAuX2VALl9lQC5fZUAuX2VALl9lQC5fZUhUPH/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IU/ylQC6fZUAuX7/ALl+/wC5fv8AuX7/ALl+/wC5fv8AuX7/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IVDx/yFP8pUAun2VALl+/wC5fv8AuX7/ALl+/wC5fv8AuX7/ALl+/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hT/KVALp9lQC5fv8AuX7/ALl+/wC5fv8AuX7/ALl+/wC5fv8hUPH/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IU/ylQC6fZUAuX7/ALl+/wC5fv8AuX7/ALl+/wC5fv8AuX7/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IVDx/yFP8pUAun2VALl+/wC5fv8AuX7/ALl+/wC5fv8AuX7/ALl+/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hT/KVALp9lQC5fv8AuX7/ALl+/wC5fv8AuX7/ALl+/wC5fv8hUPH/IVDx/yFQ8f8hUPH/IVDx/yFQ8f8hUPH/IU/ylQC6fZUAuX7/ALl+/wC5fv8AuX7/ALl+/wC5fv8AuX7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant       none
// @run-at      document-start
// @namespace   https://greasyfork.org/zh-CN/scripts/481460
// @downloadURL https://update.greasyfork.org/scripts/481460/Microsoft%20Edge%20%E5%8A%A0%E8%BD%BD%E9%A1%B9%E5%95%86%E5%BA%97%20CRX%20%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/481460/Microsoft%20Edge%20%E5%8A%A0%E8%BD%BD%E9%A1%B9%E5%95%86%E5%BA%97%20CRX%20%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    Object.defineProperty(navigator, 'userAgent', {
        //value: window.navigator.userAgent + ' Edg/' + window.navigator.appVersion.match(/Chrome\/(\d+(:?\.\d+)+)/)[1]
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0'
    });
    var _kb_setIntervalCnt = 0;
    var _kb_setInterval = window.setInterval(function() {
        var xpath = function(xpathToExecute) {
            var result = [];
            var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (var i = 0; i < nodesSnapshot.snapshotLength; i++) {
                result.push(nodesSnapshot.snapshotItem(i));
            }
            return result;
        };
        xpath("//button[contains(@id,'getOrRemoveButton')]").forEach(function(individualButton) {
            individualButton.setAttribute('style', 'opacity: 1; background: rgb(0, 120, 212) !important; height: 40px; cursor: pointer !important;');
            individualButton.removeAttribute('disabled');
            individualButton.innerHTML = "<a href=https://edge.microsoft.com/extensionwebstorebase/v1/crx?response=redirect&acceptformat=crx3&x=id%3D" + individualButton.id.split('-')[1] + "%26installsource%3Dondemand%26uc target='_blank' style='color: white; text-decoration: none'><b>获取 CRX</b>";
        });
        if (_kb_setIntervalCnt++ >= 10) { window.clearInterval(_kb_setInterval); }
    }, 1000);
})();