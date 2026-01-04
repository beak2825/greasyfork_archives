// ==UserScript==
// @name         BottleNeko WS Deck Output
// @namespace    http://tampermonkey.net/
// @version      2.2.0
// @description  output deck from bottleneko
// @author       Chatgpt 4.0
// @match        https://bottleneko.app/deck/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469767/BottleNeko%20WS%20Deck%20Output.user.js
// @updateURL https://update.greasyfork.org/scripts/469767/BottleNeko%20WS%20Deck%20Output.meta.js
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

function generateCardURL(input) {
  // 分隔输入的字符串并提取需要的部分
  let cardID = input.split(' ')[1];

  // 转换为小写并替换 "/" 和 "-" 为 "_"
  let lowerCaseID = cardID.toLowerCase();
  lowerCaseID = lowerCaseID.replace(/[-/]/g, '_');

  // 提取变量a和变量b
  let a = lowerCaseID.charAt(0);
  
  // 判斷是否包含 "ws02"，然後相應地設定变量b 電擊文庫的path有特例
  let b;
  if (lowerCaseID.includes("ws02")) {
    b = a + '_' + lowerCaseID.split('_')[1];
  } else {
    b = lowerCaseID.split('_')[0] + '_' + lowerCaseID.split('_')[1];
  }

  // 提取变量c
  let c = lowerCaseID;

  // 生成并返回最终的URL
  return 'https://ws-tcg.com/wordpress/wp-content/images/cardlist/' + a + '/' + b + '/' + c + '.png';
}

async function ButtonClickAction(zEvent) {
    const deckList = [];
    let deckImages = [];

    var imgs = document.querySelectorAll('.deck-grid img');
    var quantities = document.querySelectorAll('.deck-grid .position-absolute');

    for (var i = 0; i < imgs.length; i++) {
        var imgAlt = imgs[i].alt; // 圖片名稱是儲存在 alt 屬性中的
        var quantity = quantities[i].innerText.trim(); // 數量是儲存在 textContent 中的，我們用 trim() 來去除多餘的空白
        deckList.push({
            imageUrl: generateCardURL(imgAlt),
            num: quantity
        });
    }
    console.log(deckList);

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

function addButtonWhenAvailable() {
    const viewBtnContainer = document.querySelector('.d-flex.align-items-center.flex-wrap.mr-5.mr-lg-0');

    if (viewBtnContainer) {
        const deckImageButton = document.createElement('button');
        deckImageButton.setAttribute('type', 'button');
        deckImageButton.setAttribute('class', 'btn btn-warning btn-sm');
        deckImageButton.textContent = 'Create Deck Image';
        viewBtnContainer.appendChild(deckImageButton);
        deckImageButton.addEventListener("click", ButtonClickAction, false);
    } else {
        setTimeout(addButtonWhenAvailable, 500);
    }
}

addButtonWhenAvailable();