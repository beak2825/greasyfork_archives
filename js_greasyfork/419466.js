// ==UserScript==
// @name         Neopets: Swift Bar
// @author       https://greasyfork.org/users/547396
// @namespace    https://greasyfork.org/users/547396
// @description  Swiftly navigate Neopets based on personal preference. Adds customizable links to the bottom of the page.
// @match        *://*.neopets.com/*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/419466/Neopets%3A%20Swift%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/419466/Neopets%3A%20Swift%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* INSTRUCTIONS
    ** Modify the url, icon, and title within swiftObj for your desired links
    ** You may remove / add links by altering swiftObj
    ** Icons use FontAwesome. To find an icon visit this link: https://fontawesome.com/icons
    ** Filter by free as this is the free version of FontAwesome, and copy-paste the title of your chosen icon into swiftObj
    ** Ie. 'heart' will render the heart icon
    */

    /* SETTINGS
    ** Change showTitle to 'true' if you want to display the title next to the icons
    ** Set your username
    */
    const showTitle = false,
          username = 'YOUR-USERNAME';

    /*
    ** Link Object
    */
    let swiftObj = {
        ssw: {
            icon: 'hat-wizard',
            url: 'javascript:void(0)',
            title: 'SSW'
        },
        lookup: {
            icon: 'user-circle',
            url: '/userlookup.phtml?user=' + username,
            title: 'Lookup'
        },
        mail: {
            icon: 'envelope',
            url: '/neomessages.phtml',
            title: 'Neomail'
        },
         sdb: {
            icon: 'archive',
            url: '/safetydeposit.phtml',
            title: 'SDB'
        },
        gallery: {
            icon: 'th',
            url: '/gallery/index.phtml?gu=' + username,
            title: 'Gallery'
        },
        pound: {
            icon: 'heart',
            url: '/pound',
            title: 'Pound'
        },
        beauty_contest: {
            icon: 'palette',
            url: '/beauty',
            title: 'BC'
        },
        quests: {
            icon: 'star',
            url: '/quests.phtml',
            title: 'Quests'
        },
        customization_spotlight: {
            icon: 'medal',
            url: '/spotlights/custompet/index.phtml',
            title: 'CS'
        },
        board1: {
            icon: 'trash-alt',
            url: '/neoboards/boardlist.phtml?board=31',
            title: 'NCC'
        },
        board2: {
            icon: 'dumpster-fire',
            url: '/neoboards/boardlist.phtml?board=34',
            title: 'PC'
        }
    };

    init();

    /*
    ** Initialize, create bar
    */
    function init() {
        let footer = document.getElementById( 'footer__2020' ),
            swift = document.createElement( 'div' );

        swift.id = 'swift';
        footer.appendChild( swift );

        createLinks();
        appendStyles();
        addNeoLogic();
    }

    /*
    ** Loop through obj
    */
    function createLinks() {
        for ( let key in swiftObj ) {
            let icon = swiftObj[key].icon,
                url = swiftObj[key].url,
                title = swiftObj[key].title;

            buildItem( icon, url, title, key );
        }
    }

    /*
    ** Build each item
    */
    function buildItem( icon, url, title, key ) {
        let anchor = document.createElement( 'a' ),
            span = document.createElement( 'span' ),
            titleNode = document.createTextNode( title ),
            ico = document.createElement( 'i' ),
            iconChoice = 'fa-' + icon,
            holster = document.getElementById( 'swift' );

        anchor.href = url;
        ico.classList.add( 'fas', 'far', iconChoice );

        anchor.appendChild( ico );
        span.appendChild( titleNode );
        anchor.appendChild( span );
        anchor.setAttribute( 'id', key );
        holster.appendChild( anchor );

        if ( showTitle ) {
            holster.classList.add( 'showTitle' );
        }
    }

    /*
    ** Append styles
    */
    function appendStyles() {
        let head = document.head,
            fontAwesome = document.createElement('link'),
            garbageCss = `
            #swift { position: fixed; bottom: 0; left: 0; display: flex; justify-content: flex-end; background: #171717; border-top: 2px solid #000; z-index: 99; width: 100%; font-family: arial, sans-serif; font-size: 9px; letter-spacing: .05rem; }
            #swift a { display: flex; align-items: center; padding: .75rem; color: #b4d0cc; background-color: transparent; transition: .25s; }
            #swift a i { padding: 0 .25rem; font-size: 16px; }
            #swift a:hover { color: #fff; background-color: #000; }
            #swift:not(.showTitle) a span { display: none; }
            #ssw__2020 { bottom: 2.55rem; }
            `,
            style = document.createElement( 'style' ),
            cssNode = document.createTextNode( garbageCss );

        fontAwesome.type = 'text/css';
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://use.fontawesome.com/releases/v5.10.2/css/all.css';

        style.appendChild( cssNode );
        head.appendChild( fontAwesome );
        head.appendChild( style );
    }

    /*
    ** Add any existing neo events
    */
    function addNeoLogic() {
       let ssw = document.getElementById('ssw');

       ssw.setAttribute('onclick', 'toggleSSW__2020()');
    }

})();