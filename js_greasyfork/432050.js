// ==UserScript==
// @name            Anti-Cookies Consent
// @name:es         Anti-Consentimiento de Cookies
// @namespace       Anti-Cookies-Consent
// @version         1.2.1
// @description     Remove Cookies Consent Modal Windows
// @description:es  Eliminar los mensajes de consentimiento de cookies de los sitios web
// @author          Elwyn
// @license         MIT
// @homepage        https://github.com/WakeupNeo33/Anti-Cookies-Consent-userscript
// @supportURL      https://github.com/WakeupNeo33/Anti-Cookies-Consent-userscript/issues
// @iconURL         https://github.com/WakeupNeo33/Anti-Cookies-Consent-userscript/raw/main/icon.png
// @include         *
// @exclude         https://*mega.nz/*
// @noframes
// @run-at          document-start
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/432050/Anti-Cookies%20Consent.user.js
// @updateURL https://update.greasyfork.org/scripts/432050/Anti-Cookies%20Consent.meta.js
// ==/UserScript==
(function() {

    var enable_debug = false;

    // Pattern to Search
    var cookies_pattern = /cookies/i;

    var tagNames_pattern = /div|p|section|iframe/i;

    document.html = document.getElementsByTagName('html')[0];

    // HELPER Functions
    //-----------------
    function debug( msg, val ) {
        if ( !enable_debug ) return;
        console.log( '%c ANTI-COOKIES CONSENT','color: white; background-color: blue', msg );
        if ( val !== undefined )
        {
            if ( val.nodeType === Node.ELEMENT_NODE ) {
                console.log ( 'TagName: ' + val.nodeName + ' | Id: ' + val.id + ' | Class: ' + val.classList );
            } else {
                console.log ( val );
            }
        }
    }

    function addStyle(str) {
        var style = document.createElement('style');
        style.innerHTML = str;
        document.body.appendChild( style );
    }

    /* Thanks to RuiGuilherme  */
    const enableContextMenu = () => {
        window.addEventListener('contextmenu', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }, true);
    }

    function isElementBlur( el )
    {
        var style = window.getComputedStyle( el );
        var filter = style.getPropertyValue( 'filter' );
        return ( (/blur/i).test( filter ) );
    }

    function isElementFixed( el )
    {
        var style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'position' ) == 'fixed' );
    }

    function isOverflowHidden( el )
    {
        var style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'overflow' ) == 'hidden' );
    }

    function isNotHidden( el )
    {
        var style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'display' ) != 'none' );
    }

    function isFullWindows( el )
    {
        var style = window.getComputedStyle( el );
        var top = parseInt( style.getPropertyValue( 'top' ) );
        var left = parseInt( style.getPropertyValue( 'left' ) );
        var right = parseInt( style.getPropertyValue( 'right' ) );
        var bottom = parseInt( style.getPropertyValue( 'bottom' ) );
        return ( el.offsetHeight > window.innerHeight - 50 && el.offsetWidth > window.innerWidth - 20 ) || (top == 0 && left == 0 && right == 0 && bottom == 0);
    }

    function isBlackoutModal( el )
    {
        var style = window.getComputedStyle( el );
        var position = style.getPropertyValue( 'position' );
        var zindex = style.getPropertyValue( 'z-index' );
        if ( isNaN( zindex ) ) zindex = 0;
        return parseInt( zindex ) > 1 && position == 'fixed' && isFullWindows( el );
    }

    function isChildrenFullWindows( el )
    {
        if ( el.hasChildNodes() == false ) return;
        var childFound = false;
        Array.prototype.forEach.call( el.childNodes, ( child ) => {
            // skip unusual html tag names
            if ( !tagNames_pattern.test ( child.nodeName ) ) return;
            // Check if some child element is full size window
            if(isFullWindows( child )){
                childFound = true;
            }
        });
        return childFound;
    }

    function isModalWindows( el )
    {
        return (isElementFixed( el ) && ( cookies_pattern.test( el.textContent ) || el.nodeName == 'IFRAME' ) );
    }

    function unblockScroll()
    {
        if ( isOverflowHidden( document.body ) )
        {
            document.body.setAttribute('style', (document.body.getAttribute('style')||'').replace('overflow: visible !important;','') + 'overflow: visible !important;');
            document.body.classList.add( 'scroll_on' );
            debug( 'Scroll Unblocked from BODY tag');
        }
        if ( isOverflowHidden( document.html ) )
        {
            document.html.setAttribute('style', (document.html.getAttribute('style')||'').replace('overflow: visible !important;','') + 'overflow: visible !important;');
            document.html.classList.add( 'scroll_on' );
            debug( 'Scroll Unblocked from HTML tag ');
        }
    }

    // Main Functions
    function removeBackStuff()
    {
        document.querySelectorAll( 'div,section' ).forEach( ( el ) => {
            if ( tagNames_pattern.test( el.nodeName ) )
            {
                if ( isBlackoutModal( el ) )
                {
                    debug( 'Blackout Modal Detected & Removed: ', el);
                    el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');
                    el.classList.add( 'hide_modal' );
                }
                else if ( isElementBlur( el ) )
                {
                    debug( 'Blur Element Detected & Deblurred: ', el);
                    el.classList.add( 'un_blur' );
                }
            }
        });
        setTimeout( unblockScroll, 500);
    }

    function checkModals()
    {
        debug( 'Checking Modals' );
        var modalFound = false;
        // Only check common used html tag names
        document.querySelectorAll( 'div,section,iframe' ).forEach( ( el ) => {
            if ( tagNames_pattern.test( el.nodeName ) )
            {
                if ( isModalWindows( el ) && isNotHidden( el ) )
                {
                    modalFound = true;
                    removeModal( el );
                }
            }
        });

        if ( modalFound )
        {
            setTimeout( removeBackStuff, 100);
        }
    }

    function removeModal( el, isNew )
    {
        // Skip the already processed elements
        if ( /hide_modal/.test( el.classList ) ) {
            return;
        }

        // Hide the element through a high priority incorporating the sentence in the style parameter
        el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');

        // Also, add a class name to the element
        // (in case there is a script that eliminates the previous statement)
        el.classList.add( 'hide_modal' );

        debug( 'Modal Detected & Removed: ', el);

        if ( isNew )
        {
            setTimeout( removeBackStuff, 100);
        }
    }

    window.addEventListener('DOMContentLoaded', (event) => {

        // Mutation Observer
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        // Create an observer instance
        var observer = new MutationObserver( (mutations) => {
            mutations.forEach( (mutation) => {
                if ( mutation.addedNodes.length ) {
                    Array.prototype.forEach.call( mutation.addedNodes, ( el ) => {
                        // skip unusual html tag names
                        if ( !tagNames_pattern.test ( el.nodeName ) ) return;

                        // Check if element is a Modal Windows
                        if ( isModalWindows( el ) && isNotHidden( el ) )
                        {
                            debug( 'OnMutationObserver: ', el );
                            removeModal( el, true );
                        }
                    });
                }
            });
        });
        // Observer
        observer.observe(document, {
            childList : true,
            subtree : true
        });

        // enable context menu again
        enableContextMenu();

        addStyle( 'body.scroll_on, html.scroll_on { overflow: visible !important; } .hide_modal { display: none !important; } .un_blur { -webkit-filter: blur(0px) !important; filter: blur(0px) !important; }' );

        // First check
        checkModals();

    });

    window.addEventListener('load', (event) => {
        setTimeout( function() {
            checkModals();
        }, 100 );
    });


})();
