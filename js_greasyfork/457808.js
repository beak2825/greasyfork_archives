// ==UserScript==
// @name         ahhhhfs链接优化
// @namespace    http://tampermonkey.net/
// @version      0.17.1
// @description  优化页面跳转链接
// @author       silvio27
// @match        https://*.ahhhhfs.com/*
// @match        https://nsfw.abskoop.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL

// @downloadURL https://update.greasyfork.org/scripts/457808/ahhhhfs%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/457808/ahhhhfs%E9%93%BE%E6%8E%A5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.href.includes("nsfw")) {
        let sections = document.getElementsByClassName("section")
        for (let i = 1; i < sections.length-1; i++) {
            sections[i].style.display = "none"
        }
    // removeByClassName("home-cat-nav-wrap")
    // removeByClassName("ripro_gg_wrap pc")
    }


    // removeByClassName("module posts-wrapper post-cms")
    // removeByClassName("section rizhuti_v2-widget-catbox-carousel")
    // removeByClassName("section rizhuti_v2-widget-division")
    // removeByClassName("col-lg-auto col-sm-12 home-cat-nav")
    // removeByClassName("col-lg col-sm-12")
    // removeByClassName()
    window.scroll(0,500)


    const removeOnCopy = function () {
        // 移除 "转载请注明来源，本文来自:"
        document.oncopy = function () {
            console.log("Remove oncopy")
        }
    }

    const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    wait(500).then(() => removeOnCopy())


    // 移除 "转载请注明来源，本文来自:"
    window.onload = () => {
        removeOnCopy()
    }

    var pp = document.getElementsByTagName('p')
    for (let i of pp) {
        let ss = i.innerText

        //如有需要合并下面两个判断
        if (ss.includes('文字和括号')) {
            let cnPattern = /\(删掉文字和括号(复制到){0,1}浏览打开\)/
            let newText = ss.replaceAll(cnPattern, '')
            addLinkInPage(i, newText)
        }

        // 默认自动删除
        if (ss.includes('表情')) {
            let emojiReg = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|[\ud800-\udbff]|[\udc00-\udfff]/g;
            let newText = ss.replaceAll(emojiReg, '')
            addLinkInPage(i, newText, 1)
        }


        if (ss.includes('空格')){
            let kongge = /[ ]/g;
            let newText = ss.replaceAll(kongge, '')
            addLinkInPage(i, newText, 1)

        }

        SetOpenLinkInSelf(i)
    }


    function addLinkInPage(html, text, autoClick = 0, color = 'gold') {
        html.innerHTML = text + '<br>'
        let temp_link = document.createElement("a");
        let UrlPattern = /(http|magnet).+/
        let hrefurl = text.match(UrlPattern)
        console.log(hrefurl[0])
        temp_link.href = hrefurl[0];
        temp_link.innerHTML = "点击：" + hrefurl[0];
        temp_link.style.background = color
        html.appendChild(temp_link);

        if (autoClick) {
            temp_link.target = '_blank'
            temp_link.click()
        }
    }

    function SetOpenLinkInSelf(target) {
        let aTag = target.getElementsByTagName('a')
        for (let i of aTag) {
            i.target = '_self'
        }
    }


    // ===== Remove Unnecessary Element =====

    function removeByClassName(className) {
        try {
            let item = document.getElementsByClassName(className)
            for (let i of item) {
                i.style.display = 'none'
            }
        } catch (err) {
            console.log(className + ':' + err.message)
        }
        return 'Done'

    }

    function removeById(idName) {
        try {
            let item = document.getElementById(idName)
            // item.style.display = 'none'
            item.remove()
        } catch (err) {
            console.log(idName + ':' + err.message)
        }
        return 'Done'

    }

    function removeParts(list, f) {
        for (let i of list) {
            f(i)
        }
    }

    let removeClassNames = ['site_abc_wrap top', 'site_abc_wrap bottum',
        'sidebar-column', 'entry-navigation', 'related-posts', 'entry-share',
        'footer-widget', 'footer-copyright', 'comment-respond', 'site-footer',
        'ripro_gg_wrap', 'rollbar', 'module parallax', 'article-footer',
        'article-copyright', 'related-posts-grid']

    let removeIds = ['related_posts', 'jp-relatedposts']

    // removeParts(removeClassNames, removeByClassName);
    // removeParts(removeIds, removeById);

})();
