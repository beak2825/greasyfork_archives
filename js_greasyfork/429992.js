// ==UserScript==
// @name         youdao-trans
// @namespace    http://www.iot2ai.top/
// @supportURL   http://www.iot2ai.top/operation/mail.html
// @version      0.24
// @description  简化有道翻译页面的工具
// @author       UFO
// @match        http://fanyi.youdao.com/*
// @match        https://fanyi.youdao.com/*
// @connect      iot2ai.top
// @connect      ngrok-free.app
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429992/youdao-trans.user.js
// @updateURL https://update.greasyfork.org/scripts/429992/youdao-trans.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 普通样式切换
    function toggleAll(selector, display) {
        var qa = document.querySelectorAll(selector);
        for (var i = 0; i < qa.length; i++) {
            qa[i].style.display = display;
        }
    }
    // 修复隐藏全屏广告无法滚动问题
    function fixPopup() {
        var ele = document.querySelector('.close');
        if (ele) {
            console.log('popup view closed!');
            ele.click();
        }
        if (document.body.style.position === 'fixed') {
            document.body.style.position = "static";
        }
    }
    // 调整输入区域大小
    function fixWidth() {
        var ele = document.querySelector('.translate-tab-container');
        if (ele) {
            ele.style.width = 'auto';
            ele.style.margin = '0 5px';
            ele.style.marginTop = '0';
            ele.style.paddingTop = '5px';
            // 解除宽度限制，实现铺满
            // web-frame-inner-content
            ele.parentElement.style.width = '100%';
            // 解除高度限制，实现滚动
            ele = document.querySelector('.web-frame-inner-container');
            if (ele) {
                ele.style.height = 'auto';
                // 去除宽度限制，导致有滚动时出现水平滚动
                // web-frame-content-container
                ele.parentElement.style.width = 'auto';
                // web-frame-container
                ele.parentElement.parentElement.style.height = 'auto';
                ele.parentElement.parentElement.style.width = 'auto';
            }
        }
        if (window.innerWidth < 980 && window.devicePixelRatio > 1) {
            ele = document.querySelector("meta[name=viewport]");
            if (ele) {
                ele.content = 'width=980';
                setTimeout(fixPopup, 1000);
            }
        }
        else if (window.devicePixelRatio > 1) {
            // 开始宽度可能很大，但是适配后会缩小
            setTimeout(function() {
                if (window.innerWidth < 980) {
                    ele = document.querySelector("meta[name=viewport]");
                    if (ele) {
                        ele.content = 'width=980';
                        setTimeout(fixPopup, 1000);
                    }
                }
            }, 1000);
        }
    }
    function fixButton(name, callback) {
        var ele = document.querySelector('.tab-header .tab-left .tab-item');
        var newEle = document.createElement('div');
        for (var i = 0; i < ele.attributes.length; i++) {
            newEle.setAttribute(ele.attributes[i].name, ele.attributes[i].value);
        }
        newEle.classList.remove('active');
        newEle.onclick = callback;
        if (ele.children.length > 0) {
            newEle.innerHTML = ele.innerHTML;
            newEle.children[0].innerText = name;
        }
        else {
            newEle.innerText = name;
        }
        ele.parentElement.appendChild(newEle);
    }
    // 兼容输入框事件属性
    function getVei(ele) {
        var vei = ele._vei;
        if (!vei) {
            var sa = Object.getOwnPropertySymbols(ele);
            for (var i = 0; i < sa.length; i++) {
                if (sa[i].toString().indexOf('_vei')) {
                    vei = ele[sa[i]];
                    break;
                }
            }
        }
        return vei;
    }
    // 调整输入区域大小
    function fixInput() {
        var input = document.querySelector('#inputOriginal');
        if (!input) {
            setTimeout(fixInput, 1000);
            return;
        }
        fixPopup();
        fixWidth();
        fixEvent();
        // 立即翻译按钮
        fixButton('立即翻译', function() {
            var ele = document.querySelector('#js_fanyi_input');
            getVei(ele).onInput.call(ele, {target: ele});
        });
        // 显示导航栏按钮
        fixButton('显示导航', function() {
            var ele = document.querySelector('.header-outer-container');
            if (ele.style.display === 'none') {
                ele.style.display = '';
                toggleAll('.sidebar-container','');
                this.innerText = '隐藏导航';
            }
            else {
                ele.style.display = 'none';
                toggleAll('.sidebar-container','none');
                this.innerText = '显示导航';
            }
        });
        var parentEle = input.parentElement;
        // 手动操作区
        var operations = document.querySelector('.tab-header');
        toggleAll('.header-outer-container,.sidebar-container,.tab-header,.text-translate-top,.text-translate-top-right', 'none');
        // 增加文章加载功能
        var nvOut = document.createElement('div');
        nvOut.style.marginTop = '5px';
        nvOut.style.marginBottom = '5px';
        var nvArr = [];
        nvArr.push('<input style="line-height:24px;border-radius:5px;width:calc(', window.innerWidth < 1000 ? '45%' : '50%', ' - 10px);box-sizing:border-box;" type="text" placeholder="请输入文章ID，例如：n4483dj/1/">');
        nvArr.push('<button style="line-height:20px;margin-left:20px;" type="button">加载</button>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">上页</button>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">下页</button>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">分页大小</button>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">显示选项</button>');
        nvArr.push('<b style="margin-left:10px;">|</b>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">前へ</button>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">次へ</button>');
        nvArr.push('<button style="line-height:20px;margin-left:10px;" type="button">目次</button>');
        nvOut.innerHTML = nvArr.join('');
        // 内容临时处理区域。后面是否换成iframe比较好？
        var dataEle = document.createElement('div');
        dataEle.style.display = 'none';
        // 事件处理
        nvOut.onclick = function(e) {
            if (e.target.tagName !== 'BUTTON') {
                return;
            }
            var op = e.target.innerText;
            if (op === '显示选项' || op === '隐藏选项') {
                if (operations.style.display === 'none') {
                    operations.style.display = '';
                    toggleAll('.text-translate-top,.text-translate-top-right','');
                    e.target.innerText = '隐藏选项';
                }
                else {
                    operations.style.display = 'none';
                    toggleAll('.text-translate-top,.text-translate-top-right','none');
                    e.target.innerText = '显示选项';
                }
            }
            else if (op === '加载') {
                if (e.altKey) {
                    // 读取文件
                    readNovel(nvOut, dataEle, !e.ctrlKey);
                }
                else {
                    // 在线加载
                    loadNovel(nvOut, dataEle, !e.ctrlKey);
                }
            }
            else if (op === '上页') {
                prevBlock(!e.ctrlKey);
            }
            else if (op === '下页') {
                nextBlock(!e.ctrlKey);
            }
            else if (op === '分页大小') {
                var p = prompt('请输入分页大小（1~5000）或跳转索引（@索引）', blockSize.toString());
                if (p) {
                    if (p.search(/^\d{1,4}$/) !== -1) {
                        blockSize = parseInt(p);
                        if (blockSize > 5000 || blockSize === 0) {
                            blockSize = 5000;
                        }
                        GM_setValue('block_size', blockSize);
                    }
                    else if (p.search(/^@\d+$/) !== -1) {
                        rawOffset = parseInt(p.substring(1));
                        nextBlock(!e.ctrlKey);
                    }
                }
            }
            else if (op === '前へ') {
                prevNovel(nvOut, dataEle, !e.ctrlKey);
            }
            else if (op === '次へ') {
                nextNovel(nvOut, dataEle, !e.ctrlKey);
            }
            else if (op === '目次') {
                listNovel(nvOut, dataEle, !e.ctrlKey);
            }
        };
        parentEle.insertBefore(nvOut, input);
        parentEle.appendChild(dataEle);
        // 返回顶部按钮
        showTop();
        // 最后输入的记录
        nvOut.querySelector('input').value = GM_getValue('input_url', '');
    }
    // 显示顶部按钮
    function showTop() {
        var topEle = document.querySelector('#_yt_top');
        if (!topEle) {
            topEle = document.createElement('a');
            topEle.id = '_yt_top';
            topEle.style.marginLeft = '12px';
            // 由于页面对滚动事件的处理，使用滚动属性回到顶部存在变动问题。这个暂时无法处理！
            // 同时，手机经常缩放页面，滚动属性无法适配缩放的比例，即滚动的顶部并不代表缩放的顶部
            // 所以手机需要使用锚点跳转。手机首次跳转缩放比例会回到0，之后就能始终保持跳转到顶部
            if (unsafeWindow.AiView) {
                topEle.href = 'javascript:AiView.setScrollY(0,false,null);';
            }
            else if (navigator.appVersion.match(/Mobile|YaBrowser/)) {
                topEle.href = '#';
            }
            else {
                topEle.href = 'javascript:document.body.scrollTop=document.documentElement.scrollTop=0;';
            }
            document.querySelector('.targetAction .opt-left').appendChild(topEle);
        }
        if (rawText) {
            topEle.innerText = '顶部(' + rawOffset + '/' + rawText.length + ')';
        }
        else {
            topEle.innerText = '顶部';
        }
    }
    // 加载内容
    var baseUrl = 'http://www.iot2ai.top/cgi-bin/intel/syosetu.html?nv=';
    function fillUrl(nvOut) {
        var urlEle = nvOut.querySelector('input');
        var url = urlEle.value.trim();
        if (!url) return null;
        if (url.indexOf('://') === -1) {
            url = url.replace(/\S*nv=/, '');
            url = baseUrl + url;
        }
        return url;
    }
    function setUrl(nvOut, dataEle, url, load) {
        var urlEle = nvOut.querySelector('input');
        urlEle.value = url.indexOf(baseUrl) !== -1 ? url.replace(/\S+\/intel\/syosetu.html\?nv=([^&]+)$/, '$1') : url;
        GM_setValue('input_url', urlEle.value);
        loadNovel(nvOut, dataEle, load);
    }
    function getNovel(url) {
        return url.match(/(\S+)(\?nv=)([^&]+)$/);
    }
    function trimNovel(str, isHtml, dataEle, load, offset) {
        if (isHtml) {
            var mat = str.match(/<body>([\s\S]+)<\/body>/);
            if (mat) {
                // 需要的话，建议移除脚本。不过我的页面不可能存在脚本，所以先不处理
                // 若自己添加了其它白名单，建议优化一下。当然，跨域也会保证页面安全，问题也不是很大
                dataEle.innerHTML = mat[1];
            }
            else {
                dataEle.innerHTML = '<p>内容が見つからない</p>';
            }
        }
        else {
            // 为了进行片假名替换，同时过滤一些标签，处理实体符号，建议使用段落包裹
            dataEle.innerHTML = '<p>' + str + '</p>';
        }
        if (isReplaceKatakana) {
            runKanaToRomaji(dataEle);
        }
        str = dataEle.innerText.trim();
        dataEle.innerHTML = '';
        // 去除多余的空行
        str = str.replace(/(\n)\s+(\n)/g, '$1$2');
        // 跳转索引（@索引）
        // 这个索引是相对格式化的文本偏移，不是源文本！
        // 可以在顶部信息获得这个偏移
        if (offset) {
            offset = parseInt(offset[1]);
            if (str.length > offset) {
                str = str.substring(offset);
            }
            else {
                str = '';
            }
        }
        setRawText(str);
        nextBlock(load);
    }
    function loadNovel(nvOut, dataEle, load) {
        var url = fillUrl(nvOut);
        if (!url) return;
        if (url.search(/^file:/) === 0) {
            readNovel(nvOut, dataEle, load, url.match(/@(\d+)$/));
            return;
        }
        if (url.search(/^content:/) === 0) {
            readContent(nvOut, dataEle, load, url);
            return;
        }
        GM_xmlhttpRequest({
            url: url,
            onload: function(xhr) {
                trimNovel(xhr.response, true, dataEle, load);
            },
            onerror: function(e) {
                alert(e.error || '无法加载');
            }
        });
    }
    function readNovel(nvOut, dataEle, load, offset) {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = function() {
            var f = this;
            if (!f.files.length || (f.files[0].type !== 'text/html' && f.files[0].type !== 'text/plain')) {
                return;
            }
            var isHtml = f.files[0].type === 'text/html';
            var r = new FileReader();
            r.readAsText(f.files[0], 'utf-8');
            r.onload = function() {
                trimNovel(this.result, isHtml, dataEle, load, offset);
            };
        };
        input.click();
    }
    function readContent(nvOut, dataEle, load, url) {
        // 扩展协议。使用这个接口为插件上扩展个性化功能，例如自动下载和推送
        var c = unsafeWindow.nvContent;
        if (!c || !(c.text || typeof(c) === 'function')) return;
        if (!c.text) {
            c = c.call(window, url);
            if (!c || !c.text) return;
        }
        trimNovel(c.text, c.isHtml, dataEle, c.load === false ? false : load, c.offset);
    }
    function prevNovel(nvOut, dataEle, load) {
        var url = fillUrl(nvOut);
        if (!url) return;
        var mat = getNovel(url);
        if (!mat) return;
        var nv = mat[3];
        if (nv.charAt(nv.length - 1) !== '/') {
            return;
        }
        var na = nv.substring(0, nv.length - 1).split('/');
        if (na.length === 1) {
            url = mat[1] + mat[2] + na.join('/') + '/1/';
            setUrl(nvOut, dataEle, url, load);
        }
        else if (na.length === 2 && na[1].search(/^\d+$/) !== -1) {
            na[1] = parseInt(na[1]) - 1;
            if (na[1] <= 0) {
                alert('前面没有文章了');
                return;
            }
            url = mat[1] + mat[2] + na.join('/') + '/';
            setUrl(nvOut, dataEle, url, load);
        }
    }
    function nextNovel(nvOut, dataEle, load) {
        var url = fillUrl(nvOut);
        if (!url) return;
        var mat = getNovel(url);
        if (!mat) return;
        var nv = mat[3];
        if (nv.charAt(nv.length - 1) !== '/') {
            return;
        }
        var na = nv.substring(0, nv.length - 1).split('/');
        if (na.length === 1) {
            url = mat[1] + mat[2] + na.join('/') + '/1/';
            setUrl(nvOut, dataEle, url, load);
        }
        else if (na.length === 2 && na[1].search(/^\d+$/) !== -1) {
            na[1] = parseInt(na[1]) + 1;
            url = mat[1] + mat[2] + na.join('/') + '/';
            setUrl(nvOut, dataEle, url, load);
        }
    }
    function listNovel(nvOut, dataEle, load) {
        var url = fillUrl(nvOut);
        if (!url) return;
        var mat = getNovel(url);
        if (!mat) return;
        var nv = mat[3];
        if (nv.charAt(nv.length - 1) !== '/') {
            return;
        }
        var na = nv.substring(0, nv.length - 1).split('/');
        if (na.length === 2 && na[1].search(/^\d+$/) !== -1) {
            url = mat[1] + mat[2] + na[0] + '/';
            setUrl(nvOut, dataEle, url, load);
        }
    }
    // 翻译内容
    var isAutoTrans = GM_getValue('auto_trans', true);
    function translate(str, load, key) {
        var ele = document.querySelector('#js_fanyi_input');
        ele.innerText = str;
        if (isAutoTrans && load) {
            getVei(ele).onInput.call(ele, {target: ele});
        }
    }
    // 分页机制
    var rawText;
    var rawOffset, rawPaging;
    var blockSize = GM_getValue('block_size', 5000);
    function setRawText(str) {
        rawText = str;
        rawOffset = 0;
        rawPaging = [];
    }
    function prevBlock(load) {
        if (!rawText || rawPaging.length < 2) {
            alert('前面没有更多内容了');
            return;
        }
        // 当前的位置
        rawPaging.pop();
        // 上一个位置
        rawOffset = rawPaging.pop();
        nextBlock(load);
    }
    function nextBlock(load) {
        if (!rawText || rawOffset >= rawText.length) {
            alert('后面没有更多内容了');
            return;
        }
        var remain = rawText.length - rawOffset;
        if (remain <= blockSize) {
            translate(rawOffset > 0 ? rawText.substring(rawOffset) : rawText, load, '_' + rawOffset + '_' + rawText.length);
            rawPaging.push(rawOffset);
            rawOffset = rawText.length;
        }
        else {
            var end = rawOffset + blockSize - 1;
            while(end > rawOffset && rawText.charAt(end) !== '\n') {
                end--;
            }
            if (end === rawOffset) {
                end = rawOffset + blockSize - 1;
            }
            end++;
            var str = rawText.substring(rawOffset, end);
            translate(str.trim(), load, '_' + rawOffset + '_' + end);
            rawPaging.push(rawOffset);
            rawOffset = end;
        }
        // 显示当前已读位置和总数
        showTop();
    }
    // 优化输入翻译
    var isInputTrans = GM_getValue('input_trans', false);
    function fixEvent() {
        if (!isInputTrans) {
            var ele = document.querySelector('#js_fanyi_input');
            ele.removeEventListener('input', getVei(ele).onInput);
            console.log('input event removed!');
        }
    }
    // 元素会重置的，只能使用样式隐藏
    GM_addStyle('.sticky-sidebar,.footer,.fixedBottomActionBar-border-box,.translate-domain-text,.banner,.pop-up-comp,.download_ch,.dict-website-footer,.document-upload-entrance-container,.top-banner-outer-container{display:none !important}.clearBtn{top: 0 !important; right: 0 !important; z-index: 1}');
    fixInput();
    // 移除日志事件
    unsafeWindow._rlog.push = console.log;
    // 调整一下标题，方便识别
    document.title = document.title.replace(/有道/g, 'syosetu');
    // load前的一次请求没法拦截，因为这里慢于那部分代码
    console.log('youdao is clear!');
    // 片假名特殊优化，更多细节参考kana-to-romaji
    // 是否替换片假名。若不要替换，改为false
    var isReplaceKatakana = GM_getValue('katakana_flag', true);
    // 片假名
    // ア -> ン行是清音（Seion），ガ ->バ行是浊音（Dakuon），パ行是半浊音（Half-Dakuon）
    // 拗音（Youon）组合的音节ャ、ュ、ョ是半角，但按全角替换，即キャ替换成kiya，而不是kya
    // 特殊音用到的ァ行是半角，也按全角替换，即ファ替换成fua，而不是fa
    // 移除长音符号ー
    // 移除促音符号ッ半角（为了统一，现在按全角替换）
    var katakana = ['ア', 'イ', 'ウ', 'エ', 'オ', 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ',
        'カ', 'キ', 'ク', 'ケ', 'コ', 'ヵ', 'ヶ',
        'サ', 'シ', 'ス', 'セ', 'ソ',
        'タ', 'チ', 'ツ', 'テ', 'ト', 'ッ',
        'ハ', 'ヒ', 'フ', 'ヘ', 'ホ',
        'ナ', 'ニ', 'ヌ', 'ネ', 'ノ',
        'マ', 'ミ', 'ム', 'メ', 'モ',
        'ラ', 'リ', 'ル', 'レ', 'ロ',
        'ヤ', 'ユ', 'ヨ', 'ャ', 'ュ', 'ョ',
        'ワ', 'ヲ', 'ヴ', 'ヮ', 'ヰ', 'ヱ',
        'ン', 'ヷ', 'ヺ', 'ヸ', 'ヹ', 'ー',
        'ガ', 'ギ', 'グ', 'ゲ', 'ゴ',
        'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ',
        'ダ', 'ヂ', 'ヅ', 'デ', 'ド',
        'バ', 'ビ', 'ブ', 'ベ', 'ボ',
        'パ', 'ピ', 'プ', 'ペ', 'ポ'];
    // 罗马音
    var romaji = ['a', 'i', 'u', 'e', 'o','a', 'i', 'u', 'e', 'o',
        'ka', 'ki', 'ku', 'ke', 'ko', 'ka', 'ke',
        'sa', 'shi', 'su', 'se', 'so',
        'ta', 'chi', 'tsu', 'te', 'to', 'tsu',
        'ha', 'hi', 'fu', 'he', 'ho',
        'na', 'ni', 'nu', 'ne', 'no',
        'ma', 'mi', 'mu', 'me', 'mo',
        'ra', 'ri', 'ru', 're', 'ro',
        'ya', 'yu', 'yo','ya', 'yu', 'yo',
        'wa', 'wo', 'vu', 'wa', 'wi', 'we',
        'n', 'ba', 'bo', 'bi', 'be', '',
        'ga', 'gi', 'gu', 'ge', 'go',
        'za', 'ji', 'zu', 'ze', 'zo',
        'da', 'di', 'du', 'de', 'do',
        'ba', 'bi', 'bu', 'be', 'bo',
        'pa', 'pi', 'pu', 'pe', 'po'];
    // 假名跟罗马音映射表
    var katakanaMap = {};
    for (var i in romaji) {
        katakanaMap[katakana[i]] = romaji[i];
    }
    // 假名正则表达式
    var katakanaReg = new RegExp('(' + katakana.join('|') + ')+', 'g');
    // 片假名转罗马音
    function katakanaToRomajiHTML(m) {
        var sa = [];
        // 原文上一行显示罗马音
        sa.push('<ruby class="__ka__"><rb><b>', m, '</b></rb><rp>（</rp><rt>');
        for (var i = 0; i < m.length; i++) {
            sa.push(katakanaMap[m.charAt(i)]);
        }
        sa.push('</rt><rp>）</rp></ruby>');
        return sa.join('');
    }
    function katakanaToRomajiText(m) {
        var sa = [];
        for (var i = 0; i < m.length; i++) {
            sa.push(katakanaMap[m.charAt(i)]);
        }
        return sa.join('');
    }
    // 全局替换元素内容。若使用文本模式，则只替换纯文本内容，不会清除内嵌元素的事件。但是纯文本模式没有注音或者悬浮查看原文效果
    function replaceNodeValue(pa, reg, fn) {
        // 替换节点的内容，例如属性列表
        for (var i = 0; i < pa.length; i++) {
            var str = pa[i].nodeValue;
            if (str.search(reg) !== -1) {
                pa[i].nodeValue = str.replace(reg, fn);
            }
        }
    }
    function replaceAttr(pa, reg, fn) {
        // 替换元素的属性列表（包括其子节点的）
        for (var i = 0; i < pa.length; i++) {
            if (pa[i].childNodes.length > 0) {
                replaceAttr(pa[i].childNodes, reg, fn);
                replaceNodeValue(pa[i].attributes, reg, fn);
            }
            else {
                if (pa[i].nodeName !== '#text') {
                    replaceNodeValue(pa[i].attributes, reg, fn);
                }
            }
        }
    }
    function replaceHTML(pa, reg, fn, notMixed) {
        // 富文本替换，可以增加特殊表现，但会清除子元素事件
        // 替换前，建议先替换属性，否则可能破坏标签结构
        for (var i = 0; i < pa.length; i++) {
            var str = pa[i].innerHTML;
            if (str.search(reg) !== -1) {
                // 多次替换可能重复操作同一个元素，这时需要排除这部分元素
                if (notMixed) {
                    if (str.indexOf('__ka__') !== -1) {
                        continue;
                    }
                }
                pa[i].innerHTML = str.replace(reg, fn);
            }
        }
    }
    function replaceText(pa, reg, fn) {
        // 纯文本替换，只替换文本节点的内容，不会影响元素事件
        for (var i = 0; i < pa.length; i++) {
            if (pa[i].childNodes.length > 0) {
                replaceText(pa[i].childNodes, reg, fn);
            }
            else {
                if (pa[i].nodeName === '#text') {
                    var str = pa[i].nodeValue;
                    if (str.search(reg) !== -1) {
                        pa[i].nodeValue = str.replace(reg, fn);
                    }
                }
            }
        }
    }
    // 将指定元素的假名转罗马音
    // useText：false表示富文本模式，true表示纯文本模式；
    // notMixed：false表示不做混合检测，true表示做混合检测。内嵌标签很可能被前面操作替换，这时就不应该再替换
    function kanaToRomaji(element, selector, useText, notMixed) {
        var qa = element.querySelectorAll(selector);
        if (qa.length === 0) return;
        replaceAttr(qa, katakanaReg, katakanaToRomajiText);
        if (useText) {
            replaceText(qa, katakanaReg, katakanaToRomajiText);
        }
        else {
            replaceHTML(qa, katakanaReg, katakanaToRomajiHTML, notMixed ? '__ka__' : null);
        }
    }
    function runKanaToRomaji(ele) {
        console.log('kana to romaji is starting!');
        // 替换段落内容
        kanaToRomaji(ele, 'p', false, false);
        // 替换链接内容
        kanaToRomaji(ele, 'a', false, true);
        // 其它标签内容
        kanaToRomaji(ele, '.chapter_title', false, true);
        kanaToRomaji(ele, '#novel_ex', false, true);
        kanaToRomaji(ele, '.ex', false, true);
    }
    // 是否替换假名的菜单按钮，点击可以切换
    var katakanaMenuId;
    function addReplaceKatakanaMenu() {
        katakanaMenuId = GM_registerMenuCommand('片假名(' + (isReplaceKatakana ? '替换' : '不变') + ')', onReplaceKatakanaMenu);
    }
    function onReplaceKatakanaMenu() {
        isReplaceKatakana = !isReplaceKatakana;
        GM_setValue('katakana_flag', isReplaceKatakana);
        GM_unregisterMenuCommand(katakanaMenuId);
        addReplaceKatakanaMenu();
    }
    addReplaceKatakanaMenu();
    // 是否输入自动翻译的菜单按钮，点击可以切换
    var inputTransMenuId;
    function addInputTransMenu() {
        inputTransMenuId = GM_registerMenuCommand('输入翻译(' + (isInputTrans ? '是' : '否') + ')', onInputTransMenu);
    }
    function onInputTransMenu() {
        isInputTrans = !isInputTrans;
        GM_setValue('input_trans', isInputTrans);
        GM_unregisterMenuCommand(inputTransMenuId);
        addInputTransMenu();
        var ele = document.querySelector('#js_fanyi_input');
        if (isInputTrans) {
            ele.addEventListener('input', getVei(ele).onInput);
        }
        else {
            ele.removeEventListener('input', getVei(ele).onInput);
        }
    }
    addInputTransMenu();
    // 是否加载后自动翻译的菜单按钮，点击可以切换
    var autoTransMenuId;
    function addAutoTransMenu() {
        autoTransMenuId = GM_registerMenuCommand('自动翻译(' + (isAutoTrans ? '是' : '否') + ')', onAutoTransMenu);
    }
    function onAutoTransMenu() {
        isAutoTrans = !isAutoTrans;
        GM_setValue('auto_trans', isAutoTrans);
        GM_unregisterMenuCommand(autoTransMenuId);
        addAutoTransMenu();
    }
    addAutoTransMenu();

})();