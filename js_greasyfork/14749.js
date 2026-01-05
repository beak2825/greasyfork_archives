/**
 * Created by Magnus on 2015-11-07.
 */

//// ==UserScript==
// @name			thejigsawpuzzles.com
// @namespace		4941ca1b-4ea1-42cd-817e-20476bfbae92
// @version			0.25
// @description     enter something useful

// @match			http://thejigsawpuzzles.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @require         https://greasyfork.org/scripts/9160-my-function-library/code/My%20Function%20library.js?version=93168

// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue

// @run-at			document-start

// @created			2015-10-24
// @released		2015-12-10
// @updated			2015-00-00
// @history         @version 0.25 - first version: @released - 2015-12-10

// @compatible		Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @copyright		2014+, Magnus Fohlstrom
// @downloadURL https://update.greasyfork.org/scripts/14749/thejigsawpuzzlescom.user.js
// @updateURL https://update.greasyfork.org/scripts/14749/thejigsawpuzzlescom.meta.js
// ==/UserScript==

/*global $, jQuery*/

/*jshint -W014, -W030, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or funtion call insted saw an expression


(function($){

    var css 	= {
            main				: function(){
                return	''
                    +	'img.ImageFrame_solid {'
                    +		'width: 100%;'
                    +		'min-width: 130px;'
                    +		'height: inherit;'
                    +		'}'
                    +	'img.giThumbnailIce, td#microThumb {'
                    +		'width: 130px;'
                    +		'height: inherit;'
                    +		'}'
                    +	'#gallery > table {'
                    +		'width: calc(100% - 100px);'
                    +		'margin: 0 auto;'
                    +		'}'
                    +	'#ContentAlbum div.gbNavigator {'
                    +		'width: 444px ;'
                    +		'}'
                    +	'#sidebar table a {'
                    +		'font-size: 16px;'
                    +		'}'
                    +	'.popupMenuContainer, #gallery a {'
                    +		'font-size: 15px !;'
                    +		'}'
                    +	'#gsImageView table {'
                    +		'zoom:1.5;'
                    +		'}'
                    +	'.buttonAction {'
                    +		'zoom: 0.3;'
                    +		'}'
                    +	'.buttonAction a {'
                    +		'height: 60px !;'
                    +		'width: 60px !;'
                    +		'background-size: contain !;'
                    +		'}'
                    +	'#gsImageView .buttonAction {'
                    +		'zoom: 0.6;'
                    +		'}'
                    +	'#gsImageView .buttonAction a {'
                    +		'height: 12px !;'
                    +		'width: 12px !;'
                    +		'background-size: contain !;'
                    +		'}'
                    +	'#gbBlockDownloadEJ {'
                    +		'background-size: cover !;'
                    +		'margin: 0 auto;'
                    +		'width: 222px !;'
                    +		'height: 212px !;'
                    +		'}'
                    +	'div#gbBlockDownloadEJ a {'
                    +		'text-align: center !4;'
                    +		'}';
            },
            dyn  			: function(){
                return	'';
            },
            style  			: function( id, var1, var2 ){
                var $id = $( 'head #' + id ), cssID = css[ id ]( var1, var2 ).formatString();
                $id.length ? $id.html( cssID ) : $( $( '<style/>',{ id: id, class:'mySuperStyles', html: cssID } ) ).appendTo('head');
            }
        },
        html 	= {
            puzzleImageLink : function(){
                var $href = location.origin + $('#pg param[name=flashvars]').attr('value').split('URL=').pop().split('%2F').join('\/'),
                    $html = $( '<a/>',{ class:'gbAdminLink', target:'_blank', href:$href, text:'Link to Image' } );

                $( '<div/>',{ class:'gbBlock', html:$html } ).appendTo('#gsSidebar');
            }
        },
        fn 		= {
            reSizeImage 	: function(){
                var imgElem = $('body > img'), pageWidth = $w.width(), pageHeight = $w.height(), corr = 0.000,
                    changeHeight = function(){
                        imgElem.css('cssText','height:' +( pageHeight - ( pageHeight * corr ) )+ 'px; width: initial');
                    },
                    changeWidth = function(){
                        imgElem.css('cssText','width:' + ( pageWidth - ( pageWidth * corr ) )+ 'px; height: initial');
                    };

                imgElem.height() > imgElem.width() ? changeWidth() : changeHeight();
            },
            loadHref	: function( dir ){
                var pager = $( '.button' + dir ).find( 'a' ).href();
                pager !== undefined && loadDoc( pager );
            },
            changeThumbLink : function(){
                var change = function( $e, find, change ){
                    $e.attr('src', $e.attr('src').replace( find, change ) );
                    refreshElement( $e , 'fast' );
                };
                $( 'img.ImageFrame_solid' ).each(function( i, e ){ change( $(e),'-130/','/' ); });
                $( 'img.giThumbnailIce' ).each(function( i, e ){ change( $(e),'-50/','-130' ); });
            }
        },
        listeners	= {
            pageNav 	: function(){
                c.i('pageNav');
                $d.on( 'click', '.gbBlockNavTop, .gbBlockBottom, #gallery', function(e){

                    var X_spot			= 	e.clientX,
                        ContentElem		= 	$(this).hasId('gallery') ? $('#gallery > table') : $('#ContentAlbum div.gbNavigator table'),
                        ContentLeft		= 	ContentElem.offset().left,
                        ContentRight	= 	ContentLeft + ContentElem.width();

                    filterClick( e, this ) && ( X_spot < ContentLeft || X_spot > ContentRight ) &&
                    fn.loadHref( X_spot < ContentLeft ? 'Prev' : 'Next' );
                });
                //e.stopPropagation()
                //e.preventDefault()
            },
            keyNav		: function(){
                d.addEventListener('keydown', function(e){
                    if( $('input').is(':focus') || g.ms !== 0 ) return false; else g.timer(256);

                    var key 	= 	e.keyCode; c.i('Key',key);
                    switch( key ){
                        case 39:    fn.loadHref( 'Next' );    		break;          // arrow right
                        case 37:    fn.loadHref( 'Prev' );   		break;          // arrow left
                    }
                }, false);
            },
            resize 		: function(){
                c.i('resize');
                $w.resize(function(){ $('#feedbackButton').length || fn.reSizeImage(); });
            }
        },
        render 	= {
            first			: function(){
                c.i('render');
                css.style('main');
            }
        },
        observer = new MutationObserver( function( mutations ){
            mutations.forEach( function( mutation ){
                $( mutation.addedNodes ).each( function( i, e ){
                    var $e = $(e), $p = $e.parent();
                    $e.isTag('object') && $e.hasId('pg') && html.puzzleImageLink();
                });
            });
        });

    //noinspection JSCheckFunctionSignatures
    observer.observe( document, { subtree: true, childList: true });

    render.first();

    c.i('thejigsawpuzzles.com77');

    $d.ready(function(){
        $('#feedbackButton').length || ( fn.reSizeImage(), listeners.resize() );
        fn.changeThumbLink();
        listeners.pageNav();
        listeners.keyNav();
        setTimeout(function(){ $('.mySuperStyles').appendTo('head'); },2000 );
    });

}(jQuery));
