// ==UserScript==
// @name         nhentai 收藏夾分類器
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Categorize nhentai favorites by title prefix across multiple pages
// @author       hitenlxy
// @license      MIT
// @match        https://nhentai.net/favorites/
// @match        https://nhentai.net/favorites/?page=*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/499038/nhentai%20%E6%94%B6%E8%97%8F%E5%A4%BE%E5%88%86%E9%A1%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/499038/nhentai%20%E6%94%B6%E8%97%8F%E5%A4%BE%E5%88%86%E9%A1%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('nhentai Favorites Categorizer script is running');

    GM_addStyle(`
        #expandButton { position: fixed; right: 20px; bottom: 20px; z-index: 1001; padding: 10px; background-color: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 5px; }
        #category-container, #links-container { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: black; color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(255,255,255,0.5); max-width: 80%; max-height: 80%; overflow-y: auto; z-index: 1000; }
        .category-item, .link-item { margin: 10px 0; padding: 5px; background: #333; border-radius: 5px; cursor: pointer; }
        .link-item a { text-decoration: none; color: white; }
        .close-button { position: absolute; top: 10px; right: 10px; width: 30px; height: 30px; background: #ff3232; color: white; border: none; border-radius: 50%; cursor: pointer; display: flex; justify-content: center; align-items: center; font-size: 20px; }
        .back-button { display: block; margin: 10px 0; padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .container-title { margin-top: 0; padding-right: 40px; }
    `);

    const extractCategory = title => title.match(/^\[(.*?)\]/) ? title.match(/^\[(.*?)\]/)[1] : '其他';

    const createContainer = id => {
        const container = document.createElement('div');
        container.id = id;
        document.body.appendChild(container);
        return container;
    };

    const fetchPage = url => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: response => response.status === 200 ? resolve(response.responseText) : reject('Failed to fetch page'),
            onerror: reject
        });
    });

    async function fetchAllPages() {
        let allGalleries = [];
        let page = 1;
        while (true) {
            try {
                const html = await fetchPage(`https://nhentai.net/favorites/?page=${page}`);
                const galleries = Array.from(new DOMParser().parseFromString(html, 'text/html').querySelectorAll('.gallery'))
                    .map(gallery => ({
                        title: gallery.querySelector('.caption').textContent,
                        href: gallery.querySelector('a').href
                    }));
                if (galleries.length === 0) break;
                allGalleries = allGalleries.concat(galleries);
                page++;
            } catch (error) {
                console.error(`Error fetching page ${page}:`, error);
                break;
            }
        }
        GM_setValue('allGalleries', JSON.stringify(allGalleries));
        showCategories();
    }

function showCategories() {
    const allGalleries = JSON.parse(GM_getValue('allGalleries') || '[]');
    const categories = allGalleries.reduce((acc, gallery) => {
        const category = extractCategory(gallery.title);
        if (!acc[category]) acc[category] = [];
        acc[category].push(gallery);
        return acc;
    }, {});

    // 將分類按照書籍數量降序排序
    const sortedCategories = Object.keys(categories).sort((a, b) => categories[b].length - categories[a].length);

    const container = createContainer('category-container');
    container.style.display = 'block';
    container.innerHTML = `
        <h2 class="container-title">分類</h2>
        <button class="close-button">×</button>
        ${sortedCategories.map(category =>
            `<div class="category-item" data-category="${category}">${category} (${categories[category].length})</div>`
        ).join('')}
    `;

    container.querySelectorAll('.category-item').forEach(item => {
        item.onclick = () => showCategoryLinks(item.dataset.category, categories[item.dataset.category]);
    });
    container.querySelector('.close-button').onclick = () => container.style.display = 'none';
}


    function showCategoryLinks(category, galleries) {
        const filteredGalleries = galleries.filter(gallery => extractCategory(gallery.title) === category);
        const container = createContainer('links-container');
        container.style.display = 'block';
        container.innerHTML = `
            <h2 class="container-title">${category}</h2>
            <button class="close-button">×</button>
            ${filteredGalleries.map(gallery => `<div class="link-item"><a href="${gallery.href}" target="_blank">${gallery.title}</a></div>`).join('')}
            <button class="back-button">返回分類</button>
            <button class="expand-all-links-button">一鍵打開全部書籍</button>
        `;

        container.querySelector('.close-button').onclick = () => container.style.display = 'none';
        container.querySelector('.back-button').onclick = () => {
            container.style.display = 'none';
            document.getElementById('category-container').style.display = 'block';
        };
        container.querySelector('.expand-all-links-button').onclick = () => openAllLinks(filteredGalleries);
    }

    function openAllLinks(galleries) {
        galleries.forEach(gallery => window.open(gallery.href, '_blank'));
    }

    const button = document.createElement('button');
    button.id = 'expandButton';
    button.textContent = '展開分類';
    button.onclick = () => GM_getValue('allGalleries') ? showCategories() : fetchAllPages();
    document.body.appendChild(button);
})();
