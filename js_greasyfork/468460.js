// ==UserScript==
// @name         Kbin Collapsible Comments
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  On the KBin website, support collapsing and expanding comments
// @author       CodingAndCoffee
// @match        https://kbin.social/m/*
// @match        https://fedia.io/m/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kbin.social
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468460/Kbin%20Collapsible%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/468460/Kbin%20Collapsible%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLLAPSE_PARENTS_BY_DEFAULT = false;

    const isMobileUser = function () {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        } else {
            return false;
        }
    };

    const getNumericId = function (comment) {
        return comment.id.split("-").reverse()[0];
    };

    const getComment = function (numericId) {
        return document.querySelector('#comments blockquote#entry-comment-' + numericId);
    };

    const getChildrenOf = function (numericId) {
        return document.querySelectorAll('#comments blockquote[data-subject-parent-value="' + numericId + '"]');
    }

    const getDescendentsOf = function (numericId) {
        var parent = getComment(numericId);
        var children = getChildrenOf(numericId);

        var descendents = [];
        children.forEach(function (child) {
            descendents.push(child);
            var childDescendents = getDescendentsOf(getNumericId(child));
            childDescendents.forEach (function (cd) {
                descendents.push(cd);
            });
        });
        return descendents;
    };

    const makeCollapseLabel = function (isVisible, childrenCount) {
        var upDown = (isVisible ? '<i class="fa-solid fa-chevron-up"></i>' : '<i class="fa-solid fa-chevron-down"></i>');
        if (!isMobileUser()) {
            var label = (isVisible ? ' hide ' : ' show ')
            return (childrenCount > 0 ?
                    (label + ' [' + childrenCount + '] ' + upDown) :
                    (label + upDown)
                   );
        } else {
            return upDown;
        }
    };

    window.toggleChildren = function (numericId) {
        var parent = getComment(numericId);

        // get visibility status
        var childrenVisible = (parent.dataset['childrenVisible'] === 'true');
        var toggledStatus = !childrenVisible;

        // update dataset
        parent.setAttribute('data-children-visible', toggledStatus);
        if (!COLLAPSE_PARENTS_BY_DEFAULT) {
            var figure = parent.querySelector('figure');
            var footer = parent.querySelector('footer');
            var content = parent.querySelector('.content');
            var more = parent.querySelector('.more');
            if (toggledStatus) {
                content.style.display = '';
                footer.style.display = '';
                figure.style.display = '';
                parent.style.height = '';
                if (more) { more.style.display = ''; }
            } else {
                content.style.display = 'none';
                footer.style.display = 'none';
                figure.style.display = 'none';
                parent.style.height = '43px';
                parent.style.paddingTop = '0.53rem';
                if (more) { more.style.display = 'none'; }
            }
        }

        // toggle visibility of the descendents
        var descendents = getDescendentsOf(numericId);
        descendents.forEach(function(c) {
            c.style.display = (toggledStatus ? 'grid' : 'none');
        });

        // update the link text
        var childrenCount = parent.dataset['childrenCount'];
        var button = document.querySelector('#comment-'+numericId+'-collapse-button');
        console.debug(button);
        button.innerHTML = makeCollapseLabel(toggledStatus, childrenCount);
    };

    const comments = document.querySelectorAll('#comments blockquote.comment');
    comments.forEach(function (comment) {
        var numericId = getNumericId(comment);
        var children = getChildrenOf(numericId);
        var childrenCount = children.length;
        // add some metadata
        comment.setAttribute('data-children-visible', true);
        comment.setAttribute('data-children-count', childrenCount);

        var header = comment.querySelector('header');
        header.style.height = '40px';
        header.style.textWrap = 'nowrap';
        header.style.textOverflowX = 'ellipsis';
        header.style.overflowX = 'hidden';
        header.style.display = 'inline-flex';
        var content = comment.querySelector('.content');
        var footer = comment.querySelector('footer');
        var timeAgo = comment.querySelector('.timeago');
        timeAgo.style.overflow = 'hidden';

        var elements = [header];
        if (isMobileUser()) {
            elements.push(content);
        }
        var toggleFn = function(ev) {
            ev.stopPropagation();
            window.toggleChildren(numericId);
            return false;
        };
        elements.forEach(function (it) {
            if (it) {
                it.addEventListener('click', toggleFn);
                it.style.cursor = 'pointer';
            }
        });

        // Create the collapse/expand button
        var button = document.createElement("a");
        button.id = 'comment-'+numericId+'-collapse-button';
        button.innerHTML = makeCollapseLabel(true, childrenCount);
        button.style.cursor = "pointer";
        button.style.marginLeft = "0.5rem";
        header.appendChild(button);
    });

    if (COLLAPSE_PARENTS_BY_DEFAULT) {
        comments.forEach(function (comment) {
            var numericId = getNumericId(comment);

            var isTopLevel = (typeof comment.dataset['subject-parent-value'] !== 'string');
            if (isTopLevel) {
                window.toggleChildren(numericId);
            }
        });
    }
})();