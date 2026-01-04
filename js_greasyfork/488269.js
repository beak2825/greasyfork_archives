// ==UserScript==
// @name         Show Film Info in the Pirate Bay
// @name:zh-cn   海盗湾增强，显示电影信息
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Enhance The Pirate Bay by displaying film ratings and thumbnails next to film titles, with title preprocessing for better accuracy.
// @description:zh-cn  这是一个油猴插件用于使用TMDB API在海盗湾中展示海报、评分和翻译。
// @author       X-T-E-R
// @match      *://*.thepiratebay3.to/*
// @match      *://prbay.*/*
// @match      *://prbay.top/*
// @match      *://prbay.xyz/*
// @match      *://prbay.online/*


// @homepage     https://github.com/X-T-E-R/ShowFilmInfo
// @license      MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/488269/Show%20Film%20Info%20in%20the%20Pirate%20Bay.user.js
// @updateURL https://update.greasyfork.org/scripts/488269/Show%20Film%20Info%20in%20the%20Pirate%20Bay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = 'd8d9b241a36a8850e3df6a1ba60c6524';

    const defaultKeywords = '2160p|1080p|720p|480p|BluRay|X264|AC3|HDTS|ADFREE|HDRip|DVDScr|WEBRip|BRRip|DVDRip';
    let keywords = localStorage.getItem('filmKeywords') || defaultKeywords;

    // Create and style floating panel
    function createFloatingPanel() {
        let floatingPanel = document.createElement('div');
        floatingPanel.style.position = 'fixed';
        floatingPanel.style.top = '10px';
        floatingPanel.style.right = '10px';
        floatingPanel.style.zIndex = '10000';
        floatingPanel.style.backgroundColor = '#f9f9f9';
        floatingPanel.style.border = '1px solid #ddd';
        floatingPanel.style.padding = '10px';
        floatingPanel.style.boxShadow = '0 4px 6px rgba(0,0,0,.1)';
        floatingPanel.style.flexDirection = 'column';
        // 创建单选框
        let useTranslationCheckbox = document.createElement('input');
        useTranslationCheckbox.type = 'checkbox';
        useTranslationCheckbox.id = 'useTranslation';
        let useTranslationLabel = document.createElement('label');
        useTranslationLabel.htmlFor = 'useTranslation';
        useTranslationLabel.textContent = 'Use Translation';

        // 创建下拉框
        let languageSelect = document.createElement('select');
        languageSelect.id = 'languageSelect';
        const languages = [
            { code: 'zh-CN', name: 'Simplified Chinese' },
            { code: 'zh-TW', name: 'Traditional Chinese' },
            { code: 'en', name: 'English' },
            { code: 'ja', name: 'Japanese' },
            { code: 'ko', name: 'Korean' },
            { code: 'es', name: 'Spanish' },
            { code: 'fr', name: 'French' },
            { code: 'de', name: 'German' },
            { code: 'ru', name: 'Russian' },
            { code: 'ar', name: 'Arabic' },
            { code: 'hi', name: 'Hindi' },
            { code: 'pt', name: 'Portuguese' },
            { code: 'it', name: 'Italian' },
            // 添加更多语言选项...
        ];

        languages.forEach(lang => {
            let option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            languageSelect.appendChild(option);
        });

        // Initially hide language selection
        languageSelect.style.display = 'none';
        useTranslationLabel.style.display = 'none';
        useTranslationCheckbox.style.display = 'none';
        // Toggle language selection visibility based on checkbox
        useTranslationCheckbox.onchange = function() {
            languageSelect.style.display = useTranslationCheckbox.checked ? 'block' : 'none';
        };

        // 从localStorage中恢复单选框状态
        let useTranslation=localStorage.getItem('useTranslation')||'true';
        const useTranslationSaved = useTranslation;
        useTranslationCheckbox.checked = useTranslationSaved;
        // 从localStorage中恢复下拉框状态
        const languageSelectSaved = localStorage.getItem('languageSelect');
        if (languageSelectSaved) {
            languageSelect.value = languageSelectSaved;

        }



        // 当单选框状态改变时，更新localStorage并显示/隐藏下拉框
        useTranslationCheckbox.onchange = function() {
            localStorage.setItem('useTranslation', useTranslationCheckbox.checked);
            languageSelect.style.display = useTranslationCheckbox.checked ? 'block' : 'none';
        };

        // 当下拉框选项改变时，更新localStorage
        languageSelect.onchange = function() {
            localStorage.setItem('languageSelect', languageSelect.value);
            updateTranslatedTitles();
        };

        floatingPanel.appendChild(useTranslationCheckbox);
        floatingPanel.appendChild(useTranslationLabel);
        floatingPanel.appendChild(languageSelect);

        let textarea = document.createElement('textarea');
        textarea.style.width = '300px';
        textarea.style.height = '100px';
        textarea.value = keywords;

        let saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = function() {
            localStorage.setItem('filmKeywords', textarea.value);
            keywords = textarea.value;
            alert('Keywords saved!');
        };


        // Toggle panel visibility
        let toggleButton = document.createElement('button');
        toggleButton.textContent = 'Toggle Panel';
        toggleButton.onclick = function() {
            if(textarea.style.display === 'none'){
                useTranslationLabel.style.display='flex';
                useTranslationCheckbox.style.display='flex';
                languageSelect.style.display = useTranslationCheckbox.checked ? 'flex' : 'none';
                textarea.style.display='block';
                saveButton.style.display ='block';

            }else{
                useTranslationLabel.style.display= 'none';
                useTranslationCheckbox.style.display= 'none';
                languageSelect.style.display= 'none';
                textarea.style.display= 'none';
                saveButton.style.display= 'none';
            }

        };

        // Initially hide textarea and save button
        textarea.style.display = 'none';
        saveButton.style.display = 'none';

        floatingPanel.appendChild(textarea);
        floatingPanel.appendChild(saveButton);
        floatingPanel.appendChild(toggleButton);
        document.body.appendChild(floatingPanel);
    }

    createFloatingPanel();
    function extractAndRemoveYear(title) {
        // 正则表达式匹配1910到2025之间的年份，包括可能的括号，同时捕获年份之前的所有内容
        const yearPattern = /(.*?)(\(?(\b(19[1-9]\d|20[0-2]\d)\b)\)?|\[(\b(19[1-9]\d|20[0-2]\d)\b)\])/;
        let extractedYear = "";
        let prefixTitle = title;

        // 尝试匹配年份及其之前的内容
        const match = title.match(yearPattern);
        if (match) {
            // 提取年份，可能出现在不同的捕获组
            extractedYear = match[3] || match[5];
            // 提取年份之前的内容，包括可能的空格
            prefixTitle = match[1].trim();
        }

        return [prefixTitle, extractedYear];
    }


    function preprocessTitle(title) {
        title = title
            .replace(/[-._]/g, ' ') // Replace - . _ with spaces、

        let [newtitle, year] = extractAndRemoveYear(title);
        let processedTitle=newtitle;
        let regex = new RegExp(`^(.*?)(${keywords})`, 'i');

        // 使用 match 方法来找到匹配的内容
        let match = processedTitle.match(regex);
        processedTitle = match ? match[1].trim() : newtitle;

        // 删除多余的空格
        processedTitle = processedTitle.replace(/\s+/g, ' ');
        console.log(`ori_title:${title}  去掉时间:${newtitle} 删去关键字后:${processedTitle} `);
        return [processedTitle,year];

    }


    function fetchFilmData(filmTitle,year, callback) {

        let url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(filmTitle)}`;
        if (year!='') {
            url+=`&year=${year}`;
        }
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const result = JSON.parse(response.responseText);
                if (result.results.length > 0) {
                    const film = result.results[0];
                    callback(null, film);
                } else {
                    callback('Film not found',null);
                }
            },
            onerror: function(error) {
                callback('Film not found',null);
            }
        });
    }

    function updateTranslatedTitles() {
        let languageCode = document.getElementById('languageSelect').value;
        // 找到页面上所有具有 "translatedTitle" 类的元素
        const elements = document.querySelectorAll('.translatedTitle');

        elements.forEach(element => {
            const movieId = element.getAttribute('movie_id'); // 从元素中获取电影ID
            const year=element.getAttribute('year');

            let displayTitle=element.getAttribute('originTitle');
            // 使用先前定义的 fetchTranslation 函数获取翻译
            fetchTranslation(movieId, languageCode, (err, translatedTitle) => {
                if (err) {
                    console.error('Error fetching translation:', err);
                    return;
                }

                if (translatedTitle) {
                    // 如果成功获取到翻译，更新元素的内容
                    displayTitle=translatedTitle;
                    //console.log(`Updated translation for movie ID ${movieId}: ${translatedTitle}`);
                }
                element.textContent = ` [${displayTitle} (${year})]`;
            });
        });
    }

    // 新增函数，用于获取指定语言的电影翻译
    function fetchTranslation(movieId, languageCode, callback) {
        let url = `https://api.themoviedb.org/3/movie/${movieId}/translations?api_key=${API_KEY}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const result = JSON.parse(response.responseText);

                const translations = result.translations;
                // 分解languageCode以支持区域特定的语言代码，如zh-TW
                const [lang, region] = languageCode.split('-');
                let translation=translations.find(t => t.iso_639_1 === lang);

                // 尝试根据语言代码和（可选）区域代码找到匹配的翻译
                if (region) {
                    // 对于有区域代码的情况，如zh-TW
                    translation = translations.find(t => t.iso_639_1 === lang && t.iso_3166_1 === region);
                }
                if (translation) {
                    callback(null, translation.data.title);
                } else {
                    callback('Translation not found');
                }
            },
            onerror: function() {
                callback('Error fetching translation');
            }
        });
    }
    function addFilmInfo(trElement, film) {



        // 找到link所在的tr元素

        if(film){

            const rating = film.vote_average;
            const thumbnail = `https://image.tmdb.org/t/p/w500${film.poster_path}`;
            // 在tr内找到class为"vertTh"的td元素
            let vertThTd = trElement.querySelector('td.vertTh');

            // 创建一个新的HTML结构来包含评分和缩略图
            let newContent = `<div>(Rating: ${rating})<br><img src="${thumbnail}" style="height: 100px; margin-left: 10px;"></div>`;
            // 替换vertThTd内的内容
            if (vertThTd) {
                //vertThTd.style.flexDirection="column";
                vertThTd.innerHTML+=newContent;
            }
        }
        // 找到所有的<nobr>元素内的<a>标签，并更改其样式为flex

    }



    const links = document.querySelectorAll('a.detLink');
    links.forEach(link => {
        let trElement = link.closest('tr');
        let vertThTd = trElement.querySelector('td.vertTh');
        let category = vertThTd.innerText;
        if(category.toLowerCase().includes("movie") && !category.toLowerCase().includes("porn")){
            //增加下载按钮
            trElement.querySelectorAll('nobr a').forEach(a => {
                a.style.display = 'flex';
            });
            const filmTitleMatch = link.textContent;

            if (filmTitleMatch && filmTitleMatch.length > 1) {
                let [filmTitle,year] = preprocessTitle(filmTitleMatch);
                fetchFilmData(filmTitle,year, (err, film) => {
                    // 移动addFilmInfo调用和link.insertAdjacentHTML到条件检查之外
                    // 确保这些操作对于每个link都会执行
                    let displayTitle=film.title;
                    addFilmInfo(trElement, film);
                    let useTranslation = document.getElementById('useTranslation').checked;
                    if (useTranslation && film) {
                        let languageCode = document.getElementById('languageSelect').value;
                        fetchTranslation(film.id, languageCode, (err, translatedTitle) => {


                            if (translatedTitle) {

                                displayTitle = translatedTitle;
                            }
                            link.insertAdjacentHTML('afterend', `<span class="translatedTitle" movie_id="${film.id}" originTitle="${film.title}" year="${film.release_date.substring(0, 4)}"> [${displayTitle} (${film.release_date.substring(0, 4)})]</span>`);

                        });

                    }

                });
            }

        }
        // 确保无论电影信息是否找到，都添加额外的HTML
        // 注意：这里需要在正确的作用域内访问filmTitle，可能需要调整
    });

})();