// ==UserScript==
// @name Kemono.party Image Full Size Autoloader
// @name:zh-TW Kemono.party自動載入完整圖片
// @description Auto load full size image in kemono.party
// @description:zh-tw 在kemono.su的Post自動載入完整大小的圖片
// @match https://kemono.su/*/user/*/post/*
// @match https://kemono.su/*/user/*/post/*
// @version 2.0.0
// @namespace andyching168.scripts
// @author andyching168
// @license MIT License
// @run-at document-idle
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/448580/Kemonoparty%20Image%20Full%20Size%20Autoloader.user.js
// @updateURL https://update.greasyfork.org/scripts/448580/Kemonoparty%20Image%20Full%20Size%20Autoloader.meta.js
// ==/UserScript==

let loadingCount = 0;
const MAX_CONCURRENT_LOADS = 3;

function loadImage(thumbImg, progressText) {
if (loadingCount >= MAX_CONCURRENT_LOADS) {
setTimeout(() => loadImage(thumbImg, progressText), 1000);
return;
}

loadingCount++;

const fullSizeImg = new Image();
fullSizeImg.style.display = "none";
thumbImg.parentNode.insertBefore(fullSizeImg, thumbImg.nextSibling);

const xhr = new XMLHttpRequest();
xhr.open('GET', thumbImg.parentNode.href, true);
xhr.responseType = 'arraybuffer';

xhr.onprogress = function(event) {
if (event.lengthComputable) {
const percentComplete = (event.loaded / event.total) * 100;
console.log(`Image loading: ${percentComplete}% complete`);
progressText.textContent = `Loading: ${percentComplete.toFixed(2)}% complete`;
}
};

xhr.onload = function() {
if (this.status === 200) {
const blob = new Blob([this.response], { type: 'image/jpeg' });
fullSizeImg.src = URL.createObjectURL(blob);
}
loadingCount--;
};

xhr.send();

fullSizeImg.onload = function() {
console.log("Image loaded");
this.loaded = true;
};

fullSizeImg.onerror = function() {
thumbImg.style.opacity = "1";
this.remove();
loadingCount--;
};

thumbImg.style.opacity = "1";

function checkImageLoaded() {
if (fullSizeImg.loaded) {
thumbImg.src = fullSizeImg.src;
thumbImg.style.transition = "opacity 1s";
thumbImg.style.opacity = "1";
fullSizeImg.remove();
progressText.remove();
} else {
setTimeout(checkImageLoaded, 500);
}
}

checkImageLoaded();
}

function createLoadButton(img) {
const container = document.createElement("div");
container.style.textAlign = "center";

const progressText = document.createElement("p");
progressText.textContent = "載入中...";
progressText.style.display = "block";
progressText.style.margin = "5px auto";

container.appendChild(progressText);

loadImage(img, progressText);

return container;
}

function addLoadButtons() {
const images = document.querySelectorAll("#page > div > div.post__files > div > figure > a > img");
images.forEach((img) => {
img.parentNode.parentNode.insertBefore(createLoadButton(img), img.parentNode);
});
}

addLoadButtons();