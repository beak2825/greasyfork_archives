// ==UserScript==
// @name         Aliexpress Coupons
// @namespace    https://greasyfork.org/users/1064385
// @version      1.7.5
// @description  Muestra cupones vendedor aliexpress y otros datos
// @author       xxdamage
// @match        https://es.aliexpress.com/*
// @icon https://ps.w.org/woo-aliexpress/assets/icon-256x256.png?rev=2162754
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467377/Aliexpress%20Coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/467377/Aliexpress%20Coupons.meta.js
// ==/UserScript==

async function getNewPriceValue(url) {
  try {
    const response = await fetch(url, {
      headers: {
        Cookie: "ali_apache_id=33.1.223.138.1678690335258.223790.2; intl_locale=es_ES; acs_usuc_t=x_csrf=13p41ymxi35x8&acs_rt=a5b16741dbf7470aa356e5bd64ca7ce6; _gcl_au=1.1.1599716765.1678690339; _ga=GA1.1.404028999.1678690341; cna=BIUYHLF3nHgCAbqn+ajpKdga; ali_apache_track=; ali_apache_tracktmp=; e_id=pt20; _ga_VED1YSGNC7=deleted; af_ss_a=1; af_ss_b=1; traffic_se_co=%7B%7D; account_v=1; aeu_cid=a625aaf3a0ec48e6a782b299ce27a7f6-1684429125436-00655-R7XcloM; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%091005004412629234%0932837298303%091005004396877422%091005005292045061%0933044155956%091005004978616786%091005005278101003%091005005138989444; _m_h5_tk=81a82b480b5d7456af86239591a3c698_1686138244630; _m_h5_tk_enc=cd36843eb6696c88fe39da9e6f549ff1; xman_us_f=x_locale=es_ES&x_l=0&x_c_chg=0&x_as_i=%7B%22aeuCID%22%3A%22a625aaf3a0ec48e6a782b299ce27a7f6-1684429125436-00655-R7XcloM%22%2C%22af%22%3A%22281757%22%2C%22affiliateKey%22%3A%22R7XcloM%22%2C%22channel%22%3A%22AFFILIATE%22%2C%22cn%22%3A%2210008060050%22%2C%22cv%22%3A%222%22%2C%22isCookieCache%22%3A%22N%22%2C%22ms%22%3A%221%22%2C%22pid%22%3A%22915967719%22%2C%22tagtime%22%3A1684429125436%7D&acs_rt=a5b16741dbf7470aa356e5bd64ca7ce6; aep_usuc_f=site=esp&province=919971656567000000&city=919971656567047000&c_tp=EUR&ups_d=1|1|1|1&ups_u_t=1701684848123&region=ES&b_locale=es_ES&ae_u_p_s=2; l=fBOVFaleL4suyvxBBOfZFurza779sIRAguPzaNbMi9fPO95J55phW11v4bYvCnMNFsnWR3ooemrkBeYBq5Xn9kP78rW6PUMmn_vWSGf..; tfstk=coZlBF6bzzu7KCjLG7i5VNcgs3alZFxEskza09jVQpy85zEViBL27NuGnvC1ae1..; isg=BNraeMkralVmdeDk37mnF9isK4D8C17lirzD3eRTh204V3qRzJiW9BMtJztLh9Z9; _ga_VED1YSGNC7=GS1.1.1686136442.31.1.1686136459.43.0.0"
      }
    });

    const text = await response.text();
    const parser = new DOMParser();
    const document = parser.parseFromString(text, "text/html");
    var priceModule = text.match(/"priceModule":(.+?)"minAmount"/)[1];
    var prices = priceModule.match(/"value":(\d+\.\d+)/g);
    const priceValues = prices.map(item => parseFloat(item.match(/[\d.]+/)[0]));
    const lowestPrice = Math.min(...priceValues).toFixed(2);

    return lowestPrice || 0;
  } catch (error) {
    throw error;
  }
}



function getPriceValue() {
  let priceValue;

  const spanProductPrice = document.querySelector('div.product-price-current') || document.querySelector('span.product-price-value') || document.querySelector('span.uniform-banner-box-price')

  if (spanProductPrice) {
    const match = spanProductPrice.textContent.match(/(?:€\s*)?(\d+,\d+)/);
    if (match) {
      priceValue = match[1].replace(',', '.');
    }
  // eslint-disable-next-line
  } else if (runParams && runParams.data && runParams.data.priceModule && runParams.data.priceModule.minActivityAmount && runParams.data.priceModule.minActivityAmount.value) {
      // eslint-disable-next-line
    priceValue = runParams.data.priceModule.minActivityAmount.value;
  }

  return priceValue || 0;
}

