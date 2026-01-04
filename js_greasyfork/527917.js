// ==UserScript==
// @name           B站广告替换为Pixiv推荐图片
// @name:en        Bilibili Ad Replacement with Pixiv Recommended Images
// @namespace      http://tampermonkey.net/
// @version        1.5.5
// @description    移除B站首页推荐中的所有推广视频广告，包括小火箭🚀，漫画，纪录片等，以及各种正统广告。使用Pixiv推荐图片替换广告内容。需要提前登陆过pixiv账号，不需要Cookies或者账号token。
// @description:en Remove promotional video ads from Bilibili's homepage recommendations, including small rocket 🚀 ads and regular ads. Use Pixiv recommended images to replace the ads. A Pixiv account must be logged in beforehand, but no cookies or account tokens are required.
// @author         RecycleBee
// @match          *://www.bilibili.com/*
// @match          *://www.pixiv.net/*
// @grant          GM_openInTab
// @grant          GM_addValueChangeListener
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_xmlhttpRequest
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/527917/B%E7%AB%99%E5%B9%BF%E5%91%8A%E6%9B%BF%E6%8D%A2%E4%B8%BAPixiv%E6%8E%A8%E8%8D%90%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/527917/B%E7%AB%99%E5%B9%BF%E5%91%8A%E6%9B%BF%E6%8D%A2%E4%B8%BAPixiv%E6%8E%A8%E8%8D%90%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
let randomPage = GM_getValue("randomPage", 42);
let RecUrl = `1000users%E5%85%A5%E3%82%8A%20-%E3%82%B3%E3%82%A4%E3%82%AB%E3%83%84!/illustrations?mode=safe&p=${randomPage}&s_mode=s_tag&type=illust&wlt=3000&hlt=3000&ratio=0.5&ai_type=1`;


(function() {
    'use strict';

    let preloadedImages = [];
    const currentUrl = window.location.href;

    function preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            if (!preloadedImages.some(img => img.src === url)) {
                let img = new Image();
                img.src = url;
                preloadedImages.push(img);
            }
        });
    }


