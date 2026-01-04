// ==UserScript==
// @name         Flight Rising: Swift Links
// @author       Necramancy
// @description  Swiftly navigate Flight Rising. Adds customizable links to the sidebar.
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/*
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/405225/Flight%20Rising%3A%20Swift%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/405225/Flight%20Rising%3A%20Swift%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* INSTRUCTIONS:
    // Modify the url, icon, and title within swiftObj for your desired links
    // You may remove / add links by altering swiftObj
    // Icons use FontAwesome. To find an icon visit this link: https://fontawesome.com/icons
    // Filter by free as this is the free version of FontAwesome, and copy-paste the title of your chosen icon into swiftObj
    // Ie. 'heart' will render the heart icon
    */

    createBar();
    appendStyles();

    // Link Object
    let swiftObj = {
        baldwins: {
            icon: 'flask',
            url: 'https://www1.flightrising.com/trading/baldwin',
            title: 'Baldwins'
        },
        raffle: {
            icon: 'ticket-alt',
            url: 'https://www1.flightrising.com/trading/raffle',
            title: 'Raffle'
        },
        pile: {
            icon: 'feather',
            url: 'https://www1.flightrising.com/trading/pinkpile',
            title: 'Pinkerton\'s Pile'
        },
        fantastic: {
            icon: 'heart',
            url: 'https://www1.flightrising.com/trading/fantastic-familiars/flattery',
            title: 'Flattery'
        },
        customOne: {
            icon: 'dragon',
            url: 'LINKHERE',
            title: 'Custom One'
        },
        customTwo: {
            icon: 'rocket',
            url: 'LINKHERE',
            title: 'Custom Two'
        },
        customThree: {
            icon: 'star',
            url: 'LINKHERE',
            title: 'Custom Three'
        }
    };

    // Loop through links
    for ( let key in swiftObj ) {
       let icon = swiftObj[key].icon,
           url = swiftObj[key].url,
           title = swiftObj[key].title;

        buildItem( icon, url, title );
    }

    // Create and append swift box
    function createBar() {
        let skybanner = document.getElementById( 'skybanner' ),
            leftCol = document.getElementsByClassName( 'leftcolumn' )[0],
            swift = document.createElement( 'div' );

        swift.id = 'swift';

        skybanner.remove();
        leftCol.appendChild( swift );
    }

    // Build Links
    function buildItem( icon, url, title ) {
        let anchor = document.createElement( 'a' ),
            node = document.createTextNode( title ),
            ico = document.createElement( 'i' ),
            iconChoice = 'fa-' + icon,
            holster = document.getElementById( 'swift' );


        anchor.href = url;
        ico.classList.add( 'fas', 'far', iconChoice );

        anchor.appendChild( ico );
        anchor.appendChild( node );
        holster.appendChild( anchor );
    }

    // Append font awesome and swift styles
    function appendStyles() {
        let head = document.head,
            fontAwesome = document.createElement('link'),
            css = '#swift { max-width: 95%; margin: .5rem 1rem 1rem; background: linear-gradient(0.35turn, #23bcdd, #32ca60); box-shadow: inset 0 .25rem 1rem rgba(0, 0, 0, 0.1); border-radius: 1rem; font-size: .75rem; padding: 1rem .5rem; font-weight: bold; font-family: Helvetica, arial, sans-serif; } #swift a { display: block; border-radius: .25rem; padding: .5rem 1rem; color: #fff; } #swift a:hover { background: rgba(0, 0, 0, .1); } #swift a:hover i { color: #5ee6ce; } #swift i { margin-right: .5rem; } ',
            style = document.createElement( 'style' ),
            node = document.createTextNode( css );

        fontAwesome.type = 'text/css';
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://use.fontawesome.com/releases/v5.10.2/css/all.css';

        style.appendChild( node );
        head.appendChild( fontAwesome );
        head.appendChild( style );

    }

})();