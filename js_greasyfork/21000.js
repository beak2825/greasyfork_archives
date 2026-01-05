// ==UserScript==
// @name         bilibilibar
// @namespace    https://greasyfork.org/zh-CN/scripts/21000-bilibilibar
// @version      0.1.2.1
// @description  为吧主管理提供便捷功能
// @author       winoros
// @match        http://tieba.baidu.com/f?kw=bilibili*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21000/bilibilibar.user.js
// @updateURL https://update.greasyfork.org/scripts/21000/bilibilibar.meta.js
// ==/UserScript==

(function() {
    let lists = $('.j_thread_list');
    lists.each(function() {
        let left = $(this).find('.j_threadlist_li_left');
        let magic = $($(left).find('span')[0]).clone();
        magic.attr('title', '删除');
        magic.text('删帖');
        magic.addClass('delete_by_click');
        magic.data('tid', $(this).data('field').id);
        $(left).append(magic);
    });
    $('.delete_by_click').on('click', function() {
        console.log($(this).data('tid'));
        $.post('http://tieba.baidu.com/f/commit/thread/delete', {'ie': 'utf-8', 'commit_fr': 'pb', 'kw': PageData.forum.forum_name,
                                                                     'fid': PageData.forum.forum_id,
                                                                     'tid': $(this).data('tid'), 'rich_text': 1, 'tbs': PageData.tbs}, function(data) {
            if(JSON.parse(data).no !== 0) {
            alert('删帖不能了喵~');
            } else {
            alert('删帖成功了喵~');
            }
        });
    });
})();