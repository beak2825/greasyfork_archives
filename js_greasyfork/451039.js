// ==UserScript==
// @name         随手小说下载
// @namespace    ythong
// @version      0.4.1.6
// @description  带图形化界面的小说下载器。任意网站，自动识别任何目录列表，自动识别正文，自由下载，简单直观。
// @author       ythong
// @match        http://*/*
// @match        https://*/*
// @require      https://greasyfork.org/scripts/450829-numberdigit/code/numberDigit.js?version=1090310
// @require      https://greasyfork.org/scripts/450948-reader/code/Reader.js?version=1098627
// @require      https://greasyfork.org/scripts/452085-mymd5/code/myMd5.js?version=1098266
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.32.0/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.32.0/mode/javascript/javascript.js
// @resource     CodeMirrorminCss https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.32.0/codemirror.min.css
// @noframes
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_listValues
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_getResourceText
// @license      MIT License

// @downloadURL https://update.greasyfork.org/scripts/451039/%E9%9A%8F%E6%89%8B%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/451039/%E9%9A%8F%E6%89%8B%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var nextPageReg = /下\s*一?\s*[页頁张張章]/i;
    var nextListReg = /下\s*一?\s*[页頁]/i;
    var setting = {}, tempSetting = {}, customListFunc, customItemFunc, customTextFunc, customNextPageFunc;
    var cm; //setting输入对象
    var CodeMirrorSize = [293, 121];
    const SETTING_KEYS = [
        "listSelector",
        "textSelector",
        "jammerSelector",
        "nextListSelector",
        "nextListDelay",
        "frameText",
        "addedNextPageReg",
        "notUploadSaveinfo",
        "customListFunc",
        "customItemFunc",
        "customTextFunc",
        "customNextPageFunc",
    ];

    var chapters = [];
    var chaptersIndex = [];
    var root;
    var MaxThread = 10; // 同时下载数量
    var maxNextCount = 100, //最大下一页数量，总不可能无限吧
        nextCountLimit = 10, //下一页限制，超过会提示
        continueDownload = false; //超过下一页限制，是否继续直到到达下一页限制
    var downloadedCount = 0, downloadedErr = 0, downloadedNo = 0, downloadedExceedNext = 0;
    var downloadIndex;
    var hiClass='ythHighlight';
    var reader;
    var nextListHref,nextListCount=0;
    var iframes=[];
    //#region List
    function getCssClass(className){
        if(!className)return "";
        className=className.trim();
        if(!className)return "";
        /*        className=className.replace(/#/g,'\\23');
        className=className.replace(/([\.\(\)\[\]%:+=])/g,'\\$1');*/
        var cssClass=className.replace(/([^\w\s-])/g,'\\$1');
        cssClass='.' + cssClass.replace(/\s+/g, ".");
        return cssClass;
    }
    function getElementThisSelector(ele) {
        var tag = ele.tagName.toLocaleLowerCase();
        //        if (ele.id) {
        //            return '#' + getRightId(ele.id);
        //        } else {
        return tag + getCssClass(ele.className);
        //        }
    }
    function getAncestorWithMostSimilarDescendant(ele, tag) {
        var selector = tag;
        var maxEle, maxSelector, count = 0;
        while (true) {
            ele = ele.parentElement;
            if (!ele || ele.tagName == 'HTML') break;
            var aa = ele.querySelectorAll(':scope>' + selector);
            if (aa.length > count) {
                count = aa.length;
                maxEle = ele;
                maxSelector = selector;
            }
            selector = getElementThisSelector(ele) + ">" + selector;
        }
        return [maxEle, maxSelector, count];
    }
    function getAncestorWithMostSimilarTag(doc,tag) {
        var eTags = [].slice.apply(doc.querySelectorAll(tag));
        var mostAncestor, mostSelector, mostCount = 0;
        var descendants;
        while (eTags.length > 0) {
            var ele = eTags.shift();
            var [ancestor, selector, count] = getAncestorWithMostSimilarDescendant(ele, tag);
            descendants = [].slice.apply(ancestor.querySelectorAll(':scope>' + selector));
            eTags = eTags.filter(item => descendants.indexOf(item) === -1);
            if (count > mostCount) {
                [mostAncestor, mostSelector, mostCount] = [ancestor, selector, count];
            }
        }
        return [mostAncestor, mostSelector, mostCount];
    }
    function getNextList(doc) {
        if(setting.nextListSelector) return doc.querySelector(setting.nextListSelector);
        let eles = doc.querySelectorAll("a"), nextPage = null;
        for (let ele of eles) {
            if (nextListReg.test(ele.innerText) && ele.href.indexOf("javascript") == -1) return ele;
        }
        eles = doc.querySelectorAll("span")
        for (let ele of eles) {
            if (nextListReg.test(ele.innerText)) return ele;
        }
    }

    function getRestList(doc){
        function changeRestListText(str){
            if(str){
                getRestList.innerText=`第${nextListCount}页`;
                setTimeout(()=>{
                    alert(str);
                    getRestList.innerText='续页目录';
                    getRestList.disabled=false;
                },100);
            }else{
                getRestList.innerText=`第${nextListCount}页`;
            }
        }
        function waitGetList(){
            function getListLoop(){
                if(count>10) return changeRestListText("获取续页结束")
                count+=1;
                var addCount=getList(doc);
                if(addCount){
                    nextListCount+=1;
                    changeRestListText();
                    nextList=getNextList(doc);
                    if(nextList){
                        nextList.click();
                        waitGetList();
                    }else{
                        return changeRestListText("找不到下一页，获取续页结束");
                    }
                    return;
                }
                setTimeout(getListLoop, nextListDelay);
            }
            var nextListDelay=setting.nextListDelay||200;
            nextListDelay=Number(nextListDelay);
            var count=0;
            setTimeout(getListLoop,nextListDelay);
        }
        function downGetList(doc){
            if(!doc) return changeRestListText("下一页获取失败,获取续页结束")
            var addCount=getList(doc);
            if(!addCount) return changeRestListText("增加目录数为0，获取续页结束")
            nextListCount+=1;
            changeRestListText();
            var nextList=getNextList(doc);
            if(!nextList)return changeRestListText("找不到下一页，获取续页结束")
            nextListHref=nextList.href;
            if(!nextListHref)return changeRestListText("下一页无网址，获取续页结束")
            download(nextListHref,0,downGetList)
        }
        var getRestList=root.querySelector("#getRestList");
        getRestList.disabled=true;
        if(!nextListHref){
            if(!doc)return changeRestListText("下一页获取失败,获取续页结束")
            var nextList=getNextList(doc);
            if(!nextList)return changeRestListText("找不到下一页，获取续页结束")
            nextListHref=nextList.href;
        }
        if(nextListHref && nextListHref.indexOf("javascript") == -1){
            download(nextListHref,0,downGetList)
        } else {
            nextList=getNextList(doc);
            if(nextList){
                nextList.click();
                waitGetList();
            }
        }
    }
    function getList(doc) {
        var preChapterNo = 0;
        var preHrefNo = 0;
        function getChapterNo(s) {
            var found = s.match(/\d+|[零一壹二贰两三叁四肆五伍六陆七柒八捌九玖十拾百佰千仟万亿]+/g);
            if (found) {
                var n = parseInt(found[0]);
                if (isNaN(n)) {
                    n = numberDigit(found[0]);
                    if (n != -1) return n;
                } else return n;
            }
            return preChapterNo;
        }
        function getHrefNo(s) {
            var found = s.match(/\d+/g);
            return found ? parseInt(found.pop()) : preHrefNo;
        }
        function addToChapters(elements) {
            var count=0;
            for (var e of elements) {
                if (customItemFunc) customItemFunc(doc, e);
                if (!e.href || e.href.indexOf("javascript") != -1) continue;
                //if(isHide(window,e))continue;
                var iChapters=getIndexOfObjectArray(chapters, "href", e.href);
                if (iChapters != -1){ //最新章节
                    chaptersIndex.splice(chaptersIndex.indexOf(iChapters), 1);
                    chaptersIndex.push(iChapters);
                    continue;
                }
                count+=1;
                var title=e.text||e.innerText;
                var length = chapters.push({
                    href: e.href,
                    title: title,
                    chapterNo: getChapterNo(title),
                    hrefNo: getHrefNo(e.href),
                    text: "", //正文
                    nextCount: 0, //本章的下一页数量
                });
                preChapterNo = chapters[length - 1].chapterNo;
                preHrefNo = chapters[length - 1].hrefNo;
                chaptersIndex.push(length - 1);
            }
            return count
        }
        setting = getSetting();
        if (typeof setting != 'object') return;
        var listSelector=setting.listSelector;
        if (!listSelector||listSelector=='--') {
            var [mostAncestor, mostSelector, mostCount] = getAncestorWithMostSimilarTag(doc,"a:not([href*='javascript'])");
            if(!mostAncestor)return console.log('找不到目录');
            listSelector = getElementSelector(mostAncestor, doc) + '>' + mostSelector;
            if(setting.listSelector!='--'){
                setting.listSelector = listSelector;
                displaySetting();
            }
        }
        var count=0;
        if (customListFunc) {
            var customResult = customListFunc(doc, listSelector);
            if (customResult[0] instanceof Document) {
                [doc, listSelector] = customResult;
            } else {
                count=addToChapters(customResult);
                if(count)createTr();
                return
            }
        }
        listSelector=(listSelector||'').trim().replace(/\n/,',');
        count=addToChapters(doc.querySelectorAll(listSelector));
        createTr(); //count为0时也要刷新，因为可能都是最新章节的
        return count;
    }
    function createTr() {
        var tableBody = root.querySelector("table tbody");
        tableBody.innerHTML = "";
        for (var i of chaptersIndex) {
            var tr = document.createElement("tr");
            chapters[i].tr = tr
            var td = document.createElement("td");
            td.className = "serial";
            tr.appendChild(td);
            td = document.createElement("td");
            var a = document.createElement("a");
            a.text = chapters[i].title;
            a.href = chapters[i].href;
            a.target="_blank";
            td.title = `章节号${chapters[i].chapterNo}，网址号${chapters[i].hrefNo}`;
            td.appendChild(a);
            tr.appendChild(td);
            td = document.createElement("td");
            var button = document.createElement("button");
            button.className = 'getText';
            button.textContent = '正';
            button.addEventListener("click", getText);
            td.appendChild(button);
            button = document.createElement("button");
            button.className = 'deleteRow';
            button.textContent = '─';
            button.addEventListener("click", deleteRow);
            td.appendChild(button);
            var span = document.createElement("span");
            td.appendChild(span);
            tr.appendChild(td);
            tableBody.appendChild(tr);
            showState(i);
        }
    } //getList
    function sortList(value) {
        var length = chapters.length;
        if (!chaptersIndex) {
            chaptersIndex = new Array(length);
            for (let i = 0; i < length; i++) {
                chaptersIndex[i] = i;
            }
        }
        switch (value) {
            case "原始升序":
                for (let i = 0; i < length; i++) {
                    chaptersIndex[i] = i;
                }
                break;
            case "原始降序":
                for (let i = 0; i < length; i++) {
                    chaptersIndex[i] = length - i - 1;
                }
                break;
            case "章节号升序":
                chaptersIndex.sort((a, b) => chapters[a].chapterNo - chapters[b].chapterNo);
                break;
            case "章节号降序":
                chaptersIndex.sort((a, b) => chapters[b].chapterNo - chapters[a].chapterNo);
                break;
            case "网址升序":
                chaptersIndex.sort((a, b) => chapters[a].hrefNo - chapters[b].hrefNo);
                break;
            case "网址降序":
                chaptersIndex.sort((a, b) => chapters[b].hrefNo - chapters[a].hrefNo);
                break;
        }
        createTr();
    }
    //#endregion List
    //#region helper
    function getElementSelector(element, doc) {
        function getRightId(id) {
            var firstCode = id.charCodeAt(0);
            if (firstCode >= 48 && firstCode <= 57) return "\\3" + id[0] + " " + id.substr(1, id.length);
            else return id;
        }
        let domPath = [];
        var e = element;
        while (e && e.nodeName.toLowerCase() !== "html") {
            var tag = e.tagName.toLocaleLowerCase();
            if (e.id) {
                domPath.unshift('#' + getRightId(e.id)+getCssClass(e.className));
                break;
            } else if (tag == "body") {
                domPath.unshift(tag);
            } else {
                var index = 0;
                var isOneTag = true;
                var isOneClass = e.classList.length > 0;
                for (var i = 0; i < e.parentNode.childElementCount; i++) {
                    if (e.parentNode.children[i] == e) {
                        index = i;
                    } else if (e.parentNode.children[i].tagName == e.tagName) {
                        isOneTag = false;
                        if (e.classList.length > 0 && e.parentNode.children[i].classList.toString() == e.classList.toString()) {
                            isOneClass = false;
                        }
                    }
                }
                if (isOneTag) {
                    domPath.unshift(tag);
                } else if (isOneClass) {
                    domPath.unshift(tag + getCssClass(e.className));
                } else {
                    domPath.unshift(tag + ':nth-child(' + (index + 1) + ')');
                }
            }
            var selector = domPath.toString().replace(/,/g, '>');
            var eles = doc.querySelectorAll(selector);
            if (eles.length == 1 && eles[0] == element) break;
            e = e.parentNode;
        }
        return domPath.toString().replace(/,/g, '>');
    } //getElementSelector
    //#endregion helper
    //#region Text
    function getContentElement(doc) { //参考“怠惰小说下载器”
        function getEffectiveText(text) {
            return text.replace(/\s+/g, '');
        }
        var largestContent, contents = doc.querySelectorAll("span,div,article,section,p,td"), largestNum = 0;
        for (let content of contents) {
            var curNum = 0;
            for (let item of content.childNodes) {
                if (item.nodeType == 3) { //纯文本
                    if (!/^\s*$/.test(item.data)) curNum += getEffectiveText(item.data).length;
                } else if (item.nodeType == 8) { //忽略注释
                    continue;
                } else if (/^(I|A|STRONG|B|FONT|P|DL|DD|H\d|SECTION)$/.test(item.tagName)) { //有这些子节点
                    curNum += getEffectiveText(item.innerText).length;
                }
            }
            if (curNum > largestNum) {
                largestNum = curNum;
                largestContent = content
            }
        }
        //console.log(largestContent, largestNum, getEffectiveText(largestContent.innerText));
        return largestContent;
    }
    function getElementText(element) { //参考“怠惰小说下载器”
        let result = "";
        for (let childNode of element.childNodes) {
            if (childNode.nodeType == 8) continue; //忽略注释
            if (childNode.innerHTML) {
                childNode.innerHTML = childNode.innerHTML.replace(/<\s*br\s*>/gi, "\r\n").replace(/\n+/gi, "\n").replace(/\r+/gi, "\r");
            }
            if (childNode.nodeType == 1 && !/^(I|A|STRONG|B|FONT)$/.test(childNode.tagName)) result += "\r\n";
            //textContent会包含里面的img源码；当是纯文本时，没有innerText属性，所以只能用textContent
            var text=childNode.innerText||childNode.textContent||'';
            text = text.replace(/[\u00A0\u2002\u2003\u2005\u200C\u200D]/g, '');
            result += text.trim().replace(/ +/g, "  ").replace(/([^\r]|^)\n([^\r]|$)/gi, "$1\r\n$2");
        }
        return result;
    }
    function downloadText(href, index, callback){
        if(setting.hasOwnProperty("frameText")) frameDoc(href, index, callback);
        else download(href, index, callback);
    }
    function frameDoc(href, index, callback) {
        if (typeof index == 'undefined') return;
        if (index < 0 || index >= chapters.length) return;
        if (href == null) {
            href = chapters[index].href;
            chapters[index].text = '';
            chapters[index].state = '';
            chapters[index].nextCount = 0;
        }
        if(document.location.protocol=="https:") href=href.replace(/^http:/,'https:');
        var frame=iframes.shift();
        if(!frame){
            frame=document.createElement('iframe');
            root.getElementById("iframesWarpper").appendChild(frame);
            frame.onload=function (result) {
                var doc = frame.contentDocument;
                if(doc){
                    doc.href = href; //记下当前页面的网址，自己生成的没有网址。
                    const element = doc.documentElement
                    element.scrollTop = 0;
                    const interval = setInterval(()=>{
                        console.log(element.scrollTop + element.clientHeight , element.scrollHeight);
                        if (element.scrollTop + element.clientHeight == element.scrollHeight) {
                            clearInterval(interval)
                            setTimeout(()=>{
                                deleteElementBySelector(doc,'img');
                                deleteElementBySelector(doc, '*[style*="display:none"]');
                                deleteHideElement(doc);
                                callback(doc, index);
                            },1000);
                        } else {
                            element.scrollTop +=200000;
                        }
                    }, 200)
                }else{
                    console.warn("error:", href);
                    callback(null, index);
                    frame.remove();
                }
            };
            frame.onerror=(e)=>{
                console.warn("error:", href);
                callback(null, index);
                frame.remove();
            };
        }
        frame.src=href;
    }
    function download(href, index, callback) {
        if (typeof index == 'undefined') return;
        if (index < 0 || index >= chapters.length) return;
        if (href == null) {
            href = chapters[index].href;
            chapters[index].text = '';
            chapters[index].state = '';
            chapters[index].nextCount = 0;
        }
        let requestBody = {
            method: 'GET',
            url: href,
            headers: {
                referer: href,
                "Content-Type": "text/html;charset=" + document.charset,
            },
            timeout: 15000,
            overrideMimeType: "text/html;charset=" + document.charset,
            onload: function (result) {
                var doc = getDoc(result.responseText);
                doc.href = href; //记下当前页面的网址，自己生成的没有网址。
                //                deleteSomeTag(doc, 'script');
                deleteSomeTag(doc, 'style');
                deleteSomeTag(doc, 'img');
                deleteElementBySelector(doc, '*[style*="display:none"]');
                deleteHideElement(doc);
                callback(doc, index);
            },
            onerror: function () {
                console.warn("error:", href);
                callback(null, index);
            },
            ontimeout: function () {
                console.warn("timeout: ", href);
                callback(null, index);
            }
        };
        GM_xmlhttpRequest(requestBody);
    } //getDocByHref
    function deleteHideElement(doc) {
        if (!doc.defaultView) return; //直接下载网页的没有doc.defaultView
        var elements = doc.querySelectorAll("span,div,ul,li")
        //var elements = doc.querySelectorAll("li")
        for (var i = elements.length - 1; i >= 0; i--) {
            var ele = elements[i];
            var thisStyle = doc.defaultView.getComputedStyle(ele);
            if (thisStyle && (thisStyle.display == "none" || (ele.tagName == "SPAN" && thisStyle.fontSize == "0px"))) ele.remove();
        }
    }
    function deleteElementBySelector(doc, selector) {
        var elements = doc.querySelectorAll(selector);
        for (var i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }
    }
    function deleteSomeTag(doc, tag) {
        var elements = doc.getElementsByTagName(tag);
        for (var i = elements.length - 1; i >= 0; i--) {
            elements[i].remove();
        }
    }
    function getDoc(str) {
        var doc = null;
        try {
            doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = str;
        }
        catch (e) {
            console.log('parse error');
        }
        return doc;
    } //getDoc
    function getNextPage(doc) {
        let eles = doc.querySelectorAll("a");
        for (let ele of eles) {
            if (nextPageReg.test(ele.innerText) && ele.href.indexOf("javascript") == -1) return ele;
            if(setting.addedNextPageReg){
                if (setting.addedNextPageReg.test(ele.innerText) && ele.href.indexOf("javascript") == -1) return ele;
            }
        }
    }
    //获得正文，如果有下一页网址不在章节网址，继续获取，并返回Next
    function getTextFromDoc(doc, index, callback) {
        function addTexttoChapter(text) {
            chapters[index].text +=
                ((doc.href == chapters[index].href) ? "" : `>>${doc.title}\n`) + text;
        }
        if (doc) {
            var nextPagehref="";
            if (customNextPageFunc) {
                nextPagehref=customNextPageFunc(doc,chapters[index].href);
            }else{
                var nextPage = getNextPage(doc);
                nextPagehref = nextPage ? nextPage.href : "";
            }
            deleteSomeTag(doc, 'script');
            var jammerSelector=(setting.jammerSelector||'').trim().replace(/\n/,',');
            if (jammerSelector) deleteElementBySelector(doc, jammerSelector);
            var content;
            var textSelector=setting.textSelector;
            if (!textSelector||textSelector=='--') {
                content = getContentElement(doc);
                textSelector = getElementSelector(content, doc);
                if(setting.textSelector!='--'){
                    setting.textSelector = textSelector;
                    displaySetting();
                }
            }
            if (customTextFunc) {
                var customResult = customTextFunc(doc, textSelector);
                if (Array.isArray(customResult)) {
                    [doc, textSelector] = customResult;
                } else if (typeof customResult == 'string') {
                    addTexttoChapter(customResult+'\n');
                    return 'OK';
                } else {
                    return 'No'
                }
            }
            textSelector=(textSelector||'').trim().replace(/\n/,',');
            var eTexts = doc.querySelectorAll(textSelector);
            if(eTexts.length==0) return 'No';
            var text=''
            for (var eText of eTexts) {
                text+=getElementText(eText)+'\n';
            }
            addTexttoChapter(text);

            if (nextPagehref) {
                var href2 = nextPagehref.slice(0, 6) == 'https:' ? 'http:' + nextPagehref.slice(6) : 'https' + nextPagehref.slice(5);
                if (nextPagehref == document.location.href || href2 == document.location.href) return 'OK'; // 如果a元素的href为空，返回的是目录页的地址
                if (nextPagehref == doc.href || href2 == doc.href) return 'OK';
                if (getIndexOfObjectArray(chapters, "href", nextPagehref,true) == -1 && getIndexOfObjectArray(chapters, "href", href2,true) == -1) {
                    if (chapters[index].nextCount > nextCountLimit - 1) { //第一个下一页为0
                        if (continueDownload || confirm(`目录“${chapters[index].title}”的下一页数量超过最大值${nextCountLimit}，你要让以后的下一页继续吗？\n继续可能会下载太多链接，请谨慎继续！`)) {
                            continueDownload = true;
                        } else {
                            return '>N';
                        }
                    }
                    if (chapters[index].nextCount > maxNextCount - 1) return '>>N'
                    downloadText(nextPagehref, index, callback);
                    return 'Next';
                } else return 'OK';
            } else return 'OK';
        } else {
            return 'Er';
        }
    } //getTextFromDoc
    function showChapterText(index) {
        function showOrDownload(index) {
            if (isDownloaded(index)) {
                showChapterText(index)
            } else {
                downloadText(null, index, getTextCallback)
            }
        }
        reader.setReader(chapters[index].text, chapters[index].title,
                         (index - 1 >= 0 && index - 1 < chapters.length) ? '<' : '', () => {
            showOrDownload(index - 1)
        }, (index + 1 >= 0 && index + 1 < chapters.length) ? '>' : '', () => {
            showOrDownload(index + 1)
        });
    }
    function showState(index) {
        var span = chapters[index].tr.querySelector("td>span");
        span.textContent = (chapters[index].state || '') +
            ((chapters[index].state != 'OK' && chapters[index].text) ? "+" : "") +
            (chapters[index].nextCount || '');
    }
    function getTextCallback(doc, index) {
        var state = getTextFromDoc(doc, index, getTextCallback);
        //        doc&&doc.defaultView&&doc.defaultView.frameElement&&iframes.push(doc.defaultView.frameElement);
        doc&&doc.defaultView&&doc.defaultView.frameElement&&doc.defaultView.frameElement.remove();
        switch (state) {
            case 'No':
                if (confirm(`${chapters[index].text ? "后续页" : ""}找不到正文选择器指定的元素，清空正文选择器重新获取。`)) {
                    delete setting.textSelector;
                    displaySetting();
                }
                break;
            case 'Er': alert(`${chapters[index].href}下载出错`); break;
            case 'Next':
                chapters[index].nextCount += 1;
                return;
        }
        chapters[index].state = state;
        showState(index);
        if (chapters[index].text) showChapterText(index);
    }
    var getText = e => {
        setting = getSetting();
        if (typeof setting != 'object') return;
        var tr = e.target.parentElement.parentElement;
        var index = getIndexOfObjectArray(chapters, "tr", tr);
        if (isDownloaded(index)) showChapterText(index);
        else downloadText(null, index, getTextCallback);
        //        else framedoc(null, index, getTextCallback);
    }
    function uploadSaveinfo2(info){
        const url = 'https://jsonbin.org/me/saveinfos';
        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "token 494a60d1-f0ee-4b6d-a5bf-8654a9ff5eb1"
        });
        fetch(url, {
            headers: headers,
            method: "PATCH",
            body:JSON.stringify(info),
        });
    }
    function uploadSaveinfo(info) {
        const url = 'https://jsonbin.org/me/savedInfos';
        const headers = new Headers({
            "Content-Type": "application/json",
            "Authorization": "token 494a60d1-f0ee-4b6d-a5bf-8654a9ff5eb1"
        });
        var md5type = 1;
        var md5s = myMd5(info.url);
        uploadInfo();
        function uploadInfo() {
            function setValue(md5,info){
                fetch(url+'/'+md5, {
                    method: "POST",
                    headers: headers,
                    body:JSON.stringify(info),
                })
            }
            function pushDowninfo(md5,downinfo){
                fetch(url+'/'+md5+'/downinfo', {
                    method: "PATCH",
                    headers: headers,
                    body:JSON.stringify(downinfo),
                })
            }
            var md5 = md5s.slice(0, md5type).join('');
            if (md5type > 4) md5 += (md5type - 4);
            fetch(url+'/'+md5, {
                method: "GET",
                headers: headers,
            }).then(function(response) {
                return response.json()
            }).then(function(json) {
                if (!json) {
                    setValue(md5, info)
                } else {
                    if (json.url == info.url) {
                        var stime=json.downinfo.slice(-1)[0][2];
                        var itime=info.downinfo[0][2];
                        if (!stime && !itime){}
                        else if (stime && itime && Math.abs(itime - stime)<0.0060){}
                        else pushDowninfo(md5,info.downinfo[0]);
                    } else {
                        md5type += 1;
                        uploadInfo();
                    }
                }
            })
        }
    }
    function saveAllText() {
        var allText = '', a;
        for (var i of chaptersIndex) {
            allText += '\n##' + chapters[i].title.trim().replace(/\s+/g,' ') + '\n' + chapters[i].text;
        }
        var dd=new Date();
        var time=dd.getFullYear()*10000+(dd.getMonth()+1)*100+dd.getDate()+dd.getHours()*0.01+dd.getMinutes()*0.0001;
        var info={
            title:document.title,
            url:document.location.href,
            downinfo:[[chapters.length,allText.length,time]],
        };
        if(!setting.hasOwnProperty("notUploadSaveinfo")) uploadSaveinfo(info);
        var blob = new Blob([
            '#' + document.title + '\n',
            document.location.href + '\n',
            '使用油猴脚本“随手小说下载”获取\n',
            allText
        ], { type: "text/plain;charset=utf-8", endings: "native" });
        var filename = document.title.replace(/[/\\?%*:|"<>.]/g, '-') + '.txt';
        downloadFile(blob, filename);
    }
    function getAllTextCallback(doc, index) {
        var state = getTextFromDoc(doc, index, getAllTextCallback);
        doc&&doc.defaultView&&doc.defaultView.frameElement&&doc.defaultView.frameElement.remove();
        switch (state) {
            case 'No': downloadedNo += 1; break;
            case 'Er': downloadedErr += 1; break;
            case '>N':
            case '>>N': downloadedExceedNext += 1; break;
            case 'Next':
                chapters[index].nextCount += 1;
                return;
        }
        chapters[index].state = state;
        showState(index);
        downloadText(null, chaptersIndex[downloadIndex], getAllTextCallback);
        downloadIndex = getNextUndownloadIndex(downloadIndex + 1);
        downloadedCount += 1;
        root.querySelector('#downloadNumbers').textContent = `${chapters.length}/${downloadedCount}/${downloadedNo}/${downloadedErr}/${downloadedExceedNext}`;
        if (downloadedCount >= chapters.length) {
            if (downloadedNo == 0 && downloadedErr == 0) {
                saveAllText();
            } else {
                if (confirm(`${downloadedNo}个找不到正文元素，${downloadedErr}个下载失败。\n是否保存已下载的文本。`)) {
                    saveAllText();
                }
            }
        }
    } //getAllTextCallback
    function isDownloaded(index) {
        var state = chapters[index].state;
        return state == 'OK'
    }
    function getNextUndownloadIndex(index) {
        while (index < chaptersIndex.length && isDownloaded(chaptersIndex[index])) {
            downloadedCount += 1;
            index += 1;
        }
        return index;
    }
    function getAllText() {
        if (chapters.length < 1) alert("没有目录，请先获取目录再下载全部文本。");
        downloadedCount = 0; //已下载数量
        downloadedErr = 0; //下载失败数量
        downloadedNo = 0; //下载章节找不到选择器对应元素的数量
        downloadIndex = 0; //当前待下载序号

        downloadIndex = getNextUndownloadIndex(downloadIndex);
        if (downloadIndex >= chapters.length) saveAllText(); //已经获取全部文本
        else {
            for (var i = 0; i < MaxThread; i++) {
                downloadText(null, chaptersIndex[downloadIndex], getAllTextCallback);
                downloadIndex = getNextUndownloadIndex(downloadIndex + 1);
            }
        }
    }
    var deleteRow = e => {
        var tr = e.target.parentElement.parentElement;
        var index = getIndexOfObjectArray(chapters, "tr", tr);
        tr.remove();
        chapters.splice(index, 1);
        chaptersIndex.splice(chaptersIndex.indexOf(index), 1);
        for (let i = 0; i < chaptersIndex.length; i++) {
            if (chaptersIndex[i] > index) chaptersIndex[i] -= 1;
        }
    };
    function getIndexOfObjectArray(objectArray, key, value, isStartsWith=false) {
        for (let i = 0; i < objectArray.length; i++) {
            if (isStartsWith) {
                if (value.startsWith(objectArray[i][key])) return i;
            } else if (objectArray[i][key] == value) return i;
        }
        return -1;
    }
    function displaySetting() {
        //        eSetting.value=toTplString(JSON.stringify(setting, null, 2));
        cm.setValue(settingToString(setting));
        setSaveSiteSettingClass();
    }
    function getSetting(isSetCunstomFun = true) {
        var result = {}, key = '', value = '';
        var lines = cm.getValue().split('\n');
        for (let line of lines) {
            if (!line.trim()) continue;
            if (line.slice(0, 2) == '$$') {
                if (key=='frameText') result[key]='';
                if (key=='notUploadSaveinfo') result[key]='';
                else if (key && value) result[key] = value.trim();
                key = line.slice(2);
                value = '';
                if (SETTING_KEYS.indexOf(key) == -1) {
                    return alert(`网站配置输入框中，键值${key}不合法，请修改。`);
                }
            } else {
                value += (value ? '\n' : '') + line;
            }
        }
        if (key=='frameText') result[key]='';
        if (key=='notUploadSaveinfo') result[key]='';
        else if (key && value) result[key] = value.trim();
        if (isSetCunstomFun) {
            customListFunc = result.customListFunc ? Function("doc", "selector", result.customListFunc + ";return [doc,selector];") : null;
            customItemFunc = result.customItemFunc ? Function("doc", "item", result.customItemFunc + ";return [doc,item];") : null;
            customTextFunc = result.customTextFunc ? Function("doc", "selector", result.customTextFunc + ";return [doc,selector];") : null;
            customNextPageFunc=result.customNextPageFunc ? Function("doc", "href", result.customNextPageFunc + ";return [doc,href];") : null;
        }
        return result;
    }
    function settingToString(setting) {
        var result = '';
        for (var key in setting) {
            result += '$$' + key + '\n';
            if(setting[key]) result += setting[key] + '\n';
        }
        return result;
    }
    function saveSiteSetting() {
        setting = getSetting();
        if (typeof setting != 'object') return;
        if (isSameObject(setting, {})) {
            GM_deleteValue(location.host);
            alert("已删除该网站配置");
        } else {
            GM_setValue(location.host, setting);
            alert("已保存该网站配置");
        }
        setSaveSiteSettingClass();
    }
    function isSameObject(object1, object2) {
        if (!object1 || !object2) return false;
        var ss1 = Object.entries(object1).toString();
        var ss2 = Object.entries(object2).toString();
        return ss1 === ss2;
    }
    function setRestListClass(){
        var nextList=getNextList(document);
        root.querySelector("#getRestList").disabled=!nextList;
    }
    function setSaveSiteSettingClass() {
        tempSetting = getSetting(false);
        if (typeof tempSetting == 'object') {
            var gmSetting = GM_getValue(location.host);
            root.querySelector("#saveSiteSetting").disabled = isSameObject(tempSetting, gmSetting);
        }
        setRestListClass(); //设置剩余目录按钮可用性
    }
    function enableCodeMirrow() {
        var CodeMirrorminCss = GM_getResourceText("CodeMirrorminCss")
        var style = document.createElement('style');
        style.innerHTML = CodeMirrorminCss;
        root.appendChild(style);
        var ele = root.getElementById("setting");
        cm = CodeMirror.fromTextArea(ele, {
            matchBrackets: true,
            mode: "javascript",
        });
        cm.setSize(CodeMirrorSize[0], CodeMirrorSize[1]);
        cm.on('blur', function () {
            setSaveSiteSettingClass();
        });
        document.ytheditor = cm;
        window.ytheditor = cm;
        ytheditor = cm
        SETTING_KEYS.forEach(words => {
            //CodeMirror.resolveMode("javascript").keywords[words] = true;
        });

    }
    function downloadFile(blob, fileName) {
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        link.remove();
        window.URL.revokeObjectURL(link.href);
    }
    function addSiteSettings(siteSettings) {
        for (var name in siteSettings) {
            var setting = siteSettings[name];
            var tmpSetting = {};
            for (var key of SETTING_KEYS) {
                if (setting.hasOwnProperty(key)) tmpSetting[key] = setting[key];
            }
            if (!isSameObject(tmpSetting, {})) GM_setValue(name, tmpSetting);
        }
    }
    function selClick(e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();
        e.returnValue=false;
        document.getElementById("ythList").style.display='';
        document.body.removeEventListener("mouseover", selMouseover);
        document.body.removeEventListener("click", selClick,true);
        document.body.removeEventListener("touchend", selClick,true);
        var t = getFittedElement(e.target);
        if(!t)return false;
        t.className = t.className.replace(new RegExp("\\b" + hiClass + "\\b","g"), "").trim();
        var [mostAncestor, mostSelector, mostCount] = getAncestorWithMostSimilarDescendant(t,"a:not([href*='javascript'])");
        var eListSelector = getElementSelector(mostAncestor, document) + '>' + mostSelector;
        setting.listSelector = eListSelector;
        displaySetting();
        root.querySelector("#clearList").click();
        root.querySelector("#getList").click();
        return false;
    }
    function getFittedElement(e) {
        var t = e.nodeName.toLowerCase();
        return t == "a"&&!/javascript/.test(e.href)?e:(t == "body"? null : getFittedElement(e.parentNode));
    }
    function selMouseover(e) {
        e.stopPropagation();
        var t = getFittedElement(e.target);
        if(!t)return;
        t.addEventListener("mouseout", function(o) {
            var n = getFittedElement(o.target);
            n.className = n.className.replace(new RegExp("\\b" + hiClass + "\\b","g"), "").trim();
        });
        t.className += " " + hiClass;
    }

    function getClickedElementSelector(){
        setting = getSetting();
        if (typeof setting != 'object') return;
        document.getElementById("ythList").style.display='none';
        setTimeout(()=>{
            document.body.addEventListener("mouseover", selMouseover);
            //            document.body.addEventListener("mousedown", selClick);
            document.body.addEventListener("click", selClick, true);
            document.body.addEventListener("touchend", selClick, true);
        },200);
    }
    function addDiv() {
        GM_addStyle(`
        #ythList{
          position:fixed;
          right:0px;
          z-index: 99999999999;
          background-color: #ccc;
          top: 0;
        }
        .ythHighlight{
          background-color:#8ce!important;
	      cursor:pointer!important;
	      outline:4px solid #016!important;
        }
        `);
        var shadowCss = `
<style>
textarea{
    white-space: nowrap;
    width: 288px;
    height: 121px;
    font-size: 12px;
}
button:hover{
    background-color: rgb(93 187 93);
}
.titleList{
    overflow-y:scroll;
    overflow-x:hidden;
    padding-right: 2px;
    flex-grow: 1;
    margin-bottom: 10px;
}
#commandBar{
    margin: 5px 0px;
}
.capsule{
    width: fit-content;
    border-radius: 10px;
    color: #000;
    padding: 0px 7px 2px 7px;
    border-width: 1px;
    border-style: solid;
}
#remainOK{
    transform: scale(0.8);
}
table th {
    text-align: center;
    position: sticky;
    top: 0;
    background-color: #aaa;
    box-shadow: 0 -1px #000000;
}
table th, td {
	border: 1px solid black;
	word-wrap: break-word;
}
table td:nth-child(3){
    vertical-align:text-top;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
	table-layout: fixed;
	width:30.5em;
    font-size: inherit;
    color: #000;
}
table button {
    font-size: 10px;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    border-style: solid;
    color: #444;
    background-color: #f7f7f7;
    padding: 1px 0px;
    border-width: 1px;
}
table button.getText {
}
table button.deleteRow {
}
table th:nth-child(2),td:nth-child(2) {
	width:20em;
}
table th:nth-child(1),td:nth-child(1) {
	width:3em;
}
table tbody{
    counter-reset:sectioncounter;
}
table td.serial:before{
    content:counter(sectioncounter);
    counter-increment:sectioncounter;
}
#downloadNumbers{
    float:right;
}
svg {
    height: 18px;
}
svg path{
	fill:#404040;
}
#saveSiteSetting:disabled svg path{
    fill:#ccc;
}
iframe{
    pointer-events:none;
    width: 2px;
    height: 2px;
}
:disabled{
    cursor: none;
    pointer-events:none;
    background-color: revert;
    color:#ccc;
}
select,select option{
    float: right;
    transform: scale(0.8);
}
div.CodeMirror{
    resize: both;
    float: right;
    min-width: 288px;
    min-height: 60px;
}
#SiteSettingButtons{
    float: left;
    padding: 0px 4px 0px 0px;
    display: flex;
    flex-direction: column;
}
#SiteSettingButtons button{
    width: 20px;
    height: 20px;
    border-radius: 14%;
    padding: 0px 0px 0px 0px;
    border: 1px solid #333;
/*    background-color: #d2d2d2;*/
}
#container{
    display: flex;
    flex-flow: column;
    align-content: space-between;
    padding: 5px;
	font-size: 10px;
    font-family: -apple-system,BlinkMacSystemFont,Helvetica Neue,PingFang SC,Microsoft YaHei,Source Han Sans SC,Noto Sans CJK SC,WenQuanYi Micro Hei,sans-serif;
    line-height: normal;
    text-align: left;
}
</style>`;
        var div = document.createElement("div");
        div.id = "ythList";
        root = div.attachShadow({ mode: 'open' });
        var html = shadowCss;
        var importSvg = '<svg t="1662536357307" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2569"><path d="M667.733333 864H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h309.333333V320c0 40.533333 34.133333 74.666667 74.666667 74.666667h160v38.4c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V298.666667c0-8.533333-4.266667-17.066667-8.533334-23.466667l-170.666666-170.666667c-6.4-6.4-14.933333-8.533333-23.466667-8.533333H170.666667C130.133333 96 96 130.133333 96 170.666667v682.666666c0 40.533333 34.133333 74.666667 74.666667 74.666667h497.066666c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z m46.933334-550.4v17.066667H554.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V160h19.2l151.466667 153.6z" p-id="2570"></path><path d="M853.333333 597.333333H599.466667l51.2-51.2c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-106.666667 106.666667c-12.8 12.8-12.8 32 0 44.8l106.666667 106.666667c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8L599.466667 661.333333H853.333333c17.066667 0 32-14.933333 32-32S870.4 597.333333 853.333333 597.333333z" p-id="2571"></path></svg>';
        var exportSvg = '<svg t="1662536484558" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3489"><path d="M582.4 864H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h309.333333V320c0 40.533333 34.133333 74.666667 74.666667 74.666667h160v38.4c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V298.666667c0-8.533333-4.266667-17.066667-8.533334-23.466667l-170.666666-170.666667c-6.4-6.4-14.933333-8.533333-23.466667-8.533333H170.666667C130.133333 96 96 130.133333 96 170.666667v682.666666c0 40.533333 34.133333 74.666667 74.666667 74.666667h411.733333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z m132.266667-550.4v17.066667H554.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V160h19.2l151.466667 153.6z" p-id="3490"></path><path d="M866.133333 669.866667l-106.666666-106.666667c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l51.2 51.2H512c-17.066667 0-32 14.933333-32 32S494.933333 725.333333 512 725.333333h253.866667l-51.2 51.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334l106.666667-106.666666c8.533333-10.666667 8.533333-32-2.133334-44.8z" p-id="3491"></path></svg>';
        var saveSvg = '<svg t="1662536828344" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2606"><path d="M906.666667 298.666667L725.333333 117.333333c-14.933333-14.933333-32-21.333333-53.333333-21.333333H170.666667C130.133333 96 96 130.133333 96 170.666667v682.666666c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667V349.866667c0-19.2-8.533333-38.4-21.333333-51.2zM652.8 864H371.2V648.533333h281.6v215.466667z m211.2-10.666667c0 6.4-4.266667 10.666667-10.666667 10.666667h-140.8V618.666667c0-17.066667-12.8-29.866667-29.866666-29.866667H341.333333c-17.066667 0-29.866667 12.8-29.866666 29.866667v245.333333H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h140.8V320c0 17.066667 12.8 29.866667 29.866666 29.866667h277.333334c17.066667 0 29.866667-12.8 29.866666-29.866667s-12.8-29.866667-29.866666-29.866667H371.2V160h302.933333c2.133333 0 6.4 2.133333 8.533334 2.133333l179.2 179.2c2.133333 2.133333 2.133333 4.266667 2.133333 8.533334V853.333333z" p-id="2607"></path></svg>';
        var clearAllSvg = '<svg t="1662608639253" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1287"><path d="M672 256c16.953 0 32.987 6.696 45.145 18.855C729.304 287.013 736 303.047 736 320v512c0 16.953-6.696 32.987-18.855 45.145S688.953 896 672 896H224c-16.954 0-32.986-6.696-45.145-18.855S160 848.953 160 832V320c0-16.953 6.696-32.987 18.855-45.145C191.014 262.696 207.046 256 224 256h448m0-64H224c-70.4 0-128 57.6-128 128v512c0 70.4 57.6 128 128 128h448c70.4 0 128-57.6 128-128V320c0-70.4-57.6-128-128-128z" p-id="1288"></path><path d="M800 64H352v64h448c35.2 0 64 28.8 64 64v576h64V192c0-70.4-57.6-128-128-128z" p-id="1289"></path><path d="M598.765 425.236c-12.445-12.445-32.81-12.445-45.255 0L448 530.745l-105.51-105.51c-12.445-12.445-32.81-12.445-45.255 0s-12.445 32.81 0 45.255L402.745 576l-105.51 105.51c-12.445 12.445-12.445 32.81 0 45.255s32.81 12.445 45.255 0L448 621.255l105.51 105.51c12.445 12.445 32.81 12.445 45.255 0s12.445-32.81 0-45.255L493.255 576l105.51-105.51c12.445-12.445 12.445-32.809 0-45.254z" p-id="1290"></path></svg>';
        var shrinkSvg = '<svg t="1662608958322" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2606"><path d="M313.6 358.4H177.066667c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333333c4.266667 0 8.533333 0 10.666667-2.133333 8.533333-4.266667 14.933333-8.533333 17.066666-17.066667 2.133333-4.266667 2.133333-8.533333 2.133334-10.666667v-213.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v136.533333L172.8 125.866667c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l185.6 187.733333zM695.466667 650.666667H832c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H618.666667c-4.266667 0-8.533333 0-10.666667 2.133333-8.533333 4.266667-14.933333 8.533333-17.066667 17.066667-2.133333 4.266667-2.133333 8.533333-2.133333 10.666666v213.333334c0 17.066667 14.933333 32 32 32s32-14.933333 32-32v-136.533334l200.533333 200.533334c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-204.8-198.4zM435.2 605.866667c-4.266667-8.533333-8.533333-14.933333-17.066667-17.066667-4.266667-2.133333-8.533333-2.133333-10.666666-2.133333H192c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533333L128 851.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l200.533334-200.533333V832c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V618.666667c-2.133333-4.266667-2.133333-8.533333-4.266667-12.8zM603.733333 403.2c4.266667 8.533333 8.533333 14.933333 17.066667 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333L896 170.666667c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-187.733333 187.733333V177.066667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c2.133333 4.266667 2.133333 8.533333 4.266666 12.8z" p-id="2607"></path></svg>';
        var expandSvg = '<svg t="1662609025513" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2745"><path d="M149.333333 394.666667c17.066667 0 32-14.933333 32-32v-136.533334l187.733334 187.733334c6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333c12.8-12.8 12.8-32 0-44.8l-187.733333-187.733334H362.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H149.333333c-4.266667 0-8.533333 0-10.666666 2.133334-8.533333 4.266667-14.933333 10.666667-19.2 17.066666-2.133333 4.266667-2.133333 8.533333-2.133334 12.8v213.333334c0 17.066667 14.933333 32 32 32zM874.666667 629.333333c-17.066667 0-32 14.933333-32 32v136.533334L642.133333 597.333333c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l200.533334 200.533334H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h213.333334c4.266667 0 8.533333 0 10.666666-2.133334 8.533333-4.266667 14.933333-8.533333 17.066667-17.066666 2.133333-4.266667 2.133333-8.533333 2.133333-10.666667V661.333333c2.133333-17.066667-12.8-32-29.866666-32zM381.866667 595.2l-200.533334 200.533333V661.333333c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333334c0 4.266667 0 8.533333 2.133334 10.666666 4.266667 8.533333 8.533333 14.933333 17.066666 17.066667 4.266667 2.133333 8.533333 2.133333 10.666667 2.133333h213.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32h-136.533333l200.533333-200.533333c12.8-12.8 12.8-32 0-44.8s-29.866667-10.666667-42.666666 0zM904.533333 138.666667c0-2.133333 0-2.133333 0 0-4.266667-8.533333-10.666667-14.933333-17.066666-17.066667-4.266667-2.133333-8.533333-2.133333-10.666667-2.133333H661.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h136.533334l-187.733334 187.733333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l187.733333-187.733333V362.666667c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c-2.133333-4.266667-2.133333-8.533333-4.266667-10.666666z" p-id="2746"></path></svg>';
        //        var focusSvg = '<svg t="1663115910122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5491"><path d="M341.333333 853.333333H213.333333a42.666667 42.666667 0 0 1-42.666666-42.666666v-128a42.666667 42.666667 0 0 0-85.333334 0v128a128 128 0 0 0 128 128h128a42.666667 42.666667 0 0 0 0-85.333334zM128 384a42.666667 42.666667 0 0 0 42.666667-42.666667V213.333333a42.666667 42.666667 0 0 1 42.666666-42.666666h128a42.666667 42.666667 0 0 0 0-85.333334H213.333333a128 128 0 0 0-128 128v128a42.666667 42.666667 0 0 0 42.666667 42.666667z m682.666667-298.666667h-128a42.666667 42.666667 0 0 0 0 85.333334h128a42.666667 42.666667 0 0 1 42.666666 42.666666v128a42.666667 42.666667 0 0 0 85.333334 0V213.333333a128 128 0 0 0-128-128z m-128 426.666667a42.666667 42.666667 0 0 0-42.666667-42.666667h-85.333333V384a42.666667 42.666667 0 0 0-85.333334 0v85.333333H384a42.666667 42.666667 0 0 0 0 85.333334h85.333333v85.333333a42.666667 42.666667 0 0 0 85.333334 0v-85.333333h85.333333a42.666667 42.666667 0 0 0 42.666667-42.666667z m213.333333 128a42.666667 42.666667 0 0 0-42.666667 42.666667v128a42.666667 42.666667 0 0 1-42.666666 42.666666h-128a42.666667 42.666667 0 0 0 0 85.333334h128a128 128 0 0 0 128-128v-128a42.666667 42.666667 0 0 0-42.666667-42.666667z" p-id="5492"></path></svg>';
        var focusSvg = '<svg t="1663116786849" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10799"><path d="M512 394.666667a117.333333 117.333333 0 1 0 0 234.666666 117.333333 117.333333 0 0 0 0-234.666666zM330.666667 512a181.333333 181.333333 0 1 1 362.666666 0 181.333333 181.333333 0 0 1-362.666666 0z" fill="#000000" p-id="10801"></path><path d="M437.333333 96H256A160 160 0 0 0 96 256v160h64V256A96 96 0 0 1 256 160h181.333333v-64zM608 160v-64H768a160 160 0 0 1 160 160v170.666667h-64v-170.666667A96 96 0 0 0 768 160h-160zM864 597.333333v170.666667a96 96 0 0 1-96 96h-170.666667v64h170.666667a160 160 0 0 0 160-160v-170.666667h-64zM426.666667 928v-64h-170.666667A96 96 0 0 1 160 768v-181.333333h-64V768a160 160 0 0 0 160 160h170.666667z" p-id="10802"></path></svg>'
        html += `
<div id="container">
    <div id="toggleBar">
        <span id="toggle">︿</span>
        <span id="iframesWarpper">
        </span>
        <span id="downloadNumbers" title="章节/下载/无内容数量/错误/下页超标"></span>
    </div>
    <div id="settingWarpper">
        <div id="SiteSettingButtons">
        <button id="saveSiteSetting" disabled title="保存当前网站配置信息">${saveSvg}</button>
        <button id="resize"></button>
        <button id="importSiteSetting" title="导入多个网站配置信息">${importSvg}</button>
        <button id="exportSiteSetting" title="导出现有全部网站配置信息">${exportSvg}</button>
        <button id="clearAllSiteSetting" title="删除现有全部网站配置信息">${clearAllSvg}</button>
        <button id="focus" title="用鼠标点击手动获取目录列表">${focusSvg}</button>
        </div>
        <textarea id="setting" placeholder="网站配置项，JSON格式"></textarea>
    </div>
    <div id="commandBar">
        <button id="getList" class="capsule main" title="获取当前页包含的目录列表">获取目录</button>
        <button id="getRestList" class="capsule main" title="根据目录页面的下一页链接，连续获取接下去的剩余目录列表">剩余目录</button>
        <button id="clearList" class="capsule main" title="全部删除已经提取的目录列表">清空目录</button>
        <button id="getAllText" class="capsule main" title="根据目录顺序下载全文并保存文本">下载全文</button>
    </div>
    <div class="titleList">
        <table><thead><tr>
            <th>序号</th>
            <th class="title">标题
            <select id="sort">
            <option>原始升序</option>
            <option>原始降序</option>
            <option>章节号升序</option>
            <option>章节号降序</option>
            <option>网址升序</option>
            <option>网址降序</option>
            </select></th>
            <th><button id="DeleteNoText" class="capsule">删空正文</button></th>
        </tr></thead><tbody></tbody></table>
    </div>
</div>
<input type="file" id="inputFiles" accept=".txt" style="display:none">`;
        root.innerHTML = html;
        document.documentElement.appendChild(div)
        //document.body.appendChild(div);
        reader = (typeof Reader == 'function') ? new Reader(document, "ReaderAttached") : null;

        root.querySelector("#sort").addEventListener("change", (e) => {
            sortList(e.target.value);
        });
        enableCodeMirrow();

        setting = GM_getValue(location.host);
        if (!setting) setting = {};
        displaySetting();
        var eGetList = root.querySelector("#getList");
        eGetList.onclick = () => {
            getList(document);
        };
        eGetList.click();
        root.querySelector("#getRestList").addEventListener("click", () => {
            getRestList(document);
        });
        //        setSaveSiteSettingClass();

        var resize = root.querySelector("#resize");
        resize.addEventListener("click", (e) => {
            var ele = resize;
            if (ele.title == '放大') {
                ele.title = '缩小';
                ele.innerHTML = shrinkSvg;
                cm.setSize(CodeMirrorSize[0] * 2, CodeMirrorSize[1] * 2);
            } else {
                ele.title = '放大';
                ele.innerHTML = expandSvg;
                cm.setSize(CodeMirrorSize[0], CodeMirrorSize[1]);
            }
        });
        resize.click();

        var inputFiles = root.querySelector("#inputFiles");
        inputFiles.addEventListener("change", (e) => {
            var file = e.target.files[0];
            if (!file) return;
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (e) {
                var siteSettings = JSON.parse(this.result);
                addSiteSettings(siteSettings);
            }
        });
        root.querySelector("#focus").addEventListener("click", (e) => {
            getClickedElementSelector();
        });
        root.querySelector("#importSiteSetting").addEventListener("click", (e) => {
            inputFiles.click();
        });

        root.querySelector("#exportSiteSetting").addEventListener("click", (e) => {
            var names = GM_listValues();
            var siteSettings = {};
            for (var name of names) {
                if (name == 'ReaderStyle') continue;
                siteSettings[name] = GM_getValue(name);
            }
            var str = JSON.stringify(siteSettings, null, 2);
            var blob = new Blob([str], { type: "text/plain;charset=utf-8", endings: "native" });
            downloadFile(blob, "AllSiteSetting.txt")
        });
        root.querySelector("#clearAllSiteSetting").addEventListener("click", (e) => {
            var names = GM_listValues();
            for (var name of names) {
                if (name == 'ReaderStyle') continue;
                GM_deleteValue(name);
            }
            alert("已删除现有全部网站配置信息");
        });
        root.querySelector("#saveSiteSetting").addEventListener("click", (e) => {
            saveSiteSetting();
        });
        var container = root.querySelector("#container")
        container.style.height = '100vh';
        root.querySelector("#toggle").addEventListener("click", (e) => {
            if (e.target.textContent == '﹀') {
                e.target.textContent = '︿';
                var next=e.target.parentElement.nextElementSibling;
                while(next){
                    next.style.display = '';
                    next=next.nextElementSibling;
                }
                container.style.height = '100vh';
            } else {
                e.target.textContent = '﹀';
                next=e.target.parentElement.nextElementSibling;
                while(next){
                    next.style.display = 'none';
                    next=next.nextElementSibling;
                }
                container.style.height = '';
            }
        });
        root.querySelector("#DeleteNoText").onclick = () => {
            for (let i = chapters.length - 1; i >= 0; i--) {
                if (!chapters[i].text) {
                    chapters.splice(i, 1);
                }
            }
            chaptersIndex = null;
            sortList(root.querySelector("#sort").value);
        };
        root.querySelector("#clearList").onclick = () => {
            root.querySelector("table tbody").innerHTML = "";
            chapters = [];
            chaptersIndex = [];
        };
        root.querySelector("#getAllText").onclick = () => {
            setting = getSetting();
            if (typeof setting == 'object') getAllText();
        };
    }
    GM_registerMenuCommand("开始", addDiv);
})(); //addDiv