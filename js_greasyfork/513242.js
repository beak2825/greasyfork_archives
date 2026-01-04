// ==UserScript==
// @name         即刻web动态按点赞排序jike_post_sort_by_likes
// @name:zh-CN   即刻web动态按点赞排序
// @name:en      Jike Posts Sort by Likes
// @name:es      Ordenar publicaciones de Jike por Me gusta
// @name:ja      JIKEの投稿をいいね順に並べ替え
// @name:ko      JIKE 게시물 좋아요순 정렬
// @name:ru      Сортировка постов Jike по лайкам
// @name:pt-BR   Classificar posts do Jike por curtidas
// @name:ar      ترتيب منشورات Jike حسب الإعجابات
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  对即刻web用户主页的动态进行点赞数降序排序，包括优化的自动加载
// @description:zh-CN  对即刻web用户主页的动态进行点赞数降序排序，包括优化的自动加载
// @description:en  Sort posts on Jike user profile by number of likes in descending order, with optimized auto-loading
// @description:es  Ordena las publicaciones en el perfil de usuario de Jike por número de Me gusta en orden descendente, con carga automática optimizada
// @description:ja  JIKEユーザープロフィールの投稿をいいね数で降順ソート、自動読み込み機能付き
// @description:ko  JIKE 사용자 프로필의 게시물을 좋아요 수에 따라 내림차순으로 정렬하며 자동 로딩 최적화 포함
// @description:ru  Сортировка постов в профиле пользователя Jike по количеству лайков в порядке убывания с оптимизированной автозагрузкой
// @description:pt-BR  Classifica as postagens no perfil do usuário Jike por número de curtidas em ordem decrescente, com carregamento automático otimizado
// @description:ar  ترتيب المنشورات في الملف الشخصي لمستخدم Jike حسب عدد الإعجابات بترتيب تنازلي، مع تحميل تلقائي محسّن
// @match        https://web.okjike.com/u/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513242/%E5%8D%B3%E5%88%BBweb%E5%8A%A8%E6%80%81%E6%8C%89%E7%82%B9%E8%B5%9E%E6%8E%92%E5%BA%8Fjike_post_sort_by_likes.user.js
// @updateURL https://update.greasyfork.org/scripts/513242/%E5%8D%B3%E5%88%BBweb%E5%8A%A8%E6%80%81%E6%8C%89%E7%82%B9%E8%B5%9E%E6%8E%92%E5%BA%8Fjike_post_sort_by_likes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalContent;
    let sortedContent;

    // 添加排序按钮
    function addSortButton() {
        const tabList = document.querySelector('.react-tabs__tab-list');
        if (tabList && !document.getElementById('sort-button')) {
            const sortButton = document.createElement('li');
            sortButton.id = 'sort-button';
            sortButton.textContent = '按点赞数';
            sortButton.className = 'react-tabs__tab';
            sortButton.role = 'tab';
            sortButton.setAttribute('aria-selected', 'false');
            sortButton.setAttribute('aria-disabled', 'false');
            sortButton.setAttribute('tabindex', '-1');
            sortButton.style.cursor = 'pointer';
            sortButton.addEventListener('click', loadAllAndSort);

            tabList.appendChild(sortButton);
            return true; // 成功添加按钮，返回 true
        }
        return false; // 未找到目标元素，返回 false
    }

    // 禁用媒体加载
    function disableMediaLoading() {
        const style = document.createElement('style');
        style.textContent = `
            img, video, iframe { display: none !important; }
            [style*="background-image"] { background-image: none !important; }
        `;
        document.head.appendChild(style);
        return style;
    }

    // 恢复媒体加载
    function enableMediaLoading(style) {
        style.remove();
    }

    // 优化的自动下拉加载所有帖子
    function loadAllPosts() {
        return new Promise((resolve) => {
            const postContainer = document.querySelector('#react-tabs-1');
            let lastPostCount = 0;
            let noChangeCount = 0;
            const maxScrollAttempts = 30; // 最大滚动尝试次数
            let scrollAttempts = 0;

            function scroll() {
                if (scrollAttempts >= maxScrollAttempts) {
                    console.log('达到最大滚动次数，停止加载');
                    resolve();
                    return;
                }

                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(() => {
                    const currentPostCount = postContainer.querySelectorAll('article').length;
                    console.log(`当前帖子数: ${currentPostCount}, 滚动次数: ${scrollAttempts + 1}/${maxScrollAttempts}`);

                    if (currentPostCount === lastPostCount) {
                        noChangeCount++;
                        if (noChangeCount >= 2) {
                            console.log('连续2次没有新内容加载，认为已加载完毕');
                            resolve();
                            return;
                        }
                    } else {
                        noChangeCount = 0;
                        lastPostCount = currentPostCount;
                    }
                    scrollAttempts++;
                    scroll();
                }, 1000); // 固定延迟1秒
            }

            scroll();
        });
    }

    // 获取并排序动态
    function sortPosts() {
        const postContainer = document.querySelector('#react-tabs-1');
        if (!postContainer) return;

        const postList = postContainer.querySelectorAll('div > div > div > div > div > article');
        console.log(`开始排序，共有 ${postList.length} 篇帖子`);

        let totalLikes = 0;
        const sortedPosts = Array.from(postList).sort((a, b) => {
            const likeCountA = parseInt(a.querySelector("div.flex.flex-col.flex-auto.w-full.animate-show.min-w-0 > div.flex.flex-col.items-stretch > div.flex.flex-row.mt-\\[13px\\].text-tint-icon-gray.text-body-3.font-medium.h-6 > div:nth-child(1) > span")?.textContent) || 0;
            const likeCountB = parseInt(b.querySelector("div.flex.flex-col.flex-auto.w-full.animate-show.min-w-0 > div.flex.flex-col.items-stretch > div.flex.flex-row.mt-\\[13px\\].text-tint-icon-gray.text-body-3.font-medium.h-6 > div:nth-child(1) > span")?.textContent) || 0;
            totalLikes += likeCountA;
            return likeCountB - likeCountA;
        });

        // 创建一个新的容器来存放排序后的帖子
        sortedContent = document.createElement('div');
        sortedPosts.forEach(post => {
            // 直接使用原始节点而不是克隆节点
            sortedContent.appendChild(post);
        });

        updateStats(postList.length, totalLikes);
        console.log('排序完成');
    }

    // 修改 updateStats 函数
    function updateStats(postCount, likeCount) {
        const statsContainer = document.querySelector("#__next > div > div > div.sc-bdvvtL.sc-gsDKAQ.Normal___StyledFlex-sc-1jlm27z-0.dQqjSa.hIxhWw.cHlYvS > div > div > div.flex.flex-col.bg-bg-body-1.overflow-hidden.relative > div.text-tint-primary.flex.flex-row.justify-between.items-start.px-2.pt-4.sm\\:px-4.sm\\:pt-4.md\\:px-\\[25px\\].md\\:pt-4.z-10 > div.flex.flex-col.relative.space-y-\\[13px\\] > div.flex.space-x-2");

        if (statsContainer) {
            let statsElement = document.getElementById('stats-element-top');
            if (!statsElement) {
                statsElement = document.createElement('div');
                statsElement.id = 'stats-element-top';
                statsElement.className = 'flex-shrink-0 rounded-full h-6 text-web-body-4 text-tint-primary bg-bg-on-body-2 flex items-center justify-center py-1 px-2 bg-bg-on-body-2 text-tint-primary';
                statsElement.style.backgroundColor = 'var(--bg-on-body-2)';
                statsContainer.appendChild(statsElement);
            }
            statsElement.textContent = `${postCount}贴/ ${likeCount}赞`;
        }

    }

    // 加载所有帖子并排序
    async function loadAllAndSort() {
        const button = document.getElementById('sort-button');
        button.setAttribute('aria-selected', 'true');
        button.setAttribute('aria-disabled', 'true');
        button.textContent = '正在加载...';

        // 禁用媒体加载
        const style = disableMediaLoading();

        console.log('开始加载所有帖子');
        await loadAllPosts();
        console.log('所有帖子加载完成，开始排序');
        sortPosts();

        // 直接替换原始内容
        const currentContainer = document.querySelector('#react-tabs-1');
        currentContainer.innerHTML = '';
        currentContainer.appendChild(sortedContent);

        button.setAttribute('aria-disabled', 'false');
        button.textContent = '按点赞数';
        window.scrollTo(0, 0); // 滚动回顶部

        // 恢复媒体加载
        enableMediaLoading(style);
        console.log('媒体加载已恢复');
    }

    // 监听页面变化
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    addSortButton();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 添加返回顶部按钮
    function addBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'back-to-top-button';
        backToTopButton.textContent = '返回顶部';
        backToTopButton.style.position = 'fixed';
        backToTopButton.style.bottom = '50px';
        backToTopButton.style.right = '30px';
        backToTopButton.style.zIndex = '1000';
        backToTopButton.style.padding = '10px';
        backToTopButton.style.borderRadius = '8px';
        backToTopButton.style.backgroundColor = '#D3D3D3';
        backToTopButton.style.color = '#fff';
        backToTopButton.style.border = 'none';
        backToTopButton.style.cursor = 'pointer';
        backToTopButton.style.display = 'block'; // 默认展示按钮

        // 点击事件，滚动到顶部
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(backToTopButton);
    }

    // 初始化
    function init() {
        addSortButton();

        observePageChanges();

        // 添加返回顶部按钮
        addBackToTopButton();

        console.log('即刻动态点赞数排序脚本已初始化');
    }

    // 页面加载完成后执行初始化
    window.addEventListener('load', init);
})();
