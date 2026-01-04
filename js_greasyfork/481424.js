// ==UserScript==
// @name         Merge Atlantis Comments
// @namespace    http://tampermonkey.net/
// @version      2023-12-04
// @description  Merges concurrent comments by atlantisvoxel on GitHub pull requests
// @author       Walker Hildebrand (wbhildeb)
// @match        https://github.com/*/pull/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481424/Merge%20Atlantis%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/481424/Merge%20Atlantis%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const noisyLineRegexes = [
        /*

        /\[id=.+\]$/,
        /: Reading\.\.\.$/,

        */
    ]

    function getAllCommentBlocks(parent) {
        return parent.querySelectorAll('.timeline-comment');
    }

    function getAuthorOfCommentBlock(commentBlock) {
        return commentBlock.querySelector('.author').innerText.trim();
    }

    function isAtlantisComment(commentBlock) {
        return getAuthorOfCommentBlock(commentBlock).startsWith('atlantis')
    }

    function getTruncationTextElement(commentBlock) {
        const elem = commentBlock.querySelector('.comment-body p:last-child');
        if (elem != null && elem.innerText.trim() !== 'Warning: Output length greater than max comment size. Continued in next comment.') {
            return null
        }

        return elem
    }

    function isTruncatedCommentBlock(commentBlock) {
        return getTruncationTextElement(commentBlock) != null
    }

    function getContinuationTextElement(commentBlock) {
        const elem = commentBlock.querySelector('.comment-body p:first-child')
        if (elem != null && elem.innerText.trim() !== 'Continued plan output from previous comment.') {
            return null
        }

        return elem
    }

    function isContiuationCommentBlock(commentBlock) {
        return getContinuationTextElement(commentBlock) != null
    }

    function getOutputElements(commentBlock) {
        return commentBlock.querySelectorAll('pre')
    }

    function removeNoisyLines(outputElement) {
        const lines = outputElement.innerHTML.split('\n');

        const filteredLines = lines.filter(line => {
            return !noisyLineRegexes.some(regex => regex.test(line.trim()));
        });

        outputElement.innerHTML = filteredLines.join('\n');
    }

    function mergeCommentBlocks(curBlock, nxtBlock) {
        // Remove "Warning: Output length greater than max comment size. Continued in next comment."
        const truncationElement = getTruncationTextElement(curBlock)
        truncationElement.previousElementSibling.remove() // remove the break
        truncationElement.remove()

        // Remove "Continued plan output from previous comment."
        getContinuationTextElement(nxtBlock).remove()

        // Merge continued outputs
        const curBlockOutputs = getOutputElements(curBlock)
        const nxtBlockOutputs = getOutputElements(nxtBlock)
        if (curBlockOutputs.length > 0 && nxtBlockOutputs.length > 0) {
            const curOutputElem = curBlockOutputs[curBlockOutputs.length-1]
            const nxtOutputElem = nxtBlockOutputs[0]

            curOutputElem.innerHTML = curOutputElem.innerHTML.trim() + nxtOutputElem.innerHTML.trim()

            nxtBlockOutputs[0].closest('details').remove()
        }

        // Merge the rest of the comment
        const curBodyElem = curBlock.querySelector('.comment-body');
        const nxtBodyElem = nxtBlock.querySelector('.comment-body');
        curBodyElem.innerHTML = curBodyElem.innerHTML.trim() + nxtBodyElem.innerHTML.trim()
        nxtBlock.closest('.js-timeline-item').remove();
    }

    function concatenateCommentBodies(commentBlocks) {
        for (let i = 0; i < commentBlocks.length -1; ) {
            const curBlock = commentBlocks[i];
            const nxtBlock = commentBlocks[i+1];

            const curIsTruncated = isTruncatedCommentBlock(curBlock);
            const nxtIsContinuation = isContiuationCommentBlock(nxtBlock);

            // Check if we should merge
            if (!curIsTruncated || !nxtIsContinuation) {
                i++
                continue
            }

            // Merge the output blocks
            mergeCommentBlocks(curBlock, nxtBlock)

            getOutputElements(curBlock).forEach(elem => {
                removeNoisyLines(elem)
            })

            commentBlocks.splice(i+1,1)
        }
    }

    function onLoad() {
        const commentBlocks = Array.from(getAllCommentBlocks(document)).filter(isAtlantisComment);

        concatenateCommentBodies(commentBlocks)
    }

    window.addEventListener('load', onLoad);
})();
