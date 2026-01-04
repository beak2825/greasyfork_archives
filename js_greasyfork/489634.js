// ==UserScript==
// @name         智慧树PPT下载
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @author       Wwhds
// @description  智慧树下载脚本,希望能帮到大家
// @match        https://hike-doc-online-h5.zhihuishu.com/alweb.html?*
// @icon         https://wwhds-markdown-image.oss-cn-beijing.aliyuncs.com/Markdown%E4%BD%BF%E7%94%A8/w.jpg
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.10.1/jquery.min.js
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489634/%E6%99%BA%E6%85%A7%E6%A0%91PPT%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/489634/%E6%99%BA%E6%85%A7%E6%A0%91PPT%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function ($) {
    $(function () {
        console.log("当前URL: " + window.document.URL)
        // 获取网页内容
        // PPTX资源所在元素
        function getPPTXSource() {
            // 使用window.document获取当前网页内容
            var divs = window.document
            var pptxUrl = divs.URL
            var regex = /WOPISrc=(.*)/;
            var match = pptxUrl.match(regex);
            console.log("资源地址: " + pptxUrl)
            if (match) {
                console.log(match[1]);
                fetch(match[1])
                    .then(response => response.blob())
                    .then(blob => {
                        // Create a new object URL for the blob
                        var url = match[1]
                        // Create a link and click it to start the download
                        var a = document.createElement('a');
                        a.href = url;
                        document.body.appendChild(a); // Required for Firefox
                        a.click();
                        a.remove();
                    })
                    .catch(e => console.error(e));
            } else {
                console.log("No match found.");
            }
        }

        if (window.document.URL.indexOf("ppt") != -1 && confirm("确定要下载PPT吗?")){
            getPPTXSource();
        }
    });
})(jQuery);