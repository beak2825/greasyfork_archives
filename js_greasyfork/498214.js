// ==UserScript==
// @name         小报童目录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在文章页中添加小册目录，需要先访问一次小册的目录表做缓存
// @author       ibucoin
// @match        https://xiaobot.net/*
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498214/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/498214/%E5%B0%8F%E6%8A%A5%E7%AB%A5%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 添加 CSS 样式
    GM_addStyle(
        `
      .list-info {
    background: #fffdfc;
    mix-blend-mode: normal;
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(40px);
    border-radius: 6px;
    margin-bottom: 20px;
    padding: 18px 19px;
    width: 262px;
    margin-top: 30px;
    margin-left: 15px;
    height:400px;
}

.fiexed {
overflow-y: auto;
position: sticky;
top: 80px;
border-top-left-radius: 0.5rem;
border-bottom-left-radius: 0.5rem;
background-color: #ffffff;
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.list-info a {
   color:#1f2937;
}
.list-info li {
   list-style:none;
}
.item {
    font-size: 14px;
    display: block;
padding-top: 0.5rem;
padding-bottom: 0.5rem;
padding-left: 1rem;
padding-right: 1rem;
color: #1F2937;
}

.item.active {
   color:red;
}
.item:hover {
 background-color: #F3F4F6;
 }

 .reset-btn {
   color: #fff;
    background: #b14b43;
    font-size: 12px;
    width:100px;
    text-align:center;
    padding:10px 0;
    margin-top:10px;
    line-height: 17px;
    border-radius: 2px;
    cursor:pointer;

 }
    `
    );

    // 设置缓存数据
    function setCache(key, value) {
        localStorage.setItem(key, value)
    }

    // 获取缓存数据
    function getCache(key) {
        return localStorage.getItem(key)
    }

    let slug = ''



    setTimeout(() => {
        const searchBox = document.querySelector('.searchBox');
        console.log('searchBox',searchBox)
        let button = `<div id="reset-btn" class="reset-btn">重置列表缓存</div>`
        searchBox.insertAdjacentHTML('afterend', button);

        document.getElementById('reset-btn').addEventListener('click', clearCache);


        function clearCache() {
            //获取当前的key
            let currentUrl = window.location.href;
            const regex = /\/p\/([^\/]+)/;
            const match = currentUrl.match(regex);

            if (match && match[1]) {
                const key = match[1];
                localStorage.removeItem(`${key}_data`)
                location.reload()
            }
        }
    }, 1500)




    console.log(window.location.href)

    // 创建一个函数来处理 XHR 请求
    function handleXHRRequest(xhr) {
        // 监听 XHR 的 load 事件
        xhr.addEventListener('load', function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    let url = xhr.responseURL
                    var pattern = /^https:\/\/api\.xiaobot\.net\/paper\/(.*?)\/post\?/;
                    const sidebars = document.querySelectorAll('.list-info');
                    sidebars.forEach(element => {
                        element.remove();
                    });
                    var match = url.match(pattern);
                    if (match && match[1]) {
                        let bookSlug = match[1]
                        let {
                            data
                        } = JSON.parse(xhr.response)
                        const newData = data.map(({
                            title,
                            uuid
                        }) => ({
                            title,
                            uuid
                        }));
                        let key = `${bookSlug}_data`
                        //先获取缓存中的数据
                        let cachedData = JSON.parse(localStorage.getItem(key)) || [];

                        let insertData = newData.filter(item => !cachedData.some(cachedItem => cachedItem.uuid ===
                            item.uuid) && (item.title != null));

                        if (insertData.length > 0) {
                            cachedData = cachedData.concat(insertData);
                            setCache(key, JSON.stringify(cachedData))
                        }
                    }


                    function isMatchingPostURL(url) {
                        var pattern = /^https:\/\/api\.xiaobot\.net\/post\/[^/]+$/;
                        return pattern.test(url);
                    }

                    if (isMatchingPostURL(url)) {
                        //进入详细页获取缓存数据
                        const {
                            data
                        } = JSON.parse(xhr.response)
                        let bookSlug = data.paper.slug
                        slug = bookSlug

                        window.setTimeout(() => {
                            //判断当前是否在post页
                            const sharePaper = document.querySelector('.share-paper');
                            const sidebars = document.querySelectorAll('.list-info');

                            sidebars.forEach(element => {
                                element.remove();
                            });

                            let key = `${slug}_data`

                            let cacheData = JSON.parse(getCache(key))
                            let html = ""
                            let content = ""

                            function getLastString(url) {
                                const regex = /\/([^/]+)$/;
                                const match = url.match(regex);
                                return match ? match[1] : null;
                            }

                            let pathname = window.location.url

                            let keyUuid = getLastString(url)
                            let total = cacheData.length

                            let prePage = ''
                            let nextPage = ''

                            cacheData.forEach((item, index) => {
                                let link = `https://xiaobot.net/post/${item.uuid}`
                                if (item.title) {
                                    let active = '';
                                    if (keyUuid && keyUuid == item.uuid) {
                                        active = 'active'
                                        prePage = cacheData[index - 1] ?? ''
                                        nextPage = cacheData[index + 1] ?? ''
                                    }
                                    let no = total - index
                                    let li =
                                        `<li><a href="${link}" class="item ${active}"><span>${no}  </span>${item.title}</a></li>`
                                    content += li
                                }
                            })
                            html =
                                `<div id="sidelist" class='list-info fiexed'><nav class="py-4"><ul>${content}<ul></nav></div>`



                            function getPageLink(item) {
                                let link = `https://xiaobot.net/post/${item.uuid}`
                                let title = item.title
                                if (title) {
                                    return `<a href=${link}>${title}</a>`
                                } else {
                                    return '无'
                                }
                            }

                            let prePageLink = getPageLink(prePage)
                            let nextPageLink = getPageLink(nextPage)



                            const pageHtml =
                                `<div>
                            <div>下一篇:${prePageLink}</div>
                            <div>上一篇:${nextPageLink}</div>
                            </div>`
                            const pagePosition = document.querySelector('.light_feedback');

                            let webUrl = window.location.href
                            if (!isMatchingPostURL(url)) {
                                return
                            }

                            sharePaper.insertAdjacentHTML('afterend', html);
                            pagePosition.insertAdjacentHTML('beforebegin', pageHtml);

                            //scroll to this
                            let contentElement = document.getElementById('sidelist')
                            let targetElement = document.querySelector('.item.active')
                            const targetPosition = targetElement.offsetTop;
                            const containerHeight = contentElement.clientHeight;
                            const targetHeight = targetElement.offsetHeight;
                            const scrollPosition = targetPosition - (containerHeight / 2) + (
                                targetHeight / 2);

                            contentElement.scrollTo({
                                top: scrollPosition,
                                behavior: 'smooth'
                            });

                            //添加上一篇和下一篇

                        }, 1000);
                    }
                } else {
                    console.log('请求失败,状态码:', xhr.status);
                }
            }
        });

        // 监听 XHR 的 error 事件
        xhr.addEventListener('error', function () {
            console.log('请求出错');
        });
    }


    // 保存原始的 XHR open 和 send 方法
    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;

    function updateLimitParameter(url, newLimit) {
        return url.replace(/limit=\d+/, `limit=${newLimit}`);
    }



    // 重写 XHR 的 open 方法
    XMLHttpRequest.prototype.open = function () {
        handleXHRRequest(this);
        originalOpen.apply(this, arguments);
    };

    // 重写 XHR 的 send 方法
    XMLHttpRequest.prototype.send = function () {
        originalSend.apply(this, arguments);
    };
})();