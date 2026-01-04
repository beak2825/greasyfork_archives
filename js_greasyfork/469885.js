// ==UserScript==
// @name         Amazon送料込
// @version      0.88
// @description  Amazonで送料込みの値段を表示する
// @match        https://www.amazon.co.jp/dp/*
// @match        https://www.amazon.co.jp/*/dp/*
// @match        https://www.amazon.co.jp/gp/product/*
// @match        https://www.amazon.co.jp/*/ASIN/*
// @match        https://www.amazon.co.jp/product-reviews/*
// @match        https://www.amazon.co.jp/*/product-reviews/**
// @author       TNB
// @license      MIT
// @grant        none
// @namespace    https://greasyfork.org/users/3989
// @downloadURL https://update.greasyfork.org/scripts/469885/Amazon%E9%80%81%E6%96%99%E8%BE%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/469885/Amazon%E9%80%81%E6%96%99%E8%BE%BC.meta.js
// ==/UserScript==

/********************  SETTING **************************/

// 出品者リストでスクロールした時に固定される出品者を非表示にする true/false
const hide_fixed_exhibitors = false;
// 新規出品者を非表示にする true/false
const hide_new_exhibitors = false;
// ハイライトテキストの色
const highlight_color = '#f00';
// 評価の設定値を下回った出品者の背景色
const caution_exhibitors_bg_color = 'rgba(255, 0, 0, 0.2)';
// 新規出品者の背景色
const new_exhibitors_bg_color = 'rgba(0, 0, 255, 0.2)';
// 非表示の出品者の背景色
const remove_exhibitors_bg_color = 'rgba(0, 0, 0, 0.3)';

// 一つでも下記の設定未満の評価がある場合出品者の背景色をcaution_exhibitors_bg_colorに変えます。0にするとその項目ではフィルターされません。
// 星の数
const star = 4;
// 評価件数
const evaluations_count = 15;
// 高評価の割合(%)
const evaluation = 70;

// 一つでも下記の設定未満の評価がある場合出品者を非表示にします。各項目の意味は上の設定と同じ。
const min_star = 3;
const min_evaluations_count = 0;
const min_evaluation = 60;

/********************************************************/

