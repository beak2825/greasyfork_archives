// ==UserScript==
// @name           Thingiverse Image Download Link 2
// @description    Adds a download button below Thingiverse images
// @description:de Fügt einen Download Button unter Thingiverse Bilder hinzu
// @author         Tobse
// @license        MIT
// @name:de        Thingiverse Bilder Download Link
// @name:en        Thingiverse Image Download Link
// @match          https://www.thingiverse.com/thing*
// @run-at         document-idle
// @version        0.1.3.20221001100000
// @namespace      https://github.com/TobseF
// @downloadURL https://update.greasyfork.org/scripts/452293/Thingiverse%20Image%20Download%20Link%202.user.js
// @updateURL https://update.greasyfork.org/scripts/452293/Thingiverse%20Image%20Download%20Link%202.meta.js
// ==/UserScript==

let authorization = 'Bearer 56edfc79ecf25922b98202dd79a291aa'

function getThingId() {
    let thingURl = document.head.querySelector("[property='og:url']").content;
    return thingURl.substring(thingURl.lastIndexOf(':') + 1);
}

const imageRequest = new Request('https://api.thingiverse.com/things/' + getThingId() + '/images/0');

function isLarge(image) {
    return image.type === 'display' && image.size === 'large';
}

function fetchImages(url) {
    const headers = new Headers();
    headers.append('Accept', '*/*');
    headers.append('authorization', authorization);

    let fetchOptions = {
        method: 'GET',
        headers: headers,
        cache: 'default',
    };

    fetch(url, fetchOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            return data.flatMap(imageInfo => imageInfo.sizes).filter(isLarge).map(image => image.url)
        }).then((images) => {
        images.forEach(addDownloadLink)
    });
}

let imageCount = 0

function addDownloadLink(url) {
    let a = document.createElement('a');
    let link = document.createTextNode("Download " + imageCount++);
    a.appendChild(link);
    a.href = url;
    a.setAttribute('target', '_blank');
    a.setAttribute('style', 'padding-right: 10px;');
    let destination = document.evaluate("//*[@class=\"thumbs-wrapper axis-vertical\"]", document, null, XPathResult.ANY_TYPE, null).iterateNext()
    destination.appendChild(a)
}

(new MutationObserver(waitForGallery)).observe(document, {childList: true, subtree: true});

function waitForGallery(changes, observer) {
    // Wait until image gallery is visible
    if (document.querySelector('.slide, .selected')) {
        observer.disconnect();
        fetchImages(imageRequest);
    }
}