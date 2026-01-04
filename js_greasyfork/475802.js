// ==UserScript==
// @name         国家中小学智慧教育平台-课件-教案-下载工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为老师服务.在课件页面,可以看到多出一个下载按钮
// @author       interim
// @match        https://basic.smartedu.cn/syncClassroom/prepare/detail?resourceId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/475802/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E8%AF%BE%E4%BB%B6-%E6%95%99%E6%A1%88-%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/475802/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0-%E8%AF%BE%E4%BB%B6-%E6%95%99%E6%A1%88-%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function modifyDOM() {
        // 找到内容为"播放"的span


        let spans = Array.from(document.querySelectorAll('span'));
        let targetSpan = spans.find(span => span.textContent === "播放");


        if (targetSpan) {
            // 获取目标span的父控件的父控件
            let grandParent = targetSpan.parentElement.parentElement;

            // 获取grandParent的第一个子控件的class
            let childClass = grandParent.children[0].className;

            // 创建一个新的div并设置class
            let newDiv = document.createElement('div');
            newDiv.className = childClass;
            grandParent.appendChild(newDiv);



            // 在新的div内增加一个a标签，并设置文本为"下载"
            let newA = document.createElement('a');
            newA.textContent = '下载';
            newA.href = '#'; // 请记得修改为您需要的下载链接
            newDiv.appendChild(newA);

            // 获取URL中的resourceId
            const urlParams = new URLSearchParams(window.location.search);
            const resourceId = urlParams.get('resourceId');

            if (resourceId) {
                // 构建新的URL并获取JSON数据
                const jsonUrl = `https://s-file-2.ykt.cbern.com.cn/zxx/ndrv2/prepare_sub_type/resources/details/${resourceId}.json`;
                //console.log(jsonUrl);
                GM_xmlhttpRequest({
                    method: "GET",
                    url: jsonUrl,
                    onload: function(response) {
                        // console.log(response.responseText);
                        const data = JSON.parse(response.responseText);
                        if (data && data.ti_items) {
                            for (let item of data.ti_items) {
                                if (item.ti_storages) {
                                    // 打印每个PDF链接
                                    for (let pdfUrl of item.ti_storages) {
                                        //console.log(pdfUrl);
                                        if (pdfUrl.endsWith('.pdf')) {
                                            const modifiedUrl = pdfUrl.replace('-private', '');
                                            newA.href = modifiedUrl;

                                            // 结束循环
                                            return;
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }

        }
    }

    // 确保在文档加载完成后再执行函数
    setTimeout(modifyDOM, 2 * 1000);

    //     console.log(document.URL);
    // Your code here...
})();