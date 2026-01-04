// ==UserScript==
// @name           Video Downloader
// @name:en        Video Downloader
// @description    Скачать видео со всех сайтов
// @description:en Download video from all sites
// @namespace      https://greasyfork.org/users/136230
// @include        *://*
// @version        0.1.0-alpha.15.0
// @compatible     firefox
// @compatible     chrome
// @compatible     safari
// @compatible     opera
// @compatible     edge
// @grant          unsafeWindow
// @grant          GM.info
// @require        https://greasyfork.org/scripts/382407/code/script.user.js
// @require        https://greasyfork.org/scripts/382493-xml2json/code/script.user.js
// @require        https://cdn.jsdelivr.net/npm/url-toolkit@2
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/382500/Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/382500/Video%20Downloader.meta.js
// ==/UserScript==

(async function(window, undefined) {
    'use strict'
    const root = {};
    const logger = {};
    const DASH = {};
    const URL = window.URL || window.webkitURL;
    const gLink = document.createElement('a');
    const { script: { name: scriptName, version: scriptVersion } } = GM.info;
    root.XMLHttpRequest = window.XMLHttpRequest;
    const { setRequestHeader: xhrSetRequestHeader, open: xhrOpen } = root.XMLHttpRequest.prototype;

    logger.log = console.log;
    logger.log('[info] %s v%s', scriptName, scriptVersion);
    logger.log('[log] json2xml: ', typeof json2xml !== undefined ? json2xml : undefined);
    logger.log('[log] xml2json: ', typeof xml2json !== undefined ? xml2json : undefined);

    window.addEventListener('message', function({ data }) {
        if (window.self !== window.top || typeof data !== 'object') {
            return;
        }
        const { type, mime, payload } = data;
        switch (type) {
            case 'hls':
                HLS.download(payload);
                return;
            case 'dash':
                DASH.download(payload);
                return;
            default:
                break;
        }
    });

    window.XMLHttpRequest = function XMLHttpRequest() {
        const xhr = new root.XMLHttpRequest();
        xhr.requestHeaders = {};
        return xhr;
    };
    for (const key of Object.keys(root.XMLHttpRequest)) {
        if (key === 'prototype') continue;
        window.XMLHttpRequest[key] = root.XMLHttpRequest[key];
    }
    root.XMLHttpRequest.prototype.setRequestHeader = function setRequestHeader(key, val) {
        this.requestHeaders[key.toLowerCase()] = val;
        return xhrSetRequestHeader.apply(this, arguments);
    };
    root.XMLHttpRequest.prototype.open = function open(method, url) {
        handleXHROpen.call(this, method, url);
        return xhrOpen.apply(this, arguments);
    };
    async function handleXHROpen(method, url) {
        const extension = typeof url !== 'undefined' ? parseExtension(url) : undefined;
        switch (extension) {
            case 'm3u':
            case 'm3u8':
                logger.log('[xmlHttpRequest] onload parseHLS');
                this.addEventListener('load', parseHLS);
                break;
            case 'mpd':
                logger.log('[xmlHttpRequest] =========================================================================================> onload parseDASH');
                this.addEventListener('load', parseDASH);
                break;
            default:
                // this.addEventListener('load', parseXHR);
                break;
        }
    }
    async function parseHLS({ target: xhr }) {
        logger.log('[hls] parseHLS({ target: xhr })');
        const playlist = await HLS.load(xhr.response, xhr.responseURL);
        if (window.self === window.top) {
            return HLS.download(playlist);
        }
        window.top.postMessage({
            type: 'hls',
            payload: playlist,
        }, '*');
    }
    async function parseDASH({ target: xhr }) {
        const { responseURL: url, response } = xhr;
        const headers = parseHeaders(xhr);
        const playlist = JSON.parse(xml2json(parseXML(response), '  '));
        const { AdaptationSet } = playlist.MPD.Period;
        if (Array.isArray(AdaptationSet)) {
            for (const { SegmentTemplate = {} } of AdaptationSet) {
                SegmentTemplate['@media'] = URLToolkit.buildAbsoluteURL(url, SegmentTemplate['@media']);
                SegmentTemplate['@initialization'] = URLToolkit.buildAbsoluteURL(url, SegmentTemplate['@initialization']);
            }
        }
        const xml = '<?xml version="1.0"?>' + json2xml(playlist, '');
        logger.log('[dash] ---------');
        logger.log('[dash] url: ', url);
        logger.log('[dash] headers: ', JSON.stringify(headers, null, 2));
        logger.log('[dash] playlist: ', playlist);
        logger.log('[dash] xml: ', xml);
        logger.log('[dash] response: ', response);
        if (window.self === window.top) {
            return DASH.download(xml);
        }
        window.top.postMessage({
            type: 'dash',
            payload: xml,
        }, '*');
    }
    function parseXML(xml) {
        let dom = null;
        if (window.DOMParser) {
            try {
                dom = (new DOMParser()).parseFromString(xml, "text/xml");
            } catch (e) {
                dom = null;
            }
        } else if (window.ActiveXObject) {
            try {
                dom = new ActiveXObject('Microsoft.XMLDOM');
                dom['async'] = false;
                if (!dom.loadXML(xml)) {
                    // parse error ..
                    logger.log('[xml] parsing error: ', dom.parseError.reason + dom.parseError.srcText);
                }
            } catch (e) {
                dom = null;
            }
        } else {
            logger.log('[xml] oops');
        }
        return dom;
    }
    DASH.download = function(source) {
        const filename = document.querySelector('head title').innerText + '.mpd';
        return downloadFile(filename, source);
    };
    async function parseXHR(event) {
        const { target: xhr } = event;
        const { responseURL: url } = xhr;
        const headers = parseHeaders(xhr);
        const [contentType] = (headers['content-type'] || '').split(';').map(_trim);
        switch (contentType) {
            case 'application/vnd.apple.mpegurl':
            case 'application/x-mpegurl':
            case 'audio/x-mpegurl':
                return parseHLS(event);
            case 'application/dash+xml':
                return parseDASH(event);
            default:
                break;
        }
    }
    // logger.log('[log] HLS.load');
    HLS.load = async function(source, baseurl) {
        const playlist = HLS.parse(source);
        if (!playlist.isMasterPlaylist) {
            const { segments = [] } = playlist;
            for (const segment of segments) {
                segment.uri = URLToolkit.buildAbsoluteURL(baseurl, segment.uri);
            }
            return playlist;
        }
        const { variants = [] } = playlist;
        const promises = [];
        for (const variant of variants) {
            variant.uri = URLToolkit.buildAbsoluteURL(baseurl, variant.uri);
            logger.log('[log] playlist.uri: ', variant.uri);
            const promise = makeRequest({ url: variant.uri })
            .then(async function({ response, url }) {
                const media = await HLS.load(response, url);
                variant.media = media;
                return media;
            })
            .catch(function(error) {
                logger.log('[error] ', error);
            });
            promises.push(promise);
        }
        await Promise.all(promises);
        return playlist;
    };
    HLS.download = async function(playlist = {}) {
        const { variants = [] } = playlist;
        return variants.reduce(function(promise, { resolution, bandwidth, media = {} }) {
            const { width, height } = resolution;
            const kbps = Math.round(bandwidth / 1024);
            const text = HLS.stringify(media);
            const filename = document.querySelector('head title').innerText + ' - ' + width + 'x' + height + ' - ' + kbps + 'kbps' + '.m3u8';
            return promise.then(function(){
                return downloadFile(filename, text);
            });
        }, Promise.resolve());
    };
    async function downloadFile(filename, source, type = 'text/plain') {
        const blob = new Blob([source], { type });
        const resource = URL.createObjectURL(blob);
        const { body } = document;
        const link = document.createElement('a');
        link.innerHTML = filename || 'download';
        link.href = resource;
        link.setAttribute('download', filename);
        link.setAttribute('style', 'display: none');
        await DOMReady();
        body.appendChild(link);
        link.click();
        await delay(100);
        body.removeChild(link);
        URL.revokeObjectURL(resource);
    }
    // logger.log('[log] getHlsComponents');
    function getHlsComponents(hls) {
        const {
            coreComponents: [,,,, {
                segments = [],
            } = {}, {
                levels: [{
                    details: {
                        fragments = [],
                        totalduration = 0,
                    } = {},
                } = {}] = [],
            } = {}] = []
        } = hls || {};
        return { segments, fragments, totalduration };
    }
    // logger.log('[log] parseUrl');
    function parseUrl(url, withExtension) {
        gLink.href = url;
        const {
            href, origin, host, protocol, hostname, port, path, pathname, search, hash,
        } = gLink;
        const extension = withExtension ? parseExtension(pathname) : undefined;
        return {
            href, origin, host, protocol, hostname, port, path, pathname, search, hash, extension,
        };
    }
    function parseExtension(uri) {
        gLink.href = uri;
        const match = gLink.pathname.match(/\.([^.]+)$/);
        return match ? match[1] : null;
    }
    // logger.log('[log] parseHeaders');
    function parseHeaders(xhr) {
        return xhr
        .getAllResponseHeaders()
        .trim()
        .split('\n')
        .reduce(function(headers, header){
            const [key, val] = header.split(/\:/).map(_trim);
            if (!key || !val) {
                return headers;
            }
            headers[key.toLowerCase()] = val;
            return headers;
        }, {});
    }
    // logger.log('[log] makeRequest');
    async function makeRequest(_details) {
        const details = extend({
            method: 'GET',
            url: '/',
            data: null,
            headers: {},
        }, _details);
        let request;
        if (window.XMLHttpRequest) {
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            request = new ActiveXObject('Msxml2.XMLHTTP.6.0');
        } else {
            throw new Error('AJAX API not found');
        }
        const { method, url, headers, data: dataObj, responseType } = details;
        request.open(method, url, true);
        for (const key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        if (responseType) {
            request.responseType = responseType;
        }
        const handler = {};
        const promise = new Promise(function(resolve, reject) {
            handler.resolve = resolve;
            handler.reject = reject;
        });
        request.onload = function(event){
            const { target } = event;
            const { response, status, statusText, responseURL: url } = target;
            const headers = parseHeaders(target);
            if (status === 200) {
                return handler.resolve({ response, headers, url, method, responseType });
            } else {
                const error = new Error('request error status: ' + status);
                error.code = status;
                return handler.reject(error);
            }
        };
        request.onerror = function(event){
            const error = new Error('network error');
            handler.reject(error);
        };
        if (details.timeout) {
            request.timeout = details.timeout;
            request.ontimeout = function(event) {
                const error = new Error('timeout');
                handler.reject(error);
            };
        }
        const data = !dataObj ? null : Object.keys(dataObj)
        .map(function(key){
            return key + '=' + dataObj[key];
        }).join('&');
        request.send(data);
        return promise;
    }
    // logger.log('[log] DOMReady');
    function DOMReady(callback) {
        const handler = {};
        const promise = new Promise(function(resolve, reject) {
            handler.resolve = resolve;
            handler.reject = reject;
        });
        const cb = function() {
            if (typeof callback === 'function') {
                callback();
            }
            handler.resolve();
        };
        switch (document.readyState) {
            case 'loading':
                document.addEventListener('DOMContentLoaded', cb);
                break;
            case 'interactive':
            case 'complete':
                setTimeout(cb, 10);
                break;
            default:
                console.log('unknown state ', document.readyState);
                handler.reject(new Error('unknown state ' + document.readyState));
        }
        return promise;
    }
    function delay(timeout = 10) {
        return new Promise(function(resolve) {
            setTimeout(resolve, timeout);
        });
    }
    // logger.log('[log] extend');
    function extend(target) {
        target = target || {};
        const args = Array.prototype.slice.call(arguments, 1);
        for (const arg of args) {
            if (!arg) {
                continue;
            }
            const keys = Object.keys(arg);
            for (const key of keys) {
                if (arg[key] !== undefined) {
                    target[key] = arg[key];
                }
            }
        }
        return target;
    }
    // logger.log('[log] _trim');
    function _trim(str) {
        return str ? str.trim() : '';
    }
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);