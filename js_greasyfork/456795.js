// ==UserScript==
// @name         Etsy URL Cleaner
// @namespace    https://greasyfork.org/en/scripts/456795-etsy-url-cleaner
// @version      1.0.4
// @description  Removes specified query parameters from Etsy URLs
// @match        https://www.etsy.com/listing/*
// @match        https://www.etsy.com/shop/*
// @match        https://i.etsystatic.com/*
// @grant        none
// @icon        https://www.etsy.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456795/Etsy%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/456795/Etsy%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Danh sách các query parameters cần xóa
    // Bạn có thể dễ dàng thêm mới bằng cách thêm vào mảng này
    const QUERY_PARAMS_TO_REMOVE = [
        '?ref',
        '?click_key',
        '?ga_order',
        '?ref=simple-shop-header',
        '?ls'
    ];

    /**
     * Xóa các query parameters không mong muốn khỏi URL
     * @param {string} url - URL cần xử lý
     * @returns {string} URL đã được làm sạch
     */
    function cleanQueryParams(url) {
        let maxIndex = -1;

        // Tìm vị trí cuối cùng của bất kỳ parameter nào trong danh sách
        QUERY_PARAMS_TO_REMOVE.forEach(param => {
            const index = url.indexOf(param);
            if (index !== -1 && index > maxIndex) {
                maxIndex = index;
            }
        });

        // Nếu tìm thấy parameter, cắt bỏ từ vị trí đó trở đi
        if (maxIndex !== -1) {
            return url.substring(0, maxIndex);
        }
        return url;
    }

    /**
     * Xử lý URL hình ảnh để chuyển sang chất lượng đầy đủ
     * @param {string} url - URL cần xử lý
     * @returns {string} URL đã được xử lý hoặc null nếu không cần thay đổi
     */
    function processImageUrl(url) {
        if (url.indexOf('/il_fullxfull') !== -1) {
            return null;
        }

        if (url.indexOf('/il_') !== -1) {
            const ilIndex = url.indexOf('/il_');
            const dotIndex = url.indexOf('.', ilIndex);
            return url.substring(0, ilIndex) + '/il_fullxfull' + url.substring(dotIndex);
        }
        return null;
    }

    // Main execution
    let currentUrl = window.location.href;

    // Xử lý query parameters
    const cleanedUrl = cleanQueryParams(currentUrl);
    if (cleanedUrl !== currentUrl) {
        window.history.pushState({}, '', cleanedUrl);
        currentUrl = cleanedUrl;
    }

    // Xử lý URL hình ảnh
    const processedImageUrl = processImageUrl(currentUrl);
    if (processedImageUrl) {
        window.location.href = processedImageUrl;
    }
})();