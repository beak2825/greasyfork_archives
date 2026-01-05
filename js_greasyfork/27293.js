// ==UserScript==
// @name         The Pirate Bay Tweaks
// @description  Hides unwanted torrents and adds colored highlights
// @author       Fork by Lelobster, original script by nicobelic (greasyfork.org/scripts/21980)
// @namespace    https://github.com/LeLobster/userscripts/
// @icon         https://raw.githubusercontent.com/LeLobster/userscripts/master/The_Pirate_Bay_Tweaks/icon.png
// @locale       English
// @version      2.0
// @grant        none
// @include      https://thepiratebay.org/search/*
// @include      https://thepiratebay.org/browse/*
// @include      https://thepiratebay.org/user/*
// @include      https://thepiratebay.org/recent
// @include      https://thepiratebay.org/recent/*
// @include      https://thepiratebay.org/top/*
// @include      https://thepiratebay.org/tv/*
// @include      https://thepiratebay.org/music/genre/* 
// @downloadURL https://update.greasyfork.org/scripts/27293/The%20Pirate%20Bay%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/27293/The%20Pirate%20Bay%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('td .detDesc').css('color', detDescColor);

    if (highlightGoodTor) {
        $('#searchResult tbody tr').each(function( index ) {
            var torrentTitle = $(this).find('td .detLink').text().search(
                new RegExp('\\b' + GoodKeyword.join('\\b|\\b') + '\\b'));
            var userName = $(this).find('td .detDesc').text().search(
                new RegExp(GoodUploader.join('|')));
            if (torrentTitle != -1 || userName != -1) {
                $(this).css('background', GoodHighlightColor);
            }
        });
    }

    if (includeOther) {
        $('#searchResult tbody tr').each(function( index ) {
            var torrentTitle = $(this).find('td .detLink').text();
            if (hideAllOtherInsteadOfHighlight) {
                $(this).hide();
            } else
                if (affectOther) {
                    if (torrentTitle.search(
                        new RegExp('\\b' + OtherKeyword.join('\\b|\\b') + '\\b', 'i')) != -1) {
                        if (hideOtherInsteadOfHighlight) {
                            $(this).hide();
                        } else
                            $(this).css('background', otherColor);
                    }
                }
            if (affectx256) {
                if (torrentTitle.search(
                    new RegExp(/\bx265\b|\bHEVC\b|\bH265\b|\bH.265\b/ig)) != -1) {
                    if (hidex265InsteadOfHighlight) {
                        $(this).hide();
                    } else
                        $(this).css('background', x256Color);
                }
            }
            if (affectNonRetail) {
                var nonRetailTorrent = torrentTitle.search(
                    new RegExp('\\b' + NonRetailKeyword.join('\\b|\\b') + '\\b', 'i'));
                if (hideNonRetailInsteadOfHighlight) {
                    if (nonRetailTorrent != -1) {
                        $(this).hide();
                    }
                } else
                    if (nonRetailTorrent != -1) {
                        $(this).css('background', NonRetailColor);
                    }
            }
        });
    }

    if (includeUnwanted) {
        $('#searchResult tbody tr').each(function( index ) {
            var torrentTitle = $(this).find('td .detLink').text();
            if (affectUnwantedKeyword) {
                var unwantedTorrent = torrentTitle.search(
                    new RegExp('\\b' + UnwantedKeyword.join('\\b|\\b') + '\\b'));
                if (hideUnwantedKeywordInsteadOfHighlight) {
                    if (unwantedTorrent != -1) {
                        $(this).hide();
                    }
                } else
                    if (unwantedTorrent != -1) {
                        $(this).css('background', UnwantedHighlightColor);
                    }
            }
            var userName = $(this).find('td .detDesc').text();
            if (affectUnwantedUploader) {
                var unwantedUser = userName.search(
                    new RegExp(UnwantedUploader.join('|')));
                if (hideUnwantedUploaderInsteadOfHighlight) {
                    if (unwantedUser != -1) {
                        $(this).hide();
                    }
                } else
                    if (unwantedUser != -1) {
                        $(this).css('background', UnwantedUserHighlightColor);
                    }
            }
        });
    }

    if (affectPotentialFakes) {
        $('#searchResult tbody tr:not(:has(img[title="VIP"],img[title="Trusted"],img[title="Moderator"],\
        img[title="Helper"],td[style="text-align:center;"]))').each(function( index ) {
            var torrentSeeds = Number( $(this).children('td:nth-child(3)').text() );
            if (trustedTorrentsOnly) {
                $(this).hide();}
            else {
                if (includeUntrustedTorrentsWithoutComments) {
                    if ( (torrentSeeds >= maxSeedsWithoutTrust) || (
                        $(this).has("img[src='//thepiratebay.org/static/img/icon_comment.gif']").length === 0) )  {
                        if (dontHideJustHighlightPotentialFakes) {
                            $(this).children('td:nth-child(2)').css(TorrentWarning);
                        } else
                            $(this).hide();
                    }
                } else {
                    if (torrentSeeds >= maxSeedsWithoutTrust) {
                        if (dontHideJustHighlightPotentialFakes) {
                            $(this).children('td:nth-child(2)').css(TorrentWarning);
                        } else
                            $(this).hide();
                    }
                }
            }
        });
    }
})();