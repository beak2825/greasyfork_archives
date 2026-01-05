// ==UserScript==
// @name         Derpibooru Comment Enhancements
// @description  Improvements to Derpibooru's comment section
// @version      1.5.2
// @author       Marker
// @license      MIT
// @namespace    https://github.com/marktaiwan/
// @homepageURL  https://github.com/marktaiwan/Derpibooru-Link-Preview
// @supportURL   https://github.com/marktaiwan/Derpibooru-Link-Preview/issues
// @match        https://*.derpibooru.org/*
// @match        https://*.trixiebooru.org/*
// @grant        none
// @inject-into  content
// @noframes
// @require      https://openuserjs.org/src/libs/soufianesakhi/node-creation-observer.js
// @require      https://openuserjs.org/src/libs/mark.taiwangmail.com/Derpibooru_Unified_Userscript_UI_Utility.js?v1.2.1
// @downloadURL https://update.greasyfork.org/scripts/23354/Derpibooru%20Comment%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/23354/Derpibooru%20Comment%20Enhancements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==== User Config ====

    const config = ConfigManager('Derpibooru Comment Enhancements', 'derpi_comment_enhancements');
    config.registerSetting({
        title: 'Linkify images',
        key: 'link_images',
        description: 'Link embedded images to their sources. Images already containing links will be unaffected.',
        type: 'checkbox',
        defaultValue: false
    });
    config.registerSetting({
        title: 'Disable native preview',
        key: 'disable_native_preview',
        description: 'This will disable the site\'s native feature that inserts the linked comment above the current one when clicked, and instead navigates to the targted comment.',
        type: 'checkbox',
        defaultValue: false
    });
    const spoilerSettings = config.addFieldset('Reveal spoiler...');
    spoilerSettings.registerSetting({
        title: '...in comment preview',
        key: 'show_preview_spoiler',
        description: 'Reveal spoilers in the pop-up preview.',
        type: 'checkbox',
        defaultValue: true
    });
    spoilerSettings.registerSetting({
        title: '...in comment highlight',
        key: 'show_highlight_spoiler',
        description: 'Reveal spoilers in the highlighted comment.',
        type: 'checkbox',
        defaultValue: true
    });

    const LINK_IMAGES = config.getEntry('link_images');
    const DISABLE_NATIVE_PREVIEW = config.getEntry('disable_native_preview');
    const SHOW_PREVIEW_SPOILER = config.getEntry('show_preview_spoiler');
    const SHOW_HIGHLIGHT_SPOILER = config.getEntry('show_highlight_spoiler');

    // ==== /User Config ====

    const HOVER_ATTRIBUTE = 'comment-preview-active';
    const fetchCache = {};
    const backlinksCache = {};

    function $(selector, parent = document) {
        return parent.querySelector(selector);
    }

    function $$(selector, parent = document) {
        return parent.querySelectorAll(selector);
    }

    /*
      Unminified code from
      https://derpibooru.org/meta/booru-on-rails-inquiry/post/3823503#post_3823503
    */
    function timeAgo(args) {

        const strings = {
            seconds: 'less than a minute',
            minute: 'about a minute',
            minutes: '%d minutes',
            hour: 'about an hour',
            hours: 'about %d hours',
            day: 'a day',
            days: '%d days',
            month: 'about a month',
            months: '%d months',
            year: 'about a year',
            years: '%d years',
        };

        function distance(time) {
            return new Date() - time;
        }

        function substitute(key, amount) {
            return strings[key].replace('%d', Math.round(amount));
        }

        function setTimeAgo(el) {
            const date = new Date(el.getAttribute('datetime'));
            const distMillis = distance(date);

            /* eslint-disable no-multi-spaces */

            const seconds = Math.abs(distMillis) / 1000;
            const minutes = seconds / 60;
            const hours   = minutes / 60;
            const days    = hours / 24;
            const months  = days / 30;
            const years   = days / 365;

            const words =
              seconds < 45  && substitute('seconds', seconds) ||
              seconds < 90  && substitute('minute', 1)        ||
              minutes < 45  && substitute('minutes', minutes) ||
              minutes < 90  && substitute('hour', 1)          ||
              hours   < 24  && substitute('hours', hours)     ||
              hours   < 42  && substitute('day', 1)           ||
              days    < 30  && substitute('days', days)       ||
              days    < 45  && substitute('month', 1)         ||
              days    < 365 && substitute('months', months)   ||
              years   < 1.5 && substitute('year', 1)          ||
                               substitute('years', years);

            /* eslint-enable no-multi-spaces */

            if (!el.getAttribute('title')) {
                el.setAttribute('title', el.textContent);
            }
            el.textContent = words + (distMillis < 0 ? ' from now' : ' ago');
        }
        [].forEach.call(args, el => setTimeAgo(el));
    }

    function displayHover(comment, sourceLink) {
        const PADDING = 5; // in pixels

        comment = comment.cloneNode(true);
        comment.id = 'hover_preview';
        comment.style.position = 'absolute';
        comment.style.maxWidth = '980px';
        comment.style.minWidth = '490px';
        comment.style.boxShadow = '0px 0px 12px 0px rgba(0, 0, 0, 0.4)';

        if (SHOW_PREVIEW_SPOILER) {
            revealSpoiler(comment);
        }

        // relative time
        timeAgo($$('time', comment));

        const container = document.getElementById('comments') || document.getElementById('content');
        if (container) container.appendChild(comment);

        // calculate link position
        const linkRect = sourceLink.getBoundingClientRect();
        const linkTop = linkRect.top + viewportPosition().top;
        const linkLeft = linkRect.left + viewportPosition().left;

        const commentRect = comment.getBoundingClientRect();
        let commentTop;
        let commentLeft;


        if (sourceLink.parentElement.classList.contains('comment_backlinks')) {
            // When there is room, place the preview below the link,
            // otherwise place it above the link
            if (document.documentElement.clientHeight - linkRect.bottom > commentRect.height + PADDING) {

                commentTop = linkTop + linkRect.height + PADDING;
                commentLeft = (commentRect.width + linkLeft < document.documentElement.clientWidth) ? (
                    linkLeft
                ) : (
                    document.documentElement.clientWidth - (commentRect.width + PADDING)
                );

            } else {

                commentTop = linkTop - commentRect.height - PADDING;
                commentLeft = (commentRect.width + linkLeft < document.documentElement.clientWidth) ? (
                    linkLeft
                ) : (
                    document.documentElement.clientWidth - (commentRect.width + PADDING)
                );

            }
        } else {
            // When there is room, place the preview above the link
            // otherwise place it to the right and aligns it to the top of viewport
            if (linkRect.top > commentRect.height + PADDING) {

                commentTop = linkTop - commentRect.height - PADDING;
                commentLeft = (commentRect.width + linkLeft < document.documentElement.clientWidth) ? (
                    linkLeft
                ) : (
                    document.documentElement.clientWidth - (commentRect.width + PADDING)
                );

            } else {

                commentTop = viewportPosition().top + PADDING;
                commentLeft = linkLeft + linkRect.width + PADDING;

            }
        }

        comment.style.top = commentTop + 'px';
        comment.style.left = commentLeft + 'px';
    }

    function linkEnter(sourceLink, targetCommentID, isForumPost) {
        sourceLink.setAttribute(HOVER_ATTRIBUTE, 1);
        const selector = isForumPost ? 'post_' : 'comment_';
        const targetComment = document.getElementById(selector + targetCommentID);

        if (targetComment !== null) {

            highlightReplyLink(targetComment, sourceLink, isForumPost);

            if (!elementInViewport(targetComment)) {
                displayHover(targetComment, sourceLink);
            }
            if (SHOW_HIGHLIGHT_SPOILER) {
                revealSpoiler(targetComment);
            }

            // Highlight linked post
            targetComment.children[0].style.backgroundColor = 'rgba(230,230,30,0.3)';
            if ($('.comment_backlinks', targetComment) !== null) targetComment.children[1].style.backgroundColor = 'rgba(230,230,30,0.3)';

        }
        else if (!isForumPost) {

            // External post, display from cached response if possible
            if (fetchCache[targetCommentID] !== undefined) {
                displayHover(fetchCache[targetCommentID], sourceLink);
            } else {
                const imageId = getImageId(sourceLink.href);
                fetch(`${window.location.origin}/images/${imageId}/comments/${targetCommentID}`, {credentials: 'same-origin'})
                    .then((response) => {
                        if (!response.ok) throw new Error('Unable to fetch external comment.');
                        return response.text();
                    })
                    .then((text) => {
                        if (fetchCache[targetCommentID] === undefined && sourceLink.getAttribute(HOVER_ATTRIBUTE) !== '0') {
                            const d = document.createElement('div');
                            d.innerHTML = text;
                            fetchCache[targetCommentID] = d.firstChild;
                            displayHover(d.firstChild, sourceLink);
                        }
                    });
            }

        }
    }

    function linkLeave(sourceLink, targetCommentID, isForumPost) {
        sourceLink.setAttribute(HOVER_ATTRIBUTE, 0);
        const selector = isForumPost ? 'post_' : 'comment_';
        const targetComment = document.getElementById(selector + targetCommentID);
        const preview = document.getElementById('hover_preview');

        if (targetComment !== null) {
            // remove comment highlight
            targetComment.children[0].style.backgroundColor = '';
            if ($('.comment_backlinks', targetComment) !== null) targetComment.children[1].style.backgroundColor = '';

            // remove link highlight
            let ele = sourceLink;
            while (ele.parentElement !== null && !ele.matches('article')) ele = ele.parentElement;
            const sourceCommentID = ele.id.slice(selector.length);
            const list = $$('a[href$="#' + selector + sourceCommentID + '"]', targetComment);
            for (let i = 0; i < list.length; i++) {
                list[i].style.textDecoration = '';
            }

            // unreveal spoilers
            // we use the 'reveal-preview-spoiler' attribute to avoid reverting spoilers manually revealed by users
            const spoilers = $$('.spoiler-revealed[reveal-preview-spoiler]', targetComment);
            const imgspoilers = $$('.imgspoiler-revealed[reveal-preview-spoiler]', targetComment);
            for (const spoiler of spoilers) {
                spoiler.classList.remove('spoiler-revealed');
                spoiler.classList.add('spoiler');
                spoiler.removeAttribute('reveal-preview-spoiler');
            }
            for (const imgspoiler of imgspoilers) {
                imgspoiler.classList.remove('imgspoiler-revealed');
                imgspoiler.classList.add('imgspoiler');
                imgspoiler.removeAttribute('reveal-preview-spoiler');
            }
        }

        if (preview !== null) preview.parentElement.removeChild(preview);
    }

    // Chrome/Firefox compatibility hack for getting viewport position
    function viewportPosition() {
        return {
            top: (document.documentElement.scrollTop || document.body.scrollTop),
            left: (document.documentElement.scrollLeft || document.body.scrollLeft)
        };
    }

    function elementInViewport(el) {

        // Calculate the ratio of post height and viewport height, and clamp it to a min/max value,
        // and use it to decide whether to use highlight or preview on a comment that's partially in view.
        // The script will prefer the use of highlights on long comments,
        // when using the preview might take up most of the viewport

        const rect = el.getBoundingClientRect();
        const ratio = Math.max(0.25, Math.min(0.95, rect.height / document.documentElement.clientHeight));
        const margin = Math.round(rect.height * ratio);   // pixels outside of viewport before element is considered out of view

        return (
            rect.top + margin >= 0 &&
            rect.bottom - margin <= document.documentElement.clientHeight
        );
    }

    function createBacklinksContainer(commentBody) {
        let ele = $('div.comment_backlinks', commentBody);

        if (ele === null) {

            ele = document.createElement('div');
            ele.className = 'block__content comment_backlinks';
            ele.style.fontSize = '12px';

            // Firefox 57 Workaround: getComputedStyle(commentBody.firstChild)['border-top'] returns an empty string
            ele.style.borderTopStyle = window.getComputedStyle(commentBody.firstChild)['border-top-style'];
            ele.style.borderTopWidth = window.getComputedStyle(commentBody.firstChild)['border-top-width'];
            ele.style.borderTopColor = window.getComputedStyle(commentBody.firstChild)['border-top-color'];

            commentBody.insertBefore(ele, $('.communication__options', commentBody));
        }
        return ele;
    }

    function insertBacklink(backlink, commentID, isForumPost) {

        // add to cache
        if (backlinksCache[commentID] === undefined) backlinksCache[commentID] = [];
        if (backlinksCache[commentID].findIndex((ele) => (ele.hash == backlink.hash)) == -1) {
            backlinksCache[commentID].push(backlink);
        }
        const selector = isForumPost ? 'post_' : 'comment_';
        const commentBody = document.getElementById(selector + commentID);
        if (commentBody !== null) {
            const linksContainer = createBacklinksContainer(commentBody);

            // insertion sort the links so they are ordered by id
            if (linksContainer.children.length > 0) {
                const iLinkID = getCommentId(backlink);

                for (let i = 0; i < linksContainer.children.length; i++) {
                    const iTempID = getCommentId(linksContainer.children[i]);

                    if (iLinkID == iTempID) {  // prevent links to the same comment from being added multiple times
                        return;
                    }
                    if (iLinkID < iTempID) {
                        linksContainer.insertBefore(backlink, linksContainer.children[i]);
                        return;
                    }
                }
            }
            linksContainer.appendChild(backlink);
            return;
        }

    }

    function revealSpoiler(comment) {
        const spoilers = $$('.spoiler', comment);
        const imgspoilers = $$('.imgspoiler', comment);

        for (const spoiler of spoilers) {
            spoiler.classList.remove('spoiler');
            spoiler.classList.add('spoiler-revealed');
            spoiler.setAttribute('reveal-preview-spoiler', '1');
        }
        for (const imgspoiler of imgspoilers) {
            imgspoiler.classList.remove('imgspoiler');
            imgspoiler.classList.add('imgspoiler-revealed');
            imgspoiler.setAttribute('reveal-preview-spoiler', '1');
        }
    }

    function highlightReplyLink(comment, sourceLink, isForumPost) {
        const selector = isForumPost ? 'post_' : 'comment_';
        let ele = sourceLink;

        while (ele.parentElement !== null && !ele.matches('article')) ele = ele.parentElement;

        const sourceCommentID = ele.id.slice(selector.length);
        const list = $$('a[href$="#' + selector + sourceCommentID + '"]', comment);

        for (let i = 0; i < list.length; i++) {
            list[i].style.textDecoration = 'underline dashed';
        }
    }

    function getQueryVariable(key, HTMLAnchorElement) {
        const array = HTMLAnchorElement.search.substring(1).split('&');

        for (let i = 0; i < array.length; i++) {
            if (key == array[i].split('=')[0]) {
                return array[i].split('=')[1];
            }
        }
    }

    function getImageId(url) {
        const regex = new RegExp('https?://(?:www\\.|philomena\\.)?(?:(?:derpibooru\\.org|trixiebooru\\.org)/(?:images/)?(\\d+)(?:\\?.*|/|\\.html)?|derpicdn\\.net/img/(?:view/|download/)?\\d+/\\d+/\\d+/(\\d+))', 'i');
        const array = url.match(regex);
        return (array !== null) ? array[1] || array[2] : null;
    }

    function getCommentId(backlink) {
        // the regex expects the comment id in the format of '#post_1234' or '#comment_5678'
        const regex = new RegExp('^#(?:post_|comment_)(\\d+)$');
        return parseInt(regex.exec(backlink.hash)[1], 10);
    }

    function insertButton(displayText) {

        const commentsBlock = $('#comments');

        const ele = document.createElement('div');
        ele.className = 'block__header';
        ele.id = 'comment_loading_button';
        ele.style.textAlign = 'center';

        ele.appendChild(document.createElement('a'));
        ele.firstChild.style.padding = '0px';
        ele.firstChild.style.width = '100%';
        ele.firstChild.innerText = displayText;

        commentsBlock.insertBefore(ele, commentsBlock.lastElementChild);

        return ele;
    }

    function loadComments(e, nextPage) {
        const btn = document.getElementById('comment_loading_button');
        const imageId = getImageId(window.location.href);
        const fetchURL = `${window.location.origin}/images/${imageId}/comments?page=${nextPage}`;

        btn.firstElementChild.innerText = 'Loading...';

        fetch(fetchURL, {credentials: 'same-origin'})  // cookie needed for correct pagination
            .then((response) => response.text())
            .then((text) => {
                // response text => documentFragment
                const ele = document.createElement('div');
                const range = document.createRange();

                ele.innerHTML = text;
                range.selectNodeContents(ele);

                const fragment = range.extractContents();
                const commentsBlock = document.getElementById('comments');

                // update pagination blocks
                commentsBlock.replaceChild(fragment.firstChild, commentsBlock.firstElementChild);
                commentsBlock.replaceChild(fragment.lastChild, commentsBlock.lastElementChild);

                // page marker
                ele.innerHTML = '';
                ele.className = 'block block__header';
                ele.style.textAlign = 'center';
                ele.innerText = 'Page ' + nextPage;

                // relative time
                timeAgo($$('time', fragment));

                fragment.insertBefore(ele, fragment.firstElementChild);
                commentsBlock.insertBefore(fragment, commentsBlock.lastElementChild);

                // configure button to load the next batch of comments
                btn.remove();

                const navbar = $('nav', commentsBlock);
                const btnNextPage = [...navbar.childNodes].find(node => node.innerHTML === 'Next ›');
                if (btnNextPage) {
                    const btn = insertButton('Load more comments');
                    btn.addEventListener('click', (e) => {
                        loadComments(e, nextPage + 1);
                    });
                }

            });
    }

    NodeCreationObserver.onCreation('article[id^="comment_"], article[id^="post_"]', function (sourceCommentBody) {
        const isForumPost = sourceCommentBody.matches('[id^="post_"]');
        const selector = isForumPost ? 'post_' : 'comment_';

        const links = $$(`.communication__body__text a[href*="#${selector}"]`, sourceCommentBody);
        const sourceCommentID = sourceCommentBody.id.slice(selector.length);
        const ele = $('.communication__body__sender-name > strong', sourceCommentBody);
        const sourceAuthor = (ele.firstElementChild !== null && ele.firstElementChild.matches('a')) ? ele.firstElementChild.innerText : ele.innerHTML;

        links.forEach((link) => {
            const targetCommentID = link.hash.slice(selector.length + 1);    // Example: link.hash == "#comment_5430424" or link.hash == "#post_5430424"

            // add backlink if the comment is not part of a quote
            // and not fetched
            if (!link.matches('blockquote a') && !sourceCommentBody.matches('.fetched-comment')) {
                const backlink = document.createElement('a');

                backlink.style.marginRight = '5px';
                backlink.href = '#' + selector + sourceCommentID;
                backlink.textContent = '►';
                backlink.innerHTML += sourceAuthor;

                backlink.addEventListener('mouseenter', () => {
                    linkEnter(backlink, sourceCommentID, isForumPost);
                });
                backlink.addEventListener('mouseleave', () => {
                    linkLeave(backlink, sourceCommentID, isForumPost);
                });
                backlink.addEventListener('click', () => {
                    // force pageload instead of trying to navigate to a nonexistent anchor on the current page
                    if (document.getElementById(selector + sourceCommentID) === null) window.location.reload();
                });

                insertBacklink(backlink, targetCommentID, isForumPost);
            }

            if (DISABLE_NATIVE_PREVIEW && !isForumPost) {
                link.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();

                    // quoted links doesn't contain query strings, this prevents page reload on links like "derpibooru.org/1234?q=tag"
                    const a = document.createElement('a');
                    if (document.getElementById(selector + targetCommentID) === null) {
                        a.href = e.currentTarget.href;
                    } else {
                        a.href = window.location.pathname + window.location.search + e.currentTarget.hash;
                    }

                    // Firefox requires the element to be inserted on the page for this to work
                    document.body.appendChild(a);
                    a.click();
                    a.remove();

                    // for paginated comments, when comment for the same image is on another page
                    if (window.location.pathname == e.currentTarget.pathname &&
                        document.getElementById(selector + targetCommentID) === null) {
                        window.location.reload();
                    }
                });
            }

            link.addEventListener('mouseenter', () => {
                linkEnter(link, targetCommentID, isForumPost);
            });
            link.addEventListener('mouseleave', () => {
                linkLeave(link, targetCommentID, isForumPost);
            });

        });

        // If other pages had replied to this comment
        if (backlinksCache[sourceCommentID] !== undefined) {
            backlinksCache[sourceCommentID].forEach((backlink) => {
                insertBacklink(backlink, sourceCommentID, isForumPost);
            });
        }

    });

    // Load and append more comments
    NodeCreationObserver.onCreation('#comments nav.pagination', function (navbar) {
        if (document.getElementById('comment_loading_button') !== null) return;

        const childNodes = [...navbar.childNodes];
        const btnNextPage = childNodes.find(node => node.innerHTML === 'Next ›');
        if (!btnNextPage) return;

        const nextPage = parseInt(getQueryVariable('page', btnNextPage), 10);

        const btn = insertButton('Load more comments');
        btn.addEventListener('click', (e) => {
            loadComments(e, nextPage);
        });
    });

    // Add clickable links to hotlinked images
    if (LINK_IMAGES) {
        NodeCreationObserver.onCreation('.communication__body__text .imgspoiler>img, .image-description .imgspoiler>img', img => {
            if (img.closest('a') !== null) return; // Image is already part of link so we do nothing.

            const imgParent = img.parentElement;
            const anchor = document.createElement('a');
            const imageId = getImageId(img.src);
            if (imageId !== null) {
                // image is on Derpibooru
                anchor.href = `/${imageId}`;
            } else {
                // camo.derpicdn.net
                anchor.href = decodeURIComponent(img.src.substr(img.src.indexOf('?url=') + 5));
            }
            anchor.appendChild(img);
            imgParent.appendChild(anchor);
        });
    }
})();
