// ==UserScript==
// @name       Manga Loader EH
// @version    1.0.0
// @noframes
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// -- NSFW START
// @match *://e-hentai.org/s/*/*
// @match *://exhentai.org/s/*/*
// @match file:*COMIC*
// @description a viewer for e-hentai gallery
// -- NSFW END
// @namespace https://greasyfork.org/users/433618
// @downloadURL https://update.greasyfork.org/scripts/394951/Manga%20Loader%20EH.user.js
// @updateURL https://update.greasyfork.org/scripts/394951/Manga%20Loader%20EH.meta.js
// ==/UserScript==

var bookIndex, BookMarks;
//纯净模式
if (localStorage.barePage) {
    localStorage.removeItem('barePage');
    return;
}

//https://exhentai.org/s/41e176b4b9/1074282-82
var refresh_large='data:image/svg+xml;charset=utf-8,<svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1639 1056q0 5-1 7-64 268-268 434.5t-478 166.5q-146 0-282.5-55t-243.5-157l-129 129q-19 19-45 19t-45-19-19-45v-448q0-26 19-45t45-19h448q26 0 45 19t19 45-19 45l-137 137q71 66 161 102t187 36q134 0 250-65t186-179q11-17 53-117 8-23 30-23h192q13 0 22.5 9.5t9.5 22.5zm25-800v448q0 26-19 45t-45 19h-448q-26 0-45-19t-19-45 19-45l138-138q-148-137-349-137-134 0-250 65t-186 179q-11 17-53 117-8 23-30 23h-199q-13 0-22.5-9.5t-9.5-22.5v-7q65-268 270-434.5t480-166.5q146 0 284 55.5t245 156.5l130-129q19-19 45-19t45 19 19 45z" fill="#fff"/></svg>';

var nsfwimp = [{ //网站参数
    name: 'geh-and-exh',
    match: "^https?://(e-hentai|exhentai).org/s/.*/.*",
    img: '#img',
    // img: '.sni > a > img, #img',
    next: '#i3 a',
    // next: '.sni > a, #i3 a',
    numpages: 'div.sn > div > span:nth-child(2)',
    curpage: 'div.sn > div > span:nth-child(1)'
}];

var getEl = function(q, c) {//获取句柄
    return (c || document).querySelector(q);
    //document.querySelector(q)
};

var getEls = function(q, c) { 
    return [].slice.call((c || document).querySelectorAll(q));
    //[].slice.call(document.querySelectorAll('tbody>tr>td>a'))
};

var updateObj = function(orig, ext) { //更新两边的参数
    var key;
    for (key in ext) {
        if (orig.hasOwnProperty(key) && ext.hasOwnProperty(key)) {
            orig[key] = ext[key];
        }
    }
    return orig;
};

var extractInfo = function(selector, mod, context) { //提取数据
    // console.log(mod);
    selector = this[selector] || selector;
    //console.log(selector);
    if (typeof selector === 'function') {
        return selector.call(this, context);
    }
    var elem = getEl(selector, context),
    option;
    //console.log(elem);
    mod = mod || {};
    if (elem) {
        switch (elem.nodeName.toLowerCase()) {
        case 'img':
            var srcc = (mod.altProp && elem.getAttribute(mod.altProp)) || elem.src || elem.getAttribute('src');
            console.log('src=' + srcc);
            return srcc;
        case 'a':
            if (mod.type === 'index') return parseInt(elem.textContent);
            return elem.href || elem.getAttribute('href');
        case 'ul':
            return elem.children.length;
        case 'select':
            switch (mod.type) {
            case 'index':
                var idx = elem.options.selectedIndex + 1 + (mod.val || 0);
                if (mod.invIdx) idx = elem.options.length - idx + 1;
                return idx;
            case 'value':
            case 'text':
                option = elem.options[elem.options.selectedIndex + (mod.val || 0)] || {};
                return mod.type === 'value' ? option.value: option.textContent;
            default:
                return elem.options.length;
            }
            break;
        default:
            switch (mod.type) {
            case 'index':
                return parseInt(elem.textContent);
            default:
                return elem.textContent;
            }
        }
    }
    return null;
};

var addStyle = function(id, replace) { //添加class
    if (!this.MLStyles) this.MLStyles = {};
    if (!this.MLStyles[id]) {
        this.MLStyles[id] = document.createElement('style');
        this.MLStyles[id].dataset.name = 'ml-style-' + id;
        document.head.appendChild(this.MLStyles[id]);
    }
    var style = this.MLStyles[id];
    var css = [].slice.call(arguments, 2).join('\n');
    if (replace) {
        style.textContent = css;
    } else {
        style.textContent += css;
    }
};

