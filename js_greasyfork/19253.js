// ==UserScript==
// @name        FlagstackMap
// @namespace   flagstackmap.rocka.de
// @include     https://www.flagstack.net/map*
// @version     1.0.1
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @description Type filters, score sum and GPX exports for Flagstack Map
// @downloadURL https://update.greasyfork.org/scripts/19253/FlagstackMap.user.js
// @updateURL https://update.greasyfork.org/scripts/19253/FlagstackMap.meta.js
// ==/UserScript==
//
// Features:
// * filter visible Flags by type
// * Total score display
// * GPX Export: save visible Flags to a file for offline use
// * change URL when clicking on Flag (reload to last shown Flag)

// History:
// 1.0.1
// * added POI flags


(function () {
	var locale = 'de-DE',
		filters = JSON.parse(GM_getValue('filters')||'{}'),
		types = {
			own: {
				rgx: /_own_/,
				name: 'Own Flag',
				score: 0
			},
			captured: {
				rgx: /_captured_/,
				name: 'Captured Flag',
				score: 0
			},
			green: {
				rgx: /_green_/,
				name: 'Green Flag',
				score: 8
			},
			system: {
				rgx: /_orange_/,
				name: 'System Flag',
				score: 16
			},
			white: {
				rgx: /_white_/,
				name: 'White Flag',
				score: 10
			},
			personal: {
				rgx: /_personal_/,
				name: 'Personal Flag',
				score: 5
			},
			oracle: {
				rgx: /_oracle_/,
				name: 'Oracle Flag',
				score_min: 6,
				score_max: 40
			},
			premium: {
				rgx: /_premium_/,
				name: 'Premium Flag',
				score: 10
			},
			treasure: {
				rgx: /_treasure_/,
				name: 'Treasure Flag',
				score_min: 8,
				score_max: 60
			},
			company: {
				rgx: /_business_/,
				name: 'Company Flag',
				score: 1
			},
			party: {
				rgx: /_party_/,
				name: 'Party Flag',
				score: 0//?
			},
			team: {
				rgx: /_team_/,
				name: 'Team Flag',
				score: 0
			},
			poi:{
				rgx:/_poi_/,
				name:"POI",
				score_min:8,
				score_max:40
			},
			querfeldein_deutschland: {
				rgx: /\/(736699|7367(05|11|19|32|33)|10905(22|31|47|52|68|98)|10906(03|09|21|39))_/,
				name: 'Querfeldein durch Deutschland',
				score: 10,
				flags: {
					736699: 'Schleswig-Holstein',
					736705: 'Nordrhein-Westfalen',
					736711: 'Saarland',
					736719: 'Mecklenburg-Vorpommern',
					736732: 'Sachsen',
					736733: 'Thüringen',
					1090522: 'Bremen',
					1090531: 'Niedersachsen',
					1090547: 'Hessen',
					1090552: 'Rheinland-Pfalz',
					1090568: 'Baden-Württemberg',
					1090598: 'Hamburg',
					1090603: 'Brandenburg',
					1090609: 'Berlin',
					1090621: 'Sachsen-Anhalt',
					1090639: 'Bayern'
				}
			}
		},
		groups = {
			physical: ['treasure'],
			virtual: ['green', 'system', 'white', 'personal', 'oracle', 'premium', 'company', 'party'],
			special: ['querfeldein_deutschland','poi']
		},
		scoreElem,
		tmpl_gpx = '<?xml version="1.0" encoding="UTF-8" standalone="yes" ?><gpx xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.1" xmlns:gpxtpx="http://www.garmin.com/xmlschemas/TrackPointExtension/v1" xmlns="http://www.topografix.com/GPX/1/1" xmlns:rmc="urn:net:trekbuddy:1.0:nmea:rmc" creator="MunzeeMapNG" xmlns:wptx1="http://www.garmin.com/xmlschemas/WaypointExtension/v1" xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensionsv3.xsd http://www.garmin.com/xmlschemas/TrackPointExtension/v1 http://www.garmin.com/xmlschemas/TrackPointExtensionv1.xsd http://www.garmin.com/xmlschemas/WaypointExtension/v1 http://www.garmin.com/xmlschemas/WaypointExtensionv1.xsd" xmlns:gpxx="http://www.garmin.com/xmlschemas/GpxExtensions/v3" xmlns:ql="http://www.qlandkarte.org/xmlschemas/v1.1"><metadata><time><%time></time></metadata><%wpts><extensions/></gpx>',
		tmpl_wpt = '<wpt lon="<%lon>" lat="<%lat>"><time><%time></time><name><%name></name><cmt><%cmt></cmt><desc><![CDATA[<%desc>]]></desc><extensions><locus:icon>file:flagstack.zip:<%icon>.png</locus:icon></extensions></wpt>';

	function isAnnotationVisible(annotation) {
		return unsafeWindow.map.getBounds().contains(annotation.getPosition());
	}

	function refresh() {
		var score = 0, score_min = 0, score_max = 0, type_count = {};
		$.each(unsafeWindow.annotations, function (flag_id, flag) {
			$.each(types, function (type, type_info) {
				if (type_info.rgx.test(flag.icon)) {
					if (filters[type] && flag.map !== null) {
						flag.setMap(null);
					} else if (!filters[type]) {
						if (flag.map === null) {
							flag.setMap(unsafeWindow.map);
						}
						if (isAnnotationVisible(flag)) {
							score_min += type_info.score_min ? type_info.score_min : type_info.score;
							score_max += type_info.score_max ? type_info.score_max : type_info.score;

							type_count[type] = (type_count[type] || 0) + 1;
						}
					}
				}
			});
		});
		score = (score_min + score_max) / 2;
		scoreElem.html(score.toLocaleString(locale) + ' Points');
		if (score_min < score_max) {
			scoreElem.append('<br /><span>(' + score_min.toLocaleString(locale) + ' - ' + score_max.toLocaleString(locale) + ')</span>');
		}
		var type_text = '';
		for (var type in type_count) {
			if (type_count[type] > 0 && (types[type].score > 0 || types[type].score_min > 0)) {
				type_text += type_count[type] + ' ' + (types[type].name || (type.charAt(0).toUpperCase() + type.slice(1))) + ' Flags (' +
						(types[type].score_min > 0 ? (types[type].score_min * type_count[type]).toLocaleString(locale) + ' - ' + (types[type].score_max * type_count[type]).toLocaleString(locale) : (types[type].score * type_count[type]).toLocaleString(locale)) + ")\n";
			}
		}
		scoreElem.attr('title', type_text);
		//console.log(type_text);
	}

	function createLink(id) {
		return annotations[id] ? '/map/?highlight=1&id=' + id + '&latitude=' + annotations[id].position.lat() + '&longitude=' + annotations[id].position.lng() : '';
	}

	function useTmpl(tmpl, data) {
		var out = tmpl;
		$.each(data, function (key, value) {
			out = out.replace('<%' + key + '>', value);
		});
		return out;
	}

	function createGPX() {
		var wpts = "";
		$.each(unsafeWindow.annotations, function (flag_id, flag) {
			if (isAnnotationVisible(flag)) {
				$.each(types, function (type, type_info) {
					if (type_info.rgx.test(flag.icon) && !filters[type]) {
						wpts += useTmpl(tmpl_wpt, {
							lon: flag.getPosition().lng(),
							lat: flag.getPosition().lat(),
							time: "",
							name: flag.f_name + (type_info.name !== flag.f_name ? "(" + type_info.name + ")" : ""),
							cmt: flag.f_ownerUsername ? "by " + flag.f_ownerUsername : "",
							desc: flag.f_address,
							icon: type
						});
					}
				});
			}
		});
		if (wpts) {
			window.open('data:text/plain,' + useTmpl(tmpl_gpx, {
				time: (new Date()).toISOString(),
				wpts: wpts
			}));
		}
		console.log('done', wpts);
	}

	GM_registerMenuCommand('Save Filters',function(){
		GM_setValue('filters', JSON.stringify(filters));
	},'s');

	unsafeWindow.getMapItems = function () {
		var params = {
			section: 'mapItems',
			latitude: currentLocation.latitude,
			longitude: currentLocation.longitude,
			centerLocation: JSON.stringify(centerLocation),
			regionBounds: JSON.stringify(regionBounds),
		};

		if (xhr) {
			xhr.abort();
		}

		if (!requestID) {
			requestID = randomString();
		}

		params.requestID = requestID;

		if (responseIDs.length > 0) {
			params.responseIDs = JSON.stringify(responseIDs);
		}

		xhr = $.getJSON('/api/?' + sid, params, function (jsonData) {
			if (jsonData.result === 'OK') {
				var newItems = 0;

				if (typeof (jsonData.responseID) !== 'undefined') {
					responseIDs.push(jsonData.responseID);
				}

				if (typeof (jsonData.items) !== 'undefined') {
					xhrItems = jsonData.items;

					for (var i = 0, len = jsonData.items.length; i < len; i++) {
						var itemID = jsonData.items[i].id;
						if (typeof (annotations[itemID]) === 'undefined') {
							annotations[itemID] = createAnnotation(jsonData.items[i]);
							if (highlight === 1 && itemID === highlightItemID && highlightInit) {
								highlightInit = false;
								new google.maps.event.trigger(annotations[itemID], 'click');
							}
							newItems++;
						}
					}
				}
			} else if (jsonData.result == 'ERROR') {
				swal({
					title: jsonData.title,
					text: jsonData.message,
					type: 'error',
					animation: false
				});
			}

			refresh();
		});
	};

	function createFilterBtn(type){
		return  '<dt>' + type.charAt(0).toUpperCase() + type.slice(1) + ' Flags</dt>' +
				'<dd><a href="#" class="filter" id="filter_'+type+'"><img src="/img/switch_'+(filters[type]?'off':'on')+'.png" width="63" height="32"></a></dd>';
	}

	if ($('#map_filter')) {
		$('#map_filter').remove();
	}
	$(	'<div id="map_filter">'+
			'<div class="grid">'+
				'<p class="title">Filter</p>'+
				'<div id="score_sum">0 Points</div>'+
				'<div style="clear:both"></div>'+
				'<div class="column">'+
					'<dl>'+
						createFilterBtn('own')+
						createFilterBtn('captured')+
						createFilterBtn('physical')+
						createFilterBtn('virtual')+
						createFilterBtn('special')+
					'</dl>'+
				'</div>'+
				'<div class="column">'+
					'<dl>'+
						createFilterBtn('green')+
						createFilterBtn('system')+
						createFilterBtn('white')+
						createFilterBtn('oracle')+
						createFilterBtn('premium')+
					'</dl>'+
				'</div>'+
				'<div class="column">'+
					'<dl>'+
						createFilterBtn('treasure')+
						createFilterBtn('personal')+
						createFilterBtn('company')+
						createFilterBtn('team')+
						createFilterBtn('party')+
					'</dl>'+
				'</div>'+
			'</div>'+
		'</div>'
	).appendTo($('.container.white'));

	$(document).off('click', '.filter').on('click', '.filter', function () {
		var type = $(this).attr('id').replace(/^filter_/, ''), i;
		filters[type] = !filters[type];
		if (groups[type]) {
			for (i = 0; i < groups[type].length; i++) {
				filters[groups[type][i]] = filters[type];
				$('#filter_' + groups[type][i]).children('img').attr('src', filters[type] ? '/img/switch_off.png' : '/img/switch_on.png');
			}
		}else{
			var el;
			$.each(groups,function(group,flags){
				if (filters[group] && !filters[type] && flags.indexOf(type) !== -1 && (el = $('#filter_'+group))) {
					filters[group] = false;
					el.children('img').attr('src', '/img/switch_on.png');
				}
			});
		}
		$(this).children('img').attr('src', filters[type] ? '/img/switch_off.png' : '/img/switch_on.png');
		refresh();

		return false;
	});

	$('#map-container').on('click', function () {
		if ($('.gm-style-iw .annotationInfoWindow').size()>0) {
			history.pushState(null, '', createLink($('.gm-style-iw .annotationInfoWindow')[0].getAttribute('data-id')));
		}
	});

	GM_addStyle(
		".gm_btn {margin: 10px;z-index: 0;position: absolute;cursor: pointer;right: 0px;top: 60px;}" +
		".gm_btn > div {font-weight:bold;direction: ltr; overflow: hidden; text-align: center; position: relative; color: rgb(0, 0, 0); font-family: Roboto, Arial, sans-serif; -webkit-user-select: none; font-size: 11px; padding: 8px; -webkit-background-clip: padding-box; box-shadow: rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px; border-left-width: 0px; min-width: 39px; font-weight: 500; background-color: rgb(255, 255, 255); background-clip: padding-box;}" +
		".gm_btn > div:hover {color:black;background-color: rgb(235, 235, 235);}" +
		"#score_sum {float:right;margin:0 55px 12px 0;font-size:x-large;line-height:22px}" +
		"#score_sum span {font-size:smaller}"
	);

	scoreElem = $('#score_sum');
	$('footer').remove();
	//unsafeWindow.setMapFilter = setFilter;

	jQuery(document).ready(function ($) {
		setTimeout(function () {
			$('<div id="createGPX" class="gm-style-mtc gm_btn"><div>GPX</div></div>')
					.on('click', createGPX).appendTo($('.gm-style'));
		}, 500);
	});
})();
