// ==UserScript==
// @name         「Ele-Cat」Bilibili一键三连
// @namespace    https://ele-cat.gitee.io/
// @version      0.0.1
// @description  进阶-Bilibili一键三连
// @author       Ele-Cat
// @match        *://*.bilibili.com/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/493083/%E3%80%8CEle-Cat%E3%80%8DBilibili%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/493083/%E3%80%8CEle-Cat%E3%80%8DBilibili%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    GM_addStyle(
        ".ad-report.video-card-ad-small {display: none !important;}.video-toolbar-left-item:hover .video-sanlian-icon path {fill: #00AEEC;transition: all .3s;}"
    );

    const getElementObject = function(selector, allowEmpty = true, delay=10, maxDelay=20000){
        return new Promise((resolve,reject) =>{
            let totalDelay = 0;
            let element = document.querySelector(selector);
            let result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
            if(result){
                resolve(element);
            }
            let elementInterval = setInterval(()=>{
                if(totalDelay >= maxDelay){ //总共检查20s，如果还是没找到，则返回
                    clearInterval(elementInterval);
                    resolve(null);
                }
                element = document.querySelector(selector);
                result = allowEmpty ? !!element : (!!element && !!element.innerHTML);
                if(result){
                    clearInterval(elementInterval);
                    resolve(element);
                }else{
                    totalDelay += delay;
                }
            }, delay);
        });
    }

    let videoContainer = await getElementObject(".total-reply")
    if (!videoContainer) {
        return false;
    }
    let yijiansanlian = `<div class="toolbar-left-item-wrap" id="yijiansanlian" style="margin-right:18px">
            <div title="一键三连（A）" class="video-sanlian video-toolbar-left-item">
                <svg t="1713697381796" class="video-sanlian-icon video-toolbar-item-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5138" width="36" height="36"><path d="M509.5 75c169.833 0 317.619 94.397 393.751 233.585 40.88 71.778 61.698 155.459 55.55 243.368a29.85 29.85 0 0 1-2.416 9.88 447.03 447.03 0 0 1-14.076 79.69l-115.09-42.056c5.807-24.376 8.881-49.813 8.881-75.967 0-180.376-146.224-326.6-326.6-326.6-180.376 0-326.6 146.224-326.6 326.6 0 180.376 146.224 326.6 326.6 326.6 30.589 0 60.195-4.205 88.273-12.069l40.427 115.23C597.434 965.45 554.232 972 509.5 972c-196.366 0-363.257-126.196-423.997-301.91-21.11-56.21-30.746-117.523-26.305-181.043 7.646-109.337 55.686-206.39 128.921-278.384C269.594 126.977 383.477 75 509.5 75z m53.012 463.588l341.183 120.66c11.452 4.233 17.172 16.224 12.88 26.807-1.95 5.236-5.939 9.49-11.078 11.833l-129.831 57.316c-9.989 4.208-17.934 12.044-22.175 21.87l-55.08 129.121c-4.244 10.478-16.909 15.428-27.572 11.418l-0.323-0.124c-5.72-2.117-10.013-7.06-12.156-12.7L535.328 565.394a20.368 20.368 0 0 1 0.688-16.068c2.424-5.046 6.82-8.918 12.19-10.74 4.287-2.116 9.297-2.116 14.306 0zM509 300.1c118.615 0 215.395 93.49 220.673 210.802 0.218 4.005 0.327 8.039 0.327 12.098 0 12.958-1.115 25.655-3.255 38l-28.716-10.164a29.739 29.739 0 0 1-15.271-5.405l-154.65-54.743c-6.997-2.96-13.994-2.96-19.982 0-7.503 2.547-13.642 7.96-17.029 15.016a28.5 28.5 0 0 0-1.134 21.998l0.173 0.467 75.514 208.503C547.57 741.453 528.583 744 509 744c-122.055 0-221-98.945-221-221 0-4.06 0.11-8.093 0.326-12.098C293.605 393.589 390.385 300.1 509 300.1z" fill="#61666D" p-id="5139"></path></svg>
                <span class="video-sanlian-info video-toolbar-item-text">一键三连</span>
            </div>
        </div>`
        if ($("#yijiansanlian").length === 0) {
            $(".video-toolbar-left-main").prepend(yijiansanlian)
        }

    $("body").on("click", "#yijiansanlian", function(){
        $("#arc_toolbar_report .video-like").click(); // 点赞
        $("#arc_toolbar_report .video-coin").click(); // 投币
        // $("#arc_toolbar_report .video-fav").click(); // 收藏
    });

    $(document).keydown(function(event) {
        // 检查按下的键是否是 'A' 键的键码，键码为65
        if (event.which === 65) {
            // 在这里执行您想要的操作
            $("#yijiansanlian").click();
        }
    });
})();