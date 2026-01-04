// ==UserScript==
// @name           EpisodeCalendar Streaming
// @namespace      http://tampermonkey.net/
// @version        1.1.0
// @description    Adds buttons to watch TV series on www.episodecalendar.com through VidSrc.to
// @author         Chiffie
// @match          https://episodecalendar.com/**
// @icon           https://www.google.com/s2/favicons?sz=64&domain=episodecalendar.com
// @license        GPL-3.0-only
// @grant          GM_xmlhttpRequest
// @connect        mdblist.com
// @downloadURL https://update.greasyfork.org/scripts/472432/EpisodeCalendar%20Streaming.user.js
// @updateURL https://update.greasyfork.org/scripts/472432/EpisodeCalendar%20Streaming.meta.js
// ==/UserScript==
window.__userScriptData = {
    page: null,
    linkTarget: '__userScript', // use this to open in same new window
    // linkTarget: '_blank', // use this to open each in new window
}


var pages = {
    show: /[A-Za-z]{2,3}\/show/,
    unwatched: /[A-Za-z]{2,3}\/unwatched/,
    calendar:  /[A-Za-z]{2,3}\/calendar/,
}

var getImdbId = function(html) {
    const imdbMatcher = /www.imdb.com\/title\/(tt\d+)/
    const result = html.match(imdbMatcher)

    const imdbId = result?.length && result[1]
    if (!imdbId) {
        throw new Error('[__userScript] did not find imdbId');
    }

    return imdbId;
};

var getTmdbId = function(imdbId) {
    var link = 'https://mdblist.com/show/' + imdbId;
    return new Promise(function(resolve) {
        GM_xmlhttpRequest({
            url: link,
            method: 'GET',
            onload: function (data){
                const tmdbLink = $('a[href*="www.themoviedb.org"]').attr('href');
                const tmdbMatcher = /www.themoviedb.org\/tv\/(\d+)/;
                const result = data.response.match(tmdbMatcher);

                const tmdbId = result?.length && result[1]
                if (!tmdbId) {
                    throw new Error('[__userScript] did not find tmdbId');
                }

                resolve(tmdbId);
            }
        })

    })
}

var actionOnPage = {
    show: function() {
        const imdbLink = $('a[href*="www.imdb.com"]').attr('href')
        var imdbId = getImdbId(imdbLink);
        getTmdbId(imdbId).then(tmdbId => expandEpicList(imdbId,tmdbId));
    },
    unwatched: function() {
        const $selected = $('.season h2 a')
        const detailUrl = $selected.attr("href")

        $.get(detailUrl, function(data) {
            var imdbId = getImdbId(data);
            getTmdbId(imdbId).then(tmdbId => expandEpicList(imdbId,tmdbId));
        })
    },
    calendar: function() {
        $('.episode-item').each(function(idx,episodeElement) {
            // todo
        })
    }
}

function expandEpicList(imdbId, tmdbId) {
    $(".epic-list-episode").each(function(index, element) {
        const $el = $(element)

        const seasonAndEpisodeStr = $el.find('.name .mid_grey').text().toUpperCase()
        const matcher = /S(\d{1,2})E(\d{1,2})/
        const result = seasonAndEpisodeStr.match(matcher)

        if (!result?.length || result.length < 3) {
            return;
        }

        const season = new Number(result[1])
        const episode = new Number(result[2])

        var episodeNumber = index + 1
        $el.prepend(
            '<div class="links" style="display:flex;flex-direction:column">' +

            '<a href="https://www.braflix.app/tv/'+tmdbId +'/'+season+'/'+episode+'?play=true" target="' + window.__userScriptData.linkTarget + '" class="awesome has-icon small grey external" data-ignore-user-script="true" style="margin-bottom:6px">'+
            '<strong>Braflix</strong>'+
            '</a>'+

            '<a href="https://vidsrc.to/embed/tv/'+imdbId+'/'+season+'/'+episode+'" target="' + window.__userScriptData.linkTarget + '" class="awesome has-icon small grey external" data-ignore-user-script="true" style="margin-bottom:6px">'+
            '<strong>VidSrc</strong>'+
            '</a>'+

            //    '<a href="https://database.gdriveplayer.us/player.php?type=series&imdb='+imdbId+'&season='+season+'&episode='+episode+'" target="' + window.__userScriptData.linkTarget + '" class="awesome has-icon small grey external" data-ignore-user-script="true" style="margin-bottom:6px">'+
            //    '<strong>GDrive</strong>'+
            //    '</a>'+

            // https://multiembed.mov/?video_id=tt13157618&s=1&e=2
            // '<a href="https://multiembed.mov/?video_id='+imdbId+'&s='+season+'&e='+episode+'" target="' + window.__userScriptData.linkTarget + '" class="awesome has-icon small grey external" data-ignore-user-script="true" style="margin-bottom:6px">'+
            // '<strong>Multi#1</strong>'+
            //  '</a>'+

            // https://multiembed.mov/directstream.php?video_id=tt13157618&s=1&e=2
            //'<a href="https://multiembed.mov/directstream.php?video_id='+imdbId+'&s='+season+'&e='+episode+'" target="' + window.__userScriptData.linkTarget + '" class="awesome has-icon small grey external" data-ignore-user-script="true" style="margin-bottom:6px">'+
            // '<strong>Multi#VIP</strong>'+
            //'</a>'+

            '</div>' +
            '<div class="separator"></div>'
        )
    });
}

function setPage() {
    var currentPage = window.location.pathname;

    var pageName = null;
    for (var key in pages) {
        if (pages[key].test(currentPage)) {
            pageName = key
            break;
        }
    }

    window.__userScriptData['page'] = pageName
    if (pageName) {
        actionOnPage[pageName]();
    }
}

function getParentLinkTag(target) {
    if (target.tagName === 'A') {
        return target
    } else if (target.tagname === 'BODY') {
        return null;
    }

    return getParentLinkTag(target.parentNode)
}

function startListener() {
    var $a = $('a')

    $a.one('click', function(e) {
        const link = getParentLinkTag(e.target)
        if ($(link).attr('data-ignore-user-script') == 'true') {
            console.log(link)
            return;
        }

        // force load
        e.preventDefault()
        window.location.href = link.href

        // won't be triggered
        console.warn('does not exist')
        $a.off('click')
        init()
    });
}

function init() {
    setTimeout(function() {
        setPage();
        startListener();

        //debug
        console.log('[__userScript]', window.__userScriptData);
    }, 500)
}

(function() {
    'use strict';
    console.log('[__userScript] started')
    init()
})();