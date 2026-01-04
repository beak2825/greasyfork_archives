// ==UserScript==
// @name         Автообновление охоты
// @namespace    http://tampermonkey.net/
// @version      1.0.0.1
// @description  Охотимся удобнее
// @author       Pid0r
// @license      MIT
// @match        https://catwar.su/cw3/jagd
// @downloadURL https://update.greasyfork.org/scripts/495977/%D0%90%D0%B2%D1%82%D0%BE%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%85%D0%BE%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/495977/%D0%90%D0%B2%D1%82%D0%BE%D0%BE%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%BE%D1%85%D0%BE%D1%82%D1%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keypress', function(evt) {
        if (evt.key === 'c' || evt.key === 'с') {
            location.reload();
        }
    });

    function rndDelay() {
        return Math.floor(Math.random() * 100) + 300;
    }

    var wrap = document.createElement('div');
    wrap.style.position = 'fixed';
    wrap.style.top = '10px';
    wrap.style.right = '10px';
    wrap.style.padding = '12px';
    wrap.style.backgroundColor = 'rgb(34, 34, 34)';
    wrap.style.color = 'rgb(131, 131, 131)';
    wrap.style.border = 'none';
    wrap.style.borderRadius = '10px';
    wrap.style.zIndex = '1000';
    wrap.style.fontSize = '100%';

    var lbl = document.createElement('label');
    lbl.textContent = 'Дичь: ';
    wrap.appendChild(lbl);

    var sel = document.createElement('select');
    sel.id = 'bSel';
    sel.style.backgroundColor = 'rgb(34, 34, 34)';
    sel.style.color = 'rgb(131, 131, 131)';
    sel.style.border = '1px solid rgb(131, 131, 131)';
    sel.style.fontSize = '100%';

    var no = document.createElement('option');
    no.value = 'none';
    no.textContent = 'Не выбрано';
    sel.appendChild(no);

    var weak = document.createElement('option');
    weak.value = 'b1';
    weak.textContent = 'Хилая';
    sel.appendChild(weak);

    var normal = document.createElement('option');
    normal.value = 'b2';
    normal.textContent = 'Обычная';
    sel.appendChild(normal);

    var strong = document.createElement('option');
    strong.value = 'b3';
    strong.textContent = 'Упитанная';
    sel.appendChild(strong);

    wrap.appendChild(sel);
    document.body.appendChild(wrap);

    var savedBtn = localStorage.getItem('selBtn');
    if (savedBtn) {
        sel.value = savedBtn;
    }

    sel.addEventListener('change', function() {
        localStorage.setItem('selBtn', this.value);
    });

    var btnId = sel.value;
    if (btnId !== 'none') {
        setTimeout(function() {
            var btn = document.getElementById(btnId);
            if (btn) {
                btn.click();
            }
        }, rndDelay());
    }
})();