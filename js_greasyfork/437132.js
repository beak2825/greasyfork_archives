// ==UserScript==
// @name         ccnu-spoc Evolved
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto refresh the session of ccnu-spoc
// @description  download resource
// @author       kocoler
// @match        http://spoc.ccnu.edu.cn/starmoocHomepage/*
// @match        http://spoc.ccnu.edu.cn/starmoocHomepage
// @match        http://spoc.ccnu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=ccnu.edu.cn
// @connect spoc.ccnu.edu.cn
// @grant GM_xmlhttpRequest
// @grant GM_log
// @grant location.reload
// @grant document.getElementsByClassName
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437132/ccnu-spoc%20Evolved.user.js
// @updateURL https://update.greasyfork.org/scripts/437132/ccnu-spoc%20Evolved.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const l_name = "YOURS";
    const p_w_d = "YOURS";
    console.log("now using auto spoc refresh session script");
    sendCheckStatus();
    setInterval(function() {
        console.log("now send check status");
        sendCheckStatus();
    }, 100000);
    console.log("after interval", window.location.href);

    setTimeout(
        function randerDownloadButton() {
            if (window.location.href.indexOf("http://spoc.ccnu.edu.cn/studentHomepage/studentCourseCenter") > -1) {
                console.log("now rander download buttom");
                var mediaList = document.getElementsByClassName('media');
                for (let i = 0; i < mediaList.length; ++i) {
                    console.log("render buttom item: ", i);
                    var mediaItem = mediaList[i];
                    var viewOnlineButton = mediaList[i].getElementsByClassName("fr button-attachmentView")[0];
                    if (viewOnlineButton == undefined || viewOnlineButton.dataset == undefined) {
                        continue;
                    }
                    var resourceid = viewOnlineButton.dataset.resourceid;
                    console.log(resourceid);
                    var toFileInfo = mediaItem.getElementsByClassName("specialI")[0];
                    console.log(toFileInfo.innerText);
                    var fileName = toFileInfo.innerText;
                    var download_button = document.createElement('a');
                    // download_button.setAttribute("class", "fr button-attachmentView");
                    download_button.id = 'download';
                    download_button.innerText = 'Download resource ('+ fileName +')';
                    download_button.setAttribute("href", "http://spoc.ccnu.edu.cn/downloadFile?attachmentId=" + resourceid, '_blank');
                    download_button.setAttribute("download", "filename");
                    var closeUpItem = mediaItem.closest(".layui-colla-content");
                    closeUpItem.insertBefore(download_button, mediaItem);
                }
            }
        }, 1000);

    /*setTimeout(
    function randerDownloadButton() {
        if (window.location.href.indexOf("http://spoc.ccnu.edu.cn/studentHomepage/studentCourseCenter") > -1) {
            console.log("now rander download buttom");
            var list = document.getElementsByClassName('attachment-button-container fr');
            var lList = document.getElementsByClassName('layui-colla-content layui-show');
            for (let i = 0; i < lList.length; ++i) {
                console.log("render buttom item: ", i);
                var listMainItem = lList[i];
                var viewOnlineButton = lList[i].getElementsByClassName('attachment-button-container fr')[0].getElementsByClassName("fr button-viewOnline")[0],
                    resourceid = viewOnlineButton.dataset.resourceid;
                console.log(resourceid);
                var toFileInfo = listMainItem.getElementsByClassName("specialI")[0];
                console.log(toFileInfo.innerText);
                var fileName = toFileInfo.innerText;
                var download_button = document.createElement('a');
                // download_button.setAttribute("class", "fr button-attachmentView");
                download_button.id = 'download';
                download_button.innerText = 'Download resource ('+ fileName +')';
                download_button.setAttribute("href", "http://spoc.ccnu.edu.cn/downloadFile?attachmentId=" + resourceid, '_blank');
                download_button.setAttribute("download", "filename");
                var mediaItem = listMainItem.getElementsByClassName("media")[0];
                lList[i].insertBefore(download_button, mediaItem);
            }
        }
    }, 1000);*/

    function downloadResourse(resourceid) {
        window.open("http://spoc.ccnu.edu.cn/downloadFile?attachmentId=" + resourceid, '_blank');
    }

    function sendCheckStatus() {
        fetch(new Request("http://spoc.ccnu.edu.cn/studentHomepage/getUserInfo", {redirect: 'error', mode: 'cors'}))
            .catch(error => {if (error == "TypeError: Failed to fetch") {
                console.log("now refresh!");
                // refresh
                refreshSession();
            }})
        return;
    }

    function refreshSession() {
        console.log("refreshing session ...");
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://spoc.ccnu.edu.cn/userLoginController/getUserProfile",
            data: "loginName="+ l_name +"&password="+ p_w_d,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if (response.responseText.indexOf('code":0') > -1) {
                    // refresh when homepage
                    if (window.location.href == "http://spoc.ccnu.edu.cn/starmoocHomepage/" || window.location.href == "http://spoc.ccnu.edu.cn/starmoocHomepage") {
                        location.reload();
                    }
                } else {
                    if (response.responseText.indexOf('msg') > -1) {
                        // alter message
                        alert(response.responseText.subString(response.responseText.indexOf('msg')));
                    }
                }
            }
        });
    };
})();