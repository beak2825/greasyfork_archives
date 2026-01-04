// ==UserScript==
// @name         Lofter网页版查看发现内容
// @license      GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  在 Lofter 网页版查看App端的个性化推荐内容
// @author       SrakhiuMeow
// @match        https://www.lofter.com/
// @grant        GM.xmlHttpRequest
// @connect      api.lofter.com
// @downloadURL https://update.greasyfork.org/scripts/532972/Lofter%E7%BD%91%E9%A1%B5%E7%89%88%E6%9F%A5%E7%9C%8B%E5%8F%91%E7%8E%B0%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/532972/Lofter%E7%BD%91%E9%A1%B5%E7%89%88%E6%9F%A5%E7%9C%8B%E5%8F%91%E7%8E%B0%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 喜欢功能暂时不可用
    function like(authkey, postId, mode) {
        const url = new URL("https://api.lofter.com/v2.0/exploreRecom.api");
        const params = {
            'product': 'lofter-android-7.6.12',
            'op': mode ? 'like' : 'unlike',
            'id': postId,
            'type': 1,
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
                    'user-agent': 'LOFTER-Android 7.6.12 (V2272A; Android 13; null) WIFI',
                    'lofter-phone-login-auth': authkey,
                    'accept-encoding': "br,gzip",
                },
                onload: function (response) {
                    try {
                        // console.log(response);
                        // const data = JSON.parse(response.responseText);
                        resolve(response);
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

    function getRecommends(authkey, offset = 0) {
        const url = new URL("https://api.lofter.com/recommend/exploreRecom.json");
        const params = {
            'offset': offset,
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
                        
                        const data = JSON.parse(response.responseText);
                        // console.log(data);
                        // offset += data.offset;
                        resolve(data.data);
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

    function notInterest(authkey, blogId, postId) {
        const url = new URL("https://api.lofter.com/newapi/recMark.json");
        const params = {
            'showId': postId,
            'blogId': blogId,
            'markType': 'notInterestArticle',
            'module': 'feed_rec',
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

                        const data = JSON.parse(response.responseText);
                        // offset += data.offset;
                        resolve(data.data);
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

    function buildArticleElement(blogUrl, avatarUrl, publisher, imageUrl, digest, tags, postUrl, title, fullContent, postId, hotCount=0, blogId=0) {
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
                                    <div class="imgc"> <a href="${postUrl}" target="_blank" hidefocus="true"><img
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
                                <a href="${postUrl}" target="_blank" style="text-decoration: none">
                                    ${digest}
                                </a>
                                </div>
                            </div>
                            <div class="more" style="display: none"><a class="w-more w-more-open">展开</a></div>

                        </div>

                    </div>


                    <div class="w-opt">
                        <div class="opta" style="width: 132px;">
                            ${tags}
                        </div>
                        <div class="optb"> <span class="opti" style="display: block;">
                            <span class="opti">
                                <a hidefocus="true">热度(${hotCount})</a>
                            </span>
                            <span class="opti noti">
                                <a>不感兴趣</a>
                                <span class="opticrt"></span>
                            </span>
                            <span class="opti">
                                <a href="${postUrl}" target="_blank" hidefocus="true">查看全文</a>
                                <span class="opticrt"></span>
                            </span>
                            <span class="opti" style="display: none">
                                <a class="w-icn w-icn-0b" hidefocus="true" title="喜欢">喜欢<span></span><span></span></a>
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

        // 给喜欢按钮添加点击事件
        const likeButton = article.querySelector('.w-icn-0b');
        likeButton.addEventListener('click', () => {
            // console.log('喜欢按钮被点击');
            const authkey = getCookie("LOFTER-PHONE-LOGIN-AUTH");
            if (authkey === null) {
                console.log('未登录');
                return;
            }
            if (likeButton.classList.contains('w-icn-0b-do')) {
                like(authkey, postId, false, blogId)
                    .then(response => {
                        // console.log(response);
                        likeButton.classList.remove('w-icn-0b-do');
                        likeButton.classList.remove('w-icn-0b-do-anim');
                        likeButton.querySelector('span').textContent = '喜欢';
                    })
                    .catch(error => console.error(error));
            } else {
                like(authkey, postId, true, blogId)
                    .then(response => {
                        // console.log(response);
                        likeButton.classList.add('w-icn-0b-do-anim');
                        likeButton.classList.add('w-icn-0b-do');
                        likeButton.querySelector('span').textContent = '取消喜欢';
                    })
                    .catch(error => console.error(error));
            }
            
        });

        // 给不感兴趣按钮添加点击事件
        const notInterestButton = article.querySelector('.noti');
        notInterestButton.addEventListener('click', () => {
            if (notInterestButton.innerHTML.includes('确认不感兴趣')) {
                notInterestButton.addEventListener('click', () => {
                    // console.log('不感兴趣按钮被点击');
                    const authkey = getCookie("LOFTER-PHONE-LOGIN-AUTH");
                    if (authkey === null) {
                        console.log('未登录');
                        return;
                    }
                    notInterest(authkey, blogId, postId)
                        .then(response => {
                            article.remove();
                        })
                        .catch(error => console.error(error));
                });
            } else {
                notInterestButton.textContent = '确认不感兴趣';
            }           
            
        }
        );

        // 给展开按钮添加点击事件
        // const more = article.querySelector('a.w-more');
        // more.addEventListener('click', () => {
        //     const full = article.querySelector('.txt.full');
        //     const digest = article.querySelector('.txt.digest');
        //     if (more.classList.contains('w-more-open')) {
        //         more.classList.remove('w-more-open');
        //         more.classList.add('w-more-close');
        //         more.textContent = '收起';
        //         full.style.display = 'block';
        //         digest.style.display = 'none';
        //     }
        //     else {

        //         more.classList.remove('w-more-close');
        //         more.classList.add('w-more-open');
        //         more.textContent = '展开';
        //         full.style.display = 'none';
        //         digest.style.display = 'block';
        //         digest.scrollIntoView({ behavior: 'smooth' });
        //     }
        // });

        // 给查看原图按钮添加点击事件
        const viewOriginal = article.querySelector('.w-zoom');
        const newViewOriginal = viewOriginal.cloneNode(true);
        viewOriginal.parentNode.replaceChild(newViewOriginal, viewOriginal);

        newViewOriginal.href = imageUrl;
        newViewOriginal.target = '_blank';


        return article;
    }

    function insertArticle(article) {
        const main = document.getElementById('main');
        main.insertBefore(article, main.children[7]);
    }

    function insertArticles(articles) {
        const main = document.getElementById('main');
        // const firstArticle = main.children[7];

        // 插入新元素(推荐文章)
        articles.forEach(article => {
            // console.log(article);
            const articleElement = buildArticleElement(
                "https://" + article.blogInfo.blogName + ".lofter.com",
                article.blogInfo.bigAvaImg,
                article.blogInfo.blogNickName,
                article.postData.postView.firstImage.orign.split('?')[0],
                article.postData.postView.digest,
                article.postData.postView.tagList.map(tag => `<span class="opti"><a href="${tag.tagUrl}" target="_blank"><span>${tag}</span></a></span>`).join(' '),
                article.postData.postView.postPageUrl,
                article.postData.postView.title,
                null,
                article.postData.postView.id,
                article.postData.postCount.hotCount,
                article.postData.postView.blogId
            );
            // main.insertBefore(articleElement, firstArticle);
            main.appendChild(articleElement);
        });
    }

    const offset = {num: 0};

    function change2recommends() {
        // 变换按钮状态
        this.querySelector('span').textContent = '返回主页';
        this.removeEventListener('click', change2recommends);
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

        const history = getRecommends(authkey, 0)
            .then(response => {
                // console.log(response);
                insertArticles(response.list);
                offset.num += response.offset;
            })
            .catch(error => console.error(error));
        // console.log('hi');
        // console.log(history);

        
        let isFetching = false; // 防止重复请求

        window.addEventListener('scroll', e => {
            e.stopImmediatePropagation();
            const threshold = 100;
            const isNearBottom = (window.innerHeight + window.scrollY) >=
                document.body.scrollHeight - threshold;

            if (isNearBottom && !isFetching) { // 只有在未加载时才触发
                isFetching = true; // 锁定
                // console.log("触发自定义加载...");

                getRecommends(authkey, offset.num)
                    .then(response => {
                        // console.log(response);
                        offset.num += response.offset;
                        insertArticles(response.list);
                    })
                    .catch(error => console.error(error))
                    .finally(() => {
                        isFetching = false; // 解锁
                    });
            }
        }, true);
    }

    function initializeRecommendsFeature() {
        const slideBar = document.getElementById('slide-bar')?.children[0]?.children[1];
        if (!slideBar) {
            console.error('无法找到侧边栏元素');
            return;
        }
        // 添加分割线
        const dividingLine = document.createElement('div');
        dividingLine.className = document.querySelector('[class*="horizontalDividingLine"]').className;
        slideBar.insertBefore(dividingLine, slideBar.children[0]);

        // 添加发现按钮
        // 不知道为什么直接用<a>会有报错（
        const recommends = document.createElement('div');
        recommends.id = 'getRecommends';
        recommends.innerHTML = `
            <div>
                <h5 class="LRlf1c3Y3+bO-foPi4wNjQ==">
                    <span>发现</span>
                    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" class="mVWxtvI0CO9-BAyQYEFwKw=="><path d="M8 4.5l5.5 5.5L8 15.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </h5>
            </div>
        `;
        recommends.style.cursor = 'pointer';
        recommends.addEventListener('click', change2recommends);
        slideBar.insertBefore(recommends, slideBar.children[0]);

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
        }, 2000); // 2秒超时

        // 开始观察整个文档的变化
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // 避免脚本过早执行
    waitForElement('#slide-bar', (element) => {
        setTimeout(() => {
            // console.log('Slide bar loaded');
            initializeRecommendsFeature();
        }, 50); // 等待50ms后执行
    });

})();