// ==UserScript==
// @name         读者吧
// @namespace    http://tampermonkey.net/
// @version      1.0.12
// @description  去掉该网站的广告，优化UI。代码参考 ： https://greasyfork.org/zh-CN/scripts/377230-%E9%80%9A%E7%94%A8%E9%98%85%E8%AF%BB%E5%99%A8/code
// @author       Clf
// @exclude      *://m.dzb81.com/member/*
// @match        *://m.dzb81.com/*/*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dzb81.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501599/%E8%AF%BB%E8%80%85%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/501599/%E8%AF%BB%E8%80%85%E5%90%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert('123131');
    var $ = function(selector){
        return document.querySelector(selector);
    }
    var body=$('body');
    var childArr = Array.from(body.children);
    var flag=0;
    remove_adv();
    function remove_adv(){
        var head = $('head')
        var scripts = head.getElementsByTagName('script');
        for (var i = scripts.length - 1; i >= 0; i--) { // 注意我们从后往前遍历
            var script = scripts[i];
            if (!script.type || script.type !== 'text/javascript') {
                head.removeChild(script);
            }
        }
        if (childArr.length > 0) {
            flag=childArr.findIndex(e => e.id=='PageSet');
            childArr.forEach(function(e,i) {

                if(i < 3 || i==4 || i==5 ||i >12 ||  e.id === 'nsws' || e.tagName.toLowerCase() === 'dl' || e.classList.contains('searchForm') ||e.classList.contains('DivBottom')
                   || e.tagName.toLowerCase() === 'h2' || e.tagName.toLowerCase() === 'script' || e.tagName.toLowerCase() === 'iframe' || e.tagName.toLowerCase() === 'a' ){
                    $('body').removeChild(e);
                }

            });
            var divs = document.querySelectorAll("html > div");
            divs.forEach(function(div) {
                div.remove();
            });

            childArr=Array.from(body.children);
        }

    }

   document.querySelector('body').addEventListener('click', function(event) {
    if (event.target.classList.contains('_er')) {
        console.log('内层元素被点击');
    // 阻止事件冒泡（可选）
     event.stopPropagation();
    }
});


    var blackList = {"www.baidu.com": true, "www.sogou.com": true, "www.so.com": true, "www.bing.com":true, "cn.bing.com": true, "www.google.com": true, "m.sm.cn": true};

    var keywords = ['本章没完，', '温馨提示：', 'dzb81.com'];
    // 通用解析模板
    function parseContentAndTitle(){
        let mainDom = null;
        let title = null;
        if (childArr.length > 0) {
            childArr.forEach(function(e,i) {
                if(e.classList.contains('TxtContent')){
                    mainDom=e;
                }else if(e.classList.contains('sh1')){
                    title=e;
                }

            });
        }
        if (mainDom){
            var childNodes = Array.from(mainDom.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            if(childNodes.length>3){
            for (var i = childNodes.length - 1; i >= childNodes.length - 3; i--) {
                if (keywords.some(k => childNodes[i].textContent.includes(k)) ) { // 文本节点
                    mainDom.removeChild(childNodes[i]);
                }
            }
            }
            return {content: mainDom.innerText, title: title ? title.innerText :""};
        }

    }

    function parseButton(content){
        let suffix=null;
        let pageup = null;
        let pagedown = null;
        let index = null;
        let pageindex = null;
        let bookshelf = null;
        if (childArr.length > 0 && flag >0 ) {
            let pageSet=childArr.find(e => e.id=='PageSet');
            pageSet.style.display = 'none';
            let len=pageSet.children.length;

            Array.from(pageSet.children).forEach(function(e,i) {
                if(i==0){
                    if(e.tagName.toLowerCase() === 'a'){
                        pageup=e.attributes.href.value;
                    }
                }else if(i==len-1){
                    if(e.tagName.toLowerCase() === 'a'){
                        pagedown=e.attributes.href.value;
                    }
                }else if(e.tagName.toLowerCase() === 'span'){
                    index=i;
                }

            });
            content.title=content.title+'  ('+index+'/'+(len-2)+')';

            childArr[3].style.display = 'none';
            childArr[4].style.display = 'none';
            Array.from(childArr[3].children).forEach(function(e,i) {
                if(i==0 && pageup==null){
                    pageup=e.getElementsByTagName('a').length>0 ?e.getElementsByTagName('a')[0].attributes.href.value : null;
                }else if(i==2 && pagedown==null){
                    pagedown=e.getElementsByTagName('a').length>0 ? e.getElementsByTagName('a')[0].attributes.href.value : null;
                }else if (i==1){
                    pageindex=e.getElementsByTagName('a')[0].attributes.href.value;
                }

            });

            //bookshelf=childArr[4].getElementsByTagName('a')[0].attributes.href.value;
            bookshelf='/member/tempb.html';

            content.pageup=pageup;
            content.pagedown=pagedown;
            content.pageindex=pageindex;
            content.bookshelf=bookshelf;
        }

    }


    //模搬开始
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
        var i = 3;
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
        if($('#_er-NotShowReadMode')){
            $('#_er-NotShowReadMode').onclick = function(){
                localStorage['_er-disabled'] = 'true';
                $('#_er-entryReadMode').remove();
                $('#_er-NotShowReadMode').remove();
            }
        }

    }

    function checkAndCreateReader(notAlert){
        // 通过调用通用模板尝试是否能够成功匹配到阅读内容
        var content = parseContentAndTitle();
        if (content && content.content){
            parseButton(content);
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
            //$('#_er-tts').style.display = 'block';
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
        $('#_er-bookshelf').onclick = function(){
            if (content.bookshelf){
                location.href = content.bookshelf;
            }else{
                alert('很抱歉，没有找到书架！');
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

        //听书
        /*         $('#_er-tts').onclick = function(){
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
        } */
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
                                                 '        <button type="button" id="_er-bookshelf">书架</button>' +
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
                                                 '    <div class="_er-tools">' +
                                                 '        <button type="button" class="big-button" id="_er-pageup">上一页</button>' +
                                                 '        <button type="button" class="big-button" id="_er-pagedown">下一页</button>' +
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
                                                 '._er-tools .big-button{' +
                                                 '   padding: 9px 25px;' +
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