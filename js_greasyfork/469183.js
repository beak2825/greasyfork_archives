// ==UserScript==
// @name         Equestria Daily Slideshow
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      MPL v2.0
// @description  Create a fullscreen slideshow for Equestria Daily Drawfriend posts
// @author       Medo
// @match        https://www.equestriadaily.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469183/Equestria%20Daily%20Slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/469183/Equestria%20Daily%20Slideshow.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if (!document.querySelector('.post-body img')) return;

    GM_addStyle(`
        .slideshow-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000000;
            overflow: hidden;
            background: #000;
        }

        .image-set {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            z-index: 10;
            width: 100%;
            height: 100%;
            background: #000;
        }

        .image-set.hiddenses {
            opacity: 0;
            filter: blur(200px);
            z-index: 11;
            pointer-events: none;
        }

        .image-set.hiddenses .info-panel {
            pointer-events: none;
        }

        .image-layer {
            position: absolute;
        }

        .image-layer img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: none;
            justify-content: center;
            align-items: center;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 20;
        }

        .overlay-message {
            color: white;
            font-size: 2rem;
            text-shadow: 2px 2px black;
            white-space: nowrap;
        }

        /* Spoiler Overlay */
        .spoiler-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 22;
            cursor: pointer;
            transition: opacity 0.4s ease;
        }

        .spoiler-overlay.revealed {
            opacity: 0;
            pointer-events: none;
        }

        .spoiler-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }

        .spoiler-text {
            color: #fff;
            font-size: 1.3rem;
            margin-bottom: 10px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .spoiler-caption {
            color: rgba(255,255,255,0.6);
            font-size: 1rem;
            margin-bottom: 25px;
            max-width: 60%;
            text-align: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .spoiler-hint {
            color: rgba(255,255,255,0.4);
            font-size: 0.85rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .spoiler-hint kbd {
            background: rgba(255,255,255,0.15);
            padding: 3px 8px;
            border-radius: 4px;
            margin: 0 3px;
        }

        /* Info Panel Styles */
        .info-panel {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
            padding: 50px 20px 20px;
            z-index: 25;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            opacity: 1;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: auto;
        }

        .info-panel.hidden {
            opacity: 0;
            transform: translateY(20px);
            pointer-events: none;
        }

        .info-caption {
            color: #fff;
            font-size: 1.3rem;
            font-weight: 500;
            text-align: center;
            text-shadow: 1px 1px 4px rgba(0,0,0,0.9);
            max-width: 80%;
            line-height: 1.5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .info-row {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .info-source {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #fff !important;
            font-size: 1rem;
            text-decoration: none;
            padding: 10px 20px;
            background: rgba(80, 80, 100, 0.5);
            border-radius: 25px;
            transition: background 0.2s, transform 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            border: 1px solid rgba(255,255,255,0.15);
        }

        .info-source:hover {
            background: rgba(100, 100, 130, 0.95);
            transform: scale(1.05);
        }

        .info-source-icon {
            font-size: 1.1rem;
        }

        .info-counter {
            color: rgba(255,255,255,0.5);
            font-size: 0.9rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            white-space: nowrap;
        }

        /* External Image Notice (for non-image URLs) */
        .external-notice {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(20, 20, 30, 0.95);
            padding: 40px 50px;
            border-radius: 16px;
            text-align: center;
            z-index: 30;
            border: 1px solid rgba(255,255,255,0.1);
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }

        .external-notice h3 {
            color: #fff;
            margin: 0 0 12px;
            font-size: 1.5rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .external-notice p {
            color: rgba(255,255,255,0.6);
            margin: 0 0 25px;
            font-size: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .external-link-btn {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #fff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 1rem;
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .external-link-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        /* Controls */
        .slideshow-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000001;
            display: flex;
            gap: 10px;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .slideshow-controls.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .slideshow-btn {
            background: rgba(60, 60, 70, 0.9);  /* Was rgba(0,0,0,0.6) */
            border: 1px solid rgba(255,255,255,0.3);  /* Was 0.2 */
            color: #fff !important;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s, border-color 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .slideshow-btn:hover {
            background: rgba(255,255,255,0.15);
            border-color: rgba(255,255,255,0.4);
        }

        .slideshow-btn.active {
            background: rgba(255,255,255,0.2);
            border-color: rgba(255,255,255,0.5);
        }

        /* Navigation Arrows */
        .nav-arrow {
            position: fixed;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1000001;
            background: rgba(0,0,0,0.4);
            border: none;
            color: rgba(255,255,255,0.7);
            font-size: 2.5rem;
            padding: 20px 15px;
            cursor: pointer;
            transition: background 0.2s, color 0.2s, opacity 0.3s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }

        .nav-arrow span {
            display: block;
            margin-top: -4px;
        }

        .nav-arrow:hover {
            background: rgba(0,0,0,0.7);
            color: #fff;
        }

        .nav-arrow.left {
            left: 0;
            border-radius: 0 8px 8px 0;
        }

        .nav-arrow.right {
            right: 0;
            border-radius: 8px 0 0 8px;
        }

        .nav-arrow.auto-hide {
            opacity: 0;
        }

        .slideshow-container:hover .nav-arrow.auto-hide {
            opacity: 1;
        }

        /* Keyboard Hint */
        .keyboard-hint {
            position: fixed;
            bottom: 15px;
            right: 20px;
            color: rgba(255,255,255,0.3);
            font-size: 0.75rem;
            z-index: 1000001;
            pointer-events: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            opacity: 1;
            transition: opacity 0.3s ease;
            text-align: right;
        }

        .keyboard-hint.hidden {
            opacity: 0;
        }

        .keyboard-hint kbd {
            background: rgba(255,255,255,0.1);
            padding: 2px 6px;
            border-radius: 4px;
            margin: 0 2px;
        }
    `);

    // ========== EXTRACTION FUNCTION ==========
    function extractDrawfriendEntries(root) {
        root = root || document.querySelector('.post-body.entry-content') || document.body;

        var entries = [];
        var dataSourceInfo = buildDataSourceInfo(root);
        var seenExternalAnchors = new Set();

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null, false);

        while (walker.nextNode()) {
            var node = walker.currentNode;
            var tag = node.tagName;

            if (tag === 'IMG') {
                if (isAvatar(node)) continue;
                var imgEntry = buildEntryFromImage(node);
                if (imgEntry) entries.push(imgEntry);
            }
            else if (tag === 'A') {
                var a = node;
                if (seenExternalAnchors.has(a)) continue;

                var href = a.getAttribute('href') || '';
                if (!href) continue;

                if (isImageUrl(href) && !a.querySelector('img')) {
                    var externalEntry = buildEntryFromExternalAnchor(a);
                    if (externalEntry) {
                        entries.push(externalEntry);
                        seenExternalAnchors.add(a);
                    }
                }
            }
        }

        return entries;

        function buildDataSourceInfo(root) {
            var map = Object.create(null);
            var anchors = root.querySelectorAll('a[data-source]');

            for (var i = 0; i < anchors.length; i++) {
                var a = anchors[i];
                var key = a.getAttribute('data-source');
                if (!key) continue;

                if (!map[key]) {
                    map[key] = { source_url: null, caption_bold: null, anchors: [] };
                }
                var info = map[key];
                info.anchors.push(a);

                var href = a.getAttribute('href') || '';

                if (!isImageUrl(href) && !isImageHost(href)) {
                    if (!info.source_url) info.source_url = href;
                    if (!info.caption_bold) {
                        var capEl = findCaptionBoldAfter(a);
                        if (capEl) info.caption_bold = cleanText(capEl.textContent || '');
                    }
                }
            }
            return map;
        }

        function findCaptionBoldAfter(anchor) {
            var container = anchor.parentElement || anchor;
            var node = container.nextSibling;

            while (node) {
                if (node.nodeType === 1) {
                    var el = node;
                    if (el.tagName === 'B') return el;
                    if (el.tagName === 'P') {
                        var b = el.querySelector('b');
                        if (b) return b;
                    }
                    if (el.tagName === 'HR') break;
                }
                node = node.nextSibling;
            }
            return null;
        }

        function buildEntryFromImage(img) {
            var imgUrl = img.currentSrc || img.src;
            if (!imgUrl) return null;

            var anchor = img.closest('a');
            var ds = null;

            if (anchor && anchor.hasAttribute('data-source')) {
                ds = anchor.getAttribute('data-source');
            }

            if (!ds) {
                ds = matchDataSourceKeyForUrl(imgUrl, dataSourceInfo);
                if (!ds && anchor && anchor.getAttribute('href')) {
                    ds = matchDataSourceKeyForUrl(anchor.getAttribute('href'), dataSourceInfo);
                }
            }

            var info = ds && dataSourceInfo[ds] ? dataSourceInfo[ds] : null;
            var sourceUrl = info && info.source_url ? info.source_url : null;

            var orphanInfo = null;
            if (!sourceUrl) {
                orphanInfo = findOrphanSourceForImage(img);
                if (orphanInfo && orphanInfo.anchor && orphanInfo.anchor.getAttribute('href')) {
                    sourceUrl = orphanInfo.anchor.getAttribute('href');
                }
            }

            var caption = null;
            if (info && info.caption_bold) caption = info.caption_bold;
            if (!caption && orphanInfo && orphanInfo.caption) caption = orphanInfo.caption;
            if (!caption) {
                var alt = img.getAttribute('alt') || '';
                caption = cleanText(alt);
            }
            if (!caption) caption = null;

            return { img_url: imgUrl, external_url: null, source_url: sourceUrl || null, caption: caption };
        }

        function buildEntryFromExternalAnchor(a) {
            var href = a.getAttribute('href') || '';
            if (!href) return null;

            var ds = a.getAttribute('data-source');
            if (!ds) ds = matchDataSourceKeyForUrl(href, dataSourceInfo);

            var info = ds && dataSourceInfo[ds] ? dataSourceInfo[ds] : null;
            var sourceUrl = info && info.source_url ? info.source_url : null;

            var captionParts = [];
            var text = cleanText(a.textContent || '');

            if (text && !/\[\s*\d+\s*\]\s*source/i.test(text) && text.toLowerCase() !== 'source') {
                captionParts.push(text);
            }

            if (info && info.caption_bold) {
                if (captionParts.indexOf(info.caption_bold) === -1) {
                    captionParts.push(info.caption_bold);
                }
            }

            var caption = captionParts.length ? captionParts.join(' – ') : null;

            return { img_url: null, external_url: href, source_url: sourceUrl || null, caption: caption };
        }

        function findOrphanSourceForImage(img) {
            var container = img.closest('.separator') || img.parentElement;
            if (!container) return { anchor: null, caption: null };

            var el = container;
            while (el && el !== root) {
                var prev = el.previousElementSibling;
                while (prev) {
                    var tag = prev.tagName;
                    if (tag === 'HR') return { anchor: null, caption: null };
                    if (tag === 'BR') { prev = prev.previousElementSibling; continue; }

                    var candidateAnchor = null;
                    if (prev.tagName === 'A') candidateAnchor = prev;
                    else if (prev.querySelector) candidateAnchor = prev.querySelector('a');

                    if (candidateAnchor && !candidateAnchor.hasAttribute('data-source')) {
                        var t = cleanText(candidateAnchor.textContent || '');
                        if (t && !/\[\s*\d+\s*\]\s*source/i.test(t)) {
                            return { anchor: candidateAnchor, caption: t };
                        }
                    }
                    prev = prev.previousElementSibling;
                }
                el = el.parentElement;
            }
            return { anchor: null, caption: null };
        }

        function matchDataSourceKeyForUrl(url, map) {
            if (!url) return null;
            for (var key in map) {
                if (Object.prototype.hasOwnProperty.call(map, key)) {
                    if (url.indexOf(key) !== -1) return key;
                }
            }
            return null;
        }

        function isImageUrl(url) {
            if (!url) return false;
            return /\.(jpe?g|png|gif|webp|avif|bmp)(\?|#|$)/i.test(url);
        }

        function isImageHost(url) {
            if (!url) return false;
            return url.indexOf('imagehosting.equestriadaily.com') !== -1 ||
                   url.indexOf('blogger.googleusercontent.com') !== -1;
        }

        function cleanText(str) {
            if (!str) return '';
            return str.replace(/\s+/g, ' ').replace(/\u00a0/g, ' ').trim();
        }

        function isAvatar(img) {
            var alt = (img.getAttribute('alt') || '').toLowerCase();
            if (alt.indexOf('avatar') !== -1) return true;

            var style = img.getAttribute('style') || '';
            var hasRound = style.indexOf('border-radius') !== -1 && style.indexOf('50%') !== -1;

            var hAttr = img.getAttribute('height') || img.style.height || '';
            var wAttr = img.getAttribute('width') || img.style.width || '';
            var h = parseInt(hAttr, 10) || 0;
            var w = parseInt(wAttr, 10) || 0;

            if (hasRound && h && h <= 80 && w && w <= 80) return true;

            var parentDiv = img.closest('div');
            if (parentDiv) {
                var txt = (parentDiv.textContent || '').toLowerCase();
                if (txt.indexOf('follow') !== -1 && txt.indexOf('on') !== -1) return true;
            }
            return false;
        }
    }

    // ========== HELPER FUNCTIONS ==========
    function isDirectImageUrl(url) {
        if (!url) return false;
        return /\.(jpe?g|png|gif|webp|avif|bmp)(\?|#|$)/i.test(url);
    }

    function getSourceDomain(url) {
        if (!url) return null;
        try {
            const hostname = new URL(url).hostname.replace('www.', '');
            return hostname;
        } catch (e) {
            return null;
        }
    }

    function getSourceIcon(url) {
        const domain = getSourceDomain(url);
        if (!domain) return '🔗';

        if (domain.includes('deviantart')) return '🎨';
        if (domain.includes('twitter') || domain.includes('x.com')) return '𝕏';
        if (domain.includes('tumblr')) return '📝';
        if (domain.includes('derpibooru')) return '🦄';
        if (domain.includes('furaffinity')) return '🐾';
        if (domain.includes('inkbunny')) return '🐰';
        if (domain.includes('pixiv')) return '🖼️';
        if (domain.includes('artstation')) return '🎭';
        if (domain.includes('patreon')) return '🎁';
        if (domain.includes('ko-fi')) return '☕';
        if (domain.includes('newgrounds')) return '🎬';
        return '🔗';
    }

    function getSourceName(url) {
        const domain = getSourceDomain(url);
        if (!domain) return 'View Source';

        if (domain.includes('deviantart')) return 'DeviantArt';
        if (domain.includes('twitter')) return 'Twitter';
        if (domain.includes('x.com')) return 'X (Twitter)';
        if (domain.includes('tumblr')) return 'Tumblr';
        if (domain.includes('derpibooru')) return 'Derpibooru';
        if (domain.includes('furaffinity')) return 'FurAffinity';
        if (domain.includes('inkbunny')) return 'Inkbunny';
        if (domain.includes('pixiv')) return 'Pixiv';
        if (domain.includes('artstation')) return 'ArtStation';
        if (domain.includes('patreon')) return 'Patreon';
        if (domain.includes('ko-fi')) return 'Ko-fi';
        if (domain.includes('newgrounds')) return 'Newgrounds';
        return domain;
    }

    // ========== PROCESS ENTRIES ==========
    const rawEntries = extractDrawfriendEntries();

    // Process entries: convert direct image external URLs to spoilered images
    const displayableEntries = rawEntries
        .filter(e => e.img_url || e.external_url)
        .map(e => {
            // If no img_url but external_url is a direct image, convert it
            if (!e.img_url && e.external_url && isDirectImageUrl(e.external_url)) {
                return {
                    ...e,
                    img_url: e.external_url,
                    external_url: null,
                    is_spoilered: true
                };
            }
            return { ...e, is_spoilered: false };
        });

    if (displayableEntries.length === 0) return;

    // Track which indices have been unspoilered
    let revealedSpoilers = new Set();

    let currentIndex = 0;
    let slideshowContainer;
    let controlsContainer;
    let keyboardHint;
    let leftArrow, rightArrow;
    let previousImageSet, activeImageSet, nextImageSet;
    let infoVisible = true;

    // ========== SLIDESHOW FUNCTIONS ==========
    function createSlideshow() {
        slideshowContainer = document.createElement('div');
        slideshowContainer.className = 'slideshow-container';

        previousImageSet = createImageSet('image-set hiddenses');
        activeImageSet = createImageSet('image-set');
        nextImageSet = createImageSet('image-set hiddenses');

        prepareSet(previousImageSet, displayableEntries.length - 1);
        prepareSet(activeImageSet, 0);
        prepareSet(nextImageSet, 1 % displayableEntries.length);

        slideshowContainer.appendChild(previousImageSet);
        slideshowContainer.appendChild(activeImageSet);
        slideshowContainer.appendChild(nextImageSet);

        // Add controls
        controlsContainer = document.createElement('div');
        controlsContainer.className = 'slideshow-controls';

        const infoBtn = document.createElement('button');
        infoBtn.className = 'slideshow-btn active';
        infoBtn.textContent = '📋 Info';
        infoBtn.title = 'Toggle info panel (I)';
        infoBtn.addEventListener('click', toggleInfo);
        controlsContainer.appendChild(infoBtn);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'slideshow-btn';
        closeBtn.textContent = '✕ Close';
        closeBtn.title = 'Close slideshow (Esc)';
        closeBtn.addEventListener('click', closeSlideshow);
        controlsContainer.appendChild(closeBtn);

        // Navigation arrows
        leftArrow = document.createElement('button');
        leftArrow.className = 'nav-arrow left';
        leftArrow.innerHTML = '<span>‹</span>';
        leftArrow.title = 'Previous (←)';
        leftArrow.addEventListener('click', previousImage);

        rightArrow = document.createElement('button');
        rightArrow.className = 'nav-arrow right';
        rightArrow.innerHTML = '<span>›</span>';
        rightArrow.title = 'Next (→)';
        rightArrow.addEventListener('click', nextImage);

        // Keyboard hint
        keyboardHint = document.createElement('div');
        keyboardHint.className = 'keyboard-hint';
        keyboardHint.innerHTML = '<kbd>←</kbd> <kbd>→</kbd> Navigate • <kbd>I</kbd> Toggle Info • <kbd>S</kbd> Reveal Spoiler • <kbd>Esc</kbd> Close';

        document.body.appendChild(slideshowContainer);
        document.body.appendChild(controlsContainer);
        document.body.appendChild(leftArrow);
        document.body.appendChild(rightArrow);
        document.body.appendChild(keyboardHint);
    }

    function createImageSet(classNames) {
        var imageSet = document.createElement('div');
        imageSet.className = classNames;

        // Background blur layers
        for (let i = 7; i >= -7; i -= 2) {
            createLayer(imageSet, Math.pow(1.7, i) / 20, Math.pow(2, i) / 30);
        }
        createLayer(imageSet, 0, 0);

        // Overlay for wrap-around message
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        imageSet.appendChild(overlay);

        // Spoiler overlay
        const spoilerOverlay = document.createElement('div');
        spoilerOverlay.className = 'spoiler-overlay';
        spoilerOverlay.style.display = 'none';
        spoilerOverlay.innerHTML = `
            <div class="spoiler-icon">🔒</div>
            <div class="spoiler-text">External Image</div>
            <div class="spoiler-caption"></div>
            <div class="spoiler-hint">Click or press <kbd>S</kbd> to reveal</div>
        `;
        spoilerOverlay.addEventListener('click', revealCurrentSpoiler);
        imageSet.appendChild(spoilerOverlay);

        // External image notice (for non-image URLs)
        const externalNotice = document.createElement('div');
        externalNotice.className = 'external-notice';
        externalNotice.style.display = 'none';
        imageSet.appendChild(externalNotice);

        // Info panel
        const infoPanel = document.createElement('div');
        infoPanel.className = 'info-panel';

        const caption = document.createElement('div');
        caption.className = 'info-caption';
        infoPanel.appendChild(caption);

        const infoRow = document.createElement('div');
        infoRow.className = 'info-row';

        const sourceLink = document.createElement('a');
        sourceLink.className = 'info-source';
        sourceLink.target = '_blank';
        sourceLink.rel = 'noopener noreferrer';
        infoRow.appendChild(sourceLink);

        const counter = document.createElement('div');
        counter.className = 'info-counter';
        infoRow.appendChild(counter);

        infoPanel.appendChild(infoRow);
        imageSet.appendChild(infoPanel);

        return imageSet;
    }

    function createLayer(imageSet, blurscale, scale) {
        const layer = document.createElement('div');
        layer.className = 'image-layer';
        layer.style.filter = `blur(calc(min(${blurscale * 50}vh, ${blurscale * 50}vw)))`;
        layer.style.width = `${100 * scale + 100}vw`;
        layer.style.height = `${100 * scale + 100}vh`;

        const img = document.createElement('img');
        layer.appendChild(img);

        imageSet.appendChild(layer);
    }

    function prepareSet(imageSet, imageIndex) {
        const entry = displayableEntries[imageIndex];
        const layers = imageSet.querySelectorAll('.image-layer img');
        const infoPanel = imageSet.querySelector('.info-panel');
        const caption = infoPanel.querySelector('.info-caption');
        const sourceLink = infoPanel.querySelector('.info-source');
        const counter = infoPanel.querySelector('.info-counter');
        const externalNotice = imageSet.querySelector('.external-notice');
        const spoilerOverlay = imageSet.querySelector('.spoiler-overlay');

        // Store the index on the image set for reference
        imageSet.dataset.imageIndex = imageIndex;

        // Hide overlays by default
        imageSet.querySelector('.overlay').style.display = 'none';
        externalNotice.style.display = 'none';
        spoilerOverlay.style.display = 'none';
        spoilerOverlay.classList.remove('revealed');

        // Handle different entry types
        if (!entry.img_url && entry.external_url) {
            // Non-image external URL - show notice card
            layers.forEach((img) => { img.src = ''; });
            externalNotice.style.display = 'block';
            externalNotice.innerHTML = `
                <h3>🔗 External Link</h3>
                <p>${entry.caption || 'This content is hosted externally'}</p>
                <a href="${entry.external_url}" target="_blank" rel="noopener noreferrer" class="external-link-btn">
                    Open Link ↗
                </a>
            `;
        } else if (entry.img_url) {
            // Has image - load it
            layers.forEach((img) => {
                img.src = entry.img_url;
            });

            // Check if this is a spoilered image
            if (entry.is_spoilered && !revealedSpoilers.has(imageIndex)) {
                spoilerOverlay.style.display = 'flex';
                const spoilerCaption = spoilerOverlay.querySelector('.spoiler-caption');
                spoilerCaption.textContent = entry.caption || 'Click to reveal this externally-linked image';
            }
        }

        // Update info panel
        if (entry.caption) {
            caption.textContent = entry.caption;
            caption.style.display = '';
        } else {
            caption.style.display = 'none';
        }

        if (entry.source_url) {
            const icon = getSourceIcon(entry.source_url);
            const name = getSourceName(entry.source_url);
            sourceLink.innerHTML = `<span class="info-source-icon">${icon}</span> ${name}`;
            sourceLink.href = entry.source_url;
            sourceLink.style.display = '';
        } else {
            sourceLink.style.display = 'none';
        }

        counter.textContent = `${imageIndex + 1} / ${displayableEntries.length}`;

        // Apply info visibility state
        if (!infoVisible) {
            infoPanel.classList.add('hidden');
        } else {
            infoPanel.classList.remove('hidden');
        }
    }

    function revealCurrentSpoiler() {
        const idx = parseInt(activeImageSet.dataset.imageIndex, 10);
        const entry = displayableEntries[idx];

        // Only works on spoilered entries
        if (!entry.is_spoilered) return;

        const spoilerOverlay = activeImageSet.querySelector('.spoiler-overlay');

        if (revealedSpoilers.has(idx)) {
            // Re-hide
            revealedSpoilers.delete(idx);
            spoilerOverlay.classList.remove('revealed');
        } else {
            // Reveal
            revealedSpoilers.add(idx);
            spoilerOverlay.classList.add('revealed');
        }
    }

    function switchImageSets(direction) {
        activeImageSet.style.transition = 'opacity 0.7s, filter 0.7s ease-in';
        activeImageSet.classList.add('hiddenses');
        activeImageSet.style.zIndex = 11;

        if (direction === 'forward') {
            [previousImageSet, activeImageSet, nextImageSet] = [activeImageSet, nextImageSet, previousImageSet];
            const newIndex = (currentIndex + 1) % displayableEntries.length;
            prepareSet(nextImageSet, newIndex);
            if (newIndex === 0) {
                nextImageSet.querySelector('.overlay').style.display = 'flex';
                nextImageSet.querySelector('.overlay').innerHTML = '<div class="overlay-message">🔄 Back to the beginning!</div>';
            }
            nextImageSet.style.zIndex = 9;
        } else {
            [previousImageSet, activeImageSet, nextImageSet] = [nextImageSet, previousImageSet, activeImageSet];
            const newIndex = (currentIndex - 1 + displayableEntries.length) % displayableEntries.length;
            prepareSet(previousImageSet, newIndex);
            if (currentIndex === 0) {
                previousImageSet.querySelector('.overlay').style.display = 'flex';
                previousImageSet.querySelector('.overlay').innerHTML = '<div class="overlay-message">🔄 Jumped to end!</div>';
            }
            previousImageSet.style.zIndex = 9;
        }

        activeImageSet.style.transition = 'filter 0.7s ease';
        activeImageSet.classList.remove('hiddenses');
        activeImageSet.style.zIndex = 10;
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % displayableEntries.length;
        switchImageSets('forward');
    }

    function previousImage() {
        currentIndex = (currentIndex - 1 + displayableEntries.length) % displayableEntries.length;
        switchImageSets('backwards');
    }

    function toggleInfo() {
        infoVisible = !infoVisible;
        const panels = document.querySelectorAll('.info-panel');
        const btn = controlsContainer.querySelector('.slideshow-btn');

        panels.forEach(panel => {
            if (infoVisible) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });

        // Toggle controls visibility
        if (infoVisible) {
            controlsContainer.classList.remove('hidden');
            keyboardHint.classList.remove('hidden');
            leftArrow.classList.remove('auto-hide');
            rightArrow.classList.remove('auto-hide');
        } else {
            controlsContainer.classList.add('hidden');
            keyboardHint.classList.add('hidden');
            leftArrow.classList.add('auto-hide');
            rightArrow.classList.add('auto-hide');
        }

        if (btn) {
            btn.classList.toggle('active', infoVisible);
        }
    }

    function closeSlideshow() {
        slideshowContainer.style.transition = 'opacity 0.5s';
        slideshowContainer.style.opacity = '0';
        controlsContainer.style.transition = 'opacity 0.5s';
        controlsContainer.style.opacity = '0';
        leftArrow.style.transition = 'opacity 0.5s';
        leftArrow.style.opacity = '0';
        rightArrow.style.transition = 'opacity 0.5s';
        rightArrow.style.opacity = '0';
        keyboardHint.style.transition = 'opacity 0.5s';
        keyboardHint.style.opacity = '0';

        document.querySelector("html").style.overflow = "";
        document.removeEventListener('keydown', handleKeydown);

        // Remove all slideshow elements
        setTimeout(() => {
            slideshowContainer.remove();
            controlsContainer.remove();
            leftArrow.remove();
            rightArrow.remove();
            keyboardHint.remove();
        }, 500);
    }

    function handleKeydown(event) {
        if (event.key === 'ArrowRight') {
            nextImage();
        } else if (event.key === 'ArrowLeft') {
            previousImage();
        } else if (event.key === 'Escape') {
            closeSlideshow();
        } else if (event.key.toLowerCase() === 'i') {
            toggleInfo();
        } else if (event.key.toLowerCase() === 's') {
            revealCurrentSpoiler();
        }
    }

    function runScript() {
        revealedSpoilers.clear();
        currentIndex = 0;
        infoVisible = true;
        createSlideshow();
        document.querySelector("html").style.overflow = "hidden";
        document.addEventListener('keydown', handleKeydown);
    }

    function addButton() {
        const button = document.createElement('button');
        button.textContent = `🎠 Slideshow (${displayableEntries.length} images)`;
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        `;
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });
        button.addEventListener('click', runScript);
        document.body.appendChild(button);
    }

    addButton();
})();