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
// @version      1.5.1
// @description  Enhance Amazon search results by adding numbers and advertisement IDs.
// @description:de  Verbessern Sie Amazon-Suchergebnisse durch Hinzufügen von Nummern und Werbe-IDs.
// @description:ja  広告IDと番号を追加してAmazon検索結果を向上させます。
// @description:fr  Améliorez les résultats de recherche Amazon en ajoutant des numéros et des identifiants de publicité.
// @description:it  Migliora i risultati di ricerca di Amazon aggiungendo numeri e ID pubblicitari.
// @description:nl  Verbeter Amazon zoekresultaten door nummers en advertentie-ID's toe te voegen.
// @description:es  Mejora los resultados de búsqueda de Amazon añadiendo números e ID de anuncios.
// @description:zh  为亚马逊搜索结果页面上的广告和自然搜索结果添加序号, 并为广告结果添加广告ID和活动ID。
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
// @downloadURL https://update.greasyfork.org/scripts/494543/Amazon%20Search%20Result%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/494543/Amazon%20Search%20Result%20Enhancer.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const translations = {
        'zh': {'AdID': '广告ID', 'CampaignID': '活动ID'},
        'en': {'AdID': 'Ad ID', 'CampaignID': 'Campaign ID'},
        'de': {'AdID': 'Werbe-ID', 'CampaignID': 'Kampagnen-ID'},
        'fr': {'AdID': 'ID Publicité', 'CampaignID': 'ID Campagne'},
        'es': {'AdID': 'ID Anuncio', 'CampaignID': 'ID Campaña'},
        'it': {'AdID': 'ID Annuncio', 'CampaignID': 'ID Campagna'},
        'nl': {'AdID': 'Advertentie-ID', 'CampaignID': 'Campagne-ID'},
        'ca': {'AdID': 'ID Anunci', 'CampaignID': 'ID Campanya'},
        'ko': {'AdID': '광고ID', 'CampaignID': '캠페인ID'},
        'ja': {'AdID': '広告ID', 'CampaignID': 'キャンペーンID'}
    };

    // 动态检测用户的浏览器或网站语言
    let lang = navigator.language || navigator.userLanguage;
    console.log(lang);
    lang = lang.split('-')[0]; // 处理类似'en-US'的语言代码

    let adID_k = translations[lang].AdID;
    let campaignID_k = translations[lang].CampaignID;

    // 改进的 applyLabelsAndIds 函数
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
        document.querySelectorAll('.ad-id-element, .campaign-id-element').forEach(idElem => {
            idElem.remove();
        });

        searchResults.forEach(result => {
            let label;
            let adIdElement;
            let campaignIdElement;

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
                // console.log('adData');
                // console.log(adDataAttribute);
                let adId = null;
                let campaignId = null;
                if (adDataAttribute) {
                    // 解码HTML实体，然后解析JSON
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

            // 将序号标签预置到搜索结果元素的标题下方
            const titleElement = result.querySelector('div[data-cy="title-recipe"]'); // 标题元素的选择器可能依网页而异
            if (titleElement) {
                let infoContainer = createInfoContainer();
                infoContainer.appendChild(label); // 序号标签
                if (adIdElement) {
                    // 广告ID标签
                    let adIdContainer = document.createElement('span'); // 创建一个新的容器
                    adIdContainer.appendChild(adIdElement); // 将广告ID元素加入新容器
                    infoContainer.appendChild(adIdContainer); // 将新容器加入信息容器
                }

                if (campaignIdElement) {
                    // 活动ID标签
                    let campaignIdContainer = document.createElement('div'); // 创建一个新的容器
                    campaignIdContainer.appendChild(campaignIdElement); // 将活动ID元素加入新容器
                    infoContainer.appendChild(campaignIdContainer); // 将新容器加入信息容器
                }

                // 将信息容器插入到标题元素的下一行
                titleElement.parentNode.insertBefore(infoContainer, titleElement.nextSibling);
            }
        });
    };

    // 创建信息容器的函数，将标签和ID聚合在一起
    function createInfoContainer() {
        let container = document.createElement('div');
        container.style.display = 'block';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'center';
        container.style.marginTop = '5px'; // 在标题下方添加一些间距
        return container;
    }

    // 创建标签的函数，避免重复代码
    function createLabel(text, backgroundColor, foregroundColor) {
        let label = document.createElement('span');
        label.textContent = text;
        // 样式设置
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

    // 创建广告id或活动id元素的函数，避免重复代码
    function createIdElement(text, className) {
        let idElement;

        idElement = document.createElement('div');
        idElement.textContent = text;
        idElement.style.backgroundColor = '#DAA520'; // 金色背景色
        idElement.style.color = '#FFFFFF'; // 白色字体
        idElement.style.fontWeight = 'bold'; // 字体加粗
        idElement.style.padding = '3px 6px'; // 内边距
        idElement.style.marginLeft = '10px'; // 左边距
        idElement.style.borderRadius = '4px'; // 边框圆角
        idElement.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.3)'; // 简单阴影效果
        idElement.style.fontSize = '0.75rem'; // 字体大小
        idElement.style.textAlign = 'center'; // 文本居中
        idElement.style.verticalAlign = 'middle'; // 垂直居中
        idElement.style.display = 'inline-block'; // 使用inline-block以便应用宽高、边距等
        idElement.style.minWidth = '80px'; // 最小宽度，保证布局的一致性
        idElement.style.height = '20px'; // 元素高度
        idElement.style.lineHeight = '20px'; // 行高与元素高度一致以垂直居中文本

        idElement.classList.add(className); // 添加自定义类以便删除
        return idElement;
    }


    // 保存当前页面的URL
    let currentUrl = window.location.href;

    const observer = new MutationObserver((mutations) => {
        let pageChanged = window.location.href !== currentUrl;
        if (pageChanged) {
            currentUrl = window.location.href;
            waitForContentLoaded().then(() => {
                applyLabelsAndIds(); // 确保新内容加载后再运行
            });
        }
    });

    const waitForContentLoaded = () => {
        return new Promise((resolve) => {
            // 假设新内容加载大约需要500ms
            setTimeout(resolve, 500);
        });
    };

    // 设置 observer 监听
    observer.observe(document.body, {childList: true, subtree: true});

    // 初次调用
    applyLabelsAndIds();

})();