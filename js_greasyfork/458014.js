// ==UserScript==
// @name         jinritemai.coop
// @namespace    https://sbwkl.github.io/
// @version      0.2
// @description  one click copy product info
// @author       wayne.wang
// @match        https://buyin.jinritemai.com/dashboard/goodsCooperation/product-details*
// @icon         https://lf3-fe.ecombdstatic.com/obj/ecom-cdn-default/ecom/fe-alliance-home/out/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458014/jinritemaicoop.user.js
// @updateURL https://update.greasyfork.org/scripts/458014/jinritemaicoop.meta.js
// ==/UserScript==

(function() {
    var button = document.createElement("Button");
    button.innerHTML = "复制商品";
    button.style = "top:0;right:0;position:absolute;z-index: 9999"
    document.body.appendChild(button);
    button.addEventListener("click", function() {
        const appel = document.getElementById('app');
        const leftel = appel.querySelector('div > div > div');
        const rightel = appel.firstElementChild.firstElementChild.children[1];

        const productImage = getValueOrDefault(() => leftel.querySelector("div > div > img").src);
        const productTitle = getValueOrDefault(() => leftel.querySelector(':nth-child(2) > div > div').querySelector('div div :nth-child(3)').innerText);
        const productPrice = getValueOrDefault(() => leftel.querySelector('div > :nth-child(3) > div > div > div > :nth-child(2)').innerText);
        const xpathVolume = "//div[text()='商品总销量']";
        var productMaxAge = getValueOrDefault(() => rightel.firstElementChild.children[1].children[3].children[1].children[2].innerText);
        if (productMaxAge == null) {
            productMaxAge = getValueOrDefault(() => rightel.firstElementChild.children[1].children[4].children[1].children[2].innerText);
        }
        const productComm = getValueOrDefault(() => leftel.querySelector('div > :nth-child(3) > :nth-child(2) > div > div > :nth-child(2)').innerText);
        const productServ = getValueOrDefault(() => leftel.querySelector('div > :nth-child(3) > div > :nth-child(2) > div > :nth-child(2)').innerText);
        const productVolume = getValueOrDefault(() => {
            const volumeel = document.evaluate(xpathVolume, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return volumeel.parentElement.childNodes[1].innerText;
        });
        const productEndDate = getValueOrDefault(() => leftel.firstElementChild.firstElementChild.firstElementChild.children[2].children[1].children[1].firstElementChild.children[1].innerText);
        const productUrl = document.URL;
        const productRate = [productComm, productServ].join(' + ')
        const productVideo = 'https://www.kaogujia.com/darenSquare/videoList?goods_name=' + productTitle;
        const productLine = [productImage, productTitle, productPrice, '', productVolume, productMaxAge, productRate, productEndDate, '短视频', productVideo, productUrl].join('\t');
        navigator.clipboard.writeText(productLine);
        button.innerHTML = '已复制';
        setTimeout(() => {
            button.innerHTML = '复制商品';
        }, 3000);
    });

    function getValueOrDefault(func) {
        try {
            return func();
        } catch(e) {
            console.log(e);
        }
        return null;
    }
})();