(function() {

    'use strict';

    const l = hide_new_exhibitors? 'div#aod-offer[class*="aas"]:not(.aas-caution-exhibitors)': '.aas-remove-exhibitors';

    (function() {
        const style = document.head.appendChild(document.createElement('style'));
        style.innerHTML = `
           .aas-hide{display:none;}
           .a-tab-container .a-box-inner[class*="exhibitors"]{border-radius:0 0 8px 8px !important;}
           .a-box-inner[class*="exhibitors"] .a-accordion-inner{background:transparent !important;}
            #aod-offer + hr{border-bottom:solid #BBBFBF 3px;}
            #aod-sticky-pinned-offer hr{border-bottom:solid #BBBFBF 2px;}
            #aod-sticky-pinned-offer[class*="exhibitors"]::after{content:'';position:absolute;width:100%;height:100%;top:0;z-index:-1;}
            .aas-rated-low{filter: invert(12%) sepia(77%) saturate(7199%) hue-rotate(359deg) brightness(102%) contrast(108%);}
            .MMGridLayout .formatsRow .swatchElement .slot-price.aas-highlight-text > *,span.aas-highlight-text,.aas-highlight-text>span,.aas-count-low{color:${highlight_color} !important;}
            .aas-bold-text{font-weight:bold;}
            .aas-remove-exhibitors, #aod-sticky-pinned-offer.aas-remove-exhibitors::after{background:${remove_exhibitors_bg_color};}
            .aas-caution-exhibitors, #aod-sticky-pinned-offer.aas-caution-exhibitors::after{background:${caution_exhibitors_bg_color};}
            .aas-new-exhibitors, #aod-sticky-pinned-offer.aas-new-exhibitors::after{background:${new_exhibitors_bg_color};}
            #aod-offer-list:not(.aas-display-exhibitors) ${l}{max-height:0;padding-top:0 !important;padding-bottom:0 !important;overflow:hidden;}
            #aod-offer-list:not(.aas-display-exhibitors) ${l}+hr{display:none;}
            #aod-offer-list.aas-display-exhibitors ${l}{max-height:100vh;transition: .3s;}
            #aod-offer-list.aas-delay-exhibitors ${l}{transition: .2s;}
            span.aas-base-price{display:block;position:absolute;padding:1px 10px;background:#fff;color:#000 !important;top:0;margin-top:-35px;border:1px solid #ddd;border-radius:10%;font-size:14px;font-weight:normal;opacity:0;visibility:hidden;z-index:9999999;}
            .aas-base-price:before,.aas-base-price:after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);}
            .aas-base-price:before{border:6px solid transparent;border-top:6px solid #ddd;}
            .aas-base-price:after{border:4px solid transparent;border-top:4px solid #fff;margin-top:0;}
            span+span>.aas-base-price{left:0;}
            #newBooksSingleBuyingOptionHeader_feature_div .aas-base-price{margin-left:110px;}
            span.aas-re-percentage{color:#00793D !important;}
            #moreBuyingChoices_feature_div .aas-base-price{margin-top:-25px;}
            #usedOnlyBuybox .aas-base-price{margin-top:-10px;}
            #usedAccordionRow #usedPrice + .aas-base-price{margin-top:0;}
            #buyBoxAccordion>div{overflow:initial;}
            .aas-highlight-text:hover>.aas-base-price:not(:hover){opacity:1;visibility:visible;transition:opacity .2s;}
            .aas-toggle-button{width:fit-content;float:right;margin:-40px -25px 0 0;padding:0 10px;border:solid 1px #d8dcdc;border-radius:8px;background:#f0f2f2;box-shadow:0 2px 5px 0 rgba(213,217,217,.5);line-height:28px;cursor:pointer;}
            #aod-sort-details-string[style*="display: none;"] + .aas-toggle-button{margin:-25px auto 0 0;}
            .aas-toggle-button:hover{background:#f7fafa;}
            /*** for Chrome ***/
            #usedOnlyBuybox .a-price-whole+.aas-base-price,#usedAccordionRow .a-price-whole+.aas-base-price{margin-top:-30px;}
            .a-accordion .a-accordion-inner{overflow:initial !important;}
        `;
        if (hide_fixed_exhibitors) style.innerHTML += '#aod-sticky-pinned-container{display:none;}';
    })();
    function isHighlighting(i) {
        let rating = i.firstElementChild.className.match(/\sa-star-brand-mini-(.*?)\s/);
        if (!rating) return 'aas-new-exhibitors';
        rating = rating[1].replace(/-/, '.');
        const len = i.textContent.match(/.+?(\d+)/)[1];
        let per = i.textContent.match(/(\d+)%/);
        per = per? per[1]: undefined;
        if (star > rating) i.firstElementChild.classList.add('aas-rated-low');
        if (evaluations_count > len) i.innerHTML = addHighlightText(i, `${len}件`, 'aas-count-low');
        if (evaluation > per) i.innerHTML = addHighlightText(i, `${per}%`, 'aas-count-low');
        if (min_star > rating || min_evaluations_count > len || min_evaluation > per) return 'aas-remove-exhibitors';
        if (i.querySelector('.aas-count-low, .aas-rated-low')) return 'aas-caution-exhibitors';
    }
    function checkExhibitors(id) {
        const exhibitors = document.querySelectorAll(`${id}:not(.aas-checked-exhibitors)`);
        if (exhibitors.length === 0) return;
        for (const i of exhibitors) {
            const exhibitors_class = isHighlighting(i);
            if (exhibitors_class) i.closest('.a-box-inner, #aod-offer, #aod-pinned-offer > .a-section, #aod-sticky-pinned-offer').classList.add(exhibitors_class);
            i.classList.add('aas-checked-exhibitors');
        }
    }
    function convertToInt(text) {
        return text.replace(/[^\d]/g, '') * 1;
    }
    function getShipping(data) {
        return data? data.textContent.match(/^.+?[\u00A5|\uffe5]([,|\d]+)(\s+[\u4E00-\u9FFF]{3})?/m): '';
    }
    function getCostPrice(item) {
        // ポップアップ
        if (document.querySelector('body[style *= "overflow: hidden"]')) return [item.closest('#aod-offer-price, #aod-pinned-offer, #aod-sticky-pinned-offer').querySelector('.a-price-whole')];
        // その他のおすすめ
        if (item.closest('#moreBuyingChoices_feature_div')) return [item.closest('.a-row').firstElementChild];
        // アコーディオン無し
        if (!document.querySelector('#newAccordionRow_0')) return document.querySelectorAll('#desktop_buybox .a-price-whole, #desktop_buybox .offer-price, #desktop_buybox .a-offscreen, #apex_desktop .a-price-whole, #apex_desktop .offer-price, #formats .a-color-price, #booksHeaderInfoContainer .a-color-price');
        // アコーディオン中古
        if (item.closest('#usedAccordionRow')) return item.closest('#usedAccordionRow').querySelectorAll('#usedPrice, .a-price > span');
        // アコーディオン新品
        return document.querySelectorAll('#mediamatrix_feature_div .a-color-price, #corePrice_feature_div .a-offscreen, #newAccordionRow_0 .a-price > span');
    }
    function addHighlightText(base_text, replace_text, css) {
        return base_text.innerHTML.replace(replace_text, `<span class="${css}">${replace_text.replace(/^\+/, '')}</span>`);
    }
    function sumShipping(price, shipping) {
        if (!price.textContent) return;
        const base = price.textContent.trim().match(/^(\D)?([,|\d]+)$/);
        if (!base) return;
        return (base[1] || '') + (convertToInt(base[2]) + convertToInt(shipping)).toLocaleString();
    }
    function getPercentageContainer(price) {
        const price_container = price.closest('span[id^="aod-price"], #corePriceDisplay_desktop_feature_div');
        if (!price_container) return;
        return price_container.querySelector('span[class*="Percentage"]');
    }
    function recalculationPercentage(percentage) {
        const reference_price = percentage.closest('span[id^="aod-price"], #corePriceDisplay_desktop_feature_div').querySelector('div:last-of-type');
        const denominator = convertToInt(getShipping(reference_price)[1]);
        const numerator = convertToInt(percentage.textContent);
        const p = Math.round(((numerator - denominator)/ denominator) * 100);
        return `${p >= 0? '+' + p: p}%`;
    }
    function formattingText(price, shipping) {
        price.textContent = sumShipping(price, shipping);
        price.classList.add('aas-highlight-text');
        price.parentElement.classList.add('aas-highlight-text');
        const percentage = getPercentageContainer(price);
        if (!percentage) return;
        percentage.textContent = recalculationPercentage(price);
        percentage.classList.add('aas-re-percentage');
    }
    function updateExhibitorsCount() {
        const offer_list = document.querySelector('#aod-offer-list');
        if (!offer_list) return;
        const hide_exhibitors = offer_list.querySelectorAll(`${l}`);
        const count_text = document.querySelector('span[data-exhibitors-count]');
        if (count_text.dataset.exhibitorsCount == hide_exhibitors.length) return;
        count_text.textContent = `${hide_exhibitors.length}件の`;
        count_text.dataset.exhibitorsCount = hide_exhibitors.length;
        count_text.parentElement.classList.remove('aas-hide');
        offer_list.classList.remove('aas-delay-exhibitors');
    }
    function createDisplayButton() {
        if (document.querySelector('.aas-toggle-button')) return;
        const p = document.querySelector('#aod-filter > .a-row > #aod-message-component');

        if (!p) return;
        const offer_list = document.querySelector('#aod-offer-list');
        const button_container = p.appendChild(document.createElement('div'));
        button_container.className = 'aas-toggle-button aas-hide';
        button_container.innerHTML = '<span data-exhibitors-count="0"></span>出品者を<span class="aas-hide">非</span>表示';
        button_container.addEventListener('click', () => {
            offer_list.classList.add('aas-delay-exhibitors');
            offer_list.classList.toggle('aas-display-exhibitors');
            button_container.lastElementChild.classList.toggle('aas-hide');
        });
    }
    function createBaseCostPanel(price) {
        const basePrice = document.createElement('span');
        basePrice.textContent = price.textContent.replace(/^\D?([,|\d]+)$/, '\￥$1');
        basePrice.classList.add('aas-base-price');
        return basePrice;
    }
    function addShipping() {
        const postages = document.querySelectorAll('span[data-csa-c-delivery-price]:not(.aas-in-taxed), #moreBuyingChoices_feature_div .a-size-base:not(.aas-in-taxed)');
        if (postages.length === 0) return;

        for (const item of postages) {
            item.classList.add('aas-in-taxed');
            const postage = getShipping(item);
            if (postage) {
                const cost = Array.from(getCostPrice(item)).filter(c => !/aas/.test(c.className));
                item.innerHTML = addHighlightText(item, postage[0], 'aas-highlight-text aas-bold-text');
                for (const price of cost) {
                    price.parentElement.appendChild(createBaseCostPanel(price));
                    formattingText(price, postage[1]);
                }
            }
        }
    }
    new MutationObserver(() => {
        if (document.querySelector('body[style *= "overflow: hidden"]')) {
            addShipping();
            checkExhibitors('#aod-offer-seller-rating');
            createDisplayButton();
            updateExhibitorsCount();
            return;
        }
        addShipping();
        checkExhibitors('#tbb_mr_star_dp');
    }).observe(document.body, {childList: true, subtree: true});
})();
