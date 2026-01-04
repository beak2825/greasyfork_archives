// ==UserScript==
// @name         NGA优化摸鱼体验插件-移动端支持
// @namespace    https://github.com/lifegpc/userscript/tree/master/NGA_BBS_plugins/MobileSupport
// @version      1.0.10
// @author       lifegpc
// @description  支持移动端页面
// @license      MIT
// @match        *://bbs.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://nga.178.com/*
// @match        *://g.nga.cn/*
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  content
// @downloadURL https://update.greasyfork.org/scripts/487906/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/487906/NGA%E4%BC%98%E5%8C%96%E6%91%B8%E9%B1%BC%E4%BD%93%E9%AA%8C%E6%8F%92%E4%BB%B6-%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function (registerPlugin) {
    'use strict';
    const MobileSupport = {
        name: 'MobileSupport',
        title: '移动端支持',
        desc: '支持移动端页面',
        settings: [{
            key: 'showPostReadingRecord',
            title: '显示帖子浏览记录标记',
            default: false
        },
        {
            key: 'authorMark',
            title: '标记楼主',
            default: true
        },
        {
            key: "showRemark",
            title: "显示标签",
            default: true
        }],
        buttons: [],
        beforeSaveSettingFunc(settings) {
            const postReadingRecord = this.mainScript.getModule('PostReadingRecord');
            if (!postReadingRecord && settings['showPostReadingRecord']) {
                return '请先安装帖子浏览记录插件';
            }
        },
        initFunc() {
            if (typeof this.pluginSettings['showPostReadingRecord'] === 'string') {
                this.pluginSettings['showPostReadingRecord'] = false;
            }
            if (typeof this.pluginSettings['authorMark'] === 'string') {
                this.pluginSettings['authorMark'] = true;
            }
            if (typeof this.pluginSettings['showRemark'] === 'string') {
                this.pluginSettings['showRemark'] = true;
            }
        },
        currentThread: {},
        async renderThreadsFunc($el) {
            if (this.pluginSettings['showPostReadingRecord']) {
                const postReadingRecord = this.mainScript.getModule('PostReadingRecord');
                if (postReadingRecord) {
                    const markStyle = `color: ${postReadingRecord.pluginSettings['markColor']}; opacity: ${parseInt(postReadingRecord.pluginSettings['markOpacity']) / 100};`
                    const $a = $el.find('.c2 .replies');
                    const tid = this.mainScript.getModule('AuthorMark').getQueryString('tid', $a.attr('href'))
                    const currentCount = parseInt($a.text())
                    const record = await postReadingRecord.store.getItem(tid)
                    const recordCount = record?.lastReadCount || -1
                    if (record) {
                        $el.find('.c2 > a').attr('style', markStyle)
                    }
                    if (postReadingRecord.pluginSettings['replyCountEnable'] && recordCount > -1 && currentCount > recordCount) {
                        $el.find('.c2 > span[id^=t_pc]').append(`<span class="hld__new-reply-count-${postReadingRecord.pluginSettings['replyCountStyle']}">${currentCount - recordCount}</span>`)
                    }
                    this.currentThread[tid] = { currentCount }
                }
            }
        },
        async renderFormsFunc($el) {
            let e = $el.find(".c1");
            let es = window.getComputedStyle(e[0], null);
            if (es.display !== 'none') return;
            if (this.pluginSettings['showPostReadingRecord']) {
                const postReadingRecord = this.mainScript.getModule('PostReadingRecord');
                if (postReadingRecord) {
                    const tid = this.mainScript.getModule('AuthorMark').getQueryString('tid');
                    const currentLineNo = parseInt($el.find('.postinfot.postoptswb').text().split('#')[1]);
                    const currentLineAnchor = $el.find('.postinfot.postoptswb').attr('href').split('#')[1]
                    const maxReadCount = Math.max((this.currentThread?.[tid]?.currentCount || -1), currentLineNo)
                    const record = await postReadingRecord.store.getItem(tid)
                    if (!record || maxReadCount > record.lastReadCount) {
                        await postReadingRecord.store.setItem(tid, {
                            lastReadCount: maxReadCount,
                            lastReadLineNo: currentLineNo,
                            lastReadLineAnchor: currentLineAnchor,
                            lastReadTime: Math.ceil(new Date().getTime() / 1000)
                        })
                    }
                }
            }
            if (this.pluginSettings['authorMark']) {
                const $ = this.mainScript.libs.$;
                const authorMark = this.mainScript.getModule('AuthorMark');
                if (authorMark) {
                    const author = $('#postauthor0.userlink').text().replace('楼主', '');
                    const tid = authorMark.getQueryString('tid')
                    const authorStr = `${tid}:${author}`
                    if (author && !authorMark.postAuthor.includes(authorStr) && ['authorid=', 'pid='].every(k => !window.location.href.includes(k))) {
                        authorMark.postAuthor.unshift(authorStr) > 10 && authorMark.postAuthor.pop()
                        this.mainScript.setValue('hld__NGA_post_author', authorMark.postAuthor.join(','))
                    }
                    $el.find('a.b').each(function () {
                        const name = $(this).attr('hld-mark-before-name') || $(this).text().replace('[', '').replace(']', '')
                        if (name && authorMark.postAuthor.includes(`${tid}:${name}`)) {
                            $(this).append('<span class="hld__post-author">楼主</span>')
                        }
                    })
                }
            }
            if (this.pluginSettings['showRemark']) {
                const $ = this.mainScript.libs.$;
                const markAndBan = this.mainScript.getModule('MarkAndBan');
                if (markAndBan) {
                    $el.find('a.b').each(function () {
                        const name = $(this).attr('hld-mark-before-name') || $(this).text().replace('[', '').replace(']', '')
                        const uid = ($(this).attr('href') && $(this).attr('href').indexOf('uid=') > -1) ? $(this).attr('href').split('uid=')[1] + '' : ''
                        const marks = markAndBan.getUserMarks({ name, uid })
                        if (marks) {
                            let marksDom = ''
                            marks.marks.forEach(item => marksDom += `<span ${item.desc ? 'class="hld__help hld__post-author" help="' + item.desc + '"' : 'class="hld__post-author"'} style="color: ${item.text_color};background-color: ${item.bg_color};">${item.mark}</span>`);
                            $(this).after(marksDom);
                        }
                    })
                }
            }
            {
                const $ = this.mainScript.libs.$;
                const markAndBan = this.mainScript.getModule('MarkAndBan');
                if (markAndBan) {
                    const currentUid = $el.find("a.userlink").attr("href").split("uid=")[1] + '';
                    const currentName = $el.find("a.userlink")[0].innerText.replace('楼主', '');
                    $el.find(".posterInfoLineB").each(function () {
                        $(this).prepend(`<a class="cell rep b txtbtnx nobr block_txt_big postbtmb hld__extra-icon hld__mobile_extra-icon" data-type="mark" title="标签此用户" data-name="${currentName}" data-uid="${currentUid}"><svg t="1686732786072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2385"><path d="M900.64 379.808l-263.072-256.032c-36.448-35.328-105.76-35.392-142.304 0.096l-327.04 319.904c-56.416 54.72-70.72 76.704-70.72 150.976l0 143.936c0 132.768 26.976 192 186.912 192l131.872 0c81.12 0 128.448-46.656 193.952-111.264l290.016-297.696c18.592-17.984 29.248-43.968 29.248-71.264C929.504 423.36 918.976 397.6 900.64 379.808zM323.008 786.752c-52.928 0-96-43.072-96-96s43.072-96 96-96 96 43.072 96 96S375.936 786.752 323.008 786.752z" fill="#3970fe" p-id="2386" data-spm-anchor-id="a313x.7781069.0.i0" class="selected"></path></svg></a><a class="cell rep b txtbtnx nobr block_txt_big postbtmb hld__extra-icon hld__mobile_extra-icon" title="拉黑此用户(屏蔽所有言论)" data-type="ban" data-name="${currentName}" data-uid="${currentUid}"><svg t="1686733137783" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12682"><path d="M512 0a512 512 0 1 0 0 1024 512 512 0 0 0 0-1024zM204.8 409.6h614.4v204.8H204.8V409.6z" fill="#d00309" p-id="12683" data-spm-anchor-id="a313x.7781069.0.i10" class="selected"></path></svg></a>`)
                    })
                }
            }
        },
        style: `.hld__mobile_extra-icon {
            background-color: transparent;
            margin: 0px;
            border-left-width: 0px;
            border-left-style: solid;
            border-color: inherit;
            padding: 0.625em 1.2em;
            line-height: 1.8em;
            display: inline-block;
        }
        .hld__mobile_extra-icon svg {
            height: 1.8em;
            width: 1.3em;
        }`
    }
    registerPlugin(MobileSupport)

})(function (plugin) {
    plugin.meta = GM_info.script
    unsafeWindow.ngaScriptPlugins = unsafeWindow.ngaScriptPlugins || []
    unsafeWindow.ngaScriptPlugins.push(plugin)
});
