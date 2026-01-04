// ==UserScript==
// @name         PacktPub Downloader
// @namespace    https://www.packtpub.com/
// @version      1.2
// @description  Mass downloader to get all ebooks from personal Packt Publishing Limited library automatically.
// @supportURL   https://github.com/itc-ger/packtpub-mass-downloader/issues
// @license      MIT
// @contributionURL https://flattr.com/@dmo84
// @author       Dirk Osburg
// @match        https://www.packtpub.com/account/my-ebooks*
// @grant        GM_download
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/36126/PacktPub%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/36126/PacktPub%20Downloader.meta.js
// ==/UserScript==


/*
todo:
- hint: setup settings
*/

(function() {
    'use strict';

    const ERROR_NONE            = 0x0;
    const ERROR_NOT_ENABLED     = 0x1;
    const ERROR_NOT_WHITELISTED = 0x2;
    const ERROR_NOT_PERMITTED   = 0x4;
    const ERROR_USER_ABORT      = 0x8;
    const ERROR_YIELD_ABORT     = 0xF;

    const TYPE_MASK_NONE = 0x0;
    const TYPE_MASK_PDF  = 0x1;
    const TYPE_MASK_MOBI = 0x2;
    const TYPE_MASK_EPUB = 0x4;
    const TYPE_MASK_CODE = 0x8;
    const TYPE_MASK_ALL = ~TYPE_MASK_NONE;

    var error = ERROR_NONE;
    var warning = ERROR_NONE;
    var typeFilter = {"pdf":TYPE_MASK_PDF ,"mobi": TYPE_MASK_MOBI, "epub": TYPE_MASK_EPUB, "code":TYPE_MASK_CODE};

    var bookContainer = document.getElementById("product-account-list").children;
    var bookIterator = null;

    var downloadRunning = false;
    console.group("Initializing PackPub downloader");
    console.info("found %c" + bookContainer.length + " books%c in personal library","color:#060;font-weight:bold","");

    injectDownloadLink();

    console.groupEnd();

    // ##############################################
    // ######## FUNCTIONS DEFINITION - BEGIN ########
    // ##############################################

    /* Insert Style-Element with CSS-Class into page */
    function injectCssClasses() {

        var style = document.createElement('style');

        style.type = 'text/css';
        style.innerHTML = '@-webkit-keyframes blinker-abort { from {opacity: 1.0;} to {opacity: 0.0;} } ' +
            '@-webkit-keyframes blinker-downloading { from {color: #060;} to {color: #0D0;} }' +
            '' +
            '.abortInfo { text-align: center; font-size: x-small !important;; font-style: italic; text-decoration: none; visibility: hidden; margin: 0px;  border-width-top:0px;} ' +
            '.dlLink { display:block; text-align: center; color:#FFF; background-color:#F00; font-size:x-large; margin: 0px; padding:0px 10px; border-style: solid; border-width:1px; border-width-bottom:0px; border-color:#F00; } ' +
            '.dlLink:visited { color:#FFF; } ' +
            '.dlLink:hover { color:#F00; background-color:#FFF; } ' +
            '.dl-run-border { border-color:#060 !important; } ' +
            '.dl-abort-border { border-color:#EFE012 !important; } ' +
            '.dl-run { background-color: #FFF !important; color: #060 !important; text-decoration: blink; -webkit-animation-name: blinker-downloading; -webkit-animation-duration: 1.0s; -webkit-animation-iteration-count:infinite;-webkit-animation-timing-function:ease-in-out; -webkit-animation-direction: alternate; } ' +
            '.dl-abort { background-color: #FFF !important; color: #EFE012 !important; text-decoration: blink; -webkit-animation-name: blinker-abort; -webkit-animation-duration: 0.5s; -webkit-animation-iteration-count:infinite;-webkit-animation-timing-function:ease-in-out; -webkit-animation-direction: alternate; } ' +
            '.fileTypeChooser { line-height: normal; float:right; font-size:small; border-style:solid; border-color:#F00; } ';
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    /* Insert download link next to "My ebooks" title and add event listener */
    function injectDownloadLink() {
        console.debug("injecting css classes");
        injectCssClasses();

        console.debug("injecting download link");
        var titleContainer = document.getElementById("account-right-content").firstElementChild;
        titleContainer.innerHTML += '<div id="downloadAllContainer" class="fileTypeChooser">' +
            '<div><a id="downloadAllLink" href="#" class="dlLink">[download all eBooks]</a></div>' +
            '<div id="downloadAllAbortInfo" class="dlLink abortInfo">click to abort</div>' +
            '<form id="dlFileTypes">' +
            '<input type="checkbox" id="dlFileType_pdf" name="fileTypeFilter" value="pdf" checked><label for="dlFileType_pdf">PDF</label> &nbsp;&nbsp; ' +
            '<input type="checkbox" id="dlFileType_epub" name="fileTypeFilter" value="epub" checked><label for="dlFileType_epub">ePub</label> &nbsp;&nbsp; ' +
            '<input type="checkbox" id="dlFileType_mobi" name="fileTypeFilter" value="mobi" checked><label for="dlFileType_mobi">mobi</label> &nbsp;&nbsp; ' +
            '<input type="checkbox" id="dlFileType_code" name="fileTypeFilter" value="code" checked><label for="dlFileType_code">code files</label>' +
            '</form>' +
            '</div>';

        console.debug("add download link click event listener");
        var downloadAllLink = document.getElementById("downloadAllLink");
        downloadAllLink.addEventListener ("click", dlClickHandler, false);
    }

    function evalFileFilter() {
        console.group("File type filter settings");

        typeFilter.pdf = (document.getElementById("dlFileType_pdf").checked) ? TYPE_MASK_PDF : TYPE_MASK_NONE;
        typeFilter.epub = (document.getElementById("dlFileType_epub").checked) ? TYPE_MASK_MOBI : TYPE_MASK_NONE;
        typeFilter.mobi = (document.getElementById("dlFileType_mobi").checked) ? TYPE_MASK_EPUB : TYPE_MASK_NONE;
        typeFilter.code = (document.getElementById("dlFileType_code").checked) ? TYPE_MASK_CODE : TYPE_MASK_NONE;

        console.info("typeFilter: %O", typeFilter);
        console.groupEnd();
    }

    function alterCssStyle(state) {
        var container = document.getElementById("downloadAllContainer");
        var link = document.getElementById("downloadAllLink");
        var linkInfo = document.getElementById("downloadAllAbortInfo");

        if (state == "run") {
            container.classList.add("dl-run-border");
            link.classList.add("dl-run-border","dl-run");
            link.innerText = "[downloading]";

            linkInfo.classList.add("dl-run-border","dl-run");
            linkInfo.style.visibility = 'visible';

        } else if (state == "abort") {
            container.classList.add("dl-abort-border");
            container.classList.remove("dl-run-border");

            link.classList.add("dl-abort-border","dl-abort");
            link.classList.remove("dl-run-border","dl-run");
            link.innerText = "[aborting download]";

            linkInfo.classList.add("dl-abort-border","dl-abort");
            linkInfo.classList.remove("dl-run-border","dl-run");
            linkInfo.style.visibility = 'hidden';

        } else if (state == "normal"){
            container.classList.remove("dl-run-border","dl-abort-border");

            link.classList.remove("dl-run-border","dl-run","dl-abort-border","dl-abort");
            link.innerText = "[download all eBooks]";

            linkInfo.style.visibility = 'hidden';
            linkInfo.classList.remove("dl-run-border","dl-run","dl-abort-border","dl-abort");

        }
    }

    function dlClickHandler() {
        if (downloadRunning) {
            abortDownloading();
        } else {
            startDownloading();
        }
    }

    /* Event listener action */
    function startDownloading() {
        console.group("Start downloading eBooks");

        console.debug("Init book iterator");
        bookIterator = iterateBooks(bookContainer);

        console.debug("Reset error log");
        error = ERROR_NONE; // reset errors

        if (confirm("Start downloading all books automatically?") === false) {
            error |= ERROR_USER_ABORT;

            console.warn("Abort downloading by user [confirmation dialog canceled]");
            console.groupEnd();
            return;
        }

        console.debug("Evaluate file type filters [user form]");
        evalFileFilter();

        console.debug("Alter style of control container");
        alterCssStyle("run");

        downloadRunning = true;

        console.debug("%cIterate books [startDownloading]","color:#999; font-style:italic");
        bookIterator.next();
    }

    function abortDownloading() {
        alterCssStyle("abort");
        error |= ERROR_USER_ABORT;
        console.warn("aborting download");
    }

    function endDownloading() {
        alterCssStyle("normal");
        downloadRunning = false;
        console.debug("downloading ended");
    }

    /* Download callback function to handle errors */
    function downloadErrorHandler(e) {

        var abort = true;
        switch(e.error) {
            case "not_enabled":
                error |= ERROR_NOT_ENABLED;
            case "not_permitted":
                error |= ERROR_NOT_PERMITTED;
                console.warn("download error: file downloading not enabled/permitted in %cTampermonkey's settings","color:#FFF; font-weight:bold; background-color:#F00");
                break;
            case "not_whitelisted":
                warning |= ERROR_NOT_WHITELISTED;
                abort = false;
                console.warn("download error: file extension not whitelistet in %cTampermonkey's settings","color:#FFF; font-weight:bold; background-color:#F00");
                break;
            default:
                console.warn("%cunknown download error: (" + e.error + ") " + e.details, "color:#F00");
        }

        console.debug("%cIterate books [downloadErrorHandler]","color:#999; font-style:italic");
        bookIterator.next(abort);
    }

    /* Download callback function to start next download if last one was finished */
    function downloadFinishHandler() {
        console.info("download %cfinished%c...","color:#FFF; background-color:#0A0","");
        console.debug("%cIterate books [downloadFinishHandler]","color:#999; font-style:italic");
        bookIterator.next();
    }

    /* wrapper for Tampermonkeys download function */
    function downloadBook(filename, href) {
        filename = filename.replace(/[<>:"\/\\|?*]+/g, '-');
        console.info("downloading: %c" + filename,"color:#FFF; background-color:#060; font-weight:bold");
        var retVal = GM_download({url:href, name:filename, saveAs:false, onload:downloadFinishHandler, onerror:downloadErrorHandler});
    }


    function getBook(elm, run) {
        var title = elm.title;
        var downloadLinkContainer;

        try {
            downloadLinkContainer = elm.lastElementChild.lastElementChild;
        } catch (e) {
            if (e instanceof TypeError) {
                console.debug("unexpected html element, skip element...");
                return null;
            } else {
                console.debug("unexpected error, skip element...");
                return null;
            }
        }

        if (title.length === 0 || downloadLinkContainer === null) {
            console.info("no book: " + elm);
            return null;
        }

        console.info("processing book %c %d %c '" + title + "'","color:#FFF; background-color:#666; font-weight:bold", ++run, "font-weight:bold");

        return downloadLinkContainer.children;
    }

    function* iterateDownloadLinks(bookHrefArray, title) {
        var i = 0;
        var abort = false;

        console.group("entering link iterator");
        while (error === ERROR_NONE && i < bookHrefArray.length) {

            var linkElement = bookHrefArray[i];
            var linkType = linkElement.firstElementChild.lastElementChild.innerText.toLowerCase();
            var linkHref = linkElement.href;

            if(linkType in typeFilter && typeFilter[linkType] !== TYPE_MASK_NONE){
                console.debug("typeFilter ("+linkType+"): " + typeFilter[linkType].toString(16));
                downloadBook(title + "." + linkType, linkHref);

                console.debug("%c[iterateDownloadLinks]yield","color:#AAA; font-style:italic");
                abort = yield i++;
            } else if (linkType == "code files" && typeFilter.code !== TYPE_MASK_NONE) {
                console.debug("typeFilter ("+linkType+"): " + typeFilter.code.toString(16));
                downloadBook(title + ".zip", linkHref);

                console.debug("%c[iterateDownloadLinks]yield","color:#AAA; font-style:italic");
                abort = yield i++;
            } else {
                console.debug("skipping fileType: " + linkType);
                i++;
            }

            console.debug("link iterator yield: " + i);

            if (abort === true) {
                error |= ERROR_YIELD_ABORT;
            }
        }
        console.groupEnd();

        console.debug("%c[iterateDownloadLinks]bookIterator->next","color:#AAA; font-style:italic");
    }

    function* iterateBooks(booksArray) {
        var i = 0;

        while (error === ERROR_NONE && i < booksArray.length) {
            console.group("entering book iterator");
            var bookLinks = getBook(bookContainer[i], i);
            var title = bookContainer[i].title;
            i++;

            if (bookLinks === null) {
                continue;
            }
            var abort = yield* iterateDownloadLinks(bookLinks, title);

            if (abort === true) {
                error |= ERROR_YIELD_ABORT;
            } /*else if (error === ERROR_NONE && confirm("download next book?") === false) {
                error |= ERROR_USER_ABORT;
                console.warn("Abort downloading by user [confirmation dialog canceled]");
            }*/

            console.groupEnd();
        }

        endDownloading();
        console.groupEnd();
    }

    // ##############################################
    // ######## FUNCTIONS DEFINITION - END   ########
    // ##############################################



})();
