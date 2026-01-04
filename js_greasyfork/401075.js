// ==UserScript==
// @name         Sbermarket - расчет цены за килограмм
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Рассчитывает цены за кг/шт/л и т.д. для товаров на странице и сортирует товары по этой цене!
// @author       Lunat1q
// @include      https://sbermarket.ru/metro*
// @include      https://sbermarket.ru/auchan*
// @include      https://sbermarket.ru/selgros*
// @include      https://sbermarket.ru/billa*
// @include      https://sbermarket.ru/vkusvill*
// @grant        none
// @license      LGPLv2
// @downloadURL https://update.greasyfork.org/scripts/401075/Sbermarket%20-%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%B7%D0%B0%20%D0%BA%D0%B8%D0%BB%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/401075/Sbermarket%20-%20%D1%80%D0%B0%D1%81%D1%87%D0%B5%D1%82%20%D1%86%D0%B5%D0%BD%D1%8B%20%D0%B7%D0%B0%20%D0%BA%D0%B8%D0%BB%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var visitedProducts = [];
    var visitedOtherProducts = [];
    var selector = "#wrap > div.body > div:nth-child(1) > div > main > section > div > div > div > div > main > div > ul";
    var products = $.find(selector)[0];
    if (products == undefined)
    {
        products = $.find("#wrap > div.body > div > section:nth-child(3) > div > div > main > div > ul")[0];
    }
    if (products == undefined)
    {
        products = $.find("#wrap > div.body > div > section:nth-child(2) > div > div > main > div > ul")[0];
    }
    var prevCount = 0;
    var prevOtherCount = 0;
    var priceDict = {};
    var working = false;
    var prevSorted = 0;

    var otherProductsContainer = $.find("#wrap > div.body > div:nth-child(2) > section.-Nonf > div > ul")[0];


    determineProductsPrice();
    sortByPrice();
    calculatePriceForTheRest();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    if (products != undefined)
    {
        var observer = new MutationObserver(function(mutations, observer) {
            determineProductsPrice();
            setTimeout(function() {sortByPrice();}, 1000);
        });

        observer.observe(products, {
            subtree: false,
            childList: true
        });
    }

    if (otherProductsContainer != undefined)
    {
        var otherObserver = new MutationObserver(function(mutations, observer) {
            calculatePriceForTheRest();
        });

        otherObserver.observe(otherProductsContainer, {
            subtree: false,
            childList: true
        });
    }

    console.log("Price calc booted!");

    function calculatePriceForTheRest()
    {
        var otherProducts = $.find("div._3KtLI > div > a");
        let childElements = otherProducts.length;
        if (prevOtherCount >= childElements)
        {
            return;
        }
        prevOtherCount = childElements;
        for (let i = 0; i < childElements; i++)
        {
            let product = otherProducts[i];
            if (product.childElementCount > 0)
            {
                if (visitedOtherProducts.includes(product))
                {
                    continue;
                }
                visitedOtherProducts.push(product);

                calculateAndDisplayPrice(product);
            }
        }
    }

    function determineProductsPrice()
    {
        if (products == undefined)
        {
            return;
        }
        let childElements = products.childElementCount;
        if (prevCount >= childElements)
        {
            return;
        }
        prevCount = childElements;
        let before = visitedProducts.length
        for (let i = 0; i < childElements; i++)
        {
            let product = products.children[i];
            if (product.childElementCount > 0)
            {
                let prodCardOverall = product.children[0];
                let prodDataContainer = $(prodCardOverall).children("a")[0];

                if (visitedProducts.includes(prodDataContainer))
                {
                    continue;
                }
                visitedProducts.push(prodDataContainer);

                let realPrice = calculateAndDisplayPrice(prodDataContainer);
                if (realPrice == -1)
                {
                    priceDict[product.textContent] = 9999999999;
                    continue;
                }
                priceDict[product.textContent] = realPrice;
            }
        }

        console.log("Real price detected for: " + (visitedProducts.length - before) + "items");
    }

    function calculateAndDisplayPrice(productDataContainer)
    {
        let prodPriceTag = productDataContainer.children[4];

        if (prodPriceTag == undefined)
        {
            return -1;
        }

        //#wrap > div.body > div.products_with_filters_wrapper > div.products_container > div > ul > li:nth-child(5) > a > div.product__price > div
        let money = getMoneyAmount(prodPriceTag);

        let weightTag = productDataContainer.children[3];

        let parseResult = parseVolume(weightTag) //#wrap > div.body > div.products_with_filters_wrapper > div.products_container > div > ul > li:nth-child(1) > a > p.product__volume

        let realPrice = money / parseResult.volume;
        let realPriceTag = prodPriceTag.appendChild(document.createElement('p'))
        realPriceTag.innerText = realPrice.toFixed(1) + " ₽/" + parseResult.name;

        return realPrice;
    }

    function sortByPrice()
    {
        if (products == undefined)
        {
            return;
        }
        if (prevSorted >= products.childElementCount)
        {
            return;
        }
        prevSorted = products.childElementCount;
        let arr = Array.from(products.children);
        arr = arr.sort((a, b) =>
        {
            let price1 = priceDict[a.textContent];
            let price2 = priceDict[b.textContent];
            return price1 > price2 ? 1 : -1;
        });
        arr.forEach(li => products.appendChild(li));
        working = false;
    }

    function getMoneyAmount(item)
    {
        if (item == undefined)
        {
            return 999999999;
        }
        var splittedText = item.innerText.split("\n");
        var moneyPart = splittedText[splittedText.length - 1];
        var cleanedMoneyValue = moneyPart.substring(0, moneyPart.length - 2).replace(/\s/g, '');
        return parseFloat(cleanedMoneyValue.replace(",", "."));
    }

    function parseVolume(item)
    {
        let volumeText = item.innerText;
        let multiplier = 1;
        let subStrLen = 0;
        let volumeName = "";
        if (volumeText.includes("кг"))
        {
            multiplier = 1;
            subStrLen = 3;
            volumeName = "кг";
        }
        else if (volumeText.includes("г"))
        {
            multiplier = 0.001;
            subStrLen = 2;
            volumeName = "кг";
        }
        else if (volumeText.includes("мл"))
        {
            multiplier = 0.001;
            subStrLen = 3;
            volumeName = "л";
        }
        else if (volumeText.includes("л"))
        {
            multiplier = 1;
            subStrLen = 2;
            volumeName = "л";
        }
        else if (volumeText.includes("см"))
        {
            return { name: "шт", price: 1 };
        }
        else if (volumeText.includes("шт"))
        {
            volumeName = "шт";
        }

        let textToParse = item.innerText.substring(0, item.innerText.length - subStrLen).replace(",", ".");
        return { name: volumeName, volume: parseFloat(textToParse) * multiplier };
    }
})();