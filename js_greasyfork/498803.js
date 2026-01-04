// ==UserScript==
// @name         Piped Video Previews
// @name:ru      Piped Video Previews
// @namespace    VideoPreviews
// @version      1.1
// @description  Displays an animated video preview when hovering over its thumbnail on Piped websites
// @description:ru  Показывает анимированное превью видео при наведении курсора на его миниатюру на сайтах Piped
// @author       SearchDL
// @match        *://piped.video/*
// @match        *://*.piped.video/*
// @match        *://piped.kavin.rocks/*
// @match        *://piped.yt/*
// @icon         https://piped.video/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498803/Piped%20Video%20Previews.user.js
// @updateURL https://update.greasyfork.org/scripts/498803/Piped%20Video%20Previews.meta.js
// ==/UserScript==

// Settings
var ThumbChangingSpeedMs = 250; // Time in milliseconds before frame change during preview | Время в мс до смены кадра во время предпросмотра
var DelayForListViewMs = 0; // Delay before requesting preview frames when hovering over a thumbnail for videos displayed in 1 column (related videos) | Задержка до запроса эскизов при наведении на миниатюру для видео, отображающихся в 1 ряд (похожие видео)
var DelayForGridViewMs = 300; // Delay before requesting preview frames for grid-displayed videos (channel and playlist videos, watch history, search results) | Задержка до запроса эскизов для видео, отображающихся сеткой (видео канала и плейлиста, история просмотра, результаты поиска)
var FallbackApiUrl = "https://pipedapi.kavin.rocks" // Piped instance API URL used when it is impossible to get the current API URL from the page: in watch history, in search results and in trends | API-адрес зеркала Piped, используемый в случае, когда нельзя получить текущий API-адрес со страницы: в истории просмотра, в поиске и в трендах
// List of instances API URLs: https://github.com/TeamPiped/Piped/wiki/Instances





var prevbox;
var canvas;
var hovered = false;
var timeout;
var finished = false;
var apiurl = FallbackApiUrl;

function getApiUrl(t) {
    var rss = t.querySelector('i.i-fa6-solid\\:rss');
    if (rss) {
        var url = new URL(rss.parentNode.href);
        apiurl = url.protocol + "//" + url.host;
    }
}

function updatePreviewBoxes(t) {
    var boxes = t.querySelectorAll(".aspect-video.w-full.object-contain");
    boxes.forEach(
        function(cbox) {
            cbox.addEventListener("mouseover", thumbnailIn, false);
            cbox.addEventListener("mouseout", thumbnailOut, false);
        }
    );
}

(function() {
    'use strict';

    getApiUrl(document);
    updatePreviewBoxes(document);
})();

var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation){
        getApiUrl(mutation.target);
        updatePreviewBoxes(mutation.target);
    });
});
observer.observe(document.body, {childList:true,subtree:true});


function thumbnailIn() {
    if (finished) {
        finished = false;
        return;
    }

    if (hovered && prevbox) {
        restore(prevbox);
    }
    var url = this.parentNode.parentNode.attributes.href.value;
    prevbox = this;
    hovered = true;
    if (!url.includes("watch?v=")) return;

    if (window.location.href.includes("watch?v=") && !url.includes("list=")) timeout = setTimeout(() => processThumbnails(this), DelayForListViewMs);
    else timeout = setTimeout(() => processThumbnails(this), DelayForGridViewMs);
}

function processThumbnails(box) {
    var url = box.parentNode.parentNode.attributes.href.value;
    box.style.opacity = '0.5';
    box.style.transition = 'opacity 0.5s ease-in-out';

    fetchData(apiurl + "/streams/" + url.substring(url.indexOf("=") + 1)).then(data => {
        if (prevbox.src !== box.src) {
            return;
        }

        if (hovered) {
            if (!data || data.previewFrames.length < 1) {
                box.style.border = '2px solid';
                box.style.borderColor = 'red';
                return;
            }

            var maxn = 0;
            var maxh = 0;
            for (let i = 0; i < data.previewFrames.length; i++) {
                if (data.previewFrames[i].frameHeight > maxh) {
                    maxn = i;
                    maxh = data.previewFrames[i].frameHeight;
                }
            }
            var frames = data.previewFrames[maxn];
            var img, next;
            canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = parseInt(box.width);
            canvas.height = parseInt(box.height);

            function changeImage(i, y, x) {
                if (!hovered) return;

                var X = frames.framesPerPageX;
                var Y = frames.framesPerPageY;
                if (i * X*Y + y * X + x >= frames.totalCount - 1) {
                    finished = true;
                    canvas.replaceWith(box); // эта замена вызывает события выхода и захода курсора в область превью
                    return;
                }

                if (i < 0 || (y == Y-1 && x == X-1)) {
                    i++;
                    x = 0;
                    y = 0;
                    img = new Image();
                    next = new Image();
                    img.src = frames.urls[i];
                    if (i < frames.urls.length - 1) {
                        next.src = frames.urls[i + 1]; // предзагрузка следующего атласа миниатюр
                    }
                }
                else if (x == X-1) {
                    y++;
                    x = 0;
                }
                else x++;

                if (!img.complete || img.naturalWidth == 0) {
                    timeout = setTimeout(() => changeImage(i, y, x-1), 50);
                }
                else {
                    var sx = x * frames.frameWidth;
                    var sy = y * frames.frameHeight;
                    var sw = frames.frameWidth;
                    var sh = frames.frameHeight;
                    var scaleX = canvas.width / sw;
                    var scaleY = canvas.height / sh;
                    var scale = Math.min(scaleX, scaleY);
                    var offsetX = (canvas.width - sw*scale) / 2;
                    var offsetY = (canvas.height - sh*scale) / 2;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, sx, sy, sw, sh, offsetX, offsetY, sw*scale, sh*scale);

                    box.replaceWith(canvas);

                    canvas.onmouseleave = () => {
                        restore(box);
                    };

                    timeout = setTimeout(() => changeImage(i, y, x), ThumbChangingSpeedMs);
                }
            }

            changeImage(-1, 0, 0);
        }
    });
}

function thumbnailOut() {
    if (!finished) restore(this);
}

function restore(box) {
    hovered = false;
    box.style.opacity = '';
    box.style.transition = '';
    box.style.border = '';
    box.style.borderColor = '';
    clearTimeout(timeout);
    if (canvas) canvas.replaceWith(box);
}

async function fetchData(url) {
    var response = await fetch(url);
    if (!response.ok) {
        return "";
    }

    var data = await response.json();
    return data;
}

const originalReplaceState = history.replaceState;
history.replaceState = function () { // переход по страницам на сайте
    originalReplaceState.apply(this, arguments);
    if (hovered) restore(prevbox);
}
window.addEventListener('popstate', function(event) { // навигация по истории браузера вручную
    if (hovered) restore(prevbox);
});
