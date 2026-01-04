// ==UserScript==
// @name         Wikidot toolbox
// @namespace    http://wikidot.com/
// @version      1.10
// @description  something written to help myself surf wikidot world
// @author       Fyratree
// @match        *://*.wikidot.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikidot.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/457361/Wikidot%20toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/457361/Wikidot%20toolbox.meta.js
// ==/UserScript==

/* ---------------------------------------------------------------- */
// 谁能想到这最初只是一个有几个快速代码的小工具？
// !!!!运行时期请设置为document.body，屏蔽效果最佳!!!!
/* ---------------------------------------------------------------- */

(function () {
    'use strict';

    /* ---------------------------------------------------------------- */

    // https://blog.csdn.net/csu_passer/article/details/98471944

    /** @type {(string) => Element} */
    const $ = document.querySelector.bind(document)

    /** @type {(string) => NodeList} */
    const $$ = document.querySelectorAll.bind(document)

    const $log = console.log

    const pageLog = (text) => {
        $('#wdtools-logs').appendChild(document.createTextNode(text + '\n'))
    }

    unsafeWindow.pageLog = pageLog

    const isParent = (obj, parentObj) => {
        while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
            if (obj == parentObj) {
                return true;
            }
            obj = obj.parentNode;
        }
        return false;
    }

    // https://blog.csdn.net/lenny_wants/article/details/116106334

    /* ---------------------------------------------------------------- */
    // 添加样式
    /* ---------------------------------------------------------------- */

    let wdToolsStyleMarker = Math.random().toString(36).slice(2, 10)

    // https://www.w3schools.cn/css/css3_shadows_box.asp

    let styleText =
        `
        /* WDTools Style [${wdToolsStyleMarker}] */
        .wdtools-hidden {
            display: none !important;
        }
        
        .wdtools-bad-element {
            outline: dashed red 5px;
            text-decoration: line-through;
        }
        
        .wdtools-floating-div {
            display: block !important;
            background-color: #f8f9fa;
            padding: 20px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            position: fixed;
            bottom: 50px;
            right: 50px;
            border-radius: 5px;
            font-family: monospace;
            z-index: 1000;
            user-select: none;
        }
        
        .wdtools-anchor-title {
            text-decoration: none;
            color: black;
        }

        #wdtools-logs-pre {
            width: 100%;
            max-height: 5em;
            overflow: scroll;
        }

        .wdtools-grab {
            cursor: grab;
        }
`

    // 我认为用激进样式表来覆盖炸站样式是毫无意义的，因为加了激进样式表以后，页面完全一团乱麻，所以这里只放一些略有副作用的局部样式。

    let superStyle =
        `body {
        display: unset !important;
    }
    
    .page-options-bottom,
    #navi-bar,
    #edit-page-textarea {
        display: unset;
    }`

    GM_addStyle(styleText)

    /* ---------------------------------------------------------------- */
    // 悬浮窗
    /* ---------------------------------------------------------------- */

    let markers = ['[+]', '[-]']

    var mainDiv = document.createElement('div')
    mainDiv.classList.add('wdtools-floating-div')
    mainDiv.classList.add('notranslate')
    mainDiv.innerHTML =
        `<strong class="wdtools-grab">Wikidot Tools</strong>
        <p><a href="javascript:;" id="wdtools-toggle-tools" class="wdtools-anchor-title">${markers[0]} Wikidot功能</a></p>
        <div id="wdtools-tools" class="wdtools-hidden">
            <p>
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.viewSourceClick(event)">源码</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.editClick(event)">编辑</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.historyClick(event)">历史</a>
            </p>
            <p>
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.filesClick(event)">附件</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.editTags(event)">标签</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.backlinksClick(event)">反链</a>
            </p>
            <p>
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.renamePage(event)">改名</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.deletePage(event)">删除</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.editMetaClick(event)">Meta</a>
            </p>
            <p>
                <a href="javascript:;"
                    onclick="WIKIDOT.modules.PageRateWidgetModule.listeners.rate(event, parseInt(prompt('输入：+1→up，-1→down，1~5→评星')))">评分</a>
                |
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.createPageDiscussion(event)">讨论</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.flagPageObjectionable(event)">举报</a>
            </p>
            <p>
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.moreOptionsClick(event)">打开选项</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.siteTools(event)">网站工具</a>
            </p>
            <p>
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.join(event,'now')">直接加入</a> | 
                <a href="javascript:;" onclick="WIKIDOT.page.listeners.join(event,'unified')">申请加入</a>
            </p>
            <p>
                <a href="javascript:;" onclick="WIKIDOT.modules.CloneModule.click(event)">克隆网站</a>
            </p>
        </div>
        <p><a href="javascript:;" id="wdtools-toggle-super" class="wdtools-anchor-title">${markers[0]} WD实验性操作</a></p>
        <div id="wdtools-super" class="wdtools-hidden">
            <p><a href="javascript:;" onclick="WIKIDOT.page.listeners.siteTools(event)">先开网站工具</a></p>
            <p>
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('changes/SiteChangesModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">全站修改</a> | 
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('list/WikiCategoriesModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">全站页面</a>
            </p>
            <p>
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('membership/MembersListModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">全站成员</a> | 
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('wiki/sitesactivity/RecentWPageRevisionsModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">全球修改</a>
            </p>
            <p>
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('forum/ForumRecentPostsModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">最近回帖</a>
            </p>
            <p>
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('wiki/sitesactivity/MostActiveSitesModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">活跃网站</a> | 
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('wiki/sitesactivity/MostActiveForumsModule', null, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">活跃论坛</a>
            </p>
            <p><a href="javascript:;" onclick="OZONE.ajax.requestModule('list/ListPagesModule', {module_body:
\`
[[include \${location.pathname.slice(1)}]]
\`, limit:'1'}, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">强看页面</a> | 
                <a href="javascript:;" onclick="OZONE.ajax.requestModule('list/ListPagesModule', {module_body:
\`
[[code]]
[[include \${location.pathname.slice(1)}]]
[[/code]]
\`, limit:'1'}, WIKIDOT.modules.SiteToolsModule.callbacks.setContent)">强查代码</a>
        </p>
        </div>
        <p><a href="javascript:;" id="wdtools-toggle-links" class="wdtools-anchor-title">${markers[0]} 重要页面链接</a></p>
        <div id="wdtools-links" class="wdtools-hidden">
            <p><a href="/start">首页</a> | <a href="/forum:start">论坛</a> | <a href="/_template/noredirect/true">模板</a>
            <p><a href="/component:theme">版式</a> | <a href="/_404/noredirect/true">404</a></p>
            <p><a href="/nav:side/noredirect/true">侧栏</a> | <a href="/nav:top/noredirect/true">顶栏</a></p>
            <p><a href="/nav:_template/noredirect/true">导航栏模板</a></p>
            <p><a href="/${(location.pathname.slice(1).match(/.+(?=:)/) || ['_default'])[0]}:_template/noredirect/true">当前分类模板</a></p>
            <p><a href="/system:list-all-pages">页面</a> | <a href="/system:list-all-categories">分类</a> | <a
                    href="/system:members">成员</a></p>
        </div>
        <p><a href="javascript:;" id="wdtools-toggle-doc" class="wdtools-anchor-title">${markers[0]} WD文档</a></p>
        <div id="wdtools-doc" class="wdtools-hidden">
            <p><a href="http://www.wikidot.com/doc:quick-reference">语法速查</a></p>
            <p><a href="http://www.wikidot.com/doc-modules:start">模块一览</a></p>
            <p><a href="http://www.wikidot.com/doc-wiki-syntax:links#hashmagicuris">魔术链接</a></p>
            <p><a href="http://www.wikidot.com/doc-wiki-syntax:collapsible-blocks">折叠块</a></p>
            <p><a href="http://www.wikidot.com/doc-wiki-syntax:include">Include</a></p>
            <p><a href="http://www.wikidot.com/doc-wiki-syntax:users">用户链接</a></p>
        </div>
        <p><a href="javascript:;" id="wdtools-toggle-func" class="wdtools-anchor-title">${markers[0]} 脚本特殊功能</a></p>
        <div id="wdtools-func" class="wdtools-hidden">\
            <p><a href="javascript:;" id="wdtools-block-element">屏蔽指定元素</a></p>
            <p><a href="javascript:;" id="wdtools-less-css">屏蔽可疑CSS</a></p>
            <p><a href="javascript:;" id="wdtools-no-css">屏蔽所有CSS</a></p>
            <p><a href="javascript:;" id="wdtools-super-css">注入激进样式表</a></p>
            <p><a href="javascript:;" id="wdtools-noredirect">加工链接</a></p>
        </div>
        <pre id="wdtools-logs-pre"><code id="wdtools-logs"></code></pre>
        <p>powered by JS & TM.</p>
`

    // 多亏了我探究那些按钮的源代码，多亏了wikidot没有混淆，多亏了我去GitHub查看的时候，wikidot把所有模块的“路径”甩在https://kgithub.com/gabrys/wikidot/blob/0d0e6e604a47a831ee86ae027272f0faa920ead1/conf/wiki_modules/default.conf

    document.body.appendChild(mainDiv)

    /* ---------------------------------------------------------------- */
    // 屏蔽任意元素功能
    /* ---------------------------------------------------------------- */

    /** @type {Element} */
    let currentElement = null

    /** @type {Element} */
    let lastElement = null

    /** @type {string} */
    let lastOutline

    /** @type {string} */
    let lastTitle

    /** @param {Event} event */
    function trackMouse(event) {
        currentElement = document.elementFromPoint(event.clientX, event.clientY);
        if (currentElement === lastElement) {
            return
        }
        if (lastElement) {
            if (lastOutline) {
                lastElement.style.outline = lastOutline
            } else {
                lastElement.style.removeProperty('outline')
            }
            if (lastTitle) {
                lastElement.style.title = lastTitle
            } else {
                lastElement.style.removeProperty('title')
            }
        }
        lastOutline = currentElement.style.outline
        lastTitle = currentElement.title
        lastElement = currentElement
        currentElement.style.outline = 'dashed red 5px'
        currentElement.title = currentElement.outerHTML
    }

    function cancel(e_) {
        e_.preventDefault()
        $('#wdtools-block-element').onclick = startTrack
        lastElement = currentElement
        if (lastOutline) {
            lastElement.style.outline = lastOutline
        } else {
            lastElement.style.removeProperty('outline')
        }
        if (lastTitle) {
            lastElement.title = lastTitle
        } else {
            lastElement.removeProperty('title')
        }
        document.removeEventListener('mousemove', trackMouse)
        $('#wdtools-block-element').disabled = false
        currentElement = null
        lastElement = null
    }

    function startTrack(e) {
        $('#wdtools-block-element').onclick = cancel
        document.addEventListener('click', (e_) => {
            if (isParent(currentElement, mainDiv)) return
            currentElement.classList.add('wdtools-hidden')
            document.removeEventListener('mousemove', trackMouse)
            $('#wdtools-block-element').disabled = false
            currentElement = null
            lastElement = null
            $('#wdtools-block-element').onclick = startTrack
        })
        document.addEventListener('contextmenu', cancel)
        document.addEventListener('mousemove', trackMouse)
    }

    $('#wdtools-block-element').onclick = startTrack

    /* ---------------------------------------------------------------- */
    // 屏蔽样式表功能
    /* ---------------------------------------------------------------- */

    $('#wdtools-less-css').onclick = () => {
        let styles = document.head.querySelectorAll('style')

        for (let el of styles) {
            if (el.innerHTML.match(/(display\s*:\s*none)|[1-9][0-9]{5,}/) && !el.innerHTML.match(wdToolsStyleMarker)) {
                el.outerHTML = el.outerHTML.replace(/^<style/, '<wdtools-blocked-style').replace(/<\/style>$/, '</wdtools-blocked-style>')
                $log('[Wikidot Toolbox] Style detected and blocked: ', el)
                pageLog('LessCSS.')
            }
        }
    }

    $('#wdtools-no-css').onclick = () => {
        let styles = document.head.querySelectorAll('style')

        for (let el of styles) {
            if (!el.innerHTML.match(wdToolsStyleMarker)) {
                el.outerHTML = el.outerHTML.replace(/^<style/, '<wdtools-blocked-style').replace(/<\/style>$/, '</wdtools-blocked-style>')
                $log('[Wikidot Toolbox] Style detected and blocked: ', el)
                pageLog('NoCSS.')
            }
        }
    }

    $('#wdtools-noredirect').onclick = () => {
        window.open(prompt() + '/noredirect/true', '_blank')
    }

    /* ---------------------------------------------------------------- */
    // 注入激进样式表功能
    /* ---------------------------------------------------------------- */

    $('#wdtools-super-css').onclick = () => {
        GM_addStyle(superStyle)
        GM_addStyle(styleText)
    }

    /* ---------------------------------------------------------------- */
    // 折叠菜单功能
    /* ---------------------------------------------------------------- */

    /**
     * @param {Element} el 
     */
    function toggle(el) {
        let div2 = el.parentElement.nextElementSibling
        if (div2.classList.contains('wdtools-hidden')) {
            div2.classList.remove('wdtools-hidden')
            el.innerHTML = markers[1] + el.innerHTML.slice(3)
        } else {
            div2.classList.add('wdtools-hidden')
            el.innerHTML = markers[0] + el.innerHTML.slice(3)
        }
    }

    mainDiv.querySelectorAll('.wdtools-anchor-title').forEach((title) => {
        title.onclick = (e) => {
            mainDiv.querySelectorAll('p > a.wdtools-anchor-title').forEach((el) => {
                if (el == e.target) {
                    toggle(el)
                } else if (!el.parentElement.nextElementSibling.classList.contains('wdtools-hidden')) {
                    toggle(el)
                }
            })
        }
    })

    /* ---------------------------------------------------------------- */
    // 拖拽功能
    /* ---------------------------------------------------------------- */

    $('.wdtools-grab').addEventListener('mousedown', (e) => {
        e.target.style.cursor = 'grabbing'
        let x = e.pageX - mainDiv.offsetLeft;
        let y = e.pageY - mainDiv.offsetTop;
        let move = (e_) => { // 算式是瞎几把试出来的
            mainDiv.style.right = 'calc(' +
                Math.max(Math.min((window.innerWidth - e_.pageX + x - mainDiv.clientWidth), window.innerWidth - mainDiv.clientWidth), 0) +
                'px - 100vw + 100%)' // 抵消滚动条影响
            mainDiv.style.bottom = 'calc(' +
                Math.max(Math.min((window.innerHeight - e_.pageY + y - mainDiv.clientHeight), window.innerHeight - mainDiv.clientHeight), 0) +
                'px - 100vh + 100%)'
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', (e) => {
            document.removeEventListener('mousemove', move);
            $('.wdtools-grab').style.cursor = 'grab'
        });
    })
    //https://blog.csdn.net/abcquan123/article/details/108218073

    /* ---------------------------------------------------------------- */
    // 屏蔽span、div、炸站样式功能
    /* ---------------------------------------------------------------- */

    // 虽然也屏蔽了单纯的隐藏工具栏，但是我绝无说必要的隐藏工具栏是badcss的意思。只是这个函数最早针对的是炸站样式。

    function fuckBadElements() {
        let spansAndDivs = document.querySelectorAll('#container span, #container mainDiv')

        for (let el of spansAndDivs) {
            if ((el.style.position == 'fixed' || el.style.position == 'absolute') && el.style.zIndex > 0) {
                el.style.position = 'unset'
                el.classList.add('wdtools-bad-element')
                el.title = '[Wikidot Toolbox] Bad element detected.'
                $log('[Wikidot Toolbox] Bad element detected: ', el)
                pageLog('Bad element.')
            }
        }

        let styles = document.head.querySelectorAll('style')

        for (let el of styles) {
            if (el.innerHTML.match(/((((body|html|:root|#main-content|#page-content|#page-options-container|#edit-page-textarea)\s*>?\s*\*?)|(\*))\s*\{\s*display\s*:\s*none\s*(!important)?\s*;?\s*\})|-webkit-perspective|((((body|html|:root)\s*>?\s*\*?)|(\*))\s*\{\s*-webkit-transform\s*:\s*.*\s*(!important)?\s*;?\s*\})|(Untitled-12tileable.png)|\*:(before|after)/)) {
                el.outerHTML = el.outerHTML.replace(/^<style/, '<wdtools-blocked-style').replace(/<\/style>$/, '</wdtools-blocked-style>')
                $log('[Wikidot Toolbox] Bad style detected: ', el)
                pageLog('BadCSS.')
            }
        }

    }

    let observer = new MutationObserver(fuckBadElements);
    const config = { childList: true }
    observer.observe(document.body, config)

    /* ---------------------------------------------------------------- */

    $log('Wikidot Toolbox Loaded.')
})();