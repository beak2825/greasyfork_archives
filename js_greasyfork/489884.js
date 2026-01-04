// ==UserScript==
// @name         教学立方下载辅助
// @namespace    http://tampermonkey.net/
// @version      2024-01-05
// @description  所见即所得，教学立方中只供预览的文件也会有下载按钮了。
// @author       njuer
// @match        https://teaching.applysquare.com/S/Course/index/cid/*
// @icon         https://teaching.applysquare.com/public/assets/images/server/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489884/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/489884/%E6%95%99%E5%AD%A6%E7%AB%8B%E6%96%B9%E4%B8%8B%E8%BD%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==


(function() {
    let token = window.jCommon.getLocalStorge('token');
    let uid = window.jCommon.getLocalStorge('uid')
    let cid

    // 循环函数
    async function loopFunction() {
        // 循环开始
        while (true) {
            // 检查锚点是否为 #S-Lesson-index
            var hash = window.location.hash;
            if (!hash.includes('#S-Lesson-index')) {
                // 锚点不是 #S-Lesson-index，等待一段时间后重新检查
                await sleep(1000);
                continue;
            }

            // 生成备份
            var lessonListBackup = JSON.parse(JSON.stringify(window.lessonindex.lesson_list));

            // 循环备份 lessonList
            var allCanDownload = true;
            for (var i = 0; i < lessonListBackup.length; i++) {
                var lessonBackup = lessonListBackup[i];

                // 检查 can_download 是否为 0
                if (lessonBackup.can_download === "0") {
                    allCanDownload = false;

                    // 发起网络请求，使用 await 等待请求完成
                    try {
                        var data = await makeNetworkRequest(lessonBackup.id, lessonBackup.uid, lessonBackup.cid);

                        // 修改备份 lessonListBackup 中对应元素的 path 和 can_download
                        lessonListBackup[i].path = data.message.path;
                        lessonListBackup[i].can_download = "1";
                    } catch (error) {
                        console.error("教学立方下载辅助：Network request failed:", error);
                    }
                }
            }

            // 如果所有的 can_download 都为 1，则直接进行下一次循环的休眠
            if (allCanDownload) {
                await sleep(500);
                continue;
            }

            // 将备份应用到全局变量上
            window.lessonindex.lesson_list = lessonListBackup;

            // 等待一段时间后重新开始循环
            await sleep(1000);
        }
    }

    // 网络请求函数，返回 Promise
    function makeNetworkRequest(id, uid, cid) {
        var url = 'https://teaching.applysquare.com/Api/CourseAttachment/ajaxGetInfo/token/' + token + '?id=' + id + '&uid=' + uid + '&cid=' + cid;

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function() {
                if (xhr.status === 200) {
                    var data = JSON.parse(xhr.responseText);
                    resolve(data);
                } else {
                    reject(xhr.statusText);
                }
            };
            xhr.send();
        });
    }

    // 等待函数，返回 Promise
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 启动循环
    loopFunction();
})();