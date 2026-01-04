// ==UserScript==
// @name         快速添加韩漫信息
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  韩漫维基助手扩充工具
// @author       bgmmajia+ai
// @match        https://series.naver.com/comic/detail.series?productNo=*
// @match        https://comic.naver.com/webtoon/list?titleId=*
// @match        https://page.kakao.com/content/*
// @match        https://www.lezhin.com/ko/comic/*
// @match        https://ridibooks.com/books/*
// @match        https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=*
// @match        https://toptoon.com/comic/ep_list/*
// @match        https://www.bomtoon.tw/detail/*
// @match        https://bgm.tv/new_subject/1
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      bgm.tv
// @connect      api.zhconvert.org
// @connect      series.naver.com
// @connect      comicthumb-phinf.pstatic.net
// @connect      shared-comic.pstatic.net
// @connect      page-images.kakaoentcdn.com
// @connect      dn-img-page.kakao.com
// @connect      ccdn.lezhin.com
// @connect      img.ridicdn.net
// @connect      image.aladin.co.kr
// @connect      contents.kyobobook.co.kr
// @connect      shtosebzjw.akamaized.net
// @connect      smurfs.toptoon.com
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520567/%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0%E9%9F%A9%E6%BC%AB%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/520567/%E5%BF%AB%E9%80%9F%E6%B7%BB%E5%8A%A0%E9%9F%A9%E6%BC%AB%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //通用变数配置
    let author = '';
    let illustrator = '';
    let originalstory = '';
    let publisher = '';
    let synopsis = '';
    let publishdate = '';
    let issuedate = '';
    let linkey = '';
    let cover = '';
    let pages = '';
    let bookprice = '';
    let bookISBN = '';
    let totalepisodes = '';
    let enddate = '';
    let isCompleted = false;
    let isAdultVer = false;
    let cachedJsonData = null;
    let cacheDate = null;

    const sourceConfigs = {
        navers: {
            match: /https:\/\/series\.naver\.com\/comic\/detail\.series\?productNo=\d+/,
            mode: 'insert',
            buttonSelector: '#content .end_head h2',
            extractData: extractNaverSeriesData
        },
        naverw: {
            match: /https:\/\/comic\.naver\.com\/webtoon\/list\?titleId=\d+/,
            mode: 'insert',
            buttonSelector: 'h2[class^="EpisodeListInfo__title"]',
            extractData: extractNaverWebtoonData
        },
        kakao: {
            match: /https:\/\/page\.kakao\.com\/content/,
            mode: 'floating',
            extractData: extractKakaoData
        },
        lezhin: {
            match: /https:\/\/www\.lezhin\.com\/ko\/comic/,
            mode: 'floating',
            extractData: extractLezhinData
        },
        ridi: {
            match: /https:\/\/ridibooks\.com\/books/,
            mode: 'floating',
            extractData: extractRidiData
        },
        toptoon: {
            match: /https:\/\/toptoon\.com\/comic\/ep_list/,
            mode: 'floating',
            extractData: extractToptoonData
        },
        aladin: {
            match: /https:\/\/www\.aladin\.co\.kr\/shop\/wproduct\.aspx\?ItemId=\d+/,
            mode: 'insert',
            buttonSelector: '.Ere_bo_title',
            extractData: extractAladinData
        },
        bomtw: {
            match: /https:\/\/www\.bomtoon\.tw\/detail/,
            mode: 'floating',
            extractData: extractBomtwData
        },
    };

    const currentConfig = Object.values(sourceConfigs).find(config =>
        config.match.test(window.location.href)
    );

    if (currentConfig) {
        if (currentConfig.mode === 'floating') {
            const button = document.createElement('div');
            button.textContent = '📋';

            button.style.position = 'absolute';
            button.style.top = '20px';
            button.style.left = '20px';
            button.style.padding = '10px';
            button.style.backgroundColor = '#ffffff';
            button.style.color = '#000000';
            button.style.border = '1px solid #000';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.zIndex = '10000';

            button.onclick = async function() {
                try {
                    const extractedData = await currentConfig.extractData();
                    if (extractedData) {
                        GM_setValue('bgmComicData', JSON.stringify(extractedData));
                        GM_setValue('shouldFillForm', true);
                        window.open('https://bgm.tv/new_subject/1', '_blank');
                    } else {
                        console.error("数据提取失败");
                    }
                } catch (error) {
                    console.error("处理数据时出现错误:", error);
                }
            };

            document.body.appendChild(button);
        } else if (currentConfig.mode === 'insert') {
            waitForElement(currentConfig.buttonSelector)
                .then(targetElement => {
                    const quickFillText = document.createElement('span');
                    quickFillText.textContent = '📋';
                    quickFillText.style.marginLeft = '10px';
                    quickFillText.style.cursor = 'pointer';
                    quickFillText.onclick = async function() {
                        try {
                            const extractedData = await currentConfig.extractData();
                            if (extractedData) {
                                GM_setValue('bgmComicData', JSON.stringify(extractedData));
                                GM_setValue('shouldFillForm', true);
                                window.open('https://bgm.tv/new_subject/1', '_blank');
                            } else {
                                console.error("数据提取失败");
                            }
                        } catch (error) {
                            console.error("处理数据时出现错误:", error);
                        }
                    };
                    targetElement.appendChild(quickFillText);
                });
        }
    }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let timeElapsed = 0;

            const timer = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                }
                timeElapsed += interval;

                if (timeElapsed > timeout) {
                    clearInterval(timer);
                    reject(new Error('Timeout: 未找到目标元素'));
                }
            }, interval);
        });
    }

    function convertTCtoSC(text, callback) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://api.zhconvert.org/convert",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                text: text,
                converter: "WikiSimplified"
            }),
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    callback(result.data.text);
                } catch (error) {
                    console.error("解析繁化姬API返回失败: ", error);
                    callback("繁化姬转换失败");
                }
            },
            onerror: function(error) {
                console.error("繁化姬API请求失败:", error);
                callback("繁化姬API请求失败");
            }
        });
    }

    function parseDateToISO(dateString) {
        const dateMatch = dateString.match(/(\d{4})[^\d]*(\d{1,2})[^\d]*(\d{1,2})/);
        if (dateMatch) {
            const year = parseInt(dateMatch[1], 10);
            const month = parseInt(dateMatch[2], 10) - 1;
            const day = parseInt(dateMatch[3], 10);

            const date = new Date(Date.UTC(year, month, day));
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        }
        return '';
    }

    //NaverSeries提取函数
    async function extractNaverSeriesData() {
        const title = document.querySelector('meta[property="og:title"]')?.content.replace(/ \[독점\]$/, '') || '';
        let cover = document.querySelector('meta[property="og:image"]')?.content?.split('?')[0] || '';

        const currentURL = window.location.href.split('&')[0];
        linkey = `|链接= {\n[Naver Series|]\n[咚漫|]\n[Line Webtoon(繁)|]\n[LINEマンガ|]\n[Line Webtoon(英)|]\n}`;

        const infoList = document.querySelectorAll('.end_info .info_lst ul li');
        infoList.forEach(item => {
            const label = item.querySelector('span')?.textContent.trim();
            const links = item.querySelectorAll('a');

            const linkText = Array.from(links).map(link => link.textContent.trim()).join('、');

            if (label === '글') author = linkText;
            if (label === '그림') illustrator = linkText;
            if (label === '출판사') publisher = linkText;
        });

        const synopsisElements = document.querySelectorAll('div._synopsis');
        if (synopsisElements.length > 0) {
            const hiddenSynopsis = Array.from(synopsisElements).find(el => el.style.display === 'none');
            if (hiddenSynopsis) {
                synopsis = Array.from(hiddenSynopsis.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent)
                    .join('').trim();
            } else {
                const visibleSynopsis = synopsisElements[0];
                synopsis = Array.from(visibleSynopsis.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent)
                    .join('').trim();
            }
        }

        const issuedateElement = document.querySelector('tbody#volumeList tr._volume_row_1 em');
        if (issuedateElement) {
            issuedate = parseDateToISO(issuedateElement.textContent.trim().replace(/[\(\)]/g, ''));
        }

        const statusElement = document.querySelector('ul.end_info li > span');
        let statusText = statusElement.textContent.trim();
        if (statusText === '완결') {
            isCompleted = true;
            } else {
                isCompleted = false;
                }

        if (isCompleted) {

            let episodeElement = document.querySelector('h5.end_total_episode strong');
            totalepisodes = episodeElement.textContent.trim();

            const urlParams = new URLSearchParams(window.location.search);
            const productNo = urlParams.get('productNo');

            try {
                const response = await fetch(`https://series.naver.com/comic/volumeList.series?productNo=${productNo}&sortOrder=DESC`);
                const data = await response.json();
                enddate = data.resultData?.[0]?.lastVolumeUpdateDate?.split(' ')[0];
                if (enddate) {
                    enddate = parseDateToISO(enddate);
                }
            } catch (error) {
            }
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cover,
                responseType: 'blob',
                onload: async function(response) {
                    if (response.status === 200) {
                        const base64Cover = await convertBlobToBase64(response.response);
                        resolve({
                            title,
                            cover: base64Cover,
                            author,
                            illustrator,
                            publisher,
                            synopsis,
                            issuedate,
                            linkey,
                            isCompleted,
                            totalepisodes,
                            enddate,
                            platform: 'Naver Webtoon'
                        });
                    } else {
                        reject('图片请求失败');
                    }
                },
                onerror: function(error) {
                    console.error('图片请求错误:', error);
                    reject(error);
                }
            });
        });
    }

    // NaverWebtoon提取函数
    async function extractNaverWebtoonData() {
        const title = $('meta[property="og:title"]').attr('content') || '';
        const linkey = `|链接= {\n[Naver Webtoon|${window.location.href.split('&')[0]}]\n[咚漫|]\n[Line Webtoon(繁)|]\n[LINEマンガ|]\n[Line Webtoon(英)|]\n}`;

        $('[class^="ContentMetaInfo__category"]').each((_, item) => {
            const text = $(item).text().trim();
            const link = $(item).find('a').text().trim();
            if (text.includes('글')) author = link;
            if (text.includes('그림')) illustrator = link;
            if (text.includes('원작')) originalstory = link;
        });

        synopsis = $('p[class^="EpisodeListInfo__summary"]').text().trim() || '';

        const fetchPage = url => new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: (response) => response.status === 200 ? resolve(response.responseText) : reject(new Error(`Request failed with status: ${response.status}`)),
                onerror: reject,
            });
        });

        const fetchDetailsFromSeries = async (title) => {
            try {
                const searchUrl = `https://series.naver.com/search/search.series?t=comic&q=${encodeURIComponent(title)}`;
                const searchHtml = await fetchPage(searchUrl);
                const searchDoc = new DOMParser().parseFromString(searchHtml, 'text/html');
                const firstResultLink = searchDoc.querySelector('ul.lst_list > li > a.pic')?.getAttribute('href')?.match(/productNo=(\d+)/)?.[1];
                if (!firstResultLink) throw new Error('No results found');

                const detailUrl = `https://series.naver.com/comic/detail.series?productNo=${firstResultLink}`;
                const detailHtml = await fetchPage(detailUrl);
                const detailDoc = new DOMParser().parseFromString(detailHtml, 'text/html');

                cover = detailDoc.querySelector('meta[property="og:image"]')?.content?.split('?')[0] || '';
                publisher = $(detailDoc).find('.end_info .info_lst ul li').filter((_, li) => $(li).find('span').text().trim() === '출판사').find('a').map((_, a) => $(a).text().trim()).get().join('、');

                const statusText = detailDoc.querySelector('ul.end_info li > span')?.textContent.trim();
                isCompleted = statusText === '완결';

                const volumeUrl = `https://series.naver.com/comic/volumeList.series?productNo=${firstResultLink}&sortOrder=ASC`;
                const volumeData = await fetchPage(volumeUrl);
                const data = JSON.parse(volumeData);
                issuedate = parseDateToISO(data.resultData?.[0]?.lastVolumeUpdateDate);
                if (isCompleted) {
                    totalepisodes = detailDoc.querySelector('h5.end_total_episode strong')?.textContent.trim();
                    const endVolumeData = await fetchPage(`https://series.naver.com/comic/volumeList.series?productNo=${firstResultLink}&sortOrder=DESC`);
                    const endData = JSON.parse(endVolumeData);
                    enddate = parseDateToISO(endData.resultData?.[0]?.lastVolumeUpdateDate);
                }

                return {
                    cover,
                    publisher,
                    synopsis,
                    issuedate,
                    isCompleted,
                    totalepisodes,
                    enddate
                };
            } catch (error) {
                console.error('Error:', error.message);
                return null;
            }
        };

        try {
            const details = await fetchDetailsFromSeries(title);
            if (!details) throw new Error('Failed to fetch details');

            const {
                cover,
                publisher,
                synopsis,
                issuedate,
                isCompleted,
                totalepisodes,
                enddate
            } = details;

            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: cover,
                    responseType: 'blob',
                    onload: async (response) => {
                        if (response.status === 200) {
                            const base64Cover = await convertBlobToBase64(response.response);
                            resolve({
                                title,
                                cover: base64Cover,
                                author,
                                illustrator,
                                originalstory,
                                publisher,
                                synopsis,
                                issuedate,
                                linkey,
                                isCompleted,
                                totalepisodes,
                                enddate,
                                platform: 'Naver Webtoon'
                            });
                        } else {
                            reject('图片请求失败');
                        }
                    },
                    onerror: reject,
                });
            });
            return response;
        } catch (error) {
            console.error('Error fetching cover:', error.message);
        }
    }

    //KakaoPage提取函数
    async function extractKakaoData() {
        const title = document.querySelector('meta[property="og:title"]')?.content || '';

        const currentURL = document.querySelector('meta[property="og:url"]')?.content || '';
        linkey = `|链接= {\n[Kakaopage|${currentURL}]\n[Kakao Webtoon(韩)|]\n[ピッコマ|]\n[Tapas(英)|]\n}`;

        const seriesIdMatch = currentURL.match(/content\/(\d+)/);
        const seriesId = seriesIdMatch[1];

        try {
            const response = await fetch('https://bff-page.kakao.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: `
                query contentData($seriesId: Long!) {
                    contentHomeOverview(seriesId: $seriesId) {
                        content {
                            thumbnail
                            description
                            onIssue
                            ageGrade
                            startSaleDt
                        }
                    }
                    contentHomeInfo(seriesId: $seriesId) {
                        about {
                            detailInfoList {
                                title
                                info
                            }
                        }
                    }
                    contentHomeProductList(seriesId: $seriesId, first: 10, sortType: "desc") {
                        totalCount
                        edges {
                            cursor
                            node {
                                id
                                thumbnail
                                row1
                                row2
                                row3 { text priceList }
                                single { productId thumbnail title }
                            }
                        }
                    }
                }
            `,
                    variables: {
                        seriesId: seriesId
                    }
                })
            }).then(response => response.json());

            const overviewData = response.data.contentHomeOverview.content;
            const onIssue = overviewData.onIssue;
            isCompleted = onIssue === "End";
            const ageGrade = overviewData.ageGrade;
            isAdultVer = ageGrade === "Nineteen";
            const coverlink = overviewData.thumbnail;
            cover = coverlink.replace(/^\/\//, 'https://');
            synopsis = overviewData.description;
            issuedate = overviewData.startSaleDt.split('T')[0];

            const detailInfoList = response.data.contentHomeInfo.about.detailInfoList;
            let publishers = [];
            let originalstorys = [];
            let authors = [];
            let illustrators = [];
            detailInfoList.forEach(item => {
                if (item.title === "발행자") {
                    publishers = item.info;
                    publisher = publishers.join("、").replace(/, /g, '、').replace(/X/g, '、');
                }
                if (item.title === "원작") {
                    originalstorys = item.info;
                    originalstory = originalstorys.join("、").replace(/, /g, '、');
                }
                if (item.title === "글") {
                    authors = item.info;
                    author = authors.join("、").replace(/, /g, '、');
                }
                if (item.title === "그림") {
                    illustrators = item.info;
                    illustrator = illustrators.join("、").replace(/, /g, '、');
                }
                if (originalstory === illustrator) {
                    originalstory = '';
                }
            });

            if (isCompleted) {
                const productData = response.data.contentHomeProductList;
                totalepisodes = productData.totalCount;
                const date = productData.edges[0].node.row2[0].replace(/^(2|1)/, match => match === '2' ? '202' : '201');
                enddate = parseDateToISO(date);
            }

        } catch (error) {
            console.error('Error:', error);
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cover,
                responseType: 'blob',
                onload: async function(response) {
                    if (response.status === 200) {
                        const base64Cover = await convertBlobToBase64(response.response);
                        resolve({
                            title,
                            cover: base64Cover,
                            issuedate,
                            linkey,
                            author,
                            illustrator,
                            originalstory,
                            publisher,
                            synopsis,
                            isCompleted,
                            totalepisodes,
                            enddate,
                            isAdultVer,
                            platform: originalstory ? 'Kakaopage' : 'Kakao Webtoon'
                        });
                    } else {
                        reject('图片请求失败');
                    }
                },
                onerror: function(error) {
                    console.error('图片请求错误:', error);
                    reject(error);
                }
            });
        });
    }

    //LezhinComics提取函数
    async function extractLezhinData() {
        const title = document.querySelector('[class^="episodeListDetail__title"]')?.firstChild?.textContent.trim() || '';
        let cover = document.querySelector('meta[property="og:image"]')?.content?.replace('wide.jpg?', 'tall.jpg?width=720&') || '';
        let linkey = `|链接= {\n[Lezhin Comics(韩)|${window.location.href}]\n[XX漫画|]\n[Bomtoon(繁)|]\n[Beltoon(日)|]\n[Lezhin Comics(日)|]\n[Lezhin Comics(英)|]\n`;

        const issuedateElement = document.querySelector('[class^="episodeListContentsItem__date"]');
        if (issuedateElement) {
            issuedate = parseDateToISO(issuedateElement.textContent.trim().replace(/[\(\)]/g, '').replace(/^(2|1)/, match => match === '2' ? '202' : '201'));
        }

        let synopsis = document.querySelector('meta[property="og:description"]')?.content || '';

        const infoList = document.querySelectorAll('[class^="episodeListDetail__artistGroup"]');
        infoList.forEach(item => {
            const roles = item.querySelectorAll('[class^="episodeListDetail__artist"]');
            roles.forEach(roleItem => {
                const label = roleItem.querySelector('[class^="episodeListDetail__artistName"]')?.textContent.trim();
                const links = roleItem.querySelectorAll('a');
                const linkText = Array.from(links).map(link => link.textContent.trim()).join('、');

                if (label === '글') author = linkText;
                if (label === '그림') illustrator = linkText;
                if (label === '작가') author = illustrator = linkText;
                if (label === '원작') originalstory = linkText;
            });
        });

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cover,
                responseType: 'blob',
                onload: async function(response) {
                    if (response.status === 200) {
                        const base64Cover = await convertBlobToBase64(response.response);
                        resolve({
                            title,
                            cover: base64Cover,
                            linkey,
                            author,
                            illustrator,
                            originalstory,
                            issuedate,
                            synopsis,
                            platform: 'Lezhin Comics'
                        });
                    } else {
                        reject('图片请求失败');
                    }
                },
                onerror: function(error) {
                    console.error('图片请求错误:', error);
                    reject(error);
                }
            });
        });
    }

    //RidiBooks提取函数
    async function extractRidiData() {
        const title = document.querySelector('meta[property="og:title"]')?.content || '';
        let cover = window.location.href.split('?')[0].replace('ridibooks.com/books', 'img.ridicdn.net/cover') + '/xxlarge?dpi=xxhdpi#1'
        let linkey = `|链接= {\n[Ridibooks|${window.location.href.split('?')[0]}]\n[快看漫画|]\n[Line Webtoon(繁)|]\n[めちゃコミ|]\n[Manta(英)|]\n}`;

        const h2Elements = document.querySelectorAll('h2');
        for (let i = 0; i < h2Elements.length; i++) {
            const h2 = h2Elements[i];
            if (h2.innerText && h2.innerText.includes("작품 소개")) {
                let currentDiv = h2.nextElementSibling;

                while (currentDiv) {
                    if (currentDiv.tagName === 'DIV') {
                        if (currentDiv.querySelectorAll && currentDiv.querySelectorAll('span').length > 0) {
                            currentDiv.querySelectorAll('span').forEach(span => {
                                if (span) {
                                    span.innerText = '';
                                }
                            });
                        }

                        if (currentDiv.innerText.trim()) {
                            break;
                        }
                    }
                    currentDiv = currentDiv.nextElementSibling;
                }

                if (currentDiv && currentDiv.tagName === 'DIV') {
                    synopsis = currentDiv.innerText || currentDiv.textContent || "";
                    synopsis = synopsis.trim();
                } else {
                    console.error("未找到匹配的元素");
                }

                break;
            }
        }

        const issuedateElement = document.querySelector('.info_reg_date');
        if (issuedateElement) {
            const rawedate = issuedateElement.childNodes[1].textContent.trim();
            issuedate = rawedate.replace(/\./g, '-').replace(/-$/, '');
            }

        const statusElement = document.querySelector('meta[name="keywords"]');
        if (statusElement) {
            const statusText = statusElement.content;
            if (statusText.includes(',성인,')) {
                isAdultVer = true;
                }
            if (statusText.includes(',완결,')) {
                isCompleted = true;
                }
            if (isCompleted) {
                const elements = document.querySelectorAll('[class*="rigrid"]');
                const regex = /총 \d+화/;

                elements.forEach(element => {
                    const textContent = element.textContent;
                    const match = textContent.match(regex);
                    if (match) {
                        totalepisodes = match[0].replace('총 ', '').replace('화', '');
                    }
                });
                const issuedateElements = document.querySelectorAll('.info_reg_date');
                const lastIssuedateElement = issuedateElements[issuedateElements.length - 1];
                if (lastIssuedateElement) {
                    const rawedate = lastIssuedateElement.childNodes[1].textContent.trim();
                    enddate = rawedate.replace(/\./g, '-').replace(/-$/, '');
                }
            }
            }

        const liElements = Array.from(document.querySelectorAll('li'));
        let firstMatchIllustrator = liElements.find(link => link.textContent.includes('그림'));
        if (firstMatchIllustrator && firstMatchIllustrator.querySelector('a')) {
            illustrator = firstMatchIllustrator.querySelector('a').textContent.trim();
        }
        let firstMatchAuthor = liElements.find(link => link.textContent.includes('글'));
        if (firstMatchAuthor && firstMatchAuthor.querySelector('a')) {
            author = firstMatchAuthor.querySelector('a').textContent.trim();
        }
        let firstMatchOriginalStory = liElements.find(link => link.textContent.includes('원작'));
        if (firstMatchOriginalStory && firstMatchOriginalStory.querySelector('a')) {
            originalstory = firstMatchOriginalStory.querySelector('a').textContent.trim();
        }
        let firstMatchAuthorIllustrator = liElements.find(link => link.textContent.includes('작가'));
        if (firstMatchAuthorIllustrator && firstMatchAuthorIllustrator.querySelector('a')) {
            let linkText = firstMatchAuthorIllustrator.querySelector('a').textContent.trim();
            author = illustrator = linkText;
        }

        const divElements = Array.from(document.querySelectorAll('div'));
        let firstMatchPublisher = divElements.find(div => /출판$|출판사$/.test(div.textContent.trim()));
        if (firstMatchPublisher && firstMatchPublisher.querySelector('a')) {
            publisher = firstMatchPublisher.querySelector('a').textContent.trim()
        }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cover,
                responseType: 'blob',
                onload: async function(response) {
                    if (response.status === 200) {
                        const base64Cover = await convertBlobToBase64(response.response);
                        resolve({
                            title: title.replace(/ - 최대 90% 할인! 웰컴 마크다운/, ''),
                            cover: base64Cover,
                            author,
                            illustrator,
                            originalstory,
                            publisher,
                            linkey,
                            synopsis,
                            issuedate,
                            isAdultVer,
                            isCompleted,
                            totalepisodes,
                            enddate,
                            platform: 'Ridibooks'
                        });
                    } else {
                        reject('图片请求失败');
                    }
                },
                onerror: function(error) {
                    console.error('图片请求错误:', error);
                    reject(error);
                }
            });
        });
    }

    //Aladin提取函数
    async function extractAladinData() {
        const rawtitle = document.querySelector('meta[property="og:title"]')?.content || '';
        let title = rawtitle.replace(/ (\d+)$/, ' ($1)');

        const xhr = new XMLHttpRequest();
        const metaTag = document.querySelector('meta[property="og:image"]');
        const metaContent = metaTag?.content || "";
        const idMatch = metaContent.match(/cover500\/(.+?)_\d+\.jpg/);
        const id = idMatch ? idMatch[1] : "";
        if (!id) {
            console.error("未能提取到有效ID");
        }
        const getSynopsis = () => {
            return new Promise((resolve, reject) => {
                if (!id) {
                    reject('ID无效，无法提取简介');
                    return;
                }
                const url = `https://www.aladin.co.kr/shop/product/getContents.aspx?ISBN=${id}&name=Introduce`;
                xhr.open("GET", url, true);
                xhr.onload = function() {
                    const decodeHtmlEntities = (htmlString) => {
                        const doc = new DOMParser().parseFromString(htmlString, "text/html");
                        return doc.documentElement.textContent || "";
                    };
                    if (xhr.status === 200) {
                        const doc = new DOMParser().parseFromString(xhr.responseText, "text/html");
                        let synopsis = doc.querySelector(".Ere_prod_mconts_R")?.innerHTML || "";
                        synopsis = synopsis.replace(/<br\s*\/?>\s*/g, '\n');
                        synopsis = decodeHtmlEntities(synopsis);
                        synopsis = synopsis.replace(/ {2,}/g, ' ').trim();

                        resolve(synopsis);
                    } else {
                        reject('无法获取简介');
                    }
                };
                xhr.onerror = function() {
                    reject('XHR请求失败');
                };
                xhr.send();
            });
        };
        try {
            synopsis = await getSynopsis();
        } catch (error) {
            console.error('提取简介失败:', error);
        }

        const bookpriceElement = document.querySelector('.Ere_prod_Binfowrap .Ritem',);
        if (bookpriceElement) {
            bookprice = bookpriceElement.textContent.trim().replace(/(\d{1,3}(?:,\d{3})*)\s?원/, '₩$1');
        }

        const publishdateElement = document.querySelector('meta[itemprop="datePublished"]');
        if (publishdateElement) {
            publishdate = publishdateElement.getAttribute('content').trim();
        }

        const pageElement = document.querySelector('.conts_info_list1 li:nth-child(1)');
        if (pageElement) {
            pages = pageElement ? pageElement.textContent.trim().replace(/[^\d]/g, '') : '';
            }

        const isbnElement = document.querySelector('.conts_info_list1 li:nth-child(4)');
        if (isbnElement) {
            bookISBN = isbnElement ? isbnElement.textContent.trim().replace(/[^\dX]/g, '') : '';
            }

        let cover = `https://contents.kyobobook.co.kr/sih/fit-in/1024x0/pdt/${bookISBN}.jpg`;

        const roleElements = document.querySelectorAll('li.Ere_sub2_title a');
        let author = [];
        let illustrator = [];
        let originalstory = [];
        roleElements.forEach((el) => {
            const linkText = el.textContent.trim();
            const parentText = el.parentElement?.textContent || '';
            const label = parentText.split(linkText).pop().trim();

            if (label.includes('지은이') || label.includes('작가')) {
                author.push(linkText);
                illustrator.push(linkText);
                }
            if (label.includes('글')) author.push(linkText);
            if (label.includes('그림')) illustrator.push(linkText);
            if (label.includes('원작')) originalstory.push(linkText);
        });
        originalstory = originalstory.filter(name => !illustrator.includes(name));

        const lastElement = roleElements[roleElements.length - 1];
        if (lastElement) {
            publisher = lastElement.textContent.trim();
            }

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cover,
                responseType: 'blob',
                onload: async function(response) {
                    if (response.status === 200) {
                        const base64Cover = await convertBlobToBase64(response.response);
                        resolve({
                            title,
                            cover: base64Cover,
                            pages,
                            author: author.join('、'),
                            illustrator: illustrator.join('、'),
                            originalstory: originalstory.join('、'),
                            publisher,
                            synopsis,
                            bookprice,
                            bookISBN,
                            publishdate,
                        });
                    } else {
                        reject('图片请求失败');
                    }
                },
                onerror: function(error) {
                    console.error('图片请求错误:', error);
                    reject(error);
                }
            });
        });
    }

    //Toptoon提取函数
    async function extractToptoonData() {
        const title = document.querySelector('meta[property="og:title"]')?.content.replace(/\s*?\[탑툰\]\s*?/, '') || '';
        const comiclist = $('script').text().match(/fileUrl\s*:\s*['"]([^'"]+)['"]/)?.[1];
        if (!comiclist) return console.error('未找到fileUrl');

        const linkey = `|链接= {\n[Toptoon(韩)|${window.location.href}]\n[Toptoon(繁)|]\n[Toptoon(日)|]\n[Day Comics(英)|]\n`;
        const today = new Date().toISOString().split('T')[0];

        let TPT_cachedJsonData = JSON.parse(localStorage.getItem('TPT_cachedJsonData')) || null;
        let TPT_cacheDate = localStorage.getItem('TPT_cacheDate') || '';

        if (!TPT_cachedJsonData || TPT_cacheDate !== today) {
            try {
                const response = await fetch(comiclist);
                if (!response.ok) throw new Error(`HTTP状态码: ${response.status}`);

                TPT_cachedJsonData = await response.json();
                TPT_cacheDate = today;

                localStorage.setItem('TPT_cachedJsonData', JSON.stringify(TPT_cachedJsonData));
                localStorage.setItem('TPT_cacheDate', TPT_cacheDate);
            } catch (error) {
                console.error(error);
                return;
            }
        }

        const idx = document.querySelector('meta[property="og:image"]')?.getAttribute('content').match(/(\d+)_/)?.[1];
        if (!idx) return console.log("未能提取idx值");

        const targetData = TPT_cachedJsonData.find(comic => comic.idx === Number(idx));
        if (!targetData) return console.log("未找到目标数据");

        const synopsis = targetData.meta.description.replace(/\n$/, "");
        const useNonAdultThumbnail = confirm("使用爱与和平版本封面?");
        const cover = (useNonAdultThumbnail && targetData.thumbnailNonAdult.portrait || targetData.thumbnail.portrait).replace(/\\\//g, "/");

        const issuedate = targetData.meta.date_open.split(' ')[0];
        const isAdultVer = targetData.meta.adult;
        const isCompleted = targetData.meta.type.includes("complete") ? 1 : 0;
        const enddate = isCompleted ? new Date(new Date(targetData.lastUpdated.publishedAt.split(' ')[0]).setDate(new Date().getDate() + 1)).toISOString().split('T')[0] : null;
        const totalepisodes = isCompleted ? targetData.meta.episodeTotalCount : null;
        const author = targetData.meta.authorList.writerData?.map(writer => writer.name).join("、");
        const illustrator = targetData.meta.authorList.painterData?.map(painter => painter.name).join("、");
        const originalstory = targetData.meta.authorList.originData?.map(origin => origin.name).join("、");

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: cover,
                responseType: 'blob',
                onload: async function(response) {
                    if (response.status === 200) {
                        resolve({
                            title,
                            cover: await convertBlobToBase64(response.response),
                            linkey,
                            issuedate,
                            author,
                            illustrator,
                            originalstory,
                            synopsis,
                            isAdultVer,
                            isCompleted,
                            enddate,
                            totalepisodes,
                            platform: 'Toptoon'
                        });
                    } else {
                        reject('图片请求失败');
                    }
                },
                onerror: reject
            });
        });
    }

    //BomTW提取函数
    async function extractBomtwData() {
        let title = document.querySelector('meta[property="og:title"]')?.getAttribute('content')?.trim().replace(/ - BOMTOON/, '') || '';
        let linkey = `|链接= {\n[Lezhin Comics(韩)|]\n[XX漫画|]\n[Bomtoon(繁)|${window.location.href}]\n[Beltoon(日)|]\n[Lezhin Comics(日)|]\n[Lezhin Comics(英)|]\n`;
        let synopsis = document.querySelector('meta[property="og:description"]')?.getAttribute('content')?.trim().replace(/[\r\n]+/g, '');
        let author = document.querySelector('meta[name="author"]')?.getAttribute('content')?.trim();
        const illustrator = await new Promise((resolve, reject) => {
            convertTCtoSC(title, function(simplifiedtitle) {
                resolve(simplifiedtitle);
            });
        });
        const statusElement = document.querySelector('meta[name="keywords"]');
        const statusText = statusElement.content;
        if (statusText.includes(',吳老師,')) {
            totalepisodes = "本作有无修正版本";
        }
        return {
            title,
            linkey,
            illustrator,
            author,
            totalepisodes,
            synopsis,
            platform: 'Bomtoon TW'
        };
    }

    //通用图片处理函数
    function convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    //通用填表函数
    function fillInfoboxTextarea(data) {
        const infoboxTextarea = document.querySelector('textarea[name="subject_infobox"]');
        if (infoboxTextarea) {
            const infoboxTemplate = `{{Infobox animanga/Manga
|中文名=
|别名={
${data.platform ? `[台版|]\n[日版|]\n[美版|]\n[非官方|]\n[非官方|]\n[非官方|]\n` : ''}
}
${data.originalstory || data.author !== data.illustrator ? `|作者= \n|作画= ${data.illustrator || ''}\n|脚本= ${data.author || ''}\n` : `|作者= ${data.author || ''}\n|作画= \n|脚本= \n`}
|原作= ${data.originalstory || ''}
${data.publisher === data.illustrator ? '|出版社= ' : `|出版社= ${data.publisher || ''}`}
|价格= ${data.bookprice || ''}
|其他出版社=
|连载杂志= ${data.platform || ''}
|发售日= ${data.publishdate || ''}
|册数=
|页数= ${data.pages || ''}
|话数= ${data.totalepisodes || ''}
|ISBN= ${data.bookISBN || ''}
|其他=
|开始= ${data.issuedate || ''}
|结束= ${data.enddate || ''}
|备注= ${data.isAdultVer ? `本作有成人版本` : ''}
${data.linkey || ''}
}}`;

            infoboxTextarea.value = infoboxTemplate;
        } else {
            console.error();
        }
    }

    if (window.location.href.startsWith('https://bgm.tv/new_subject/1')) {
        const shouldFillForm = GM_getValue('shouldFillForm');

        if (shouldFillForm) {
            const cachedData = GM_getValue('bgmComicData');
            if (cachedData) {
                const data = JSON.parse(cachedData);

                const catComic = document.getElementById('cat_comic');
                const subjectSeries = document.getElementById('subjectSeries');
                const subjectNSFW = document.querySelector('input.checkbox[name="subject_nsfw"][value="1"]');
                if (catComic) catComic.click();
                if (subjectSeries && !data.bookprice) subjectSeries.click();
                if (subjectNSFW && data.isAdultVer) subjectNSFW.click();

                const titleInput = document.querySelector('input[name="subject_title"]');
                if (titleInput) {
                    data.title = data.title.replace(/\s*[\[(](?:연재|19세 완전판|완전판|개정판)[\])]\s*$/, '');
                    data.title = data.title.replace(/^[\[\(].*?[\]\)]/, '').trim();//考虑存在必要
                    titleInput.value = data.title || '';
                    console.log('填写标题到输入框:', data.title);

                    (async function() {
                        try {
                            const isNumeric = /^\d+$/.test(data.title);
                            const isSingleWord = /^[a-zA-Z]+$/.test(data.title);
                            const escapeRegExp = (str) => {
                                return str.replace(/[.*+?^=!:${}()|\[\]\/\\~,\<>;'"-]/g, ' ');
                            };
                            const escapedTitle = escapeRegExp(data.title);

                            const queryPath = isNumeric || isSingleWord ? `/json/search-book/^${escapedTitle}$$` : `/json/search-book/^${escapedTitle}$`;

                            const response = await fetch(queryPath);
                            const result = await response.json();

                            const duplicateEntries = result.filter(item => item.name === data.title);
                            if (duplicateEntries.length > 0) {
                                const shouldViewDuplicate = confirm(`咪咕～找到与"${data.title}"重名的条目啦！让我看看？`);
                                if (shouldViewDuplicate) {
                                    const url = duplicateEntries.length === 1 ?
                                        `https://bgm.tv/subject/${duplicateEntries[0].id}/upload_img` :
                                        `https://bgm.tv/subject_search/^${escapedTitle}${isNumeric || isSingleWord ? '\$\$' : '\$'}?cat=1`;
                                    window.open(url, '_blank');
                                } else {
                                    console.log('保持在当前页面');
                                }
                            } else {
                                console.log('未找到重名的條目');
                            }
                            } catch (error) {
                                console.error("查询重复条目时发生错误:", error);
                            }
                            })();
                    } else {
                    console.error('未找到标题输入框');
                }

                const synopsisTextarea = document.querySelector('textarea[name="subject_summary"]');
                if (synopsisTextarea) {
                    synopsisTextarea.value = data.synopsis || '';
                    console.log('填写内容简介:', data.synopsis);
                } else {
                    console.error();
                }

                const tagTextarea = document.querySelector('input[name="subject_meta_tags"]');
                if (tagTextarea) {
                    tagTextarea.value = data.bookprice ? '' : `漫画 ${data.platform === 'Naver Series' ? '' : (data.originalstory ? '小说改' : '原创')} 韩国 ${data.isCompleted ? '已完结' : '连载中'} ${data.isAdultVer ? 'R18' : ''}`;
                } else {
                    console.error();
                }

                setTimeout(function() {
                    const canvasContainer = document.querySelector('.e-wiki-cover-container canvas#e-wiki-cover-preview');
                    if (data.cover && canvasContainer) {
                        const img = new Image();
                        img.onload = function() {
                            const ctx = canvasContainer.getContext('2d');
                            canvasContainer.width = img.width;
                            canvasContainer.height = img.height;
                            ctx.clearRect(0, 0, canvasContainer.width, canvasContainer.height);
                            ctx.drawImage(img, 0, 0, canvasContainer.width, canvasContainer.height);
                        };
                        img.src = data.cover;
                    }
                }, 1000);

                if (nowmode === 'normal') {
                    NormaltoWCODE();
                    fillInfoboxTextarea(data);
                    WCODEtoNormal();
                } else if (nowmode === 'wcode') {
                    fillInfoboxTextarea(data);
                    WCODEtoNormal();
                }

                console.log('已完成填表:', data);
                GM_setValue('shouldFillForm', false);
                GM_setValue('bgmComicData', null);
            }
        }
    }
})();