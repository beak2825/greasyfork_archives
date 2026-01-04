// ==UserScript==
// @name         京东单价助手
// @namespace    http://greasyfork.org/
// @version      1.21
// @description  京东(jd.com)单价助手，增加了商品列表显示单价(每公斤/升价格)功能，帮助你在京东(jingdong)找到最划算的商品
// @author       Yarmu
// @match        *://search.jd.com/*
// @match        *://list.jd.com/*
// @match        *://item.jd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @supportURL   https://greasyfork.org/zh-CN/scripts/30522-%E4%BA%AC%E4%B8%9C%E5%8D%95%E4%BB%B7%E5%8A%A9%E6%89%8B
// @downloadURL https://update.greasyfork.org/scripts/30522/%E4%BA%AC%E4%B8%9C%E5%8D%95%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/30522/%E4%BA%AC%E4%B8%9C%E5%8D%95%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var host = window.location.host.toLowerCase();
    window.priceTipEnabled = GM_getValue('jd_price_tip_enabled', true);
    if (host === 'list.jd.com' || host === 'search.jd.com') {
        addPriceTipListener('.p-price', addListPriceTip, 1000);
        addPriceTipListener('.f-sort', addListPriceButton);
    } else if (host === 'item.jd.com') {
        addPriceTipListener('.p-price', addItemPriceTip);
        addPriceTipListener('.p-price-plus', addItemPriceTip);
        addPriceTipListener('.p-price-sam', addItemPriceTip);
    }
})();

function addPriceTipListener(tag, func, time) {
    var onModifiedFunc = function() {
        $(this).unbind("DOMSubtreeModified");
        func.call(this);
        $(this).bind("DOMSubtreeModified", onModifiedFunc);
    };
    var eachCallFunc = function() {
        $(tag).each(function() {
            if (!$(this).attr('priceTip')) {
                $(this).attr('priceTip', '1');
                onModifiedFunc.call(this);
            }
        });
    };
    eachCallFunc();
    if (time) {
        setInterval(eachCallFunc, time);
    }
}

function addListPriceTip() {
    if (!window.priceTipEnabled) return;
    //处理plus价格的情况
    addPlusListPriceTip.call(this, '.price-plus-1');
    addPlusListPriceTip.call(this, '.price-sams-1');

    //处理列表价格
    var priceItem = $(this).find('strong i');
    var price = getFloat(priceItem.text());
    if (isNaN(price)) {
        //处理广告和推广价格
        priceItem = $(this).find('strong span');
        price = getFloat(priceItem.text());
        if (isNaN(price)) {
            priceItem = $(this).find('strong');
            price = getFloat(priceItem.text());
            if (isNaN(price)) {
                priceItem = $(this);
                price = getFloat(priceItem.text());
            }
        }
    }
    if (isNaN(price)) return;

    var title = null;
    var index = 0;
    $(this).parent().find('.p-scroll .ps-wrap .ps-main .ps-item a').each(function(idx) {
        if ($(this).attr('class') === 'curr' && $(this).attr('title')) {
            title = $(this).attr('title').trim();
            index = idx;
            return false;
        }
    });
    var unit = getUnit(title, price);
    if (unit === null && index === 0) {
        title = $(this).parent().find('.p-name a em').text().trim();
        if (!title) {
            title = $(this).parent().find('.p-name a').text().trim();
        }
        unit = getUnit(title, price);
    }
    if (unit === null) return;

    var htm = '&nbsp;(' + unit.price + '/' + unit.unit + ')';
    title = '( 助手估重: ' + unit.capacity + unit.unit + ' = ' + unit.tip + ' )\n' + title;
    priceItem.append(htm);
    $(this).attr('priceCapacity', unit.capacity);
    $(this).attr('priceUnit', unit.unit);
    addPlusListPriceTip.call(this, '.price-plus-1');
    addPlusListPriceTip.call(this, '.price-sams-1');
    var tipItem = $(this).parent().find('.p-name a');
    setTimeout(function() {
        tipItem.attr('title', title);
    }, 1000);
}

function addPlusListPriceTip(tag) {
    var plusItem = $(this).find(tag);
    if (plusItem.length === 0) return;
    var priceItem = plusItem.find('em');
    var price = getFloat(priceItem.text());
    if (isNaN(price)) return;
    var cap = parseFloat($(this).attr('priceCapacity'));
    if (isNaN(cap)) return;
    var unit = $(this).attr('priceUnit');
    price = Math.round(parseFloat(price) / cap * 100) / 100;
    var htm = '&nbsp;(' + price + '/' + unit + ')';
    plusItem.insertAfter($(this));
    plusItem.css({'display':'block'});
    priceItem.append(htm);
}

function addListPriceButton() {
    var button = $(this).find('#priceTipButton');
    if (button.length > 0) return;
    if(!$(this).text().trim()) return;
    var isEnabled = window.priceTipEnabled;
    button = $('<a id="priceTipButton" href="javascript:;"' + (isEnabled? ' class="curr"': '') + '><span class="fs-tit">单价助手</span></a>');
    $(this).append(button);
    button.click(function() {
        var nextEnabled = !window.priceTipEnabled;
        GM_setValue('jd_price_tip_enabled', nextEnabled);
        window.priceTipEnabled = nextEnabled;
        $(this).attr('class', (nextEnabled? 'curr': ''));
        SEARCH.sort(getQueryString('psort'));
    });
}

