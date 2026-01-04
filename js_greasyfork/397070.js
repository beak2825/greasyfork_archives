// ==UserScript==
// @name            Anti-AdBlocker Fuckoff
// @name:es         Anti-AdBlocker Fuckoff
// @namespace       Anti-AdBlocker-Fuckoff
// @version         1.68
// @description     Protects & Remove Anti-AdBlockers modal windows from web sites
// @description:es  Protege y elimina las ventanas modales de Anti-AdBlockers de los sitios web
// @author          Elwyn
// @license         MIT
// @homepage        https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript
// @supportURL      https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/issues
// @iconURL         https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/icon.png
// @include         *
// @exclude         https://*aliexpress.com/*
// @exclude         https://*amazon.*/*
// @exclude         https://*anaconda.org/*
// @exclude         https://*apple.com/*
// @exclude         https://*ask.com/*
// @exclude         https://*baidu.com/*
// @exclude         https://*binance.com/*
// @exclude         https://*binance.us/*
// @exclude         https://*bing.com/*
// @exclude         https://*bitfinex.com/*
// @exclude         https://*bitflyer.com/*
// @exclude         https://*bitstamp.net/*
// @exclude         https://*blockchain.com/*
// @exclude         https://*blockchair.com/*
// @exclude         https://*blockcypher.com/*
// @exclude         https://*bscscan.com/*
// @exclude         https://*buffer.com/*
// @exclude         https://*bufferapp.com/*
// @exclude         https://*calm.com/*
// @exclude         https://*chatango.com/*
// @exclude         https://*coinbase.com/*
// @exclude         https://*coinmarketcap.com/*
// @exclude         https://*doctor-groups.com/*
// @exclude         https://*duckduckgo.com/*
// @exclude         https://*ebay.com/*
// @exclude         https://*etherscan.io/*
// @exclude         https://*facebook.com/*
// @exclude         https://*firefaucet.win/*
// @exclude         https://*flattr.com/*
// @exclude         https://*flickr.com/*
// @exclude         https://*fsf.org/*
// @exclude         https://*ftx.com/*
// @exclude         https://*ftx.us/*
// @exclude         https://*gate.io/*
// @exclude         https://*geeksforgeeks.org/*
// @exclude         https://*gemini.com/*
// @exclude         https://*github.com/*
// @exclude         https://*gitlab.com/*
// @exclude         https://*google.*
// @exclude         https://*greasyfork.org/*
// @exclude         https://*huobi.com/*
// @exclude         https://*imdb.com/*
// @exclude         https://*imgbox.com/*
// @exclude         https://*imgur.com/*
// @exclude         https://*instagram.com/*
// @exclude         https://*jsbin.com/*
// @exclude         https://*jsfiddle.net/*
// @exclude         https://*kucoin.com/*
// @exclude         https://*kraken.com/*
// @exclude         https://*linkedin.com/*
// @exclude         https://*liquid.com/*
// @exclude         https://*live.com/*
// @exclude         https://*mail.ru/*
// @exclude         https://*mega.nz/*
// @exclude         https://*minds.com/*
// @exclude         https://*microsoft.com/*
// @exclude         https://*msn.com/*
// @exclude         https://*netflix.com/*
// @exclude         https://*odysee.com/*
// @exclude         https://*openuserjs.org/*
// @exclude         https://*paypal.com/*
// @exclude         https://*pinterest.com/*
// @exclude         http*://*plnkr.co/*
// @exclude         http*://*poloniex.com/*
// @exclude         https://*primevideo.com/*
// @exclude         https://*protonmail.com/*
// @exclude         https://*qq.com/*
// @exclude         https://*raider.io/*
// @exclude         https://*reddit.com/*
// @exclude         https://*stackoverflow.com/*
// @exclude         https://*steampowered.com/*
// @exclude         https://*tampermonkey.net/*
// @exclude         https://*trello.com/*
// @exclude         https://*twitch.tv/*
// @exclude         https://*twitter.com/*
// @exclude         https://*userstyles.org/*
// @exclude         https://*viawallet.com/*
// @exclude         https://*vimeo.com/*
// @exclude         https://*whatsapp.com/*
// @exclude         https://*wikipedia.org/*
// @exclude         https://*w3schools.com/*
// @exclude         https://*x.com/*
// @exclude         https://*yahoo.*
// @exclude         https://*yandex.ru/*
// @exclude         https://*youtube.com/*
// @exclude         https://*vod.pl/*
// @noframes
// @run-at          document-start
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/397070/Anti-AdBlocker%20Fuckoff.user.js
// @updateURL https://update.greasyfork.org/scripts/397070/Anti-AdBlocker%20Fuckoff.meta.js
// ==/UserScript==
(function() {

    var enable_debug = false;

    // Anti-AdBlocker Pattern to Search
    var adblock_pattern = /ad-block|adblock|ad block|blocking ads|bloqueur|bloqueador|Werbeblocker|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
    var disable_pattern = /kapat|disabl|désactiv|desactiv|desativ|deaktiv|detect|enabled|turned off|turn off|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;

    var tagNames_pattern = /b|center|div|font|i|iframe|s|span|section|u/i;

    var is_core_protected = false;

    var classes = [];

    // HELPER Functions
    //-----------------
    function debug( msg, val ) {
        if ( !enable_debug ) return;
        console.log( '%c ANTI-ADBLOCKER \n','color: white; background-color: red', msg );
        if ( val === undefined ) return;
        if ( val.nodeType === Node.ELEMENT_NODE )
        {
            console.log ( 'TagName: ' + val.nodeName + ' | Id: ' + val.id + ' | Class: ' + val.classList );
            console.log ( val );
        } else {
            console.log ( '%c' +val, 'color: grey;' );
        }
    }

    function addStyle(str) {
        var style = document.createElement('style');
        style.innerHTML = str;
        document.body.appendChild( style );
    }

    function randomInt( min, max )
    {
        // min and max included
        if ( max === undefined ) {
            max = min;
            min = 0;
        }
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    function getRandomName( size )
    {
        var charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var name = '';
        for (var i = 0; i < (size||randomInt(10,20)); ++i)
        {
            name += charset.charAt( Math.floor( Math.random() * charset.length) );
        }
        return name;
    }

    function addRandomClass( el ) {
        let name = getRandomName();
        el.classList.add( name );
        return name;
    }

    function enableRightClick() {
        if (typeof jQuery !== 'undefined') {
            jQuery(function($) {
                $('img').removeAttr('onmousedown').removeAttr('onselectstart').removeAttr('ondragstart');
                $(document).off('contextmenu');
                $(document.body).off('contextmenu');
                $(document.body).off('selectstart');
                $(document.body).off('dragstart');
            });
        } else {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                img.removeAttribute('onmousedown');
                img.removeAttribute('onselectstart');
                img.removeAttribute('ondragstart');
            });
        }
        document.oncontextmenu=null;
        document.onmousedown=null;
        document.body.oncontextmenu=null;
        document.body.onselectstart=null;
        document.body.ondragstart=null;
    }



    function isElementBlur( el )
    {
        if (el instanceof Element) {
          var style = window.getComputedStyle( el );
          var filter = style.getPropertyValue( 'filter' );
          return ( (/blur/i).test( filter ) );
        }
    }

    function isElementFixed( el )
    {
        if (el instanceof Element) {
          var style = window.getComputedStyle( el );
          return ( style.getPropertyValue( 'position' ) == 'fixed' );
        }
    }

    function isOverflowHidden( el )
    {
        if (el instanceof Element) {
          var style = window.getComputedStyle( el );
          return ( style.getPropertyValue( 'overflow' ) == 'hidden' );
        }
    }
    function isNotHidden( el )
    {
        if (el instanceof Element) {
          var style = window.getComputedStyle( el );
          return ( style.getPropertyValue( 'display' ) != 'none' );
        }
    }

    function isBlackoutModal( el )
    {
        if (el instanceof Element) {
          var style = window.getComputedStyle( el );
          var position = style.getPropertyValue( 'position' );
          var top = parseInt( style.getPropertyValue( 'top' ) );
          var left = parseInt( style.getPropertyValue( 'left' ) );
          var right = parseInt( style.getPropertyValue( 'right' ) );
          var bottom = parseInt( style.getPropertyValue( 'bottom' ) );
          if (position == 'fixed') {
            debug ( "Possible Blackout",
                   "position: " + position +
                   "\n top: " + top + " left: " + left +
                   "\n bottom: " + bottom + " right: " + right +
                   "\n Height: " + (window.innerHeight / el.offsetHeight) +
                   "\n Width: " + (window.innerWidth / el.offsetWidth)
                  );
          }
          return position == 'fixed' && ( ( (window.innerHeight / el.offsetHeight) > 0.96 && (window.innerWidth / el.offsetWidth) > 0.96 ) && ((top <= 2 && left <= 2) || (right <= 2 && bottom <= 2)) );
        }
    }

    function isAntiAdblockText( value )
    {
        return adblock_pattern.test( value ) && disable_pattern.test( value );
    }

    function isModalWindows( el )
    {
        return isElementFixed ( el ) && ( isAntiAdblockText( el.textContent ) || isBlackoutModal( el ) );
    }

    // Blocks the possibility of being able to remove the BODY or the HEAD
    function protectCore() {
        if ( is_core_protected ) return;

        if (typeof unsafeWindow === 'undefined') {
          const unsafeWindow = window;
        }

        // Protect RemoveChild
        const $_removeChild = unsafeWindow.Node.prototype.removeChild;
        unsafeWindow.Node.prototype.removeChild = function( node ) {
            if ( node.nodeName == 'HEAD' || (node.parentNode.nodeName == 'HEAD' && !(/META|SCRIPT|STYLE/.test(node.nodeName)) )  ){
                return debug( 'An attempt to DELETE the element ' + node.nodeName + ' was blocked', node );
            }
            else if ( node.nodeName == 'BODY' ){
                if ( node.parentNode == document.body.firstElementChild ) {
                    return debug( 'An attempt to DELETE the element ' + node.nodeName + ' from ' + node.parentNode.nodeName + ' was blocked', node );
                }
                return debug( 'An attempt to DELETE the element ' + node.nodeName + ' was blocked', node );
            }
            $_removeChild.apply( this, arguments );
        };

        // Protect innerHTML

        const $_innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function (value) {
                if ( this.nodeName == 'BODY' || isAntiAdblockText( value ) ){
                    return debug( 'An attempt to CHANGE the content of the element ' + this.nodeName + ' was blocked\n', value );
                }
                //Call the original setter
                return $_innerHTML.set.call(this, value);
            },
            get: function() {
              return $_innerHTML.get.call(this);
            },
            configurable: true
        });

        debug( 'Core Protected');
    }


    function unblockScroll()
    {
        if ( isOverflowHidden( document.body ) )
        {
            document.body.setAttribute('style', (document.body.getAttribute('style')||'').replace('overflow: visible !important;','') + 'overflow: visible !important;');
            document.body.classList.add( 'scroll_on' );
            debug( 'Scroll Unblocked from BODY tag');
        }
        if ( isOverflowHidden( document.documentElement ) )
        {
            document.documentElement.setAttribute('style', (document.documentElement.getAttribute('style')||'').replace('overflow: visible !important;','') + 'overflow: visible !important;');
            document.documentElement.classList.add( 'scroll_on' );
            debug( 'Scroll Unblocked from HTML tag ');
        }
    }

    // Main Functions
    function removeBackStuff()
    {
        document.querySelectorAll( 'b,center,div,font,i,iframe,s,span,section,u' ).forEach( ( el ) => {
            if ( isBlackoutModal( el ) )
            {
                debug( 'Blackout Modal Detected & Removed: ', el);
                el.removeAttribute('id');
                el.removeAttribute('class');
                el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');
                el.classList.add( 'hide_modal' );
            }
            else if ( isElementBlur( el ) )
            {
                debug( 'Blur Element Detected & Deblurred: ', el);
                el.classList.add( 'un_blur' );
            }
        });
        setTimeout( unblockScroll, 500);
    }

    function checkModals()
    {
        debug( 'Checking Modals' );
        var modalFound = false;
        // Only check common used html tag names
        document.querySelectorAll( 'b,center,div,font,i,iframe,s,span,section,u' ).forEach( ( el ) => {
            if ( isModalWindows( el ) && isNotHidden( el ) )
            {
                modalFound = true;
                removeModal( el );
            }
        });

        if ( modalFound )
        {
            setTimeout( removeBackStuff, 150);
        }
    }

    function removeModal( el, isNew )
    {
        // Skip the already processed elements
        if ( (new RegExp(classes.join('|'))).test( el.classList ) ) {
            //debug( 'Modal already added : ', el );
            return;
        }

        el.removeAttribute('id');
        el.removeAttribute('class');

        // Definde a random class name to hide the element
        // ( so that it is not so easy to detect the class name )
        var class_name = '';
        class_name = addRandomClass( el );
        classes.push( class_name );

        // Hide the element through a high priority incorporating the sentence in the style parameter
        el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');

        // Also, add the random class name to the element
        // (in case there is a script that eliminates the previous statement)
        addStyle( '.' + class_name + '{ display: none !important; }' );

        debug( 'Modal Detected & Removed: ', el);

        if ( isNew )
        {
            setTimeout( removeBackStuff, 150);
        }
    }

    window.addEventListener('DOMContentLoaded', (event) => {


        classes.push( getRandomName() );

        //document.html = document.getElementsByTagName('html')[0];

        // Mutation Observer
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        // Create an observer instance
        var observer = new MutationObserver( (mutations) => {
            mutations.forEach( (mutation) => {
                if ( mutation.addedNodes.length ) {
                    Array.prototype.forEach.call( mutation.addedNodes, ( el ) => {
                        // skip unusual html tag names
                        if ( !tagNames_pattern.test ( el.tagName ) ) return;

                        // Check if element is an Anti-Adblock Modal Windows
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
        // Observe only the body and its direct descendants
        observer.observe(document.body, {
            childList : true,
            subtree : true
        });


        // First check with a little delay
        setTimeout( function() {
            // check Modals
            checkModals();
        }, 150 );

        addStyle( 'body { user-select: auto !important; } body.scroll_on, html.scroll_on { overflow: visible !important; } .hide_modal { display: none !important; } .un_blur { -webkit-filter: blur(0px) !important; filter: blur(0px) !important; }' );

    });

    window.addEventListener('load', (event) => {
        // Second check, when page is complete loaded ( just in case )
        setTimeout( function() {
            // enable RightClick again
            enableRightClick();
            // check Modals
            checkModals();
        }, 1500 );
    });


    // Protect Core Functions
    protectCore();

})();
