// ==UserScript==
// @name        CSDN娱乐脚本
// @namespace   http://tampermonkey.net/
// @match       https://mp.csdn.net/mp_blog/analysis/article/*
// @grant       unsafeWindow
// @run-at      document-start
// @version     1.0
// @license     MIT
// @author      Berger
// @require     https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.min.js
// @require     https://registry.npmmirror.com/hotkeys-js/3.13.3/files/dist/hotkeys.min.js
// @resource    style https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.min.css
// @description 修改CSDN博客数据，仅供娱乐使用！
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/510074/CSDN%E5%A8%B1%E4%B9%90%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510074/CSDN%E5%A8%B1%E4%B9%90%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const utils = {
        responseInterceptors(hijackUrl, functions) {
            // 保存原始的 open 和 send 方法
            const originalOpen = XMLHttpRequest.prototype.open;
            const originalSend = XMLHttpRequest.prototype.send;

            // 重写 XMLHttpRequest 的 open 方法
            XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                // 将请求的 URL 和方法存储在当前实例中
                this._url = url;
                this._method = method;

                // 检查 URL 是否包含要劫持的 URL
                if (url.includes(hijackUrl)) {
                    // 添加状态变化的事件监听器
                    this.addEventListener('readystatechange', function () {
                        // 当请求完成时（readyState === 4）
                        if (this.readyState === 4) {
                            try {
                                // 解析响应文本为 JSON 对象
                                const res = JSON.parse(this.responseText);
                                // 调用提供的函数进行响应修改
                                const modifiedResponse = functions(res);
                                // 使 responseText 属性可写，并进行修改
                                Object.defineProperty(this, "responseText", {
                                    writable: true,
                                    configurable: true, // 使属性可配置
                                });
                                // 将修改后的响应文本赋值给 responseText
                                this.responseText = modifiedResponse;
                            } catch (error) {
                                // 处理 JSON 解析错误
                                console.error("Error parsing response:", error);
                            }
                        }
                    });
                }

                // 调用原始的 open 方法
                originalOpen.call(this, method, url, async, user, password);
            };

            // 重写 XMLHttpRequest 的 send 方法
            XMLHttpRequest.prototype.send = function (body) {
                // 调用原始的 send 方法
                originalSend.call(this, body);
            };
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            return GM_setValue(name, value);
        },
    };

    const responseContentModify = {
        modifyBlogStatics(response) {
            const blogStaticsData = utils.getValue("blogStatics")
            if (blogStaticsData.article) {
                //文章总数
                response['data'][0]['num'] = blogStaticsData.article
            }

            if (blogStaticsData.fans) {
                //粉丝数
                response['data'][1]['num'] = blogStaticsData.fans
            }

            if (blogStaticsData.digg) {
                //点赞数
                response['data'][2]['num'] = blogStaticsData.digg
            }

            if (blogStaticsData.comment) {
                //评论数
                response['data'][3]['num'] = blogStaticsData.comment
            }
            if (blogStaticsData.view) {
                //阅读量
                response['data'][4]['num'] = blogStaticsData.view
            }
            if (blogStaticsData.score) {
                //积分
                response['data'][5]['num'] = blogStaticsData.score
            }
            if (blogStaticsData.rank) {
                //总排名
                response['data'][6]['num'] = blogStaticsData.rank
            }
            if (blogStaticsData.collect) {
                //收藏数
                response['data'][7]['num'] = blogStaticsData.collect
            }
            return response
        }
    }

    function hijackBlogStatics() {
        // 博客数据请求接口
        const blogStaticsUrl = 'https://bizapi.csdn.net/blog/phoenix/console/v1/data/blog-statistics'
        utils.responseInterceptors(blogStaticsUrl, responseContentModify.modifyBlogStatics)
    }


    function registerMenuCommand() {
        GM_registerMenuCommand('⚙️ 配置博客数据', () => {
            main.showBlogStaticsSettingBox()
        });
    }

    let main = {
        init() {
            hijackBlogStatics()
            registerMenuCommand()
        },
        // 博客数据配置
        showBlogStaticsSettingBox() {
            const blogStaticsData = utils.getValue("blogStatics")
            console.log(blogStaticsData)
            Swal.fire({
                title: '博客数据配置',
                html:
                    '<span>文章总数</span><input id="article" class="swal2-input" placeholder="文章总数" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.article) + '">' +
                    '<span>粉丝数</span><input id="fans" class="swal2-input" placeholder="粉丝数" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.fans) + '">' +
                    '<span>点赞数</span><input id="digg" class="swal2-input" placeholder="点赞数" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.digg) + '">' +
                    '<span>评论数</span><input id="comment" class="swal2-input" placeholder="评论数" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.comment) + '">' +
                    '<span>阅读量</span><input id="view" class="swal2-input" placeholder="阅读量" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.view) + '">' +
                    '<span>积分</span><input id="score" class="swal2-input" placeholder="积分" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.score) + '">' +
                    '<span>总排名</span><input id="rank" class="swal2-input" placeholder="总排名" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.rank) + '">' +
                    '<span>收藏数</span><input id="collect" class="swal2-input" placeholder="收藏数" value="' + (blogStaticsData == null || undefined ? '' : blogStaticsData.collect) + '">',
                focusConfirm: false,
                showDenyButton: true,
                confirmButtonText: '保存数据到本地',
                denyButtonText: '清除本地信息',
                footer: 'tips：未填写的信息不会被修改',
                preConfirm: () => {
                    const articleNum = Swal.getPopup().querySelector('#article').value;
                    const fansNum = Swal.getPopup().querySelector('#fans').value;
                    const diggNum = Swal.getPopup().querySelector('#digg').value;
                    const commentNum = Swal.getPopup().querySelector('#comment').value;
                    const viewNum = Swal.getPopup().querySelector('#view').value;
                    const scoreNum = Swal.getPopup().querySelector('#score').value;
                    const rankNum = Swal.getPopup().querySelector('#rank').value;
                    const collectNum = Swal.getPopup().querySelector('#collect').value;

                    const inputs = [
                        articleNum,
                        fansNum,
                        diggNum,
                        commentNum,
                        viewNum,
                        scoreNum,
                        rankNum,
                        collectNum
                    ];

                    for (let input of inputs) {
                        const num = Number(input);
                        if (!Number.isInteger(num) || num < 0) {
                            return Swal.fire({
                                icon: 'error',
                                title: '输入错误',
                                text: '数据必须是大于等于的整数',
                            });
                        }
                    }
                    return {articleNum, fansNum, diggNum, commentNum, viewNum, scoreNum, rankNum, collectNum}
                }
            }).then((result) => {
                const {articleNum, fansNum, diggNum, commentNum, viewNum, scoreNum, rankNum, collectNum} = result.value;
                if (result.isConfirmed) {
                    // 保存信息
                    const blogStaticsData = {
                        article: articleNum,
                        fans: fansNum,
                        digg: diggNum,
                        comment: commentNum,
                        view: viewNum,
                        score: scoreNum,
                        rank: rankNum,
                        collect: collectNum,
                    }
                    utils.setValue("blogStatics", blogStaticsData);
                    // 提示
                    Swal.fire({
                        icon: "success",
                        title: "保存成功！",
                        showConfirmButton: false,
                        timer: 1300
                    }).then(()=>location.reload());
                }
                if (result.isDenied) {
                    utils.setValue("blogStatics", null)
                    Swal.fire({
                        icon: "success",
                        title: "博客数据已清除！",
                        showConfirmButton: false,
                        timer: 1300
                    }).then(()=>location.reload());
                }
            });
        },

    }


    window.addEventListener('DOMContentLoaded', main.init);

})();


