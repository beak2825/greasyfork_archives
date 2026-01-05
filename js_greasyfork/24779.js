// ==UserScript==
// @name         GPlay虚拟农场助手
// @encoding     utf-8
// @date         2016.11.12
// @namespace    https://greasyfork.org/users/79532
// @version      V0.6
// @description  一键种植（需选中种子）、一键收菜、一键偷菜。PS：收菜时可跳过成长周期，直接成熟。
// @author       hain1orz
// @match        */gfarm-front.html
// @match        */plugin.php?id=gfarm:front
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/24779/GPlay%E8%99%9A%E6%8B%9F%E5%86%9C%E5%9C%BA%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/24779/GPlay%E8%99%9A%E6%8B%9F%E5%86%9C%E5%9C%BA%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';
// 信息
var Info = {},
    UserInput = null,
    DataInput = null,
    Lands = null,
    _planting = 0,
    _harvesting = 0,
    _stealing = 0,
    _rushing = 0;
// 刷新信息
var _flushInfo = function() {
    Info.formhash = document.getElementById('formhash').value; // 农场Hash
    Info.userid = UserInput.value; // 用户ID
    Info.dataid = DataInput.value; // 种子ID
    Lands = document.querySelectorAll('div.makeland+span'); // 耕地缓存
};
// 一键种植
var _plantAll = function() {
    if (_planting > 0) { // 种植中
        GM_log('种植中，请稍后...', _planting);
        return;
    }
    if (Info.userid != UserInput.value) {
        _flushInfo();
    }
    if (Info.userid != discuz_uid) { // 不是自己的耕地不能种植
        return;
    }
    if (!DataInput.value) { // 未选中种子
        return;
    }
    Info.dataid = DataInput.value; // 刷新种子ID
    let ids = []; // 耕地ID队列
    for (let sp of Lands) {
        if (sp.childElementCount == 1 && sp.nextElementSibling.childElementCount == 0) {
            ids.push(sp.id);
        }
    }
    let l = ids.length;
    if (l > 0) {
        _planting = l;
    } else {
        return;
    }
    GM_log('种植开始，队列信息：', ids.join(','));
    for (let i = 0; i < l; i++) {
        ajaxget('plugin.php?id=gfarm:front&mod=gfarm_ajax&depotid=' + Info.dataid + '&formhash=' + Info.formhash + '&act=germajax&landid=' + ids[i],
            '', '', '', '',
            function() {
                _planting--;
                if (_planting == 0) {
                    GM_log('种植结束！');
                }
            });
    }
};
// 一键收菜
var _harvestAll = function() {
    if (_harvesting > 0) { // 收菜中
        GM_log('收菜中，请稍后...', _harvesting);
        return;
    }
    if (Info.userid != UserInput.value) {
        _flushInfo();
    }
    if (Info.userid != discuz_uid) { // 不是自己的耕地不能收菜
        return;
    }
    let ids = []; // 耕地ID队列
    for (let sp of Lands) {
        if (sp.childElementCount == 1 && sp.nextElementSibling.childElementCount == 1) {
            ids.push(sp.id);
        }
    }
    let l = ids.length;
    if (l > 0) {
        _harvesting = l;
    } else {
        return;
    }
    GM_log('收菜开始，队列信息：', ids.join(','));
    for (let i = 0; i < l; i++) {
        ajaxget('plugin.php?id=gfarm:front&mod=gfarm_ajax&formhash=' + Info.formhash + '&uid=' + Info.userid + '&act=getcrop&landid=' + ids[i],
            '', '', '', '',
            function() {
                _harvesting--;
                if (_harvesting == 0) {
                    GM_log('收菜结束！');
                }
            });
    }
};
// 一键偷菜
var _stealAll = function() {
    if (_stealing > 0) { // 偷菜中
        GM_log('偷菜中，请稍后...', _stealing);
        return;
    }
    if (Info.userid != UserInput.value) {
        _flushInfo();
    }
    if (Info.userid == discuz_uid) { // 自己的耕地不能偷菜
        return;
    }
    let [ids, reg] = [
        [], new RegExp(/[^\d]/g)
    ]; // 耕地ID队列
    for (let sp of Lands) {
        if (sp.childElementCount == 1 && sp.nextElementSibling.childElementCount == 1) { // 判断是否有种子
            if (sp.nextElementSibling.children[0].id != 'cropimg') { // 是否成熟
                continue;
            }
            if (parseInt(sp.nextElementSibling.nextElementSibling.nextElementSibling.innerText.replace(reg, ''), 10) > 11) { // 判断数量大于11的作物加入队列，提高偷菜效率
                ids.push(sp.id);
            }
        }
    }
    let l = ids.length;
    if (l > 0) {
        _stealing = l;
    } else {
        return;
    }
    GM_log('偷菜开始，队列信息：', ids.join(','));
    for (let i = 0; i < l; i++) {
        ajaxget('plugin.php?id=gfarm:front&mod=gfarm_ajax&formhash=' + Info.formhash + '&uid=' + Info.userid + '&act=stealcrop&landid=' + ids[i],
            '', '', '', '',
            function() {
                _stealing--;
                if (_stealing == 0) {
                    GM_log('偷菜结束！');
                }
            });
    }
};

(function() {
    // 刪除返回页首，遮挡视线
    document.getElementById('backTop').remove();

    UserInput = document.getElementById('userid');
    DataInput = document.getElementById('dataid');
    _flushInfo(); // 初始化信息

    let [backland, toolbar, plantBtn, harvestBtn, stealBtn] = [document.getElementById('backland'), document.createElement('div'), document.createElement('button'), document.createElement('button'), document.createElement('button')];
    let tbs = [
        'position:absolute',
        'top:4px',
        'right:400px',
        'z-index:1'
    ];
    toolbar.setAttribute('style', tbs.join(';'));
    let bs = [
        'font:12px/1.4 Microsoft Yahei Light',
        'color:#fff',
        'background-color:#5cc15f',
        'border:2px solid #fff',
        'border-radius:6px',
        'margin:0 4px',
        'cursor:pointer'
    ];
    plantBtn.innerText = '一键种植';
    harvestBtn.innerText = '一键收菜';
    stealBtn.innerText = '一键偷菜';
    plantBtn.setAttribute('style', bs.join(';'));
    harvestBtn.setAttribute('style', bs.join(';').replace('#5cc15f', '#1081d2'));
    stealBtn.setAttribute('style', bs.join(';').replace('#5cc15f', '#c61a09'));
    plantBtn.onclick = function() { _plantAll(); };
    harvestBtn.onclick = function() { _harvestAll(); };
    stealBtn.onclick = function() { _stealAll(); };
    toolbar.appendChild(plantBtn);
    toolbar.appendChild(harvestBtn);
    toolbar.appendChild(stealBtn);
    backland.insertBefore(toolbar, backland.firstElementChild);
    GM_log('GPlay虚拟农场助手 Ready for work.');
    GM_addStyle(`
        body,
        select,
        input,
        textarea,
        button {
            font-family: 'Helvetica Neue', Helvetica, Tahoma, Arial, 'PingFang SC', 'Source Han Sans CN', 'Noto Sans SC', 'Hiragino Sans GB', -apple-system, 'Microsoft Yahei Light', 'Microsoft Yahei', Simhei, sans-serif1!important;
        }
        body {
            background-image: none; // 隐藏背景，图片太暴露
        }
        #userinfo {
            font-style: normal!important;
        }
        .head_yn {
            box-shadow:none;height:0; // 隐藏页头图片，影响效率
        }
    `);
})();
