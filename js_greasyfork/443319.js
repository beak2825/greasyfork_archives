// ==UserScript==
// @name        什么值得买 自动计算单价
// @namespace   leizingyiu.net
// @version     2022.08.07
// @description 在什么值得买搜索页面、首页及关注动态等页面，自动计算单价
// @icon        https://www.smzdm.com/favicon.ico
// @author      Leizingyiu
// @include     *://search.smzdm.com/*
// @include     *://www.smzdm.com/
// @include     *://www.smzdm.com/#follow
// @include     *://wiki.smzdm.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @license     GNU AGPLv3 
// 
// @downloadURL https://update.greasyfork.org/scripts/443319/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%20%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%8D%95%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/443319/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%20%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%8D%95%E4%BB%B7.meta.js
// ==/UserScript==


function checkAndSetLocalValue(key, value) {
    const checking_local_reagent = "___";
    if (GM_getValue(key, checking_local_reagent) == checking_local_reagent) {
        GM_setValue(key, value);
    } else {
        GM_setValue("备份_" + key, GM_getValue(key));
    }
}

const checking_local_reagent = "___",
    local_words_key = "请填写需要计算的关键字",
    default_words = "包 条 个 袋 杯 枚 颗 罐 公斤 斤 两 盒 桶";
checkAndSetLocalValue(local_words_key, default_words);

var words = GM_getValue(local_words_key, default_words)
    .split(/\s{1,}/)
    .filter((a) => Boolean(a)),
    wordsReg = new RegExp(
        "\\d[\\d\\.]*s*(" +
        (words.map((word) => `(${word})`).join("|") + ")\\s*(\\*\\d{1,})*")
    ),
    textReplaceReg = /(\([^\)]*\))|(\[[^\]]*\])|(「[^」]*」)|(（[^）]*）)/g,
    priceReg = /\d[\d.]*\s*(?=元)/,
    gramReg =
        /\d[\d.]*\s*(([千克]{1,})|(((kg)|(KG)|(Kg)|(g)|(G)){1,}))\s*(\*\d{1,})*/,
    volReg = /\d[\d.]*\s*(([毫升]{1,})|((L)|(ml)|(ML){1,}))\s*(\*\d{1,})*/,
    loadingWaitTime = 1000;

const default_conditions = {
    "挂面 面条": {
        "大于": "",
        "小于": "6",
        "单位": "kg"
    },
}, local_conditions_key = "高亮条件";

checkAndSetLocalValue(local_conditions_key, default_conditions);

const localConditions = GM_getValue(local_conditions_key, default_conditions);
const hiliConditions = Object.keys(localConditions).map(k => {
    let O = localConditions[k], o = {};
    o.match = typeof k == 'string' ? new RegExp('(' + k.split(/\s{1,}/).filter((a) => Boolean(a)).map((word) => `(${word})`).join("|") + ')') : (k instanceof RegExp ? condition.match : '');
    if (o.match === '') { return false; };
    const dict = {
        "大于": "moreThan",
        "小于": "lessThan",
        "单位": "unit"
    };
    ["大于", "小于", "单位"].map(_k => {
        if (O.hasOwnProperty(_k) && O[_k] != "" && (O[_k].match(/\S/))) { o[dict[_k]] = O[_k].match(/[^\d]/g) ? O[_k] : Number(O[_k]) }
    });
    return o;
}).filter(Boolean);


const default_less_style = 'background:#dcf9d7;', default_more_style = 'background:#fde9f0;',
    local_less_key = '低于价格高亮样式', local_more_key = '高于价格高亮样式';

checkAndSetLocalValue(local_less_key, default_less_style);
checkAndSetLocalValue(local_more_key, default_more_style);

const local_less_value = GM_getValue(local_less_key, default_less_style),
    local_more_value = GM_getValue(local_more_key, default_more_style);

const lessThanClass = 'yiu_lessthan', moreThanClass = 'yiu_morethan';
let yiuUnitPriceStyle = document.createElement('style');
yiuUnitPriceStyle.id = 'yiu_unit_price_style';
yiuUnitPriceStyle.innerHTML = `
.yiu_price{ float : right!important; }
.yiu_lessthan .yiu_price{ ${local_less_value} }
.yiu_morethan .yiu_price{ ${local_more_value} }
`;
document.querySelector('body').appendChild(yiuUnitPriceStyle);

