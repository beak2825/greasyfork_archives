// ==UserScript==
// @name         Firefox Project1论坛代码框复制修正
// @namespace    rpg.blue
// @license      MIT
// @version      0.3
// @description  修正Firefox浏览器在使用Project1论坛中代码框的复制功能时，代码每行头部会多出四个空格和把某些空格错误转义为不间断空格（U+00A0）的问题（附带修正链接带[url]字样的问题）
// @author       岚风 雷
// @match        *://rpg.blue/thread-*
// @match        *://rpg.blue/forum.php*tid=*
// @icon         https://rpg.blue/favicon.ico
// @grant        unsafeWindow
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/456350/Firefox%20Project1%E8%AE%BA%E5%9D%9B%E4%BB%A3%E7%A0%81%E6%A1%86%E5%A4%8D%E5%88%B6%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/456350/Firefox%20Project1%E8%AE%BA%E5%9D%9B%E4%BB%A3%E7%A0%81%E6%A1%86%E5%A4%8D%E5%88%B6%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

var _copycodeEx_firefoxfix;
var _copycode_firefoxfix;
var _showDialog_firefoxfix;
var last_obj;
// var is_copied = false;
var s_reg = [/\u00A0/gm, '\u0020'];
var url_reg = [/\[url(?:=\S+?)?\](\S+?)\[\/url\]/gm, '$1'];
var dialog_info = ['代码已复制到剪贴板', 'notice', '【已修正】'];

(function() {
    if ((typeof(copycode) != 'function') && (typeof(copycodeEx) != 'function')) { return }
    if ((typeof(_copycode_firefoxfix) != 'undefined') || (typeof(_copycodeEx_firefoxfix) != 'undefined')) { return }

    // 参考自：https://juejin.cn/post/6924934285992394760（作者：Tyric）
    function copycode_copyevent(e) {
        // if (is_copied) { if (last_obj) { last_obj.removeEventListener('copy', copycode_copyevent); }; return }
        let selectText = document.getSelection().toString();
        // console.log(selectText);
        let retText = selectText.replace(s_reg[0], s_reg[1]); // 不间断空格转换
        retText = retText.replace(url_reg[0], url_reg[1]); // url解析清除
        e.clipboardData.setData('text/plain', retText);
        e.preventDefault();
        // is_copied = true;
        if (last_obj) { last_obj.removeEventListener('copy', copycode_copyevent) };
    }

    // copycodeEx
    if (typeof(copycodeEx) == 'function') {
        _copycodeEx_firefoxfix = copycodeEx;

        unsafeWindow.copycodeEx = function(obj) {
            // console.log('已注入');
            if (last_obj) { last_obj.removeEventListener('copy', copycode_copyevent); }
            last_obj = obj;
            // is_copied = false;
            obj.addEventListener('copy', copycode_copyevent, false);
            let ret = _copycodeEx_firefoxfix(obj);
            // obj.removeEventListener('copy', copycode_copyevent);
            return ret;
        }
    }

    // copycode
    if (typeof(copycode) == 'function') {
        _copycode_firefoxfix = copycode;

        unsafeWindow.copycode = function(obj) {
            if (last_obj) { last_obj.removeEventListener('copy', copycode_copyevent); }
            last_obj = obj;
            obj.addEventListener('copy', copycode_copyevent, false);
            let ret = _copycode_firefoxfix(obj);
            // obj.removeEventListener('copy', copycode_copyevent);
            return ret;
        }
    }

    // showDialog
    if (typeof(showDialog) == 'function') {
        _showDialog_firefoxfix = showDialog;

        unsafeWindow.showDialog = function(...args) {
            if (last_obj && (args[0] == dialog_info[0]) && (args[1] == dialog_info[1])) {
                args[0] += dialog_info[2];
                last_obj = undefined;
            }
            return _showDialog_firefoxfix(...args);
        }
    }

})();