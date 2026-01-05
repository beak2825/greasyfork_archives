// ==UserScript==
// @name         Amboss Copier
// @namespace    http://oix.cc/gm
// @description  Copy article informations from Miamed Amboss.
// @author       Bin Zhang
// @icon         https://amboss.miamed.de/favicon-192x192.png
// @homepageURL  http://oix.cc/amboss
// @version      0.0.5
// @match        https://amboss.miamed.de/library
// @include      /^https?://amboss-miamed-de\.ezproxy\..*/library$/
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/23249/Amboss%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/23249/Amboss%20Copier.meta.js
// ==/UserScript==

(function () {
    var loadingWatcher;
    var currentContent;

    if (typeof angular !== 'undefined' || typeof angular.element('#LibraryContent').scope() !== 'undefined') {
        setWatcher();
        window.addEventListener("hashchange", setWatcher);
        document.addEventListener('keydown', function (e) {
            if ('card' === currentContent) {
                //if ((e.key == 'c' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) || (e.key == 'F9' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey)) {
                if ((e.key == 'c' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey)) {
                    // pressed ctrl+alt+c or //F9
                    GM_setClipboard(getCardHtml(), 'html');
                } else if (e.key == 'y' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+y
                    GM_setClipboard(getCardHtml(true), 'html');
                } else if (e.key == 'w' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+w
                    $('div.Tab.active .js-prev-day').click();
                } else if (e.key == 's' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+s
                    $('div.Tab.active .js-next-day').click();
                } else if (e.key == 'a' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+a
                    $('div.Tab.active .js-prev-lc').click();
                } else if (e.key == 'd' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+d
                    $('div.Tab.active .js-next-lc').click();
                }
            } else if ('list' === currentContent) {
                if (e.key == 'c' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+c
                    GM_setClipboard(getListHtml(), 'html');
                } else if (e.key == 't' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+t
                    GM_setClipboard(getListHtml(true), 'html');
                } else if (e.key == 'w' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+w
                    $('div.Tab.active .js-prev-day').click();
                } else if (e.key == 's' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+s
                    $('div.Tab.active .js-next-day').click();
                } else if (e.key == 'a' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+a
                    $('div.Tab.active .js-prev-lc').click();
                } else if (e.key == 'd' && !e.shiftKey && e.ctrlKey && e.altKey && !e.metaKey) {
                    // pressed ctrl+alt+d
                    $('div.Tab.active .js-next-lc').click();
                }
            }
        }, false);
    }

    function setWatcher() {
        currentContent = null;

        var i;
        if (!i) i = 50;
        if (null !== getParameterByName('xid', '?' + window.location.hash.substring(1))) {
            // only cards set $root.loading, poll loading
            loadingWatcher = setInterval(checkLoading, i);
        } else {
            i = 2000;
            loadingWatcher = setInterval(function () {
                clearInterval(loadingWatcher);
                loaded();
            }, i);
        }
        //console.log('i=' + i);
    }

    function checkLoading() {
        //console.log('watch');
        //console.log(angular.element('#LibraryContent').scope().$root.loading);

        if (angular.element('#LibraryContent').scope().$root.loading !== true) {
            //console.log(typeof angular.element('#LibraryContent').scope().$root.loading);
            clearInterval(loadingWatcher);
            loaded();
        }
    }

    function loaded() {
        //console.log('loaded');
        //console.log($('#LibraryContent').html());

        // TODO: Change title of kreuzen
        // https://amboss.miamed.de/study2/index#/aB123Cdef/45
        // $('<div/>').html($('[tooltip-classname="lg"]').attr('tooltip-content')).text().replace(/^(Sitzung: )/,'');
        // "Examens-Kreuzplan (H. 2016), Tag 12 (Frage 34 von 56)"

        if (null !== getParameterByName('xid', '?' + window.location.hash.substring(1)) && $('#LibraryContent').find('article.LearningCard:visible').length > 0) {
            //console.log('card');
            currentContent = 'card';
        }
        if ($('#LibraryContent').find('#LibraryList:visible').length > 0) {
            //console.log('list');
            currentContent = 'list';
            document.title = getListTitle(); // change browser window title if proper
        }
    }

    function getCardHtml(full) {
        var html = '';
        html += '<h1><a href="' + window.location + '">' + $.trim($('article.LearningCard h1:first').clone().children().remove().end().text()) +
            ($('article.LearningCard h1:first').attr('tooltip-content') ? (' (' + $('article.LearningCard h1:first').attr('tooltip-content').replace(/^(Synonyme:<br> )/, '') + ')') : '') +
            '</a></h1>';
        var tempDiv;
        if (full) {
            tempDiv = $('<div>').append($('article.LearningCard>section').clone().find('section, .unwichtig, .veraltet').remove().end().find('li:emptyorspace').remove().end()); // remove meta infos, veraltet and unwichtig
            //.find('ul:visible:empty, ol:visible:empty').remove().end()
            //.find('ul:empty, ol:empty').remove().end()
        } else {
            tempDiv = $('<div>').append($('article.LearningCard>section:first p').clone()); // only p extracted, first section without p probably not abstracts
        }
        tempDiv.find('a').each(function (i, anchor) {
            anchor.href = $(anchor).prop('href'); // all urls to abs
        })
        html += tempDiv.html();
        tempDiv.remove();
        tempDiv = null;
        return html;
    }

    function getListHtml(tableFormat) {
        var html = '';
        var listTitle = getListTitle();
        document.title = listTitle;

        if (!tableFormat) {
            html += '<h2><a href="' + window.location + '">' + listTitle + '</a></h2>';
            var tempDiv = $('<div>')
                .append($('table#LibraryList').clone().find('td:not(:nth-child(2), :nth-child(3), :nth-child(8), :nth-child(9))').remove().end().find('thead').remove().end())
                .append($('<div>').append($('table#LibraryList').next('div:has(a.buttonized)').find('a.buttonized').clone())); // Kreuzen
            //tempDiv.hide();
            //$('body').append(tempDiv);
            tempDiv.find('a').each(function (i, anchor) {
                anchor.href = $(anchor).prop('href'); // all urls to abs
            })
            html += tempDiv.html();
            tempDiv.remove();
            tempDiv = null;
        } else { // output table format for excel
            var tempDiv = $('<div>')
                .append($('table#LibraryList').clone()
                .find('thead, hr').remove().end()
                .find('.Rating .inactive, .Rating > .amboss-tooltip').remove().end()
                .find('.Recommendation .unset, .Recommendation > .amboss-tooltip').remove().end()
                .find('.Recommendation .set').append('●').end()
                .find('> tbody > tr').prepend($('<td><a href="' + window.location + '">' + listTitle + '</a></td>')).end()
                );
            //tempDiv.hide();
            //$('body').append(tempDiv);
            tempDiv.find('a').each(function (i, anchor) {
                anchor.href = $(anchor).prop('href'); // all urls to abs
            })
            html += tempDiv.html();
            tempDiv.remove();
            tempDiv = null;
        }
        return html;
    }

    function getListTitle() {
        var listTitle = $.trim($('#LibraryContent').find('#Title').text());
        var examDay = $.trim($('div.Tab.active li.result-selected').text());
        var checkStr = examDay ? $.trim(examDay.substring(0, 6)) : ''; // 'Tag 1 ' or 'Tag 99'
        if (examDay && checkStr.length > 2 && listTitle.substr(-checkStr.length) === checkStr) {
            listTitle = examDay;
        }
        return listTitle;
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    $.expr[':'].notext = function detectNoText(x) {
        return x.innerHTML && x.innerHTML.replace(/(<!--.*(?!-->))|\s+/g, '').length === 0
    }

    $.expr[':'].emptyorspace = function detectNoText(x) {
        return x.innerHTML.replace(/(<!--.*(?!-->))|\s+/g, '').length === 0
    }

}());