var toStyleStr = function(obj, selector) { //class转字符串
    var stack = [],
    key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            stack.push(key + ':' + obj[key]);
        }
    }
    if (selector) {
        return selector + '{' + stack.join(';') + '}';
    } else {
        return stack.join(';');
    }
};

var getViewer = function(prevChapter, nextChapter) {
    var viewerCss = toStyleStr({
        'background-color': 'black !important',
        'font': '0.813em monospace !important',
        'text-align': 'center',
    },
    'body'),
    imagesCss = toStyleStr({
        'margin-top': '10px',
        'margin-bottom': '10px',
        'transform-origin': 'top center'
    },
    '.ml-images'),
    imageCss = toStyleStr({
        'max-width': '100%',
        'display': 'block',
        'margin': '3px auto'
    },
    '.ml-images img'),
    counterCss = toStyleStr({
        'background-color': '#222',
        'color': 'white',
        'border-radius': '10px',
        'width': '40px',
        'margin-left': 'auto',
        'margin-right': 'auto',
        'margin-top': '-6px',
        'margin-bottom': '14px',
        'padding-left': '5px',
        'padding-right': '5px',
        'border': '1px solid white',
        'z-index': '100',
        'font-size': '150%',
        'position': 'relative'
    },
    '.ml-counter'),
    navCss = toStyleStr({
        'text-decoration': 'none',
        'color': 'white',
        'background-color': '#444',
        'padding': '6px 10px',
        'font-size': '150%',
        'border-radius': '5px',
        'transition': '250ms'
    },
    '.ml-chap-nav a'),
    boxCss = toStyleStr({
        'position': 'fixed',
        'background-color': '#222',
        'color': 'white',
        'padding': '7px',
        'border-top-left-radius': '5px',
        'cursor': 'default'
    },
    '.ml-box'),
    statsCss = toStyleStr({
        'bottom': '0',
        'right': '0',
        'opacity': '0.4',
        'transition': '250ms'
    },
    '.ml-stats');

    // clear all styles and scripts
    document.head.innerHTML = '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">';
    document.body.className = '';
    document.body.style = '';

//////////////////////////////////////////////// 参数部分
    // navigation
    var nav = '<div class="ml-chap-nav">' + '<a type="button" onclick="bLastPage()" href="javascript:void(0)">-- Last Page --</a> '  + '<a href="javascript:window.opener=null;window.close();">Exit</a> ' + '<a type="button" onclick="bNextPage()" href="javascript:void(0)">Next</a>' + '</div>';
    var bookMark = '<div class="ml-chap-nav" style="margin-top:20px;">' + '<a type="button" id="deleteMark" href="javascript:void(0)">delete BookMark</a> ' + '<a type="button" id="addMark" href="javascript:void(0)">Add BookMark</a> ' + '<a id="MarkPage">0</a> ' + '</div>';
	var autoRoll = '<div class="ml-chap-nav" style="margin-top:20px;">' + '<a type="button" onclick="startRoll()" href="javascript:void(0)">start roll</a> ' + '<a type="button" onclick="endRoll()" href="javascript:void(0)">end roll</a> ' + '<a id="TimerCounter">Stop</a> ' + '</div>'+'<div class="ml-chap-nav" style="margin-top:20px;">' + '<input type="range" id="slider" min="1" max="10" step="1" value="3" onchange="changeTimer()" /> <a id="TimerValue">0</a> ' + '</div>';
    // stats
    var stats = '<div class="ml-box ml-stats"><span class="ml-stats-pages"></span></div>';
    // combine ui elements <i> 斜体标签
    document.body.innerHTML = '<div class="ml-images"></div><div style="height:200px"> </div> <div style="position: fixed;bottom: 0px;left:0;right:0;"> <div id="image_counter" href="javascript:void(0)" class="ml-counter">0</div>' + nav + bookMark + autoRoll + stats+'</div>';
    // add main styles
    addStyle('main', true, viewerCss, imagesCss, imageCss, counterCss, navCss, statsCss, boxCss);

    // set up return UI object
    var UI = {
        images: getEl('.ml-images'),
        statsPages: getEl('.ml-stats-pages')
    };
    return UI;
};
var timerID = -1,timer=0;
var setting;
var timeFunc = function(){
	timer-=1;
	if(timer==0){
		timer=setting.timerCount;
		bNextPage();
	}
    getEl('#TimerCounter').innerHTML = timer;
	timerID=window.setTimeout(timeFunc, 1000);
};
changeTimer = function(){
	setting.timerCount=getEl('#slider').value;
    getEl('#TimerValue').innerHTML = setting.timerCount;
	localStorage.Lsetting = JSON.stringify(setting);
};
startRoll = function(){
	if(timerID==-1){
		timer=setting.timerCount;
        getEl('#TimerCounter').innerHTML = timer;
		timerID=window.setTimeout(timeFunc, 1000);
	}
};
endRoll = function(){
	if(timerID!=-1){
        getEl('#TimerCounter').innerHTML = 'Stop';
		window.clearTimeout(timerID);timerID=-1;
	}
};
var addImage = function(srcc, loc, imgNum, callback, pageUrl) { //插入图片
    var image = new Image();
    image.onerror = function() {

        image.onload = null;
        image.style.backgroundColor = 'white';
        image.style.cursor = 'pointer';
        image.title = 'Reload "' + srcc + '"?';
        image.src = refresh_large;
        image.height='720px';
        image.onclick = function() {
            image.onload = callback;
            image.title = '';
            image.style.cursor = '';
            image.src = srcc;
        };
    };
    image.id = 'image_' + imgNum;
    image.onload = callback;
    image.style.display = 'none';
    image.title = pageUrl || '';
    image.src = srcc;
    image.addEventListener('click', bNextPage);
    loc.appendChild(image);
};
var currentPage, resumeUrl;
var loadManga = function(imp) {
    var extractInf = extractInfo.bind(imp),
    imgUrl = extractInf('img', imp.imgmod),
    nextUrl = extractInf('next'),
    numPages = extractInf('numpages'),
    curPage = extractInf('curpage', {type: 'index'}) || 1,
    nextChapter = extractInf('nextchap', {
        type: 'value',
        val: (imp.invchap && -1) || 1}),
    prevChapter = extractInf('prevchap', {
        type: 'value',
        val: (imp.invchap && 1) || -1}),
    xhr = new XMLHttpRequest(),
    doc_temp = document.implementation.createHTMLDocument(),
    OpenPage = function() { //自定义 打开页面
        localStorage.barePage = 'bare';
        var currentEL = getEl('#image_' + currentPage);
        window.open(currentEL.title, '_blank');
    },
    NextPage = function() { //自定义 下一页
        var nextEL = getEl('#image_' + (currentPage + 1).toLocaleString());
        if (nextEL) {
            var currentEL = getEl('#image_' + currentPage);

            currentEL.style.display = 'none';
            //currentEL.removeEventListener('click', NextPage);

            nextEL.style.display = 'block';
            //nextEL.addEventListener('click', NextPage);
            currentPage++;
            getEl('#image_counter').innerHTML = currentPage;
            window.scrollTo(0, 0);
            if (curPage < currentPage + mLoadNum && resumeUrl) {
                loadNextPage(resumeUrl);
            }
        }
    },
    LastPage = function() { //自定义 上一页
        var nextEL = getEl('#image_' + (currentPage - 1).toLocaleString());
        if (nextEL) {
            var currentEL = getEl('#image_' + currentPage);

            currentEL.style.display = 'none';
            currentEL.removeEventListener('click', NextPage);

            nextEL.style.display = 'block';
            nextEL.addEventListener('click', NextPage);
            currentPage--;
            getEl('#image_counter').innerHTML = currentPage;
            window.scrollTo(0, 0);
        }
    },
    addMark = function() { //自定义 添加书签
        var currentEL = getEl('#image_' + currentPage);
        if (!BookMarks[bookIndex]) BookMarks[bookIndex] = {
            'page': 4,
            'url': 'null_url'
        };
        BookMarks[bookIndex].page = currentPage;
        BookMarks[bookIndex].url = currentEL.title;
        localStorage.BookMarks = JSON.stringify(BookMarks);
        getEl('#MarkPage').innerHTML = currentPage;
    },
    deleteMark = function() { //自定义 删除书签
        if (BookMarks[bookIndex]) delete BookMarks[bookIndex];
        localStorage.BookMarks = JSON.stringify(BookMarks);
        getEl('#MarkPage').innerHTML = 0;
    },
    updateStats = function() { //更新右下角页面状态
        updateObj(pageStats, {
            numLoaded: pagesLoaded,
            loadLimit: curPage,
            numPages: numPages});
        UI.statsPages.textContent = ' ' + pagesLoaded + (numPages ? '/' + numPages: '') + ' loaded';
    },
    addAndLoad = function(img, next) { //添加图片，加载新页 1>2
        if (!img) throw new Error('failed to retrieve img for page ' + curPage);
        //updateStats();
        addImage(img, UI.images, curPage,
			function() {
				pagesLoaded += 1;
				updateStats();
			},
			lastUrl);
        curPage += 1;
        if (!next && curPage < numPages) throw new Error('failed to retrieve next url for page ' + curPage);
        loadNextPage(next);
    },
    getPageInfo = function() { //解析收到的新页 3>1
        var page = doc_temp.body;
        doc_temp.body.innerHTML = xhr.response;
        try {
            // find image and link to next page
            addAndLoad(extractInf('img', imp.imgmod, page), extractInf('next', null, page));
        } catch(e) {
			retries -= 1;
            if (xhr.status == 503 && retries > 0) {
                window.setTimeout(function() {
                    xhr.open('get', xhr.responseURL);
                    xhr.send();
                },
                500);
            }
        }
    },
    loadNextPage = function(url) { //加载下一页 2>3
        console.log(url);
        resumeUrl = null;
        if (mLoadNum !== 'all' && (curPage >= currentPage + mLoadNum)) {
			resumeUrl = url;
			return;
        }
        if (numPages && curPage > numPages){ curPage+=mLoadNum; return;}
        if (lastUrl === url) return;
        if (url == null) {return;}
		
        count += 1;
        lastUrl = url;
        retries = 5;
        if (imp.pages) {
            imp.pages(url, curPage, addAndLoad, extractInf, getPageInfo);
        } else {
            var colonIdx = url.indexOf(':');
            if (colonIdx > -1) {
                url = location.protocol + url.slice(colonIdx + 1);
            }
            xhr.open('get', url);
            imp.beforexhr && imp.beforexhr(xhr);
            xhr.onload = getPageInfo;
            xhr.onerror = function() {alert("cannot reach page!");};
            xhr.send();
        }
    },
    count = 1,
    pagesLoaded = curPage - 1,
    lastUrl = pageUrl,
    UI,
    retries;
	///////////////////////////////			初始化 
    bLastPage = LastPage;
    bNextPage = NextPage;
    // gather chapter stats 章节信息
    pageStats.curChap = extractInf('curchap', {
        type: 'index',
        invIdx: !!imp.invchap
    });
    pageStats.numChaps = extractInf('numchaps');
    // do some checks on the chapter urls
    nextChapter = (nextChapter && nextChapter.trim() === location.href + '#' ? null: nextChapter);
    prevChapter = (prevChapter && prevChapter.trim() === location.href + '#' ? null: prevChapter);

    UI = getViewer(prevChapter, nextChapter);

    UI.statsPages.textContent = ' 0/1 loaded, ' + numPages + ' total';

    currentPage = curPage; 
    addAndLoad(imgUrl, nextUrl); //////// 加载初始页面
    var currentEL = getEl('#image_' + currentPage); //显示第一张图片
    if (currentEL) {
        currentEL.style.display = 'block';
        currentEL.addEventListener('click', NextPage);
    }
    ///////////////////////////////////////////////////////////////  自定义 初始化
    if (BookMarks[bookIndex]) getEl('#MarkPage').innerHTML = BookMarks[bookIndex].page;
    getEl('#image_counter').innerHTML = currentPage;
    getEl('#image_counter').addEventListener('click', OpenPage);
    getEl('#addMark').addEventListener('click', addMark);
    getEl('#deleteMark').addEventListener('click', deleteMark);
	
	setting = JSON.parse(localStorage.Lsetting || '{ "timerCount": 3 }');
    getEl('#TimerValue').innerHTML = setting.timerCount;
	
};

