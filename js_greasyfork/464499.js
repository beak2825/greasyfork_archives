// ==UserScript==
// @name Aplica DTOs en Miravia
// @description Aplica DTOs vigentes en Miravia.es
// @match https://www.miravia.es/p*
// @grant GM_addStyle
// @version 1.8.2
// @icon https://img.mrvcdn.com/us/media/7bada92e11dd275f27772c5ee02194ae.png
// @namespace https://greasyfork.org/users/1064385
// @downloadURL https://update.greasyfork.org/scripts/464499/Aplica%20DTOs%20en%20Miravia.user.js
// @updateURL https://update.greasyfork.org/scripts/464499/Aplica%20DTOs%20en%20Miravia.meta.js
// ==/UserScript==
function applyDiscount(price, coupons) {
    var checkShipping = document.querySelector('div.kRBJOsALVT');
    var shippingFlag = checkShipping ? checkShipping.textContent : '';

    var articlesSelected = document.querySelector('input.iweb-stepper-input');

    let originalPrice = price;

    if (articlesSelected && articlesSelected.value > 1) {
        originalPrice = originalPrice * articlesSelected.value;
    }

    const discount2ndPurchase = originalPrice >= 15 ? Math.min(originalPrice, 5) : 0;
    var discount2ndPurchasePrice = (originalPrice - discount2ndPurchase).toFixed(2);

    const twentyPercentDiscount = originalPrice >= 10 ? Math.min(originalPrice * 0.20, 10) : 0;
    var twentyPercentDiscountPrice = (originalPrice - twentyPercentDiscount).toFixed(2);
    if (coupons && coupons.type) {
        var couponDiscount = coupons.type === "€" ? parseFloat(coupons.value) : (originalPrice * (parseFloat(coupons.value) / 100));
        var couponType = coupons.type === "€" ? '€' : '%';

        if (coupons.maxDiscount) {
            var maxDiscount = parseFloat(coupons.maxDiscount);
            couponDiscount = Math.min(couponDiscount, maxDiscount);
        }

        var priceWithCoupon = (originalPrice - couponDiscount).toFixed(2);
    }


    /*if (shippingFlag !== 'GRATIS' && shippingFlag !== 'Envío gratis aplicable' && !(articlesSelected.value > 1 && originalPrice > 17.9)) {
        if (originalPrice < 17.90) {
            createlowerThan10Price();
            discount2ndPurchasePrice = (parseFloat(discount2ndPurchasePrice) + 3.89).toFixed(2);
            twentyPercentDiscountPrice = (parseFloat(twentyPercentDiscountPrice) + 3.89).toFixed(2);
            priceWithCoupon = priceWithCoupon !== undefined ? (parseFloat(priceWithCoupon) + 3.89).toFixed(2) : undefined;
        }
    }*/

    if (originalPrice < 10) {
        createlowerThan10Price();
        discount2ndPurchasePrice = (parseFloat(discount2ndPurchasePrice) + 3.89).toFixed(2);
        twentyPercentDiscountPrice = (parseFloat(twentyPercentDiscountPrice) + 3.89).toFixed(2);
        priceWithCoupon = priceWithCoupon !== undefined ? (parseFloat(priceWithCoupon) + 3.89).toFixed(2) : undefined;
    }

    var prices = [discount2ndPurchasePrice, twentyPercentDiscountPrice, priceWithCoupon];
    var lowestPrice = prices.reduce(function(a, b) {
        if (isNaN(a)) return b;
        if (isNaN(b)) return a;
        return Math.min(a, b);
    });
    var text = `<span style="font-size: 25px;"><strong style="color: ${discount2ndPurchasePrice == lowestPrice ? 'green' : 'red'};">${discount2ndPurchasePrice.replace('.', ',')}€</strong> → Precio final 2ª compra</span>\n`;
    text += `<span style="font-size: 25px;"><strong style="color: ${twentyPercentDiscountPrice == lowestPrice ? 'green' : 'red'};">${twentyPercentDiscountPrice.replace('.', ',')}€</strong> → Precio final bienvenida</span>\n`;
    text += priceWithCoupon !== undefined ? `<span style="font-size: 25px;"><strong style="color: ${priceWithCoupon == lowestPrice ? 'green' : 'red'};">${priceWithCoupon.replace('.', ',')}€</strong> → Precio final con cupones</span>` : '';
    return text;
}

var priceElement = document.querySelector('#module_item-gallery-new .divider + div > div:first-child > div:first-child > div:first-child');

var price = priceElement.textContent;
price = price.replace(",", ".");
price = parseFloat(price).toFixed(2);

function getMaxDiscountFromTerms(coupon) {
    try {
        return parseFloat(
            coupon.termsAndConditions
            .map((d) => d.subTC)
            .flat(1)
            .find((t) => t.content.includes("Descuento máximo"))
            .content.match(/([\d,]+)(?=€)/)[0]
            .replace(".", "")
            .replace(",", ".")
        );
    } catch (error) {}

    return null;
}

