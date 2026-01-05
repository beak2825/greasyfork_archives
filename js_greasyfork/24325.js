// ==UserScript==
// @name         Fur Affinity Test UI Homepage
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Original concept art by Mailylion. Replaces the landing page with a new theme.
// @author       ItsNix (https://www.furaffinity.net/user/itsnix/)
// @match        https://www.furaffinity.net/
// @grant        none
// @run-at       document-end
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24325/Fur%20Affinity%20Test%20UI%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/24325/Fur%20Affinity%20Test%20UI%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var st = document.createElement('link');
    $(st).attr('href', 'https://fonts.googleapis.com/icon?family=Material+Icons');
    $(st).attr('rel', 'stylesheet');
    document.getElementsByTagName('head')[0].appendChild(st);

    var sections = $('.section-divider');
    $('<i class="material-icons">&#xE43C;</i>').prependTo($(sections[0]).children('h2'));
    $('<i class="material-icons">&#xE865;</i>').prependTo($(sections[1]).children('h2'));
    $('<i class="material-icons">&#xE030;</i>').prependTo($(sections[2]).children('h2'));
    $('<i class="material-icons">&#xE91D;</i>').prependTo($(sections[3]).children('h2'));
    $(sections[3]).attr('style', 'padding-bottom: 60px;');
    $.each(sections, function(i) {
        $(sections[i]).children('h2').addClass('nix-header');
        $(sections[i]).children('div').addClass('nix-content');
    });

    var stories = $($('div.nix-content')[1]).children().children().children()
        .children().children().children('img[width=50][height=50]');
    stories.attr('src', 'https://i.imgur.com/pfRQMJa.png');
    stories.attr('height', 113);
    stories.attr('width', 113);

    var music = $($('div.nix-content')[2]).children().children().children()
        .children().children().children('img[width=50][height=50]');
    music.attr('src', 'https://i.imgur.com/qlPp13W.png');
    music.attr('height', 113);
    music.attr('width', 113);

    $('<div id="nix-footer" class="p10"><div class="nix-footerleft"></div><div class="nix-footerright"></div></div>')
        .prependTo('#footer');
    var logo = $('img.falogo');
    logo.appendTo('.nix-footerleft');
    $('<br/><span id="nix-footertext"></span>').appendTo('.nix-footerleft');
    $('#footer').children('div.p10t').children('strong').appendTo('#nix-footertext');
    $('.ads').appendTo('.nix-footerright');
    $('<br/>').appendTo('.nix-footerleft');
    $('.online-stats').appendTo('.nix-footerleft');
    $(' \\| ').appendTo('#nix-footertext');
    $('#footer').children('div.p10t').children().appendTo('#nix-footertext');
    $('#footer').children('.p10t').remove();

    var submissions = $('#my-username').parent().next();
    if ($.trim( submissions.text()) === '') { submissions.html('<span style="color: #AAA;">No New Activity</span>'); }
    else { submissions.html('<span style="color: #fda936;">' + submissions.html() + '</span>'); }
    $('#my-username').remove();
    $('#my-username').removeClass('top-heading');
    $('#my-username').parent().children('i').remove();
    var userarea = $('#my-username').parent().next();
    $('<br/>').prependTo(userarea);
    $('#my-username').prependTo(userarea);
    $('<br/>').appendTo(userarea);
    userarea.next().children().removeClass('top-heading');
    userarea.next().children().appendTo(userarea);
    userarea.next().remove();
    userarea.attr('style', 'line-height: 25px;');

    var sfw = userarea.next();
    sfw.children('a').html('<i class="material-icons">&#xE8F9;</i>');
    sfw.attr('style', 'padding: 0 0px !important;');
    var logout = sfw.next();
    logout.children('span').children('a').html('<i class="material-icons">&#xE879;</i>');
    logout.attr('style', 'padding: 0 0px !important; margin-right: 30px;');

    if ($('#news').text() !== "") {
        $('<i class="nix-alert material-icons">priority_high</i><div class="nix-news"></div>').insertAfter('ul');
        $('.nix-news').html($('#news').html());
        $('.nix-news').addClass($('#news').attr('class'));
        $('#news').attr('style', 'display: none;');
        $('<img style="float:right; margin-left: 15px; margin-top: 3px;" class="dismissreplacement" title="Dismiss" src="https://i.imgur.com/f1SmwHW.png" width="24px">')
            .insertAfter('img.dismiss');
        $('img.dismissreplacement').attr('onclick', `document.getElementsByClassName("nix-news")[0].style.display = 'none';
            document.getElementsByClassName("nix-alert")[0].style.display = 'none';
            document.getElementsByClassName("dismiss")[1].click();`);
        $('img.dismissreplacement').attr('src', 'https://i.imgur.com/f1SmwHW.png');
        $('img.dismissreplacement').attr('style', 'width: 24px; margin-left: 10px; margin-top: 3px; float:right; margin-right: 10px;');
    }

    var jq = document.createElement('style');
    var newContent = document.createTextNode(`
        #ddmenu ul { background-color: #272727; padding-top: 10px; padding-bottom: 10px; height: 80px; }
        #ddmenu ul li { text-align: left; }
        #ddmenu .top-heading { margin-left: 10px; }
        #ddmenu, .border-bot { border-bottom: none; }
        #ddmenu .menubar_icon_resize { max-height: 60px!important; padding-top: 10px; }
        #ddmenu .nav-bar-logo { padding-left: 20px; max-height: 55px; padding-top: 15px; }
        #searchbox input[type=search] { background-color: #272727; }
        #ddmenu .menubar_icon_resize { padding-right: 0px; margin-right: -10px; }
        .section-divider { background-color: #323232; margin-top: 20px; padding-left: 0; padding-right: 0; }
        html, body, .submission-area, .frontpage-content { background-color: #323232; }
        #footer { border-top: 3px solid #969696; background-color: #272727; }
        .falogo { padding-bottom: 10px; }
        #nix-footer { height: 200px; padding-top: 30px; }
        .nix-header {
                display: inline; margin-left: 40px; margin-bottom: 5px; line-height: 32px;
                color: #000; text-transform: uppercase; font-size: 14pt; font-weight: 500;
                background-color: #fda936; padding: 15px 25px 4px 25px; }
        .nix-content { border-top: 3px solid #969696; background-color: #272727; }
        .nix-footerleft { float: left; text-align: left; }
        .nix-footerright { float: right; text-align: right; }
        .online-stats, #nix-footertext { text-align: left; padding-left: 50px; }
        .material-icons { top: 4px; margin-right: 10px;  position: relative; }
        center.flow.frontpage.twolines { margin-top: 30px; margin-bottom: 30px; padding-left: 30px; padding-right: 30px; }
        center.flow.frontpage.threelines { margin-top: 30px; margin-bottom: 30px; padding-left: 30px; padding-right: 30px; }
        @media (min-width: 481px) {
            .nix-news {
                float: left; top: -45px; position: relative; left: 170px; z-index: 999999; background-color: #fda936;
                color: #000; font-weight: 600; line-height: 30px;padding-left: 20px;
            }
            .nix-news > a { color: #000; }
            .nix-alert { position: relative; float: left; top: -43px; z-index: 999999; left: 180px; }
            .dismissreplacement { cursor: pointer; }
            img.dismiss { display: none; }
        }
        @media screen and (max-width: 480px) {
            .nix-alert { display: none; }
            img.dismissreplacement { display: none; }
        }
    `);
    jq.appendChild(newContent);
    document.getElementsByTagName('body')[0].appendChild(jq);
})();