// ==UserScript==
// @name                tpb-top-imdb
// @namespace           uncleinf
// @version             1.1
// @description         Loads imdb rating info for top100 search results
// @author              UncleInf
// @license             MIT
// @supportURL          https://github.com/UncleInf/tpb-top-imdb
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=HYV6Z2N9BA5V8
// @contributionAmount  5
// @require             https://code.jquery.com/jquery-3.4.1.min.js
// @include             https://thepiratebay.*/torrent/*
// @include             https://thepiratebay.*/top/207
// @include             https://thepiratebay.*/top/201
// @include             https://thepiratebay.*/top/202
// @include             https://thepiratebay.*/top/205
// @include             https://thepiratebay.*/top/208
// @include             https://thepiratebay.*/top/209
// @grant               GM_xmlhttpRequest
// @connect             theimdbapi.org
// @downloadURL https://update.greasyfork.org/scripts/33901/tpb-top-imdb.user.js
// @updateURL https://update.greasyfork.org/scripts/33901/tpb-top-imdb.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* global $ */

    $(() => {
        const $rows = getRows()

        $rows.each((_, r) => {
            const $row = $(r)
            const $td = constructCell($row);

            $row.prepend($td)
        })

        const hasTpbLink = d => d.tpbLink

        const globalData = $rows.get()
            .map(constructData)
            .filter(hasTpbLink)
            .map(fillImdbData)

        $('th').parent().prepend(_ => constructHeader(globalData))

        globalData.forEach(displayRating)
    });

    function getRows() {
        return $('tbody tr')
    }

    function constructHeader(data) {
        const header = $('<th>').attr('title', '6.5 - 7.2 - 8 | click to refresh')

        const refreshRatings = (e, d) => {
            e.preventDefault()

            localStorage.clear()

            d.forEach(item => {
                item.$rating.text('--')
                item.$element.css({ 'background-color': '' })
            })

            d.map(fillImdbData).forEach(displayRating)
        }

        const a = $('<a>').attr('href', '#').text('Rating').click(e => refreshRatings(e, data))

        return header.append(a)
    }

    function constructCell() {
        const $td = $('<td>').addClass('vertTh tpb-top-imdb')
        const $rating = $('<a>').attr('title', 'Initializing data').text('--')
        const $center = $('<center>').append($rating)

        return $td.append($center)
    }

    function constructData(r) {
        const $row = $(r)
        const $td = $row.find('.tpb-top-imdb')
        const $rating = $td.find('a')

        const link = $row.find('a.detLink').attr('href')

        const parseLinkId = l => {
            const split = l.split('/')

            return split && split.length >= 3 ? split[2] : null
        }

        return {
            tpbId: parseLinkId(link),
            tpbLink: link,
            $element: $td,
            $rating: $rating
        }
    }

    function fillImdbData(data) {
        const localData = getlocalImdbData(data.tpbId)

        const fetchSaveData = d => fetchImdbData(d.tpbLink).then(r => {
            if (r) saveLocalImdbData(d.tpbId, r)

            return r
        })

        return {
            ...data,
            imdb: localData ? $.when(localData) : fetchSaveData(data)
        }
    }

    function getlocalImdbData(tpbId) {
        return JSON.parse(localStorage.getItem(tpbId))
    }

    function saveLocalImdbData(tpbId, imdbData) {
        console.log('persisiting data')
        localStorage.setItem(tpbId, JSON.stringify(imdbData))
    }

    function fetchImdbData(tpbLink) {
        const extractImdbId = r => {
            const regexp = 'www.imdb.com/title/(.*)/"'
            const regexFind = r.match(regexp)

            return regexFind && regexFind.length === 2 ? regexFind[1] : null
        }

        const fetchImdbApi = id => {
            if (!id) return null

            const apiUrl = `https://www.omdbapi.com/?apikey=fe430872&i=${id}`

            return $.getJSON(apiUrl).then(r => ({
                rating: r.imdbRating,
                count: r.imdbVotes,
                link: `https://www.imdb.com/title/${id}`
            }))
        }

        return $.get(tpbLink)
            .then(extractImdbId)
            .then(fetchImdbApi)
    }

    function displayRating(data) {
        const getRatingStyles = rating => {
            let colour = ''

            if (rating >= 8) {
                colour = 'palegreen'
            } else if (rating >= 7.2) {
                colour = 'powderblue'
            } else if (rating >= 6.5) {
                colour = 'lightcyan'
            }

            return {
                'background-color': colour
            };
        }

        data.imdb.then(imdbData => {
            if (!imdbData) {
                data.$rating.attr('title', 'No data')
                return
            }

            data.$rating
                .text(imdbData.rating)
                .attr('href', imdbData.link)
                .attr('title', imdbData.count)

            data.$element.css(getRatingStyles(imdbData.rating))
        })
    }

    // function iDontKnow() {
    //     return '¯\\_(ツ)_/¯';
    // }
})();
