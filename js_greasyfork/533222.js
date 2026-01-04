// ==UserScript==
// @name         Holotower Inline Quoting
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @author       grem
// @license      MIT
// @description  Inline Quoting for holotower.org
// @match        *://boards.holotower.org/*
// @match        *://holotower.org/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @connect      self
// @connect      boards.holotower.org
// @icon         https://boards.holotower.org/favicon.gif
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533222/Holotower%20Inline%20Quoting.user.js
// @updateURL https://update.greasyfork.org/scripts/533222/Holotower%20Inline%20Quoting.meta.js
// ==/UserScript==

/* global $, setting */

const IQ_SETTINGS_KEY = "InlineQuote Settings";
const iqDefaultSettings = {
    enableVideoHoverPreview: false,
};

let iqSettings = {};
try {
    iqSettings = JSON.parse(localStorage.getItem(IQ_SETTINGS_KEY)) || {};
} catch(e) { iqSettings = {}; }
for (const k in iqDefaultSettings) if (!(k in iqSettings)) iqSettings[k] = iqDefaultSettings[k];

function saveIQ() {
    localStorage.setItem(IQ_SETTINGS_KEY, JSON.stringify(iqSettings));
}

function getGlobalDefaultVolume() {
    try {
        if (typeof setting === "function") {
            const v = parseFloat(setting("videovolume"));
            if (!isNaN(v)) return Math.min(Math.max(v,0),1);
        }
    } catch {}
    return 1;
}

function cleanInlineContainer($container) {
    $container.find('> .inline-cloned-post > p.intro').each(function() {
        let next = this.nextSibling;
        while (next && next.nodeType === 3 && !/\S/.test(next.nodeValue)) {
            let toRemove = next;
            next = next.nextSibling;
            toRemove.parentNode.removeChild(toRemove);
        }
    });

    $container.find('> .inline-cloned-post > .files').each(function() {
        let next = this.nextSibling;
        while (next && next.nodeType === 3 && !/\S/.test(next.nodeValue)) {
            let toRemove = next;
            next = next.nextSibling;
            toRemove.parentNode.removeChild(toRemove);
        }
    });

    $container.find('> .inline-cloned-post > .files').each(function() {
        if (!this.innerText.trim() && !this.querySelector('img, video, a, object, embed')) {
            this.parentNode.removeChild(this);
        }
    });
}

$(function () {
    if (typeof Options === "undefined") return;
    const tab = Options.add_tab("inline-quote", "quote-right", "Inline Quotes");
    const $content = $("<div></div>");
    const $videoHoverEntry = $(
        `<div id="enableVideoHoverPreview-container">
            <label style="text-decoration: underline; cursor: pointer;">
                <input type="checkbox" id="enableVideoHoverPreview">Play videos on hover</label>
            <span class="description">: Show/Hide previews when hovering videos inside inline quotes</span>
        </div>`);
    $content.append($videoHoverEntry);
    $(tab.content).append($content);
    $("#enableVideoHoverPreview").prop("checked", iqSettings.enableVideoHoverPreview);
    $("#enableVideoHoverPreview").on("change", function () {
        iqSettings.enableVideoHoverPreview = this.checked;
        saveIQ();
    });
});

