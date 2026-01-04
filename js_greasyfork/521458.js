// ==UserScript==
// @name         BT-QC Tools: Easy add Goofish to Basetao
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a form and button to add items to Basetao on Goofish pages
// @author       Kaj
// @match        https://www.goofish.com/item*
// @grant        GM_xmlhttpRequest
// @connect      basetao.com
// @connect      www.basetao.com
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goofish.com
// @downloadURL https://update.greasyfork.org/scripts/521458/BT-QC%20Tools%3A%20Easy%20add%20Goofish%20to%20Basetao.user.js
// @updateURL https://update.greasyfork.org/scripts/521458/BT-QC%20Tools%3A%20Easy%20add%20Goofish%20to%20Basetao.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CSRF_REQUIRED_ERROR = "You need to be logged in on BaseTao to use this extension (CSRF required).";

    class BaseTao {
        constructor() {
            this.parser = new DOMParser();
        }

        async getCSRFToken(domain) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${domain}/best-taobao-agent-service/how_make/buy_order.html`,
                    onload: (response) => {
                        if (response.responseText.includes("please sign in again")) {
                            reject(new Error(CSRF_REQUIRED_ERROR));
                            return;
                        }
                        const doc = this.parser.parseFromString(response.responseText, "text/html");
                        const csrfToken = doc.querySelector("input[name=bt_sb_token]");
                        if (csrfToken && csrfToken.value.length !== 0) {
                            resolve(csrfToken.value);
                        } else {
                            reject(new Error(CSRF_REQUIRED_ERROR));
                        }
                    },
                    onerror: () => reject(new Error("Failed to get CSRF token"))
                });
            });
        }

        async getDomain() {
            try {
                await this.getCSRFToken("https://www.basetao.com");
                return "https://www.basetao.com";
            } catch (error) {
                try {
                    await this.getCSRFToken("https://basetao.com");
                    return "https://basetao.com";
                } catch (error) {
                    throw new Error(CSRF_REQUIRED_ERROR);
                }
            }
        }

        async submitOrder(formData) {
            try {
                const domain = await this.getDomain();
                const csrf = await this.getCSRFToken(domain);

                const orderData = {
                    addtime: Date.now(),
                    goodscolor: formData.color || "-",
                    goodsimg: formData.imageUrl || "",
                    goodsname: formData.itemName,
                    goodsnum: 1,
                    goodsprice: formData.price,
                    goodsremark: "",
                    goodsseller: formData.seller,
                    goodssite: "goofish",
                    goodssize: formData.size || "-",
                    goodsurl: formData.link,
                    item_id: formData.link.split("?id=")[1] || "",
                    sellerurl: "",
                    sendprice: formData.shippingPrice,
                    siteurl: window.location.hostname,
                    sku_id: 0,
                    type: 1
                };

                const requestData = {
                    bt_sb_token: csrf,
                    data: JSON.stringify(orderData)
                };

                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `${domain}/best-taobao-agent-service/bt_action/add_cart`,
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                            'Origin': domain,
                            'Referer': `${domain}/best-taobao-agent-service/how_make/buy_order.html`,
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        data: new URLSearchParams(requestData).toString(),
                        onload: (response) => {
                            try {
                                const responseData = JSON.parse(response.responseText);
                                if (responseData.value === "1") {
                                    resolve();
                                } else {
                                    reject(new Error("Item could not be added, make sure you are logged in"));
                                }
                            } catch (e) {
                                reject(new Error("Invalid response from BaseTao"));
                            }
                        },
                        onerror: () => reject(new Error("Failed to connect to BaseTao"))
                    });
                });
            } catch (error) {
                throw error;
            }
        }
    }

    function getImageUrl() {
        const imageElement = document.querySelector('#content > div.item-container--yLJD5VZj > div.item-main-container--jhpFKlaS > div.item-main-window--BgQbsIsU > div.item-main-window-carousel--OJQgNH3d > div.carousel-container--DdMer_ii > div.carousel--MBcZaegk > div > div > div > div > div.slick-slide.slick-active.slick-current > div > div > img');
        if (imageElement) {
            return imageElement.src;
        }
        return '';
    }

    function getAllImageUrls() {
        const imageContainer = document.querySelector('.item-main-window-list--od7DK4Fm');
        if (!imageContainer) return [];

        const images = imageContainer.querySelectorAll('img.fadeInImg--DnykYtf4');
        return Array.from(images).map(img => {
            // Convert relative URLs to absolute URLs and remove webp extension
            let url = img.src;
            if (url.startsWith('//')) {
                url = 'https:' + url;
            }
            return url.replace('_.webp', '');
        });
    }

    function createImageSelector(images) {
        const div = document.createElement('div');
        div.style.marginBottom = '10px';

        const label = document.createElement('label');
        label.textContent = 'Select Image: ';
        label.style.display = 'block';
        label.style.marginBottom = '5px';

        const imageSelect = document.createElement('div');
        imageSelect.style.display = 'flex';
        imageSelect.style.flexWrap = 'wrap';
        imageSelect.style.gap = '10px';
        imageSelect.style.maxHeight = '200px';
        imageSelect.style.overflowY = 'auto';

        images.forEach((imageUrl, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.style.position = 'relative';
            imgContainer.style.width = '80px';
            imgContainer.style.height = '80px';
            imgContainer.style.border = '2px solid transparent';
            imgContainer.style.cursor = 'pointer';

            const img = document.createElement('img');
            img.src = imageUrl;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'selectedImage';
            radio.value = imageUrl;
            radio.style.position = 'absolute';
            radio.style.top = '5px';
            radio.style.left = '5px';
            if (index === 0) radio.checked = true;

            imgContainer.appendChild(img);
            imgContainer.appendChild(radio);

            // Add click handler for the entire container
            imgContainer.addEventListener('click', () => {
                radio.checked = true;
            });

            imageSelect.appendChild(imgContainer);
        });

        div.appendChild(label);
        div.appendChild(imageSelect);
        return div;
    }

    function createFormField(label, id, value = '') {
        const div = document.createElement('div');
        div.style.marginBottom = '12px';
        div.style.maxWidth = '600px'; // Added max-width for better alignment

        const labelElement = document.createElement('label');
        labelElement.textContent = label + ': ';
        labelElement.htmlFor = id;
        labelElement.style.display = 'block';
        labelElement.style.marginBottom = '6px';
        labelElement.style.fontSize = '14px';
        labelElement.style.color = '#333';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.value = value;
        input.style.width = '100%';
        input.style.padding = '8px 12px';
        input.style.borderRadius = '6px';
        input.style.border = '1px solid #d9d9d9';
        input.style.fontSize = '14px';
        input.style.transition = 'border-color 0.3s ease';
        input.style.boxSizing = 'border-box'; // Added to include padding in width calculation

        // Add hover and focus effects
        input.addEventListener('hover', () => {
            input.style.borderColor = '#40a9ff';
        });

        input.addEventListener('focus', () => {
            input.style.borderColor = '#40a9ff';
            input.style.outline = 'none';
            input.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)';
        });

        div.appendChild(labelElement);
        div.appendChild(input);
        return div;
    }

    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '16px 24px';
        notification.style.backgroundColor = isError ? '#ff4d4f' : '#52c41a';
        notification.style.color = 'white';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        notification.style.minWidth = '250px';
        notification.style.maxWidth = '400px';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = '500';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        notification.style.transition = 'all 0.3s ease-in-out';

        // Add icon based on type
        const icon = document.createElement('span');
        icon.style.marginRight = '12px';
        icon.style.fontSize = '18px';
        icon.textContent = isError ? '✕' : '✓';

        notification.appendChild(icon);
        notification.appendChild(document.createTextNode(message));

        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // Remove notification with fade out
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Get data functions
    function getPrice() {
        const priceElement = document.querySelector('.price--OEWLbcxC');
        if (priceElement) {
            return priceElement.textContent.trim();
        }
        return '';
    }

    function getItemName() {
        const nameElement = document.querySelector('.main--Nu33bWl6.open--gEYf_BQc span span span');
        if (nameElement) {
            return nameElement.textContent.trim();
        }
        return '';
    }

    function getSeller() {
        const sellerElement = document.querySelector('.item-user-info-nick--rtpDhkmQ');
        if (sellerElement) {
            return sellerElement.textContent.trim();
        }
        return '';
    }

    function findContainer() {
        const containers = [
            '.notLoginContainer--hQCDYhxp',
            '.item-main-info--ExVwW2NW',
            '.value--EyQBSInp'
        ];

        for (const selector of containers) {
            const container = document.querySelector(selector);
            if (container) {
                return container;
            }
        }

        return null;
    }

    function addBasetaoForm() {
        const container = findContainer();
        if (container && !document.querySelector('#basetaoForm')) {
            // Create form container
            const formContainer = document.createElement('div');
            formContainer.id = 'basetaoForm';
            formContainer.style.padding = '20px';
            formContainer.style.marginBottom = '15px';
            formContainer.style.backgroundColor = '#f5f5f5';
            formContainer.style.borderRadius = '8px';
            formContainer.style.maxWidth = '600px';

            // Add form fields
            const itemName = getItemName();
            const seller = getSeller();
            const price = getPrice();

            formContainer.appendChild(createFormField('Item Name', 'basetaoItemName', itemName));
            formContainer.appendChild(createFormField('Seller', 'basetaoSeller', seller));
            formContainer.appendChild(createFormField('Link', 'basetaoLink', window.location.href));
            formContainer.appendChild(createFormField('Size', 'basetaoSize'));
            formContainer.appendChild(createFormField('Color', 'basetaoColor'));
            formContainer.appendChild(createFormField('Price', 'basetaoPrice', price));
            formContainer.appendChild(createFormField('Shipping Price', 'basetaoShipping', '10'));

            const basetao = new BaseTao();

            // Create button
            const basetaoButton = document.createElement('button');
            basetaoButton.id = 'basetaoButton';
            basetaoButton.textContent = 'Add to Basetao';
            basetaoButton.style.padding = '10px 20px';
            basetaoButton.style.marginTop = '12px';
            basetaoButton.style.backgroundColor = '#FFA500';
            basetaoButton.style.color = '#fff';
            basetaoButton.style.border = 'none';
            basetaoButton.style.borderRadius = '6px';
            basetaoButton.style.cursor = 'pointer';
            basetaoButton.style.width = '100%';
            basetaoButton.style.fontSize = '14px';
            basetaoButton.style.fontWeight = '500';
            basetaoButton.style.transition = 'background-color 0.3s ease';

            basetaoButton.addEventListener('mouseenter', () => {
                basetaoButton.style.backgroundColor = '#ff9000';
            });

            basetaoButton.addEventListener('mouseleave', () => {
                basetaoButton.style.backgroundColor = '#FFA500';
            });


            basetaoButton.addEventListener('click', async () => {
        try {
            const formData = {
                itemName: document.getElementById('basetaoItemName').value,
                seller: document.getElementById('basetaoSeller').value,
                link: document.getElementById('basetaoLink').value,
                size: document.getElementById('basetaoSize').value,
                color: document.getElementById('basetaoColor').value,
                price: document.getElementById('basetaoPrice').value,
                shippingPrice: document.getElementById('basetaoShipping').value,
                imageUrl: getImageUrl() // Add the image URL to the form data
            };

            await basetao.submitOrder(formData);
            showNotification('Successfully added to Basetao!');
        } catch (error) {
            showNotification(error.message, true);
        }
    });

            formContainer.appendChild(basetaoButton);
            container.appendChild(formContainer);
        }
    }

    // Try to add the form multiple times as the page loads
    const attemptToAdd = () => {
        addBasetaoForm();
    };

    // Initial attempts with delays
    setTimeout(attemptToAdd, 1000);
    setTimeout(attemptToAdd, 2000);
    setTimeout(attemptToAdd, 3000);

    // Use MutationObserver for dynamic updates
    const observer = new MutationObserver((mutations) => {
        attemptToAdd();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial attempt
    attemptToAdd();
})();