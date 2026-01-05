// ==UserScript==
// @name            Map Linker GoogleMaps
// @description     Link Google with other maps
// @namespace       1d196b78-800f-45a5-8c34-bfcf2f652eb4
// @version         0.2

// @match			https://maps.google.se/maps*
// @match			https://www.google.se/maps/*
// @match			https://www.google.com/maps/*

// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @require         https://greasyfork.org/scripts/17293-alert/code/$alert.js?version=109035
// @require https://greasyfork.org/scripts/9160-my-function-library/code/My%20Function%20library.js?version=168434


// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_deleteValue
// @grant           GM_xmlhttpRequest
// @grant			GM_getResourceURL


// @resource		Terraserver 	https://yt3.ggpht.com/-jiYzuprSqZQ/AAAAAAAAAAI/AAAAAAAAAAA/X0J7cmuseqU/s100-c-k-no-mo-rj-c0xffffff/photo.jpg
// @resource		Wikimapia 		http://monkeyscript.4all.nu/shareResorces/images/wikimapia.org_favicon.ico
// @resource		Panoramio 		http://monkeyscript.4all.nu/shareResorces/images/panoramio.com.webp
// @resource		Hitta 			http://monkeyscript.4all.nu/shareResorces/images/hitta.se_favicon.ico
// @resource		Eniro 			http://monkeyscript.4all.nu/shareResorces/images/eniro.com_favicon.ico
// @resource		zoomEarth 		http://monkeyscript.4all.nu/shareResorces/images/zoom.earth_globe-search-find-64.png
// @resource		Wiwosm 			http://monkeyscript.4all.nu/shareResorces/images/Wiwosm_Tool_Labs_logo_thumb.png
// @resource		Hitchwiki 		http://hitchwiki.org/maps/static/gfx/mobile/app_icons-screens/icon_57x57.png
// @resource		Bing 			https://www.bing.com/sa/simg/bing_p_rr_teal_min.ico
// @resource		Flickr 			https://s.yimg.com/pw/favicon.ico
// @resource		Wikimap 		http://wiki-map.com/favicon.ico
// @resource		Geonames 		http://www.geonames.org/img/globe.gif
// @resource		yandex 			https://yandex.com/maps/favicon.png
// @resource		Openstreetmap 	https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg

// @created         2015-03-06
// @released        2015-00-00
// @updated         2015-00-00

// @history         @version 0.25 - Alpha version: @released - 2015-03-12
// @history         @version 0.45 - Beta version: @released - 2015-03-17
// @history         @version 0.5 - RC version: @released - 2016-02-21

// @compatible      Greasemonkey, Tampermonkey
// @license         GNU GPL v3 (http://www.gnu.org/copyleft/gpl.html)
// @copyright       2015+, Magnus Fohlström
// @downloadURL https://update.greasyfork.org/scripts/27054/Map%20Linker%20GoogleMaps.user.js
// @updateURL https://update.greasyfork.org/scripts/27054/Map%20Linker%20GoogleMaps.meta.js
// ==/UserScript==

/*global $, jQuery*/
/*jshint -W014, -W030, -W082*/
// -W014, laxbreak, Bad line breaking before '+'
// -W030, Expected assignment or function call instead saw an expression



