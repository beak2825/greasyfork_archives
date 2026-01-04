// ==UserScript==
// @name         Sikişsokuşoye
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  PORNO
// @author       《₁₈₇》
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533991/Siki%C5%9Fsoku%C5%9Foye.user.js
// @updateURL https://update.greasyfork.org/scripts/533991/Siki%C5%9Fsoku%C5%9Foye.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement("style");
    style.innerHTML = `
        .selection-container {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            display: flex;
            justify-content: space-between;
            padding: 0 30px;
            z-index: 1000;
        }
        .selection-box {
            position: relative;
            cursor: pointer;
            text-align: center;
        }
        .selection-box img {
            width: 150px;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .selection-text {
            position: absolute;
            bottom: -30px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 18px;
            font-weight: bold;
            color: white;
            background: rgba(0, 0, 0, 0.7);
            padding: 5px 10px;
            border-radius: 5px;
        }
        .center-image {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;
            text-align: center;
            z-index: 1001;
        }
        .center-image img {
            width: 200px;
            height: auto;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        .hour-btn {
            margin-top: 10px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            color: white;
            background: red;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }
        #girlSelect {
            margin-left: -30px;
        }
    `;
    document.head.appendChild(style);

    const selectionContainer = document.createElement("div");
    selectionContainer.className = "selection-container";
    selectionContainer.innerHTML = `
        <div class="selection-box" id="boySelect">
            <img src="https://r.resimlink.com/Y-zuXU1GEJx.jpg">
            <div class="selection-text">Boy</div>
        </div>
        <div class="selection-box" id="girlSelect">
            <img src="https://r.resimlink.com/woGb5XAkzq3e.jpg">
            <div class="selection-text">Girl</div>
        </div>
    `;
    document.body.appendChild(selectionContainer);

    const centerImage = document.createElement("div");
    centerImage.className = "center-image";
    centerImage.id = "centerImage";
    document.body.appendChild(centerImage);

    document.getElementById("boySelect").addEventListener("click", function() {
        document.getElementById("girlSelect").style.display = "none";
        showCenterImage("https://r.resimlink.com/gCf8D.gif", "Boy blowjob", "https://r.resimlink.com/kLpxv.gif", "Boy anal");
    });

    document.getElementById("girlSelect").addEventListener("click", function() {
        document.getElementById("boySelect").style.display = "none";
        showCenterImage("https://r.resimlink.com/uXG-4e1wSc.gif", "Girl blowjob", "https://r.resimlink.com/K9tnX.gif", "Girl anal");
    });

    function showCenterImage(imageUrl, text, extraImageUrl, extraText) {
        let timeoutId;
        centerImage.innerHTML = `
            <img src="${imageUrl}">
            <div class="selection-text">${text}</div>
            <button class="hour-btn" id="hourBtn">1 Hour</button>
        `;
        centerImage.style.display = "block";

        const hourBtn = document.getElementById("hourBtn");
        let duration = 7000;

        hourBtn.addEventListener("click", function() {
            duration = 3600000;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(showExtraImage, duration);
        });

        timeoutId = setTimeout(showExtraImage, duration);

        function showExtraImage() {
            centerImage.innerHTML = `
                <img src="${extraImageUrl}">
                <div class="selection-text">${extraText}</div>
                <button class="hour-btn" id="hourBtn2">1 Hour</button>
            `;

            const hourBtn2 = document.getElementById("hourBtn2");
            duration = 7000;

            hourBtn2.addEventListener("click", function() {
                duration = 3600000;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    centerImage.style.display = "none";
                }, duration);
            });

            timeoutId = setTimeout(() => {
                centerImage.style.display = "none";
            }, duration);
        }
    }
})();
