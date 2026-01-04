// ==UserScript==
// @name         Douban Comment Deletion
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Delete your comments in group posts
// @author       https://www.douban.com/people/seebyl (viasyla)
// @match        *://www.douban.com/group/topic/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534546/Douban%20Comment%20Deletion.user.js
// @updateURL https://update.greasyfork.org/scripts/534546/Douban%20Comment%20Deletion.meta.js
// ==/UserScript==

;(async () => {
    'use strict';

    // —— fetch/prompt userId + menu command ——

    async function fetchOrPromptUserId() {
        let stored = await GM_getValue('userId', null);
        if (!stored) {
            const input = prompt('🚀 请输入你的用户 ID：');
            if (input) {
                await GM_setValue('userId', input);
                return input;
            }
            return null;
        }
        return stored;
    }

    const userId = await fetchOrPromptUserId();

    GM_registerMenuCommand('✏️ 修改用户 ID', async () => {
        const newId = prompt('✏️ 重新输入你的用户 ID：', userId || '');
        if (newId) {
            await GM_setValue('userId', newId);
            location.reload();
        }
    });

    const box = document.createElement('div');
    box.textContent = `你的 ID = ${userId}`;
    Object.assign(box.style, {
        position: 'fixed',
        bottom: '10px',
        left: '10px',
        padding: '8px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        borderRadius: '4px',
        zIndex: 9999,
    });
    document.body.appendChild(box);

    // —— now it’s safe to await every GM_… call ——

    console.log('Page Matched:', /\/group\/topic\//.test(window.location.href));
    const targetUserId = Number(await GM_getValue('userId', null));
    console.log('target user id:', targetUserId);

    const topicOpt = $('.topic-opt');
    const topicAdminOpts = $('.topic-admin-opts');
    const tid = location.href.match(/topic\/(\d+)\//)[1];
    const ck = get_cookie("ck");
    const pageStart = 0;

    // 顺手把ad关了
    $('#gdt-ad-container').remove();
    $('#dale_group_topic_inner_middle').remove();

    function randomDelay(min = 500, max = 1500) {
        return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
    }

    async function autoDeleteAllComments(p) {
        let hasNextPage = true;
        let pageCounter = p;
        while (hasNextPage) {
            await randomDelay();
            await delPageComment();
            hasNextPage = await gotoNextPage();
            topicAdminOpts.append(`<div>页码${pageCounter}处理完毕</div>`);
            pageCounter++;
        }
    }


    async function delPageComment() {
        let topicReply = $('.topic-reply li');
        for (let i = 0; i < topicReply.length; i++) {
            const comment = topicReply[i];
            const authorId = $(comment).data('author-id');
            // console.log('found id', authorId);

            // Check if the comment belongs to the target user
            if (authorId === targetUserId) {
                console.log('User id matched, delete it', authorId);
                await delComment(i, comment);
            }
        }
    }



    if (topicAdminOpts.children.length > 0) {
        topicAdminOpts.append(`
        <div id="auto-del-wrapper" style="display: flex; align-items: center; margin-top: 10px; gap: 8px;">
            <label for="page-start-input" style="font-weight:bold; color:#ff0000;">起始页:</label>
            <input
                type="number"
                id="page-start-input"
                placeholder="1"
                style="width: 60px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
            <a
                id="auto-del"
                href="javascript:void(1);"
                style="padding: 6px 12px; background-color: #ff4d4f; color: white; border-radius: 4px; font-weight: bold; text-decoration: none;">
                自动删除我的评论
            </a>
        </div>
    `);

        $('#auto-del').click(async e => {
            e.stopImmediatePropagation();

            let pageStartInput = parseInt($('#page-start-input').val(), 10);
            let pageStart = (!isNaN(pageStartInput) && pageStartInput >= 1) ? pageStartInput : 1;

            console.log('Deletion start from page:', pageStart);

            await goToPage(pageStart);
            await autoDeleteAllComments(pageStart);
            topicAdminOpts.append(`<div>全部评论已删除。若意外中断，刷新后输入当前页码继续。</div>`);
            // setTimeout(() => location.reload(), 5000);
        });
    }



    function delComment(i, e) {
        return new Promise(function (resolve, reject) {
            let cid = $(e).data('cid')
            $.post(`/j/group/topic/${tid}/remove_comment`, {
                ck: ck,
                cid: cid
            }, function(){
                let targetText = $(e)[0].querySelector('.markdown').textContent.trim()
                topicAdminOpts.append(`<div>成功删除第${i+1}条评论：${targetText.substring(0, 20)}</div>`)
                resolve()
            })
        });
    }



    function gotoNextPage() {
        return new Promise((resolve) => {
            let nextLink = $('a:contains("后页")').attr('href');

            if (nextLink) {
                console.log('Next page link:', nextLink);
                $.ajax({
                    url: nextLink,
                    method: 'GET',
                    success: function(data) {
                        let newDom = $('<div></div>').html(data);

                        // ✅ 更新普通评论
                        $('#comments').html(newDom.find('#comments').html());

                        // ✅ 清除最赞评论区域（第一页才有）
                        $('#popular-comments').remove();
                        $('#content > div > div.article > h3').remove();

                        // ✅ 更新分页器
                        let newPaginator = newDom.find('.paginator');
                        if (newPaginator.length > 0) {
                            $('.paginator').html(newPaginator.html());
                        } else {
                            console.warn('新页面没有分页器');
                        }

                        resolve(true);
                    },
                    error: function() {
                        console.error('加载下一页失败');
                        resolve(false);
                    }
                });
            } else {
                console.log('Last page reached. Congrats!');
                resolve(false);
            }
        });
    }


    function goToPage(pageNum) {
        // 如果是第 1 页，直接 resolve，不跳转
        if (pageNum === 1) {
            console.log('Already at the 1st page.');
            $('#popular-comments').remove();
            $('#content > div > div.article > h3').remove();
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            let pageUrl = `/group/topic/${tid}/?start=${(pageNum - 1) * 100}`;
            console.log(`Jump to page ${pageNum}`, pageUrl);

            $.ajax({
                url: pageUrl,
                method: 'GET',
                success: function(data) {
                    let newDom = $('<div></div>').html(data);

                    // 更新评论列表
                    $('.topic-reply').html(newDom.find('.topic-reply').html());

                    // 更新分页导航栏
                    let newPaginator = newDom.find('.paginator');
                    if (newPaginator.length > 0) {
                        $('.paginator').html(newPaginator.html());
                    } else {
                        console.warn('目标页面没有分页器');
                    }

                    resolve();
                },
                error: function() {
                    console.error('跳转页面失败');
                    reject();
                }
            });
        });
    }

})();
