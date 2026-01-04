// ==UserScript==
// @name        WaniKani english translation hider
// @description Hides english translations and lets the user toggle them at will
// @namespace   https://miguel.araco.mx
// @version     1.0.0
// @include     https://www.wanikani.com/lesson/session
// @copyright   2018+, Miguel Aragon
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @esversion
// @downloadURL https://update.greasyfork.org/scripts/371783/WaniKani%20english%20translation%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/371783/WaniKani%20english%20translation%20hider.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function( global ) {
	initialize();

	function initialize() {
		addGlobalCSS();

		let $sentencesContainer = document.querySelector( "#supplement-voc-context-sentence" );

		let mutationObserver = new MutationObserver( hideEnglishTranslations );
		mutationObserver.observe( $sentencesContainer, {
			attributes: true,
			childList: true,
			subtree: false,
		} );
	}

	function addGlobalCSS() {
		let css = `
			.ma-toggleTranslation {
				display: inline-block;
				
				margin-top: 2px;
				border-radius: 2px;
				padding: 0.4em 0.4em 0.3em;
				
				background: #a0f;
				color: #fff;
				text-shadow: 1px 1px 0 rgba(0,0,0,0.1);
				text-decoration: none;
			}
		`;

		let style = document.createElement( "style" );
		style.type = "text/css";
		style.innerHTML = css;
		document.getElementsByTagName( "head" )[ 0 ].appendChild( style );
	}

	function hideEnglishTranslations() {
		let $contextSentenceGroups = document.querySelectorAll( ".context-sentence-group" );
		$contextSentenceGroups.forEach( function( $contextSentenceGroup ) {
			let $englishTranslation = Array.from( $contextSentenceGroup.childNodes ).find( isEnglishTranslationParagraph );
			if( ! $englishTranslation ) return;

			$englishTranslation.classList.add( "hidden" );

			let $toggleButton = document.createElement( "a", {} );
			$toggleButton.textContent = "Show";
			$toggleButton.classList.add( "ma-toggleTranslation" );
			$toggleButton.setAttribute( "href", "javascript:void(0);" );
			$toggleButton.addEventListener( "click", toggleTranslation );

			$contextSentenceGroup.appendChild( $toggleButton );
		} );
	}

	function isEnglishTranslationParagraph( child ) {
		return child.tagName.toLowerCase() === "p" && child.getAttribute( "lang" ) !== "ja"
	}

	function toggleTranslation( event ) {
		event.preventDefault();

		let $toggleButton = this;
		let $parent = $toggleButton.parentNode;
		let $englishTranslation = Array.from( $parent.childNodes ).find( isEnglishTranslationParagraph );

		if( $englishTranslation.classList.contains( "hidden" ) ) {
			$englishTranslation.classList.remove( "hidden" );
			$toggleButton.textContent = "Hide";
		} else {
			$englishTranslation.classList.add( "hidden" );
			$toggleButton.textContent = "Show";
		}
	}
})();