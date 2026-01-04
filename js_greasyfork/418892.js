// ==UserScript==
// @name         Search App Store
// @namespace    https://greasyfork.org/users/136230
// @version      0.1.0
// @description  Search Apple app in your browser
// @author       eisen-stein
// @include      https://*.apple.com/*
// @connect      apple.com
// @connect      imgur.com
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/418892/Search%20App%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/418892/Search%20App%20Store.meta.js
// ==/UserScript==

/**
 * @typedef {{
 *  advisories: string[];
 *  appletvScreenshotUrls: string[];
 *  artistId: number;
 *  artistName: string;
 *  artistViewUrl: string;
 *  artworkUrl100: string;
 *  artworkUrl512: string;
 *  artworkUrl60: string;
 *  averageUserRating: number;
 *  averageUserRatingForCurrentVersion: number;
 *  bundleId: string;
 *  contentAdvisoryRating: string;
 *  currency: string;
 *  currentVersionReleaseDate: string;
 *  description: string;
 *  features: string[];
 *  fileSizeBytes: number;
 *  formatedPrice: string;
 *  genreIds: string[];
 *  genres: string[];
 *  ipadScreenshotUrls: string[];
 *  isGameCenterEnabled: boolean;
 *  isVppDeviceBasedLicensingEnabled: boolean;
 *  kind: 'software' | 'music' | '';
 *  languageCodesISO2A: string[];
 *  minimumOsVersion: string;
 *  price: number;
 *  primaryGenreId: string;
 *  primaryGenreName: string;
 *  releaseDate: string;
 *  releaseNotes: string;
 *  screenshotUrls: string[];
 *  sellerName: string;
 *  sellerUrl: string;
 *  supportedDevices: string[];
 *  trackCensoredName: string;
 *  trackContentRating: string;
 *  trackId: number;
 *  trackName: string;
 *  trackViewUrl: string;
 *  userRatingCount: number;
 *  userRatingCountForCurrentVersion: number;
 *  version: string;
 *  wrapperType: 'software' | 'music' | '';
 * }} Software
 */

