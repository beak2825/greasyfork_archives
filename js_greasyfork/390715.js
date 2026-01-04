// ==UserScript==
// @name                 Google谷歌搜索页面dq.tieba.com贴吧链接替换 dq.tieba.com to tieba.baidu.com for Google results
// @name:zh-CN           Google谷歌搜索页面dq.tieba.com贴吧链接替换
// @name:zh-TW           Google谷歌搜索頁面dq.tieba.com貼吧鏈接替換
// @version              0.22
// @include              *://www.google.*
// @description          最近访问dq.tieba.com老是出现 “您好，该页面正在维护中。” 于是就写了这个。为什么要在Google搜索页面替换呢？这是因为当你按dq.tieba.com时服务器就给你的浏览器发个HTTP 302重定向到维护页面，脚本都来不及执行
// @description:zh-CN    最近访问dq.tieba.com老是出现 “您好，该页面正在维护中。” 于是就写了这个。为什么要在Google搜索页面替换呢？这是因为当你按dq.tieba.com时服务器就给你的浏览器发个HTTP 302重定向到维护页面，脚本都来不及执行
// @description:zh-TW    最近訪問dq.tieba.com老是出現 “您好，该页面正在维护中。” 於是就寫了這個。為什麼要在Google搜索頁面替換呢？這是因為當你按dq.tieba.com時服務器就給你的瀏覽器發個HTTP 302轉址到維護頁面，脚本都來不及執行
// @author               Jiaxing Peng
// @namespace            bjxpen
// @grant                none
// @downloadURL https://update.greasyfork.org/scripts/390715/Google%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2dqtiebacom%E8%B4%B4%E5%90%A7%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%20dqtiebacom%20to%20tiebabaiducom%20for%20Google%20results.user.js
// @updateURL https://update.greasyfork.org/scripts/390715/Google%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2dqtiebacom%E8%B4%B4%E5%90%A7%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%20dqtiebacom%20to%20tiebabaiducom%20for%20Google%20results.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const URL_PATTERNS = [
        'jump*.bdimg.com',      // matches jump.bdimg.com, jump2.bdimg.com, ...
        'wapp.baidu.*/mo/q',    // matches wapp.baidu.com/mo/q, wapp.baidu.cn/mo/q, ...
        'wefan.baidu.*',
        'c.tieba.baidu.*',
        'tieba.baidu.*',
        'dq.tieba.*',
        'post.baidu.*',
        'xingqu.baidu.*',
        'www.tieba.*'
    ];

    const REPLACE_BY = 'tieba.baidu.com';

    const URL_REGEXPS = URL_PATTERNS.map(p => {
        return new RegExp(p.replace(/[\/.]/g, '\\$&').replace(/\*/g, '[^.\\/]*'));
    });

    const REDIRECT_URL_REGEXP = /^[^:]*:\/\/www\.google\.[^\/]*\/url\?.*$/,
        REDIRECT_QUERY_PARAM_Q = 'q',
        REDIRECT_QUERY_PARAM_URL = 'url';

    const WEBLIGHT_REGEXP = /^[^:]*:\/\/www\.google\.[^\/]*\/url\?.*(?=q=)q=http:\/\/googleweblight\.[^\/]*\/%3Flite_url%3D.*/;

    const HTTP_PROC_REGEXP = /^http:\/\//,
        HTTPS_PROC = 'https://';

    const NULL_RESULT = { matchedUrlPattern: null };

    const getUrlQueryParam = function (cache, url, name) {
        // cache URL instances; URL is not available in IE
        return (cache[url] = cache[url] || new URL(url)).searchParams.get(name) || null
    }.bind(null, {});

    function setup () {
        const testFn = RegExp.prototype.test;

        RegExp.prototype.test = function (str) { 
            this.cache = this.cache || {};
            return this.cache[str] = this.cache[str] || testFn.call(this, str);
        }

        return function teardown () { RegExp.prototype.test = testFn; };
    }

    function longestMatchPattern (strLikedArr) {
        return strLikedArr.length === 0 ? null : strLikedArr.reduce((a, b) => {
            return b.toString().length > a.toString().length ? b : a;
        });
    }

    function baseCase (a) {
        return {
            a: a,
            matchedUrlPattern: longestMatchPattern(URL_REGEXPS.filter(r => {
                var queryIndex = a.href.indexOf('?');
                var urlNoQuery = queryIndex === -1 ? a.href : a.href.slice(0, queryIndex);
                return r.test(urlNoQuery);
            })),
            url: a.href,
        };
    }

    function redirectionCase (redirectUrlQueryParamName, a) {
        try {
            const redirectUrl = getUrlQueryParam(a.href, redirectUrlQueryParamName) || '';
            const isRedirectUrl = REDIRECT_URL_REGEXP.test(a.href) && redirectUrl !== '' && !WEBLIGHT_REGEXP.test(a.href);

            return {
                a: a,
                url: redirectUrl,
                matchedUrlPattern: isRedirectUrl ? longestMatchPattern(URL_REGEXPS.filter(r => r.test(redirectUrl))) : null,
            };
        } catch (err) {
            return NULL_RESULT;
        }
    }

    function weblightCase(a) {
        try {
            const isWebLightUrl = WEBLIGHT_REGEXP.test(a.href);
            const level1Url = isWebLightUrl ? getUrlQueryParam(a.href, 'q') : '';
            const level2Url = isWebLightUrl ? decodeURIComponent(getUrlQueryParam(level1Url, 'lite_url')) : '';

            return {
                a: a,
                url: level2Url,
                matchedUrlPattern: isWebLightUrl ? longestMatchPattern(URL_REGEXPS.filter(r => r.test(level2Url))) : null,
            };
        } catch (err) {
            return NULL_RESULT;
        }
    }

    const teardown = setup();
    [
        baseCase,
        redirectionCase.bind(null, REDIRECT_QUERY_PARAM_Q),
        redirectionCase.bind(null, REDIRECT_QUERY_PARAM_URL),
        weblightCase
    ].forEach(fn => {
        [].slice.call(document.getElementsByTagName('a')).map(fn).forEach(res => {
            if (res.matchedUrlPattern) {
                res.a.href = res.url.replace(res.matchedUrlPattern, REPLACE_BY).replace(HTTP_PROC_REGEXP, HTTPS_PROC);
            }
        })
    })
    teardown();
})();
