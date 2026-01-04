// ==UserScript==
// @name         SpaceBattles Reader Mode
// @namespace    ultrabenosaurus.SpaceBattles
// @version      1.13
// @description  Some minor tweaks to help enable and preserve reader mode on Space Battles.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://forums.spacebattles.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacebattles.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546157/SpaceBattles%20Reader%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/546157/SpaceBattles%20Reader%20Mode.meta.js
// ==/UserScript==

var _set_showTM = GM_registerMenuCommand( "Toggle Mini ToC", function(event) {

    GM_setValue( "UBshowThreadmarkMenu", !GM_getValue( "UBshowThreadmarkMenu", false ) );

});
var _listen_TM = GM_addValueChangeListener( "UBshowThreadmarkMenu", function(key, oldValue, newValue, remote) {

    // add or remove the menu
    if( false == newValue ) {
        if( 0 != document.querySelectorAll( 'div.UB-tm-container' ).length ) {
            document.querySelector( 'div.p-body' ).removeChild(document.querySelector( 'div.UB-tm-container' ));
        }
    } else {
        UBbuildThreadmarkMenu();
    }

});

(function() {
    'use strict';

    var _chapterPosts = document.querySelectorAll( 'article.hasThreadmark' );

    if( 0 != _chapterPosts.length ) {

        _chapterPosts.forEach( function( _post, _i, _chaps ) {

            var _postID = _post.getAttribute( 'data-content' );

            if( "reader" == document.location.href.split('/')[5] || "reader" == document.location.href.split('/')[6] ) {
                // if in reader mode, fix post number links

                UBfixReaderPostLinks( _postID, _post.querySelectorAll( 'div.message-inner header.message-attribution ul.message-attribution-opposite li:has(a[aria-label="Share"])+li > a' ) );

            } else {
                // if not in reader mode, bring button up to top of chapter where it's actually useful

                var _btn = document.querySelector( 'article#js-' + _postID + ' div.message-cell li.reader a.threadmark-control' );
                if( _btn && _btn != null ) {
                    document.querySelector( 'article#js-' + _postID + ' div.message-cell span.primary:has(span.threadmarkLabel)' ).insertAdjacentHTML( "afterend", _btn.outerHTML.replace( _btn.href.split('#')[1], _postID ) );
                }

            }
        });

        window.addEventListener( 'scroll', UBupdateLocationAnchor);

        if( GM_getValue( "UBshowThreadmarkMenu", false ) ) {
            UBbuildThreadmarkMenu();
        }

    }
})();

function UBfixReaderPostLinks( _postID, _postLinks ) {
    _postLinks.forEach( function( _link, _i, _posts ) {

        _link.setAttribute( 'href', document.location.href.split('#')[0] + '#' + _postID );

    });
}

function UBupdateLocationAnchor(){

    if( history.pushState ) {

        var _chapterPosts = document.querySelectorAll( 'article.hasThreadmark' );

        if( 0 != _chapterPosts.length ) {
            // if browser has 'history.pushState' and page has chapters, loop them to check position

            _chapterPosts.forEach( function( _post, _i, _chaps ) {

                if( 50 > _post.getBoundingClientRect().top && 50 < _post.getBoundingClientRect().bottom ){

                    //console.log( _post.getBoundingClientRect() );

                    if( _post.getAttribute( 'id' ) != 'js-' + document.location.hash.substr( 1 ) || 0 == document.querySelectorAll( 'nav.UB-tm-nav li .UB-current-threadmark' ).length ) {
                        // if current chapter is at or past the top of the screen, update page title and history state

                        var _title = document.querySelector( 'h1.p-title-value' ).innerHTML.trim() + " - " + _post.querySelector( 'div.message-cell span.primary span.threadmarkLabel' ).innerHTML.trim();
                        //console.log( _post.getAttribute( 'id' ).replace( 'js-', '' ), _title );

                        document.title = _title;
                        history.pushState( {}, _title, '#' + _post.getAttribute( 'data-content' ) );

                        // remove chapter highlights from mini-ToC
                        if( 0 != document.querySelectorAll( 'nav.UB-tm-nav li a.UB-current-threadmark' ).length ) {

                            document.querySelectorAll( 'nav.UB-tm-nav li a.UB-current-threadmark' ).forEach( function( _link, _i, _links ) {

                                _link.removeAttribute( 'class' );

                            });

                        }
                        // add highlight to current chapter on mini-ToC
                        if( 1 == document.querySelectorAll( 'nav.UB-tm-nav li span a[href="' + window.location.hash + '"]' ).length ) {

                            document.querySelector( 'nav.UB-tm-nav li a[href="' + window.location.hash + '"]' ).parentNode.setAttribute( 'class', 'UB-current-threadmark' );

                        } else if( 1 == document.querySelectorAll( 'nav.UB-tm-nav li a[href="' + window.location.hash + '"]' ).length ) {

                            document.querySelector( 'nav.UB-tm-nav li a[href="' + window.location.hash + '"]' ).setAttribute( 'class', 'UB-current-threadmark' );

                        }

                    } else {

                        return;

                    }
                }
            });
        }
    }

}

