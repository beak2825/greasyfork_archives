// ==UserScript==
// @name        Automatic TaoBao URL Converter
// @namespace   Violentmonkey Scripts
// @include      *://m.intl.taobao.com/*
// @grant       none
// @version     6.9
// @author      All credits to Will, github.com/taobaotools
// @description TaoBao URL Converter, I just added 4 lines of code to automate it. Will has done the rest of the work.
// @downloadURL https://update.greasyfork.org/scripts/416417/Automatic%20TaoBao%20URL%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/416417/Automatic%20TaoBao%20URL%20Converter.meta.js
// ==/UserScript==

const ITEM_ID = 'id=';
const ITEM = 'item/';
const SHOP_ID = 'shop_id=';
const TAOBAO_URL = 'https://item.taobao.com/item.htm?id=';
const TMALL_URL = 'https://detail.tmall.com/item.htm?id=';
const SHOP_URL = 'https://shop{}.taobao.com';
const M_INTL = 'm.intl.taobao.com';
const H5 = 'h5.m.taobao.com';
const WORLD = 'world.taobao.com';
const SHOP_M = 'shop.m.taobao.com';
const SEARCH_QUERY = '/search.htm?search=y';

function convertURL(str) {
    if (contains(str, 'tmall.com'))
        return TMALL_URL + getID(str, ITEM_ID);
    if (contains(str, M_INTL) || contains(str, H5)) {
        return buildTaobaoURL(str, ITEM_ID, false)
    } else if (contains(str, WORLD)) {
        if (contains(str, 'item')) {
            return buildTaobaoURL(str, ITEM, false);
        } else {
            var intermediate = str.replace('world.taobao.com', 'taobao.com');
            return cleanTaobaoStore(intermediate);
        }
    } else if (contains(str, SHOP_M)) {
        return buildTaobaoURL(str, SHOP_ID, true);
    } else if (!contains(str, 'item')) {
        return cleanTaobaoStore(str);
    } else {
        return buildTaobaoURL(str, 'id=', false);
    }
}
function getID(str, match) {
    var start = str.indexOf(match) + match.length;
    var end = str.length;
    for (var i = start; i < str.length; i++) {
        if (!isDigit(str.charAt(i))) {
            end = i;
            break;
        }
    }
    return str.substring(start, end);
}
function buildTaobaoURL(str, match, isShop) {
    if (isShop) {
        var shopID = getID(str, match);
        return SHOP_URL.replace('{}', shopID);
    } else {
        var itemID = getID(str, match);
        return TAOBAO_URL + itemID;
    }
}
function cleanTaobaoStore(str) {
    var end = str.indexOf('taobao.com/');
    if (end == -1) {
        return str;
    } else {
        end += 10;
        if (contains(str, 'search.htm'))
            return str.substring(0, end) + SEARCH_QUERY;
        else
            return str.substring(0, end);
    }
}
function isTaobaoURL(str) {
    var urlPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return urlPattern.test(str) && (str.indexOf('taobao.com') != -1 || str.indexOf('tmall.com') != -1);
}
function contains(str, query) {
    return str.indexOf(query) != -1;
}
function isDigit(char) {
    char = char.charCodeAt(0);
    return char >= 48 && char <= 57;
}

function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

window.onload = function() {
  var desktop = convertURL(document.URL);
  window.location = desktop;
}