function getProductCoupons() {
    let price = 0;

    let coupons = [];

    try {
        // eslint-disable-next-line
        let val = parseFloat(moduleData.data.root.fields.flexi_combo[moduleData.data.root.fields.globalConfig.defaultSkuId].rollingTextModel.rollingTextContent[0].match(/\d{1,3}(?=%)/)[0]);
        coupons.push({
            minOrderAmount: 0,
            discountValue: val,
            discountType: 2,
        })
    } catch (error) {}

    try {
        price = getPriceValue();
        // eslint-disable-next-line
        let aliexpressCoupons = runParams.data.couponModule.webCouponInfo.promotionPanelDTO.shopCoupon.map(d => d.promotionPanelDetailDTOList).flat().map(d => {
            let {
                promotionDesc,
                promotionDetail
            } = d;


            if (promotionDesc.includes(',')) {
                promotionDesc = promotionDesc.replace('.', '').replace(',', '.')
            }


            let coupon = {
                discountType: promotionDesc.includes('€') ? 1 : '%',
                discountValue: parseInt((parseFloat(promotionDesc.replace(/%|€/, '')) * 100).toFixed(0)),
            };

            let [, match] = promotionDetail.match(/En compras de ([^\n]+)€|€([^\n]+) o más/) || [];

            if (!match) return coupon;

            if (match.includes(',')) {
                match = match.replace('.', '').replace(',', '.')
            }

            coupon.minOrderAmount = parseInt((parseFloat(match) * 100).toFixed(0));

            coupon.code = d.attributes.couponCode

            return coupon;
        }).filter(d => d.minOrderAmount);
        coupons.push(...aliexpressCoupons);
    } catch (error) {}

        try {
        price = getPriceValue();
        // eslint-disable-next-line
        let aliexpressCoupons = runParams.data.webCouponInfoComponent.promotionPanelDTO.shopCoupon.map(d => d.promotionPanelDetailDTOList).flat(1).map(d => {

    let { promotionDesc, promotionDetail } = d;


    if (promotionDesc.includes(',')) {
        promotionDesc = promotionDesc.replace('.', '').replace(',', '.')
    }


    let coupon = {
        discountType: promotionDesc.includes('€') ? 1 : '%',
        discountValue: parseInt((parseFloat(promotionDesc.replace(/%|€/, '')) * 100).toFixed(0)),
    };

    let [, match] = promotionDetail.match(/En compras de ([^\n]+)€|€([^\n]+) o más/) || [];

    if (!match) return coupon;

    if (match.includes(',')) {
        match = match.replace('.', '').replace(',', '.')
    }

    coupon.minOrderAmount = parseInt((parseFloat(match) * 100).toFixed(0));

    coupon.code = d.attributes.couponCode

    return coupon;
}).filter(d => d.minOrderAmount);
        coupons.push(...aliexpressCoupons);
    } catch (error) {}

    let usedCoupon;

    coupons = coupons.filter(coupon => price >= coupon.minOrderAmount / 100);
    if (coupons.length > 0) {
        /**
         * discountType
         * 1 = euros
         * 2 = %
         */
        let percentCoupon = (coupons.filter(coupon => coupon.discountType == 2).sort((a, b) => b.discountValue - a.discountValue) || [])[0];
        let percentCouponDiscount = 0;
        let normalCoupon = (coupons.filter(coupon => coupon.discountType == 1).sort((a, b) => b.discountValue - a.discountValue) || [])[0];
        let normalCouponDiscount = 0;
        if (percentCoupon) percentCouponDiscount = price / percentCoupon.discountValue;
        if (normalCoupon) normalCouponDiscount = normalCoupon.discountValue / 100;
        if (percentCouponDiscount > normalCouponDiscount) {
            usedCoupon = {
                value: percentCoupon.discountValue,
                type: "%",
                code: percentCoupon.code || null,
            };
        } else {
            usedCoupon = {
                value: normalCoupon.discountValue / 100,
                type: "€",
                code: normalCoupon.code || null,
            };
        }
        if (usedCoupon) {
            return usedCoupon
        }
    }
}


