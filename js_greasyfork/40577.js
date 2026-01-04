// ==UserScript==
// @name         tower进入提交测试
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  CDD内部使用
// @author       华哥
// @exclude      https://tower.im/projects/58a3a947a9044550835ff1399a1600ee/*
// @match        https://tower.im/projects/*
// @run-at document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40577/tower%E8%BF%9B%E5%85%A5%E6%8F%90%E4%BA%A4%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/40577/tower%E8%BF%9B%E5%85%A5%E6%8F%90%E4%BA%A4%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    $('.detail-actions').append('<div class="item"><a href="javascript:;" id="submitTest" target="_blank">提交测试</a></div>');
    $('body').on('click', '#submitTest', function(e) {
        e.preventDefault();
        var connid = $('#conn-guid').val(),
            csrfToken = $('meta[name="csrf-token"]').attr('content'),
            title = $('.todo-content .raw').text();
        if (title === '' || !title) {
            alert('缺少title');
            return false;
        }
        $.ajax({
            headers: {"X-CSRF-Token": csrfToken},
            url: 'https://tower.im/projects/58a3a947a9044550835ff1399a1600ee/lists/eae4d5db1de646f0b8510e1b78e70aab',
            type: 'post',
            dataType: 'json',
            data: {conn_guid: connid, todo_content: title + '提测', assignee_guid:'585c55f1fd61467bb48252c5e4b26041', due_at: ''}
        }).done(function(res) {
            var regString = res.html.match(/data-guid="(\w+)"/);
            if (typeof regString[1] !== 'undefined') {
                window.open('https://tower.im/projects/58a3a947a9044550835ff1399a1600ee/todos/' + regString[1], '_blank');
            }
        });
    });
})(jQuery);