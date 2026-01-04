// ==UserScript==
// @name           Tiedostonimet takas
// @name:en        Filenames back
// @description    Lisää tiedostonimet takaisin laudalle
// @description:en Brings back filenames to the Finnish imageboard, ylilauta.org
// @version        2.1.0
// @match          *://ylilauta.org/*
// @grant          GM_addStyle
// @icon           https://static.ylilauta.org/img/seal_of_ylilauta-icon.svg
// @license        MIT
// @namespace https://greasyfork.org/users/1285509
// @downloadURL https://update.greasyfork.org/scripts/491981/Tiedostonimet%20takas.user.js
// @updateURL https://update.greasyfork.org/scripts/491981/Tiedostonimet%20takas.meta.js
// ==/UserScript==


(function () {
    'use strict';


    // --------------------
    // ASETUKSET | SETTINGS

    // true  = lisää tiedostonimen perään sen tyypin ja korvaa välilyönnit alaviivoilla
    // false = näyttää pelkän tiedostonimen
    const showFiletype = true;

    // Näyttää tiedostonimen perässä tiedostokoon kun tiedosto on laajennettuna
    const showFileSize = true;

    // Näyttää tiedostonimen perässä sen leveyden ja korkeuden kun tiedosto on laajennettuna
    const showFileDimensions = true;

    // Lisää etuliitteen tiedostonimeen
    const filePrefix = '';

    // Muuttaa tiedostonimen sijaintia
    // true  = tiedostonimi postauksen yläpalkissa timestampin vieressä
    // false = tiedostonimi tiedoston yläpuolella
    const placeInMeta = true;


    // Mahdollistaa tiedoston lataamisen sen alkuperäisellä nimellä
    // true  = alt-click tiedostonimen linkin kohdalla lataa tiedoston sen haetulla nimellä
    //         right-click -> save link as tallentaa tiedoston sen todellisella nimellä
    // false = alt-click ei lataa tiedostoa
    //         right-click -> save link as tallentaa tiedoston sen todellisella nimellä
    const altClickToDownload = true;

    // Viestin toiminnot -> 'Tallenna tiedosto' lataa tiedoston sen haetulla nimellä
    const overwriteSaveFile = true;

    // Korvaa avif tiedostopäätteet näytetyssä tiedostonimessä ja muuttaa ladatun
    // tiedoston kyseiseen formaattiin toiminnoissa altClickToDownload ja overwriteSaveFile.
    // Tiedoston lataaminen muilla kuin kyseisillä tavoilla käyttää yhä avif formaattia.
    // '' = tyyppiä ei korvata
    // 'png', 'jpg', 'webp', 'bmp' = tiedosto muutetaan kyseiseen muotoon
    const convertAvif = '';

    // Laatu häviöllistä pakkausta tukeville formaateille väliltä [0.0, 1.0]
    // '' = Käytetään selaimen oletusarvoa (yleensä 0.92 jpeg, 0.8 webp)
    // Toimii vain jos convertAvif = true ja joko altClickToDownload tai overwriteSaveFile
    const convertQuality = '';


    // Tallentaa haetut tiedostonimet selaimen sivustokohtaiseen sessionStorageen
    // true  = Nopeuttaa aiemmin haettujen tiedostonimien lisäystä esim. sivun
    //         uudelleenlatauksen jälkeen kunhan pysyt samalla välilehdellä.
    // false = tiedostonimiä ei tallenneta selaimeen
    //
    // sessionStorage tyhjenee joka tapauksessa kun välilehden sulkee
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
    const useSessionStorage = true;

    // Väliaikainen teksti tiedostoa ladatessa tai sen epäonnistuessa
    const titleLoading = "Ladataan tiedostonimeä...";
    const titleError = "Tiedostonimeä ei löytynyt";

    // Säätää maksimiyritysten määrää ja alkuperäistä viivästystä epäonnistuneen
    // tiedostonimen hakuyrityksen jälkeen. Viivästys kaksinkertaistuu jokaisen
    // epäonnistuneen yrityksen jälkeen. Tällä yritetään kiertää rate limittiä
    // (jokainen tiedostonimi on saatavilla vain omalla sivullaan).
    const retryInitialDelay = 2000; //ms
    const retryMaxAttempts = 5;

    // --------------------


    // Add custom styling
    GM_addStyle(`

.file-data {
    max-width: fit-content;
    display: grid;
    grid-auto-flow: column;
    grid-gap: 5px;
    align-items: center;

    a {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.post > .file-data {
    margin: 0 10px 5px;
}

.post-meta .file-data {
    flex: 1 40%;

    * {
        color: inherit;
    }
}

.file-data-unknown .file-data-link {
    font-style: italic;
}

.file-download-container {
    display: grid;
    font-size: 20px;
    color: inherit !important;
    transition: opacity 0.75s;

    * {
        display: grid;
        grid-column: 1;
        grid-row: 1;
        color: var(--button-hover-text-color) !important;
        pointer-events: none;
    }

    .file-download-background {
        border-radius: 3px;
    }

    .file-download-progress {
        color: var(--c-sec) !important;
        z-index: 1;
        height: 0;
    }

    .file-download-abort {
        font-size: 14px !important;
        padding: 3px;
        -webkit-text-stroke: 1px;
        z-index: 2;
        opacity: 0;
    }

    &.file-download-error .file-download-background {
        color: var(--ch-red) !important;
    }

    &:not(.file-download-error):hover {
        .file-download-background,
        .file-download-progress {
            opacity: 0.5;
        }

        .file-download-abort {
            opacity: 1;
        }
    }
}

    `);


    // Load previously fetched data if enabled and available
    const cachedFileData = (useSessionStorage ? JSON.parse(sessionStorage.getItem('file-data') ?? '{}') : {});
    if (Object.keys(cachedFileData).length > 0) {
        console.info('Loaded file data from sessionStorage for %i files', Object.keys(cachedFileData).length);
    }

    // Saves fetched data in sessionStorage to persist after page reload
    function saveFileDataToSessionStorage() {
        if (useSessionStorage) {
            const fileIds = Object.keys(cachedFileData);

            // Ignore dimensions, no need to save them
            const whitelist = ['title', 'fileType', 'fileSize'].concat(fileIds);
            sessionStorage.setItem('file-data', JSON.stringify(cachedFileData, whitelist));
        }
    }


    class HTTPError extends Error {
        constructor(url, statusCode) {
            super(`${statusCode} while requesting ${url}`);
            this.name = this.constructor.name;
            this.statusCode = statusCode;
            this.url = url;
        }
    }

    function convertAvifToType(imageSrc, toType) {
        return new Promise((resolve, reject) => {
            const supportedTypes = ['png', 'jpg', 'jpeg', 'webp', 'bmp'];
            if (!supportedTypes.includes(toType)) {
                return reject(new Error(
                    `convertAvif has an invalid filetype: ${toType}. Has to be one of ${supportedTypes.join(', ')}`
                ));
            }

            const img = new Image();
            img.onload = convert;
            img.onerror = () => reject(new Error(`Loading image ${img.src}`));
            img.src = imageSrc;

            function convert() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.drawImage(img, 0, 0);

                // Convert fileType to the correct media type
                let imageFormat = 'image/';
                switch (toType) {
                    case 'jpg':
                        imageFormat += 'jpeg';
                        break;
                    default:
                        imageFormat += toType;
                }

                // Get quality for lossy compression
                let quality = parseFloat(convertQuality.toString().replace(',', '.'));
                if (quality < 0 || quality > 1) {
                    return reject(new Error(`Invalid convertQuality: ${quality}. Must be in the range 0-1`));
                }

                canvas.toBlob(resolve, imageFormat, quality);
                canvas.remove();
            }
        });
    }

    let saveAsRequest;
    async function saveAs(fileId, fileData, onprogress = () => { }) {
        const fileType = (convertAvif ? fileData.fileType.replace('avif', convertAvif) : fileData.fileType);
        const filename = `${fileData.title}.${fileType}`;

        const downloadUrl = `https://ylilauta.org/file/download/${fileId}`;

        try {
            const fileBlob = await new Promise((resolve, reject) => {
                if (fileType !== fileData.fileType) {
                    // Convert the image's file format
                    resolve(convertAvifToType(downloadUrl, fileType));
                } else {
                    const req = new XMLHttpRequest();
                    req.responseType = 'blob';

                    req.onprogress = (e) => onprogress(e.loaded / e.total);
                    req.onerror = () => reject(new Error(`requesting ${downloadUrl}`));
                    req.onabort = () => resolve();
                    req.onload = () => {
                        if (req.status >= 200 && req.status < 300) resolve(req.response);
                        else reject(new HTTPError(downloadUrl, req.status));
                    };

                    req.open('GET', downloadUrl);
                    req.send();
                    saveAsRequest = req;
                }
            });

            // Check if the request was aborted
            if (saveAsRequest?.readyState === XMLHttpRequest.UNSENT) return;

            // Download the blob with the original filename
            const objectUrl = window.URL.createObjectURL(fileBlob);
            const dummyLink = document.createElement('a');
            dummyLink.href = objectUrl;
            dummyLink.download = filename;
            dummyLink.click();

            window.URL.revokeObjectURL(objectUrl);
            dummyLink.remove();
            onprogress(1);
        } finally {
            saveAsRequest = undefined;
        }
    }


    async function fetchFileData(fileId) {
        const data = cachedFileData[fileId] = (cachedFileData[fileId] ?? {});
        if (data.title !== undefined) return data;

        const fileSrc = `https://ylilauta.org/file/download/${fileId}`;
        const response = await fetch(fileSrc, { method: 'HEAD' });
        if (!response.ok) throw new HTTPError(fileSrc, response.status);

        const contentDisposition = response.headers.get('Content-Disposition');
        const filename = contentDisposition.match(/filename=\"([^"]*)\"/)[1];
        const [title, fileType] = filename.split('.');
        const fileSize = +response.headers.get('Content-Length');

        [data.title, data.fileType, data.fileSize] = [title, fileType, fileSize];
        return data;
    }

    // Fetches a file's data with retries in case of failure due to rate limiting
    async function fetchFileDataWithRetry(fileId, maxAttempts = retryMaxAttempts, delay = retryInitialDelay) {
        try {
            const data = await fetchFileData(fileId);
            return data;
        } catch (error) {
            if (error instanceof HTTPError && error.statusCode >= 500) {
                if (maxAttempts === 0) {
                    throw new Error(`Max attempts to fetch file data reached. Last attempt resulted in ${error}`);
                }

                console.log(`Attempt to fetch file data failed with ${error}. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return fetchFileDataWithRetry(fileId, maxAttempts - 1, delay * 2);
            } else {
                throw error;
            }
        }
    }


    // https://stackoverflow.com/a/18650828
    function formatBytes(bytes) {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toPrecision(3)).toLocaleString()} ${sizes[i]}`;
    }

    // Displays cachedFileData for the given post
    // Returns true if successful
    function displayFileData(post) {
        // Check that the post has a file, and we have at least the filename
        const file = post?.querySelector(`.file[data-file-id]`);
        const data = cachedFileData[file?.dataset.fileId];
        if (data?.title === undefined) return false;

        // Load the previously created elements
        const fileDataElement = post.querySelector('.file-data');
        const fileLinkElement = fileDataElement.querySelector('.file-data-link');
        const fileExtraElement = fileDataElement.querySelector('.file-data-extra');
        fileExtraElement.textContent = '';

        // Add filename
        const fileType = convertAvif ? data.fileType.replace('avif', convertAvif) : data.fileType;
        const fullTitle = `${filePrefix}${data.title.replace(/\s/g, '_')}.${fileType}`;
        fileLinkElement.textContent = fileLinkElement.title = (showFiletype ? fullTitle : data.title);

        // Remove the placeholder class
        fileDataElement.classList.remove('file-data-unknown');

        // Add filesize and dimensions if enabled. These are only shown when file is expanded, to
        // hide the fact that dimensions are only loaded after a file has been expanded at least once.
        if (!file.classList.contains('preview')) {
            const extraData = [];
            if (showFileSize && data.fileSize) extraData.push(`${formatBytes(data.fileSize)}`);
            if (showFileDimensions && data.dimensions) extraData.push(`${data.dimensions[0]}×${data.dimensions[1]}`);
            if (extraData.length) {
                fileExtraElement.textContent = ` (${extraData.join(', ')})`;
            }
        }
        return true;
    }

    // An array of { post, fileId } to request data for
    // Elements from the end of the queue are processed first
    const queue = [];

    // Processes data requests in queue one at a time
    // Should only be called if queue is not empty
    let queueRunning = false;
    async function processQueue() {
        if (queueRunning) return;
        if (queue.length === 0) {
            // Queue cleared!
            saveFileDataToSessionStorage();
            return;
        }
        queueRunning = true;

        const { post, fileId } = queue.pop();
        const postId = post.dataset.postId;

        try {
            await fetchFileDataWithRetry(fileId);
            displayFileData(post);
        } catch (error) {
            console.error(`Error fetching or displaying data for file ${fileId} in post ${postId}: ${error}`);

            // Show the error in the link's title
            const link = post.querySelector('.file-data .file-data-link');
            if (link) {
                link.textContent = titleError;
                link.title = error;
            }
        } finally {
            queueRunning = false;
            processQueue();
        }
    }

    // Moves the post to top of queue, if it is currently in queue
    function prioritizePost(post) {
        const postIndex = queue.findIndex((item) => item.post === post);
        if (postIndex < 0) return;

        queue.push(queue.splice(postIndex, 1)[0]);
        console.log('Pushed post to the top of the queue, should be processed next:\n', post);
    }


    // Adds a timeout to other promises when used with Promise.race
    function promiseTimeout(duration = 5000) {
        return new Promise((_, reject) => {
            setTimeout(() => reject(new Error(`Timed out after ${duration}ms`)), duration);
        });
    }

    // Promise wrapper for MutationObserver with timeout
    function promiseObserve(element, options, check) {
        let observer;
        return Promise.race([
            new Promise((resolve) => {
                observer = new MutationObserver(mutations => {
                    for (const mutation of mutations) {
                        check(mutation, resolve);
                    }
                });
                observer.observe(element, options);
            }),
            promiseTimeout()
        ])
            .finally(() => observer.disconnect());
    }

    // Detects and calls processPosts on posts added when clicking the Expand replies button
    async function onExpandRepliesClick(e) {
        const post = e.currentTarget.closest('.post');
        if (post.dataset.replyExpandLoading === 'true') return;

        try {
            const posts = await promiseObserve(post, { childList: true }, (mutation, resolve) => {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.classList.contains('replies')) {
                        resolve([...addedNode.querySelectorAll('.post[data-post-id]')]);
                    }
                }
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode.classList.contains('replies')) {
                        resolve([]);
                    }
                }
            });
            processPosts(posts);
        } catch (error) {
            console.error('Failed to detect any changes after expandReplies was clicked:', error);
        }
    }

    // Gets the dimensions of an image or video after it is loaded
    async function loadFileDimensions(media, fileId) {
        if (cachedFileData[fileId]?.dimensions) return cachedFileData[fileId].dimensions;

        function tryLoadDimensions(el) {
            return ((el.videoWidth || el.videoHeight) && [el.videoWidth, el.videoHeight])
                || ((el.naturalWidth || el.naturalHeight) && [el.naturalWidth, el.naturalHeight]);
        }

        try {
            if (!fileId) throw new Error('fileId missing on file');
            const data = cachedFileData[fileId] = (cachedFileData[fileId] ?? {});

            await Promise.race([
                tryLoadDimensions(media) ? data : new Promise((resolve, reject) => {
                    media.addEventListener(media.tagName === 'VIDEO' ? 'loadedmetadata' : 'load', () => resolve(data));
                    media.addEventListener('error', () => reject(new Error(`Loading image or video ${media.src}`)));
                }),
                promiseTimeout()
            ]);

            return data.dimensions = (tryLoadDimensions(media) || data.dimensions);
        } catch (error) {
            console.error(`Loading file ${fileId} dimensions failed:`, error);
        }
    }

    // Detect expanding file
    async function onFileClick(e) {
        if (e.ctrlKey || e.metaKey) return;

        const file = e.currentTarget;
        const post = file.closest('.post');

        // Prioritize loading data for the file if waiting in queue
        prioritizePost(post);

        try {
            const opt = file.classList.contains('preview')
                ? { childList: true, subtree: true }
                : { attributeFilter: ['class'] };

            const media = await promiseObserve(file, opt, (mutation, resolve) => {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.matches('.full-img, video')) {
                            resolve(addedNode);
                        }
                    }
                } else if (file.classList.contains('preview')) {
                    resolve();
                }
            });
            if (media) await loadFileDimensions(media, file.dataset.fileId);
        } catch (error) {
            console.error('Failed to detect changes to class .preview on file after it was clicked:', error);
        } finally {
            displayFileData(post);
        }
    }

    // Save a file with its original filename. Fetches the file's title if it isn't in cache
    let downloadActive = false;
    async function saveFileWithOriginalName(post, fileId) {
        if (downloadActive) {
            console.log('Already downloading a file, skipping download for file', fileId);
            return;
        }
        downloadActive = true;

        // Add a progress indicator
        const downloadContainerElement = document.createElement('a');
        downloadContainerElement.className = 'file-download-container';
        const downloadBackgroundElement = document.createElement('a');
        downloadBackgroundElement.className = 'icon-download2 file-download-background';
        const downloadProgressElement = document.createElement('a');
        downloadProgressElement.className = 'icon-download2 file-download-progress';
        const downloadCancelElement = document.createElement('a');
        downloadCancelElement.className = 'icon-cross file-download-abort';

        // Allow aborting the download by clicking the indicator
        downloadContainerElement.addEventListener('click', () => saveAsRequest?.abort());

        downloadContainerElement.append(downloadBackgroundElement, downloadProgressElement, downloadCancelElement);
        post.querySelector('.file-data').append(downloadContainerElement);

        try {
            // Load or fetch the file's data
            const data = cachedFileData[fileId]?.title
                ? cachedFileData[fileId]
                : await fetchFileDataWithRetry(fileId);

            // Display data if it wasn't in cache
            displayFileData(post);

            let progressHeight = 0;
            await saveAs(fileId, data, (progress) => {
                const pPercentage = Math.floor(progress * 100) + '%';

                // Animate the indicator
                downloadBackgroundElement.style.background
                    = `linear-gradient(var(--button-hover-bg-color) ${pPercentage}, transparent ${pPercentage})`;

                if (progressHeight >= 100) progressHeight = 0;
                else progressHeight += 5;
                downloadProgressElement.style.height = progressHeight + '%';
            });

            // Disable cancel animation on hover
            downloadContainerElement.style.pointerEvents = 'none';
        } catch (error) {
            console.error('Error saving file:', error);

            // Show the error in the indicator's title
            downloadContainerElement.title = error;
            downloadContainerElement.classList.add('file-download-error');
        } finally {
            downloadActive = false;
            downloadProgressElement.style.height = 0;

            // Fade out the indicator
            setTimeout(() => downloadContainerElement.style.opacity = 0, 4000);
            setTimeout(() => downloadContainerElement.remove(), 4750);
        }
    }

    // Detect alt-clicking a file link
    function onFileLinkClick(e) {
        const fileLink = e.currentTarget;
        const post = fileLink.closest('.post');

        if (!e.altKey) {
            // Opening the file page, pause video unless opening in a background tab
            if (!e.ctrlKey) post.querySelector('.file video')?.pause();
            return;
        }

        saveFileWithOriginalName(post, fileLink.dataset.fileId);
        e.preventDefault();
    }

    // Detect opening the post menu to overwrite 'Save file' button's behaviour
    async function onPostMenuButtonClick(e) {
        const postMenuButton = e.currentTarget;
        if (postMenuButton.classList.contains('active')) return;

        try {
            const dropdown = await promiseObserve(document.body, { childList: true }, (mutation, resolve) => {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.classList.contains('dropdown')) resolve(addedNode);
                }
            });
            const downloadLink = await promiseObserve(dropdown, { childList: true }, (_, resolve) => {
                const downloadLink = dropdown.querySelector('a[download][href]');
                if (downloadLink) resolve(downloadLink);
            });

            const post = postMenuButton.closest('.post');
            const fileLink = post.querySelector('.file-data-link');
            const fileId = fileLink.dataset.fileId;

            // Overwrite the behaviour
            downloadLink.removeAttribute('href');
            downloadLink.addEventListener('click', () => saveFileWithOriginalName(post, fileId));
        } catch (error) {
            console.error('Failed to detect Save file button in post menu after it was opened:', error);
        }
    }

    // Main function to add posts with files to queue for requesting data,
    // and observing elements when necessary to react to the following actions:
    //  - The 'Expand replies' button is clicked -> Load data for the replies added under the post
    //  - A file is expanded -> Prioritize loading data for the file
    //                       -> The file's dimensions can be checked and added to data
    //                       -> Update the file-data elements by calling displayFileData
    // - altClickToDownload: File link is clicked -> Download if holding alt
    // - overwriteSaveFile: Post menu is clicked -> Overwrite behaviour for the save file button
    function processPosts(posts) {
        for (const post of posts.reverse()) {
            try {
                const repliesButton = post.querySelector('button[data-action="Post.expandReplies"]');
                repliesButton?.addEventListener('click', onExpandRepliesClick);

                // No further actions needed for posts without a valid file
                const file = post.querySelector('.file[data-file-id][data-file-src]');
                if (!file) continue;
                file.addEventListener('click', onFileClick);

                // Add elements to the post for holding the file's data
                const fileId = file.dataset.fileId;
                const fileSrc = file.dataset.fileSrc;

                const fileDataElement = document.createElement('span');
                fileDataElement.className = 'file-data file-data-unknown';

                if (!placeInMeta) file.before(fileDataElement);
                else post.querySelector('.post-meta .time').after('•', fileDataElement);

                const fileLinkElement = document.createElement('a');
                fileLinkElement.className = 'file-data-link';
                fileLinkElement.target = '_blank';
                fileLinkElement.href = fileSrc;
                fileLinkElement.textContent = titleLoading;
                fileLinkElement.dataset.fileId = fileId;
                if (altClickToDownload) fileLinkElement.addEventListener('click', onFileLinkClick);

                if (overwriteSaveFile) {
                    const menuButton = post.querySelector('button[data-action="Post.menu"');
                    menuButton?.addEventListener('click', onPostMenuButtonClick);
                }

                const fileExtraElement = document.createElement('span');
                fileExtraElement.className = 'file-data-extra';

                fileDataElement.append(fileLinkElement, fileExtraElement);

                // Test if the file already has data in our cache to avoid being stuck in queue
                if (displayFileData(post)) continue;

                // This is a new file, add to queue for fetching the data
                queue.push({ post, fileId });
            } catch (error) {
                console.error(`Error processing post ${post.dataset.postId}:`, error);
            }
        }

        // If a new file was encountered, start processing the queue
        if (!queueRunning && queue.length > 0) processQueue();
    }


    {
        // Apply to posts on initial page load
        let posts = [...document.querySelectorAll('.post[data-post-id]')];

        // Process posts from current position first
        const anchorId = window.location.hash.substring(1);
        const anchorIndex = posts.indexOf(anchorId && document.getElementById(anchorId));
        // Move posts from anchorIndex onward to the beginning of the array
        posts = (anchorIndex > 0) ? posts.splice(anchorIndex).concat(posts) : posts;
        processPosts(posts);

        // Apply to new posts after initial page load
        window.addEventListener('new-posts-loaded', (e) => {
            for (const threadId in e.detail) {
                const thread = document.querySelector(`.thread[data-thread-id="${threadId}"]`);
                if (!thread) continue;

                // Filter to posts with a valid postId. This prevents loading
                // filenames on the frontpage with display types other than 'New replies'.
                const validPosts = e.detail[threadId].filter(post => post.hasAttribute('data-post-id'));
                processPosts(validPosts);
            }
        });
    }
})();