var waitAndLoad = function(imp) { //有些网站需要先等待加载完成
    if (imp.wait) {
        var waitType = typeof imp.wait;
        if (waitType === 'number') {
            setTimeout(loadManga.bind(null, imp), imp.wait || 0);
        } else {
            var isReady = waitType === 'function' ? imp.wait.bind(imp) : function() {
                return getEl(imp.wait);
            };
            var intervalId = setInterval(function() {
                if (isReady()) {
                    clearInterval(intervalId);
                    loadManga(imp);
                }
            },200);
        }
    } else {
        loadManga(imp); //加载
    }
};

var MLoaderLoadImps = function(imps) { //根据网站选择解析参数
    var success = imps.some(function(imp) { //some() 方法用于检测数组中的元素是否满足指定条件（函数提供）。
        if (imp.match && (new RegExp(imp.match, 'i')).test(pageUrl)) {
            bookIndex = pageUrl.match(/\/(\w+)-/)[1]; //网页编号
            BookMarks = JSON.parse(localStorage.BookMarks || '{ "sum":0}');
            if (BookMarks[bookIndex] && !localStorage.noMark) if (window.location.href != BookMarks[bookIndex].url) {
                window.location.href = BookMarks[bookIndex].url;
                localStorage.noMark = 'no';
            }
            localStorage.removeItem('noMark');
            waitAndLoad(imp);
            return true;
        }
    });
};

var pageUrl = window.location.href;
// should we load less pages at a time?
var mLoadNum = 4;
// holder for statistics
var pageStats = {
    numPages: null,
    numLoaded: null,
    loadLimit: null,
    curChap: null,
    numChaps: null
};

MLoaderLoadImps(nsfwimp);
console.log('finish init');