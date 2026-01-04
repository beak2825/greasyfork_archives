// ==UserScript==
// @name         DOGGO
// @namespace    https://davidjb.online/
// @version      0.1.1
// @description  Replace all images on a page with dogs
// @author       David Bailey
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @downloadURL https://update.greasyfork.org/scripts/368124/DOGGO.user.js
// @updateURL https://update.greasyfork.org/scripts/368124/DOGGO.meta.js
// ==/UserScript==

async function getDataUrl(url) {
    const blob = await fetch(url).then(r => r.blob());
    return await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

async function loadImageUrls(otherUrls, count=0) {
    const urls = otherUrls || [];
    if (count === 0) {
        window.alert('Loading doggo images...');
    }

    if (urls.length < 50) {
        window.scrollTo(0, 1000 * count);

        const images = document.querySelectorAll('.Post-item-media img');
        for (const image of images) {
            if (urls.indexOf(image.src) === -1) {
                const url = await getDataUrl(image.src);
                if (!url.match(/^data:text/)) {
                    urls.push(url);
                }
            }
        }

        window.setTimeout(() => loadImageUrls(urls, count + 1), 2000);
    } else {
        GM.setValue('imageUrls', JSON.stringify(urls));
        window.alert('Doggo images loaded!');
    }
}

function createImageLoader() {
    const frame = document.createElement('iframe');
    const blocker = document.createElement('div');

    const refreshButton = document.querySelector('#doggo-refresh');
    refreshButton.onclick = async () => {
        if (await GM.getValue('imageUrls')) {
            refresh();
            refreshButton.onclick = refresh;
        } else {
            window.alert('Already loading images; please wait...');
        }
    };

    for (const el of [frame, blocker]) {
        el.width = 1000;
        el.height = 1000;
        el.style.position = 'absolute';
        el.style.top = '0';
        el.style.left = '0';
        el.style.opacity = '0';
    }

    frame.style.zIndex = '-9999';
    blocker.style.zIndex = '-9998';

    frame.src = 'https://imgur.com/t/dog';
    document.body.appendChild(frame);
}

async function getImageUrls() {
    const urls = await GM.getValue('imageUrls');
    if (!urls) {
        window.alert('Doggo images haven\'t loaded yet - if this is your first time using the extension, press the \'refresh\' button.');
        return false;
    }

    return JSON.parse(urls);
}

function resetUrls() {
    GM.deleteValue('imageUrls');
}

function randomArrayItem(array) {
    const index = Math.floor(Math.random()*array.length);
    return array[index];
}

async function doggify() {
    const urls = await getImageUrls();
    if (!urls) return;

    const images = document.querySelectorAll('img');
    for (const image of images) {
        [image.width, image.height] = [image.width, image.height]; // this sets the HTML attributes if not present
        image.srcset = '';
        image.src = randomArrayItem(urls);
    }
}

function refresh() {
    resetUrls();
    createImageLoader();
}

function createButtons() {
    const doggoButton = document.createElement('a');
    const refreshButton = document.createElement('a');

    for (const button of [doggoButton, refreshButton]) {
        button.href = 'javascript:';

        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';

        button.style.zIndex = '9999';
        button.style.display = 'block';
        button.style.width = '30px';
        button.style.height = '30px';

        button.style.textAlign = 'center';
        button.style.fontSize = '18px';
        button.style.lineHeight = '30px';
        button.style.textDecoration = 'none';

        button.style.borderRadius = '5px';
        button.style.backgroundColor = 'white';
        button.style.boxShadow = '0 0 10px rgba(0,0,0,0.25)';
    }

    doggoButton.onclick = doggify;
    doggoButton.textContent = '?';
    doggoButton.style.right = '50px';

    refreshButton.id = 'doggo-refresh';
    refreshButton.onclick = refresh;
    refreshButton.textContent = '?';
    refreshButton.style.right = '10px';

    document.body.appendChild(doggoButton);
    document.body.appendChild(refreshButton);
}

if (location.href === 'https://imgur.com/t/dog' && window.self !== window.top) {
    loadImageUrls();
} else {
    createButtons();
}