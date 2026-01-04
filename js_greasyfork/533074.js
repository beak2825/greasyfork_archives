// ==UserScript==
// @name         极客工具-去水印
// @version      1.0.0
// @namespace    xtool
// @description  Remove watermarks from online design platforms (Gaoding, Chuangkit, BigDesign, iSheji, Eqxiu, Biaoxi, etc.)
// @icon         https://achengovo.com/greasyfork/logo.png
// @match        https://*.gaoding.com/*
// @match        https://*.eqxiu.com/*
// @match        https://*.chuangkit.com/*
// @match        https://bigesj.com/*
// @match        https://www.isheji.com/*
// @match        https://*.logosc.cn/*
// @match        https://*.focodesign.com/*
// @match        https://*.logomaker.com.cn/*
// @require      https://update.greasyfork.org/scripts/502757/1422896/Jquery331.js
// @require      https://greasyfork.org/scripts/448541-dom-to-image-js/code/dom-to-imagejs.js?version=1074759
// @require      https://update.greasyfork.org/scripts/457525/1134363/html2canvas%20141.js
// @license      AGPL-3.0
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @compatible   firefox
// @compatible   chrome
// @compatible   opera safari edge
// @compatible   safari
// @compatible   edge
// @downloadURL https://update.greasyfork.org/scripts/533074/%E6%9E%81%E5%AE%A2%E5%B7%A5%E5%85%B7-%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/533074/%E6%9E%81%E5%AE%A2%E5%B7%A5%E5%85%B7-%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const ICON_FONT_URL = 'https://at.alicdn.com/t/c/font_2324127_m4c36wjifv.css';

    // Load external styles
    GM_addStyle(`@import url('${ICON_FONT_URL}');`);
    // Add custom button styles
    GM_addStyle(`
        .watermark-remover-container {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            transition: all 0.3s ease;
        }

        .watermark-remover-container:hover {
            transform: scale(1.05);
        }

        .watermark-remover-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 18px;
            background: linear-gradient(135deg, #ff5f6d, #ffc371);
            color: white;
            border-radius: 50px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            font-weight: bold;
            font-size: 15px;
            cursor: pointer;
            border: none;
            outline: none;
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
        }

        .watermark-remover-button:hover {
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
            background: linear-gradient(135deg, #ff4b5a, #ffb75c);
        }

        .watermark-remover-button i {
            margin-right: 8px;
            font-size: 18px;
        }

        .watermark-remover-icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='5' y1='12' x2='19' y2='12'%3E%3C/line%3E%3Cpolyline points='12 5 19 12 12 19'%3E%3C/polyline%3E%3C/svg%3E");
            background-size: contain;
            background-repeat: no-repeat;
            margin-right: 8px;
        }

        /* Modal styles */
        .instruction-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .instruction-modal-dialog {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            padding: 25px;
        }

        .instruction-modal-title {
            color: #333;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 15px;
        }

        .instruction-steps {
            margin-bottom: 25px;
        }

        .instruction-step {
            margin-bottom: 20px;
        }

        .instruction-step-text {
            font-size: 16px;
            margin-bottom: 10px;
            color: #444;
        }

        .instruction-step img {
            width: 100%;
            border: 1px solid #eee;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .instruction-button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .instruction-button {
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
            outline: none;
        }

        .instruction-close-button {
            background-color: #eee;
            color: #555;
        }

        .instruction-close-button:hover {
            background-color: #ddd;
        }

        .instruction-confirm-button {
            background-color: #4CAF50;
            color: white;
        }

        .instruction-confirm-button:hover {
            background-color: #3e8e41;
        }
    `);

    // Initialize UI
    createWatermarkRemovalButton();
})();

/**
 * Creates the watermark removal button in the UI
 */
function createWatermarkRemovalButton() {
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute('class', 'watermark-remover-container');
    document.body.appendChild(buttonContainer);

    const removalButton = document.createElement("button");
    removalButton.setAttribute('class', 'watermark-remover-button');
    removalButton.innerHTML = "<span class='watermark-remover-icon'></span>去除水印";
    removalButton.addEventListener("click", () => {
        removeWatermarks();
    });

    buttonContainer.appendChild(removalButton);
}

/**
 * Shows instructions modal for Gaoding Design platform
 */
