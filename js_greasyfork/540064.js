// ==UserScript==
// @name         DM5-Downloader
// @namespace    https://github.com/HageFX-78
// @version      1.2
// @description  DM5 manga downloader, batch download supported through popup tabs.
// @author       HageFX78
// @license      MIT
// @match        *://*.dm5.com/m*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dm5.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.0/FileSaver.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540064/DM5-Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/540064/DM5-Downloader.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const urlParams = new URLSearchParams(window.location.search);
    const autoDownload = urlParams.get('autodl') === 'true';

    // Main manga/amnhua page
    if (!/^https:\/\/www\.dm5\.com\/m\d+(\/)?(\?.*)?$/.test(window.location.href)) {
        InsertIndexInfo();

        let UI_ELEMENTS = await AddDownloaderBlock();
        let addButton = UI_ELEMENTS[0];
        let startInput = UI_ELEMENTS[1];
        let endInput = UI_ELEMENTS[2];

        let pageUrls = await GetPageURLs();

        addButton.addEventListener('click', async () => {
            let blockedCount = 0;

            let startIndex = parseInt(startInput.value) || 0;
            let endIndex = parseInt(endInput.value) || pageUrls.length - 1;

            for (let i = startIndex; i <= endIndex; i++) {
                let pageUrl = pageUrls[i];
                const popup = window.open(pageUrl + '?autodl=true', `_blank`);

                if (!popup) blockedCount++;
            }

            if (blockedCount > 0) {
                // defer alert to let popups finish loading
                setTimeout(() => {
                    alert(
                        `[ DM5 Downloader ]\n\n Popup was blocked! ${blockedCount} download blocked!\n\nPlease allow pop-ups for this site in your browser setting to enable batch downloading. Remember to turn it off after use.
                        \n\n弹出窗口被浏览器拦截了！共有 ${blockedCount} 个下载被阻止！\n\n请在浏览器设置中允许此网站的弹出窗口，以启用批量下载功能。使用完成后，记得关闭该设置以保证浏览安全。`,
                    );
                }, 500);
            }
        });
    } else {
        // Chapter page
        let addButton = AddDownloadButton();
        let imgList = GetAllImages(addButton);

        imgList.then(async (images) => {
            if (autoDownload) {
                await DownloadAsZip(images);
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Allow download to start
                window.close();
            } else {
                addButton.style.display = 'block';
                addButton.addEventListener('click', async () => {
                    await DownloadAsZip(images);
                });
            }
        });
    }
})();

async function GetPageURLs() {
    let mangaElements = document.querySelectorAll('.view-win-list a');
    let urlEnds = Array.from(mangaElements).map((el) => 'https://www.dm5.com' + el.getAttribute('href'));

    return urlEnds;
}

async function InsertIndexInfo() {
    let chapterA = document.querySelectorAll('.view-win-list a');

    if (chapterA.length === 0) {
        console.warn('DM5D - No chapter span found, skipping index info insertion.');
        return;
    }

    let startIndex = 0;
    chapterA.forEach((a) => {
        const extraText = document.createTextNode(`[ ${startIndex} ] - `);
        a.insertBefore(extraText, a.firstChild);
        startIndex++;
    });
}

async function GetAllImages(addButton) {
    let imageList = [];
    const loader = CreateLoadingBar(DM5_IMAGE_COUNT, addButton);
    for (let pg = 1; pg <= DM5_IMAGE_COUNT; pg++) {
        try {
            const params = new URLSearchParams({
                cid: DM5_CID,
                page: pg,
                key: '',
                language: 1,
                gtk: 6,
                _cid: DM5_CID,
                _mid: DM5_MID,
                _dt: DM5_VIEWSIGN_DT,
                _sign: DM5_VIEWSIGN,
            });

            const res = await fetch('/chapterfun.ashx?' + params);
            const js = await res.text();

            eval(js); // This will define `d` in the global scope
            const imgUrl = d[0];

            const imgBlob = await fetch(imgUrl).then((r) => r.blob());

            imageList.push({
                url: imgUrl,
                blob: imgBlob,
                ext: imgBlob.type.includes('png') ? 'png' : 'jpg',
                page: pg,
            });

            loader.update(pg);
            // console.log(`DM5D - Page ${pg} loaded`);
        } catch (err) {
            console.error(`DM5D - Failed on page ${pg}:`, err);
        }
    }

    return imageList;
}