(function () {
    'use strict';

    DOMReady().then(async () => {
        modalView.create()
        inputView.create()
        await logoView.loadIcon()
        logoView.create()
    })
    async function makeRequest(details) {
        const params = typeof details == 'string' ? { url: details } : Object.assign({}, details)
        let resolve, reject;
        const promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        })
        GM.xmlHttpRequest({
            ...params,
            method: params.method || 'GET',
            url: params.url,
            onload: function (r) {
                const response = {
                    data: r.response,
                    headers: parseHeaders(r.responseHeaders),
                    status: r.status,
                    ok: r.status == 200,
                    finalUrl: r.finalUrl,
                }
                resolve(response)
            },
            onprogress: function (r) {
                params.onprogress && params.onprogress(r.loaded, r.total);
            },
            onerror: function (r) {
                resolve({
                    data: null,
                    headers: parseHeaders(r.responseHeaders),
                    status: r.status,
                    ok: false,
                    problem: (r.status || 'error').toString(),
                })
            },
            ontimeout: function (r) {
                resolve({
                    data: null,
                    headers: parseHeaders(r.responseHeaders),
                    status: r.status,
                    ok: false,
                    problem: 'TIMEOUT',
                })
            },
            onreadystatechange: function (r) {
            },
        })
        return promise;
    }
    function parseHeaders(headersString) {
        if (typeof headersString !== 'string') {
            return headersString
        }
        return headersString.split(/\r?\n/g)
            .map(function (s) { return s.trim() })
            .filter(Boolean)
            .reduce(function (acc, cur) {
                var res = cur.split(':')
                var key, val
                if (res[0]) {
                    key = res[0].trim().toLowerCase()
                    val = res.slice(1).join('').trim()
                    acc[key] = val
                }
                return acc
            }, {})
    }
    /**
     * @param {{
     *  responseText: string;
     *  headers: { [x: string]: string };
     *  ignoreXML?: boolean;
     *  responseType?: string;
     * }} params
     */
    function parseResponse(params) {
        var responseText = params.responseText,
            headers = params.headers,
            responseType = params.responseType;
        var isText = !responseType || responseType.toLowerCase() === 'text'
        var contentType = headers['content-type'] || ''
        var ignoreXML = params.ignoreXML === undefined ? true : false;
        if (
            isText
            && contentType.indexOf('application/json') > -1
        ) {
            return JSON.parse(responseText)
        }
        if (
            !ignoreXML
            && isText
            && (
                contentType.indexOf('text/html') > -1
                || contentType.indexOf('text/xml') > -1
            )
        ) {
            return createDocument(responseText)
        }
        return responseText
    }
    function URLEncode(value) {
        return encodeURIComponent(value.replace(/\s+/g, '+'))
        // return value.replace(/\s+/g, '+')
    }
    function URLSearch(params) {
        return Object.keys(params).map(key => {
            return `${key}=${URLEncode(params[key])}`
        }).join('&')
    }
    /**
     * @param {string} packageName
     */
    async function searchAppStore(packageName) {
        const country = navigator.language.slice(0, 2)
        const params = {
            term: packageName,
            country,
            entity: 'software',
        }
        const url = 'https://itunes.apple.com/search?' + URLSearch(params)
        console.log('url = ', url)
        const response = await makeRequest(url)
        /** @type {{ resultCount: number; results: Software[]; }} */
        const data = parseResponse({ responseText: response.data, headers: { 'content-type': 'application/json' } })
        storeView.create(data)
        modalView.show();
    }
    /**
     * @param {Software} data
     */
    function createSoftwareView(data) {
        const view = createView(`
        <div class="app-store-software">
            <image class="app-store-software-icon" src="${data.artworkUrl100}"></image>
            <div class="app-store-software-content">
                <div class="app-store-software-name" > 
                    <a class="name" href="${data.trackViewUrl}">${data.trackName}</a>
                    <span class="version">v${data.version}</span>
                </div>
                <div class="app-store-software-description"><span>${data.description.slice(0, 200)}</span></div>
                <div class="app-store-software-meta">
                    <div class="app-store-software-rating">рейтинг: ${data.averageUserRating.toFixed(2)}</div>
                    <div class="app-store-software-genres">${data.genres.join(', ')}</div>
                    <div class="app-store-software-author">${data.artistName}</div>
                </div>
            </div>
        </div>`
        )
        return view;
    }
    /**
     * @param {string} html
     * @return {HTMLElement}
     */
    function createView(html) {
        const div = document.createElement('div')
        div.innerHTML = (html || '').replace(/\s+/g, ' ').replace(/\r?\n/g, ' ').trim()
        return div.firstElementChild.cloneNode(true)
    }
    function createDocument(html, title) {
        title = title || ''
        var doc = document.implementation.createHTMLDocument(title);
        doc.documentElement.innerHTML = html
        return doc
    }
    function onSubmit(e) {
        e.preventDefault()
        const input = document.querySelector('#package-name')
        if (!input) {
            console.error('input not found')
            return
        }
        const packageName = input.value;
        searchAppStore(packageName).catch((e) => {
            console.error('searchAppStore error: ', e)
        }).then(() => {
            inputView.hide()
            logoView.show()
        });
    }
    function createMainView() {
        const mainView = createView(`<form class="main-view"><div class="input-view-content"></div></form>`)
        const input = createView('<input id="package-name" placeholder="Enter app name" type="text" class="package-name"></input>')
        const submit = createView('<input type="submit" style="display:none"></input>')
        const button = createView('<div class="submit">Submit</div>')
        const div = mainView.querySelector('div')
        div.appendChild(input)
        div.appendChild(submit)
        div.appendChild(button)

        button.addEventListener('click', onSubmit)
        mainView.addEventListener('submit', onSubmit);
        return mainView;
    }
    async function DOMReady() {
        if (document.readyState !== 'loading') {
            return
        }
        let resolve
        const promise = new Promise(res => { resolve = res; })
        document.addEventListener('DOMContentLoaded', resolve)
        return promise
    }
    function arrayBufferToBase64(buffer) {
        var binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; ++i) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }
    var modalView = {
        create: function () {
            var element = modalView.getElement()
            if (!element.parentNode) {
                const style = createView(`<style>${modalView.style}</style>`)
                document.head.appendChild(style)
                document.body.appendChild(element)
            }
            return element
        },
        /** @return {HTMLElement} */
        getElement: function () {
            if (modalView.element) {
                return modalView.element
            }
            var element = modalView.element = createView(`
            <div class="modal-wrapper">
                <input type="checkbox" style="display: none; z-index: 1000; position: fixed; top: 10px; left: 10px;" id="modal-checkbox" />
                <div class="modal-container">
                    <label for="modal-checkbox" class="modal-close-background" ></label>
                    <div class="modal-content">
                    ${'' && '<div class="modal-header"><label for="modal-checkbox" title="close" class="modal-close-x"><div></div></label></div>'}
                        <div class="modal-body"></div>
                        <div class="modal-footer"></div>
                    </div>
                </div>
            </div>
            `)
            return element
        },
        /** @param {boolean} checked */
        check: function (checked) {
            var element = modalView.getElement()
            element.querySelector('#modal-checkbox').checked = checked
        },
        show: function () {
            modalView.check(true)
        },
        hide: function () {
            modalView.check(false)
        },
        style: `
.modal-container {
  position: fixed;
  opacity: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: all 0.25s;
  z-index: -1000;
}
#modal-checkbox {
  top: 20px;
  left: 20px;
  position: fixed;
  z-index: 9999999999999;
  display: block;
}
#modal-checkbox:checked + .modal-container {
  z-index: 9999999;
  opacity: 1;
}
#modal-checkbox:checked + .modal-container label {
  display: block;
}
#modal-checkbox:checked + .modal-container .modal-content {
  bottom: 0;
  transition: all 0.25s;
  display: flex;
}
.modal-content {
  position: absolute;
  background-color: gray;
  min-width: 400px;
  min-height: 225px;
  max-width: 500px;
  max-height: 280px;
  width: 40%;
  height: 40%;
  opacity: 1;
  flex-direction: column;
  align-items: center;
  right: 0;
  bottom: -20%;
  transition: all 0.25s;
}
.modal-header {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  width: 100%;
}
.modal-close-x {
  margin: 5px 10px 5px 0;
  z-index: 12;
  cursor: pointer;
}
.modal-close-x div {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.modal-close-x,
.modal-close-x div {
  width: 24px;
  height: 24px;
}
.modal-close-x div:after,
.modal-close-x div:before {
  content: "";
  position: absolute;
  background: #fff;
  width: 2.5px;
  height: 24px;
  display: block;
  transform: rotate(45deg);
}
.modal-close-x div:before {
  transform: rotate(-45deg);
}
.modal-close-background {
  position: absolute;
  background-color: black;
  width: 100%;
  height: 100%;
  opacity: 0.4;
  cursor: pointer;
  display: none;
}
        `,
    }
    var storeView = {
        create: function (data) {
            var element = storeView.getElement(data)
            if (!element.parentNode) {
                const style = createView(`<style>${storeView.style}</style>`)
                document.head.appendChild(style)
                modalView.getElement().querySelector('.modal-body').appendChild(element)
            }
            return element
        },
        /** @param {{ resultCount: number; results: Software[]; }} data */
        getElement: function (data) {
            if (!storeView.element) {
                storeView.element = createView('<div class="app-store-view"></div>')
            }
            storeView.element.innerHTML = ''
            for (const software of data.results) {
                const sview = createSoftwareView(software)
                storeView.element.appendChild(sview)
            }
            return storeView.element
        },
        style: `
            .modal-content {
                background-color: rgba(255, 255, 255, 0.9);
            }
            .modal-body {
                overflow: auto;
                background-color: rgba(255, 255, 255, 0.9);
            }
            .app-store-view {
                display: flex;
                flex-direction: column;
            }
            .app-store-software {
                display: flex;
                flex-direction: row;
                margin: 5px 0;
            }
            .app-store-software-icon {
                object-fit: contain;
                width: 100px;
                height: 100px;
            }
            .app-store-software-name {
                font-weight: bold;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
            }
            .app-store-software-content {
	            display: flex;
	            flex-direction: column;
                justify-content: space-between;
                margin-left: 10px;
                margin-right: 10px;
                flex: 1;
            }
            .app-store-software-description span {
	            text-overflow: ellipsis;
	            max-width: 350px;
	            white-space: nowrap;
	            overflow: hidden;
	            display: block;
            }
            .app-store-software-meta {
	            display: flex;
	            flex-direction: row;
	            justify-content: space-between;
	            align-items: center;
            }
            .app-store-software-meta > * {
                flex: 1;
                text-align: center;
            }
        `,
    }
    var inputView = {
        create: function () {
            var element = inputView.getElement()
            if (!element.parentNode) {
                const style = createView(`<style>${inputView.style}</style>`)
                document.head.appendChild(style)
                document.body.appendChild(element)
            }
            return element
        },
        getElement: function () {
            if (!inputView.element) {
                inputView.element = createMainView()
            }
            return inputView.element
        },
        hide: function () {
            inputView.getElement().style.display = 'none'
        },
        show: function () {
            inputView.getElement().style.display = 'initial'
        },
        style: `
        .main-view {
            position: fixed;
            top: 60px;
            right: 10px;
            background: #fff;
            padding: 10px;
            z-index: 10000;
        }
        .input-view-content {
	        padding: 25px;
	        border-radius: 10px;
	        border: 1px solid #eaeaea;
        }
        .package-name {
	        line-height: 22px;
	        font-size: 12px;
	        padding-left: 10px;
        }
        .submit {
	        color: #fff;
	        background-color: #179ed0;
	        border-radius: 5px;
	        display: flex;
	        padding: 3px;
	        justify-content: center;
	        align-items: center;
	        margin-top: 5px;
        }
        `,
    }

    var logoView = {
        create: function () {
            var element = logoView.getElement()
            if (!element.parentNode) {
                const style = createView(`<style>${logoView.style}</style>`)
                document.head.appendChild(style)
                document.body.appendChild(element)
            }
            return element
        },
        getElement: function () {
            if (!logoView.element) {
                const logo = logoView.icon// 'https://i.imgur.com/SnBFon3.png'
                logoView.element = createView(`<image src="${logo}" class="app-store-logo" />`)
                logoView.element.addEventListener('click', () => {
                    logoView.hide()
                    inputView.show()
                })
            }
            return logoView.element
        },
        loadIcon: async function () {
            const response = await makeRequest({
                url: 'https://i.imgur.com/SnBFon3.png',
                responseType: 'arraybuffer',
            })
            if (response.ok) {
                const resource = arrayBufferToBase64(response.data);// URL.createObjectURL(response.data)
                logoView.icon = `data:image/png;base64,${resource}`
            }
        },
        icon: '',
        hide: function () {
            logoView.getElement().style.display = 'none'
        },
        show: function () {
            logoView.getElement().style.display = 'initial'
        },
        style: `
        .app-store-logo {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 100000;
            width: 60px;
            height: 60px;
            object-fit: contain;
            cursor: pointer;
        }
        `,
    }

})();