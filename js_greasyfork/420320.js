// ==UserScript==
// @name         游戏年轮自动评论
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bibgame.com/pcgame/**
// @grant        none
// @require      https://lib.baomitu.com/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/420320/%E6%B8%B8%E6%88%8F%E5%B9%B4%E8%BD%AE%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/420320/%E6%B8%B8%E6%88%8F%E5%B9%B4%E8%BD%AE%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let [, classID, id] = ($("[href*=classid]").attr('href') || '').match(/classid=(\d+).*id=(\d+)/) || [];

    function postComment() {
        // id: 54109
        // classid: 145
        // saytext: 766666
        // enews: AddPl
        let commentFormData = new FormData();
        commentFormData.append('id', id);
        commentFormData.append('classid', classID);
        commentFormData.append('saytext', '666666');
        commentFormData.append('enews', 'AddPl');

        return $.ajax({
            url: `/e/extend/lgyPl/doaction.php?ajax=1&_t=${+new Date()}`,
            data: commentFormData,
            processData: false,
            contentType: false,
            type: 'POST',
        });
    }

    function getDownloadUrl() {
        // id: 55213
        // classid: 145
        let urlFormData = new FormData();
        urlFormData.append('id', id);
        urlFormData.append('classid', classID);
        return $.ajax({
            url: '/e/extend/xzzy/index.php',
            data: urlFormData,
            processData: false,
            contentType: false,
            type: 'POST',
            // success: function (data) {
            //     console.log(data);
            //     $('#chakan').html(data);
            // }
        });
    }

    (async function () {

        if (!classID || !id) {
            return;
        }

        let urlSegment = await getDownloadUrl();
        if (urlSegment) {
            if (/ 【发表评论后】 /.test(urlSegment)) {
                await postComment();
                console.log('脚本发表评论成功...');
                urlSegment = await getDownloadUrl();
            }
        }
        $('#chakan').html(urlSegment);
        console.log('脚本获取下载内容成功...');
    })();


    // Your code here...
})();