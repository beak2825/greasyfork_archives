// ==UserScript==
// @name         Amazon Photo Share Variation
// @namespace    Violentmonkey Scripts
// @version      0.1
// @description  Share Amazon product details to Telegram groups
// @author       rfve
// @include        /^https?:\/\/(www|smile)\.amazon\.(cn|in|co\.jp|sg|ae|fr|de|it|nl|es|co\.uk|ca|com(\.(mx|au|br|tr))?)\/.*(dp|gp\/(product|video)|exec\/obidos\/ASIN|o\/ASIN)\/.*$/
// @require       https://code.jquery.com/jquery-3.6.4.min.js
// @grant         GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    const sendPhotoToTelegram = (imageSrc, caption) => {
        // Replace 'YOUR_TELEGRAM_BOT_API_KEY' with your bot API key
        const apiKey = '8188026:AAE2GAQUfndCUoNVjL5TNAYAWSEAIQ';

        // Replace 'YOUR_CHAT_IDS' with an array of your chat IDs
        const chatIds = ['-1001287724', '-1000329146'];

        const apiUrl = `https://api.telegram.org/bot${apiKey}/sendPhoto`;

        chatIds.forEach((chatId) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: apiUrl,
                data: `chat_id=${chatId}&photo=${encodeURIComponent(imageSrc)}&caption=${encodeURIComponent(caption)}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
        });
    };

    const getProductDetails = () => {
        const asin = jQuery("#ASIN").val();
        const productName = document.querySelector("#productTitle").textContent.trim();
        const productPrice = document.querySelector("#corePrice_feature_div > div > div > span.a-price.aok-align-center > span.a-offscreen").textContent.replace("TL", ' TL');
        const productLink = window.location.href;
        const productImage = document.querySelector("#landingImage").src;
        const ref = 'https://www.amazon.com.tr/dp/' + asin + '?tag=indirimtim_10222-21&smid=A1UNQM1SR2CHM&th=1&psc=1';
        const variants = getVariants();
        const productDetails = `${productName}\n\n${productPrice}\n\n${ref}\n\n${variants.join('\n')}\n\n#işbirliği`;

        sendPhotoToTelegram(productImage, productDetails);
    };

    const getVariants = () => {
        const variants = [];
        const variantItems = document.querySelectorAll('.swatch-list-item-text');

        variantItems.forEach((item) => {
            const size = item.querySelector('.swatch-title-text').innerText.trim();
            const priceElement = item.querySelector('.twisterSwatchPrice');
            let price = null;

            if (priceElement) {
                price = priceElement.innerText.trim();
            }

            if (price !== null) {
                variants.push(`${size} - ${price}`);
            }
        });

        return variants;
    };

    // Add a button to the Amazon page
    const addButtonToPage = () => {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.bottom = '20px';
        buttonContainer.style.right = '20px';
        buttonContainer.style.zIndex = '9999';

        const shareButton = document.createElement('button');
        shareButton.innerText = 'Telegrama Gönder';
        shareButton.style.padding = '10px';
        shareButton.style.cursor = 'pointer';
        shareButton.addEventListener('click', getProductDetails);

        buttonContainer.appendChild(shareButton);
        document.body.appendChild(buttonContainer);
    };

    addButtonToPage();
})();
