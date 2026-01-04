// ==UserScript==
// @name         駿河屋海外品切れ自動ON､検索バー移動､品番表示、コピー機能追加
// @name:en      Suruga-yaOverseas:OutofStockAutoEnableSearchBarMovementProductNumberDisplayAddCopyFeature
// @name:zh-CN  駿河屋国外站点：自动启用缺货搜索栏移动产品编号显示添加复制功能
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Enhance Suruga-ya.com browsing experience
// @description:en  Enhance Suruga-ya.com browsing experience
// @description:zh-CN  提升駿河屋網站的瀏覽體驗
// @author       Kim
// @match        https://www.suruga-ya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494631/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E6%B5%B7%E5%A4%96%E5%93%81%E5%88%87%E3%82%8C%E8%87%AA%E5%8B%95ON%EF%BD%A4%E6%A4%9C%E7%B4%A2%E3%83%90%E3%83%BC%E7%A7%BB%E5%8B%95%EF%BD%A4%E5%93%81%E7%95%AA%E8%A1%A8%E7%A4%BA%E3%80%81%E3%82%B3%E3%83%94%E3%83%BC%E6%A9%9F%E8%83%BD%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/494631/%E9%A7%BF%E6%B2%B3%E5%B1%8B%E6%B5%B7%E5%A4%96%E5%93%81%E5%88%87%E3%82%8C%E8%87%AA%E5%8B%95ON%EF%BD%A4%E6%A4%9C%E7%B4%A2%E3%83%90%E3%83%BC%E7%A7%BB%E5%8B%95%EF%BD%A4%E5%93%81%E7%95%AA%E8%A1%A8%E7%A4%BA%E3%80%81%E3%82%B3%E3%83%94%E3%83%BC%E6%A9%9F%E8%83%BD%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and show a toast notification
    function showToast(message) {
        var toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '10px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#333';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';

        document.body.appendChild(toast);

        // Show the toast
        setTimeout(function() {
            toast.style.opacity = '1';
        }, 100);

        // Hide the toast after 3 seconds
        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }

    // Function to display management numbers and add copy buttons
    function displayManagementNumbers() {
        var productLinks = document.querySelectorAll('a[data-info]');
        var displayedLinks = new Set(); // Tracks displayed links
        var copyButtons = new Set(); // Tracks copy buttons

        productLinks.forEach(function(link) {
            var href = link.href;
            var info = link.getAttribute('data-info');

            if (info) {
                var productInfo = JSON.parse(info.replace(/&quot;/g, '"'));
                var productId = productInfo.id;

                if (productId) {
                    if (!displayedLinks.has(href)) {
                        // Display management number and copy button
                        var managementNumber = document.createElement('span');
                        managementNumber.textContent = '管理番号: ' + productId;

                        var copyButton = document.createElement('button');
                        copyButton.textContent = 'コピー';
                        copyButton.style.marginLeft = '5px';
                        copyButton.onclick = function() {
                            copyToClipboard(productId);
                            showToast('管理番号 ' + productId + ' をコピーしました');
                        };

                        link.parentNode.insertBefore(managementNumber, link.nextSibling);
                        link.parentNode.insertBefore(copyButton, managementNumber.nextSibling);

                        displayedLinks.add(href);
                    } else {
                        if (!copyButtons.has(href)) {
                            // Add copy button for product name if it's the second instance of the same link
                            var copyButton = document.createElement('button');
                            copyButton.textContent = 'コピー';
                            copyButton.style.marginLeft = '5px';
                            copyButton.onclick = function() {
                                copyToClipboard(link.textContent);
                                showToast('商品名 "' + link.textContent + '" をコピーしました');
                            };

                            link.parentNode.insertBefore(copyButton, link.nextSibling);
                            copyButtons.add(href);
                        }
                    }
                }
            }
        });
    }

    // Function to update the position of the search bar
    function updateSearchBarPosition() {
        var searchBar = document.getElementById('search_mobile');
        var initialOffsetTop = searchBar.offsetTop;

        var scrollTop = window.pageYOffset || document.documentElement.scrollTop; // Get the current scroll position
        if (scrollTop > initialOffsetTop) {
            searchBar.style.position = 'fixed';
            searchBar.style.top = '0';
            searchBar.style.left = '0';
            searchBar.style.zIndex = '9999';
        } else {
            searchBar.style.position = 'static';
        }
    }

    // Display management numbers when the page loads
    window.addEventListener('load', function() {
        displayManagementNumbers(); // Display management numbers when the page loads
        updateSearchBarPosition(); // Update the search bar position when the page loads
    });

    // Re-update the search bar position on window resize
    window.addEventListener('resize', function() {
        updateSearchBarPosition(); // Update the search bar position when the window is resized
    });

    // Update the search bar position when scrolling
    window.addEventListener('scroll', function() {
        updateSearchBarPosition(); // Update the search bar position when scrolling
    });

    // Function to automatically enable out of stock filter if it's off when the page loads
    function autoEnableOutOfStockFilter() {
        const currentUrl = window.location.href;

        if (!currentUrl.includes("in_stock=t") && !currentUrl.includes("/item/detail/")) {
            window.location.href = currentUrl + (currentUrl.includes("?") ? "&" : "?") + "in_stock=t";
        }
    }

    // Auto-enable out of stock filter when the page loads
    window.addEventListener('load', function() {
        autoEnableOutOfStockFilter(); // Call the function when the page loads
    });

})();
