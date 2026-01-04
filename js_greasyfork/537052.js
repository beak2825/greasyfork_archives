// ==UserScript==
// @name         某某版主阅读器
// @version      1.1.0
// @description  为某某版本增加进入阅读模式按钮，点击后如果匹配成功则自动转码成为通用的阅读器样式方便使用，并提供扩展语音阅读功能（需要浏览器支持，推荐最新版Firefox浏览器）
// @author       qiannian
// @match        https://*.banzhu[0-9]*.*/*
// @match        https://banzhu[0-9]*.*/*
// @grant        none
// @namespace https://greasyfork.org/users/92407
// @downloadURL https://update.greasyfork.org/scripts/537052/%E6%9F%90%E6%9F%90%E7%89%88%E4%B8%BB%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537052/%E6%9F%90%E6%9F%90%E7%89%88%E4%B8%BB%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    var $ = function(selector){
        return document.querySelector(selector);
    }

    var blackList = {"www.baidu.com": true, "www.sogou.com": true, "www.so.com": true, "www.bing.com":true, "cn.bing.com": true, "www.google.com": true, "m.sm.cn": true};

    // 通用解析模板
    function parseContentAndTitle(){
        var mainDom = null;

        function findMainDom(doms){
            var docSize = document.body.scrollHeight * document.body.scrollWidth;
            for(var i=0;i<doms.length;i++){
                var dom = doms[i];
                // 计算dom尺寸百分比并输出
                var size = (dom.scrollWidth * dom.scrollHeight) / docSize;
                if (size > 0.3 && dom.nodeName !== "CODE" && dom.nodeName !== "PRE"){ // pre和code是代码常用元素块，忽略不认为是正文内容
                    // 如果innerText字数大于500，则视为正文区
                    var text = dom.innerText;
                    if (text.length >= 500){
                        mainDom = dom;
                    }
                }
                findMainDom(dom.children||[]);
            }
        }
        findMainDom(document.body.children);

        if (mainDom){
            // 在mainDom同层查找标题
            // var titleList = [];
            // findTitleDom(mainDom.parentNode.children, titleList);
            // 查找标题逻辑bug较多,暂时改为查找网页title作为标题,后续重写逻辑进行优化
            return {content: mainDom.innerText, title: document.title};
        }

        // function findTitleDom(doms, titleList){
        //     for(var i=0;i<doms.length;i++){
        //         var dom = doms[i];
        //         if (dom.children && dom.children.length !== 0){
        //             var title = findTitleDom(dom.children, titleList);
        //         }else{
        //             if (/\<h1|\<h2|title/.test(dom.outerHTML)){
        //                 var title = dom.innerText;
        //                 if (title && title.length >= 5 && title.length <= 200){
        //                     titleList.push(dom);
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    //     function parsePageUp(){
    //         var as = document.querySelectorAll('a');
    //         var reg = /上一章|上一篇|上一页|navigation-prev/;
    //         for(var i=0;i<as.length;i++){
    //             var text = as[i].outerHTML;
    //             var href = (as[i].attributes.href && as[i].attributes.href.value) || (as[i].dataset && as[i].dataset.url);
    //             if (text && reg.test(text.trim()) && href && href != "#" && href.indexOf("javascript:") !== 0){
    //                 return href;
    //             }
    //         }
    //     }

    //     function parsePageDown(){
    //         var as = document.querySelectorAll('a');
    //         var reg = /下一章|下一篇|下一页|navigation-next/;
    //         for(var i=0;i<as.length;i++){
    //             var text = as[i].outerHTML;
    //             var href = (as[i].attributes.href && as[i].attributes.href.value) || (as[i].dataset && as[i].dataset.url);
    //             if (text && reg.test(text.trim()) && href && href != "#" && href.indexOf("javascript:") !== 0){
    //                 return href;
    //             }
    //         }
    //     }

    function parsePagination(type) {
        var currentUrl = window.location.pathname;
        var isChapterBase = /\/\d+\.html$/.test(currentUrl); // 是否是章节基础页

        // 优先处理章节内分页
        if (isChapterBase || currentUrl.includes('_')) {
            var pageResult = handleChapterPagination(type);
            if (pageResult) return pageResult;
        }

        // 处理跨章节跳转
        return handleChapterTransition(type);
    }

    // 处理章节内分页（3448.html ↔ 3448_2.html）
    function handleChapterPagination(type) {
        var container = document.querySelector('center.chapterPages');
        if (!container) return null;

        var pages = Array.prototype.slice.call(container.querySelectorAll('a'));
        var currentIndex = pages.findIndex(function(a) {
            return a.classList.contains('curr');
        });

        // 当前页没有在分页容器中（如基础页）
        if (currentIndex === -1) {
            if (type === 'next') {
                // 基础页的下一页是第一分页
                var firstPage = container.querySelector('a:not(.curr)');
                return firstPage ? firstPage.href : null;
            }
            return null; // 基础页没有上一页
        }

        var targetIndex = currentIndex + (type === 'next' ? 1 : -1);
        if (targetIndex >= 0 && targetIndex < pages.length) {
            return pages[targetIndex].href;
        }
        return null; // 分页边界
    }

    // 处理跨章节跳转（3448 → 3449）
    function handleChapterTransition(type) {
        var currentPath = window.location.pathname;
        var chapterMatch = currentPath.match(/(\d+)(?:_\d+)?\.html$/);
        if (!chapterMatch) return null;

        var currentChapter = parseInt(chapterMatch[1], 10);
        var targetChapter = currentChapter + (type === 'next' ? 1 : -1);

        // 生成目标章节基础URL
        var newUrl = currentPath.replace(/(\d+)(?:_\d+)?\.html$/, targetChapter + '.html');

        return validateChapterExists(targetChapter) ? newUrl : null;
    }

    // 增强验证逻辑
    function validateChapterExists(chapter) {
        // 验证方式1：分页容器存在
        var hasPaginator = !!document.querySelector('center.chapterPages');

        // 验证方式2：目录存在链接
        var tocLink = document.querySelector('a[href$="/' + chapter + '.html"]');

        var navLinks = Array.prototype.slice.call(document.querySelectorAll('a'));
        var hasNavCtrl = navLinks.some(function(a) {
            var text = a.textContent.trim();
            return text === '下一章' || text === '下一节' || text === '下一页';
        });

        return tocLink || hasNavCtrl || hasPaginator;
    }


    function parsePageIndex(){
        var as = document.querySelectorAll('a');
        var reg = /目录/;
        for(var i=0;i<as.length;i++){
            var text = as[i].innerText;
            var href = as[i].attributes.href && as[i].attributes.href.value;
            if (text && text.length <= 10 && reg.test(text.trim()) && href && href != "#" && href.indexOf("javascript:") !== 0){
                return href;
            }
        }
    }


    var fontsize = parseInt(localStorage["_er_fontsize"] || 0);
    var padding = parseInt(localStorage["_er_padding"] || 10);
    var autoplay = false;
    if (localStorage['_er-autoplay'] === 'true'){
        autoplay = true;
    }
    delete localStorage['_er-autoplay'];

    if (top.window !== window) return; // iframe内的网页不展示按钮，也不支持进入阅读模式
    if (localStorage['_er-enable'] === 'true'){
        localStorage['_er-enable'] = 'false';
        checkAndCreateReader(true);
    } else if (blackList[location.host] !== true){
        // 创建阅读模式悬浮按钮
        $('body').children[0].insertAdjacentHTML('beforeBegin', '<button id="_er-entryReadMode" style="' +
                                                 '    position: fixed;' +
                                                 '    right: 50px;' +
                                                 '    bottom: 50px;' +
                                                 '    background-color: white;' +
                                                 '    border: 1px solid black;' +
                                                 '    border-radius: 10px;' +
                                                 '    padding: 0 5px;' +
                                                 '    height: 50px;' +
                                                 '    overflow: auto;' +
                                                 '    background-color: white;' +
                                                 '    z-index: 201901272210;">进入阅读模式</button>');
        // 配置阅读模式按钮自动淡出效果
        var i = 1;
        var interval = setInterval(function(){
            i -= 0.03;
            var btn = $('#_er-entryReadMode');
            if (!btn) {
                clearInterval(interval);
                return;
            }
            $('#_er-entryReadMode').style.opacity = i;
            if (i <= 0) {
                btn.remove();
                clearInterval(interval);
            }
        }, 100);
        $('#_er-entryReadMode').onclick = checkAndCreateReader;
        $('#_er-NotShowReadMode').onclick = function(){
            localStorage['_er-disabled'] = 'true';
            $('#_er-entryReadMode').remove();
            $('#_er-NotShowReadMode').remove();
        }
    }

    function checkAndCreateReader(notAlert){
        // 通过调用通用模板尝试是否能够成功匹配到阅读内容
        var content = parseContentAndTitle();
        if (content && content.content){
            content.pageup = parsePagination('prev');
            content.pagedown = parsePagination('next');
            content.pageindex = parsePageIndex();
            createReader(content);
        }else{
            if (notAlert !== true){
                alert('当前页面解析失败，无法进入阅读模式！');
            }
        }
    }

    function setTheme(theme) {
        switch(theme) {
            case 'black':
                $('._er').style.backgroundColor = 'black';
                $('._er-title').style.color = 'lightgrey';
                $('._er-content').style.color = 'lightgrey';
                break;
            case 'OliveDrab':
                $('._er').style.backgroundColor = '#D3E1D0';
                $('._er-title').style.color = 'black';
                $('._er-content').style.color = 'black';
                break;
            case 'Khaki':
                $('._er').style.backgroundColor = '#F6F2E7';
                $('._er-title').style.color = 'black';
                $('._er-content').style.color = 'black';
                break;
            case 'blue':
                $('._er').style.backgroundColor = '#D3E5F9';
                $('._er-title').style.color = 'black';
                $('._er-content').style.color = 'black';
                break;
            case 'white':
                $('._er').style.backgroundColor = 'white';
                $('._er-title').style.color = 'black';
                $('._er-content').style.color = 'black';
                break;
        }
        localStorage['_er-theme'] = theme;
        $('._er').dataset['theme'] = theme;
    }

    // 创建阅读器
    function createReader(content){
        $('#_er-entryReadMode') && $('#_er-entryReadMode').remove();
        $('#_er-NotShowReadMode') && $('#_er-NotShowReadMode').remove();
        addClassAndDom();
        if (window.SpeechSynthesisUtterance){
            $('#_er-tts').style.display = 'block';
        }
        if (localStorage['_er-theme']) {
            setTheme(localStorage['_er-theme']);
        }
        $('._er-title').innerText = content.title;
        var contentArr = content.content.split('\n');
        var contentHtml = '';
        for(var i=0;i<contentArr.length;i++){
            var line = contentArr[i];
            if (line){
                contentHtml += '<span>' + line + '</span>';
            }
            contentHtml += '<br>';
        }
        $('._er-content').innerHTML = contentHtml;
        var spanNodes = document.querySelectorAll('._er-content span');
        for(var i=0;i<spanNodes.length;i++){
            spanNodes[i].onclick = function(){
                for(var j=0;j<spanNodes.length;j++){
                    spanNodes[j].classList.remove('_er-current');
                }
                this.classList.add('_er-current');
            }
        }
        // 挂接键盘事件，实现键盘上下左右切换阅读功能
        $('body').onkeydown = function(e){
            e.stopPropagation();
            switch(e.keyCode || e.which || e.charCode){
                case 38: // up
                    if (e.ctrlKey) {
                        $('._er').scrollTop = $('._er').scrollTop - (document.documentElement.clientHeight - 24)
                    } else {
                        toPrevReadPos();
                        updateReadPos();
                    }
                    break;
                case 40: // down
                    if (e.ctrlKey) {
                        $('._er').scrollTop = $('._er').scrollTop + (document.documentElement.clientHeight - 24);
                    } else {
                        toNextReadPos();
                        updateReadPos();
                    }
                    break;
                case 37: // left
                    if (e.ctrlKey) {
                        toPrevPage();
                    } else {
                        $('._er').scrollTop = $('._er').scrollTop - (document.documentElement.clientHeight - 24);
                    }
                    break;
                case 39: // right
                    if (e.ctrlKey) {
                        toNextPage();
                    } else {
                        $('._er').scrollTop = $('._er').scrollTop + (document.documentElement.clientHeight - 24);
                    }
                    break;
                default:
                    return true;
            }
            return false;

            function toPrevPage(){
                if (content.pageup){
                    localStorage['_er-enable'] = 'true';
                    location.href = content.pageup;
                }else{
                    alert('很抱歉，没有匹配到上一页！');
                }
            }
            function toNextPage(){
                if (content.pagedown){
                    localStorage['_er-enable'] = 'true';
                    location.href = content.pagedown;
                }else{
                    alert('很抱歉，没有匹配到下一页！');
                }
            }
        };
        $('._er-content').onclick = function(e){ // 适用于墨水屏的左右点击无动画翻页
            var x = e.pageX;
            var width = document.documentElement.clientWidth;
            if (x <= width*0.1){ // 前翻一页
                $('._er').scrollTop = $('._er').scrollTop - (document.documentElement.clientHeight - 24)
            }else if(x >= width*0.9){ // 后翻一页
                $('._er').scrollTop = $('._er').scrollTop + (document.documentElement.clientHeight - 24);
            }
        }
        $('#_er-pageindex').onclick = function(){
            if (content.pageindex){
                location.href = content.pageindex;
            }else{
                alert('很抱歉，没有匹配到目录！');
            }
        };
        $('#_er-switch-theme').onclick = function(){
            var current = $('._er').dataset['theme'] || 'white';
            var themeList = ['white', 'Khaki', 'blue', 'OliveDrab', 'black'];
            var index = themeList.indexOf(current);
            if (index === -1) index = 0;
            index++;
            if (index >= themeList.length) {
                index = 0;
            }
            setTheme(themeList[index]);
        }
        $('#_er-pageup').onclick = function(){
            if (content.pageup){
                localStorage['_er-enable'] = 'true';
                location.href = content.pageup;
            }else{
                alert('很抱歉，没有匹配到上一页！');
            }
        };
        $('#_er-pagedown').onclick = function(){
            if (content.pagedown){
                localStorage['_er-enable'] = 'true';
                location.href = content.pagedown;
            }else{
                alert('很抱歉，没有匹配到下一页！');
            }
        };
        $('#_er-pagedown').dataset['nexturl'] = content.pagedown;
        setFontSize();
        setPadding();

        // 按钮事件处理
        $('#_er-close').onclick = removeDom;
        $('#_er-font-plus').onclick = function(){
            fontsize += 2;
            setFontSize();
        };
        $('#_er-font-minus').onclick = function(){
            fontsize -= 2;
            setFontSize();
        };
        $('#_er-border').onclick= function() {
            padding = padding == 10 ? 5 : 10;
            setPadding();
        }

        $('#_er-tts').onclick = function(){
            if (this.dataset['pause'] === 'true'){
                // 开始播放
                this.innerText = '停止';
                this.dataset['pause'] = 'false';
                playNextText();
            }else{
                this.innerText = '听书';
                this.dataset['pause'] = 'true';
            }
        };

        if (autoplay){
            $('#_er-tts').innerText = '停止';
            $('#_er-tts').dataset['pause'] = 'false';
            playNextText();
        }else{
            $('#_er-tts').dataset['pause'] = 'true';
        }
    }

    // 听书功能
    function playNextText(){
        updateReadPos();
        var current = $('._er-current');
        var playText = '';
        if (current){
            playText = current.innerText;
        }else{
            playText = $('._er-title').innerText;
        }
        if (playText){
            var utterThis = new SpeechSynthesisUtterance();
            utterThis.text = playText;
            utterThis.onerror = function(){
                $('#_er-tts').dataset['pause'] = 'true';
                alert("TTS语音转换文字出现异常，听书已停止运行！");
            };
            utterThis.onend = function(){
                toNextReadPos();
                if (!$('._er-current')){
                    var nextUrl = $('#_er-pagedown').dataset['nexturl'];
                    console.log(nextUrl);
                    if (nextUrl){
                        localStorage['_er-autoplay'] = 'true';
                        localStorage['_er-enable'] = 'true';
                        location.href = nextUrl;
                    }
                    return;
                }
                if ($('#_er-tts').dataset['pause'] === 'false'){
                    playNextText();
                }
            };
            speechSynthesis.speak(utterThis);
        }else{
            toNextReadPos();
            playNextText();
        }
    }

    function toNextReadPos(){
        var current = $('._er-current');
        var nextSpan = null;
        if (current){
            nextSpan = current.nextElementSibling;
            while(nextSpan && nextSpan.nodeName !== 'SPAN'){
                nextSpan = nextSpan.nextElementSibling;
            }
        }else{
            nextSpan = $('._er-content span');
        }
        if (current) current.classList.remove('_er-current');
        if (nextSpan) nextSpan.classList.add('_er-current');
    }

    function toPrevReadPos(){
        var current = $('._er-current');
        var prevSpan = null;
        if (current){
            prevSpan = current.previousElementSibling;
            while(prevSpan && prevSpan.nodeName !== 'SPAN'){
                prevSpan = prevSpan.previousElementSibling;
            }
        }
        if (current) current.classList.remove('_er-current');
        if (prevSpan) prevSpan.classList.add('_er-current');
    }

    function updateReadPos(){
        if ($('._er-current'))
            $('._er').scrollTop =  $('._er-current').offsetTop - (document.documentElement.clientHeight / 2);
    }

    function setFontSize(){
        localStorage["_er_fontsize"] = fontsize;
        $('._er-title').style.fontSize = (20+fontsize) + 'px';
        $('._er-title').style.lineHeight = ((20+fontsize)*1.5) + 'px';
        $('._er-content').style.fontSize = (14+fontsize) + 'px';
        $('._er-content').style.lineHeight = ((14+fontsize)*1.5) + 'px';
    }

    function setPadding() {
        localStorage["_er_padding"] = padding;
        $('._er-content').style.padding = '10px ' + padding + '%';
    }

    var oldOverflow = '';
    var oldOnKeyDown = $('body').onkeydown;

    function removeDom(){
        $('._er').remove();
        $('body').style.overflow = oldOverflow;
        $('body').onkeydown = oldOnKeyDown;
    }

    function addClassAndDom(){
        oldOverflow = $('body').style.overflow;
        $('body').style.overflow = 'hidden';

        $('body').children[0].insertAdjacentHTML('beforeBegin',
                                                 '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"><div class="_er">' +
                                                 '    <div class="_er-tts">' +
                                                 '        <button type="button" id="_er-tts">听书</button>' +
                                                 '    </div>' +
                                                 '    <div class="_er-tools">' +
                                                 '        <button type="button" id="_er-pageindex">目录</button>' +
                                                 '        <button type="button" id="_er-switch-theme">切换主题</button>' +
                                                 '        <button type="button" id="_er-font-plus">字号+</button>' +
                                                 '        <button type="button" id="_er-font-minus">字号-</button>' +
                                                 '        <button type="button" id="_er-border">边距</button>' +
                                                 '        <button type="button" id="_er-close">返回原网页</button>' +
                                                 '    </div>' +
                                                 '    <div class="_er-title"></div>' +
                                                 '    <div class="_er-content">' +
                                                 '    </div>' +
                                                 '    <div class="_er-tools _er-floating-controls">' +
                                                 '        <button type="button" id="_er-pageup">上一页</button>' +
                                                 '        <button type="button" id="_er-pagedown">下一页</button>' +
                                                 '    </div>' +
                                                 '</div>');
        $('body').children[0].insertAdjacentHTML('beforeBegin',
                                                 '<style>' +
                                                 '._er{' +
                                                 '    position: fixed;' +
                                                 '    left: 0;' +
                                                 '    right: 0;' +
                                                 '    top: 0;' +
                                                 '    bottom: 0;' +
                                                 '    overflow: auto;' +
                                                 '    background-color: white;' +
                                                 '    z-index: 201901272211;' +
                                                 '}' +
                                                 '._er-title{' +
                                                 '    text-align: center;' +
                                                 '    font-size: 20px;' +
                                                 '    line-height: 30px;' +
                                                 '    font-weight: 900;' +
                                                 '    padding: 10px 10%;' +
                                                 '    color: black;' +
                                                 '}' +
                                                 '._er-content{' +
                                                 '    padding: 10px 10%;' +
                                                 '    font-size: 14px;' +
                                                 '    line-height: 21px;' +
                                                 '    color: black;' +
                                                 '}' +
                                                 '._er-tools{' +
                                                 '    margin-top: 10px;' +
                                                 '    margin-bottom: 10px;' +
                                                 '    text-align: center;' +
                                                 '}' +
                                                 '._er-tools button{' +
                                                 '    cursor: pointer;' +
                                                 '    color: black;' +
                                                 '    background-color: #908E90;' +
                                                 '    border: 1px solid black;' +
                                                 '    padding: 5px;' +
                                                 '    border-radius: 10px;' +
                                                 '}' +
                                                 '._er-floating-controls {' +
                                                 '    position: fixed;' +
                                                 '    top: 50%;' +
                                                 '    right: 20px;' +
                                                 '    -webkit-transform: translateY(-50%);' +
                                                 '    -ms-transform: translateY(-50%);' +
                                                 '    transform: translateY(-50%);' +
                                                 '    display: -webkit-box;' +
                                                 '    display: -ms-flexbox;' +
                                                 '    display: flex;' +
                                                 '    -webkit-box-orient: vertical;' +
                                                 '    -webkit-box-direction: normal;' +
                                                 '        -ms-flex-direction: column;' +
                                                 '            flex-direction: column;' +
                                                 '    gap: 1rem;' +
                                                 '    z-index: 1000;' +
                                                 '    -webkit-transition: all 0.3s ease;' +
                                                 '    -o-transition: all 0.3s ease;' +
                                                 '    transition: all 0.3s ease;' +
                                                 '}' +
                                                 '._er-tts button{' +
                                                 '    width: 50px;' +
                                                 '    height: 50px;' +
                                                 '    position: fixed;' +
                                                 '    right: 15px;' +
                                                 '    bottom: 15px;' +
                                                 '    z-index: 201901272212;' +
                                                 '    color: black;' +
                                                 '    border: 1px solid black;' +
                                                 '    opacity: 0.5;' +
                                                 '    cursor: pointer;' +
                                                 '    border-radius: 25px;' +
                                                 '    display: none;' +
                                                 '}' +
                                                 '._er-current{' +
                                                 '    background-color: yellow;' +
                                                 '    color: black;' +
                                                 '}' +
                                                 '</style>');
    }
})();