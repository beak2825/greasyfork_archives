// ==UserScript==
// @namespace https://trajano.net
// @name     Remove annoying users from StackOverflow
// @description Masks out the comments and the names of users you don't like on StackOverflow
// @version  1
// @include  https://stackoverflow.com/*
// @grant    none
// @license EPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/498205/Remove%20annoying%20users%20from%20StackOverflow.user.js
// @updateURL https://update.greasyfork.org/scripts/498205/Remove%20annoying%20users%20from%20StackOverflow.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const ids = [-1, 1507691, 216691, 3001761, 4216641];
    const selector = ids.map(( id ) => `[data-comment-owner-id="${id}"]`);
    const styles = `
        ${selector.map( s => `${s} .comment-copy > *`)},
				${selector.map( s => `${s} .comment-date > *`)} {
            color: transparent;
            background: rgba(0, 0, 0, 0.15);
        }
        ${selector.map( s => `${s} div a.comment-user`)} {
            display: none;
        }
    `;

    document.head.appendChild(
        document.createElement("style")
    ).innerHTML = styles;

    function maskComments () {
        document.querySelectorAll(selector.join(',')).forEach(createMask);
    }

    function createMask ( element ) {
        const commentCopy = element.querySelector(".comment-copy");
        for ( const child of commentCopy.childNodes ) {
            if ( child.nodeName === "#text" && child.nodeValue !== " " ) {
                const fragment = document.createDocumentFragment();
                for ( const token of child.nodeValue.split(" ") ) {
                    const span = document.createElement("span");
                    span.textContent = token;
                    fragment.append(span, " ");
                }
                commentCopy.replaceChild( fragment, child );
            }
        }
    }

    maskComments();

})();