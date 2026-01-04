// ==UserScript==
// @name        Automatic TaoBao URL Converter (Optimized)
// @namespace   Violentmonkey Scripts
// @include     *://m.intl.taobao.com/*
// @grant       none
// @version     6.9.1
// @author      nerf
// @license     MIT
// @description TaoBao URL Converter optimized for faster redirection.
// @downloadURL https://update.greasyfork.org/scripts/525846/Automatic%20TaoBao%20URL%20Converter%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525846/Automatic%20TaoBao%20URL%20Converter%20%28Optimized%29.meta.js
// ==/UserScript==

const ITEM_ID    = 'id=';
const ITEM       = 'item/';
const SHOP_ID    = 'shop_id=';
const TAOBAO_URL = 'https://item.taobao.com/item.htm?id=';
const TMALL_URL  = 'https://detail.tmall.com/item.htm?id=';
const SHOP_URL   = 'https://shop{}.taobao.com';
const M_INTL     = 'm.intl.taobao.com';
const H5         = 'h5.m.taobao.com';
const WORLD      = 'world.taobao.com';
const SHOP_M     = 'shop.m.taobao.com';
const SEARCH_QUERY = '/search.htm?search=y';

function convertURL(url) {
    if (url.includes('tmall.com')) {
        return TMALL_URL + getID(url, ITEM_ID);
    }
    if (url.includes(M_INTL) || url.includes(H5)) {
        return buildTaobaoURL(url, ITEM_ID, false);
    }
    if (url.includes(WORLD)) {
        return url.includes('item')
            ? buildTaobaoURL(url, ITEM, false)
            : cleanTaobaoStore(url.replace('world.taobao.com', 'taobao.com'));
    }
    if (url.includes(SHOP_M)) {
        return buildTaobaoURL(url, SHOP_ID, true);
    }
    return !url.includes('item')
        ? cleanTaobaoStore(url)
        : buildTaobaoURL(url, ITEM_ID, false);
}

function getID(url, match) {
    // Extracts consecutive digits following the given match string.
    const regex = new RegExp(match + "(\\d+)");
    const result = regex.exec(url);
    return result ? result[1] : '';
}

function buildTaobaoURL(url, match, isShop) {
    const id = getID(url, match);
    return isShop
        ? SHOP_URL.replace('{}', id)
        : TAOBAO_URL + id;
}

function cleanTaobaoStore(url) {
    const baseIndex = url.indexOf('taobao.com/');
    if (baseIndex === -1) return url;
    const end = baseIndex + 'taobao.com/'.length;
    return url.includes('search.htm')
        ? url.substring(0, end) + SEARCH_QUERY
        : url.substring(0, end);
}

// Execute the redirection as early as possible.
(function() {
    const currentURL = window.location.href;
    const desktopURL = convertURL(currentURL);
    if (desktopURL && desktopURL !== currentURL) {
        window.location.replace(desktopURL);
    }
})();
