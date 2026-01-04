// ==UserScript==
// @name         CCNU-xiaoya-DownLoader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add dowmload button to xiaoya
// @author       zhouxinghua001
// @match        https://ccnu.ai-augmented.com/*
// @icon         https://aia-publication.oss-cn-shanghai.aliyuncs.com/oss-ccnu/jw/d8d7c652859b47f69be5311222d56f09.png
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/475091/CCNU-xiaoya-DownLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/475091/CCNU-xiaoya-DownLoader.meta.js
// ==/UserScript==


(function () {
    'use strict';
    console.log("小雅下载器开始执行");
    console.log(document);
    var targetElementSelector = "#aia_main_header > div.ta-header-menu > div";
    var observer = new MutationObserver(function (mutations) {
        var check=1;
        mutations.forEach(function (mutation) {
            if (document.querySelector(targetElementSelector)&&check==1) {
                check=2;
                var parentNode = document.querySelector("#aia_main_header > div.ta-header-menu > div");
                var floatingButton = document.createElement('div');
                floatingButton.innerHTML = '<button id="download-button">下载</button>';
                parentNode.appendChild(floatingButton);
                document.getElementById('download-button').addEventListener('click', function () {
                    var allCookies = document.cookie;
                    var targetCookieName = 'HS-prd-access-token';
                    var cookiesArray = allCookies.split(';');
                    for (var i = 0; i < cookiesArray.length; i++) {
                        var cookie = cookiesArray[i].trim();
                        if (cookie.indexOf(targetCookieName + '=') === 0) {
                            var authToken = cookie.substring(targetCookieName.length + 1);
                            break;
                        }
                    }
                    var currentUrl = window.location.href;
                    var parts = currentUrl.split('/');
                    var index = parts.indexOf('mycourse');
                    if (index !== -1 && index < parts.length - 1) {
                        var group_id = parts[index + 1];
                    }
                    var node_id = parts[parts.length - 1];
                    var xhr1 = new XMLHttpRequest();
                    var url1 = "https://ccnu.ai-augmented.com/api/jx-iresource/resource/queryCourseResources?group_id=" + group_id
                    xhr1.open('GET', url1, true);
                    xhr1.responseType = 'json';
                    xhr1.setRequestHeader('Authorization', 'Bearer ' + authToken);
                    xhr1.send();
                    xhr1.onload = function () {
                        var courselist = xhr1.response.data;
                        for (var i of courselist) {
                            if (i.id == node_id) {
                                var id = i.quote_id;
                                break;
                            }
                        }
                        var xhr2 = new XMLHttpRequest();
                        var url2 = "https://ccnu.ai-augmented.com/api/jx-oresource/cloud/file_url/" + id
                        xhr2.open('GET', url2, true);
                        xhr2.responseType = 'json';
                        xhr2.setRequestHeader('Authorization', 'Bearer ' + authToken);
                        xhr2.send();
                        xhr2.onload = function () {

                            var downloadLink = xhr2.response.data.url;
                            window.open(downloadLink)

                        }
                    };
                })

                observer.disconnect();
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

