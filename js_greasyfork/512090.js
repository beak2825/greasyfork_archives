// ==UserScript==
// @name         在Amazon搜索结果页面显示ADS_ID
// @namespace    https://noobbei.top
// @version      1.7.0
// @description  Enhance Amazon search results by adding numbers, advertisement IDs, and Best Sellers Rank.
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
// @downloadURL https://update.greasyfork.org/scripts/512090/%E5%9C%A8Amazon%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BAADS_ID.user.js
// @updateURL https://update.greasyfork.org/scripts/512090/%E5%9C%A8Amazon%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E9%9D%A2%E6%98%BE%E7%A4%BAADS_ID.meta.js
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
    };

    let lang = navigator.language.split('-')[0];
    let adID_k = translations[lang]?.AdID || translations['en'].AdID;
    let campaignID_k = translations[lang]?.CampaignID || translations['en'].CampaignID;
    let bestSellersRank_k = translations[lang]?.BestSellersRank || translations['en'].BestSellersRank;

    const applyLabelsAndIds = () => {
        let adCounter = 1;
        let searchResultCounter = 1;
        let searchResults = document.querySelectorAll('div[data-component-type="s-search-result"], .sbv-video-single-product, .AdHolder');

        searchResults.forEach(result => {
            let label, adIdElement, campaignIdElement, bestSellersRankElement;

            if (result.querySelector('.ad-counter-label, .search-result-counter-label')) {
                return;
            }

            if (result.classList.contains('AdHolder') || result.classList.contains('sbv-video-single-product')) {
                label = createLabel(`${adCounter}`, 'gold', '#000');
                label.classList.add('ad-counter-label');
                adCounter++;

                let adDataAttribute = result.querySelector('[data-s-safe-ajax-modal-trigger]');
                if (adDataAttribute) {
                    try {
                        const adData = JSON.parse(adDataAttribute.getAttribute('data-s-safe-ajax-modal-trigger'));
                        let ajaxUrl = adData.ajaxUrl;
                        let adId = decodeURIComponent(ajaxUrl).match(/"adId":"([^"]*)"/)?.[1];
                        let campaignId = decodeURIComponent(ajaxUrl).match(/"campaignId":"([^"]*)"/)?.[1];

                        if (adId) {
                            adIdElement = createIdElement(`${adID_k}: ${adId}`, 'ad-id-element');
                        }

                        if (campaignId) {
                            campaignIdElement = createIdElement(`${campaignID_k}: ${campaignId}`, 'campaign-id-element');
                        }
                    } catch (e) {
                        console.error("Failed to extract Ad ID or Campaign ID", e);
                    }
                }
            } else {
                label = createLabel(`${searchResultCounter}`, 'green', '#FFF');
                label.classList.add('search-result-counter-label');
                searchResultCounter++;
            }

            let rankElement = result.querySelector('span.a-size-small.a-text-normal');
            if (rankElement) {
                let rankText = rankElement.textContent.trim();
                if (rankText) {
                    bestSellersRankElement = createIdElement(`${bestSellersRank_k}: ${rankText}`, 'best-sellers-rank-element');
                }
            }

            const titleElement = result.querySelector('h2, span[data-component-type="sbv-single-product-title"]');
            if (titleElement) {
                let infoContainer = createInfoContainer();
                infoContainer.appendChild(label);
                if (adIdElement) infoContainer.appendChild(adIdElement);
                if (campaignIdElement) infoContainer.appendChild(campaignIdElement);
                if (bestSellersRankElement) infoContainer.appendChild(bestSellersRankElement);

                titleElement.parentNode.insertBefore(infoContainer, titleElement.nextSibling);
            }
        });
    };

    function createInfoContainer() {
        let container = document.createElement('div');
        container.style.display = 'flex';
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
        label.style.display = 'inline-block';
        label.style.width = '25px';
        label.style.height = '25px';
        label.style.textAlign = 'center';
        label.style.marginLeft = '10px';
        label.style.marginRight = '5px';
        label.style.lineHeight = '25px';
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
        idElement.style.fontSize = '0.75rem';
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

    observer.observe(document.querySelector('#search'), {childList: true, subtree: true});

    applyLabelsAndIds();

})();
