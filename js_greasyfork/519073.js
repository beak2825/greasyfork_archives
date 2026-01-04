// ==UserScript==
// @name         B站动态简化
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  更改指定网站的样式
// @author       vk
// @match        https://t.bilibili.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519073/B%E7%AB%99%E5%8A%A8%E6%80%81%E7%AE%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/519073/B%E7%AB%99%E5%8A%A8%E6%80%81%E7%AE%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .read-marker {
            position: absolute;
            bottom: 0px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            height:100%;
        }
        .read-marker:hover {
            background: #0091c2;
        }
        .dynamic-read {
            height: 20px;
            overflow-y: clip;
        }
        .dynamic-read::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.5);
            pointer-events: none;
        }
        .dynamic-read .bili-dyn-item__avatar {
            top: 0px !important;
            width: 20px !important;
            height: 20px !important;
        }
        .dynamic-read .bili-dyn-avatar {
            width: 20px !important;
            height: 20px !important;
        }
        .dynamic-read .b-avatar {
            width: 20px !important;
            height: 20px !important;
        }
        .dynamic-read .bili-dyn-title {
            flex-wrap: wrap;
        }
        .dynamic-read * {
            margin-top: 0px !important;
            padding-top: 0px !important;
        }

        button .dynamic-read::after {
            background: #afd3f6;
        }
    `);

    // 获取已读状态
    const readPosts = JSON.parse(localStorage.getItem('bilibili-read-posts') || '{}');

    // 添加标记按钮
    function addMarkButton(post) {
            console.info(post)

            if (post.querySelector('.read-marker')) return;
            let major = post.querySelector('.bili-dyn-card-video')
            if (!major){major = post.querySelector('.dyn-card-opus')}
            if (!major){major = post.querySelector('.bili-dyn-card-live')}
            if (!major){major = post.querySelector('.dyn-blocked-mask')}
            if (!major){major = post.querySelector('.dyn-blocked-mask__content')}

            if (!major) return;
            let postId = major.getAttribute('dyn-id');
            if (!postId) {
               postId = major.children[0].getAttribute('data-url')
            }
            if (!postId) {
               postId = major.getAttribute('href')
            }
            console.info(major)
            console.info(postId)

            if (!postId) return;

            const button = document.createElement('button');
            button.className = 'read-marker';
            button.textContent = readPosts[postId] ? '标记为未读' : '标记为已读';
            button.style.background = readPosts[postId] ? 'rgba(255, 255, 255, 0.7)' : 'rgb(0, 156, 255)';
            button.style.left = '-80px';
            button.style.width = '80px';

            button.addEventListener('click', () => {
                if (readPosts[postId]) {
                    delete readPosts[postId];
                    post.classList.remove('dynamic-read');
                    button_read.style.background = 'rgb(255, 156, 0)';
                    button.style.background = 'rgb(0, 156, 255)';
                    button.textContent = '标记为已读';
                } else {
                    post.classList.add('dynamic-read');
                    button_read.style.background = 'rgba(255, 255, 255, 0.4)'
                    button.style.background = 'rgba(255, 255, 255, 0.4)'
                    button.textContent = '标记为未读';
                    readPosts[postId] = true;

                }
                localStorage.setItem('bilibili-read-posts', JSON.stringify(readPosts));
            });
            let title_a = post.querySelector('.bili-dyn-content__orig__major a');
            if (title_a) {
                console.log(title_a);
                const originalHref = title_a.href; // 替换为你想打开的链接

                // 为链接绑定点击事件
                title_a.addEventListener('click', function (event) {
                    // 阻止默认行为（可选）
                    //event.preventDefault();
                    if (readPosts[postId]) {
                        delete readPosts[postId];
                        post.classList.remove('dynamic-read');
                        button_read.style.background = 'rgb(255, 156, 0)';
                        button.style.background = 'rgb(0, 156, 255)';
                        button.textContent = '标记为已读';
                    } else {
                        post.classList.add('dynamic-read');
                        button_read.style.background = 'rgba(255, 255, 255, 0.4)'
                        button.style.background = 'rgba(255, 255, 255, 0.4)'
                        button.textContent = '标记为未读';
                        readPosts[postId] = true;
                    }
                    localStorage.setItem('bilibili-read-posts', JSON.stringify(readPosts));
                    // 自定义功能：例如记录日志或弹出提示
                    console.log(`原链接地址: ${originalHref}`);
                    //alert(`你即将访问: ${originalHref}`);

                    // 执行原始跳转（如果需要）
                    //window.location.href = originalHref;
                });
            };

            const button_read = document.createElement('button');
            button_read.className = 'read-marker';
            button_read.textContent = '观看'
            button_read.style.background = readPosts[postId] ? 'rgba(255, 255, 255, 0.7)' : 'rgb(255, 156, 0)';
            button_read.style.left = '-60px';
            button_read.style.width = '60px';

            button_read.addEventListener('click', () => {
                if (readPosts[postId]) {
                    delete readPosts[postId];
                    post.classList.remove('dynamic-read');
                    button_read.style.background = 'rgb(255, 156, 0)';
                    button.style.background = 'rgb(0, 156, 255)';
                    button.textContent = '标记为已读';
                } else {
                    post.classList.add('dynamic-read');
                    button_read.style.background = 'rgba(255, 255, 255, 0.4)'
                    button.style.background = 'rgba(255, 255, 255, 0.4)'
                    button.textContent = '标记为未读';
                    readPosts[postId] = true;
                }
                localStorage.setItem('bilibili-read-posts', JSON.stringify(readPosts));
                let title_a = post.querySelector('.bili-dyn-content__orig__major a')
                const url = title_a.href; // 替换为你想打开的链接
                window.open(url, '_blank'); // 在新标签页打开链接
            });

            if (readPosts[postId]) {
                console.log(postId)
                post.classList.add('dynamic-read');
            }

            post.style.position = 'relative';
            post.appendChild(button);
            // post.appendChild(button_read);

    }

    // 处理新加载的动态
    function processNewPosts(mutations) {
        mutations.forEach(mutation => {
            // console.log(mutation)
            mutation.addedNodes.forEach(node => {
                // console.log(222222, node)
                // 检查是否是动态元素
                if (node.nodeType === 1) { // 元素节点
                    // 直接检查当前节点
                    if (node.classList && node.classList.contains('bili-dyn-item')) {
                        addMarkButton(node);
                    }
                    // 检查子节点
                    const posts = node.querySelectorAll('.bili-dyn-item');
                    posts.forEach(post => addMarkButton(post));
                }
            });
        });
    }

    // 初始化已有的动态
    function initializeExistingPosts() {
        const posts = document.querySelectorAll('.bili-dyn-item');
        console.log(111111, posts)
        posts.forEach(post => addMarkButton(post));
    }

    // 创建观察器
    const observer = new MutationObserver(processNewPosts);

    // 开始观察
    function startObserving() {
        // 找到动态列表的容器
        const container = document.querySelector('.bili-dyn-list__items');
        if (container) {
            observer.observe(container, {
                childList: true, // 观察子节点的添加或删除
                subtree: true    // 观察所有后代节点
            });
            initializeExistingPosts();
        } else {
            // 如果容器还没加载，等待后重试
            setTimeout(startObserving, 1000);
        }
    }

    // 启动观察
    startObserving();

    // 在页面卸载时断开观察器
    window.addEventListener('unload', () => {
        observer.disconnect();
    });


    // 插入自定义样式
    const style = document.createElement('style');
    style.innerHTML = `
        /* 在这里添加你的 CSS 规则 */
