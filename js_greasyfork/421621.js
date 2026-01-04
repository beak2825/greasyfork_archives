// ==UserScript==
// @name         Moe Goods Helper
// @namespace    WeiYuanStudio
// @version      0.1.1
// @description  海淘吃谷插件
// @author       WeiYuanStudio
// @match        www.mercari.com/*
// @match        www.suruga-ya.jp/*
// @downloadURL https://update.greasyfork.org/scripts/421621/Moe%20Goods%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/421621/Moe%20Goods%20Helper.meta.js
// ==/UserScript==
'use strict';

const SETTING = {
    RATE_JPY_CNY: 0.061 //jpy to cny rate
}

let jpyToCny = function (jpyPrice) {
    return (jpyPrice * SETTING.RATE_JPY_CNY).toFixed(2)
}

let getNumberFromHell = function (hell) {
    return /[0-9,.]+/.exec(hell)[0].replace(',', '')
}

let updateMercariListPrice = function () {
    $('.items-box-price').each(function () {
        let rawPrice = $(this).text()

        let jpyPrice = parseFloat(rawPrice.replace('¥', '').replace(',', ''))
        $(this).attr('raw-price', `JPY: ${jpyPrice}`) //save raw price

        let cnyPrice = (jpyPrice * SETTING.RATE_JPY_CNY).toFixed(2)
        $(this).attr('cny-price', `CNY: ${cnyPrice}`) //save cny price

        $(this).text($(this).attr('cny-price')) //set cny price show

        //set up hover event
        $(this).hover(function () {
            $(this).text($(this).attr('raw-price'))
        }, function () {
            $(this).text($(this).attr('cny-price'))
        })
    })
};

let updateMercariPagePrice = function () {
    $('.item-price').each(function () {
        let rawPrice = $(this).text()

        let jpyPrice = parseFloat(rawPrice.replace('¥', '').replace(',', ''))

        let cnyPrice = (jpyPrice * SETTING.RATE_JPY_CNY).toFixed(2)

        $(this).text($(this).attr('cny-price')) //set cny price show

        $(this).text(`JPY: ${jpyPrice} | CNY: ${cnyPrice}`)
    })
};

let updateSurugayaListPrice = function () {
    $('.price_teika').each(function () {
        let jpyPrice = /[0-9,.]+/.exec($(this).text())[0].replace(',', '')
        let cnyPrice = jpyToCny(jpyPrice)
        let elem = document.createElement('div')
        elem.innerText = `CNY: ${cnyPrice}`
        elem.setAttribute('style', 'color: red; font-family: sans-serif; font-weight: bolder; text-decoration: underline;')
        $(this).after(elem)
    })
};

let updateSurugayaPagePrice = function () {
    $('#item_sellInfo #sellInfo_left input').parent().each(function () {
        let jpyPrice = getNumberFromHell($(this).text())

        let cnyPrice = jpyToCny(jpyPrice)

        let elem = document.createElement('div')
        elem.innerText = `CNY: ${cnyPrice}`
        elem.setAttribute('style', 'color: red; font-family: sans-serif; font-weight: bolder; text-decoration: underline;')
        $(this).after(elem)
    })
};

(function () {
    updateMercariListPrice()
    updateMercariPagePrice()
    updateSurugayaListPrice()
    updateSurugayaPagePrice()
})();