function UBbuildThreadmarkMenu(){
    // add our CSS to the <head>
    document.getElementsByTagName('head')[0].insertAdjacentHTML( 'beforeend', '<style>' + UBgetThreadmarkMenuCSS() + '</style>' );

    // add main pagination to bottom of menu
    var _menuHTML = UBgetThreadmarkMenuHTML().replace( '$pagination$', ( 0!=document.querySelectorAll('div.block-outer-main nav.pageNavWrapper').length ? document.querySelectorAll('div.block-outer-main nav.pageNavWrapper')[0].outerHTML : '' ) );
    _menuHTML = _menuHTML.replace( '$rss$', 'https://forums.spacebattles.com/threads/'+document.location.href.split('/')[4]+'/threadmarks.rss?threadmark_category=1' );

    var _chapterPosts = document.querySelectorAll( 'article.hasThreadmark' );

    if( 0 != _chapterPosts.length ) {

        // if chapter posts on page, loop them to build the list of links
        _chapterPosts.forEach( function( _post, _i, _chaps ) {

            // get post metadata
            var _postID = _post.getAttribute( 'data-content' );
            var _title = _post.querySelector( 'div.message-cell span.primary span.threadmarkLabel' ).innerHTML.trim();

            // start building menu item
            var _menuItemStart = '<li>';
            var _menuItemEnd = '</li>\n\t\t\t$menuitems$';
            var _readerLink = '';

            // if not in reader mode, also add scroll icon next to threadmark links
            if( 1 == document.location.href.split('reader').length ) {

                var _btn = document.querySelector( 'article#js-' + _postID + ' div.message-cell li.reader a.threadmark-control' );
                if( _btn && _btn != null ) {
                    _readerLink = _btn.getAttribute( 'href' ).replace( _btn.href.split('#')[1], _postID );
                }

                _menuItemStart += '<span>';
                _menuItemEnd = '</span>' + _menuItemEnd;

            }

            // build current menu item
            var _menuItem = _menuItemStart + '<a href="#' + _postID + '"';
            if( 0 != window.location.hash.length && _postID == document.location.hash.substr( 1 ) ) {
                _menuItem += ' class="UB-current-threadmark"';
            }
            _menuItem += ' title="Scroll to Threadmark \'' + _title + '\'">';
            _menuItem += _title + '</a>' + ( '' != _readerLink ? '&nbsp; <a href="' + _readerLink + '" title="Go to Threadmark \'' + _title + '\' in Reader Mode"><i class="fa--xf fal fa-scroll" aria-hidden="true"></i></a>' : '' );
            _menuItem += _menuItemEnd;

            // add it to the list
            _menuHTML = _menuHTML.replace( '$menuitems$', _menuItem );

        });

        // clean up the list of links
        _menuHTML = _menuHTML.replace( '$menuitems$', '' );

    }

    // insert menu into the page
    document.querySelector('div.p-body').insertAdjacentHTML( 'beforeend', _menuHTML );

    document.getElementById( 'UB-watch-thread' ).addEventListener( "click", function( _event ) {
        _event.preventDefault();
        document.getElementById('UB-tm-toggle').checked = !document.getElementById('UB-tm-toggle').checked;
        document.querySelector(' a.button.button--link[data-sk-watch]').click();
    });
}

