// ==UserScript==
// @name         Github-speed-up
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Github加速下载release,源代码
// @author       GallenHu
// @match        https://github.com/*/*
// @match        https://github.com/*/*/releases
// @grant        none
// @require https://cdn.staticfile.org/jquery/1.12.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/418425/Github-speed-up.user.js
// @updateURL https://update.greasyfork.org/scripts/418425/Github-speed-up.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const speedupHOST = 'https://ghproxy.com/';

    const speedupRelease = () => {
        var ass = $('details.details-reset a.d-flex')
        $(ass).each(function (i, a) {
            var link = $(a).attr('href');
            var speedLink = `${speedupHOST}https://github.com${link}`;
            var btnHtml = `<a href="${speedLink}">加速下载</a>`;
            $(a).after(btnHtml);

            if ($(a).parent().hasClass('d-block')) {
                $(a).parent().removeClass('d-block').addClass('d-flex').addClass('flex-justify-between');
            }
        });
    };

    const speedupSourceCodeDownload = () => {
        var list = $('div[data-target="get-repo.modal"] ul li')
        var lastLIClone = $.clone(list[1]);
        var btnText = $(lastLIClone).text().trim();
        var newBtnText = '加速 ' + btnText;
        var $lastDomA = $(lastLIClone).find('a');
        var innerAHtml = $lastDomA.html().replace(btnText, newBtnText);
        var link = $lastDomA.attr('href');
        var newLink = `${speedupHOST}https://github.com${link}`;

        $lastDomA.html(innerAHtml).attr('href', newLink);

        $('div[data-target="get-repo.modal"] ul').append(lastLIClone);
    };

    const addSpeedUpLink = () => {
        var $nav = $('nav.d-flex');
        $nav.append(`<a href="${speedupHOST}" class="Header-link" target="_blank">Github 加速</a>`)
    };

    const URL = window.location.href;
    if (URL.includes('/release')) {
        speedupRelease();
    } else {
        speedupSourceCodeDownload();
    }

    if ($('nav.d-flex').length) {
        addSpeedUpLink();
    }
})();
