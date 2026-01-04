// ==UserScript==
// @name         LWM_LGBookmarks
// @name:ru      Наборы армий гильдии лидеров.
// @namespace    saturn_hwm
// @version      0.4
// @homepage     https://greasyfork.org/ru/scripts/401090-lwm-lgbookmarks
// @description  Provides a leaders guild's army set bookmarks. Beta version.
// @description:ru Предоставляет дюжину закладок для сохранения наборов войск гильдии лидеров и позволяет копировать и вставлять набор армии в текстовом виде. Бета версия.
// @author       saturn573
// @match        https://*.heroeswm.ru/leader_guild.php*
// @match        https://*.heroeswm.ru/leader_army.php*
// @match        http://daily.heroeswm.ru/leader/lg_daily.php*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/401090/LWM_LGBookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/401090/LWM_LGBookmarks.meta.js
// ==/UserScript==

function LWMBookmarks() {
    this.update();
}
LWMBookmarks.prototype = {
    applyOnce: undefined,
    availableArmy: undefined,
    store: function() { storeObj(this, undefined, true); },
    update: function() { updateObj(this, undefined, true); },
    getStorageKey: function() { return 'GlobalParam'; }
};

function getStorageKey(objItem, storageKey, isCommon) {
    if (undefined == storageKey && undefined != objItem
        && 'function' == typeof objItem.getStorageKey) {
        storageKey = objItem.getStorageKey();
    }
    storageKey = storageKey || 'params';

    if (!isCommon) {
        let match = /pl_id\s*=\s*(\d+)/.exec(document.cookie);
        if (match) {
            storageKey += '_'+ match[1];
        }
        else {
            console.log('Invalid cookie!');
        }
    }

    if (!storageKey) {
        console.log('There is no storage key!');
    }
    return storageKey;
}

function getStorableObj(objItem) {
    if (undefined == objItem) {
        return objItem;
    }
    let storableObj = {};
    let keysCounter = 0;
    for (let key in objItem) {
        let keyValue = objItem[key];
        if (undefined == keyValue || "function" == typeof keyValue) {
            continue;
        }
        storableObj[key] = keyValue;
        keysCounter++;
    }
    if (0 == keysCounter) {
        storableObj = undefined;
    }
    return storableObj;
}

function storeObj(objItem, storageKey, isCommon) {
    storageKey = getStorageKey(objItem, storageKey, isCommon);
    if (!storageKey) {
        return;
    }

    let value = getStorableObj(objItem);

    if (undefined == value) {
        GM_deleteValue(storageKey);
    }
    else {
        GM_setValue(storageKey, JSON.stringify(value));
    }
}

function updateObj(objItem, storageKey, isCommon) {
    storageKey = getStorageKey(objItem, storageKey, isCommon);
    if (!storageKey) {
        return;
    }

    let storedObj = GM_getValue(storageKey);
    if (undefined == storedObj) {
        return;
    }

    try {
        storedObj = JSON.parse(storedObj);
        for (let key in storedObj) {
            objItem[key] = storedObj[key]
        }
    }
    catch (err) {
        console.log(err);
    }
}

function getElem(css, root) {
    if (!root) root = document;
    if (!root.querySelector) {
        console.log('Invalid root! %s', css);
        return;
    }
    return root.querySelector(css);
}

function getElems(css, root) {
    if (!root) root = document;
    if (!root.querySelectorAll) {
        console.log('Invalid root! %s', css);
        return [];
    }
    return root.querySelectorAll(css);
}

function addElem(tag, details) {
    let el = document.createElement(tag);
    if (details) {
        for (var key in details) {
            el[key] = details[key];
        }
    }
    return el;
}

function addText(text) {
    return document.createTextNode(text);
}

function setEventHandler(elem, eventName, eventHandler) {
    let type = (typeof elem).toLowerCase();
    if ('string' == type) {
        let el = getElems(elem);
        for (let ii = 0; ii < el.length; ii++) {
            el[ii].addEventListener(eventName, eventHandler);
        }
    }
    else if ('object' == type) {
        elem.addEventListener(eventName, eventHandler);
    }
    else {
        console.log('Unexpected elem type: %s of %o', type, elem);
    }
}

function addStyle(css) {
    document.head.appendChild(addElem('style', { innerHTML: css }));
}

function isAvailableStack(name, count, g) {
    if (undefined == g) {
        g = new LWMBookmarks();
    }
    let army = g.availableArmy;
    if (undefined == army) {
        return false;
    }

    return (army[name] || 0) >= count;
}

