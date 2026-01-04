// ==UserScript==
// @name         atbmarket.com - price for kilogram
// @name:uk      atbmarket.com - ціна за кілограм
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  Shows price per kilo for products in catalog/search/product page. Improves voice search expirience with dictanote.co chrome extension
// @description:uk Показує ціну за кілограм для продуктів у каталозі/пошуку/на сторінці продукту. Покращує роботу голосового пошуку за допомогою розширення dictanote.co для Google Chrome
// @author       Untiy16
// @license      MIT
// @match        https://www.atbmarket.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atbmarket.com
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/488752/atbmarketcom%20-%20price%20for%20kilogram.user.js
// @updateURL https://update.greasyfork.org/scripts/488752/atbmarketcom%20-%20price%20for%20kilogram.meta.js
// ==/UserScript==

'use strict';

//regex to parse weight from product title
const regex = /(\d+(?:[\.,]\d+)?)\s*(г|кг|мл|л)(?=($|\s|[^a-zA-Z0-9_а-яА-я]))/m;
const regexTeaBag = /(\d+)\s*(ф\/п)\s*(\*|x|X|х|Х)\s*(\d+(?:[\.,]\d+)?)/m;
let isActive = (localStorage.getItem('pricePerKiloMode') ?? 'true') === 'true';

//Add toggle to quick disable/enable 'price for kilo' functionality
$('.top-header__phone-tablet')
    .clone()
    .insertAfter($('.top-header__phone-tablet'))
    .html(`Ціна за кілограм <input type="checkbox" id="pricePerKiloMode" ${isActive ? 'checked' : ''}>`);

//add class to body and state to localStorage
$(pricePerKiloMode)
    .change(function() {
        isActive = pricePerKiloMode.checked;
        localStorage.setItem('pricePerKiloMode', isActive);
        $('body').toggleClass('price-per-kilo_global--hidden', !isActive);
    })
    .change();

//-------------- TRIGGER VOICE INPUT SECTION START ---------------//
setInterval(() => {
    if ($('#q').is(':visible') && $('#voicein_container').is(':visible')) {
        //trigger site search after voice input
        if (q.value != '' && Multisearch.config.hash != encodeURI(q.value)) {
            Multisearch.config.hash = encodeURI(q.value);
            location.href = `${location.pathname}${Multisearch.config.search_path}${q.value}`;
            // location.reload();
        }

        //erace previous text from search input before inserting
        if ($('#q').is(':visible') && $('#voicein_container').length && $($('#voicein_container')[0].shadowRoot).find('#voicein_voicebox').is(':visible')) {
            q.value = '';
        }
    }
}, 1000);
//-------------- TRIGGER VOICE INPUT SECTION END ---------------//

//-------------- LIST SECTION START ---------------//
//add price per kilo blocks to products in catalog
function handleCatalogItem(item) {
    let title = $(item).find('.catalog-item__title').text().trim();
    let match = getMatch(title);
    if (match !== null) {
        $(item)
            .find('> .catalog-item__bottom')
            .clone()
            .insertAfter($(item).find('> .catalog-item__bottom'))
            .addClass('price_per_kilo catalog-item__price-per-kilo catalog-item__price-per-kilo--value catalog-item__price-per-kilo--hidden')
            .find('.catalog-item__counter').remove();

        let $priceBlock = $(item).find('> .catalog-item__bottom').last();
        insertPricesPerKilo($priceBlock, getFormatedWeight(match));
    }
}

$(document).on('mouseenter mouseleave', 'article.catalog-item', function(e) {
    if (!$(this).find('.catalog-item__price-per-kilo').length) {
        handleCatalogItem(this);
    }

    $(this).find('.catalog-item__price-per-kilo').toggleClass('catalog-item__price-per-kilo--hidden', e.type === 'mouseleave');

    insertUnitWeight($(this));
});

