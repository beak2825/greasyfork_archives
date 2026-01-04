// ==UserScript==
// @name         SME cleaner
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  Odstrani zbytocne elementy zo stranky
// @author       gortik
// @license      MIT
// @run-at       document-idle
// @match        https://*.sme.sk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sme.sk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476576/SME%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/476576/SME%20cleaner.meta.js
// ==/UserScript==


var	page_width = 750;


var	selectors_to_remove = [
		/*'.right-panel',
		'.js-deep-bar-gray',			//top header
		'.js-main-nav-sticky',			//red header
		'.js-deep-container-sub-nav',	//gray header
		'.tt-toggle-expandable',		//autor
		'.share-box.share-box-top',		//share-box top
		'.my-m.py-m.bb.bt',				//share-box bottom
		'.article-item-wrapper .template-xblock',		//nevzdali sme to
		'.article-item-wrapper .audio',	//podcast
		'.article-avizo',				//suvisiace clanky
		'.px-m-sm.cf.js-container-2',	//diskusia + bottom
		'.js-crossroad',				//Už ste cítali?
		'.js-sme-footer-wrapper',		//footer
		'.article-epilogue',			//Tento text ste mohli cítat vdaka tomu, že ...
		'.js-deep-container-article-topic-box',			//podobne temy bottom
		'.my-l.py-m.bb.bt',*/

		'#pb_right',					// right
		'#sme-corpbar',					// top header
		'.header-wrapper',				// red header
		'.subpage-nav-wrapper',			// gray header (bellow red)
		'.sme-banner-head-top-right',	// predplatne
		'.author-tile__controls',		// odoberat autora
		'.article-tail',				// share-box bottom
		'.module--topic-box',			// redakčné (bottom)
		'#pb_article_related_bottom',	// newsletter (bottom)
		'.sme-banner-article-head-bottom',// newsletter (top)
		'.module__tail',				// diskusia (top)
		'#pb_middle + .main-wrapper',	// diskusia a blogy
		'#pb_bottom',					// Už ste cítali?
		'.sme-footer',					// footer
		'.nav--separator-pipe',			// suvisiace (top)
        '.embed-related',				// suvisiace v clanku
    	'#pb_top',
    	'#pb_middle',
    	'.module--article-epilogue',	// Tento text ste mohli čítať vďaka tomu,...
    	'.js-atw-ready'					// Odkazy viditelne pri tlaceni
	],
	selectors = {
		author: '.author-tile__link',
		images: '.img'
	},
	highlight_elm = true

function changePageWidth() {
	if ( highlight_elm )
		return;

    // Sirka textu
    //document.querySelector( '#pb_main' ).style.maxWidth = page_width + 'px';

	/*
    //pop get last item from array
	let	text_elm = [ ...document.querySelectorAll( '.site-wrapper' ) ].pop();

	let	text_elm_css = getComputedStyle( text_elm );
	let	header_elm = document.querySelector( '.sme-logo-header' );

	header_elm.style.marginLeft = parseInt( text_elm_css.marginLeft ) + 'px';
	header_elm.style.width = page_width + 'px'
	*/
    // highlight
    //document.querySelector('.site-header').style.border = '2px solid red';
    //document.querySelector('#pb_main').style.border = '2px solid green';

    let textParent2 = document.querySelector('.site-wrapper');
    let textParent = document.querySelector('.main-wrapper')
    let text = document.querySelector('#pb_main')
    let banner = document.querySelector('.site-header');

    let textParent2Style = window.getComputedStyle( textParent2 );
    let textStyle = window.getComputedStyle( text );
    banner.style.margin = textParent2Style.margin;
    banner.style.width = textStyle.width;

    textParent.style.padding = '0px'
}

function findAndRemoveElement( selector ) {
    if ( !selector)
        return;

	let	elms = document.querySelectorAll( selector );
	console.log( `${selector}: ${elms.length} elements found.` );

	elms.forEach( e => {
		removeElement( e );
	});
}

function removeElement( elm ) {
	if ( highlight_elm ) {
		highlightElement( elm )
	}
	else if ( elm ) {
		elm.remove();
	}
}

function highlightElement( elm ) {
	elm.style.outline = '#00ff00 dashed 5px';
	elm.style.backgroundColor = 'white';
	elm.style.filter = 'brightness( 25% )';
}

function removeElements() {
    selectors_to_remove.forEach( selector => findAndRemoveElement( selector ) );
}

function getAuthorName() {
	let	elm = document.querySelector( selectors.author );
	if ( elm )
		return elm.textContent;
	else {
		console.log( 'Authors name wasnt found.' );
		return null;
	}
}

// removes images of article authors (Tkacenko, Shutz, ...)
function findAndRemoveImages( ) {
	let	images = document.querySelectorAll( selectors.images ),
		author_name = getAuthorName();

	console.log( `Author: '${author_name}'` );
    console.log(images)
	//if alt property of img == author_name remove image
	images.forEach( img => {
		if ( img.alt.indexOf( author_name ) != -1 ) {
			console.log( `Removing image: `, img );
			let item_wrapper = img.closest( 'a.embed-image' );
			removeElement( item_wrapper );
		}
	});
}

function volby() {
	findAndRemoveElement( '.ul' );
	findAndRemoveElement( '.gallery-single.fr-sm' );

	document.querySelectorAll( 'h3' ).forEach( elm => {
		if ( elm.textContent.startsWith( 'Výsledky' ) )
			removeElement( elm );
	});
}

function injectHTML() {
	let	parent = document.querySelector('#js-sme-corpbar-user-logged');
	parent.insertAdjacentHTML( 'afterbegin', '<a class="js-donate-subscription-button btn subscription-btn" id="my_skry" style="background-color: #5B7AEB;">SKRY</a>')
	parent.insertAdjacentHTML( 'afterbegin', '<a class="js-donate-subscription-button btn subscription-btn" id="my_ukaz" style="background-color: #EB755B;">UKÁŽ</a>')

	document.querySelector( '#my_skry' ).addEventListener( 'click', () => cleanPage( false ) );
	document.querySelector( '#my_ukaz' ).addEventListener( 'click', () => { cleanPage( true ) } );
}

function cleanPage( show_only = false ) {
	highlight_elm = show_only;
	console.log( `\n\n\nHighlight only: ${highlight_elm}` );

    removeElements();
	findAndRemoveImages();
    changePageWidth();

	//volby();
}

injectHTML();



