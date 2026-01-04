// ==UserScript==
// @name           Pladform Hls Fetch
// @name:en        Pladform Hls Fetch
// @description    Получить ссылку на hls поток в Pladform
// @description:en Fetch url of hls stream on Pladform
// @namespace      https://greasyfork.org/users/136230
// @include        *://*.pladform.ru/*
// @include        *://*.rutube.ru/*
// @version        0.1.0
// @author         EisenStein
// @compatible     firefox
// @compatible     chrome
// @compatible     safari
// @compatible     opera
// @compatible     edge
// @connect        pladform.ru
// @connect        rutube.ru
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/391452/Pladform%20Hls%20Fetch.user.js
// @updateURL https://update.greasyfork.org/scripts/391452/Pladform%20Hls%20Fetch.meta.js
// ==/UserScript==
// @grant          unsafeWindow
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @grant          GM_info
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js


(function(window, WINDOW, undefined){
    const gmrequest = false;
    function fetchPlaylistHLS(inputURL) {
        const id = Math.floor(Math.random() * 1e4 + 1e4);
        return request({
            url: getVideoURL(inputURL),
        }).then(function(response){
            const xmlDocument = new DOMParser().parseFromString(response, 'text/xml');
            return {
                time: xmlNumber(xmlDocument, 'time'),
                title: xmlText(xmlDocument, 'title'),
                fulltitle: xmlText(xmlDocument, 'fulltitle'),
                srcHls: xmlText(xmlDocument, 'src[type="hls"]'),
                src: xmlText(xmlDocument, 'src'),
            };
        }).catch(function(error){
            console.error(id, '[fetching xml] error: ', error);
        }).then(function(videoDATA){
            if (!videoDATA) {
                console.warn(id, 'fetching failed');
                return;
            } else if (!videoDATA.srcHls) {
                console.warn(id, 'hls not found, src = ', videoDATA.src);
                return;
            }
            const link = document.createElement('a');
            link.href = inputURL;
            return request({
                url: videoDATA.srcHls,
            });
        }).catch(function(error){
            console.error(id, '[fetching hls] error: ', error);
        });
    }
    function request() {
        return (gmrequest ? GM_request : _request).apply(this, arguments);
    }
    function _request() {
        const id = Math.floor(Math.random() * 1e8 + 1e8);
        const { method, url, data, headers } = extend({}, arguments[0], { method: 'GET', headers: {} });
        const p = {};
        const promise = new Promise(function(resolve, reject){
            p.resolve = resolve;
            p.reject = reject;
        });
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        for (const key of Object.keys(headers)) {
            xhr.setRequestHeader(key, headers[key]);
        }
        xhr.addEventListener('readystatechange', function(e) {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status !== 200) {
                p.reject(new Error('I/O error'));
                return;
            }
            p.resolve(xhr.responseText);
        });
        xhr.addEventListener('error', function(){
            p.reject(new Error('Network error'));
        });
        xhr.send(data);
        return promise;
    }
    function GM_request() {
        const id = Math.floor(Math.random() * 1e8 + 1e8);
        const { method, url, headers, data } = extend({}, arguments[0], { method: 'GET', headers: {} });
        const p = {};
        const promise = new Promise(function(resolve, reject){
            p.resolve = resolve;
            p.reject = reject;
        });
        GM.xmlHttpRequest({
            method,
            url,
            data,
            headers,
            onreadystatechange: function(r){
                if (r.readyState !== 4) {
                    return;
                }
                if (r.status !== 200) {
                    p.reject(new Error('I/O error'));
                    return;
                }
                p.resolve(r.responseText);
            },
            onerror: function(r) {
                p.reject(new Error('Network error'));
            },
        });
        return promise;
    }
    function getVideoURL(inputURL) {
        const link = document.createElement('a');
        link.href = inputURL;
        const data = extend({ dl: inputURL }, parse(link.search.slice(1)), getVideoURL.defaultData);
        return `${getVideoURL.defaultHost}/getVideo?${stringify(data)}`;
    }
    getVideoURL.defaultHost = 'https://out.pladform.ru';
    getVideoURL.defaultData = {
        endscreen: '1',
        pt: 'original',
        domain: 'vk.com',
        datauri: '//out.pladform.ru',
        pl: 'xxxxx',
        autoplay: '0',
        p2p: '0',
        dl: 'https://out.pladform.ru/player?pl=xxxxx&videoid=xxxxxx',
        target: 'web-html5',
        videoid: 'xxxxxxx',
    };
    function extend(target) {
        target = target || {};
        for (let i = 1; i < arguments.length; ++i) {
            for (const key of Object.keys(arguments[i])) {
                if (typeof target[key] === 'undefined' && typeof arguments[i][key] !== 'undefined') {
                    target[key] = arguments[i][key];
                }
            }
        }
        return target;
    }
    /**
     * @param {Object.<string,string|number>}
     * @return {string}
     */
    function stringify(object) {
        return Object.keys(object).map(function(key){
            return `${key}=${encodeURIComponent(object[key])}`;
        }).join('&');
    }
    /**
     * @param {string}
     * @return {Object.<string,string>}
     */
    function parse(string) {
        return string.trim().split('&').reduce(function(acc, cur){
            const [key, val] = cur.split('=');
            if (key && val) {
                acc[key] = decodeURIComponent(val);
            }
            return acc;
        }, {});
    }
    function xmlNumber(doc, selector) {
        const num = xmlText(doc, selector);
        return num ? +num : 0;
    }
    function xmlText(doc, selector) {
        const elm = doc.querySelector(selector);
        return elm ? elm.textContent.trim() : '';
    }
    function isEqual(target, object) {
        const tKeys = Object.keys(target);
        const oKeys = Object.keys(object);
        if (tKeys.length !== oKeys.length) {
            return false;
        }
        for (const key of tKeys) {
            if (target[key] !== object[key]) {
                return false;
            }
        }
        return true;
    }
    WINDOW.fetchPladformPlaylistHLS = fetchPlaylistHLS;
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);
