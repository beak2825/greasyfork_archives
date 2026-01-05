// ==UserScript==
// @name        Show Password Pro.
// @namespace   ShowPassword
// @description Double click to switch password field: YELLOW (pop up tooltip with password); BULE (mouse over to show password); NORMAL (hide password);
// @include     *
// @version     2015.10.11.05
// @author      OscarKoo
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/12661/Show%20Password%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/12661/Show%20Password%20Pro.meta.js
// ==/UserScript==

(function(document) {
    var delay = 333;

    var index = 0;
    var getCacheKey = function(target) {
        var key = 'data-okspId';
        var value;
        if (!(value = target.getAttribute(key))) {
            target.setAttribute(key, (value = target.id || target.name || ++index));
        }
        return 'okShowPasswordMode_' + value;
    };

    var getMode = function(target) {
        var mode = localStorage.getItem(getCacheKey(target));
        if (!mode || !(mode = parseInt(mode, 10)) || mode < 1 || mode > 3)
            mode = 1;
        return mode;
    };

    var setMode = function(target, mode) {
        if (!(mode = parseInt(mode, 10)) || mode < 1 || mode > 3)
            mode = 1;
        localStorage.setItem(getCacheKey(target), mode);
        return mode;
    };

    function onInput(e) {
        var target = e.target;
        target.title = target.value;
        return false;
    }

    function onMouseOver(e) {
        var target = e.target;
        target.type = 'text';
        target.focus();
        target.selectionStart = target.selectionEnd = target.value.length;
        return false;
    }

    function onMouseOut(e) {
        var target = e.target;
        setTimeout(function() {
            target.blur();
            target.type = 'password';
        }, delay);
        return false;
    }

    function switchMode(target, mode, isClick) {
        target.title = '';
        target.type = 'password';
        target.style.border = '';
        target.removeEventListener('input', onInput);
        target.removeEventListener('mouseover', onMouseOver);
        target.removeEventListener('mouseout', onMouseOut);
        switch (mode) {
            case 1:
                target.style.border = '2px solid #FFCC00';
                target.addEventListener('input', onInput);
                target.title = target.value;
                break;
            case 2:
                target.style.border = '2px solid #3399FF';
                target.addEventListener('mouseover', onMouseOver);
                target.addEventListener('mouseout', onMouseOut);
                if (isClick) target.type = 'text';
                else target.blur();
                break;
        }
    }

    function onDblClick(e) {
        var target = e.target;
        var mode = getMode(target);
        mode = setMode(target, ++mode);
        switchMode(target, mode, true);
    }

    (function() {
        var pwdList = document.querySelectorAll('input[type=password]');
        for (var i = 0; i < pwdList.length; i++) {
            var target = pwdList[i];
            target.addEventListener('dblclick', onDblClick);
            var mode = getMode(target);
            setMode(target, mode);
            switchMode(target, mode);
        }
    })();
})(document);