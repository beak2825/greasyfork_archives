// ==UserScript==
// @name         PTP - Add Time Column and Highlight Recent Torrents
// @namespace    PTP-Add-Time-Column-and-Highlight-Recent-Torrents
// @version      0.4.8
// @description  Add a Time column to the Torrent Group Page, Collage Page,
//               Artist Page, and Bookmark Page.
//               Highlight recent and latest torrent within a group.
// @author       mcnellis
// @match        https://passthepopcorn.me/torrents.php*
// @match        https://passthepopcorn.me/collages.php?*
// @match        https://passthepopcorn.me/artist.php?*
// @match        https://passthepopcorn.me/bookmarks.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.27.0/moment.js
// @downloadURL https://update.greasyfork.org/scripts/497429/PTP%20-%20Add%20Time%20Column%20and%20Highlight%20Recent%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/497429/PTP%20-%20Add%20Time%20Column%20and%20Highlight%20Recent%20Torrents.meta.js
// ==/UserScript==
/* globals $, moment, coverViewJsonData, ungroupedCoverViewJsonData */

(function() {
    'use strict';

    const TIME_FORMAT = 'rounded-relative'; // 'relative', 'rounded-relative', or any format value supported by moment.js
    const HIGHLIGHT_LATEST_TEXT_COLOR = 'black';
    const HIGHLIGHT_LATEST_BACKGROUND_COLOR = 'silver';
    const HIGHLIGHT_LATEST_FONT_WEIGHT = 'bold';
    const HIGHLIGHT_RECENT_TEXT_COLOR = 'black';
    const HIGHLIGHT_RECENT_BACKGROUND_COLOR = 'gainsboro';
    const HIGHLIGHT_RECENT_FONT_WEIGHT = 'bold';
    const RECENT_DAYS_IN_MILLIS = 7*24*60*60*1000;

    const LOAD_DELAY = 1500

    function main() {
        if (isIgnoredTorrentsPage()) {
            return;
        } else if (isTorrentsGroupPage()) {
            torrentsGroupPage();
        } else if (isTorrentsPage()) {
            torrentsPage();
        } else if (isCollageSubscriptionsPage()) {
            collageSubscriptionsPage();
        } else if (isCollagesPage() || isArtistPage() || isBookmarksPage()) {
            artistAndBookmarksAndCollagesPage();
        }
    };

    function torrentsGroupPage() {
        $('.torrent_table thead tr th:nth(0)').after($('<th>Time</th>'));
        $('.group_torrent td.basic-movie-list__torrent-edition').each((i, edition) => {
            $(edition).attr('colspan', $(edition).attr('colspan')+1);
        });
        $('.torrent_info_row td').each((i, info) => {
            $(info).attr('colspan', $(info).attr('colspan')+1);
        });

        let times = [];
        $('.group_torrent_header').each(function(i, element) {
            const torrentRow = $(element);
            const time = torrentRow.next().find('span.time').first().clone();
            times.push(time.attr('title'));
            $(time).addClass('nobr');
            const timeCell = $('<td></td>').append(time);
            const unixTimestamp = new Date(time.attr('title') + ' UTC').getTime()/1000;
            if (TIME_FORMAT === 'rounded-relative') {
              console.log("NANA", time.html())
              if (time.html() !== undefined){
                const relativeTimeWordSplit = time.html().split(' ');
                if (time.html() != 'Just now') {
                  time.html(relativeTimeWordSplit[0] + ' ' + relativeTimeWordSplit[1].replace(',', '') + ' ago')
                }
              } else {
                time.html('Undefined')
              }
            } else if (TIME_FORMAT != 'relative') {
                time.html(moment.unix(unixTimestamp).format(TIME_FORMAT));
            }
            torrentRow.find('td:nth(0)').after(timeCell);
        });
        times.sort(descendingDate);

        const nowMillis = new Date().getTime();
        for (let i in times) {
            const time = times[i];
            if (nowMillis - new Date(time + ' UTC').getTime() < RECENT_DAYS_IN_MILLIS) {
                highlightRecentTime(time, '.group_torrent_header');
            }
        }

        if (times.length > 1) {
            highlightLatestTime(times[0], '.group_torrent_header');
        }
    }

    function torrentsPage() {
        $('.torrent_table tbody').each(function(i, group) {
            let times = collectTimes(group);
            times.sort(descendingDate);

            const nowMillis = new Date().getTime();
            for (let i in times) {
                const time = times[i];
                if (nowMillis - new Date(time + ' UTC').getTime() < RECENT_DAYS_IN_MILLIS) {
                    highlightRecentTime(time, '.basic-movie-list__torrent-row', group);
                }
            }

            highlightLatestTime(times[0], '.basic-movie-list__torrent-row', group);
        });
    }

    function artistAndBookmarksAndCollagesPage() {
        $('.torrent_table:visible thead tr th:nth(1)').after($('<th>Time</th>'));
        $('.torrent_table:visible td.basic-movie-list__torrent-edition').each((i, edition) => {
            $(edition).attr('colspan', $(edition).attr('colspan')+1);
        });
        $('.basic-movie-list__details-row').each((i, detailsRow) => {
            const detailsCell = $(detailsRow).find('td:nth(1)');
            detailsCell.attr('colspan', detailsCell.attr('colspan')+1);
        });

        const torrentGroupTimes = {};
        const torrentIdToTime = {};
        const torrentGroups = new Set();
        $(coverViewJsonData).each((i, data) => {
            $(data.Movies).each((j, movieGroup) => {
                const groupId = movieGroup.GroupId;
                torrentGroups.add(groupId);
                $(movieGroup.GroupingQualities).each((k, edition) => {
                    $(edition.Torrents).each((m, torrent) => {
                        if (!torrentGroupTimes[groupId]) {
                            torrentGroupTimes[groupId] = [];
                        }
                        torrentGroupTimes[groupId].push($(torrent.Time).attr('title'));
                        torrentIdToTime[torrent.TorrentId] = torrent.Time;
                    });
                });
            });
        });

        $('.basic-movie-list__torrent-row .basic-movie-list__torrent__action').each((i, element) => {
            const parent = $(element).parent();
            const href = parent.find('a.torrent-info-link').attr('href');
            const hrefParts = href.match(/torrents.php\?id=([0-9]+)&torrentid=([0-9]+)/);
            const groupId = hrefParts[1];
            const torrentId = hrefParts[2];
            parent.after($('<td class="nobr">'+torrentIdToTime[torrentId]+'</td>'));
        });

        torrentGroups.forEach(groupId => {
            torrentGroupTimes[groupId] = torrentGroupTimes[groupId].sort(descendingDate);
        });

        const nowMillis = new Date().getTime();
        for (const i in torrentGroupTimes) {
            const times = torrentGroupTimes[i];
            for (const j in times) {
                const time = times[j];
                if (nowMillis - new Date(time + ' UTC').getTime() < RECENT_DAYS_IN_MILLIS) {
                    highlightRecentTime(time, '.basic-movie-list__torrent-row');
                }
            }

            if (times.length > 1) {
                highlightLatestTime(times[0], '.basic-movie-list__torrent-row');
            }
        }
    }

    function collageSubscriptionsPage() {
        const torrentGroupTimes = {};
        const torrentIdToTime = {};
        const torrentGroups = new Set();
        $(coverViewJsonData).each((j, jsonData) => {
            $(jsonData.Movies).each((i, movieGroup) => {
                const groupId = movieGroup.GroupId;
                torrentGroups.add(groupId);
                $(movieGroup.GroupingQualities).each((j, edition) => {
                    $(edition.Torrents).each((k, torrent) => {
                        if (!torrentGroupTimes[groupId]) {
                            torrentGroupTimes[groupId] = [];
                        }
                        torrentGroupTimes[groupId].push($(torrent.Time).attr('title'));
                        torrentIdToTime[torrent.TorrentId] = torrent.Time;
                    });
                });
            });
        });

        torrentGroups.forEach(groupId => {
            torrentGroupTimes[groupId] = torrentGroupTimes[groupId].sort(descendingDate);
        });

        const nowMillis = new Date().getTime();
        for (const i in torrentGroupTimes) {
            const times = torrentGroupTimes[i];
            for (const j in times) {
                const time = times[j];
                if (nowMillis - new Date(time + ' UTC').getTime() < RECENT_DAYS_IN_MILLIS) {
                    highlightRecentTime(time, '.basic-movie-list__torrent-row');
                }
            }

            if (times.length > 1) {
                highlightLatestTime(times[0], '.basic-movie-list__torrent-row');
            }
        }
    }

    function isArtistPage() {
        return window.location.pathname === '/artist.php';
    }

    function isBookmarksPage() {
        return window.location.pathname === '/bookmarks.php';
    }

    function isCollageSubscriptionsPage() {
        return (
            window.location.pathname === '/collages.php' &&
            window.location.search.includes('action=subscriptions')
        );
    }

    function isCollagesPage() {
        return window.location.pathname === '/collages.php';
    }

    function isTorrentsPage() {
        return window.location.pathname === '/torrents.php'
    }

    function isTorrentsGroupPage() {
        return isTorrentsPage() && window.location.search.includes('id=');
    }

    function isIgnoredTorrentsPage() {
        return (
            isTorrentsPage() &&
            (
                window.location.search.includes('type=downloaded') ||
                window.location.search.includes('type=uploaded') ||
                window.location.search.includes('type=leeching') ||
                window.location.search.includes('type=snatched') ||
                window.location.search.includes('type=seeding')
            )
        );
    }

    function collectTimes(group) {
        let times = [];
        $(group).find('.basic-movie-list__torrent-row').each(function(i, torrentRow) {
            const spanTime = $(torrentRow).find('td span.time');
            if (spanTime && spanTime.length > 0) times.push(spanTime.attr('title'));
        });
        return times;
    }

    function descendingDate(a, b) {
        const aDate = new Date(a);
        const bDate = new Date(b);
        if (aDate === bDate ) return 0;
        return aDate > bDate ? -1 : 1;
    }

    function highlightLatestTime(time, rowClassName, group) {
        return highlightTime(time, rowClassName, group, HIGHLIGHT_LATEST_TEXT_COLOR, HIGHLIGHT_LATEST_BACKGROUND_COLOR, HIGHLIGHT_LATEST_FONT_WEIGHT);
    }

    function highlightRecentTime(time, rowClassName, group) {
        return highlightTime(time, rowClassName, group, HIGHLIGHT_RECENT_TEXT_COLOR, HIGHLIGHT_RECENT_BACKGROUND_COLOR, HIGHLIGHT_RECENT_FONT_WEIGHT);
    }

    function highlightTime(time, rowClassName, group, textColor, backgroundColor, fontWeight) {
        if (group) {
            $(group).find(rowClassName + " span.time[title|='"+time+"']").each(function(i, span) {
                highlightSpan(span, textColor, backgroundColor, fontWeight);
            });
        } else {
            $(rowClassName + " span.time[title|='"+time+"']").each(function(i, span) {
                highlightSpan(span, textColor, backgroundColor, fontWeight);
            });
        }
    }

    function highlightSpan(span, textColor, backgroundColor, fontWeight) {
        if (textColor) $(span).css('color', textColor);
        if (backgroundColor) $(span).parent().css('background-color', backgroundColor);
        if (fontWeight) $(span).css('font-weight', fontWeight);
    }

    setTimeout(function (){
        main();
    }, LOAD_DELAY)
})();

