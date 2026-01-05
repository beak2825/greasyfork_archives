// ==UserScript==
// @name           Chaturbate exhibitionists - show only women (shemale / couple) online
// @namespace      https://greasyfork.org/users/5174-jesuis-parapluie
//
// @description    Filter gender on the amateur site: http://chaturbate.com/exhibitionist-cams
//
// @include        /^https?://(.+\.)?chaturbate\.com/exhibitionist-cams/?.*$/
//
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
//
// @grant          none
//
// @version        0.1.4
// @downloadURL https://update.greasyfork.org/scripts/4958/Chaturbate%20exhibitionists%20-%20show%20only%20women%20%28shemale%20%20couple%29%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/4958/Chaturbate%20exhibitionists%20-%20show%20only%20women%20%28shemale%20%20couple%29%20online.meta.js
// ==/UserScript==

/**
 *      The JQuery Cookie plugin is only used to disable the terms and conditions overlay.
 **/

(function ($) {
    "use strict";
    /*jslint browser: true */
    /*global $, jQuery */

    var options = {
        startFilter: 'f', /* f, c, s, fc, fcs */
        autoLogin: { active: false, username: '', password: '' }
    },


        filter = function (e) {
            var i, len, cam, act;
            if (e === "update") {
                act = $('#main > div.top-section > ul > li.active').find('a').attr('href');
                if (act && act[0] === '#') { cam = act.substr(1); }
            } else {
                $('#main > div.top-section > ul > li').removeClass('active');
                $(this).addClass('active');
                cam = $(this).find('a').attr('href').substr(1);
            }

            if (cam !== null && cam !== 'all') {
                $('#main > div.content > div.c-1.endless_page_template > ul.list > li').hide();

                for (i = 0, len = cam.length; i < len; i += 1) {
                    $('#main > div.content > div.c-1.endless_page_template > ul.list > li span.gender' + cam[i]).parent().parent().parent().show();
                }

            } else {
                $('#main > div.content > div.c-1.endless_page_template > ul.list > li').show();
            }
        };


    $(function () {
        var setting = window.location.href.split("#"),
            gender = 'all';

        $('#entrance_terms:visible, #overlay:visible').hide();
        if ($.cookie('agreeterms') !== '1') { $.cookie('agreeterms', '1', {expires: 365, path: '/'}); }

        $('#main > div.top-section > ul').prepend($('<br><br>'));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#all">All</a>' }).click(filter));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#fcs">Female+Couple+Shemale</a>' }).click(filter));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#fc">Female+Couple</a>' }).click(filter));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#m">Male</a>' }).click(filter));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#s">Shemale</a>' }).click(filter));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#c">Couple</a>' }).click(filter));
        $('#main > div.top-section > ul').prepend($('<li>', { html: '<a href="#f">Female</a>' }).click(filter));

        document.addEventListener("DOMNodeInserted", function (event) {
            if (event.target.nodeName === 'UL' && $(event.path[0]).hasClass('list')) { filter('update'); }
        });

        if (options !== undefined && options.autoLogin !== undefined && options.autoLogin.active === true && options.autoLogin.password !== '' && options.autoLogin.username !== '' && $('a[href$="auth/login/"]').size() > 0) {
            $('#login-box').find('form input[type="password"]').attr('value', options.autoLogin.password);
            $('#login-box').find('form input[name="username"]').attr('value', options.autoLogin.username);
            $('#login-box').find('form input[type="submit"]').click();
        }

        if (setting && setting.length > 1) {
            $('#main > div.top-section > ul > li > a[href="#' + setting[1] + '"]').click();
        } else {
            if (options !== undefined && options.startFilter !== undefined && options.startFilter !== '') { gender = options.startFilter; }
            $('div.top-section a[href="#' + gender + '"]').parent().addClass('active');
            $('#main > div.top-section > ul > li > a[href="#' + gender + '"]').click();
        }
    });


}(jQuery));