function isAvailableArmy(text, g) {
    if (undefined == g) {
        g = new LWMBookmarks();
    }
    if (undefined == g.availableArmy) {
        return false;
    }
    let army = g.availableArmy;
    let result = true;
    let pp = text.split(', ');
    if (pp && 2 < pp.length)
    {
        for (let ii = 0; ii < pp.length; ii++) {
            let nc = pp[ii].split('=');
            let count = parseInt(nc[1]);
            let aa = army[nc[0]] || 0;
            if (aa < count) {
                result = false;
                break;
            }
        }
    }
    return result;
}

function setupPageDailyTable() {
    let g = new LWMBookmarks();

    const cnB = 'lwm-lgt-b';
    const cnAllow = 'allow';
    const cnDeny = 'deny';
    addStyle('.' + cnB + ' { float: right; min-width: 1.4rem; margin-top: 0.8rem; margin-right: 0.4rem; text-align: center; }');
    addStyle('.' + cnB + '.' + cnDeny + ' { background-color: lightpink; }');
    addStyle('.' + cnB + '.' + cnAllow + ' { background-color: lawngreen; }');

    let sb = getElems('div.spoiler-body-1');
    if (!sb) {
        console.log('!sb');
        return;
    }

    sb.forEach((el, ii) => {
        let tbl = el.firstChild;
        while (tbl) {
            let ttl = [];
            let ad = getElems('div.cre_creature', tbl);
            let cell;
            for (let ii = 0; ii < ad.length; ii++) {
                let img = getElem('a[href*="/army_info.php?name="] img[alt]', ad[ii]);
                let cnt = getElem('#add_now_count', ad[ii]);
                if (!img || !cnt) {
                    continue;
                }
                cell = ad[ii].parentNode;
                let name = img.title;
                let count = parseInt(cnt.textContent);
                ttl.push(name + '=' + count);
                if (!isAvailableStack(name, count, g)){
                    cnt.style.color = 'red';
                }
            }
            if (cell && ttl.length > 0) {
                let army = ttl.join(', ');

                let bс = addElem('button', { className: cnB, innerHTML: '\uD83D\uDCCB', title: 'Копировать', army: army } );
                setEventHandler(bс, 'click', function() {
                    GM_setClipboard(this.army);
                });
                cell.appendChild(bс);

                let ba = addElem('button', { className: cnB, innerHTML: '\u2713', title: 'Установить', applyOnce: army } );
                setEventHandler(ba, 'click', function() {
                    let gg = new LWMBookmarks();
                    gg.applyOnce = this.applyOnce;
                    gg.store();
                    location.assign('https://www.heroeswm.ru/leader_army.php');
                });
                if (isAvailableArmy(army, g)) {
                    ba.classList.add(cnAllow);
                } else {
                    ba.classList.add(cnDeny);
                }
                cell.appendChild(ba);
            }
            tbl = tbl.nextSibling;
        }
    });
}

function setupPageLeaderGuild() {
    let lg = getElem('a[href*="lg_daily_rating.php?day="]');
    if (lg) {
        lg.parentNode.insertBefore(addElem('a', { innerHTML: 'Таблица', href: 'http://daily.heroeswm.ru/leader/lg_daily.php' }), lg);
        lg.parentNode.insertBefore(addText('|'), lg);
    }
}

function getDamage(count, damage, attack, defence) {
    let modifier = 1;
    if (attack > defence) {
        modifier = 1 + ((attack - defence) * 0.05);
    }
    else if (attack < defence) {
        modifier = 1 / (1 + (defence - attack) * 0.05);
    }
    return Math.floor(count * parseInt(damage) * modifier).toFixed(0);
}

function initPercents() {
    let cs = getElem('div.content_separator');
    if (!cs) {
        console.log('no cs');
        return;
    }
    cs.style.height = '1.1rem';

    addStyle('.lwm-lg-w { position: relative; width: 100%; margin-left: 1rem; }');
    addStyle('.lwm-lg-w > creature_slider { text-align: center }');
    let csw = addElem('div', { className: 'lwm-lg-w' });
    for (let ii = 0; ii < 7; ii++) {
        csw.appendChild(addElem('div', { className: 'creature_slider', slotNum: ii + 1, id: 'perc' + ii }));
    }
    cs.appendChild(csw);

    range_link.rangeslider().on("input", onArmyChanged);

    setEventHandler('#reset_div', 'click', onArmyChanged);

    onArmyChanged();
}