// (new URLSearchParams(window.location.search)).get('page');
$('.catalog-page__sort').prepend('<button class="sort_by_price_pe_kilo">Сортувати за ціною за кілограм</button>');
$('.catalog-page__sort').prepend('<button class="sort_by_max_discount">Сортувати за найбільшою знижкою</button>');
$('.sort_by_price_pe_kilo, .sort_by_max_discount').on('click', function () {
    const $this = $(this);
    let runSort = function () {
        $this.text('Готово!').prop('disabled', 1);
        switch($this.attr('class')) {
            case 'sort_by_price_pe_kilo':
                sortCatalogByPricePerKilo(); break;
            case 'sort_by_max_discount':
                sortCatalogByMaxDiscount(); break;
        }
        
    };
    let currentPage = parseInt((new URLSearchParams(window.location.search)).get('page'));
    if (!isNaN(currentPage) && currentPage > 1) {
        location.href = `${location.href.replace(/&page=\d+/gm, '').replace(/\page=\d+&/gm, '').replace(/\page=\d+/gm, '')}${location.href.includes('?') ? '&' : '?'}runSortByPricePerKilo=1`;
        return false;
    }
    let havePagination = $('.product-pagination .product-pagination__item').length;
    if (havePagination) {
        $('.main-container').addClass('main-container--loading');
        loadPaginatedProductsRecursively(
            $('.product-pagination__item.active + .product-pagination__item a').attr('href'),
            () => {
                $('.main-container').removeClass('main-container--loading');
                $('.product-pagination').hide();
                runSort();
            },
            () => {
                $('.main-container').removeClass('main-container--loading');
            }
        );
    } else {
        runSort();
    }
});

if (location.href.includes('runSortByPricePerKilo=1')) {
    $('.sort_by_price_pe_kilo').click();
}


//-------------- LIST SECTION END ---------------//

//--------------PROD PAGE SECTION START ---------------//
//add price per kilo block on product page
if (location.pathname.includes('/product/')) {
    insertUnitWeight($('.product-about__buy-row'));
    let title = $('.product-page__title').text().trim();
    let match = getMatch(title);
    if (match !== null) {
        let $priceBlock = $('.product-about__buy-row').first().clone();
        $priceBlock.insertAfter($('.product-about__buy-row').first());
        // let $priceBlock = $('.product-about__buy-row').last();
        $priceBlock.css({'grid-row': 'unset'});
        $priceBlock.addClass('price_per_kilo product-about__price-per-kilo product-about__price-per-kilo--value');
        $priceBlock.find('.product-about__counter').css({'opacity': '0', 'pointer-events': 'none'});
        insertPricesPerKilo($priceBlock, getFormatedWeight(match));
    }
}
//--------------PROD PAGE SECTION END ---------------//

//--------------SEARCH SECTION START ---------------//
//add price per kilo and relevant price to products in search popap
$(document).on('mouseenter', '.multi-search .multi-item', function() {
    let $this = $(this);
    if ($this.find('.search-custom-price').length || $this.hasClass('search-custom-price--loading')) {
        return false;
    }

    $this.addClass('search-custom-price--loading');
    let title = $this.find('.multi-content a span').text().trim();
    let match = getMatch(title);

    let url = $this.find('.multi-content a').attr('href');
    $.get(url, function(data) {
        let $data = $(data).find('.product-main .product-price--weight');
        let price = parseFloat($data.find('.product-price__top span').text());
        let oldPrice = parseFloat($data.find('.product-price__bottom span').text());
        let card = parseFloat($data.find('.atbcard-sale__price-top span').text());
        $this.find('.multi-oldPrice, .multi-price').hide();
        $(getSearchPricesHtml(match ? getFormatedWeight(match) : 0, price, oldPrice, card)).insertBefore($this.find('.b-addToCart'));
    }).always(function() {
        $this.removeClass('search-custom-price--loading');
    });
});
//--------------SEARCH SECTION END ---------------//


