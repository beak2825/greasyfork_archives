// ==UserScript==
// @name         copy images in one click freepik
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  provides two buttons on each image: to copy image URL and to copy image itself in the clipboard
// @author       GreatFireDragon
// @match        https://*.freepik.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freepik.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496296/copy%20images%20in%20one%20click%20freepik.user.js
// @updateURL https://update.greasyfork.org/scripts/496296/copy%20images%20in%20one%20click%20freepik.meta.js
// ==/UserScript==



(function() {
    'use strict';

    GM_addStyle(`
body #__next:nth-child(4) {
   background-color: red;
    visibility: hidden;
   height: 0;
   width: 0;
}

div[data-ssm],
figure[data-cy] > aside,
figure[data-cy] figcaption {
    display: none;
}

.smiley-wrapper,
.heart-wrapper{
    position: absolute;
    top: 0; right: 0;
    padding: 5px;
    background-color: grey;
    opacity: 0.3;
    transition: 1s;
    cursor: copy;
}

.heart-wrapper {right: 31px;}

.smiley-wrapper:hover,
.heart-wrapper:hover{
    opacity: 1;
}

@keyframes backgroundColorChange {
    0% {background-color: initial;}
    50% {
        background-color: #01cd5d;
        scale: 2;
    }
    100% {background-color: initial;}
}
.copied {
    animation: backgroundColorChange 0.5s ease-in-out infinite;
}
figure.clicked {
   filter: grayscale(100%);
   transition: filter 0.5s;
}
figure.clicked:hover {
    filter: grayscale(0%);
}
button#clearTakenImages {
    color: #cacaca;
    font-weight: bold;
    transitioN: 0.5s;
}
button#clearTakenImages:hover {
    scale: 1.2;
}
`)

    // Constants
    const CLICKED_CLASS = "clicked";
    const SMILEY_WRAPPER_CLASS = "smiley-wrapper";
    const HEART_WRAPPER_CLASS = "heart-wrapper";
    const COPIED_CLASS = "copied";
    const SMILEY_EMOJI = "😀";
    const HEART_EMOJI = "😍";
    const CLEAR_BUTTON_ID = "clearTakenImages";

    var urlsToCopy = [];

    function loadClickedImages() {
        var clickedImages = localStorage.getItem("clickedImages");
        return clickedImages ? JSON.parse(clickedImages) : [];
    }

    function saveClickedImage(url) {
        var clickedImages = loadClickedImages();
        if (!clickedImages.includes(url)) {
            clickedImages.push(url);
            localStorage.setItem("clickedImages", JSON.stringify(clickedImages));
        }
    }

    function applyClickedClass() {
        var clickedImages = loadClickedImages();
        var allFigures = document.querySelectorAll("figure[data-cy]");
        allFigures.forEach((figure) => {
            var imgElement = figure.querySelector("img");
            if (imgElement && clickedImages.includes(imgElement.src)) {
                figure.classList.add(CLICKED_CLASS);
            }
        });
    }

    function handleSmileyClick(event, figure, imgElement) {
        var url = imgElement.src;
        saveClickedImage(url);
        figure.classList.add(CLICKED_CLASS);

        if (event.shiftKey || event.ctrlKey) {
            urlsToCopy.push(url);
            setCopiedState(event.target);
        } else {
            navigator.clipboard.writeText(url).then(() => {
                setCopiedState(event.target);
            });
        }
    }

    function handleHeartClick(figure, imgElement) {
        var url = imgElement.src;
        saveClickedImage(url);
        figure.classList.add(CLICKED_CLASS);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (xhr.status === 200) {
                var blob = xhr.response;
                var reader = new FileReader();
                reader.onloadend = function () {
                    var img = new Image();
                    img.src = reader.result;
                    img.onload = function () {
                        var canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        var ctx = canvas.getContext("2d");
                        ctx.drawImage(img, 0, 0);
                        canvas.toBlob(function (blob) {
                            var item = new ClipboardItem({ "image/png": blob });
                            navigator.clipboard.write([item]).then(() => {
                                setCopiedState(figure.querySelector(`.${HEART_WRAPPER_CLASS}`));
                            }).catch((err) => {
                                console.error("Failed to copy image: ", err);
                            });
                        }, "image/png");
                    };
                };
                reader.readAsDataURL(blob);
            }
        };
        xhr.send();
    }

    function setCopiedState(element) {
        element.classList.add(COPIED_CLASS);
        setTimeout(() => element.classList.remove(COPIED_CLASS), 500);
    }

    function addSmileyDivs() {
        var allFigures = document.querySelectorAll("figure[data-cy]");
        allFigures.forEach((figure) => {
            var imgElement = figure.querySelector("img");
            if (!imgElement) return;

            if (!figure.querySelector(`.${SMILEY_WRAPPER_CLASS}`)) {
                var smileyDiv = document.createElement("div");
                smileyDiv.textContent = SMILEY_EMOJI;
                smileyDiv.classList.add(SMILEY_WRAPPER_CLASS);
                smileyDiv.addEventListener("click", function (event) {
                    handleSmileyClick(event, figure, imgElement);
                });
                figure.appendChild(smileyDiv);
            }

            if (!figure.querySelector(`.${HEART_WRAPPER_CLASS}`)) {
                var heartDiv = document.createElement("div");
                heartDiv.textContent = HEART_EMOJI;
                heartDiv.classList.add(HEART_WRAPPER_CLASS);
                heartDiv.addEventListener("click", function () {
                    handleHeartClick(figure, imgElement);
                });
                figure.appendChild(heartDiv);
            }
        });

        applyClickedClass();
    }

    function clearClickedImages() {
        localStorage.removeItem("clickedImages");
        var allFigures = document.querySelectorAll(`figure.${CLICKED_CLASS}`);
        allFigures.forEach(figure => {
            figure.classList.remove(CLICKED_CLASS);
        });
    }

    function addClearButton() {
        if (!document.getElementById(CLEAR_BUTTON_ID)) {
            const clearButton = document.createElement("button");
            clearButton.id = CLEAR_BUTTON_ID;
            clearButton.textContent = "Clear Taken Images";
            clearButton.addEventListener("click", clearClickedImages);

            document.body.appendChild(clearButton);
        }
    }


    document.addEventListener("keyup", function (event) {
        if (event.key === "Shift" || event.key === "Control") {
            if (urlsToCopy.length > 0) {
                var urlsString = urlsToCopy.join(" ");
                navigator.clipboard.writeText(urlsString).then(() => {
                    urlsToCopy = [];
                });
            }
        }
    });

    var observer = new MutationObserver(function (mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "attributes") {
                addSmileyDivs();
                addClearButton();
                break;
            }
        }
    });

    observer.observe(document.body, {
        attributes: false,
        childList: true,
        subtree: true,
    });

    addSmileyDivs();
    addClearButton();

})();