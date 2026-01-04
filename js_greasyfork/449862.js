// ==UserScript==
// @name         U2种子列表高亮
// @namespace    https://u2.dmhy.org/
// @version      0.0.2
// @description  种子列表鼠标悬停高亮
// @author       kysdm
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @match        *://u2.dmhy.org/*
// @exclude      *://u2.dmhy.org/shoutbox.php*
// @icon         https://u2.dmhy.org/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449862/U2%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/449862/U2%E7%A7%8D%E5%AD%90%E5%88%97%E8%A1%A8%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

'use strict';

const setColor = () => {
    let _prompt = prompt('设置背景色\n十六进制格式 <#E6E6FA> 或 RGB格式 <135,206,235>');
    _prompt = _prompt.replace(/\s/g, '');

    if (/^#([a-fA-F\d]{6}|[a-fA-F\d]{3})$/.test(_prompt)) {
        // console.log('输入的是十六进制格式');
        GM_setValue('background-color', _prompt);
        return;
    };

    let _r = /^(?<R>\d{1,3}),(?<G>\d{1,3}),(?<B>\d{1,3})$/i.exec(_prompt);

    if (_r) {
        let R = _r.groups.R;
        let G = _r.groups.G;
        let B = _r.groups.B;
        if (R >= 0 && R < 256 && G >= 0 && G < 256 && B >= 0 && B < 256) {
            GM_setValue('background-color', `rgb(${_prompt})`);
            return;
        };
    };

    window.alert('输入的值无效!');

};

const getColor = () => {
    return GM_getValue('background-color') || '#E6E6FA';
};

GM_registerMenuCommand(`设置背景色`, function () { setColor() });

$('.torrents').children().children('tr').hover(function () {
    $(this).css('background-color', getColor());
    $(this).find('.torrentname').css('background-color', getColor());
}, function () {
    $(this).css('background-color', '');
    $(this).find('.torrentname').css('background-color', '');
});
