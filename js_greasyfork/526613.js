// ==UserScript==
// @name         妖火帖子AI总结(太长不看)
// @namespace    https://www.yaohuo.me/bbs/userinfo.aspx?touserid=20740
// @version      1.9.99
// @description  调用OpenAI或其他支持completions功能API对妖火论坛帖子内容及评论进行摘要总结，并提供回帖建议
// @author       SiXi
// @match        https://www.yaohuo.me/bbs*
// @match        https://yaohuo.me/bbs*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @icon         https://www.yaohuo.me/css/favicon.ico
// @license      Apache 2
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/526613/%E5%A6%96%E7%81%AB%E5%B8%96%E5%AD%90AI%E6%80%BB%E7%BB%93%28%E5%A4%AA%E9%95%BF%E4%B8%8D%E7%9C%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526613/%E5%A6%96%E7%81%AB%E5%B8%96%E5%AD%90AI%E6%80%BB%E7%BB%93%28%E5%A4%AA%E9%95%BF%E4%B8%8D%E7%9C%8B%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置参数
    const OPENAI_BASE_URL = 'https://api.gptgod.online/v1/chat/completions';  //模型的base_url，需要使用支持completions功能的url
    const OPENAI_API_KEY = 'sk-XXXXXXXXXXXX';  //密钥
    const OPENAI_MODEL = 'glm-4-flash';  //模型名称，火山方舟申请的模型是填'推理接入点'名称，ep开头那个

    // 创建按钮并插入页面
    $(document).ready(function() {
        $('.Postinfo .Postime').each(function() {
            const postInfo = $(this).closest('.Postinfo');
            const button = $('<button class="ai-summary-btn">AI总结</button>')
                .css({
                    'padding': '5px 10px',
                    'background-color': '#4CAF50',
                    'color': 'white',
                    'border': 'none',
                    'border-radius': '5px',
                    'cursor': 'pointer'
                })
                .insertAfter(postInfo.find('.Postime'))
                .on('click', function() {
                    handleButtonClick($(this), postInfo);
                });
        });
    });

    // 获取评论内容
    function getComments() {
        const comments = [];
        $('.recontent .retext').each(function() {
            const commentText = $(this).text().trim();
            if (commentText && !$(this).closest('.quoted-content').length) {
                comments.push(commentText);
            }
        });
        return comments;
    }

    // 处理按钮点击事件
    function handleButtonClick(button, postInfo) {
        button.prop('disabled', true).text('AI阅读中...');

        const title = postInfo.find('.biaotiwenzi').text().trim();
        if (!title) {
            alert("未找到帖子标题！");
            button.prop('disabled', false).text('AI总结');
            return;
        }

        const content = postInfo.closest('.content').find('.bbscontent').text().trim();
        if (!content) {
            alert("未找到帖子内容！");
            button.prop('disabled', false).text('AI总结');
            return;
        }

        const comments = getComments();

        const fullContent = `帖子标题：${title}\n\n原帖内容：\n${content}\n\n评论区内容：\n\n${comments.map((comment, index) => `${index + 1}. ${comment}`).join('\n')}`;

        fetchSummaryAndReplies(fullContent, button);
    }

    function fetchSummaryAndReplies(content, button) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${OPENAI_BASE_URL}`,
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "你是妖火网论坛的用户。请分别总结原帖内容和评论区的主要观点。原帖内容用1-3句话总结，评论区的观点用1-2句话总结。总结内容用'原帖内容'和'妖友观点'前缀进行回复。同时，请根据原帖内容和评论区的讨论，生成5条适合的回帖内容，尽可能贴近评论区的观点，模仿他们的语气，使用口语化，用'回帖内容'前缀进行回复。"
                    },
                    {
                        role: "user",
                        content: `请总结：\n\n${content}`
                    }
                ],
                stream: false
            }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    let summary = result.choices[0].message.content.trim();
                    summary = summary.replace("妖友观点：", "<hr>妖友观点：");

                    // 回帖内容解析
                    let replies = [];

                    const pattern1 = /回帖内容：\s*((?:\d+\.\s*[^\n]+\n*)+)/;
                    const match1 = summary.match(pattern1);

                    if (match1) {
                        replies = match1[1].split(/\d+\./).filter(reply => reply.trim());
                    } else {
                        replies = summary.match(/回帖内容\d+：[^\n]+/g);
                        if (replies) {
                            replies = replies.map(reply => reply.replace(/回帖内容\d+：/, '').trim());
                        }
                    }

                    const summaryParts = summary.split(/回帖内容[：\d]/)[0].trim();
                    const subtitleElement = $('<div class="subtitle content welcome"></div>');
                    subtitleElement.html(summaryParts);
                    $('.Postinfo').after(subtitleElement);

                    // 显示回帖建议
                    if (replies && replies.length > 0) {
                        showReplySuggestions(replies);
                    }

                    button.prop('disabled', false).text('AI总结');
                } catch (error) {
                    console.error("解析AI响应失败：", error);
                    showErrorPopup("请求失败，请稍后再试。");
                    button.prop('disabled', false).text('AI总结');
                }
            },
            onerror: function(error) {
                console.error("请求失败：", error);
                showErrorPopup("网络请求失败，请检查您的网络连接。");
                button.prop('disabled', false).text('AI总结');
            }
        });
    }

    // 显示回帖建议
    function showReplySuggestions(replies) {
        // 首先移除旧的建议（如果存在）
        $('.reply-suggestions-container').remove();

        const replyContainer = $('<div class="content"></div>')
            .insertAfter('.kuaisuhuifu');

        replies.forEach(reply => {
            const replySpan = $('<div class="reply-suggestion"></div>')
                .css({
                    'padding': '1px 1px 1px 7px',
                    'margin': '5px 0',
                    'background-color': '#f5f5f5',
                    'border-radius': '4px',
                    'cursor': 'pointer',
                    'transition': 'background-color 0.2s'
                })
                .hover(
                    function() { $(this).css('background-color', '#e0e0e0'); },
                    function() { $(this).css('background-color', '#f5f5f5'); }
                )
                .text(reply.trim())
                .on('click', function() {
                    $('.retextarea').val($(this).text());
                })
                .appendTo(replyContainer);
        });
    }

    // 显示错误提示浮窗
    function showErrorPopup(message) {
        const popup = $('<div class="ai-error-popup"></div>')
            .css({
                'position': 'fixed',
                'top': '50%',
                'left': '50%',
                'transform': 'translate(-50%, -50%)',
                'background-color': 'rgba(255,0,0,0.7)',
                'color': 'white',
                'padding': '20px',
                'border-radius': '10px',
                'z-index': '10000'
            })
            .html(`<p>${message}</p><button class="ai-error-close-btn">X</button>`)
            .appendTo('body');

        popup.find('.ai-error-close-btn').on('click', function() {
            popup.remove();
        });
    }
})();