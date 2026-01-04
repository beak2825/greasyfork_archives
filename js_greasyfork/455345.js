// ==UserScript==
// @name         亚马逊广告提取
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  亚马逊广告提示插件
// @author       潘琼宝
// @include      *//*amazon.*/*
// @run-at      document-end
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/455345/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8A%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/455345/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%B9%BF%E5%91%8A%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function(doc) {
    'use strict';

    const outerHTML = doc.documentElement.outerHTML;
    const asinTag = /(?<="asin":")[^"]+(?=")/i;
    const campaignIdTag = /(?<="campaignId":")[^"]+(?=")/i;
    const adIdTag = /(?<="adId":")[^"]+(?=")/i;
    const skuTag = /(?<="sku":")[^"]+(?=")/i;
    const searchTermsTag = /(?<="searchTerms":")[^"]+(?=")/i;
    const slotNameTag = /(?<="slotName":")[^"]+(?=")/i;
    var anonCarouselData = [];

    // Base64加密、解密
    const Base64 = {
        //加密
        encode(str) {
            return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                                                        function toSolidBytes(match, p1) {
                return String.fromCharCode('0x' + p1);
            }));
        },
        //解密
        decode(str) {
            // Going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(atob(str).split('').map(function(c) {
                                                              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
    }

    // 淡入效果，即渐渐显示
    function fadeIn(elemt, speed) { //淡入 0 ~ 1
        if(elemt.style.opacity == 0 && elemt.style.opacity != "") {
            speed = speed || 16.6; //默认速度为16.6ms
            let num = 0; //累加器
            let timer = setInterval(function() {
                num++;
                elemt.style.opacity = num / 20;
                if(num >= 20) {
                    elemt.style.display = '';
                    clearInterval(timer);
                }
            }, speed);
        }
    }

    // 判断是否含有class
    function hasClassName(obj,name){
        if(!name) {
            return false;
        }
        let tmpName = obj.className;
        let tmpReg = new RegExp(name,'g');
        if(tmpReg.test(tmpName)){
            return true;
        }else{
            return false;
        }
    }

    // 淡出效果，即渐渐消失
    function fadeOut(elemt, speed) { //淡出 1 ~ 0
        if(elemt.style.opacity == 1 || elemt.style.opacity == "") {
            speed = speed || 16.6; //默认速度为16.6ms
            let num = 20; //累剪器
            let timer = setInterval(function() {
                num--;
                elemt.style.opacity = num / 20;
                if(num == 0) {
                    elemt.style.display = 'none';
                    clearInterval(timer);
                }
            }, speed);
        }
    }

    // 查找子孙节点中含有类名className的元素， 并排除excludeClasName
    function getElementChildNodeByClassName(element, className, excludeClasName){
        if(hasClassName(element, className)) {
            return element;
        }

        if(excludeClasName && hasClassName(element, excludeClasName)) {
           return null;
         }

        if(element.children && element.children.length > 0) {
            for(let child of element.children) {
                let now = getElementChildNodeByClassName(child, className, excludeClasName);

                if(now !== null) {
                    return getElementChildNodeByClassName(child, className, excludeClasName);
                }
            }
        }

        return null
    }

    // 查找子孙节点中含有属性attributeName的元素
    function getElementChildNodeByAttributeName(element, attributeName){
        if(element.getAttribute(attributeName) !== null) {
            return element;
        }

        if(element.children && element.children.length > 0) {
            for(let child of element.children) {
                let now = getElementChildNodeByAttributeName(child, attributeName);

                if(now !== null) {
                    return getElementChildNodeByAttributeName(child, attributeName);
                }
            }
        }

        return null
    }

    // 通过属性获取父节点
    function getElementParentNodeByAttributeName(element, attributeName) {
        while(element != null && element.getAttribute(attributeName) == null) {
            element = element.parentElement;
        }

        return element;
    }

    // 通过类名获取父节点
    function getElementParentNodeByClassName(element, className) {
        while(element != null && !hasClassName(element, className)) {
            element = element.parentElement;
        }

        return element;
    }

    // 创建复制按钮
    function createCopyButton(outTag, value, copyName) {
        copyName = copyName || '复制';
        let copyTag = doc.createElement('a');

        copyTag.style.paddingLeft = '8px';
        copyTag.href = 'javascript:void(0)';
        copyTag.innerHTML = copyName;
        copyTag.style.color = '#ee0000';
        copyTag.style.textDecoration = 'none';
        outTag.appendChild(copyTag);

        let tipTag = doc.createElement('span');

        tipTag.style.paddingLeft = '8px';
        tipTag.innerHTML = '复制成功！';
        tipTag.style.fontWeight = 'normal';
        tipTag.style.color = '#3a911d';
        tipTag.style.opacity = '0';
        tipTag.style.display = 'none';
        tipTag.style.fontSize = '12px';
        outTag.appendChild(tipTag);

        copyTag.addEventListener('click', function () {
            navigator.clipboard.writeText(value);
            tipTag.style.opacity = '1';
            tipTag.style.display = '';
            fadeOut(tipTag, 50);
        })
    }

    // 创建广告提取参数
    function createAdElement(container, title, value, isWrap, canCopy) {
        if(typeof(isWrap) === 'undefined') {
            isWrap = false;
        }
        if(typeof(canCopy) === 'undefined') {
            canCopy = true;
        }

        let outTag = doc.createElement('div');

        outTag.style.fontWeight = '600';
        outTag.innerHTML = isWrap? title + '<br />' : title;
        container.appendChild(outTag);

        let textTag = doc.createElement('span');

        if(!isWrap) {
            textTag.style.paddingLeft = '8px';
        }

        textTag.innerHTML = value;
        textTag.style.fontWeight = 'normal';
        outTag.appendChild(textTag);

        if(canCopy) {
            createCopyButton(outTag, value);
        }
    }

    // 创建广告面板
    function createAdPanel(asinSelector, asin, sku, campaignId, adId, searchTerms, slotName) {
        campaignId = campaignId || '无';
        adId = adId || '无';
        searchTerms = searchTerms || '无';
        slotName = slotName || '无';
        sku = sku || '无';

        if(!asinSelector) {
            return null;
        }

        let container = doc.createElement('div');

        container.style.position = 'absolute';
        container.style.zIndex = 1000;
        container.style.top = '0';
        container.style.left = '0';
        container.style.right = '0';
        container.style.bottom = '0';
        container.style.background = '#FFF';
        container.style.color = '#333';
        container.style.fontSize = '13px';
        container.style.textAlign = 'left';
        container.style.lineHeight = '22px';
        container.style.padding = '10px 10px';
        container.style.opacity = '0';
        container.style.display = 'none';
        container.style.border = '2px solid #7fda69';
        container.style.cursor = 'default';

        container.addEventListener('click', function () {
            event.stopPropagation();
            event.preventDefault();
        })

        asinSelector.addEventListener('mouseover', function () {
            container.style.display = '';
            fadeIn(container, 10);
        })

        asinSelector.addEventListener('mousemove', function () {
            if(container.style.display != '') {
                container.style.display = '';
                fadeIn(container, 10);
            }
        })

        asinSelector.addEventListener('mouseleave', function () {
            container.style.opacity = '1';
            container.style.display = '';
            fadeOut(container, 30);
        })

        asinSelector.appendChild(container);

        /* 广告链接行 */
        let adLinkDiv = doc.createElement('div');
        adLinkDiv.style.fontWeight = '600';
        adLinkDiv.innerHTML = '==>';
        container.appendChild(adLinkDiv);

        let adLink = 'https://advertising.amazon.com/cm/sp/campaigns/' + campaignId + '/ad-groups/' + adId + '/ads';

        createCopyButton(adLinkDiv, adLink, '复制广告链接');

        /* Asin行 */
        createAdElement(container, 'ASIN:', asin);

        /* Sku行 */
        createAdElement(container, 'SKU:', sku);

        /* campaignId行 */
        createAdElement(container, 'Campaign Id:', campaignId, true);

        /* adId行 */
        createAdElement(container, 'Ad Id:', adId, true);

        /* searchTerms行 */
        if(searchTerms !== '无') {
            searchTerms = Base64.decode(searchTerms[0]);
        }

        createAdElement(container, 'Search Terms:', searchTerms, true);

        /* slotName行 */
        createAdElement(container, 'Slot Name:', slotName, false, false);

        return container;
    }

    // 监听商品广告列表是否更新了列表
    function createProductDetailAdMutationObserver(elementId) {
        // Execute again when item variation is selected
        let element = doc.getElementById(elementId);
        if (element) {
            let MO = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(nodeElement) {
                        if(nodeElement.id !== undefined && nodeElement.id !== null && nodeElement.id !== '') {
                            matchProductDetailAdText(nodeElement);
                            nodeElement.setAttribute('data-ad-mark-up', '');
                        }
                    });
                });
            });
            MO.observe(element, { childList: true, subtree: true });
        }
    }

    // 匹配搜索页面商品列表广告
    function matchProductListAdText(element) {
        if(element) {
            let adTag = /(?<=\/af\/sp-loom\/feedback-form\?)[^"]+(?=")/ig;
            let adList = element.innerHTML.match(adTag);

            if(!adList || adList.length == 0) {
                return;
            }

            adList.forEach(function (adUrl) {
                if (adUrl && adUrl.length > 0) {
                    adUrl = decodeURIComponent(adUrl);

                    let campaignId = adUrl.match(campaignIdTag);
                    let adId = adUrl.match(adIdTag);
                    let asin = adUrl.match(asinTag);
                    let sku = adUrl.match(skuTag);
                    let searchTerms = adUrl.match(searchTermsTag);
                    let slotName = adUrl.match(slotNameTag);

                    if (asin) {
                        let asinSelector = getElementChildNodeByClassName(element, 's-product-image-container');

                        createAdPanel(asinSelector, asin, sku, campaignId, adId, searchTerms, slotName);
                    }
                }
            })
        }
    }

    // 匹配商品详情页面下的广告
    function matchProductDetailAdText(element, aModel) {
        if(element) {
            aModel = aModel || getElementChildNodeByAttributeName(element, 'data-a-modal');

            let adTag = /(?<=\/af\/sp-detail\/feedback-form\?)[^}]+(?=}")/ig;
            let adLinkJson = JSON.parse(aModel.getAttribute('data-a-modal'));

            if(adLinkJson && adLinkJson.url) {
                let adUrl = decodeURIComponent(adLinkJson.url);
                let campaignId = adUrl.match(campaignIdTag);
                let adId = adUrl.match(adIdTag);
                let asin = adUrl.match(asinTag);
                let sku = adUrl.match(skuTag);
                let searchTerms = adUrl.match(searchTermsTag);
                let slotName = adUrl.match(slotNameTag);

                if (asin) {
                    let asinSelector = getElementChildNodeByClassName(element, 'a-link-normal');

                    if(asinSelector) {
                        asinSelector.style.position = 'relative';
                    }

                    let decodeSku = sku;

                    if(sku) {
                        decodeSku = Base64.decode(sku[0]);
                    }

                    let container = createAdPanel(asinSelector, asin, decodeSku, campaignId, adId, searchTerms, slotName);

                    if(container) {
                        container.style.fontSize = '11px';
                        container.style.lineHeight = '18px';
                        container.style.bottom = 'auto';
                        container.style.padding = '6px 4px';
                    }
                }
            }
        }
    }

    // 匹配搜索页面视频广告
    function matchProductListVideoAdText(element) {
        if(element) {
            let aModel = getElementChildNodeByAttributeName(element, 'data-a-modal');

            if(aModel != null) {
                let adTag = /(?<=\/af\/feedback-form\?)[^}]+(?=}")/ig;
                let adLinkJson = JSON.parse(aModel.getAttribute('data-a-modal'));

                if(adLinkJson && adLinkJson.url) {
                    let adUrl = decodeURIComponent(adLinkJson.url);
                    let campaignId = adUrl.match(campaignIdTag);
                    let adId = adUrl.match(adIdTag);
                    let asin = adUrl.match(asinTag);
                    let sku = adUrl.match(skuTag);
                    let searchTerms = adUrl.match(searchTermsTag);
                    let slotName = adUrl.match(slotNameTag);

                    asin = asin || '无';
                    let asinSelector = getElementChildNodeByClassName(element, 's-product-image-container', 'sbv-product-image-condensed');

                    if(asinSelector) {
                        asinSelector.style.position = 'relative';
                    }
                    createAdPanel(asinSelector, asin, sku, campaignId, adId, searchTerms, slotName);
                }
            }
        }
    }

    // 滚动商品列表广告初始化
    function carouselIntervalInit() {
        let anonCarousel = doc.querySelectorAll('.a-carousel-viewport');

        anonCarousel.forEach(function(element) {
            if(anonCarouselData.indexOf(element.id) === -1) {
                createProductDetailAdMutationObserver(element.id);
                anonCarouselData.push(element.id);
            }
        })
    }

    /* ===================== */
    /* 鼠标移动监听事件 */
    /* ===================== */
    // 鼠标移动监听商品搜索页面广告
    function productListEventListener() {
        let element = doc.elementFromPoint(event.x, event.y);

        element = getElementParentNodeByAttributeName(element, 'data-asin');

        // 匹配搜索页面商品广告
        if(element != null && element.getAttribute('data-asin') !== null && element.getAttribute('data-asin') !== '' &&
           hasClassName(element, 'AdHolder') && element.getAttribute('data-ad-mark-up') === null) {
            matchProductListAdText(element);

            element.setAttribute('data-ad-mark-up', '');
        }
    }

    // 鼠标移动监听商品搜索页面视频广告
    function productListVideoEventListener() {
        let element = doc.elementFromPoint(event.x, event.y);

        element = getElementParentNodeByClassName(element, 's-widget-spacing-medium');

        // 匹配搜索页面视频广告
        if(element != null && element.getAttribute('data-component-type') !== null && element.getAttribute('data-ad-mark-up') === null) {
            matchProductListVideoAdText(element);

            element.setAttribute('data-ad-mark-up', '');
        }
    }

    // 鼠标移动监听商品详情页面下的广告
    function productDetailEventListener() {
        let element = doc.elementFromPoint(event.x, event.y);

        element = getElementParentNodeByClassName(element, 'a-carousel-card');

        // 匹配商品详情页面下的广告
        if(element != null) {
            let detailElement = getElementChildNodeByAttributeName(element, 'data-asin');

            if(detailElement != null && detailElement.getAttribute('data-ad-mark-up') === null) {
                let aModel = getElementChildNodeByAttributeName(detailElement, 'data-a-modal');

                if(aModel !== null) {
                    matchProductDetailAdText(detailElement, aModel);

                    detailElement.setAttribute('data-ad-mark-up', '');
                }
            }
        }
    }

    // 定时，每0.5秒就查找一次广告列表，并保存列表Id，确保不会重复执行
    window.setInterval(carouselIntervalInit, 500);

    let bodyTag = doc.querySelector('body');

    bodyTag.addEventListener('mousemove', function () {
        // 鼠标移动监听商品搜索页面广告
        productListEventListener();

        // 鼠标移动监听商品搜索页面视频广告
        productListVideoEventListener();

        // 鼠标移动监听商品详情页面下的广告
        productDetailEventListener();
    })
})(document);