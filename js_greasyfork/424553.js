// ==UserScript==
// @name         FR - Auction House - Bookmarks Bar
// @author       https://greasyfork.org/users/547396
// @namespace    https://greasyfork.org/users/547396
// @description  Hardcode bookmarks by categories for the buy section of the auction house
// @match        *://*.flightrising.com/auction-house/buy/*/*
// @grant        none
// @version      0.2
// @downloadURL https://update.greasyfork.org/scripts/424553/FR%20-%20Auction%20House%20-%20Bookmarks%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/424553/FR%20-%20Auction%20House%20-%20Bookmarks%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    ** Settings
    */
    const collapse = true, // true | false
          pagesize = 50, // 10 | 25 | 50
          collapseType = ( collapse ) ? 'collapse' : 'nocollapse';

    /*
    ** Link Object
    */
    let ahBarObj = {
        item: {
            title: 'category',
            items: [
                {
                    title: 'dragon example',
                    url: 'dragons?d_body=10&d_pattern=XXX'
                },
                {
                    title: 'skin example',
                    url: 'skins?itemname=SKIN-NAME'
                }
            ]
        },
        item2: {
            title: 'category two',
            items: [
                {
                    title: 'a',
                    url: '#'
                },
                {
                    title: 'b',
                    url: '#'
                },
                {
                    title: 'c',
                    url: '#'
                }
            ]
        },
        item3: {
            title: 'category three',
            items: [
                {
                    title: 'item',
                    url: '#'
                }
            ]
        }
    };

    init();

    /*
    ** Initialize, create bar
    */
    function init() {
        let footer = document.getElementById( 'footer' ),
            ahBar = document.createElement( 'div' );

        ahBar.id = 'ahBar';
        footer.appendChild( ahBar );

        createLinks();
        appendStyles();
    }

    /*
    ** Loop through obj
    */
    function createLinks() {
        for ( let key in ahBarObj ) {
            let title = ahBarObj[key].title,
                items = ahBarObj[key].items;

            buildItem( title, items, key );
        }
    }

    /*
    ** Build each item
    */
    function buildItem( title, items, key ) {
        let item;

        let category = document.createElement( 'div' ),
            span = document.createElement('span'),
            titleNode = document.createTextNode( title ),
            holster = document.getElementById( 'ahBar' ),
            append = '&' + collapseType + '=1&perpage=' + pagesize;

        span.appendChild( titleNode );
        category.appendChild( span );
        category.setAttribute( 'id', key );
        category.setAttribute( 'class', 'category' );
        holster.appendChild( category );

        for (item in items) {
           let itemTitle = items[item].title,
               itemURL = items[item].url,
               anchor = document.createElement( 'a' );

            anchor.href = itemURL + append;
            anchor.innerText = itemTitle;
            category.appendChild( anchor );
        }
    }

    /*
    ** Append styles
    */
    function appendStyles() {
        let head = document.head,
            garbageCss = `
            #ahBar { position: fixed; bottom: 0; left: 0; display: flex; justify-content: flex-end; background: #171717; border-top: 2px solid #000; z-index: 99; width: 100%; font-family: arial, sans-serif; font-size: 8px; letter-spacing: .05rem; }
            #ahBar .category { color: #fff; padding: .25rem; display: flex; align-items: center; }
            #ahBar .category span { margin: 0 .5rem; padding: .20rem .1rem; border-bottom: 1px dotted #555;  }
            #ahBar a { padding: .75rem .5rem; color: #b4d0cc; background-color: transparent; transition: .25s; }
            #ahBar a:hover { color: #fff; background-color: #000; }
            `,
            style = document.createElement( 'style' ),
            cssNode = document.createTextNode( garbageCss );

        style.appendChild( cssNode );
        head.appendChild( style );
    }
})();