// ==UserScript==
// @name        Die Stämme Benutzerskript
// @namespace   Die Stämme Benutzerskript
// @include     https://*die-staemme.de*
// @version     0.5
// @grant       none
// @description Die Stämme Benutzerskript :D
// @downloadURL https://update.greasyfork.org/scripts/28616/Die%20St%C3%A4mme%20Benutzerskript.user.js
// @updateURL https://update.greasyfork.org/scripts/28616/Die%20St%C3%A4mme%20Benutzerskript.meta.js
// ==/UserScript==

var sub = location.hostname.split('.').shift();

function searchParam(){
	var p = '';
	for (i = 1; i < location.search.length; i++) {
		p += location.search.charAt(i);
	}
	t = p.split('&');
	p = [];
	t.forEach(function(value){
		var temp = [];
		temp.push(value.split('=')[0])
		temp.push(value.split('=')[1])
		p.push(temp)
	})
	return p;
}

function getParam(p){
	res = false;
	searchParam().forEach(function (value) {
		if (value[0] == p) {
			res = value[1]
		}
	})
	return res;
}

if(typeof(TWMap) !== 'undefined'){
TWMap.goFullscreen = function () {
  var e = document.getElementById('map_wrap'),
  a = 'fullscreenchange mozfullscreenchange webkitfullscreenchange';
  if (e.requestFullScreen) e.requestFullScreen();
   else if (e.mozRequestFullScreen) e.mozRequestFullScreen();
   else {
    if (!e.webkitRequestFullScreen) return !1;
    e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
  }
  $(document).bind(a, function () {
    var e = TWMap.size;
    TWMap.fullscreen = !0,
    TWMap.resize(0, !1),
    $('#map_popup').detach().appendTo('#map_wrap'),
    $('#minimap').detach().appendTo('#map_wrap'),
    $('#fullscreen').hide(),
    $(document).unbind(a).bind(a, function () {
      $('#map_popup').detach().appendTo($('body')),
      $('#minimap').detach().appendTo($('#minimap_cont')),
      $('#fullscreen').show(),
      TWMap.resize(e, !0),
      TWMap.fullscreen = !1,
      $(document).unbind(a)
    })
  })
}

if (document.getElementById('map_coord_x_wrap')) document.getElementById('map_coord_x_wrap').insertAdjacentHTML('afterend', '<img src="https://dsde.innogamescdn.com/8.78/32721/graphic/fullscreen.png" id="fullscreen" onclick="TWMap.goFullscreen()" alt="" class="" style="display: inline;">')
}

