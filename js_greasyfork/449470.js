// ==UserScript==
// @name         Localed Books Downloader
// @name:zh-CN   本地 藏书网 下载器
// @namespace    http://tampermonkey.net/ // todo
// @version      0.1
// @description  批量下载文章以txt保存
// @author       Lawsssscat
// @match        https://*.99csw.com/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        window.Blob
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449470/Localed%20Books%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/449470/Localed%20Books%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const waitTime = 300; // ms

    const container = document.createElement('div');
    document.body.appendChild(container);
    const shadow = container.attachShadow({ mode: 'closed' })

    const template = `
<div class='inner'>
    <div class='toggle'>&gt;</div>
    <div class='content'>
      <h2>批量下载文字</h2>
      <p>
      例如：<br>
      https://www.99csw.com/book/2501/75399.htm<br>
      bookId=2501<br>
      pageId=75399<br>
      nextPageId=75400<br>
      </p>
      <table>
<tr>
  <td><label for='bookId'>bookId:</label></td>
  <td><input id='bookId' /></td>
</tr>
<tr>
  <td><label for='fromPageId'>pageId(from):</label></td>
  <td><input id='fromPageId' /></td>
</tr>
<tr>
  <td><label for='toPageId'>pageId(to):</label></td>
  <td><input id='toPageId' /></td>
</tr>
      </table>

      <input id='download' type='button' value='下载为txt'>
      <input id='clipboard' type='button' value='复制至粘贴板'>
    </div>
</div>
<div id='downloadProgress'>
  进度：<span id='downloadProgress_now'>0</span>/<span id='downloadProgress_all'>0</span>
</div>
<iframe id='loadContentIframe'></iframe>
    <style>
    #downloadProgress {
      color: #31b928;
    }
      #localed-books-downloader {
position: fixed;
    z-index: 99;
top: 30vh;
right: 0;
background: white;
    border: 1px solid;
    transition: transform .3s;
      }
      #localed-books-downloader.hide {
          transform: translateX(100%);
      }
      #localed-books-downloader .inner {
position: relative;
      }
      #localed-books-downloader .inner .toggle{
position: absolute;
    left: 0;
    transform: translateX(-100%);
    cursor: pointer;
    padding: 3px;
    border: 1px solid;
    background: #fff;
      }
      #localed-books-downloader .inner .toggle:hover{
background: #333;
color: #fff;
      }
    </style>
    `;
    const shadowHost = document.body;
    const inner = document.createElement('div');
    inner.id='localed-books-downloader';
    inner.innerHTML = template;
    shadow.appendChild(inner);
    console.log('books downloader', shadow);
    Object.assign(inner, {
        iframe: inner.querySelector('#loadContentIframe'),
        bookId: inner.querySelector('#bookId'),
        fromPageId:inner.querySelector('#fromPageId'),
        toPageId: inner.querySelector('#toPageId'),
        download: inner.querySelector('#download'),
        clipboard: inner.querySelector('#clipboard'),
        // 进度
        progressNow: inner.querySelector('#downloadProgress_now'),
        progressAll: inner.querySelector('#downloadProgress_all'),
    });
    // init value
    (function() {
        const pathname = window.location.pathname;
        if(/^\/book\//.test(pathname)) {
            const snippetList = pathname.split(/\.|\//g).filter((v) => v);
            // bookId
            const bookId = parseInt(snippetList[1]);
            if(Number.isInteger(bookId)) {
                inner.bookId.value = bookId;
            }
            // pageId
            const pageId = parseInt(snippetList[2]);
            if(Number.isInteger(pageId)) {
                inner.fromPageId.value = pageId;
                inner.toPageId.value = pageId;
            }
        }
    })();
    // action hide
    inner.querySelector('.toggle').addEventListener('click', () => {
        const className = 'hide';
        const classList = inner.classList;
        if(classList.contains(className)) {
            classList.remove(className);
        } else {
            classList.add(className);
        }
    });
    // action download
    inner.download.addEventListener('click', () => {
        getPageContents().then(resultList => {
            console.log(resultList);
            const str = generateFormatePagesString(resultList);
            // blob
            // 乱码解决： https://juejin.cn/post/7024133497958694925
            const blob = new Blob(["\ufeff", str], {type: 'text/plain,charset=utf-8'});
            const link = document.createElement('a');
            link.target='_blank';
            link.href = window.URL.createObjectURL(blob);
            link.click();
            console.log('ok!', {str:str});
        });
    });
    // action clipboard
    inner.clipboard.addEventListener('click', () => {
        getPageContents().then(resultList => {
            console.log(resultList);
            const str = generateFormatePagesString(resultList);
            // clipboard
            GM_setClipboard(str, 'text');
            console.log('ok!', {str:str});
        });
    });

    function generateFormatePagesString(pageContents) {
        let str = '';
        pageContents.forEach((page, index) => {
            str += '\n';
            str += `// path="${page.path}"\n`;
            str += `title="${page.header.textContent}"\n`;
            str += '\n';
            page.paragraphs.forEach(paragraph => {
                const t_list = Array.from(paragraph.childNodes).filter(t=>{
                    if(t.nodeName == '#text') {
                        return true;
                    }
                    try {
                        if(t.offsetHeight>0){
                            return true;
                        }
                    } catch(err) {
                        console.log(err, paragraph);
                    }
                    return false;
                });
                t_list.forEach(t => {
                    str += `${t.textContent}`;
                });
                str += `\n`;
            });
        });
        return str;
    }

    // core
    function getPageContents() {
        const sleep = 30; // ms. avoid fusing
        const info = {
            bookId: parseInt(inner.bookId.value),
            fromPageId: parseInt(inner.fromPageId.value),
            toPageId: parseInt(inner.toPageId.value)
        };
        // rule
        if(!Number.isInteger(info.bookId)) {
            throw new Error('error:bookId', info);
        }
        if(!Number.isInteger(info.fromPageId)) {
            throw new Error('error:fromPageId', info);
        }
        if(!Number.isInteger(info.toPageId)) {
            info.toPageId = info.fromPageId;
        }
        if(info.fromPageId > info.toPageId) {
            throw new Error('error:fromPageId > toPageId', info);
        }
        console.log(info);

        // path
        const targetPathList = [];
        for(let i=info.fromPageId; i<=info.toPageId; i++) {
            const targetPath = `/book/${info.bookId}/${i}.htm`;
            targetPathList.push({
                load: false,
                path: targetPath
            });
        }
        inner.progressAll.innerHTML = targetPathList.length; // progress

        // result
        const targetResultList = [];
        return new Promise((res) => {
            let index=0;
            const intervalId = setInterval(() => {
                inner.progressNow.innerHTML = index; // progress
                if(index<targetPathList.length) {
                    const targetInfo = targetPathList[index];
                    const {path, load} = targetInfo;
                    if(!load) {
                        targetInfo.load = true;
                        const page = new Page(path);
                        page.getWindow().then((_window) => {
                            // scroll to bottom
                            return new Promise(_res => {
                                let scrollPreY , scrollY, h=_window.document.scrollingElement.scrollHeight;
                                const _intervalId = setInterval(() => {
                                    scrollPreY = _window.scrollY;
                                    _window.scrollTo(0, h);
                                    scrollY = _window.scrollY;
                                    if(scrollY==scrollPreY) {
                                        clearInterval(_intervalId);
                                        _res(_window);
                                    } else {
                                        h = h * 2;
                                    }
                                }, waitTime);
                            });
                        })
                        .then((_window) => {
                            // content
                            const content = _window.document.querySelector('#content');
                            const header = content.querySelector('h2');
                            const paragraphs = Array.from(content.querySelectorAll('div[class]')).filter(dom => {
                                return dom.offsetHeight;
                            });
                            targetResultList.push({
                                path: path,
                                header: header,
                                paragraphs: paragraphs
                            });
                            index++;
                        });
                    }
                } else {
                    clearInterval(intervalId);
                    res(targetResultList);
                }
            },sleep);
        });
    }

    class Page {
        constructor(path) {
            this.path = path;
        }
        getWindow() {
            return new Promise((res,rej) => {
                inner.iframe.src = this.path;
                inner.iframe.onload = () => {
                    res(inner.iframe.contentWindow);
                };
            });
        }
    }


})();