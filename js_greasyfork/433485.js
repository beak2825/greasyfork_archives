// ==UserScript==
// @name         研报pdf原文下载
// @namespace    https://greasyfork.org/zh-CN/scripts/433485-%E7%A0%2594%25E6%258A%25A5pdf%25E5%258E%259F%25E6%2596%2587%25E4%25B8%258B%25E8%25BD%25BD
// @version      0.7.11
// @description  萝卜投研的研报下载
// @author       OneBe
// @match        https://robo.datayes.com/v2/*
// @match        https://gw.datayes.com/rrp_adventure/web/search?*
// @match        https://gw.datayes.com/rrp_adventure/web/externalReport/*
// @icon         http://datayes.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/433485/%E7%A0%94%E6%8A%A5pdf%E5%8E%9F%E6%96%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/433485/%E7%A0%94%E6%8A%A5pdf%E5%8E%9F%E6%96%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        body {
            color: #000000;
            font-family: Arial, sans-serif;
        }
        h2, p {
            color: #000000;
        }
        h2 {
            font-size: 24px;
            text-align: center;
        }
        p {
            font-size: 16px;
            line-height: 1.5;
        }
        .abstract {
            font-size: 24px;
            font-weight: bold;
            padding-left: 20ch;
            padding-right: 20ch;
            text-align: justify;
        }
        .center {
            text-align: center;
        }
        .info-container {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            margin: 20px 0;
        }
        .info-item {
            font-size: 18px;
            color: #ffffff;
            background-color: #007BFF;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .orgName {
            background-color: #007BFF;
        }
        .reportType, .reportSubType {
            margin-right: 5px;
        }
        .reportType {
            background-color: #28a745;
        }
        .reportSubType {
            background-color: #ffc107;
            color: #000000;
        }
        .industry {
            background-color: #dc3545;
        }
        .author {
            background-color: #17a2b8;
        }
        .pageNum {
            background-color: #6c757d;
        }
        .download-link {
            display: inline-block;
            font-size: 18px;
            color: #ffffff;
            background-color: #007BFF;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            text-align: center;
            margin: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `);

    // 对详细页面数据进行重写
    if (window.location.href.indexOf("web/externalReport") != -1) {
        // 获取json数据并解析
        var hiddenDiv = document.querySelector('div[hidden="true"]');
        if (hiddenDiv) {
            var hiddenValue = hiddenDiv.innerHTML;
            try {
                const objData = JSON.parse(hiddenValue);
                // 清空页面并添加新内容
                while (document.body.firstChild) {
                    document.body.removeChild(document.body.firstChild);
                }
                // 创建新元素
                var newContent = document.createElement('div');
                newContent.classList.add('center');

                // 添加标题
                var reportTitle = document.createElement('h2');
                reportTitle.textContent = objData.data.articleTitle;
                newContent.appendChild(reportTitle);

                // 添加信息容器
                var infoContainer = document.createElement('div');
                infoContainer.classList.add('info-container');

                // 添加机构名称
                if (objData.data.orgName) {
                    var orgName = document.createElement('p');
                    orgName.textContent = objData.data.orgName;
                    orgName.classList.add('info-item', 'orgName');
                    infoContainer.appendChild(orgName);
                }

                // 添加报告类型和报告子类型，间隔一个空格
                var reportTypeAndSubType = document.createElement('div');
                reportTypeAndSubType.classList.add('info-item');
                reportTypeAndSubType.style.display = 'flex';
                reportTypeAndSubType.style.gap = '5px';
                if (objData.data.reportType) {
                    var reportType = document.createElement('p');
                    reportType.textContent = objData.data.reportType;
                    reportType.classList.add('info-item', 'reportType');
                    reportTypeAndSubType.appendChild(reportType);
                }
                if (objData.data.reportSubType) {
                    var reportSubType = document.createElement('p');
                    reportSubType.textContent = objData.data.reportSubType;
                    reportSubType.classList.add('info-item', 'reportSubType');
                    reportTypeAndSubType.appendChild(reportSubType);
                }
                infoContainer.appendChild(reportTypeAndSubType);

                // 添加行业名称
                if (objData.data.induName) {
                    var induName = document.createElement('p');
                    induName.textContent = objData.data.induName;
                    induName.classList.add('info-item', 'industry');
                    infoContainer.appendChild(induName);
                }

                // 添加作者信息
                var authors = document.createElement('p');
                authors.textContent = objData.data.author;
                authors.classList.add('info-item', 'author');
                infoContainer.appendChild(authors);

                // 添加页数
                if (objData.data.pageNum) {
                    var pageNum = document.createElement('p');
                    pageNum.textContent = objData.data.pageNum + '页';
                    pageNum.classList.add('info-item', 'pageNum');
                    infoContainer.appendChild(pageNum);
                }

                // 添加PDF下载链接
                if (objData.data.downloadUrl) {
                    var downloadLink = document.createElement('a');
                    downloadLink.href = '#';
                    downloadLink.textContent = '点击下载PDF';
                    downloadLink.classList.add('download-link', 'info-item');
                    downloadLink.addEventListener('click', function() {
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: objData.data.downloadUrl,
                            responseType: 'blob',
                            onload: function(response) {
                                var url = window.URL.createObjectURL(response.response);
                                var a = document.createElement('a');
                                a.style.display = 'none';
                                a.href = url;
                                a.download = objData.data.articleTitle + '.pdf';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                            },
                            onerror: function() {
                                alert('下载失败，请重试');
                            }
                        });
                    });
                    infoContainer.appendChild(downloadLink);
                }

                newContent.appendChild(infoContainer);

                // 添加摘要
                var abstract = document.createElement('p');
                abstract.classList.add('abstract');
                abstract.textContent = '摘要: ' + objData.data.textAbstract;
                newContent.appendChild(abstract);

                // 将新内容添加到页面
                document.body.appendChild(newContent);

            } catch (error) {
                console.error('JSON解析错误:', error);
                alert('JSON解析错误: ' + error.message);
            }
        } else {
            console.error('未找到隐藏的div元素');
            alert('未找到隐藏的div元素');
        }
    }

    // 将页面中符合要求的地址进行替换,以直接打开JSON数据界面
    window.onload = function() {
        const myVar = setInterval(function() { ChangeUrl() }, 1000);
        function ChangeUrl() {
            let c;
            for (let i = 0; i < document.links.length; i++) {
                if (document.links[i].href.indexOf("/details/report") !== -1) {
                    c = document.links[i].href.replace("robo.datayes.com/v2/details/report", "gw.datayes.com/rrp_adventure/web/externalReport");
                    document.links[i].href = c;
                }
            }
        }
    }
})();