function smzdm_unitPrice() {
    var isFollow = window.location.href.indexOf("#follow") != -1,
        isHomePage =
            window.location.hostname == "www.smzdm.com" &&
            window.location.href.indexOf("#follow") == -1,
        isSearch = window.location.hostname.indexOf("search") != -1;
    var selector = "";
    switch (true) {
        case isHomePage:
            selector = "#feed-main-list .has-price";
            break;
        case isSearch:
            selector = "#feed-main-list h5.feed-block-title";
            break;
        case isFollow:
            selector = "#follow-list h5.feed-block-title";
            break;
        default:
            selector = "h5.feed-block-title";
    }
    [...document.querySelectorAll(selector)]
        .filter((dom) => !dom.hasAttribute("yiu_price_calculated"))
        .map(function (dom) {
            var priceDom = isHomePage
                ? dom.parentElement.querySelector(".z-highlight")
                : dom.querySelector(".z-highlight"),
                pre_text = isHomePage
                    ? dom.innerText + "\n" + priceDom.innerText
                    : dom.innerText,
                text = pre_text.replace(textReplaceReg, ""),
                price = text.match(priceReg),
                gram = text.match(gramReg),
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
                price = Number(price[0]);


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

                if (otherUnit != null) {
                    num = Number(otherUnit[0].match(/\d*/));
                    unit = otherUnit[0].replace(/\d*/, "");
                    priceU = price / num;
                    priceText +=
                        (gram != null || vol != null ? " | " : "") +
                        priceU.toFixed(2) +
                        "/" +
                        unit;
                    if (unit == "斤") {
                        priceKg = (priceU * 2).toFixed(2)
                        priceText += " | " + priceKg + "/kg";
                    }
                    if (unit == "两") {
                        priceKg = (priceU * 20).toFixed(2);
                        priceText += " | " + priceKg + "/kg";
                    }
                }


                if (priceText == "") {
                    priceText += "___";
                }

                switch (true) {
                    case priceText.indexOf('/kg') != -1:
                        dom.setAttribute('data-kg', priceKg)
                        break;
                    case priceText.indexOf('/L') != -1:
                        dom.setAttribute('data-L', priceL);
                        break;
                    default:
                        dom.setAttribute('data-price', priceU);
                }
            }

            hiliConditions.map(condition => {
                if (text.match(condition.match)) {
                    let _price = '';
                    if (condition.hasOwnProperty('unit')) {
                        _price = dom.hasAttribute(`data-${condition.unit}`) ? dom.getAttribute(`data-${condition.unit}`) : '';
                    } else {
                        _price = dom.getAttribute('data-price');
                    }
                    if (_price == '') { return false; }
                    if (condition.hasOwnProperty('lessThan') && _price < condition.lessThan) { dom.classList.add(lessThanClass); }
                    if (condition.hasOwnProperty('moreThan') && _price < condition.moreThan) { dom.classList.add(moreThanClass); }
                }
            });

            priceDom.style.display = "block";
            if (isSearch) {
                priceDom.parentElement.style.width = "100%";
            }
            var span = document.createElement("span");
            span.classList.add('yiu_price');
            span.innerText = priceText;
            priceDom.appendChild(span);
            dom.setAttribute("yiu_price_calculated", true);
        });
}
const promiseIt = function (fn) {
    return new Promise((resolve, reject) => {
        fn();
        resolve();
    });
};
var timer = null;
const targetNode = document.querySelector("body"),
    config = { attributes: true, childList: true, subtree: true },
    callback = function (mutationsList, observer) {
        observer.disconnect();
        for (let mutation of mutationsList) {
            promiseIt(() => {
                smzdm_unitPrice();
            });
        }
        timer = timer
            ? null
            : setTimeout(() => {
                observer.disconnect();
                promiseIt(() => {
                    smzdm_unitPrice();
                });
                timer = null;
                observer.observe(targetNode, config);
            }, loadingWaitTime);
    },
    observer = new MutationObserver(callback);
observer.observe(targetNode, config);
