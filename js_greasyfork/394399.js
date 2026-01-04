// ==UserScript==
// @name         S1论坛帖子已读样式
// @namespace    https://bbs.saraba1st.com/2b/forum.php
// @version      1.10
// @description  刷s1的一些辅助小功能
// @author       You
// @match        https://bbs.saraba1st.com/2b/forum*
// @match        https://bbs.saraba1st.com/2b/thread*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/394399/S1%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%B7%B2%E8%AF%BB%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/394399/S1%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E5%B7%B2%E8%AF%BB%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

function get(data, key) {
    const keys = key.replace(/\[(\d+)\]/g, ".$1").split(".");
    let result = data;
    while (keys.length && result) {
        result = result[keys.shift()];
    }
    return result;
}

function forEach(arrLike, fn) {
    Array.prototype.forEach.call(arrLike, fn);
}

function isThread() {
    return location.pathname.includes("thread");
}

function isThreadList() {
    return location.pathname.includes("forum");
}

function asyncRun(callback, time = 100) {
    const done = () => {
        clearInterval(timer);
    }
    const timer = setInterval(() => {
        callback(done);
    }, time);
}

function updateThreadReplyNum(id, num) {
    localStorage.setItem(id, num);
}

function getThreadLastReplyNum(id) {
    const num = localStorage.getItem(id);
    return num ? +num : null;
}

function appendStyle() {
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(
        document.createTextNode(
            ".tl th a:visited, .tl td.fn a:visited {color: #818588}"
        )
    );
    style.appendChild(
        document.createTextNode(
            ".tl th a:hover, .tl td.fn a:hover {color: #022C80}"
        )
    );
    document.body.appendChild(style);
}

(function () {
    "use strict";
    // 修改帖子样式
    appendStyle();

    // 动态修改url
    const hasReplacedIds = new Set();
    let table = null;
    let lastThreadNum = 0;
    let observer = null;

    function observeThreads() {
        const threads = Array.from(
            document.querySelectorAll("#threadlisttableid tbody tr")
        ).filter((element) => !hasReplacedIds.has(element.parentNode.id));
        threads.forEach((t) => observer.observe(t));
    }

    function initObserver() {
        observer = new IntersectionObserver(
            (entities) => {
                entities.forEach((entity) => {
                    if (entity.isIntersecting) {
                        const thread = entity.target;
                        observer.unobserve(thread);

                        const id = thread.parentNode.id;
                        if (hasReplacedIds.has(id)) {
                            return;
                        }
                        hasReplacedIds.add(id);

                        // url
                        const replyNum = get(thread.querySelector('.num a'), 'textContent');
                        const title = thread.querySelector('.xst');
                        if (title && replyNum) {
                            title.href += `#${replyNum}`;
                        }

                        // reply num
                        const tid = get(id.match(/\d+/), "0");
                        const lastReplyNum = +getThreadLastReplyNum(tid);

                        if (lastReplyNum && replyNum && replyNum - lastReplyNum > 0) {
                            title.textContent = `+${replyNum - lastReplyNum} ${
                                title.textContent
                                }`;
                        }
                    }
                });
            }, {
                rootMargin: "100px",
            }
        );
    }

    function onThreadClick() {
        asyncRun((done) => {
            if (table) {
                table.addEventListener('mouseup', (e) => {
                    // 0 左键 1 中键 2 右键
                    if (![0, 1].includes(e.button)) {
                        return;
                    }

                    let element = e.target;
                    const validClick = (element.tagName === 'A' && element.href.includes('thread-')) ||
                        (element.tagName === 'IMG' && element.src === 'https://static.saraba1st.com/image/s1/folder_common.gif');
                    if (!validClick) {
                        return;
                    }
                    while (element.parentNode) {
                        if (element.tagName === 'TBODY') {
                            const replyNum = get(element.querySelector('.num a'), 'textContent');
                            const tid = get(element.id.match(/\d+/), "0");
                            if (replyNum && tid) {
                                updateThreadReplyNum(tid, replyNum);
                            }
                            break;
                        }
                        if (element === table) {
                            break;
                        }
                        element = element.parentNode;
                    }
                });
                done();
            }
        })
    }

    initObserver();
    onThreadClick();

    asyncRun((done) => {
        table = document.getElementById("threadlisttableid");
        // 实际发现只检测table并不能保证帖子全加载了
        const nextPageBtn = document.querySelector("#autopbn");
        if (table && nextPageBtn) {
            lastThreadNum = table.childElementCount;
            observeThreads();
            done()
        }
    });

    // 监控下一页
    asyncRun((done) => {
        const nextPageBtn = document.querySelector("#autopbn");
        if (nextPageBtn) {
            nextPageBtn.addEventListener("click", () => {
                const threads = document.querySelectorAll("#threadlisttableid tbody tr");
                const lastThread = threads[threads.length - 1];
                console.log(lastThread)
                asyncRun((done) => {
                    if (table.childElementCount > lastThreadNum) {
                        lastThread.style.backgroundColor = '#CCCC99';
                        lastThreadNum = table.childElementCount;
                        observeThreads();
                        done()
                    }
                });
            });
            done();
        }
    });

    if (isThread()) {
        // 帖子中跳转翻页变成当前页加载
        asyncRun((done) => {
            const LoadingText = ' 正在加载中...';
            const nextPageBtn = document.querySelector('.pgbtn a');
            const postlist = document.querySelector('#postlist');
            const paginationInputs = document.querySelectorAll('.pg input')

            if (nextPageBtn) {
                nextPageBtn.addEventListener('click', (event) => {
                    event.preventDefault();
                    nextPageBtn.innerHTML += LoadingText;
                    fetch(nextPageBtn.href)
                        .then(res => res.text())
                        .then(content => {
                            let nextPageHtml = document.createElement('div');
                            nextPageHtml.innerHTML = content;
                            const replies = nextPageHtml.querySelectorAll('#postlist>div');
                            const tempNextPageBtn = nextPageHtml.querySelector('.pgbtn a');
                            forEach(replies, (reply) => {
                                if (reply.id === 'postlistreply') {
                                    return
                                }
                                postlist.appendChild(reply);
                            });
                            const currentPathname = location.pathname;
                            history.replaceState(null, '', nextPageBtn.href);
                            if (tempNextPageBtn) {
                                nextPageBtn.href = tempNextPageBtn.href;
                            } else {
                                nextPageBtn.parentNode.hidden = true;
                            }

                            // 改变页码显示，看着顺眼点
                            forEach(paginationInputs, (input) => {
                                input.value = +input.value + 1;
                            });
                            forEach(document.querySelectorAll('.pg strong'), (currentNum) => {
                                const nextNum = currentNum.nextSibling;
                                if (nextNum && nextNum.nodeName === 'A') {
                                    const a = document.createElement('a');
                                    a.innerHTML = currentNum.innerHTML;
                                    a.href = currentPathname;
                                    nextNum.parentNode.replaceChild(a, currentNum);

                                    const strong = document.createElement('strong');
                                    strong.innerHTML = nextNum.innerHTML;
                                    nextNum.parentNode.replaceChild(strong, nextNum)
                                }
                            });

                            forEach(document.querySelectorAll('.pg .prev'), (prev => {
                                prev.href = currentPathname;
                            }));
                            forEach(document.querySelectorAll('.pg .nxt'), (next => {
                                next.href = tempNextPageBtn.href;
                            }));

                            nextPageBtn.innerHTML = nextPageBtn.innerHTML.replace(LoadingText, '');
                            nextPageHtml = undefined;
                        })
                });
                done();
            }
        })
    }
})();