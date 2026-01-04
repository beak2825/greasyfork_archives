// ==UserScript==
// @name			Twitter Image Download Mod
// @namespace		xuyiming.open@outlook.com
// @description     Download images in tweets
// @author			xymopen
// @author			pks
// @version			1.0.3
// @run-at			document-end
// @include			https://twitter.com*
// @match			https://twitter.com*
// @license			BSD 2-Clause
// @grant			GM_addStyle
// @grant			GM_xmlhttpRequest
// @connect			pbs.twimg.com
// @downloadURL https://update.greasyfork.org/scripts/40098/Twitter%20Image%20Download%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/40098/Twitter%20Image%20Download%20Mod.meta.js
// ==/UserScript==

( function () {
	"use strict";

	const Fragments = {
		fromString: domstring => {
			let divEl = document.createElement( "div" );

			divEl.innerHTML = domstring;

			return Array.from( divEl.childNodes ).reduce( ( fragment, node ) => {
				fragment.appendChild( node );

				return fragment;
			}, document.createDocumentFragment() );
		},

		fromIterable: nodeList =>
			Array.from( nodeList ).reduce( ( fragment, node ) => {
				fragment.appendChild( node );

				return fragment;
			}, document.createDocumentFragment() )
	};

	function stringToFragment( domstring ) {
		let divEl = document.createElement( "div" );

		divEl.innerHTML = domstring;

		return Array.from( divEl.childNodes ).reduce( ( fragment, node ) => {
			fragment.appendChild( node );

			return fragment;
		}, document.createDocumentFragment() );
	}

	function xGM_bufferRequest( request ) {
		// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Handling_binary_data
		let onload = request.onload;

		return GM_xmlhttpRequest( Object.assign( request, {
			overrideMimeType: "text/plain; charset=x-user-defined",
			onload: ( response ) => {
				let buffer = new Uint8Array( response.responseText.length );

				for ( let i = 0; i < response.responseText.length; i += 1 ) {
					buffer[ i ] = response.responseText.charCodeAt( i );
				}

				onload.call( request, buffer );
			}
		} ) );
	}

	let theDom = Fragments.fromString(
		'<div class="_download">'												+
			'<a>'																+
			'<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25">'	+
				// steal from GitHub's Octicons licensed under
				// MIT(https://github.com/primer/octicons/blob/master/LICENSE)
				'<path '														+
					'd="'														+
						'M4 '													+
						'6h3V0h2v6h3l-4 '										+
						'4-4-4zm11-4h-4v1h4v8H1V3h4V2H1c-.55 '					+
						'0-1 '													+
						'.45-1 '												+
						'1v9c0 '												+
						'.55.45 '												+
						'1 '													+
						'1 '													+
						'1h5.34c-.25.61-.86 '									+
						'1.39-2.34 '											+
						'2h8c-1.48-.61-2.09-1.39-2.34-2H15c.55 '				+
						'0 '													+
						'1-.45 '												+
						'1-1V3c0-.55-.45-1-1-1z"'								+
					'transform="scale(1.56)"'									+
					'fill="rgba(255, 255, 255, 0.4)" />'						+
			'</svg>'															+
			'</a>'																+
		'</div>'
	);

	GM_addStyle(
		'._download {'										+
			'border-radius: 5px;'							+
			'width: 35px;'									+
			'height: 35px;'									+
			'background-color: rgba(105, 105, 105, 0.2);'	+
			'position: absolute;'							+
			'right: 5px;'									+
			'bottom: 5px;'									+
		'}'													+

		'._download:hover {'								+
			'background-color: rgba(105, 105, 105, 0.4);'	+
		'}'													+

		'._download svg {'									+
			'position: relative;'							+
			'top: 5px;'										+
			'left: 5px;"'									+
		'}'
	);

	function onInsert( doc ) {
		let photoContainers = doc.querySelectorAll( ".permalink-tweet .AdaptiveMedia-photoContainer" );

		photoContainers.forEach( ( photoContainer, index ) => {
			let dom = theDom.cloneNode( true ),
				a = dom.querySelector( "a" );

			a.href = "#";
			a.dataset.state = "unfetched";

			// according to http://www.zhangxinxu.com/wordpress/2016/04/know-about-html-download-attribute/
			// cannot rename an crossing-domain resource
			a.addEventListener( "click", function ( event ) {
				event.stopPropagation();
				event.stopImmediatePropagation();

				if ( "unfetched" === a.dataset.state ) {
					let img = photoContainer.querySelector( "img" ),
						basename = location.pathname.replace(
							/\/(.+)\/status\/(.+)/,
							( $0, user, tweet ) => `twitter_${ user }_${ tweet }_${ index }`
						),
						extname = img.src.match( /(?=.)\w+$/ ).toString(),
						mime = ( {
							"jpg": "image/jpeg",
							"jepg": "image/jpeg",
							"png": "image/png",
							"gif": "image/gif",
						} )[ extname ] || "application/octet-stream";

					event.preventDefault();

					a.dataset.state = "fetching";

					xGM_bufferRequest( {
						method: "GET",
						url: img.src+':orig',
						headers: { referer: document.URL },
						onload: buffer => {
                            console.log(img.src);
							if ( "fetching" === a.dataset.state ) {
								let blob = new Blob( [ buffer ], { "type": mime } ),
									blobURL = URL.createObjectURL( blob );

								a.href = blobURL;
								a.download = `${ basename }.${ extname }`;
								a.dataset.state = "fetched";
								a.click();
							}
						},
						onerror: () => {
							if ( "fetching" === a.dataset.state ) {
								a.dataset.state = "error";
								alert( `Fail to fetch image ${ img.src }` );
							}
						}
					} );
				}
			}, true );

			photoContainer.appendChild( dom );
		} );
	}

	function onRemove( doc ) {
		Array.from( doc.querySelectorAll( "._download a" ) ).forEach( a => {
			if ( "fetched" === a.dataset.state ) {
				URL.revokeObjectURL( a.href );
			}

			a.dataset.state = "removed";
		} );
	}

    let target = document.querySelector( ".PermalinkOverlay-body" );
    let mutationConfig = {childList: true};
    let mutation = new MutationObserver( mutations => {
        mutations.forEach( mutation => {
            if ( mutation.removedNodes.length > 0 ) {
                onRemove( Fragments.fromIterable( mutation.removedNodes ) );
            }

            if ( mutation.addedNodes.length > 0 ) {
                onInsert( target );
            }
        } );
    } );
    mutation.observe(target, mutationConfig);

	if ( target.children.length > 0 ) {
		onInsert( target );
	}
} )();