//-------------- HELPERS ---------------//
function getSearchPricesHtml(weight, price, oldPrice = 0, card = 0) {
    let picePerK
    return `
        <div class="search-custom-price">
            ${oldPrice ? `<div class="search-custom-price_bottom">${addTracingZero(oldPrice)}</div>` : ''}
            <div class="search-custom-price_top">${addTracingZero(price)}</div>
            ${card ? `<div class="search-custom-price_card">${addTracingZero(card)}</div>` : ''}
        </div>
        ${weight ?
            `
            <div class="price_per_kilo search-custom-price__price-per-kilo search-custom-price__price-per-kilo--text">-- Ціна за кілограм --</div>
            <div class="search-custom-price price_per_kilo search-custom-price__price-per-kilo .search-custom-price__price-per-kilo--text">
                ${oldPrice ? `<div class="search-custom-price_bottom">${getPricePerKilo(oldPrice, weight).price}</div>` : ''}
                <div class="search-custom-price_top">${getPricePerKilo(price, weight).price}</div>
                ${card ? `<div class="search-custom-price_card">${getPricePerKilo(card, weight).price}</div>` : ''}
            </div>`
            :
            ''
        }
    `;
}

function getPricePerKilo(price, weight) {
    price = Math.round((price * 1000 / weight) * 100) / 100;
    price = price.toString();
    let intPart = price.split('.')[0];
    let decimalPart = price.split('.')[1];
    decimalPart = decimalPart ? decimalPart : '0';
    decimalPart = addTracingZero(decimalPart, true);

    return {
        'price': addTracingZero(price),
        'int': intPart,
        'decimal': decimalPart,
    }

}

function addTracingZero(price, isDecimalPart = false) {
    price = price.toString();
    // price = !price.includes('.') && !isDecimalPart ? `${price}.00` : price;

    return (
            (isDecimalPart && price.length === 2) ||
            (price.includes('.') && price.split('.')[1].length === 2) ||
            (!price.includes('.') && !isDecimalPart)
        )
        ?
        price
        :
        `${price}0`;
}

function getFormatedWeight(match) {
   match[1] = match[1].replaceAll(',', '.');
   return (match[2] === 'кг'
    || match[2] === 'л')
        ? match[1] * 1000 : parseFloat(match[1]);
}

function insertPricesPerKilo($priceBlock, weight) {
    let hasUnitSwitch = $priceBlock.find('.change-weight').length > 0;
    if (hasUnitSwitch) {
        return;
    }
    let $cardPrice = $priceBlock.find('.atbcard-sale__price-top');
    if ($cardPrice.length) {
        let price = getPricePerKilo($cardPrice.attr('value'), weight);
        $cardPrice.html(`<span>${price.int}.<sup class="product-price__coin">${price.decimal}</sup></span>`);
    }

    let $bottomPrice = $priceBlock.find('.product-price__bottom');
    if ($bottomPrice.length) {
        let price = getPricePerKilo(parseFloat($bottomPrice[0].innerText), weight);
        $bottomPrice = $bottomPrice.find('> span').eq(0);
        $bottomPrice.html(`<span>${price.int}.<sup class="product-price__coin">${price.decimal}</sup></span>`);
    }

    let $topPrice = $priceBlock.find('.product-price__top');
    if ($topPrice.length) {
        let price = getPricePerKilo(parseFloat($topPrice[0].innerText), weight);
        $topPrice = $topPrice.find('> span').eq(0);
        $topPrice.html(`<span>${price.int}.<sup class="product-price__coin">${price.decimal}</sup></span>`);
        $topPrice.next().find('span').text('/кг');
    }

}

