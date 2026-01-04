// ==UserScript==
// @name         mooc讨论区自动完成
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动复制已有的评论并提交发布
// @author       Yuguo
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/learn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521081/mooc%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/521081/mooc%E8%AE%A8%E8%AE%BA%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个日志窗口
    let logWindow = null;

    function openLogWindow() {
        logWindow = window.open('', 'LogWindow', 'width=600,height=400');
        logWindow.document.write('<html><head><title>日志输出</title></head><body><pre id="logArea"></pre></body></html>');
    }

    function log(message, color = 'black') {
        if (!logWindow) openLogWindow();
        const logArea = logWindow.document.getElementById('logArea');

        // 使用 HTML 标签来支持颜色
        const coloredMessage = `<span style="color:${color};">${message}</span>`;
        logArea.innerHTML += coloredMessage + '<br>';

        logArea.scrollTop = logArea.scrollHeight; // 滚动到最新的日志
    }

    // 配置项
    const CONFIG = {
        name:"",
        staytime: 1000, // 停顿时间，单位：毫秒
        commentIndex: 4, // 默认复制评论区域索引
        interval: 1000, // 翻页间隔，单位：毫秒
        baseUrl: window.location.href.split('#')[0], // 基础 URL
        hashBase: '#/learn/forumindex', // 哈希部分
        queryParam: 'p', // 翻页的参数名称
        additionalParams: 't=0', // 其他固定参数
        initialPage: 1, // 起始页码
        nameAddress:'img#my-img',//自己的用户名地址
        nameAlt:'alt',//自己的用户名标签
        commentSectionsAddress:'.f-richEditorText.j-content',//该页所有回复
        commentInputAddress:'.j-editor .ql-editor',//文本框
        submitButtonAddress:'.j-edit-btn', //输入按钮
        titleAddress :'.j-title.title.f-fl',//该页所有主题标题
        commentLinksAddress:'a.f-fcgreen',//该页回复界面的姓名（包括老师）
        linkAddress:'.f-fc3.f-f0.lb10.j-link',//该页的所有的主题（包括我关注的主题）
        listItemsAddress :'.m-flwrap .m-data-lists .u-forumli',//该页的“全部主题”（不包括我关注的主题）
    };

    // 获取当前页面的哈希部分和当前页码
    let currentHash = window.location.hash;
    let currentPage = CONFIG.initialPage;
    if (currentHash.includes(CONFIG.queryParam + '=')) {
        let urlParams = new URLSearchParams(currentHash.split('?')[1]);
        currentPage = parseInt(urlParams.get(CONFIG.queryParam)) || CONFIG.initialPage;
    }
    CONFIG.name = document.querySelector(CONFIG.nameAddress).getAttribute(CONFIG.nameAlt);
    // 自动点击网站列表中的链接
    function autoClickLinks() {
        var listItems = document.querySelectorAll(CONFIG.listItemsAddress);
        var currentIndex = 0;

        // 页面跳转后的回调函数
        function handlePageLoad() {
            log("资源加载完成");

            // 执行评论操作
            autoPostComment().then(() => {
                log("继续执行其他操作");
                // 更新索引并跳转到下一个链接
                currentIndex++;
                if (currentIndex < listItems.length) {
                    clickNextLink();
                } else {
                    log("所有网站链接已点击完，准备翻页");
                    waitForCommentPostAndNextPage();
                }
            }).catch((error) => {
                log("评论发布失败: " + error,'red');
                // 更新索引并跳转到下一个链接
                currentIndex++;
                if (currentIndex < listItems.length) {
                    clickNextLink();
                } else {
                    log("所有网站链接已点击完，准备翻页");
                    waitForCommentPostAndNextPage();
                }
            });
        }

        async function clickNextLink() {
            if (currentIndex < listItems.length) {
                var item = listItems[currentIndex];
                var link = item.querySelector(CONFIG.linkAddress);
                if (link) {
                    var url = link.href;
                    log("正在跳转到: " + url);

                    // 使用 window.location.href 跳转到新页面，并确保在页面加载完成后执行后续操作
                    window.location.href = url;

                    // 设置延时，等待页面加载完成后再执行 handlePageLoad
                    setTimeout(() => {
                        handlePageLoad(); // 在页面加载完成后执行
                    }, CONFIG.staytime);
                }
            } else {
                log("所有网站链接已点击完，准备翻页");
                // 等待评论发布完成后再翻页
                waitForCommentPostAndNextPage();
            }
        }

        clickNextLink();
    }

    //找到长度最大的评论
    function getCommentTextByMaxLengthInTopNExcludingFirst(commentSections, n) {
        if (!commentSections || commentSections.length <= 1 || n <= 0) {
            return "1"; // 数组无效、长度不足，或者 n 非法时返回 null
        }

        // 排除第一个元素并取前 n 个
        var sectionsToConsider = Array.from(commentSections).slice(1, n);

        if (sectionsToConsider.length === 0) {
            return "1"; // 如果没有需要考虑的元素
        }
        var maxLength = 0;
        var maxLengthElement = null;
        sectionsToConsider.forEach(function (section) {
            var length = (section.textContent || '').length;
            if (length > maxLength) {
                maxLength = length;
                maxLengthElement = section;
            }
        });
        return maxLengthElement ? maxLengthElement.textContent : "1";
    }

    function autoPostComment() {
        return new Promise((resolve, reject) => {

                // 确保页面加载完成
                document.addEventListener("DOMContentLoaded", function () {
                    log("HTML 文档加载完成");
                });
                setTimeout(function () {
                }, 500);
                // 等待页面加载完成并确保评论区域和按钮可用
                var commentSections = document.querySelectorAll(CONFIG.commentSectionsAddress);
                //最大可以复制的长度
                var maxlength = CONFIG.commentIndex;
                if (commentSections.length <= CONFIG.commentIndex){
                     maxlength = commentSections.length ;
                }
                let commentText = getCommentTextByMaxLengthInTopNExcludingFirst(commentSections,maxlength);
                var commentInput = document.querySelector(CONFIG.commentInputAddress);
                var submitButton = document.querySelector(CONFIG.submitButtonAddress);
                let title = document.querySelector(CONFIG.titleAddress);
                log("标题： " + title.textContent);
                if (commentSections.length >= 2) {
                    // 检查评论区是否已有评论
                    if (isCommentAlreadyPosted()) {
                        log("此帖子已回复过，跳过发布",'green');
                        return resolve("评论已发布，跳过");
                    }
                    if (commentInput && submitButton) {
                        commentInput.innerHTML = commentText;
                        log("正在发布评论...");
                        // 使用 setTimeout 模拟评论提交的异步操作
                        setTimeout(function () {
                            submitButton.click(); // 执行点击事件
                            resolve("评论发布完成"); // 提示评论已发布，resolve 回调
                            log("评论发布完成",'green');
                        }, 100);
                    } else {
                        reject("评论输入框或发布按钮未找到");
                    }
                } else {
                    reject("没有足够的评论区域，无法复制评论");
                }
            let result = commentText.slice(0, 10).padEnd(10, '0');
            log("内容： " + result+"……");
        });
    }


    // 检查该帖子是否已经评论过
    function isCommentAlreadyPosted() {
        const username = CONFIG.name; // 固定的用户名
        const commentLinks = document.querySelectorAll(CONFIG.commentLinksAddress);
        for (let link of commentLinks) {
            if (link && link.title === username) {

                return true; // 如果找到已有评论，返回 true
            }
        }
        return false; // 如果没有找到该用户名的评论，则返回 false
    }

    // 等待页面元素加载
    function waitForElement(selector) {
        const observer = new MutationObserver((mutationsList, observer) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }


    // 等待评论发布完成并跳转到下一页
    function waitForCommentPostAndNextPage() {
        try {
            // 等待评论发布的反馈（例如：通过页面上某个元素标记发布成功）
            waitForElement('.f-richEditorText.j-content'); // 等待页面评论区域更新
            log("评论已成功发布，准备翻页",'green');
            // 自动翻到下一页
            setTimeout(function() {
                autoNextPage();
                location.reload();
            }, 1000);
        } catch (error) {
            log("等待评论发布或翻页时出错: " + error,'red');
        }
    }

    // 自动翻到下一页
    function autoNextPage() {
        try {
            log(`当前页码: ${currentPage}`);
            currentPage++;

            const newHash = `${CONFIG.hashBase}?${CONFIG.additionalParams}&${CONFIG.queryParam}=${currentPage}`;
            const nextPageUrl = `${CONFIG.baseUrl}${newHash}`;
            log(`跳转到下一页: ${nextPageUrl}`);
            window.location.replace(nextPageUrl); // 跳转到新页面
            setTimeout(function() {
                location.reload(true);
            }, 3000);
        } catch (error) {
            log("翻页时出错: " + error,'red');
        }
    }

// 检查是否有网站链接，如果没有则等待一段时间后重新检查
    function checkForLinks() {
        var listItems = document.querySelectorAll(CONFIG.listItemsAddress);
        if (listItems.length === 0) {
            log("没有找到网站链接，请刷新或者等待脚本",'#B8860B');
            setTimeout(function() {
                checkForLinks(); // 没有找到链接时，等待一段时间后重新检查
            }, 10000);
            return; // 停止当前函数的执行，等待下一次检查
        }
        autoClickLinks(); // 如果找到了网站链接，自动点击链接
    }

// 确保页面加载完成后执行
    window.onload = function() {
        setTimeout(function() {
            checkForLinks(); // 检查是否有网站链接
        }, CONFIG.staytime); // 页面加载后等待一段时间再执行检查
    };

    log("------------hello--------------",'green');
})();
