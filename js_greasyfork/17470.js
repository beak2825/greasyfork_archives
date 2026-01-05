// ==UserScript==
// @name           Direct Image Link E621/926 (AI-fix)
// @version        2025.08.23
// @description    Рипалка ссылок / имён / номеров картинок
// @match          http*://e621.net/posts*
// @match          http*://e621.net/pool*
// @match          http*://e621.net/favorites*
// @match          http*://e926.net/posts*
// @match          http*://e926.net/pool*
// @match          http*://e926.net/favorites*
// @author         Rainbow-Spike
// @namespace      https://greasyfork.org/users/7568
// @homepage       https://greasyfork.org/ru/users/7568-rainbow-spike
// @icon           https://www.google.com/s2/favicons?domain=e621.net
// @grant          none
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/17470/Direct%20Image%20Link%20E621926%20%28AI-fix%29.user.js
// @updateURL https://update.greasyfork.org/scripts/17470/Direct%20Image%20Link%20E621926%20%28AI-fix%29.meta.js
// ==/UserScript==

// Получаем список элементов
const postList = document.querySelectorAll('.thumbnail');

if (postList.length > 0) {
    // Конфигурация параметров
    const config = {
        mode: 2, // 0 - номера постов, 1 - имена файлов, 2 - полные ссылки
        filters: {
            useNegativeList: 1,
            usePositiveList: 1,
            filterDownloaded: 1,
            showTopList: 1,
            showUnderImage: 1
        },
        tags: {
            negative: /\Wcensored|gore|male\/male/,
            positive: /\Wvulva\W?|female_on_top|tribadism|camel_toe|vaginal_mastu/
        },
        styles: {
            negative: 'opacity: 0.5; border: 3px dotted red;',
            neutral: 'opacity: 0.5; border: 3px dashed gray;',
            downloaded: 'opacity: 0.5; border: 16px double green;',
            topList: 'columns: 300px; font-size: 40%; line-height: .25em; max-height: 100px;',
            underImage: 'word-wrap: anywhere;'
        },
	downloadedMD5: JSON.parse(localStorage.getItem("downloadedMD5")) || [ ], // список скачанного, ТРЕБУЕТСЯ ЮЗЕРСКРИПТ "Direct Image Link E621/926 filelist"
        domNodes: {
            topContainer: document.body,
            newContainer: document.createElement('div')
        }
    };

    // Основная функция обработки
    function processPost(postElement) {
        const { filters, tags, styles, downloadedMD5 } = config;
        
        // Извлечение данных
        const postTags = postElement.getAttribute('data-tags');
        const src = postElement.getAttribute('data-file-url');
        const name = src.split('/').pop();
        const [md5, ext] = name.split('.');
        const num = postElement.getAttribute('data-id');
        
        // Фильтрация
        let isValid = true;
        
        if (filters.useNegativeList && tags.negative.test(postTags)) {
            postElement.style = styles.negative;
            isValid = false;
        }
        
        if (isValid && filters.usePositiveList && !tags.positive.test(postTags)) {
            postElement.style = styles.neutral;
            isValid = false;
        }
        
        if (isValid && filters.filterDownloaded && downloadedMD5.includes(md5)) {
            postElement.style = styles.downloaded;
            isValid = false;
        }
        
        // Формирование вывода
        if (isValid) {
            const insertTopContent = getInsertTopContent(md5, num, src, ext);
	    const insertUnderContent = getInsertUnderContent(md5, num);
            
            if (filters.showTopList) {
                config.domNodes.newContainer.innerHTML += `<a href="${src}">${insertTopContent}</a><br>`;
            }
            
            if (filters.showUnderImage) {
                postElement.innerHTML += `<a href="${src}" style="${styles.underImage}">${insertUnderContent}</a>`;
            }
        }
    }

    // Получение содержимого для вставки
    function getInsertTopContent(md5, num, src, ext) {
        switch (config.mode) {
            case 0:
                return `${num}.${ext}`;
            case 1:
                return `${md5}.${ext}`;
            case 2:
                return src;
            default:
                return '';
        }
    }
    function getInsertUnderContent(md5, num) {
        switch (config.mode) {
            case 0:
                return num;
            case 1:
                return md5;
            case 2:
                return md5;
            default:
                return '';
        }
    }

    // Обработка всех постов
    postList.forEach(processPost);

    // Функция выделения блока
    function selectBlock(node) {
        try {
            const range = document.createRange();
            range.selectNode(node);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        } catch (error) {
            console.error('Ошибка при выделении элемента:', error);
        }
    }

    // Добавление верхнего списка
    if (config.filters.showTopList) {
        config.domNodes.newContainer.style = config.styles.topList;
        config.domNodes.topContainer.insertBefore(
            config.domNodes.newContainer,
            config.domNodes.topContainer.firstChild
        );
        selectBlock(config.domNodes.newContainer);
    }
}