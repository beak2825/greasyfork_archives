// ==UserScript==
// @name         AnimeLib Player Settings
// @namespace    https://github.com/RENOMIZER
// @namespace    mailto:implaninyl1977@rambler.ru
// @version      1.2
// @description  Settings for video player
// @author       RENOMIZER
// @match        https://animelib.me/anime/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.3.js
// @resource     REMOTE_CSS https://raw.githubusercontent.com/RENOMIZER/animelib-player-settings/main/settings-styles.css
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/458136/AnimeLib%20Player%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/458136/AnimeLib%20Player%20Settings.meta.js
// ==/UserScript==

var $ = window.jQuery;
var hght = GM_getValue("hght");
var cinechck = GM_getValue("cinechck");
var maxhght = 80;

(function () {
    'use strict'

    /* Add style */
    const CSS = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(CSS);

    /* Add settings button */
    $('<div class="reader-header-action reader-header-action_icon player-height"> </div>').insertBefore($('#add-chapter-bookmark'));
    $('.player-height').append('<span class="reader-header__icon"> </span>');
    $('.player-height span.reader-header__icon').append('<i class="fa fa-solid fa-gear"></i>');

    /* Add settings panel */
    $('body').append('<div id="player-settings-modal" class="modal" data-type="slide" tabindex="-1"> </div>');
    $('#episodes-list-modal .popup__content').clone().appendTo($('#player-settings-modal'));
    $('#player-settings-modal div.modal__body').remove();
    $('#player-settings-modal h4').text("Настройки плеера");
    $('#player-settings-modal div.modal__content').append('<div id="settings" class="modal__body"> </div>');
    $('#player-settings-modal div.modal__content').attr('style', 'overflow-y: auto; left: 80%; width: 20%');
    $('#player-settings-modal div.modal__content').append('<p class="settingstext hiddentext"> Настройки сохраняются в память дополнения </p>')

    /* Add settings content */
    $('#settings').append('<div class="slidecontainer"> </div>');
    $('.slidecontainer').append('<p class="slideheader.settingstext"> Высота плеера </p>');
    $('.slidecontainer').append('<input type="range" min="60" class="slider" id="player-height_var" name="player-height_var">');
    $('.slidecontainer').append('<p class="slidemin settingstext">0⠀⠀</p>');
    $('.slidecontainer').append('<p class="slideval settingstext"> </p>');
    $('.slideval').text((hght / 10 - 60) * 5);
    $('.slidecontainer').append('<p class="slidemax settingstext"> 100 </p>');
    $('.slider').attr('max', maxhght)
    $('.slider').attr('value', hght / 10);

    $('#settings').append('<div class="switchcontainer"> </div>');
    $('.switchcontainer').append('<p class="cintxt settingstext"> Режим кинотеатра </p>');
    $('.switchcontainer').append(`
        <label class="switch">
            <input type="checkbox" id="switch" value="true">
            <span class="slider-switch round"></span>
        </label>
    `);

    /* Add panel animation */
    $('.player-height').attr('data-open-modal', '#player-settings-modal');
    $('.player-height').attr('data-media-up', 'md');

    /* Apply settings (init) */
    window.onload = function () {
        $('.player-frame').css('height', hght + 'px');
        $('.player-frame').css('max-height', hght + 'px');
        $('.plyr').css('height', 'inherit');
        $('.collapse__body').css('height', hght + 'px');
        $('.collapse__body').css('max-height', hght + 'px');

        $('<div class="cinetint"> </div>').insertAfter($('#all_players'));
        if (cinechck) {
            $('.cinetint').toggleClass("is-active");
            $('.player-frame').toggleClass("is-active");
            $("#switch").prop("checked", true);
        }
    };

    /* Apply settings */
    document.getElementById("player-height_var").oninput = function () {
        hght = $('#player-height_var').val() * 10;
        $('.player-frame').css('height', hght + 'px');
        $('.player-frame').css('max-height', hght + 'px');
        $('.plyr').css('height', 'inherit');
        $('.collapse__body').css('height', hght + 'px');
        $('.collapse__body').css('max-height', hght + 'px');
        $('.slideval').text((hght / 10 - 60) * 5);
        GM_setValue("hght", hght);
    };

    /* Apply cinema mode */
    $('#switch').on('click', function () {
        if (!cinechck) {
            $('.cinetint').toggleClass("is-active");
            $('.player-frame').toggleClass("is-active");
            cinechck = true;
        }
        else {
            $('.cinetint').removeClass("is-active");
            $('.player-frame').removeClass("is-active");
            cinechck = false;
        }
    });
}
)();