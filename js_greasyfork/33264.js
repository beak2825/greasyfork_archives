// ==UserScript==
// @name			Waze - Local Champs Tools script (beta fork)
// @version			1.3.23
// @author			Mylan, d2-mac, MajkiiTelini
// @description		Waze Map Editor script that creates a link to the current position in Google Maps™, Bing, OSM and other map sites.
// @match 			https://*.waze.com/*editor*
// @run-at			document-end
// @namespace		https://greasyfork.org/cs/users/135686
// @license			MIT
// @icon			data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA0VJREFUWIWt182L1WUUB/CPd8TRbjqaY94QVBJXwYBQkK5qEygNmm4FN4OrFkWE9iamhbRrUQQtel1kEERRpBK+RTroIv+Awja9UZk1vevMtDjPb+7v3vnd3+937/SFB+4993m+55znOW93SP9ooYF/uuQrsQJ/9EPWGMCAO/FIgfwxbBiArxTNAtlOXMeqnGwUU9hRk2MOVTfwBMa6ZGswIjzO8DhuTb/lsQUHKnSU4iGdnm3G+5jFTNeaxXvYlPaO43c8WKZgUYUBt+AnDOMc7sc0JvEFfkjfW8LbrRjCWdwnAnIN/q7ytAxnhHc/46B4715YLa78Wjpzqh9FTTyPXcJzeCYRfWD++5ZhFB+ms1kMNLEbR3P88zAm3vxPbc9fNli6NvBK4jidOH/FXVUHd4h3zTwfRHneiOwmbuKBugdPp0OTuGcBBtyLy4nrZN1Dm9OB4/g6fX4dd/SheB3eSme/wrsiVTcWbW5hm6hwEyLP/8VtWIanRDpNiSxYWqJ4KZ4U+Z/tHxYBfEPUiYmka1vSbQUOiQCZTetsgUdv5zzapbOGLMIeXE2evmH+jX2e4/8lObY8v2EVnksEL/bwcCsuJZJPsT+tLGYu6h0zL4ngPiI6Z0/MiB7QCw3sw3c5j77BXuWV9WnxDB1Y3GNzGdEM3hTzwDtJ9rCInTIMFQnzOT6KF9LnVgUZEdmT+KyG8oyzgWMiwOewUpTHKe0rPV+DkIiDEzX3Tub4f8NhjCzGElGtLop0GRdpMio64f+BFu4Wt/YJfkxruGjzJvHOB2sQ172BQyID1tfYi0ira6o7YB0DWqLG1H0q49oTzkd6RG9NA4ZED5gVN7C9SvkW7TJ6Kh18tcSIMgMaeE27EWW83TPmHJp4VsxwWb0/kAg+xto+DGhpe/5oki0Tt3tYyUBShKzMZvX79hID1oop6ro+W3AvNMUkczORzYi3vCAmpav4UtT5C2nfdDJqWlx7WfesxG4Rwdkks1G01CyobqSVTVDHtVNtu3jz8YUYcNT8GW4iKTuSkx1Lsn1de8dEXA2MomDZKeIh31JXi/Ja9NesNODKcpyC9pmUfa9z5v9LvPUVfFuDY0Fo6ZpkEkZ0Zkgt/AcYZ93gg/6CbgAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/33264/Waze%20-%20Local%20Champs%20Tools%20script%20%28beta%20fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/33264/Waze%20-%20Local%20Champs%20Tools%20script%20%28beta%20fork%29.meta.js
// ==/UserScript==

var W;
var OL;
var I18n;

var lct_debug = false;
var lct_loop_debug = false;

var translations = {
	'sk' : {
		'LCT settings'			: 'Nastavenie LCT',
		'Bar settings' 			: 'Nastavenia lišty',
		'Floating bar' 			: 'Plávajúca lišta',
		'Vertical floating bar' : 'Vertikálna plávajúca lišta',
		'Bar color'				: 'Farba lišty',
		'Black' 				: 'Čierna',
		'White' 				: 'Biela',
		'Bar transparency' 		: 'Priesvitnosť lišty',
		'Button size'			: 'Veľkosť tlačítok',
		'Maps & waze links'		: 'Odkazy na mapy & waze',
		'CZ/SK permalinks'		: 'CZ/SK permalinky',
		'Czech permalinks' 		: 'České permalinky',
		'Closures'				: 'Uzávierky',
		'Waze users'			: 'Waze užívatelia',
		'Slovak permalinks'		: 'Slovenské permalinky',
		'Hide'	 				: 'Skryť',
		'Show LCT links (sk)'	: 'Zobrazovať LCT odkazy',
		'Reload'				: 'Obnoviť',
		'Where am I?'			: 'Kde som?',
		'Add current location'	: 'Pridať súčasnú polohu',
		'Rename favorite location'	 : 'Premenovať obľúbenú polohu',
		'Rename / Relocate (ctrl+click) location' : 'Premenovať / presunúť (ctrl+klik) obľúbenú polohu',
		'Relocate'					 : 'Presunúť',
		'to the current location?'	 : 'na súčasnú polohu?',
		'Delete favorite location'	 : 'Zmazať obľúbenú polohu',
		'Please enter location name' : 'Prosím, zadajte názov miesta',
	},
	'cs' : {
		'LCT settings'			: 'Nastavení LCT',
		'Bar settings' 			: 'Nastavení lišty',
		'Floating bar' 			: 'Plovoucí lišta',
		'Vertical floating bar' : 'Vertikální plovoucí lišta',
		'Bar color'				: 'Barva lišty',
		'Black' 				: 'Černá',
		'White' 				: 'Bíla',
		'Bar transparency' 		: 'Průsvitnost lišty',
		'Button size'			: 'Velikost tlačítek',
		'Maps & waze links'		: 'Odkazy na mapy & waze',
		'CZ/SK permalinks'		: 'CZ/SK permalinky',
		'Czech permalinks' 		: 'České permalinky',
		'Closures'				: 'Uzavírky',
		'Waze users'			: 'Waze uživatelé',
		'Slovak permalinks'		: 'Slovenské permalinky',
		'Hide'	 				: 'Skrýt',
		'Show LCT links (sk)'	: 'Zobrazovat LCT odkazy (sk)',
		'Reload'				: 'Obnovit',
		'Where am I?'			: 'Kde jsem?',
		'Add current location'	: 'Přidat současnou polohu',
		'Rename favorite location'	 : 'Přejmenovat oblíbenou polohu',
		'Rename / Relocate (ctrl+click) location' : 'Přejmenovat / přesunout (ctrl+klik) oblíbenou polohu',
		'Relocate'					 : 'Přesunout',
		'to the current location?'	 : 'na současnou polohu?',
		'Delete favorite location'	 : 'Smazat oblíbenou polohu',
		'Please enter location name' : 'Prosím, zadejte název místa',
	}
};

