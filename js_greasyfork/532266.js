// ==UserScript==
// @name         Lofter查看订阅合集
// @license      GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 Lofter 网页版查看订阅合集
// @author       SrakhiuMeow
// @match        https://www.lofter.com/
// @grant        GM.xmlHttpRequest
// @connect      api.lofter.com
// @downloadURL https://update.greasyfork.org/scripts/532266/Lofter%E6%9F%A5%E7%9C%8B%E8%AE%A2%E9%98%85%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/532266/Lofter%E6%9F%A5%E7%9C%8B%E8%AE%A2%E9%98%85%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var subscribeCollectionCount = 0;

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

    function getSubscription(authkey, offset = 0, limit = 50) {
        const url = new URL("https://api.lofter.com/newapi/subscribeCollection/list.json");
        const params = {
            'offset': offset,
            'limit': limit,
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
                    'lofproduct': 'lofter-android-7.6.12',
                    'User-Agent': "LOFTER-Android 7.6.12 (V2272A; Android 13; null) WIFI",
                    'Accept-Encoding': "br,gzip",
                    'lofter-phone-login-auth': authkey,
                },
                onload: function (response) {
                    try {
                        // console.log(response);
                        const data = JSON.parse(response.responseText);
                        resolve(data);
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

    function buildArticleElement(collection) {
        const avatar = document.createElement('div');
        avatar.className = 'mlistimg';
        avatar.innerHTML = `
            <div class="w-img" style="z-index:1;">
                <a href="https://www.lofter.com/front/blog/collection/share?collectionId=${collection.collectionId}" target="_blank">
                    <img src="${collection.coverUrl}?imageView&amp;thumbnail=64x64&amp;type=jpg">
                </a>
            </div>
            <div class="w-img" style="height:0px; padding:0; z-index:10;"></div>
        `;

        const notDisplayImage = typeof imageUrl == "undefined" || imageUrl == null || imageUrl == "";
        const content = document.createElement('div');
        content.className = 'mlistcnt';
        content.innerHTML = `
            <div class="isay">
                <div class="isaym">
                    <div class="w-who"><a href="https://www.lofter.com/front/blog/collection/share?collectionId=${collection.collectionId}" class="publishernick"
                            target="_blank">${collection.name}</a>
                    </div>
                    <div>
                        <div class="m-icnt">
                            <h2 class="tit"> ${collection.name}</h2>
                            <div class="cnt">
                                <div class="txt digest" style="display: block;">
                                    <p>最近更新：</p>
                                    ${collection.latestPosts.join('<br>')}
                                </div>
                            </div>

                        </div>

                    </div>


                    <div class="w-opt">
                        <div class="optb"> <span class="opti" style="display: block;">
                            <span class="opti">
                                <a hidefocus="true">加载详情(从最新开始)</a>
                                <span class="opticrt"></span>
                            </span>
                        </div>
                    </div>

                    <div class="subslist"></div>
                </div>
                <div class="isayb"></div>
            </div>
        `;


        const article = document.createElement('div');
        article.className = 'm-mlist';
        article.appendChild(avatar);
        article.appendChild(content);

        const button = article.querySelector('.opti');
        const list = article.querySelector('.subslist');
        button.addEventListener('click', () => {
            const collectionId = collection.collectionId;
            const authkey = getCookie("LOFTER-PHONE-LOGIN-AUTH");
            if (authkey === null) {
                console.log('未登录');
                throw new Error('未登录');
            }
            // console.log('authkey:', authkey);

            if (detailOffsets[collectionId] == null) {
                detailOffsets[collectionId] = 0;
            }

            getCollectionDetail(authkey, collectionId, detailOffsets[collectionId], 15, 0)
                .then(response => {
                    displayCollectionDetail(response.items, list);
                    detailOffsets[collectionId] += 15;
                    if (response.collection.postCount <= detailOffsets[collectionId]) {
                        button.innerHTML = '没有更多数据了';
                        button.style.cursor = 'not-allowed';
                        const clone = button.cloneNode(true); // 克隆按钮
                        button.parentNode.replaceChild(clone, button); // 替换按钮
                        return;
                    }
                })
                .catch(error => console.error(error));
        });


        return article;
    }

    const detailOffsets = {};

    function displayCollectionDetail(items, list) {
        // 显示合集详情


        items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.post.blogPageUrl;
            link.target = '_blank';
            link.innerHTML = item.post.title == '' ? item.post.noticeLinkTitle : item.post.title;

            list.appendChild(link);
            list.innerHTML += '<br>';

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

    function insertArticles(articles) {
        const main = document.getElementById('main');
        // const firstArticle = main.children[7];

        // console.log(articles);
        // 插入新元素(订阅)
        articles.forEach(article => {
            const articleElement = buildArticleElement(article);
            // main.insertBefore(articleElement, firstArticle);
            main.appendChild(articleElement);
        });
    }

    var offset = 20;

    function change2subscription() {
        // 变换按钮状态
        this.querySelector('span').textContent = '返回主页';
        this.removeEventListener('click', change2subscription);
        this.addEventListener('click', () => {
            location.reload();
        });

        // 获取authkey
        const authkey = getCookie("LOFTER-PHONE-LOGIN-AUTH");
        if (authkey === null) {
            console.log('未登录');
            throw new Error('未登录');
        }
        // console.log('authkey:', authkey);

        // 获取blogDomain
        let blogDomain = document.querySelector('span.lg2').textContent;
        // console.log('blogDomain:', blogDomain);

        // 清除原有元素(关注更新)
        const divs = document.querySelectorAll('div.m-mlist');
        divs.forEach(div => {
            div.remove();
        });

        const subs = getSubscription(authkey, 0, 20)
            .then(response => {
                insertArticles(response.data.collections);
                subscribeCollectionCount = response.data.subscribeCollectionCount;
            })
            .catch(error => console.error(error));
        // console.log('hi');
        // console.log(history);

        window.addEventListener('scroll', e => {
            e.stopImmediatePropagation(); // 先阻止原逻辑
            const threshold = 100;
            const isNearBottom = (window.innerHeight + window.scrollY) >=
                document.body.scrollHeight - threshold;

            if (isNearBottom) {
                // console.log("触发自定义加载...");
                // 调用你的加载函数（例如从其他API获取数据）

                if (offset >= subscribeCollectionCount) {
                    // console.log('没有更多数据了');
                    return;
                };

                const history = getSubscription(authkey, blogDomain, offset, 20)
                    .then(response => insertArticles(response.data.collections))
                    .catch(error => console.error(error));
                offset += 20;
            }
        }, true); // 必须在捕获阶段拦截！
    }

    function initialize() {
        const slideBar = document.getElementById('slide-bar')?.children[0]?.children[1];
        if (!slideBar) {
            console.error('无法找到侧边栏元素');
            return;
        }
        // 添加分割线
        const dividingLine = document.createElement('div');
        dividingLine.className = document.querySelector('[class*="horizontalDividingLine"]').className;
        slideBar.insertBefore(dividingLine, slideBar.children[0]);

        // 添加订阅合集按钮
        const subscription = document.createElement('div');
        // subscription.id = 'getHistory';
        subscription.innerHTML = `
        <div>
            <h5 class="LRlf1c3Y3+bO-foPi4wNjQ==">
                <span>订阅合集</span>
                <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="mVWxtvI0CO9-BAyQYEFwKw=="><path d="M8 4.5l5.5 5.5L8 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
            </h5>
        </div>
    `;
        subscription.style.cursor = 'pointer';
        subscription.addEventListener('click', change2subscription);
        slideBar.insertBefore(subscription, slideBar.children[0]);

    }

    // 监听 DOM 变化，等待 slidebar 加载完成
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
        }, 5000); // 5秒超时

        // 开始观察整个文档的变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // 避免脚本过早执行
    waitForElement('#slide-bar', (element) => {
        setTimeout(() => {
            // console.log('slide-bar加载完成');
            initialize();
        }, 100); // 等待0.1秒后执行
    });

})();


