// ==UserScript==
// @name         雪球评论无限滚动
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  支持 JSON 和 HTML 的评论加载，实现雪球股票评论无限滚动
// @author       ChatGPT, improved by Grok
// @match        https://xueqiu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532668/%E9%9B%AA%E7%90%83%E8%AF%84%E8%AE%BA%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532668/%E9%9B%AA%E7%90%83%E8%AF%84%E8%AE%BA%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const containerSelector = '.status-list, .timeline__list';
    const scrollThreshold = 400; // px
    let isLoading = false;
    let noMoreData = false;
    let currentPage = 2;
    let symbol = window.location.pathname.split('/').pop();

    const getQueryParams = () => {
        const params = new URLSearchParams();
        params.set('count', '10');
        params.set('comment', '0');
        params.set('symbol', symbol);
        params.set('hl', '0');
        params.set('source', 'all');
        params.set('sort', 'time');
        params.set('page', currentPage.toString());
        params.set('q', '');
        params.set('type', '30');
        return params.toString();
    };

    const getRelativeTime = (timestamp) => {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diff = now - postTime;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}分钟前`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}小时前`;
        const days = Math.floor(hours / 24);
        return `${days}天前`;
    };

    const reinitializeEventListeners = ($elements) => {
        console.log('开始重新初始化事件监听器', $elements.length, '个元素');

        // 统一 MutationObserver
        const $container = $(containerSelector);
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    console.debug('MutationObserver: 检测到新增节点', mutation.addedNodes.length);
                    const $newNodes = $(mutation.addedNodes).filter('.timeline__item').add($(mutation.addedNodes).find('.timeline__item'));
                    if ($newNodes.length) {
                        console.log('重新绑定事件到', $newNodes.length, '个新节点');
                        bindDiscussButtonEvents($newNodes);
                        if (window.SNB && window.SNB.initTimeline) {
                            console.debug('调用 SNB.initTimeline');
                            window.SNB.initTimeline($newNodes);
                        }
                        if (window.SNB?.vue) {
                            console.debug('触发 Vue 更新');
                            window.SNB.vue.$nextTick(() => {
                                window.SNB.vue.$forceUpdate();
                            });
                        }
                    }
                }
            });
        });

        // 开始观察
        observer.observe($container[0], { childList: true, subtree: true });

        // 绑定讨论按钮事件
        bindDiscussButtonEvents($elements);

        // 触发 DOM 插入事件
        if (window.jQuery) {
            console.debug('触发 jQuery DOMNodeInserted');
            window.jQuery($elements).trigger('DOMNodeInserted');
        }

        // 停止观察（延迟避免过早断开）
        setTimeout(() => {
            observer.disconnect();
            console.debug('MutationObserver 已断开');
        }, 2000);
    };

    const bindDiscussButtonEvents = ($elements) => {
        const $discussButtons = $elements.find('.timeline__item__control').filter(function () {
            return $(this).find('.iconfont').text() === '';
        });
        console.log('找到讨论按钮', $discussButtons.length, '个');

        let isRequesting = false;

        $discussButtons.each(function () {
            const $this = $(this);
            const events = window.jQuery._data(this, 'events');
            console.log('检查绑定前事件:', $this[0].outerHTML, ':', events ? Object.keys(events) : '无');
        });

        $discussButtons.off('click.comment').on('click.comment', async function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            if (isRequesting) {
                console.log('请求进行中，跳过重复触发');
                return;
            }
            isRequesting = true;
            console.log('讨论按钮点击事件触发');

            const $button = $(this);
            const $item = $button.closest('.timeline__item');
            const statusId = $item.find('.date-and-source').data('id');
            const $commentDiv = $item.find('.timeline__item__comment');
            const username = $item.find('.user-name').text();

            console.log(`讨论按钮: statusId=${statusId}, username=${username}, login=${window.SNOWMAN_LOGIN}`);

            if (!window.SNOWMAN_LOGIN) {
                console.log('未登录，触发登录框');
                if (window.SNB?.vue) {
                    window.SNB.vue.$emit('modal-login', 1);
                }
                isRequesting = false;
                return;
            }

            const editorHtml = `
                <div class="lite-editor lite-editor--comment">
                    <img src="${window.SNB?.currentUser?.profile_image_url || '//xavatar.imedao.com/default.jpg'}!240x240.jpg" class="avatar">
                    <div class="lite-editor__bd">
                        <div class="fake-placeholder">回复@${username}</div>
                    </div>
                </div>`;
            $commentDiv.html(editorHtml);
            $button.addClass('editor-active');

            try {
                const url = `https://xueqiu.com/statuses/v3/comments.json?id=${statusId}&type=4&size=20&max_id=-1`;
                console.log(`请求评论: ${url}`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 添加延迟，模拟用户行为
                const response = await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': window.location.href,
                        'User-Agent': navigator.userAgent
                    },
                    body: JSON.stringify({})
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('评论数据:', data);

                if (data.comments && data.comments.length > 0) {
                    const commentsHtml = `
                        <div class="comment__wrap" index="1">
                            <div class="comment__container">
                                <div class="comment__mod comment__mod--all">
                                    <h3>全部讨论（${data.status_reply_count || data.comments.length}）</h3>
                                    <div class="comment__list">
                                        ${data.comments.map(comment => `
                                            <div data-index="0" data-id="${comment.id}" class="comment__item">
                                                <a href="/${comment.user.id}" class="avatar">
                                                    <img src="https://xavatar.imedao.com/${comment.user.profile_image_url.split(',')[0]}!240x240.jpg">
                                                </a>
                                                <div class="comment__item__main">
                                                    <div class="comment__item__main__hd">
                                                        <a href="/${comment.user.id}" class="user-name">${comment.user.screen_name}</a>
                                                        <span class="time">${comment.timeBefore}${comment.ip_location ? ' · ' + comment.ip_location : ''}</span>
                                                    </div>
                                                    <p>${comment.text}</p>
                                                    ${comment.child_comments && comment.child_comments.length > 0 ? `
                                                        <blockquote class="comment__item__reply">
                                                            ${comment.child_comments.map(reply => `
                                                                <div data-id="${reply.id}" class="items">
                                                                    <a href="/${reply.user.id}" class="user-name">${reply.user.screen_name}</a>
                                                                    <span>：</span>
                                                                    <div class="content">${reply.text}</div>
                                                                </div>
                                                            `).join('')}
                                                        </blockquote>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>`;
                    $commentDiv.append(commentsHtml);
                } else {
                    $commentDiv.append('<div class="comment__wrap"><p>暂无评论</p></div>');
                }
            } catch (error) {
                console.error('加载评论失败:', error);
                $commentDiv.append('<div class="comment__wrap"><p>加载评论失败，请稍后重试</p></div>');
            } finally {
                isRequesting = false;
            }

            if (window.SNB?.vue) {
                console.debug('触发 Vue click-comment 事件');
                window.SNB.vue.$emit('click-comment', { statusId, $el: $button });
            }
        });

        $discussButtons.each(function () {
            const $this = $(this);
            const events = window.jQuery._data(this, 'events');
            console.log('讨论按钮事件绑定:', $this[0].outerHTML, ':', events ? Object.keys(events) : '无');
        });
    };

    const fetchAndRenderNextPage = async () => {
        if (isLoading || noMoreData) return;
        isLoading = true;
        console.log(`加载第 ${currentPage} 页`);

        const url = `https://xueqiu.com/query/v1/symbol/search/status.json?${getQueryParams()}`;
        console.log('API 请求:', url);

        try {
            const response = await fetch(url, {
                credentials: 'include',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`第 ${currentPage} 页收到 ${data.list?.length || 0} 条评论`);

            if (Array.isArray(data.list)) {
                const $container = $(containerSelector);
                const $newItems = $();

                data.list.forEach((item, index) => {
                    console.debug(`渲染评论 ID=${item.id}, reply_count=${item.reply_count}`);
                    const user = item.user || {};
                    const userId = user.id || user.profile?.split('/').pop() || 'unknown';
                    const retweet = item.retweeted_status;
                    let text = item.text || '';
                    const position = currentPage * 10 + $container.find('.timeline__item').length + index;
                    const analyticsData = JSON.stringify({
                        tab: 'all',
                        sub_tab: '新帖',
                        order: 'time',
                        position: position,
                        adv_type: 'normal',
                        click_area: 'time',
                        statusId: item.id
                    });

                    // 图片
                    let imageHtml = '';
                    let detailImageHtml = '';
                    const imageMatch = text.match(/<img[^>]+src=["'](.*?)["']/i);
                    if (imageMatch && !imageMatch[1].includes('emoji')) {
                        const imageUrl = imageMatch[1];
                        imageHtml = `
                            <div class="content__addition pic__thumb zoom__able pic__thumb--vertical image-tag__timeline--long">
                                <img src="${imageUrl}!800.jpg">
                            </div>`;
                        detailImageHtml = `<br><img class="ke_img" src="${imageUrl}!custom.jpg">`;
                        text = text.replace(/<img[^>]+>/i, '');
                    }

                    // 长文
                    let contentHtml = '';
                    const isLongText = text.length > 100 || (text.match(/<br>/g) || []).length > 1;
                    if (isLongText) {
                        let shortText = text;
                        const brIndex = text.indexOf('<br>');
                        if (brIndex > 0 && brIndex < 100) {
                            shortText = text.substring(0, brIndex) + '...';
                        } else if (text.length > 100) {
                            shortText = text.substring(0, 100) + '...';
                        }
                        contentHtml = `
                            <div class="content content--detail" style="display: none;">
                                <div>${text}${detailImageHtml}</div>
                            </div>
                            <div class="content content--description">
                                <div>${shortText}</div>
                                <a href="javascript:;" class="timeline__expand__control">展开<i class="iconfont"></i></a>
                            </div>`;
                    } else {
                        contentHtml = `
                            <div class="content content--description">
                                <div>${text}${detailImageHtml}</div>
                            </div>`;
                    }

                    // 转发
                    let retweetHtml = '';
                    if (retweet) {
                        const retweetUser = retweet.user || {};
                        const retweetUserId = retweetUser.id || retweetUser.profile?.split('/').pop() || 'unknown';
                        const retweetTime = new Date(retweet.created_at).toLocaleString('zh-CN', {
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                        });
                        retweetHtml = `
                            <blockquote class="timeline__item__forward">
                                <a href="/${retweetUserId}/${retweet.id}" target="_blank" data-id="${retweet.id}" class="fake-anchor"></a>
                                <div class="timeline__item__forward__hd">
                                    <a href="/${retweetUserId}" target="_blank" data-tooltip="${retweetUserId}" analytics-data='${analyticsData}' class="user-name-link">
                                        <span class="user-name">@${retweetUser.screen_name || '匿名用户'}</span><span>：</span>
                                    </a>
                                </div>
                                <div class="timeline__item__forward__content">
                                    <div class="content content--description">
                                        <div>${retweet.text || ''}</div>
                                    </div>
                                </div>
                                <div class="timeline__item__forward__ft">
                                    <span class="timestamp">${retweetTime}</span>
                                    ${retweet.reply_count > 0 ? `<a href="/${retweetUserId}/${retweet.id}#comment" target="_blank" class="replay-count"> · 讨论 ${retweet.reply_count}</a>` : ''}
                                </div>
                            </blockquote>`;
                    }

                    const html = `
<article class="timeline__item">
    <a href="/${userId}" target="_blank" data-tooltip="${userId}" analytics-data='${analyticsData}' class="avatar avatar-40">
        <img src="https://xavatar.imedao.com/${user.profile_image_url?.split(',')[0] || ''}!240x240.jpg">
    </a>
    <div class="timeline__item__top__right"></div>
    <div class="timeline__item__main">
        <a href="javascript:;" class="timeline__unfold__control" style="right: 0px; display: none;">收起<i class="iconfont"></i></a>
        <div class="timeline__item__info">
            <div>
                <a href="/${userId}" target="_blank" data-tooltip="${userId}" analytics-data='${analyticsData}' class="user-name">${user.screen_name || '匿名用户'}</a>
                <a href="/${userId}/${item.id}" target="_blank" data-id="${item.id}" data-analytics-page="1000" data-analytics="1021" data-analytics-data='${analyticsData}' class="date-and-source">${getRelativeTime(item.created_at)}<span class="source">· 来自${item.source || 'web'}</span></a>
            </div>
        </div>
        <div class="timeline__item__bd">
            <div class="timeline__item__content">
                ${contentHtml}
            </div>
            ${imageHtml}
            ${retweetHtml}
        </div>
        <div class="timeline__item__ft timeline__item__ft--other">
            <a href="javascript:;" class="timeline__item__control"><i class="iconfont"></i><span>转发</span></a>
            <a href="javascript:;" class="timeline__item__control"><i class="iconfont"></i><span>${item.reply_count > 0 ? item.reply_count : '讨论'}</span></a>
            <a href="javascript:;" class="timeline__item__control"><i class="iconfont"></i><span>${item.like_count > 0 ? item.like_count : '赞'}</span></a>
            <a href="javascript:;" class="timeline__item__control item__min"><i class="iconfont"></i><span>收藏</span></a>
            <div style="position: relative; height: 21px;">
                <a href="javascript:;" class="timeline__item__control item__min timeline__item__control--control"><i class="iconfont"></i><span>投诉</span></a>
            </div>
        </div>
    </div>
    <div class="timeline__item__forward__editor"></div>
    <div class="timeline__item__comment"></div>
</article>`;
                    const $item = $(html);
                    $newItems.push($item[0]);
                    $container.append($item);
                });

                reinitializeEventListeners($newItems);

                if (data.list.length === 0) {
                    noMoreData = true;
                    console.log('无更多数据，停止加载');
                } else {
                    currentPage++;
                    console.log(`前进到第 ${currentPage} 页`);
                }

                isLoading = false;
                return;
            }

            // HTML 回退
            if (data.html) {
                const $html = $('<div>').append($.parseHTML(data.html));
                let $items = $html.find('.status-list article.timeline__item');
                if ($items.length === 0) {
                    $items = $html.find('article.timeline__item');
                }
                if ($items.length === 0) {
                    noMoreData = true;
                    console.log('HTML 回退无更多数据，停止加载');
                    isLoading = false;
                    return;
                }

                $items.each(function () {
                    const $this = $(this);
                    $this.find('.avatar img').css({ width: '40px', height: '40px', borderRadius: '50%' });
                    $this.find('.user-name').css({ color: '#333', textDecoration: 'none' });
                    $this.find('.content--description').css({ fontSize: '14px', color: '#666' });
                    $this.find('.content--detail').css({ fontSize: '14px', color: '#666' });
                    $this.find('.date-and-source').css({ fontSize: '12px', color: '#999' });
                    $this.find('.timeline__item__forward').css({ fontSize: '14px', color: '#999', marginTop: '10px' });
                    $this.find('.timeline__item__forward__content').css({
                        fontSize: '14px',
                        color: '#999',
                        marginTop: '10px'
                    });
                    $this.find('.timeline__item__forward__ft').css({
                        fontSize: '12px',
                        color: '#999'
                    });
                });

                $items.appendTo($(containerSelector));
                reinitializeEventListeners($items);
                currentPage++;
                console.log(`HTML 回退前进到第 ${currentPage} 页`);
                isLoading = false;
            }

        } catch (error) {
            console.error('加载评论出错:', error);
            isLoading = false;
        }
    };

    // 防抖
    let lastScrollTime = 0;
    const scrollDebounce = 200;
    const scrollHandler = () => {
        if (noMoreData) return;
        const now = Date.now();
        if (now - lastScrollTime < scrollDebounce) return;
        lastScrollTime = now;

        const scrollTop = window.scrollY;
        const scrollHeight = document.body.scrollHeight;
        const clientHeight = window.innerHeight;

        if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
            console.log(` scolling trigger，try to load page ${currentPage}`);
            fetchAndRenderNextPage();
        }
    };

    const init = () => {
        window.addEventListener('scroll', scrollHandler);
        // 初始化现有按钮的事件
        const $existingItems = $(containerSelector).find('.timeline__item');
        if ($existingItems.length) {
            console.log('初始化现有评论项', $existingItems.length, '个');
            reinitializeEventListeners($existingItems);
        }
    };

    const waitForContainer = () => {
        const container = document.querySelector(containerSelector);
        if (container) {
            console.log('找到容器，初始化滚动处理器');
            init();
        } else {
            setTimeout(waitForContainer, 500);
        }
    };

    waitForContainer();
})();