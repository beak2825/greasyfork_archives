// ==UserScript==
// @name         getSpecialsSSG
// @namespace    none
// @version      2021.09.26.2340
// @description  Create a ShoeBot !specials list
// @author       MagentaRV
// @match        http://www.ddo.com/en/news/ddo-chronicle-issue-*
// @match        https://www.ddo.com/en/news/ddo-chronicle-issue-*
// @match        http://www.lotro.com/en/game/articles/lotro-beacon-issue-*
// @match        https://www.lotro.com/en/game/articles/lotro-beacon-issue-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433022/getSpecialsSSG.user.js
// @updateURL https://update.greasyfork.org/scripts/433022/getSpecialsSSG.meta.js
// ==/UserScript==

( function() {

    // objOptions = {                   trim: 'false/start/end/true',
    //     nbsp: 'false/replacement/true', b: 'false/replacement/true',
    //     i: 'false/replacement/true',    u: 'false/replacement/true',
    //     span: 'false/replacement/true', a: 'false/replacement/true' }
    function parseHTMLtoDiscord( htmlString, objOptions = {} ) {
        var rxpA = new RegExp( '<a href="((?:https?|mailto):(?:\/\/)?(?:[^"]*?))"(?:.*?)>(.*?)<\/a>', 'g' );
        var rxpB = new RegExp( '<\/?(b|strong)(?:.*?)>', 'gi' );
        var rxpI = new RegExp( '<\/?(i|emphasis)(?:.*?)>', 'gi' );
        var rxpSpan = new RegExp( '<\/?span(?:.*?)>', 'gi' );
        var rxpU = new RegExp( '<\/?u(?:.*?)>', 'gi' );
        switch ( objOptions.trim ) {// Options are false to skip, start, end, or -default- both
            case false: break;
            case 'start': htmlString = htmlString.trimStart(); break;
            case 'end': htmlString = htmlString.trimEnd(); break;
            default: htmlString = htmlString.trim();
        }
        switch ( objOptions.nbsp ) {// Options are false to skip, text to replace &nbsp; with, or -default- a plain space
            case false: break;
            default: htmlString = htmlString.replace( /&nbsp;/g, ( typeof objOptions.nbsp === 'string' ? objOptions.nbsp : ' ' ) );
        }
        switch ( objOptions.b ) {// Options are false to skip, text to replace bold tag with, or -default- **
            case false: break;
            default: htmlString = htmlString.replace( rxpB, ( typeof objOptions.b === 'string' ? objOptions.b : '**' ) );
        }
        switch ( objOptions.i ) {// Options are false to skip, text to replace italic tag with, or -default- *
            case false: break;
            default: htmlString = htmlString.replace( rxpI, ( typeof objOptions.i === 'string' ? objOptions.i : '*' ) );
        }
        switch ( objOptions.u ) {// Options are false to skip, text to replace underline tag with, or -default- __
            case false: break;
            default: htmlString = htmlString.replace( rxpU, ( typeof objOptions.u === 'string' ? objOptions.u : '__' ) );
        }
        switch ( objOptions.span ) {// Options are false to skip, text to replace span tag with, or -default- strip the span
            case false: break;
            default: htmlString = htmlString.replace( rxpSpan, ( typeof objOptions.span === 'string' ? objOptions.span : '' ) );
        }
        switch ( objOptions.a ) {// Options are false to skip, text to replace anchor tag with, or -default- [link text](<link href>)
            case false: break;
            default: htmlString = htmlString.replace( rxpA, ( typeof objOptions.a === 'string' ? objOptions.a : '[$2](<$1>)' ) );
        }
        return htmlString;
    }
// Define which game we're parsing data for
    var strGame = document.URL.replace( /https?:\/\/(?:www\.)?/i, '' );
    strGame = strGame.slice( 0, strGame.indexOf( '.' ) ).toLowerCase();

// Initialize variables
    var now = new Date( document.querySelector( 'time.submitted.pretty' ).title ),
        today = now,
        published = now,
        aWeekFromNow = new Date( now.getFullYear(), String( now.getMonth() ).padStart( 2, '0' ), String( now.getDate() + 7 ).padStart( 2, '0' ) ),
        author = '',
        sSotW = document.querySelectorAll( 'p.rtecenter a img' ),
        IMGsS = sSotW[ sSotW.length - 1 ].src,
        SSdesc = parseHTMLtoDiscord( sSotW[ sSotW.length - 1 ].closest( 'p' ).nextElementSibling.childNodes[ 0 ].innerHTML, { trim: false } ),
        InTheNews = [],
        freebieLinks = {},
        rowFreebie = [],
        arrSalesFree = [],
        strSaleName = '',
        strSalePercent = '',
        arrSalesVal = [],
        arrSaleDates = [],
        objSaleDates = {},
        arrBonusDays = [],
        objBonusDays = {},
        arrBonusDaysVal = [],
        strWeeklyCoupon = '',
        arrWeeklyCoupon = [],
        arrFreebieDates = [],
        objFreebieDates = {},
        strFreebieCode = '',
        strFreebieName = '',
        strFreebieLink = '',
        intFreebieQuantity = 0,
        strFreebieWeek = '';
    if ( strGame === 'ddo' ) {
        var chronicleSections = [];
// Create an object of possible freebies links
        freebieLinks = {
            'unknown': 'https://ddowiki.com/index.php?title=Special:Search&go=Go&search=',
        };
    } else {
        var beaconSections = [];
// Create an object of possible freebies links
        freebieLinks = {
            'unknown': 'https://lotro-wiki.com/index.php?title=Special:Search&go=Go&search=',
            '+5% Attack Damage x25 (90 minutes)': 'https://lotro-wiki.com/index.php/LOTRO_Store#Damage',
            '+5 Hope Boost': 'https://lotro-wiki.com/index.php/LOTRO_Store#Hope',
            '+20% Mount Speed (90 minute) boost': 'https://lotro-wiki.com/index.php/Item:%2B20%25_Mount_Speed_%2890_Min%29',
            '100% XP Boost (1 hour)': 'https://lotro-wiki.com/index.php/Item:Tome_of_Extraordinary_Experience_%28100%29',
//            '100% Mark Acquisition (90 minute) boost': '',// NO LINK
            'Dye: Crimson': 'https://lotro-wiki.com/index.php/Item:Crimson_Dye',
            'Dye: Ered Luin Blue': 'https://lotro-wiki.com/index.php/Item:Ered_Luin_Blue_Dye',
            'Landscape Soldier Token': 'https://lotro-wiki.com/index.php/Item:Landscape_Soldier_Token',
            'Morale Bubble Potion': 'https://lotro-wiki.com/index.php/Item:Morale_Bubble_Potion',
            'Rejuvenation Potion x5': 'https://lotro-wiki.com/index.php/Item:Rejuvenation_Potion',
            'Skill and Slayer Deed Boost': 'https://lotro-wiki.com/index.php/Item:Slayer_and_Skill_Deed_Boost_%2890_min%29',
            'Slayer Deed Accelerator (60 minutes)': '',
            'Universal Ingredient Pack': 'https://lotro-wiki.com/index.php/Item:Universal_Ingredient_Pack',
            'Universal Solvent': 'https://lotro-wiki.com/index.php/Item:Universal_Solvent'
        }
    }

    function parseDates( dateString ) {
        let startDate = dateString.slice( ( dateString.indexOf( ', ' ) === -1 ? ( dateString.indexOf( 'Now' ) === -1 ? dateString.indexOf( ' through ' ) : 0 ) : dateString.indexOf( ', ' ) + 2 ), dateString.indexOf( ' through ' ) ).trim();
        if ( startDate.match( /now/i ) ) { startDate = startDate.toLowerCase(); }
        if ( startDate.indexOf( 'starting ' ) !== -1 ) {
            let arrDate = startDate.match( /starting (\d?\d):\d\d ([AP])M Eastern \((-[45]) GMT\) on (January|February|March|April|May|June|July|August|September|October|November|December) (\d?\d)(?:st|nd|rd|th) and running/ );
            startDate = arrDate[ 4 ] + ' ' + arrDate[ 5 ].padStart( 2, '0' ) + ', ' + ( new Date( now ) ).getFullYear() + ' ' + ( ( parseInt( arrDate[ 1 ] ) + ( arrDate[ 2 ] === 'A' ? 0 : 12 ) ) % 24 ) + ':00:00';
            startDate = ( new Date( startDate ) );
        }
        startDate = ( startDate === 'now' || startDate === '' ? now : ( startDate instanceof Date && !isNaN( startDate.valueOf() ) ? startDate.valueOf() : startDate + ', ' + ( new Date() ).getFullYear() ) );
        let endDate = dateString.match( /(January|February|March|April|May|June|July|August|September|October|November|December) (\d?\d)(?:st|nd|rd|th)/ );
        if ( !endDate ) { endDate = aWeekFromNow.valueOf(); }
        else { endDate = endDate[ 1 ] + ' ' + endDate[ 2 ].replace( /(st|nd|rd|th)[\.!:]/, '' ).padStart( 2, '0' ) + ', ' + ( new Date() ).getFullYear(); }
        return [ new Date( startDate ), new Date( endDate ) ];
    }

// Populate variables depending on which game
    if ( strGame === 'ddo' ) {
        chronicleSections = document.getElementsByTagName( 'h1' );
        InTheNews = chronicleSections[ ( chronicleSections.length - 1 ) ].nextElementSibling.nextElementSibling.children;
    } else {
        author = document.querySelector( 'span.news.author' ).innerText.replace( 'By ', '' );
        beaconSections = document.getElementsByTagName( 'h3' );
        InTheNews = beaconSections[ ( beaconSections.length - 1 ) ].nextSibling.nextSibling.children;
    }

        arrBonusDays = Array.from( InTheNews ).splice( 0, ( Array.from( InTheNews ).length - 2 ) );
        arrBonusDays.forEach( ( bonusDay, i ) => {
            bonusDay = parseHTMLtoDiscord( bonusDay.children[ 0 ].innerHTML );
            let strMatchStart = bonusDay.match( new RegExp( '(Bonus Days brings? you )' ) );
            strMatchStart = ( strMatchStart ? strMatchStart[ 0 ] : '' );
            let intBonusDayStart = bonusDay.indexOf( strMatchStart );
            let thisBD = bonusDay.slice( ( intBonusDayStart === -1 ? 0 : intBonusDayStart ), bonusDay.indexOf( ', ' ) ).replace( strMatchStart, '' );
            if ( thisBD.indexOf( ' through ' ) !== -1 ) { thisBD = thisBD.slice( 0, thisBD.indexOf( ' through ' ) ); }
            if ( bonusDay.lastIndexOf( '!' ) === bonusDay.length ) { thisBD += '!'; }
            else { thisBD += bonusDay.slice( bonusDay.lastIndexOf( '!' ) ); }
            let arrBonusDates = parseDates( bonusDay );
            let objBonusDates = { start: arrBonusDates[ 0 ], end: arrBonusDates[ 1 ] };
            if ( intBonusDayStart !== -1 ) { objBonusDays[ i ] = { name: thisBD, dates: objBonusDates }; }
        } );
        arrSalesFree = InTheNews[ ( InTheNews.length - 2 ) ];
        strSaleName = parseHTMLtoDiscord( arrSalesFree.children[ 0 ].children[ 0 ].innerHTML );
        strSalePercent = arrSalesFree.children[ 0 ].innerText.replace( strSaleName, '' ).match( /(\d+%)/ )[ 1 ];
        arrSalesVal = Array.from( arrSalesFree.children[ 1 ].children );
        arrSalesVal.forEach( ( item, i ) => { arrSalesVal[ i ] = item.innerText; } );
        let tmpSale = arrSalesVal.pop();
        arrSaleDates = parseDates( tmpSale );
        objSaleDates = { start: arrSaleDates[ 0 ], end: arrSaleDates[ 1 ] };
        rowFreebie = parseHTMLtoDiscord( InTheNews[ ( InTheNews.length - 1 ) ].children[ 0 ].innerHTML );
        strFreebieName = rowFreebie.replace( /\*\*/g, '' ).trim().slice( 0, strFreebieName.indexOf( ' with the Coupon Code' ) );
        strFreebieName = strFreebieName.slice( strFreebieName.indexOf( ' gets you a free ' ) ).replace( ' gets you a free ', '' );
        intFreebieQuantity = ( strFreebieName.match( / x([\d]+)/ ) ? parseInt( strFreebieName.match( / x([\d]+)/ )[ 1 ] ) : 1 );
        strFreebieLink = ( Object.keys( freebieLinks ).indexOf( strFreebieName.replace( / x([\d]+)/, '' ) ) === -1 ? freebieLinks.unknown + encodeURI( strFreebieName.replace( ' x' + intFreebieQuantity, '' ) ) : freebieLinks[ strFreebieName.replace( / x([\d]+)/, '' ) ] );
        strFreebieCode = '**' + rowFreebie.slice( rowFreebie.indexOf( 'Coupon Code&nbsp;' ), rowFreebie.indexOf( ', now through ' ) ).replace( 'Coupon Code&nbsp;', '' ) + '**';
        if ( strFreebieCode === '****' ) { strFreebieCode = rowFreebie.slice( rowFreebie.indexOf( 'Coupon Code ' ), rowFreebie.indexOf( ', now through ' ) ).replace( 'Coupon Code ', '' ); }
        arrFreebieDates = parseDates( rowFreebie );
        objFreebieDates = { start: arrFreebieDates[ 0 ], end: arrFreebieDates[ 1 ] };
        strFreebieWeek = objFreebieDates.start.toLocaleDateString( 'en-US', { month: 'short', day: '2-digit' } ) + ' - ' + objFreebieDates.end.toLocaleDateString( 'en-US', { month: 'short', day: '2-digit' } );

// Hand validate all components and make any needed adjustments
    /* Do the thing. */

// Create our object
    var objSpecials = {
        URI: document.URL,
        image: document.getElementsByClassName( 'news content' )[ 0 ].querySelector( 'img' ).getAttribute( 'src' ).replace( 'https://', 'http://' ),
        author: ( strGame === 'ddo' ? '*unknown*' : author ),
        pubDate: published,
        sSotW: {
            img: IMGsS,
            desc: SSdesc
        },
        bonusDays: objBonusDays,
        freebie: {
            dates: objFreebieDates,
            code: strFreebieCode,
            item: {
                name: strFreebieName,
                link: strFreebieLink
            },
            quantity: intFreebieQuantity,
            week: strFreebieWeek
        },
        sales: {
            name: strSaleName,
            dates: objSaleDates,
            percent: strSalePercent,
            value: arrSalesVal
        }
    }

    console.log( '%o', objSpecials );
    console.info( '%s', JSON.stringify( objSpecials ) );
} )();