// ==UserScript==
// @name         Auto mp3 downloader
// @description  Automatic download of multiple mp3s from https://www.emp3z.com. Just insert list of songs into textarea, push the button and wait till it finishes.
// @author       Bladito
// @version      0.6.6
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        *://www.emp3x.ws/*
// @match        *://www.emp3z.ws/*
// @match        *://www.emp3z.co/*
// @match        *://www.emp3z.com/*
// @match        *://www.emp3c.com/*
// @match        *://www.emp3s.co/*
// @match        *://www.emp3d.co/*
// @match        *://www.emp3c.co/*
// @match        *://www.emp3e.com/*
// @match        *://y-api.org/button/*
// @namespace    Bladito/auto-mp3-downloader
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21420/Auto%20mp3%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/21420/Auto%20mp3%20downloader.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // run this code in inner cross origin iframe
    if (isSubstringInURL('/button/')) {
        log('SCRIPT 2');
        rememberUrlForSong();
        return;
    }

    log('SCRIPT 1');

    window.addEventListener('message', receiveMessage, false);

    function receiveMessage(evt) {
        log('RECEIVED MESSAGE', evt);
        if (evt.data && evt.data.indexOf('Bladito_link:') === 0) {
            setFoundDataForCurrentSong($('.song-list ul:eq(0) li:eq(0) a b').text(), evt.data.replace('Bladito_link:', ''));
            findUrlForNextSong();
        }
    }

    // block annoying popups
    var openWindow = window.open;
    window.open = function() {
        console.log('[Bladito/auto-mp3-downloader] Blocked opening window');
        return;
    };
    detectAdditionInDOM($('body').get(0), function(mutation) {
        if (mutation.target.tagName === 'BODY' && mutation.addedNodes[0].tagName === 'A') {
            console.log('[Bladito/auto-mp3-downloader] Removing overlay');
            $(mutation.addedNodes[0]).remove();
        }
    });

    var storageName = 'Bladito_autoDownloader_toDL';
    var storageStateName = 'Bladito_autoDownloader_state';
    var storageNowFinding = 'Bladito_autoDownloader_nowFinding';
    var storageDebugName = 'Bladito_autoDownloader_isDebug';

    var artistAndSongOnSeparateLines = false;

    var STATE = {
        IDLE:'IDLE',
        FINDING_URLS:'FINDING_URLS',
        DOWNLOADING:'DOWNLOADING'
    };

    init();

    log('state=',getState(),window.location.pathname);

    if (getState() === STATE.IDLE || getState() === STATE.DOWNLOADING) {
        insertCustomHTMLElements();
    }
    if (getState() === STATE.IDLE) {
        printResults(true);
    }

    if (getState() === STATE.FINDING_URLS) {
        if (isResultsPage()) {
            log('song found');
            window.location.href = $('a[href^="/download"')[0].href;
        } else if (isDetailPage()) {
            log('remembering download url');
            $('#dl1').click(); // this will fetch another iframe
            //rememberUrlForSong();
        } else if (isNotFoundPage()) {
            log('song not found');
            setFoundDataForCurrentSong('N/A', undefined);
            findUrlForNextSong();
        } else if (isMainPage()) {
            addResetButton();
        }
    }

    if (getState() === STATE.DOWNLOADING) {
        downloadSongs();
        printResults();
        resetInitialState(true);
    }

    //------------------------------------------------------------------------------------------------------------------

    function init() {
        if (!getState()) {
            setState(STATE.IDLE);
        }

        if (getState() === STATE.FINDING_URLS && !getNextSongToFind()) {
            setState(STATE.DOWNLOADING);
        }
    }

    function findDownloadUrls() {
        var textAreaVal = $('#my-dl-list').val(),
            mp3List = prepareMp3List(textAreaVal);

        if (typeof mp3List === 'string') {
            showError(mp3List);
            return;
        }

        setMp3List(mp3List);
        setState(STATE.FINDING_URLS);

        log('to dl ', JSON.stringify(mp3List));

        findUrlForNextSong();
    }

    function findUrlForNextSong() {
        var nextSong = getNextSongToFind();

        if (nextSong) {
            log('gonna find ', nextSong.name);

            setNowFinding(nextSong.name);

            $('input[name="search"]', window.parent.document).val(nextSong.name);
            $('input[name="search"]', window.parent.document).parents('form').submit();

            //$('input[name="search"]').val(nextSong.name);
            //$('input[name="search"]').parents('form').submit();
        } else {
            location.href = 'https://www.emp3z.com/';
        }
    }

    function setFoundDataForCurrentSong(songName, songUrl) {
        var currentSong = getNowFinding(),
            list = getMp3List();

        for (var i=0; i<list.length; i+=1) {
            if (list[i].name === currentSong) {
                list[i].processed = true;
                list[i].url = songUrl;
                list[i].foundName = songName;
                log('SAVED URL ', songUrl, ' for song ', list[i].name);
                break;
            }
        }

        setMp3List(list);
    }

    function getNextSongToFind() {
        var list = getMp3List();

        for (var i=0; i<list.length; i+=1) {
            if (list[i].processed !== true) {
                return list[i];
            }
        }

        return undefined;
    }

    function prepareMp3List(mp3listString) {
        var i, list, result = [];

        if (!mp3listString || mp3listString.length === 0) {
            return 'EMPTY_INPUT';
        }

        list = mp3listString.split('\n');

        if (artistAndSongOnSeparateLines) {
            if (list.length % 2 !== 0) {
                return 'ODD_NUMBER';
            }
            for (i=1; i<list.length; i+=2) {
                result.push({
                    name: list[i-1] + ' ' + list[i]
                });
            }
        } else {
            for (i=0; i<list.length; i+=1) {
                result.push({
                    name: list[i]
                });
            }
        }

        return result;
    }

    function rememberUrlForSong() {
        /*
        var interval = setInterval(function() {
            log('finding link...');

            var link = $($('iframe')[0].contentWindow.document).find('#ytd')[0];
            if (link && link.href && link.href.length > 0) {
                window.clearInterval(interval);
                log('found link! ', link.href);
                setFoundDataForCurrentSong($('.song-list ul:eq(0) li:eq(0) a b').text(), link.href);
                findUrlForNextSong();
            }
        }, 1000);
        */
        var interval = setInterval(function() {
            log('finding link...');

            var link = $('#button a')[0];
            if (link && link.href === 'https://y-api.org/') {
                $('#progress').click();
            }
            if (link && link.href && link.href.length > 0 && link.href !== 'https://y-api.org/') {
                window.clearInterval(interval);
                log('found link! sending message', link.href);
                window.parent.parent.postMessage('Bladito_link:' + link.href, '*');
            }
        }, 1000);
    }

    function downloadSongs() {
        var list = getMp3List();

        for (var i=0; i<list.length; i+=1) {
            if (list[i].url) {
                openWindow(list[i].url, '_blank');
            }
        }
    }

    function resetInitialState(keepList) {
        setState(STATE.IDLE);
        setNowFinding(null);
        if (!keepList) {
            setMp3List([]);
        }
    }

    function insertCustomHTMLElements() {
        var customElements, searchForm = $('form[action^="/search"]');

        customElements =
            '<div class="input-group col-lg-8" style="padding-top: 15px;">' +
            '<textarea id="my-dl-list" class="form-control" style="height: 120px;" placeholder="Insert one or multiple songs separated by enter."/>' +
            '<span class="input-group-btn" style="vertical-align: top;">' +
            '<button id="my-btn" class="btn btn-primary" style="height: 100%; min-height: 120px; border: none; padding: 0 14px;">Auto Download</button>' +
            '</span>' +
            '</div>' +
            '<div class="input-group col-lg-8" style="text-align: left;">' +
            '<label><input type="checkbox" id="bladito-input-mode" style="margin: 0 2px 0 0; vertical-align: text-top;">Artist and song on separate lines</label>' +
            '</div>'
        ;

        searchForm.append(customElements);
        $('#my-btn').click(findDownloadUrls);
        $('#bladito-input-mode').click(function() {
            artistAndSongOnSeparateLines = $(this).is(':checked');
        });
    }

    function showError(errCode) {
        var searchForm = $('form[action^="/search"]');
        $('#bladito-error-message').remove();

        if (errCode === 'ODD_NUMBER') {
            searchForm.prepend('<div id="bladito-error-message" class="input-group col-lg-12" style="height: 50px; line-height: 50px; margin-top: 15px; margin-bottom: 15px; color: white; background-color: #d64747;">'+
                               'You inserted ODD number of lines. Unable to continue.</div>');
        } else if (errCode === 'EMPTY_INPUT') {
            searchForm.prepend('<div id="bladito-error-message" class="input-group col-lg-12" style="height: 50px; line-height: 50px; margin-top: 15px; margin-bottom: 15px; color: white; background-color: #d64747;">'+
                               'No songs inserted into textarea!</div>');
        }
    }

    function printResults(isOldResult) {
        var resultsHtml,
            resultsMessageHtml,
            list = getMp3List(),
            failedCounter = 0,
            searchForm = $('form[action^="/search"]'),
            resultColor = isOldResult ? '#008cba;' : '#71bf44;';

        resultsHtml = '<div class="input-group col-lg-12" style="padding: 15px; border: 1px solid '+resultColor+'"><table style="width: 100%;"><tbody><tr><th>Searched Song</th><th>Found Song</th><th></th><tr>';

        for (var i=0; i<list.length; i+=1) {
            resultsHtml += '<tr><td>' + list[i].name + '</td><td>' + list[i].foundName + '</td><td>';
            if (list[i].url) {
                resultsHtml += '<a href="' + list[i].url + '">Redownload</a>';
            } else {
                resultsHtml += 'Not found';
                failedCounter += 1;
            }
            resultsHtml += '</td></tr>';
        }
        setMp3List(list);

        resultsHtml += '</tbody></table></div>';
        resultsHtml = $(resultsHtml);

        if (isOldResult) {
            resultsMessageHtml = '<div class="input-group col-lg-12" style="height: 50px; line-height: 50px; margin-top: 15px; color: white; background-color: '+resultColor+'">Last time you searched for:';
        } else {
            resultsMessageHtml = '<div class="input-group col-lg-12" style="height: 50px; line-height: 50px; margin-top: 15px; color: white; background-color: '+resultColor+'">Found: ' + (list.length - failedCounter) + '/' + list.length + ' songs.';
        }

        searchForm.append(resultsHtml);
        resultsHtml.before(resultsMessageHtml);
    }

    function addResetButton() {
        var customElements, searchForm = $('form[action^="/search"]');

        customElements =
            '<div class="input-group col-lg-12" style="height: 50px; margin-top: 15px; color: white; background-color: #d9534f;">Oops, something went wrong :(.' +
            '<button id="my-reset-btn" type="button" class="btn btn-primary" style="margin-left: 15px;">Reset to initial state</button>' +
            '</div>'
        ;

        searchForm.append(customElements);
        $('#my-reset-btn').click(function() {
            resetInitialState();
            location.href = 'https://www.emp3z.com/';
        });
    }

    function isResultsPage() {
        return isSubstringInURL('/mp3/');
    }

    function isDetailPage() {
        return isSubstringInURL('/download/');
    }

    function isNotFoundPage() {
        return isSubstringInURL('/404.php');
    }

    function isMainPage() {
        return window.location.pathname === '/';
    }


    function isSubstringInURL(substring) {
        return window.location.pathname.substring(0, substring.length) === substring;
    }

    function log() {
        if (localStorage.getItem(storageDebugName) === 'true') {
            console.log.apply(console, arguments);
        }
    }

    function setState(state) {
        localStorage.setItem(storageStateName, state);
    }

    function getState() {
        return localStorage.getItem(storageStateName);
    }

    function setNowFinding(songName) {
        localStorage.setItem(storageNowFinding, songName);
    }

    function getNowFinding() {
        return localStorage.getItem(storageNowFinding);
    }

    function setMp3List(mp3list) {
        localStorage.setItem(storageName, JSON.stringify(mp3list));
    }

    function getMp3List() {
        return JSON.parse(localStorage.getItem(storageName));
    }

    function detectAdditionInDOM(node, callback) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (node) {
            if (MutationObserver) {
                var obs = new MutationObserver(function(mutations, observer) {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length) {
                            callback(mutation);
                        }
                    });
                });
                obs.observe(node, { childList:true, subtree:true });
            } else if (window.addEventListener) {
                node.addEventListener('DOMNodeInserted', callback, false);
            }
        }
    }

})(jQuery);
