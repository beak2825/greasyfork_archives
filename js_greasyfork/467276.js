// ==UserScript==
// @name         豆瓣影视过滤
// @namespace    your-namespace
// @version      1.0.6
// @description  使用chatgpt编写的过滤豆瓣上不想看的影视
// @author       xuanqb
// @match        https://movie.douban.com/tv*
// @match        https://movie.douban.com/explore*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467276/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/467276/%E8%B1%86%E7%93%A3%E5%BD%B1%E8%A7%86%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 不想看的影视名称或关键词
    var deletedMovieList = JSON.parse(localStorage.getItem('deletedMovies')) || [];
    var deletedMovies = new Set(deletedMovieList);
        const regex = / 第[一二三四五六七八九十\d]+季/;

    var timeout = null;
    // 创建一个 MutationObserver 实例
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查是否是新增节点
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // 遍历新增节点
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    var addedNode = mutation.addedNodes[i];
                    // 检查是否是单个条目
                    if (addedNode.parentNode.classList.contains('explore-list')) {
                        handlerSingleMovie(addedNode.querySelector('.drc-subject-info-title-text'));
                        continue;
                    }
                    // 检查新增节点是否是影视列表项
                    if (addedNode.classList && addedNode.classList.contains('explore-list')) {
                        var movieList = document.querySelectorAll('.drc-subject-info-title-text');
                        for (var j = 0; j < movieList.length; j++) {
                            var titleElement = movieList[j];
                            handlerSingleMovie(titleElement);
                        }


                    }
                }
            }
        });
        if (document.querySelector('.explore-main').clientHeight < 600) {
            timeout = setTimeout(() => {
                var nextButton = document.querySelector('#app > div > div.explore-main > div > button');
                if (!nextButton.className.includes('processing')) {
                    nextButton.click();
                }
                clearTimeout(timeout);
            })

        }

    });

    // 监听整个文档的变化
    observer.observe(document.querySelector('.explore-main'), { childList: true, subtree: true });


    function handlerSingleMovie(titleElement) {
        // 检查标题是否存在
        if (titleElement) {
            var title = titleElement.innerText.replace(regex, '');

            // 检查标题是否包含被屏蔽的关键词
            if (containsBlockedKeyword(title)) {
                // 隐藏影视列表项
                deleteMovie(titleElement, title);
                return;
            }
        }
        // 创建删除按钮元素
        createDeleteButton(titleElement, title);
    }
    // 检查标题是否包含被屏蔽的关键词
    function containsBlockedKeyword(title) {
        return deletedMovies.has(title);
    }
    // 删除对应的词条
    function deleteMovie(dom, title) {
        deletedMovies.add(title);
        localStorage.setItem('deletedMovies', JSON.stringify(Array.from(deletedMovies)));
        dom.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }

    function createDeleteButton(titleElement, title) {
        var deleteButton = document.createElement('button');
        deleteButton.innerText = '[ X ]';
        deleteButton.style.marginRight = '5px';
        deleteButton.style.background = 'transparent';
        deleteButton.style.border = 'none';
        deleteButton.style.color = '#999';
        deleteButton.style.cursor = 'pointer';
        // 为删除按钮添加点击事件监听器
        deleteButton.addEventListener('click', function (event) {
            event.preventDefault();
            // 隐藏当前影视列表项
            deleteMovie(titleElement, title);
        });

        // 在标题左侧插入删除按钮
        titleElement.parentNode.insertBefore(deleteButton, titleElement);
    }

    // 监听滚动事件
    // var loading = false; // 是否正在加载下一页数据
    // window.addEventListener('scroll', function () {
    //     // 当页面滚动到底部附近时
    //     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && !loading) {
    //         clickLoading()
    //     }
    // });

    // 模拟点击下一页按钮
    function clickLoading() {
        if (loading) {
            return
        }
        // 模拟点击下一页按钮
        var nextButton = document.querySelector('#app > div > div.explore-main > div > button');
        if (nextButton) {
            loading = true;
            nextButton.click();
            setTimeout(function () {
                loading = false;
            }, 1000); // 1秒延迟，可根据实际情况调整
        }
    }
})();
