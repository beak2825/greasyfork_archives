// ==UserScript==
// @name         刺猬猫小说下载
// @namespace    http://tampermonkey.net/
// @version      1.55
// @description  刺猬猫小说下载，全本下载，单章下载，暂不支持付费章节
// @author       backrock12
// @match        *://www.ciweimao.com/chapter-list/*
// @match        *://www.ciweimao.com/chapter/*
// @match        *://www.ciweimao.com/book/*
// @require      https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@1.3.8/FileSaver.min.js
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/386614/%E5%88%BA%E7%8C%AC%E7%8C%AB%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/386614/%E5%88%BA%E7%8C%AC%E7%8C%AB%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var DivInited = false, IsCancel = false;
    var WCContent, WCWords, WCQuit, WCSave, WCContinue;
    var title, info;
    var downlist = [];
    var infolist = [];
    var lhref;
    var vol = 1;
    var num = 0;
    var isimg = false;
    var isvip = false;

    function initDiv() {
        console.log("initDiv");
        if (DivInited) return;
        DivInited = true;
        var content = document.createElement("div");
        document.body.appendChild(content);
        content.outerHTML = `
      <div id="CWDownContent" style='display:none' >
        <div style="width:360px;height:100px;position:fixed;left:50%;top:50%;margin-top:-50px;margin-left:-180px;z-index:100000;background-color:#ffffff;border:1px solid #afb3b6;opacity:0.95;filter:alpha(opacity=95);box-shadow:5px 5px 20px 0px#000;">
          <div id="CWDownWords" style="font-size:12px;position:absolute;width:290px;height:90px;padding: 8px;border-radius: 10px;float: left;">
          </div>
          <div style="float: right;">
            <div id="CWDownSave" style="width:43px;height:26px;cursor: pointer;background-color:#3169da;margin: 5px 5px 3px 3px;">
              <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size:14px;">保存</span>
            </div>
            <div id="CWDownQuit" style="width:43px;height:26px;cursor: pointer;background-color:#3169da;margin: 3px;">
              <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size:14px;">取消</span>
            </div>
            <div id="CWCContinue" style="width:43px;height:26px;cursor: pointer;background-color:#3169da;margin: 3px;">
            <span style="line-height:25px;display:block;color:#FFF;text-align:center;font-size:14px;">繼續</span>
          </div>
          </div>
        </div>
      </div>
      `;

        WCContent = document.querySelector("#CWDownContent");
        WCWords = document.querySelector("#CWDownWords");
        WCQuit = document.querySelector("#CWDownQuit");
        WCSave = document.querySelector("#CWDownSave");
        WCContinue = document.querySelector("#CWCContinue");

        WCQuit.onclick = function () {
            IsCancel = true;
            DivInited = false;
            WCContent.style.display = "none";
            WCWords.innerHTML = '';
            WCContent.parentNode.removeChild(WCContent);
        };
        WCContinue.onclick = function () {
            if (downlist.length == 0) {
                Analysis();
            }
            else {
                continueDown();
            }
        };
        WCSave.onclick = function () {
            SaveText();
        };
    }

    function ShowWords(value) {
        WCWords.innerHTML = (title ? title + '<br>' : '') + value;
    }


    class Book {
        constructor(name, url, text, title_mk, lock, complete, status, iframeId) {
            this.name = name;
            this.url = url;
            this.text = text;
            this.title_mk = title_mk;
            this.lock = lock;
            this.complete = complete || false;
            this.status = status || 'Null';
            this.iframeId = iframeId
            this.num = num++
        }

        setstatus(status, text) {
            this.complete = true;
            this.status = status;
            if (text)
                this.text = text;
        }
        setiframeId(iframeId) {
            this.complete = false;
            this.status = 'Down';
            this.iframeId = iframeId;
        }
        setnull() {
            this.complete = false;
            this.status = 'Null';
            this.iframeId = '';
        }
        isDown() {
            return this.status == 'Down';
        }
        isEnd() {
            // return this.title_mk == false && this.complete && (this.iframeId || this.iframeId != '');
            return this.title_mk == false && this.complete;
        }
        isCan() {
            // return this.title_mk == false && this.complete == false && (!this.iframeId || this.iframeId == '');
            return this.title_mk == false && this.complete == false;
        }

    }

    function* cratebookmap(items) {
        for (let i of items) {
            if (i.isCan()) {
                yield i;
            }
        }
    }

    async function loopDown() {
        console.log('loopDown');
        let bookobj = cratebookmap(downlist);
        let result = bookobj.next();
        while (!result.done && !IsCancel) {
            if (bookobj)
                ShowWords(`共 ${downlist.length} 章节<br>已下载完成 ${result.value.num - 1} 章节，剩余 ${downlist.length - result.value.num} 章节<br>正在下载 ${result.value.num}`);
            
            if (!isvip && result.value.lock) {
                result.value.setstatus('OK', '\r\n' + result.value.name + '\r\n' + '付费章节暂时无法下载');
                console.log(result.value.num + '   vip not download');
            } else {
                await IframeInit(result.value);
                IframeClear(result.value);
            }
            result = bookobj.next();
        }
        if (result.done) {
            SaveText();
            //getdesc(SaveText)
        }
    }

    function continueDown() {
        console.log('continueDown');
        IsCancel = true;
        downlist.forEach((item) => {
            if (item.isDown()) {
                IframeClear(item);
                item.setnull();
            }
        });
        IsCancel = false;
        loopDown();
    }

    function IframeClear(bookobj) {
        console.log('IframeClear' + bookobj.iframeId);
        var ele = document.getElementById(bookobj.iframeId);

        try {
            ele.src = 'about:blank';
            ele.onload = null;
            ele.contentWindow.document.write('');
            ele.contentWindow.document.clear();
            ele.contentWindow.close();
            ele.parentNode.removeChild(ele);
            ele = null;
        } catch (e) {
            console.log('IframeClear' + e.message);
        }
        bookobj.iframeId = '';
    }

    async function IframeInit(bookobj) {

        return new Promise((resolve, reject) => {
            var iframeId = 'iframe_' + vol + '_' + bookobj.num;
            console.log('IframeInit' + iframeId);

            var ele1 = document.createElement('iframe');
            ele1.src = bookobj.url + '#Autodown';
            ele1.name = iframeId;
            ele1.id = iframeId;
            ele1.width = "195px";
            ele1.height = "126px";
            ele1.style.display = 'none';

            ele1.onload = function () {
                var frame = this;//document.getElementById(iframeId);
                if (frame) {
                    resolve(downtext(frame.contentDocument, bookobj));
                }
            }
            document.body.appendChild(ele1);
            bookobj.setiframeId(iframeId);

        });
    }


    async function getRequest() {
        let id = /www\.ciweimao\.com\/chapter-list\/(\d{5,})/.exec(location.href);
        if (!id) {
            throw "id is null";
        }
        let url = 'https://www.ciweimao.com/book/' + id[1]
        console.log(url);
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 3000,
                onerror: function (result) {
                    console.log('onerror');
                    console.log(result);
                },
                onload: function (result) {
                    resolve(result.response);
                }
            });
        });
    }



    function getdesc(fun) {
        try {
            console.log("getdesc");

            let id = /www\.ciweimao\.com\/chapter-list\/(\d{5,})\/book_detail/.exec(lhref);
            let url = 'https://www.ciweimao.com/book/' + id[1]
            console.log(url);
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 3000,
                onerror: function (result) {
                    console.log('onerror');
                    console.log(result);
                },
                onload: function (result) {
                    var str = result.response;
                    var doc = document.implementation.createHTMLDocument('');
                    doc.documentElement.innerHTML = str;
                    let desc = doc.querySelector(".book-desc").innerText;
                    let grade = doc.querySelector(".book-grade").innerText;
                    let update = doc.querySelector(".update-time").innerText;
                    let author = doc.querySelector("div.book-info h3.title span").innerText;
                    let title = doc.querySelector("div.book-info h3.title").innerText;
                    title = title.replace(author, '');

                    infolist.push(title);
                    infolist.push(author);
                    infolist.push(grade);
                    infolist.push(update);
                    infolist.push(desc.trim());
                    console.log(infolist);
                    fun();
                    return true;
                }
            });
        }
        catch (e) {
            return false;
        }
    }



    async function getdescasync() {
        try {
            console.log("getdesc");

            var str = await getRequest();
            var doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = str;
            let desc = doc.querySelector(".book-desc").innerText;
            let grade = doc.querySelector(".book-grade").innerText;
            let update = doc.querySelector(".update-time").innerText;
            let author = doc.querySelector("div.book-info h3.title span").innerText;
            let title = doc.querySelector("div.book-info h3.title").innerText;
            title = title.replace(author, '');

            infolist.push(title);
            infolist.push(author);
            infolist.push(grade);
            infolist.push(update);
            infolist.push(desc.trim());
            console.log(infolist);
            return true;
        }
        catch (e) {
            return false;
        }
    }


    function Analysis() {
        console.log("Analysis");
        IsCancel = false;
        title = '';
        info = '';
        downlist = [];
        infolist = [];

        initDiv();
        if (WCContent) {
            WCContent.style.display = "block";
            ShowWords(`分析网页中`);
        }

        if (!getdescasync()) {
            ShowWords(`获取文章信息失败`);
            return;
        }

        title = document.querySelector(".hd h3").innerText;

        for (const i of document.querySelectorAll(".hd p")) {
            info += "\r\n" + i.innerText;
        }
        console.log(title);

        for (const c of document.querySelectorAll(".book-chapter .book-chapter-box")) {
            var ctitle = c.querySelector('.sub-tit').innerText;
            downlist.push(
                new Book(ctitle, '', ctitle, true, false, true, 'OK')
            );
            for (const a of c.querySelectorAll('.book-chapter-list li a')) {
                if (a.querySelector('.icon-lock,.icon-unlock'))
                    var lock = true
                else
                    lock = false;
                downlist.push(
                    new Book(a.innerText, a.href, '', false, lock)
                );
            };
        };

        console.log(downlist);

        if (downlist.length == 0) {
            ShowWords(`分析网页失败`);
            return;
        }
        loopDown();
    }


    function SaveText() {
        var texts = [];
        WCContent.style.display = "block";
        if (downlist.length > 0 && infolist.length == 0)
            getdesc();

        var ok = 0, error = 0;
        downlist.forEach(function (c) {
            if (c.isEnd())
                ok++
            else if (c.title_mk && c.complete)
                error++;
            texts.push(c.text);
        });
        ShowWords(`已下载完成<br>共 ${downlist.length} 章节<br>成功 ${ok} 章节，失败 ${error} 章节 `);


        var blob = new Blob([infolist.join("\r\n\r\n"), "\r\n\r\n", texts.join("\r\n")], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${title}.txt`);
    }

    function getElementRootText(element) {
        let ret = "";
        for (const i of element.childNodes) {
            if (i.nodeType === i.TEXT_NODE) {
                ret += i.nodeValue;
            }
        }
        return ret.replace(/^\s+|\s+$/g, "");
    }

    function image2line(img) {

        var dataURL = GM_xmlhttpRequest({
            method: 'GET',
            url: img.src,
            responseType: "blob",
            onload: function (result) {
                var reader = new window.FileReader();
                reader.readAsDataURL(result.response);
                reader.onloadend = function () {
                    return reader.result;
                }
            }
        });

        return `![${img.alt}](${dataURL} "${img.title}")`;

        return;
        img.crossOrigin = 'Anonymous'
        html2canvas(img, {
            allowTaint: true,
            logging: false,
            useCORS: true,
        }
        ).then(function (canvas) {
            var dataUrl = canvas.toDataURL();
            console.log(dataUrl);
            console.log(canvas);

            var im = document.createElement("img");
            im.src = dataUrl;

            document.body.append(canvas);

        });


        return;
        img.crossOrigin = "Anonymous";
        var canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        console.log('img4');
        var dataURL = canvas.toDataURL("image/" + ext);
        console.log('img5');
        console.log(dataURL);

        return `![${img.alt}](${dataURL} "${img.title}")`;
    }

    async function getimagedata(img) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: img.src,
                responseType: "blob",
                onload: function (result) {
                    var reader = new window.FileReader();
                    reader.readAsDataURL(result.response);
                    reader.onloadend = function () {
                        resolve(`![${img.alt}](${reader.result} "${img.title}")`);
                    }
                }
            });
        });
    }


    async function image2lineasync(img) {
        return new Promise((resolve, reject) => {
            resolve(image2line(img));
        });
    }

    async function imageUrl2line(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(image2line(img));
            };
            img.src = url;
            console.log(url);
        });
    }

    async function downtext(str, bookobj) {

        console.log('downtext');

        if (bookobj && bookobj.lock) {
            bookobj.setstatus('OK', '\r\n' + bookobj.name + '\r\n' + '付费章节暂时无法下载');
            return;
        }


        try {

            var doc = str;
            let time, num;
            let lines = [];

            let title = doc.querySelector("#J_BookCnt h3.chapter").firstChild.textContent;

            for (const i of doc.querySelectorAll("#J_BookCnt p span")) {
                if (i.textContent.indexOf("更新时间")) {
                    time = i.textContent;
                } else if (i.textContent.indexOf("字数")) {
                    num = i.textContent;
                }
            }

            lines.push('\r\n\r\n');
            lines.push(`# ${title}`);
            lines.push(`  ${time}`);
            lines.push(`  ${num}\r\n`);

            if ((bookobj && bookobj.lock) || doc.querySelectorAll("#J_BookImage").length > 0) {
                lines.push(`付费章节暂时无法下载`);
            } else {
                // 收费章节
                if (isvip)
                    for (const i of doc.querySelectorAll("#J_BookImage")) {
                        const url = i.style["background-image"].match(/(?:url\(")?(.+)(?:"\))?/)[1];
                        const line = await imageUrl2line(url);
                        lines.push(line);
                    }

                // 免费章节
                for (const i of doc.querySelectorAll("#J_BookRead p:not(.author_say)")) {
                    let line = getElementRootText(i);
                    lines.push(line);
                    if (isimg)
                        for (const img of i.querySelectorAll("img")) {
                            const line = await getimagedata(img);
                            lines.push(line);
                        }
                }

                // 作者说
                for (const i of doc.querySelectorAll("p.author_say")) {
                    let line = getElementRootText(i);
                    lines.push(`    ${line}`);
                    if (isimg)
                        for (const img of i.querySelectorAll("img")) {
                            const line = await getimagedata(img);
                            lines.push(line);
                        }
                }

                var blob = new Blob([lines.join("\r\n")], { type: "text/plain;charset=utf-8" });

                if (bookobj) {
                    bookobj.setstatus('OK', lines.join("\r\n"));
                } else {
                    IsCancel = false;
                    saveAs(blob, title + ".txt");
                }
                return true;
            }
        }
        catch (e) {
            if (bookobj) {
                bookobj.setstatus('ERROR ', bookobj.name + " 下载错误!");
                ShowWords(bookobj.text);
            }
            console.log('downtext ERROR ' + e.message);
            return false;
        }
    }





    function Inited() {
        if (location.hash && location.hash == '#Autodown') {
            console.log('Autodown');
        } else {
            if (location.hash && location.hash == '#Autoclick') {
                var autoclick = true;
            }

            console.log('Inited');
            let reg = new RegExp('www.ciweimao.com/book/*');
            if (reg.test(location.href)) {
                var b = document.querySelector(".btn-group");
                if (b) {
                    let id = location.href.substr(location.href.lastIndexOf('/') + 1);
                    let e = document.createElement('a');
                    e.id = 'BDownBtn';
                    e.textContent = '全本下载';
                    e.className = 'btn btn-lg btn-danger'
                    e.target = '_blank'
                    e.href = `https://www.ciweimao.com/chapter-list/${id}/book_detail#Autoclick`;
                    b.append(e);
                }
            }

            let t = document.querySelector(".hd");
            if (t) {
                let e = document.createElement('button');
                e.id = 'TDownBtn';
                e.textContent = '全本下载';
                e.className = 'btn btn-md btn-default'
                e.onclick = Analysis;
                t.append(e);
                if (autoclick)
                    Analysis();
            }

            let ct = document.querySelector(".read-hd");
            if (ct) {
                let ce = document.createElement('button');
                ce.id = 'CDownBtn';
                ce.textContent = '单章下载';
                ce.className = 'btn btn-md btn-default'
                ce.onclick = function () { downtext(document); };
                ct.append(ce);
            }
        }
    }
    Inited();
    //Analysis();

})();