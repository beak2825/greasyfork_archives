// ==UserScript==
// @name        搜索切换
// @namespace   https://github.com/chenshengzhi
// @description 搜索切换, g键: google, y键: 有道单词, s键: 搜狗搜索, e键: 搜狗英文, b键: 百度, h键: github, a键: 当前搜索增加 site:developer.apple.com
// @version     0.0.4
// @grant       GM_openInTab
// @license     GPL version 3
// @homepageURL https://greasyfork.org/scripts/13501/
// @include     *www.baidu.com*
// @include     *dict.youdao.com*
// @include     *www.google.com*
// @include     *.sogou.com*
// @include     *.github.com*
// @downloadURL https://update.greasyfork.org/scripts/13501/%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/13501/%E6%90%9C%E7%B4%A2%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

function isBaiduSearch() {
    return location.href.indexOf('www.baidu.com/s?') != -1;
}

function isYoudaoDictSearch() {
    return location.href.indexOf('dict.youdao.com/search?') != -1;
}

function isGoogleSearch() {
    return location.host.indexOf('google.com') != -1 && location.href.indexOf('/search?') != -1;
}

function isSogouSearch() {
    return location.href.indexOf('www.sogou.com/web?query=') != -1;
}

function isSogouEnglishSearch() {
    return location.href.indexOf('english.sogou.com/english?query=') != -1;
}

function getCurrentSearchTypeKey() {
    if (isBaiduSearch()) {
        return 'b';
    } else if (isGoogleSearch()) {
        return 'g';
    } else if (isYoudaoDictSearch()) {
        return 'y';
    } else if (isSogouSearch()) {
        return 's';
    } else if (isSogouEnglishSearch()) {
        return 'e'
    } else {
        return '';
    }
}

var searchUrlPrefixs = {
    'b': 'https://www.baidu.com/s?ie=utf-8&wd=',
    'g': 'https://www.google.com.hk/search?q=',
    'y': 'https://dict.youdao.com/search?q=',
    's': 'https://www.sogou.com/web?query=',
    'e': 'https://english.sogou.com/english?query=',
    'h': 'https://github.com/search?q='
};
var searchKeywordParams = {
    'b': 'wd',
    'g': 'q',
    'y': 'q',
    's': 'query',
    'e': 'query',
    'h': 'q',
}

document.body.onkeypress = function(e) {
    if (!document.activeElement) {
        return false;
    }

    //正在输入
    if (document.activeElement.tagName.toLowerCase() == 'input') {
        return true;
    }

    console.log(e.key);

    var keyChar = e.key.toLowerCase();
    var currentKey = getCurrentSearchTypeKey();
    var urlParams = new URLSearchParams(window.location.search);
    var searchValue = urlParams.get(searchKeywordParams[currentKey]);
    if (keyChar == 'a') {
        if (currentKey.length > 0 && currentKey != 'y') {
            console.log('+++', currentKey);
            var currentPrefix = searchUrlPrefixs[currentKey];
            window.location = currentPrefix + searchValue + ' site:developer.apple.com';
        }
        return false;
    } else {
        var newPrefix = searchUrlPrefixs[keyChar];
        console.log(newPrefix);
        if (newPrefix.length > 0) {
            GM_openInTab(encodeURI(newPrefix + searchValue), {'active': true});
        }
        return false;
    }
}
