// ==UserScript==
// @name         SteamGifts discussions enhanced
// @description  Automatically mark read discussions, show count of new comments since last read, show if post title changed, manually mark one post or all posts of user, sort discussions
// @author       Bladito
// @version      0.13.0
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        https://www.steamgifts.com/*
// @namespace    Bladito/sg-discussions
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21422/SteamGifts%20discussions%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/21422/SteamGifts%20discussions%20enhanced.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var storageName = 'Bladito_sg_discussions-read',     // discussions that user already read - saved automatically
        sortingStorageName = 'Bladito_sg_sorting',
        stalkedStorageName = 'Bladito_sg_discussions-stalked-users', // stlaked users (all their discussions will be highlighted) - saved manually
        markedDiscussionsStorageName = 'Bladito_sg_discussions-marked'; // marked discussions (highligted speciffic discussions) - saved manually

    addStyles();

    var discussionMatch = matchDiscussion(location.href);
    var discussionsMatch = location.href.match(/.*\/discussions\/?/);
    var searchMatch = location.href.match(/https:\/\/www\.steamgifts\.com\/?(\/giveaways(\/search.*)?)?$/);
    var userMatch = location.href.match(/.*\/user\/([^/]+)\/?/);

    if (discussionMatch !== null) {
        rememberReadDiscussion(discussionMatch);
        addMarkingButtons(discussionMatch[1]);
    } else if (discussionsMatch !== null) {
        makeHeadersSortable();
        markReadDiscussions();
        addManagementButtons();
        addLastPostButton();
        detectAdditionInDOM($('.page__inner-wrap .widget-container').children()[1], function(mutations) {
            if (mutations[0].addedNodes[1] && mutations[0].addedNodes[1].className === 'table') {
                var $newTable = $(mutations[0].addedNodes[1]);
                markReadDiscussions($newTable);
                addLastPostButton($newTable);
            }
        });
    } else if (searchMatch !== null) {
        markReadDiscussions();
    } else if (userMatch !== null) {
        addStalkUnstalkButton($('.sidebar .sidebar__shortcut-inner-wrap'), userMatch[1], 'bsg-user-action-btn');
    }

    //-------------------------------------------------------------------------------------------------------------------------------------------------

    function matchDiscussion(url) {
        return url.match(/.*\/discussion\/([a-zA-Z0-9]{5})\/([^#\/]+)/);
    }

    function rememberReadDiscussion(discussionMatch, commentsCount) {
        var discussion = {
            name: discussionMatch[2],
            comments: commentsCount !== undefined ? commentsCount : getCommentsCount(),
            time: new Date().getTime()
        };
        addReadDiscussion(discussionMatch[1], discussion);
    }

    function getCommentsCount() {
        return parseNumberFromElement($('.page__heading__breadcrumbs:eq(1)').children());
    }

    function parseNumberFromElement(element) {
        return parseInt(element.text().replace(/[^0-9]/g, ''));
    }

    function markReadDiscussions($table) {
        var $source = $table || $('body'),
            linkDiscussionMatch, $this, $outerWrap, $buttonsWrap, originalPoster,
            readDiscussion, readDiscussions = getReadDiscussions(), stalkedUsers = getStalkedUsers(), markedDiscussions = getMarkedDiscussions();

        $source.find('a.table__column__heading').each(function() {
            $this = $(this);
            $outerWrap = $this.closest('.table__row-outer-wrap');
            $buttonsWrap = $('<div class="action-btns-wrap"></div>');
            $outerWrap.prepend($buttonsWrap);

            linkDiscussionMatch = matchDiscussion(this.href);
            readDiscussion = readDiscussions[linkDiscussionMatch[1]];

            if (readDiscussion) { //we have read this discussion already
                var $commentsCountElement, commentsCount, newCommentsCount;

                $outerWrap.addClass('bsg-discussion-read');
                if (readDiscussion.name !== linkDiscussionMatch[2]) { //OP changed discussion name
                    $this.addClass('bsg-discussion-title-changed');
                    $this.attr('title', 'Changed from: "' + readDiscussion.name + '"');
                }
                $commentsCountElement = $outerWrap.find('.table__column--width-small .table__column__secondary-link');
                commentsCount = parseNumberFromElement($commentsCountElement);
                if (readDiscussion.comments !== commentsCount) {
                    newCommentsCount = commentsCount - readDiscussion.comments;
                    $commentsCountElement.after('<span class="'+getClassesForNewComments(newCommentsCount)+'">(+'+newCommentsCount+')</span>');
                }

                addUnreadButton($buttonsWrap, $outerWrap, $this, linkDiscussionMatch);
            } else {
                addReadButton($buttonsWrap, $outerWrap, $this, linkDiscussionMatch);
            }

            originalPoster = $outerWrap.find('.table__column--width-fill .table__column__secondary-link:eq(1)').text();
            if (stalkedUsers.indexOf(originalPoster) > -1) {
                markPostOfStalkedUser($outerWrap);
                //addUnstalkButton($buttonsWrap, $outerWrap, originalPoster);
            } else {
                //addStalkButton($buttonsWrap, $outerWrap, originalPoster);
            }

            if (markedDiscussions.indexOf(linkDiscussionMatch[1]) > -1) {
                markDiscussion($outerWrap);
                addUnmarkButton($buttonsWrap, $outerWrap, linkDiscussionMatch[1], 'bsg-action-btn');
            } else {
                addMarkButton($buttonsWrap, $outerWrap, linkDiscussionMatch[1], 'bsg-action-btn');
            }
        });
    }

    function addStalkButton($buttonsWrap, originalPoster, btnClass) {
        var stalkButton = $('<button class="'+btnClass+'" '+getStalkTitle(btnClass)+'><i class="fa fa-eye"></i></button></div>');
        $buttonsWrap.append(stalkButton);
        stalkButton.on('click', function() {
            addOrRemoveStalkedUser(originalPoster);
            stalkButton.remove();
            addUnstalkButton($buttonsWrap, originalPoster, btnClass);
        });
        if (btnClass === 'bsg-user-action-btn') {
            stalkButton.hover(function() {
                $buttonsWrap.parent().find('.js-tooltip').text('Stalk user\'s discussions');
                changeButtonsOpacity($buttonsWrap, stalkButton, 0.2);
            }, function() {
                changeButtonsOpacity($buttonsWrap, stalkButton, 1);
            });
        }
    }
    function addUnstalkButton($buttonsWrap, originalPoster, btnClass) {
        var unstalkButton = $('<button class="'+btnClass+' m-active" '+getUnstalkTitle(btnClass)+'><i class="fa fa-eye-slash"></i></button></div>');
        $buttonsWrap.append(unstalkButton);
        unstalkButton.on('click', function() {
            addOrRemoveStalkedUser(originalPoster);
            unstalkButton.remove();
            addStalkButton($buttonsWrap, originalPoster, btnClass);
        });
        if (btnClass === 'bsg-user-action-btn') {
            unstalkButton.hover(function() {
                $buttonsWrap.parent().find('.js-tooltip').text('Stop stalking user\'s discussions');
                changeButtonsOpacity($buttonsWrap, unstalkButton, 0.2);
            }, function() {
                changeButtonsOpacity($buttonsWrap, unstalkButton, 1);
            });
        }
    }
    function changeButtonsOpacity($buttonsWrap, button, opacity) {
        $buttonsWrap.children().each(function() {
            if (!$(this).is(button)) {
                $(this).css('opacity', opacity);
            }
        });
    }
    function getStalkTitle(btnClass) {
        return btnClass !== 'bsg-user-action-btn' ? 'title="stalk = every post of this user will be highlighted"' : '';
    }
    function getUnstalkTitle(btnClass) {
        return btnClass !== 'bsg-user-action-btn' ? 'title="unstalk = every post of this user will not be highlighted anymore"' : '';
    }

    function addMarkButton($buttonsWrap, $outerWrap, discussionId, btnClass) {
        var markButton = $('<button class="'+btnClass+'" title="mark = highlight this post"><i class="fa fa-paint-brush"></i></button>');
        $buttonsWrap.prepend(markButton);
        markButton.on('click', function() {
            addMarkedDiscussion(discussionId,$outerWrap);
            markButton.remove();
            addUnmarkButton($buttonsWrap, $outerWrap, discussionId, btnClass);
        });
    }
    function addUnmarkButton($buttonsWrap, $outerWrap, discussionId, btnClass) {
        var unmarkButton = $('<button class="'+btnClass+' m-active" title="unmark = remove highlight of this post"><i class="fa fa-eraser"></i></button>');
        $buttonsWrap.prepend(unmarkButton);
        unmarkButton.on('click', function() {
            addMarkedDiscussion(discussionId,$outerWrap);
            unmarkButton.remove();
            addMarkButton($buttonsWrap, $outerWrap, discussionId, btnClass);
        });
    }

    function addReadButton($buttonsWrap, $outerWrap, $titleElement, linkDiscussionMatch) {
        var readButton = $('<button class="bsg-action-btn" title="read = mark this post as read"><i class="fa fa-check"></i></button>');
        $buttonsWrap.append(readButton);
        readButton.on('click', function() {
            rememberReadDiscussion(linkDiscussionMatch, parseNumberFromElement($outerWrap.find('.table__column--width-small .table__column__secondary-link')));
            markDiscussionAsRead($outerWrap);
            readButton.remove();
            addUnreadButton($buttonsWrap, $outerWrap, $titleElement, linkDiscussionMatch);
        });
    }
    function addUnreadButton($buttonsWrap, $outerWrap, $titleElement, linkDiscussionMatch) {
        var unreadButton = $('<button class="bsg-action-btn m-active" title="unread = resets this post as if it was never read before"><i class="fa fa-times"></i></button>');
        $buttonsWrap.append(unreadButton);
        unreadButton.on('click', function() {
            removeReadDiscussion(linkDiscussionMatch[1]);
            unmarkDiscussionAsRead($outerWrap, $titleElement);
            unreadButton.remove();
            addReadButton($buttonsWrap, $outerWrap, $titleElement, linkDiscussionMatch);
        });
    }

    function markDiscussionAsRead($outerWrap) {
        $outerWrap.addClass('bsg-discussion-read');
    }
    function unmarkDiscussionAsRead($outerWrap, $titleElement) {
        $outerWrap.removeClass('bsg-discussion-read');
        $outerWrap.find('.table__column--width-small .bsg-new-comments').remove();
        $titleElement.removeClass('bsg-discussion-title-changed');
        $titleElement.removeAttr('title');
    }

    function markPostOfStalkedUser($outerWrap) {
        $outerWrap.addClass('bsg-stalked-discussion');
    }
    function unmarkPostOfStalkedUser($outerWrap) {
        $outerWrap.removeClass('bsg-stalked-discussion');
    }

    function markDiscussion($outerWrap) {
        $outerWrap.addClass('bsg-marked-discussion');
    }
    function unmarkDiscussion($outerWrap) {
        $outerWrap.removeClass('bsg-marked-discussion');
    }

    function addStalkUnstalkButton($buttonsWrap, userName, btnClass) {
        if (getStalkedUsers().indexOf(userName) < 0) {
            addStalkButton($buttonsWrap, userName, btnClass);
        } else {
            addUnstalkButton($buttonsWrap, userName, btnClass);
        }
    }
    function addMarkUnmarkButton($buttonsWrap, discussionId, btnClass) {
        if (getMarkedDiscussions().indexOf(discussionId) > -1) {
            addUnmarkButton($buttonsWrap, null, discussionId, btnClass);
        } else {
            addMarkButton($buttonsWrap, null, discussionId, btnClass);
        }
    }

    function addMarkingButtons(discussionId) {
        var $buttonsWrap = $('<div class="bsg-discussion-actions-wrap"></div>');
        var $commentActions = $('.comment__actions').first();
        var userName = $commentActions.closest('.comment__summary').find('.comment__username').text();
        $commentActions.prepend($buttonsWrap);

        addMarkUnmarkButton($buttonsWrap, discussionId, 'bsg-discussion-action-btn');
        addStalkUnstalkButton($buttonsWrap, userName, 'bsg-discussion-action-btn');
    }

    function getClassesForNewComments(commentsCount) {
        var classes = 'bsg-new-comments ';
        if (commentsCount >= 100) {
            classes += 'm-high';
        } else if (commentsCount >= 50) {
            classes += 'm-medium';
        } else if (commentsCount >= 10) {
            classes += 'm-low';
        }
        return classes;
    }

    function addReadDiscussion(id, discussion) {
        var readDiscussions = getReadDiscussions() || {};
        readDiscussions[id] = discussion;
        localStorage.setItem(storageName, JSON.stringify(readDiscussions));
    }
    function removeReadDiscussion(id) {
        var readDiscussions = getReadDiscussions() || {};
        delete readDiscussions[id];
        localStorage.setItem(storageName, JSON.stringify(readDiscussions));
    }

    function getReadDiscussions() {
        return JSON.parse(localStorage.getItem(storageName)) || {};
    }

    function getStalkedUsers() {
        return JSON.parse(localStorage.getItem(stalkedStorageName)) || [];
    }

    function getMarkedDiscussions() {
        return JSON.parse(localStorage.getItem(markedDiscussionsStorageName)) || [];
    }

    function addOrRemoveStalkedUser(userName) {
        var users = getStalkedUsers(),
            index = users.indexOf(userName);
        if (index < 0) {
            users.push(userName);
            localStorage.setItem(stalkedStorageName, JSON.stringify(users));
        } else {
            users.splice(index, 1);
            localStorage.setItem(stalkedStorageName, JSON.stringify(users));
        }
    }

    function addMarkedDiscussion(discussionId,$outerWrap) {
        var markedDiscussions = getMarkedDiscussions(),
            index = markedDiscussions.indexOf(discussionId);
        if (index < 0) {
            markedDiscussions.push(discussionId);
            localStorage.setItem(markedDiscussionsStorageName, JSON.stringify(markedDiscussions));
            if ($outerWrap) {
                markDiscussion($outerWrap);
            }
        } else {
            markedDiscussions.splice(index, 1);
            localStorage.setItem(markedDiscussionsStorageName, JSON.stringify(markedDiscussions));
            if ($outerWrap) {
                unmarkDiscussion($outerWrap);
            }
        }
    }

    function makeHeadersSortable() {
        var $tableHeading = $('.table__heading div');

        var sortByCreationDateLink = $('<a class="bsg-sort-link CreationDate">Summary</a>');
        var sortByCommentsLink = $('<a class="bsg-sort-link Comments">Comments</a>');
        var sortByLastPostLink = $('<a class="bsg-sort-link LastPost">Last Post</a>');
        sortByCreationDateLink.on('click', function() {updateSortIcon('CreationDate'); sortByCreationDate(); });
        sortByCommentsLink.on('click', function() {updateSortIcon('Comments'); sortByComments(); });
        sortByLastPostLink.on('click', function() {updateSortIcon('LastPost'); sortByLastPost(); });

        $tableHeading.eq(0).contents().replaceWith(sortByCreationDateLink);
        $tableHeading.eq(1).contents().replaceWith(sortByCommentsLink);
        $tableHeading.eq(2).contents().replaceWith(sortByLastPostLink);

        addSortingIcon();
        if (getSorting().indexOf('CreationDate') > -1) {
            sortByCreationDate();
        } else if (getSorting().indexOf('Comments') > -1) {
            sortByComments();
        } else if (getSorting().indexOf('LastPost') > -1) {
            sortByLastPost();
        }
    }

    function addManagementButtons() {
        var $heading = $('.page__heading__breadcrumbs');
        var importLink = $('<a class="table__column__secondary-link" style="margin-left: auto; cursor: pointer;">Import</a>');
        var exportLink = $('<a class="table__column__secondary-link" style="margin-left: 10px; cursor: pointer;">Export</a>');

        importLink.on('click', function() {
            var textToImport = prompt('*** Bladito\'s discussions script ***\nInsert exported data here:');
            if (textToImport !== null) {
                try {
                    var jsonToImport = JSON.parse(textToImport);
                    for (var key in jsonToImport) {
                        if (jsonToImport.hasOwnProperty(key)) { // TODO compare time and add entry only if it's newer than existing one
                            addReadDiscussion(key, jsonToImport[key]);
                        }
                    }
                } catch (e) {
                    alert('Error! Cannot parse inserted data!');
                }
            }
        });
        exportLink.on('click', function() {
            window.prompt('*** Bladito\'s discussions script ***\nExport data of your read discussions.\nCopy text to clipboard and import it later...', JSON.stringify(getReadDiscussions()));
        });

        $heading.append(importLink);
        $heading.append(exportLink);
    }

    function addLastPostButton($table) {
        var $source = $table || $('body');

        $source.find('.table__last-comment-icon').after(
            '<a class="icon-red bsg-last-page-icon" title="Go to last page"><i class="fa fa-chevron-circle-down"></i></a>'
        );
        $source.on('click', 'a.bsg-last-page-icon', function() {
            var lastCommentHref = $(this).prev().attr('href');
            $.get(lastCommentHref, function(data) {
                var lastPageLink = $(data).find('.pagination__navigation a:last');
                if (lastPageLink.length) {
                    $.get(lastPageLink.attr('href'), goToLastCommentOnPage);
                } else {
                    goToLastCommentOnPage(data);
                }
            });
        });

        function goToLastCommentOnPage(pageContent) {
            location.href = $(pageContent).find('a.comment__actions__button:last').attr('href');
        }
    }

    function updateSortIcon(sortingName) {
        var sortingBy = getSorting();
        if (sortingBy.indexOf(sortingName) > -1) {
            sortingBy = flipSign(sortingBy);
        } else {
            sortingBy = '+' + sortingName;
        }
        setSorting(sortingBy);
        clearSorting();
        addSortingIcon();
        return sortingBy;
    }

    function doSort(attributeSelector, normalizer, alternativeSelector) {
        var sortingBy = getSorting();

        // don't sort pinned discussions
        $('.table__row-outer-wrap').filter(function() {
            return $(this).find('.fa-long-arrow-right').length === 0;
        }).sort(function (a, b) {
            var first = normalizer($(a).find(attributeSelector).text(), $(a).find(alternativeSelector).text());
            var second = normalizer($(b).find(attributeSelector).text(), $(b).find(alternativeSelector).text());
            var result;

            result = first < second ? -1 : (first > second ? 1 : 0);
            if (sortingBy[0] === '-') {
                result *= -1;
            }

            return result;
        }).appendTo(".table__rows");
    }

    function sortByCreationDate() {
        doSort('.table__row-inner-wrap > .table__column--width-fill > p > span', getNormlizedTime);
    }
    function sortByLastPost() {
        doSort('.table__row-inner-wrap > .table__column--last-comment p > span', getLastPostOrCreationDateTime,
               '.table__row-inner-wrap > .table__column--width-fill > p > span');
    }
    function sortByComments() {
        doSort('.table__column--width-small a', function(commentCountAsText) {
            return +commentCountAsText.replace(/[^\d]/g, '');
        });
    }

    function getNormlizedTime(dateAsText) {
        if (dateAsText.indexOf('second') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000;
        }
        if (dateAsText.indexOf('minute') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000 * 60;
        }
        if (dateAsText.indexOf('hour') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000 * 60 * 60;
        }
        if (dateAsText.indexOf('day') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000 * 60 * 60 * 24;
        }
        if (dateAsText.indexOf('week') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000 * 60 * 60 * 24 * 7;
        }
        if (dateAsText.indexOf('month') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000 * 60 * 60 * 24 * 7 * 4;
        }
        if (dateAsText.indexOf('year') > -1) {
            return +dateAsText.replace(/[^\d]/g, '') * 1000 * 60 * 60 * 24 * 7 * 4 * 12;
        }
        return null;
    }

    function getLastPostOrCreationDateTime(lastPostDateText, creationDateText) {
        var lastPostTime = getNormlizedTime(lastPostDateText);
        if (lastPostTime !== null) {
            return lastPostTime;
        }
        return getNormlizedTime(creationDateText);
    }

    function clearSorting() {
        $('.bsg-sort-link i').remove();
    }

    function addSortingIcon() {
        var icon, sortingBy = getSorting();
        if (sortingBy[0] === '+') {
            icon = '<i class="fa fa-sort-amount-asc"></i>';
        } else {
            icon = '<i class="fa fa-sort-amount-desc"></i>';
        }
        $('.bsg-sort-link.' + sortingBy.slice(1)).prepend(icon);
    }

    function flipSign(sortingBy) {
        if (sortingBy[0] === '+') {
            return '-' + sortingBy.slice(1);
        }
        return '+' + sortingBy.slice(1);
    }

    function setSorting(sortingBy) {
        localStorage.setItem(sortingStorageName, sortingBy);
    }

    function getSorting() {
        return localStorage.getItem(sortingStorageName) || "+LastPost";
    }

    function detectAdditionInDOM(obj, callback){
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if(mutations[0].addedNodes.length) {
                    callback(mutations);
                }
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( window.addEventListener ){
            obj.addEventListener('DOMNodeInserted', callback, false);
            obj.addEventListener('DOMNodeRemoved', callback, false);
        }
    }

    function addStyles() {
        GM_addStyle('.action-btns-wrap { display: none; position: absolute; margin-left: -115px; width: 115px; }');
        GM_addStyle('.table__row-outer-wrap:hover > .action-btns-wrap { display: block; }');
        GM_addStyle('.bsg-action-btn { ' +
                    'display: inline-block; margin: 5px; ' +
                    'border: 1px solid #d6d6d6;' +
                    'font: 700 13px/32px "Open Sans",sans-serif;' +
                    'padding: 0 15px;' +
                    'cursor: pointer;' +
                    'text-align: center;' +
                    'border-radius: 4px;' +
                    'background-color: #f3f3f3;' +
                    'background-image: none;' +
                    'color: #757575;' +
                    'width: 46px;' +
                    '}');
        GM_addStyle('.bsg-action-btn.m-active, .bsg-action-btn:hover {' +
                    'border-color: #B9D393 #96BC69 #73A442 #A0C870;' +
                    'background-image: linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    'background-image: -moz-linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    'background-image: -webkit-linear-gradient(#cef2aa 0%, #b4e08a 50%, #9AC96A 100%);' +
                    '}');
        GM_addStyle('.bsg-action-btn.m-active:hover {' +
                    'border-color: #edbecd #f0afc5 #de95ae #f2b1c8 !important;' +
                    'background-image: linear-gradient(#fad9e4 0%, #f1c0d2 100%);' +
                    'background-image: -moz-linear-gradient(#fad9e4 0%, #f1c0d2 100%);' +
                    'background-image: -webkit-linear-gradient(#fad9e4 0%, #f1c0d2 100%);' +
                    '}');

        GM_addStyle('.bsg-user-action-btn {' +
                    'color: #465670;' +
                    'background-color: transparent;' +
                    '}');
        GM_addStyle('.bsg-user-action-btn.m-active {' +
                    'background-image: linear-gradient(#CAEEA7 0%, #B4DF8A 50%, #9AC96A 100%) !important;' +
                    'background-image: -moz-linear-gradient(#CAEEA7 0%, #B4DF8A 50%, #9AC96A 100%) !important;' +
                    'background-image: -webkit-linear-gradient(#CAEEA7 0%, #B4DF8A 50%, #9AC96A 100%) !important;' +
                    'border-color: #B9D393 #96BC69 #73A442 #A0C870;' +
                    'color: rgba(63,115,0,0.95);' +
                    'text-shadow: 1px 1px 1px rgba(224,246,198,0.5);' +
                    '}');


        GM_addStyle('.bsg-discussion-actions-wrap {' +
                    'margin-right: -42px !important;' +
                    'position: relative;' +
                    'right: 55px;' +
                    '}');
        GM_addStyle('.bsg-discussion-action-btn {' +
                    'color: #9aa1af;' +
                    'background-color: transparent;' +
                    'cursor: pointer;' +
                    'margin-left: 7px;' +
                    '}');
        GM_addStyle('.bsg-discussion-action-btn.m-active, .bsg-discussion-action-btn:hover {' +
                    'color: #9dcb6d;' +
                    '}');

        GM_addStyle('.bsg-discussion-read.table__row-outer-wrap {' +
                    'opacity: 0.3;' +
                    '}');
        GM_addStyle('.bsg-stalked-discussion.table__row-outer-wrap {' +
                    //'border: 2px solid red;' +
                    'background-color: rgba(185, 214, 230, 0.5);' +
                    'opacity: 1;' +
                    '}');
        GM_addStyle('.bsg-marked-discussion.table__row-outer-wrap {' +
                    //'border: 2px dashed green;' +
                    'background-color: rgba(185, 230, 185, 0.5);' +
                    'opacity: 1;' +
                    '}');
        GM_addStyle('.bsg-discussion-title-changed {' +
                    //'color: #fd00ff;' +
                    'text-decoration: underline;' +
                    '}');

        GM_addStyle('.bsg-new-comments {' +
                    'margin-left: 5px;' +
                    '}');
        GM_addStyle('.bsg-new-comments.m-high {' +
                    //'color: #fd00ff;' +
                    'color: #4B72D4;' +
                    //'font-size: 25px;' +
                    'font-weight: 900;' +
                    '}');
        GM_addStyle('.bsg-new-comments.m-medium {' +
                    //'color: red;' +
                    //'font-size: 20px;' +
                    'font-weight: 600;' +
                    '}');
        GM_addStyle('.bsg-new-comments.m-low {' +
                    //'color: blue;' +
                    //'font-size: 13px;' +
                    '}');
        GM_addStyle('.bsg-sort-link {' +
                    'color: #4B72D4;' +
                    'cursor: pointer;' +
                    '}');
        GM_addStyle('.bsg-last-page-icon {' +
                    'margin-left: 5px;' +
                    'cursor: pointer;' +
                    '}');
    }

})(jQuery);
