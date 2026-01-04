// ==UserScript==
// @name         Prettify Fxp
// @version      1.6.6
// @description  Removes unwanted stuff from FxP
// @author       DaCurse0
// @copyright    2016+, DaCurse0
// @match        https://www.fxp.co.il/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/62051
// @downloadURL https://update.greasyfork.org/scripts/34070/Prettify%20Fxp.user.js
// @updateURL https://update.greasyfork.org/scripts/34070/Prettify%20Fxp.meta.js
// ==/UserScript==
var settings_default = {
    removeArticles: true,
    removeWallaWidgets: true,
    removeTaboolaArticles: true,
    removeGoogleAds: true,
    enablePopup: true,
    changeFont: false,
    websiteFont: 'Tahoma',
}

var settings = new Object();

var vs = GM_info.script.version;

$(function() {

    try {
        JSON.parse(localStorage.settings);
        settings = JSON.parse(localStorage.settings);
    } catch (ex) {
        console.warn('Settings are corrupt, resetting to default.')
        localStorage.settings = JSON.stringify(settings_default);
        settings = settings_default;
    }

    //if (settings.removeArticles) removeArticles();
    if (settings.removeWallaWidgets) removeWalla();
    if (settings.removeTaboolaArticles) removeTaboola();
    if (settings.removeGoogleAds) removeAds();
    if (settings.changeFont) changeFont();

    loadImages();
    info();
    //settingsMenu();

    $(window).unload(function() {
        localStorage.settings = JSON.stringify(settings);
    });

});

function info() {

    var elemHtml = '<div id="fp_v" style="position:absolute;top:8px;left:5px;color:white;z-index:9999;-webkit-user-select:none;' +
        '-moz-user-select:none;cursor:help;">FxP Prettify ' + vs + '</div>';

    $('.topbluew').append(elemHtml);

    $('#fp_v').on('click', function() {
        $("#fp_settings").show();
    });
}

function loadImages() {
    new Image().src = "http://megaicons.net/static/img/icons_sizes/8/178/512/very-basic-cancel-icon.png";
}

function settingsMenu() {

    /*var containerStyle = 'position:fixed;top:50%;left:50%;transform: translate(-50%, -50%);z-index:99999;width:640px;' +
        'height:360px;background-color:white;border:1px solid black;-webkit-box-shadow: 10px 10px 12px -6px' +
        ' rgba(0,0,0,0.75);-moz-box-shadow: 10px 10px 12px -6px rgba(0,0,0,0.75);display:none;';

    var containerHtml = '<div id="fp_settings" style="' + containerStyle + '"></div>';

    var closeBtnStyle = 'position:absolute;top:3px;left:3px;cursor:pointer'

    var closeBtnHtml = '<div id="fp_close" style="' + closeBtnStyle + '"><img src="http://megaicons.net/static/img/' +
        'icons_sizes/8/178/512/very-basic-cancel-icon.png" width="32" height="32" /></div>'

    $('body').append(containerHtml);
    $('#fp_settings').append(closeBtnHtml);

    $("#fp_close").on('click', function() {
        $('#fp_settings').hide();
    });*/

}

function removeArticles() {
    try {
        $('#slide').remove();
    } catch (ex) {
        console.info('No articles found to remove');
    }
}

function removeWalla() {
    try {
        $('iframe[src^="https://widget.walla.co.il/"]').remove();
        $("#ynetb").remove();
    } catch (ex) {
        console.info('No Walla! widget found to remove');
    }
}

function removeTaboola() {
    try {
        $("*[id^=taboola]").remove();
    } catch (ex) {
        console.info('No Taboola ads found to remove');
    }
}

function removeAds() {
    try {
        $("#gpt-right-tower").remove();
        $("#gpt-left-tower").remove();
        $("#adfxp").remove();
    } catch (ex) {
        console.info('No Google Ads found to remove');
    }
}

function changeFont() {
    $("#top-menu").children().children().css('font-family', settings.websiteFont);
    $('.stast').children.css('font-family', settings.websiteFont);
    $('*[class^=tfooter]').children().css('font-family', settings.websiteFont);
}