// ==UserScript==
// @name         快捷键粘贴当前时间文本
// @namespace    http://tampermonkey.net/
// @version      2020.10.31.1
// @description  使用键盘快捷键（windows[Ctrl+Alt+T]，其他系统[Ctrl+Shift+T]）快速粘贴当前时间文本到当前输入框当前光标位置
// @author       PY-DNG
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407319/%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%B2%98%E8%B4%B4%E5%BD%93%E5%89%8D%E6%97%B6%E9%97%B4%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/407319/%E5%BF%AB%E6%8D%B7%E9%94%AE%E7%B2%98%E8%B4%B4%E5%BD%93%E5%89%8D%E6%97%B6%E9%97%B4%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    // 基本参数——用户可修改
    // TimeDateFormatText——粘贴到输入框的日期时间文本格式
    // [Year][Month][Day][Hour][Minute][Second]分别代表年月日时分秒（大小写均可）
    let TimeDateFormatText = '[Year]年[Month]月[Day]日 [Hour]:[Minute]:[Second]';

    // 以下的不要随便乱动
    /*
    // 格式化TimeDateFormatText
    let allReplaces = TimeDateFormatText.match(/\[(.*?)\]/g);
    allReplaces.forEach(function(value, index, arr) {
        TimeDateFormatText = TimeDateFormatText.replace(value, value.toUpperCase())
    })*/

    document.addEventListener('keydown',
    function() {
        // 获取按键代码
        let keycode = event.keyCode
        // 检测快捷键（windows[Ctrl+Alt+T]，其他系统[Ctrl+Shift+T]）是否被触发
        let bool = detectOS().indexOf('Win') != -1 ? (keycode === 84 && event.ctrlKey && event.altKey) : (keycode === 84 && event.ctrlKey && event.shiftKey);
        if (bool) {
            // 获取日期时间文本
            let d = new Date();
            let timetext = TimeDateFormatText.replace(/\[YEAR\]/gi, d.getFullYear().toString()).replace(/\[MONTH\]/gi, d.getMonth().toString()).replace(/\[DAY\]/gi, d.getDate().toString()).replace(/\[HOUR\]/gi, d.getHours().toString()).replace(/\[MINUTE\]/gi, d.getMinutes().toString()).replace(/\[SECOND\]/gi, d.getSeconds().toString());
            //let timetext = d.getFullYear().toString() + "年" + d.getMonth().toString() + "月" + d.getDate().toString() + "日 " + d.getHours().toString() + ":" + d.getMinutes().toString() + ":" + d.getSeconds().toString();
            let CT = document.activeElement;
            let CPS = getTextselection(false);
            let CPE = getTextselection(true);
            CT.value = CT.value.substring(0, CPS) + timetext + CT.value.substring(CPE, CT.value.length);
            CPE = CPS + timetext.length;
            CT.setSelectionRange(CPE, CPE);
            CT.focus();
        }
    })

    function getTextselection(End) {
        var oText = document.activeElement;
        var cursurPosition = -1;
        if (End) { // 获取选定区域结尾位置
            cursurPosition = oText.selectionEnd;
        } else { // 获取选定区域起始位置
            if (oText.selectionStart) { //正常
                cursurPosition = oText.selectionStart;
            } else { //在最左边
                cursurPosition = 0;
            }
        }
        if (cursurPosition == undefined) {
            cursurPosition = 0
        };
        return cursurPosition;
    }

    function detectOS() {
        var userAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = userAgent.indexOf("Windows NT 5.0") > -1 || userAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = userAgent.indexOf("Windows NT 5.1") > -1 || userAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = userAgent.indexOf("Windows NT 5.2") > -1 || userAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista = userAgent.indexOf("Windows NT 6.0") > -1 || userAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
        }
        return "other";
    }
})()