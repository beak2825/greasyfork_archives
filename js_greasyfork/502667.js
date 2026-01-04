// ==UserScript==
// @name         Amazon Search Result Enhancer
// @name:zh      亚马逊搜索结果添加序号和广告ID
// @name:de      Amazon Suchergebnis Verbesserer
// @name:ja      Amazon 検索結果エンハンサー
// @name:fr      Amazon Amélioration des résultats de recherche
// @name:it      Amazon Miglioratore di risultati di ricerca
// @name:nl      Amazon Zoekresultaten Verbeteraar
// @name:es      Amazon Mejorador de Resultados de Búsqueda
// @namespace    https://noobbei.top
// @version      1.6.0
// @description  Enhance Amazon search results by adding numbers, advertisement IDs, and Best Sellers Rank.
// @description:de  Verbessern Sie Amazon-Suchergebnisse durch Hinzufügen von Nummern, Werbe-IDs und Best Sellers Rank.
// @description:ja  広告ID、番号、そしてベストセラーランクを追加してAmazon検索結果を向上させます。
// @description:fr  Améliorez les résultats de recherche Amazon en ajoutant des numéros, des identifiants de publicité et des classements de meilleures ventes.
// @description:it  Migliora i risultati di ricerca di Amazon aggiungendo numeri, ID pubblicitari e Best Sellers Rank.
// @description:nl  Verbeter Amazon zoekresultaten door nummers, advertentie-ID's en Best Sellers Rank toe te voegen.
// @description:es  Mejora los resultados de búsqueda de Amazon añadiendo números, ID de anuncios y Best Sellers Rank.
// @description:zh  为亚马逊搜索结果页面上的广告和自然搜索结果添加序号，并为广告结果添加广告ID和活动ID，同时显示Best Sellers Rank。
// @author       noobbei
// @match        https://www.amazon.com/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.co.jp/*
// @match        https://www.amazon.ca/*
// @icon         https://www.amazon.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502667/Amazon%20Search%20Result%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/502667/Amazon%20Search%20Result%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const translations = {
        'zh': {'AdID': '广告ID', 'CampaignID': '活动ID', 'BestSellersRank': '畅销榜排名'},
        'en': {'AdID': 'Ad ID', 'CampaignID': 'Campaign ID', 'BestSellersRank': 'Best Sellers Rank'},
        'de': {'AdID': 'Werbe-ID', 'CampaignID': 'Kampagnen-ID', 'BestSellersRank': 'Verkaufsrang'},
        'fr': {'AdID': 'ID Publicité', 'CampaignID': 'ID Campagne', 'BestSellersRank': 'Classement Meilleures Ventes'},
        'es': {'AdID': 'ID Anuncio', 'CampaignID': 'ID Campaña', 'BestSellersRank': 'Clasificación de Ventas'},
        'it': {'AdID': 'ID Annuncio', 'CampaignID': 'ID Campagna', 'BestSellersRank': 'Classifica Bestseller'},
        'nl': {'AdID': 'Advertentie-ID', 'CampaignID': 'Campagne-ID', 'BestSellersRank': 'Verkooprang'},
        'ca': {'AdID': 'ID Anunci', 'CampaignID': 'ID Campanya', 'BestSellersRank': 'Classificació de Vendes'},
        'ko': {'AdID': '광고ID', 'CampaignID': '캠페인ID', 'BestSellersRank': '베스트셀러 순위'},
        'ja': {'AdID': '広告ID', 'CampaignID': 'キャンペーンID', 'BestSellersRank': 'ベストセラーランキング'}
    };

    // 动态检测用户的浏览器或网站语言
    let lang = navigator.language || navigator.userLanguage;
    lang = lang.split('-')[0]; // 处理类似'en-US'的语言代码

    let adID_k = translations[lang].AdID;
    let campaignID_k = translations[lang].CampaignID;
    let bestSellersRank_k = translations[lang].BestSellersRank;

    const applyLabelsAndIds = () => {
        // 计数器重置
        let adCounter = 1;
        let searchResultCounter = 1;

        // 获取所有搜索结果的元素
        let searchResults = document.querySelectorAll('div[data-component-type="s-search-result"], .sbv-video-single-product');

        // 清除之前的序号和ID标签
        document.querySelectorAll('.ad-counter-label, .search-result-counter-label').forEach(label => {
            label.remove();
        });
        document.querySelectorAll('.ad-id-element, .campaign-id-element, .best-sellers-rank-element').forEach(idElem => {
            idElem.remove();
        });

        searchResults.forEach(result => {
            let label;
            let adIdElement;
            let campaignIdElement;
            let bestSellersRankElement;

            // 检查是否已添加过标签
            if (result.querySelector('.ad-counter-label, .search-result-counter-label')) {
                return; // 如果已添加标签，跳过这个元素
            }

            // 检查是否是广告
            if (result.classList.contains('AdHolder') || result.classList.contains('sbv-video-single-product')) {
                // 创建序号标签
                label = createLabel(`${adCounter}`, 'gold', '#000');
                label.classList.add('ad-counter-label'); // 添加自定义类以避免重复添加

                // 从data-s-safe-ajax-modal-trigger属性获取广告ID
                let adDataAttribute = result.querySelector('[data-s-safe-ajax-modal-trigger]');
                let adId = null;
                let campaignId = null;
                if (adDataAttribute) {
                    const adData = JSON.parse(adDataAttribute.getAttribute('data-s-safe-ajax-modal-trigger'));
                    let ajaxUrl = adData.ajaxUrl;
                    adId = decodeURIComponent(ajaxUrl).match(/"adId":"([^"]*)"/)[1];
                    campaignId = decodeURIComponent(ajaxUrl).match(/"campaignId":"([^"]*)"/)[1];
                }

                // 如果找到广告ID，则创建并添加一个包含广告ID的标签
                if (adId) {
                    adIdElement = createIdElement(`${adID_k}: ${adId}`, 'ad-id-element');
                }

                if (campaignId) {
                    campaignIdElement = createIdElement(`${campaignID_k}: ${campaignId}`, 'campaign-id-element');
                }

                // 增加广告计数器
                adCounter++;

            } else {
                // 创建序号标签
                label = createLabel(`${searchResultCounter}`, 'green', '#FFF');
                label.classList.add('search-result-counter-label'); // 添加自定义类以避免重复添加

                // 增加搜索结果计数器
                searchResultCounter++;
            }

            // 获取并创建 Best Sellers Rank 标签
            let rankElement = result.querySelector('span.a-size-small.a-text-normal');
            if (rankElement) {
                let rankText = rankElement.textContent.trim();
                if (rankText) {
                    bestSellersRankElement = createIdElement(`${bestSellersRank_k}: ${rankText}`, 'best-sellers-rank-element');
                }
            }

            // 将序号标签预置到搜索结果元素的标题下方
            const titleElement = result.querySelector('div[data-cy="title-recipe"]'); // 标题元素的选择器可能依网页而异
            if (titleElement) {
                let infoContainer = createInfoContainer();
                infoContainer.appendChild(label); // 序号标签
                if (adIdElement) {
                    let adIdContainer = document.createElement('span');
                    adIdContainer.appendChild(adIdElement);
                    infoContainer.appendChild(adIdContainer);
                }

                if (campaignIdElement) {
                    let campaignIdContainer = document.createElement('div');
                    campaignIdContainer.appendChild(campaignIdElement);
                    infoContainer.appendChild(campaignIdContainer);
                }

                if (bestSellersRankElement) {
                    let rankContainer = document.createElement('div');
                    rankContainer.appendChild(bestSellersRankElement);
                    infoContainer.appendChild(rankContainer);
                }

                // 将信息容器插入到标题元素的下一行
                titleElement.parentNode.insertBefore(infoContainer, titleElement.nextSibling);
            }
        });
    };

    function createInfoContainer() {
        let container = document.createElement('div');
        container.style.display = 'block';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.marginTop = '5px'; 
        return container;
    }

    function createLabel(text, backgroundColor, foregroundColor) {
        let label = document.createElement('span');
        label.textContent = text;
        label.style.backgroundColor = backgroundColor;
        label.style.borderRadius = '50%';
        label.style.color = foregroundColor;
        label.style.display = 'inline-table';
        label.style.width = '25px';
        label.style.height = '25px';
        label.style.textAlign = 'center';
        label.style.marginLeft = '10px';
        label.style.marginRight = '5px';
        label.style.lineHeight = '25px';
        label.style.verticalAlign = 'middle';
        return label;
    }

    function createIdElement(text, className) {
        let idElement = document.createElement('div');
        idElement.textContent = text;
        idElement.style.backgroundColor = '#DAA520';
        idElement.style.color = '#FFFFFF';
        idElement.style.fontWeight = 'bold';
        idElement.style.padding = '3px 6px';
        idElement.style.marginLeft = '10px';
        idElement.style.borderRadius = '4px';
        idElement.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)';
        idElement.style.fontSize = '0.75rem';
        idElement.style.textAlign = 'center';
        idElement.style.verticalAlign = 'middle';
        idElement.style.display = 'inline-block';
        idElement.style.minWidth = '80px';
        idElement.style.height = '20px';
        idElement.style.lineHeight = '20px';
        idElement.classList.add(className);
        return idElement;
    }

    let currentUrl = window.location.href;

    const observer = new MutationObserver((mutations) => {
        let pageChanged = window.location.href !== currentUrl;
        if (pageChanged) {
            currentUrl = window.location.href;
            waitForContentLoaded().then(() => {
                applyLabelsAndIds();
            });
        }
    });

    const waitForContentLoaded = () => {
        return new Promise((resolve) => {
            setTimeout(resolve, 500);
        });
    };

    observer.observe(document.body, {childList: true, subtree: true});

    applyLabelsAndIds();

})();
