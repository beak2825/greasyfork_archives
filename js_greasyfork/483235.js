// ==UserScript==
// @name        AmwayKZtoRU 1.0.18
// @namespace   Violentmonkey Scripts
// @match       https://www.kz.amway.com/*
// @grant       none
// @version     1.0.18
// @author      alexeytorfi
// @description Конвертация цен
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483235/AmwayKZtoRU%201018.user.js
// @updateURL https://update.greasyfork.org/scripts/483235/AmwayKZtoRU%201018.meta.js
// ==/UserScript==
(function() {
    'use strict';
    async function fetchRate() {
        //let response = await fetch('https://edge.qiwi.com/sinap/crossRates');
        //let data = await response.json();
        //let result = 0;

        //await data.result.forEach(i => {
        //    if (i.from == "643" && i.to == "398") result = 1.1 * i.rate;
        //});

        //return result;
        
        return 4.6;
    }

    function convertTo(number) {
        return new Intl.NumberFormat('ru-RU').format(number);
    }

    function convertPrice(a) {
        /*console.log(a,
                    a.textContent, convertTo((parseInt(a.textContent.replace("₸ ", "").replace(" ", "")) * coefficient / currentRate).toFixed(2)) + " ₽",
                    formatMoney(a.textContent.replace("₸ ", "").replace(" ", "")),
                    a.textContent.replace("₸ ", "").replace(" ", ""),
                    a.textContent.replace(/\s/g, '').replace("₸", ""),
                    formatMoney(a.textContent.replace(/\s/g, '').replace("₸", "")),
                    convertTo((formatMoney(a.textContent.replace("₸ ", "").replace(" ", "")) * coefficient / currentRate).toFixed(2)) + " ₽");*/
        if (a) {
            a.textContent = convertTo((formatMoney(a.textContent.replace(/\s/g, '').replace("₸", "")) * coefficient / currentRate).toFixed(2)) + " ₽";
            a.classList.add("priceUpdate");
        }
    }

    formatMoney.maxDecLength = 3; //Set to Infinity o.s. to disable it

    function formatMoney(a) {
        var nums = a.split(/[,\.]/);
        var ret = [nums.slice(0, nums.length - 1).join("")];
        if (nums.length < 2) return +nums[0];
        ret.push(nums[nums.length - 1]);
        return +(ret.join(nums[nums.length - 1].length < formatMoney.maxDecLength ? "." : ""));
    }

    function expecPage() {
        if ((window.location.href.includes("/c/") || window.location.href.includes("/search")) && (document.querySelector(".product-viewer__items") ?? false)) {
            document.querySelectorAll(".amw-product-viewer-item__inner:not(.priceUpdate)").forEach(i => {
                if (i.querySelector(".amw-product-viewer-item__promotions")) {
                    if (i.querySelector('[class*="priceForRCValue"]:not(.priceUpdate)')) {
                        let sale = convertTo((formatMoney(i.querySelector('[class*="priceForRCValue"]:not(.priceUpdate)').textContent.replace(/\s/g, '').replace("₸", "")) * coefficient / currentRate * ((100 - /[0-9]+/.exec(i.querySelector(".amw-product-viewer-item__promotions").innerText)[0]) / 100)).toFixed(2)) + " ₽";
                        i.querySelector(".amw-product-viewer-item__info-row.amw-product-viewer-item__price-and-pv").insertAdjacentHTML("beforeend", "<br/>Цена со скидкой: <b>" + sale + "</b>");
                    } else if (i.querySelector('[class*="amw-product-viewer-item__price-value"]:not(.priceUpdate)')) {
                        let sale = convertTo((formatMoney(i.querySelector('[class*="amw-product-viewer-item__price-value"]:not(.priceUpdate)').textContent.replace(/\s/g, '').replace("₸", "")) * coefficient / currentRate * ((100 - /[0-9]+/.exec(i.querySelector(".amw-product-viewer-item__promotions").innerText)[0]) / 100)).toFixed(2)) + " ₽";
                        i.querySelector(".amw-product-viewer-item__info-row.amw-product-viewer-item__price-and-pv").insertAdjacentHTML("beforeend", "<br/>Цена со скидкой: <b>" + sale + "</b>");
                    }
                }
                convertPrice(i.querySelector('[class*="retailPriceForVisitor"]:not(.priceUpdate)'));
                convertPrice(i.querySelector('[class*="priceForRCValue"]:not(.priceUpdate)'));
                convertPrice(i.querySelector('[class*="amw-product-viewer-item__price-value"]:not(.priceUpdate)'));
                i.classList.add("priceUpdate");
            })
            // document.querySelectorAll('[class*="retailPriceForVisitor"]:not(.priceUpdate)').forEach(i => {
            //     convertPrice(i);
            // });
            // document.querySelectorAll('[class*="priceForRCValue"]:not(.priceUpdate)').forEach(i => {
            //     convertPrice(i);
            // });
        }

        if (window.location.href.includes("/promo-page") && document.querySelector(".row.no-gutters").hasChildNodes()) {
            document.querySelectorAll(".product-price_old:not(.priceUpdate)").forEach(i => {
                convertPrice(i);
            });
            document.querySelectorAll(".product-price_current:not(.priceUpdate)").forEach(i => {
                convertPrice(i);
            });
        }

        if (window.location.href.includes("/p")) {
            if (document.querySelector('[class*="price-retail"]:not(.priceUpdate)')) {
                document.querySelector('[class*="price-retail"]').innerText = convertTo((document.querySelector('[class*="price-retail"]').dataset['tealiumPrice'] * coefficient / currentRate).toFixed(2)) + " ₽";
                document.querySelector('[class*="price-retail"]').classList.add("priceUpdate");
            }
            if (document.querySelector('[class*="price-num"]:not(.priceUpdate)')) {
                if (document.querySelector(".promotions__item-info-name")) document.querySelector(".product-info__price-wrapper>div").insertAdjacentHTML("beforeend", "<br/>Цена со скидкой: " + convertTo((document.querySelector('[class*="price-num"]').dataset['tealiumPrice'] * ((100 - /[0-9]+/.exec(document.querySelector(".promotions__item-info-name").textContent)[0]) / 100) * coefficient / currentRate).toFixed(2)) + " ₽");
                document.querySelector('[class*="price-num"]').innerText = convertTo((document.querySelector('[class*="price-num"]').dataset['tealiumPrice'] * coefficient / currentRate).toFixed(2)) + " ₽";
                document.querySelector('[class*="price-num"]').classList.add("priceUpdate");
            }

            document.querySelectorAll('[class*="retailPriceForVisitor"]:not(.priceUpdate)').forEach(i => {
                convertPrice(i);
            });

            document.querySelectorAll('[class*="priceForRCValue"]:not(.priceUpdate)').forEach(i => {
                convertPrice(i);
            });
        }

        document.querySelectorAll(".search-box__product-price:not(.priceUpdate)").forEach(i => {
            convertPrice(i);
        });

        document.querySelectorAll('div[class*="product-carousel"] > [class*="oldValue"]:not(.priceUpdate)').forEach(i => {
            convertPrice(i);
        });
        document.querySelectorAll('div[class*="product-carousel"] > [class*="value"]:not(.priceUpdate)').forEach(i => {
            convertPrice(i);
        });
        document.querySelectorAll(".amw-product-viewer-item__inner:not(.priceUpdate)").forEach(i => {
          if (i.querySelector("[class*='promoTitle']")) {
            let sale = convertTo((formatMoney(i.querySelector('.amw-product-viewer-item__price-value').textContent.replace(/\s/g, '').replace("₸", "")) * coefficient / currentRate * ((100 - /[0-9]+/.exec(i.querySelector("[class*='promoTitle']").innerText)[0]) / 100)).toFixed(2)) + " ₽";
            i.querySelector(".amw-product-viewer-item__price").insertAdjacentHTML("beforeend", "<br/>Цена со скидкой: <b>" + sale + "</b>");
          }
          convertPrice(i.querySelector('.amw-product-viewer-item__price-value:not(.priceUpdate)'))
          i.classList.add("priceUpdate");
        });
    }

    let currentRate = 0;
    fetchRate().then(result => currentRate = result);

	let coefficient = 1.1; //+ 0.25;

    let observer = new MutationObserver(mutations => {
        // console.log(mutations);
        expecPage();
    });

    let observerSearch = new MutationObserver(mutations => {
        // console.log(mutations);
        expecPage();
    });

    if (window.location.href.includes("/c/") || window.location.href.includes("/search")) {
        let currentPage = setInterval(() => {
            if (document.querySelector(".product-viewer__items") && currentRate) {
                expecPage();

                let changeSee = document.querySelector(".product-viewer__items");

                observer.observe(changeSee, {
                    childList: true,
                    subtree: true
                });

                clearInterval(currentPage);
            }
        }, 1000)
    } else if (window.location.href.includes("/promo-page")) {
        let currentPage = setInterval(() => {
            if (document.querySelector(".row.no-gutters") && currentRate) {
                expecPage();

                let changeSee = document.querySelector(".row.no-gutters");

                observer.observe(changeSee, {
                    childList: true,
                    subtree: true
                });

                clearInterval(currentPage);
            }
        }, 1000)
    } else if (window.window.location.href.includes("/p")) {
        let currentPage = setInterval(() => {
            currentRate ? expecPage() : false;

            if (document.querySelector(".recommendations-component-container") && currentRate) {
                expecPage();
                if (currentRate) clearInterval(currentPage);
            }
        }, 1000)
    }

    let currentPageSearch = setInterval(() => {

        if (currentRate) {
            let changeSearchSee = document.querySelector(".site-search");

            observerSearch.observe(changeSearchSee, {
                childList: true,
                subtree: true
            });
            clearInterval(currentPageSearch);
        }

    }, 1000)

    let count = 0;

    let indexPage = setInterval(() => {
        if (document.querySelector('div[class*="product-carousel"]') && currentRate) {
            expecPage();
            clearInterval(indexPage);
        }

        if (count > 50) clearInterval(indexPage);

        count++;
    }, 1000)
})();