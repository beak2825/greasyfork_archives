// ==UserScript==
// @name         包子漫画
// @namespace    http://86821241.qzone.qq.com/
// @version      2025-05-28
// @description  包子漫画去广告，修改我的订阅，优化上次阅读!
// @author       q86821241
// @match        https://m.baozimh.one/*
// @match        https://m.bzmh.org/*
// @match        https://godamh.com/*
// @run-at       document-end
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/495766/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/495766/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const url = window.location.href;
    if(url.indexOf("baozimh.one") !== -1 || url.indexOf("bzmh.org") !== -1 || url.indexOf("godamh.com") !== -1) {
        let date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + date.toUTCString();
        document.cookie = "showAds=" + Math.floor(date.getTime() / 1000) + "; " + expires + "; path=/;";
        document.cookie = "visitCount=0; " + expires + "; path=/;";
        localStorage.setItem("showAds", Math.floor(date.getTime() / 1000));
        localStorage.setItem("visitCount", 0);
        // 添加样式
        var styleElement = document.createElement('style');
        styleElement.innerHTML = '.scrollbar-hide{scrollbar-width: auto!important;} #chapterNav.hidden {display:block!important;} #c-notification, #c-recommed, .bannersUite, .banners, .pb-14 {display:none!important;} #uptopButton{bottom: 5rem!important;}';
        document.head.appendChild(styleElement);
        // 隐藏 iframe 元素
        setInterval(function() {
            var iframes = document.querySelectorAll('iframe');
            for (var i = 0; i < iframes.length; i++) {
                iframes[i].style.display = 'none';
            }
        }, 500);
    }
    if(url.indexOf("/manga") !== -1 || url.indexOf("/chapterlist") !== -1) {
        function truncateString(str, maxLength = 36) {
            return str.length <= maxLength ? str : str.slice(0, maxLength) + '...';
        }
        async function favorite(e, o, t, r, n) {
            if (e === 'add' && typeof localStorage < 'u') {
                const i = JSON.parse(localStorage.getItem('myBookmark')) || [], c = i.findIndex(s => s.path === t);
                c !== - 1 && i.splice(c, 1);
                const l = {
                    id: o,
                    title: r,
                    time: new Date().toISOString(),
                    path: t,
                    cover: n
                };
                i.unshift(l);
                if (i.length > 200) {
                    i.pop();
                }
                localStorage.setItem('myBookmark', JSON.stringify(i));
                return !0
            }
            return e === 'remove' ? (setLocalStorage(o, 'myBookmark'), !0) : !1;
        }
        async function setLocalStorage(e, o) {
            if (typeof localStorage < 'u') {
                const n = (JSON.parse(localStorage.getItem(o)) || []) ?.filter(a => a.id !== Number(e));
                localStorage.setItem(o, JSON.stringify(n))
            }
        }
        function bookmarkButtonState(bookmarkbutton, bookmarkType) {
            const bookmarkcontent = document.getElementById('bookmarkcontent');
            if (bookmarkcontent) {
                if (bookmarkType) {
                    bookmarkbutton.classList.remove('unbookmark');
                    bookmarkbutton.classList.add('bookmarked');
                    bookmarkbutton.style.fontWeight = "bold";
                    bookmarkcontent.textContent = '已收藏';
                } else {
                    bookmarkbutton.classList.remove('bookmarked');
                    bookmarkbutton.classList.add('unbookmark');
                    bookmarkbutton.style.fontWeight = "bold";
                    bookmarkcontent.textContent = '未收藏'
                }
            }
        }
        let bookmarkType = 'add';
        const bookmarkData = document.getElementById('bookmarkData');
        if (bookmarkData) {
            const mid = Number(bookmarkData.dataset.mid),
                  path = bookmarkData.dataset.path,
                  lastv = bookmarkData.dataset.lastv,
                  cover = bookmarkData.dataset.cover,
                  bookmarkButton = document.getElementById('bookmarkButton');
            if (typeof localStorage !== "undefined") {
                const myBookmark = JSON.parse(localStorage.getItem('myBookmark')) || [];
                if (myBookmark.findIndex(item => item.path === path) !== - 1) {
                    bookmarkButtonState(bookmarkButton, true);
                    bookmarkType = 'remove';
                }
            }
            if (bookmarkButton) {
                bookmarkButton.id = 'bookmark_Button';
                bookmarkButton.style.fontWeight = "bold";
                bookmarkButton.addEventListener('click', async() => {
                    await favorite(bookmarkType, mid, path, lastv, cover);
                    bookmarkType === 'add' ? (bookmarkButtonState(bookmarkButton, true), bookmarkType = 'remove') : bookmarkType === 'remove' && (bookmarkButtonState(bookmarkButton, false), bookmarkType = 'add');
                });
            }
        }
        function updateChapterHistory(mangaId, chapterTitle, chapterId, path = '/go', curl = window.location.href, gourl = '') {
            if (typeof localStorage !== "undefined") {
                const history = JSON.parse(localStorage.getItem("Chapter_History")) || [];
                const index = history.findIndex(item => item.mangaId === mangaId);
                if (index !== -1) {
                    history.splice(index, 1);
                }
                const newEntry = {
                    mangaId: mangaId,
                    chaptertitle: chapterTitle,
                    path: path,
                    chapterId: chapterId,
                    curl: curl,
                    currentTime: new Date().toISOString()
                };
                const myBook = JSON.parse(localStorage.getItem("myBookmark")) || [];
                const myIndex = myBook.findIndex(item => item.id === mangaId);
                if (myIndex !== -1) {
                    history.unshift(newEntry);
                    if (history.length > 200) {
                        history.pop();
                    }
                }
                localStorage.setItem("Chapter_History", JSON.stringify(history));
                if (gourl) window.location.href = gourl;
            }
        }
        const intervalList = setInterval(function() {
            if (document.querySelector(".chapteritem") !== null) {
                clearInterval(intervalList);
                if (typeof localStorage !== "undefined") {
                    const history = JSON.parse(localStorage.getItem("Chapter_History")) || [];
                    // 上次阅读
                    const chapterHistory = document.querySelector("#ChapterHistory"), chapterHspan = document.querySelector("#chapterHspan");
                    if (chapterHistory && chapterHspan) {
                        const mangaId = chapterHistory.getAttribute('data-manga-id');
                        const historyItem = history?.find(item => item.mangaId === Number(mangaId));
                        if (historyItem && historyItem.path && historyItem.chaptertitle) chapterHspan.innerText = historyItem.chaptertitle;
                        const chapterAspan = document.getElementById('chapterAspan');
                        if (chapterAspan) {
                            const parentElement = chapterAspan.parentElement;
                            if (parentElement) {
                                parentElement.innerHTML = chapterAspan.outerHTML;
                                const chapterAspanNew = parentElement.querySelector("#chapterAspan");
                                if (chapterAspanNew && historyItem && historyItem.curl) {
                                    chapterAspanNew.href = historyItem.curl;
                                    chapterAspanNew.addEventListener('click', function (event) {
                                        window.location.href = historyItem.curl;
                                    });
                                }
                            }
                        }
                    }
                }
                // 开始阅读
                const firstchap = document.querySelector("#firstchap");
                if (firstchap) {
                    const parentElement = firstchap.parentElement;
                    let firstchapNew;
                    if (parentElement) {
                        parentElement.innerHTML = firstchap.outerHTML;
                        firstchapNew = parentElement.querySelector("#firstchap");
                    }
                    if (firstchapNew) {
                        firstchapNew.addEventListener('click', function (event) {
                            window.location.href = `${window.location.origin}${firstchap.dataset.mp}/${firstchap.dataset.cs}`;
                        });
                    }
                }
                document.querySelectorAll(".chapteritem a").forEach(function (element) {
                    delete element.dataset.ms;
                    element.addEventListener("click", function(event) {
                        event.stopPropagation();
                    });
                });
            }
        }, 100);
        const chapterContent = document.getElementById('chapterContent');
        if (chapterContent) {
            const ms = chapterContent.dataset.ms, cs = chapterContent.dataset.cs, ct = chapterContent.dataset.ct;
            if (ms && cs && ct) updateChapterHistory(Number(ms), ct, cs, window.location.pathname, window.location.href);
        }
        const intervalImg = setInterval(function() {
            if (document.querySelector("#chapcontent img") !== null) {
                clearInterval(intervalImg);
                const prevchaptera = document.getElementById('prevchaptera');
                if (prevchaptera && prevchaptera.href) {
                    prevchaptera.href = prevchaptera.href.replace(/https?:\/\/api-get.mgsearcher.com/, window.location.origin);
                }
                const nextchaptera = document.getElementById('nextchaptera');
                if (nextchaptera && nextchaptera.href) {
                    nextchaptera.href = nextchaptera.href.replace(/https?:\/\/api-get.mgsearcher.com/, window.location.origin);
                }
                const preChapterLink = document.getElementById('preChapterLink');
                if (preChapterLink && preChapterLink.href) {
                    preChapterLink.href = preChapterLink.href.replace(/https?:\/\/api-get.mgsearcher.com/, window.location.origin);
                }
                const nextChapterLink = document.getElementById('nextChapterLink');
                if (nextChapterLink && nextChapterLink.href) {
                    nextChapterLink.href = nextChapterLink.href.replace(/https?:\/\/api-get.mgsearcher.com/, window.location.origin);
                }
            }
        }, 100);
    }
    if(url.indexOf("/user/bookmark") !== -1) {
        var style1Element = document.createElement('style');
        style1Element.innerHTML = '@media (min-width: 768px) {.container { max-width: 1024px!important;} }#myBookmarkTem {pointer-events: none; grid-template-columns: repeat(4, minmax(0, 1fr))!important;}#myBookmarkTem p{font-size: 13px;}#myBookmarkTem a, #myBookmarkTem button{pointer-events:auto;}';
        document.head.appendChild(style1Element);
        function getTimeAgo(t) {
            let e = new Date(t);
            if (isNaN(e.getTime())) return '';
            const a = new Date().getTime(), o = e.getTime(),  c = a - o, l = Math.floor(c / 1000);
            return l < 60 ? '刚刚' : l < 3600 ? `${Math.floor(l / 60)}分钟前` : l < 86400 ? `${Math.floor(l / 3600)}小时前` : l < 604800 ? `${Math.floor(l / 86400)}天前` : new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                hour12: !1
            }).format(e);
        }
        let index = 0;
        function executeFetch(elements) {
            if (index >= elements.length) return;
            const element = elements[index], button = element.querySelector('button');
            if (!button) executeFetch(elements);
            const mangaId = button.dataset.id;
            fetch(`https://api-get.mgsearcher.com/api/manga/get?mid=${mangaId}`, {
                cache: 'no-cache'
            }).then(async response => {
                if (response.ok) {
                    return await response.json();
                } else {
                    index++;
                    executeFetch(elements);
                }
            }).then(json => {
                if (json.status) {
                    let length = json.data.chapters.length - 1;
                    let item = json.data.chapters[length].attributes;
                    let pa = document.createElement("p");
                    pa.classList.add("px-1", "truncate");
                    pa.innerHTML = `最新：<a href="/manga/${json.data.slug}/${item.slug}" target="blank">${item.title} ${getTimeAgo(item.updatedAt)}</a>`;
                    pa.setAttribute("title", `${item.title} ${getTimeAgo(item.updatedAt)}`);
                    element.appendChild(pa);
                    pa.querySelector("a").addEventListener('click', function (event) {
                        event.stopPropagation();
                    });
                }
                let historyItem;
                if (typeof localStorage !== "undefined") {
                    const history = JSON.parse(localStorage.getItem("Chapter_History")) || [];
                    historyItem = history?.find(item => item.mangaId === Number(mangaId));
                }
                let pb = document.createElement("p");
                pb.classList.add("px-1", "truncate");
                pb.innerHTML = `上次：${historyItem?.chaptertitle||'-'} ${getTimeAgo(historyItem?.currentTime)}`;
                pb.setAttribute("title", `${historyItem?.chaptertitle||'-'} ${getTimeAgo(historyItem?.currentTime)}`);
                element.appendChild(pb);
                index++;
                executeFetch(elements);
            }).catch(error => {
                console.error(error);
            });;
        }
        const intervalmyBook = setInterval(function() {
            const elements = document.querySelectorAll("#myBookmarkTem > div");
            if (elements.length > 0) {
                clearInterval(intervalmyBook);
                document.querySelector("#myBookmarkTem").addEventListener('click', function (event) {
                    event.stopPropagation();
                });
                executeFetch(elements);
                elements.forEach(function (element) {
                    element.querySelector("a").addEventListener('click', function (event) {
                        event.stopPropagation();
                    });
                });
            }
        }, 100);
    }
})();
