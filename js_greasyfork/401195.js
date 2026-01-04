// ==UserScript==
// @name         buledoc 迁移助手
// @namespace    buledoc migratory helper
// @version      0.6
// @description  try to copy content from bluedoc to confluence!
// @author       rwt
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @include      *://book.5th.im/*
// @include      *://docs.longbridge-inc.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/401195/buledoc%20%E8%BF%81%E7%A7%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/401195/buledoc%20%E8%BF%81%E7%A7%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;
    function generateMigrateHelper() {
        var saveTitle = $('<button id="migrate-helper">存档标题</button>')
        var button = $('<button id="migrate-helper">存档内容</button>')
        saveTitle.on('click', function() {
            GM_setClipboard($('.doc-title').text(), 'text')
            alert('存档标题成功')
        })
        button.on('click', function() {
            $('.markdown-with-toc .heading-anchor').remove()
            $('.markdown-with-toc embed').remove()
            $('.markdown-with-toc div > img').each(function() {
                var div = $(this).parent()
                var html = $('<p>').append(div.contents())
                div.replaceWith(html)
            })
            $('.markdown-with-toc img').each(function() {
                var img = $(this).get(0)
                if (img.naturalWidth > 1200) {
                    img.width = 1024
                    img.height = 1024 * img.naturalHeight / img.naturalWidth
                }
            })
            $('.markdown-with-toc pre').each(function() {
                var codeHTML = $(this).html()
                var preHTML = '<table class="wysiwyg-macro" data-macro-name="code" data-macro-id="3671a31b-904e-4bb4-9475-615d6136642b" data-macro-parameters="language=bash" data-macro-schema-version="1" style="background-image: url(https://docs.longbridge-inc.com/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9YmFzaH0&amp;locale=zh_CN&amp;version=2); background-repeat: no-repeat;" data-macro-body-type="PLAIN_TEXT"><tbody><tr><td class="wysiwyg-macro-body"><pre>'+ codeHTML +'</pre></td></tr></tbody></table>'
                $(this).replaceWith(preHTML)
            })
            var oldHTML = $('.markdown-with-toc').html()
            var newHTML = oldHTML
            //.replace(/<pre([^<>]*)>(((?!pre).)*)<\/pre>/ig, '<table class="wysiwyg-macro" data-macro-name="code" data-macro-id="3671a31b-904e-4bb4-9475-615d6136642b" data-macro-parameters="language=bash" data-macro-schema-version="1" style="background-image: url(https://docs.longbridge-inc.com/plugins/servlet/confluence/placeholder/macro-heading?definition=e2NvZGU6bGFuZ3VhZ2U9YmFzaH0&amp;locale=zh_CN&amp;version=2); background-repeat: no-repeat;" data-macro-body-type="PLAIN_TEXT"><tbody><tr><td class="wysiwyg-macro-body"><pre>$2</pre></td></tr></tbody></table>')
            //.replace(/<img ([^<>]*)>/ig, '<img $1 width="600" height="600" alt="image.png">')
            .replace(/<img src="\/([^"]*)" ([^<>]*)>/ig, '<img src="https://book.5th.im/$1" $2 >')
            .replace(/<a class="attachment-file" ([^<>]*) href="\/([^"]*)">/ig, '<a class="attachment-file" $1 href="https://book.5th.im/$2">')
            //.replace(/<div ([^<>]*)><img (((?!div).)*)<\/div>/ig, '<p $1><img $2</p>')
            GM_setClipboard(newHTML, 'html')
            console.log(newHTML)
            alert('存档内容成功')
        })
        if ($('.markdown-with-toc').length > 0 && $('#migrate-helper').length <= 0) {
            $('.doc-center').prepend(saveTitle, button)
        }
    }
    generateMigrateHelper()
    setInterval(function() {
        generateMigrateHelper()
    }, 1000)
    // Your code here...
})();