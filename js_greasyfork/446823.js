// ==UserScript==
// @name         B站评论直达
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  为 bilibili 上的评论生成支持 web 端和手机 app 直达的链接
// @author       5ec1cff
// @license      AGPL
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446823/B%E7%AB%99%E8%AF%84%E8%AE%BA%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/446823/B%E7%AB%99%E8%AF%84%E8%AE%BA%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function(window) {
    'use strict';

    // 动态：1-转发 2-相簿 4-动态 8-视频 16-小视频 64-文章 256-音频 512-番剧
    // 评论：1-视频，5-小视频，6-小黑屋，11-相簿，12-文章，14-音频，17-动态
    const commentToDynamicTypeMap = {
        11: 2,
        1: 8,
        12: 64,
        14: 256
    }

    GM_addStyle(`
.selected-comment { background-color: pink; }
.my-message {
    border-radius: 8px;
    color: #fff;
    font-size: 14px;
    left: 50%;
    overflow: hidden;
    padding: 12px 24px;
    position: fixed;
    transform: translate(-50%,-50%);
    transition: all .4s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: #47d279;
    box-shadow: 0 .2em .1em .1em rgba(71,210,121,.2);
    top: calc(50% - 0px);
    z-index: 2004;
    text-align: center;
    white-space: nowrap;
}
    `);

    let is_new_comment = false;

    // 判断是否为 new_comment
    if (location.href.indexOf('www.bilibili.com/video') > 0 || location.href.indexOf('www.bilibili.com/opus') > 0) { // && (!getJumpId() || location.href.indexOf('old_comment=1') > 0)) {
        /*
        let origMatch = String.prototype.match;
        let count = 0;
        String.prototype.match = function (...args) {
            let r = origMatch.call(this, ...args);
            if (!r && this == location.href && args[0]?.source == '#reply([0-9]+)$') {
                r = '00';
                count++;
                if (count >= 2) String.prototype.match = origMatch;
            }
            return r;
        }*/
        // window.history.replaceState({}, '', "?old_comment=1");
        is_new_comment = true;
        console.warn('use new comment');
    }

    let main_comment_classes = ["list-item", "reply-wrap"],
        reply_classes = ["reply-item", "reply-wrap"],
        bar_selector = 'div.info';
    if (is_new_comment) {
        main_comment_classes = ['reply-item'];
        reply_classes = ['sub-reply-item'];
        bar_selector = 'div.reply-info, div.sub-reply-info';
    }
    let update_selector = `${'.' + main_comment_classes.join('.')}, ${'.' + reply_classes.join('.')}`;

    function getJumpId() {
        let r = location.hash.match(/#reply(\d+)/);
        return r && r[1];
    }

    let jumpId = getJumpId();

    window.addEventListener('hashchange', function () {
        jumpId = getJumpId();
        // console.log('new jumpId:', jumpId);
        document.querySelectorAll(update_selector).forEach(updateSelectedState);
    })

    function getCommentRpid(e) {
        if (is_new_comment) {
            if (classNameMatch(e, 'sub-reply-item')) {
                return e.__vnode?.children[1].props.reply.rpid || WARN('Failed to get sub-reply-item rpid on', e);
            }
            // return e.__vnode?.props['mr-show']?.msg?.rpid;
            return e?.__vueParentComponent?.props?.reply?.rpid;
        } else {
            return e.dataset?.id;
        }
    }

    // 高亮选择的评论
    function updateSelectedState(e) {
        if (getCommentRpid(e) == jumpId && jumpId != null) {
            e.classList.add('selected-comment');
        } else {
            e.classList.remove('selected-comment');
        }
    }

    function showToast(content) {
        let d = document.createElement('div');
        d.classList.add('my-message');
        d.textContent = content;
        document.body.append(d);
        setTimeout((e) => { d.remove() }, 2000);
    }

    let _isDetail = null;

    // 视频页面、动态页面、专栏页面
    function isDetailPage() {
        if (_isDetail == null) {
            _isDetail = Boolean(location.href.match(/www\.bilibili\.com\/(video|read|opus)\/|t\.bilibili\.com\/\d+/));
            console.log('isDetail:', _isDetail);
        }
        return _isDetail;
    }

    function WARN(msg, append) {
        // console.warn(msg, append);
        // debugger
        return null;
    }

    function getBaseUrl(type, oid) {
        let url = null;
        if (!isDetailPage() && type != null && oid != null) {
            if (type in commentToDynamicTypeMap) {
                url = new URL(`https://t.bilibili.com/${oid}?type=${commentToDynamicTypeMap[type]}`);
            } else if (type == 17) {
                url = new URL(`https://t.bilibili.com/${oid}`);
            } else {
                console.warn('unsupported comment type:', type, oid);
                url = new URL(location.href);
            }
        } else {
            url = new URL(location.href);
        }
        let params = new URLSearchParams(url.search);
        for (let k of Array.from(params.keys())) {
            if (k.match(/spm|vd_source/)) { params.delete(k); }
        }
        url.search = params.toString();
        return url;
    }

    function getUrl(e) {
        let p = e.parentElement, root_id = null, second_id = null, comment_on = null, comment_on_oid = null;
        while (p != null) {
            if (classNameMatch(p, "reply-item", "reply-wrap")) second_id = p.dataset.id;
            if (classNameMatch(p, 'sub-reply-item')) second_id = p?.__vnode?.children[1]?.props?.reply?.rpid || WARN('Failed to get new comment second id on', p);
            if (classNameMatch(p, ...main_comment_classes)) {
                let data;
                if (p.attributes['mr-show']) {
                    data = JSON.parse(p.attributes['mr-show'].value);
                    root_id = p.dataset.id;
                    comment_on = data.msg.type;
                    comment_on_oid = data.msg.oid;
                } else if (is_new_comment) {
                    data = p.__vueParentComponent.props.reply;
                    root_id = data.rpid;
                    comment_on = data.type;
                    comment_on_oid = data.oid;
                }
            }
            if (root_id != null) break;
            p = p.parentElement;
        }
        // console.log(root_id, second_id, comment_on, comment_on_oid);
        let u = getBaseUrl(comment_on, comment_on_oid);
        let params = new URLSearchParams(u.search);
        params.append('comment_on', 1);
        params.append('comment_root_id', root_id);
        if (second_id != null) params.append('comment_secondary_id', 'second_id');
        u.search = params.toString();
        u.hash = `#reply${second_id || root_id}`;
        return [u.hash, u.toString()];
    }

    function classNameMatch(elem, ...classNames) {
        if (!(elem instanceof Element)) return false;
        for (let name of classNames) {
            if (!elem.classList.contains(name)) return false;
        }
        return true;
    }

    document.addEventListener('DOMContentLoaded', function() {
        let observer = new MutationObserver(function(mutationsList, observe) {
            mutationsList.forEach(l => {
                l.addedNodes?.forEach(e => {
                    if (classNameMatch(e, ...main_comment_classes) || classNameMatch(e, ...reply_classes)) {
                        e.querySelectorAll(bar_selector).forEach(info => {
                            let newSpan = document.createElement('a');
                            newSpan.textContent = "直达链接";
                            newSpan.className = "btn-hover btn-highlight";
                            newSpan.title = '点击复制';
                            newSpan.addEventListener('click', function (e) {
                                GM_setClipboard(e.target.dataset.url, 'text');
                                showToast('已复制');
                                if (!isDetailPage()) {
                                    e.preventDefault();
                                    return false;
                                }
                            });
                            if (is_new_comment) {
                                newSpan.style = 'margin-left: 19px;';
                            }
                            info.insertBefore(newSpan, info.querySelector('div'));
                            let [hash, url] = getUrl(newSpan);
                            newSpan.dataset.url = url;
                            newSpan.href = isDetailPage() ? hash : url;
                        });
                        updateSelectedState(e);
                    }
                })
            })
        });
        observer.observe(document.body, { 'childList': true, 'subtree': true })
    });
    console.log("b comment loaded");
})(unsafeWindow);