function getCurrentLeaderArmyText() {
    let res = [];
    for (let ii = 0; ii < obj_army.length; ii++) {
        let oa = obj_army[ii];
        if (!oa || !oa.link || !oa.count) {
            continue;
        }
        let ob =obj[oa.link];
        if (!ob || !ob.name) {
            continue;
        }
        res.push(ob.name + '=' + oa.count);
    }
    return res.join(', ');
}

function updateStatistics() {
    let percentDiv = [];
    for (let ii = 0; ii < 7; ii++) {
        let pd = getElem('#perc'+ii);
        percentDiv[pd.slotNum] = pd;
    }
    for (let ii = 0; ii < percentDiv.length; ii++) {
        let pd = percentDiv[ii];
        if (!pd) {
            continue;
        }
        pd.innerHTML = '';
    }

    for (let ii = 1; ii < obj_army.length; ii++) {
        let oa = obj_army[ii];
        if (!oa || !oa.link) {
            continue;
        }
        let count = oa.count;
        let ob = obj[oa.link];
        let cost = ob.cost;
        percentDiv[ii].innerHTML = (100 * count * cost / max_leader).toFixed(1) + '%';
        let ttl = 'MAX: ' + (100 * count * cost / max_leader_by_stack).toFixed(1) + '%';
        ttl += '\n HP: ' + count * ob.maxhealth;
        let dmg = ob.damage.split('-');
        if (2 == dmg.length) {
            let attack = parseInt(ob.attack);
            let attackM = /\(\s*\+\s*(\d+)\s*\)/.exec(ob.attack);
            if (attackM) {
                attack += parseInt(attackM[1]);
            }
            ttl += '\n DMG: ';
            let defence = 0;
            while (defence <= 50) {
                ttl += '\nD' + defence + ': ' + getDamage(count, dmg[0], attack, defence) + ' - ' + getDamage(count, dmg[1], attack, defence);
                defence += 5;
            }
        }
        percentDiv[ii].title = ttl;
    }
}

function updateCurrentArmyBookmark() {
    const cnB = 'lwm-la-b';
    const cnCurrent = 'current';
    let ca = getCurrentLeaderArmyText();
    getElems('.' + cnB).forEach(b => {
        let isArmyEqual = ca && ca == b.title;
        let isCurrent = b.classList.contains(cnCurrent)
        if ((isArmyEqual && !isCurrent) || (!isArmyEqual && isCurrent)) {
            b.classList.toggle(cnCurrent);
        }
    });
}

function onArmyChanged() {
    updateCurrentArmyBookmark();
    updateStatistics();
}

function setElemsStyleDisplay(selector, display) {
    getElems(selector).forEach(xx => xx.style.display = display);
}

function showElems(selector, display) {
    setElemsStyleDisplay(selector, display || '');
}

function hideElems(selector) {
    setElemsStyleDisplay(selector, 'none');
}

function setLeaderArmy(text) {
    let cc = text.split(', ');
    if (!cc || 1 > cc.length) {
        console.log('Incorrect text: %s', text);
        return;
    }

    //reset
    for (let ii = 7; ii >= 1; ii--)
    {
        obj_army[ii].count = 0;
    }

    for (let ii = 0; ii < cc.length; ii++) {
        let c = cc[ii].split('=');
        let count = parseInt(c[1]);
        let name = c[0].trim();
        let link = -1;
        for (let jj = 0; jj < obj.length; jj++) {
            let ob = obj[jj];
            if (ob && ob.name == name) {
                link = jj;
                break;
            }
        }
        if (link >= 0) {
            let oa = obj_army[ii + 1];
            oa.link = link;
            oa.count = count;
        }
    }
    army_try_to_submit();
    show_details(-1);
    sliders_update();

    hideElems('#apply_div, #info_content');
    showElems('#reset_div');

    onArmyChanged();
}

function initPasteArea() {
    const dt = 'Вставить из буфера';
    let hc = getElem('div.army_info_block1 > div.info_header_content');
    if (!hc) {
        console.log('!hc');
        return;
    }
    hc.setAttribute('contenteditable', true);
    hc.innerHTML = dt;

    setEventHandler(hc, 'focus', function() {
        setTimeout(() => {
            document.execCommand('selectAll', true, null);
            document.execCommand('paste', true, null);
        }, 100);
    });

    let applyArmy = function() {
        if (dt == hc.textContent) {
            return;
        }
        hc.innerHTML = 'Вставить из буфера';
        setLeaderArmy(hc.textContent);
    }

    setEventHandler(hc, 'blur', applyArmy);
    setEventHandler(hc, 'keydown', function(e) {
        if (e.keyCode == 13) {
            applyArmy();
        }
        else {
            console.log('keydown event args: %o', e);
        }
    });
}

