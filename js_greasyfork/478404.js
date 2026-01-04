// ==UserScript==
// @name         LNK_warlogCopy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  HWM ГВД копировать бои со страницы протокола боев в буфер обмена
// @author       LNK
// @include        *heroeswm.ru/pl_warlog.php*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/478404/LNK_warlogCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/478404/LNK_warlogCopy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkClick() {
        //alert(this.id);
    }

    function checkAllClick() {
        var ch = '';
        if (document.querySelector('#checkAll').checked) { ch = 'checked'; }
        var checks = document.querySelectorAll('.checkClass[type="checkbox"]');
        checks.forEach(function(item, i, arr) {
            item.checked = ch;
        });
    }

    function copyClick() {
        var log = '';
        var checks = document.querySelectorAll('.checkClass[type="checkbox"]:checked');
        if (checks.length < 1) { alert('Не выбран ни один бой - нечего копировать'); return 0; }
        checks.forEach(function(item, i, arr) {
            log = log + item.nextSibling.href + '\n';
        });
        GM_setClipboard(log, "text");
        alert(checks.length + ' боев - скопировано в буфер обмена');
        return 1;
    }

    var checkB;
    var warlog = document.querySelectorAll('a[href^="warlog.php?"]');
    var paramDiv = document.createElement('div');
    paramDiv.id = 'pDiv';
    paramDiv.innerHTML = '<input type="checkbox" id="checkAll"/>Выделить все'+
        '<input type="button" id="copyBtn" style = "margin-left: 55px;" value="Скопировать выбранные бои в буфер обмена" />';
    //paramDiv.style = 'border: solid; text-align: center; width: 200px; height:30px; margin-bottom: 5px; margin-left: 15px;';
    paramDiv.style = 'text-align: left; margin-bottom: 5px; margin-left: 8px;';
    var pagesDiv = document.querySelector('.global_inside_shadow');
    pagesDiv.after(paramDiv);
    warlog.forEach(function(item, i, arr) {
        checkB = document.createElement('input');
        checkB.id = 'check'+i;
        checkB.type = 'checkbox';
        checkB.className = 'checkClass';
        item.before(checkB);
    });
    var checks = document.querySelectorAll('.checkClass'); //alert(checks.length);
    checks.forEach(function(item, i, arr) {
        item.onclick = checkClick;
    });
    document.querySelector('#copyBtn').onclick = copyClick;
    document.querySelector('#checkAll').onclick = checkAllClick;

    return 1;
})();