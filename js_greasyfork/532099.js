// ==UserScript==
// @name         Lofter 网页版查看合集
// @license      GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 Lofter 网页版查看作者的合集内容
// @author       SrakhiuMeow
// @match        *://*.lofter.com/
// @exclude      *://www.lofter.com/
// @grant        GM.xmlHttpRequest
// @connect      api.lofter.com
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532099/Lofter%20%E7%BD%91%E9%A1%B5%E7%89%88%E6%9F%A5%E7%9C%8B%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/532099/Lofter%20%E7%BD%91%E9%A1%B5%E7%89%88%E6%9F%A5%E7%9C%8B%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    
    const authkey = getCookie("LOFTER-PHONE-LOGIN-AUTH");
    const blogdomain = window.location.hostname;
    const publisher = blogdomain.split('.')[0];
    var doc = document;

    function subscribe(authkey, collectionId, mode = true) {
        // 订阅合集
        // mode = true 订阅， mode = false 取消订阅
        const url = new URL("https://api.lofter.com/v2.0/subscribeCollection.api");
        const params = {
            'method': mode ? 'subscribe' : 'unSubscribe',
            // 'offset': offset,
            // 'limit': limit,
            // 'order': 1,
            // 'collectionid': collectionId,
            'collectionId': collectionId,
            'product': 'lofter-android-7.6.12'
        };

        Object.keys(params).forEach(key =>
            url.searchParams.append(key, params[key])
        );

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url.toString(),
                headers: {
                    'Accept-Encoding': "br,gzip",
                    'content-type': "application/x-www-form-urlencoded; charset=utf-8",
                    'lofter-phone-login-auth': authkey,
                },
                onload: function (response) {
                    try {
                        // console.log(response);
                        const data = JSON.parse(response.responseText);
                        resolve(data.response);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    function getCollection(authkey, blogid, blogdomain, offset = 0, limit = 20) {
        // 获取用户合集列表

        const url = new URL("https://api.lofter.com/v1.1/postCollection.api");
        const params = {
            'method': 'getCollectionList',
            'needViewCount': 1,
            // 'blogid': blogid,
            'blogdomain': blogdomain,
            'product': 'lofter-android-7.6.12'
        };

        Object.keys(params).forEach(key =>
            url.searchParams.append(key, params[key])
        );

        // console.log(authkey);
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url.toString(),
                headers: {
                    'Accept-Encoding': "br,gzip",
                    'content-type': "application/x-www-form-urlencoded; charset=utf-8",
                    'lofter-phone-login-auth': authkey,
                },
                onload: function (response) {
                    try {
                        // console.log(response);
                        const data = JSON.parse(response.responseText);
                        resolve(data.response);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }

    function getCollectionDetail(authkey, collectionId, offset, limit = 15, order = 1) {
        // 获取某一合集详情

        const url = new URL("https://api.lofter.com/v1.1/postCollection.api");
        const params = {
            'method': 'getCollectionDetail',
            'product': 'lofter-android-7.6.12',
            'offset': offset,
            'limit': limit,
            'collectionid': collectionId,
            'order': order,
        };

        Object.keys(params).forEach(key =>
            url.searchParams.append(key, params[key])
        );

        // console.log(authkey);
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "GET",
                url: url.toString(),
                headers: {
                    'Accept-Encoding': "br,gzip",
                    'content-type': "application/x-www-form-urlencoded; charset=utf-8",
                    'lofter-phone-login-auth': authkey,
                },
                onload: function (response) {
                    try {
                        // console.log(response);
                        const data = JSON.parse(response.responseText);
                        resolve(data.response);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (error) {
                    reject(error);
                }
            });
        });
    }


    function getCookie(name) {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return decodeURIComponent(value); // 解码 Cookie 值
            }
        }
        return null; // 如果未找到 Cookie，返回 null
    }

    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);

        const pad = num => num.toString().padStart(2, '0');

        // return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ` +
        //        `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        return `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    

    // const controlFrame = document.getElementById('control_frame');

    // subscribe(authkey, '')
    //     .then(response => {
    //         console.log("subscribe response:", response);
    //     })
    //     .catch(error => {
    //         console.error("Error subscribing:", error);
    //     });

    function displayCollection(collections) {
        // 显示合集列表


        const postwrapper = doc.querySelector('div.postwrapper');
        // const page = doc.querySelector('div.page');

        collections.forEach(collection => {
            const block = doc.createElement('div');
            block.className = 'block article';

            const side = doc.createElement('div');
            side.className = 'side';
            const main = doc.createElement('div');
            main.className = 'main';
            block.appendChild(side);
            block.appendChild(main);

            const content = doc.createElement('div');
            content.className = 'content';
            const tag = doc.createElement('div');
            tag.className = 'tag';
            const link = doc.createElement('div');
            link.className = 'link';
            main.appendChild(content);
            main.appendChild(tag);
            main.appendChild(link);

            const tags = collection.tags.split(',');
            tags.forEach(tagg => {
                const tagElement = doc.createElement('a');
                tagElement.href = "https://www.lofter.com/tag/" + tagg;
                tagElement.innerHTML = `● ${tagg}`;
                tagElement.target = '_blank';
                tag.appendChild(tagElement);
            });


            const text = doc.createElement('div');
            text.className = 'text';
            const img = doc.createElement('div');
            img.className = 'img';
            content.appendChild(text);
            side.appendChild(img);

            const collectionDetail = `https://www.lofter.com/collection/${publisher}/?op=collectionDetail&collectionId=${collection.id}&sort=0`;
            const collectionUrl = `https://www.lofter.com/front/blog/collection/share?collectionId=${collection.id}`;

            img.innerHTML = `<img src="${collection.coverUrl}?imageView&thumbnail=70x70&quality=90&type=jpg">`;

            text.innerHTML = `
                <h2><a href="${collectionUrl}">${collection.name}</a></h2>
                <p>${collection.description}</p>
            `;


            link.innerHTML = `
                <a>复制ID</a>
                <a>${collection.postCount}篇</a>
                <a>${collection.viewCount}浏览</a>
                <a>${collection.postCollectionHot}热度</a>
                <a>${formatTimestamp(collection.updateTime)}更新</a>
                <a id="subscribe" style="display: none;">订阅合集</a>
                <a>查看详情</a>
            `;

            
            const copyButton = link.querySelector('a:first-child');
            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(collection.id).then(() => {
                    // console.log('已将合集ID复制到剪切板:', collection.id);
                    alert('已将合集ID复制到剪切板:' + collection.id);
                }).catch(err => {
                    console.error('复制失败:', err);
                });
            });
            copyButton.style.cursor = 'pointer';


            const subscribeButton = link.querySelector('#subscribe');
            subscribeButton.style.cursor = 'pointer';
            subscribeButton.addEventListener('click', () => {
                if (subscribeButton.innerHTML === '订阅合集') {
                    subscribe(authkey, collection.id, true)
                        .then(response => {
                            // console.log("subscribe response:", response);
                            subscribeButton.innerHTML = '取消订阅';
                        })
                        .catch(error => {
                            console.error("Error subscribing:", error);
                        });
                } else {
                    subscribe(authkey, collection.id, true)
                        .then(response => {
                            // console.log("unsubscribe response:", response);
                            subscribeButton.innerHTML = '订阅合集';
                        })
                        .catch(error => {
                            console.error("Error unsubscribing:", error);
                        });
                }
            });



            const detailButton = link.querySelector('a:last-child');

            const list = doc.createElement('div');
            main.appendChild(list);
            if (collection.postCount === 0) {
                detailButton.innerHTML = '没有内容了';
                detailButton.style.cursor = 'not-allowed';
                detailButton.removeEventListener('click', this);
                detailButton.remove();
                return;
            }
            const br = doc.createElement('br');
            list.appendChild(br);

            detailOffsets[collection.id] = 0;
            detailButton.addEventListener('click', () => {
                getCollectionDetail(authkey, collection.id, detailOffsets[collection.id])
                    .then(response => {
                        // console.log("collection detail response:", response);

                        subscribeButton.style.display = 'block';
                        if (response.subscribed) {
                            subscribeButton.innerHTML = '取消订阅';
                        } else {
                            subscribeButton.innerHTML = '订阅合集';
                        }

                        // 处理合集详情
                        displayCollectionDetail(response.items, list);

                        if (detailOffsets[collection.id] >= collection.postCount) {
                            detailButton.innerHTML = '没有更多内容了';
                            detailButton.style.cursor = 'not-allowed';
                            const clone = detailButton.cloneNode(true);
                            detailButton.parentNode.replaceChild(clone, detailButton);
                            return;
                        } else {
                            detailButton.innerHTML = '加载更多';
                            detailButton.style.cursor = 'pointer';
                        }

                    })
                    .catch(error => console.error(error));
                detailOffsets[collection.id] += 15;

            });
            detailButton.style.cursor = 'pointer';

            // postwrapper.insertBefore(block, page);
            postwrapper.appendChild(block);
            
        });
    }

    const detailOffsets = {};

    function displayCollectionDetail(items, list) {
        // 显示合集详情


        items.forEach(item => {
            const link = doc.createElement('a');
            link.href = item.post.blogPageUrl;
            link.target = '_blank';
            link.innerHTML = item.post.title == '' ? item.post.noticeLinkTitle : item.post.title;

            list.appendChild(link);
            list.innerHTML += '<br>';

        });

    }


    function change2collection() {
        // 将页面修改为显示合集列表模式

        this.innerHTML = '<a>返回</a>';
        this.addEventListener('click', () => {
            window.location.reload();
        });


        // 清除原有内容
        const postwrapper = doc.querySelector('div.postwrapper');
        const postElements = postwrapper.querySelectorAll('div.block');
        postElements.forEach(element => element.remove());
        const page = doc.querySelector('div.page');
        postwrapper.removeChild(page);

        // 获取合集列表
        getCollection(authkey, '', blogdomain)
            .then(response => displayCollection(response.collections))
            .catch(error => console.error(error));
    }

    function change2collection4theme() {
        // 将页面修改为显示合集列表模式
        newFrame();

        // this.innerHTML = '<a>返回</a>';
        // this.addEventListener('click', () => {
        //     window.location.reload();
        // });


        getCollection(authkey, '', blogdomain)
            .then(response => displayCollection(response.collections))
            .catch(error => console.error(error));


        // 清除原有内容
        // const postwrapper = doc.querySelector('div.postwrapper');
        // const postElements = postwrapper.querySelectorAll('div.block');
        // postElements.forEach(element => element.remove());
        // const page = doc.querySelector('div.page');
        // postwrapper.removeChild(page);

        
    }


    function initialize() {
        // 初始化

        // 添加合集按钮
        const sidelist = document.querySelector('ul.sidelist');
        const collectionButton = document.createElement('li');
        collectionButton.innerHTML = '<a>合集</a>';
        collectionButton.addEventListener('click', change2collection);
        collectionButton.style.cursor = 'pointer';
        sidelist.appendChild(collectionButton);


    }

    function intialize2() {
        // 非默认主题下的初始化
    
        if (document.querySelector('ul.m-nav')) {
            const sidelist = document.querySelector('ul.m-nav');
            const collectionButton = document.createElement('li');
            collectionButton.innerHTML = '<a>合集</a>';
            collectionButton.addEventListener('click', change2collection4theme);
            collectionButton.style.cursor = 'pointer';
            sidelist.appendChild(collectionButton);
        } else if (document.querySelector('div.m-nav')){
            const sidelist = document.querySelector('div.m-nav');
            const collectionButton = document.createElement('li');
            collectionButton.innerHTML = '<a>合集</a>';
            collectionButton.addEventListener('click', change2collection4theme);
            collectionButton.style.cursor = 'pointer';
            sidelist.children[0].appendChild(collectionButton);
        }
        
    }

    function newFrame() {
        
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = '#dfdfe1';
        overlay.style.backgroundAttachment = 'fixed';
        overlay.style.backgroundImage = 'url(https://imglf3.lf127.net/img/1553236065974180.png)';
        overlay.style.wordWrap = 'break-word';
        overlay.style.zIndex = '9999';
        overlay.style.overflowY = 'auto'; // 允许覆盖层自身滚动

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.onclick = () => document.body.removeChild(overlay);

        overlay.appendChild(closeBtn);

        const style = document.createElement('style');
        style.textContent = `
            .block {
                margin: 0 0 35px;
            }
            .side {
                width: 84px;
                float: left;
            }

            .img {
                margin: 0 0 15px;
            }

            .main {
                margin-left: 110px;
                padding-bottom: 48px;
            }

            .tag {
                margin: 30px 0 0;
                clear: both;
            }

            .link {
                margin: 20px 0 0;
                clear: both;
                overflow: hidden;
                zoom: 1;
            }
        `;
        document.head.appendChild(style);

        const postwrapper = document.createElement('div');
        postwrapper.className = 'postwrapper box wid700'
        Object.assign(postwrapper.style, {
            margin: '0 auto 40px',
            padding: '25px 30px',
            background: '#fff',
            overflow: 'hidden',
            webkitBoxShadow: '0 0 7px 0 rgba(0, 0, 0, 0.2)',
            width: '640px'
        });
        overlay.appendChild(postwrapper);

        document.body.appendChild(overlay);
        


    }


    // 监听 DOM 变化，等待 ul.sidelist 加载完成
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                clearTimeout(timeoutId); // 清除超时定时器
                obs.disconnect(); // 停止观察
                callback(element);
            }
        });

        const timeoutId = setTimeout(() => {
            observer.disconnect(); // 停止观察
            intialize2();
        }, 1000); // 1秒超时

        // 开始观察整个文档的变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // 避免脚本过早执行
    waitForElement('ul.sidelist', (element) => {
        initialize();
    });

})();