function initLeaderArmyBookmarks() {
    let bookmarks = {
        update: function() { updateObj(this); },
        store: function() { storeObj(this); },
        getStorageKey: function() { return 'LeaderArmyBookmarks'; }
    };
    bookmarks.update();
    const cnB = 'lwm-la-b';
    const cnCurrent = 'current';
    const cnSet = 'set';
    addStyle('.lwm-la-bw { position: absolute; top: 50%; right: -35px;\
-moz-transform: translate(0, -50%); -o-transform: translate(0, -50%);\
-ms-transform: translate(0, -50%); -webkit-transform: translate(0, -50%);\
transform: translate(0, -50%); }');
    addStyle('.' + cnB + ' { width: 34px; height: 34px; background-color: silver; cursor: pointer;\
border: 1px solid #333; border-right: none; margin: -1px 0;\
-webkit-border-top-left-radius: 6px; -webkit-border-bottom-left-radius: 6px;\
-moz-border-radius-topleft: 6px; -moz-border-radius-bottomleft: 6px;\
border-top-left-radius: 6px; border-bottom-left-radius: 6px;\
transition-duration: .15s; -webkit-transition-duration: .15s;\
-moz-transition-duration: .15s; -o-transition-duration: .15s;\
-ms-transition-duration: .15s; font-size: x-large; filter: grayscale(100%); }');
    addStyle('.' + cnB + '.' + cnSet + ' { filter: grayscale(0%); }');
    addStyle('.' + cnB + ':hover { transform: scale(1.2); }');
    addStyle('.' + cnB + '.' + cnCurrent + ' { filter: hue-rotate(185deg); }');
    addStyle('.' + cnB + '.' + cnCurrent + ':hover { transform: translateX(3px); }');
    addStyle('.' + cnB + '.' + cnCurrent + ':hover:after { content: "\u232B"; vertical-align: text-top; font-size: medium; color: #0ca86a; font-weight: bold; ');

    let bw = addElem('div', { className: 'lwm-la-bw' });
    let slotContent = ['&#9800;', '&#9801;', '&#9802;', '&#9803;', '&#9804;', '&#9805;',
                 '&#9806;', '&#9807;', '&#9808;', '&#9809;', '&#9810;', '&#9811;' ];
    for (let ii = 0; ii < slotContent.length; ii++) {
        let b = addElem('div', { className: cnB, slotNum: ii+1, innerHTML: slotContent[ii] });
        let txt = bookmarks[b.slotNum];
        if (txt) {
            b.classList.toggle(cnSet);
            b.title = txt;
        }
        setEventHandler(b, 'click', function() {
            let toggle = false;
            let txt = getCurrentLeaderArmyText();
            if (this.classList.contains(cnSet)) {
                if (txt == this.title) {
                    if (confirm("Очистить эту закладку?")) {
                        delete bookmarks[this.slotNum];
                        this.title = '';
                        toggle = true;
                    }
                }
                else  {
                    setLeaderArmy(this.title);
                }
            }
            else if (txt) {
                this.title = txt;
                bookmarks[this.slotNum] = txt;
                toggle = true;
            }
            if (toggle) {
                bookmarks.store();
                this.classList.toggle(cnSet);
                updateCurrentArmyBookmark();
            }
        });
        bw.appendChild(b);
    }
    army_info_div.appendChild(bw);
    updateCurrentArmyBookmark();
}

function initGlobal() {
    let a = {};
    for (let ii = 0; ii < obj.length; ii++) {
        let ob = obj[ii];
        if (ob && ob.name && ob.count) {
            a[ob.name] = ob.count;
        }
    }
    let g = new LWMBookmarks();
    g.availableArmy = a;

    if (g.applyOnce) {
        try
        {
            setLeaderArmy(g.applyOnce);
            delete g.applyOnce;
        }
        catch (err)
        {
            console.log(err);
        }
    }
    g.store();
}

function setupPageLeaderArmy() {
    initPercents();
    initPasteArea();
    initLeaderArmyBookmarks();
    initGlobal();
}

(function main() {
    'use strict';
    let p = location.pathname;
    if (/lg_daily/.test(p))
    {
        setupPageDailyTable();
    }
    else if (/leader_guild/.test(p)) {
        setupPageLeaderGuild();
    }
    else if (/leader_army/.test(p)) {
        setupPageLeaderArmy();
    }
    else {
        console.log('Unexpected location: %o', location);
    }
})();