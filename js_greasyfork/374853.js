// ==UserScript==
// @name         immobilienscout24.de tools
// @namespace    immobilienscout24.de
// @version      1.010
// @description  immobilienscout24.de (visual)
// @author       Anton
// @match        *.immobilienscout24.de/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374853/immobilienscout24de%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/374853/immobilienscout24de%20tools.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const noAddress = "Die vollständige Adresse der Immobilie erhalten Sie vom Anbieter.";
    const wbs_word = "wohnberechtigungsschein";
    const officeAddr = "Augustusplatz+9,+04109+Leipzig";

    const walkingMode = "/data=!4m2!4m1!3e2";
    const mainBlockStyle = "padding:4px;margin:4px;position:absolute;background:white;height:45px;";
    const buttonStyle = "margin:4px;padding:4px;border:1px solid black;display:inline-block;";

    var $mainContent;

    var _log = function (str) {
        if (console) console.log("immobilienscout24.de tools:", str);
    };

    var isWBS = function() {
        return $('html').text().toLowerCase().indexOf(wbs_word) > 0;
    };

    var getAddress = function() {
        var address = $('.address-block').first().text().trim();
        if (address.indexOf(noAddress) >= 0) {
            address = address.replace(noAddress, "");
        }
        return address.trim();
    };

    var escapeAddress = function (address) {
        if (typeof address === 'string') {
            return address.split(" ").join("+");
        }
        return "";
    };

    var _initWindow = function () {
        unsafeWindow.IT = {};
    };

    var _btnSuffix = function (name) {
        return '">' + name + '</a>';
    };

    var _initPage = function() {
        $mainContent = $('.content-wrapper-container.page-wrapper > .content-wrapper--background');

        var address = escapeAddress(getAddress());
        var googleMaps = "https://www.google.ru/maps/place/" + address;
        var schoolSearch = "https://www.google.ru/maps/search/школа+рядом+с+" + address;
        var googleDistance = "https://www.google.ru/maps/dir/" + address + "/";

        var BTNPREFIX = '<a target="_blank" class="it_btn" href="';

        var style = '<style type="text/css">.it_btn {' + buttonStyle + '}</style>';
        var $gotomapButton = BTNPREFIX + googleMaps + _btnSuffix('Map');
        var $gotoschoolButton = BTNPREFIX + schoolSearch + _btnSuffix('School');
        var $dirOfficeButton = BTNPREFIX + googleDistance + officeAddr + walkingMode + _btnSuffix('To Office');
        var $buttonDiv = style + '<div style="' + mainBlockStyle + '">' +
            $gotomapButton +
            $gotoschoolButton +
            $dirOfficeButton +
            '</div>';

        $mainContent.prepend($buttonDiv);

        if (isWBS()) {
            var $gallery = $('.is24-expose-gallery-box-container');
            var wbs_styles =
                "position: absolute;" +
                "left: 50%;" +
                "top: 50%;" +
                "font-size: 60px;" +
                "font-weight: bold;" +
                "margin-top: -30px;" +
                "margin-left: -60px;" +
                "color: red;" +
                "z-index: 1";
            $gallery.prepend('<div style="' + wbs_styles + '">WBS</div>');
        }
    };

    var _init = function () {
        _initPage();
        _initWindow();
        _log("Init complete");
    };

    _log("HELLO!");

    setTimeout(_init, 1000);
})();