let previousCouponDiv;

function generateCouponDiv(coupons) {
    const priceValue = getPriceValue();
    const discountValue = coupons.value || 0;
    const couponText = coupons.code || '';
    var newPrice = (priceValue - discountValue).toFixed(2);
    const formattedDiscountValue = discountValue.toFixed(2);
    var text = `<strong style="color: blue; font-size: calc(20px + 3px);">${newPrice.replace('.', ',')}€</strong> Cupón de ${formattedDiscountValue.replace('.', ',')}€ → <strong>${couponText}</strong>`;
    var discountTipClass = document.querySelector('.tip-box');
    if (discountTipClass) {
        var discounts = discountTipClass.textContent.match(/-(\d+)€  dto\. cada (\d+)€ \(máx\. -(\d+)€\)/);
        if (discounts) {
            var extraDiscountValue = parseFloat(discounts[1]);
            var maxRequiredValue = parseFloat(discounts[2]);
            var maxDiscountValue = parseFloat(discounts[3]);
            if (priceValue >= maxRequiredValue) {
                var maxDiscountAmount = Math.floor(priceValue / maxRequiredValue) * extraDiscountValue;
                var discountAmount = Math.min(maxDiscountAmount, maxDiscountValue);
                newPrice = (newPrice - discountAmount).toFixed(2);
                text = `<strong style="color: blue; font-size: calc(20px + 3px);">${newPrice.replace('.', ',')}€</strong> DTO ${discountAmount}€ + cupón de ${formattedDiscountValue.replace('.', ',')}€ → <strong>${couponText}</strong>`;
            }
        }
    }

    const priceElementBanner = document.querySelector('.uniform-banner-box');
    const priceElement = document.querySelector('.product-price') || document.querySelector('.product-price-current');

    const targetElement = priceElementBanner || priceElement;

    if (targetElement) {
        const newElem = document.createElement('div');
        newElem.classList.add('div-for-coupons');
        newElem.style.width = '100%';
        newElem.style.fontSize = '20px';
        newElem.style.marginBottom = '5px';
        newElem.innerHTML = text;

        if (previousCouponDiv && previousCouponDiv.parentNode) {
            previousCouponDiv.parentNode.replaceChild(newElem, previousCouponDiv);
        } else {
            targetElement.parentNode.insertBefore(newElem, targetElement);
        }
        previousCouponDiv = newElem;
    }
}

function generateExtraDiscountDiv() {
    var priceValue = getPriceValue();
    var text;
    var discountTipClass = document.querySelector('.tip-box');
    if (discountTipClass) {
        var discounts = discountTipClass.textContent.match(/-(\d+)€  dto\. cada (\d+)€ \(máx\. -(\d+)€\)/);
        if (discounts) {
            var extraDiscountValue = parseFloat(discounts[1]);
            var maxRequiredValue = parseFloat(discounts[2]);
            var maxDiscountValue = parseFloat(discounts[3]);
            if (priceValue >= maxRequiredValue) {
                var maxDiscountAmount = Math.floor(priceValue / maxRequiredValue) * extraDiscountValue;
                var discountAmount = Math.min(maxDiscountAmount, maxDiscountValue);
                priceValue = (priceValue - discountAmount).toFixed(2).replace('.', ',');
            } else {return false}
        }

        text = `<strong style="color: green; font-size: calc(20px + 3px);">${priceValue}€</strong> → DTO auto de ${discountAmount}€`
    }

    const priceElementBanner = document.querySelector('.uniform-banner-box');
    const priceElement = document.querySelector('.product-price') || document.querySelector('.product-price-current');

    const targetElement = priceElementBanner || priceElement;

    if (targetElement) {
        const newElem = document.createElement('div');
        newElem.classList.add('div-for-coupons');
        newElem.style.width = '100%';
        newElem.style.fontSize = '20px';
        newElem.style.marginBottom = '5px';
        newElem.innerHTML = text;

        if (previousCouponDiv && previousCouponDiv.parentNode) {
            previousCouponDiv.parentNode.replaceChild(newElem, previousCouponDiv);
        } else {
            targetElement.parentNode.insertBefore(newElem, targetElement);
        }
        previousCouponDiv = newElem;
    }
}


