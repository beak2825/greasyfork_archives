// ==UserScript==
// @name         乐天+亚马逊高亮（金额—配送费—点数）
// @namespace    http://puresimple.cn
// @version      1.1.2
// @description  Enlarge and highlight prices, points, and specified parameters on Amazon and Rakuten websites.
// @author       IceGhost
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505850/%E4%B9%90%E5%A4%A9%2B%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%AB%98%E4%BA%AE%EF%BC%88%E9%87%91%E9%A2%9D%E2%80%94%E9%85%8D%E9%80%81%E8%B4%B9%E2%80%94%E7%82%B9%E6%95%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/505850/%E4%B9%90%E5%A4%A9%2B%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%AB%98%E4%BA%AE%EF%BC%88%E9%87%91%E9%A2%9D%E2%80%94%E9%85%8D%E9%80%81%E8%B4%B9%E2%80%94%E7%82%B9%E6%95%B0%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const blockedSites = [
        'https://item.rakuten.co.jp/jism/',//joshin
        'https://books.rakuten.co.jp/',//books
        'https://brandavenue.rakuten.co.jp/',//fashion
        'https://item.rakuten.co.jp/joshin-cddvd/',//joshin dvd
        'https://www.rakuten.co.jp/rdownload/',//books
        'https://gfore-jp.com/',//一个外部网站
        'https://item.rakuten.co.jp/n-aegis/'//口琴
    ];

    for (const site of blockedSites) {
        if (window.location.href.startsWith(site)) {
            alert("不能下单")
            return; // 终止脚本执行
        }
    }

    const fakedSites = [
        'https://dtioykqj1u8de.cloudfront.net/',//钓鱼网站
    ];

    for (const site of fakedSites) {
        if (window.location.href.startsWith(site)) {
            alert("钓鱼网站")
            return; // 终止脚本执行
        }
    }

    //亚马逊
    function highlightAmazon() {
        const priceElementsamazonjine = document.querySelectorAll('.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay');
        const priceElementsamazonpinpai = document.querySelectorAll('[id="bylineInfo"]');
        const pointElementsamazonpoint = document.querySelectorAll('[data-feature-name="points"]');
        const tableamazontimezaiku = document.getElementById('availability');
        const elementamazonpeisong = document.querySelector('[data-csa-c-content-id="DEXUnifiedCXPDM"]');
        const tableamazonquehuo = document.getElementById('deliveryBlockMessage');
        const tableamazonzhonggu = document.getElementById('usedBuySection');

        //亚马逊 中古
        if (tableamazonzhonggu) {
            const elementsToHighlightrlamazonzhonggu = tableamazonzhonggu.querySelectorAll('[class="a-text-bold"]');

            elementsToHighlightrlamazonzhonggu.forEach(el => {
                el.style.color = 'green';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        //亚马逊 缺货
        if (tableamazonquehuo) {
            const elementsToHighlightrlamazonquehuo = tableamazonquehuo.querySelectorAll('[class="a-text-bold"]');

            elementsToHighlightrlamazonquehuo.forEach(el => {
                el.style.color = 'green';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        //亚马逊 配送费
        if (elementamazonpeisong) {
            const deliveryPriceamazonpeisong = elementamazonpeisong.getAttribute('data-csa-c-delivery-price');

            if (deliveryPriceamazonpeisong) {
                elementamazonpeisong.innerHTML = elementamazonpeisong.innerHTML.replace(deliveryPriceamazonpeisong, `<span style="color: red; font-weight: bold; background-color: yellow;">${deliveryPriceamazonpeisong}</span>`);
            }
        }
        //亚马逊 在库
        if (tableamazontimezaiku) {
            const elementsToHighlightrl = tableamazontimezaiku.querySelectorAll('[class="a-size-medium a-color-success"]');

            elementsToHighlightrl.forEach(el => {
                el.style.color = 'yellow';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        //亚马逊 点数
        pointElementsamazonpoint.forEach(el => {
            el.style.color = 'green';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
        });
        //亚马逊 品牌
        priceElementsamazonpinpai.forEach(el => {
            el.style.color = 'red';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
            el.style.display = 'inline';
        });
        //亚马逊 点数
        priceElementsamazonjine.forEach(el => {
            el.style.color = 'red';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
            el.style.display = 'inline';
        });
    }

    //乐天金额
    function highlightRakuten() {
        const tablerakutenjine = document.getElementById('rakutenLimitedId_cart');
        const table1rakutenpeisongfei = document.getElementById('rakutenLimitedId_cart');
        const table2Rakutenpoint = document.getElementById('rakutenLimitedId_cart');
        const table1rakutenpeisongshijian = document.getElementById('rakutenLimitedId_aroundCart');
        const table1rakutenduanhuo = document.getElementById('rakutenLimitedId_aroundCart');
        const table1rakutenzairuhe = document.getElementById('rakutenLimitedId_aroundCart');


        //乐天点数
        if (table2Rakutenpoint) {
            const elementsToHighlightrlRakutenpoint = table2Rakutenpoint.querySelectorAll('[class="point-summary__total___3rYYD"]');

            elementsToHighlightrlRakutenpoint.forEach(el => {
                el.style.color = 'blue';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'orange';
            });
        }
        //乐天 配送费
        if (table1rakutenpeisongfei) {
            const elementsToHighlightrlrakutenpeisong = table1rakutenpeisongfei.querySelectorAll('[class="text-display--1Iony type-body--1W5uC size-x-large--20opE align-left--1hi1x color-gray-dark--2N4Oj  layout-inline--1ajCj"]');

            elementsToHighlightrlrakutenpeisong.forEach(el => {
                el.style.color = 'green';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        //乐天 配送时间
        if (table1rakutenpeisongshijian) {
            const elementsToHighlightrlrakutenpeisongtime = table1rakutenpeisongshijian.querySelectorAll('[class="text-display--1Iony type-body--1W5uC size-medium--JpmnL align-left--1hi1x color-gray-darker--1SJFG  layout-inline--1ajCj"]');

            elementsToHighlightrlrakutenpeisongtime.forEach(el => {
                el.style.color = 'green';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        //乐天 断货
        if (table1rakutenduanhuo) {
            const elementsToHighlightrlrakutenpeisongtime = table1rakutenpeisongshijian.querySelectorAll('[class="text-display--1Iony type-body--1W5uC size-small--sv6IW align-left--1hi1x color-gray-dark--2N4Oj  layout-inline--1ajCj"]');

            elementsToHighlightrlrakutenpeisongtime.forEach(el => {
                el.style.color = 'green';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        //乐天 再入荷
        if (table1rakutenzairuhe) {
            const elementsToHighlightrlrakutenpeisongtime = table1rakutenpeisongshijian.querySelectorAll('[class="text-display--1Iony type-body--1W5uC size-small--sv6IW align-left--1hi1x color-gray-dark--2N4Oj  style-underline--NB1vY layout-inline--1ajCj"]');

            elementsToHighlightrlrakutenpeisongtime.forEach(el => {
                el.style.color = 'green';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'yellow';
            });
        }
        if (tablerakutenjine) {
            const elementsToHighlight = tablerakutenjine.querySelectorAll('[class="number-display--3L2fG layout-inline--TxdJ_  "]');

            elementsToHighlight.forEach(el => {
                el.style.color = 'blue';
                el.style.fontWeight = 'bold';
                el.style.backgroundColor = 'orange';
            });
        }
    }

    //乐天不可下单网站高亮
    function highlightscan() {
        const priceElements = document.querySelectorAll('[href="https://www.rakuten.co.jp/jism/"],[href="https://www.rakuten.co.jp/stylife/"],[href="https://www.rakuten.co.jp/book/"],[href="https://www.rakuten.co.jp/imadoki/"],[href="https://www.rakuten.co.jp/joshin-cddvd/"],[href="https://www.rakuten.co.jp/rdownload/"],[href="https://www.rakuten.co.jp/n-aegis/"]');

        priceElements.forEach(el => {
            el.style.color = 'red';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
            el.style.display = 'inline';
        });
    }
    //乐天bic
    function highlightbic() {
        const priceElements = document.querySelectorAll('[id="itemPoint"]');
        const priceElements1 = document.querySelectorAll('[id="mainItemPrice"]');
        const priceElements2= document.querySelectorAll('[class="p-productDetailv2__priceShipping paid"]');

        priceElements.forEach(el => {
            el.style.color = 'red';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
            el.style.display = 'inline';
        });
        priceElements1.forEach(el => {
            el.style.color = 'red';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
            el.style.display = 'inline';
        });
        priceElements2.forEach(el => {
            el.style.color = 'red';
            el.style.fontWeight = 'bold';
            el.style.backgroundColor = 'yellow';
            el.style.display = 'inline';
        });
    }

    //亚马逊加载高亮
    window.addEventListener('load', function() {
        if (window.location.href.includes('amazon.co.jp')) {
            highlightAmazon();
        }
    });

    //乐天加载高亮
    window.addEventListener('load', function() {
        if (window.location.href.includes('item.rakuten.co.jp')) {
            highlightRakuten();
        }

        //乐天搜索自动以价格最低排列
        if (window.location.href.includes('search.rakuten.co.jp/search/mall')) {
            highlightscan();
            if (!window.location.href.includes('s=')) {
                window.location.href += '?s=11&used=0';
            }
        }
        //乐天bic
        if (window.location.href.includes('biccamera.rakuten.co.jp/item')) {
            highlightbic();
        }
    });

    // 元素添加屏蔽
    const elementsToRemove = [
        'div.adBta',
        'div.browsingHistory',
        'div.help',
        'div.dui-container ning',
        'div.cpklt2t1s',
        'div.realtimeSurvey',
        'div.container--3E9zG',
        'div.container--1POOT',
        'div.rhf-frame',
        'div.alert',
        //'div.bannerFestival',
        'div.adAyaya'
    ];

    // 移除元素
    function removeElements() {
        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }

    // 在页面加载完成后执行
    window.addEventListener('load', () => {
        removeElements();
    });


})();