// === 处理 Pixiv 页面 ===

    if (currentUrl.includes("www.pixiv.net/") || currentUrl.includes(RecUrl) ){
        console.log("少女祈祷中...");
        function waitForElements(selector, callback, timeout = 10000) {
            console.log("等待" + selector);
            const startTime = Date.now();
            const checkInterval = 500;

            function check() {
                let elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    callback(elements);
                } else if (Date.now() - startTime < timeout) {
                    setTimeout(check, checkInterval);
                } else {
                    console.warn("超时，未找到目标元素");
                }
            }

            check();
        }

        function closePage() {
            window.close();
        }

        async function fetchAndStorePixivUrls(uniquePixivIDs) {
            let imgUrls = [];
            let additionalData = [];
            let RecimgUrls = GM_getValue("RecimgUrls", []);
            let RecadditionalData = GM_getValue("RecadditionalData", []);

            for (const pixivID of uniquePixivIDs) {
                const apiUrl = `https://www.pixiv.net/ajax/illust/${pixivID}`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();

                    if (data.body && data.body.urls) {
                        let rawImgUrl = data.body.urls.regular.replace(/\\/g, "");
                        let Pminiurl = data.body.urls.mini;
                        const artworkUrl = `https://www.pixiv.net/artworks/${pixivID}`;
                        const username = data.body.userName;


                        const dateMatch = rawImgUrl.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d{2})\/(\d+)/);
                        let thumbUrl = "";
                        let formattedDate = "";
                        let illustTitle = "";
                        let userUrl = "";
                        if (dateMatch) {
                            const [ , year, month, day, hour, minute, second, id] = dateMatch;
                            thumbUrl = `https://i.pixiv.cat/c/360x360_70/img-master/img/${year}/${month}/${day}/${hour}/${minute}/${second}/${id}_p0_square1200.jpg`;
                            formattedDate = `${year}-${month}-${day}`;
                            illustTitle = data.body.title;
                            userUrl = `https://www.pixiv.net/users/${data.body.tags.authorId}`;
                        }

                        let RecimgUrl = rawImgUrl.replace("i.pximg.net/", "i.pixiv.cat/");
                        let miniurl = Pminiurl.replace("i.pximg.net/", "i.pixiv.cat/");

                        if (currentUrl.includes(RecUrl)) {
                            RecimgUrls.push(RecimgUrl);
                            RecadditionalData.push({
                                username,
                                artworkUrl,
                                miniurl
                            });
                        } else {
                            imgUrls.push(thumbUrl || rawImgUrl);
                            additionalData.push({
                                title: illustTitle,
                                artworkUrl,
                                userUrl,
                                date: formattedDate,
                                username,
                            });
                        }
                    }
                } catch (error) {
                    console.error(`获取 pixivID ${pixivID} 信息时报错:`, error);
                }
            }


            if (currentUrl.includes(RecUrl)) {
                GM_setValue("RecimgUrls", RecimgUrls);
                GM_setValue("RecadditionalData", RecadditionalData);
                preloadImages(RecimgUrls);
            } else {
                GM_setValue("pixivImgUrls", imgUrls);
                GM_setValue("pixivAdditionalData", additionalData);
            }
            closePage();
        }

        // 实验功能...
        function getImageMainColorFromPreloaded(img) {
            return new Promise((resolve, reject) => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");

                img.onload = function () {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
                    let r = 0, g = 0, b = 0, count = 0;

                    for (let i = 0; i < imageData.length; i += 4) {
                        r += imageData[i];
                        g += imageData[i + 1];
                        b += imageData[i + 2];
                        count++;
                    }

                    resolve(`rgb(${Math.floor(r / count)}, ${Math.floor(g / count)}, ${Math.floor(b / count)})`);
                };

                img.onerror = () => reject("图片加载失败");
            });
        }



        let Fetching = GM_getValue("isFetchingPixiv", []);
        if (Fetching === false & !currentUrl.includes(RecUrl)) {
            console.log("少女不用祈祷...");
            return;
        }

        console.log(RecUrl);
        if (currentUrl.includes(RecUrl)) {
            console.log("抓取 RecID...");
            GM_setValue("randomPage", Math.floor(Math.random() * 42) + 1);

            waitForElements("div[class*='gqvfWY']", async function(divs) {
                let RecID = new Set();
                setTimeout(() => {
                    divs.forEach(div => {
                        div.querySelectorAll('a[href*="artworks/"]').forEach(anchor => {
                            let match = anchor.href.match(/artworks\/(\d+)/);
                            if (match) {
                                RecID.add(match[1]);
                            }
                        });
                    });

                    let existingRecimgUrls = GM_getValue("RecimgUrls", []);
                    let numToFetch = existingRecimgUrls.length === 0 ? 18 : 9; // 为空抓18，否则抓9
                    let uniquePixivIDs = Array.from(RecID)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, numToFetch);
                    console.log(`抓取 ${numToFetch} 个 ID:`, uniquePixivIDs);
                    fetchAndStorePixivUrls(uniquePixivIDs);

                }, 2000);
            });


        } else {
            waitForElements("div.gtm-toppage-thumbnail-illustration-recommend-works-zone", function(divs) {
                divs.forEach(div => {
                    const observer = new MutationObserver((mutations, obs) => {
                        let anchors = div.querySelectorAll('a[href*="artworks/"]');
                        if (anchors.length > 0) {
                            let pixivIDs = new Set();
                            anchors.forEach(anchor => {
                                let match = anchor.href.match(/artworks\/(\d+)/);
                                if (match) {
                                    pixivIDs.add(match[1]);
                                }
                            });
                            console.log("推荐页抓取的 Pixiv IDs:", Array.from(pixivIDs));
                            obs.disconnect();
                            if (pixivIDs.size > 0) {
                                fetchAndStorePixivUrls(Array.from(pixivIDs)).then(() => {
                                    GM_setValue("pixivFetched", true);
                                    GM_setValue("isFetchingPixiv", false);
                                    closePage();
                                });
                            }
                        }
                    });
                    observer.observe(div, { childList: true, subtree: true });
                });
            });


        }
    }


    // === 处理 Bilibili 页面 ===

    function removeAds() {
        // 1.处理未替换的广告
        document.querySelectorAll('.bili-video-card.is-rcmd').forEach(card => {
            if (!card.classList.contains('enable-no-interest')) {
                let imageLink = card.querySelector('.bili-video-card__image--link');

                if (imageLink) {
                    // 获取父元素的宽度
                    let parentWidth = card.offsetWidth;
                    let parentHeight = parentWidth * (9 / 16);

                    let placeholder = document.createElement("div");
                    placeholder.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 0;
                    padding-top: 56.25%;
                    background: #f4f4f4;
                    border-radius: 8px;
                    border: 1px dashed #ccc;
                    margin: auto;
                `;

                    let textContainer = document.createElement("div");
                    textContainer.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: #888;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    width: 100%;
                `;
                    textContainer.innerText = "🚫 广告已屏蔽";
                    placeholder.appendChild(textContainer);

                    imageLink.replaceWith(placeholder);

                    // 清空文字内容，但保留元素结构，不知道为什么一定得要有字符在innerText，空格还不行。
                    let placeholderText = "\u200B";
                    let titleElement = card.querySelector('.bili-video-card__info--tit');
                    if (titleElement) {
                        let link = titleElement.querySelector('a');
                        if (link) {
                            link.innerText = placeholderText;
                        }
                    }

                    let authorElement = card.querySelector('.bili-video-card__info--author');
                    if (authorElement) authorElement.innerText = placeholderText;

                    let dateElement = card.querySelector('.bili-video-card__info--date');
                    if (dateElement) dateElement.innerText = placeholderText;

                    let creativeAd = card.querySelector('.vui_icon.bili-video-card__info--creative-ad');
                    if (creativeAd) creativeAd.remove();

                    let adInfo = card.querySelector('.bili-video-card__info--ad');
                    if (adInfo) adInfo.remove();


                    isPixivImageLoaded = false;
                    processAdsOrPlaceholders(placeholder);
                }
            }
        });

        // 处理已经替换成占位符的广告封面
        document.querySelectorAll('div').forEach(placeholder => {
            if (placeholder.innerText === "🚫 广告已屏蔽") {
                processAdsOrPlaceholders(placeholder);
            }
        });
    }


    function processAdsOrPlaceholders(element) {
        let pixivImgUrls = GM_getValue("pixivImgUrls", []);
        let additionalData = GM_getValue("pixivAdditionalData", []);
        if (pixivImgUrls.length>0) {
            let imgUrl = pixivImgUrls.shift();
            let { artworkUrl, title, date, username, userUrl} = additionalData.shift();

            if (imgUrl) {
                preloadImages(pixivImgUrls); // 预加载剩余图片

                let img = document.createElement("img");
                img.src = imgUrl;
                img.alt = "Pixiv 图片";
                img.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            `;

                //包裹图片
                let link = document.createElement("a");
                link.href = artworkUrl;
                link.target = "_blank";
                link.style.display = "block";
                link.appendChild(img);

                //图片容器
                let imgContainer = document.createElement("div");
                imgContainer.style.cssText = `
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 56.25%;
                background: #f4f4f4;
                border-radius: 8px;
                overflow: hidden;
            `;

                imgContainer.appendChild(link);
                element.removeAttribute('style');
                element.innerHTML = ""; // 清空原内容
                element.appendChild(imgContainer);

                // 更新其他信息
                let titleContainer = element.closest('.bili-video-card').querySelector('.bili-video-card__info--tit');
                if (titleContainer) {
                    titleContainer.title = title;
                    let titleElement = titleContainer.querySelector('a');
                    if (titleElement) {
                        titleElement.innerText = title;
                        titleElement.href = artworkUrl;
                        titleElement.title = title;
                    }
                }

                let ownerElement = element.closest('.bili-video-card').querySelector('.bili-video-card__info--owner');
                if (ownerElement) ownerElement.href = userUrl;

                let authorElement = element.closest('.bili-video-card').querySelector('.bili-video-card__info--author');
                if (authorElement) {
                    authorElement.innerText = username;
                    authorElement.title = username;
                }

                let dateElement = element.closest('.bili-video-card').querySelector('.bili-video-card__info--date');
                if (dateElement) dateElement.innerText = "· " + date;

                // 删除广告标识
                element.closest('.bili-video-card').querySelectorAll('.vui_icon.bili-video-card__info--creative-ad, .bili-video-card__info--ad, .bili-video-card__info--rcmd-text, .bili-video-card__info--owner__up')
                    .forEach(el => el.remove());

                // 标记 Pixiv 图片已加载
                isPixivImageLoaded = true;

                // 更新存储
                GM_setValue("pixivImgUrls", pixivImgUrls);
                console.log("ID剩余："+pixivImgUrls.length);
                GM_setValue("pixivAdditionalData", additionalData);
            }
            if (pixivImgUrls.length <= minThreshold && !isFetchingPixiv) {
                console.log(`图片少于 ${minThreshold} 张（当前 ${pixivImgUrls.length} 张），重新抓取...`);
                isFetchingPixiv = true;
                GM_setValue("isFetchingPixiv", true)
                GM_setValue("pixivFetched", false);
                GM_openInTab("https://www.pixiv.net/illustration", { active: false, insert: true, setParent: true });

            }
        }
    }



    function removeSpecificElements() {
        document.querySelectorAll('.floor-single-card, .fixed-card, .v-popover-wrap.left-loc-entry, .palette-button-adcard.is-bottom')
            .forEach(element => {
            element.remove();
        });
        document.querySelectorAll('div[data-v-3581b8d4]').forEach(element => {
            if (!element.closest('.feed-card') && element.classList.contains('bili-video-card') && element.classList.contains('is-rcmd') && element.classList.length === 2) {
                element.remove();
            }
        });
        document.querySelectorAll('img.icon[src="https://i0.hdslb.com/bfs/static/jinkela/long/images/eva.png"]')
            .forEach(element => {
            element.remove();
        });
    }


    function hideBarInShadowRoot(root) {
        if (!root) return;

        const barElement = root.querySelector("#bar");
        if (barElement) {
            barElement.style.cssText = "display: none !important;";
            console.log("Found and hidden #bar in shadow DOM.");
        }

        root.querySelectorAll('*').forEach(node => {
            if (node.shadowRoot) {
                hideBarInShadowRoot(node.shadowRoot);
            }
        });
    }

    function removeADsinVideos() {
        document.querySelectorAll('*').forEach(node => {
            if (node.shadowRoot) {
                hideBarInShadowRoot(node.shadowRoot);
            }
        });

        document.querySelectorAll(
            '.video-card-ad-small, .video-page-game-card-small, .activity-m-v1.act-end, .video-page-special-card-small, .activity-m-v1.act-now, .ad-report.ad-floor-exp.left-banner, .ad-report.ad-floor-exp.right-bottom-banner, .v-popover-wrap.left-loc-entry, .slide-ad-exp'
        ).forEach(element => {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        });

    }


    function replaceCarouselImages() {
        let RecimgUrls = GM_getValue("RecimgUrls", []);
        let RecadditionalData = GM_getValue("RecadditionalData", []);
        let NumberCheck = 9;

        if (RecimgUrls.length < NumberCheck || RecadditionalData.length < NumberCheck) {
            console.log(`图片或数据不足 ${NumberCheck} 条`);
            return;
        }

        let slides = document.querySelectorAll(".vui_carousel__slides .vui_carousel__slide");
        let usedUrls = new Set(); // 记录使用过的 URL

        slides.forEach(slide => {
            let carouselArea = slide.querySelector(".carousel-area");
            let carouselItem = slide.querySelector("a.carousel-item");

            if (carouselArea) {
                let index = parseInt(carouselArea.getAttribute("data-index"), 10); // 获取 data-index 值
                if (!isNaN(index) && index >= 0 && index < NumberCheck) { // 只处理 0-8
                    let picture = carouselArea.querySelector("picture");
                    if (picture) {
                        let sources = picture.querySelectorAll("source");
                        let img = picture.querySelector("img");
                        let newUrl = RecimgUrls[index];

                        sources.forEach(source => {
                            source.srcset = newUrl;
                        });

                        if (img) {
                            img.src = newUrl;

                            // 让图片显示为16:9，并使用 object-fit: cover 裁剪
                            img.style.width = "100%";
                            img.style.height = "100%";
                            img.style.aspectRatio = "16 / 9";
                            img.style.objectFit = "cover"; // 确保填充并裁剪溢出部分
                        }

                        usedUrls.add(newUrl); // 记录使用过的 URL
                        console.log(`已替换第 ${index} 张图片 -> ${newUrl}`);
                    }

                    // 替换 href
                    if (carouselItem) {
                        let newHref = RecadditionalData[index].artworkUrl;
                        carouselItem.href = newHref;
                        carouselItem.target = "_blank";
                    }
                }
            }
        });

        // 删除已使用的图片
        RecimgUrls = RecimgUrls.filter(url => !usedUrls.has(url));
        GM_setValue("RecimgUrls", RecimgUrls);
        carouselImgLoaded = true;
    }

    function normalization(title) { // 空格
    return title.replace(/\s+/g, ' ').trim();
    }


    async function replaceFooterTitle() {
        let indexToTitleMap = new Map(); //data-index->alt标题
        let carouselAreas = document.querySelectorAll('.carousel-area');

        carouselAreas.forEach(area => {
            let dataIndex = area.getAttribute('data-index');
            let img = area.querySelector('.carousel-inner__img img');
            if (img && dataIndex !== null) {
                let title = normalization(img.getAttribute('alt') || "");
                indexToTitleMap.set(title, parseInt(dataIndex, 10));
            }
        });

        console.log("索引映射:", indexToTitleMap);

        let RecadditionalData = await GM_getValue("RecadditionalData", []);

        if (!Array.isArray(RecadditionalData) || RecadditionalData.length < 9) {
            console.error("RecadditionalData为空或长度不足，刷新可解决:", RecadditionalData);
            return;
        }

        let footerTitle = document.querySelector('.carousel-footer-title span');
        let footerLink = document.querySelector('.carousel-footer-title a');

        if (!footerTitle || !footerLink) {
            console.error("未找到大广告的标题");
            return;
        }

        function updateFooterTitle() {
            let currentText = footerTitle.innerText.trim();
            if (indexToTitleMap.has(currentText)) {
                let matchedIndex = indexToTitleMap.get(currentText);

                if (matchedIndex >= 0 && matchedIndex < RecadditionalData.length) {
                    let newText = RecadditionalData[matchedIndex].username;
                    let newHref = RecadditionalData[matchedIndex].artworkUrl;

                    footerTitle.innerText = newText;
                    footerLink.href = newHref;
                    footerLink.target = "_blank"; // 确保新链接在新标签打开
                }
            }
        }


        updateFooterTitle();
        let observer = new MutationObserver(updateFooterTitle);

        observer.observe(footerTitle, { childList: true, subtree: true });
    }


    console.log("Bilibili运行，检测是否需要抓取图片...");

    // Bilibili首页检测
    if (!currentUrl.match(/^https:\/\/www\.bilibili\.com\/(\?|$)/)) {
        console.log("当前页面不是B站首页");
        if (!currentUrl.match(/^https:\/\/www\.bilibili\.com\/video\/(\?|$)/)) {
            const observer = new MutationObserver(removeADsinVideos);
            observer.observe(document.body, { childList: true, subtree: true });
            console.log("当前页面不是B站首页，停止执行。")}
        return
    }

    let isFetchingPixiv = false;
    let carouselImgLoaded = false;

    let RecDataCeck = GM_getValue("RecadditionalData", []);
    RecDataCeck.splice(0, 9); // 删除前 9 个元素
    GM_setValue("RecadditionalData", RecDataCeck);
    replaceCarouselImages();
    replaceFooterTitle();
    GM_openInTab(`https://www.pixiv.net/tags/`+RecUrl, { active: false, insert: true, setParent: true });

    let pixivImgUrls = GM_getValue("pixivImgUrls", []);
    let minThreshold = 3; // 设定最少剩余图片数，低于这个值就触发抓取

    if (pixivImgUrls.length <= minThreshold && !isFetchingPixiv) {
        console.log(`图片少于 ${minThreshold} 张，重新抓取...`);
        isFetchingPixiv = true;
        GM_setValue("isFetchingPixiv", true);
        let tab = GM_openInTab("https://www.pixiv.net/illustration", { active: false, insert: true, setParent: true });
    }



    // 让火焰净化一切！！！

    removeSpecificElements();
    GM_addValueChangeListener("pixivFetched", (name, oldValue, newValue, remote) => {
        if (newValue === true) {
            console.log("图片已抓取，等待更新广告...");
            isPixivImageLoaded = false;
            isFetchingPixiv = false;
            GM_setValue("isFetchingPixiv", false);

            let observer = new MutationObserver(() => {
                if (document.querySelector('.bili-video-card')) {
                    removeAds();
                    observer.disconnect(); // 只执行一次
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                if (document.body) {
                    removeAds();
                } else {
                    console.warn("DOM未加载");
                    setTimeout(removeAds, 500);
                }
            }, 500);
        }
    });

    let isPixivImageLoaded = false;
    removeAds();


    // 监听 DOM
    let RecadditionalData = GM_getValue("RecadditionalData", []);
    GM_setValue("RecadditionalData", RecadditionalData); // 更新存储
    let observer = new MutationObserver(() => {
        if (!carouselImgLoaded) {

            replaceCarouselImages();
            replaceFooterTitle();
        }
        removeSpecificElements();
        removeAds();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();