function generateShippingDiv(shippingContent) {
    const text = `⚠️ <b>Producto con gastos de envío, revisa el envío gratis</b>`;

    const priceElementBanner = document.querySelector('.uniform-banner-box');
    const priceElement = document.querySelector('.product-price') || document.querySelector('.product-price-current');
    const targetElement = priceElementBanner || priceElement;

    if (targetElement) {
        const newElem = document.createElement('div');
        newElem.style.width = '100%';
        newElem.style.fontSize = '15px';
        newElem.style.marginBottom = '5px';
        newElem.innerHTML = text;
        targetElement.parentNode.insertBefore(newElem, targetElement);
    }
}

function generateSourceTypeDiv(price, url) {
  const text = `💡 <b>Más barato con <a href="${url}" style="color: blue;" target="_blank">SourceType</a>:</b> <strong style="font-size: calc(20px + 3px);"><strong>${price.toString().replace('.', ',')}€</strong>`;

  const priceElementBanner = document.querySelector('.uniform-banner-box');
  const priceElement = document.querySelector('.product-price') || document.querySelector('.product-price-current');
  const targetElement = priceElementBanner || priceElement;

  if (targetElement) {
    const newElem = document.createElement('div');
    newElem.style.width = '100%';
    newElem.style.fontSize = '17px';
    newElem.style.marginBottom = '5px';
    newElem.innerHTML = text;
    targetElement.parentNode.insertBefore(newElem, targetElement);
  }
}



function removeDivs() {
    let divForCoupons = document.querySelector('.div-for-coupons');

    if (divForCoupons) divForCoupons.remove();
}

async function checkSourceTypeValues(){
    const currentURL = window.location.href.match(/(.+\.html)/)[0];
    const currentPrice = getPriceValue();
    let lowestSourceType;
    let lowestPrice;

    const promises = [561, 562].map(async (sourceType) => {
        let customURL = `${currentURL}?sourceType=${sourceType}`;
        let newPrice = await getNewPriceValue(customURL);

        if (parseFloat(newPrice) < parseFloat(currentPrice)) {
            if (!lowestPrice || parseFloat(newPrice) < parseFloat(lowestPrice)) {
                lowestSourceType = sourceType;
                lowestPrice = newPrice;
            }
        }
    });

    await Promise.all(promises);

    if (lowestSourceType) {
        let customURL = `${currentURL}?sourceType=${lowestSourceType}`;
        generateSourceTypeDiv(lowestPrice, customURL);
    }
}


window.onload = async (event) => {

  var coupons = getProductCoupons();

    removeDivs();

    if (!window.location.href.includes("sourceType")) {
        await checkSourceTypeValues()
    }

  if (coupons) {
    generateCouponDiv(coupons);
  } else {
      var discountTipClass = document.querySelector('.tip-box')
    if (discountTipClass){
        var discounts = discountTipClass.textContent.match(/-(\d+)€  dto\. cada (\d+)€ \(máx\. -(\d+)€\)/)
        if (discounts){
            generateExtraDiscountDiv();
        }
      }
  }

  var shippingInfoElements = document.querySelectorAll('.dynamic-shipping-contentLayout, .dynamic-shipping-line, .dynamic-shipping-titleLayout');
  var regex = /Envío:\s*(\d+(?:,\d+)?)€/;

  shippingInfoElements.forEach(function(element) {
    var shippingContent = element.textContent;
    if (regex.test(shippingContent)) {
      generateShippingDiv(shippingContent);
    }
  });

  const priceValueElement = document.querySelector('div.product-price-current') || document.querySelector('span.product-price-value') || document.querySelector('span.uniform-banner-box-price');

  const observer = new MutationObserver(function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'characterData') {
        var updatedCoupons = getProductCoupons();
          removeDivs();
        if (updatedCoupons) {
          generateCouponDiv(updatedCoupons);
        } else {
            var discountTipClass = document.querySelector('.tip-box')
          if (discountTipClass){
              var discounts = discountTipClass.textContent.match(/-(\d+)€  dto\. cada (\d+)€ \(máx\. -(\d+)€\)/)
              if (discounts){
                  generateExtraDiscountDiv();
              }
          }
        }
        break;
      }
    }
  });

  if (priceValueElement) {
    observer.observe(priceValueElement, { characterData: true, subtree: true });
  }
}