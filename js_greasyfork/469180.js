// ==UserScript==
// @name         自动抽卡
// @description  自动抽卡~
// @namespace    https://screeps.com/
// @version      0.0.3
// @author       Jason_2070
// @match        https://screeps.com/a*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469180/%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/469180/%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%8D%A1.meta.js
// ==/UserScript==

$(function () {
    setInterval(() => {
        if (!window.location.hash.startsWith('#!/inventory')) return;
        let smallPanel = $('.__top-panel.ng-star-inserted .__tiles--small').hasClass('--active');
        if (!smallPanel) {
            $('.__top-panel.ng-star-inserted .__tiles--small').click();
            return;
        }
        getCount(count => {
            count > 500 * 20 && pixelize(20);
        })

    }, 1000);

    setInterval(() => {
        getInventory(ids => {
          ids.length && convert(ids);
        });
    }, 3000);
});
// 获取数量
function getCount(callback) {
    let url = `https://screeps.com/api/auth/me`;
    let token = (localStorage.getItem('auth') || '').replaceAll('"', '');
    $.ajax({
        url: url,
        headers: {
            'x-token': token,
            'x-username': token
        },
        success: data => {
            if (data.ok === 1) {
                callback && callback(data.resources.pixel);
            }
        }
    });
}
// 抽卡
function pixelize(count) {
    let url = `https://screeps.com/api/user/decorations/pixelize`;
    let token = (localStorage.getItem('auth') || '').replaceAll('"', '');
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({"count":count,"theme":""}),
        headers: {
            'x-token': token,
            'x-username': token
        },
        success: data => {
            if (data.ok === 1) {
                data.decorations.filter(e => e.decoration.rarity == 5).length > 0 && alert('金色传说!!!')
            }
        }
    });
}
// 获取列表
function getInventory(callback) {
    let url = `https://screeps.com/api/user/decorations/inventory`;
    let token = (localStorage.getItem('auth') || '').replaceAll('"', '');
    $.ajax({
        url: url,
        headers: {
            'x-token': token,
            'x-username': token
        },
        success: data => {
            if (data.ok === 1) {
                callback && callback(data.list.filter(e => !e.active && e.decoration.rarity < 4 && e.type != 'creep' && e.type != 'badge').map(e => e._id));
            }
        }
    });
}
// 分解
function convert(ids) {
    let url = `https://screeps.com/api/user/decorations/convert`;
    let token = (localStorage.getItem('auth') || '').replaceAll('"', '');
    $.ajax({
        url: url,
        type: 'POST',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({"decorations":ids}),
        headers: {
            'x-token': token,
            'x-username': token
        },
        success: data => {
            if (data.ok === 1) {
            }
        }
    });
}

