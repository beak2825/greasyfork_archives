// ==UserScript==
// @name         Goo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  GooGooGoo
// @match        https://www.goopi.co/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509221/Goo.user.js
// @updateURL https://update.greasyfork.org/scripts/509221/Goo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isSearching = false;
    let isCollapsed = false;

    function createGUI() {
        if (document.getElementById('quick-purchase-assistant')) return;

        const gui = document.createElement('div');
        gui.id = 'quick-purchase-assistant';
        gui.style.cssText = `
            position: fixed;
            top: 40px;
            right: 110px;
            background: white;
            border: 2px solid rgb(255, 123, 26);
            padding: 10px;
            z-index: 9999;
            width: 210px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            border-radius: 8px;
            font-family: Arial, sans-serif;
        `;
        gui.innerHTML = `
            <div id="quick-purchase-header" style="cursor: move; padding: 10px; background: rgb(255, 123, 26); color: white; margin: -10px -10px 10px -10px; border-radius: 6px 6px 0 0;">
                快速購買助手
                <button id="toggle-gui" style="float: right; background: none; color: white; border: none; font-size: 18px;">-</button>
            </div>
            <div id="gui-content">
                <div style="margin-bottom: 10px;">
                    <button id="add-product" style="background: rgb(255, 123, 26); color: white; border: none; padding: 5px; margin-right: 5px; border-radius: 4px;">添加商品</button>
                    <button id="remove-product" style="background: #f44336; color: white; border: none; padding: 5px; margin-right: 5px; border-radius: 4px;">刪除商品</button>
                    <button id="clear-products" style="background: #ff9800; color: white; border: none; padding: 5px; border-radius: 4px;">清空商品</button>
                </div>
                <div id="product-inputs"></div>
                <input type="text" id="quick-name" placeholder="姓名" style="display:block; margin-bottom:5px; width: 100%; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;">
                <input type="text" id="quick-phone" placeholder="電話" style="display:block; margin-bottom:5px; width: 100%; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;">
                <input type="text" id="quick-checkout-url" placeholder="結帳網址" style="display:block; margin-bottom:5px; width: 100%; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;">
                <input type="text" id="quick-company-name" placeholder="公司名稱" style="display:block; margin-bottom:5px; width: 100%; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;">
                <input type="text" id="quick-tax-id" placeholder="統一編號" style="display:block; margin-bottom:5px; width: 100%; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;">
                <button id="quick-purchase" style="width: 100%; background: black; color: white; border: none; padding: 10px; margin-bottom: 5px; border-radius: 4px;">快速購買</button>
                <button id="direct-checkout" style="width: 100%; background: black; color: white; border: none; padding: 10px; border-radius: 4px;">直接結帳</button>
            </div>
        `;
        document.body.appendChild(gui);

        document.getElementById('quick-purchase').addEventListener('click', quickPurchase);
        document.getElementById('direct-checkout').addEventListener('click', directCheckout);
        document.getElementById('add-product').addEventListener('click', () => addProductInput());
        document.getElementById('remove-product').addEventListener('click', removeLastProduct);
        document.getElementById('clear-products').addEventListener('click', clearAllProducts);
        document.getElementById('toggle-gui').addEventListener('click', toggleGUI);

        const savedInputs = JSON.parse(localStorage.getItem('quickPurchaseInputs') || '{}');
        Object.keys(savedInputs).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = savedInputs[id];
        });

        ['quick-name', 'quick-phone', 'quick-checkout-url', 'quick-company-name', 'quick-tax-id'].forEach(id => {
            document.getElementById(id).addEventListener('input', saveInputs);
        });

        makeDraggable(gui);
        loadSavedProductInputs();
    }

    function loadSavedProductInputs() {
        const savedProductInputs = JSON.parse(localStorage.getItem('savedProductInputs') || '[]');
        if (savedProductInputs.length === 0) {
            addProductInput();
        } else {
            savedProductInputs.forEach((input, index) => {
                addProductInput(index, input.product, input.size);
            });
        }
    }

    function addProductInput(index = null, savedProduct = '', savedSize = '') {
        const productInputs = document.getElementById('product-inputs');
        index = index !== null ? index : productInputs.children.length;
        const productInput = document.createElement('div');
        productInput.innerHTML = `
            <div style="display: flex; margin-bottom: 5px;">
                <input type="text" id="quick-product-${index}" placeholder="輸入商品名稱" style="width: 150px; margin-right: 2px; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;" value="${savedProduct}" list="product-list-${index}">
                <input type="text" id="quick-size-${index}" placeholder="輸入尺寸" style="width: 30px; border: 1px solid rgb(255, 123, 26); border-radius: 4px; padding: 5px;" value="${savedSize}" list="size-list-${index}">
            </div>
            <datalist id="product-list-${index}" style="width: calc(100% - 5px);"></datalist>
            <datalist id="size-list-${index}">
                <option value="0號">
                <option value="1號">
                <option value="2號">
                <option value="3號">
                <option value="4號">
                <option value="F">
            </datalist>
        `;
        productInputs.appendChild(productInput);
        setupDropdowns(index);
        populateProductOptions(index);
        saveProductInputs();
    }

    function removeLastProduct() {
        const productInputs = document.getElementById('product-inputs');
        if (productInputs.children.length > 0) {
            productInputs.removeChild(productInputs.lastChild);
            saveProductInputs();
        }
    }

    function clearAllProducts() {
        const productInputs = document.getElementById('product-inputs');
        productInputs.innerHTML = '';
        addProductInput();
        saveProductInputs();
    }

    function setupDropdowns(index) {
        const productInput = document.getElementById(`quick-product-${index}`);
        const sizeInput = document.getElementById(`quick-size-${index}`);

        productInput.addEventListener('input', saveProductInputs);
        sizeInput.addEventListener('input', saveProductInputs);
    }

    function saveProductInputs() {
        const productInputs = document.getElementById('product-inputs').children;
        const savedInputs = [];
        for (let i = 0; i < productInputs.length; i++) {
            const product = document.getElementById(`quick-product-${i}`).value;
            const size = document.getElementById(`quick-size-${i}`).value;
            savedInputs.push({ product, size });
        }
        localStorage.setItem('savedProductInputs', JSON.stringify(savedInputs));
    }

    function makeDraggable(element) {
        const header = document.getElementById('quick-purchase-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function saveInputs() {
        const inputs = {};
        ['quick-name', 'quick-phone', 'quick-checkout-url', 'quick-company-name', 'quick-tax-id'].forEach(id => {
            inputs[id] = document.getElementById(id).value;
        });
        localStorage.setItem('quickPurchaseInputs', JSON.stringify(inputs));
    }

    function populateProductOptions(index) {
        const productList = document.getElementById(`product-list-${index}`);
        productList.innerHTML = ''; // 清空現有選項

        const products = document.querySelectorAll('.productList__product .title');
        products.forEach(product => {
            const productText = product.textContent.trim();
            const option = document.createElement('option');
            option.value = productText;
            productList.appendChild(option);
        });
    }

    async function quickPurchase() {
        if (isSearching) return;
        isSearching = true;
        const name = document.getElementById('quick-name').value;
        const phone = document.getElementById('quick-phone').value;
        const checkoutUrl = document.getElementById('quick-checkout-url').value;
        const companyName = document.getElementById('quick-company-name').value;
        const taxId = document.getElementById('quick-tax-id').value;

        localStorage.setItem('quickCheckoutInfo', JSON.stringify({name, phone, checkoutUrl, companyName, taxId}));

        const productInputs = document.getElementById('product-inputs').children;
        for (let i = 0; i < productInputs.length; i++) {
            const productName = document.getElementById(`quick-product-${i}`).value;
            const size = document.getElementById(`quick-size-${i}`).value;
            await addToCart(productName, size, i === productInputs.length - 1);
        }

        const savedInfo = JSON.parse(localStorage.getItem('quickCheckoutInfo') || '{}');
        const finalCheckoutUrl = savedInfo.checkoutUrl || 'https://www.goopi.co/checkout';
        await new Promise(resolve => setTimeout(resolve, 500)); // 等待0.5秒
        window.location.href = finalCheckoutUrl;
        isSearching = false;
    }

    async function addToCart(productName, size, isLast) {
        const products = document.querySelectorAll('.productList__product');
        const keywords = productName.toLowerCase().split(' ');

        for (let product of products) {
            const titleElement = product.querySelector('.title');
            if (titleElement) {
                const productText = titleElement.textContent.trim().toLowerCase();
                if (keywords.every(keyword => productText.includes(keyword))) {
                    const addToCartButton = product.querySelector('.btn-add-to-cart.js-btn-add-to-cart');
                    if (addToCartButton) {
                        if (size.toUpperCase() === 'F') {
                            addToCartButton.click();
                            await waitForModalToClose();

                            if (isLast) {
                                const savedInfo = JSON.parse(localStorage.getItem('quickCheckoutInfo') || '{}');
                                const finalCheckoutUrl = savedInfo.checkoutUrl || 'https://www.goopi.co/checkout';
                                await new Promise(resolve => setTimeout(resolve, 500)); // 等待0.5秒
                                window.location.href = finalCheckoutUrl;
                            }

                            return;
                        } else {
                            addToCartButton.click();
                            await waitForElement('.selectpicker.js-selectpicker');
                            await new Promise(resolve => setTimeout(resolve, 500));

                            const sizeSelector = document.querySelector('.selectpicker.js-selectpicker');
                            if (sizeSelector) {
                                let sizeOption = Array.from(sizeSelector.options).find(option => option.textContent.trim().toLowerCase() === size.toLowerCase());
                                if (sizeOption) {
                                    sizeOption.selected = true;
                                    sizeSelector.dispatchEvent(new Event('change', { bubbles: true }));
                                } else {
                                    console.log('未找到指定尺寸，使用默認尺寸');
                                }
                            }

                            await new Promise(resolve => setTimeout(resolve, 300));

                            const addToCartButtonFinal = document.querySelector('#btn-add-to-cart');
                            if (addToCartButtonFinal) {
                                addToCartButtonFinal.click();
                                await waitForModalToClose();

                                if (isLast) {
                                    const savedInfo = JSON.parse(localStorage.getItem('quickCheckoutInfo') || '{}');
                                    const finalCheckoutUrl = savedInfo.checkoutUrl || 'https://www.goopi.co/checkout';
                                    await new Promise(resolve => setTimeout(resolve, 500)); // 等待0.5秒
                                    window.location.href = finalCheckoutUrl;
                                }

                                return;
                            }
                        }
                    }
                }
            }
        }
        alert(`未找到指定商品: ${productName}`);
    }

    function waitForModalToClose() {
        return new Promise(resolve => {
            const observer = new MutationObserver(() => {
                const modal = document.querySelector('.modal-body');
                if (!modal) {
                    observer.disconnect();
                    resolve();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function waitForElement(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    async function fillCheckoutForm() {
        const savedInfo = JSON.parse(localStorage.getItem('quickCheckoutInfo') || '{}');

        fillForm('order[delivery_data][recipient_name]', savedInfo.name);
        fillForm('order[delivery_data][recipient_phone]', savedInfo.phone);
        fillForm('order[customer_phone]', savedInfo.phone);

        const invoiceTypeSelect = document.querySelector('#invoice-type');
        if (invoiceTypeSelect) {
            invoiceTypeSelect.value = '2';
            invoiceTypeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        await waitForElement('#invoice-buyer-name');
        fillForm('order[invoice][buyer_name]', savedInfo.companyName);

        await waitForElement('#invoice-tax-id');
        fillForm('order[invoice][tax_id]', savedInfo.taxId);

        const policyCheckbox = document.querySelector('input[name="policy"]');
        if (policyCheckbox && !policyCheckbox.checked) {
            policyCheckbox.checked = true;
        }
    }

    function fillForm(fieldName, value) {
        const field = document.querySelector(`input[name="${fieldName}"], textarea[name="${fieldName}"]`);
        if (field) {
            field.value = value;
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function directCheckout() {
        const name = document.getElementById('quick-name').value;
        const phone = document.getElementById('quick-phone').value;
        const checkoutUrl = document.getElementById('quick-checkout-url').value;
        const companyName = document.getElementById('quick-company-name').value;
        const taxId = document.getElementById('quick-tax-id').value;

        localStorage.setItem('quickCheckoutInfo', JSON.stringify({name, phone, checkoutUrl, companyName, taxId}));

        window.location.href = checkoutUrl || 'https://www.goopi.co/checkout';
    }

    function toggleGUI() {
        const content = document.getElementById('gui-content');
        const toggleButton = document.getElementById('toggle-gui');
        if (isCollapsed) {
            content.style.display = 'block';
            toggleButton.textContent = '-';
        } else {
            content.style.display = 'none';
            toggleButton.textContent = '+';
        }
        isCollapsed = !isCollapsed;
    }

    function init() {
        createGUI();

        if (window.location.pathname.startsWith('/checkout')) {
            const savedInfo = JSON.parse(localStorage.getItem('quickCheckoutInfo') || '{}');
            if (Object.keys(savedInfo).length > 0) {
                setTimeout(fillCheckoutForm, 500);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();