function getLowestPricePerKilo($priceBlock, weight) {
    let prefixSelector = '.product-price--weight';
    if (weight === null) {
        weight = 1000;
    }

    let pricesPerKilo = [];
    let prices = [];
    let $topPrice = $priceBlock.find(`${prefixSelector} .product-price__top`);
    if ($topPrice.length) {
        pricesPerKilo.push(getPricePerKilo(parseFloat($topPrice[0].innerText), weight).price);
        prices.push(parseFloat($topPrice[0].innerText));
    }

    let $bottomPrice = $priceBlock.find(`${prefixSelector} .product-price__bottom`);
    if ($bottomPrice.length) {
        pricesPerKilo.push(getPricePerKilo(parseFloat($bottomPrice[0].innerText), weight).price);
        prices.push(parseFloat($bottomPrice[0].innerText));
    }

    let $cardPrice = $priceBlock.find(`${prefixSelector} .atbcard-sale__price-top`);
    if ($cardPrice.length) {
        pricesPerKilo.push(getPricePerKilo($cardPrice.attr('value'), weight).price);
        prices.push($cardPrice.attr('value'));
    }

    let discount  = (prices.length ? Math.max(...prices) : 0) - (prices.length ? Math.min(...prices) : 0);
    if (discount > 0.1) {
        $(`<span style="font-weight: bold; color: red;">(Знижка: ${Math.round((discount + Number.EPSILON) * 100) / 100}) </span>`).insertBefore($priceBlock.closest('article').find('.catalog-item__title a'));
    }


    // let title = $priceBlock.closest('article').find('.catalog-item__title a').text();

    return pricesPerKilo.length ? Math.min(...pricesPerKilo) : 0;
}

function getProductDiscount($priceBlock) {
    let prefixSelector = '.product-price--weight';
    let prices = [];
    let $topPrice = $priceBlock.find(`${prefixSelector} .product-price__top`);
    if ($topPrice.length) {
        prices.push(parseFloat($topPrice[0].innerText));
    }

    let $bottomPrice = $priceBlock.find(`${prefixSelector} .product-price__bottom`);
    if ($bottomPrice.length) {
        prices.push(parseFloat($bottomPrice[0].innerText));
    }

    let $cardPrice = $priceBlock.find(`${prefixSelector} .atbcard-sale__price-top`);
    if ($cardPrice.length) {
        prices.push($cardPrice.attr('value'));
    }

    let discount  = (prices.length ? Math.max(...prices) : 0) - (prices.length ? Math.min(...prices) : 0);

    let title = $priceBlock.closest('article').find('.catalog-item__title a').text();
    if (discount > 0.1) {
        $(`<span style="font-weight: bold; color: red;">(Знижка: ${Math.round((discount + Number.EPSILON) * 100) / 100}) </span>`).insertBefore($priceBlock.closest('article').find('.catalog-item__title a'));
    }


    return discount;
}

function getMatch(title) {
    let teabagMatch = regexTeaBag.exec(title);
    
    if (teabagMatch !== null) {
        return [
            '',
            eval(teabagMatch[0].replace('ф/п', '').replaceAll(' ', '').replace(',', '.').replace(/x|X|х|Х/, '*')).toString(),
            'г'
        ];
    } else {
        return regex.exec(title);
    }
}

function insertUnitWeight($parent) {
    if (!$parent.attr('data-unit-weight-appended') && $parent.find('.change-weight').length) {
        let weight = `${Math.round($parent.find('.checkbox-custom__input').attr('data-unit-step') * 1000)}г`;
        $parent.find('.product-price--unit .product-price__unit').append(` (${weight})`);
        $parent.attr('data-unit-weight-appended', 1);
    }
}

