// ==UserScript==
// @name         CAU 在线教学平台自动下载
// @namespace    autodownCauUmooc
// @version      0.2
// @description  省去每次打开PPT都要先加载预览浪费的时间。Basically powered by ChatGPT
// @author       Mahironchan
// @include      https://jx.cau.edu.cn/meol/common/script/preview/download_preview.jsp*
// @include      https://jx.cau.edu.cn/meol/jpk/course/layout/newpage/index.jsp*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493286/CAU%20%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/493286/CAU%20%E5%9C%A8%E7%BA%BF%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var DownEnable = GM_getValue("CauUmoocDownloader", true);

    // 获取当前页面链接
    const currentUrl = window.location.pathname;
    if (currentUrl == "/meol/jpk/course/layout/newpage/index.jsp") {
        ShowSettings();
    } else if (currentUrl == "/meol/common/script/preview/download_preview.jsp") {
        if (DownEnable == true) {
            autodown();
        }
    }
})();

function ShowSettings(){
    var LocButton = document.getElementById('tmenu');
    var liElement = document.createElement("li");
    var settingaElement = document.createElement("a");
    var settingspanElement = document.createElement("span");

    // 按钮内容
    settingaElement.setAttribute('href', 'javascript:void(0)');
    settingaElement.setAttribute('title',"自动下载模式");
    settingaElement.addEventListener('click', function(event) {
        event.preventDefault();
        settingScriptEnable();
    });
    statusenable = GM_getValue("CauUmoocDownloader", true);
    if (statusenable == true) {
        settingspanElement.textContent = '自动下载：开';
    } else {
        settingspanElement.textContent = '自动下载：关';
    }
    settingspanElement.setAttribute('id',"scriptautodown");

    // 加入按钮
    settingaElement.appendChild(settingspanElement);
    liElement.appendChild(settingaElement);
    LocButton.appendChild(liElement);
}

function autodown() {
    var urlParams = new URLSearchParams(window.location.search);
    var prev_fileid = urlParams.get('fileid');
    var prev_resid = urlParams.get('resid');
    var prev_lid = urlParams.get('lid');

    // 构建重定向后的 URL
    var redirectURL = 'https://jx.cau.edu.cn/meol/common/script/download.jsp?fileid=' + prev_fileid + "&resid=" + prev_resid+ "&lid=" + prev_lid;

    // 执行重定向
    window.location.href = redirectURL;
    setTimeout("window.close()",100);
}

function settingScriptEnable() {
    statusenable = GM_getValue("CauUmoocDownloader", true);
    var textchange = document.getElementById("scriptautodown");
    if (statusenable == true) {
        GM_setValue("CauUmoocDownloader", false);
        textchange.innerHTML = "自动下载：关";
    } else {
        GM_setValue("CauUmoocDownloader", true);
        textchange.innerHTML = "自动下载：开";
    }
}