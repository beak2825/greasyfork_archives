// ==UserScript==
// @name         一号店单价助手
// @namespace    http://greasyfork.org/
// @version      1.01
// @description  一号店(yhd.com)单价助手，补全了商品列表中有些商品没标单价的信息，帮助你在1号店(yihaodian)找到最划算的商品
// @author       Yarmu
// @match        *://list.yhd.com/*
// @match        *://search.yhd.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @supportURL   http://greasyfork.org/zh-CN/users/41708-yarmu
// @downloadURL https://update.greasyfork.org/scripts/30690/%E4%B8%80%E5%8F%B7%E5%BA%97%E5%8D%95%E4%BB%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/30690/%E4%B8%80%E5%8F%B7%E5%BA%97%E5%8D%95%E4%BB%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    var enabled = GM_getValue('yhd_price_tip_enabled', true);
    addListPriceButton(enabled);
    if (enabled) {
        addPriceTipListener('.proPrice', addListPriceTip, 1000);
    }
})();

function addPriceTipListener(tag, func, time) {
    var eachCallFunc = function() {
        $(tag).each(function() {
            if (!$(this).attr('priceTip')) {
                $(this).attr('priceTip', '1');
                func.call(this);
            }
        });
    };
    eachCallFunc();
    if (time) {
        setInterval(eachCallFunc, time);
    }
}

function addListPriceTip() {
    var infoItem = $(this).find('.num');
    if (infoItem.length === 0) infoItem = $(this).find('.price');
    var price = infoItem.attr('yhdprice');
    console.log(price);
    if (!price) return;

    var capacity = infoItem.attr('diapernum');
    var unitType = infoItem.attr('productunit');
    var unitItem = $(this).find('.unit_price');
    console.log([price, capacity, unitType, unitItem.length]);
    if (capacity && unitType && unitItem.length) return;

    var titleItem = $(this).parent().find('.proName a');
    if(titleItem.length === 0) titleItem = $(this).parent().find('.title a');
    var title = titleItem.text().trim();
    price = parseFloat(price);
    capacity = parseFloat(capacity);

    var unit;
    if (!isNaN(capacity) && capacity > 0 && unitType && unitItem.length === 0) {
        if (unitType == '4') {
            unitType = 'L';
            capacity /= 1000;
            price /= capacity;
        } else {
            unitType = '500g';
            capacity /= 500;
            price /= capacity;
        }
        unit = {
            price: Math.round(price * 100) / 100,
            capacity: Math.round(capacity * 10000) / 10000,
            unit: unitType
        };
    } else {
        unit = getUnit(title, price);
        if (unit === null) return;
    }

    var htm = '(¥' + unit.price + '/' + unit.unit + ')';
    if (unit.tip) {
        title = '( 助手估重: ' + unit.capacity + unit.unit + ' = ' + unit.tip + ' )\n' + title;
        titleItem.attr('title', title);
    }
    if (!unitItem.length) {
        unitItem = $('<span class="unit_price"></span>');
        $(this).append(unitItem);
    }
    unitItem.html(htm);
}

function addListPriceButton(isEnabled) {
    var button = $('#priceTipButton');
    if (button.length > 0) return;
    button = $('<a' + (isEnabled? ' class="cur"': '') + ' href="javascript:void(0);">单价助手</a>');
    $('.sort_b').append(button);
    button.click(function() {
        GM_setValue('yhd_price_tip_enabled', !isEnabled);
        $(this).attr('class', (!isEnabled? 'cur': ''));
        location.reload();
    });
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
            capacity /= 500;
            unit = '500g';
        } else if (unit === 'kg' || unit === '千克' || unit === '公斤') {
            capacity *= 2;
            unit = '500g';
        } else if (unit === '斤') {
            //capacity /= 2;
            unit = '500g';
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
        //如果单价>2000元或<0.5元，太大或太小不显示
        if (unitPrice > 2000 || unitPrice < 0.5) return null;
        else return {
            capacity: Math.round(cap * 10000) / 10000,
            unit: un,
            price: Math.round(unitPrice * 100) / 100,
            tip: tip.trim()
        };
    } else return null;
}