function getProductCoupons() {
    let coupons;

    // eslint-disable-next-line
    if (moduleData.data.root.fields.vouchers) {
        // eslint-disable-next-line
        const defaultSkuId = moduleData.data.root.fields.globalConfig.defaultSkuId;
        // eslint-disable-next-line
        const voucherSections = moduleData.data.root.fields.vouchers[defaultSkuId]?.popInfo?.voucherSections;
        if (voucherSections) {
            const couponFilter = (dd) => !(dd.mainTitle === "Cupón de bienvenida");
            const filteredVouchers = voucherSections.map((d) => d.voucherList.filter(couponFilter)).filter((d) => d.length);

            coupons = filteredVouchers.flat(1);
        }
        console.log(coupons);
    }

    if (coupons) {
        try {
            // eslint-disable-next-line
            let val = parseFloat(moduleData.data.root.fields.flexi_combo[moduleData.data.root.fields.globalConfig.defaultSkuId].rollingTextModel.rollingTextContent[0].match(/\d{1,3}(?=%)/)[0]);
            coupons.push({
                minOrderAmount: 0,
                discountValue: val,
                discountType: 2
            });
        } catch (error) {}

        let usedCoupon;
        coupons = coupons.filter((coupon) => price >= coupon.minOrderAmount / 100);

        if (coupons.length > 0) {
            let percentCoupon = (coupons.filter((coupon) => coupon.discountType === 2).sort((a, b) => b.discountValue - a.discountValue) || [])[0];
            let percentCouponDiscount = 0;
            let normalCoupon = (coupons.filter((coupon) => coupon.discountType === 1).sort((a, b) => b.discountValue - a.discountValue) || [])[0];
            let normalCouponDiscount = 0;
            let maxDiscount = null;

            if (percentCoupon) {
                percentCouponDiscount = price / percentCoupon.discountValue;
                maxDiscount = getMaxDiscountFromTerms(percentCoupon);
            }

            if (normalCoupon) {
                normalCouponDiscount = normalCoupon.discountValue / 100;
                maxDiscount = getMaxDiscountFromTerms(normalCoupon);
            }

            if (percentCouponDiscount > normalCouponDiscount) {
                usedCoupon = {
                    value: percentCoupon.discountValue,
                    type: "%"
                };
            } else {
                usedCoupon = {
                    value: normalCoupon.discountValue / 100,
                    type: "€"
                };
            }

            if (usedCoupon) {
                usedCoupon.maxDiscount = maxDiscount;
                return usedCoupon;
            }
        }
    }
}

function createDiscountPrice(coupons) {
    removeDivs();
    document.querySelector("#module_item-gallery-new .divider + div > div:first-child > div:first-child > div:first-child").parentNode.style.flexWrap = 'wrap';
    var newElem = document.createElement('div');
    newElem.classList.add('div-for-coupons');
    newElem.style.width = '100%';
    newElem.style.width = '100%';
    newElem.style.fontSize = '20px';

    var textLines = applyDiscount(price, coupons).split('\n');
    for (var i = 0; i < textLines.length; i++) {
        var line = textLines[i];
        var lineElem = document.createElement('p');
        lineElem.classList.add('div-for-coupons');
        lineElem.innerHTML = line;
        newElem.appendChild(lineElem);
    }

    priceElement.parentNode.insertBefore(newElem, priceElement);
}

function createlowerThan10Price() {
    removeDivs();
    document.querySelector("#module_item-gallery-new .divider + div > div:first-child > div:first-child > div:first-child").parentNode.style.flexWrap = 'wrap'
    var newElem = document.createElement('div');
    newElem.classList.add('div-for-coupons');
    newElem.style.width = '100%';
    newElem.style.width = '100%';
    newElem.style.fontSize = '20px';
    newElem.innerHTML = '⚠️<strong>Envío añadido al precio</strong>⚠️';
    priceElement.parentNode.insertBefore(newElem, priceElement);
}

function removeDivs() {
    let divParaCupones = document.querySelectorAll('.div-for-coupons');

    if (divParaCupones.length)[...divParaCupones].map(elem => elem.remove());
}

window.onload = (event) => {
    var priceElement = document.querySelector('#module_item-gallery-new .divider + div > div:first-child > div:first-child > div:first-child');
    const articlesSelected = document.querySelector('input.iweb-stepper-input');

    const observer = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'characterData') {
                price = priceElement.textContent;
                price = price.replace(',', '.')
                price = parseFloat(price).toFixed(2);;
                var coupons = getProductCoupons()
                createDiscountPrice(coupons);

                break;
            }
        }
    });

    const articlesObserver = new MutationObserver(function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                var coupons = getProductCoupons()
                createDiscountPrice(coupons);
                break;
            }
        }
    });

    if (priceElement) {
        observer.observe(priceElement, {
            characterData: true,
            subtree: true
        });
    }

    if (articlesSelected) {
        articlesObserver.observe(articlesSelected, {
            attributes: true
        });
    }
    var coupons = getProductCoupons();
    createDiscountPrice(coupons);
    var originalPrice = price;

    var inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.marginTop = '6px';

    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.width = '140px';
    inputField.style.maxWidth = '200px';
    inputField.style.marginRight = '10px';
    inputField.placeholder = 'Intr. precio manual';
    inputField.style.margin = '5px';
    inputField.style.border = '4px solid #b7b1fc';
    inputField.style.textAlign = 'center';

    inputField.addEventListener('input', function() {
        var inputValue = inputField.value;
        var validInput = /^[\d.,]*$/.test(inputValue);

         if (validInput || inputValue.endsWith('€')) {
            if (validInput) {
                inputValue = inputValue.replace(',', '.');
                price = parseFloat(inputValue);
            }
        } else {
            inputField.value = '';
            price = originalPrice;
        }

        if (inputValue == ''){
            price = originalPrice;
        }

        var coupons = getProductCoupons();
        createDiscountPrice(coupons);
    });

    inputField.addEventListener('click', function() {
        if (inputField.value === 'Intr. precio manual') {
            inputField.value = '';
            price = originalPrice;
        }
    });

    inputContainer.appendChild(inputField);

    var priceContainer = priceElement.parentNode;
    priceContainer.insertBefore(inputContainer, priceElement.nextSibling);

    priceElement.style.marginRight = '1px';
    inputContainer.style.marginLeft = '5px';

}