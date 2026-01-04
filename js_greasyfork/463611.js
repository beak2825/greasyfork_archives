// ==UserScript==
// @name         AnimeLib Player Settings
// @namespace    https://github.com/RENOMIZER
// @version      1.3
// @description  Settings for video player
// @author       RENOMIZER, SimbiAnT29
// @match        https://animelib.me/anime/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_deleteValue
// @require      https://code.jquery.com/jquery-3.6.3.js
// @resource     REMOTE_CSS https://raw.githubusercontent.com/RENOMIZER/animelib-player-settings/main/settings-styles.css
// @downloadURL https://update.greasyfork.org/scripts/463611/AnimeLib%20Player%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/463611/AnimeLib%20Player%20Settings.meta.js
// ==/UserScript==

var $ = window.jQuery;
var hght = GM_getValue("hght");
var cinechck = GM_getValue("cinechck");
var maxhght = 80;
var subtitleSize = GM_getValue("subtitleSize");
var maxSubtitleSize = 100;

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
    $('#settings').append('<div class="slidecontainer slidecontainerHeight"> </div>');
    $('.slidecontainerHeight').append('<p class="slideheader.settingstext"> Высота плеера </p>');
    $('.slidecontainerHeight').append('<input type="range" min="60" class="slider sliderHeight" id="player-height_var" name="player-height_var">');
    $('.slidecontainerHeight').append('<p class="slidemin settingstext">0⠀⠀</p>');
    $('.slidecontainerHeight').append('<p class="slideval slidevalHeight settingstext"> </p>');
    $('.slidevalHeight').text((hght / 10 - 60) * 5);
    $('.slidecontainerHeight').append('<p class="slidemax settingstext"> 100 </p>');
    $('.sliderHeight').attr('max', maxhght)
    $('.sliderHeight').attr('value', hght / 10);

    $('#settings').append('<div class="switchcontainer"> </div>');
    $('.switchcontainer').append('<p class="cintxt settingstext"> Режим кинотеатра </p>');
    $('.switchcontainer').append(`
        <label class="switch">
            <input type="checkbox" id="switch" value="true">
            <span class="slider-switch round"></span>
        </label>
    `);

    $('#settings').append('<div class="slidecontainer slidecontainerSub"> </div>');
    $('.slidecontainerSub').append('<p class="slideheader.settingstext"> Размер субтитров </p>');
    $('.slidecontainerSub').append('<input type="range" min="5" class="slider sliderSub" id="player-subtitile-size" name="player-subtitile-size">');
    $('.slidecontainerSub').append('<p class="slidemin settingstext">5px</p>');
    $('.slidecontainerSub').append('<p class="slideval slidevalSub settingstext"> </p>');
    $('.slidevalSub').text(subtitleSize);
    $('.slidecontainerSub').append('<p class="slidemax settingstext">100px</p>');
    $('.sliderSub').attr('max', maxSubtitleSize)
    $('.sliderSub').attr('value', subtitleSize);

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

    subtitleSize = $('#player-subtitile-size').val();
    $('.plyr__captions').css('font-size', subtitleSize + 'px');
    $('.slidevalSub').text(subtitleSize + 'px');
    GM_setValue("subtitleSize", subtitleSize);

    /* Apply settings */
    document.getElementById("player-height_var").oninput = function () {
        hght = $('#player-height_var').val() * 10;
        $('.player-frame').css('height', hght + 'px');
        $('.player-frame').css('max-height', hght + 'px');
        $('.plyr').css('height', 'inherit');
        $('.collapse__body').css('height', hght + 'px');
        $('.collapse__body').css('max-height', hght + 'px');
        $('.slidevalHeight').text((hght / 10 - 60) * 5);
        GM_setValue("hght", hght);
    };
    
    document.getElementById("player-subtitile-size").oninput = function () {
        subtitleSize = $('#player-subtitile-size').val();
        $('.plyr__captions').css('font-size', subtitleSize + 'px');
        $('.slidevalSub').text(subtitleSize + 'px');
        GM_setValue("subtitleSize", subtitleSize);
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

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    waitForElm('.plyr__captions').then((elm) => {
        subtitleSize = $('#player-subtitile-size').val();
        $('.plyr__captions').css('font-size', subtitleSize + 'px');
        $('.slidevalSub').text(subtitleSize + 'px');
        GM_setValue("subtitleSize", subtitleSize);
    });

}
)();