function loadPaginatedProductsRecursively(url, finishCallback, errorCallback) {
    //https://devtoolstips.org/tips/en/list-all-event-listeners/ - pull element event

    $.ajax({
        async: false,
        url: url,
        success: function(data) {
            let $products = $(data).find('.catalog-list > article.catalog-item');
            if ($products.length) {
                $('.catalog-list').append($products);
                $products.find('.b-addToCart').addClass('b-addToCart--appended').on('click', function() {
                    $(this).closest('article').find('.catalog-item__title a').attr('target', '_blank')[0].click();
                });
            }


            let $nextPageBtn = $(data).find('.product-pagination__item.next');
            if ($nextPageBtn.length && !$nextPageBtn.hasClass('disabled')) {
                setTimeout(() => loadPaginatedProductsRecursively($nextPageBtn.find('a').attr('href'), finishCallback, errorCallback), 1000);
            } else {
                finishCallback();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('Error! (see console for details)');
            console.log(jqXHR, textStatus, errorThrown);
            errorCallback();
        }
    });
}

function sortCatalogByPricePerKilo() {
    $('article.banner-item').hide();
    $('.catalog-list article.catalog-item').each(function() {
        let title = $(this).find('.catalog-item__title').text().trim();
        let match = getMatch(title);
        let $priceBlock = $(this).find('> .catalog-item__bottom:not(.price_per_kilo)').first();
        $(this).attr('data-lowest-price-per-kilo', getLowestPricePerKilo($priceBlock, match !== null ? getFormatedWeight(match) : 1000));
    });

    $('article.catalog-item', '.catalog-list').sort(function (a, b) {
        var contentA = parseFloat($(a).attr('data-lowest-price-per-kilo'));
        var contentB = parseFloat($(b).attr('data-lowest-price-per-kilo'));
        return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    }).prependTo('.catalog-list');
}

function sortCatalogByMaxDiscount() {
    $('article.banner-item').hide();
    $('.catalog-list article.catalog-item').each(function() {
        let title = $(this).find('.catalog-item__title').text().trim();
        let match = getMatch(title);
        let $priceBlock = $(this).find('> .catalog-item__bottom:not(.price_per_kilo)').first();
        $(this).attr('data-max-discount', getProductDiscount($priceBlock));
    });

    $('article.catalog-item', '.catalog-list').sort(function (a, b) {
        var contentA = parseFloat($(a).attr('data-max-discount'));
        var contentB = parseFloat($(b).attr('data-max-discount'));
        return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    }).prependTo('.catalog-list');
}

//-------------- STYLES ---------------//

GM_addStyle(/*css*/`
    .catalog-item__price-per-kilo--hidden {
        display: none !important;
    }

    .price-per-kilo_global--hidden .price_per_kilo {
        display: none !important;
    }

    .search-custom-price {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .search-custom-price_bottom,
    .search-custom-price_top,
    .search-custom-price_card {
        font-weight: 600;
        margin-right: 5px;
    }

    .search-custom-price_bottom:last-child,
    .search-custom-price_top:last-child,
    .search-custom-price_card:last-child {
        margin-right: 0px;
    }

    .search-custom-price_bottom {
        text-decoration: line-through;
        color: var(--text-grey);
    }

    .search-custom-price_top {
        color: var(--text-color);
    }

    .search-custom-price_bottom + .search-custom-price_top {
        color: var(--accent-color) !important;
    }

    .search-custom-price_card {
        width: fit-content;
        padding: 2px 4px;
        color: var(--accent-light);
        background: #28aa4e;
        border-radius: 4px;
    }

    .search-custom-price__price-per-kilo--text {
        margin-top: -10px;
        font-weight: 600;
        font-size: 12px;
        color: var(--text-color);
    }

    .product-about__price-per-kilo {
        margin-top: 15px;
        position: relative;
    }

    .product-about__price-per-kilo::before {
        content: '------- Ціна за кілограм -------';
        position: absolute;
        top: -30px;
        left: 0;
        font-weight: bold;
    }

    .catalog-item__price-per-kilo {
        display: flex;
        // flex-direction: column;
        // align-items: flex-start;
        margin-top: 50px !important
    }

    .catalog-item__price-per-kilo .atbcard-sale {
        position: static;
    }

    .catalog-item__price-per-kilo::before {
        content: '------- Ціна за кілограм -------';
        position: absolute;
        top: -15px;
        left: 0;
        font-weight: bold;
        transform: translateY(-100%);
    }

    .multi-results .multi-label {
        width: min-content;
    }

    .sort_by_price_pe_kilo, .sort_by_max_discount {
        margin-right: 15px;
        color: black;
        font-size: larger;
        font-weight: 500;
    }
    .sort_by_price_pe_kilo[disabled], .sort_by_max_discount[disabled] {
        background-color: #bffbbf;
    }

    .b-addToCart--appended .b-addToCart__basket-btn svg {
        background: red;
        border-radius: 7px;
    }

    .b-addToCart--appended .b-addToCart__btn-wrap {
        border-color: red;
    }
`);