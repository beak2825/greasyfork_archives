// ==UserScript==
// @name         i-v2ex
// @version      0.68.5
// @description  A better script for v2ex.com
// @author       hundan
// @match        https://*.v2ex.com/t/*
// @require      https://cdn.staticfile.org/showdown/1.8.6/showdown.min.js
// @require      https://cdn.staticfile.org/fancybox/3.3.5/jquery.fancybox.min.js
// @require      https://cdn.staticfile.org/utf8/3.0.0/utf8.min.js
// @require      https://cdn.staticfile.org/highlight.js/9.15.10/highlight.min.js
// @grant        none
// @namespace    https://github.com/hundan2020/i-v2ex
// @downloadURL https://update.greasyfork.org/scripts/369443/i-v2ex.user.js
// @updateURL https://update.greasyfork.org/scripts/369443/i-v2ex.meta.js
// ==/UserScript==

(function () {
    // jquery.js由v2ex自身提供，不再向外部重复请求
    // 预处理以解决与 v2ex plus 的冲突
    $(".reply_content img").each(function(){
        var $this = $(this)
        if ($this[0].src.indexOf(".sinaimg.cn") != -1 && $this[0].src.indexOf("http://") != -1) {
            $this[0].src = "https" + $this[0].src.substr(4)
        }
    })
    // markdown处理
    var preFix = function(rawReply){
        //rawReply = 'content string for debug';
        var picRe = function(reply){
            reply = reply.replace(/(?:!\[.*?\])?!\[.*?\]\(\s*((?:https?)?:\/\/i\.loli\.net\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+.[a-z]+)\s*\)|(https:\/\/i\.loli\.net\/\d{4}\/\d{2}\/\d{2}\/[a-z0-9]+.[a-z]+)/ig, '![]( ' + encodeURI('$1$2') + ' )') // sm.ms
            reply = reply.replace(/(?:!\[.*?\])?!\[.*?\]\(\s*((?:https?)?:\/\/imgurl\.org\/temp\/\d{4}\/[a-z0-9]+\.[a-z0-9]+)\)|(https?:\/\/imgurl\.org\/temp\/\d{4}\/[a-z0-9]+\.[a-z0-9]+)/ig, '![]( ' + encodeURI('$1$2') + ' )') // 小z图床
            reply = reply.replace(/(?<!http:|https:)\/\/([a-z0-9]+\.sinaimg.cn\/(?:[a-z]+)\/[a-z0-9]+\.(?:jpg|png|gif|bmp))/ig, '![]( ' + encodeURI('https://$1') + ' )') // 新浪微博不规则图片链接
            return reply
        }
        var xssFilter = function(reply){
            var sReply = reply
            sReply = sReply.replace(/(!?\[.*?\]\(\s*?javascript.*?\))/igs, '`$1`')
            return sReply
        }
        var fixedReply = rawReply
        fixedReply = fixedReply.replace(/#(\d+)/ig, '&#x23;$1') // 避免楼层号加粗
        fixedReply = fixedReply.replace(/(!\[(\S*?)\]\(\s+?)<a target="_blank" href="(\S+?)".*?><img src="(\S+?)" class="embedded_image".*?><\/a>\)+/ig, '![$2]($3)') // 正常显示的图片处理
        fixedReply = fixedReply.replace(/<img src="(\S+?)" class="embedded_image"[^>]*?>/ig, '![]($1)') // 正常显示的图片处理
        fixedReply = fixedReply.replace(/&lt;img src="(.+?)" \/&gt;/ig, '$1') // 不规则图片链接处理
        fixedReply = fixedReply.replace(/@<a href="\/member\/(\S+?)">(\S+?)<\/a>/ig, '@[$1](/member/$2)') // 论坛内@处理，考虑到代码段中的@应当正常显示
        fixedReply = fixedReply.replace(/<a target="_blank" href="(\/t\/\d+)"\s*?(?:rel="nofollow")?>\/t\/\d+<\/a>/ig, '[$1]($1)') // 论坛内链处理，考虑到在代码段中应当正常显示
        fixedReply = fixedReply.replace(/<a.*? href="(\S+?)".*?>(\S+?)<\/a>/ig, '$2') // 链接处理
        fixedReply = fixedReply.replace(/\[!\[(\S+?)\]\(\s*(\S+?)\)\]\(\s*\S+?\)/ig, '![$1]($2)') // 不规则图片链接处理，不规则案例见 `https://www.v2ex.com/t/463469#r_5792042`
        fixedReply = fixedReply.replace(/!\[\]\(\s*!\[\]\((.+?)\)\s*\)/ig,' ![]($1) ') // 不规则图片链接处理，见 `https://www.v2ex.com/t/608455?p=1#r_8013651`
        fixedReply = fixedReply.replace(/(\n)?<br *\/?>/ig, "\n") // 换行处理，避免多行代码无法正常工作
        fixedReply = fixedReply.replace(/(https?:\/\/[\x00-\xff]+)/ig, '$1 ') // 修正a标签链接，解决中文与链接混用导致的错误解析
        fixedReply = picRe(fixedReply)
        fixedReply = xssFilter(fixedReply)
        return fixedReply
    }
    var endFix = function(markedReply){
        var fixedReply = markedReply
        fixedReply = fixedReply.replace(/\n/ig, '<br />') // markdown软回车转硬回车
        fixedReply = fixedReply.replace(/(<\/ul>|<\/li>|<\/p>|<\/table>|<\/h\d>)\s*<br\s*\/?>/ig, '$1') // 表格换行删除
        fixedReply = fixedReply.replace(/<br\s*\/?>(<li>|<ul>|<p>|<table>|<h\d>)/ig, '$1') // 表格换行删除
        fixedReply = fixedReply.replace(/(<\/?table>|<\/?tbody>|<\/?thead>|<\/?tr>|<\/?th>|<\/?td>)<br\s*\/?>/ig, '$1') // 表格换行删除
        fixedReply = fixedReply.replace(/(<br\s*\/?>\s*){2,}/ig, '<br />') // 多重换行转单行
        fixedReply = fixedReply.replace(/@\[(\S+?)\]\(\/member\/\S+\)/ig, '@$1') // 代码段中的@ 还原
        fixedReply = fixedReply.replace(/\[(\/t\/\d+)\]\(\/t\/\d+\)/ig, '$1') // 代码段中的内链还原
        fixedReply = fixedReply.replace(/&amp;/ig, '&') // 对重复转义的 & 进行还原，而不必对<>进行操作，有效的避免了XSS发生
        return fixedReply
    }
    var processMarkdown = function(){
        $("div.reply_content").each(function () {
            var reply = $(this)[0]
            var rawReply = reply.innerHTML
            var converter = new showdown.Converter({
                omitExtraWLInCodeBlocks: true,
                parseImgDimensions: true,
                simplifiedAutoLink: true,
                literalMidWordUnderscores: true,
                strikethrough: true,
                tables: true,
                ghCodeBlocks: true,
                tasklists: true,
                smoothLivePreview: true,
                ghCompatibleHeaderId: true,
                encodeEmails: true,
                emoji: true
            })
            var markedReply = converter.makeHtml(preFix(rawReply))
            reply.innerHTML = endFix(markedReply)
            reply.className = 'reply_content markdown_body'
            // 开启代码高亮
            hljs.configure({useBR: true})
           $('div.reply_content code').each(function(i, block) {
                hljs.highlightBlock(block)
               $(this).css({'display':'inline'})
            })
        })
    }
    processMarkdown()
    // 加载看图插件
    function loadStyle(url){
        var link = document.createElement('link')
        link.type = 'text/css'
        link.rel = 'stylesheet'
        link.href = url
        var head = document.getElementsByTagName('head')[0]
        head.appendChild(link)
    }
    loadStyle('https://cdn.staticfile.org/fancybox/3.3.5/jquery.fancybox.min.css')
    var a_wrap = $('<a></a>')
    var imgs = $('.markdown_body img, .topic_content img')
    imgs.wrap('<a></a>')
    $.each(imgs, function (i, j) {
        $(j).css({'max-height':'25vh'})
        $(j).parent().attr('id', 'img' + i).attr('href', $(this).attr('src'))
        // 通过延迟解决与v2ex plus的冲突
        setTimeout(function(){
            $("#img" + i).fancybox({
                buttons: [
                    "slideShow",
                    "thumbs",
                    "close"
                ],
                'zoomSpeedIn': 300,
                'zoomSpeedOut': 300,
                'overlayShow': false,
                'overlayOpacity': 0.3
            })
        },500)
    })
    // 添加楼主标记
    let author = $('#Main > div:nth-child(2) > div.header > small > a').text()
    $('table > tbody > tr > td > strong > a').each(function(){
        if ($(this).text() == author){
            var sign = $('<span></span>')
            sign.text('楼主')
            sign.css({"padding": "1px 5px", "margin": "0 6px", "font-size": "x-small", "color": "#777", "border-radius": "8px", "border": "1px solid"})
            $(this).parent().after(sign)
        }
    })
    // 修复新浪外链
    $("img").each(function(){
    })
    window.refererBypass = `
<script src="https://cdn.staticfile.org/jquery/3.4.0/jquery.min.js">
<\/script>
<script>
$(parent.document).find("img").each(function(){
    let img_src = $(this).attr("src")
    let preload_img = \`<img src="\$\{img_src\}" />\`
    document.write(preload_img)
})
$('img').on('load', function () {
	$(parent.document).find('img[src$="'+this.src+'"]').each(function () {
		this.src = this.src
	})
})
<\/script>
`
    // Base64 解码
    $('body').append('<iframe src="javascript:parent.refererBypass;" style="display: none;"></iframe>')
    let style = "ICAgICAgICAuYmFzZTY0OmhvdmVyIHsKICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAjYzBjNGNjOwogICAgICAgIH0KICAgICAgICAuYmFzZTY0OmZvY3VzIHsKICAgICAgICAgICAgb3V0bGluZTogbm9uZTsKICAgICAgICAgICAgYm9yZGVyLWNvbG9yOiAjNDA5ZWZmOwogICAgICAgIH0KICAgICAgICAuYmFzZTY0IHsKCQkJb3ZlcmZsb3c6IGhpZGRlbjsKICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMjU1LCAyNTUpOwogICAgICAgICAgICBiYWNrZ3JvdW5kLWltYWdlOiBub25lOwogICAgICAgICAgICBib3JkZXItYm90dG9tLWNvbG9yOiByZ2IoMTkyLCAxOTYsIDIwNCk7CiAgICAgICAgICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDRweDsKICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1yaWdodC1yYWRpdXM6IDRweDsKICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1zdHlsZTogc29saWQ7CiAgICAgICAgICAgIGJvcmRlci1ib3R0b20td2lkdGg6IDFweDsKICAgICAgICAgICAgYm9yZGVyLWltYWdlLW91dHNldDogMHB4OwogICAgICAgICAgICBib3JkZXItaW1hZ2UtcmVwZWF0OiBzdHJldGNoOwogICAgICAgICAgICBib3JkZXItaW1hZ2Utc2xpY2U6IDEwMCU7CiAgICAgICAgICAgIGJvcmRlci1pbWFnZS1zb3VyY2U6IG5vbmU7CiAgICAgICAgICAgIGJvcmRlci1pbWFnZS13aWR0aDogMTsKICAgICAgICAgICAgYm9yZGVyLWxlZnQtY29sb3I6IHJnYigxOTIsIDE5NiwgMjA0KTsKICAgICAgICAgICAgYm9yZGVyLWxlZnQtc3R5bGU6IHNvbGlkOwogICAgICAgICAgICBib3JkZXItbGVmdC13aWR0aDogMXB4OwogICAgICAgICAgICBib3JkZXItcmlnaHQtY29sb3I6IHJnYigxOTIsIDE5NiwgMjA0KTsKICAgICAgICAgICAgYm9yZGVyLXJpZ2h0LXN0eWxlOiBzb2xpZDsKICAgICAgICAgICAgYm9yZGVyLXJpZ2h0LXdpZHRoOiAxcHg7CiAgICAgICAgICAgIGJvcmRlci10b3AtY29sb3I6IHJnYigxOTIsIDE5NiwgMjA0KTsKICAgICAgICAgICAgYm9yZGVyLXRvcC1sZWZ0LXJhZGl1czogNHB4OwogICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogNHB4OwogICAgICAgICAgICBib3JkZXItdG9wLXN0eWxlOiBzb2xpZDsKICAgICAgICAgICAgYm9yZGVyLXRvcC13aWR0aDogMXB4OwogICAgICAgICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94OwogICAgICAgICAgICBjb2xvcjogcmdiKDk2LCA5OCwgMTAyKTsKICAgICAgICAgICAgY3Vyc29yOiB0ZXh0OwogICAgICAgICAgICBkaXNwbGF5OiBibG9jazsKICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsKICAgICAgICAgICAgZm9udC1mYW1pbHk6ICJIZWx2ZXRpY2EgTmV1ZSIsIEhlbHZldGljYSwgIlBpbmdGYW5nIFNDIiwgIkhpcmFnaW5vIFNhbnMgR0IiLCAiTWljcm9zb2Z0IFlhSGVpIiwgU2ltU3VuLCBzYW5zLXNlcmlmOwogICAgICAgICAgICBmb250LXNpemU6IDE0cHg7CiAgICAgICAgICAgIGZvbnQtc3RyZXRjaDogMTAwJTsKICAgICAgICAgICAgZm9udC1zdHlsZTogbm9ybWFsOwogICAgICAgICAgICBmb250LXZhcmlhbnQtY2Fwczogbm9ybWFsOwogICAgICAgICAgICBmb250LXZhcmlhbnQtZWFzdC1hc2lhbjogbm9ybWFsOwogICAgICAgICAgICBmb250LXZhcmlhbnQtbGlnYXR1cmVzOiBub3JtYWw7CiAgICAgICAgICAgIGZvbnQtdmFyaWFudC1udW1lcmljOiBub3JtYWw7CiAgICAgICAgICAgIGxldHRlci1zcGFjaW5nOiBub3JtYWw7CiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAyMXB4OwogICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwcHg7CiAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAwcHg7CiAgICAgICAgICAgIG1hcmdpbi1yaWdodDogMHB4OwogICAgICAgICAgICBtYXJnaW4tdG9wOiAwcHg7CiAgICAgICAgICAgIG1pbi1oZWlnaHQ6IDMzcHg7CiAgICAgICAgICAgIG92ZXJmbG93LXdyYXA6IGJyZWFrLXdvcmQ7CiAgICAgICAgICAgIHBhZGRpbmctYm90dG9tOiA1cHg7CiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMTVweDsKICAgICAgICAgICAgcGFkZGluZy1yaWdodDogMTVweDsKICAgICAgICAgICAgcGFkZGluZy10b3A6IDVweDsKICAgICAgICAgICAgcmVzaXplOiBub25lOwogICAgICAgICAgICB0ZXh0LWFsaWduOiBzdGFydDsKICAgICAgICAgICAgdGV4dC1pbmRlbnQ6IDBweDsKICAgICAgICAgICAgdGV4dC1yZW5kZXJpbmc6IGF1dG87CiAgICAgICAgICAgIHRleHQtc2hhZG93OiBub25lOwogICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogbm9uZTsKICAgICAgICAgICAgdHJhbnNpdGlvbi1kZWxheTogMHM7CiAgICAgICAgICAgIHRyYW5zaXRpb24tZHVyYXRpb246IDAuMnM7CiAgICAgICAgICAgIHRyYW5zaXRpb24tcHJvcGVydHk6IGJvcmRlci1jb2xvcjsKICAgICAgICAgICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGN1YmljLWJlemllcigwLjY0NSwgMC4wNDUsIDAuMzU1LCAxKTsKICAgICAgICAgICAgd2hpdGUtc3BhY2U6IHByZS13cmFwOwogICAgICAgICAgICB3b3JkLXNwYWNpbmc6IDBweDsKICAgICAgICAgICAgd3JpdGluZy1tb2RlOiBob3Jpem9udGFsLXRiOwogICAgICAgIH0K"
    $('head').append($('<style>' + atob(style) + '</style>'))
    let textarea = $(`<textarea style="position: fixed;left: 0px;top: 0px;display: none;" class="base64" name="" id="" cols="15" rows="1" ></textarea>`)
    $('body').append(textarea)
    function decode(text) {
        try{
            if(text.length % 4 !== 1) {
                textarea.val(utf8.decode(atob(text)))
                textarea.css('background-color', '#fff')
                textarea.css('display', '')
                textarea[0].cols = textarea.val().length
                textarea[0].style.height = ''
                textarea[0].style.height = textarea[0].scrollHeight + 'px'
                textarea.css('left', `${event.clientX + 10}px`)
                textarea.css('top', `${event.clientY + 10}px`)
            }
        }catch(e){
            textarea.val('')
            textarea.css('display', 'none')
        }
    }
    let state = 0
    let just_moved = 0
    textarea[0].addEventListener('dblclick', function(){
        this.select()
        if (document.execCommand('copy')) {
            textarea.css('background-color', '#c8faff')
        }
    })
    $('#Wrapper')[0].addEventListener('mouseup', function(){
        state = 0
    })
    $('#Wrapper')[0].addEventListener('mousedown', function(){
        state = 1
    })
    $('#Wrapper')[0].addEventListener('click', function(){
        if(just_moved === 0){
            textarea.css('display', 'none')
            state = 0
        } else {
            just_moved = 0
        }
    })
    $('#Wrapper')[0].addEventListener('mousemove', function(){
        if(state === 1) {
            let t = window.getSelection().toString().trim()
            if(t.length !== 0) {
                decode(t)
                just_moved = 1
            }
        }
    })
    $('#Wrapper')[0].addEventListener('dblclick', function(){
        let t = window.getSelection().toString().trim()
        if(t.length !== 0) {
            decode(t)
        }
    })
    // 底注
    $(function(){
        setTimeout(function(){
            //console.clear()
            console.log("\n\n\n Thanks for using my script~\n\n\n\n")
        }, 2000)
    })
})()
