// ==UserScript==
// @name B++
// @name:zh-CN B艹：必应搜索页面大修
// @name:en B++: Bing Search Page Overhaul
// @namespace Bing Plus Plus
// @version 3.0.1
// @description:zh-CN 移除必应搜索页面大量元素，去除网页 logo，改成双列瀑布流结果，百度贴吧自动正确跳转，自动连续到下一页 (已优化运行速度)
// @description:en Remove a large number of elements on the Bing search page, remove the webpage logo, change to a two-column waterfall layout for the results, ensure Baidu Tieba automatically redirects correctly, and automatically continue to the next page. (Performance optimized)
// @author Yog-Sothoth
// @match https://*.bing.com/search*
// @grant GM_addStyle
// @license MIT
// @description Remove the random recommendations, bottom bar, sidebar, microphone, and search optimization from the Bing search page. Remove the website logo and switch to a dual-column search result layout. Automatically redirect to the correct Baidu Tieba page. 移除必应搜索页面莫名其妙的推荐、底部栏、侧边栏、麦克风、优化搜索等，去除网页logo，改成双列搜索结果，百度贴吧自动正确跳转
// @downloadURL https://update.greasyfork.org/scripts/530608/B%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/530608/B%2B%2B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function throttle(func, limit) {
        let lastRan;
        let lastTimer;
        return function() {
            const context = this;
            const args = arguments;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastTimer);
                lastTimer = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    function redirectTowww4IfNeeded() {
        const urlObj = new URL(window.location.href);
        if (/^(cn\.)/.test(urlObj.hostname)){
            window.location.replace(`https://www4.${urlObj.hostname.replace(/^(cn\.)/, '')}${urlObj.pathname}${urlObj.search}`);
        }
    }

    redirectTowww4IfNeeded();

    function removeElement(selector, context = document) {
        const elements = context.querySelectorAll(selector);
        elements.forEach(element => element.remove());
    }

    function replace(context = document) {
        const bContent = context.getElementById('b_content') || context;
        let as = bContent.querySelectorAll('.b_algo h2 a');
        let as2 = bContent.querySelectorAll('.b_algo .b_tpcn .tilk');

        if (as.length === 0 || as2.length === 0 || as.length !== as2.length) {
            return;
        }

        for (let i = 0; i < as.length; i++) {
            let url = as[i]?.getAttribute('href');
            if (url) {
                 let new_url = url.replace(/jump2\.bdimg|jump\.bdimg/, 'tieba.baidu');
                 as[i].setAttribute('href', new_url);
                 as2[i].setAttribute('href', new_url);
            }
        }
    }

