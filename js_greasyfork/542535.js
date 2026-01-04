// ==UserScript==
// @name         AI研报重跑功能
// @namespace    http://tampermonkey.net/
// @version      2025-07-29
// @description  Try to take over the world!
// @author       everlove
// @match        https://webqa.cscidmi.com/international-dashboard/web
// @match        https://web.cscidmi.com/international-dashboard/web
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cscidmi.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542535/AI%E7%A0%94%E6%8A%A5%E9%87%8D%E8%B7%91%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/542535/AI%E7%A0%94%E6%8A%A5%E9%87%8D%E8%B7%91%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId;

    // Add re-throw button
    function addReThrowButton() {
        const iframe = document.querySelector('.iframe-host');

        if (iframe) {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            const elements = iframeDocument.querySelectorAll('.dmuiv4-tabs-tab-btn');

            if (elements.length > 1 && elements[7].innerText === '图表') {
                createButton(elements[7], iframeDocument);
                clearInterval(intervalId);
            }
        }
    }

    // Create and insert the re-throw button
    function createButton(secondElement, iframeDocument) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginLeft = '10px';
        buttonContainer.style.display = 'inline-block';

        const button = document.createElement('button');
        button.innerText = '重跑';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#ff0000';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        buttonContainer.appendChild(button);

        secondElement.parentNode.insertAdjacentElement('afterend', buttonContainer);

        button.addEventListener('click', () => handleButtonClick(iframeDocument));
    }

    // Handle button click event
    function handleButtonClick(iframeDocument) {
        const reportElement = iframeDocument.querySelector('.lMfgoRfoUsjRIwifrpcc.Q8dyDkj2uRG7Vkc3VwGt');

        if (reportElement) {
            const reportId = reportElement.getAttribute('data-id');
            const isConfirmed = confirm('您确定要执行此操作吗？');

            if (isConfirmed) {
                console.log('重抛按钮被点击，report_id:', reportId);
                sendReportIdToBackend(reportId);
            } else {
                console.log('操作已取消');
            }
        } else {
            console.log('未找到report元素');
        }
    }

    // Send report_id to backend
    function sendReportIdToBackend(reportId) {
        const urlMap = {
            1: 'rr-dom',
            2: 'rr-os/report',
            3: 'synchronized/dom',
            4: 'synchronized/os'
        };

        const type = reportId[9];
        const url_name = urlMap[type];

        // Determine the correct URL based on the current site
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.includes('webqa')
            ? 'https://restnewqa.innodealing.com'
            : 'https://rest.innodealing.com';

        const url = `${baseUrl}/dwd-report-research-service/internal/${url_name}/send/aigc/work/flow`;

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([reportId]),
        })
        .then(response => {
            if (response.ok) {
                console.log('报告重跑成功');
                showSuccessMessage(reportId);
            } else {
                console.error('报告重跑失败');
            }
        })
        .catch(error => {
            console.error('网络错误:', error);
        });
    }

    // Show success message with report_id
    function showSuccessMessage(reportId) {
        alert(`重跑成功，已提交至队列中（报告 ID: ${reportId}），可以稍后查看`);
    }

    // Start polling after the page has loaded
    window.addEventListener('load', () => {
        intervalId = setInterval(addReThrowButton, 1000); // Check every second
    });
})();