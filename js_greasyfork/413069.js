// ==UserScript==
// @name         猫国建设者修改器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  猫国建设者资源修改,随便用用,都能改,缺啥又着急不想等的时候可以。。。毕竟是个挂机游戏，注意游戏体验
// @author       rxdey
// @match        https://likexia.gitee.io/cat-zh/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413069/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/413069/%E7%8C%AB%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const render = (array) => {
        let li = '';
        Object.keys(array).map(item => array[item]).forEach(item => {
            li += `<li class="rx-material ${item.name}" data-type="${item.name}" style="display: flex; flex-flow: row nowrap;align-items: center;font-size: 12px;"><div style="flex: 1;padding: 5px 10px;">${item.title}</div><div syyle="padding: 5px 10px;flex: 1"><span class="rx-add-button"" style="cursor: pointer;flex: 1;text-align: right;color: #fa3073;">增加100</span>&nbsp;<span class="rx-add-1000" style="cursor: pointer;flex: 1;text-align: right;color: #fa3073;">加满</span></div></li>`;
        });
        return li;
    };
    const dialog = `<div class="rx-dialog" style="width: 250px; height: 50%; z-index: 9999999; overflow-y: auto; position: fixed; bottom: 60px; right: 0; background: #333; color: #fff; box-sizing: border-box; padding: 10px; display: none;"><ul class="rx-ul" style="margin:0;padding:0"></ul></div>`;
    function handleAdd (target, count) {
        const type = $(target).parent().parent().attr('data-type');
        const maxValue = game.resPool.resourceMap[type].maxValue;
        count = count || maxValue
        const value = game.resPool.resourceMap[type].value;
        if (maxValue) {
            if ((value + count) < maxValue) {
                game.resPool.resourceMap[type].value = value + count;
            } else {
                game.resPool.resourceMap[type].value = maxValue;
            }
            return;
        }
        game.resPool.resourceMap[type].value = value + (count || 1000);
    };
    var rxmenu = '<a href="#" id="rx-editor" style="position: fixed; bottom: 0; right: 0; background: #000; color: #fff; width: 50px; height: 50px; border-radius:50px; text-align: center; line-height: 50px; overflow: hidden;font-size:12px">修改器</div>';
    $('body').append(rxmenu);
    $('#rx-editor').click(function () {
        if (document.querySelector('.rx-dialog')) {
            $('.rx-dialog').toggle();
        } else {
            const liRender = render(game.resPool.resourceMap);
            $('body').append(dialog);
            $('.rx-ul').append(liRender);
            $('.rx-add-button').click(function() {
                handleAdd(this, 100)
            });
            $('.rx-add-1000').click(function() {
                handleAdd(this, 0)
            });
            $('.rx-dialog').toggle();
        }
    });
})();