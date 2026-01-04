// ==UserScript==
// @name         BUCT_THEOL_PDF
// @namespace    https://github.com/wzcsimon123/BUCT_THEOL_PDF
// @version      0.1
// @description  北京化工大学在线教育平台pdf文档下载，无视下载权限。
// @author       wzcsimon123
// @match        https://course.buct.edu.cn/meol/common/script/preview/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469075/BUCT_THEOL_PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/469075/BUCT_THEOL_PDF.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 获取当前页面链接的参数值
    var urlParams = new URLSearchParams(window.location.search);
    var resId = urlParams.get('resid');
    var lid = urlParams.get('lid');

    // 创建下载图标元素
    var downloadIcon = document.createElement('a');
    downloadIcon.innerHTML = '&#x2193;'; // 下载图标使用 Unicode 编码
    downloadIcon.style.fontSize = '24px';
    downloadIcon.style.position = 'fixed';
    downloadIcon.style.right = '20px';
    downloadIcon.style.bottom = '20px';
    downloadIcon.style.color = '#000';
    downloadIcon.style.background = '#fff';
    downloadIcon.style.borderRadius = '50%';
    downloadIcon.style.padding = '10px';
    downloadIcon.style.textDecoration = 'none';
    downloadIcon.style.zIndex = '9999';

    // 构建下载链接
    var downloadURL = 'https://course.buct.edu.cn/meol/analytics/resPdfShow.do?resId=' + resId + '&lid=' + lid;
    downloadIcon.href = downloadURL;
    downloadIcon.setAttribute('download', ''); // 设置下载属性，使链接被点击后直接下载文件

    // 添加下载图标到页面
    document.body.appendChild(downloadIcon);
})();