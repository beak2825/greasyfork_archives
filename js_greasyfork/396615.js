// ==UserScript==
// @name         flutter packages site toolkit script
// @license      GPL-3.0-only
// @namespace    https://pub.dev
// @icon         https://pub.flutter-io.cn/favicon.ico?hash=nk4nss8c7444fg0chird9erqef2vkhb8
// @version      1.0.0
// @description  1. copy dependencies info cash as: "dio: ^1.2.3"; ~~2. open package page by search string~~
// @author       Sven
// @match        https://pub.dev/packages/*
// @match        https://pub.dev/packages?q=*
// @match        https://pub.dev
// @match        https://pub.flutter-io.cn/packages/*
// @match        https://pub.flutter-io.cn/packages?q=*
// @match        https://pub.flutter-io.cn
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396615/flutter%20packages%20site%20toolkit%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/396615/flutter%20packages%20site%20toolkit%20script.meta.js
// ==/UserScript==

;(function () {
    class Toolkit {
        static SHEETS = `
            :root {
                --toolkit-border: 1px solid #CCC;
            }
            #dependencies-info { display: flex; font-size: 14px; margin-bottom: 15px; }
            #dependencies-info > div { padding: 5px 8px; font-weight: bolder; cursor: pointer; }
            #dependencies-info .version {
                background-color: #e7f8ff;
                color: #666;
            }
            #dependencies-info .tips {
                background-color: #0175c2;
                color: #FFF;
            }
            #dependencies-info .tips:hover { background-color: #37a4ec; }
        `
        constructor() {
            window.addEventListener('DOMContentLoaded', evt => {
                this.appendSheets()
                this.showDependenciesInfo()
            })
        }
        appendSheets() {
            const sheet = document.createTextNode(Toolkit.SHEETS)
            const el = document.createElement('style')
            el.id = 'toolkit-sheets'
            el.appendChild(sheet)
            document.getElementsByTagName('head')[0].appendChild(el)
        }
        showDependenciesInfo() {
            const titleWrapper = document.querySelector('.detail-header')
            const titleDom = document.querySelector('.detail-header .title')
            const infoParts = titleDom.innerText.split(' ')
            const info = `${infoParts[0]}: ^${infoParts[1]}`
            const infoDom = this._getDependenciesInfoDom(info)
            titleWrapper.insertBefore(infoDom, document.querySelector('.detail-header .metadata'))
        }
        _getDependenciesInfoDom(info) {
            const infoDom = document.createElement('div')
            const versionDom = document.createElement('div')
            const tipsDom = document.createElement('div')
            versionDom.innerText = info
            versionDom.classList.add('version')
            tipsDom.innerText = location.host === 'pub.dev' ? '𝒄𝒍𝒊𝒄𝒌 𝒕𝒐 𝒄𝒐𝒑𝒚' : '点击复制'
            tipsDom.classList.add('tips')
            infoDom.setAttribute('id', 'dependencies-info')
            infoDom.appendChild(versionDom)
            infoDom.appendChild(tipsDom)
            infoDom.addEventListener('click', evt => {
                if (evt.target === infoDom) return
                this.clickToCopy(info)
            })
            return infoDom
        }
        clickToCopy(info) {
            const tempInput = document.createElement('input')
            tempInput.setAttribute('value', info)
            document.body.appendChild(tempInput)
            tempInput.select()
            const successfully = document.execCommand('copy')
            document.body.removeChild(tempInput)
            this.log(successfully ? 'copy successfully' : 'copy failed')
        }
        log(...args) {
            console.log('%c[pub.dev Toolkit] LOG: ', 'color:teal', ...args)
        }
    }
    window._$PubDevToolkit = new Toolkit()
})();