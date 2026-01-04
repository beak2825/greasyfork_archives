// ==UserScript==
// @name        CSDN净化
// @namespace    1637766030@qq.com
// @version      0.1
// @description  CSDN看文章时的美化脚本
// @author      POMIN
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://*.iteye.com/blog/*
// @icon      https://pic.imgdb.cn/item/5ea44be9c2a9a83be506b59c.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406649/CSDN%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406649/CSDN%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==
// 自定义去广告
////////////////////////////////////////////////////////////QQ：1637766030一个JavaScript初学者，希望大佬指点/////////////////////////////////////////////////
(function() {
    'use strict';
    function clearLoop() {// 清理函数
        for (var num=0;num<10;num++) {//清理一百次
            var fuck_id = [];//在这里写要去除的网页元素Id
            var fuck_class = [];//在这里写要去除的网页元素的class
            for (var i = 0; i < fuck_class.length; i++) {//根据class删除HTML元素
                //console.log(document.getElementsByClassName(fuck_class[i])[0]);//控制台输出（调试用的）
                if (document.getElementsByClassName(fuck_class[i])[0] !== undefined){//存在即删除
                    document.getElementsByClassName(fuck_class[i])[0].remove();
                }
            }
            for (i = 0; i < fuck_id.length; i++) {//根据id删除HTML元素
                //console.log(document.getElementById(fuck_id[i]));//控制台输出（调试用的）
                if (document.getElementById(fuck_id[i]) !== null){//存在即删除
                    document.getElementById(fuck_id[i]).remove();
                }
            }
        }
    }
    // 添加css
    function addStyle(css) {
        var style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }
      addStyle('#rightAside, .operating, .c-gray, .un-collection, .read-count, .article-read-img, .article-type-img, .hide-article-box, .blog-expert-recommend-box, .recommend-item-box.type_hot_word, .recommend-ad-box, .isGreatIcon, .tool-box, .meau-gotop-box, .recommend-end-box, .login-mark, .blog_title_box.oneline, .recommend-item-box::before, .pulllog-box, #mainBox > aside, .recommend-box, .template-box, .more-toolbox,  .right-message,.pub_fo.footer-box.bottom-pub-footer,.main-login, .identity-icon, .show-txt, .title .flag, #passportbox, .column-advert-box, .article-plan-img, .article-plan-text, .up-time, .article-vip-img, .article-vip-text,\n' +
            '.leftPop{\n' +
            '    display: none!important;\n' +
            '}\n' +
            '.csdn-toolbar{\n' +
            '    background:#ffffffc4;\n' +
            '}\n' +
            '.main_father{\n' +
            '    padding:20px!important;\n' +
            '}\n' +
            '/* 我的 */\n' +
            'body {\n' +
            '    font-family: source-han-serif-tc, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif!important;\n' +
            '    min-width: unset;\n' +
            '    background: none!important;\n' +
            '    background-color: rgba(10, 10, 10, 0.8)!important;\n' +
            '}\n' +
            '.h1, .h2, .h3, .h4, .h5, .h6, a, abbr, body, cite, dd, dl, dt, h1, h2, h3, h4, h5, h6, iframe, input, li, object, ol, p, pre, span, ul {\n' +
            '    font-family: source-han-serif-tc, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif!important;\n' +
            '}\n' +
            'code, pre, code span, pre span {\n' +
            '    font-family:"Source Code Pro", Monaco, Menlo, Consolas, monospace!important;\n' +
            '}\n' +
            '#article_content {\n' +
            '    height: auto!important;\n' +
            '}\n' +
            '#mainBox {\n' +
            '    margin-left: auto;\n' +
            '    margin-right: auto;\n' +
            '    width: 60%;\n' +
            '}\n' +
            '#mainBox > main {\n' +
            '    display: block!important;\n' +
            '    float: none;\n' +
            '    width: 100%;\n' +
            '}\n' +
            '.recommend-item-box {\n' +
            '    width: 50%;\n' +
            '    max-width: 25rem;\n' +
            '}\n' +
            '.recommend-item-box .content, .recommend-item-box h4 {\n' +
            '    width: 100%!important;\n' +
            '}\n' +
            'a[data-type=\'cs\'], a[data-type=\'report\'], a[data-type=\'app\'] {\n' +
            '    display: none!important;\n' +
            '}\n' +
            '.blog-content-box {\n' +
            '    border-radius: 10px!important;\n' +
            '    padding: 70px 70px 70px 70px!important;\n' +
            '    \n' +
            '    box-shadow: -2px -2px 25px #6666668c;\n' +
            '}');
    setTimeout(clearLoop, 2500);// 延迟清理一次
    window.addEventListener('load', clearLoop, true);// 加载完清理一次

})();