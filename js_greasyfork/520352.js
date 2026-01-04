// ==UserScript==
// @name        theYNC.com Underground bypass
// @description Watch theYNC Underground videos without needing an account
// @namespace   Violentmonkey Scripts
// @match       *://*.theync.com/*
// @match       *://theync.com/*
// @match       *://*.theync.net/*
// @match       *://theync.net/*
// @match       *://*.theync.org/*
// @match       *://theync.org/*
// @match       *://archive.ph/*
// @match       *://archive.today/*
// @include     /https?:\/\/web\.archive\.org\/web\/\d+?\/https?:\/\/theync\.(?:com|org|net)/
// @require     https://update.greasyfork.org/scripts/523012/1519437/WaitForKeyElement.js
// @grant       GM.xmlHttpRequest
// @connect     media.theync.com
// @connect     archive.org
// @grant       GM_addStyle
// @grant       GM_log
// @grant       GM_addElement
// @version     10.7
// @supportURL  https://greasyfork.org/en/scripts/520352-theync-com-underground-bypass/feedback
// @license     MIT
// @author      https://greasyfork.org/en/users/1409235-paywalldespiser
// @downloadURL https://update.greasyfork.org/scripts/520352/theYNCcom%20Underground%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/520352/theYNCcom%20Underground%20bypass.meta.js
// ==/UserScript==

/**
 * Fetches available archives of a given address and retrieves their URLs.
 *
 * @param {string} address
 * @returns {Promise<string>}
 */
function queryArchive(address) {
    try {
        const url = new URL('https://archive.org/wayback/available');
        url.searchParams.append('url', address);

        return GM.xmlHttpRequest({
            method: 'GET',
            url,
            redirect: 'follow',
            responseType: 'json',
        })
            .then((result) => {
                if (result.status >= 300) {
                    console.error(result.status);
                    return Promise.reject(result);
                }

                return result;
            })
            .then((result) => result.response)
            .then((result) => {
                if (
                    result.archived_snapshots &&
                    result.archived_snapshots.closest
                ) {
                    return result.archived_snapshots.closest.url;
                }
                return Promise.reject();
            });
    } catch (e) {
        return Promise.reject();
    }
}

/**
 * Checks whether a URL is valid and accessible.
 *
 * @param {string?} address
 * @returns {Promise<string>}
 */
function isValidURL(address) {
    if (!address) {
        return Promise.reject(address);
    }
    try {
        const url = new URL(address);
        return GM.xmlHttpRequest({ url, method: 'HEAD' }).then((result) => {
            if (result.status === 404) {
                return Promise.reject(address);
            }
            return address;
        });
    } catch {
        return Promise.reject(address);
    }
}

/**
 * Tries to guess the video URL of a given theYNC video via the thumbnail URL.
 * Only works on videos published before around May 2023.
 *
 * @param {Element} element
 * @returns {string?}
 */
function getTheYNCVideoURL(element) {
    /**
     * @type {string | undefined | null}
     */
    const thumbnailURL = element.querySelector('.image > img')?.src;
    if (!thumbnailURL) {
        return null;
    }
    const group_url = thumbnailURL.match(
        /^https?:\/\/(?:media\.theync\.(?:com|org|net)|(?:www\.)?theync\.(?:com|org|net)\/media)\/thumbs\/(.+?)\.(?:flv|mpg|wmv|avi|3gp|qt|mp4|mov|m4v|f4v)/im
    )?.[1];
    if (!group_url) {
        return null;
    }
    return 'https://media.theync.com/videos/' + group_url + '.mp4';
}

/**
 * Retrieves the video URL from a theYNC video page
 *
 * @param {Element} [element=document]
 * @returns {string?}
 */
function retrieveVideoURL(element = document) {
    if (location.host === 'archive.ph' || location.host === 'archive.today') {
        const attribute = element
            .querySelector('[id="thisPlayer"] video[old-src]')
            ?.getAttribute('old-src');
        if (attribute) {
            return attribute;
        }
    }
    /**
     * @type {string | null | undefined}
     */
    const videoSrc = element.querySelector(
        '.stage-video > .inner-stage video[src]'
    )?.src;
    if (videoSrc) {
        return videoSrc;
    }
    const playerSetupScript = element.querySelector(
        '[id=thisPlayer] + script'
    )?.textContent;
    if (!playerSetupScript) {
        return null;
    }
    // TODO: Find a non-regex solution to this that doesn't involve eval#
    const videoURL = playerSetupScript.match(
        /(?<=file\:) *?"(?:https?:\/\/web.archive.org\/web\/\d+?\/)?(https?:\/\/(?:(?:www\.)?theync\.(?:com|org|net)\/media|media.theync\.(?:com|org|net))\/videos\/.+?\.(?:flv|mpg|wmv|avi|3gp|qt|mp4|mov|m4v|f4v))"/im
    )?.[1];
    if (!videoURL) {
        return null;
    }
    return decodeURIComponent(videoURL);
}

/**
 * Retrieves the video URL from an archived YNC URL
 *
 * @param {string} archiveURL
 * @returns {Promise<string>}
 */
function getVideoURLFromArchive(archiveURL) {
    return GM.xmlHttpRequest({ url: archiveURL, method: 'GET' })
        .then((result) => {
            if (result.status >= 300) {
                console.error(result.status);
                return Promise.reject(result);
            }
            return result;
        })

        .then((result) => {
            // Initialize the DOM parser
            const parser = new DOMParser();

            // Parse the text
            const doc = parser.parseFromString(
                result.responseText,
                'text/html'
            );

            // You can now even select part of that html as you would in the regular DOM
            // Example:
            // const docArticle = doc.querySelector('article').innerHTML
            const videoURL = retrieveVideoURL(doc);
            if (videoURL) {
                return videoURL;
            }
            return Promise.reject();
        });
}

