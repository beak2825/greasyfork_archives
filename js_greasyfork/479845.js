// ==UserScript==
// @name         Aiqicha Company Detail Exporter with sp_no
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract and post company details from aiqicha.baidu.com.
// @author
// @match        https://aiqicha.baidu.com/company_detail*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479845/Aiqicha%20Company%20Detail%20Exporter%20with%20sp_no.user.js
// @updateURL https://update.greasyfork.org/scripts/479845/Aiqicha%20Company%20Detail%20Exporter%20with%20sp_no.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const spNo = urlParams.get('sp_no');

    if (window.location.href.includes("https://aiqicha.baidu.com/company_detail") && spNo) {
        addButton();
    }

    function addButton() {
        const button = document.createElement('button');
        button.textContent = '导出公司信息';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '10000';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '5px';
        button.style.fontSize = '16px';
        document.body.appendChild(button);

        button.addEventListener('click', extractAndSendData);
    }

    function extractAndSendData() {
        const data = [];
        const selectors = [
            '.detail-header .name',
            '[data-log-title="detail-header-person"]',
            '.social-credit-code-text',
            '[data-log-title="detail-head-phone"]',
            '[data-log-an="detail-head-email"]',
            '.child-data.child-addr',
            // Use `:last-of-type` to get the last occurrence of the selector
            '.content-info-child-brief:last-of-type'
        ];

        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                data.push(element.textContent.replace(/\s/g, ''));
            }
        });

        const postData = {
            code: 'aiqicha',
            data: data,
            sp_no: spNo
        };

        sendPostRequest(postData);
    }

    function sendPostRequest(data) {
        const endpoint = "https://ued.iwanshang.cloud/index.php?m=Fsupport&a=api";
        let formData = new FormData();
        formData.append('code', data.code);
        formData.append('data', JSON.stringify(data.data));
        formData.append('sp_no', data.sp_no);

        // Converting FormData to URLSearchParams for x-www-form-urlencoded format
        const searchParams = new URLSearchParams();
        for (const pair of formData) {
            searchParams.append(pair[0], pair[1]);
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: endpoint,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: searchParams.toString(),
            onload: function(response) {
                console.log(response.responseText);
                try {
                    const jsonResponse = JSON.parse(response.responseText);
                    if (jsonResponse.status === 1) {
                        alert('保存成功');
                    } else {
                        console.error('保存失败:', jsonResponse.message);
                        alert('保存失败: ' + jsonResponse.message);
                    }
                } catch (e) {
                    console.error('服务器响应解析失败:', e);
                    alert('服务器响应解析失败');
                }
            },
            onerror: function(error) {
                console.error('请求失败:', error);
                alert('请求失败');
            }
        });
    }
})();