/* 主体 */
main {
    margin: 0 8px;
    width: 1032px !important;
}

/* 每条 */
.bili-dyn-item__main{
    display: inline-flex !important;
}
/* x分钟前 */
.bili-dyn-item__desc {
    display: contents;
}

/* 点赞 */
.bili-dyn-item__footer {
    display: block !important;
    height: 48px !important;
}

/* 名字 */
.bili-dyn-item__header {
    width: 100px !important;
    min-width: 100px !important;
}
.bili-dyn-title {
    width: inherit !important;
}

/* 主体 */
.bili-dyn-content {
    width: 800px !important;
}
.bili-dyn-content__orig__major {
    width: 800px !important;
}

/* 主体大图 */
.bili-album__preview__picture {
    position: relative !important;
    width: unset !important;
    height: unset !important;
    max-width: 320px !important;
    max-height: 320px !important;
}
.b-img__inner img {
    display: block;
    width:unset !important;
    heightunset !important;
    object-fit: inherit;
    max-height: 150px;
    max-width: 100%;
}
.bili-dyn-card-video {
   height: 100% !important;
}

.bili-dyn-item, .bili-dyn-item div {
   box-sizing: unset !important;
   display: flow-root;
}

/* 标签 */
.bili-dyn-content__orig__topic {
    display: none !important;
}
.bili-dyn-content__forw__topic{
    display: none !important;
}

/*
// // 文本
// .bili-rich-text__content.line--6 {
//     -webkit-line-clamp: 6;
//     max-height: 132px;
//     line-height: 70%;
// }
*/

/* 九宫图 */
.bili-album__preview.grid9 {
   	display: flex !important;
    flex-wrap: nowrap !important;
}
.bili-album__preview.grid8 {
    display: flex !important;
    flex-wrap: nowrap !important;
}
.bili-album__preview.grid7 {
    display: flex !important;
    flex-wrap: nowrap !important;
}
.bili-album__preview.grid6 {
    display: flex !important;
    flex-wrap: nowrap !important;
}
.bili-album__preview.grid5 {
    display: flex !important;
    flex-wrap: nowrap !important;
}
.bili-album__preview.grid4 {
    display: flex !important;
    flex-wrap: nowrap !important;
}
.bili-album__preview.grid3 {
    display: flex !important;
    flex-wrap: nowrap !important;
}

/* 左侧悬浮窗 */
aside.left {
    margin-right: 100px;
}
    `;
    document.head.appendChild(style);
})();