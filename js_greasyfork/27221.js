// ==UserScript==
// @name         Springfield! Springfield! Previous and next episodes links
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds links to the previous and next episodes on the scripts pages of Springfield! Springfield!
// @author       ccjmne
// @include      http*://www.springfieldspringfield.co.uk/view_episode_scripts.php?tv-show=*&episode=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27221/Springfield%21%20Springfield%21%20Previous%20and%20next%20episodes%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/27221/Springfield%21%20Springfield%21%20Previous%20and%20next%20episodes%20links.meta.js
// ==/UserScript==

(function(factory) {
    // These pages already have jQuery loaded
    factory(window.$ || $);
})(function ($) {
    'use strict';
    function getEpisodesForSeason(doc, s) {
        return $(doc).find('.main-content-left .season-episodes h3#season' + s).parent().find('a').each(function (idx, _a) {
            var a = $(_a);
            return a.attr('s', s).attr('e', parseInt(/[&?]episode=s(\d+)e(\d+)/g.exec(a.attr('href'))[2]));
        }).get();
    }

    function getEpisodeAfter(doc, s, e) {
        return getEpisodesForSeason(doc, s).find(function (a) {
            return $(a).attr('e') == e+1;
        }) || getEpisodesForSeason(doc, s + 1).find(function (a) {
            return $(a).attr('e') == 1;
        });
    }

    function getEpisodeBefore(doc, s, e) {
        return getEpisodesForSeason(doc, s).find(function (a) {
            return $(a).attr('e') == e-1;
        }) || getEpisodesForSeason(doc, s - 1)[getEpisodesForSeason(doc, s - 1).length - 1];
    }

    var data = /[&?]episode=s(\d+)e(\d+)/g.exec(window.location.href),
        season = parseInt(data[1]), episode = parseInt(data[2]);

    $.get(window.location.href.replace(/[&?]episode=s\d+e\d+/g, ''), function(response) {
        var doc = document.implementation.createHTMLDocument('');
        doc.documentElement.innerHTML = response;
        $('.main-content-left .episode_script')
            .append($('<div />', {style: 'font-size: 12px; padding-top: 5px;'})
                    .append($('<span />', {html: 'previous episode:&nbsp;'}).append(getEpisodeBefore(doc, season, episode)))
                    .append($('<span />', {html: 'next episode:&nbsp;', style: 'float: right;'}).append(getEpisodeAfter(doc, season, episode))));
    });
});