function showGaodingInstructionsModal() {
    const modalOverlay = document.createElement("div");
    modalOverlay.setAttribute('class', 'instruction-modal-overlay');
    document.body.appendChild(modalOverlay);

    const modalDialog = document.createElement("div");
    modalDialog.setAttribute('class', 'instruction-modal-dialog');
    modalOverlay.appendChild(modalDialog);

    // Modal Title
    const modalTitle = document.createElement("h3");
    modalTitle.setAttribute('class', 'instruction-modal-title');
    modalTitle.textContent = "请确认是否添加屏蔽网络请求";
    modalDialog.appendChild(modalTitle);

    // Modal Content
    const modalContent = document.createElement("div");
    modalContent.setAttribute('class', 'instruction-steps');
    modalDialog.appendChild(modalContent);

    // Step 1
    const step1 = document.createElement("div");
    step1.setAttribute('class', 'instruction-step');
    modalContent.appendChild(step1);

    const step1Text = document.createElement("div");
    step1Text.setAttribute('class', 'instruction-step-text');
    step1Text.textContent = "1. 作图完成以后按F12打开开发者工具，打开屏蔽网络请求";
    step1.appendChild(step1Text);

    const step1Image = document.createElement("img");
    step1Image.src = "https://api.benmao.vip/public/monkey/images/gdimgs/step_1.png";
    step1.appendChild(step1Image);

    // Step 2
    const step2 = document.createElement("div");
    step2.setAttribute('class', 'instruction-step');
    modalContent.appendChild(step2);

    const step2Text = document.createElement("div");
    step2Text.setAttribute('class', 'instruction-step-text');
    step2Text.textContent = "2. 添加屏蔽请求，输入屏蔽地址：https://www.gaoding.com/api/ccm/editors/risk_materials";
    step2.appendChild(step2Text);

    const step2Image = document.createElement("img");
    step2Image.src = "https://api.benmao.vip/public/monkey/images/gdimgs/step_2.png";
    step2.appendChild(step2Image);

    // Step 3
    const step3 = document.createElement("div");
    step3.setAttribute('class', 'instruction-step');
    modalContent.appendChild(step3);

    const step3Text = document.createElement("div");
    step3Text.setAttribute('class', 'instruction-step-text');
    step3Text.textContent = "3. 勾选请求阻止，刷新页面，此时页面中已经没有水印了";
    step3.appendChild(step3Text);

    const step3Image = document.createElement("img");
    step3Image.src = "https://api.benmao.vip/public/monkey/images/gdimgs/step_3.png";
    step3.appendChild(step3Image);

    // Modal Buttons
    const buttonGroup = document.createElement("div");
    buttonGroup.setAttribute('class', 'instruction-button-group');
    modalDialog.appendChild(buttonGroup);

    const closeButton = document.createElement("button");
    closeButton.setAttribute('class', 'instruction-button instruction-close-button');
    closeButton.textContent = "关闭";
    closeButton.addEventListener("click", () => {
        closeModal('instruction-modal-overlay');
    });
    buttonGroup.appendChild(closeButton);

    const confirmButton = document.createElement("button");
    confirmButton.setAttribute('class', 'instruction-button instruction-confirm-button');
    confirmButton.textContent = "已添加，现在去水印";
    confirmButton.addEventListener("click", () => {
        location.reload();
    });
    buttonGroup.appendChild(confirmButton);
}

/**
 * Performs watermark removal based on the detected platform
 */
function removeWatermarks() {
    const pageTitle = document.title;

    if (/(稿定设计)/.test(pageTitle)) {
        showGaodingInstructionsModal();
    } else if (/(易企秀)/.test(pageTitle)) {
        $("div.eqc-watermark").css("position", "static");
        $(".eqc-wm-close").remove();
        let contentHtml = document.getElementsByClassName("safe-space")[0].innerHTML;
        contentHtml = contentHtml.replaceAll('data-hint="双击或从素材库拖拽进行替换"', "");
        contentHtml = contentHtml.replaceAll("hint--top", "");
    } else if (/(创客贴)/.test(pageTitle)) {
        const canvasContent = document.getElementsByClassName("canvas-slot-inner")[0].innerHTML;
        window.document.body.innerHTML = canvasContent;
        $("div[style*='ckt-watermark']").remove();
        $("body").css("overflow", "visible");
    } else if (/(比格设计)/.test(pageTitle)) {
        $("div.water").css("position", "static");
        $("div.tool-bar-container").remove();
        $(".water-tip").remove();
    } else if (/(爱设计)/.test(pageTitle)) {
        $("#editorDrag > div.undefined.scrolly > div.scrolly-viewport.editor-center > div > div:nth-child(1)").remove();
        $(".editor-watermask").remove();
        $(".editor-header").remove();
        $(".editor-aside").remove();
        $(".editor-panel").remove();
        $("#rongqi").remove();
        $("#outbuttons").remove();
        $(".control-panel").remove();
    } else if (/(标小智)/.test(pageTitle)) {
        $(".watermarklayer").remove();
        $('#watermark').remove();
    } else if (/(标智客)/.test(pageTitle)) {
        $(".watermark").remove();
    }

    // Show success message
    showSuccessMessage();
}

/**
 * Shows a temporary success message after watermark removal
 */
function showSuccessMessage() {
    const messageContainer = document.createElement("div");
    messageContainer.style.position = "fixed";
    messageContainer.style.top = "20px";
    messageContainer.style.left = "50%";
    messageContainer.style.transform = "translateX(-50%)";
    messageContainer.style.padding = "12px 24px";
    messageContainer.style.backgroundColor = "#4CAF50";
    messageContainer.style.color = "white";
    messageContainer.style.borderRadius = "4px";
    messageContainer.style.zIndex = "10000";
    messageContainer.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    messageContainer.style.fontWeight = "bold";
    messageContainer.style.fontSize = "15px";
    messageContainer.style.opacity = "0";
    messageContainer.style.transition = "opacity 0.3s ease";
    messageContainer.textContent = "水印移除操作已完成！";

    document.body.appendChild(messageContainer);

    // Fade in
    setTimeout(() => {
        messageContainer.style.opacity = "1";
    }, 100);

    // Fade out and remove after 3 seconds
    setTimeout(() => {
        messageContainer.style.opacity = "0";
        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 300);
    }, 3000);
}

/**
 * Sets a cookie with specified expiration time
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} hours - Expiration time in hours
 */
function setCookie(name, value, hours) {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + expirationDate.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

/**
 * Retrieves a cookie by name
 * @param {string} cookieName - Name of the cookie to retrieve
 * @return {string} - Cookie value or empty string if not found
 */
function getCookie(cookieName) {
    const name = cookieName + "=";
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return "";
}

/**
 * Closes a modal dialog by its class name
 * @param {string} elementClass - Class name of the modal to close
 */
function closeModal(elementClass) {
    $('.' + elementClass).remove();
}