// ==UserScript==
// @name Bypass Countdown (Multi-site)
// @namespace -
// @version 1.1.2
// @description bypass countdown for websites that distribute APK files.
// @author NotYou
// @include *://an1.com/file*
// @include *://apkzara.com/*/download*
// @include *://*apkmody.io/*download*
// @include *://*apkmody.fun/*download*
// @include *://5play.ru/*
// @include *://techbigs.com/download*
// @include *://apkdone.com/*/download*
// @include *://relaxmodapk.com/*/download*
// @include *://relaxmodapk.com/*/file*
// @include *://gamedva.com/*?download*
// @include *://apk.idealfollow.in/links*
// @include *://apkigru.site/file/*
// @include *://appszx.com/*/?download=links*
// @include *://store.apkmodo.net/*
// @include *://modpure.co/*
// @run-at document-end
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/449544/Bypass%20Countdown%20%28Multi-site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449544/Bypass%20Countdown%20%28Multi-site%29.meta.js
// ==/UserScript==

init('an1.com', `
#timer,[rel*="sponsored"],.banner {display: none !important;}
#pre_download {display: block !important;}
.box-file-img > img {border-radius: 8px;}`)

init('apkzara.com', `
.collapsible-body {max-height: unset !important;}
#waitdownloads_types_2, #waitdownloads_types_2 > a {text-decoration: none;transform: scale(2);font-size: 0px;}
#waitdownloads_types_2 > a::before {background: rgb(71, 181, 21);color: rgb(255, 255, 255);content: "DOWNLOAD";border-radius: 20px;padding: 2px 8px;font-size: 15px;}
#waitdownloads_types_2 > a > i, #please_wait_seconds_types_2, p.truncate.has-text-align-center.has-inline-color.has-cyan-bluish-gray-color, #apps .base-timer {display: none !important;}`)

let apkmody = ['apkmody.io', 'apkmody.fun', 'download.apkmody.fun', 'download.apkmody.io']

for (let i = 0; i < apkmody.length; i++) {
    init(apkmody[i], `
    #download-loading {display: none !important;}
    #download {display: block !important;}`)
}

init('5play.ru', `
.counter, .telegram-cdn-btn, .page-cdn-notimer {display: none;}
.download-btn-group {display: unset !important;}`)

init('apk.idealfollow.in', `
.counter {display: none;}
.counter ~ * {display: block !important;}`)

init('apkigru.site', `
#dwn-btn *, .download__faq-text[style] {display: block !important;}
.download__timer {display: none !important;}`)

init('appszx.com', `
.bx-download .bxt.sdl_text {display: none;}
.show_download_links {display: block !important;}`)

init('store.apkmodo.net', `
#mdtimer {display: none;}
#mdtimer + .button-download {display:block !important;}`)

init('modpure.co', `
#download-loading {display: none;}
#download {display: block !important;}`)

init('gamedva.com', () => {
    document.querySelector('#download-now').style.display = 'block'
    addStyle('#download-loading {display: none !important;}')
})

init('techbigs.com', () => {
    let href = document.querySelector('#page-body + script').textContent.match(/= \"(.*?)\"/)[1]
    addStyle(`
    .counter {display: none !important;}
    #pageDownload2WrapButton > a {display: flex !important;}`)
    document.querySelector('#pageDownload2WrapButton > a').href = href
    document.querySelector('#downloadHere').href = href
})

init('apkdone.com', () => {
    window.download.innerHTML = document.querySelector('[type="text/css"] + script').textContent.match(/= '(<a.*?)'/)[1]
    window.download.id = 'download-new'
})

init('relaxmodapk.com', () => {
    try {
        document.querySelector('#progress_new').insertAdjacentHTML('afterend', `
        <div id="download" class="text-center mb-4" style="display: block;">
        <a id="no-link" class="btn btn-secondary px-5" href="${document.querySelector('[id="no-link download"]').href}" download="">
        <svg class="svg-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M528 288h-92.1l46.1-46.1c30.1-30.1 8.8-81.9-33.9-81.9h-64V48c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v112h-64c-42.6 0-64.2 51.7-33.9 81.9l46.1 46.1H48c-26.5 0-48 21.5-48 48v128c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V336c0-26.5-21.5-48-48-48zm-400-80h112V48h96v160h112L288 368 128 208zm400 256H48V336h140.1l65.9 65.9c18.8 18.8 49.1 18.7 67.9 0l65.9-65.9H528v128zm-88-64c0-13.3 10.7-24 24-24s24 10.7 24 24-10.7 24-24 24-24-10.7-24-24z"></path></svg>
        <span class="align-middle moddroid">Download</span></a></div>`)
    } catch(e) {}
    addStyle(
    `#accordion-downloads .collapse:not(.show) {display: unset !important;}
    #download {display: block !important;}
    #progress_new, .waitme, #download + #download {display: none !important;}`)
})

function init(url, s) {
    if(match(url)) {
        if(typeof s === 'string') {
            addStyle(s)
        } else {
            s()
        }
    }
}

function match(url) {
    return location.host.indexOf(url) != -1
}

function addStyle(css) {
    var style = document.createElement('style')
    style.appendChild(document.createTextNode(css.replaceAll(' ', '')))
    document.head.appendChild(style)
}