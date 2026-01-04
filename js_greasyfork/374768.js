// ==UserScript==
// @match http://rbr.onlineracing.cz/*
// @match https://rbr.onlineracing.cz/*

// @name RBR CZ Improvements
// @namespace rbr_cz_improvements
// @description Shows all car classes on Records pages. Sorts track and car names on Replay list page. Provides additional info in browser's title bar
// @version 4
// @downloadURL https://update.greasyfork.org/scripts/374768/RBR%20CZ%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/374768/RBR%20CZ%20Improvements.meta.js
// ==/UserScript==

( function() {
    const url_search_params = new URLSearchParams( window.location.search )

    const classIds = [
        { id: 1, name: "WRC" },
        { id: 3, name: "N4" },
        { id: 13, name: "S2000" },
        { id: 2, name: "S1600" },
        { id: 4, name: "A8" },
        { id: 5, name: "A7" },
        { id: 6, name: "A6" },
        { id: 7, name: "A5" },
        { id: 8, name: "N3" },
        { id: 11, name: "H" },

        { id: 101, name: "RC1" },
        { id: 102, name: "RC2" },
        { id: 103, name: "RGT" },
        { id: 104, name: "RC3" },
        { id: 105, name: "RC4" },
        { id: 106, name: "RC5" },
        { id: 107, name: "H/B" },
        { id: 108, name: "H/A" },
        { id: 109, name: "H/4" },
        { id: 110, name: "H/2" },
        { id: 111, name: "WRC (NGP)" },
    ]

    function getElementByXpath( path ) {
        return document.evaluate( path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue
    }

    function setTitle( title ) {
        return () => { document.title = `${title} - Richard Burns Rally CZECH` }
    }

    function extractRecordPageHeader() {
        return () => {
            const header = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/center/span' ).textContent.split( ' - ' )

            const car_class_select = document.getElementById( 'classid' )
            const car_class = car_class_select.options[car_class_select.selectedIndex].text

            if ( header.length > 1 ) {
                return setTitle( `${header[0]} - ${header[1]} - ${car_class}` )
            } else {
                const country_select = document.getElementById( 'state' )
                const country = country_select.options[country_select.selectedIndex].text
                if ( country.startsWith( '-' ) ) {
                    return setTitle( `${header[0]} - ${car_class}` )
                } else {
                    return setTitle( `${header[0]} - ${country} - ${car_class}` )
                }
            }


        }
    }

    function setRecordClasses() {
        const select_class_id = document.getElementById( 'classid' );
        const query_classid = url_search_params.get( 'classid' )
        while ( select_class_id.children[0] ) {
            select_class_id.children[0].remove();
        }

        classIds.forEach( ( classId, index ) => {
            const option = document.createElement( 'option' );
            option.text = classId.name;
            option.value = classId.id;

            select_class_id.append( option )

            if ( query_classid == classId.id ) {
                select_class_id.options.selectedIndex = index;
            }
        } )
    }

    const act = url_search_params.get( 'act' )

    const actHandlers = {
        'cuplst': setTitle( 'Cup list' ),

        'mybooks': setTitle( 'Bookmarks' ),
        'myreqlist': setTitle( 'Requests' ),
        'qsearch': setTitle( 'Search' ),
        'rbrmods': setTitle( 'Mod list' ),
        'rbrtracks': setTitle( 'Track list' ),
        'repl_search': [ setTitle( 'Replay list' ), () => {
            [ 'track_id', 'car_id' ].forEach( id => {
                const select = document.getElementById( id );

                const sorted =
                    Array.prototype.slice.call( select.children )
                    .sort( ( a, b ) => a.textContent > b.textContent ? 1 : -1 )

                while ( select.children[0] ) {
                    select.children[0].remove();
                }

                sorted.forEach( element => {
                    select.append( element )
                } )

                select.options.selectedIndex = 0;
            } )
        } ],
        'replaysend': setTitle( 'Send replay' ),
        'stagerec': [ setRecordClasses, extractRecordPageHeader ],
        'teamlist': setTitle( 'Team list' ),
        'tour_res_feed': () => {
            const tournament_name = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/center/span[1]/a' ).textContent.trim()

            return setTitle( `${tournament_name} - Live results` )
        },
        'tour_startlist': () => {
            const tournament_name = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/center/span' ).textContent
            .replace( ' - Start list', '' )
            .replace( ' - Startovní listina', '' )
            .trim()

            return setTitle( `${tournament_name} - Start list` )
        },
        'tourmntres2': () => {
            const tournament_name = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/table/tbody/tr[1]/td/table/tbody/tr[1]/td/span[1]/b/a' ).textContent.trim()

            const stage_name = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/table/tbody/tr[1]/td/table/tbody/tr[3]/td[1]/b[1]' ).textContent
            .replace( 'RZ/', '' ).trim()

            return setTitle( `${tournament_name} - ${stage_name}` )
        },
        'tourmntscre4A': setTitle( 'Create tournament' ),
        'tourmntsend': setTitle( 'Send results' ),
        'tourmntslst': () => {
            const page = url_search_params.get( 'page' )
            return setTitle( page ? `Past tournaments list - Page ${page}` : `Tournaments list` )
        },
        'tourmntsview': () => {
            const tournament_name = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/table[1]/tbody/tr[1]/td/span' ).textContent.trim()

            return setTitle( tournament_name )
        },


        'tstats': [ setRecordClasses, extractRecordPageHeader ],
        'urank': [ setRecordClasses, extractRecordPageHeader ],
        'urec': [ setRecordClasses, extractRecordPageHeader ],
        'ustats': () => {
            const driver_name = getElementByXpath( '/html/body/table/tbody/tr/td/table[3]/tbody/tr[1]/td[2]/center[1]' ).textContent
            .replace( 'Statistics of user', '' )
            .replace( 'Statistiky uživatele', '' )
            .trim()

            return setTitle( driver_name )
        }
    }

    if ( !actHandlers[act] ) {
        return
    }

    const handlers = Array.isArray( actHandlers[act] ) ? actHandlers[act] : [ actHandlers[act] ]
    handlers.forEach( handler => {
        while ( typeof handler === 'function' ) {
            handler = handler()
        }
    } )
} )()