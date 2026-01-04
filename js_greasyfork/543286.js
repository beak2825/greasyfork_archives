// ==UserScript==
// @name         Instant Diffs
// @namespace    https://www.mediawiki.org/wiki/Instant_Diffs
// @version      1.1.1
// @description  Instant Diffs is a JavaScript tool that enhances MediaWiki diff links with interactive functionality — dynamically loaded content via AJAX technology in dialog windows.
// @author       Serhio Magpie
// @license      MIT
// @match        https://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Instant_Diffs_logo.svg/64px-Instant_Diffs_logo.svg.png
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543286/Instant%20Diffs.user.js
// @updateURL https://update.greasyfork.org/scripts/543286/Instant%20Diffs.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

( ( window ) => {
    'use strict';

    /**
     * Semantic Versioning Comparing
     * @see {@link https://gist.github.com/iwill/a83038623ba4fef6abb9efca87ae9ccb}
     * @see {@link https://semver.org/}
     * @see {@link https://stackoverflow.com/a/65687141/456536}
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator/Collator#options}
     */
    function semverCompare( a, b ) {
        if ( a.startsWith( b + '-' ) ) return -1;
        if ( b.startsWith( a + '-' ) ) return 1;
        return a.localeCompare( b, undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' } );
    }

    window.RLQ = window.RLQ || [];
    window.RLQ.push( () => {
        if ( typeof window.mw === 'undefined' ) return;

        window.mw.loader.enqueue( [ 'mediawiki.base' ], () => {
            const minimumVersion = '1.35';
            const currentVersion = window.mw.config.get( 'wgVersion' );
            if ( semverCompare( currentVersion, minimumVersion ) < 0 ) {
                console.error( `Instant Diffs: requires MediaWiki ${ minimumVersion }+, got ${ currentVersion }.` );
                return;
            }

            window.instantDiffs = window.instantDiffs || {};
            window.instantDiffs.GM = GM;

            window.mw.loader.getScript( 'https://www.mediawiki.org/w/index.php?title=User:Serhio_Magpie/instantDiffs.js&instantdiffs[GM]=true&action=raw&ctype=text/javascript' )
                .then( () => {
                    console.info( `Instant Diffs: loaded successfully.` );
                }, ( error ) => {
                    console.error( `Instant Diffs: loading failed: ${ error.message }.` );
                } );
        } );
    } );
} ) ( window.unsafeWindow );