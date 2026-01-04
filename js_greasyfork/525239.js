// ==UserScript==
// @name         巴哈姆特動畫瘋GIF截圖工具
// @namespace    巴哈:aa24281024/GitHub:Mystic0428
// @version      1.1
// @description  把動畫瘋內容片段轉成GIF
// @author       巴哈:aa24281024(Mystic)/GitHub:Mystic0428
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525239/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8BGIF%E6%88%AA%E5%9C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525239/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%95%E7%95%AB%E7%98%8BGIF%E6%88%AA%E5%9C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    .wrapper {
            --input-focus: #2d8cf0;
            --font-color: #323232;
            --font-color-sub: #666;
            --bg-color: #fff;
            --bg-color-alt: #666;
            --main-color: #323232;
        }

        .flip-card__popup {
            width: 1200px;
            height: auto;
            padding: 20px;
            display: none;
            position: fixed;
            left: 50%;
            top: 50%;
            flex-direction: column;
            justify-content: center;
            background: lightgrey;
            gap: 20px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            box-shadow: 4px 4px var(--main-color);
            backface-visibility: hidden;
            transform: translate(-50%, -50%);
            z-index:100;
        }

        .flip-card__form {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }

        .flip-card__input {
            width: 250px;
            height: 40px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            background-color: var(--bg-color);
            box-shadow: 4px 4px var(--main-color);
            font-size: 15px;
            font-weight: 600;
            color: var(--font-color);
            padding: 5px 10px;
            outline: none;
        }

        .flip-card__input::placeholder {
            color: var(--font-color-sub);
            opacity: 0.8;
        }

        .flip-card__input:focus {
            border: 2px solid var(--input-focus);
        }

        .flip-card__btn {
            margin: 20px 0 0;
            width: 120px;
            height: 40px;
            border-radius: 5px;
            border: 2px solid var(--main-color);
            background-color: var(--bg-color);
            box-shadow: 4px 4px var(--main-color);
            font-size: 17px;
            font-weight: 600;
            color: var(--font-color);
            cursor: pointer;
        }

        .modal__header {
            padding: 1rem 0rem;
            border-bottom: 1px solid #231b1b;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            z-index: 1;
            top: -20px;
        }

        .modal__title {
            font-size: 25px;
            font-weight: 900;
            color: var(--main-color);
            flex-grow: 1;
            text-align: center;
        }

        .close-button {
            appaerance: none;
            font: inherit;
            border: none;
            background: none;
            cursor: pointer;
        }

        .close-button--icon {
            width: 2.5rem;
            height: 2.5rem;
            background-color: transparent;
            border-radius: 0.25rem;
            position: absolute;
            right: 0;
        }

        .range-wrapper {
            border-radius: 10px;
            padding: 5px 25px 40px;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
        }

        .range-wrapper h2,
        .range-wrapper span {
            font-weight: 900;
            font-size: 15.5px;
        }

        .price-input {
            width: 100%;
            display: flex;
            margin: 30px 0 45px;
        }

        .price-input .field {
            display: flex;
            width: 100%;
            height: 45px;
            align-items: center;
        }

        .field input {
            width: 100%;
            height: 100%;
            outline: none;
            font-size: 19px;
            margin-left: 12px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #999;
            -moz-appearance: textfield;
        }

        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }

        .price-input .separator {
            width: 130px;
            display: flex;
            font-size: 19px;
            align-items: center;
            justify-content: center;
        }

        .slider {
            height: 5px;
            position: relative;
            background: #ddd;
            border-radius: 5px;
        }

        .slider .progress {
            height: 100%;
            left: 25%;
            right: 25%;
            position: absolute;
            border-radius: 5px;
            background: #17a2b8;
        }

        .range-input {
            position: relative;
        }

        .range-input input {
            position: absolute;
            width: 100%;
            height: 5px;
            top: -6px;
            left: -2px;
            background: none;
            pointer-events: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        input[type="range"]::-webkit-slider-thumb {
            height: 17px;
            width: 5px;
            border-radius: 80%;
            background: #17a2b8;
            pointer-events: auto;
            -webkit-appearance: none;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
        }

        input[type="range"]::-moz-range-thumb {
            height: 17px;
            width: 17px;
            border: none;
            border-radius: 50%;
            background: #17a2b8;
            pointer-events: auto;
            -moz-appearance: none;
            box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
        }

        .d-flex {
            width: 90%;
        }

        .control-btn {
            margin: 20px 0 0;
            display: flex;
            justify-content: center;
        }

        .card {
            --bg-card: #27272a;
            --primary: #6d28d9;
            --primary-800: #4c1d95;
            --primary-shadow: #2e1065;
            --light: #d9d9d9;
            --zinc-800: #18181b;
            --bg-linear: linear-gradient(0deg, var(--primary) 50%, var(--light) 125%);

            position: relative;

            display: flex;
            flex-direction: column;
            gap: 0.75rem;

            padding: 1rem;
            background-color: var(--bg-card);

            border-radius: 1rem;
        }

        .image_container {
            overflow: hidden;
            cursor: pointer;

            position: relative;
            z-index: 5;

            width: 300px;
            height: 200px;
            background-color: var(--primary-800);

            border-radius: 0.5rem;
        }

        .image_container .image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            fill: var(--light);
        }

        .title {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            font-weight: 600;
            color: var(--light);
            text-transform: capitalize;
            text-wrap: nowrap;
            text-overflow: ellipsis;
        }

        .cart-button {
            cursor: pointer;

            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.25rem;

            padding: 0.5rem;
            width: 100%;
            background-image: var(--bg-linear);

            font-size: 0.75rem;
            font-weight: 500;
            color: var(--light);
            text-wrap: nowrap;

            border: 2px solid hsla(262, 83%, 58%, 0.5);
            border-radius: 0.5rem;
            box-shadow: inset 0 0 0.25rem 1px var(--light);
        }

        .imgs-container {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            gap: 20px;
            align-items: center;
            justify-content: center;
            width: 90%;
            padding-top: 10px;
            padding-bottom: 10px;
        }


        .imgs-container::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            background-color: #F5F5F5;
        }

        .imgs-container::-webkit-scrollbar {
            width: 12px;
        }

        .imgs-container::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
            background-color: #555;
        }

        .content-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .result-container {
            width: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.1);
            border-radius: 10px;
        }

        #progressBar {
            width: 40%;
            height: 25px;
            background-color: #e0e0e0;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
        }

        #progress {
            height: 100%;
            background-color: #568358;
            width: 0%;
            border-radius: 10px;
        }

        #percentage {
            font-size: 14px;
            color: #333;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
        }

        #resolutionProgressBar {
            width: 40%;
            height: 25px;
            background-color: #e0e0e0;
            border-radius: 10px;
            position: relative;
            overflow: hidden;
            margin-right: 40px;
        }

        #resolutionProgress {
            height: 100%;
            background-color: #6e8f8f;
            width: 0%;
            border-radius: 10px;
        }

        #resolutionPercentage {
            font-size: 14px;
            color: #333;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            white-space: nowrap;
        }

        .progress-text {
            font-weight: 600;
            font-size: 19px;
        }

        .form-title {
            margin-bottom: 30px;
            text-align: center;
        }

        .form-title h2{
           font-weight: 900;
           font-size: 24px;
        }
        .image-container-override {
           justify-content: normal;
        }
