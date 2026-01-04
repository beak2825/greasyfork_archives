// ==UserScript==
// @name         轻小说阅读器
// @version      1.2.1
// @description  修改自pppploi8的通用阅读器，为“真白萌”和“哔哩轻小说”提供阅读模式
// @require https://update.greasyfork.org/scripts/501723/1416523/font-ch-en.js
// @author       Y_C_Z
// @match        https://masiro.me/*
// @match        https://www.linovelib.com/*
// @match        https://www.bilinovel.com/*
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_deleteValue
// @grant    GM_listValues
// @grant    GM_registerMenuCommand
// @grant    unsafeWindow
// @namespace https://greasyfork.org/users/1335970
// @downloadURL https://update.greasyfork.org/scripts/501142/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501142/%E8%BD%BB%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==
(function() {
    var voices = [];
    var $ = function(selector){
        return document.querySelector(selector);
    }

    var isSupportFontFamily = function (fontFamily) {//判断浏览器是否支持字体
        if (typeof fontFamily != 'string') {
            return false;
        }
 
        var defaultFontFamily = 'Arial';
        if (fontFamily.toLowerCase() == defaultFontFamily.toLowerCase()) {
            return true;
        }
 
        var defaultLetter = 'a';
        var defaultFontSize = 100;
 
        // 使用该字体绘制的canvas
        var width = 100, height = 100;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        // 全局一致的绘制设定
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.textBaseline = 'middle';
        var getFontData = function (fontFamily) {
            // 清除
            context.clearRect(0, 0, width, height);
            // 设置字体
            context.font = defaultFontSize + 'px ' + fontFamily + ', ' + defaultFontFamily;
            context.fillText(defaultLetter, width / 2, height / 2);
 
            var data = context.getImageData(0, 0, width, height).data;
 
            return [].slice.call(data).filter(function(value) {
                return value != 0;
            });
        };
 
        return getFontData(defaultFontFamily).join('') !== getFontData(fontFamily).join('');
    };
 
    GM_registerMenuCommand("设置", () => {//打开设置窗口
        voices = getVoice();//第一次获取到的是空值
        addDialog();
        var arrFont = dataFont['windows'].concat(dataFont['OS X'], dataFont['office'], dataFont['open']);//获取浏览器可用字体
        var fontFamilyoption = '<option value="">默认</option>';
        arrFont.forEach(function (obj) {
            var fontFamily = obj.en;
            if (isSupportFontFamily(fontFamily)) {
                fontFamilyoption = fontFamilyoption + '<option value="'+ fontFamily +'">'+ obj.ch +'</option>';
            }
        });
        $("#fontSelect").innerHTML = fontFamilyoption;
        setTimeout(function() {
            var voiceSelect = document.getElementById('voiceSelect');//注入浏览器可用语音
            voices = getVoice();
            voices.forEach(function(voice) {
                var option = document.createElement('option');
                option.value = voice.name;
                option.textContent = voice.name;
                voiceSelect.appendChild(option);
            });
            if (GM_getValue('voice') != undefined){
                $("#voiceSelect").value = GM_getValue('voice');
            }
        },0);
        if (GM_getValue('ttsbutton') != undefined){
            $("input[name='listen']").checked = GM_getValue('ttsbutton');
        }else if(window.SpeechSynthesisUtterance){
            $("input[name='listen']").checked = true;
        }else{
            $("input[name='listen']").checked = false;
        }
        if (GM_getValue('totopbutton') != undefined){
            $("input[name='scrollToTop']").checked = GM_getValue('totopbutton');
        }else{
            $("input[name='scrollToTop']").checked = true;
        }
        if (GM_getValue('imageshow') != undefined){
            $("input[name='imageshow']").checked = GM_getValue('imageshow');
        }else{
            $("input[name='imageshow']").checked = false;
        }
        if (GM_getValue('fontFamily') != undefined){
            $("#fontSelect").value = GM_getValue('fontFamily');
        }
        $("#rateInput").value = GM_getValue('rateInput',1);
        if(!window.SpeechSynthesisUtterance){
            $("input[name='listen']").disabled = true;
            $("#voiceSelect").disabled = true;
            $("#rateInput").disabled = true;
        }
        const dialog = document.getElementById('myDialog');
        dialog.showModal();
        $('#configreset').onclick = function(){
            $("input[name='listen']").checked = true;
            $("input[name='scrollToTop']").checked = true;
            $("input[name='imageshow']").checked = false;
            $("#fontSelect").value = '';
            $("#voiceSelect").value = '';
            $("#rateInput").value = 1;
        }
        $('#closeDialog').onclick = function(){
            if ($("input[name='listen']").checked == false) {//听书按钮
                $("._er-tts") && ($("._er-tts").style.display = 'none');
                GM_setValue('ttsbutton',false);
            }else{
                $("._er-tts") && ($("._er-tts").style.display = 'block');
                GM_setValue('ttsbutton',true);
            }
            if ($("input[name='scrollToTop']").checked == false) {//回到顶部按钮
                $(".toTop") && ($(".toTop").style.display = 'none');
                GM_setValue('totopbutton',false);
            }else{
                $(".toTop") && ($(".toTop").style.display = 'block');
                GM_setValue('totopbutton',true);
            }
            if ($("input[name='imageshow']").checked == false) {//插图显示
                document.querySelectorAll(".images").forEach(function(images) {
                    images.style.display = 'none';
                });
                GM_setValue('imageshow',false);
            }else{
                document.querySelectorAll(".images").forEach(function(images) {
                    images.style.display = 'block';
                });
                GM_setValue('imageshow',true);
            }
            $("._er-title") && ($("._er-title").style.fontFamily = $("#fontSelect").value);//字体设置
            $(".translator") && ($(".translator").style.fontFamily = $("#fontSelect").value);
            $("._er-content") && ($("._er-content").style.fontFamily = $("#fontSelect").value);
            GM_setValue('fontFamily',$("#fontSelect").value);//保存字体
            GM_setValue('voice',$("#voiceSelect").value);//保存语音选择
            var rate = parseFloat($("#rateInput").value);
            if (rate>10) rate=10;
            else if (rate<0.1) rate=0.1;
            GM_setValue('rateInput',rate);//保存语速
            dialog.remove();
        }
    });
    var blackList = {"masiro.me": true,"www.linovelib.com": true,"www.bilinovel.com": true};
    if (location.host == "www.linovelib.com" || location.host == "www.bilinovel.com") {//尝试通过Cloudflare
        document.cookie = '__gpi_opt_out=1;';
        document.cookie = 'cf_clearance=MHioFTJ3.DT_FjBcW1pGr7CzIvtm9Z29VMbB7d_TLgE-1721550888-1.0.1.1-7FSsg2Gpn9Y1x36Iq.eXyN60H2j.X2HXp_zPYRj17l0d4gzbOQw24ZSptWj.ktb8QTjubE5qO1Vz2YnTmPxAeQ;';
        var start=1;
        var end=10;
        /*window.onload = function() {
            var t1 = setInterval(function(){
                for (var n=0;n<10;++n){
                    $(".adsbygoogle") && $(".adsbygoogle").remove();
                }
                $("#bottomads") && $("#bottomads").remove();
                $("script[src*='adsbygoogle.js']") && $("script[src*='adsbygoogle.js']").remove();
                $("script[src*='g.doubleclick.net']") && $("script[src*='g.doubleclick.net']").remove();
                $("script[src*='googletagmanager.com']") && $("script[src*='googletagmanager.com']").remove();
                $("script[src*='googlesyndication.com']") && $("script[src*='googlesyndication.com']").remove();
                $("iframe[src*='google.com']") && $("iframe[src*='google.com']").remove();
                $("div[id*='google_ads']") && $("div[id*='google_ads']").remove();
                $("div[data-google-query-id]") && $("div[data-google-query-id]").remove();
                $("div[class*='m7']") && $("div[class*='m7']").remove();
                $("div[class*='adblock']") && $("div[class*='adblock']").remove();
                if ($("div[id='TextContent']")) {
                    $("div[id='TextContent']").style.display = 'block';
                }
                if ($("div[id='acontent']")) {
                    $("div[id='acontent']").style.display = 'block';
                }
                $("script[src*='tip_chapter.js']") && $("script[src*='tip_chapter.js']").remove();
                start++;
                if (start>=end ){
                    clearInterval(t1);
                }
            },1000);
        };*/
        // 兼容性事件绑定（保留原有功能）
        const executeAdClean = function() {
            var t1 = setInterval(function(){
                for(var n=0;n<10;++n){
                    $(".adsbygoogle") && $(".adsbygoogle").remove();
                }
                $("#bottomads") && $("#bottomads").remove();
                $("script[src*='adsbygoogle.js']") && $("script[src*='adsbygoogle.js']").remove();
                $("script[src*='g.doubleclick.net']") && $("script[src*='g.doubleclick.net']").remove();
                $("script[src*='googletagmanager.com']") && $("script[src*='googletagmanager.com']").remove();
                $("script[src*='googlesyndication.com']") && $("script[src*='googlesyndication.com']").remove();
                $("iframe[src*='google.com']") && $("iframe[src*='google.com']").remove();
                $("div[id*='google_ads']") && $("div[id*='google_ads']").remove();
                $("div[data-google-query-id]") && $("div[data-google-query-id]").remove();
                // $("div[class*='m7']") && $("div[class*='m7']").remove();
                $("div[class*='adblock']") && $("div[class*='adblock']").remove();
                if($("div[id='TextContent']")) { $("div[id='TextContent']").style.display = 'block'; }
                if($("div[id='acontent']")) { $("div[id='acontent']").style.display = 'block'; }
                if($("div[id='volumes']")) { $("div[id='volumes']").style.display = 'block'; }
                $("script[src*='tip_chapter.js']") && $("script[src*='tip_chapter.js']").remove();
                // 删除id为mlfy_main_text的div容器下的第一个div元素
                const mainTextDiv = document.getElementById('mlfy_main_text');
                if (mainTextDiv) {
                    const firstDiv = mainTextDiv.querySelector('div');
                    if (firstDiv && firstDiv.id!== 'TextContent') {
                        firstDiv.remove();
                    }
                }
                const apageDiv = document.getElementById('apage');
                if (apageDiv) {
                    const divs = apageDiv.querySelectorAll('div');
                    if (divs.length >= 2) {
                        const secondDiv = divs[1];
                        if (secondDiv.id!== 'acontent') {
                            secondDiv.remove();
                        }
                    }
                }
                const bodyElement = document.body;
                if (bodyElement) {
                    const firstDiv = bodyElement.querySelector('div');
                    if (firstDiv) {
                        const firstChild = firstDiv.querySelector('a');
                        if (firstChild && firstChild.getAttribute('href') === '/public/whitelist.html') {
                            firstDiv.remove();
                        }
                    }
                }
                const catelogxDiv = document.getElementById('catelogX');
                if (catelogxDiv) {
                    const divs = catelogxDiv.querySelectorAll('div');
                    if (divs.length >= 2) {
                        const secondDiv = divs[1];
                        if (secondDiv.id!== 'volumes') {
                            secondDiv.remove();
                        }
                    }
                }
                start++;
                if(start >= end){ clearInterval(t1); }
            },1000);
        };

        /* 多阶段事件绑定（替换原有window.onload） */
        (function(){
            let hasExecuted = false;

            const triggerHandler = () => {
                if(hasExecuted || document.readyState !== 'complete') return;
                hasExecuted = true;
                executeAdClean();
            };

            // 移动端优先检测
            document.addEventListener('DOMContentLoaded', triggerHandler);

            // PC端兜底检测
            window.addEventListener('load', triggerHandler);

            // 即时状态检查
            if(document.readyState === 'complete') {
                triggerHandler();
            }
        })();

    }
 
    // 通用解析模板
    function parseContentAndTitle(){
        var mainDom = null;

        function findMainDom(doms){
            for(var i=0;i<doms.length;i++){
                var dom = doms[i];
                if (dom.classList.contains("nvl-content") || dom.id === "TextContent" || dom.id === "acontent"){// 匹配正文容器
                    mainDom = dom;
                }
                findMainDom(dom.children||[]);
            }
        }
        findMainDom(document.body.children);

        var newTitle = '';
        var title = document.title;
        var textToRemove1 = "真白萌 | ";
        var textToRemove2 = " _哔哩轻小说";
        title = title.replace(textToRemove1, "").replace(textToRemove2, "");

        // 处理标题逻辑（保持不变）
        switch (location.host){
            case 'www.bilinovel.com':
                var atitle = document.querySelector('#atitle');
                newTitle = atitle ? atitle.textContent : title;
                break;
            default:
                var mlfyMainTextElement = document.querySelector("#mlfy_main_text");
                var firstH1Element = mlfyMainTextElement ? mlfyMainTextElement.querySelector("h1") : null;
                newTitle = firstH1Element ? firstH1Element.textContent : title;
                break;
        }

        var imgElements = [];
        var filteredContent = ''; // 存储过滤后的文本内容

        if (mainDom) {
            // 提取并过滤p元素
            if (location.host != "masiro.me") {
                var pElements = mainDom.querySelectorAll('p');
                pElements.forEach(p => {
                    // 获取计算后的样式
                    var computedStyle = window.getComputedStyle(p);
                    var transform = computedStyle.transform;
                    // 检查是否为scale(0)（matrix(0,0,0,0,0,0)是scale(0)的矩阵形式）
                    if (transform !== 'matrix(0, 0, 0, 0, 0, 0)' && transform !== 'scale(0)') {
                        // 保留非隐藏的p元素文本，添加换行符分隔
                        filteredContent += p.textContent + '\n';
                    }
                });
            } else {
                filteredContent = mainDom.innerText;
            }

            // 处理图片逻辑
            var imgs = mainDom.querySelectorAll("img");
            for (var i = 0; i < imgs.length; i++) {
                var src = imgs[i].src;
                if (src.includes("sloading.svg")) {
                    var dataSrc = imgs[i].getAttribute('data-src');
                    if (dataSrc) imgElements.push(dataSrc);
                } else {
                    imgElements.push(src);
                }
            }
        }

        if (mainDom){
            return {
                content: filteredContent, // 返回过滤后的内容
                title: newTitle,
                img: imgElements
            };
        }
    }
 
    function parsePageUp(){
        var reg, text;
        var href = "";
        var i = 0;
        var as = document.querySelectorAll('a');
        switch (location.host){
            case 'www.bilinovel.com':
                return ReadParams.url_previous;
                break;
            default:
                reg = /上一章|上一篇|上一页|上一话|navigation-prev/;
                for(i=0;i<as.length;i++){
                    text = as[i].outerHTML;
                    href = (as[i].attributes.href && as[i].attributes.href.value) || (as[i].dataset && as[i].dataset.url);
                    if (text && reg.test(text.trim()) && href && href != "#" && href.indexOf("javascript:") !== 0){
                        return href;
                    }
                }
                break;
        }
    }
 
    function parsePageDown(){
        var reg, text;
        var href = "";
        var i = 0;
        var as = document.querySelectorAll('a');
        switch (location.host){
            case 'www.bilinovel.com':
                return ReadParams.url_next;
                break;
            default:
                reg = /下一章|下一篇|下一页|下一话|navigation-next/;
                for(i=0;i<as.length;i++){
                    text = as[i].outerHTML;
                    href = (as[i].attributes.href && as[i].attributes.href.value) || (as[i].dataset && as[i].dataset.url);
                    if (text && reg.test(text.trim()) && href && href != "#" && href.indexOf("javascript:") !== 0){
                        return href;
                    }
                }
                break;
        }
    }
 
    function parsePageIndex(){
        var as = document.querySelectorAll('a');
        var reg = /目录/;
        switch (location.host){
            case 'www.bilinovel.com':
                return ReadParams.url_index;
                break;
            default:
                for(var i=0;i<as.length;i++){
                    var text = as[i].innerText;
                    var href = as[i].attributes.href && as[i].attributes.href.value;
                    if (text && text.length <= 10 && reg.test(text.trim()) && href && href != "#" && href.indexOf("javascript:") !== 0){
                        return href;
                    }
                }
                break;
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
    if (localStorage['_er-enable'] === 'true') {
        if (location.host == "www.linovelib.com") {
            window.addEventListener('load', () => {//为了加载哔哩轻小说的加密字体，故加载完成后再调用
                localStorage['_er-enable'] = 'false';
                checkAndCreateReader(true);
            });
        } else {
            localStorage['_er-enable'] = 'false';
            checkAndCreateReader(true);
        }
    }else if (blackList[location.host] == true){
        // 创建阅读模式悬浮按钮
        $('body').children[0].insertAdjacentHTML('beforeBegin', '<button id="_er-entryReadMode" style="' +
            '    position: fixed;' +
            '    right: 50px;' +
            '    bottom: 50px;' +
            '    background-color: rgba(255,255,255,0.5);' +
            '    backdrop-filter: blur(1px);' +
            '    border: 0px solid black;' +
            '    border-radius: 10px;' +
            '    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);' +
            '    padding: 0 5px;' +
            '    height: 50px;' +
            '    overflow: auto;' +
            '    font-size: 14px;' +
            '    color: black;' +
            '    z-index: 201901272210;">进入阅读模式</button>');
        $('#_er-entryReadMode').onclick = checkAndCreateReader;
    }
 
    function checkAndCreateReader(notAlert){
        // 通过调用通用模板尝试是否能够成功匹配到阅读内容
        var content = parseContentAndTitle();
        if (content && content.content){
            content.pageup = parsePageUp();
            content.pagedown = parsePageDown();
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
                $('.translator').style.color = 'lightgrey';
                document.querySelectorAll('.buttonBottom').forEach(function(element) {
                    element.style.color = 'lightgrey';
                    element.style.border = '0.5px solid lightgrey';
                });
                document.querySelectorAll('.buttonTop').forEach(function(element) {
                    element.style.color = 'lightgrey';
                });
                document.querySelectorAll('.exit').forEach(function(element) {
                    element.style.setProperty('box-shadow', '0px 4px 8px rgba(255, 255, 255, 0.2)');
                    element.style.setProperty('background-color', 'rgb(59,59,59)');
                    element.style.setProperty('color', 'white');
                });
                document.querySelectorAll('.toTop').forEach(function(element) {
                    element.style.setProperty('box-shadow', '0px 4px 8px rgba(255, 255, 255, 0.2)');
                    element.style.setProperty('background-color', 'rgb(59,59,59)');
                    element.style.setProperty('color', 'white');
                });
                document.querySelectorAll('._er-tts').forEach(function(element) {
                    element.style.setProperty('box-shadow', '0px 4px 8px rgba(255, 255, 255, 0.2)');
                    element.style.setProperty('background-color', 'rgb(59,59,59)');
                    element.style.setProperty('color', 'white');
                });
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
                $('.translator').style.color = 'black';
                document.querySelectorAll('.buttonBottom').forEach(function(element) {
                    element.style.border = '0.5px solid black';
                    element.style.color = 'black';
                });
                document.querySelectorAll('.buttonTop').forEach(function(element) {
                    element.style.border = '1px solid black';
                    element.style.color = 'black';
                });
                document.querySelectorAll('.exit').forEach(function(element) {
                    element.style.setProperty('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.2)');
                    element.style.setProperty('background-color', 'rgb(239,239,239)');
                    element.style.setProperty('color', 'black');
                });
                document.querySelectorAll('.toTop').forEach(function(element) {
                    element.style.setProperty('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.2)');
                    element.style.setProperty('background-color', 'rgb(239,239,239)');
                    element.style.setProperty('color', 'black');
                });
                document.querySelectorAll('._er-tts').forEach(function(element) {
                    element.style.setProperty('box-shadow', '0px 4px 8px rgba(0, 0, 0, 0.2)');
                    element.style.setProperty('background-color', 'rgb(239,239,239)');
                    element.style.setProperty('color', 'black');
                });
                break;
        }
        localStorage['_er-theme'] = theme;
        $('._er').dataset['theme'] = theme;
    }
    function setSimplemode(simplemode, contentHtml) {//简繁切换
        switch(simplemode) {
            case 'simple':
                contentHtml = traditionalized(contentHtml);
                break;
            case 'traditional':
                contentHtml = simplized(contentHtml);
                break;
        }
        localStorage['_er-simplemode'] = simplemode;
        $('._er').dataset['simplemode'] = simplemode;
        return contentHtml;
    }
 
    // 创建阅读器
    function createReader(content){
        voices = getVoice();//首次返回空串
        document.documentElement.style.overflow = 'hidden';
        $('#_er-entryReadMode') && $('#_er-entryReadMode').remove();
        addClassAndDom();
        if (window.SpeechSynthesisUtterance){
            $('#_er-tts').style.display = 'block';
        }
        if (GM_getValue('ttsbutton')==0){//本地缓存的设置
            document.querySelector('._er-tts').style.display = 'none';
        }
        if (GM_getValue('totopbutton')==0){
            document.querySelector('.toTop').style.display = 'none';
        }
        $("._er-title").style.fontFamily = GM_getValue('fontFamily',);
        $(".translator").style.fontFamily = GM_getValue('fontFamily',);
        $("._er-content").style.fontFamily = GM_getValue('fontFamily',);

        const entries = performance.getEntriesByType('resource');
        const hasFont = entries.some(entry => entry.name === 'https://www.linovelib.com/public/font/read.woff2');
        const hasFont2 = entries.some(entry => entry.name === 'https://www.bilinovel.com/public/font/read.woff2');
        if (hasFont || hasFont2) {//针对哔哩轻小说最后一段转码的情况
            addCSSRule('._er-content p:last-of-type', 'font-family: "read" !important;');
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
                contentHtml += '<p style="text-indent: 2em; margin-bottom: 1em;">' + line + '</p>';
            }
        }
        // 将图片插入到 contentHtml 中
        if (content.img && content.img.length > 0) {
            content.img.forEach(function(imgSrc) {
                contentHtml += '<div style="text-align: center; margin: 1em 0;">' +
                    '<img src="' + imgSrc + '" style="max-width: 100%; height: auto; display: none;" class="images" />' +
                    '</div>';
            });
        }
        $('._er-content').innerHTML = contentHtml;
        if (GM_getValue('imageshow')==true){
            document.querySelectorAll(".images").forEach(function(images) {
                images.style.display = 'block';
            });
        }
        if (location.host == "masiro.me") {
            var translatorInfoElm = document.getElementById('translator-info-elm');
            var translator = translatorInfoElm.textContent.trim();
            $('.translator').innerHTML = translator;
            $('.translator').style.display = 'block';
        }
        if (localStorage['_er-simplemode']) {
            $('._er-content').innerHTML=setSimplemode(localStorage['_er-simplemode'],$('._er-content').innerHTML);
            $('._er-title').innerHTML=setSimplemode(localStorage['_er-simplemode'],$('._er-title').innerHTML);
            $('.translator').innerHTML=setSimplemode(localStorage['_er-simplemode'],$('.translator').innerHTML);
        }
        var spanNodes = document.querySelectorAll('._er-content p');
        for(i=0;i<spanNodes.length;i++){
            spanNodes[i].onclick = function(){
                if ($('#_er-tts').innerText == '听书'){
                    for(var j=0;j<spanNodes.length;j++){
                        spanNodes[j].classList.remove('_er-none');
                        spanNodes[j].classList.remove('_er-current');
                    }
                    this.classList.add('_er-none');
                }
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
                        $('._er').scrollTop = $('._er').scrollTop - (document.documentElement.clientHeight - 24)
                    }
                    break;
                case 39: // right
                    if (e.ctrlKey) {
                        toNextPage()
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
            if (x <= width*0.2){ // 前翻一页
                $('._er').scrollTop = $('._er').scrollTop - (document.documentElement.clientHeight - 24)
            }else if(x >= width*0.8){ // 后翻一页
                $('._er').scrollTop = $('._er').scrollTop + (document.documentElement.clientHeight - 24);
            }
        }
        var erpageindex = document.querySelectorAll('#_er-pageindex');
        for (i = 0; i < erpageindex.length; i++) {
            erpageindex[i].onclick = function() {
                if (content.pageindex) {
                    location.href = content.pageindex;
                } else {
                    alert('很抱歉，没有匹配到目录！');
                }
            };
        }
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
        var pressTimer;//定时器
        var touchpressTimer;//触摸定时器
        var isLongPress = false; // 长按标记
        $('#_er-simplemode').addEventListener('touchstart', function() {//触摸屏
            touchpressTimer = setTimeout(function() {
                isLongPress = true;
                localStorage['_er-simplemode'] = '';
                $('._er-content').innerHTML = contentHtml;
                $('._er-title').innerText = content.title;
                if (location.host == "masiro.me") {
                    $('.translator').innerHTML = translator;
                }
            }, 500);
        });
        $('#_er-simplemode').addEventListener('touchend', function() {
            clearTimeout(touchpressTimer);
        });
 
        $('#_er-simplemode').addEventListener('mousedown', function() {//PC
            pressTimer = setTimeout(function() {
                isLongPress = true;
                localStorage['_er-simplemode'] = '';
                $('._er-content').innerHTML = contentHtml;
                $('._er-title').innerText = content.title;
                if (location.host == "masiro.me") {
                    $('.translator').innerHTML = translator;
                }
            }, 500);
        });
        $('#_er-simplemode').addEventListener('mouseup', function() {
            clearTimeout(pressTimer);
            if (!isLongPress) {
                var current = $('._er').dataset['simplemode'] || 'traditional';
                var simplemodeList = ['simple', 'traditional'];
                var index = simplemodeList.indexOf(current);
                if (index === -1) index = 0;
                index++;
                if (index >= simplemodeList.length) {
                    index = 0;
                }
                $('._er-content').innerHTML=setSimplemode(simplemodeList[index],$('._er-content').innerHTML);
                $('.translator').innerHTML=setSimplemode(simplemodeList[index],$('.translator').innerHTML);
                $('._er-title').innerHTML=setSimplemode(simplemodeList[index],$('._er-title').innerHTML);
            } else {
                $('._er').dataset['simplemode'] = '';
                current = $('._er').dataset['simplemode'] || 'traditional';
                simplemodeList = ['simple', 'traditional'];
                index = simplemodeList.indexOf(current);;
            }
            isLongPress = false;
            var spanNodes = document.querySelectorAll('._er-content p');
            for(i=0;i<spanNodes.length;i++){//重新为每一段添加点击事件
                spanNodes[i].onclick = function(){
                    if ($('#_er-tts').innerText == '听书'){
                        for(var j=0;j<spanNodes.length;j++){
                            spanNodes[j].classList.remove('_er-none');
                            spanNodes[j].classList.remove('_er-current');
                        }
                        this.classList.add('_er-none');
                    }
                }
            }
        });
        var erpageup = document.querySelectorAll('#_er-pageup');
        for (i = 0; i < erpageup.length; i++) {
            erpageup[i].onclick = function() {
                if (content.pageup) {
                    localStorage['_er-enable'] = 'true';
                    location.href = content.pageup;
                } else {
                    alert('很抱歉，没有匹配到上一页！');
                }
            };
        }
        var erpagedown = document.querySelectorAll('#_er-pagedown');
        for (i = 0; i < erpagedown.length; i++) {
            erpagedown[i].onclick = function() {
                if (content.pagedown) {
                    localStorage['_er-enable'] = 'true';
                    location.href = content.pagedown;
                } else {
                    alert('很抱歉，没有匹配到下一页！');
                }
            };
        }
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
        $('#_er-toTop').onclick= function() {
            document.querySelector('._er').scrollTop = 0;
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
            autoplay = false;
            $('#_er-tts').innerText = '停止';
            $('#_er-tts').dataset['pause'] = 'false';
            playNextText();
        }else{
            $('#_er-tts').dataset['pause'] = 'true';
        }

        var start=1;
        var end=10;
        var t1 = setInterval(function(){
            for (var n=0;n<10;++n){
                $(".adsbygoogle") && $(".adsbygoogle").remove();
            }
            $("#bottomads") && $("#bottomads").remove();
            $("script[src*='adsbygoogle.js']") && $("script[src*='adsbygoogle.js']").remove();
            $("script[src*='g.doubleclick.net']") && $("script[src*='g.doubleclick.net']").remove();
            $("script[src*='googletagmanager.com']") && $("script[src*='googletagmanager.com']").remove();
            $("script[src*='googlesyndication.com']") && $("script[src*='googlesyndication.com']").remove();
            $("iframe[src*='google.com']") && $("iframe[src*='google.com']").remove();
            $("div[id*='google_ads']") && $("div[id*='google_ads']").remove();
            $("div[data-google-query-id]") && $("div[data-google-query-id]").remove();
            //$("div[class*='m7']") && $("div[class*='m7']").remove();
            $("div[class*='adblock']") && $("div[class*='adblock']").remove();
            if ($("div[id='TextContent']")) {
                $("div[id='TextContent']").style.display = 'block';
            }
            if ($("div[id='acontent']")) {
                $("div[id='acontent']").style.display = 'block';
            }
            $("script[src*='tip_chapter.js']") && $("script[src*='tip_chapter.js']").remove();
            // 删除id为mlfy_main_text的div容器下的第一个div元素
            const mainTextDiv = document.getElementById('mlfy_main_text');
            if (mainTextDiv) {
                const firstDiv = mainTextDiv.querySelector('div');
                if (firstDiv && firstDiv.id!== 'TextContent') {
                    firstDiv.remove();
                }
            }
            const apageDiv = document.getElementById('apage');
            if (apageDiv) {
                const divs = apageDiv.querySelectorAll('div');
                if (divs.length >= 2) {
                    const secondDiv = divs[1];
                    if (secondDiv.id!== 'acontent') {
                        secondDiv.remove();
                    }
                }
            }
            start++;
            if (start>=end ){
                clearInterval(t1);
            }
        },1000);
    }
 
    // 听书功能
    function playNextText(){
        updateReadPos();
        var current = $('._er-current');
        var ernone = $('._er-none');
        var playText = '';
        if (current){
            playText = current.innerText;
        }else if(ernone) {
            playText = ernone.innerText;
            ernone.classList.add('_er-current');
            ernone.classList.remove('_er-none');
        }else{
            playText = $('._er-title').innerText;
        }
        if (playText){
            var utterThis = new SpeechSynthesisUtterance();
            utterThis.text = playText;
            if (GM_getValue('voice') != undefined) {
                var selectedVoiceName = GM_getValue('voice');
                voices = getVoice();
                var selectedVoice = voices.find(function(voice) {
                    return voice.name === selectedVoiceName;
                });
                if (selectedVoice) {
                    utterThis.voice = selectedVoice;
                }
            }
            utterThis.rate = GM_getValue('rateInput',1);
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
            while(nextSpan && nextSpan.nodeName !== 'P'){
                nextSpan = nextSpan.nextElementSibling;
            }
        }else{
            nextSpan = $('._er-content p');
        }
        if (current) current.classList.remove('_er-current');
        if (nextSpan) nextSpan.classList.add('_er-current');
    }
 
    function toPrevReadPos(){
        var current = $('._er-current');
        var prevSpan = null;
        if (current){
            prevSpan = current.previousElementSibling;
            while(prevSpan && prevSpan.nodeName !== 'P'){
                prevSpan = prevSpan.previousElementSibling;
            }
        }
        if (current) current.classList.remove('_er-current');
        if (prevSpan) prevSpan.classList.add('_er-current');
    }
 
    function updateReadPos(){
        if ($('._er-current')) {
            $('._er').scrollTop = $('._er-current').offsetTop - (document.documentElement.clientHeight / 2);
        }
    }
 
    function getVoice() {//获取可用语音
        if (window.SpeechSynthesisUtterance){
            voices = speechSynthesis.getVoices();
        }
        var chineseVoices = voices.filter(function(voice) {
            return voice.lang.startsWith('zh');
        });
        return chineseVoices;
    }
 
    function setFontSize(){
        localStorage["_er_fontsize"] = fontsize;
        $('._er-title').style.fontSize = (20+fontsize) + 'px';
        $('._er-title').style.lineHeight = ((20+fontsize)*1.5) + 'px';
        $('._er-content').style.fontSize = (14+fontsize) + 'px';
        $('._er-content').style.lineHeight = ((14+fontsize)*1.5) + 'px';
        $('.translator').style.fontSize = (10+fontsize) + 'px';
        $('.translator').style.lineHeight = ((10+fontsize)*1.5) + 'px';
    }
 
    function setPadding() {
        localStorage["_er_padding"] = padding;
        $('._er-content').style.padding = '10px ' + padding + '%';
    }
 
    function hasCSSRule(selector) {
        // 获取所有的样式表
        const styleSheets = document.styleSheets;
        for (let i = 0; i < styleSheets.length; i++) {
            const rules = styleSheets[i].cssRules || styleSheets[i].rules; // 兼容不同浏览器
            if (rules) {
                for (let j = 0; j < rules.length; j++) {
                    if (rules[j].selectorText === selector) {
                        return true;
                    }
                }
            }
        }
 
        return false;
    }
    function addCSSRule(selector, styles) {
        const styleSheet = document.styleSheets[0];
        const rule = `${selector} { ${styles} }`;
        styleSheet.insertRule(rule, styleSheet.cssRules.length);
    }
 
    var oldOverflow = '';
    var oldOnKeyDown = $('body').onkeydown;
 
    function removeDom(){
        var erScrollTop = document.querySelector('._er').scrollTop;
        var erScrollHeight = document.querySelector('._er').scrollHeight;
        var erClientHeight = document.documentElement.clientHeight;
        var scrollPercentage = (erScrollTop / (erScrollHeight - erClientHeight)) * 100;
        $('._er').remove();
        document.documentElement.style.overflow = 'auto';
        $('body').style.overflow = oldOverflow;
        $('body').onkeydown = oldOnKeyDown;
        $('body').children[0].insertAdjacentHTML('beforeBegin', '<button id="_er-entryReadMode" style="' +
            '    position: fixed;' +
            '    right: 50px;' +
            '    bottom: 50px;' +
            '    background-color: rgba(255,255,255,0.5);' +
            '    backdrop-filter: blur(1px);' +
            '    border: 0px solid black;' +
            '    border-radius: 10px;' +
            '    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);' +
            '    padding: 0 5px;' +
            '    height: 50px;' +
            '    overflow: auto;' +
            '    font-size: 14px;' +
            '    color: black;' +
            '    z-index: 201901272210;">进入阅读模式</button>');
        $('#_er-entryReadMode').onclick = checkAndCreateReader;
        setTimeout(function() {
            var restoredScrollTop = ((erScrollHeight - erClientHeight) * (scrollPercentage / 100));
            window.scrollTo(0, restoredScrollTop);
        }, 0);
    }
 
    function addClassAndDom(){
        var originalScrollTop = window.pageYOffset;
        var originalScrollHeight = document.documentElement.scrollHeight;
        var originalClientHeight = document.documentElement.clientHeight;
        var scrollPercentage = (originalScrollTop / (originalScrollHeight - originalClientHeight)) * 100;
        oldOverflow = $('body').style.overflow;
        $('body').style.overflow = 'hidden';
 
        $('body').children[0].insertAdjacentHTML('beforeBegin',
            '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"><div class="_er">' +
            '    <button type="button" id="_er-tts" class="_er-tts">听书</button>' +
            '    <div class="_er-tools" style="margin-top:0;">' +
            '        <button type="button" id="_er-pageup"  class="buttonBottom" style="width:50%; margin: 0;">上一页</button>' +
            '        <button type="button" id="_er-pageindex"  class="buttonBottom" style="padding: 5px 40px; margin: 0;">目录</button>' +
            '        <button type="button" id="_er-pagedown"  class="buttonBottom" style="width:50%; margin: 0;">下一页</button>' +
            '    </div>' +
            '    <div class="_er-tools">' +
            '        <button type="button" id="_er-switch-theme" class="buttonTop">切换主题</button>' +
            '        <button type="button" id="_er-font-plus" class="buttonTop">字号+</button>' +
            '        <button type="button" id="_er-font-minus" class="buttonTop">字号-</button>' +
            '        <button type="button" id="_er-border" class="buttonTop">边距</button>' +
            '        <button type="button" id="_er-simplemode" class="buttonTop">简 / 繁</button>' +
            '        <button type="button" id="_er-toTop" class="toTop">' +
            '            <span class="first-line">回到</span>' +
            '            <span class="second-line">顶部</span>' +
            '        </button>' +
            '        <button type="button" id="_er-close" class="exit">退出</button>' +
            '    </div>' +
            '    <div class="_er-title"></div>' +
            '    <div class="translator"></div>' +
            '    <div class="_er-content">' +
            '    </div>' +
            '    <div class="_er-tools">' +
            '        <button type="button" id="_er-pageup"  class="buttonBottom" style="width: 50%;">上一页</button>' +
            '        <button type="button" id="_er-pageindex"  class="buttonBottom" style="padding: 5px 40px;">目录</button>' +
            '        <button type="button" id="_er-pagedown"  class="buttonBottom" style="width: 50%;">下一页</button>' +
            '    </div>' +
            '</div>');
        if (!document.querySelector('#_er-styles')) {
            $('body').children[0].insertAdjacentHTML('beforeBegin',
                '<style id="_er-styles">' +
                '* {' +
                    '-webkit-user-select: none; /* Safari */' +
                    '-moz-user-select: none; /* Firefox */' +
                    '-ms-user-select: none; /* IE 10+ */' +
                    'user-select: none; /* 标准语法 */' +
                '}' +
                '._er{' +
                '    position: fixed;' +
                '    left: 0;' +
                '    right: 0;' +
                '    top: 0;' +
                '    bottom: 0;' +
                '    overflow-y: auto;' +
                '    overflow-x: hidden;' +
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
                '.translator{' +
                '    text-align: center;' +
                '    font-size: 10px;' +
                '    line-height: 15px;' +
                '    padding: 0 10% 10px;' +
                '    color: black;' +
                '    display: none;' +
                '}' +
                '._er-content{' +
                '    padding: 10px 10%;' +
                '    font-size: 14px;' +
                '    line-height: 21px;' +
                '    color: black;' +
                '    word-break:break-all' +
                '}' +
                '._er-tools{' +
                '    margin-top: 10px;' +
                '    margin-bottom: 10px;' +
                '    text-align: center;' +
                '    display: flex;' +
                '    justify-content: center;' +
                '}' +
                '.buttonTop{' +
                '    cursor: pointer;' +
                '    color: black;' +
                '    background-color: rgba(255,255,255,0.5);' +
                '    border: 1px solid black;' +
                '    padding: 5px 8px;' +
                '    margin: 8px 5px 0;' +
                '    border-radius: 10px;' +
                '    white-space: nowrap;' +
                '}' +
                '.buttonTop:hover{' +
                '    background-color: rgba(255,255,255,0.9);' +
                '}' +
                '.buttonTop:active{' +
                '    background-color: rgba(255,255,255,0.7);' +
                '}' +
                '.buttonBottom{' +
                '    cursor: pointer;' +
                '    color: black;' +
                '    background-color: rgba(255,255,255,0);' +
                '    border: 0.5px solid black;' +
                '    padding: 0px 0px;' +
                '    margin: 20px 0 80px;' +
                '    font-size: 20px;' +
                '    white-space: nowrap;' +
                '}' +
                '.buttonBottom:hover{' +
                '    background-color: rgba(255,255,255,0.8);' +
                '}' +
                '.buttonBottom:active{' +
                '    background-color: rgba(255,255,255,0.5);' +
                '}' +
                '.toTop{' +
                '    width: 50px;' +
                '    height: 50px;' +
                '    position: fixed;' +
                '    right: 15px;' +
                '    bottom: 80px;' +
                '    z-index: 201901272212;' +
                '    color: black;' +
                '    border: 0px solid black;' +
                '    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);' +
                '    opacity: 0.8;' +
                '    cursor: pointer;' +
                '    border-radius: 25px;' +
                '    font-size: 14px;' +
                '    padding: 0;' +
                '    display: flex;' +
                '    flex-direction: column;' +
                '    align-items: center;' +
                '    justify-content: center;' +
                '}' +
                '.first-line,' +
                '.second-line {' +
                '    display: inline-block;' +
                '    white-space: nowrap;' +
                '}' +
                '.exit{' +
                '    width: 50px;' +
                '    height: 50px;' +
                '    position: fixed;' +
                '    right: 15px;' +
                '    bottom: 15px;' +
                '    z-index: 201901272212;' +
                '    color: black;' +
                '    border: 0px solid black;' +
                '    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);' +
                '    opacity: 0.8;' +
                '    cursor: pointer;' +
                '    border-radius: 25px;' +
                '    font-size: 14px;' +
                '    padding: 0;' +
                '    white-space: nowrap;' +
                '}' +
                '._er-tts {' +
                '    width: 50px;' +
                '    height: 50px;' +
                '    position: fixed;' +
                '    left: 15px;' +
                '    bottom: 15px;' +
                '    z-index: 201901272212;' +
                '    color: black;' +
                '    border: 0px solid black;' +
                '    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);' +
                '    opacity: 0.8;' +
                '    cursor: pointer;' +
                '    border-radius: 25px;' +
                '    font-size: 14px;' +
                '    padding: 0;' +
                '    white-space: nowrap;' +
                '    display: none;' +
                '}' +
                '._er-current{' +
                '    background-color: yellow;' +
                '    color: black;' +
                '}' +
                '._er-none{' +
                '}' +
                '</style>');
        }
        setTimeout(function() {
            var restoredScrollTop = ((originalScrollHeight - originalClientHeight) * (scrollPercentage / 100));
            document.querySelector('._er').scrollTop = restoredScrollTop;
        }, 0);
    }
    function addDialog(){
        if (!document.querySelector('#myDialog')) {
            $('body').children[0].insertAdjacentHTML('beforeBegin',
                                                     '<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no"><dialog id="myDialog">' +
                                                     '    <h2>设置</h2>' +
                                                     '    <div class="checkbox-container">' +
                                                     '        <div class="congfigcheckbox">' +
                                                     '            <label>' +
                                                     '                <input type="checkbox" name="scrollToTop" value="1"> 回到顶部按钮' +
                                                     '            </label>' +
                                                     '        </div>' +
                                                     '        <div class="congfigcheckbox">' +
                                                     '            <label>' +
                                                     '                <input type="checkbox" name="listen" value="1"> 听书按钮' +
                                                     '            </label>' +
                                                     '        </div>' +
                                                     '        <div class="congfigcheckbox">' +
                                                     '            <label>' +
                                                     '                <input type="checkbox" name="imageshow" value="0"> 插图显示' +
                                                     '            </label>' +
                                                     '        </div>' +
                                                     '        <div class="font-selector">' +
                                                     '            <label for="fontSelect">选择字体样式：</label>' +
                                                     '            <select id="fontSelect">' +
                                                     '            </select>' +
                                                     '        </div>' +
                                                     '        <div class="voice-selector">' +
                                                     '            <label for="voiceSelect">选择听书语音：</label>' +
                                                     '            <select id="voiceSelect">' +
                                                     '            </select>' +
                                                     '        </div>' +
                                                     '        <div class="rate-input">' +
                                                     '            <label for="rateInput">设置朗读语速：</label>' +
                                                     '            <input type="number" id="rateInput" min="0.1" max="10" step="0.05">' +
                                                     '        </div>' +
                                                     '    </div>' +
                                                     '    <div class="configbutton">' +
                                                     '        <button id="configreset">重置</button>' +
                                                     '        <button id="closeDialog" style="margin-left: 80px;">确定</button>' +
                                                     '    </div>' +
                                                     '</dialog>');
        }
        if (!document.querySelector('#dialog-styles')) {
            $('body').children[0].insertAdjacentHTML('beforeBegin',
                '<style id="dialog-styles">' +
                '#myDialog {' +
                '    padding: 20px;' +
                '    margin: 0;' +
                '    background-color: #f2f2f2;' +
                '    border: 1px solid #ccc;' +
                '    border-radius: 10px;' +
                '    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);' +
                '    font-family: Arial, sans-serif;' +
                '    display: flex;' +
                '    flex-direction: column;' +
                '    align-items: center;' +
                '    position: fixed;' +
                '    top: 50%;' +
                '    left: 50%;' +
                '    transform: translate(-50%, -50%);' +
                '}' +
                '#myDialog::backdrop {' +
                '    background: rgba(30,30,30,0.2);' +
                '    backdrop-filter: blur(3px);' +
                '}' +
                '#myDialog h2 {' +
                '    margin-top: 0;' +
                '    font-size: 24px;' +
                '    font-weight: bold;' +
                '    margin-bottom: 12px;' +
                '    line-height: 1.5;' +
                '}' +
                '.checkbox-container {' +
                '    display: flex;' +
                '    flex-direction: column;' +
                '    align-items: flex-start;' +
                '}' +
                '.congfigcheckbox {' +
                '    margin-bottom: 10px;' +
                '}' +
                '.font-selector,.voice-selector,.rate-input {' +
                '    margin-bottom: 20px;' +
                '    display: block;' +
                '}' +
                '.font-selector label,.voice-selector label,.rate-input label {' +
                '    font-size: 16px;' +
                '    font-weight: bold;' +
                '    margin: 0 10px 0 0;' +
                '    color: #333;' +
                '}' +
                '.font-selector select,.voice-selector select,.rate-input input {' +
                '    font-size: 16px;' +
                '    padding: 5px;' +
                '    border: 1px solid #ccc;' +
                '    border-radius: 4px;' +
                '    background-color: #fff;' +
                '    cursor: pointer;' +
                '    transition: border-color 0.3s ease;' +
                '    color: black;' +
                '    max-width: 150px;' +
                '}' +
                '.font-selector select,.voice-selector select,.rate-input input:hover {' +
                '    border-color: #007BFF;' +
                '}' +
                '.font-selector select,.voice-selector select,.rate-input input:focus {' +
                '    outline: none;' +
                '    border-color: #007BFF;' +
                '    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);' +
                '}' +
                '.congfigcheckbox label {' +
                '    display: flex;' +
                '    margin: 0 0 10px;' +
                '    font-size: 16px;' +
                '    padding: 0 ;' +
                '    font-weight: normal;' +
                '    align-items: center;' +
                '}' +
                '.congfigcheckbox input[type="checkbox"] {' +
                '    border: 1px solid #B4B4B4;' +
                '    padding: 1px;' +
                '    margin-right: 10px;' +
                '    margin-top: 1px;' +
                '    width: 16px;' +
                '    height: 16px;' +
                '    background: none;' +
                '    cursor: pointer;' +
                '    visibility: visible;' +
                '    position: static;' +
                '    vertical-align: middle;' +
                '}' +
                '.configbutton {' +
                '    display: flex;' +
                '    justify-content: space-between;' +
                '}' +
                '#myDialog button {' +
                '    padding: 8px 16px;' +
                '    background-color: #4CAF50;' +
                '    color: #fff;' +
                '    border: none;' +
                '    border-radius: 4px;' +
                '    cursor: pointer;' +
                '    font-size: 14px;' +
                '}' +
                '#myDialog button:hover {' +
                '    background-color: #45a049;' +
                '}' +
                '</style>');
        }
    }

    function ftPYStr(){
        return '錒皚藹礙愛噯嬡璦曖靄諳銨鵪骯襖奧媼驁鰲壩罷鈀擺敗唄頒辦絆鈑幫綁鎊謗剝飽寶報鮑鴇齙輩貝鋇狽備憊鵯賁錛繃筆畢斃幣閉蓽嗶潷鉍篳蹕邊編貶變辯辮芐緶籩標驃颮飆鏢鑣鰾鱉別癟瀕濱賓擯儐繽檳殯臏鑌髕鬢餅稟撥缽鉑駁餑鈸鵓補鈽財參蠶殘慚慘燦驂黲蒼艙倉滄廁側冊測惻層詫鍤儕釵攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆懺嬋驏覘禪鐔場嘗長償腸廠暢倀萇悵閶鯧鈔車徹硨塵陳襯傖諶櫬磣齔撐稱懲誠騁棖檉鋮鐺癡遲馳恥齒熾飭鴟沖衝蟲寵銃疇躊籌綢儔幬讎櫥廚鋤雛礎儲觸處芻絀躕傳釧瘡闖創愴錘綞純鶉綽輟齪辭詞賜鶿聰蔥囪從叢蓯驄樅湊輳躥竄攛錯銼鹺達噠韃帶貸駘紿擔單鄲撣膽憚誕彈殫賧癉簞當擋黨蕩檔讜碭襠搗島禱導盜燾燈鄧鐙敵滌遞締糴詆諦綈覿鏑顛點墊電巔鈿癲釣調銚鯛諜疊鰈釘頂錠訂鋌丟銩東動棟凍崠鶇竇犢獨讀賭鍍瀆櫝牘篤黷鍛斷緞籪兌隊對懟鐓噸頓鈍燉躉奪墮鐸鵝額訛惡餓諤堊閼軛鋨鍔鶚顎顓鱷誒兒爾餌貳邇鉺鴯鮞發罰閥琺礬釩煩販飯訪紡鈁魴飛誹廢費緋鐨鯡紛墳奮憤糞僨豐楓鋒風瘋馮縫諷鳳灃膚輻撫輔賦復負訃婦縛鳧駙紱紼賻麩鮒鰒釓該鈣蓋賅桿趕稈贛尷搟紺岡剛鋼綱崗戇鎬睪誥縞鋯擱鴿閣鉻個紇鎘潁給亙賡綆鯁龔宮鞏貢鉤溝茍構購夠詬緱覯蠱顧詁轂鈷錮鴣鵠鶻剮掛鴰摑關觀館慣貫詿摜鸛鰥廣獷規歸龜閨軌詭貴劊匭劌媯檜鮭鱖輥滾袞緄鯀鍋國過堝咼幗槨蟈鉿駭韓漢闞絎頡號灝顥閡鶴賀訶闔蠣橫轟鴻紅黌訌葒閎鱟壺護滬戶滸鶘嘩華畫劃話驊樺鏵懷壞歡環還緩換喚瘓煥渙奐繯鍰鯇黃謊鰉揮輝毀賄穢會燴匯諱誨繪詼薈噦澮繢琿暉葷渾諢餛閽獲貨禍鈥鑊擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽夾莢頰賈鉀價駕郟浹鋏鎵蟯殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗諫縑戔戩瞼鶼筧鰹韉將漿蔣槳獎講醬絳韁膠澆驕嬌攪鉸矯僥腳餃繳絞轎較撟嶠鷦鮫階節潔結誡屆癤頜鮚緊錦僅謹進晉燼盡勁荊莖巹藎饉縉贐覲鯨驚經頸靜鏡徑痙競凈剄涇逕弳脛靚糾廄舊鬮鳩鷲駒舉據鋸懼劇詎屨櫸颶鉅鋦窶齟鵑絹錈鐫雋覺決絕譎玨鈞軍駿皸開凱剴塏愾愷鎧鍇龕閌鈧銬顆殼課騍緙軻鈳錁頷墾懇齦鏗摳庫褲嚳塊儈鄶噲膾寬獪髖礦曠況誆誑鄺壙纊貺虧巋窺饋潰匱蕢憒聵簣閫錕鯤擴闊蠐蠟臘萊來賴崍徠淶瀨賚睞錸癩籟藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫嵐欖斕鑭襤瑯閬鋃撈勞澇嘮嶗銠鐒癆樂鰳鐳壘類淚誄縲籬貍離鯉禮麗厲勵礫歷瀝隸儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧倆聯蓮連鐮憐漣簾斂臉鏈戀煉練蘞奩瀲璉殮褳襝鰱糧涼兩輛諒魎療遼鐐繚釕鷯獵臨鄰鱗凜賃藺廩檁轔躪齡鈴靈嶺領綾欞蟶鯪餾劉瀏騮綹鎦鷚龍聾嚨籠壟攏隴蘢瀧瓏櫳朧礱樓婁摟簍僂蔞嘍嶁鏤瘺耬螻髏蘆盧顱廬爐擄鹵虜魯賂祿錄陸壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸巒攣孿灤亂臠孌欒鸞鑾掄輪倫侖淪綸論圇蘿羅邏鑼籮騾駱絡犖玀濼欏腡鏍驢呂鋁侶屢縷慮濾綠櫚褸鋝嘸媽瑪碼螞馬罵嗎嘜嬤榪買麥賣邁脈勱瞞饅蠻滿謾縵鏝顙鰻貓錨鉚貿麼沒鎂門悶們捫燜懣鍆錳夢瞇謎彌覓冪羋謐獼禰綿緬澠靦黽廟緲繆滅憫閩閔緡鳴銘謬謨驀饃歿鏌謀畝鉬吶鈉納難撓腦惱鬧鐃訥餒內擬膩鈮鯢攆輦鯰釀鳥蔦裊聶嚙鑷鎳隉蘗囁顢躡檸獰寧擰濘苧嚀聹鈕紐膿濃農儂噥駑釹諾儺瘧歐鷗毆嘔漚謳慪甌盤蹣龐拋皰賠轡噴鵬紕羆鈹騙諞駢飄縹頻貧嬪蘋憑評潑頗釙撲鋪樸譜鏷鐠棲臍齊騎豈啟氣棄訖蘄騏綺榿磧頎頏鰭牽釬鉛遷簽謙錢鉗潛淺譴塹僉蕁慳騫繾槧鈐槍嗆墻薔強搶嬙檣戧熗錆鏘鏹羥蹌鍬橋喬僑翹竅誚譙蕎繰磽蹺竊愜鍥篋欽親寢鋟輕氫傾頃請慶撳鯖瓊窮煢蛺巰賕蟣鰍趨區軀驅齲詘嶇闃覷鴝顴權勸詮綣輇銓卻鵲確闋闕愨讓饒擾繞蕘嬈橈熱韌認紉飪軔榮絨嶸蠑縟銣顰軟銳蜆閏潤灑薩颯鰓賽傘毿糝喪騷掃繅澀嗇銫穡殺剎紗鎩鯊篩曬釃刪閃陜贍繕訕姍騸釤鱔墑傷賞坰殤觴燒紹賒攝懾設厙灄畬紳審嬸腎滲詵諗瀋聲繩勝師獅濕詩時蝕實識駛勢適釋飾視試謚塒蒔弒軾貰鈰鰣壽獸綬樞輸書贖屬術樹豎數攄紓帥閂雙誰稅順說碩爍鑠絲飼廝駟緦鍶鷥聳慫頌訟誦擻藪餿颼鎪蘇訴肅謖穌雖隨綏歲誶孫損筍蓀猻縮瑣鎖嗩脧獺撻闥鉈鰨臺態鈦鮐攤貪癱灘壇譚談嘆曇鉭錟頇湯燙儻餳鐋鏜濤絳討韜鋱騰謄銻題體屜緹鵜闐條糶齠鰷貼鐵廳聽烴銅統慟頭鈄禿圖釷團摶頹蛻飩脫鴕馱駝橢籜鼉襪媧膃彎灣頑萬紈綰網輞韋違圍為濰維葦偉偽緯謂衛諉幃闈溈潿瑋韙煒鮪溫聞紋穩問閿甕撾蝸渦窩臥萵齷嗚鎢烏誣無蕪吳塢霧務誤鄔廡憮嫵騖鵡鶩錫犧襲習銑戲細餼鬩璽覡蝦轄峽俠狹廈嚇硤鮮纖賢銜閑顯險現獻縣餡羨憲線莧薟蘚峴獫嫻鷴癇蠔秈躚廂鑲鄉詳響項薌餉驤緗饗蕭囂銷曉嘯嘵瀟驍綃梟簫協挾攜脅諧寫瀉謝褻擷紲纈鋅釁興陘滎兇洶銹繡饈鵂虛噓須許敘緒續詡頊軒懸選癬絢諼鉉鏇學謔澩鱈勛詢尋馴訓訊遜塤潯鱘壓鴉鴨啞亞訝埡婭椏氬閹煙鹽嚴巖顏閻艷厭硯彥諺驗厴贗儼兗讞懨閆釅魘饜鼴鴦楊揚瘍陽癢養樣煬瑤搖堯遙窯謠藥軺鷂鰩爺頁業葉靨謁鄴曄燁醫銥頤遺儀蟻藝億憶義詣議誼譯異繹詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤蔭陰銀飲隱銦癮櫻嬰鷹應纓瑩螢營熒蠅贏穎塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌喲擁傭癰踴詠鏞優憂郵鈾猶誘蕕銪魷輿魚漁娛與嶼語獄譽預馭傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬鴛淵轅園員圓緣遠櫞鳶黿約躍鑰粵悅閱鉞鄖勻隕運蘊醞暈韻鄆蕓惲慍紜韞殞氳雜災載攢暫贊瓚趲鏨贓臟駔鑿棗責擇則澤賾嘖幘簀賊譖贈綜繒軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻譫張漲帳賬脹趙詔釗蟄轍鍺這謫輒鷓貞針偵診鎮陣湞縝楨軫賑禎鴆掙睜猙爭幀癥鄭證諍崢鉦錚箏織職執紙摯擲幟質滯騭櫛梔軹輊贄鷙螄縶躓躑觶鐘終種腫眾鍾謅軸皺晝驟紂縐豬諸誅燭矚囑貯鑄駐佇櫧銖專磚轉賺囀饌顳樁莊裝妝壯狀錐贅墜綴騅縋諄準著濁諑鐲茲資漬諮緇輜貲眥錙齜鯔蹤總縱傯鄒諏騶鯫詛組鏃鉆纘躦鱒翺並蔔沈醜澱鬥範幹臯矽櫃後夥稭傑訣誇裏淩麽黴撚淒扡聖屍擡塗窪餵汙鍁鹹蠍彜湧遊籲禦願嶽雲竈紮劄築於誌註雕訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩濫瀦寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇';
    }
    function charPYStr(){
        return '锕皑蔼碍爱嗳嫒瑷暧霭谙铵鹌肮袄奥媪骜鳌坝罢钯摆败呗颁办绊钣帮绑镑谤剥饱宝报鲍鸨龅辈贝钡狈备惫鹎贲锛绷笔毕毙币闭荜哔滗铋筚跸边编贬变辩辫苄缏笾标骠飑飙镖镳鳔鳖别瘪濒滨宾摈傧缤槟殡膑镔髌鬓饼禀拨钵铂驳饽钹鹁补钸财参蚕残惭惨灿骖黪苍舱仓沧厕侧册测恻层诧锸侪钗搀掺蝉馋谗缠铲产阐颤冁谄谶蒇忏婵骣觇禅镡场尝长偿肠厂畅伥苌怅阊鲳钞车彻砗尘陈衬伧谌榇碜龀撑称惩诚骋枨柽铖铛痴迟驰耻齿炽饬鸱冲冲虫宠铳畴踌筹绸俦帱雠橱厨锄雏础储触处刍绌蹰传钏疮闯创怆锤缍纯鹑绰辍龊辞词赐鹚聪葱囱从丛苁骢枞凑辏蹿窜撺错锉鹾达哒鞑带贷骀绐担单郸掸胆惮诞弹殚赕瘅箪当挡党荡档谠砀裆捣岛祷导盗焘灯邓镫敌涤递缔籴诋谛绨觌镝颠点垫电巅钿癫钓调铫鲷谍叠鲽钉顶锭订铤丢铥东动栋冻岽鸫窦犊独读赌镀渎椟牍笃黩锻断缎簖兑队对怼镦吨顿钝炖趸夺堕铎鹅额讹恶饿谔垩阏轭锇锷鹗颚颛鳄诶儿尔饵贰迩铒鸸鲕发罚阀珐矾钒烦贩饭访纺钫鲂飞诽废费绯镄鲱纷坟奋愤粪偾丰枫锋风疯冯缝讽凤沣肤辐抚辅赋复负讣妇缚凫驸绂绋赙麸鲋鳆钆该钙盖赅杆赶秆赣尴擀绀冈刚钢纲岗戆镐睾诰缟锆搁鸽阁铬个纥镉颍给亘赓绠鲠龚宫巩贡钩沟苟构购够诟缑觏蛊顾诂毂钴锢鸪鹄鹘剐挂鸹掴关观馆惯贯诖掼鹳鳏广犷规归龟闺轨诡贵刽匦刿妫桧鲑鳜辊滚衮绲鲧锅国过埚呙帼椁蝈铪骇韩汉阚绗颉号灏颢阂鹤贺诃阖蛎横轰鸿红黉讧荭闳鲎壶护沪户浒鹕哗华画划话骅桦铧怀坏欢环还缓换唤痪焕涣奂缳锾鲩黄谎鳇挥辉毁贿秽会烩汇讳诲绘诙荟哕浍缋珲晖荤浑诨馄阍获货祸钬镬击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫夹荚颊贾钾价驾郏浃铗镓蛲歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧谏缣戋戬睑鹣笕鲣鞯将浆蒋桨奖讲酱绛缰胶浇骄娇搅铰矫侥脚饺缴绞轿较挢峤鹪鲛阶节洁结诫届疖颌鲒紧锦仅谨进晋烬尽劲荆茎卺荩馑缙赆觐鲸惊经颈静镜径痉竞净刭泾迳弪胫靓纠厩旧阄鸠鹫驹举据锯惧剧讵屦榉飓钜锔窭龃鹃绢锩镌隽觉决绝谲珏钧军骏皲开凯剀垲忾恺铠锴龛闶钪铐颗壳课骒缂轲钶锞颔垦恳龈铿抠库裤喾块侩郐哙脍宽狯髋矿旷况诓诳邝圹纩贶亏岿窥馈溃匮蒉愦聩篑阃锟鲲扩阔蛴蜡腊莱来赖崃徕涞濑赉睐铼癞籁蓝栏拦篮阑兰澜谰揽览懒缆烂滥岚榄斓镧褴琅阆锒捞劳涝唠崂铑铹痨乐鳓镭垒类泪诔缧篱狸离鲤礼丽厉励砾历沥隶俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢俩联莲连镰怜涟帘敛脸链恋炼练蔹奁潋琏殓裢裣鲢粮凉两辆谅魉疗辽镣缭钌鹩猎临邻鳞凛赁蔺廪檩辚躏龄铃灵岭领绫棂蛏鲮馏刘浏骝绺镏鹨龙聋咙笼垄拢陇茏泷珑栊胧砻楼娄搂篓偻蒌喽嵝镂瘘耧蝼髅芦卢颅庐炉掳卤虏鲁赂禄录陆垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈峦挛孪滦乱脔娈栾鸾銮抡轮伦仑沦纶论囵萝罗逻锣箩骡骆络荦猡泺椤脶镙驴吕铝侣屡缕虑滤绿榈褛锊呒妈玛码蚂马骂吗唛嬷杩买麦卖迈脉劢瞒馒蛮满谩缦镘颡鳗猫锚铆贸麽没镁门闷们扪焖懑钔锰梦眯谜弥觅幂芈谧猕祢绵缅渑腼黾庙缈缪灭悯闽闵缗鸣铭谬谟蓦馍殁镆谋亩钼呐钠纳难挠脑恼闹铙讷馁内拟腻铌鲵撵辇鲶酿鸟茑袅聂啮镊镍陧蘖嗫颟蹑柠狞宁拧泞苎咛聍钮纽脓浓农侬哝驽钕诺傩疟欧鸥殴呕沤讴怄瓯盘蹒庞抛疱赔辔喷鹏纰罴铍骗谝骈飘缥频贫嫔苹凭评泼颇钋扑铺朴谱镤镨栖脐齐骑岂启气弃讫蕲骐绮桤碛颀颃鳍牵钎铅迁签谦钱钳潜浅谴堑佥荨悭骞缱椠钤枪呛墙蔷强抢嫱樯戗炝锖锵镪羟跄锹桥乔侨翘窍诮谯荞缲硗跷窃惬锲箧钦亲寝锓轻氢倾顷请庆揿鲭琼穷茕蛱巯赇虮鳅趋区躯驱龋诎岖阒觑鸲颧权劝诠绻辁铨却鹊确阕阙悫让饶扰绕荛娆桡热韧认纫饪轫荣绒嵘蝾缛铷颦软锐蚬闰润洒萨飒鳃赛伞毵糁丧骚扫缫涩啬铯穑杀刹纱铩鲨筛晒酾删闪陕赡缮讪姗骟钐鳝墒伤赏垧殇觞烧绍赊摄慑设厍滠畲绅审婶肾渗诜谂渖声绳胜师狮湿诗时蚀实识驶势适释饰视试谥埘莳弑轼贳铈鲥寿兽绶枢输书赎属术树竖数摅纾帅闩双谁税顺说硕烁铄丝饲厮驷缌锶鸶耸怂颂讼诵擞薮馊飕锼苏诉肃谡稣虽随绥岁谇孙损笋荪狲缩琐锁唢睃獭挞闼铊鳎台态钛鲐摊贪瘫滩坛谭谈叹昙钽锬顸汤烫傥饧铴镗涛绦讨韬铽腾誊锑题体屉缇鹈阗条粜龆鲦贴铁厅听烃铜统恸头钭秃图钍团抟颓蜕饨脱鸵驮驼椭箨鼍袜娲腽弯湾顽万纨绾网辋韦违围为潍维苇伟伪纬谓卫诿帏闱沩涠玮韪炜鲔温闻纹稳问阌瓮挝蜗涡窝卧莴龌呜钨乌诬无芜吴坞雾务误邬庑怃妩骛鹉鹜锡牺袭习铣戏细饩阋玺觋虾辖峡侠狭厦吓硖鲜纤贤衔闲显险现献县馅羡宪线苋莶藓岘猃娴鹇痫蚝籼跹厢镶乡详响项芗饷骧缃飨萧嚣销晓啸哓潇骁绡枭箫协挟携胁谐写泻谢亵撷绁缬锌衅兴陉荥凶汹锈绣馐鸺虚嘘须许叙绪续诩顼轩悬选癣绚谖铉镟学谑泶鳕勋询寻驯训讯逊埙浔鲟压鸦鸭哑亚讶垭娅桠氩阉烟盐严岩颜阎艳厌砚彦谚验厣赝俨兖谳恹闫酽魇餍鼹鸯杨扬疡阳痒养样炀瑶摇尧遥窑谣药轺鹞鳐爷页业叶靥谒邺晔烨医铱颐遗仪蚁艺亿忆义诣议谊译异绎诒呓峄饴怿驿缢轶贻钇镒镱瘗舣荫阴银饮隐铟瘾樱婴鹰应缨莹萤营荧蝇赢颖茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂哟拥佣痈踊咏镛优忧邮铀犹诱莸铕鱿舆鱼渔娱与屿语狱誉预驭伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉鸳渊辕园员圆缘远橼鸢鼋约跃钥粤悦阅钺郧匀陨运蕴酝晕韵郓芸恽愠纭韫殒氲杂灾载攒暂赞瓒趱錾赃脏驵凿枣责择则泽赜啧帻箦贼谮赠综缯轧铡闸栅诈斋债毡盏斩辗崭栈战绽谵张涨帐账胀赵诏钊蛰辙锗这谪辄鹧贞针侦诊镇阵浈缜桢轸赈祯鸩挣睁狰争帧症郑证诤峥钲铮筝织职执纸挚掷帜质滞骘栉栀轵轾贽鸷蛳絷踬踯觯钟终种肿众锺诌轴皱昼骤纣绉猪诸诛烛瞩嘱贮铸驻伫槠铢专砖转赚啭馔颞桩庄装妆壮状锥赘坠缀骓缒谆准着浊诼镯兹资渍谘缁辎赀眦锱龇鲻踪总纵偬邹诹驺鲰诅组镞钻缵躜鳟翱并卜沉丑淀斗范干皋硅柜后伙秸杰诀夸里凌么霉捻凄扦圣尸抬涂洼喂污锨咸蝎彝涌游吁御愿岳云灶扎札筑于志注凋讠谫郄猛凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟滥潴甯纟绔绱珉枧桊案槔橥轱轷赍肷胨飚煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄';
    }
    function traditionalized(cc){
        var str='';
        for(var i=0;i<cc.length;i++){
            if(charPYStr().indexOf(cc.charAt(i))!=-1){
                str+=ftPYStr().charAt(charPYStr().indexOf(cc.charAt(i)));
            }else{
                str+=cc.charAt(i);
            }
        }
        return str;
    }

    function simplized(cc){
        if(!cc){return ""};
        var str='';
        for(var i=0;i<cc.length;i++){
            if(ftPYStr().indexOf(cc.charAt(i))!=-1) str+=charPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)));
            else str+=cc.charAt(i);
        }
        return str;
    }
})();