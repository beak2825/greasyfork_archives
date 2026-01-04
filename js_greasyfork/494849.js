// ==UserScript==
// @name         Copy Information with Toggle Button
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Add buttons to copy URL, shop name, and product title with a toggle button for collapsing and expanding
// @author       Eli01
// @license      Apache-2.0
// @match        *://item.taobao.com/*
// @match        *://detail.tmall.com/*
// @match        *://item.jd.com/*
// @match        *://www.goofish.com/item?*
// @match        *://www.xiaohongshu.com/goods-detail/*
// @grant        none
// @icon         https://cdn1.iconfinder.com/data/icons/unicons-line-vol-2/24/copy-512.png
// @downloadURL https://update.greasyfork.org/scripts/494849/Copy%20Information%20with%20Toggle%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/494849/Copy%20Information%20with%20Toggle%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            console.log('Copied to clipboard: ' + text);
        }, function(err) {
            console.error('Failed to copy to clipboard: ' + err);
        });
    }

    // Function to create copy button
    function createCopyButton(text, topOffset, rightOffset) {
        var copyButton = document.createElement('button');
        copyButton.textContent = text;
        copyButton.style.position = 'fixed';
        copyButton.style.top = topOffset + 'px';
        copyButton.style.right = rightOffset + 'px';
        copyButton.style.zIndex = '9999';
        copyButton.style.padding = '5px';
        copyButton.style.borderRadius = '5px';
        return copyButton;
    }

    // Function to toggle buttons visibility
    function toggleButtonsVisibility(buttons, isVisible) {
        buttons.forEach(function(button) {
            button.style.display = isVisible? 'block' : 'none';
        });
    }

    // Create toggle button
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Buttons';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '40px';
    toggleButton.style.right = '140px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '5px';
    toggleButton.style.borderRadius = '5px';
    document.body.appendChild(toggleButton);

    // Create individual copy buttons
    var copyUrlButton = createCopyButton('Copy URL', 80, 140);
    var copyShopNameButton = createCopyButton('Copy Shop Name', 110, 140);
    var copyProductTitleButton = createCopyButton('Copy Product Title', 140, 140);
    var copyPriceButton = createCopyButton('Copy Price', 170, 140);
    var combinedCopyButton = createCopyButton('Copy Shop Name, URL, Price', 200, 140);
    document.body.appendChild(combinedCopyButton);
    document.body.appendChild(copyUrlButton);
    document.body.appendChild(copyShopNameButton);
    document.body.appendChild(copyProductTitleButton);
    document.body.appendChild(copyPriceButton);

    // Add click listener to toggle button
    toggleButton.addEventListener('click', function() {
        var buttons = [copyUrlButton, copyShopNameButton, copyProductTitleButton, copyPriceButton,combinedCopyButton];
        var isAnyButtonVisible = buttons.some(function(button) {
            return button.style.display!== 'none';
        });
        toggleButtonsVisibility(buttons,!isAnyButtonVisible);
    });

    // Add click listeners to individual copy buttons
    copyUrlButton.addEventListener('click', function() {
        simulateButtonDown(copyUrlButton);
        copyToClipboard(window.location.href);
    });

    copyShopNameButton.addEventListener('click', function() {
        simulateButtonDown(copyShopNameButton);
        var shopName = getShopName();
        copyToClipboard(shopName);
    });

    copyProductTitleButton.addEventListener('click', function() {
        simulateButtonDown(copyProductTitleButton);
        var productTitle = getProductTitle();
        copyToClipboard(productTitle);
    });

    copyPriceButton.addEventListener('click', function() {
        simulateButtonDown(copyPriceButton);
        var price = getPrice();
        copyToClipboard(price);
    });

    // Function to simulate button down action
    function simulateButtonDown(button) {
        button.style.transform = 'scale(0.95)';
        button.style.boxShadow = 'none';
        setTimeout(function() {
            button.style.transform = '';
            button.style.boxShadow = '';
        }, 100);
    }

    // Function to get shop name
    function getShopName() {
        var shopNameElement;
        if (window.location.hostname.includes('taobao.com') || window.location.hostname.includes('tmall.com')) {
            shopNameElement = document.querySelector('.ShopHeaderNew--shopName--2J0piSC') || document.querySelector('.ShopHeader--shopName--zZ3913d') || document.querySelector('.shopName--mTDZGIPO');
        } else if (window.location.hostname.includes('jd.com')) {
            shopNameElement = document.querySelector('.name a');
        } else if (window.location.hostname.includes('goofish.com')) {
            shopNameElement = document.querySelector('.item-user-info-nick--rtpDhkmQ');
        } else if (window.location.hostname.includes('xiaohongshu.com')) {
            shopNameElement = document.querySelector('.seller-name');
        }
        if (shopNameElement) {
            return shopNameElement.textContent.trim();
        } else {
            return 'Shop Name Not Found';
        }
    }

    // Function to get product title
    function getProductTitle() {
        var productTitleElement;
        if (window.location.hostname.includes('taobao.com') || window.location.hostname.includes('tmall.com')) {
            productTitleElement = document.querySelector('.ItemHeader--mainTitle--3CIjqW5') || document.querySelector('.ItemTitle--root--3V3R5Y_') || document.querySelector('.mainTitle--O1XCl8e2');
        } else if (window.location.hostname.includes('jd.com')) {
            productTitleElement = document.querySelector('.sku-name');
        } else if (window.location.hostname.includes('goofish.com')) {
            const elements = document.querySelectorAll('.desc--GaIUKUQY');
            productTitleElement = elements.length > 1? elements[1] : elements[0];
        } else if (window.location.hostname.includes('xiaohongshu.com')) {
            productTitleElement = document.querySelector('.goods-name');
        }
        if (productTitleElement) {
            return productTitleElement.textContent.trim();
        } else {
            return 'Product Title Not Found';
        }
    }

    // Function to get Price
    function getPrice() {
        var priceElement;
        if (window.location.hostname.includes('taobao.com') || window.location.hostname.includes('tmall.com')) {
            priceElement =document.querySelector('.extraPriceText--aysuZjG_')
            || document.querySelector('.Price--extraPriceText--3zUb0uS')
            || document.querySelector('.Price--priceText--2nLbVda')
            || document.querySelector('.Price--priceText--1oEHppn')
            || document.querySelector('.priceText--gdYzG_l_')
            || document.querySelector('.text--Mdqy24Ex')
            || document.querySelector('.text--fZ9NUhyQ');
        } else if (window.location.hostname.includes('jd.com')) {
            priceElement = document.querySelector('.finalPrice') || document.querySelector('.p-price');
        } else if (window.location.hostname.includes('goofish.com')) {
            priceElement = document.querySelector('.price--Ls68DZ8a') || document.querySelector('.price--OEWLbcxC');
        } else if (window.location.hostname.includes('xiaohongshu.com')) {
            priceElement = document.querySelector('.price');
        }
        if (priceElement) {
        // 使用正则表达式匹配数字部分
        var priceText = priceElement.textContent.trim();
        var priceNumber = priceText.match(/\d+\.?\d*/);
        return priceNumber ? priceNumber[0] : 'Price Not Found';
        } else {
        return 'Price Not Found';
        }
    }

    // Create combined copy button
    combinedCopyButton.addEventListener('click', function() {
        simulateButtonDown(combinedCopyButton);
        var shopName = getShopName();
        var Title = getProductTitle();
        var url = window.location.href;
        var price = getPrice();
        var combinedText = `${shopName}\t\t${url}\t${price}`;
        //var combinedText = `${shopName}\t${Title}\t${url}\t${price}`;
        copyToClipboard(combinedText);
    });

})();