`;

    document.head.appendChild(style);

    const popupHTML = `
    <div class="wrapper flip-card__popup" id="popup">
        <div class="modal__header">
            <span class="modal__title">動畫瘋GIF截圖工具</span>
            <button class="close-button close-button--icon" id="closePopupBtn">
                <svg width="24" viewBox="0 0 24 24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                    <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z">
                    </path>
                </svg>
            </button>
        </div>
        <form class="flip-card__form" action="">
            <div class="d-flex">
                <div class="range-wrapper">
                    <div class="form-title">
                        <h2>時間範圍</h2>
                    </div>
                    <div style="display: flex; flex-direction: row;align-items: center;justify-content: space-between;">
                        <span>解析進度：</span>
                        <div id="resolutionProgressBar">
                            <div id="resolutionProgress"><span class="progress-text" id="resolutionPercentage">0%</span>
                            </div>
                        </div>
                        <span>生成進度：</span>
                        <div id="progressBar">
                            <div id="progress"><span class="progress-text" id="percentage">0%</span></div>
                        </div>
                    </div>
                    <div class="price-input">
                        <div class="field">
                            <span>開始</span>
                            <input type="text" class="input-min flip-card__input" value="00:00:00:000">
                        </div>
                        <div class="separator">-</div>
                        <div class="field">
                            <span>結束</span>
                            <input type="text" class="input-max flip-card__input" value="00:00:15:000">
                        </div>
                    </div>
                    <div class="slider">
                        <div class="progress" style="left: 0%; right: 98.6437%;"></div>
                    </div>
                    <div class="range-input">
                        <input type="range" class="range-min" min="0" max="1420000" value="0" step="100">
                        <input type="range" class="range-max" min="0" max="1420000" value="15000" step="100">
                    </div>
                    <div class="control-btn">
                        <button type="button" class="flip-card__btn" id="generateButton">生成</button>
                        <button type="button" class="flip-card__btn" id="reset-btn">重置</button>
                    </div>
                </div>
            </div>
        </form>
        <div class="content-container">
            <div class="result-container">
                <span class="modal__title" style="margin-top: 10px;">生成結果</span>
                <div class="imgs-container">
                </div>
                <div style="height:30px;"></div>
            </div>
        </div>
    </div>
    `;

    let rangeInput, timeInput, range, imgsContainer, resetButton;
    let timeGap = 500;
    let timeRange = 15000;

    function handleTimeChange(e) {

        let startTime = timeToMilliseconds(timeInput[0].value)
        , endTime = timeToMilliseconds(timeInput[1].value);

        if (startTime === null || endTime === null) {
            if (e.target.classList.contains("input-min")) {
                timeInput[0].value = formatTime(rangeInput[0].value);
            } else {
                timeInput[1].value = formatTime(rangeInput[1].value);
            }
            return;
        }

        if (startTime < 0 || endTime > rangeInput[1].max || startTime > rangeInput[0].max) {
            if (e.target.classList.contains("input-min")) {
                timeInput[0].value = formatTime(rangeInput[0].value);
            } else {
                timeInput[1].value = formatTime(rangeInput[1].value);
            }
            return;
        }

        if (endTime - startTime <= 0) {
            if (e.target.classList.contains("input-min")) {
                rangeInput[0].value = startTime;
                if (startTime + timeRange > rangeInput[1].max) {
                    rangeInput[1].value = rangeInput[1].max;
                    timeInput[1].value = formatTime(rangeInput[1].max);
                } else {
                    rangeInput[1].value = startTime + timeRange;
                    timeInput[1].value = formatTime(startTime + timeRange);
                }
            } else {
                rangeInput[1].value = endTime;
                if (endTime - timeRange > rangeInput[0].min) {
                    rangeInput[0].value = endTime - timeRange;
                    timeInput[0].value = formatTime(rangeInput[0].value);
                } else {
                    rangeInput[0].value = rangeInput[0].min;
                    timeInput[0].value = formatTime(rangeInput[0].min);
                }
                rangeInput[1].value = endTime;
            }
            updatePercentage(rangeInput[0].value / rangeInput[0].max, rangeInput[1].value / rangeInput[1].max);
            return;
        }

        if (endTime - startTime >= timeGap && endTime <= rangeInput[1].max) {
            if (endTime - startTime > timeRange) {
                if (e.target.classList.contains("input-min")) {
                    rangeInput[0].value = startTime;
                    rangeInput[1].value = startTime + timeRange;
                    timeInput[1].value = formatTime(startTime + timeRange);
                } else {
                    rangeInput[0].value = endTime - timeRange;
                    rangeInput[1].value = endTime;
                    timeInput[0].value = formatTime(endTime - timeRange);
                }
                updatePercentage(rangeInput[0].value / rangeInput[0].max, rangeInput[1].value / rangeInput[1].max);
            } else {
                if (e.target.classList.contains("input-min")) {
                    rangeInput[0].value = startTime;
                    range.style.left = (startTime / rangeInput[0].max) * 100 + "%";
                } else {
                    rangeInput[1].value = endTime;
                    range.style.right = 100 - (endTime / rangeInput[1].max) * 100 + "%";
                }
            }

        }

    }

    function updatePercentage(rangeInput1, rangeInput2) {

        let leftPercentage = rangeInput1 * 100;
        let rightPercentage = 100 - rangeInput2 * 100;

        if (leftPercentage > 90) {
            leftPercentage -= 0.3;
        }
        if (rightPercentage > 90) {
            rightPercentage -= 0.3;
        }
        range.style.left = leftPercentage + "%";
        range.style.right = rightPercentage + "%";
    }

    function formatTime(milliseconds) {
        const hours = Math.floor(milliseconds / 3600000);
        const remainingMillisecondsAfterHours = milliseconds % 3600000;

        const minutes = Math.floor(remainingMillisecondsAfterHours / 60000);
        const remainingMillisecondsAfterMinutes = remainingMillisecondsAfterHours % 60000;

        const seconds = Math.floor(remainingMillisecondsAfterMinutes / 1000);
        const remainingMilliseconds = remainingMillisecondsAfterMinutes % 1000;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        const formattedMilliseconds = String(remainingMilliseconds).padStart(3, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}:${formattedMilliseconds}`;
    }

    function validateTimeFormat(time) {
        const regex = /^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d):(\d{1,3})$/;

        if (!regex.test(time)) {
            return false;
        }

        const match = time.match(regex);

        if (!match) {
            return false;
        }

        const [, hours, minutes, seconds, milliseconds] = match;

        return parseInt(milliseconds) % 100 === 0;
    }

    function timeToMilliseconds(time) {
        if (!validateTimeFormat(time)) {
            return null;
        }

        const [, hours, minutes, seconds, milliseconds] = time.match(/^([0-1]?\d|2[0-3]):([0-5]?\d):([0-5]?\d):(\d{1,3})$/);

        return (
            parseInt(hours) * 60 * 60 * 1000 +
            parseInt(minutes) * 60 * 1000 +
            parseInt(seconds) * 1000 +
            parseInt(milliseconds)
        );
    }

    function resetTime() {
        if (gifRenderingInProgress || isParsing) {
            console.log('正在進行中');
            return;
        }
        rangeInput[0].value = 0;
        rangeInput[1].value = 15000;
        startTime = 0;
        endTime = 15;
        timeInput[0].value = '00:00:00:000';
        timeInput[1].value = '00:00:15:000';
        updatePercentage(0 / rangeInput[0].max, 15000 / rangeInput[1].max);
    }

    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 關閉按鈕事件
    document.getElementById('closePopupBtn').addEventListener('click', closePopup);

    // 設置生成按鈕的事件監聽器
    document.getElementById('generateButton').addEventListener('click', function () {
        if (gifRenderingInProgress || isParsing) {
            console.log('正在進行中');
            return;
        }
        resetProgress();
        startTime = rangeInput[0].value / 1000;
        endTime = rangeInput[1].value / 1000;
        video.currentTime = startTime;
        video.playbackRate = 0.3; // 減慢影片播放速度至 0.3x，以免遺漏幀
        video.muted = true;
        video.play();
        captureFrames();
    });

    const popup = document.getElementById('popup');

    const progressElement = document.getElementById('progress');
    const percentage = document.getElementById('percentage');
    const resolutionProgressElement = document.getElementById('resolutionProgress');
    const resolutionPercentage = document.getElementById('resolutionPercentage');
    let isParsing = false;

    function showPopup() {
        if (document.querySelector('.video-adHandler-background-blocker')) {
            return;
        }
        popup.style.display = 'flex';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function closePopup() {
        if (isParsing) {
            return;
        }
        popup.style.display = 'none';
    }


    document.addEventListener('keydown', function (event) {

        // 當按下 Shift + G
        if (event.shiftKey && event.code === 'KeyG') {
            showPopup();
        }

        // 當按下 ESC
        if (event.key === 'Escape') {
            closePopup();
        }

    });

    window.onload = function () {
        rangeInput = document.querySelectorAll(".range-input input"),
            timeInput = document.querySelectorAll(".price-input input"),
            range = document.querySelector(".slider .progress"),
            imgsContainer = document.querySelector('.imgs-container'),
            resetButton = document.querySelector('#reset-btn');
        //把GIF圖示插入到Control Bar
        const targetContainer = document.querySelector('.control-bar-rightbtn');
        const newDiv = document.createElement('div');
        newDiv.className = 'vjs-menu-button vjs-menu-button-popup vjs-control vjs-button vjs-visible-text vjs-res-button';
        newDiv.innerHTML = `<button class="vjs-menu-button vjs-menu-button-popup vjs-button" type="button" aria-disabled="false"aria-haspopup="true" aria-expanded="false" title="GIF">
                                      <span class="vjs-icon-placeholder" aria-hidden="true"></span>
                                      <span class="vjs-control-text" aria-live="polite">GIF</span>
                                    </button> `;
        if (targetContainer) {
            targetContainer.appendChild(newDiv);
            const button = newDiv.querySelector('button');
            button.addEventListener('click', function () {
                showPopup();
            });
        } else {
            console.error('找不到 .control-bar-rightbtn 容器');
        }

        timeInput.forEach((input) => {

            input.addEventListener("blur", (e) => {
                handleTimeChange(e);
            });

            input.addEventListener("keydown", function (e) {
                if (event.keyCode == 13) {
                    e.preventDefault();
                    handleTimeChange(e);
                }
            });

        });

        rangeInput.forEach((input) => {
            input.addEventListener("input", (e) => {
                let minVal = parseInt(rangeInput[0].value),
                    maxVal = parseInt(rangeInput[1].value);

                if (maxVal - minVal <= timeGap) {
                    if (e.target.className === "range-min") {
                        rangeInput[0].value = maxVal - timeGap;
                        timeInput[0].value = formatTime(maxVal - timeGap);
                        timeInput[1].value = formatTime(maxVal);
                    } else {
                        rangeInput[1].value = minVal + timeGap;
                        timeInput[0].value = formatTime(minVal);
                        timeInput[1].value = formatTime(minVal + timeGap);
                    }
                } else {
                    if (maxVal - minVal > timeRange) {
                        if (e.target.className === "range-min") {
                            rangeInput[0].value = minVal;
                            rangeInput[1].value = minVal + timeRange;
                            timeInput[0].value = formatTime(minVal);
                            timeInput[1].value = formatTime(minVal + timeRange);
                        } else {
                            rangeInput[0].value = maxVal - timeRange;
                            rangeInput[1].value = maxVal;
                            timeInput[0].value = formatTime(maxVal - timeRange);
                            timeInput[1].value = formatTime(maxVal);
                        }
                        updatePercentage(rangeInput[0].value / rangeInput[0].max, rangeInput[1].value / rangeInput[1].max);
                        return;
                    }
                    timeInput[0].value = formatTime(minVal);
                    timeInput[1].value = formatTime(maxVal);
                    updatePercentage(minVal / rangeInput[0].max, maxVal / rangeInput[1].max);
                }
            });
        });

        imgsContainer.addEventListener('click', (e) => {
            if (e.target.closest('#delete-a')) {
                const card = e.target.closest('.card');
                if (card) {
                    card.remove();
                }
                if (imgsContainer.querySelectorAll('.card').length < 3) {
                    imgsContainer.classList.remove('image-container-override');
                }
            }
        });

        resetButton.addEventListener('click', (e) => {
            resetTime();
        });

    };

    // 動態創建 <script> 元素並加載 gif.js
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.min.js';
    document.head.appendChild(script);
    const videoResolutions = [
        { width: 1920, height: 1080, label: "1080p" },
        { width: 1280, height: 720, label: "720p" },
        { width: 960, height: 540, label: "540p" },
        { width: 640, height: 360, label: "360p" }
    ];

    const video = document.getElementById('ani_video_html5_api');
    let videoDuration = 1420;

    video.addEventListener('loadedmetadata', () => {
        if (rangeInput) {
            rangeInput.forEach((input) => {
                input.max = Math.floor(video.duration) * 1000;
            });
            updatePercentage(rangeInput[0].value / rangeInput[0].max, rangeInput[1].value / rangeInput[1].max);
        }
    });

    // 等待 gif.js 加載完成
    script.onload = function () {
        // 檢查 GIF 類是否可用
        window.gifList = new Map();
        if (typeof GIF !== 'undefined') {
            let gifLoading = fetch('https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not OK");
                }
                window.workerBlob = response.blob();
                return window.workerBlob;
            }).then(workerBlob => {
                for (let i = 0; i < 4; i++) {
                    let gif = new GIF({
                        workers: 4,
                        workerScript: URL.createObjectURL(workerBlob),
                        quality: 0,
                        repeat: 0,
                        width: videoResolutions[i].width,
                        height: videoResolutions[i].height,
                        background: '#ffffff'
                    });
                    gif.on('finished', function (blob) {
                        const gifUrl = URL.createObjectURL(blob);
                        let displayStartTime = formatTime(startTime * 1000);
                        let displayEndTime = formatTime(endTime * 1000);

                        let fileName = document.title.match(/(.+?\[\d+\])/);
                        if (fileName) {
                            fileName = fileName[0] + ' ' + displayStartTime + '-' + displayEndTime;
                        } else {
                            fileName = displayStartTime + '-' + displayEndTime;
                        }

                        const cardHTML = `
                                <div class="card">
                                    <div class="image_container">
                                        <img class="image" src="${gifUrl}" alt="Image Description" />
                                    </div>
                                    <div class="title">
                                         <span>${displayStartTime} - ${displayEndTime}</span>
                                     </div>
                                    <a href="${gifUrl}" download="${fileName}">
                                        <button class="cart-button">
                                             <span>下載</span>
                                        </button>
                                    </a>
                                    <a id="delete-a">
                                    <button class="cart-button"">
                                        <span>刪除</span>
                                    </button>
                                    </a>
                                </div>
                            `;

                        imgsContainer.innerHTML += cardHTML;

                        window.gifList.get(videoResolutions[i].width).abort();
                        window.gifList.get(videoResolutions[i].width).frames = [];
                        gifRenderingInProgress = false;
                        if (imgsContainer.querySelectorAll('.card').length >= 3) {
                            imgsContainer.classList.add('image-container-override');
                            imgsContainer.scrollLeft = imgsContainer.scrollWidth;
                        }
                    });
                    gif.on('progress', function (progress) {
                        progressElement.style.width = `${Math.round(progress * 100)}%`; // 直接同步進度條
                        percentage.textContent = `${Math.round(progress * 100)}%`; // 更新百分比顯示
                    });
                    window.gifList.set(videoResolutions[i].width, gif);
                }

            }).catch(error => console.error("Error loading GIF worker:", error));

        } else {
            console.log('Failed to find GIF class!');
        }
    };

    let startTime = 0;
    let endTime = 15;
    let gifRenderingInProgress = false; // 用來標記是否正在進行渲染
    let lastExpectedDisplayTime = null;
    let frameDisplayDurations = [];
    let currentWidth=1920;

    function captureFrames() {
        isParsing = true;
        // 這個回調將每一幀都調用
        function frameCallback(now, metadata) {
            // 確保捕捉只在設定的開始時間之後觸發
            if (video.currentTime < startTime) {
                //如果影片尚未達到開始捕捉的時間，則繼續等待
                video.requestVideoFrameCallback(frameCallback);
                return;
            }
            currentWidth= metadata.width;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = metadata.width;
            canvas.height = metadata.height;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageURL = canvas.toDataURL('image/png');

            const img = new Image();
            img.src = imageURL;

            const currentExpectedDisplayTime = metadata.mediaTime * 1000;

            if (lastExpectedDisplayTime !== null) {
                // 計算前一幀顯示時長
                const displayDuration = currentExpectedDisplayTime - lastExpectedDisplayTime;
                frameDisplayDurations.push(displayDuration);
            }

            // 更新上一幀的 expectedDisplayTime
            lastExpectedDisplayTime = currentExpectedDisplayTime;

            window.gifList.get(canvas.width).addFrame(img, { delay: 125 });
            // 如果影片播放時間達到停止的時間，則停止捕捉
            if (video.currentTime >= endTime || video.currentTime >= Math.floor(video.duration)) {
                generateGif(canvas.width);
                return;
            }

            const progress = (video.currentTime - startTime) / (endTime - startTime);
            resolutionProgressElement.style.width = `${Math.round(progress * 100)}%`;
            resolutionPercentage.textContent = `${Math.round(progress * 100)}%`;
            // 持續捕捉每一幀
            video.requestVideoFrameCallback(frameCallback);
        }
        // 等待影片達到開始捕捉的時間，然後開始捕捉
        video.requestVideoFrameCallback(frameCallback);
    }

    function resetProgress() {
        progressElement.style.width = `${0}%`; // 直接同步進度條
        percentage.textContent = `${0}%`; // 更新百分比顯示
        resolutionProgressElement.style.width = `${0}%`;
        resolutionPercentage.textContent = `${0}%`;
    }

    video.addEventListener('ended', () => {
        if(!window.gifList.get(currentWidth).running){
            generateGif(currentWidth);
        }
    });

    function generateGif(videoWidth){
        frameDisplayDurations.push(frameDisplayDurations[frameDisplayDurations.length - 1]);
        const averageFrameDisplayDuration = frameDisplayDurations.reduce((total, duration) => total + duration, 0) / frameDisplayDurations.length;
        video.playbackRate = 1; //調整影片為正常撥放速率
        isParsing = false;
        for (let i = 0; i < window.gifList.get(videoWidth).frames.length; i++) {
            window.gifList.get(videoWidth).frames[i].delay = averageFrameDisplayDuration;
        }
        resolutionProgressElement.style.width = `${100}%`;
        resolutionPercentage.textContent = `${100}%`;
        window.gifList.get(videoWidth).render();
        gifRenderingInProgress = true;
        frameDisplayDurations = [];
        lastExpectedDisplayTime = null;
        video.muted = false;
    };

})();