document.getElementById('header_info').insertAdjacentHTML('beforebegin', `
<table id="quickbar_outer" align="center" width="100%" cellspacing="0">
					<tbody><tr>
						<td>
							<table id="quickbar_inner" style="border-collapse: collapse;" width="100%">
								<tbody><tr class="topborder">
									<td class="left"> </td>
									<td class="main"> </td>
									<td class="right"> </td>
								</tr>
								<tr>
									<td class="left"> </td>
									<td id="quickbar_contents" class="main">
										<ul class="menu quickbar">
											
																																				 
													<li class="quickbar_item" data-hotkey="1">
																<span>
																	<a class="quickbar_link" data-hash="7843128499689e43baba42bab06dc4fa" href="/game.php?village=` + getParam('village') + `&amp;screen=main">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/main.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/main.png">Hauptgebäude
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="2">
																<span>
																	<a class="quickbar_link" data-hash="d19a9592b32578e63c1cb2dffa78cbe2" href="/game.php?village=` + getParam('village') + `&amp;screen=train">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/barracks.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/barracks.png">Rekrutieren
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="3">
																<span>
																	<a class="quickbar_link" data-hash="8708802b51699a4f36571e77aedce6e2" href="/game.php?village=` + getParam('village') + `&amp;screen=snob">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/snob.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/snob.png">Adelshof
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="4">
																<span>
																	<a class="quickbar_link" data-hash="3f69e37073fa8329448b02773dadd5ef" href="/game.php?village=` + getParam('village') + `&amp;screen=smith">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/smith.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/smith.png">Schmiede
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="5">
																<span>
																	<a class="quickbar_link" data-hash="cc5ffd9297792b3360ffc14dba7edf5f" href="/game.php?village=` + getParam('village') + `&amp;screen=place">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/place.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/place.png">Versammlungsplatz
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="6">
																<span>
																	<a class="quickbar_link" data-hash="7d6f4d2c6f77d1637b4c3578dffa4b47" href="/game.php?village=` + getParam('village') + `&amp;screen=market">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/market.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//buildings/market.png">Marktplatz
																	</a>
																</span>
													</li>
																											</ul><ul class="menu nowrap quickbar">
																																																																																				 
													<li class="quickbar_item">
																<span>
																	<a class="quickbar_link" data-hash="8e67ab23d7bab290806e3784ca8761a9" href="https://de140.die-staemme.de/game.php?screen=overview_villages&amp;mode=trader" title="Dorfübersicht öffnen">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32710/graphic/icons/overview.png" alt="" src="https://dsde.innogamescdn.com/8.78/32710/graphic/icons/overview.png">Dorfübersicht
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="7">
																<span>
																	<a class="quickbar_link" data-hash="8d3513d9afc34acbb22c70ab416ef175" href="https://` + sub + `.die-staemme.de/game.php?&amp;screen=farm" title="Bauernhof öffnen">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic/face.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic/face.png">Bauernhof
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="8">
																<span>
																	<a class="quickbar_link" data-hash="51fdb7724d781329e6e3d2c6002ea426" href="https://` + sub + `.die-staemme.de/game.php?screen=stone" title="Lehmgrube öffnen">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic/lehm.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic/lehm.png">Lehmgrube
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="9">
																<span>
																	<a class="quickbar_link" data-hash="a3b29432210684417023300fc3909c43" href="https://` + sub + `.die-staemme.de/game.php?screen=wood" title="Holzfällerlager öffnen">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic/holz.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic/holz.png">Holzfällerlager
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="0">
																<span>
																	<a class="quickbar_link" data-hash="0f82f049775daaa88bffd24fea2ce52a" href="https://` + sub + `.die-staemme.de/game.php?screen=iron" title="Eisenmine öffnen">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic/eisen.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic/eisen.png">Eisenmine
																	</a>
																</span>
													</li>
																																																													 
													<li class="quickbar_item" data-hotkey="0">
																<span>
																	<a class="quickbar_link" data-hash="64ed95cc273d53c9c07123ffc0305451" href="https://` + sub + `.die-staemme.de/game.php?screen=statue" title="Paladin anzeigen">
																		<img class="quickbar_image" data-src="https://dsde.innogamescdn.com/8.78/32721/graphic/unit/unit_knight.png" alt="" src="https://dsde.innogamescdn.com/8.78/32721/graphic/unit/unit_knight.png">Paladin
																	</a>
																</span>
													</li>
																																														</ul>
									</td>
									<td class="right"> </td>
								</tr>
								<tr class="bottomborder">
									<td class="left"> </td>
									<td class="main"> </td>
									<td class="right"> </td>
								</tr>
								<tr>
									<td class="shadow" colspan="3">
										<div class="leftshadow"> </div>
										<div class="rightshadow"> </div>
									</td>
								</tr>
							</tbody></table>
						</td>
					</tr>
				</tbody></table>
`);

if(document.getElementById('map_topo')) document.getElementById('map_topo').insertAdjacentHTML('beforeend', `
<br>
<table class="vis" width="100%">
	<tbody><tr>
		<th colspan="2">Kartengröße ändern</th>
	</tr>
	<tr>
		<td><table cellspacing="0"><tbody><tr>
		<td width="80">Karte:</td>
		<td>
			<select id="map_chooser_select" onchange="TWMap.resize(parseInt($('#map_chooser_select').val()), true)">
				<option id="current-map-size" value="13x14" selected="selected">13x14</option>
								<option value="4">4x4</option>
								<option value="5">5x5</option>
								<option value="7">7x7</option>
								<option value="9">9x9</option>
								<option value="11">11x11</option>
								<option value="13">13x13</option>
								<option value="15">15x15</option>
								<option value="20">20x20</option>
								<option value="30">30x30</option>
											</select>
			</td>
						<td valign="middle">
				<img class="" src="https://dsde.innogamescdn.com/8.78/32721/graphic//questionmark.png" width="13" height="13">
			</td>
						</tr></tbody></table>
			<input value="/game.php?village=` + getParam('village') + `&amp;screen=settings&amp;ajaxaction=set_map_size&amp;h=c22599c6" id="change_map_size_link" type="hidden">
		</td>
	</tr>
	<tr>
		<td><table cellspacing="0"><tbody><tr>
		<td width="80">Minimap:</td>
		<td colspan="2">
			<select id="minimap_chooser_select" onchange="TWMap.resizeMinimap(parseInt($('#minimap_chooser_select').val()), true)">
				<option id="current-minimap-size" value="50x50" style="display:none;">
				50x50</option>
								<option value="20">20x20</option>
								<option value="30">30x30</option>
								<option value="40">40x40</option>
								<option value="50" selected="selected">50x50</option>
								<option value="60">60x60</option>
								<option value="70">70x70</option>
								<option value="80">80x80</option>
								<option value="90">90x90</option>
								<option value="100">100x100</option>
								<option value="110">110x110</option>
								<option value="120">120x120</option>
							</select>
			</td>
			</tr></tbody></table>
			<input value="/game.php?amp;screen=settings&amp;ajaxaction=set_map_size&amp;h=c22599c6" id="change_map_size_link" type="hidden">
		</td>
	</tr>
</tbody></table>
`)
