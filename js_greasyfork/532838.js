// ==UserScript==
// @name         雪球帖子无限滚动加载
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  雪球股票页面帖子无限滚动，仅处理动态加载的帖子，支持评论区切换、作者标签、编辑框居中、子回复对齐、图片点击展开
// @author       AI
// @match        https://xueqiu.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/532838/%E9%9B%AA%E7%90%83%E5%B8%96%E5%AD%90%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532838/%E9%9B%AA%E7%90%83%E5%B8%96%E5%AD%90%E6%97%A0%E9%99%90%E6%BB%9A%E5%8A%A8%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('jQuery loaded:', typeof window.jQuery !== 'undefined' ? window.jQuery.fn.jquery : 'not loaded');

    const CommentScroller = {
        containerSelector: '.status-list, .timeline__list',
        scrollThreshold: 200,
        isLoading: false,
        noMoreData: false,
        currentPage: 1,
        lastId: null,
        symbol: (() => {
            const path = window.location.pathname;
            const match = path.match(/\/([A-Z]{2}\d{6}|[A-Z]+)$/);
            return match ? match[1] : path.split('/').pop();
        })(),
        scrollDebounce: 200,
        lastScrollTime: 0,

        getQueryParams() {
            const params = {
                count: '10',
                comment: '0',
                symbol: this.symbol,
                hl: '0',
                source: 'all',
                sort: 'time',
                page: (this.currentPage + 1).toString(),
                q: '',
                type: '6',
                last_id: this.lastId || '330831505',
                md5__1038: 'iqUx2D9D0DBDcADlo=m2D=DRDIhEDR22oRiD'
            };
            return new URLSearchParams(params).toString();
        },

        getRelativeTime(timestamp) {
            const now = new Date();
            const postTime = new Date(timestamp);
            const diff = now - postTime;
            const minutes = Math.floor(diff / 60000);
            if (minutes < 60) return `${minutes}分钟前`;
            const hours = Math.floor(minutes / 60);
            if (hours < 24) return `${hours}小时前`;
            const days = Math.floor(hours / 24);
            return `${days}天前`;
        },

        initLastId() {
            try {
                const $lastItem = window.jQuery(this.containerSelector).find('.timeline__item').last();
                if ($lastItem.length) {
                    const $dateAndSource = $lastItem.find('.date-and-source');
                    this.lastId = $dateAndSource.data('id') || '';
                    return !!this.lastId;
                }
                this.lastId = '330831505';
                return true;
            } catch (error) {
                console.error('initLastId错误:', error);
                this.lastId = '330831505';
                return true;
            }
        },

        reinitializeEventListeners($elements) {
            try {
                const $container = window.jQuery(this.containerSelector);
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length) {
                            const $newNodes = window.jQuery(mutation.addedNodes).filter('.timeline__item').add(window.jQuery(mutation.addedNodes).find('.timeline__item'));
                            if ($newNodes.length && window.SNB && window.SNB.initTimeline) {
                                window.SNB.initTimeline($newNodes);
                            }
                            if (window.SNB?.vue) {
                                window.SNB.vue.$nextTick(() => {
                                    window.SNB.vue.$forceUpdate();
                                });
                            }
                        }
                    });
                });

                observer.observe($container[0], { childList: true, subtree: true });
                if (window.jQuery) {
                    window.jQuery($elements).trigger('DOMNodeInserted');
                }
                setTimeout(() => observer.disconnect(), 2000);
            } catch (error) {
                console.error('reinitializeEventListeners错误:', error);
            }
        },

        waitForSNB() {
            const profileImage = window.SNB?.currentUser?.profile_image_url;
            if (profileImage) {
                const firstImage = profileImage.split(',')[0];
                return firstImage.startsWith('http') ? firstImage : `community/20251/${firstImage}`;
            }
            return 'community/20251/1739676108918-1739676109079.png';
        },

        bindDiscussButtonEvents($items = null) {
            try {
                const style = document.createElement('style');
                style.textContent = `
                    .comment__item__reply .items {
                        margin-left: 0;
                        padding-left: 0;
                        display: flex;
                        align-items: flex-start;
                    }
                    .comment__item__reply .items .user-name {
                        margin-right: 5px;
                    }
                    .comment__item__reply .items .content {
                        flex: 1;
                    }
                    .lite-editor__textarea.expand {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        min-height: 32px;
                        height: auto;
                        padding: 4px 8px;
                        box-sizing: border-box;
                    }
                    .lite-editor__textarea .fake-placeholder {
                        line-height: 24px;
                        color: #999;
                    }
                    .lite-editor__textarea .medium-editor-element {
                        line-height: 24px;
                        min-height: 24px;
                        outline: none;
                        display: inline-block;
                        width: 100%;
                        vertical-align: middle;
                    }
                    .lite-editor__textarea .medium-editor-element:empty:not(:focus)::before {
                        content: attr(data-placeholder);
                        color: #999;
                        line-height: 24px;
                    }
                `;
                document.head.appendChild(style);

                const $container = window.jQuery(this.containerSelector);
                let $targets = $items ? $items : $container.find('.timeline__item[data-dynamic="true"]');

                if (!$targets.length && !$items) {
                    setTimeout(() => this.bindDiscussButtonEvents(), 500);
                    return;
                }

                const bindEvents = ($elements) => {
                    $elements.off('click.comment').on('click.comment', '.timeline__item__control:has(.iconfont)', async function(e) {
                        e.preventDefault();
                        e.stopImmediatePropagation();

                        const $button = window.jQuery(e.currentTarget);
                        if (!$button.length) return;

                        const $span = $button.find('span');
                        const spanText = $span.text().trim();
                        const $controls = $button.closest('.timeline__item__ft').find('.timeline__item__control');
                        const isSecondControl = $controls.length >= 2 && $controls.index($button) === 1;
                        const isCommentButton = ($span.length && (spanText === '讨论' || /^\d+$/.test(spanText))) || isSecondControl;

                        if (!isCommentButton) return;

                        const $item = $button.closest('.timeline__item');
                        if (!$item.length) return;

                        const $dateAndSource = $item.find('.date-and-source');
                        const $userName = $item.find('.timeline__item__info .user-name').first();
                        let statusId = $dateAndSource.data('id');
                        let username = $userName.text().replace(/\s*作者\s*/g, '').trim() || '未知用户';
                        if (!statusId) {
                            const $link = $dateAndSource.filter('a[data-id]');
                            statusId = $link.attr('data-id') || '未知ID';
                        }

                        let $commentDiv = $item.find('.timeline__item__comment');
                        if (!$commentDiv.length) {
                            $item.append('<div class="timeline__item__comment"></div>');
                            $commentDiv = $item.find('.timeline__item__comment');
                        }

                        const $commentContent = $commentDiv.find('.lite-editor, .comment__wrap');
                        const isCommentVisible = $commentContent.is(':visible');
                        const isCommentLoaded = $commentContent.length > 0;

                        if (isCommentVisible) {
                            $commentContent.hide();
                            $button.removeClass('editor-active');
                            return;
                        }

                        if (isCommentLoaded) {
                            $commentContent.show();
                            $button.addClass('editor-active');
                            return;
                        }

                        $commentDiv.empty();
                        const profileImage = this.waitForSNB();

                        const editorHtml = `
                            <div class="lite-editor lite-editor--comment">
                                <img src="https://xavatar.imedao.com/${profileImage}!240x240.jpg" class="avatar">
                                <div class="lite-editor__bd" style="display: flex; flex-direction: column; justify-content: center;">
                                    <span class="comment__img__delete"></span>
                                    <div class="lite-editor__textarea expand">
                                        <div class="fake-placeholder">回复@${username}</div>
                                        <div contenteditable="true" spellcheck="false" class="medium-editor-element" role="textbox" aria-multiline="true"></div>
                                        <div class="pay-mention__container" style="display: none;">
                                            <input type="text" placeholder="输入昵称进行提问" class="pay-mention__hd">
                                            <div class="pay-mention__bd"></div>
                                            <div class="pay-mention__ft">
                                                <a href="/ask/square">去问答广场看看 ></a>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="lite-editor__toolbar" style="display: none;">
                                        <div class="lite-editor__toolbar__edit">
                                            <div class="emoji__dropdown__parent">
                                                <a href="javascript:;" class="lite-editor__toolbar__btn"><i class="iconfont"></i></a>
                                                <div class="emoji__dropdown"></div>
                                            </div>
                                            <a href="javascript:;" class="lite-editor__toolbar__btn"><i class="iconfont"></i></a>
                                            <a href="javascript:;" class="lite-editor__toolbar__btn lite-editor__upload--comment--img last"><i class="iconfont"></i></a>
                                            <span class="lite-editor__toolbar__split"></span>
                                            <label class="lite-editor__toolbar__checkbox">
                                                <input type="checkbox">
                                                <span class="lite-editor__toolbar__tip__content">仅在正文下讨论</span>
                                                <a class="lite-editor__toolbar__tip__icon">
                                                    <img src="https://xqimg.imedao.com/18a444678641ba633fea68a0.png">
                                                </a>
                                                <div class="toolbar__tip">勾选框可设置讨论内容显示范围。讨论内容会自动生成帖子并在站内推荐，勾选「仅在正文下讨论」功能后，讨论内容将仅在当前帖子下讨论区可见。</div>
                                            </label>
                                        </div>
                                        <div class="lite-editor__toolbar__post">
                                            <span class="editor__uploading" style="display: none;"><i class="iconfont"></i>上传中...</span>
                                            <a href="javascript:;" class="lite-editor__cancle" style="display: none;">取消</a>
                                            <a href="javascript:;" class="lite-editor__submit button-gold">发布</a>
                                            <a href="javascript:;" class="lite-editor__submit disabled" style="display: none;">发布</a>
                                            <a href="javascript:;" class="lite-editor__submit award disabled" style="display: none;">支付并发布</a>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                        $commentDiv.html(editorHtml);
                        $button.addClass('editor-active');

                        const loadComments = async (maxId = -1, page = 1) => {
                            const md5Value = 'n4RxBD2GKiqhGODlxGr+Dy07Dk7G8/0Dmh4wBbD';
                            const encodedMd5 = encodeURIComponent(md5Value);
                            const url = `https://xueqiu.com/statuses/v3/comments.json?id=${statusId}&type=4&size=20&max_id=${maxId}&md5__1038=${encodedMd5}`;

                            let dynamicMd5 = null;
                            try {
                                dynamicMd5 = window.SNB?.md5__1038 ||
                                    document.querySelector('[data-md5__1038]')?.dataset.md5__1038 ||
                                    window.SNB?.config?.md5__1038;
                                if (dynamicMd5) {
                                    const dynamicUrl = `https://xueqiu.com/statuses/v3/comments.json?id=${statusId}&type=4&size=20&max_id=${maxId}&md5__1038=${encodeURIComponent(dynamicMd5)}`;
                                    const dynamicResponse = await fetch(dynamicUrl, {
                                        method: 'GET',
                                        credentials: 'include',
                                        headers: {
                                            'Accept': 'application/json',
                                            'X-Requested-With': 'XMLHttpRequest',
                                            'Referer': window.location.href,
                                            'User-Agent': navigator.userAgent
                                        }
                                    });
                                    if (dynamicResponse.ok) {
                                        const data = await dynamicResponse.json();
                                        console.log('Dynamic API response:', data);
                                        return data;
                                    }
                                }
                            } catch (error) {}

                            const response = await fetch(url, {
                                method: 'GET',
                                credentials: 'include',
                                headers: {
                                    'Accept': 'application/json',
                                    'X-Requested-With': 'XMLHttpRequest',
                                    'Referer': window.location.href,
                                    'User-Agent': navigator.userAgent
                                }
                            });

                            if (!response.ok) {
                                const noMd5Url = `https://xueqiu.com/statuses/v3/comments.json?id=${statusId}&type=4&size=20&max_id=${maxId}`;
                                const noMd5Response = await fetch(noMd5Url, {
                                    method: 'GET',
                                    credentials: 'include',
                                    headers: {
                                        'Accept': 'application/json',
                                        'X-Requested-With': 'XMLHttpRequest',
                                        'Referer': window.location.href,
                                        'User-Agent': navigator.userAgent
                                    }
                                });
                                if (noMd5Response.ok) {
                                    const noMd5Data = await noMd5Response.json();
                                    console.log('No MD5 API response:', noMd5Data);
                                    return noMd5Data;
                                }
                                throw new Error(`HTTP 错误！状态码: ${response.status}, 无 md5 状态: ${noMd5Response.status}`);
                            }

                            let data;
                            try {
                                data = await response.json();
                                console.log('API response:', data);
                            } catch (error) {
                                throw new Error('无法解析服务器响应');
                            }

                            let statusUserId = data.status_user_id;
                            if (!statusUserId) {
                                const $userLink = $item.find('.timeline__item__info .user-name').attr('href');
                                statusUserId = $userLink ? $userLink.split('/').pop() : null;
                                console.log('Fallback status_user_id from DOM:', statusUserId);
                            }

                            if (data.comments && data.comments.length > 0) {
                                const commentsHtml = `
                                    <div class="comment__wrap" index="${page}">
                                        <div class="comment__container">
                                            <div class="comment__mod comment__mod--all">
                                                <h3>全部讨论（${data.status_reply_count || data.comments.length}）</h3>
                                                <div class="comment__list">
                                                    ${data.comments.map(comment => `
                                                        <div data-index="0" data-id="${comment.id}" class="comment__item">
                                                            <a href="/${comment.user.id}" data-tooltip="${comment.user.id}" class="avatar">
                                                                <img src="https://xavatar.imedao.com/${comment.user.profile_image_url?.split(',')[0] || ''}!240x240.jpg">
                                                            </a>
                                                            <div class="comment__item__main">
                                                                <div class="comment__item__main__hd">
                                                                    <a href="/${comment.user.id}" data-tooltip="${comment.user.id}" class="user-name">${comment.user.screen_name}${comment.user.id == statusUserId ? ' <span class="timeline__item__tag--stick--fix">作者</span>' : ''}</a>
                                                                    <span class="time">${comment.timeBefore}${comment.ip_location ? ' · ' + comment.ip_location : ''}</span>
                                                                </div>
                                                                <p class="">${comment.text}</p>
                                                            </div>
                                                            ${comment.child_comments && comment.child_comments.length > 0 ? `
                                                                <blockquote class="comment__item__reply">
                                                                    ${comment.child_comments.map(reply => `
                                                                        <div data-index="0" data-id="${reply.id}" class="items">
                                                                            <a href="/${reply.user.id}" data-tooltip="${reply.user.id}" class="user-name">${reply.user.screen_name}${reply.user.id == statusUserId ? ' <span class="timeline__item__tag--stick--fix">作者</span>' : ''}</a>
                                                                            <span>：</span>
                                                                            <div class="content">${reply.text}</div>
                                                                            <br>
                                                                        </div>
                                                                    `).join('')}
                                                                </blockquote>
                                                            ` : ''}
                                                            <div class="comment__item__ft">
                                                                <a href="javascript:;"><i class="iconfont"></i><span>${comment.reply_count || 1}</span></a>
                                                                <a href="javascript:;" class="comment__item__like"><i class="iconfont"></i><span>${comment.like_count || '赞'}</span></a>
                                                                <div style="position: relative; height: 18px; line-height: 10px;">
                                                                    <a href="javascript:;" class="comment__item__spam"><i class="iconfont"></i><span>投诉</span></a>
                                                                    <a href="javascript:;" class="comment__item__spam"><i class="iconfont"></i><span>拉黑</span></a>
                                                                </div>
                                                            </div>
                                                            <div class="comment__not-allow" style="margin-top: 5px; display: none;">
                                                                <img src="https://xavatar.imedao.com/community/20251/1739676108918-1739676109079.png!80x80.jpg" class="avatar">
                                                                <div class="comment__not__bd">
                                                                    <div class="content">抱歉，本帖讨论暂时受限</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                                $commentDiv.append(commentsHtml);

                                if (data.max_id && data.comments.length === 20) {
                                    const loadMoreHtml = `
                                        <div class="comment__load-more" data-page="${page + 1}" data-max-id="${data.max_id}">
                                            <button>加载更多评论</button>
                                        </div>`;
                                    $commentDiv.append(loadMoreHtml);
                                }
                            } else if (page === 1) {
                                $commentDiv.append('<div class="comment__wrap"><p>暂无评论</p></div>');
                            }

                            return data;
                        };

                        const firstPageData = await loadComments(-1, 1);

                        $commentDiv.off('click.loadMore').on('click.loadMore', '.comment__load-more button', async function() {
                            const $loadMore = window.jQuery(this).closest('.comment__load-more');
                            const nextPage = parseInt($loadMore.attr('data-page'), 10);
                            const maxId = $loadMore.attr('data-max-id');
                            $loadMore.remove();
                            await loadComments(maxId, nextPage);
                        });

                        if (window.SNB?.vue) {
                            window.SNB.vue.$emit('click-comment', { statusId, $el: $button });
                        }
                    }.bind(this));
                };

                bindEvents($targets);
            } catch (error) {
                console.error('bindDiscussButtonEvents 错误:', error);
            }
        },

        async fetchAndRenderNextPage() {
            try {
                if (this.isLoading || this.noMoreData) {
                    return;
                }
                this.isLoading = true;
                const nextPage = this.currentPage + 1;

                const url = `https://xueqiu.com/query/v1/symbol/search/status.json?${this.getQueryParams()}`;
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Referer': window.location.href,
                        'User-Agent': navigator.userAgent
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP错误！状态码: ${response.status}, 响应: ${response.statusText}`);
                }

                let data;
                try {
                    data = await response.json();
                } catch (error) {
                    console.error('解析响应数据失败:', error);
                    throw new Error('无法解析服务器响应');
                }

                if (Array.isArray(data.list) && data.list.length > 0) {
                    const $container = window.jQuery(this.containerSelector);
                    const $newItems = window.jQuery();

                    data.list.forEach((item, index) => {
                        const user = item.user || {};
                        const userId = user.id || user.profile?.split('/').pop() || 'unknown';
                        const retweet = item.retweeted_status;
                        let text = item.text || '';
                        const position = nextPage * 10 + $container.find('.timeline__item').length + index;
                        const analyticsData = JSON.stringify({
                            tab: 'all',
                            sub_tab: '新帖',
                            order: 'time',
                            position: position,
                            adv_type: 'normal',
                            click_area: 'time',
                            statusId: item.id
                        });

                        let imageHtml = '';
                        let detailImageHtml = '';
                        let imageUrl = '';
                        const imageMatch = text.match(/<img[^>]+src=["'](.*?)["']/i);
                        if (imageMatch && !imageMatch[1].includes('emoji')) {
                            imageUrl = imageMatch[1];
                            imageHtml = `
                                <div class="content__addition pic__thumb zoom__able pic__thumb--vertical image-tag__timeline--long">
                                    <img src="${imageUrl}!800.jpg">
                                </div>`;
                            detailImageHtml = `<br><img class="ke_img" src="${imageUrl}">`;
                            text = text.replace(/<img[^>]+>/i, '');
                        }

                        let contentHtml = '';
                        const isLongText = text.length > 100 || (text.match(/<br>/g) || []).length > 1 || imageUrl;
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
                                    <div>${text}</div>
                                </div>
                                <div class="content content--description">
                                    <div>${shortText}</div>
                                    ${imageUrl ? '' : '<a href="javascript:;" class="timeline__expand__control">展开<i class="iconfont"></i></a>'}
                                </div>`;
                        } else {
                            contentHtml = `
                                <div class="content content--description">
                                    <div>${text}</div>
                                </div>`;
                        }

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
                            <article class="timeline__item" data-dynamic="true">
                                <a href="/${userId}" target="_blank" data-tooltip="${userId}" analytics-data='${analyticsData}' class="avatar avatar-40">
                                    <img src="https://xavatar.imedao.com/${user.profile_image_url?.split(',')[0] || ''}!240x240.jpg">
                                </a>
                                <div class="timeline__item__top__right"></div>
                                <div class="timeline__item__main">
                                    <a href="javascript:;" class="timeline__unfold__control" style="right: 0px; display: none;">收起<i class="iconfont"></i></a>
                                    <div class="timeline__item__info">
                                        <div>
                                            <a href="/${userId}" target="_blank" data-tooltip="${userId}" analytics-data='${analyticsData}' class="user-name">${user.screen_name || '匿名用户'}</a>
                                            <a href="/${userId}/${item.id}" target="_blank" data-id="${item.id}" data-analytics-page="1000" data-analytics="1021" data-analytics-data='${analyticsData}' class="date-and-source">${this.getRelativeTime(item.created_at)}<span class="source">· 来自${item.source || 'web'}</span></a>
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
                        const $item = window.jQuery(html);
                        $newItems.push($item[0]);
                        $container.append($item);

                        // 绑定图片点击事件
                        if (imageUrl) {
                            $item.find('.content__addition img').off('click.image').on('click.image', () => {
                                const $contentDetail = $item.find('.content--detail');
                                const $contentDescription = $item.find('.content--description');
                                const $contentAddition = $item.find('.content__addition');
                                const $unfoldControl = $item.find('.timeline__unfold__control');
                                const $expandControl = $item.find('.timeline__expand__control');

                                // 显示完整内容
                                $contentDetail.show();
                                $contentDetail.find('div').append(`<br><img class="ke_img" src="${imageUrl}">`);

                                // 隐藏缩略内容和图片容器
                                $contentDescription.hide();
                                $contentAddition.hide();

                                // 显示收起按钮
                                $unfoldControl.show().addClass('expand fixed');
                                $expandControl.hide();
                            });

                            // 绑定收起按钮点击事件
                            $item.find('.timeline__unfold__control').off('click.unfold').on('click.unfold', () => {
                                const $contentDetail = $item.find('.content--detail');
                                const $contentDescription = $item.find('.content--description');
                                const $contentAddition = $item.find('.content__addition');
                                const $unfoldControl = $item.find('.timeline__unfold__control');
                                const $expandControl = $item.find('.timeline__expand__control');

                                // 恢复缩略内容
                                $contentDetail.hide();
                                $contentDetail.find('img.ke_img').remove();
                                $contentDescription.show();
                                $contentAddition.show();

                                // 隐藏收起按钮
                                $unfoldControl.hide().removeClass('expand fixed');
                                $expandControl.show();
                            });
                        }
                    });

                    this.bindDiscussButtonEvents($newItems);
                    this.reinitializeEventListeners($newItems);
                    this.lastId = data.list[data.list.length - 1].id;
                    this.currentPage = nextPage;
                } else {
                    this.noMoreData = true;
                }
            } catch (error) {
                console.error('加载下一页失败:', error);
                if (error.message.includes('HTTP错误')) {
                    const params = new URLSearchParams(this.getQueryParams());
                    params.delete('md5__1038');
                    const retryUrl = `https://xueqiu.com/query/v1/symbol/search/status.json?${params.toString()}`;
                    try {
                        const retryResponse = await fetch(retryUrl, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Accept': 'application/json',
                                'X-Requested-With': 'XMLHttpRequest',
                                'Referer': window.location.href,
                                'User-Agent': navigator.userAgent
                            }
                        });
                        if (retryResponse.ok) {
                            const retryData = await retryResponse.json();
                            if (!Array.isArray(retryData.list) || retryData.list.length === 0) {
                                this.noMoreData = true;
                            }
                        }
                    } catch (retryError) {
                        console.error('重试失败:', retryError);
                    }
                }
            } finally {
                this.isLoading = false;
            }
        },

        scrollHandler() {
            try {
                if (this.isLoading || this.noMoreData) {
                    return;
                }
                const now = Date.now();
                if (now - this.lastScrollTime < this.scrollDebounce) {
                    return;
                }
                this.lastScrollTime = now;

                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
                const clientHeight = window.innerHeight || document.documentElement.clientHeight;
                const distanceToBottom = scrollHeight - scrollTop - clientHeight;

                if (distanceToBottom < this.scrollThreshold) {
                    this.fetchAndRenderNextPage();
                }
            } catch (error) {
                console.error('scrollHandler错误:', error);
            }
        },

        init() {
            try {
                if (this.initLastId()) {
                    window.addEventListener('scroll', () => this.scrollHandler());
                } else {
                    setTimeout(() => this.init(), 1000);
                }
            } catch (error) {
                console.error('init错误:', error);
            }
        },

        waitForContainer() {
            try {
                const container = document.querySelector(this.containerSelector);
                if (container) {
                    this.init();
                } else {
                    setTimeout(() => this.waitForContainer(), 500);
                }
            } catch (error) {
                console.error('waitForContainer错误:', error);
            }
        }
    };

    function init() {
        try {
            console.log('雪球评论优化脚本初始化');
            if (typeof window.jQuery !== 'undefined') {
                CommentScroller.waitForContainer();
            } else {
                console.error('jQuery未加载，重试');
                const jQueryCheck = setInterval(() => {
                    if (typeof window.jQuery !== 'undefined') {
                        console.log('jQuery延迟加载成功:', window.jQuery.fn.jquery);
                        clearInterval(jQueryCheck);
                        CommentScroller.waitForContainer();
                    }
                }, 500);
            }
        } catch (error) {
            console.error('初始化错误:', error);
        }
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();