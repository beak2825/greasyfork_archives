// ==UserScript==
// @name         wnacgDownload
// @namespace    Yr
// @version      3.0.3
// @description  Enhanced download of wnacg
// @author       yanagiragi
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @match        http*://*.wnacg.com/photos-index-page-*.html
// @match        http*://*.wnacg.org/photos-index-page-*.html
// @match        http*://*.wnacg.com/photos-index-aid-*.html
// @match        http*://*.wnacg.org/photos-index-aid-*.html
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/386909/wnacgDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/386909/wnacgDownload.meta.js
// ==/UserScript==

'use strict';

// Global Defines
const waitingStr = `排隊中`;
const downloadStr = `已下載`;
const timeout = 1000; // time interval between retry
const successCountLimit = 0; // How many continous success checks required to start download, set 0 for instant download
const closeTabInterval = -1; // set to -1 to avoid auto close new opened tabs
const closeWindowInterval = -1; // set to -1 to avoid auto close current window

// =====================================================
//                     Utilities
// =====================================================

// Modified from https://gist.github.com/WebReflection/df05641bd04954f6d366
// with predefined object specific, for HTML entities only
function _Unescape (s) {
    var re = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
    var unescaped = {
        '&amp;': '&',
        '&#38;': '&',
        '&lt;': '<',
        '&#60;': '<',
        '&gt;': '>',
        '&#62;': '>',
        '&apos;': "'",
        '&#39;': "'",
        '&quot;': '"',
        '&#34;': '"',
        '-': '-'
    };
    return s.replace(re, function (m) {
        return escape(unescaped[m]);
    });
}

async function _Fetch (url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { // Without header it return 200 and seldom return 503 even if service is not availiable
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            onload: function (response) {
                resolve(response.responseText)
            },
            onerror: function (error) {
                reject(error)
            }
        })
    })
}

function _PromissAll (promises, progressCallback) {
    let count = 0;
    progressCallback(0);
    for (const p of promises) {
        p.then(() => {
            count++;
            progressCallback((count * 100) / promises.length);
        });
    }
    return Promise.all(promises);
}


// =====================================================
//               Direct Download Methods
// =====================================================

async function ParseDownloadPageLink (url) {
    const result = await _Fetch(url);
    const match = result.match(/href=\"(\/download-index-aid-.*)"/);
    return `${location.protocol}//wnacg.org` + match[1];
}

