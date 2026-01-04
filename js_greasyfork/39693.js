// ==UserScript==
// @name  jandan.net - 煎蛋网
// @namespace    https://github.com/maijz128
// @version      0.2.0
// @description  鼠标悬浮至GIF自动播放，鼠标悬浮至[ShowMore]上自动展开/收起。
// @author       MaiJZ
// @match        *://*.jandan.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39693/jandannet%20-%20%E7%85%8E%E8%9B%8B%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/39693/jandannet%20-%20%E7%85%8E%E8%9B%8B%E7%BD%91.meta.js
// ==/UserScript==


(function () {
    main();
})();

function main() {
    setTimeout(function () {
        GIF();
        ShowMore();
    }, 1000);
}

function GIF() {
    $(".gif-mask").hover(function () { // mouseenter event
        $(this).click();

        var el_acv_comment = $(this).parent().parent();
        el_acv_comment.click();
    }, function () {   // mouseleave event
        // do some thing...
    });
}

function ShowMore_Trigger(hoverTime, callback) {
    var self = this;
    this._element = null;
    this._timeout = null;
    this._hoverTime = hoverTime;
    this._callback = callback;

    this.start = function (element) {
        self.cancel();

        self._element = element;
        self._timeout = setTimeout(function () {
            if (self._element !== null && self._callback !== null) {
                self._callback(self._element);
            }
        }, self._hoverTime);
    };

    this.cancel = function () {
        self._element = null;
        clearTimeout(self._timeout);
    };
}

function ShowMore() {
    var trigger = new ShowMore_Trigger(500, function (element) {
        $(element).click();
    });

    $('.show_more').each(function (index, element) {
        $(this).hover(function () { // mouseenter event
            trigger.start($(this));
        }, function () {   // mouseleave event
            trigger.cancel();
        });
    });

}

function matchURL(url) {
    const URL = window.location.href;
    return URL.indexOf(url) > -1;
}

function addStyle(styleContent) {
    var elStyle = document.createElement("style");
    elStyle.innerHTML = styleContent;
    document.head.appendChild(elStyle);
}