// ==UserScript==
// @name MyDealz Grafikpfad im Kommentar fixen
// @namespace http://tampermonkey.net/
// @version 1.3
// @description Korrigiert Bildpfade in Kommentaren, Antworten und Zusatzinfos bei Klick auf das fehlende Bild
// @author MD928835
// @license MIT
// @match https://www.mydealz.de/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/533859/MyDealz%20Grafikpfad%20im%20Kommentar%20fixen.user.js
// @updateURL https://update.greasyfork.org/scripts/533859/MyDealz%20Grafikpfad%20im%20Kommentar%20fixen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const commentListItemSelector = 'li.commentList-item';
    const commentArticleSelector = 'article.comment';
    const commentBodySelector = '.comment-body .userHtml-content';
    const replyItemSelector = '.comment-replies-item';
    const additionalInfoSelector = '.thread-infos';
    const additionalInfoContentSelector = '.userHtml-content';

    function fixClickedImage(img) {
        const originalSrc = img.getAttribute('src');
        const dataImageId = img.dataset.image;

        if (!originalSrc || !dataImageId) return;

        // Prüfen, ob es sich um ein Kommentar/Antwort-Bild oder Zusatzinfo-Bild handelt
        const isCommentImage = originalSrc.includes('static.mydealz.de/comments/');
        const isAdditionalInfoImage = originalSrc.includes('static.mydealz.de/thread_additional_info/');

        if ((!isCommentImage && !isAdditionalInfoImage) || originalSrc.split('/').pop().includes('_')) {
            return;
        }

        const srcMatch = originalSrc.match(/\/(\d+)(\.[^.\/]+)$/);
        if (!srcMatch || srcMatch[1] !== dataImageId) {
            return;
        }

        if (isCommentImage) {
            fixCommentImage(img, originalSrc, dataImageId);
        } else if (isAdditionalInfoImage) {
            fixAdditionalInfoImage(img, originalSrc, dataImageId);
        }
    }

    function fixCommentImage(img, originalSrc, dataImageId) {
        const commentArticle = img.closest(commentArticleSelector);
        if (!commentArticle) return;

        // Prüfen ob wir in einer Antwort sind
        const replyItem = commentArticle.closest(replyItemSelector);
        const isReply = replyItem !== null;

        let commentId;

        if (isReply) {
            // Bei Antworten: ID direkt aus dem data-id Attribut oder aus dem id-Attribut ohne "reply-" Präfix
            if (replyItem.hasAttribute('data-id')) {
                commentId = replyItem.getAttribute('data-id');
            } else if (replyItem.id && replyItem.id.startsWith('reply-')) {
                commentId = replyItem.id.replace('reply-', '');
            } else {
                return; // Keine ID gefunden, Abbruch
            }
        } else {
            // Für Hauptkommentare: bisherige Logik
            const commentLi = commentArticle.closest(commentListItemSelector);
            if (!commentLi || !commentLi.id || !commentLi.id.startsWith('comment-')) return;
            commentId = commentLi.id.replace('comment-', '');
        }

        const commentBody = commentArticle.querySelector(commentBodySelector);
        if (!commentBody) return;

        applyImageCorrection(img, originalSrc, commentBody, commentId);
    }

    function fixAdditionalInfoImage(img, originalSrc, dataImageId) {
        // Zusatzinfo-Container finden
        const additionalInfo = img.closest(additionalInfoSelector);
        if (!additionalInfo) return;

        // ID der Zusatzinfo ermitteln
        let infoId;

        // Versuche ID von Anker zu finden
        const anchorTarget = additionalInfo.querySelector('.anchorTarget');
        if (anchorTarget && anchorTarget.id && anchorTarget.id.startsWith('additional-info-')) {
            infoId = anchorTarget.id.replace('additional-info-', '');
        } else if (additionalInfo.id && additionalInfo.id.startsWith('additional-info-')) {
            infoId = additionalInfo.id.replace('additional-info-', '');
        } else if (window.location.hash && window.location.hash.startsWith('#additional-info-')) {
            // Alternativ aus Hash-Fragment extrahieren
            infoId = window.location.hash.replace('#additional-info-', '');
        } else {
            // Fallback: nach einem eindeutigen ID-Attribut mit additional-info suchen
            const infoElements = document.querySelectorAll('[id^="additional-info-"]');
            if (infoElements.length > 0) {
                infoId = infoElements[0].id.replace('additional-info-', '');
            } else {
                // Notfall-Fallback: zufällige ID
                infoId = 'info-' + Math.floor(Math.random() * 100000);
            }
        }

        const infoContent = additionalInfo.querySelector(additionalInfoContentSelector);
        if (!infoContent) return;

        applyImageCorrection(img, originalSrc, infoContent, infoId);
    }

    function applyImageCorrection(img, originalSrc, container, id) {
        const imagesInContainer = Array.from(container.querySelectorAll('img[data-image]'));
        let imgIndex = 0;
        let currentIdx = 0;

        for (const siblingImg of imagesInContainer) {
            const siblingSrc = siblingImg.getAttribute('src');
            const siblingDataImageId = siblingImg.dataset.image;
            const siblingFileName = siblingSrc?.split('/').pop();
            const siblingSrcMatch = siblingSrc?.match(/\/(\d+)(\.[^.\/]+)$/);

            if (siblingSrc && siblingDataImageId && !siblingFileName.includes('_') && siblingSrcMatch && siblingSrcMatch[1] === siblingDataImageId) {
                currentIdx++;
                if (siblingImg === img) {
                    imgIndex = currentIdx;
                    break;
                }
            }
        }

        if (imgIndex === 0) imgIndex = 1;

        const newName = `${id}_${imgIndex}`;
        let newSrc = originalSrc.replace(/\/(\d+)\/fs\//, `/${newName}/fs/`);
        newSrc = newSrc.replace(/\/(\d+)(\.[^.\/]+)$/, `/${newName}$2`);

        if (newSrc !== originalSrc) {
            img.setAttribute('src', newSrc);
            if (img.dataset.src === originalSrc) img.dataset.src = newSrc;
            if (img.srcset && img.srcset.includes(originalSrc)) {
                const oldSrcEscaped = originalSrc.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                img.srcset = img.srcset.replace(new RegExp(oldSrcEscaped, 'g'), newSrc);
            }
            img.removeEventListener('click', handleClick);
        }
    }

    function handleClick(event) {
        if (event.target.tagName === 'IMG') {
            const img = event.target;
            const src = img.getAttribute('src');
            if (src &&
                (src.includes('static.mydealz.de/comments/') ||
                 src.includes('static.mydealz.de/thread_additional_info/')) &&
                img.dataset.image &&
                !src.split('/').pop().includes('_')) {
                if (img.naturalWidth === 0) {
                    fixClickedImage(img);
                }
            }
        }
    }

    document.body.addEventListener('click', handleClick);
})();
