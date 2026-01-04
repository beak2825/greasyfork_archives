// ==UserScript==
// @name        淘宝天猫商品选项计算单价
// @namespace   leizingyiu.net
// @version     2022.09.27.1
// @description 点击sku后自动计算单价，并填充到sku中
// @icon        https://img.alicdn.com/favicon.ico
// @author      Leizingyiu
// @include     *://item.taobao.com/*
// @include     *://detail.tmall.com/*
// @run-at      document-idle
// @grant       none
// @license     GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/451294/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E9%80%89%E9%A1%B9%E8%AE%A1%E7%AE%97%E5%8D%95%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/451294/%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E5%93%81%E9%80%89%E9%A1%B9%E8%AE%A1%E7%AE%97%E5%8D%95%E4%BB%B7.meta.js
// ==/UserScript==



/* setting */
var specialPriceSelector = ['#J_PromoPriceNum.tb-rmb-num'
    , '#J_PromoPrice.tm-promo-cur > dd > div.tm-promo-price > span.tm-price'].join(','),
    // 淘宝优惠价： #J_PromoPriceNum.tb-rmb-num
    // tm 优惠价： #J_PromoPrice.tm-promo-cur > dd > div.tm-promo-price > span.tm-price

    originalPriceSelector = [' #J_StrPrice > em.tb-rmb-num ',
        ' #J_StrPriceModBox > dd > span.tm-price'].join(' , '),

    // 淘宝原价:  #J_StrPrice > em.tb-rmb-num
    // tm 原价: #J_StrPriceModBox > dd > span.tm-price

    skuSelector = '.tb-prop dd ul li a',

    words = "包 条 个 袋 杯 枚 颗 罐 公斤 斤 两 盒 桶"
        .split(/\s{1,}/)
        .filter((a) => Boolean(a)),
    wordsReg = new RegExp(
        "\\d[\\d\\.]*s*(" +
        (words.map((word) => `(${word})`).join("|") + ")\\s*(\\*\\d{1,})*"), 'g'
    ),
    textReplaceReg = /(\([^\)]*\))|(\[[^\]]*\])|(「[^」]*」)|(（[^）]*）)/g,
    priceReg = /\d[\d.]*\s*(?=元)/,
    gramReg =
        /\d[\d.]*\s*(([千克]{1,})|(((kg)|(KG)|(Kg)|(g)|(G)){1,}))\s*(\*\d{1,})*/,
    volReg = /\d[\d.]*\s*(([毫升]{1,})|((L)|(ml)|(ML){1,}))\s*(\*\d{1,})*/;



loadingWaitTime = 1000;
activateGapTime = 500;

/* style */
let style = document.createElement('style');
style.innerText = `
.tb-prop li a:after , #detail .tb-key .tb-prop li:after {
    content: attr(price);
    display:content;
    white-space: break-spaces;
    line-height: 1.5em;
    word-break: break-word;


    }
.tb-prop li a , #detail .tb-key .tb-prop li {white-space:break-all;}
`;
document.body.appendChild(style);

/* main function */
function fn() {
    let that = this;
    setTimeout(
        function () {

            let priceBox = document.querySelector(specialPriceSelector) ? document.querySelector(specialPriceSelector) : document.querySelector(originalPriceSelector);
            if (!priceBox) { console.error('很抱歉，找不到价格。请反馈本页面链接，谢谢。') }
            let price = priceBox.innerText;


            let unitprice = unitPrice(that.innerText, price);
            that.setAttribute('price', '¥' + price + ' | ' + unitprice);
            // that.removeEventListener('click', fn);
        }, loadingWaitTime
    );
}

/* addEventListener */
[...document.querySelectorAll(skuSelector)].map(li => {
    console.log(li);
    li.addEventListener('click', fn);
});

// /* activate */
// [...document.querySelectorAll(skuSelector)].map((li, idx) => {
//     setTimeout(
//         () => {
//             li.click()
//         },
//         idx * loadingWaitTime + activateGapTime
//     );
// });





function unitPrice(text, price) {
    text = text.replace(textReplaceReg, "") || '',
        price = price || 0;
    if (text == '') { return false; }

    var gram = text.match(gramReg),
        vol = text.match(volReg);



    var otherUnit = text.match(wordsReg);
    var unit = "",
        num = 0,
        priceText = "",
        priceKg,
        priceL,
        priceU;
    if (price == null || (gram == null && vol == null && otherUnit == null)) {
        priceText = "--";
    } else {
        price = Number(price);


        if (gram != null) {
            gram = Number(
                eval(gram[0].replace(/[克gG]/g, "").replace(/[kK千]/, "*1000"))
            );
            priceKg = (price / gram) * 1000;
            priceText += priceKg.toFixed(2) + "/kg";
        }
        if (vol != null) {
            vol = Number(
                eval(vol[0].replace(/[升lL]/g, "").replace(/[毫mM]/, "/1000"))
            );
            priceL = price / vol;
            priceText = (gram != null ? " | " : "") + priceL.toFixed(2) + "/L";
        }

        console.log(price, text, gram, vol, priceText, otherUnit, wordsReg);

        if (otherUnit != null) {

            otherUnit.map(un => {
                num = Number(un.match(/\d*/));
                unit = un.replace(/\d*/, "");
                priceU = price / num;
                priceText += (priceText == '' ? '' : " | ") + priceU.toFixed(2) + "/" + unit;
                if (unit == "斤") {
                    priceKg = (priceU * 2).toFixed(2)
                    priceText += " | " + priceKg + "/kg";
                }
                if (unit == "两") {
                    priceKg = (priceU * 20).toFixed(2);
                    priceText += " | " + priceKg + "/kg";
                }
            });
        }


        if (priceText == "") {
            priceText += "___";
        }
    }
    return priceText;
}

