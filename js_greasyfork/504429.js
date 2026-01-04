// ==UserScript==
// @name        Rule34DLNamer (modified version of SankakuDLNamer)
// @namespace   Rule34DLNamer
// @description File naming for rule34
// @author      SlimeySlither, sanchan, Dramorian
// @match       http*://rule34.xxx/index.php?page=post*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @run-at      document-end
// @version     1.0
// @grant       GM_download
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/504429/Rule34DLNamer%20%28modified%20version%20of%20SankakuDLNamer%29.user.js
// @updateURL https://update.greasyfork.org/scripts/504429/Rule34DLNamer%20%28modified%20version%20of%20SankakuDLNamer%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const usePostId = false; // replaces hash with post ID if true
    const prefixPostId = false; // put post ID in front if true
    const maxEntries = 4;
    const showCopyFilenameButton = false; // workaround in case GM_download fails
    const debug = false;
    const tagDelimiter = ', ';

    function main() {
        const tags = getSidebarTags();
        if (debug) console.debug('tags', tags);

        const imageData = getImageData();
        if (debug) console.debug('imageData', imageData);

        const postId = getPostId();
        if (debug) console.debug('postId', postId);

        const downloadName = generateFilename(tags, imageData, postId);
        if (debug) console.debug('downloadName', downloadName);

        const details = getDLDetails(imageData, downloadName);
        if (debug) console.debug(details);

        if (showCopyFilenameButton) insertUnderDetails(createCopyFilenameButton(downloadName));
        insertUnderDetails(createDownloadButton(details));

    }

    function createDownloadButton(details) {
        const a = document.createElement('a');
        a.href = '#';
        a.innerText = 'Download';
        a.onclick = function() {
            console.log('downloading...');
            details.onload = () => {
                console.log('download complete');
            };
            details.ontimeout = () => {
                console.error('download timeout');
            };
            details.onerror = (error, errorDetails) => {
                console.error('download failed', error, errorDetails);
                alert('download failed with ' + error);
            };
            details.onprogress = () => {
                if (debug) console.debug('.');
            };
            GM_download(details);
            return false;
        };

        return a;
    }

    function createCopyFilenameButton(downloadName) {
        const a = document.createElement('a');
        a.href = '#';
        a.innerText = 'Copy Filename';
        a.onclick = function() {
            navigator.clipboard.writeText(downloadName);
            return false;
        };

        return a;
    }

    function insertUnderDetails(el) {
        const tagSearchDiv = document.querySelector('div.tag-search');
        if (!tagSearchDiv) throw new Error('couldn\'t find .tag-search div');

        const li = document.createElement('li');
        li.appendChild(el);

        tagSearchDiv.appendChild(li);
    }

    function tagSearchDiv(node, ref_node) {
        ref_node.parentNode.insertBefore(node, ref_node.nextSibling);
    }

    function getPostId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || ''; // Return an empty string if 'id' is not found
    }

    function cleanText(text) {
        // replace illegal filename characters https://stackoverflow.com/a/42210346
        return text.replaceAll(/[/\\?%*:|"<>]/g, '-');
    }

    function getSidebarTags() {
        const tagSidebar = document.getElementById('tag-sidebar');
        if (!tagSidebar) throw new Error('couldn\'t find tag-sidebar');

        const cats = {}; // category -> [tags]
        for (const tagItem of tagSidebar.getElementsByTagName('li')) {
            let tag;

            // find the second <a> tag within the <li> element
            const tagLinks = tagItem.getElementsByTagName('a');
            if (tagLinks.length > 1) {
                tag = cleanText(tagLinks[1].innerText); // get text from the second <a> tag
            }

            if (tag) {
                let cat = cleanText(tagItem.className);

                // insert tag in its category
                if (!(cat in cats)) {
                    cats[cat] = [tag];
                } else {
                    cats[cat].push(tag);
                }
            }
        }

        return cats;
    }

    function getImageData() {
        const imageLink = document.querySelector('a[href*="/images/"]');
        if (!imageLink) throw new Error('couldn\'t find image link');

        const url = new URL(imageLink.getAttribute('href'), document.baseURI);
        if (debug) console.log('image url', url);

        const filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
        if (debug) console.log('filename', filename);

        const j = filename.lastIndexOf('.');
        const hash = filename.substring(0, j);
        const extension = filename.substring(j); // including '.'

        return {
            url,
            hash,
            extension
        };
    }

    function sortAndShortenTagList(tags) {
        if (!tags) return;

        tags.sort();

        if (tags.length > maxEntries) {
            tags.splice(maxEntries);
            tags.push('...');
        }
    }

    function generateFilename(tags, imageData, postId) {
    let characters = tags['tag-type-character tag'];
    const copyrights = tags['tag-type-copyright tag'];
    const artists = tags['tag-type-artist tag'];

    if (characters) {
        // Remove round brackets from character tags
        for (let i = 0; i < characters.length; i++) {
            let j = characters[i].indexOf('(');
            if (j > 0) {
                if ([' ', '_'].includes(characters[i][j - 1])) j--;
                characters[i] = characters[i].substring(0, j);
            }
        }

        // Deduplicate
        characters = [...new Set(characters)];
    }

    sortAndShortenTagList(characters);
    sortAndShortenTagList(copyrights);
    sortAndShortenTagList(artists);

    const tokens = [];

    if (usePostId && prefixPostId) {
        tokens.push(postId);
        tokens.push('-');
    }

    if (characters) tokens.push(characters.join(tagDelimiter));
    if (copyrights) tokens.push('(' + copyrights.join(tagDelimiter) + ')');
    if (artists) {
        tokens.push('drawn by');
        tokens.push(artists.join(tagDelimiter));
    }

    if (!usePostId) {
        tokens.push('-'); // Add dash before the hash
        tokens.push(imageData.hash);
    } else if (!prefixPostId) {
        tokens.push('-'); // Add dash before the postId
        tokens.push(postId);
    }

    // Remove '-' if there's nothing after it
    if (tokens[tokens.length - 1] === '-') {
        tokens.splice(-1);
    }

    // Join tokens into a filename string, convert to lowercase, and append extension
    const filename = tokens.join(' ') + imageData.extension;

    return filename;
}

    function getDLDetails(imageData, downloadName) {
        return {
            url: imageData.url.href,
            name: downloadName,
            saveAs: true,
        };
    }

    if (document.readyState === 'complete' || document.readyState === 'loaded' || document.readyState === 'interactive') {
        main();
    } else {
        document.addEventListener('DOMContentLoaded', main, false);
    }

})();