async function ParseDownloadLink (target) {
    const result = await _Fetch(target.replace('wnacg.org', location.hostname));
    const matches = result.match(/down_btn ads\" href="(.*?)">/);
    const rawLink = `${location.protocol}//` + _Unescape(matches[1]); // fixs download re-naming of server behaviour
    return new URL(rawLink).href;
}

function GetCategory () {
    let raw = document.querySelector('.asTBcell.uwconn label').textContent
    raw = raw.replace(/分類：/, '').replace(/ /g, '').replace(/\//g, '')
    return encodeURIComponent(raw)
}

async function DirectDownload (event) {
    event.preventDefault();

    const btn = document.querySelector('#YrDownloadBtn');
    const block = document.querySelector('#YrDirectDownloadStatusBlock');
    const status = document.querySelector('#YrStatus');
    const retryCount = document.querySelector('#YrRetryCount');
    const lastRetry = document.querySelector('#YrLastRetry');
    const url = btn.href.replace(/&_ga=.*/, '') // remove ga since it sucks and broke server renaming function;

    let retries = 0;
    let successCount = 0;

    const Download = (onSuccessCallback, onFailCallback) => {
        // TODO: shoud refactor to call _Fetch later
        GM_xmlhttpRequest({
            method: "HEAD",
            url: url,
            headers: { // Without header it return 200 and seldom return 503 even if service is not availiable
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:93.0) Gecko/20100101 Firefox/93.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            timeout: 1000 * 10,
            onerror: function (error) {
                console.log('onerror')
                successCount = 0;
                onFailCallback();
            },
            onload: function (response) {
                console.log(`successCount = ${successCount}, code = ${response.status}`);
                if (response.status == 200 || response.status == 403) { // 403 means cloudflare middleware
                    successCount += 1;
                    if (successCount >= successCountLimit) {
                        onSuccessCallback();
                    }
                    else {
                        onFailCallback();
                    }
                }
                else {
                    successCount = 0;
                    onFailCallback();
                }
            }
        });
    };

    const OnSuccess = () => {
        status.textContent = downloadStr;

        const openTab = async () => {

            console.log(url)
            // open download link in new tab, use it with set auto download to specific types
            const tab = await GM_openInTab(url);

            // auto close tab
            if (closeTabInterval > 0) {
                await new Promise((resolve) => setTimeout(resolve, closeTabInterval));
                tab.close();
            }

            // auto close window, use it with brower config: allow script to close window
            // e.g. Firefox: dom.allow_scripts_to_close_windows
            if (closeWindowInterval > 0) {
                setTimeout(() => window.close(), closeWindowInterval);
            }
        }

        openTab();
    }

    const OnFailed = () => {
        status.textContent = waitingStr;
        lastRetry.textContent = `${new Date().toLocaleTimeString()}`;
        retryCount.textContent = `${++retries}`;

        setTimeout(TryDownload, timeout);
    }

    const TryDownload = () => Download(OnSuccess, OnFailed);

    // btn.style.display = 'none';
    block.style.display = 'block';
    lastRetry.textContent = `${new Date().toLocaleTimeString()}`;
    retryCount.textContent = `${retries}`;
    status.textContent = waitingStr;

    TryDownload();
}

// =====================================================
//               Download Image Methods
// =====================================================

function GetImageBase64 (index, url) {
    return new Promise((resolve, reject) => {
        const extension = url.substring(url.lastIndexOf('.') + 1)
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: 'text/plain; charset=x-user-defined',
            onload: response => {
                let binary = "";
                const responseText = response.responseText;
                const responseTextLen = responseText.length;
                for (let i = 0; i < responseTextLen; i++) {
                    binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
                }

                // Note there is no 'data:image/jpeg;base64,' Due to JSZip
                let src = btoa(binary)

                console.log(`Downloaded: ${index}.${extension}, src=${url}`)
                resolve({ 'index': index, 'base64': src, 'extension': extension })
            }
        })
    })
}

async function Compress (title, pics, progressCallback = null) {
    console.log(`Start Compress`)
    const zip = new JSZip();
    const folder = zip.folder(title);
    for (let i = 0; i < pics.length; ++i) {
        folder.file(`${pics[i].index}.${pics[i].extension}`, pics[i].base64, { base64: true })
    }
    const content = await zip.generateAsync({ type: "blob", streamFiles: true }, metadata => {
        progressCallback?.(metadata)
        console.log(`Compress Progress = ${metadata.percent.toFixed(2)} %`)
    })
    console.log(`All Done, Save to ${title}.zip`);
    return saveAs(content, `${title}.zip`);
}

async function FetchImageLinks (url) {
    const resp = await _Fetch(url)
    const dom = new DOMParser().parseFromString(resp, 'text/html')
    const blocks = dom.querySelectorAll('.gallary_item')
    const result = []
    for (let i = 0; i < blocks.length; ++i) {
        const a = blocks[i].querySelector('a')
        result.push(a.href)
    }
    return result
}

async function FetchImageSrc (url) {
    const resp = await _Fetch(url)
    const dom = new DOMParser().parseFromString(resp, 'text/html')
    const img = dom.querySelector('#photo_body img')
    return img.src
}

function GetPageCount () {
    const paginators = [...document.querySelectorAll('.f_left.paginator a')]
    if (paginators.length == 0) {
        // cases: current book has only one page
        return 1
    }
    const href = paginators.slice(-2, -1)[0].href
    return parseInt(href.substring(href.indexOf('photos-index-page-') + 'photos-index-page-'.length, href.indexOf('-aid-')))
}

function GetPageId () {
    // two formats:
    // https://wnacg.org/photos-index-aid-xxxxx.html
    // https://wnacg.org/photos-index-page-1-aid-xxxxx.html
    const href = location.href
    return location.href.substring(location.href.indexOf('-aid-') + '-aid-'.length, location.href.indexOf('.html'))
}

