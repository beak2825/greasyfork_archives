// ==UserScript==
// @name         Gta5Mods to FiveM resource tool
// @namespace    https://gta5mods.hk416.org/
// @version      1.3
// @description  A tool that can convert gta5-mods.com mods to FiveM resources.
// @author       Akkariin
// @license      MIT
// @match        *://*.gta5-mods.com/*
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.22.0/dist/sweetalert2.all.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/538301/Gta5Mods%20to%20FiveM%20resource%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/538301/Gta5Mods%20to%20FiveM%20resource%20tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        apiBaseUrl: "https://gta5mods.hk416.org",
        fileContainerSelector: "#file-container",
        downloadButtonHookSelector: ".btn-download",
        fivemButtonClass: "downloadFiveMBtn",
        localStorageKey: "convertUid_g2f",
        pollIntervalMs: 1500,
        successMessageResetDelayMs: 3000
    };

    const SCRIPT_TEXTS = {
        en: {
            buttonText: "<i class='fa fa-download'></i>&nbsp;&nbsp;Convert to FiveM resource",
            buttonStatusSubmitting: '<i class="fa fa-spinner fa-spin"></i>&nbsp;Submitting...',
            buttonStatusSubmitted: "<i class='fa fa-check'></i>&nbsp;Task submitted, ID: ",
            buttonStatusConverting: '<i class="fa fa-circle-o-notch fa-spin"></i>&nbsp;',
            buttonStatusSuccess: "<i class='fa fa-check'></i>&nbsp;Convert finished: ",
            buttonStatusRestoring: '<i class="fa fa-spinner fa-spin"></i>&nbsp;Restoring state...',
            popupErrorTitle: "Error",
            popupSubmitError: "Failed to submit the task to the server.",
            popupSubmitErrorWithDetails: "Failed to submit the task: ",
            popupStatusFetchError: "Failed to get task status from the server.",
            popupConvertError: "Conversion failed: ",
            popupParseError: "An error occurred while processing the server response. Please try again."
        },
        zh: {
            buttonText: "<i class='fa fa-download'></i>&nbsp;&nbsp;转换为 FiveM 资源",
            buttonStatusSubmitting: '<i class="fa fa-spinner fa-spin"></i>&nbsp;提交中...',
            buttonStatusSubmitted: "<i class='fa fa-check'></i>&nbsp;任务已提交，ID: ",
            buttonStatusConverting: '<i class="fa fa-circle-o-notch fa-spin"></i>&nbsp;',
            buttonStatusSuccess: "<i class='fa fa-check'></i>&nbsp;转换完成: ",
            buttonStatusRestoring: '<i class="fa fa-spinner fa-spin"></i>&nbsp;恢复状态中...',
            popupErrorTitle: "错误",
            popupSubmitError: "提交任务到服务器失败。",
            popupSubmitErrorWithDetails: "提交任务失败: ",
            popupStatusFetchError: "从服务器获取任务状态失败。",
            popupConvertError: "转换失败: ",
            popupParseError: "处理服务器响应时发生错误，请重试。"
        }
    };

    // --- Initialization ---
    if (!document.querySelector(CONFIG.fileContainerSelector)) {
        console.log("Gta5Mods to FiveM tool: #file-container not found. Script will not run on this page.");
        return;
    }

    let currentLang = 'en';
    switch (window.location.hostname) {
        case "zh.gta5-mods.com":
            currentLang = 'zh';
            break;
        default:
            currentLang = 'en';
    }

    const TEXTS = SCRIPT_TEXTS[currentLang];
    const API_ENDPOINT = CONFIG.apiBaseUrl + (currentLang === 'zh' ? "/" : "/en");
    const API_LANG_PARAM = currentLang === 'zh' ? 'zh_CN' : 'en_US';

    let $fivemButton;

    // --- Helper Functions ---
    function resetButtonToDefaultState() {
        updateButtonUI(TEXTS.buttonText, false);
        if ($fivemButton) { // Ensure $fivemButton is defined
            $fivemButton.off('click').on('click', handleSubmitConversion);
        }
        localStorage.removeItem(CONFIG.localStorageKey);
    }

    function showErrorAlert(message) {
        Swal.fire({
            icon: 'error',
            title: TEXTS.popupErrorTitle,
            text: message,
        }).then(() => {
            resetButtonToDefaultState();
        });
    }

    function updateButtonUI(htmlContent, disabled) {
        if ($fivemButton) {
            $fivemButton.html(htmlContent);
            if (disabled) {
                $fivemButton.attr('disabled', 'disabled');
            } else {
                $fivemButton.removeAttr('disabled');
            }
        }
    }

    function downloadFile(url, filename) {
        window.location.href = url;
    }

    // --- Core Logic ---
    function pollConversionStatus(uuid) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: API_ENDPOINT,
            data: `uuid=${encodeURIComponent(uuid)}&lang=${encodeURIComponent(API_LANG_PARAM)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.status == 200) { // Success
                            updateButtonUI(TEXTS.buttonStatusSuccess + json.message.name, true);
                            localStorage.removeItem(CONFIG.localStorageKey);
                            downloadFile(CONFIG.apiBaseUrl + "/" + json.message.file, json.message.name);
                            setTimeout(() => {
                                resetButtonToDefaultState();
                            }, CONFIG.successMessageResetDelayMs);
                        } else if (json.status == 101) { // Still processing
                            updateButtonUI(TEXTS.buttonStatusConverting + json.message, true);
                            setTimeout(() => pollConversionStatus(uuid), CONFIG.pollIntervalMs);
                        } else { // Other error from API
                            showErrorAlert(TEXTS.popupConvertError + (json.message || 'Unknown API error'));
                        }
                    } catch (e) {
                        console.error("Error parsing polling response:", e, response.responseText);
                        showErrorAlert(TEXTS.popupParseError);
                    }
                } else {
                    console.error("Polling request failed with HTTP status:", response.status, response.responseText);
                    showErrorAlert(TEXTS.popupStatusFetchError + ` (Status: ${response.status})`);
                }
            },
            onerror: function(response) {
                console.error("Polling request network error:", response);
                showErrorAlert(TEXTS.popupStatusFetchError);
            }
        });
    }

    function handleSubmitConversion() {
        const pageUrl = window.location.href.substring(0, window.location.href.length - window.location.hash.length);
        if (pageUrl === "") return;

        updateButtonUI(TEXTS.buttonStatusSubmitting, true);

        GM_xmlhttpRequest({
            method: 'POST',
            url: API_ENDPOINT,
            data: `url=${encodeURIComponent(pageUrl)}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(response) {
                if (response.status >= 200 && response.status < 300) {
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json.status == 200) {
                            updateButtonUI(TEXTS.buttonStatusSubmitted + json.message, true);
                            localStorage.setItem(CONFIG.localStorageKey, json.message);
                            pollConversionStatus(json.message);
                        } else {
                            showErrorAlert(TEXTS.popupSubmitErrorWithDetails + (json.message || 'No details provided.'));
                        }
                    } catch (e) {
                        console.error("Error parsing submission response:", e, response.responseText);
                        showErrorAlert(TEXTS.popupParseError);
                    }
                } else {
                    console.error("Submission request failed with HTTP status:", response.status, response.responseText);
                    let apiErrorMessage = `Server responded with status ${response.status}.`;
                    try {
                        const json = JSON.parse(response.responseText);
                        if (json && json.message) {
                            apiErrorMessage = json.message;
                        }
                    } catch (e) {
                        // Ignore parse error if response is not JSON
                    }
                    showErrorAlert(TEXTS.popupSubmitErrorWithDetails + apiErrorMessage);
                }
            },
            onerror: function(response) {
                console.error("Submission request network error:", response);
                showErrorAlert(TEXTS.popupSubmitError);
            }
        });
    }

    // --- UI Setup and Initialization ---
    function initialize() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .${CONFIG.fivemButtonClass} {
                width: 100%;
                margin-bottom: 10px;
            }
            .swal2-popup {
                font-size: 1.2em !important;
            }
        `;
        document.head.appendChild(styleElement);

        // Ensure jQuery is available before using $
        if (typeof $ === 'undefined') {
            console.error("Gta5Mods to FiveM tool: jQuery is not available. The script might not work correctly.");
            return;
        }


        $fivemButton = $("<button class='btn btn-default " + CONFIG.fivemButtonClass + "'></button>");
        const $downloadButtonHook = $(CONFIG.downloadButtonHookSelector);
        if ($downloadButtonHook.length > 0) {
            if ($downloadButtonHook.css('display') === 'inline' || $downloadButtonHook.css('display') === 'inline-block') {
                $fivemButton.wrap('<p></p>').parent().insertAfter($downloadButtonHook);
            } else {
                $fivemButton.insertAfter($downloadButtonHook);
            }
        } else {
            console.warn("Gta5Mods to FiveM tool: Download button hook selector not found. Button not added.");
            return;
        }


        const existingUuid = localStorage.getItem(CONFIG.localStorageKey);
        if (existingUuid) {
            updateButtonUI(TEXTS.buttonStatusRestoring, true);
            pollConversionStatus(existingUuid);
        } else {
            resetButtonToDefaultState();
        }
    }

    if (typeof $ === 'function') {
        $(document).ready(initialize);
    } else {
        window.addEventListener('DOMContentLoaded', initialize);
    }

})();