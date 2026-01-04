// ==UserScript==
// @name                淘寶助手
// @name:en             Taobao Helper
// @namespace           http://tbhtk.ru
// @version             0.2.7
// @license             MIT
// @description         【淘寶搜尋頁】1. 雙12優惠篩選列（淘寶店） 2. 沒有符合篩選時自動下一頁 3. 分類顯示各種圖示 4. 不需要Mouse Over顯示所有圖示（店鋪紅包及滿減等）
// @description:en      Please check Chinese version
// @icon                https://www.tbhtk.ru/static/favicon.png
// @icon64              https://www.tbhtk.ru/static/favicon.png
// @author              熊之淘寶谷
// @homepage            http://tbhtk.ru

// @match               https://s.taobao.com/search?*
// @match               http://s.taobao.com/search?*

// @run-at              document-start
// @require             https://code.jquery.com/jquery-3.2.1.slim.min.js
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34702/%E6%B7%98%E5%AF%B6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/34702/%E6%B7%98%E5%AF%B6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/*=================
 * Settings
 *=================*/
var is_show_shop_pocket = true; // 顯示「店鋪紅包」圖示
var is_show_all_labels = true; // 顯示所有雙11圖示
var is_change_label_color = true; // 調整圖示顏色
var is_enable_custom_filter_bar = true; // 開啟雙11篩選列
var auto_next_page = false;

/*=================
 * Main
 *=================*/
jQuery.noConflict();
window.console = window.console || {
    log: function () {},
    error: function () {},
    warn: function () {}
};

var itemListTo = null;
var itemFilter = [];

function addStyles() {
    // Overrides Styles
    // if (is_show_shop_pocket) {
    //     GM_addStyle(
    //         ".icon-fest-2017taobaodianpuhong { background: url(https://img.alicdn.com/tfs/TB1D5hoab_I8KJjy1XaXXbsxpXa-407-396.png);   background-repeat: no-repeat; display: inline-block; background-position: -151px -304px;  width: 70px;  height: 16px; -webkit-filter: hue-rotate(300deg); }"
    //     );
    // }

    if (is_change_label_color) {
        GM_addStyle(".icon-fest-manjian1{ -webkit-filter: hue-rotate(15deg); }");
        GM_addStyle(".icon-fest-manjian2{ -webkit-filter: hue-rotate(60deg);}");
        GM_addStyle(".icon-fest-manjian3{ -webkit-filter: hue-rotate(105deg);}");
    }

    if (is_show_all_labels) {
        // .item-ctx-hover
        GM_addStyle(".m-itemlist .grid .item { height: 376px !important; margin-bottom: -16px }");
        GM_addStyle(
            ".response-narrow  .m-itemlist .grid .item { height: 336px !important}"
        );
        GM_addStyle(
            ".response-wider  .m-itemlist .grid .item { height: 406px !important}"
        );
        GM_addStyle(
            ".m-itemlist .grid .row-4 { margin-top: 1px !important; margin-bottom: 20px;}"
        );
        GM_addStyle('.m-itemlist .grid .row-4, .m-itemlist .icon-has-more { overflow: visible !important}');
        GM_addStyle(".m-itemlist .grid .icon { margin-top: 0px !important; }");
    }


    // Custom Styles
    GM_addStyle(
        ".custom-filter-disabled, item-disabled { -webkit-filter:grayscale(100%); filter: grayscale(100%); }"
    );
    GM_addStyle(
        ".m-itemlist  .items  .item-ad.item-disabled, .item-disabled { display: none !important }"
    );
    GM_addStyle(
        ".toggle-auto-next-page.icon-hover { color: red !important; font-weight: bold}"
    )
}

