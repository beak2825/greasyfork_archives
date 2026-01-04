// ==UserScript==
// @name         魔怔定型文屏蔽器
// @namespace    https://pbb.akioi.ml/ban-shanoa
// @version      0.8
// @description  屏蔽某魔怔定型文 / sk
// @author       tiger0132
// @match        https://pbb.akioi.ml/
// @match        https://demo.akioi.ml/
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420978/%E9%AD%94%E6%80%94%E5%AE%9A%E5%9E%8B%E6%96%87%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420978/%E9%AD%94%E6%80%94%E5%AE%9A%E5%9E%8B%E6%96%87%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const blockList = ['夏小姐', '夏诺雅', 'シャノア', 'しゃのあ', 'shanoa'];
    const possibleNames = ['しゃのあ', 'tiger\'s rbq', '古守ちゆ', '神虎的小迷妹'];
    var ignShanoa = GM_getValue('ignShanoa', true);
    var ignSK = GM_getValue('ignSK', false);
    var displayMessage = GM_getValue('displayMessage', true);

    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    const escapeHtml = string => string.replace(/[&<>"'`=\/]/g, s => entityMap[s]);

    var oldFmtFeed = fmtFeed;
    fmtFeed = feed => {
        if (!feed) return '';
        const content = feed.content_markdown;
        const node = $(oldFmtFeed(feed));

        if ((ignShanoa && blockList.some(keyword => content.includes(keyword)))) {
            node[0].id = `feed-${feed.id}`;
            node[0].style.opacity = 0.3;
            node.hide();
            return !displayMessage ? '' : `<p style="text-align: center; color: gray; opacity: 0.3; " onclick="$('#feed-${feed.id}').show(); $(this).hide()">隐藏了 ${escapeHtml(feed.user.name)} 的一条犇犇，点击显示</p>` + node[0].outerHTML;
        }
        if (ignSK && (possibleNames.some(name => feed.user.name === name) || feed.user.uid === 68030)) {
            node[0].id = `feed-${feed.id}`;
            node[0].style.opacity = 0.3;
            node.hide();
            return !displayMessage ? '' : `<p style="text-align: center; color: gray; opacity: 0.3; " onclick="$('#feed-${feed.id}').show(); $(this).hide()">隐藏了 serverkiller 发送的一条的犇犇，点击显示</p>` + node[0].outerHTML;
        }
        if (ignSK && possibleNames.some(name => content.includes(name))) {
            node[0].id = `feed-${feed.id}`;
            node[0].style.opacity = 0.3;
            node.hide();
            return !displayMessage ? '' : `<p style="text-align: center; color: gray; opacity: 0.3; " onclick="$('#feed-${feed.id}').show(); $(this).hide()">隐藏了 ${escapeHtml(feed.user.name)} 的一条包含 serverkiller 的犇犇，点击显示</p>` + node[0].outerHTML;
        }

        return node[0].outerHTML;
    };

    const nodeIgnShanoa = $(`<div class="ui toggle checkbox" style="margin-top: 20px; display: block;"><input type="checkbox" tabindex="0" class="hidden"><label>屏蔽夏诺雅</label></div>`);
    const nodeIgnSK = $(`<div class="ui toggle checkbox" style="margin-top: 20px; display: block;"><input type="checkbox" tabindex="0" class="hidden"><label>屏蔽 sk</label></div>`);
    const nodeDisplayMessage = $(`<div class="ui toggle checkbox" style="margin-top: 20px; display: block;"><input type="checkbox" tabindex="0" class="hidden"><label>屏蔽后显示提示</label></div>`);
    nodeIgnShanoa.checkbox({
        onChange: function () {
            const value = $(this).parent().checkbox('is checked');
            console.log(value);
            GM_setValue('ignShanoa', ignShanoa = value);
        }
    });
    nodeIgnSK.checkbox({
        onChange: function () {
            const value = $(this).parent().checkbox('is checked');
            GM_setValue('ignSK', ignSK = value);
        }
    });
    nodeDisplayMessage.checkbox({
        onChange: function () {
            const value = $(this).parent().checkbox('is checked');
            GM_setValue('displayMessage', displayMessage = value);
        }
    });
    if (ignShanoa) nodeIgnShanoa.checkbox('set checked');
    if (ignSK) nodeIgnSK.checkbox('set checked');
    if (displayMessage) nodeDisplayMessage.checkbox('set checked');
    nodeDisplayMessage.insertAfter('#display-pm-toast-after-sub');
    nodeIgnSK.insertAfter('#display-pm-toast-after-sub');
    nodeIgnShanoa.insertAfter('#display-pm-toast-after-sub');
})();