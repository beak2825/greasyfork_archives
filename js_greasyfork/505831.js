// ==UserScript==
// @name         洛谷犇犇 Better
// @namespace    http://tampermonkey.net/
// @version      4.5.1.4
// @description  增加洛谷犇犇回复 Markdown，防止错误 @，优化删除行为，增加 Sweetalert（请先开启学术模式，不影响正常使用）
// @author       nr0728 & _s_z_y_
// @match        https://www.luogu.com.cn/*
// @license      MIT
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.all.min.js
// @downloadURL https://update.greasyfork.org/scripts/505831/%E6%B4%9B%E8%B0%B7%E7%8A%87%E7%8A%87%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/505831/%E6%B4%9B%E8%B0%B7%E7%8A%87%E7%8A%87%20Better.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!localStorage.getItem('hasShownNotice')) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = '#fff';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        modal.style.zIndex = '10000';
        modal.style.width = '800px';
        modal.style.textAlign = 'left';
        modal.style.borderRadius = '10px';

        const title = document.createElement('h3');
        title.textContent = '欢迎使用洛谷犇犇 Better！';
        modal.appendChild(title);

        const message = document.createElement('div');
        message.innerHTML = '<p>看起来您像是第一次使用本脚本，以下是使用的注意事项。</p><p><ol><li>为保证脚本正常运行，请前往个人设置开启学术模式，否则会有两个犇犇区域，且一条犇犇会被发两遍。</li><li>如有 bug，请前往 Greasyfork 页面汇报。</li><li>本脚本遵循 MIT 协议。</li></ol></p><p>祝您使用愉快！</p>';
        modal.appendChild(message);

        const closeButton = document.createElement('button');
        closeButton.textContent = '我已知晓';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '5px 15px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#007BFF';
        closeButton.style.color = '#fff';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';

        closeButton.addEventListener('click', function() {
            document.body.removeChild(modal);
            localStorage.setItem('hasShownNotice', 'true');
        });

        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }
    if (window.location.href === 'https://www.luogu.com.cn/') {
        let targetDiv = document.querySelector('.am-u-lg-9.am-u-md-8.lg-index-benben.lg-right');
        if (targetDiv) {
            let newDiv = document.createElement('div');
            newDiv.className = 'lg-article';
            newDiv.innerHTML = `
            <h2>有什么新鲜事告诉大家</h2>
            <div class="am-form-group am-form">
                <textarea rows="3" id="feed-content"></textarea>
            </div>
            <button class="am-btn am-btn-danger am-btn-sm" id="feed-submit">　发射犇犇！　</button>
        `;
            targetDiv.appendChild(newDiv);
            let navDiv = document.createElement('div');
            navDiv.className = 'lg-article';
            navDiv.innerHTML = `
            <ul class="am-nav am-nav-pills am-nav-justify" id="home-center-nav">
                <li class="feed-selector am-active" data-mode="watching"><a style="cursor: pointer">我关注的</a></li>
                <li class="feed-selector" data-mode="my"><a style="cursor: pointer">我发布的</a></li>
            </ul>
        `;
            targetDiv.appendChild(navDiv);
            let feedList = document.createElement('ul');
            feedList.className = 'am-comments-list am-comments-list-flip';
            feedList.id = 'feed';
            targetDiv.appendChild(feedList);

            document.getElementById('feed-submit').addEventListener('click', function() {
                let content = document.getElementById('feed-content').value;

                $.ajax({
                    type: "POST",
                    url: 'https://www.luogu.com.cn/api/feed/postBenben',
                    data: {
                        content: content
                    },
                    success: function(response) {
                        Sweetalert2.fire({
                            icon: 'success',
                            title: '发送成功',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true
                        });
                        document.getElementById('feed-content').value = '';
                    },
                    error: function(error) {
                        Sweetalert2.fire({
                            icon: 'error',
                            title: '发送失败，请稍后再试！',
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true
                        });
                    }
                });
            });

            let currentPage = 1;
            let stopLoadingMore = false;

            document.querySelectorAll('.feed-selector').forEach(function(elem) {
                elem.addEventListener('click', function() {
                    let mode = this.getAttribute('data-mode');
                    currentPage = 1;
                    stopLoadingMore = false;
                    let url = mode === 'watching'
                    ? `https://www.luogu.com.cn/feed/watching?page=${currentPage}`
                    : `https://www.luogu.com.cn/feed/my?page=${currentPage}`;

                    document.querySelectorAll('.feed-selector').forEach(function(item) {
                        item.classList.remove('am-active');
                    });
                    this.classList.add('am-active');

                    loadFeedContent(url, true);
                });
            });
            document.querySelector('.feed-selector[data-mode="watching"]').click();
            function loadFeedContent(url, isNewLoad) {
                fetch(url)
                    .then(response => response.text())
                    .then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let content = doc.querySelector('body').innerHTML;

                    if (isNewLoad) {
                        feedList.innerHTML = content;
                    } else {
                        feedList.innerHTML += content;
                    }
                    if (content.includes('<h2>没有更多动态了</h2>')) {
                        stopLoadingMore = true;
                    }
                    let oldMore = document.getElementById('feed-more');
                    if (oldMore) {
                        oldMore.remove();
                    }
                    if (!stopLoadingMore) {
                        addLoadMoreButton(url);
                    }
                    bindFeedButtons();
                })
                    .catch(error => console.error('Error loading feed:', error));
            }
            function bindFeedButtons() {
                document.querySelectorAll('a[name="feed-delete"]').forEach(function(deleteButton) {
                    deleteButton.addEventListener('click', function() {
                        let feedId = this.getAttribute('data-feed-id');
                        $.post(`/api/feed/delete/${feedId}`, function(response) {
                            Sweetalert2.fire({
                                icon: 'success',
                                title: '删除成功',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true
                            });
                            deleteButton.closest('.am-comment').remove();
                        }).fail(function() {
                            Sweetalert2.fire({
                                icon: 'error',
                                title: '删除失败，请稍后再试！',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 1500,
                                timerProgressBar: true
                            });
                        });
                    });
                });

                document.querySelectorAll('a[name="feed-reply"]').forEach(function(replyButton) {
                    replyButton.addEventListener('click', function() {
                        let commentElement = this.closest('.am-comment').querySelector('.feed-comment');
                        let headerElement = this.closest('.am-comment').querySelector('.am-comment-meta .feed-username a');
                        let username = headerElement ? headerElement.textContent.trim() : 'unknown';
                        let rawHTML = commentElement.innerHTML;
                        let markdown = convertHtmlToMarkdown(rawHTML);
                        let textarea = document.getElementById('feed-content');
                        textarea.value = ` || @${username} : ${markdown}`;
                    });
                });
            }
            function addLoadMoreButton(baseUrl) {
                let moreDiv = document.createElement('div');
                moreDiv.className = 'lg-article am-text-center';
                moreDiv.id = 'feed-more';
                moreDiv.innerHTML = `<a>点击查看更多...</a>`;
                targetDiv.appendChild(moreDiv);

                moreDiv.addEventListener('click', function() {
                    currentPage++;
                    let nextUrl = baseUrl.replace(/page=\d+/, `page=${currentPage}`);
                    loadFeedContent(nextUrl, false);
                });
            }
            function convertHtmlToMarkdown(html) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let traverseNode = function(node) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        return node.textContent;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        switch (node.tagName.toLowerCase()) {
                            case 'strong': {
                                return `__${Array.from(node.childNodes).map(traverseNode).join('')}__`;
                            }
                            case 'em': {
                                return `_${Array.from(node.childNodes).map(traverseNode).join('')}_`;
                            }
                            case 'del': {
                                return `~~${Array.from(node.childNodes).map(traverseNode).join('')}~~`;
                            }
                            case 'a': {
                                let href = node.getAttribute('href');
                                let text = Array.from(node.childNodes).map(traverseNode).join('');
                                if (node.previousSibling && node.previousSibling.nodeType === Node.TEXT_NODE && node.previousSibling.textContent.endsWith('@')) {
                                    return text;
                                }
                                if (text === href) {
                                    return `<${href}>`;
                                }
                                return `[${text}](${href})`;
                            }
                            case 'code': {
                                if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
                                    return Array.from(node.childNodes).map(traverseNode).join('');
                                }
                                return `\`${Array.from(node.childNodes).map(traverseNode).join('')}\``;
                            }
                            case 'pre': {
                                let codeContent = Array.from(node.childNodes).map(traverseNode).join('');
                                return `\n\`\`\`\n${codeContent}\n\`\`\``;
                            }
                            case 'h1': {
                                return `\n# ${Array.from(node.childNodes).map(traverseNode).join('')}\n`;
                            }
                            case 'h2': {
                                return `\n## ${Array.from(node.childNodes).map(traverseNode).join('')}\n`;
                            }
                            case 'h3': {
                                return `\n### ${Array.from(node.childNodes).map(traverseNode).join('')}\n`;
                            }
                            case 'h4': {
                                return `\n#### ${Array.from(node.childNodes).map(traverseNode).join('')}\n`;
                            }
                            case 'h5': {
                                return `\n##### ${Array.from(node.childNodes).map(traverseNode).join('')}\n`;
                            }
                            case 'h6': {
                                return `\n###### ${Array.from(node.childNodes).map(traverseNode).join('')}\n`;
                            }
                            case 'hr': {
                                return `---`;
                            }
                            case 'ul': {
                                return `${Array.from(node.childNodes).map(traverseNode).join('').trim()}`;
                            }
                            case 'ol': {
                                return `${Array.from(node.childNodes).map(traverseNode).join('').trim()}`;
                            }
                            case 'li': {
                                if (node.parentElement.tagName.toLowerCase() === 'ol') {
                                    let index = Array.from(node.parentElement.children).indexOf(node) + 1;
                                    return `${index}. ${Array.from(node.childNodes).map(traverseNode).join('').trim()}`;
                                } else {
                                    return `- ${Array.from(node.childNodes).map(traverseNode).join('').trim()}`;
                                }
                            }
                            case 'quote': {
                                let quoteContent = Array.from(node.childNodes).map(traverseNode).join('').trim();
                                return `\n> ${quoteContent.trim().replace(/\n/g, '\n> ')}\n`;
                            }
                            case 'blockquote': {
                                let blockquoteContent = Array.from(node.childNodes).map(traverseNode).join('').trim();
                                return `\n> ${blockquoteContent.trim().replace(/\n/g, '\n> ')}\n`;
                            }
                            case 'p': {
                                return `${Array.from(node.childNodes).map(traverseNode).join('').trim()}\n`;
                            }
                            case 'br': {
                                return `\n`;
                            }
                            case 'img': {
                                let src = node.getAttribute('src');
                                let alt = node.getAttribute('alt') || '';
                                return `![${alt}](${src})`;
                            }
                            default: {
                                return Array.from(node.childNodes).map(traverseNode).join('');
                            }
                        }
                    }
                    return '';
                };
                return '\n' + Array.from(doc.body.childNodes).map(traverseNode).join('') + '\n';
            }
        }
    }
    if (window.location.href.includes("discuss")) {
        const urlParams = new URLSearchParams(window.location.search);
        const forum = urlParams.get('forum');
        setInterval(function() {
            const urlParams = new URLSearchParams(window.location.search);
            let sectionDiv = document.querySelector('div.section');
            const forum = urlParams.get('forum');
            let targetElement = sectionDiv.querySelector('div.row-item');

            if (sectionDiv && forum !== 'relevantaffairs') {
                let existingLink = sectionDiv.querySelector('a[href="/discuss?forum=relevantaffairs"]');
                if (!existingLink) {
                    let newLink = document.createElement('a');
                    newLink.href = '/discuss?forum=relevantaffairs';
                    newLink.className = 'forum-container section-item row-item router-link-exact-active router-link-active color-default link';
                    newLink.title = '灌水区';
                    newLink.style = '--forum-color: #52c41a; color: var(--forum-color);';

                    newLink.innerHTML = `
                            <svg data-v-d6def288 aria-hidden="true" focusable="false" data-prefix="fas" data-icon="square" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="forum-icon svg-inline--fa fa-square">
                                <path fill="currentColor" d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"></path>
                            </svg>
                            <span data-v-d6def288 class="forum-name">灌水区</span>
                        `;

                    sectionDiv.insertBefore(newLink, targetElement);
                }
            }
        }, 100);
    }
})();