function addCustomFilterRow() {
    var row = jQuery('<div></div>');
    row.addClass("filter-row");
    row.addClass("filter-row-custom");
    // jQuery('.m-sortbar').after(row);
    jQuery('.m-sortbar').after(row);
    row.insertAfter( ".m-sortbar .sort-row" );

    let list = [];
    list.push('icon-fest-dianpuhongbao5');
    list.push('icon-fest-manjian1');
    list.push('icon-fest-manjian2');
    list.push('icon-fest-manjian3');
    for (let i = 0; i < list.length; i += 1) {
        let filterName = list[i];
        row.append('<a class="filter icon-tag toggle-filter" data-filter-name="' + filterName + '" title="篩選此類活動">' +
            '<span class="img ' + filterName + '"></span>' +
            '</a>');
    }

    // Reset Filter Icons
    jQuery.each(jQuery('.toggle-filter'), function (key, el) {
        var filterName = jQuery(el).data('filterName');
        if (jQuery.inArray(filterName, itemFilter) === -1) {
            jQuery(el).addClass('custom-filter-disabled');
        }
    });

    // Attach Events
    const toggleFilter = function (e) {
        var filterName = jQuery(this).data('filterName');
        if (jQuery.inArray(filterName, itemFilter) !== -1) {
            // Remove (Disabled) Filter
            jQuery(this).addClass('custom-filter-disabled');
            itemFilter.splice(jQuery.inArray(filterName, itemFilter), 1);
        } else {
            // Add Filter
            jQuery(this).removeClass('custom-filter-disabled');
            itemFilter.push(filterName);
        }

        // Apply Filter
        applyItemFilter();
    };
    jQuery('.toggle-filter').on('click', toggleFilter);

    row.append('<a class="toggle-auto-next-page filter icon-tag" title="沒有符合時，自動下一頁">' +
        '<span class="icon icon-btn-check-big"></span>' +
        '<span class="text">自動下一頁</span>' +
        '</a>');
    if (auto_next_page) {
        jQuery('.toggle-auto-next-page').addClass('icon-hover');
    }
    jQuery('.toggle-auto-next-page').on('click', function (e) {
        auto_next_page = !auto_next_page;
        if (auto_next_page) {
            jQuery(this).addClass('icon-hover');
            applyItemFilter();
        } else {
            jQuery(this).removeClass('icon-hover');
        }
    });
}

function applyItemFilter() {
    var items = jQuery('#mainsrp-itemlist .items .item');

    var filtered = 0;
    jQuery.each(items, function (key, item) {
        let matched = true;
        if (itemFilter.length === 0) {
            matched = true;
        } else {
            matched = false;

            for (let i = 0; i < itemFilter.length; i += 1) {
                let filterName = itemFilter[i];
                // Filter By Tag
                if (jQuery(item).find('span.' + filterName).length > 0) {
                    matched = true;
                }
            }
        }

        if (matched) {
            filtered += 1;
            jQuery(item).show();
            jQuery(this).removeClass('item-disabled');

            jQuery.each(jQuery(item).find('img[data-ks-lazyload]'), function (key, el) {
                jQuery(el).attr('src', jQuery(el).attr('data-ks-lazyload'));
            });
        } else {
            // jQuery(this).removeClass('item-ad');
            jQuery(item).hide();
            jQuery(this).addClass('item-disabled');
        }
    });

    console.log(filtered);
    console.log(auto_next_page);
    if (auto_next_page && filtered === 0) {
        console.log(jQuery('a[trace="srp_select_pagedown"]'));
        jQuery('a[trace="srp_select_pagedown"]')[0].click();
    }
}

function itemListChanged() {
    var items = jQuery('#mainsrp-itemlist .items .item');

    if (items.length > 0 && jQuery('.m-sortbar .filter-row').length > 0) {
        // Add Custom Filter Row
        if (jQuery('.filter-row-custom').length === 0) {
            addCustomFilterRow();
        }
    }
    applyItemFilter();
}


function addObserver() {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    if (!MutationObserver) {
        console.warn("MutationObserver not supported");
        return;
    }

    var cb = function (records) {
        // addCustomFilterRow();
        clearTimeout(itemListTo);
        itemListTo = setTimeout(function () {
            itemListChanged();
        }, 200);
    };

    var observer = new MutationObserver(cb);
    var config = {
        'childList': true,
        'subtree': true,
        'attributes': true,
        'attributeFilter': ['mainsrp-itemlist']
    };
    observer.observe(document, config);
}

(function () {
    "use strict";

    // addStyles();

    if (is_enable_custom_filter_bar) {
        try {
            // addObserver();
        } catch (e) {}
    }

})();