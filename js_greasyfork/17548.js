// ==UserScript==
// @name Ad remover for joyreactor.cc
// @description Removes yellow banner with an offer to disable AdBlock on joyreactor.cc
// @description:ru Убирает желтую плашку с предложением отключить AdBlock на joyreactor.cc
// @namespace joyreactor_cc
// @include http://joyreactor.cc/*
// @include https://joyreactor.cc/*
// @include http://*.reactor.cc/*
// @include https://*.reactor.cc/*
// @version 18
// @license MIT
// @run-at  document-body
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/17548/Ad%20remover%20for%20joyreactorcc.user.js
// @updateURL https://update.greasyfork.org/scripts/17548/Ad%20remover%20for%20joyreactorcc.meta.js
// ==/UserScript==

window.document.write = function () {};

var prependOld = window.jQuery.fn.prepend;
window.jQuery.fn.prepend = function (str) {
    if (typeof str == 'string' && unescape(str).indexOf('/donate') != -1) {
        return this;
    }
    prependOld.apply(this, arguments);
};

var domManipOld = window.jQuery.fn.domManip;
window.jQuery.fn.domManip = function (args) {
    if (typeof args[0] == 'string' && unescape(args[0]).indexOf('/donate') != -1) {
        return;
    }
    domManipOld.apply(this, arguments);
};

var ajaxOld = window.jQuery.ajax;
window.jQuery.ajax = function (p) {
    if (p.url.indexOf('show.ctrmanager.com') == -1) {
        ajaxOld.apply(this, arguments);
    }
};

// отключаем открытие всякого рекламного говна в новых окнах/вкладках
window.VisitWeb = null;
window.Joyreactor.show_ads = 1;

$(document).ready(function () {
    window.CTRManager.show = function () {};
});
