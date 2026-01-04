// ==UserScript==
// @name           punctuation_convert
// @name:zh-CN        中英标点转换
// @name:zh-TW        中英標點轉換
// @namespace      punctuation_convert
// @description    Punctuation: English<->Chinese
// @description:zh-CN Punctuation: English<->Chinese
// @description:zh-TW Punctuation: English<->Chinese
// @include        http://*
// @include        https://*
// @run-at      document-end
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @author      zhuzemin
// @version     1.01
// @downloadURL https://update.greasyfork.org/scripts/420231/punctuation_convert.user.js
// @updateURL https://update.greasyfork.org/scripts/420231/punctuation_convert.meta.js
// ==/UserScript==
//config
let config = {
        'debug': false,
        'mode': GM_getValue('mode') || 1
}
let debug = config.debug ? console.log.bind(console) : function () {
};
// prepare UserPrefs
setUserPref(
        'mode',
        config.mode,
        'Punctuation: English<->Chinese',
        `English->Chinese: "1"; Chinese->English: "0"`,
);

let init = function () {
        try {
                document.title = convert(document.title);
                findTextNode(document.documentElement);
                debug(document.title);
        } catch (e) {
                debug(e);
        }
}
window.addEventListener('load', init);

function findTextNode(o) {
        let obj = o.childNodes;
        let olen = obj.length;
        for (let i = 0; i < olen; i++) {
                if (obj[i].splitText)
                        obj[i].data = convert(obj[i].data);
                else if (obj[i].childNodes)
                        findTextNode(obj[i]);
        }
}
function convert(cc) {
        let E_pun = ',.!?[]()<>"\'';
        let C_pun = '，。！？【】（）《》“‘';
        let str = "";
        let find;
        let clen = cc.length;
        let src = null;
        let dest = null;
        let pattern = null;
        if (config.mode == 1) {
                src = E_pun;
                dest = C_pun;
                pattern = '[/x00-xff]';
        }
        else if (config.mode == 0) {
                src = C_pun;
                dest = E_pun;
                pattern = "[^\x00-\xff]";
        }
        for (let i = 0; i < clen; i++) {
                let ch = cc.charAt(i);
                let rerr = new RegExp(pattern);
                if (ch.search(rerr) == -1)
                        find = -1;
                else
                        find = src.indexOf(ch);
                if (find != -1)
                        str += dest.charAt(find);
                else
                        str += ch;
        }
        return str
}
/**
 * Create a user setting prompt
 * @param {string} varName
 * @param {any} defaultVal
 * @param {string} menuText
 * @param {string} promtText
 * @param {function} func
 */
function setUserPref(varName, defaultVal, menuText, promtText, func = null) {
        GM_registerMenuCommand(menuText, function () {
                let val = prompt(promtText, GM_getValue(varName, defaultVal));
                if (val === null) { return; }  // end execution if clicked CANCEL
                GM_setValue(varName, val);
                if (func != null) {
                        func(val);
                }
        });
}
