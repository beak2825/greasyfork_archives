// ==UserScript==
// @name         Decklog WS Deck Output
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  try to take over the world!
// @author       Chatgpt 4.0
// @match        https://decklog.bushiroad.com/view/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/423058/Decklog%20WS%20Deck%20Output.user.js
// @updateURL https://update.greasyfork.org/scripts/423058/Decklog%20WS%20Deck%20Output.meta.js
// ==/UserScript==

async function downloadImage(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: function (response) {
                resolve(response.response);
            },
            onerror: function (err) {
                reject(err);
            }
        });
    });
}

async function loadImage(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}

async function processImage(image, num) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (image.width > image.height) {
        canvas.width = 1400;
        canvas.height = 1000;
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(image, 0, -1400, 1000, 1400);
    } else {
        canvas.width = 1000;
        canvas.height = 1400;
        ctx.drawImage(image, 0, 0, 1000, 1400);
    }

    const processedImages = [];
    for (let i = 0; i < num; i++) {
        processedImages.push(canvas.toDataURL());
    }

    return processedImages;
}

async function createDeckImage(images) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 10000;
    canvas.height = 7000;

    let xPos = 0;
    let yPos = 0;

    const imgPromises = images.map(async (image) => {
        return new Promise(async (resolve) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                ctx.drawImage(img, xPos, yPos, 1000, 1400);
                xPos += 1000;

                if (xPos >= 10000) {
                    xPos = 0;
                    yPos += 1400;
                }
                resolve();
            };
        });
    });

    await Promise.all(imgPromises);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
}

async function ButtonClickAction(zEvent) {
    const deckList = [];
    let deckImages = [];

    try {
        var list = document.querySelectorAll('.card-item.col-xl-2.col-lg-3.col-sm-4.col-6');
    } catch (e) {
        console.error(e.message);
    }

    for (let item of list) {
        const imageUrl = item.getElementsByTagName("img")[0].getAttribute("data-src");
        const num = parseInt(item.getElementsByClassName("num")[0].innerHTML);
        deckList.push({ imageUrl, num });
    }

    for (const item of deckList) {
        const imageBlob = await downloadImage(item.imageUrl);
        const image = await loadImage(imageBlob);
        const processedImages = await processImage(image, item.num);
        deckImages = deckImages.concat(processedImages);
    }

    const deckBlob = await createDeckImage(deckImages);
    const deckFileName = window.location.pathname.split('/').pop() + '.jpg';

    const a = document.createElement('a');
    a.href = URL.createObjectURL(deckBlob);
    a.download = deckFileName;
    a.click();
    URL.revokeObjectURL(a.href);
}

async function copyDeckToClipboard(zEvent) {
    const deckList = [];

    try {
        var list = document.querySelectorAll('.card-item.col-xl-2.col-lg-3.col-sm-4.col-6');
    } catch (e) {
        console.error(e.message);
    }

    for (let item of list) {
        const title = item.getElementsByTagName("img")[0].getAttribute("title");
        let cardId = title.split(' ')[0];
        const num = parseInt(item.getElementsByClassName("num")[0].innerHTML);

        // 替換特定結尾
        if (cardId.endsWith('SSP')) {
            cardId = cardId.replace('SSP', 's');
        } else if (cardId.endsWith('OFR')) {
            cardId = cardId.replace('OFR', 'f');
        } else if (cardId.endsWith('WIR')) {
            cardId = cardId.replace('WIR', 'i');
        } else if (cardId.endsWith('RRR')) {
            cardId = cardId.replace('RRR', 'r');
        } else if (cardId.endsWith('SR')) {
            cardId = cardId.replace('SR', 's');
        } else if (cardId.endsWith('SP')) {
            cardId = cardId.replace('SP', 'p');
        }

        for (let i = 0; i < num; i++) {
            deckList.push(cardId);
        }
    }

    const deckText = deckList.join('\n');
    GM_setClipboard(deckText);
    alert('Deck copied to clipboard!');
}


function addButtonWhenAvailable() {
    const viewBtnContainer = document.querySelector('.view-btn-container .btn-container');

    if (viewBtnContainer) {
        const deckImageButton = document.createElement('button');
        deckImageButton.setAttribute('type', 'button');
        deckImageButton.setAttribute('class', 'btn btn-warning btn-sm');
        deckImageButton.textContent = 'Create Deck Image';
        viewBtnContainer.appendChild(deckImageButton);
        deckImageButton.addEventListener("click", ButtonClickAction, false);

        const copyDeckButton = document.createElement('button');
        copyDeckButton.setAttribute('type', 'button');
        copyDeckButton.setAttribute('class', 'btn btn-warning btn-sm');
        copyDeckButton.textContent = 'Copy Deck to Clipboard';
        viewBtnContainer.appendChild(copyDeckButton);
        copyDeckButton.addEventListener("click", copyDeckToClipboard, false);
    } else {
        setTimeout(addButtonWhenAvailable, 500);
    }
}

addButtonWhenAvailable();
