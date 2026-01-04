// ==UserScript==
// @name         bkBliBli
// @github       https://github.com/hunmeng/bkBilibili
// @description  哔哩哔哩首页快捷拉黑，去广告，直播推广
// @author       lkj
// @namespace    lkj
// @version      1.0.7
// @create       2024-05-06
// @lastmodified 2025-01-09
// @note         首次更新，拉黑功能覆盖到首页分区
// @charset      UTF-8
// @match        *://www.bilibili.com/
// @match        *://www.bilibili.com/?*
// @match        *://www.bilibili.com/v/*
// @match        https://api.bilibili.com/x/relation/modify
// @grant        unsafeWindow
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494197/bkBliBli.user.js
// @updateURL https://update.greasyfork.org/scripts/494197/bkBliBli.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    const bili_jct = (await cookieStore.get('bili_jct')).value;
    console.log('bili_jct=======',bili_jct)
    // 添加自定义CSS样式
    var style = document.createElement('style');
    style.type = 'text/css';
    // 设置a标签的样式
    style.innerHTML = '.custom-link { margin-left: auto; }.feed-card { margin-top: 0px !important; margin-bottom: 0px !important; }.bili-video-card{ margin-top: 5px !important; margin-bottom: 20px !important; }.bili-video-card.is-rcmd.enable-no-interest { margin-top: 5px !important; margin-bottom: 20x !important; }';
    document.head.appendChild(style);

    async function addToBlack(uid,act) {
        return fetch('https://api.bilibili.com/x/relation/modify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            credentials: 'include',
            body: `fid=${uid}&act=${act}&csrf=${bili_jct}`
        })
            .then(async res => void console.log('请求成功, 响应体: ', await res.text()))
            .catch(err => void console.error('请求错误', err));
    }

    // 函数用于排序类名数组并返回字符串
    function sortClassNames(classList) {
        if (typeof classList === 'string') {
            return classList;
        } else if (classList === undefined) {
            // 处理未定义的情况
            //console.warn('classList is undefined');
            return '';
        } else {
            // 处理其他非字符串情况
            console.error('Invalid classList:', classList);
            return classList;
        }
    }

    // 定义要删除的类名集合
    var classNamesToRemove = [
        'bili-video-card is-rcmd',
        'floor-single-card',
        'bili-live-card is-rcmd enable-no-interest',
        'recommended-swipe grid-anchor'
    ];

    function reEl(childNode){
        var classNames = sortClassNames(childNode.className);
        // 检查子节点的类名是否包含要删除的类名
        if (classNamesToRemove.some(cn => classNames == cn)) {
            childNode.remove();
            return false;
        } else if (classNames == 'feed-card') { // 如果子节点的类名包含 'feed-card'
            // 获取 feed-card 的子节点
            var feedCardChildren = childNode.children;
            var isRe = false;

            // 函数用于检查子节点的类名是否包含要删除的类名
            function hasClassToRemove(child) {
                var childNames = sortClassNames(child.className);
                return classNamesToRemove.some(cn => childNames == cn);
            }

            // 遍历 feed-card 的子节点，检查是否包含要删除的类名
            for (var j = 0; j < feedCardChildren.length; j++) {
                var feedCardChild = feedCardChildren[j];
                // 如果子节点的类名包含要删除的类名，则设置 isRe 为 true 并结束循环
                if (hasClassToRemove(feedCardChild)) {
                    isRe = true;
                    break;
                }
            }

            if(isRe){
                childNode.remove();
                return false;
            }
        }
        return true;
    }

    // 处理视频条目函数
    function handleVideoItems(videoItems) {
        // 正则表达式匹配数字ID的模式
        var regex = /\/(\d+)$/;

        // 遍历每个视频条目
        videoItems.forEach(function(item) {
            // 查找带有类名为 "bili-video-card__info--owner" 的元素
            var ownerLink = item.querySelector('.bili-video-card__info--owner');
            var idtext = '';
            // 检查是否找到了链接元素
            if (ownerLink) {
                // 获取链接的 href 属性值
                var hrefValue = ownerLink.getAttribute('href');
                // 使用正则表达式匹配数字ID
                var match = hrefValue.match(regex);
                if (match) {
                    idtext = match[1]; // 提取匹配到的数字ID
                } else {
                    console.error('未能匹配到数字ID');
                }
            }

            // 检查是否已经添加过“拉黑”链接
            if (!item.classList.contains('blacklisted')) {
                // 创建一个a标签元素
                var link = document.createElement('a');
                link.textContent = '拉黑'; // 链接显示的文本
                link.href = '#'; // 链接的目标URL

                // 添加自定义类以应用样式
                link.classList.add('custom-link');

                // 添加点击事件处理程序
                var isBlacklisted = false; // 拉黑状态，默认为 false
                link.addEventListener('click', function(event) {
                    // 阻止默认行为，例如不跳转到链接的href
                    event.preventDefault();

                    if (!isBlacklisted) {
                        // 如果未拉黑，则执行拉黑操作
                        addToBlack(idtext, 5);
                        link.textContent = '取消拉黑'; // 修改链接文本
                        isBlacklisted = true; // 更新状态为已拉黑
                    } else {
                        // 如果已拉黑，则执行取消拉黑操作
                        addToBlack(idtext, 6);
                        link.textContent = '拉黑'; // 修改链接文本
                        isBlacklisted = false; // 更新状态为未拉黑
                    }
                });

                // 将链接添加到视频条目中
                item.appendChild(link);

                // 添加已处理标记
                item.classList.add('blacklisted');
            }
        });
    }

    // 创建一个 MutationObserver 实例，监听 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 检查每个变化是否是节点的添加
            mutation.addedNodes.forEach(function(addedNode) {
                //处理广告/推广等视频推广
                if(reEl(addedNode)){
                    // 如果添加的节点是你想要的视频条目元素，则执行相应的操作
                    if (addedNode.querySelectorAll && addedNode.querySelectorAll('.bili-video-card__info--bottom').length > 0) {
                        // 获取所有新增的视频条目的元素
                        var newVideoItems = addedNode.querySelectorAll('.bili-video-card__info--bottom');
                        // 处理新增的视频条目
                        handleVideoItems(newVideoItems);
                    }
                }

            });
        });
    });
    // 监听指定元素的变化
    var targetElement = document.querySelector('.container.is-version8') || document.querySelector('.channel-layout');

    if (!targetElement) {
        console.error('未找到指定元素');
        return;
    }

    // 配置 MutationObserver，指定要观察的节点和要观察的变化类型
    var config = {
        childList: true, subtree: true
    };

    // 将观察器绑定到指定元素上，并开始观察
    observer.observe(targetElement, config);

    // 获取所有子节点，并使用箭头函数遍历处理每个子节点
    Array.from(targetElement.children).forEach(childNode => reEl(childNode));

    // 处理初始视频条目
    var initialVideoItems = targetElement.querySelectorAll('.bili-video-card__info--bottom');
    //handleVideoItems(initialVideoItems);
    setTimeout(() => {
        handleVideoItems(initialVideoItems);
    }, 300);
    //test

})();
