// ==UserScript==
// @name         Project Endor (Zoltar)
// @namespace    https://greasyfork.org/en/users/12709
// @version      1.1.2
// @description  easy clicks for zoltars
// @author       feihtality
// @match        https://www.google.com/evaluation/endor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14986/Project%20Endor%20%28Zoltar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/14986/Project%20Endor%20%28Zoltar%29.meta.js
// ==/UserScript==
/*jshint esnext:true*/

(function() {
    'use strict';

    var
        make   = (tag) =>  document.createElement(tag),
        get    = (...args) => (args.length > 1 ? args[0] : document).querySelector(args[1] || args[0]),
        getAll = (...args) => (args.length > 1 ? args[0] : document).querySelectorAll(args[1] || args[0]),
        zoltar = {}, submit,
        sel    = function(obj) {
            obj.btn.onclick = function() {
                var prev = get(obj.p, '[style]');
                if (prev && !obj.isCheckbox) prev.style.background = '';
                if (obj.isCheckbox) this.style.background = this.style.background === 'lightgreen' ? '' : 'lightgreen';
                else this.style.background = 'lightgreen';
                obj.target.click();
                scroller(obj.target);
            };
        },
        scroller = function(loc, dt) {
            var getPos = function(el) { var offset = 0; while(el) { offset += el.offsetTop; el = el.offsetParent; } return offset; },
                target = getPos(loc)-window.innerHeight/4,
                pos = window.scrollY,
                dpos = Math.ceil((target-pos)/3);
            dt = dt ? dt-1 : 25;
            if (target === pos || dpos === 0 || dt === 0) return;
            window.scrollBy(0,dpos);
            setTimeout( () => scroller(loc, dt), dt);
        };

    if (!/previewand/.test(document.referrer) && get('p') && /An error occurred/.test(get('p').textContent)) document.location.reload(); // autorefresh loading error
    if (!get('h3').textContent.includes('website is NOT available')) return; // not a zoltar

    document.head.appendChild(make('STYLE')).innerHTML =
        '.zoltarpanel p {margin:5px; background:lightblue; padding:2px 5px;}' +
        '.zoltarpanel {z-index:10; position:fixed; top:10%;right:50%; background:aliceblue; opacity:0.9; transform:translateX(50%);}' +
        '.zoltarpanel p button {font-size: 12px; margin-right:2px; padding:1px;}';

    zoltar.sections = getSections();
    if (!zoltar.sections.length) return null;
    zoltar.panel = document.body.appendChild(make('DIV'));
    zoltar.panel.className = 'zoltarpanel';

    for (var section of zoltar.sections) {
        var options = Array.from(getAll(section, '[aria-label]')),
            isCheckbox = options[0].tagName.toLowerCase().includes('checkbox'),
            p = zoltar.panel.appendChild(make('P'));

        for (var option of options) {
            var btn = p.appendChild(make('BUTTON'));
            btn.textContent = option.getAttribute('aria-label');
            sel({ p: p, btn: btn, target: option, isCheckbox: isCheckbox });
        }
    }

    submit = zoltar.panel.appendChild(make('P')).appendChild(make('BUTTON'));
    submit.textContent = 'SUBMIT';
    submit.onclick = () => get('input[type=submit]').click();

    function getSections() {
        var ss = Array.prototype.slice.call(getAll('div[ng-show][flex]'), 1); // slice out initial div (business name)
        if (!ss.length || ss.length < 4) ss = Array.from(getAll('fieldset')); // car dealer website eval
        return ss;
    }
})();