(function() {
	var returnThis,
		css = {
			button      : function(){
				return ''
					+	'#mapsHolder {'
					+		'position:absolute;'
					+		'right:150px;'
					+		'padding-top: 12px;'
					+		'height: 18px;'
					+		'background-color: rgba(83, 94, 72, 0.72);'
					+		'}'
					+	'#mapsHolder button {'
					+		'margin:-21px 6px;'
					+		'width:24px;'
					+		'height:24px;'
					+		'}'
					+	'.buttonPanoramio {'
					+		'position: relative;'
					+		'top: 13px;'
					+		'left: 11px;'
					+		'width: 52px !important;'
					+		'height: 40px !important;'
					+		'}'
					+	'#mapsHolder button img {'
					+		'width:100%;'
					+		'height:100%;'
					+		'}';
			},
			style  		: function( id, var1, var2 ){
				var $id = $( 'head #' + id ), cssID = css[ id ]( var1, var2 ).formatString();
				$id.length ? $id.html( cssID ) : $( $( '<style/>',{ id: id, class:'mySuperStyles', html: cssID } ) ).appendTo('head');
			}
		},
		html = {
			coordinates : null,
			positions   : {
				Panoramio : function(){
					var returnThis;
					returnThis = 'http://www.panoramio.com/map/#lt=' + html.coordinates[0] + '&ln=' + html.coordinates[1] + '&z=1&k=2&a=1&tab=1&pl=all';
					return returnThis;
				},
				Wikimapia : function(){
					returnThis = 'http://wikimapia.org/#lang=en&lat=' + html.coordinates[0] + '&lon=' + html.coordinates[1] + '&z=18&m=b';
					return returnThis;
				},
				Hitta : function(){
					returnThis = 'https://www.hitta.se/kartan!~' + html.coordinates[0] + ',' + html.coordinates[1] + ',17z/tileLayer!l=1/';
					return returnThis;
				},
				Eniro : function(){
					returnThis = 'http://kartor.eniro.se/m/U6JNo?zoom=19&center=' + html.coordinates[0] + ',' + html.coordinates[1] + '&layer=aerial';
					return returnThis;
				},
				zoomEarth : function(){
					returnThis = 'https://zoom.earth/#' + html.coordinates[0] + ',' + html.coordinates[1] + ',18z,sat';
					return returnThis;
				},
				Wiwosm : function(){
					returnThis = 'https://tools.wmflabs.org/wiwosm/osm-on-ol/commons-on-osm.php?zoom=18&lat=' + html.coordinates[0] + '&lon=' + html.coordinates[1];
					return returnThis;
				},
				Bing : function(){
					returnThis = 'https://www.bing.com/mapspreview?FORM=EXIPRV&signedup=1&cp=' + html.coordinates[0] + '~' + html.coordinates[1] + '&style=a&lvl=18';
					return returnThis;
				},
				Flickr : function(){
					returnThis = 'https://www.flickr.com/map?&fLat=' + html.coordinates[0] + '&fLon=' + html.coordinates[1] + '&zl=17';
					return returnThis;
				},
				Hitchwiki : function(){
					returnThis = 'http://hitchwiki.org/maps/?zoom=18&lat=' + html.coordinates[0] + '&lon=' + html.coordinates[1];
					return returnThis;
				},
				Wikimap : function(){
					returnThis = ('http://wiki-map.com/map/?locale=sv&lat=' + html.coordinates[0] + '&lng=' + html.coordinates[1]);
					return returnThis;
				},
				Geonames : function(){
					returnThis = 'http://www.geonames.org/maps/google_' + html.coordinates[0] + '_' + html.coordinates[1] + '.html';
					return returnThis;
				},
				yandex : function(){
					returnThis = 'https://yandex.com/maps/?ll=' + html.coordinates[1] + '%2C' + html.coordinates[0] + '&z=17&l=sat';
					return returnThis;
				},
				Openstreetmap : function(){
					returnThis = 'https://www.openstreetmap.org/?mlat=' + html.coordinates[0] + '&mlon=' + html.coordinates[1] + '&zoom=20#map=15/' + html.coordinates[0] + '/' + html.coordinates[1];
					return returnThis;
				},
				Terraserver : function(){
					returnThis = 'https://www.terraserver.com/view?utf8=%E2%9C%93&searchLat=' + html.coordinates[0] + '&searchLng=' + html.coordinates[1];
					return returnThis;
				}
			},
			dataArray   : function(){
				return [
					{ on:0, order:10, button:'Panoramio',   image:'',//GM_getResourceURL('Panoramio'), //'http://monkeyscript.4all.nu/shareResorces/images/panoramio.com.webp',
					 //'https://lh5.ggpht.com/iX6z62XBBt1b2T0fWnt9EupX1e6yFoUnYwO60z702xIp3-VlJquqYBOSay7aKhd5wbQ=w300-rw',//'https://ssl.panoramio.com/img/favicon.ico'
					 position: '' // 'http://www.panoramio.com/map/#lt=' + html.coordinates[0] + '&ln=' + html.coordinates[1] + '&z=1&k=2&a=1&tab=1&pl=all'
					},
					{ on:1, order:20, button:'Wikimapia',   image:'', //GM_getResourceURL('Wikimapia'), //'http://monkeyscript.4all.nu/shareResorces/images/wikimapia.org_favicon.ico',
					 //'http://wikimapia.org/favicon.ico?650',
					 position: '' // 'http://wikimapia.org/#lang=en&lat=' + html.coordinates[0] + '&lon=' + html.coordinates[1] + '&z=18&m=b'
					},
					{ on:1, order:80, button:'Hitta',       image:'', //GM_getResourceURL('Hitta'), //'http://monkeyscript.4all.nu/shareResorces/images/hitta.se_favicon.ico',
					 //https://www.hitta.se/static/img/favicons/favicon.ico
					 position: '' // 'https://www.hitta.se/kartan!~' + html.coordinates[0] + ',' + html.coordinates[1] + ',17z/tileLayer!l=1/'
					},
					{ on:1, order:90, button:'Eniro',       image:'', //GM_getResourceURL('Eniro'), //'http://monkeyscript.4all.nu/shareResorces/images/eniro.com_favicon.ico',
					 //'http://static.eniro.com/img/profiles/se/favicon.ico',
					 position: //'http://kartor.eniro.se/m/U6JNo?embed=true&center=' + html.coordinates[0] + ',' + html.coordinates[1] + '&zoom=18&layer=aerial'
					 '' // 'http://kartor.eniro.se/m/U6JNo?zoom=19&center=' + html.coordinates[0] + ',' + html.coordinates[1] + '&layer=aerial'
					},
					{ on:1, order:30, button:'zoomEarth',   image:'', //GM_getResourceURL('zoomEarth'), //'http://monkeyscript.4all.nu/shareResorces/images/zoom.earth_globe-search-find-64.png',
					 //'https://cdn3.iconfinder.com/data/icons/glypho-travel/64/globe-search-find-64.png',
					 position: '' // 'https://zoom.earth/#' + html.coordinates[0] + ',' + html.coordinates[1] + ',18z,sat'
					},
					{ on:1, order:72, button:'Wiwosm',      image:'', //GM_getResourceURL('Wiwosm'), //'http://monkeyscript.4all.nu/shareResorces/images/Wiwosm_Tool_Labs_logo_thumb.png',
					 //'https://tools.wmflabs.org/Tool_Labs_logo_thumb.png',
					 position: '' // 'https://tools.wmflabs.org/wiwosm/osm-on-ol/commons-on-osm.php?zoom=18&lat=' + html.coordinates[0] + '&lon=' + html.coordinates[1]
					},
					{ on:1, order:40, button:'Bing',        image:'', //GM_getResourceURL('Bing'), //'https://www.bing.com/sa/simg/bing_p_rr_teal_min.ico',
					 position: '' // 'https://www.bing.com/mapspreview?FORM=EXIPRV&signedup=1&cp=' + html.coordinates[0] + '~' + html.coordinates[1] + '&style=a&lvl=18'
					},
					{ on:1, order:120, button:'Flickr',     image:'', //GM_getResourceURL('Flickr'), //'https://s.yimg.com/pw/favicon.ico',
					 position: '' // 'https://www.flickr.com/map?&fLat=' + html.coordinates[0] + '&fLon=' + html.coordinates[1] + '&zl=17'
					},
					{ on:1, order:100, button:'Hitchwiki',  image:'', //GM_getResourceURL('Hitchwiki'), //'http://hitchwiki.org/maps/static/gfx/mobile/app_icons-screens/icon_57x57.png',
					 position: '' // 'http://hitchwiki.org/maps/?zoom=18&lat=' + html.coordinates[0] + '&lon=' + html.coordinates[1]
					},
					{ on:1, order:50, button:'Wikimap',     image:'', //GM_getResourceURL('Wikimap'), //'http://wiki-map.com/favicon.ico',
					 position: '' // 'http://wiki-map.com/map/?locale=sv&lat=' + html.coordinates[0] + '&lng=' + html.coordinates[1]
					},
					{ on:1, order:70, button:'Geonames',    image:'', //GM_getResourceURL('Geonames'), //'http://www.geonames.org/img/globe.gif',
					 position: '' // 'http://www.geonames.org/maps/google_' + html.coordinates[0] + '_' + html.coordinates[1] + '.html'
					},
					{ on:1, order:110, button:'yandex',     image:'', //GM_getResourceURL('yandex'), //'https://yandex.com/maps/favicon.png',
					 position: '' // 'https://yandex.com/maps/?ll=' + html.coordinates[1] + '%2C' + html.coordinates[0] + '&z=17&l=sat'
					},
					{ on:1, order:60, button:'Openstreetmap', image:'', //GM_getResourceURL('Openstreetmap'), //'https://upload.wikimedia.org/wikipedia/commons/b/b0/Openstreetmap_logo.svg',
					 position: '' // 'https://www.openstreetmap.org/?mlat=' + html.coordinates[0] + '&mlon=' + html.coordinates[1] + '&zoom=20#map=15/' + html.coordinates[0] + '/' + html.coordinates[1]
					},
					{ on:1, order:55, button:'Terraserver', image:'',
					 position: ''
					},
					{ on:0, order:140, button:'', image:'',
					 position: ''
					},
					{ on:0, order:150, button:'', image:'',
					 position: ''
					},
					{ on:0, order:160, button:'', image:'',
					 position: ''
					}
				];
			},
			thisURL     : function(){
				return location.href.split('@').pop().split(',');
			},
			mapsHolder  : null,
			button      : function( map ){
				return '<button aria-label="Go to '+ map.button +'" oncontextmenu="return false;" class="widget-expand-button-pegman-background grab-cursor button'+ map.button + '" > '
					+		'<div class="'+ map.button +'Wrapper mapButtonIcon" >'
					+		    '<a target="_blank" href="'+ this.positions[ map.button ]() + '" class="'+ map.button +'Url" data-map="'+ map.button +'" title="Go to '+ map.button +'">'
					+               '<img src="'+ ( map.image.length > 5 ? map.image : GM_getResourceURL( map.button ) ) +'"></a></div></button>';
			},
			render      : function( source ){
				c.l('renderSource', source );

				if( $('#mapsHolder').length )
					return false;
				else
					this.mapsHolder = $( '<div/>',{ id:'mapsHolder' });

				this.coordinates = this.thisURL();

				var that = this;
				$.each( that.dataArray().sort( sortBy( 'order' ) ), function( i, map ){
					map.on && ( 
						that.mapsHolder.find('.'+ map.button +'Wrapper').length || $( that.button( map ) ).appendTo( that.mapsHolder ) 
					);
				});
				this.mapsHolder.prependTo( $('.app-horizontal-widget-holder') );

				css.style('button');
				listener.button();
			}
		},
		listener = {
			button: function(){
				$( document ).on('mousedown mouseover', '.mapButtonIcon a img', function(e){
					var $p;
					timer.ms === 0 && this == e.target && (
						timer.set( 156 ),
						html.coordinates = html.thisURL(),
						$p = $( this ).parent(),
						//    c.i('listener button ' + $p.data('map'), e.type ),
						$p.attr('href', html.positions[ $p.data('map') ]() ) // html.dataArray().findArrayObj( 'button', $p.data('map') ).position )
					);
				});
			}
		},
		googleMaps_observer = new MutationObserver( function( mutations /*, observer */) {
			mutations.forEach( function( mutation ) {
				var newNodes = mutation.addedNodes;
				newNodes !== null && $( newNodes ).each( function( i, e ){
					var $e = $(e);
					( $e.hasClass( 'widget-expand-button-pegman' ) || $e.hasClass( '.app-horizontal-widget-holder' ) ) && html.mapsHolder === null && html.render( 'observer' );
				});
			});
		});

	googleMaps_observer.observe( document, { subtree: true, childList: true });
	
	c.l('Map Linker GoogleMaps');
	
	function loadLinkBar(){
		var barCheck = setInterval(function(e){
			$('#mapsHolder').length ? clearInterval( barCheck ) : html.render( 'load' );
		}, 64);
		listener.button();
	}
	
	$( document ).ready(function(e) {
		loadLinkBar();
	});

	$( window ).on('load', function(e) {
		loadLinkBar();
	});
})();