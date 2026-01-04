// ==UserScript==
// @name         SOCPUBLIC Скрыть все задания в 1 клик
// @namespace    https://greasyfork.org/ru/scripts/369209-socpublic-%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C-%D0%B2%D1%81%D0%B5-%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B2-1-%D0%BA%D0%BB%D0%B8%D0%BA
// @version      1.0
// @description  Скрывает все задания на странице в 1 клик на SOCPUBLIC
// @author       Anonym
// @match        http://socpublic.com/account/task.ht*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369209/SOCPUBLIC%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/369209/SOCPUBLIC%20%D0%A1%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20%D0%B2%D1%81%D0%B5%20%D0%B7%D0%B0%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F%20%D0%B2%201%20%D0%BA%D0%BB%D0%B8%D0%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function socpublichidescript() {
        var a = document.getElementsByTagName('tr');
        var i = 0;
        var b = [];
        while (i < a.length) {
            if (a[i].id.split('_')[0] == 'task') {
                b[b.length] = parseInt(a[i].id.split('_')[1]);
            }
            i = i + 1;
        }
        var k = 0;
        while (k < b.length) {
            task_hide(b[k],true);
            k = k + 1;
        }
    }

    function socpublichidescriptaddlink() {
        var a = document.getElementsByClassName('form-inline')[0];
        var b = document.createElement('a');
        b.href = 'javascript:';
        b.onclick = function() {
            socpublichidescript();
        }
        b.appendChild(document.createTextNode('Скрыть все задания'));
        a.append(' ');
        a.appendChild(b);
    }

    socpublichidescriptaddlink();
})();