function addItemPriceTip() {
    if (!window.priceTipEnabled) return;
    var priceItem = $(this).find('.price');
    var price = getFloat(priceItem.text());
    if (isNaN(price)) return;
    var title = $('.sku-name').text().trim();
    var unit = getUnit(title, price);
    if (unit === null) return;
    var htm = '&nbsp;(' + unit.price + '/' + unit.unit + ')';
    title = '&nbsp;( 助手估重: ' + unit.capacity + unit.unit + ' = ' + unit.tip + ' )';
    priceItem.append(htm);
    if (!window.hasAddItemPriceTip) {
        window.hasAddItemPriceTip = true;
        setTimeout(function() {
            $('#summary-weight .dd').append(title);
            $('#summary-weight').css({'display':'block'});
        }, 1000);
    }
}

function getUnit(title, price) {
    if (!title) return null;
    if (price <= 0) return null;

    //处理包含：和送的情况
    if (title.match(/：|[)）】]送/)){
        var titles = title.split(/：|[)）】]送/);
        for (var t=0; t<titles.length; ++t) {
            var res = getUnit(titles[t], price);
            if (res) return res;
        }
    }

    var regQuant = "个只瓶罐听桶提卷包袋件盒箱组副份盆盘碗支";
    var regWeigh = "g|kg|ml|l|千克|克|斤|公斤|毫升|升";
    var regFloat = "\\d+\\.?\\d*?(?:\\s*-\\s*\\d+\\.?\\d*?)?";
    //处理有总重量的情况
    var reg0 = new RegExp('(?:[总净]重量?约?|\\s约)\\s*('+regFloat+')\\s*('+regWeigh+')', 'g');
    var pos0 = {i: 0, pCap: 1, pUnit: 2, pCount: 3};
    //处理数量前置的情况
    var reg1 = new RegExp('(\\d+)\\s*['+regQuant+']?\\s*[*x×'+regQuant+']\\s*('+regFloat+')\\s*('+regWeigh+')', 'ig');
    var pos1 = {i: 1, pCap: 2, pUnit: 3, pCount: 1};
    //处理数量后置的情况
    var reg2 = new RegExp('('+regFloat+')\\s*('+regWeigh+')(?:\\s*\\/?[\\u4e00-\\u9fa5]*)((?:\\s*[*x×'+regQuant+']\\s*\\d+[\\u4e00-\\u9fa5]?)*)', 'ig');
    var pos2 = {i: 2, pCap: 1, pUnit: 2, pCount: 3};

    var reg, pos;
    //处理有括号的情况
    var name = title.replace(/[(（【][^)）】]+?(\)|）|】|$)/g, '');
    if (reg0.test(title)) {
        name = title; reg = reg0; pos = pos0;
    } else if (reg1.test(name)) {
        reg = reg1; pos = pos1;
    } else if (reg2.test(name)) {
        reg = reg2; pos = pos2;
    } else if (reg1.test(title)) {
        name = title; reg = reg1; pos = pos1;
    } else {
        name = title; reg = reg2; pos = pos2;
    }
    //处理套装的情况
    var isOnlyOne = !/[+＋送和]/i.test(name);

    var match = null;
    var cap = 0, count = 0, lastMul = 1;
    var un = '', tip = '';
    reg.lastIndex = 0;
    while ((match = reg.exec(name))) {
        var capacity;
        var caps = match[pos.pCap].split('-');
        if (caps.length == 2) {
            capacity = (parseFloat(caps[0].trim()) + parseFloat(caps[1].trim()))/2;
        } else {
            capacity = parseFloat(match[pos.pCap].trim());
        }
        if (match.length > 3 && match[pos.pCount]) {
            var multiple = match[pos.pCount].match(/\d+/g);
            if (multiple) for (var i=0; i<multiple.length; ++i) {
                lastMul = parseInt(multiple[i]);
                capacity *= lastMul;
            }
        }
        if (capacity <= 0) {
            continue;
        }
        var unit = match[pos.pUnit].toLowerCase();

        if (unit === 'g' || unit === '克') {
            capacity /= 1000;
            unit = 'kg';
        } else if (unit === '千克' || unit === '公斤') {
            unit = 'kg';
        } else if (unit === '斤') {
            capacity /= 2;
            unit = 'kg';
        } else if (unit === 'ml' || unit === '毫升') {
            capacity /= 1000;
            unit = 'L';
        } else if (unit === 'l' || unit === '升') {
            unit = 'L';
        }
        if (un === '' || un === unit) {
            //处理重复出现的情况
            if (isOnlyOne) {
                if (capacity > cap) {
                    tip = ''; cap = 0; count = 0;
                } else {
                    continue;
                }
            }
            un = unit;
            tip += match[0] + ' ';
            cap += capacity;
            ++count;
        }
    }

    //处理数量在其他位置的情况
    if (count == 1 && pos.i !== 0) {
        var regZhn = '两一二三四五六七八九十';
        var regMul = '(?:[^*x×满\\d])\\s*(\\d+|['+regZhn+'])['+regQuant+'](?!\\d+折|松)';
        reg = new RegExp(regMul, 'i');
        match = reg.exec(title);
        if (match) {
            var mul = regZhn.indexOf(match[1]);
            if (mul == -1) mul = parseInt(match[1]);
            else if (mul === 0) mul = 2;
            if (lastMul != mul) {
                cap *= mul;
                tip += match[0].substr(1, match[0].length-1).trim();
            }
        }
    }

    if (cap > 0) {
        var unitPrice = parseFloat(price) / cap;
        //如果单价>1000元或<1元，太大或太小不显示
        if (unitPrice > 1000 || unitPrice < 1) return null;
        else return {
            capacity: Math.round(cap * 10000) / 10000,
            unit: un,
            price: Math.round(unitPrice * 100) / 100,
            tip: tip.trim()
        };
    } else return null;
}

function getFloat(str) {
    str = str.replace('￥','').trim();
    if (!/^\d+\.?\d*$/.test(str)) return NaN;
    return parseFloat(str);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return '';
}
