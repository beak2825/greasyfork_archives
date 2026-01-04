// ==UserScript==
// @name         cmoa.jp Downloader
// @version      1.1.5
// @description  Downloads comic pages from cmoa.jp
// @author       tnt_kitty
// @match        *://*.cmoa.jp/bib/speedreader/*
// @icon         https://www.cmoa.jp/favicon.ico
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_download
// @resource     bt https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/js/bootstrap.bundle.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @license      GPL-3.0-only
// @namespace    https://greasyfork.org/users/914763
// @downloadURL https://update.greasyfork.org/scripts/445038/cmoajp%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/445038/cmoajp%20Downloader.meta.js
// ==/UserScript==

function convertToValidFileName(string) {
    return string.replace(/[/\\?%*:|"<>]/g, '-');
}

function isValidFileName(string) {
    const regex = new RegExp('[/\\?%*:|"<>]', 'g');
    return !regex.test(string);
}

function getTitle() {
    try {
        return __sreaderFunc__.contentInfo.items[0].Title;
    } catch (error) {
        return null;
    }
}

function getAuthors() {
    try {
        return __sreaderFunc__.contentInfo.items[0].Authors[0].Name.split('/'); // Returns array of authors, ex. ['Author1', 'Author2']
    } catch (error) {
        return null;
    }
}

function getVolume() {
    try {
        return parseInt(__sreaderFunc__.contentInfo.items[0].ShopURL.split('/').at(-2));
    } catch (error) {
        return null;
    }
}

function getPageCount() {
    try {
        return SpeedBinb.getInstance('content').total;
    } catch (error) {
        return null;
    }
}

function getPageIntervals() {
    const isEmpty = string => !string.trim().length;

    const pagesField = document.querySelector('#pages-field');
    let fieldValue = pagesField.value;

    if (isEmpty(fieldValue)) {
        const speedbinb = SpeedBinb.getInstance('content');
        const totalPages = getPageCount();
        return [[1, totalPages]];
    }

    const pagesList = fieldValue.split(',');
    let pageIntervals = [];

    for (const x of pagesList) {
        let pages = x.split('-');
        if (pages.length === 1) {
            pageIntervals.push([parseInt(pages[0]), parseInt(pages[0])]);
        } else if (pages.length === 2) {
            pageIntervals.push([parseInt(pages[0]), parseInt(pages[1])]);
        }
    }

    if (pageIntervals.length <= 1) {
        return pageIntervals;
    }

    pageIntervals.sort((a, b) => b[0] - a[0]);

    const start = 0, end = 1;
    let mergedIntervals = [];
    let newInterval = pageIntervals[0];
    for (let i = 1; i < pageIntervals.length; i++) {
        let currentInterval = pageIntervals[i];
        if (currentInterval[start] <= newInterval[end]) {
            newInterval[end] = Math.max(newInterval[end], currentInterval[end]);
        } else {
            mergedIntervals.push(newInterval);
            newInterval = currentInterval;
        }
    }
    mergedIntervals.push(newInterval);
    return mergedIntervals;
}

function initializeComicInfo() {
    const titleListItem = document.querySelector('#comic-title');
    const authorListItem = document.querySelector('#comic-author');
    const volumeListItem = document.querySelector('#comic-volume');
    const pageCountListItem = document.querySelector('#comic-page-count');

    const titleDiv = document.createElement('div');
    titleDiv.innerText = getTitle();
    titleListItem.appendChild(titleDiv);

    const authors = getAuthors();
    if (authors.length > 1) {
        const authorLabel = authorListItem.querySelector('.fw-bold');
        authorLabel.innerText = 'Authors';
    }
    for (let i = 0; i < authors.length; i++) {
        const authorDiv = document.createElement('div');
        authorDiv.innerText = authors[i];
        authorListItem.appendChild(authorDiv);
    }

    const volumeDiv = document.createElement('div');
    volumeDiv.innerText = getVolume();
    volumeListItem.appendChild(volumeDiv);

    const pageCountDiv = document.createElement('div');
    pageCountDiv.innerText = getPageCount();
    pageCountListItem.appendChild(pageCountDiv);
}

function initializeDownloadName() {
    const downloadNameField = document.querySelector('#download-name-field');
    downloadNameField.placeholder = convertToValidFileName(getTitle().concat(' ', getVolume()));
}

function initializeSidebar() {
    initializeComicInfo();
    initializeDownloadName();

    const speedbinb = SpeedBinb.getInstance('content');
    speedbinb.removeEventListener('onPageRendered', initializeSidebar); // Remove event listener to prevent info from being added again
}

function validateDownloadNameField() {
    const downloadNameField = document.querySelector('#download-name-field');
    if (isValidFileName(downloadNameField.value)) {
        downloadNameField.setCustomValidity('');
    } else {
        downloadNameField.setCustomValidity('Special characters /\?%*:|"<>] are not allowed');
    }
}

function validatePagesField() {
    const totalPages = getPageCount();

    const pagesField = document.querySelector('#pages-field');
    const fieldValue = pagesField.value;
    const pagesList = fieldValue.split(',');

    const isValidPage = num => !isNaN(num) && (parseInt(num) > 0) && (parseInt(num) <= totalPages);
    const isValidSingle = range => (range.length === 1) && isValidPage(range[0]);
    const isValidRange = range => (range.length === 2) && range.every(isValidPage) && (parseInt(range[0]) < parseInt(range[1]));

    for (const x of pagesList) {
        let pages = x.split('-');
        if (!isValidSingle(pages) && !isValidRange(pages)) {
            pagesField.setCustomValidity('Invalid page range, use eg. 1-5, 8, 11-13 or leave blank');
            return;
        }
    }
    pagesField.setCustomValidity('');
}

function preventDefaultValidation() {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
      .forEach(function (form) {
          form.addEventListener('submit', function (event) {
              if (!form.checkValidity()) {
                  event.preventDefault();
                  event.stopPropagation();
              } else {
                  submitForm(event);
              }
              form.classList.add('was-validated');
      }, false)
    });
}

function submitForm(e) {
    e.preventDefault();
    const downloadNameField = document.querySelector('#download-name-field');
    if (!downloadNameField.value) {
        downloadNameField.value = downloadNameField.placeholder;
    }
    const form = document.querySelector('#download-sidebar form');
    const elements = form.elements;
    for (let i = 0; i < elements.length; i++) {
        elements[i].readOnly = true;
    }
    const downloadButton = document.querySelector('#download-button');
    downloadButton.disabled = true;
    downloadComic(getPageIntervals());
}

function setUpDownloadForm() {
    const pagesField = document.querySelector('#pages-field');
    pagesField.addEventListener('change', validatePagesField);

    const downloadNameField = document.querySelector('#download-name-field');
    downloadNameField.addEventListener('change', validateDownloadNameField);

    preventDefaultValidation();
}

function addSidebarEventListeners() {
    const stopProp = function(e) { e.stopPropagation(); };
    const sidebar = document.querySelector('#download-sidebar');
    sidebar.addEventListener('shown.bs.offcanvas', function() {
        document.addEventListener('keydown', stopProp, true);
        document.addEventListener('wheel', stopProp, true);
    });
    sidebar.addEventListener('hidden.bs.offcanvas', function() {
        document.removeEventListener('keydown', stopProp, true);
        document.removeEventListener('wheel', stopProp, true);
    });
}

function getImgCoordinates(img, pageWidth, pageHeight) {
    const insetTop = parseFloat(img.parentElement.style.top);
    const insetRight = parseFloat(img.parentElement.style.right);
    const insetBottom = parseFloat(img.parentElement.style.bottom);
    const insetLeft = parseFloat(img.parentElement.style.left);

    return {
        x: (pageHeight * insetLeft) / 100,
        y: (pageHeight * insetTop) / 100,
        width: pageWidth * ((100 - insetRight - insetLeft) / 100),
        height: pageHeight * ((100 - insetTop - insetBottom) / 100),
    };
}

function getPageBlob(pageNumber, scaled) {
    return new Promise(function(resolve, reject) {
        const speedbinb = SpeedBinb.getInstance('content');
        const pageInfo = speedbinb.Ii.Hn.page;
        const orgPageHeight = pageInfo[pageNumber - 1].image.orgheight;
        const orgPageWidth = pageInfo[pageNumber - 1].image.orgwidth;

        const imgs = document.getElementById(`content-p${pageNumber}`).getElementsByTagName('img');

        const imgsArray = Array.from(imgs);
        const pageWidth = scaled ? orgPageWidth : imgsArray[0].naturalWidth;

        const pageHeight = scaled ? orgPageHeight : Math.floor(orgPageHeight * pageWidth / orgPageWidth);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = pageHeight;
        canvas.width = pageWidth;

        const topImgCoordinates = getImgCoordinates(imgsArray[0], pageWidth, pageHeight);
        const middleImgCoordinates = getImgCoordinates(imgsArray[1], pageWidth, pageHeight);
        const bottomImgCoordinates = getImgCoordinates(imgsArray[2], pageWidth, pageHeight);

        ctx.drawImage(imgs[0], topImgCoordinates.x, topImgCoordinates.y, topImgCoordinates.width, topImgCoordinates.height);
        ctx.drawImage(imgs[1], middleImgCoordinates.x, middleImgCoordinates.y, middleImgCoordinates.width, middleImgCoordinates.height);
        ctx.drawImage(imgs[2], bottomImgCoordinates.x, bottomImgCoordinates.y, bottomImgCoordinates.width, bottomImgCoordinates.height);

        canvas.toBlob(blob => { resolve(blob); }, 'image/jpeg', 1.0);
    });
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitUntilPageLoaded(pageNumber) {
    const speedbinb = SpeedBinb.getInstance('content');
    speedbinb.moveTo(pageNumber - 1);
    while (!document.getElementById(`content-p${pageNumber}`)) {
        await sleep(200);
    }
    while (!document.getElementById(`content-p${pageNumber}`).getElementsByTagName('img')) {
        await sleep(200);
    }
    while (document.getElementById(`content-p${pageNumber}`).getElementsByTagName('img').length !== 3) {
        await sleep(200);
    }
    const imgs = document.getElementById(`content-p${pageNumber}`).getElementsByTagName('img');
    for (let i = 0; i < imgs.length; i++) {
        while (!imgs[i].complete) {
            await sleep(200);
        }
    }
    return new Promise(function(resolve, reject) {
        resolve();
    });
}

function toggleProgressBar() {
    const progress = document.querySelector('#download-sidebar .progress');
    const progressBar = document.querySelector('#download-sidebar .progress-bar');

    if (progress.classList.contains('invisible')) {
        progress.classList.remove('invisible');
        progress.classList.add('visible');
        progressBar.style.width = '0%';
    } else if (progress.classList.contains('visible')) {
        progress.classList.remove('visible');
        progress.classList.add('invisible');
        progressBar.style.width = '0%';
    }
}

function updateProgressBar(percentage) {
    const progressBar = document.querySelector('#download-sidebar .progress-bar');
    progressBar.style.width = `${percentage}%`;
}

async function downloadComic(pageIntervals) {
    const stopProp = function(e) { e.preventDefault(); e.stopPropagation(); };
    const sidebar = document.querySelector('#download-sidebar');
    sidebar.addEventListener('hide.bs.offcanvas', stopProp, true);

    const zip = new JSZip();
    const downloadName = document.querySelector('#download-name-field').value;
    const shouldScalePages = document.querySelector('#scale-checkbox').checked;

    toggleProgressBar();

    let totalPages = 0;
    for (let i = 0; i < pageIntervals.length; i++) {
        totalPages += pageIntervals[i][1] - pageIntervals[i][0];
    }

    let downloadedPages = 0;
    const speedbinb = SpeedBinb.getInstance('content');

    for (let i = 0; i < pageIntervals.length; i++) {
        const interval = pageIntervals[i], start = 0, end = 1;
        for (let nextPage = interval[start]; nextPage <= interval[end]; nextPage++) {
            await waitUntilPageLoaded(nextPage);
            const pageBlob = await getPageBlob(nextPage, shouldScalePages);
            zip.file(`${nextPage}.jpeg`, pageBlob);
            downloadedPages++;
            updateProgressBar(Math.round((downloadedPages / totalPages) * 100));
        }
    }

    zip.generateAsync({ type: 'blob' }, function updateCallback(metadata) {
        updateProgressBar(Math.round(metadata.percent));
    }).then(function(content) {
        const details = {
            'url': URL.createObjectURL(content),
            'name': `${downloadName}.zip`
        };
        GM_download(details);

        toggleProgressBar();

        const form = document.querySelector('#download-sidebar form');
        const elements = form.elements;
        for (let i = 0; i < elements.length; i++) {
            elements[i].readOnly = false;
        }

        const downloadButton = document.querySelector('#download-button');
        downloadButton.disabled = false;

        sidebar.removeEventListener('hide.bs.offcanvas', stopProp, true);
    });
}

function addDownloadTab() {
    const tabAnchor = document.createElement('a');
    tabAnchor.id = 'download-tab-anchor';
    tabAnchor.setAttribute('data-bs-toggle', 'offcanvas')
    tabAnchor.setAttribute('href', '#download-sidebar');
    tabAnchor.setAttribute('role', 'button');
    tabAnchor.setAttribute('aria-label', 'Open Download Options');

    const tab = document.createElement('div');
    tab.id = 'download-tab';
    tab.classList.add('rounded-start');

    const icon = document.createElement('i');
    icon.id = 'download-icon';
    icon.classList.add('fas');
    icon.classList.add('fa-file-download');

    tabAnchor.appendChild(tab);
    tab.appendChild(icon);
    document.body.append(tabAnchor);

    const tabCss =
    `#download-tab {
         background-color: var(--bs-orange);
         color: white;
         position: absolute;
         top: 3em;
         right: 0;
         z-index: 20;
         padding: 0.75em;
     }
     #download-tab:hover {
         background-color: #ca6510;
     }`;
    GM_addStyle(tabCss);
}

function addDownloadSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'download-sidebar';
    sidebar.classList.add('offcanvas');
    sidebar.classList.add('offcanvas-end');
    sidebar.classList.add('rounded-start');
    sidebar.setAttribute('tabindex', '-1');
    sidebar.setAttribute('aria-labelledby', '#download-sidebar-title');

    sidebar.innerHTML = `
<div class="offcanvas-header">
    <h5 id="download-sidebar-title">Download Options</h5>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
</div>
<div class="offcanvas-body">
    <div class="alert alert-warning d-flex align-items-center" role="alert">
        <i class="fas fa-exclamation-triangle bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning"></i>
        <div id="warning" style="padding-left: 0.5em">Do not interact with the reader while download is in progress.</div>
    </div>
    <ul class="list-group mb-3">
        <li class="list-group-item" id="comic-title">
            <div class="fw-bold">Title</div>
        </li>
        <li class="list-group-item" id="comic-author">
            <div class="fw-bold">Author</div>
        </li>
        <li class="list-group-item" id="comic-volume">
            <div class="fw-bold">Volume</div>
        </li>
        <li class="list-group-item" id="comic-page-count">
            <div class="fw-bold">Page Count</div>
        </li>
    </ul>
    <form id="download-options-form" class="needs-validation" novalidate>
        <div class="mb-3">
            <label for="download-name-field" class="form-label">Download name</label>
            <textarea type="text" id="download-name-field" name="download-name" class="form-control" placeholder="Leave blank for comic name"></textarea>
            <div class="invalid-feedback">Special characters /\?%*:|"&lt;&gt;] are not allowed</div>
        </div>
        <div class="mb-3">
            <label for="pages-field" class="form-label">Pages</label>
            <input type="text" id="pages-field" name="pages" class="form-control" placeholder="eg. 1-5, 8, 11-13">
            <div class="invalid-feedback">Invalid page range, use eg. 1-5, 8, 11-13</div>
        </div>
        <div class="form-check d-flex align-items-center">
            <input class="form-check-input me-2" type="checkbox" value="" id="scale-checkbox">
            <label class="form-check-label me-2" for="scale-checkbox">Scale pages that are different sizes</label>
            <a class="btn p-0" data-bs-toggle="collapse" href="#scale-checkbox-info" role="button" aria-expanded="false" aria-controls="scaleCheckboxInfo">
                <i class="fas fa-info-circle" width="24" height="24" aria-label="Info"></i>
            </a>
        </div>
        <div class="collapse" id="scale-checkbox-info">
            <div class="card card-body mt-2">
                cmoa may send pages that are a different size than the rest. If you select this option, those pages will be automatically resized. This may affect the image quality.
            </div>
        </div>
    </form>
</div>
<div id="sidebar-footer" class="footer d-flex align-content-center position-absolute bottom-0 start-0 p-3">
    <button type="submit" form="download-options-form" id="download-button" class="btn btn-primary">Download</button>
    <div class="progress ms-3 invisible" style="flex-grow: 1">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
</div>`;
    document.body.append(sidebar);
    setUpDownloadForm();
    addSidebarEventListeners();

    const sidebarCss =
    `#download-sidebar {
         user-select: text;
         -moz-user-select: text;
         -webkit-user-select: text;
         -ms-user-select: text;
     }
     #download-sidebar .offcanvas-header {
         border-bottom: 1px solid var(--bs-gray-300);
     }
     #download-sidebar h5 {
         margin-bottom: 0;
     }
     #sidebar-footer {
         border-top: 1px solid var(--bs-gray-300);
         width: 100%;
     }
     .offcanvas-body {
         margin-bottom: 71px;
     }`;
    GM_addStyle(sidebarCss);
}

window.addEventListener('load', () => {
    GM_addStyle(GM_getResourceText("bt"));
    addDownloadSidebar();
    addDownloadTab();
    const speedbinb = SpeedBinb.getInstance('content');
    speedbinb.addEventListener('onPageRendered', initializeSidebar);
});