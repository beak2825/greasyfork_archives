// ==UserScript==
// @name         Lofter 网页版显示划线评论
// @license      GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 Lofter 网页版显示划线评论
// @author       SrakhiuMeow
// @match        *://*.lofter.com/post*
// @match        *://*.lofter.com/comment*
// @grant        none
// @require      https://unpkg.com/ajax-hook@3.0/dist/ajaxhook.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530884/Lofter%20%E7%BD%91%E9%A1%B5%E7%89%88%E6%98%BE%E7%A4%BA%E5%88%92%E7%BA%BF%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/530884/Lofter%20%E7%BD%91%E9%A1%B5%E7%89%88%E6%98%BE%E7%A4%BA%E5%88%92%E7%BA%BF%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 共用变量
    let comments = [];
    let resp = null;

    // 解析评论数据
    function parse(data) {
        const lines = data.trim().split('\n');
        const result = [];
        const lastLine = lines.pop();
        // console.log("lastLine", lastLine);

        if (lastLine === 'null') {
            return null;
        }
        const validIndex = lastLine.match(/\[(.*?)\]/g)[0].slice(1, -1).split(',');

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        iframe.contentWindow.eval(lines.join('\n'));

        for (const idx of validIndex) {
            result.push(iframe.contentWindow[idx]);
        }

        return result;
    }

    // 显示评论
    // 暂未实现显示回复评论的评论
    function displayComments(comments) {
        for (const comment of comments) {
            if ('pid' in comment && comment.pid !== 'null') {
                // console.log(comment);
                if (comment.pid === null) {
                    continue;
                }
                else if ('pid' in comment) {
                    const pElement = document.getElementById(comment.pid);
                    let button = document.getElementById(comment.pid + 'button');
                    
                    if (button === null) {
                        // 创建新评论显示区域
                        button = document.createElement('button');
                        button.textContent = '1';
                        button.id = comment.pid + 'button';
                        pElement.appendChild(button);

                        const div = document.createElement('div');
                        const ol = document.createElement('ol');
                        ol.className = 'notes';
                        ol.id = comment.pid + 'ol';
                        div.appendChild(ol);

                        const li = document.createElement('li');
                        li.className = 'note like';
                        li.innerHTML = `
                            <span class="action">
                                <a href="${comment.publisherMainBlogInfo.homePageUrl}" title="${comment.publisherMainBlogInfo.blogNickName}"><img class="avatar" src="${comment.publisherMainBlogInfo.bigAvaImg}?imageView&thumbnail=16y16"></a>&nbsp;
                                <a href="${comment.publisherMainBlogInfo.homePageUrl}" title="${comment.publisherMainBlogInfo.blogNickName}">${comment.publisherMainBlogInfo.blogNickName} </a> : ${comment.content}
                            </span><div class="clear"></div>
                        `;
                        ol.appendChild(li);

                        div.id = comment.pid + 'comment';
                        div.style.display = 'none';
                        div.style.border = '1px solid #000';
                        pElement.appendChild(div);

                        button.addEventListener('click', () => {
                            const div = document.getElementById(comment.pid + 'comment');
                            div.style.display = div.style.display === 'none' ? 'block' : 'none';
                        });

                    } else {
                        // 已有评论区域，追加新评论
                        button.textContent = parseInt(button.textContent) + 1;
                        const ol = document.getElementById(comment.pid + 'ol');
                        const li = document.createElement('li');
                        li.className = 'note like';
                        li.innerHTML = `
                            <span class="action">
                                <a href="${comment.publisherMainBlogInfo.homePageUrl}" title="${comment.publisherMainBlogInfo.blogNickName}"><img class="avatar" src="${comment.publisherMainBlogInfo.bigAvaImg}?imageView&thumbnail=16y16"></a>&nbsp;
                                <a href="${comment.publisherMainBlogInfo.homePageUrl}" title="${comment.publisherMainBlogInfo.blogNickName}">${comment.publisherMainBlogInfo.blogNickName} </a> : ${comment.content}
                            </span><div class="clear"></div>
                        `;
                        ol.appendChild(li);
                    }
                }
            }
        }
    }

    // 拦截 XMLHttpRequest (用于评论页面)
    function setupAjaxHook() {
        ah.proxy({
            onRequest: (config, handler) => {
                handler.next(config);
            },
            onError: (err, handler) => {
                handler.next(err);
            },
            onResponse: (response, handler) => {
                if (response.config.url.includes('https://www.lofter.com/dwr/call/plaincall/PostBean.getPostResponses.dwr')) {
                    resp = response.response;
                    // 检测到评论数据后立即发送
                    window.parent.postMessage({ 
                        type: 'updateContent', 
                        data: JSON.stringify(resp) 
                    }, '*');
                }
                handler.next(response);
            }
        });
    }

    // 主逻辑
    if (window.location.pathname.includes('/comment')) {
        // 评论页面逻辑
        setupAjaxHook();
    } else if (window.location.pathname.includes('/post')) {
        // 文章页面逻辑
        window.addEventListener('message', (event) => {
            if (event.data.type === 'updateContent') {
                // console.log('接收到消息:', event.data.data);
                const resp = JSON.parse(event.data.data);
                comments = parse(resp);
                if (comments) {
                    displayComments(comments);
                }
            }
        });
    }
})();