// ==UserScript==
// @name        V2PH Album Downloader
// @namespace   https://greasyfork.org/zh-CN/users/220174-linepro
// @match       https://www.v2ph.com/album/*
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addStyle
// @version     1.2
// @author      LinePro
// @license     MIT
// @description Album Downloader for v2ph.com. After logging in and opening the album page, click the "Download all images" option in the script menu to start downloading.
// @run-at document-idle
// @require https://update.greasyfork.org/scripts/473358/1237031/JSZip.js
// @require https://cdn.jsdelivr.net/npm/idb-keyval@6/dist/umd.js
// @downloadURL https://update.greasyfork.org/scripts/509859/V2PH%20Album%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509859/V2PH%20Album%20Downloader.meta.js
// ==/UserScript==
(async () => {
    const jQuery = unsafeWindow.jQuery;
    GM_addStyle(`
        .spinner-border {
            display: inline-block;
            width: 1.25rem;
            height: 1.25rem;
            vertical-align: -.125em;
            border: .175em solid currentColor;
            border-right-color: transparent;
            border-radius: 50%;
            -webkit-animation: .75s linear infinite spinner-border;
            animation: .75s linear infinite spinner-border
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            border: 0
        }

        .modal-loading {
            margin-left: 0.5rem;
        }
    `);
    class BootStrap4Model {
        constructor(title = 'Modal', text = '') {
            const wrap = (() => {
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.setAttribute('tabindex', '-1');
                modal.dataset.backdrop = 'static';
                modal.dataset.keyboard = 'false';
                const modalDialog = document.createElement('div')
                modalDialog.className = 'modal-dialog';
                const modalContent = document.createElement('div')
                modalContent.className = 'modal-content';
                const modalHeader = document.createElement('div');
                modalHeader.className = 'modal-header';
                const modalTitle = document.createElement('h5');
                this.modalTitle = modalTitle;
                modalTitle.className = 'modal-title';
                modalTitle.innerText = title;
                const modalLoading = document.createElement('div');
                this.modalLoading = modalLoading;
                modalLoading.className = 'modal-loading spinner-border';
                modalLoading.style.display = 'none';
                modalLoading.setAttribute('role', 'status');
                const modalLoadingSpan = document.createElement('span');
                modalLoadingSpan.className = 'sr-only';
                modalLoadingSpan.innerText = 'Loading...';
                modalLoading.appendChild(modalLoadingSpan);
                modalTitle.appendChild(modalLoading);
                modalHeader.appendChild(modalTitle);
                const modalBody = document.createElement('div');
                this.modalBody = modalBody;
                modalBody.className = 'modal-body';
                modalBody.innerText = text;
                const modalFooter = document.createElement('div');
                modalFooter.className = 'modal-footer';
                const closeBtn = document.createElement('button');
                this.closeBtn = closeBtn;
                closeBtn.className = 'btn btn-danger';
                closeBtn.setAttribute('data-dismiss', 'modal');
                closeBtn.innerText = 'Close';
                modalFooter.appendChild(closeBtn);
                modalContent.appendChild(modalHeader);
                modalContent.appendChild(modalBody);
                modalContent.appendChild(modalFooter);
                modalDialog.appendChild(modalContent);
                modal.appendChild(modalDialog);
                return modal;
            })();
            document.body.appendChild(wrap);
            this.wrap = wrap;
        }

        show() {
            jQuery(this.wrap).modal('show');
        }

        hide() {
            jQuery(this.wrap).modal('hide');
        }

        setTitle(title) {
            this.modalTitle.innerText = title;
        }

        setText(text) {
            this.modalBody.innerText = text;
        }

        setLoading(loading) {
            this.modalLoading.style.display = loading ? '' : 'none';
        }

        setCloseBtn(text, callback) {
            this.closeBtn.innerText = text;
            this.closeBtn.onclick = callback;
        }
    }

    const getPageFromUrl = (url) => {
        const search = new URL(url).searchParams;
        const page = search.get("page");
        if (page) {
            return parseInt(page);
        }
        return 1;
    }

    const fetch = (url) => {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {
                    Referer: location.href
                },
                responseType: 'blob',
                onload: response => resolve(response.response),
                onerror: error => reject(error)
            });
        });
    }

    const downloadingStatus = await idbKeyval.get("downloadingStatus");

    const downloadingAlbumId = downloadingStatus?.albumId;
    const downloadingPage = downloadingStatus?.page;

    const currentAlbumId = location.pathname.split("/").pop();

    const page = getPageFromUrl(location.href);

    const registerMenu = () => {
        const caption = 'Download all images';
        GM_registerMenuCommand(caption, async () => {
            GM_unregisterMenuCommand(caption);
            if (page !== 1) {
                await idbKeyval.set("downloadingStatus", {
                    albumId: currentAlbumId,
                    page: 1
                });
                location.search = '';
            } else {
                await startDownload();
            }
        });
    };

    const startDownload = async () => {
        let cancelled = false;
        const modal = new BootStrap4Model('Downloading');
        modal.show();
        modal.setCloseBtn('Cancel', async () => {
            cancelled = true;
            await idbKeyval.clear();
            registerMenu();
        });

        const values = [];
        let index = 1;
        const imgList = document.querySelectorAll("img.album-photo");
        for (const element of imgList) {
            const url = element.dataset.src;
            const fileName = url.split("/").pop();
            modal.setText(`Downloading ${page}-${index}-${fileName}...`);
            modal.setLoading(true);

            const blob = await fetch(url);
            values.push({
                name: `${page}-${index++}-${fileName}`,
                blob
            });
            await new Promise(resolve => setTimeout(resolve, 500));
            if (cancelled) {
                return;
            }
        }
        await idbKeyval.set(`page-${page}`, values);
        
        const lastPageUrl = document.querySelector(".page-item:last-of-type a")?.href;
        if (page === getPageFromUrl(lastPageUrl)) {
            const zip = new JSZip();
            const values = (await idbKeyval.values()).flat().slice(1);
            for (const { name, blob } of values) {
                zip.file(name, blob);
            }
            const zipBlob = await zip.generateAsync({ type: "blob" })
            const url = URL.createObjectURL(zipBlob);
            const title = document.querySelector(".h5.text-center.mb-3").textContent || 'album';
            GM_download(url, `${title}.zip`);
            await idbKeyval.clear();
            modal.setTitle('Downloaded Complete');
            modal.setText(`${values.length} images downloaded.`);
            modal.setLoading(false);
            modal.setCloseBtn('Close', () => modal.hide());
        } else {
            const nextPage = page + 1;
            await idbKeyval.set("downloadingStatus", {
                albumId: currentAlbumId,
                page: nextPage
            });
            location.search = `?page=${nextPage}`;
        }
    };

    if (downloadingAlbumId === currentAlbumId && downloadingPage === page) {
        await startDownload();
    } else {
        await idbKeyval.clear();
        registerMenu();
    }
})();
