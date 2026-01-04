// ==UserScript==
// @name         CSDN助手
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  CSDN未登录复制、复制代码不带原文链接、禁用登录弹窗、未登录查看所有评论、评论完全展开
// @author       Gandalf_jiajun
// @include      https://blog.csdn.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @note         2022.01.28 更新禁用提示登录弹窗。
// @note         2022.01.29 更新评论区子项显示及自动展开。
// @note         2022.01.30  V0.21  更新评论区表情包显示异常。
// @note         2022.01.31  V0.22  修复评论区样式显示异常问题。
// @note         2022.02.15  V0.31  破解阅读文章必须关注作者功能。
// @note         2022.03.01  v0.40  随机cookie欺骗。伪造登录屏蔽弹窗。
// @note         2022.03.06  v0.41  删除随机cookie欺骗。优化伪造hide_login cookie登录屏蔽弹窗。修复bug。
//觉得本脚本还可以的可以给个好评，觉得有问题的可以留言，谢谢各位！
// @downloadURL https://update.greasyfork.org/scripts/439112/CSDN%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439112/CSDN%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const appendStyle = (tagArr) => {
        tagArr.forEach(element => {
            element.style.userSelect = 'text';
            element.style.webkitUserSelect = 'text';
        });
    };
    const translateParams = (params) => {
        let str = '?';
        for(let i in params) {
            str += i + '=' + params[i] + '&';
        }
        return str.substring(0, str.length - 1);
    };
    const request = (method, url, params) => {
        return new Promise((resolve, reject) => {
            let newUrl = params ? url + translateParams(params) : url;
            const xml = new XMLHttpRequest;
            xml.open(method, newUrl, true);
            xml.send();
            xml.onreadystatechange = () => {
                if(xml.readyState == 4 && xml.status == 200) {
                    resolve(JSON.parse(xml.responseText));
                }
            };
        })
    };
    let tag_a = document.querySelectorAll('#content_views pre');
    let tag_b = document.querySelectorAll('#content_views pre code');
    let domMask = document.querySelector('.hide-article-box') || null;
    // console.log(tag_a, tag_b);
    appendStyle(tag_a);
    appendStyle(tag_b);
    const getCompleteDom = () => {
        if (domMask) {
            let completeDom = document.querySelectorAll('#article_content')[0];
            completeDom.style.height = "inherit";
            completeDom.style.overflow = "auto";
            domMask.innerHTML = "";
            domMask.style.display = "none";
        }
    };
    // 替换表情包
    const replaceDoge = (str) => { // [face]emoji:062.png[/face]
        return str.replace(/\[face\]([^\]]+):([^\[]+)\[\/face\]/g, `<img src="//g.csdnimg.cn/static/face/$1/$2" alt="表情包"/>`)
    };
    const replaceComment = (str) => {
        let newCom;
        newCom = replaceDoge(str);
        return newCom;
    };
    // 生成子项dom
    const createSubDom = (arr) => {
        let dom = `<li class="replay-box" style="display:block;padding-left: 32px;"><ul class="comment-list" style="margin: 0;padding: 0;margin: 0;border: 0;">`;
        arr.forEach((v) => {
            let contentDom = `<li style="display: block;margin: 0;" class="comment-line-box comment-line-box-hide" data-commentid="${v.commentId}" data-replyname="qq_23611043">
                <div class="comment-list-item" style="
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    width: 100%;
                ">
                    <a class="comment-list-href" target="_blank" href="https://blog.csdn.net/${v.userName}" style="
                        padding-top: 0;
                        height: 24px;
                    ">
                        <img src="${v.avatar}" username="${v.userName}" alt="${v.userName}" class="avatar">
                    </a>
                    <div class="right-box " style="
                        padding-bottom: 14px;
                        width: 100%;
                        margin-left: 8px;
                    ">
                        <div class="new-info-box clearfix">
                            <div class="comment-top" style="
                                display: -webkit-box;
                                display: -ms-flexbox;
                                display: flex;
                                -webkit-box-pack: end;
                                -ms-flex-pack: end;
                                justify-content: flex-end;
                                margin-bottom: 4px;
                                line-height: 20px;
                                font-size: 14px;
                            ">
                                <div class="user-box" style="
                                    flex: 1;
                                ">
                                    <a class="name-href" target="_blank" href="https://blog.csdn.net/${v.userName}">
                                        <span class="name mr-8">${v.userName}</span>
                                    </a>
                                    <span class="text">回复</span>
                                    <span class="nick-name"> ${v.parentUserName}</span>
                                    <span class="date" title="${v.postTime}">${v.dateFormat}</span>
                                </div>
                                <div class="opt-comment" style="
                                    display: none;
                                ">
                                    <a class="btn-bt  btn-report">
                                        <img class="btn-report-img" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLookMore.png" title="">
                                        <div class="hide-box">
                                            <span data-type="report" class="hide-item hide-report"> 举报</span>
                                        </div>
                                    </a>
                                    <img class="comment_img_replay" src="https://csdnimg.cn/release/blogv2/dist/pc/img/newCommentReplyWhite.png">
                                    <a class="btn-bt  btn-reply" data-type="reply" data-flag="true">回复</a>
                                </div>
                                <div class="comment-like " data-commentid="${v.commentId}">
                                    <img class="comment-like-img unclickImg" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLikeWhite.png" title="点赞">
                                    <img class="comment-like-img comment-like-img-hover" style="display:none" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLikeHover.png" title="点赞">
                                    <img class="comment-like-img clickedImg" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLikeActive.png" title="取消点赞">
                                    <span></span>
                                </div>
                            </div>
                            <div class="comment-center">
                                <div class="new-comment">
                                    <div class="new-comment">${v.content ? replaceComment(v.content) : ``}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`;
            dom += contentDom;
        });
        dom += `</li></ul>`;
        return dom;
    };
    // 生成dom
    const createDom = (arr) => {
        let dom = `<div class="comment-list-box">`; // </div>
        arr.forEach((v, i) => {
            let commentDom = `<ul class="comment-list" style="
                border: 0;
                margin: 0;
            ">
                <li class="comment-line-box " style="margin: 0;" data-commentid="${v.info.commentId}" data-replyname="${v.info.parentUserName}">
                    <div class="comment-list-item" style="display: flex;width: 100%;">
                        <a class="comment-list-href" style="display: block;padding-top: 15px;height: 48px;" target="_blank" href="https://blog.csdn.net/${v.info.userName}">
                            <img src=${v.info.avatar} username=${v.info.userName} alt=${v.info.userName} class="avatar" style="
                                display: block;
                                width: 32px;
                                height: 32px;
                                border-radius: 50%;
                                border: 1px solid #e8e8ed;
                            ">
                        </a>
                        <div class="right-box" style="
                            border-top: 1px solid #e8e8ed;
                            padding-top: 14px;
                            padding-bottom: 14px;
                            width: 100%;
                            margin-left: 8px;
                        ">
                            <div class="new-info-box clearfix">
                                <div class="comment-top" style="
                                    display: -webkit-box;
                                    display: -ms-flexbox;
                                    display: flex;
                                    -webkit-box-pack: end;
                                    -ms-flex-pack: end;
                                    justify-content: flex-end;
                                    margin-bottom: 4px;
                                    line-height: 20px;
                                    font-size: 14px;
                                ">
                                    <div class="user-box" style="
                                        -webkit-box-flex: 1;
                                        -ms-flex: 1;
                                        flex: 1;
                                        display: -webkit-box;
                                        display: -ms-flexbox;
                                        display: flex;
                                        -webkit-box-align: center;
                                        -ms-flex-align: center;
                                        align-items: center;
                                    ">
                                        <a class="name-href" target="_blank" href="https://blog.csdn.net/${v.info.userName}">
                                            <span class="name ">${v.info.nickName}</span>
                                        </a>
                                        <span class="date" title="${v.info.postTime}">${v.info.dateFormat}</span>
                                    </div>
                                    <div class="opt-comment" style="
                                        line-height: 20px;
                                        height: 20px;
                                        display: none;
                                    ">
                                        <a class="btn-bt  btn-report">
                                            <img class="btn-report-img" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLookMore.png" title="">
                                            <div class="hide-box">
                                                <span data-type="report" class="hide-item hide-report"> 举报</span>
                                            </div>
                                        </a>
                                        <img class="comment_img_replay" src="https://csdnimg.cn/release/blogv2/dist/pc/img/newCommentReplyWhite.png">
                                        <a class="btn-bt  btn-reply" data-type="reply" data-flag="true">回复</a>
                                    </div>
                                    <div class="comment-like " data-commentid="${v.info.commentId}">
                                        <img class="comment-like-img unclickImg" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLikeWhite.png" title="点赞">
                                        <img class="comment-like-img comment-like-img-hover" style="display:none" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLikeHover.png" title="点赞">
                                        <img class="comment-like-img clickedImg" src="https://csdnimg.cn/release/blogv2/dist/pc/img/commentLikeActive.png" title="取消点赞">
                                        <span></span>
                                    </div>
                                </div>
                                <div class="comment-center">
                                    <div class="new-comment">${v.info.content ? replaceComment(v.info.content): ``}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </li>
                ${v.sub.length>0 ? createSubDom(v.sub) : ``}
            </ul>`;
            dom += commentDom;
        })
        dom += `</div>`;
        return dom;
    };
    // 获取评论
    const getComment = async () => {
        try {
            let articalId = window.location.href.split('/article/details/')[1].split('?')[0];
            let commentUrl = '/phoenix/web/v1/comment/list/' + articalId;
            let params = {
                page: 1,
                size: 999,
                fold: 'unfold',
                commentId: ''
            };
            const res = await request('post', commentUrl, params);
            let dom = createDom(res.data.list);
            let parentNode = document.getElementsByClassName('comment-list-container')[0];
            let parentNode_chrome = document.getElementsByClassName('unlogin-comment-box-new')[0];
            if (parentNode_chrome && window.navigator.userAgent.indexOf('Chrome')) { // 判断是否为谷歌浏览器
                parentNode_chrome.innerHTML = `<div class="comment-title">评论<span>${res.data.count}</span></div>` + dom;
            } else {
                parentNode.innerHTML = dom;
            }
        } catch(err) {
            console.log(err);
        }
    };
    const setCookie = (key, value, path, domain) => {
        const time = 4 * 30 * 24 * 60 * 60 * 1000;
        const date = new Date(+new Date + time).toUTCString();
        document.cookie = `${key}=${value};path=${path};domain=${domain};expires=${date}`
    }
    const setHideLogin = () => {
        const cookieArr = document.cookie.split('; ');
        if (cookieArr.includes("hide_login=2")) {
            return
        } else {
            setCookie('hide_login', 2, '/', '.csdn.net')
            location.href = location.href
        }
    }

    setTimeout(() => {
        getCompleteDom();
        getComment();
        window.csdn ? window.csdn.copyright.init('', '') : '';
        window.csdn.loginBox.show = function() {};
        setHideLogin();
    }, 0);
})();