async function DownloadImages (event) {
    event.preventDefault();

    const block = document.querySelector('#YrDownloadImageStatusBlock');
    const parsingPageId = block.querySelector('#YrParsingPageId');
    const downloadImageStatus = block.querySelector('#YrDownloadImageStatus');

    block.style.display = 'block';

    const pageCount = GetPageCount()
    const pageId = GetPageId()

    downloadImageStatus.textContent = `解析頁面中 ...`

    const imageSrcs = []
    for (let i = 1; i <= pageCount; ++i) {
        parsingPageId.textContent = `第 ${i} 頁`
        const url = `https://wnacg.com/photos-index-page-${i}-aid-${pageId}.html`
        const links = await FetchImageLinks(url)
        const tasks = links.map(x => FetchImageSrc(x))
        const srcs = await Promise.all(tasks)
        imageSrcs.push(srcs)
        console.log(url, srcs) // for debug
    }

    parsingPageId.textContent = `已完成, 共 ${pageCount} 頁`

    const tasks = imageSrcs.flat().map((x, idx) => GetImageBase64(idx, x))
    const images = await _PromissAll(tasks, progress => {
        downloadImageStatus.textContent = `解析 ${parseInt(0.01 * progress * tasks.length)} / ${tasks.length} 圖片中 ...`
    })

    const title = document.querySelector('#bodywrap h2').textContent
    const results = await Compress(title, images, metadata => {
        downloadImageStatus.textContent = `壓縮中 (${metadata.percent.toFixed(2)} %)`
    })

    return results
}

// =====================================================
//                 General Setups
// =====================================================

async function SetupDirectDownloadButton () {
    const category = GetCategory();
    const downloadPageLink = await ParseDownloadPageLink(location.href);
    let downloadLink = await ParseDownloadLink(downloadPageLink);
    downloadLink = downloadLink.replace(/\?n=/, `?n=[${category}]`)

    console.log(`downloadPageLink = ${downloadPageLink}`) // for debug!
    console.log(`downloadLink = ${downloadLink}`); // for debug!

    // setup DOMs
    const downloadZipBtnElement = `<a id="YrDownloadBtn" class="btn" style="width:130px;" target="_blank" rel="noreferrer noopener" href=${downloadLink}>直接下載 (原生壓縮)</a>`;
    const statusElement = `
    <div id="YrDirectDownloadStatusBlock" style="display: none;">
      <div>重試次數: <span id="YrRetryCount"></span></div>
      <div style="padding-bottom: 3px;">目前狀態: <span id="YrStatus" style="color: blueviolet; font-weight: bold; font-size: 1.5em;"></span></div>
      <div>最後重試時間: <span id="YrLastRetry"></span></div>
    </div>`;
    const root = document.querySelector('.asTBcell.uwthumb');
    root.insertAdjacentHTML('beforeend', downloadZipBtnElement);
    root.insertAdjacentHTML('beforeend', statusElement);

    const downloadZipBtn = document.querySelector('#YrDownloadBtn');
    downloadZipBtn.addEventListener('click', DirectDownload);
}

async function SetupDownloadImageButton () {
    // setup DOMs
    const downloadImageBtnElement = `<a id="YrDownloadImageBtn" class="btn" style="width:130px;" target="_blank" rel="noreferrer noopener" href=#>直接下載 (網站圖片)</a>`;
    const statusElement = `
    <div id="YrDownloadImageStatusBlock" style="display: none;">
      <div>解析頁面: <span id="YrParsingPageId" style="color: blueviolet; font-weight: bold;"></span></div>
      <div style="padding-bottom: 3px;">目前狀態: <span id="YrDownloadImageStatus" style="color: blueviolet; font-weight: bold;"></span></div>
    </div>`;
    const root = document.querySelector('.asTBcell.uwthumb');
    root.insertAdjacentHTML('beforeend', downloadImageBtnElement);
    root.insertAdjacentHTML('beforeend', statusElement);

    const downloadImageBtn = document.querySelector('#YrDownloadImageBtn');
    downloadImageBtn.addEventListener('click', DownloadImages);
}

async function Run () {
    await SetupDirectDownloadButton();
    await SetupDownloadImageButton();
}

Run();