function DownloadAsZip(images) {
    const zip = new JSZip();
    const folder = zip.folder(DM5_CTITLE);

    for (const img of images) {
        const paddedName = String(img.page).padStart(3, '0') + '.' + img.ext;
        folder.file(paddedName, img.blob);
    }

    return zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `${DM5_CTITLE}.zip`);
    });
}

function AddDownloadButton() {
    const downloadButton = document.createElement('button');
    Object.assign(downloadButton.style, {
        padding: '10px 20px',
        backgroundColor: '#f10534',
        color: '#fff',
        border: 'none',
        borderRadius: '2px',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 1000,
        display: 'none', // Initially hidden
    });
    downloadButton.textContent = 'Download / 下载';

    //on hover
    downloadButton.addEventListener('mouseover', () => {
        downloadButton.style.backgroundColor = '#d1042a';
    });
    downloadButton.addEventListener('mouseout', () => {
        downloadButton.style.backgroundColor = '#f10534';
    });

    return downloadButton;
}

async function AddDownloaderBlock() {
    const container = document.createElement('div');
    Object.assign(container.style, {
        width: '100%',
        height: 'auto',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    });

    const selectorTextBoxes = document.createElement('div');
    Object.assign(selectorTextBoxes.style, {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        justifyContent: 'flex-end',
    });

    // Start index input
    const startInput = document.createElement('input');
    startInput.placeholder = 'Start / 开始';
    Object.assign(startInput.style, {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '2px',
        fontSize: '14px',
        width: '140px',
        boxSizing: 'border-box',
    });

    // Length input
    const endInput = document.createElement('input');
    endInput.placeholder = 'End / 结尾';
    Object.assign(endInput.style, {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '2px',
        fontSize: '14px',
        width: '140px',
        boxSizing: 'border-box',
    });

    const downloadButton = document.createElement('button');
    Object.assign(downloadButton.style, {
        padding: '10px 20px',
        backgroundColor: '#f10534',
        color: '#fff',
        border: 'none',
        borderRadius: '2px',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 1000,
        display: 'block',
        whiteSpace: 'nowrap',
    });
    downloadButton.textContent = 'Download All / 下载';

    // Hover effect
    downloadButton.addEventListener('mouseover', () => {
        downloadButton.style.backgroundColor = '#d1042a';
    });
    downloadButton.addEventListener('mouseout', () => {
        downloadButton.style.backgroundColor = '#f10534';
    });

    // Assemble
    selectorTextBoxes.appendChild(startInput);
    selectorTextBoxes.appendChild(endInput);
    selectorTextBoxes.appendChild(downloadButton);
    container.appendChild(selectorTextBoxes);

    let chapterContainer = document.querySelector('#chapterlistload');
    chapterContainer.before(container);

    return [downloadButton, startInput, endInput];
}

function CreateLoadingBar(totalPages, downloadButton) {
    const wrapper = document.createElement('div');
    const container = document.createElement('div');
    const bar = document.createElement('div');
    const text = document.createElement('span');

    // Flex wrapper for centering both button and bar
    Object.assign(wrapper.style, {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        margin: '16px',
        zIndex: 1000,
    });

    // Progress bar container
    Object.assign(container.style, {
        position: 'relative',
        width: '600px',
        height: '30px',
        backgroundColor: '#454545',
        borderRadius: '5px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddding: '10px',
    });

    Object.assign(bar.style, {
        height: '100%',
        width: '0%',
        backgroundColor: '#f10534',
        transition: 'width 0.2s',
    });

    Object.assign(text.style, {
        position: 'absolute',
        width: '100%',
        textAlign: 'center',
        fontSize: '14px',
        color: 'white',
        zIndex: 1002,
    });

    container.appendChild(bar);
    container.appendChild(text);
    wrapper.appendChild(container);
    wrapper.appendChild(downloadButton);

    // Insert wrapper after .view-paging
    const pagingElement = document.querySelector('.view-paging');
    pagingElement.after(wrapper);

    return {
        update: (current) => {
            const percent = Math.round((current / totalPages) * 100);
            bar.style.width = percent + '%';
            text.textContent = `Loading Images... (${current}/${totalPages})`;
        },
        remove: () => {
            wrapper.remove();
        },
    };
}