const css = `
    #b_context {
        display: none !important;
        width: 0 !important;
        min-width: 0 !important;
        max-width: 0 !important;
    }

    #b_content {
        padding: 0 !important;
        margin-top: 40px !important;
        width: 100% !important;
        max-width: none !important;
    }

    #b_results {
        display: flex !important;
        flex-wrap: wrap !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 5px 30px 30px 30px !important;
        box-sizing: border-box !important;
    }

    #b_content #b_results > li.b_algo {
        box-sizing: border-box !important;
        width: 47.5% !important;
        margin-right: 3% !important;
        margin-bottom: 30px !important;
        float: none !important;
        list-style: none !important;
        margin-left: 0 !important;
        padding-left: 0 !important;
        min-height: 1px !important;
    }

    #b_content #b_results > li.b_algo:nth-child(2n) {
        margin-right: 0 !important;
    }

    .b_pag,
    .b_ans {
        width: 100% !important;
        margin-right: 0 !important;
        order: 9999;
    }

    #b_results .ContentItem {
        display: inline-flex !important;
        flex-wrap: wrap !important;
        width: 100% !important;
    }
    #b_results .MainContent_Sub_Left_MainContent {
        max-width: 100% !important;
    }
`;
GM_addStyle(css);

    const elementsToRemove = [
        '.b_ans', '.b_pag', '.b_ans .b_mop', '.b_vidAns', '.b_rc_gb_sub.b_rc_gb_sub_section',
        '.b_rc_gb_scroll', '.b_msg', '.b_footer', '.b_phead_sh_link',
        '.b_sh_btn-io', '#id_mobile', '[aria-label="更多结果"]', '.b_algoRCAggreFC',
        '.b_factrow b_twofr', '[id^="mic_"]', '[class="tpic"]',
        '[class="b_vlist2col b_deep"]', '[class="b_deep b_moreLink "]',
        '.b_algo b_vtl_deeplinks', '[class="tab-head HeroTab"]',
        '[class="tab-menu tab-flex"]', '[class="b_deepdesk"]',
        '[class^="b_algo b_algoBorder b_rc_gb_template b_rc_gb_template_bg_"]',
        '[class="sc_rf"]', '[class="b_algospacing"]', '#b_pole',
        '.b_caption.b_rich', '.b_ad.b_adMiddle', '.b_ad.b_adBottom',
        '.b_imagePair.wide_wideAlgo .inner', '.b_imagePair.wide_wideAlgo[rel="dns-prefetch"]','[class="b_results_eml"]','[class="b_slidebar"]','[class="b_inline_ajax_rs"]','[class="b_ad b_adTop"]',
        '#b_context', '.b_logo'
    ];

    function updateClassForBAlgoElements() {
        const bContent = document.getElementById('b_results');
        if (bContent) {
            for (let i = 0; i < bContent.children.length; i++) {
                const element = bContent.children[i];
                if (element.classList.contains('b_algo') && element.classList.contains('b_rc_gb_template')) {
                    element.classList.remove(...[...element.classList].filter(cls => cls.startsWith('b_rc_gb_template_bg_')));
                    if (!element.classList.contains('b_algo')) {
                         element.classList.add('b_algo');
                    }
                }
            }
        }
    }

    (function cleanCurrentUrl() {
        const urlObj = new URL(window.location.href);
        const params = urlObj.searchParams;
        const keepParams = new Set(['q', 'first']);

        for (const key of [...params.keys()]) {
            if (!keepParams.has(key)) {
                params.delete(key);
            }
        }

        const newUrl = urlObj.origin + urlObj.pathname + urlObj.search;
        window.history.replaceState(null, '', newUrl);
    })();

    function processBingSearchPage() {
        const urlParams = new URLSearchParams(window.location.search);
        let first = parseInt(urlParams.get('first'), 10) || 1;
        const query = urlParams.get('q');
        const resultsContainer = document.getElementById('b_results');

        if (!query || !resultsContainer) {
            return;
        }

        let isFetching = false;

        if (first === 1) {
            first = 11;
        } else {
            first += 10;
        }

        const baseUrl = `${window.location.origin}${window.location.pathname}`;

        const throttledScrollHandler = throttle(() => {
            if (!isFetching && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 2400)) {
                isFetching = true;

                fetchResults(first).then(() => {
                    first += 10;
                    isFetching = false;
                }).catch(() => {
                    isFetching = false;
                });
            }
        }, 300);

        window.addEventListener('scroll', throttledScrollHandler);

        function fetchResults(pageFirst) {
            const searchParams = new URLSearchParams();
            searchParams.set('q', query);
            searchParams.set('first', pageFirst);

            urlParams.forEach((value, key) => {
                if (key !== 'q' && key !== 'first') {
                     searchParams.set(key, value);
                }
            });

            return fetch(`${baseUrl}?${searchParams.toString()}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const newResultsContainer = doc.getElementById('b_results');
                    if (!newResultsContainer) return;

                    const newResults = newResultsContainer.querySelectorAll('.b_algo');
                    if (newResults.length === 0) return;

                    const fragment = document.createDocumentFragment();

                    newResults.forEach(result => {
                        const cloned = result.cloneNode(true);
                        cloned.style.opacity = '0';
                        cloned.style.transition = 'opacity 0.5s ease';
                        fragment.appendChild(cloned);
                    });

                    const anchorSelector = 'style[data-bm="15"]';
                    const targetAnchor = document.body.querySelector(anchorSelector);

                    if (targetAnchor) {
                        targetAnchor.before(fragment);
                    } else {
                        resultsContainer.appendChild(fragment);
                    }

                    document.body.querySelectorAll('.b_algo[style*="opacity: 0"]').forEach(cloned => {
                        requestAnimationFrame(() => {
                            cloned.style.opacity = '1';
                        });
                    });
                })
                .catch(error => {
                    throw error;
                });
        }
    }

    function cleanWideWideAlgo(context = document) {
        const captionCards = context.querySelectorAll('.captionMediaCard');
        captionCards.forEach(card => {
            const wideElements = card.querySelectorAll('.b_imagePair.wide_wideAlgo');
            wideElements.forEach(elem => {
                elem.classList.remove('wide_wideAlgo');
            });
        });
    }

    updateClassForBAlgoElements();
    elementsToRemove.forEach(selector => removeElement(selector, document));
    replace();
    processBingSearchPage();
    cleanWideWideAlgo();

    const observer = new MutationObserver(mutations => {
        elementsToRemove.forEach(selector => removeElement(selector, document));

        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    cleanWideWideAlgo(node);
                    replace(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const _pushState = window.history.pushState;
    window.history.pushState = function () {
        replace();
        return _pushState.apply(this, arguments);
    };
})();

// 新增的 Bing URL 解码功能
(async function() {
    'use strict';
    let throttle_callback;

    function throttle(callback, limit) {
        return function () {
            const context = this, args = arguments;
            clearTimeout(throttle_callback);
            throttle_callback = setTimeout(function () {
                callback.apply(context, args);
            }, limit);
        };
    }

    function decodeUtf8Base64Url(encodedUrl) {
        const bytes = Uint8Array.from(atob(encodedUrl), c => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
    }

    if (/https?:\/\/(?:[\w]+\.)?bing\.com\//.test(location.href)) {

        const observer = new MutationObserver(throttle((mutations, obs) => {
            document.querySelectorAll('[href^="https://www.bing.com/ck/a"]').forEach(element => {
                const match = element.href.match(/&u=([^&]+)/);
                const encodedUrl = match[1].slice(2);
                if (match && /^[A-Za-z0-9=_-]+$/.test(encodedUrl)) {
                    try {
                        const decodedUrl = decodeUtf8Base64Url(encodedUrl
                                                               .replace(/_/g, "/")
                                                               .replace(/-/g, "+"));
                        element.href = decodedUrl;
                    } catch (e) {
                        console.info('Bing URL Decode Error:', encodedUrl);
                    }
                }
            });
        }, 2));

        const config = { childList: true, subtree: true };
        observer.observe(document.body, config);
    }
})();