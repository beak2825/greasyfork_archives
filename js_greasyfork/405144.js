// ==UserScript==
// @name         HttpRequest Library
// @namespace    hoehleg.userscripts.private
// @version      0.7.1
// @description  HttpRequest for any type of request and HttpRequestHTML to request webpage. Supports caching of responses for a given period and paging.
// @author       Gerrit Höhle
//
// @grant        GM_xmlhttpRequest
//
// ==/UserScript==

// https://greasyfork.org/de/scripts/405144

/* jslint esversion: 9 */
class HttpRequest {
    constructor({
        method,
        url,
        params = {},
        headers = {},
        data = '',
        contentType = 'application/x-www-form-urlencoded; charset=UTF-8',
        responseType = 'text',
    } = {}) {
        /** @type {string} */
        this.method = method.toUpperCase();

        /** @type {string} */
        this.url = url;

        /** @type {Object<string, string|number>|string} */
        this.params = params;

        /** @type {object} */
        this.headers = headers;

        /** @type {string} */
        this.data = data;

        /** @type {string} */
        this.contentType = contentType;

        /** @type {string} */
        this.responseType = responseType;
    }

    async send() {
        if (!this.method || !this.url) {
            return await Promise.reject("invalid request");
        }

        const { method, responseType } = this;
        const params = typeof this.params === "string" ? this.params : Object.entries(this.params).map(([key, value]) => key + '=' + value).join('&');

        let url = this.url;
        if (params.length) {
            url += '?' + params;
        }
        url = encodeURI(url);

        const headers = Object.assign({ 'Content-Type': this.contentType }, this.headers);
        const data = typeof this.data === 'string' ? this.data : JSON.stringify(this.data);

        return await new Promise((resolve, reject) => {
            const onload = (response) => {
                resolve(response);
            };
            const onerror = (errorEvent) => {
                console.log(errorEvent);
                reject("network error");
            };

            GM_xmlhttpRequest({ method, url, onload, onerror, headers, data, responseType });
        });
    }

    static async send(...args) {
        return await new HttpRequest(...args).send();
    }
}

class HttpRequestHtml extends HttpRequest {

    /**
     * @param {HttpRequestHtmlParams} param0 
     */
    constructor({
        url,
        params = {},
        pageNr = 0,
        pagesMaxCount = 1,
        resultTransformer = (resp, _httpRequestHtml) => resp,
        hasNextPage = (_resp, _httpRequestHtml, _lastResult) => false,
        urlConfiguratorForPageNr = (url, _pageNr) => url,
        paramsConfiguratorForPageNr = (params, _pageNr) => params,
    } = {}) {
        super({ method: 'GET', url, params });

        Object.assign(this, {
            pageNr,
            pagesMaxCount: Math.max(0, pagesMaxCount),
            resultTransformer,
            hasNextPage,
            urlConfiguratorForPageNr,
            paramsConfiguratorForPageNr,
        });
    }

    /**
     * @returns {Promise<HttpRequestHtmlResponse|object|Array<object>}
     */
    async send() {
        const results = [];

        let response = null, requestForPage = null;

        for (let pageNr = this.pageNr; pageNr < this.pageNr + this.pagesMaxCount; pageNr++) {

            requestForPage = new HttpRequestHtml({
                ...this, ...{
                    url: this.urlConfiguratorForPageNr(this.url, pageNr),
                    params: this.paramsConfiguratorForPageNr(typeof this.params === 'string' ? this.params : { ...this.params }, pageNr)
                }
            });

            response = await HttpRequest.prototype.send.call(requestForPage);
            if (response.status == 200 || response.status == 304) {
                response.html = new DOMParser().parseFromString(response.responseText, 'text/html');
            }

            const resultForPage = this.resultTransformer(response, requestForPage);
            results.push(resultForPage);

            if (!this.hasNextPage(response, requestForPage, resultForPage)) {
                break;
            }
        }

        return this.pagesMaxCount > 1 ? results : results[0];
    }

    /**
     * @param {HttpRequestHtmlParams} param0 
     * @returns {Promise<HttpRequestHtmlResponse|object|Array<object>}
     */
    static async send(...args) {
        return await new HttpRequestHtml(...args).send();
    }
}

class HttpRequestJSON extends HttpRequest {
    /** @param {HttpRequestJSONParams} param0 */
    constructor({
        method = 'GET',
        url,
        headers,
        data,
        params = {},
        fallbackResult = null,
        contentType = 'application/json',
    }) {
        super({ method, url, headers, data, params, contentType, responseType: "json" });
        this.fallbackResult = fallbackResult;
    }

    /** @returns {Promise<any>} */
    async send() {
        const response = await super.send();
        if (!response || !response.responseText) {
            return this.fallbackResult;
        }

        try {
            return JSON.parse(response.responseText);
        } catch (error) {
            console.log(error);
            return this.fallbackResult;
        }
    }

    /**
     * 
     * @param {HttpRequestJSONParams} param0
     * @returns {Promise<any>}
     */
    static async send(param0) {
        return await new HttpRequestJSON(param0).send();
    }
}

class HttpRequestBlob extends HttpRequest {
    constructor({
        method = 'GET',
        url,
        headers,
        data,
        params = {},
        contentType,
    }) {
        super({ method, url, headers, data, params, contentType, responseType: 'blob' });
    }

    async send() {
        const response = await super.send();

        /** @type {Blob} */
        const blob = response.response;
        const data = await new Promise((resolve, reject) => {
            const reader = Object.assign(new FileReader(), {

                onload: (load) => {
                    resolve(load.target.result);
                },

                onerror: (error) => {
                    console.log(error);
                    reject(reader.result);
                }

            });
            reader.readAsDataURL(blob);
        });
        return data;
    }

    static async send(param0) {
        return await new HttpRequestBlob(param0).send();
    }
}