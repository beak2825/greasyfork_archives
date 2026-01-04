// ==UserScript==
// @name        DLsite跳转到ASMR网站
// @namespace   http://tampermonkey.net/
// @version     1.1
// @description 从DLsite重定向到相应的ASMR页面
// @author      injustice1
// @match       https://www.dlsite.com/*
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/472334/DLsite%E8%B7%B3%E8%BD%AC%E5%88%B0ASMR%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/472334/DLsite%E8%B7%B3%E8%BD%AC%E5%88%B0ASMR%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var redirectEnabled = localStorage.getItem('redirectEnabled') === 'true';
    var openInNewTab = localStorage.getItem('openInNewTab') === 'true';
    var autoRedirect = localStorage.getItem('autoRedirect') === 'true';

    // 手动跳转选项
    var manualRedirectButton = document.createElement('button');
    manualRedirectButton.textContent = '点击跳转';
    manualRedirectButton.style.position = 'fixed';
    manualRedirectButton.style.top = '10px';
    manualRedirectButton.style.right = '80px';
    manualRedirectButton.style.background = '#f2f2f2';
    manualRedirectButton.style.border = '2px solid #4CAF50';
    manualRedirectButton.style.borderRadius = '5px';
    manualRedirectButton.style.padding = '10px';
    manualRedirectButton.style.zIndex = '10000';
    manualRedirectButton.onclick = function() {
        checkRedirect(true);
    };
    document.body.appendChild(manualRedirectButton);

    // 折叠框
    var optionDiv = document.createElement('div');
    optionDiv.style.position = 'fixed';
    optionDiv.style.top = '60px';
    optionDiv.style.right = '10px';
    optionDiv.style.background = '#f2f2f2';
    optionDiv.style.border = '2px solid #4CAF50';
    optionDiv.style.borderRadius = '5px';
    optionDiv.style.padding = '10px';
    optionDiv.style.display = 'none';
    optionDiv.style.zIndex = '10000';
    document.body.appendChild(optionDiv);

    // 创建选项
    var toggleButton = document.createElement('button');
    toggleButton.textContent = '选项';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.background = '#f2f2f2';
    toggleButton.style.border = '2px solid #4CAF50';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.padding = '10px';
    toggleButton.style.zIndex = '10000';
    toggleButton.onclick = function() {
        optionDiv.style.display = optionDiv.style.display === 'none' ? 'block' : 'none';
    };
    document.body.appendChild(toggleButton);

    // 标签页选项
    var newTabButton = document.createElement('button');
    newTabButton.textContent = openInNewTab ? '新标签页中打开' : '当前标签页中打开';
    newTabButton.style.margin = '5px';
    newTabButton.onclick = toggleNewTab;
    optionDiv.appendChild(newTabButton);

    // 直接跳转选项
    var autoRedirectButton = document.createElement('button');
    autoRedirectButton.textContent = autoRedirect ? '已启用直接跳转' : '已关闭直接跳转';
    autoRedirectButton.style.margin = '5px';
    autoRedirectButton.onclick = toggleAutoRedirect;
    optionDiv.appendChild(autoRedirectButton);

    function toggleNewTab() {
        openInNewTab = !openInNewTab;
        newTabButton.textContent = openInNewTab ? '新标签页中打开' : '当前标签页中打开';
        localStorage.setItem('openInNewTab', openInNewTab);
    }

    function toggleAutoRedirect() {
        autoRedirect = !autoRedirect;
        autoRedirectButton.textContent = autoRedirect ? '已启用直接跳转' : '已关闭直接跳转';
        localStorage.setItem('autoRedirect', autoRedirect);
    }

    function checkRedirect(manual = false) {
        if (!autoRedirect && !manual) return;

        // 匹配RJ/VJ号
        var productCode = window.location.href.match(/product_id\/([RVJ]{1,2}\d+)/);
        if (productCode && productCode.length > 1) {
            var newUrl = 'https://asmr.one/work/' + productCode[1];
            GM_xmlhttpRequest({
                method: "HEAD",
                url: newUrl,
                onload: function(response) {
                    if (response.status === 200) {
                        if (openInNewTab) {
                            window.open(newUrl, '_blank');
                        } else {
                            window.location.href = newUrl;
                        }
                    }
                }
            });
        }
    }

    if (redirectEnabled) {
        checkRedirect();
    }
})();
