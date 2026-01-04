// ==UserScript==
// @name         NCTU Course Selection Timecode Translator
// @namespace    https://github.com/FractaIism/TamperMonkey-UserScripts
// @version      1.1
// @description  Change course timecodes back to old format
// @author       Fractalism
// @match        http*://course.nctu.edu.tw/adList.asp
// @match        http*://course.nctu.edu.tw/adDo.asp
// @match        http*://course.nctu.edu.tw/adNow.asp
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419022/NCTU%20Course%20Selection%20Timecode%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/419022/NCTU%20Course%20Selection%20Timecode%20Translator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var show_diff = true; // true: show both old and new timecodes, false: show old timecode only

    // {key: value} = {new: old}
    const codemap = Object.freeze({
        'M': '1', // Monday
        'T': '2', // Tuesday
        'W': '3', // Wednesday
        'R': '4', // Thursday
        'F': '5', // Friday
        'S': '6', // Saturday
        'U': '7', // Sunday
        'y': 'M', // 06:00 ~ 06:50
        'z': 'N', // 07:00 ~ 07:50
        '1': 'A', // 08:00 ~ 08:50
        '2': 'B', // 09:00 ~ 09:50
        '3': 'C', // 10:10 ~ 11:00
        '4': 'D', // 11:10 ~ 12:00
        'n': 'X', // 12:20 ~ 13:10
        '5': 'E', // 13:20 ~ 14:10
        '6': 'F', // 14:20 ~ 15:10
        '7': 'G', // 15:30 ~ 16:20
        '8': 'H', // 16:30 ~ 17:20
        '9': 'Y', // 17:30 ~ 18:20
        'a': 'I', // 18:30 ~ 19:20
        'b': 'J', // 19:30 ~ 20:20
        'c': 'K', // 20:30 ~ 21:20
        'd': 'L', // 21:30 ~ 22:20
    });

    var page;
    if (window.location.href.match(/https?:\/\/course\.nctu\.edu\.tw\/adList\.asp/)) {
        page = 0; // 課程加選
    } else if (window.location.href.match(/https?:\/\/course\.nctu\.edu\.tw\/adDo\.asp/)) {
        page = 1; // 課程加選後der查詢選課
    } else if (window.location.href.match(/https?:\/\/course\.nctu\.edu\.tw\/adNow\.asp/)) {
        page = 1; // 查詢選課狀況(網頁編排同上)
    }
    var tables = document.querySelectorAll('table');
    var table = tables[(page == 0) ? tables.length - 1 : 1];
    for (const [idx, tr] of Array.from(table.firstElementChild.children).entries()) {
        if (idx >= 2 && tr.childElementCount > 10) { // rough way to guess which rows contain timecode
            var tdElmt = tr.children[(page == 0) ? 12 : 7];
            var fontElmt = tdElmt.firstChild;
            var new_timecode = fontElmt.firstChild.data;
            var location = fontElmt.firstElementChild.textContent.substr(1); // unchanged, unused
            var old_timecode = translate(new_timecode);
            //console.log(new_timecode, "=>", old_timecode);
            if (show_diff) {
                fontElmt.firstChild.textContent = old_timecode;
                var grayFont = document.createElement('font');
                grayFont.color = 'gray';
                grayFont.textContent = '(' + new_timecode + ')';
                fontElmt.insertBefore(grayFont, fontElmt.firstChild);
            } else {
                fontElmt.firstChild.data = old_timecode;
            }
        }
    }

    // translate new timecode (string) to old timecode (string)
    function translate(new_tc) { // new timecode
        var old_tc = ""; // old timecode
        for (let i = 0; i < new_tc.length; ++i) {
            if (codemap.hasOwnProperty(new_tc[i])) {
                old_tc += codemap[new_tc[i]]
            } else {
                old_tc += new_tc[i];
            }
        }
        return old_tc;
    }
})();
