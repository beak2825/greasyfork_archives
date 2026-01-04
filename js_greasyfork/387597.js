// ==UserScript==
// @name         tower提交发布清单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CDD内部使用
// @author       华哥
// @match        https://tower.im/teams/*
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387597/tower%E6%8F%90%E4%BA%A4%E5%8F%91%E5%B8%83%E6%B8%85%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/387597/tower%E6%8F%90%E4%BA%A4%E5%8F%91%E5%B8%83%E6%B8%85%E5%8D%95.meta.js
// ==/UserScript==


(function(exports) {
    'use strict';
    $('.todo-additions').append('<p onclick="addCddList()" style="font-size:16px;line-height: 30px;color:#44acb6;cursor:pointer;">添加到发布清单</p>');
    var title = '';
    function addCddList() {
        title = prompt("请输入标题", $.trim($('.todo-detail-title').text()));
        console.log(title);
        if (title.length > 0) {
            cddSubmit();
        }
    }
    exports.addCddList = addCddList;
    function cddSubmit() {
        let guid = $('#conn-guid').val(),
            assignee_guid = 'fcc0322d607d45c1811c6781c85f3551';
        let params = {
            "conn_guid": guid,
            "utf8": "✓",
            "todos_creation": {
                "content": title,
                "assignee_guid": assignee_guid,
                "due_at": "",
                "start_at": "",
                "priority": "normal",
                "label_ids": [
                    ""
                ],
                "desc": '<p><span style=""><a href="' + location.href + '" rel="nofollow">'+ location.href +'</a></span><br></p>',
                "is_html": "1",
                "attfile_guids": [
                    "''"
                ]
            },
            "is_html": "1",
            "name": "button",
            "value": ""
        };
        $.ajax({
            url: '/projects/7591affe52b51b30544824c8a91a2cdf/lists/638b4981c664e77ee21ff23c7b321f32',
            type: 'post',
            data: params
        }).done(function(res) {
            console.log(res);
        }).always(function() {
            alert("已完成");
        });
    }
})(window);