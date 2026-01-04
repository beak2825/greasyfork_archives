// ==UserScript==
// @name         赞赏查询
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于查询国服守望先锋赞赏。萌新自用。
// @author       Tsoul19
// @match        https://ow.blizzard.cn/career/
// @icon         https://www.google.com/s2/favicons?domain=blizzard.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434535/%E8%B5%9E%E8%B5%8F%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/434535/%E8%B5%9E%E8%B5%8F%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zsarr = Array.from(document.querySelectorAll('.masthead-player-progression.show-for-lg [data-value]')).map((e) => (`${{
        'shotcaller': '出色指挥',
        'teammate': '团队精神',
        'sportsmanship': '竞技风范'
    }[e.getAttribute('class').replace('EndorsementIcon-border EndorsementIcon-border--' ,'')]}: ${e.getAttribute('data-value')}`));
    var element = document.querySelector("#overview-section > div > div.max-width-container.row.content-box.gutter-18 > div > div > div.masthead-player > div > div.EndorsementIcon-tooltip.endorsement-level > span");
    element.innerText = zsarr[2] + "\n" + zsarr[1] + "\n" + zsarr[0];
})();