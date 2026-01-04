// ==UserScript==
// @name             Erno lukuhelpotin
// @namespace        Autot.fi
// @version          0.0.4
// @description      Autot.fi <3
// @author           Jeamama
// @match            https://www.ernobbs.net/index.php?forums/*
// @match            https://www.ernobbs.net/index.php?threads/*
// @grant            GM_openInTab
// @grant            GM_xmlhttpRequest
// @run-at           document-end
// @downloadURL https://update.greasyfork.org/scripts/410819/Erno%20lukuhelpotin.user.js
// @updateURL https://update.greasyfork.org/scripts/410819/Erno%20lukuhelpotin.meta.js
// ==/UserScript==

/* globals $ */
/* jshint esversion: 6 */
/* jshint scripturl: true */

(function () {

    'use strict';

    const uiStrings = {
    'en-US': {
        'watchThread': 'Watch',
        'unWatchThread': 'Unwatch',
        'ignoreThread': 'Ignore thread',
        'unIgnoreThread': 'Unignore thread'
    },
    'fi-FI': {
        'watchThread': 'Seuraa',
        'unWatchThread': 'Älä seuraa',
        'ignoreThread': 'Piilota',
        'unIgnoreThread': 'Näytä'
    }
    };
    var xfLang = $('html').attr('lang');
    if (typeof (uiStrings[xfLang]) == 'undefined') { xfLang = 'en-US'; }

    let key = {
        ReadAll: 'NumpadMultiply',
        ReadWatched: 'NumpadDivide',
        ToggleIgnore: 'NumpadMultiply',
        ToggleWatch: 'NumpadDivide'
    };

    var jea_debug = true;
    var maxThreadClickCount = 4;

    document.addEventListener('keydown', (kbEvent) => {
        if (kbEvent.target.tagName == "INPUT" || kbEvent.target.tagName == "TEXTAREA" || kbEvent.target.isContentEditable) {
            return;
        }

        if (kbEvent.ctrlKey && (kbEvent.code == key.ReadAll || kbEvent.code == key.ReadWatched || kbEvent.code == key.ToggleIgnore || kbEvent.code == key.ToggleWatch)) {

            switch ($('html').attr('data-template')) {

                case 'forum_view':

                    if (kbEvent.ctrlKey && (kbEvent.code == key.ReadAll || kbEvent.code == key.ReadWatched)) {

                        var threadClickCount = 0;
                        var threadelements = document.getElementsByClassName('structItem structItem--thread');
                        var i = threadelements.length - 1;
                        while (i >= 0 && threadClickCount < maxThreadClickCount) {

                            let currentElement = $(threadelements[i]);
                            if (!currentElement.hasClass('is-unread') || currentElement.hasClass('is-ignored') || currentElement.hasClass('is-hidden') || currentElement.hasClass('is-manuallyhidden')) {
                                i--;
                                continue;
                            }

                            var linkelement = currentElement.find('div.structItem-title a[href*="threads/"]')[0];
                            if (linkelement.href == null) {
                                i--;
                                continue;
                            }

                            if (kbEvent.code == key.ReadWatched) {
                                if (!$(linkelement).parents('.structItem-cell--main').has('i.structItem-status--watched').length) {
                                    i--;
                                    continue;
                                }
                            }

                            JeaErnoLH_debuglog("Open: " + linkelement.href);
                            GM_openInTab(linkelement.href, { insert: false });
                            currentElement.removeClass('is-unread');
                            threadClickCount++;
                            i--;
                        }
                    }
                    break;

                case "thread_view":

                    if (kbEvent.code == key.ToggleIgnore) {
                        var linkelementIgnore = $(document.body).find('div.buttonGroup a[href*="ignore&"]')[0];
                        if (typeof (linkelementIgnore) != 'undefined' && linkelementIgnore.style.display != "none") {
                            JeaErnoLH_debuglog("Thread: "+uiStrings[xfLang].ignoreThread+': '+window.location.href);
                            linkelementIgnore.click();
                            linkelementIgnore.style.display = "none";
                        } else {
                            var linkelementUnignore = $(document.body).find('div.buttonGroup a[href*="unignore&"]')[0];
                            if (typeof (linkelementUnignore) != 'undefined') {
                                JeaErnoLH_debuglog("Thread: "+uiStrings[xfLang].unIgnoreThread+': '+window.location.href);
                                linkelementUnignore.click();
                            } else {
                                JeaErnoLH_debuglog("Thread: "+uiStrings[xfLang].unIgnoreThread+': '+window.location.href);
                                JeaErnoLH_getElementFromUrl(function (dom) {
                                    var linkelementIgnore = $(dom).find('div.buttonGroup a[href*="ignore&"]')[0];
                                    var href = linkelementIgnore.href;
                                    GM_xmlhttpRequest({
                                        method: 'GET',
                                        url: href
                                    });
                                }, window.location.href);
                                if (typeof (linkelementIgnore) != 'undefined' && linkelementIgnore.style.display == "none") {
                                    linkelementIgnore.style.display = 'inline-block';
                                }
                            }
                        }
                    }

                    if (kbEvent.code == key.ToggleWatch) {

                        const targetNode = document.documentElement || document.body;
                        const config = { childList: true, subtree: true };
                        const callback = function (mutations, observer) {
                            for (let mutation of mutations) {
                                if (mutation.type !== 'childList' || typeof mutation.addedNodes != 'object') {
                                    continue;
                                }
                                for (let addednode of mutation.addedNodes) {
                                    if (addednode.nodeName != 'DIV') {
                                        continue;
                                    }
                                    if (addednode.className == 'overlay') {
                                        if ($('.overlay-content button:contains('+uiStrings[xfLang].unWatchThread+')').length > 0) {
                                            $('.overlay-content button:contains('+uiStrings[xfLang].unWatchThread+')').click();
                                        } else if ($('.overlay-content button:contains('+uiStrings[xfLang].watchThread+')').length > 0) {
                                            $('.overlay-content button:contains('+uiStrings[xfLang].watchThread+')').click();
                                        }
                                    }
                                }
                            }
                        };
                        const observer = new MutationObserver(callback);
                        observer.observe(targetNode, config);

                        if ($('a:contains('+uiStrings[xfLang].unWatchThread+')').length > 0) {
                            JeaErnoLH_debuglog("Thread: "+uiStrings[xfLang].unWatchThread);
                            $('a:contains('+uiStrings[xfLang].unWatchThread+')').click();
                        } else if ($('a:contains('+uiStrings[xfLang].watchThread+')').length > 0) {
                            JeaErnoLH_debuglog("Thread: "+uiStrings[xfLang].watchThread);
                            $('a:contains('+uiStrings[xfLang].watchThread+')').click();
                        }
                    }
                    break;
            }

        } else {
            return;
        }

    }, false);


    function JeaErnoLH_getElementFromUrl(callback, href) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: href,
            onload: function (response) {
                var parser = new DOMParser();
                callback(parser.parseFromString(response.responseText, 'text/html'));
            }
        });
    }

    function JeaErnoLH_debuglog(foo) {
        if (jea_debug === true) {
            console.log('__ JeaErnoLH: ' + foo);
        }
    }

})();