function LCT_init() {
	W = unsafeWindow.W;
	OL = unsafeWindow.OpenLayers;
	I18n = unsafeWindow.I18n;

	function save_bar_position(x,y){if (localStorage.LCT_Settings){var s=JSON.parse(localStorage.LCT_Settings);} else{s=new Object();}s.barX=x;s.barY=y;localStorage.setItem('LCT_Settings', JSON.stringify(s, null, 4));}
	//function copyToClipboard(t){var i=document.getElementById('CopyUrl');i.value=t;i.focus();i.select();document.execCommand('Copy');}
	function sqr(x) {return x*x;}
	function convert(t,a) {var h=Math.PI/180,M=6378137,s=298.257223563,r=-570.69,n=-85.69,q=-462.84,o=4.99821/3600*Math.PI/180,i=1.58676/3600*Math.PI/180,c=5.2611/3600*Math.PI/180,e=-3543e-9,v=a*h,x=t*h,I=200,P=1-sqr(1-1/s),g=M/Math.sqrt(1-P*sqr(Math.sin(v))),l=(g+I)*Math.cos(v)*Math.cos(x),p=(g+I)*Math.cos(v)*Math.sin(x),d=((1-P)*g+I)*Math.sin(v),u=r+(1+e)*(l+c*p-i*d),F=n+(1+e)*(-c*l+p+o*d),f=q+(1+e)*(i*l-o*p+d);M=6377397.15508;s=299.152812853;var y=s/(s-1),b=Math.sqrt(sqr(u)+sqr(F));P=1-sqr(1-1/s);var j=Math.atan(f*y/b),k=Math.sin(j),m=Math.cos(j),w=(f+P*y*M*k*k*k)/(b-P*M*m*m*m);v=Math.atan(w);I=Math.sqrt(1+w*w)*(b-M/Math.sqrt(1+(1-P)*w*w));x=2*Math.atan(F/(b+u));M=6377397.15508;var z=.081696831215303,A=.97992470462083,B=12310230.12797036,C=.863499969506341,D=.504348889819882,E=.420215144586493,G=.907424504992097,H=1.000597498371542,J=1.00685001861538,K=Math.sin(v);w=(1-z*K)/(1+z*K);w=sqr(1+K)/(1-sqr(K))*Math.exp(z*Math.log(w));w=J*Math.exp(H*Math.log(w));var L=(w-1)/(w+1),N=Math.sqrt(1-L*L),O=H*x,Q=Math.sin(O),R=Math.cos(O),S=G*R+E*Q,T=E*R-G*Q,U=C*L+D*N*S,V=Math.sqrt(1-U*U),W=T*N/V,X=Math.sqrt(1-W*W),Y=A*Math.atan(W/X);g=B*Math.exp(-A*Math.log((1+U)/V));var Z=g*Math.sin(Y)*-1,$=g*Math.cos(Y)*-1;return {x: Z.toFixed(),y: $.toFixed()}}
	$.fn.dragit=function(e){var t=(e=$.extend({handle:"",cursor:"move"},e),""===e.handle)?this:this.find(e.handle);return t.css("cursor",e.cursor).on("mousedown",function(t){var s=(""===e.handle)?$(this).addClass("dragit"):$(this).addClass("active-handle").parent().addClass("dragit");var a=s.css("z-index"),o=s.outerHeight(),i=s.outerWidth(),r=s.offset().top+o-t.pageY,n=s.offset().left+i-t.pageX;s.css("z-index",1e3).parents().on("mousemove",function(e){$(".dragit").offset({top:e.pageY+r-o,left:e.pageX+n-i})});t.preventDefault();}).on("mouseup",function(){save_bar_position($(this).offset().left,$(this).offset().top);""===e.handle?$(this).removeClass("dragit"):$(this).removeClass("active-handle").parent().removeClass("dragit")})};
	(function($){$.fn.tipr=function(options){var set=$.extend({'speed':200,'mode':'bottom'},options);return this.each(function(){var tipr_cont='.tipr_container_'+set.mode;$(this).hover(function() {var d_m=set.mode;if($(this).attr('data-mode')) {d_m=$(this).attr('data-mode'); tipr_cont='.tipr_container_'+d_m;} var out='<div class="tipr_container_'+d_m+'"><div class="tipr_point_'+d_m+'"><div class="tipr_content">'+$(this).attr('data-tip')+'</div></div></div>';$(this).append(out);var w_t=$(tipr_cont).outerWidth();var w_e=$(this).width();var m_l=(w_e / 2)-(w_t / 2);$(tipr_cont).css('margin-left',m_l+'px');$(this).removeAttr('title alt');$(tipr_cont).fadeIn(set.speed);},function() {$(tipr_cont).remove();});});};})(jQuery);
	function tr(str) {if (translations.hasOwnProperty(I18n.locale) && translations[I18n.locale].hasOwnProperty(str)) {return translations[I18n.locale][str];} return str;}
	function update_local_storage() {if (!o.hasOwnProperty('lctlinks')) {var lctVal = (I18n.locale == 'sk') ? 1 : 0; o.lctlinks = lctVal; localStorage.setItem('LCT_Settings', JSON.stringify(o, null, 4)); o = JSON.parse(localStorage.LCT_Settings);}}
	//function calculateSPN(){var projI = new OL.Projection("EPSG:900913"); var projE = new OL.Projection("EPSG:4326"); var center_lonlat = (new OL.LonLat(W.map.center.lon,W.map.center.lat)).transform(projI,projE); var topleft = (new OL.LonLat(W.map.getExtent().left,W.map.getExtent().top)).transform(projI,projE); var bottomright = (new OL.LonLat(W.map.getExtent().right,W.map.getExtent().bottom)).transform(projI,projE); var lat = Math.round(center_lonlat.lat*1000000)/1000000; var lon = Math.round(center_lonlat.lon*1000000)/1000000; return Math.abs(topleft.lat-bottomright.lat)+','+Math.abs(topleft.lon-bottomright.lon);}
	function epsg4326_epsg25834(lon,lat) {var a=6378137,e=0.0818191908469312,lambda0_rad=21*Math.PI/180,k_0=0.9996,fi_rad=lat*Math.PI/180,lambda_rad=lon*Math.PI/180,e_2=e*e/(1-e*e),N=a/Math.sqrt(1-e*e*Math.sin(fi_rad)*Math.sin(fi_rad)),T=Math.tan(fi_rad)*Math.tan(fi_rad),CC=e_2*Math.cos(fi_rad)*Math.cos(fi_rad),AA=(lambda_rad-lambda0_rad)*Math.cos(fi_rad),M=a*(fi_rad*(1-e*e/4-3*Math.pow(e,4)/64-5*Math.pow(e,6)/256)-Math.sin(2*fi_rad)*(3*e*e/8+3*Math.pow(e,4)/32+45*Math.pow(e,6)/1024)+Math.sin(4*fi_rad)*(15*Math.pow(e,4)/256+45*Math.pow(e,6)/1024)-Math.sin(6*fi_rad)*35*Math.pow(e,6)/3072),X=k_0*N*(AA+(1-T+CC)*Math.pow(AA,3)/6+(5-18*T+T*T+72*CC-85*e_2)*Math.pow(AA,5)/120)+500000,Y=k_0*(M+N*Math.tan(fi_rad)*(AA*AA/2+(5-T+9*CC+4*CC*CC)*Math.pow(AA,4)/24+(61-58*T+T*T+600*CC-330*e_2)*Math.pow(AA,6)/720));return{x:X.toFixed(),y:Y.toFixed()};} // zjednodusene pro ucely cdb.sk

	if (localStorage.LCT_Settings) {
		var o = JSON.parse(localStorage.LCT_Settings);
		update_local_storage();
	}
	else {
		var lctVal = (I18n.locale == 'sk') ? 1 : 0;
		o = {'barX': 700, 'barY': 80, 'float': 0, 'vertical': 0, 'bgimg': 3, 'size': 16, 'lctlinks' : lctVal, 'hidecopy': 1 };
	}

	function open_link(event, site) {
		var e = W.map.getExtent();
		var WazePermalink = $('.WazeControlPermalink a.permalink').attr('href');
		var w = WazePermalink ?JSON.parse('{"' + WazePermalink.replace(/&/g, '","').replace(/=/g, '":"') + '"}', function(key, value) { return key === '' ? value : decodeURIComponent(value); }):{};
		var lat = w.lat;
		var lon = w.lon;
		var zoom = Number(w.zoomLevel);
		var p0 = convert(lon, lat);
		var p1 = new OL.Geometry.Point(e[0], e[3]);
		var p2 = new OL.Geometry.Point(e[2], e[1]);
		var p3 = convert(p1.x, p1.y);
		var p4 = convert(p2.x, p2.y);
		var p5 = epsg4326_epsg25834(p1.x, p1.y);
		var p6 = epsg4326_epsg25834(p2.x, p2.y);

		var siteUrl;
		// --- Mapy.cz ---
		if (site == 'mapycz') {
			siteUrl = 'https://mapy.cz/zakladni?x=' + lon + '&y=' + lat + '&z=' + zoom + ((event.ctrlKey || event.metaKey) ? '&base=ophoto&pano=1&l=0' : '&l=0');
		}
		// --- Open Street map ---
		else if (site == 'osm') {
			siteUrl = 'https://www.openstreetmap.org/#map=' + zoom + '/' + lat + '/' + lon;
			if (event.ctrlKey || event.metaKey) {
				if (zoom >= 19) zoom = 18;
				siteUrl = 'https://openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
			}
		}
		// --- Bing maps ---
		else if (site == 'bing') {
			siteUrl = 'https://www.bing.com/maps/?cp=' + lat + '~' + lon + '&lvl=' + zoom + ((event.ctrlKey || event.metaKey) ? '&sty=h' : '');
		}
		// --- Google Maps ---
		else if (site == 'gmaps') {
			siteUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + ((event.ctrlKey || event.metaKey) ? 'z/data=!3m1!1e3' : 'z');
		}
		// --- Google Maps Provoz ---
		else if (site == 'gmaps_provoz') {
			siteUrl = 'https://www.google.com/maps/@' + lat + ',' + lon + ',' + zoom + ((event.ctrlKey || event.metaKey) ? 'z/data=!3m1!1e3!5m1!1e1' : 'z/data=!5m1!1e1');
		}
		// --- TomTom ---
		else if (site == 'tomtom') {
			siteUrl = 'https://mydrive.tomtom.com/cs_cz/#+viewport=' + lat + ',' + lon + ',' + zoom;
		}
		// --- Here ---
		else if (site == 'here') {
			siteUrl = 'https://wego.here.com/traffic/explore?map=' + lat + ',' + lon + ',' + zoom + ',' + ((event.ctrlKey || event.metaKey) ? 'satellite_traffic' : 'traffic') + '&x=ep';
		}
		// --- Apple ---
		else if (site == 'apple') {
			siteUrl = 'https://beta.maps.apple.com/?ll=' + lat + ',' + lon + '&spn=' + (p1.y - p2.y) + ',' + (p2.x - p1.x) + '&t=' + ((event.ctrlKey || event.metaKey) ? 'h' : 'm');
		}
		// --- Open Street Cam ---
		else if (site == 'osv') {
			siteUrl = 'https://openstreetcam.org/map/@' + lat + ',' + lon + ',' + zoom + 'z';
		}
		// --- Instant Street View ---
		else if (site == 'instasw') {
			if (event.ctrlKey || event.metaKey) {
				siteUrl = 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
			}
			else {
				siteUrl = 'https://www.instantstreetview.com/@' + lat + ',' + lon + ',' + zoom + 'z,0t';
			}
		}
		// --- Mapillary ---
		else if (site == 'mapillary') {
			siteUrl = 'https://www.mapillary.com/app/?lat=' + lat + '&lng=' + lon + '&z=' + zoom;
		}
		// --- Pumpdroid N95/LPG ---
		else if (site == 'pumpdroid_n95') {
			siteUrl = 'http://www.pumpdroid.com/public/map?fuel=' + ((event.ctrlKey || event.metaKey) ? 'LPG' : 'NATURAL95');
		}
		// --- Pumpdroid Nafta/Bionafta ---
		else if (site == 'pumpdroid_nafta') {
			siteUrl = 'http://www.pumpdroid.com/public/map?fuel=' + ((event.ctrlKey || event.metaKey) ? 'BIODIESEL' : 'DIESEL');
		}
		// --- [SK] Cestná databanka ---
		else if (site == 'cdb') {
			var viewid = (event.ctrlKey || event.metaKey) ? '8506e8e604dc4e508e54f4919b07ea31' : '70ddf82c0243461fb614d7f6c8d22cb2';
			siteUrl = 'https://ismcs.cdb.sk/portal/mapviewer/?viewid=' + viewid + '&extent=' + p5.x + ',' + p5.y + ',' + p6.x + ',' + p6.y;
		}
		// --- [SK] ZBGIS ---
		else if (site == 'zbgis') {
			if (event.ctrlKey || event.metaKey) {
				siteUrl = 'https://zbgis.skgeodesy.sk/mkzbgis/sk/kataster?bm=zbgis&z=';
			}
			else {
				siteUrl = 'https://zbgis.skgeodesy.sk/mkzbgis/sk/zakladna-mapa?bm=zbgis&z=';
			}
			siteUrl += zoom + '&c=' + lon + ',' + lat;
		}
		// --- [SK] BSK UPN Doprava / Vse ---
		else if (site == 'blava') {
			siteUrl = 'https://bskgis.maps.arcgis.com/apps/webappviewer/index.html?' +
			    '&extent=' + p1.x + ',' + p1.y + ',' + p2.x + ',' + p2.y +
			    '&webmap=' + ((event.ctrlKey || event.metaKey) ? 'f89a341176cc499583701b95803f9a1f' : '33689c9771e04bbbb41eb32e9e5ac47b')
			;
		}
		// --- [SK] Prešov Webgis ---
		else if (site == 'presov') {
			zoom = (zoom > 19) ? 6 : zoom - 13;
			siteUrl = 'https://webgis.presov.sk/?mapSet=0&center=' + p0.x + ',' + p0.y + '&zoom=' + zoom + '&selVals=null&m=14&l=11,4';
		}
		// --- [SK] Kosice GISPLAN ---
		else if (site == 'kosice') {
			zoom = (zoom > 21) ? 10 : zoom - 11;
			siteUrl = 'https://gis.esluzbykosice.sk/mapa/zakladna-aplikacia/?lb=bmp&lbo=1&lyo=&ly=ad%2Cul&c=' + p0.x + '%3A'+ p0.y + '&z=' + zoom;
		}
		// --- [SK] CCS benzinky / mycky---
		else if (site == 'sk_ccs') {
			siteUrl = 'http://www.ccs.sk/odberna-mista?t=' + ((event.ctrlKey || event.metaKey) ? 'wash' : 'stations');
		}
		// --- [CZ] ŘSD ---
		else if (site == 'rsd') {
			zoom = (zoom > 18) ? 12 : zoom - 7;
			siteUrl = 'https://geoportal.rsd.cz/webappbuilder/apps/7/?center=' + lon + ',' + lat + '&level=' + zoom;
		}
		// --- [CZ] CUZK ---
		else if (site == 'cuzk') {
			siteUrl = 'https://ags.cuzk.cz/geoprohlizec/?' + ((event.ctrlKey || event.metaKey) ? 'k=490&' : '') + 'extent=' +
			    p3.x + ',' + p3.y + ',' + p4.x + ',' + p4.y;
		} 
		else if (site == 'dopravniinfo') {
			siteUrl = 'https://dopravniinfo.gov.cz/?action=link&l_information=1&l_fcd=1&l_camera=1&l_vms=1&l_weather=1&l_others=1&i_crash=1&i_barrier=1&i_convoy=1&i_construction=1&i_road=1&i_cargo=1&i_parking=1&i_cone=1&i_planned=1&f_1=1&f_2=1&f_3=1&f_4=1&f_5=1&w_meteo=1&w_drivability=1&o_offenseSystems=1&o_trafficVideos=1' +
				'&e_X1=' + p3.x + '&e_X2=' + p4.x + '&e_Y1=' + p4.y + '&e_Y2=' + p3.y;
			if (event.ctrlKey || event.metaKey) {
				siteUrl = 'http://old.dopravniinfo.cz/default.aspx?l=TI,TIU,TL,Kamery&r=%3B%3B&rp=F%2CO%2CN&lang=cz' +
					'&e=' + p3.x + ',' + p4.x + ',' + p4.y + ',' + p3.y;
			}
		}
		// --- [CZ] TSK PRAHA ---
		else if (site == 'tskpraha') {
			siteUrl = 'http://dic.tsk-praha.cz/?v=' + p3.x + '|' + p3.y + '|' + p4.x + '|' + p4.y + '&l=11111';
		}
		// --- [CZ] iKatastr ---
		else if (site == 'ikatastr') {
			siteUrl = 'https://ikatastr.cz/#kde='+ lat + ',' + lon + ',' + zoom + '&mapa=' +
			    ((event.ctrlKey || event.metaKey) ? 'letecka' : 'zakladni') + '&vrstvy=parcelybudovy';
		}
		// --- [CZ] Správa železnic ---
		else if (site == 'sz') {
			siteUrl = 'https://provoz.spravazeleznic.cz/DYPOD/';
			if (event.ctrlKey || event.metaKey) {
				siteUrl = 'https://grapp.spravazeleznic.cz/';
			}
		}
		// --- [CZ] Closures ---
		else if (site == 'cz_closures') {
			siteUrl = 'http://goo.gl/' + ((event.ctrlKey || event.metaKey) ? 'FjLFPr' : 'J34DwA');
		}
		// --- [CZ] Waze users ---
		else if (site == 'cz_wazers') {
			siteUrl = 'http://goo.gl/' + ((event.ctrlKey || event.metaKey) ? 'NHc2Ah' : 'rQcDMS');
		}
		// --- [CZ] Test nazvu obci / Katastr ---
		else if (site == 'cz_obce') {
			siteUrl = 'http://goo.gl/U38BOz';
			if(event.ctrlKey || event.metaKey) {
				siteUrl = 'https://nahlizenidokn.cuzk.cz/MapaIdentifikace.aspx?&x=' + p0.x + '&y=' + p0.y + '&maplayers=7E6595D2%208244EA23';
			}
		}
		// --- [CZ] CCS benzinky / mycky---
		else if (site == 'cz_ccs') {
			siteUrl = 'http://www.ccs.cz/odberna-mista?t=' + ((event.ctrlKey || event.metaKey) ? 'wash' : 'stations');
		}
		// --- Kde jsem? ---
		else if (site == 'wtfami') {
			var jsonUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + lat + ',' + lon + '&key=AIzaSyC4EsYydXSc_bayhY0VfYUmTXAFKaYaVBw';
			$.getJSON(jsonUrl, function(data) {
				window.prompt('Copy to clipboard: Ctrl+C, Enter', data.results[(zoom > 17) ? 0 : 1].formatted_address);
			});
			return false;
		}
		// --- Waze Livemap ---
		else if (site == 'livemap') {
			siteUrl = 'https://www.waze.com/livemap?lat=' + lat + '&lon=' + lon + '&zoom=' + zoom + ((event.ctrlKey || event.metaKey) ? '&rp_subscription=*' : '');
		}
		// --- Waze permalink ---
		else {
			var re = new RegExp('&layers=' + w.layers, 'g');
			WazePermalink = WazePermalink.replace(re, '');
			window.open(WazePermalink, (event.ctrlKey || event.metaKey) ? '_blank' : '_self');
			//copyToClipboard(WazePermalink);
			return false;
		}
		window.open(siteUrl, '_blank');
	}

	function show_permalinks() {
		if (localStorage.LCT_Permalinks) {
			$.each(JSON.parse(localStorage.LCT_Permalinks), function(key, value) {
				if (value == 1) {
					$('#wmepl_' + key).show();
					$('#wmepl_opt_' + key).prop('checked', true);
				}
			});
		}
		else {
			$('#wmepl_gmaps, #wmepl_gmaps_provoz, #wmepl_osm, #wmepl_mapycz').show();
			$('#wmepl_opt_gmaps,#wmepl_opt_gmaps_provoz, #wmepl_opt_osm, #wmepl_opt_mapycz').prop('checked', true);

		}
	}

	function render_permalinksBar(float) {
		if (float === true) {
			$('#permalinksBar .map-link').remove();
			$('body').append('<div id="permalinksBar_float"></div>');
			if (o.vertical == 1) {
				$('#permalinksBar_float').addClass('vertical');
				$('#wmepl_bar_vertical').prop('checked', true);
			}
			$('#permalinksBar_float').append(map_links);
			setTimeout(show_permalinks, 200);
			$('#wmepl_bar_float').prop('checked', true);
			$('#permalinksBar_float').dragit();
			if (lct_debug) console.log('LCT: Permalinks Bar rendered');
		}
		else {
			$('#permalinksBar_float').remove();
			$('#permalinks-toggle').after(map_links);
			setTimeout(show_permalinks, 200);
			$('#wmepl_waze').hide();
			$('#wmepl_bar_float').prop('checked', false);
			if (lct_debug) console.log('LCT: Floating Permalinks Bar rendered');
		}
		$('.map-link').on('click', function(event) {open_link(event, $(this).attr('data-item'));});
	}

	var bgImgs = ['XPC1k3T', '1GBEcez', 'mNG7xrh', 'zio1bfv', 'XFL5lNY', 'QLJ1l1r', 'zyInquW', 'Ktf2S8g', 'QruTbKV', 'HUSp0IK'];
	var LCTstyle = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">';
	LCTstyle += '<style id="LCTstyle">#permalinksBar {height: 16px; padding: 1px; display: flex; align-items: center; z-index: 899; float: left;} #permalinksBar_float {border-radius: 3px; background: url("https://i.imgur.com/' + bgImgs[o.bgimg] + '.png") top left repeat; position: fixed; left: ' + o.barX + 'px; top: ' + o.barY + 'px; height: auto; width: auto; padding: 1px 8px; z-index: 1002 !important;} #permalinksBar_float.vertical {padding: 8px 1px; width: ' + (o.size+8) + 'px;} #permalinksBar img.map-link {width: 16px; height: 16px;} #permalinksBar i.map-link {font-size: 16px;} #permalinksBar_float img.map-link {width: ' + o.size + 'px; height: ' + o.size + 'px;} #permalinksBar_float i.map-link {font-size: ' + o.size + 'px;}'; // background: url("//i.imgur.com/FD7Csta.png"), url("//i.imgur.com/RBYGoP2.png"); background-repeat: repeat, no-repeat; background-position: top left, center right; background-size: auto, contain;
	LCTstyle += '.map-link, #permalinks-toggle {color: #59899e; cursor: pointer; float: left; display: inline-block; margin: 3px; opacity: 0.8;} .map-link.fa-building {font-size: 15px;} .map-link {display: none;} #permalinks-toggle {margin: 4px 7px 0 2px; opacity: 0.6; -webkit-transition: all 0.2s ease-out; -moz-transition: all 0.2s ease-out; -o-transition: all 0.2s ease-out; transition: all 0.2s ease-out; -webkit-animation-duration: 0.2s; animation-duration: 0.2s; -webkit-animation-fill-mode: both; animation-fill-mode: both; -webkit-animation-timing-function: ease-out; animation-timing-function: ease-out;} #permalinks-toggle.active {-ms-transform: rotate(80deg); -webkit-transform: rotate(80deg); transform: rotate(80deg); opacity: 1;} #permalinks-toggle:hover, .map-link:hover, #permalinksBar_float .map-link {opacity: 1;} #permalinksBar_float .map-link {text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;} #permalinksBar_float.vertical .fa.fa-link.map-link {margin: 4px 0 0 4px;} #permalinksBar_float.vertical .fa.fa-unlock-alt.map-link {margin: 5px 0 0 6px;} #permalinksBar #wmepl_waze {display: none !important;}';
	LCTstyle += '#permalinks-settings {background: #eee; border-radius: 5px; box-shadow: 0 6px 12px rgba(0,0,0,0.175); padding: 5px; position: absolute; bottom: 30px; right: 10px; z-index: 10000; width: 600px; visibility:hidden; opacity:0; transition:visibility 0s linear 0.2s,opacity 0.2s linear;display:flex; justify-content: space-between;} #permalinks-settings.visible {visibility:visible; opacity:1; transition-delay:0s;} #permalinks-settings label {display: block; font-weight: normal; font-size: 11px; margin: 0; padding: 2px 0;} #permalinks-settings label.float-lbl {margin-left: 10px} #permalinks-settings label input[type="checkbox"] {margin: 0 5px;} #permalinks-settings legend {color: #4e7688; font-size: 11px; margin: 0 0 5px 0; padding: 5px;} #permalinks-settings fieldset {width:33.3333%;flex: 1 0 33.3333%; min-height: 190px; padding: 0 5px;} #wmepl-map-settings {border-left: 1px solid #e5e5e5; border-right: 1px solid #e5e5e5; height: 370px;} #permalinks-settings fieldset#wmepl-bar-settings {width: 220px;} #permalinks-settings .fa {color: #59899e;} #permalinks-settings em {color: #888;} .pointer {cursor: pointer;} #permalinks-sk {display: inline-block; margin-top: 10px;}';
	LCTstyle += '.opacitySettings, .colorSettings {border: 1px solid #ddd; border-radius: 3px; display: inline-block; font-size: 0.8em; width: 32px; padding: 3px 0; margin: 0 1px; text-align: center;} .colorSettings {width: 80px;} .sizeSettings {border: 1px solid #ddd; border-radius: 3px; display: inline-block; margin: 0 3px; text-align: center; vertical-align: middle; font-size: 0.7em;} .opacitySettings:hover, .colorSettings:hover, .sizeSettings:hover {border-color: #59899e; color: #59899e; cursor: pointer;} .colorSettings.sel, .opacitySettings.sel, .sizeSettings.sel {background: #59899e; color: #fff; border-color: #fff;} span.float-opt.sel.disabled, span.float-opt.sel.disabled:hover {background: #888; border-color: #fff; color: #fff;} span.float-opt.disabled:hover {border-color: #ddd; color: #3d3d3d; cursor: default;}';
	LCTstyle += '.WazeControlPermalink a.permalink {margin: 5px 0 0 5px; line-height: 1; float: right;} .WazeControlPermalink {margin-left: 5px;}';
	LCTstyle += '#chat .users {padding-right: 10px !important;} #chat .users ul li .lct-link {color: #59899e; cursor: pointer; float: right; position: relative; top: 5px; left: 5px; visibility: hidden;} #chat .users ul li:hover .lct-link {visibility: visible;} #chat .users ul li .lct-link:hover {color: #000;} #chat .users ul li:hover a.user {color: #59899e !important;} #chat ul.user-list li:hover a.user .crosshair{display:block;float:right;margin-top:5px}';
	LCTstyle += '.side-panel-section .lct-link {color: #59899e; cursor: pointer; font-size: 12px;} .side-panel-section .lct-link:hover {color: #000}';
	LCTstyle += '</style>';

	var map_links = '';
	map_links += '<img src="//i.imgur.com/tJkT6Ou.png" alt="Google Maps" title="Google Maps / satelit" id="wmepl_gmaps" data-item="gmaps" class="map-link">'; // Google Maps
	map_links += '<img src="//i.imgur.com/tJkT6Ou.png" alt="Google Maps Provoz" title="Google Maps Provoz / satelit" id="wmepl_gmaps_provoz" data-item="gmaps_provoz" class="map-link">'; // Google Maps Provoz
	map_links += '<img src="//i.imgur.com/EWv2H6F.png" alt="Mapy.cz" title="Mapy.cz / letecká" id="wmepl_mapycz" data-item="mapycz" class="map-link">'; // Mapy.cz
	map_links += '<img src="//i.imgur.com/8Yt8pUP.png" alt="OpenStreetMap.com" title="Open Street Map / Cam" id="wmepl_osm" data-item="osm" class="map-link">'; // Open Stree Map
	map_links += '<img src="//i.imgur.com/9LSVEwy.png" alt="Open Street Cam" title="Open Street Cam" id="wmepl_osv" data-item="osv" class="map-link">'; // Open Street Cam
	map_links += '<img src="//i.imgur.com/6QbWlPt.png" alt="Bing Maps" title="Bing Maps / aerial" id="wmepl_bing" data-item="bing" class="map-link">'; // Bing maps
	map_links += '<img src="//i.imgur.com/S5GHGaE.png" alt="Apple maps" title = "Apple maps / aerial" id="wmepl_apple" data-item="apple" class="map-link">'; // Apple maps
	map_links += '<img src="//i.imgur.com/rEE54wz.png" alt="Instant Street View" title="Instant Street View / Mapillary" id="wmepl_instasw" data-item="instasw" class="map-link">'; // Instant Street View
	map_links += '<img src="//i.imgur.com/sYWXnhE.png" alt="Mapillary" title="Mapillary" id="wmepl_mapillary" data-item="mapillary" class="map-link">'; // Mapillary
	map_links += '<img src="//i.imgur.com/uKgHjvX.png" alt="TomTom" title="TomTom" id="wmepl_tomtom" data-item="tomtom" class="map-link">'; // TomTom
	map_links += '<img src="//i.imgur.com/dSdLdoh.png" alt="Here" title="Here / satelit" id="wmepl_here" data-item="here" class="map-link">'; // Here
	map_links += '<i class="fa fa-car map-link" title="Pumpdroid N95 / LPG" id="wmepl_pumpdroid_n95" data-item="pumpdroid_n95"></i>';
	map_links += '<i class="fa fa-truck map-link" title="Pumpdroid Nafta / Bio" id="wmepl_pumpdroid_nafta" data-item="pumpdroid_nafta"></i>';

	map_links += '<i class="fa fa-credit-card map-link" title="CCS benzínky / myčky" id="wmepl_cz_ccs" data-item="cz_ccs"></i>';
	map_links += '<img src="//i.imgur.com/bFNMCqQ.png" alt="ŘSD" title="ŘSD" id="wmepl_rsd" data-item="rsd" class="map-link">'; // [CZ] ŘSD
	map_links += '<img src="//i.imgur.com/DoRe1NQ.png" alt="Dopravní Info" title="Dopravní Info / nahlásit" id="wmepl_dopravniinfo" data-item="dopravniinfo" class="map-link">'; // [CZ] DI
	map_links += '<img src="//i.imgur.com/4EB26Vm.png" alt="TSK Praha" title="TSK Praha" id="wmepl_tskpraha" data-item="tskpraha" class="map-link">'; // [CZ] TSK
	map_links += '<img src="//i.imgur.com/v5ZDUTY.png" alt="ČÚZK" title="ČÚZK / ortofoto" id="wmepl_cuzk" data-item="cuzk" class="map-link">'; // [CZ] ČÚZK
	map_links += '<img src="//i.imgur.com/UF6RQMe.png" alt="iKatastr" title="iKatastr / letecká" id="wmepl_ikatastr" data-item="ikatastr" class="map-link">'; // [CZ] iKatastr
	map_links += '<img src="//i.imgur.com/CikgGsw.png" alt="Správa železnic" title="Správa železnic DYPOD / GRAPP" id="wmepl_sz" data-item="sz" class="map-link">'; // [CZ] Správa železnic
	map_links += '<img src="//i.imgur.com/W7l8LzH.png" alt="Uzavírky (cz)" title="Uzavírky (cz) form. / tabulka" id="wmepl_cz_closures" data-item="cz_closures" class="map-link">'; // [CZ] closures
	map_links += '<img src="//i.imgur.com/nMGuuxD.png" alt="CZ wazers" title="CZ wazers form. / tabulka" id="wmepl_cz_wazers" data-item="cz_wazers" class="map-link">'; // [CZ] wazers
	map_links += '<i class="fa fa-credit-card map-link" title="CCS benzínky / myčky" id="wmepl_sk_ccs" data-item="sk_ccs"></i>';
	map_links += '<img src="//i.imgur.com/Xl1dZgr.png" alt="cdb" title="SSC - Cestná Databanka / značky" id="wmepl_cdb" data-item="cdb" class="map-link">'; // [SK] SSC - CDB
	map_links += '<img src="//i.imgur.com/qm2Ex0f.png" alt="zbgis" title="ZBGIS / Kataster" id="wmepl_zbgis" data-item="zbgis" class="map-link">'; // [SK] ZBGIS
	map_links += '<img src="//i.imgur.com/kQByydb.png" alt="Bratislava" title="BSK UPN Doprava / All" id="wmepl_blava" data-item="blava" class="map-link">'; // [SK] Bratislava
	map_links += '<img src="//i.imgur.com/5iRhjYj.png" alt="Košice" title="Košice" id="wmepl_kosice" data-item="kosice" class="map-link">'; // [SK] Kosice GISPLAN;
	map_links += '<img src="//i.imgur.com/VrZ0cw3.png" alt="Prešov" title="Prešov - webgis" id="wmepl_presov" data-item="presov" class="map-link">'; // [SK] Prešov
	map_links += '<i class="fa fa-building map-link" title="Test n. obcí / Katastr" id="wmepl_cz_obce" data-item="cz_obce"></i>'; // Test nazvu obci a Katastr
	map_links += '<img src="//i.imgur.com/0bOb9RG.png" alt="' + tr('Where am I?') + '" title="' + tr('Where am I?') + '" id="wmepl_wtfami" data-item="wtfami" class="map-link">'; // Kde jsem
	map_links += '<img src="//i.imgur.com/2yCyxgP.png" alt="Waze livemap" title="Waze livemap / se známkou" id="wmepl_livemap" data-item="livemap" class="map-link">'; // Waze livemap
	map_links += '<i class="fa fa-link map-link" title="Waze permal. tady / nová karta" id="wmepl_waze" data-item="waze"></i>';

	var opacitySettings = '';
	var opacityN = 0;
	for (var i = 0; i < 5; i++) {
		opacitySettings += '<span class="opacitySettings float-opt" id="opacitySettings'+i+'" data-item="'+i+'">'+opacityN+'%</span>';
		opacityN = opacityN+20;
	}

	var sizeSettings = '';
	for (var j = 12; j < 25; j=j+2) {
		sizeSettings += '<span class="sizeSettings float-opt" style="width:'+j+'px;height:'+j+'px;" data-item="'+j+'">'+j+'</span>';
	}

	var bar_settings = '<legend>' + tr('Bar settings') + '</legend>';
	bar_settings += '<label><input type="checkbox" class="bar-opt" name="wmepl_bar_float" id="wmepl_bar_float" data-item="float"> ' + tr('Floating bar') + '</label>';
	bar_settings += '<label class="float-lbl"><input type="checkbox" class="bar-opt float-opt" name="wmepl_bar_vertical" id="wmepl_bar_vertical" data-item="vertical"> ' + tr('Vertical floating bar') + '</label>';
	bar_settings += '<label style="padding-top: 10px;">' + tr('Bar color') + ':<br><span class="colorSettings float-opt" id="colorSettingsW">' + tr('White') + '</span> <span class="colorSettings float-opt" id="colorSettingsB">' + tr('Black') + '</span></label>';
	bar_settings += '<label>' + tr('Bar transparency') + ':<br>' + opacitySettings + '</label>';
	bar_settings += '<label>' + tr('Button size') + ' (px):<br>' + sizeSettings + '</label><p>&nbsp;</p>';
	if (I18n.locale != 'cs' && I18n.locale != 'sk') {
		bar_settings += '<label id="lctlinks-label"><input type="checkbox" class="bar-opt" name="wmepl_bar_lctlinks" id="wmepl_bar_lctlinks" data-item="lctlinks"> ' + tr('Show LCT links (sk)') + '</label>';
	}
	bar_settings += '<label><input type="checkbox" class="bar-opt" name="wmepl_bar_hidecopy" id="wmepl_bar_hidecopy" data-item="hidecopy"> ' + tr('Hide') + ' "<em>Imagery &copy; &hellip;</em>"</label>';

	var map_settings = '<legend>' + tr('Maps & waze links') + '</legend>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_gmaps" data-item="gmaps" value="1"> <img src="//i.imgur.com/tJkT6Ou.png" width="12" height="12"> Google Maps</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_gmaps_provoz" data-item="gmaps_provoz"> <img src="//i.imgur.com/tJkT6Ou.png" width="12" height="12"> Google Maps Provoz</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_mapycz" data-item="mapycz"> <img src="//i.imgur.com/EWv2H6F.png" width="12" height="12"> Mapy.cz</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_osm" data-item="osm"> <img src="//i.imgur.com/CyYKXMf.png" width="12" height="12"> Open Street Map</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_osv" data-item="osv"> <img src="//i.imgur.com/9LSVEwy.png" width="12" height="12"> Open Street Cam</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_bing" data-item="bing"> <img src="//i.imgur.com/6QbWlPt.png" width="12" height="12"> Bing maps</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_apple" data-item="apple"><img src="//i.imgur.com/S5GHGaE.png" width="12" height="12"> Apple maps</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_instasw" data-item="instasw"> <img src="//i.imgur.com/rEE54wz.png" width="12" height="12"> Instant Street View</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_mapillary" data-item="mapillary"> <img src="//i.imgur.com/sYWXnhE.png" width="12" height="12"> Mapillary</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_tomtom" data-item="tomtom"> <img src="//i.imgur.com/uKgHjvX.png" width="12" height="12"> TomTom</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_here" data-item="here"> <img src="//i.imgur.com/dSdLdoh.png" width="12" height="12"> Here</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_wtfami" data-item="wtfami"> <img src="//i.imgur.com/0bOb9RG.png" width="12" height="12"> ' + tr('Where am I?') + '</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_livemap" data-item="livemap"> <img src="//i.imgur.com/2yCyxgP.png" width="12" height="12"> Waze Livemap</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_waze" data-item="waze" disabled="disabled"> <i class="fa fa-link"></i> Waze Permalink</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_pumpdroid_n95" data-item="pumpdroid_n95"> <i class="fa fa-car"></i> Pumpdroid N95 / LPG</label>';
	map_settings += '<label><input type="checkbox" class="map-opt" id="wmepl_opt_pumpdroid_nafta" data-item="pumpdroid_nafta"> <i class="fa fa-truck"></i> Pumpdroid Nafta / Bio</label>';

	var czsk_settings = '<legend>' + tr('CZ/SK permalinks') + '</legend><em id="permalinks-cz" class="pointer">' + tr('Czech permalinks') + '</em>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_rsd" data-item="rsd"> <img src="//i.imgur.com/bFNMCqQ.png" width="12" height="12"> ŘSD</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_dopravniinfo" data-item="dopravniinfo"> <img src="//i.imgur.com/rNJyvvl.png" width="12" height="12"> Dopravní Info</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_tskpraha" data-item="tskpraha"> <img src="//i.imgur.com/tauFc9M.png" width="12" height="12"> TSK Praha</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cuzk" data-item="cuzk"> <img src="//i.imgur.com/UbgqKWr.png" width="12" height="12"> ČÚZK</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_ikatastr" data-item="ikatastr"> <img src="//i.imgur.com/UF6RQMe.png" width="12" height="12"> iKatastr</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_sz" data-item="sz"> <img src="//i.imgur.com/CikgGsw.png" width="12" height="12"> Správa železnic</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_closures" data-item="cz_closures"> <img src="//i.imgur.com/W7l8LzH.png" width="12" height="12"> ' + tr('Closures') + ' (cz)</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_wazers" data-item="cz_wazers"> <img src="//i.imgur.com/nMGuuxD.png" width="12" height="12"> ' + tr('Waze users') + ' (cz)</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_obce" data-item="cz_obce"> <i class="fa fa-building"></i> Test n. obcí / Katastr</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt cz-link" id="wmepl_opt_cz_ccs" data-item="cz_ccs"> <i class="fa fa-credit-card"></i> CCS benzínky / myčky</label>';

	czsk_settings += '<em id="permalinks-sk" class="pointer">' + tr('Slovak permalinks') + '</em>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_cdb" data-item="cdb"> <img src="//i.imgur.com/Xl1dZgr.png" width="12" height="12"> Cestná Databanka</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_zbgis" data-item="zbgis"> <img src="//i.imgur.com/qm2Ex0f.png" width="12" height="12"> ZBGIS</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_blava" data-item="blava"> <img src="//i.imgur.com/kQByydb.png" width="12" height="12"> BSK UPN Doprava / All</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_kosice" data-item="kosice"> <img src="//i.imgur.com/5iRhjYj.png" width="12" height="12"> Košice GISPLAN</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_presov" data-item="presov"> <img src="//i.imgur.com/VrZ0cw3.png" width="12" height="12"> Prešov (webgis)</label>';
	czsk_settings += '<label><input type="checkbox" class="map-opt sk-link" id="wmepl_opt_sk_ccs" data-item="sk_ccs"> <i class="fa fa-credit-card"></i> CCS benzínky / myčky</label>';

	$('head').append(LCTstyle);
	$('body').append('<form id="permalinks-settings"><fieldset id="wmepl-bar-settings">' + bar_settings + '</fieldset><fieldset id="wmepl-map-settings">' + map_settings + '</fieldset><fieldset id="wmepl-czsk-settings">' + czsk_settings + '</fieldset></form>');

	$('.WazeControlPermalink').before('<div id="permalinksBar"></div>');
	$('#permalinksBar').prepend('<img src="' + GM_info.script.icon + '" alt="⚙" title="' + tr('LCT settings') + '" width="16" height="16" id="permalinks-toggle">');
	$('#permalinks-toggle').on('click', function() {$('#permalinks-settings').toggleClass('visible');$('#permalinks-toggle').toggleClass('active');});
	//$('body').append('<div id="permalinksBar">' + map_links + ' <input type="text" name="CopyUrl" id="CopyUrl" value="" style=""></div>');

	render_permalinksBar(o.float == 1);
	if (o.float == 1) {
		$('#wmepl_opt_waze').removeAttr('disabled');
	} else {
		$('input.float-opt').attr('disabled', 'disabled');
		$('span.float-opt').addClass('disabled');
	}
	if (o.bgimg > 4) {
		var n = o.bgimg-5;
		$('#colorSettingsB').addClass('sel');
		$('#opacitySettings' + n).addClass('sel');
	}
	else {
		$('#colorSettingsW').addClass('sel');
		$('#opacitySettings' + o.bgimg).addClass('sel');
	}
	$('.sizeSettings[data-item="' + o.size + '"]').addClass('sel');
	if (o.hidecopy == 1) {
		$('.wz-map-ol-control-attribution').css('visibility', 'hidden');
		$('#wmepl_bar_hidecopy').prop('checked', true);
	}
	if (o.lctlinks == 1) {
		$('#wmepl_bar_lctlinks').prop('checked', true);
	}

	function save_settings() {
		if (localStorage.LCT_Settings) {
			var settings = JSON.parse(localStorage.LCT_Settings);
		}
		else {
			settings = new Object();
			settings.barX = 700;
			settings.barY = 80;
		}
		var n = parseInt($('.opacitySettings.sel').attr('data-item'));
		if ($('#colorSettingsB').hasClass('sel')) {
			n = n + 5;
		}
		settings.float = ($('#wmepl_bar_float').is(':checked')) ? 1 : 0;
		settings.vertical = ($('#wmepl_bar_vertical').is(':checked')) ? 1 : 0;
		settings.bgimg = n;
		settings.size = parseInt($('.sizeSettings.sel').attr('data-item'));
		settings.lctlinks = ($('#wmepl_bar_lctlinks').is(':checked')) ? 1 : 0;
		settings.hidecopy = ($('#wmepl_bar_hidecopy').is(':checked')) ? 1 : 0;
		localStorage.setItem('LCT_Settings', JSON.stringify(settings, null, 4));
	}

	function update_map_links() {
		var mapLink = '';
		var lct_permalinks = new Object();
		$('#permalinks-settings .map-opt').each(function() {
			mapLink = $(this).attr('data-item');
			if ($(this).is(':checked')) {
				$('#wmepl_' + mapLink).show();
				lct_permalinks[mapLink] = 1;
			}
			else {
				$('#wmepl_' + mapLink).hide();
				lct_permalinks[mapLink] = 0;
			}
		});
		localStorage.setItem('LCT_Permalinks', JSON.stringify(lct_permalinks, null, 4));
	}

	$('#wmepl_bar_float').on('change', function() {
		render_permalinksBar($(this).is(':checked'));
		if ($(this).is(':checked')) {
			$('input.float-opt, #wmepl_opt_waze').removeAttr('disabled');
			$('span.float-opt').removeClass('disabled');
		}
		else {
			$('input.float-opt, #wmepl_opt_waze').attr('disabled', 'disabled');
			$('span.float-opt').addClass('disabled');
		}
		save_settings();
	});

	$('#wmepl_bar_vertical').on('change', function() {
		if ($(this).is(':checked')) {
			$('#permalinksBar_float').addClass('vertical');
			$('#permalinksBar_float.vertical').css('width', (o.size+8) + 'px');
		}
		else {
			$('#permalinksBar_float').removeClass('vertical');
			$('#permalinksBar_float').css('width', 'auto');
		}
		save_settings();
	});

	$('#wmepl_bar_hidecopy').on('change', function() {
		if ($(this).is(':checked')) {
			$('.wz-map-ol-control-attribution').css('visibility', 'hidden');
		}
		else {
			$('.wz-map-ol-control-attribution').css('visibility', 'visible');
		}
		save_settings();
	});

	$('#wmepl_bar_lctlinks').on('change', function() {
		save_settings();
		$('#lctlinks-reload').remove();
		$('#lctlinks-label').append(' <span id="lctlinks-reload">[<a href="javascript:location.reload()">' + tr('Reload') + '</a>]</span>');
	});

	$('.colorSettings, .opacitySettings, .sizeSettings').on('click', function() {
		if (!$(this).hasClass('disabled')) {
			if ($(this).hasClass('opacitySettings')) {
				$('.opacitySettings').removeClass('sel');
				$(this).addClass('sel');
			}
			else if ($(this).hasClass('sizeSettings')) {
				$('.sizeSettings').removeClass('sel');
				$(this).addClass('sel');
			}
			else {
				$('.colorSettings').removeClass('sel');
				$(this).addClass('sel');
			}
			var n = parseInt($('.opacitySettings.sel').attr('data-item'));
			if ($('#colorSettingsB').hasClass('sel')) {
				n = n + 5;
			}
			var selSize = parseInt($('.sizeSettings.sel').attr('data-item'));
			o.size = selSize;
			$('#permalinksBar_float').css('background', 'url("https://i.imgur.com/' + bgImgs[n] + '.png") top left repeat');
			$('#permalinksBar_float.vertical').css('width', (selSize+8) + 'px');
			$('#permalinksBar_float img.map-link').css('width', selSize + 'px').css('height', selSize + 'px');
			$('#permalinksBar_float i.map-link').css('font-size', selSize + 'px');
			save_settings();
		}
	});

	$('#permalinks-settings .map-opt').on('change', function() {
		update_map_links();
	});

	$('#permalinks-cz').on('click', function() {
		var check = ($('#wmepl_opt_rsd').is(':checked')) ? false : true;
		$('.cz-link').each(function(){this.checked = check;});
		update_map_links();
	});

	$('#permalinks-sk').on('click', function() {
		var check = ($('#wmepl_opt_cdb').is(':checked')) ? false : true;
		$('.sk-link').each(function(){this.checked = check;});
		update_map_links();
	});

	$(document).on('click', function(event) {
		if (!$(event.target).closest('#permalinks-settings').length && !$(event.target).closest('#permalinks-toggle').length && !$(event.target).closest('#permalinksBar_float').length) {
			$('#permalinks-settings').removeClass('visible');
			$('#permalinks-toggle').removeClass('active');
		}
	});

	if (o.lctlinks == 1 || I18n.locale == 'sk') {
		window.openLCT = function(username) {
			window.open('http://guri.sk/waze/lct/streets.php?days=14&editor_name=' + username, '_blank');
		};
		function parseUsername(html) {
			var userUpdated = html.match(/[a-zA-Z\-\_0-9]+\(/);
			userUpdated = userUpdated[0].replace('(', '');
			return userUpdated;
		}
		function updateLCTlinks() {
			if ($('#chat ul.user-list').is(':visible')) {
				$('#chat ul.user-list li').each(function() {
					var username = $('div.username', this).html();
					var lctimg = $('.lct-link', this).html();
					if (username == undefined) {
						$('.lct-link', this).remove();
					}
					else {
						if ($('#lct-link-' + username).length == 0) {
							$(this).prepend('<i class="fa fa-user-secret lct-link" id="lct-link-' + username + '" onclick="openLCT(\'' + username + '\')"></i>');
						}
					}
				});
				if (lct_debug && lct_loop_debug) console.log('LCT: Updating chat user list');
			}
			if (unsafeWindow.W.selectionManager.selectedItems[0] != undefined && (unsafeWindow.W.selectionManager.selectedItems[0].model.type == 'segment' || unsafeWindow.W.selectionManager.selectedItems[0].model.type == 'venue')) {
				if ($('ul.side-panel-section li:nth-child(2) .updated-by-list').length) {
					$('ul.side-panel-section li:nth-child(2) .updated-by-list li').each(function() {
						var lctimg = $('.lct-link', this).html();
						if (lctimg == undefined) {
							var username = parseUsername($(this).html());
							$(this).append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
						}
					});
				}
				else if (!$('ul.side-panel-section li:nth-child(2) .lct-link').length) {
					var username = parseUsername($('ul.side-panel-section li:nth-child(2)').html());
					$('ul.side-panel-section li:nth-child(2)').append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
				}
				var n = (unsafeWindow.W.selectionManager.selectedItems[0].model.type == 'venue') ? 1 : 3;
				if ($('ul.side-panel-section li:nth-child('+n+') .created-by-list').length) {
					$('ul.side-panel-section li:nth-child('+n+') .created-by-list li').each(function() {
						var lctimg = $('.lct-link', this).html();
						if (lctimg == undefined) {
							username = parseUsername($(this).html());
							$(this).append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
						}
					});
				}
				else if (!$('ul.side-panel-section li:nth-child('+n+') .lct-link').length) {
					username = parseUsername($('ul.side-panel-section li:nth-child('+n+')').html());
					$('ul.side-panel-section li:nth-child('+n+')').append(' <i class="fa fa-user-secret lct-link" onclick="openLCT(\'' + username + '\')"></i>');
				}
				if (lct_debug && lct_loop_debug) console.log('LCT: Updating side panel LCT links');
			}
		}
		window.setInterval(updateLCTlinks, 1E3);
	}
}

if (lct_debug) console.log('LCT: Script loaded');
document.addEventListener("wme-map-data-loaded", LCT_init, {once: true});