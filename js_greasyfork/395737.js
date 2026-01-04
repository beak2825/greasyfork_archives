// ==UserScript==
// @id             JournalofSoftware-auto-naming
// @name           软件学报下载PDF自动命名
// @version        1.0.0.20200128
// @description  目前仅在各期目录中下载可以自动命名，点击PDF改名下载后稍等一会，会自动弹出新命名的pdf文件，请勿重复点击
// @author         Frank Qi
// @include        http://www.jos.org.cn/*
// @run-at         document-idle
// @grant          none
// @namespace https://greasyfork.org/users/438858
// @downloadURL https://update.greasyfork.org/scripts/395737/%E8%BD%AF%E4%BB%B6%E5%AD%A6%E6%8A%A5%E4%B8%8B%E8%BD%BDPDF%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/395737/%E8%BD%AF%E4%BB%B6%E5%AD%A6%E6%8A%A5%E4%B8%8B%E8%BD%BDPDF%E8%87%AA%E5%8A%A8%E5%91%BD%E5%90%8D.meta.js
// ==/UserScript==
(function () {



    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {cb}
     */
    function _my_getBlob (url, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.status === 200) {
                cb(xhr.response);
            }
        };
        xhr.send();
    }

    /**
    * 保存
    * @param  {Blob} blob
    * @param  {String} filename 想要保存的文件名称
    */
    function _my_saveAs (blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement('a');
            var body = document.querySelector('body');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            // fix Firefox
            link.style.display = 'none';
            body.appendChild(link);

            link.click();
            body.removeChild(link);

            window.URL.revokeObjectURL(link.href);
        };
    }

    /**
    * 下载
    * @param  {String} url 目标文件地址
    * @param  {String} filename 想要保存的文件名称
    */
    window._my_download_aabb = function  (url, filename) {
        _my_getBlob(url, function (blob) {
            _my_saveAs(blob, filename);
        });
    };

    var nodeNames, pdfHrefs
    nodeNames = document.evaluate(
        '//a[contains(@href,"view_abstract.aspx")]/b[text()!="摘要"]/text()',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    pdfHrefs = document.evaluate(
        '//a[contains(@href,"create_pdf.aspx")]',
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);


    for (var i = 0; i < pdfHrefs.snapshotLength; i++) {
        let thisLi,aPDF,newLi
        thisLi = pdfHrefs.snapshotItem(i);
        newLi = document.createElement('span');
        let url = thisLi.href
        let filename = nodeNames.snapshotItem(i).textContent
        aPDF = '<a target="_blank" href = "javascript:void(0);" onclick = _my_download_aabb("' + url + '","' + filename + '")>PDF改名下载</a>';

        newLi.innerHTML = aPDF;
        thisLi.parentNode.insertBefore(newLi, thisLi.nextSibling);

    }
})()
