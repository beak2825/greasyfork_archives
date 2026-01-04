// ==UserScript==
// @name         copy_jianshu
// @namespace    https://github.com/techstay/myscripts
// @version      0.2
// @description  将简书文章复制到csdn、思否和慕课网编辑器中
// @author       techstay
// @match        https://editor.csdn.net/md/
// @match https://segmentfault.com/write
// @match https://www.jianshu.com/writer
// @match https://www.imooc.com/article/publish
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @require      https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant unsafeWindow
// @grant GM_setClipboard
// @grant window.close
// @grant window.focus
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/401837/copy_jianshu.user.js
// @updateURL https://update.greasyfork.org/scripts/401837/copy_jianshu.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const SF_URL = 'https://segmentfault.com/write'
    const CSDN_URL = 'https://editor.csdn.net/md/'
    const JIANSHU_URL = 'https://www.jianshu.com'
    const IMOOC_URL = 'https://www.imooc.com/article/publish'
    const SF_TITLE = 'sf_title'
    const SF_CONTENT = 'sf_content'
    const CSDN_TITLE = 'csdn_title'
    const CSDN_CONTENT = 'csdn_content'
    const IMOOC_TITLE = 'imooc_title'
    const IMOOC_CONTENT = 'imooc_content'

    function saveArticle() {
        // 从简书网页保存，准备在其他网页执行复制
        GM_setValue(CSDN_TITLE, $('._24i7u').val())
        GM_setValue(CSDN_CONTENT, $('#arthur-editor').val())
        GM_setValue(SF_TITLE, $('._24i7u').val())
        GM_setValue(SF_CONTENT, $('#arthur-editor').val())
        GM_setValue(IMOOC_TITLE, $('._24i7u').val())
        GM_setValue(IMOOC_CONTENT, $('#arthur-editor').val())
    }

    function copyToCsdn() {
        var title = GM_getValue(CSDN_TITLE, '')
        var content = GM_getValue(CSDN_CONTENT, '')
        if (title != '' && content != '') {
            $('.article-bar__title').delay(1000).queue(function () {
                $('.article-bar__title').val(title)
                $('.editor__inner').text(content)
                GM_deleteValue(CSDN_TITLE)
                GM_deleteValue(CSDN_CONTENT)
                $(this).dequeue()
            })
        }
    }

    function copyToSegmentFault() {
        var title = GM_getValue(SF_TITLE, '')
        var content = GM_getValue(SF_CONTENT, '')
        if (title != '' && content != '') {
            $('#title').delay(1000).queue(function () {
                $('#title').val(title)
                GM_setClipboard(content, 'text')
                GM_deleteValue(SF_TITLE)
                GM_deleteValue(SF_CONTENT)
                $(this).dequeue()
            })
        }
    }

    function copyToImooc() {
        var title = GM_getValue(IMOOC_TITLE, '')
        var content = GM_getValue(IMOOC_CONTENT, '')
        if (title != '' && content != '') {
            $('input#article_title').delay(1000).queue(function () {
                // 先切换到MD编辑器
                $('span.js-change-editor[data-type="0"]').click()
                $('input#article_title').val(title)
                GM_setClipboard(content, 'text')
                GM_deleteValue(IMOOC_TITLE)
                GM_deleteValue(IMOOC_CONTENT)
                $(this).dequeue()
            })

        }
    }

    function addCopyButton() {
        $('body').append('<div id="copyToCS">双击复制到CSDN思否和慕课网</div>')
        $('#copyToCS').css('width', '250px')
        $('#copyToCS').css('position', 'absolute')
        $('#copyToCS').css('top', '70px')
        $('#copyToCS').css('left', '350px')
        $('#copyToCS').css('background-color', '#28a745')
        $('#copyToCS').css('color', 'white')
        $('#copyToCS').css('font-size', 'large')
        $('#copyToCS').css('z-index', 100)
        $('#copyToCS').css('border-radius', '25px')
        $('#copyToCS').css('text-align', 'center')
        $('#copyToCS').dblclick(function () {
            saveArticle()
            GM_openInTab(SF_URL, true)
            GM_openInTab(CSDN_URL, true)
            GM_openInTab(IMOOC_URL, true)
        })
        $('#copyToCS').draggable()
    }

    $(document).ready(function () {
        if (window.location.href.startsWith(JIANSHU_URL)) {
            addCopyButton()
        } else if (window.location.href.startsWith(SF_URL)) {
            copyToSegmentFault()
        } else if (window.location.href.startsWith(CSDN_URL)) {
            copyToCsdn()
        } else if (window.location.href.startsWith(IMOOC_URL)) {
            copyToImooc()
        }
    })
})()