// ==UserScript==
// @name         csdn清爽页面
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  移除CSDN文章页面一些无用信息，只保留文章主体内容
// @author       You
// @include      *://*.csdn.net/*
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/436104/csdn%E6%B8%85%E7%88%BD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/436104/csdn%E6%B8%85%E7%88%BD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除分类专栏列
    const recommend_right = document.querySelector('.recommend-right')
    recommend_right.parentNode.removeChild(recommend_right)

    // 移除作者信息、联系方式、热门文章、最新评论、最新文章列
    const blog_container_aside = document.querySelector('.blog_container_aside')
    blog_container_aside.parentNode.removeChild(blog_container_aside)

    // 居中
    const boxWidth = document.querySelector('.blog-content-box').offsetWidth
    document.querySelector('#mainBox').style.width = boxWidth + 'px'
    const main_father = document.querySelector('.main_father')
    main_father.style.width = '100vw'

    // 移除顶栏
    const csdn_toolbar = document.querySelector('#csdn-toolbar')
    csdn_toolbar.parentNode.removeChild(csdn_toolbar)

    // 移除csdn-side-toolbar
    const csdn_side_toolbar = document.querySelector('.csdn-side-toolbar ')
    csdn_side_toolbar.parentNode.removeChild(csdn_side_toolbar)

    // 免登陆查看评论
    const opt_box = document.querySelector('.comment-list-container .opt-box')
    const comment_list_box = document.querySelector('.comment-list-box')
    opt_box.parentNode.removeChild(opt_box)
    setTimeout(() => {
        comment_list_box.style.maxHeight = '9999px'
    }, 500)

    // 移除作者信息底栏
    const left_toolbox = document.querySelector('.more-toolbox-new .left-toolbox')
    left_toolbox.parentNode.removeChild(left_toolbox)
})();