(function() {
    'use strict';

    const INLINE_CONTAINER_CLASS = 'inline-quote-container';
    const INLINE_ACTIVE_LINK_CLASS = 'inline-active';
    const LOADING_DATA_ATTR = 'data-inline-loading';
    const ERROR_DATA_ATTR = 'data-inline-error';
    const TEMP_HIGHLIGHT_CLASS = 'inline-temp-highlight';
    const PROCESSED_ATTR = 'data-inline-processed';
    const INLINED_ID_ATTR = 'data-inlined-id';
    const CLONED_POST_CLASS = 'inline-cloned-post';
    const CLONED_HOVER_PREVIEW_ID_PREFIX = 'iq-preview-';
    const HOVER_INITIALIZED_ATTR = 'data-iq-hover-init';
    const SITE_PREVIEW_BASE_CLASSES = 'post qp';
    const SITE_PREVIEW_REPLY_CLASS = 'reply';
    const SITE_PREVIEW_OP_CLASS = 'op';

    const POST_SELECTOR_ID_FORMAT = (postId) => `div.post[id$='_${postId}']`;
    const POTENTIAL_QUOTE_LINK_SELECTOR = "a[onclick*='highlightReply'], a[href*='#q']";
    const QUOTE_LINK_REGEX = /^>>(\d+)/;
    const SITE_HOVER_TARGET_SELECTOR = 'div.body a:not([rel="nofollow"]), span.mentioned a:not([rel="nofollow"]), p.intro a.post_no:not([rel="nofollow"])';
    const BOARD_CONTEXT_SELECTOR = '[data-board]';

    GM_addStyle(`
        .${INLINE_CONTAINER_CLASS} { border: 1px dashed var(--subtle-border-color,#888); background-color: var(--inline-background-color,rgba(128,128,128,.05)); padding:5px; margin-top:5px; margin-left:20px; border-radius:4px; }
        .${INLINE_CONTAINER_CLASS} > .${CLONED_POST_CLASS}[data-board] { border:none!important; margin:0!important; padding:0!important; box-shadow:none!important; background:transparent!important; }
        a.${INLINE_ACTIVE_LINK_CLASS} { font-weight:bold!important; color:var(--link-hover-color,#d11a1a)!important; opacity:.85; text-decoration:underline dotted!important; }
        a.${INLINE_ACTIVE_LINK_CLASS}:hover { opacity:1 }
        a[${LOADING_DATA_ATTR}="true"]::after { content:" (loading.)"; font-style:italic; color:var(--text-color-muted,#888); margin-left:4px }
        a[${ERROR_DATA_ATTR}="true"]::after   { content:" (not found)"; font-style:italic; color:var(--error-text-color,#f00); margin-left:4px }
        .${TEMP_HIGHLIGHT_CLASS} { transition:outline .1s ease-in-out; outline:2px solid var(--highlight-color,yellow)!important; outline-offset:2px }
        div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"] { position:absolute!important; z-index:150!important; max-width:500px }
        div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"] > .post { border:none!important; margin:0!important; padding:0!important; box-shadow:none!important; background:transparent!important; }
        div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"] .hide-post-button,div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"] .menu-button,div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"] input[type=checkbox].delete { display:none!important }
        div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"].loading-preview::after { content:"Loading."; font-style:italic; color:var(--text-color-muted,#888); padding:5px; display:block }
        div.qp[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"].error-preview::after { content:"Not found."; font-style:italic; color:var(--error-text-color,#f00); padding:5px; display:block }
    `);

    function adjustInlineQuoteContainer($container) {
        const $parentPost = $container.closest('.post.reply');
        let marginLeft = 0;
        const $img = $parentPost.find('.files .file .post-image');
        if ($img.length && $img.css('display') !== 'none') {
            marginLeft = parseInt($img[0]?.style.width) || $img[0]?.width || parseInt($img.attr('width')) || 0;
        } else {
            const $fullImg = $parentPost.find('.files .file .full-image');
            if ($fullImg.length) {
                marginLeft = parseInt($fullImg[0]?.style.width) || $fullImg[0]?.width || parseInt($fullImg.attr('width')) || 0;
            }
        }
        $container.css('margin-left', marginLeft + 'px');
        $container.find('.inline-cloned-post')[0]?.style.setProperty('max-width', '100%', 'important');
        $container.find('.inline-cloned-post').css('box-sizing','border-box');
    }

    function getPostIdFromLink(link) {
        if (!link) return null;
        const textMatch = link.textContent?.trim().match(QUOTE_LINK_REGEX);
        if (textMatch) return textMatch[1];
        const hrefMatch = link.getAttribute('href')?.match(/#(\d+)$/);
        if (hrefMatch) return hrefMatch[1];
        const quoteHrefMatch = link.getAttribute('href')?.match(/#q(\d+)$/);
        if (quoteHrefMatch) return quoteHrefMatch[1];
        return null;
    }

    function fetchPostHtml(url) {
        const fetchUrl = url?.split('#')[0];
        if (!fetchUrl) return Promise.resolve(null);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: fetchUrl,
                onload: r => { (r.status >= 200 && r.status < 300) ? resolve(r.responseText) : resolve(null); },
                onerror: r => { resolve(null); },
                ontimeout: () => { resolve(null); }
            });
        });
    }

    function parseAndFindPost(html, postId) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const postElement = doc.querySelector(POST_SELECTOR_ID_FORMAT(postId));
            return postElement;
        } catch (error) {
            return null;
        }
    }

    function isElementInViewportStrict(el) {
        el = el && el[0] ? el[0] : el;
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
    }

    function temporaryHighlight(el) {
        el = el && el[0] ? el[0] : el;
        if (!el) return;
        $(el).addClass(TEMP_HIGHLIGHT_CLASS);
        setTimeout(() => { $(el).removeClass(TEMP_HIGHLIGHT_CLASS); }, 500);
    }

    function processLinks(parentElement) {
        if (!parentElement) return;
        const links = parentElement.querySelectorAll(POTENTIAL_QUOTE_LINK_SELECTOR);
        links.forEach(link => {
            if (!link.hasAttribute(PROCESSED_ATTR)) {
                const onclickValue = link.getAttribute('onclick');
                if (onclickValue && onclickValue.includes('highlightReply')) {
                    link.removeAttribute('onclick');
                }
                link.setAttribute(PROCESSED_ATTR, 'true');
            }
        });
    }

    async function handleInlineQuoteClick(linkElement, postId) {
        const $link = $(linkElement);
        let $mainPost = $link.closest('.post.reply');
        if ($mainPost.hasClass('post-hover')) {
            const match = $mainPost.attr('id') && $mainPost.attr('id').match(/^post-hover-(\d+)/);
            if (match) {
                $mainPost = $(`.post.reply#reply_${match[1]}`);
            }
        }
        const $body = $mainPost.find('.body').first();

        $mainPost.find(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${postId}"]`).remove();

        if ($link.hasClass(INLINE_ACTIVE_LINK_CLASS)) {
            $link.removeClass(INLINE_ACTIVE_LINK_CLASS).removeAttr(LOADING_DATA_ATTR).removeAttr(ERROR_DATA_ATTR);
            return;
        }

        let targetPostElement = document.querySelector(POST_SELECTOR_ID_FORMAT(postId));
        let boardValue = null;
        const $linkContext = $link.closest(BOARD_CONTEXT_SELECTOR);
        if ($linkContext.length > 0) boardValue = $linkContext.data('board');
        else if (targetPostElement) {
            const $targetContext = $(targetPostElement).closest(BOARD_CONTEXT_SELECTOR);
            if ($targetContext.length > 0) boardValue = $targetContext.data('board');
        }

        if (targetPostElement && isElementInViewportStrict(targetPostElement)) {
            temporaryHighlight(targetPostElement);
            $link.removeClass(INLINE_ACTIVE_LINK_CLASS).removeAttr(LOADING_DATA_ATTR).removeAttr(ERROR_DATA_ATTR);
            return;
        }

        const $ancestors = $link.parents(`.${INLINE_CONTAINER_CLASS}`);
        if ($ancestors.filter(`[${INLINED_ID_ATTR}="${postId}"]`).length) {
            temporaryHighlight($ancestors.filter(`[${INLINED_ID_ATTR}="${postId}"]`).first());
            $link.removeClass(INLINE_ACTIVE_LINK_CLASS).removeAttr(LOADING_DATA_ATTR).removeAttr(ERROR_DATA_ATTR);
            return;
        }

        $link.addClass(INLINE_ACTIVE_LINK_CLASS).attr(LOADING_DATA_ATTR, "true");

        if (!targetPostElement && linkElement.href) {
            const postHtml = await fetchPostHtml(linkElement.href);
            if (postHtml) {
                const parsed = parseAndFindPost(postHtml, postId);
                if (parsed) targetPostElement = parsed;
            }
        }
        $link.removeAttr(LOADING_DATA_ATTR);

        if (targetPostElement) {
            const $container = $('<div>')
                .addClass(INLINE_CONTAINER_CLASS)
                .attr(INLINED_ID_ATTR, postId);

            const $mentionedSpan = $link.closest('span.mentioned.unimportant');

            let marginLeft = 0;
            if (!$mentionedSpan.length) {
                const $files = $mainPost.children('.files');
                const $img = $files.find('.file .post-image');
                if ($img.length && $img.css('display') !== 'none') {
                    marginLeft = parseInt($img[0]?.style.width) || $img[0]?.width || parseInt($img.attr('width')) || 0;
                } else {
                    const $fullImg = $files.find('.file .full-image');
                    if ($fullImg.length && $fullImg.css('display') !== 'none') {
                        marginLeft = parseInt($fullImg[0]?.style.width) || $fullImg[0]?.width || parseInt($fullImg.attr('width')) || 0;
                    }
                }
                $container.css('margin-left', marginLeft + 'px');
            }

            if ($mentionedSpan.length) {
                let $insertionAnchor = $mentionedSpan;
                const $linksInSpan = $mentionedSpan.find('a');
                const clickedLinkIndex = $linksInSpan.index($link);

                for (let i = clickedLinkIndex - 1; i >= 0; i--) {
                    const id = getPostIdFromLink($linksInSpan[i]);
                    if (id) {
                        const $containerForLink = $mainPost.find(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}="${id}"]`);
                        if ($containerForLink.length) {
                            $insertionAnchor = $containerForLink.first();
                            break;
                        }
                    }
                }
                $insertionAnchor.after($container);
            } else {
                $link.after($container);
            }

            let handled = false;
            if (window.g?.posts) {
                const boardID = boardValue;
                const postKey = `${boardID}.${postId}`;
                const postObj = g.posts.get(postKey);
                if (postObj && typeof postObj.addClone === 'function') {
                    const cloneObj = postObj.addClone($container[0], false);
                    $(cloneObj.nodes.root)
                        .addClass(CLONED_POST_CLASS)
                        .attr(PROCESSED_ATTR, 'true');
                    handled = true;
                }
            }
            if (!handled) {
                const cloned = targetPostElement.cloneNode(true);
                cloned.removeAttribute('id');
                cloned.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
                cloned.classList.add(CLONED_POST_CLASS);
                if (boardValue) cloned.setAttribute('data-board', boardValue);
                else cloned.setAttribute('data-board-missing', 'true');
                $container.append(cloned);
                cleanInlineContainer($container);
                initializeInlineHover(cloned);
                initializeInlineImageHover(cloned);
            }

            if (!$mentionedSpan.length) {
                $container.find('.inline-cloned-post')[0]?.style.setProperty('max-width', '100%', 'important');
                $container.find('.inline-cloned-post').css('box-sizing','border-box');
            }
        } else {
            $link.attr(ERROR_DATA_ATTR, "true").removeClass(INLINE_ACTIVE_LINK_CLASS);
            setTimeout(() => { $link.removeAttr(ERROR_DATA_ATTR); }, 3000);
        }
    }

    function initializeInlineHover(parentElement) {
        $(parentElement).find(SITE_HOVER_TARGET_SELECTOR).each(function() {
            const $link = $(this);
            if ($link.attr(HOVER_INITIALIZED_ATTR)) return;

            const $parentPost = $link.closest('.post.reply[id^="reply_"]');
            const parentPostId = $parentPost.length ? $parentPost[0].id.replace(/^reply_/, '') : null;

            const postId = getPostIdFromLink(this);

            if (parentPostId && postId && parentPostId === postId) {
                return;
            }

            let $preview = null;
            let targetPostId = null;
            let currentBoard = $(parentElement).closest(BOARD_CONTEXT_SELECTOR).data('board') || null;
            let fetchController = null;
            let mouseMoveTimer = null;

            function updatePreviewPosition(e) {
                if (!$preview) return;
                let top = e.pageY + 10; let left = e.pageX + 10;
                const win = $(window); const winHeight = win.height(); const winWidth = win.width();
                const previewHeight = $preview.outerHeight(); const previewWidth = $preview.outerWidth();
                const scrollTop = win.scrollTop(); const scrollLeft = win.scrollLeft();
                if (previewHeight > 0 && top + previewHeight > scrollTop + winHeight) top = e.pageY - previewHeight - 10;
                if (top < scrollTop) top = scrollTop + 5;
                if (previewWidth > 0 && left + previewWidth > scrollLeft + winWidth) left = e.pageX - previewWidth - 10;
                if (left < scrollLeft) left = scrollLeft + 5;
                $preview.css({ top: top, left: left });
            }

            function preparePreviewContent(sourceElement) {
                const clonedContent = sourceElement.cloneNode(true);
                clonedContent.removeAttribute('id'); clonedContent.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
                return clonedContent;
            }

            function createPreviewDiv(sourceElement, postId) {
                $(`div[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"]`).remove();
                const $previewContainer = $('<div>')
                    .addClass(SITE_PREVIEW_BASE_CLASSES)
                    .attr('id', CLONED_HOVER_PREVIEW_ID_PREFIX + postId)
                    .appendTo('body');
                if (sourceElement) {
                    if (sourceElement.classList.contains(SITE_PREVIEW_REPLY_CLASS)) $previewContainer.addClass(SITE_PREVIEW_REPLY_CLASS);
                    else if (sourceElement.classList.contains(SITE_PREVIEW_OP_CLASS)) $previewContainer.addClass(SITE_PREVIEW_OP_CLASS);
                    $previewContainer.append(preparePreviewContent(sourceElement));
                }
                return $previewContainer;
            }

            $link.on('mouseenter.iqhover', function(e) {
                if ($link.hasClass(INLINE_ACTIVE_LINK_CLASS)) return;
                targetPostId = getPostIdFromLink(this);
                const $parentInline = $link.parents(`.${INLINE_CONTAINER_CLASS}[${INLINED_ID_ATTR}]`);
                if ($parentInline.filter(`[${INLINED_ID_ATTR}="${targetPostId}"]`).length) {
                    return;
                }
                if (!targetPostId || !currentBoard) return;
                $(`div[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"]`).remove();
                const originalPostElement = document.querySelector(POST_SELECTOR_ID_FORMAT(targetPostId));
                if (originalPostElement && $(originalPostElement).closest(BOARD_CONTEXT_SELECTOR).data('board') === currentBoard) {
                    $preview = createPreviewDiv(originalPostElement, targetPostId);
                    updatePreviewPosition(e);
                } else {
                    const url = $link.attr('href'); if (!url) return;
                    $preview = createPreviewDiv(null, targetPostId);
                    $preview.addClass('loading-preview');
                    updatePreviewPosition(e);
                    if (fetchController) fetchController.abort();
                    const controller = new AbortController(); fetchController = controller;
                    const fetchUrl = url.split('#')[0];
                    GM_xmlhttpRequest({
                        method: "GET", url: fetchUrl, signal: controller.signal,
                        onload: function(response) {
                            if (controller.signal.aborted) return; fetchController = null;
                            if (response.status >= 200 && response.status < 300) {
                                const fetchedPostElement = parseAndFindPost(response.responseText, targetPostId);
                                if (fetchedPostElement) { if ($preview) { $preview.empty().removeClass('loading-preview loading-error').addClass(SITE_PREVIEW_BASE_CLASSES); if(fetchedPostElement.classList.contains(SITE_PREVIEW_REPLY_CLASS)) $preview.addClass(SITE_PREVIEW_REPLY_CLASS); else if(fetchedPostElement.classList.contains(SITE_PREVIEW_OP_CLASS)) $preview.addClass(SITE_PREVIEW_OP_CLASS); $preview.append(preparePreviewContent(fetchedPostElement)); updatePreviewPosition(e); } }
                                else { if ($preview) $preview.empty().removeClass('loading-preview').addClass('error-preview'); }
                            } else { if ($preview) $preview.empty().removeClass('loading-preview').addClass('error-preview'); }
                        },
                        onerror: function(response) { if (controller.signal.aborted) return; fetchController = null; if ($preview) $preview.empty().removeClass('loading-preview').addClass('error-preview'); },
                        ontimeout: function() { if (controller.signal.aborted) return; fetchController = null; if ($preview) $preview.empty().removeClass('loading-preview').addClass('error-preview'); }
                    });
                }
            }).on('mouseleave.iqhover', function(e) {
                if (fetchController) { fetchController.abort(); fetchController = null; }
                if ($preview) { $preview.remove(); $preview = null; }
                targetPostId = null;
            }).on('mousemove.iqhover', function(e) {
                clearTimeout(mouseMoveTimer);
                mouseMoveTimer = setTimeout(() => { updatePreviewPosition(e); }, 20);
            }).attr(HOVER_INITIALIZED_ATTR, 'true');
        });
    }

    function initializeInlineImageHover(parentElement) {
        const $container = $(parentElement);
        $container.find('a').each(function() {
            let href = this.href; if (!href) return;
            let realHref = href;
            const urlObj = new URL(href, window.location.origin);
            if (urlObj.pathname.endsWith('player.php') && urlObj.searchParams.has('v')) {
                realHref = urlObj.searchParams.get('v');
                if (!/^(https?:)?\/\//i.test(realHref)) realHref = window.location.origin + realHref;
            }
            if (!/\.(jpe?g|png|gif|webp|webm|mp4)(?:\?.*)?$/i.test(realHref)) return;

            const $link = $(this);
            if ($link.data('iq-image-hover')) return;
            $link.data('iq-image-hover', true);

            let $preview;
            function position(e) {
                if (!$preview) return;
                const winW = window.innerWidth, winH = window.innerHeight, el = $preview[0];
                const naturalW = el.naturalWidth || el.videoWidth || 0, naturalH = el.naturalHeight || el.videoHeight || 0; if (!naturalW||!naturalH) return;
                const scale = Math.min(1, (winW*0.97)/naturalW, (winH*0.97)/naturalH);
                const width = naturalW*scale, height = naturalH*scale;
                let left = e.clientX + 45, top = e.clientY - 45;
                if (left + width > winW) left = e.clientX - width - 45;
                if (top + height > winH) top = e.clientY - height;
                if (left < 0) left = 0; if (top < 0) top = 0;
                $preview.css({width,height,left,top});
            }

            $link.on('mouseenter.iqimagehover', function(e) {
                const isVideo = /\.(webm|mp4)$/i.test(realHref);
                if (isVideo && !iqSettings.enableVideoHoverPreview) return;

                if (isVideo) {
                    $preview = $('<video>', {src: realHref, autoplay: true, muted: true, loop: true});
                    const vol = getGlobalDefaultVolume();
                    $preview.prop('volume', vol);
                    $preview.on('loadedmetadata', () => position(e));
                } else {
                    $preview = $('<img>', {src: realHref}).on('load', () => position(e));
                }
                $preview.css({position:'fixed', zIndex:9999, pointerEvents:'none', maxWidth:'97vw', maxHeight:'97vh'}).appendTo('body');
            }).on('mousemove.iqimagehover', position).on('mouseleave.iqimagehover', function(){ if($preview) {$preview.remove(); $preview=null;} });
        });
    }

    document.documentElement.addEventListener('click', function(event) {
        const linkElement = event.target.closest('a');
        if (!linkElement) return;
        const postId = getPostIdFromLink(linkElement);
        if (!postId || !QUOTE_LINK_REGEX.test(linkElement.textContent?.trim() || '')) return;
        event.preventDefault(); event.stopImmediatePropagation();
        handleInlineQuoteClick(linkElement, postId);
    }, true);

    $(document).on('mouseenter', SITE_HOVER_TARGET_SELECTOR, function(event) {
        const linkElement = event.currentTarget;
        if ($(linkElement).hasClass(INLINE_ACTIVE_LINK_CLASS)) {
            if ($(event.target).closest(`div[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"]`).length > 0) return;
            event.stopImmediatePropagation();
        }
    });
    $(document).on('mouseleave', SITE_HOVER_TARGET_SELECTOR, function(event) {
        const linkElement = event.currentTarget;
        if ($(linkElement).hasClass(INLINE_ACTIVE_LINK_CLASS)) {
            if ($(event.relatedTarget).closest(`div[id^="${CLONED_HOVER_PREVIEW_ID_PREFIX}"]`).length > 0) return;
            event.stopImmediatePropagation();
        }
    });

    function runInitialProcessing() {
        if (!document.body) return;
        processLinks(document.body);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runInitialProcessing);
    } else {
        runInitialProcessing();
    }

    const observer = new MutationObserver(mutations => {
        if (!document.body) return;
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches(POTENTIAL_QUOTE_LINK_SELECTOR) || node.querySelector(POTENTIAL_QUOTE_LINK_SELECTOR)) {
                            processLinks(node);
                        }
                        let containerNode = null;
                        if (node.matches && node.matches(`.${INLINE_CONTAINER_CLASS}`)) containerNode = node;
                        else if (node.querySelector) containerNode = node.querySelector(`.${INLINE_CONTAINER_CLASS}`);
                        if(containerNode) {
                            const clonedPostElement = containerNode.querySelector(`.${CLONED_POST_CLASS}`);
                            if (clonedPostElement) {
                                initializeInlineHover(clonedPostElement);
                                initializeInlineImageHover(clonedPostElement);
                            }
                        }
                    }
                });
            }
        });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();