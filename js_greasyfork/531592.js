// ==UserScript==
// @name         Lofter查看历史记录
// @license      GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  在 Lofter 网页版查看并记录阅读历史
// @author       SrakhiuMeow
// @match        https://www.lofter.com/
// @match        https://*.lofter.com/post/*
// @grant        GM.xmlHttpRequest
// @connect      api.lofter.com
// @connect      da.lofter.com
// // @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531592/Lofter%E6%9F%A5%E7%9C%8B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/531592/Lofter%E6%9F%A5%E7%9C%8B%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    function updateHistory(authkey, userId, postId, blogId, collectionId=null, postType=null) {
        // 自动将访问的页面添加到历史记录

        const time = Math.floor(Date.now());
        const url = new URL("https://da.lofter.com/datacollect/v1/upload");
        const data = {
            'time': time,
            'list': [
                {
                    'userId': userId,
                    'data': {
                        'postId': postId,
                        'blogId': blogId,
                        // 'collectionId': collectionId,
                        // 'postType': '1',
                        'time': time,
                    },
                    'type': 'postRead',                    
                }
            ]
        };

        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: url.toString(),
                data: JSON.stringify(data),
                // data: data,
                headers: {
                    'lofproduct': 'lofter-android-7.6.12',
                    'User-Agent': "LOFTER-Android 7.6.12 (V2272A; Android 13; null) WIFI",
                    'Accept-Encoding': "br,gzip",
                    'content-type': 'application/json; charset=UTF-8',
                    'lofter-phone-login-auth': authkey,
                },
                onload: function (response) {
                    try {
                        const data = response;
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

    function getHistory(authkey, blogdomain, offset = 0, limit = 50) {
        const url = new URL("https://api.lofter.com/v2.0/history.api");
        const params = {
            'method': 'getList',
            'offset': offset,
            'limit': limit,
            'blogdomain': blogdomain,
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
                onload: function(response) {
                    try {
                        // console.log(response);
                        const data = JSON.parse(response.responseText);
                        resolve(data.response);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function buildArticleElement(blogUrl, avatarUrl, publisher, imageUrl, digest, tags, postUrl, title, fullContent) {
        const avatar = document.createElement('div');
        avatar.className = 'mlistimg';
        avatar.innerHTML = `
            <div class="w-img" style="z-index:1;">
                <a href="${blogUrl}" target="_blank">
                    <img src="${avatarUrl}?imageView&amp;thumbnail=64x64&amp;type=jpg">
                </a>
            </div>
            <div class="w-img" style="height:0px; padding:0; z-index:10;"></div>
        `;

        const notDisplayImage = typeof imageUrl == "undefined" || imageUrl == null || imageUrl == "";
        const content = document.createElement('div');
        content.className = 'mlistcnt';
        content.innerHTML = `
            <div class="isay">
                <div class="isayt"> <a class="isayc" href="${postUrl}" title="查看全文" target="_blank">打开新页</a></div>
                <div class="isaym">
                    <div class="w-who"><a href="${blogUrl}" class="publishernick"
                            target="_blank">${publisher}</a>
                    </div>
                    <div>
                        <div class="m-icnt">
                            <h2 class="tit"><a href="${postUrl}" target="_blank">${title}</a></h2>
                            <div class="cnt">
                                <div class="img" style="width: 164px; height: auto; display: ${notDisplayImage ? "none" : "block"}">
                                    <div class="imgc"> <a hidefocus="true"><img
                                                style="width:164px;"
                                                src="${imageUrl}?imageView&amp;thumbnail=1000x0&amp;type=jpg"></a>
                                        <div class="sphotolabels" style="display:none"></div>
                                    </div>
                                    <a class="w-zoom">查看原图</a>
                                </div>
                                <div class="txt full" style="display: none;">
                                    ${fullContent}
                                </div>
                                <div class="txt digest" style="display: block;">
                                    ${digest}
                                </div>
                            </div>
                            <div class="more" style=""><a class="w-more w-more-open">展开</a></div>

                        </div>

                    </div>


                    <div class="w-opt">
                        <div class="opta" style="width: 132px;">
                            ${tags}
                        </div>
                        <div class="optb"> <span class="opti" style="display: block;">
                            <span class="opti">
                                <a href="${postUrl}" target="_blank" hidefocus="true">查看全文</a>
                                <span class="opticrt"></span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="isayb"></div>
            </div>
        `;


        const article = document.createElement('div');
        article.className = 'm-mlist';
        article.appendChild(avatar);
        article.appendChild(content);

        // 给展开按钮添加点击事件
        const more = article.querySelector('a.w-more');
        more.addEventListener('click', () => {
            const full = article.querySelector('.txt.full');
            const digest = article.querySelector('.txt.digest');
            if (more.classList.contains('w-more-open')) {
                more.classList.remove('w-more-open');
                more.classList.add('w-more-close');
                more.textContent = '收起';
                full.style.display = 'block';
                digest.style.display = 'none';
            }
            else {

                more.classList.remove('w-more-close');
                more.classList.add('w-more-open');
                more.textContent = '展开';
                full.style.display = 'none';
                digest.style.display = 'block';
                digest.scrollIntoView({ behavior: 'smooth' });
            }
        });

        // 给查看原图按钮添加点击事件
        const viewOriginal = article.querySelector('.w-zoom');
        const newViewOriginal = viewOriginal.cloneNode(true);
        viewOriginal.parentNode.replaceChild(newViewOriginal, viewOriginal);

        newViewOriginal.href = imageUrl;
        newViewOriginal.target = '_blank';


        return article;
    }

    function insertArticles(articles) {
        const main = document.getElementById('main');
        // const firstArticle = main.children[7];

        // 插入新元素(历史记录)
        articles.forEach(article => {
            const articleElement = buildArticleElement(
                article.post.publisherMainBlogInfo.homePageUrl,
                article.post.publisherMainBlogInfo.bigAvaImg,
                article.post.publisherMainBlogInfo.blogNickName,
                article.post.firstImageUrlForAnti,
                article.post.digest,
                article.post.tagList.map(tag => `<span class="opti"><a href="${tag.tagUrl}" target="_blank"><span>${tag}</span></a></span>`).join(' '),
                article.post.blogPageUrl,
                article.post.title,
                article.post.content
            );
            // main.insertBefore(articleElement, firstArticle);
            main.appendChild(articleElement);
        });
    }

    var offset = 20;

    function change2history() {
        // 变换按钮状态
        this.querySelector('span').textContent = '返回主页';
        this.removeEventListener('click', change2history);
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

        const history = getHistory(authkey, blogDomain, 0, 20)
            .then(response => insertArticles(response.items))
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

                const history = getHistory(authkey, blogDomain, offset, 20)
                .then(response => insertArticles(response.items))
                .catch(error => console.error(error));
                offset += 20;
            }
        }, true); // 必须在捕获阶段拦截！
    }

    function initializeHistoryFeature() {
        const slideBar = document.getElementById('slide-bar')?.children[0]?.children[1];
        if (!slideBar) {
            console.error('无法找到侧边栏元素');
            return;
        }
        // 添加分割线
        const dividingLine = document.createElement('div');
        dividingLine.className = document.querySelector('[class*="horizontalDividingLine"]').className;
        slideBar.insertBefore(dividingLine, slideBar.children[0]);

        // 添加历史记录按钮
        // 不知道为什么直接用<a>会有报错（
        const history = document.createElement('div');
        history.id = 'getHistory';
        history.innerHTML = `
            <div>
                <h5 class="LRlf1c3Y3+bO-foPi4wNjQ==">
                    <span>历史记录</span>
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="mVWxtvI0CO9-BAyQYEFwKw=="><path d="M8 4.5l5.5 5.5L8 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </h5>
            </div>
        `;
        history.style.cursor = 'pointer';
        history.addEventListener('click', change2history);
        slideBar.insertBefore(history, slideBar.children[0]);

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

    const currentUrl = window.location.href;
    if (currentUrl.includes('post')) {
        // 如果当前页面是文章页面
        const iframe = document.getElementById('control_frame')
        const iframeSrc = iframe?.src;
        const blogId = iframeSrc?.split('blogId=')[1]?.split('&')[0];
        const postId = iframeSrc?.split('postId=')[1]?.split('&')[0];

        const authkey = getCookie("LOFTER-PHONE-LOGIN-AUTH");
        if (authkey === null) {
            console.log('未登录');
            throw new Error('未登录');
        }

        const traceId = getCookie("__LOFTER_TRACE_UID");
        const userId = traceId?.split('#')[1]?.split('#')[0];
        updateHistory(authkey, userId, postId, blogId)
            .then(response => {
                // console.log('更新历史记录成功:', response);/
            })
            .catch(error => {
                console.error('更新历史记录失败:', error);
            });

    } 
    else {
        // 避免脚本过早执行
        waitForElement('#slide-bar', (element) => {
            setTimeout(() => {
                // console.log('Slide bar loaded');
                initializeHistoryFeature();
            }, 1000); // 等待1s后执行
        });
    }
    

})();