/**
 * Calls many async functions in chunks and returns the accumulated results of all chunks in one flattened array.
 *
 * @async
 * @template T
 * @param {(() => Promise<T>)[]} asyncFunctions A list of functions that make an async call and should be called in chunks. I.e. `() => this.service.loadData()`
 * @param {number} chunkSize how many async functions are called at once
 * @returns {Promise<T[]>}
 */
async function callInChunks(asyncFunctions, chunkSize) {
    const numOfChunks = Math.ceil(asyncFunctions.length / chunkSize);
    const chunks = [...Array(numOfChunks)].map((_, i) =>
        asyncFunctions.slice(chunkSize * i, chunkSize * i + chunkSize)
    );

    const result = [];
    for (const chunk of chunks) {
        const chunkResult = await Promise.allSettled(
            chunk.map((chunkFn) => chunkFn())
        );
        result.push(...chunkResult);
    }
    return result.flat();
}

/**
 * setTimeout Promise Wrapper function
 *
 * @param {number} ms
 * @returns {Promise<void>}
 */
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(function () {
    'use strict';

    const allowedExtensions = [
        'flv',
        'mpg',
        'wmv',
        'avi',
        '3gp',
        'qt',
        'mp4',
        'mov',
        'm4v',
        'f4v',
    ];

    GM_addStyle(`
            .loader {
                border: 0.25em solid #f3f3f3;
                border-top: 0.25em solid rgba(0, 0, 0, 0);
                border-radius: 50%;
                width: 1em;
                height: 1em;
                animation: spin 2s linear infinite;
            }
            
            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
            
                100% {
                    transform: rotate(360deg);
                }
            }
            
            .border-gold {
                display: flex !important;
                align-items: center;
                justify-content: center;
                gap: 1em;
            }
            `);

    waitForKeyElement(
        '[id="content"],[id="related-videos"] .content-block'
    ).then((contentBlock) =>
        callInChunks(
            Array.from(
                contentBlock.querySelectorAll(
                    '.inner-block > a:has(.item-info > .border-gold)'
                )
            ).map((element) => () => {
                const undergroundLogo = element.querySelector(
                    '.item-info > .border-gold'
                );

                const loadingElement = GM_addElement('div');
                loadingElement.classList.add('loader');
                undergroundLogo.appendChild(loadingElement);
                return isValidURL(getTheYNCVideoURL(element))
                    .then((url) => ({
                        url: url,
                        text: 'BYPASSED',
                        color: 'green',
                    }))
                    .catch(() => {
                        /**
                         * @type {RegExpMatchArray}
                         */
                        const [, secondLevelDomain, path] =
                            element.href.match(
                                /(^https?:\/\/(?:www\.)?theync\.)(?:com|org|net)(\/.*$)/im
                            ) ?? [];
                        if (!secondLevelDomain) {
                            return Promise.reject(
                                'Error with the URL: ' + element.href
                            );
                        }
                        return ['com', 'org', 'net']
                            .reduce(
                                /**
                                 * @param {Promise<string>} accumulator
                                 * @param {string} currentTLD
                                 * @param {number} currentIndex
                                 * @param {string[]} array
                                 * @returns {Promise<string>}
                                 */
                                (
                                    accumulator,
                                    currentTLD,
                                    currentIndex,
                                    array
                                ) =>
                                    accumulator.catch(() => {
                                        const archiveQuery = queryArchive(
                                            secondLevelDomain +
                                                currentTLD +
                                                path
                                        );
                                        const archiveCooldown = wait(5000);

                                        return currentIndex < array.length - 1
                                            ? archiveQuery.catch((reason) =>
                                                  archiveCooldown.then(() =>
                                                      Promise.reject(reason)
                                                  )
                                              )
                                            : archiveQuery;
                                    }),
                                Promise.reject()
                            )

                            .then((archiveURL) =>
                                getVideoURLFromArchive(archiveURL).then(
                                    (videoURL) => ({
                                        url: videoURL,
                                        text: 'ARCHIVED',
                                        color: 'blue',
                                    }),
                                    () => ({
                                        url: archiveURL,
                                        text: 'MAYBE ARCHIVED',
                                        color: 'aqua',
                                    })
                                )
                            );
                    })
                    .catch(() => ({
                        url:
                            'https://archive.ph/' +
                            encodeURIComponent(element.href),
                        text: 'Try archive.today',
                        color: 'red',
                    }))

                    .then(({ url, text, color }) => {
                        undergroundLogo.textContent = text;
                        undergroundLogo.style.backgroundColor = color;
                        element.href = url;
                    })
                    .finally(() => loadingElement.remove());
            }),
            32
        )
    );
    waitForKeyElement('[id="stage"]:has([id="thisPlayer"])').then((stage) => {
        const videoURL = retrieveVideoURL();
        if (videoURL) {
            stage.innerHTML = '';
            stage.style.textAlign = 'center';

            const video = GM_addElement(stage, 'video', {
                controls: 'controls',
            });
            video.style.width = 'auto';
            video.style.height = '100%';
            const source = GM_addElement(video, 'source');
            source.src = videoURL;
            source.type = 'video/mp4';
        }
    });
})();