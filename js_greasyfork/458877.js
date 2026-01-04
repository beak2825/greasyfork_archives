// ==UserScript==
// @name         猫国建设者修改器
// @namespace    http://tampermonkey.net/
// @version      1.14514
// @description  猫国建设者资源修改
// @author       rxdey(craftAlex二改）
// @match        https://likexia.gitee.io/cat-zh/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458877/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/458877/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const render = (array) => {
        let li = '';
        Object.keys(array).map(item => array[item]).forEach(item => {
            li += `<li class="ca-material ${item.name}" data-type="${item.name}" style="display: flex; flex-flow: row nowrap;align-items: center;font-size: 12px;"><div style="flex: 1;padding: 5px 10px;">${item.title}</div><div syyle="padding: 5px 10px;flex: 1"><span class="ca-add"" style="cursor: pointer;flex: 1;text-align: right;color: #fa3073;">增加100</span>&nbsp;<span class="ca-full" style="cursor: pointer;flex: 1;text-align: right;color: #fa3073;">加满</span>&nbsp;<span class="ca-custom"" style="cursor: pointer;flex: 1;text-align: right;color: #fa3073;">增加自定义</span>&nbsp;<span class="ca-edit" style="cursor: pointer;flex: 1;text-align: right;color: #fa3073;">修改</span></div></li>`;
        });
        return li;
    };
    const dialog = `<div class="ca-dialog" style="width: 250px; height: 50%; z-index: 9999999; overflow-y: auto; position: fixed; bottom: 60px; right: 0; background: #eee; color: #000; box-sizing: border-box; padding: 10px; display: none;"><ul class="ca-ul" style="margin:0;padding:0"></ul></div>`;
    function handleAdd (target, count) {
        const type = $(target).parent().parent().attr('data-type');
        const maxValue = game.resPool.resourceMap[type].maxValue;
        count = count || maxValue
        const value = game.resPool.resourceMap[type].value;
        game.resPool.resourceMap[type].value = value + (count || 100);
    };
    function handleSet (target, count) {
        const type = $(target).parent().parent().attr('data-type');
        game.resPool.resourceMap[type].value = count;
    };
    var camenu = '<a href="#" id="ca-editor" style="position: fixed; bottom: 0; right: 0; background: #fff; color: #111; width: 50px; height: 50px; border-radius:50px; text-align: center; line-height: 50px; overflow: hidden;font-size:12px">修改器</div>';
    $('body').append(camenu);
    $('#ca-editor').click(function () {
        if (document.querySelector('.ca-dialog')) {
            $('.ca-dialog').toggle();
        } else {
            const liRender = render(game.resPool.resourceMap);
            $('body').append(dialog);
            $('.ca-ul').append(liRender);
            $('.ca-add').click(function() {
                handleAdd(this, 100)
            });
            $('.ca-full').click(function() {
                handleAdd(this, 0)
            });
            $('.ca-custom').click(function() {
                var amt=prompt("请输入数量",100);
                handleAdd(this, Number(amt))
            });
            $('.ca-edit').click(function() {
                var amts=prompt("请输入数量",1000);
                handleSet(this, Number(amts))
            });
            $('.ca-dialog').toggle();
        }
    });
})();