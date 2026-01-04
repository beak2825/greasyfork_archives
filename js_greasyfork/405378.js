// ==UserScript==
// @name         ACFUN-CIP-2020
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ACFUN时空资源探测器
// @author       johnsmith2077
// @match        *://www.acfun.cn/a/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/arrive@2.4.1/src/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/405378/ACFUN-CIP-2020.user.js
// @updateURL https://update.greasyfork.org/scripts/405378/ACFUN-CIP-2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add_magic_buttons()
    {
        return new Promise((resolve, reject) =>
        {
            $('.comment-content:contains(\'该评论已被删除\')').each((_, element) => {
                $(element)
                    .filter((_, el) => el.textContent && el.textContent.trim() === '该评论已被删除')
                    .filter((_, el) => $(el).find('input').length === 0)
                    .append($('<input data-magic type="button" value="诉诸时空魔法">'))
            });
            resolve('Successfully add magic');
        });
    }
    // add_magic_buttons();

    function get_comment_ajax(content_id, floor)
    {
        return $.ajax(
        {
            method: 'get',
            url: `https://johnsmith2077.top:47688/api/v2/comment?content_id=${content_id}&floor=${floor}`,
            // url: 'http://localhost:8000/v2/comment',
            dataType: 'json',
            data: {
                content_id: content_id,
                floor: floor,
            },
        })
    }
    // get_comment_ajax(16162787, 125).done((val)=>{console.log(val)});

    function get_user_info_ajax(user_id)
    {
        return $.ajax(
        {
            url: 'https://www.acfun.cn/rest/pc-direct/user/userInfo',
            method: 'get',
            dataType: 'json',
            data: {
                userId: user_id
            }
        });
    }
    // get_user_info_ajax(472500).then(res => console.log(`${res.profile.userId} ${res.profile.name}`));

    function bind_magic_buttons()
    // bind_magic_buttons = async ()=>
    {
        $('.comment-area').on('click', 'input[data-magic]', function () 
        {
            let $basicComment = $(this).closest('[id^=basic-comment]');
            const contentId = window.location.pathname.split('/ac')[1];
            const floor = $basicComment.find('> .comment-name-bar .comment-floor').text().split('#')[1]; 
            // console.log(contentId);
            // console.log(floor);
            $(this).val('时空探索中...');
            // should diasble $(this) to prevent duplicate clicks? but what if request fails
            get_comment_ajax(contentId, floor).then((res) => 
            {
                let content = res.content;
                if ($(this).closest('.comment-content').length > 0) {
                    $(this).closest('.comment-content').html(content);
                } else {
                    $(this).prev('.comment-content').html(content);
                }
                // return res.userId;
                return $(this);
            })
            .then((magic_btn) => {
                magic_btn.remove();
            })
            // .then((userId) => 
            // {
            //     if (userId > 0) { return get_user_info_ajax(userId); }

            // })
            // .then((res) => 
            // {
            //     // console.log(res);
            //     if (res.code != 200) { return; }
            //     $basicComment = $(this).closest('[id^=basic-comment]');
            //     const $name = $basicComment.find('> .comment-name-bar .name');
            //     console.log(res)
            //     console.log($basicComment);
            //     const href = $name.attr('href').replace('0', res.profile.userId);
            //     $name.attr('data-uid',  res.profile.userId).attr('href', href).html(res.profile.name).show();
            // })
            .catch((err) => {
                console.log(err)
                $(this).val('你陷入了时空旋涡');
            });
        });
    }
    // bind_magic_buttons();


    function init() 
    {
        // console.log('AcFun CIP Init');
        add_magic_buttons()
        .then(val => { bind_magic_buttons(); });
    }


    $(document).arrive('.comment-content', {fireOnAttributesModification: true, existing: true, onceOnly: true}, function() {
        // console.log($('.comment-content').length);
        // alert('executed');
        init();
        $(document).unbindArrive(".comment-content");
    });
})();