// ==UserScript==
// @name		PGMSuitebAK
// @homepage	https://github.com/Slimmmo/PGMSuite/
// @namespace	PGMSuite
// @version		1.0.7
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @include		/^https?:\/\/.*po(go|ke)map\.com\/*/
// @exclude     https://sydneypogomap.com/gym.html
// @exclude		http://www.lapogomap.com/*
// @grant		none
// @description blocks pogoads
// @downloadURL https://update.greasyfork.org/scripts/31981/PGMSuitebAK.user.js
// @updateURL https://update.greasyfork.org/scripts/31981/PGMSuitebAK.meta.js
// ==/UserScript==

function generateFilterList() {
	if (!didGenerateFilterList) {
		didGenerateFilterList = true;
		var html = '';
		for (var i = 0; i < pokeArray.length; ++i) {
			var pokemon = pokeArray[i];
			var disabled = '';
			var checked = '';
			var cssClass = '';
			var question = '';

			if (!pokemon.h) {
				cssClass = 'filter_checkbox';
				if (isPokemonChecked(pokemon.i)) {
					checked = ' checked="true" ';
				}
			} else {
				cssClass = 'filter_checkbox input_disabled';
				disabled = ' disabled ';
				question = ' <a href="faq.html#pidgey"><img src="images/question.png" style="width: 15px; height: 15px;" /></a> ';
			}
			var assetServer = parseInt(pokemon.i) % 8 + 1;
			var assetURL = '//assets-' + assetServer.toString() + '.' + currentTopDomainName + '/images/poke/' + pokemon.i + '.png?ver27';
			var ivSet = localStorage.getItem('iv_' + pokemon.i) !== '';
			var ivString = ivSet ? ' value="' + localStorage.getItem('iv_' + pokemon.i) + '"' : '';
			html += '<div class="' + cssClass + '"><input id="checkbox_' + pokemon.i + '" type="checkbox" ' + checked + disabled + ' name="pokemon" value="' + pokemon.i + '"><label for="checkbox_' + pokemon.i + '"><img src="' + assetURL + '" style="max-height: 25px"> ' + pokemon.n + '</label>' + question;
			html += '<input type="number" id="iv_' + pokemon.i + '"' + ivString + disabled + ' style="margin-left: 3px; max-width: 45px; display: inline-block" onchange="updateIV(' + pokemon.i + ')"></div>';
		}
		$('#filter_list_top').html(html);
		$('.filter_checkbox input').bind("change", function(data) {
			if (this.checked) {
				checkPokemon(this.value);
				inserted = 0;
				reloadPokemons();
			} else {
				uncheckPokemon(this.value);
			}
		});
	}
}

function indexOfPokemons(pokemon, pokemons) {
	if (!showPokemon(pokemon)) {
		return 0;
	} else {
		for (var i = 0; i < pokemons.length; ++i) {
			var currentPokemon = pokemons[i];
			if (pokemon.isEqual(currentPokemon)) {
				return i;
			}
		}
	}
	if ($('#icb').is(':checked') && isInBounds(pokemon.center)) {
		postDiscord(pokemon);
	}
	return -1;
}

function isInBounds(center) {
	return map.getBounds().contains(new L.LatLng(center.lat, center.lng));
}

function modifyHTML() {
	var icb = document.createElement('input');
	icb.type = 'checkbox';
	icb.id = 'icb';
	var clab = document.createElement('label');
	clab.htmlFor = 'icb';
	clab.appendChild(document.createTextNode('Enable Discord'));
	clab.style.cssText = 'padding-right: 7px';
	$('#topbar').append(icb);
	$('#topbar').append(clab);

	var iiv = document.createElement('input');
	iiv.type = 'number';
	iiv.id = 'iiv';
	iiv.max = 100;
	iiv.value = localStorage.getItem('iv_value') || 82;
	iiv.onchange = saveIVValue;
	iiv.style.cssText = 'max-width: 45px';
	var nlab = document.createElement('label');
	nlab.htmlFor = 'iiv';
	nlab.appendChild(document.createTextNode('IV %'));
	nlab.style.cssText = 'padding-right: 7px';
	$('#topbar').append(iiv);
	$('#topbar').append(nlab);

	var fcb = document.createElement('input');
	fcb.type = 'checkbox';
	fcb.id = 'fcb';
	fcb.onchange = saveIVEverything;
	if (localStorage.getItem('iv_everything') == 'true') fcb.checked = true;
	var flab = document.createElement('label');
	flab.htmlFor = 'fcb';
	flab.appendChild(document.createTextNode('IV filter everything'));
	flab.style.cssText = 'padding-right: 7px';
	$('#topbar').append(fcb);
	$('#topbar').append(flab);

	var iwh = document.createElement('input');
	iwh.type = 'text';
	iwh.id = 'iwh';
	iwh.onchange = saveWebhook;
	iwh.value = localStorage.getItem('whURL') || '';
	iwh.style.cssText = 'max-width: 50px';
	var wlab = document.createElement('label');
	wlab.htmlFor = 'iwh';
	wlab.appendChild(document.createTextNode('Webhook URL'));
	$('#topbar').append(iwh);
	$('#topbar').append(wlab);

	$('#map').css('top','');
	$('#map').css('bottom','');
	$('#filter_settings').css('top','50px');
	$('#locate').css('top','50px');
}

function postDiscord(p) {
	var date = new Date(p.despawn * 1000);
	var dateString = date.getHours() + ':' + ("0" + date.getMinutes()).substr(-2) + ':' + ("0" + date.getSeconds()).substr(-2);
	var text = getPokemonName(p) + ' ' + (p.cp == -1 ? '' : '(' + p.cp + ' CP)') + Math.floor((p.attack + p.defence + p.stamina) / 0.45) + '% with ' + getMoveName(p.move1) + ', ' + getMoveName(p.move2) + ' until ' + dateString + ' at http://maps.google.com/maps?q=' + p.center.lat + ',' + p.center.lng + '&zoom=14';
	$.ajax({
		data: 'content=' + text,
		dataType: 'json',
		processData: false,
		type: 'POST',
		url: $('#iwh').val()
	});
}

function refreshPokemons() {
	if (!shouldUpdate) {
		return; //don't update when map is moving
	}
	var toBeRemovedIndexes = [];
	var currentPokemon, marker, i;
	var currentUnixTime = Math.floor(Date.now() / 1000) - timeOffset;
	for (i = 0; i < pokemons.length; ++i) {
		currentPokemon = pokemons[i];
		if (currentPokemon.despawn < currentUnixTime - 10 || (!isPokemonChecked(currentPokemon.id) && !shouldTurnFilterOff()) || !showPokemon(currentPokemon)) {
			toBeRemovedIndexes.push(i);
		}
	}
	for (i = toBeRemovedIndexes.length - 1; i >= 0; --i) {
		pokemons.splice(toBeRemovedIndexes[i], 1);
		marker = markers[toBeRemovedIndexes[i]];
		marker.removeFrom(map);
		markers.splice(toBeRemovedIndexes[i], 1);
	}
	//remove low IV from map, add high IV to map
	for (i = 0; i < pokemons.length; ++i) {
		currentPokemon = pokemons[i];
		var ivPercentage = (currentPokemon.attack + currentPokemon.defence + currentPokemon.stamina) / 45 * 100;
		marker = markers[i];
		var min_iv_compare = min_iv;
		//to let unknown iv show
		if (min_iv === 0) {
			min_iv_compare = -100;
		}
		if (ivPercentage >= min_iv_compare || shouldTurnFilterOff()) {
			if (!marker._map) {
				marker.addTo(map);
			}
		} else {
			if (marker._map) {
				marker.removeFrom(map);
			}
		}
	}
	if (shouldShowTimers()) {
		for (i = 0; i < markers.length; ++i) {
			//only update for the ones in bounds
			var mapBounds = map.getBounds();
			var tmpMarker = markers[i];
			if (mapBounds.contains(tmpMarker.getLatLng())) {
				$(tmpMarker._icon).find('.pokemon_icon_timer').html(timeToString(pokemons[i].remainingTime()));
			}
		}
	}
}

function saveIVEverything() {
	localStorage.setItem('iv_everything', $('#fcb').is(':checked'));
}

function saveIVValue() {
	localStorage.setItem('iv_value', $('#iiv').val());
}

function saveWebhook() {
	localStorage.setItem('whURL', $('#iwh').val());
}


function showPokemon(p) {
	var iv = (p.attack + p.defence + p.stamina) / 0.45;
	var lsVal = localStorage.getItem('iv_' + p.id);
	if (lsVal !== null && (lsVal === '' || lsVal === '0')) {
		lsVal = null;
		localStorage.removeItem('iv_' + p.id);
	}    
    if (localStorage.getItem('filterOff') == '1') {
        return true;
    } else if (lsVal !== null) {
		return iv >= lsVal;
	} else if ($('#fcb').is(':checked') || !isPokemonChecked(p.id)) {
		return iv >= $('#iiv').val();
	} else {
		return true;
	}
}

function updateIV(pid) {
	var val = $('#iv_' + pid).val();
	if (val !== '' && val !== 0) {
		localStorage.setItem('iv_' + pid, val);
	} else {
		localStorage.removeItem('iv_' + pid);
	}
}

$('#select_all_btn').unbind('click');
$('#select_all_btn').bind('click', function() {
	var shouldCheckAll = true;
	shouldCheckAll = confirm("Show all Pokémon will make your page laggy. Proceed?");
	if (shouldCheckAll) {
		$(".filter_checkbox input[type=checkbox]").each(function() {
			var tmpPokemon = pokeDict[$(this).val()];
			if (tmpPokemon.show_filter) {
				$(this).prop('checked', true);
			}
		});
		for (var key in pokeDict) {
			if (pokeDict[key].show_filter) {
				checkPokemon(key);
			}
		}
		inserted = 0;
		reloadPokemons();
	}
});
$('#deselect_all_btn').unbind('click');
$('#deselect_all_btn').bind('click', function() {
	$(".filter_checkbox input[type=checkbox]").each(function() {
		$(this).prop('checked', false);
	});
	for (var key in pokeDict) {
		uncheckPokemon(key);
	}
	inserted = 0;
	reloadPokemons();
});

if (localStorage.getItem("infiniteScrollEnabled") === null) {
	for (var i = 1; i <= 251; i++) {
		localStorage['icon' + i] = 'https://raw.githubusercontent.com/pokeicons/icons/master/' + i + '.png';
	}
}

// Inject this code into the site's scope

modifyHTML();
addJS_Node(generateFilterList);
addJS_Node(indexOfPokemons);
addJS_Node(isInBounds);
addJS_Node(postDiscord);
addJS_Node(refreshPokemons);
addJS_Node(saveIVEverything);
addJS_Node(saveIVValue);
addJS_Node(saveWebhook);
addJS_Node(showPokemon);
addJS_Node(updateIV);

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
	var D = document;
	var scriptNode = D.createElement('script');
	if (runOnLoad) {
		scriptNode.addEventListener("load", runOnLoad, false);
	}
	scriptNode.type	= "text/javascript";
	if (text) scriptNode.textContent = text;
	if (s_URL) scriptNode.src = s_URL;
	if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

	var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
	targ.appendChild (scriptNode);
}