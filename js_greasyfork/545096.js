// ==UserScript==
// @name         QPro Copied
// @namespace    https://blog.aleiwe.tech/
// @version      2025-08-08
// @description  Is fastly copy for QPro
// @author       leiwenyong
// @match        https://qpro.sankuai.com/*
// @icon         https://picx.zhimg.com/80/v2-6f7e79c312d7556bf7f57ca2e8ec261b_1440w.png?source=d16d100b
// @license           GPL License
// @downloadURL https://update.greasyfork.org/scripts/545096/QPro%20Copied.user.js
// @updateURL https://update.greasyfork.org/scripts/545096/QPro%20Copied.meta.js
// ==/UserScript==

(function () {
    'use strict';
    document.oncontextmenu = function () {
        return false;
    };
    function showToast(msg, duration) {
        if (duration === void 0) { duration = 3000; }
        var toast = document.createElement('div');
        toast.textContent = "".concat(msg, " copied !");
        toast.style.position = 'fixed';
        toast.style.left = '50%';
        toast.style.top = '-80px';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#ffffff';
        toast.style.color = '#000000';
        toast.style.padding = '8px 24px';
        toast.style.borderRadius = '16px';
        toast.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)';
        toast.style.zIndex = '99999';
        toast.style.transition = 'top 0.5s cubic-bezier(.68,-0.55,.27,1.55), opacity 0.5s';
        document.body.appendChild(toast);
        setTimeout(function () {
            toast.style.top = '60px';
            toast.style.opacity = '1';
        }, 10);
        setTimeout(function () {
            toast.style.top = '-80px';
            toast.style.opacity = '0';
            setTimeout(function () { return toast.remove(); }, 500);
        }, duration);
    }
    function attach_method(query, method) {
        var el = document.querySelector(query);
        el ? method(el) : setTimeout(function () { attach_method(query, method); }, 1000);
    }
    var doOptIt = function (el) {
        el.childNodes.forEach(function (e) {
            var _a;
            var tmp = (_a = e.childNodes[0].childNodes[2].textContent) === null || _a === void 0 ? void 0 : _a.split(" ");
            var optName = tmp === null || tmp === void 0 ? void 0 : tmp[(tmp === null || tmp === void 0 ? void 0 : tmp.length) - 1];
            console.log();
            e.addEventListener("contextmenu", function () {
                window.navigator.clipboard.writeText(optName);
                showToast(optName);
            });
        });
    };
    var doit = function (el) {
        var _a, _b, _c, _d;
        var preStep = (_b = (_a = el.parentElement) === null || _a === void 0 ? void 0 : _a.childNodes[3]) === null || _b === void 0 ? void 0 : _b.childNodes[0];
        preStep === null || preStep === void 0 ? void 0 : preStep.addEventListener("click", function () {
            attach_method(".configs", doit);
        });
        var els = el.getElementsByClassName("itembox");
        var _loop_1 = function (index) {
            var element = els[index];
            var abilityName = (_c = element.childNodes[1].childNodes[0].childNodes[2].textContent) === null || _c === void 0 ? void 0 : _c.trim();
            element.childNodes[1].addEventListener("contextmenu", function () {
                window.navigator.clipboard.writeText(abilityName);
                showToast(abilityName);
            });
            (_d = element.childNodes[3]) === null || _d === void 0 ? void 0 : _d.childNodes.forEach(function (vpElement) {
                var vpName = vpElement.childNodes[2].textContent;
                vpElement.addEventListener("contextmenu", function () {
                    window.navigator.clipboard.writeText(vpName);
                    showToast(vpName);
                });
                vpElement.addEventListener("click", function () {
                    attach_method(".buttonBox", doOptIt);
                });
            });
        };
        for (var index = 0; index < els.length; index++) {
            _loop_1(index);
        }
    };
    attach_method(".configs", doit);
})();