function UBgetThreadmarkMenuHTML(){
    return `<div class="UB-tm-container">
	<input type="checkbox" id="UB-tm-toggle" />
	<!--<label class="UB-tm-button" for="UB-tm-toggle"><span>T</span></label>-->
    <button class="UB-tm-button" title="Show List of Threadmarks on Current Page" onclick="document.getElementById('UB-tm-toggle').checked = !document.getElementById('UB-tm-toggle').checked;"><span>T</span></button>

	<nav class="UB-tm-nav">
		<ul>
			<li><span><a href="$rss$" title="Subscribe via RSS"><i class="fa--xf fal fa-rss" aria-hidden="true"></i></a> &nbsp; Threadmarks on Page &nbsp; <a id="UB-watch-thread" href="#" title="Watch / Unwatch Thread"><i class="fa--xf fal fa-eye" aria-hidden="true"></i></a></span></li>
			$menuitems$
			<li><span>$pagination$</span></li>
		</ul>
	</nav>
</div>`;
}

function UBgetThreadmarkMenuCSS(){
    return `#UB-tm-toggle {
	-webkit-appearance: none;
}

.UB-tm-button {
	opacity: 0.35;
	position: fixed;
	z-index: 999;
	display: flex;
	cursor: pointer;
	width: 50px;
	height: 50px;
	bottom: 20px;
	left: 20px;
	align-items: center;
	background-color: #333844;
    border: none;
	border-radius: 50px;
}
@media only screen and (max-width: 900px) {
	.UB-tm-button {
		opacity: 0.5;
	}
}
.UB-tm-button:hover {
	opacity: 1;
}
.UB-tm-button span {
	width: 100%;
	text-align: center;
	font-family: Bookerly, serif;
	font-size: 18px;
	font-weight: bold;
	color: #ff8c10;
	line-height: 0;
}

#UB-tm-toggle:checked ~ .UB-tm-nav {
	opacity: 1;
/*    display: revert;*/
	visibility: visible;
	transform: translateY(-10%);
}
#UB-tm-toggle:checked ~ .UB-tm-button {
	opacity: 1;
}

.UB-tm-nav {
	opacity: 0;
	visibility: hidden;
	transition: all 0.4s ease-in-out;
	background: #60646f;
	min-width: 200px;
	max-width: 500px;
	border-radius: 10px;
	transform: translateY(0%);
	position: fixed;
	bottom: 10px;
	left: 45px;
	max-height: 520px;
	overflow: scroll;
}
@media only screen and (max-width: 900px) {
	.UB-tm-nav {
		width: calc(100vw - 90px);
		max-height: 80vh;
	}
}
.UB-tm-nav > ul {
	margin: 0;
	padding: 0;
	width: 100%;
	position: relative;
	display: table;
}

.UB-tm-nav > ul > li {
	text-align: center;
	display: table-row;
	list-style-type: none;
/*	font-weight: bold;*/
	font-family: Bookerly, serif;
	font-size: 10pt;
}
.UB-tm-nav > ul > li:first-child {
	font-weight: bold;
}
.UB-tm-nav > ul > li:first-child,
.UB-tm-nav > ul > li:last-child {
	color: #ff8c10;
    background-color: #333844;
}
.UB-tm-nav > ul > li:nth-child(2) > a {
	border-top: 1px solid #333844;
}
.UB-tm-nav > ul > li:not(:first-child) > a {
	border-bottom: 1px solid #333844;
}

.UB-tm-nav > ul > li > a {
	display: table-cell;
	vertical-align: middle;
	padding: 10px 10px 12px 10px;
	color: #0f0;
	text-decoration: none;
}
.UB-tm-nav > ul > li > a:hover {
	text-decoration: underline;
	background-color: #333844;
}
.UB-tm-nav > ul > li > a.UB-current-threadmark,
.UB-tm-nav > ul > li > span.UB-current-threadmark {
	background-color: #191F2D;
}

.UB-tm-nav > ul > li > span {
	display: table-cell;
	vertical-align: middle;
	padding: 10px 5px;
}`;
}
