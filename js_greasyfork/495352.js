// ==UserScript==
// @name         【限定公開】RPGEN - SHA256パスワード生成
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  RPGENのマップのセキュリティガチガチにできる
// @author       You
// @match        https://rpgen.org/dq/?map=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495352/%E3%80%90%E9%99%90%E5%AE%9A%E5%85%AC%E9%96%8B%E3%80%91RPGEN%20-%20SHA256%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/495352/%E3%80%90%E9%99%90%E5%AE%9A%E5%85%AC%E9%96%8B%E3%80%91RPGEN%20-%20SHA256%E3%83%91%E3%82%B9%E3%83%AF%E3%83%BC%E3%83%89%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(async window => {
    const {$} = window;
    const {importAll, getScript} = await import(`https://rpgen3.github.io/mylib/export/import.mjs`);
    await getScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9/crypto-js.min.js');
    const html = $('<div>').appendTo($('body')).css({
        'text-align': 'center',
        padding: '1em',
        'user-select': 'none',
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999
    }).hide();
    const head = $('<div>').appendTo(html),
          body = $('<div>').appendTo(html),
          foot = $('<div>').appendTo(html);
    const rpgen3 = await importAll([
        'input',
        'hankaku'
    ].map(v => `https://rpgen3.github.io/mylib/export/${v}.mjs`));
    const addBtn = (h, ttl, func) => $('<button>').appendTo(h).text(ttl).on('click', func);
    GM.registerMenuCommand('SHA256パスワードUIを表示する', () => {
        html.show();
    });
    $('<span>').appendTo(head).text('RPGEN pass');
    addBtn(head, '×', () => {
        html.hide();
    }).css({
        color: 'white',
        backgroundColor: 'red'
    });
    const inputKey = rpgen3.addInputStr(body,{
        label: 'SHA-256 key',
        save: true
    });
    const inputMap = rpgen3.addInputStr(body,{
        label: 'MAP Number'
    });
    inputMap.elm.prop('placeholder', 'mapNum')
    inputMap.elm.on('change', () => {
        inputMap(rpgen3.toHan(inputMap()).replace(/[^0-9]/g, ''));
    });
    const isUnlock = rpgen3.addInputBool(body,{
        label: 'unlock this map',
        save: true
    });
    addBtn(body, 'output', () => {
        const {mapNum} = window.dq,
              map = inputMap() || String(mapNum),
              password = CryptoJS.HmacSHA256(map, inputKey()).toString().slice(0, 8);
        rpgen3.addInputStr(foot.empty(), {
            label: 'password',
            value: password,
            copy: true
        });
    });
})(window.unsafeWindow || window);