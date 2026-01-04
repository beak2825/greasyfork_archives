var modules = modules || {};

modules.updateApps = {

	name: 'Map app updater',

	description: 'Keeps map apps up-to-date automatically.',

	icon: '/gfx/icons/item_map.gif',

	pages: 'outside',

	externalApps: {
		'cartographer': {
			name: 'Cartographer',
			directoryId: 19,
			logo: '/file/35.dat',
			success: function(response) {
				return (response.status == 200);
			},
			update: function(externalAppName, extendedData) {

				var externalApp;
				var key;
				var url;
				var data;

				externalApp = modules.updateApps.externalApps[externalAppName];

				if (extendedData.hardcore) {
					externalApp.updating = false;
					externalApp.temporariyDisabled = true;
					externalApp.temporariyDisabledMessage = 'Hardcore not supported';
					modules.updateApps.updateTooltip();
					return;
				}

				url = 'http://wastelandcartographer.com/plugin';

				externalApp = modules.updateApps.externalApps[externalAppName];

				key = modules.updateApps.retrieveAppKey(externalAppName);

				if (!key) {
					externalApp.updating = false;
					externalApp.error = true;
					externalApp.errorMessage = 'Error retrieving key';
					modules.updateApps.updateTooltip();
					return;
				}

				data = 'key=' + key;
				modules.updateApps.sendUpdate(url, data, externalAppName);

			}
		},
		'dusk-till-dawn': {
			name: 'From Dusk Till Dawn',
			directoryId: 14,
			logo: '/file/25.dat',
			success: function(response) {
				return (response.status == 200);
			},
			update: function(externalAppName, extendedData) {

				var items;
				var item;
				var itemKey;
				var i;
				var externalApp;
				var key;
				var data;
				var url;

				url = 'http://d2n.duskdawn.net/zone/extended';

				externalApp = modules.updateApps.externalApps[externalAppName];

				key = modules.updateApps.retrieveAppKey(externalAppName);

				if (!key) {
					externalApp.updating = false;
					externalApp.error = true;
					externalApp.errorMessage = 'Error retrieving key';
					modules.updateApps.updateTooltip();
					return;
				}

				data = 'key=' + key;

				data += '&zombies=' + extendedData.zombies;
				data += '&zone_depleted=' + (extendedData.depleted ? 'true' : 'false');
				data += '&camping_topology=' + extendedData.topology;

				if (extendedData.building) {
					data += '&blueprint_available=' + (extendedData.blueprint ? 'true' : 'false');
				}

				if (extendedData.items.length > 0) {

					items = {};

					for (i = 0; i < extendedData.items.length; i++) {
						item = extendedData.items[i];
						itemKey = item.id + (item.broken ? 'B' : '');
						if (items[itemKey]) {
							items[itemKey]++;
						} else {
							items[itemKey] = 1;
						}
					}

					for (itemKey in items) {
						data += '&items=' + itemKey + '-' + items[itemKey];
					}
				}

				modules.updateApps.sendUpdate(url, data, externalAppName);

			}
		},
		'mapviewer': {
			name: 'Map Viewer',
			directoryId: 1,
			logo: '/file/37.dat',
			success: function(response) {
				return (response.status == 200 && response.responseText.match(/Zone .* was updated successfully/));
			},
			update: function(externalAppName, extendedData) {

				var items;
				var item;
				var itemKey;
				var i;
				var externalApp;
				var key;
				var data;
				var url;
				var unique;

				url = 'http://die2nite.gamerz.org.uk/plugin/extended';

				externalApp = modules.updateApps.externalApps[externalAppName];

				key = modules.updateApps.retrieveAppKey(externalAppName);

				if (!key) {
					externalApp.updating = false;
					externalApp.error = true;
					externalApp.errorMessage = 'Error retrieving key';
					modules.updateApps.updateTooltip();
					return;
				}

				data = 'key=' + key;

				if (extendedData.building) {
					data += '&blueprint=' + (extendedData.blueprint ? 1 : 0);
				}

				if (extendedData.hardcore) {

					data += '&zombies=' + extendedData.zombies;
					data += '&depleted=' + (extendedData.depleted ? 1 : 0);

					if (extendedData.items.length > 0) {

						unique = 0;
						items = {};

						for (i = 0; i < extendedData.items.length; i++) {
							item = extendedData.items[i];
							itemKey = item.id + (item.broken ? 'B' : '');
							if (items[itemKey]) {
								items[itemKey]++;
							} else {
								items[itemKey] = 1;
								unique++;
							}
						}

						data += '&items=';

						i = 1;
						for (itemKey in items) {
							data += itemKey + '-' + items[itemKey];
							if (i < unique) {
								data += ',';
							}
							i++;
						}
					}

				}

				modules.updateApps.sendUpdate(url, data, externalAppName);

			}
		}
	},

	campingTopologies: {
		'L1_SUICIDE': 'Sleeping somewhere like this is basically a form of suicide',
		'L2_SHORTAGE': 'There\'s a distinct shortage of shelter here.',
		'L3_MINIMAL': 'This zone offers nothing more than minimal "natural" protection.',
		'L4_HIDING_PLACE': 'After a quick look around, it looks like you could find a good hiding place here.',
		'L5_FEW_HIDEOUTS': 'For those looking to spend the night, there are a few hideouts in this zone',
		'L6_TOP_HIDEOUTS': 'If required, there are some top-notch hideouts here...',
		'L7_IDEAL': 'This seems like the ideal place to spend the night'
	},

	config: function() {

		log('modules.updateApps.config()');

		var content;
		var externalAppName;
		var externalApp;
		var delay;
		var delayText;

		content = '<p>This module adds a small light above your rucksack. The colour of the light will change while it does its thing:' +
		'<ul>' +
		'<li><div class="modules-updateApps-config-light"></div> All apps are updated <img src="/gfx/forum/smiley/h_lol.gif"></li>' +
		'<li><div class="modules-updateApps-config-light waiting"></div> Waiting for the delay to pass (see below) <img src="/gfx/forum/smiley/h_sleep.gif"></li>' +
		'<li><div class="modules-updateApps-config-light updating"></div> One or more apps are updating <img src="/gfx/forum/smiley/h_sleep.gif"><img src="/gfx/forum/smiley/h_sleep.gif"></li>' +
		'<li><div class="modules-updateApps-config-light errors"></div> Something broke <img src="/gfx/forum/smiley/h_death.gif"></li>' +
		'</ul></p>' +
		'<p>Hover over the light to see the status of each app, or click it to trigger an update.</p>';

		content += '<h2>External Apps</h2>';

		for (externalAppName in this.externalApps) {
			externalApp = this.externalApps[externalAppName];
			content += '<p><img src="' + externalApp.logo + '" height="16" width="16"> ' + app.settings.checkbox('modules.updateApps.externalApps.' + externalAppName + '.enabled', externalApp.name, 'true') + '</p>';
		}

		delay = localStorage.getItem('modules.updateApps.config.delay');
		if (undefined == delay) {
			delay = 2;
		}
		delayText = delay == 0 ? 'No delay' : delay + ' seconds';

		content += '<h2>Delay</h2>';
		content += '<p>This will help prevent apps getting spammed when you pick up or drop a lot of items.</p>';
		content += '<div id="modules-updateApps-config-delay-slider"></div>';
		content += '<span id="modules-updateApps-config-delay">' + delayText + '</span>';

		return content;
	},

	configInit: function() {

		var delay;

		delay = localStorage.getItem('modules.updateApps.config.delay');

		if (undefined == delay) {
			delay = 2;
		}

		$('#modules-updateApps-config-delay-slider').slider({
			value: delay,
			min: 0,
			max: 10,
			slide: function( event, ui ) {
				var delay = ui.value;
				localStorage.setItem('modules.updateApps.config.delay', delay);
				var delayText = delay == 0 ? 'No delay' : delay + ' seconds';
				$('#modules-updateApps-config-delay').html(delayText);
			}
		});
	},

	init: function() {

		log('modules.updateApps.init()');

		// see if the user has set a delay
		var delay = localStorage.getItem('modules.updateApps.config.delay');
		delay = (undefined == delay) ? 2000 : delay * 1000;

		if (delay == 0) {
			// no delay, so update immediately
			this.updateApps();
		} else {
			// (re)set the expiry time
			var time = new Date();
			this.delayUntil = time.getTime() + delay;

			// and delay the update
			window.setTimeout(this.updateApps, delay);

			this.updateTooltip();
		}
		
		modules.updateApps.heartbeat = modules.updateApps.heartbeat || window.setInterval(function() {
			if ($('#modules-updateApps-init').length == 0) {
				window.setTimeout(function() {
					if ($('#modules-updateApps-init').length == 0) {
						modules.updateApps.updateApps();
					}
				}, 1000);
			}
		}, 1000);

	},

	updateApps: function() {

		log('modules.updateApps.updateApps()');

		var time;
		var externalAppName;
		var externalApp;
		var extendedData;

		// see if the user has set a delay
		if (localStorage.getItem('modules.updateApps.config.delay') == 0) {

			// they have, so has their delay expired?
			time = new Date();
			if (time.getTime() < modules.updateApps.delayUntil) {
				// no. they must have triggered another update since this was called
				return false;
			}
		}

		extendedData = modules.updateApps.getExtendedData();
		if (!extendedData) {
			return false;
		}

		$('#modules-updateApps-init').addClass('updating');

		for (externalAppName in modules.updateApps.externalApps) {

			externalApp = modules.updateApps.externalApps[externalAppName];

			if (localStorage.getItem("modules.updateApps.externalApps." + externalAppName + ".enabled") !== 'false') {

				externalApp.updating = true;
				externalApp.error = false;
				externalApp.errorMessage = false;
				externalApp.temporariyDisabled = false;
				externalApp.update(externalAppName, extendedData);
			}
		}

		modules.updateApps.updateTooltip();

		return true;

	},

	updateTooltip: function() {

		log('modules.updateApps.updateTooltip()');

		var updatingCount;
		var errors;
		var tooltipContent;
		var delay;
		var time;
		var waiting;
		var externalApp;
		var externalAppName;
		var tooltipTitle;
		var div;
		var tooltip ;

		updatingCount = 0;
		errors = false;

		delay = localStorage.getItem('modules.updateApps.config.delay');
		if (undefined == delay) {
			delay = 2000;
		} else {
			delay = delay * 1000;
		}

		time = new Date();

		waiting = false;
		if (delay !== 0 && this.delayUntil !== undefined && time.getTime() < this.delayUntil) {
			waiting = true;
		}

		tooltipContent = '<ul class="modules-updateApps-tooltip">';

		for (externalAppName in this.externalApps) {

			externalApp = this.externalApps[externalAppName];

			if (localStorage.getItem("modules.updateApps.externalApps." + externalAppName + ".enabled") == 'false') {
				tooltipContent += '<li class="disabled" data-app="' + externalAppName + '"><img width="16" height="16" src="' + externalApp.logo + '" /> ' + externalApp.name + ': <span>Disabled</span></li>';
			} else if (externalApp.temporariyDisabled) {
				tooltipContent += '<li data-app="' + externalAppName + '"><img width="16" height="16" src="' + externalApp.logo + '" /> ' + externalApp.name + ': <span>' + externalApp.temporariyDisabledMessage + '</span></li>';
			} else if (waiting) {
				tooltipContent += '<li class="waiting" data-app="' + externalAppName + '"><img width="16" height="16" src="' + externalApp.logo + '" /> ' + externalApp.name + ': <span>Waiting...</span></li>';
			} else if (externalApp.error) {
				errors = true;
				tooltipContent += '<li class="broken" data-app="' + externalAppName + '"><img width="16" height="16" src="' + externalApp.logo + '" /> ' + externalApp.name + ': <span>' + externalApp.errorMessage + '</span></li>';
			} else if (externalApp.updating) {
				updatingCount++;
				tooltipContent += '<li class="updating" data-app="' + externalAppName + '"><img width="16" height="16" src="' + externalApp.logo + '" /> ' + externalApp.name + ': <span>Updating...</span></li>';
			} else {
				tooltipContent += '<li class="updated" data-app="' + externalAppName + '"><img width="16" height="16" src="' + externalApp.logo + '" /> ' + externalApp.name + ': <span>Updated!</span></li>';
			}
		}

		tooltipContent += '</ul>';

		tooltipTitle = 'Map app updater <img src="http://data.die2nite.com/gfx/icons/small_archive.gif">';

		div = $('#modules-updateApps-init');

		if (!div.length) {

			div = $('<div id="modules-updateApps-init" class="updating" />');
			div.attr('onmouseout', 'js.HordeTip.hide();');
			$('#generic_section .right h2:first').append(div);

			$('#modules-updateApps-init').on('click', modules.updateApps.updateApps);

		}

		div.attr('onmouseover', 'js.HordeTip.showTip(this, \'' + tooltipTitle + '\', \'' + tooltipContent + '\')');

		tooltip = $('#tooltipContent');

		if ($('.title',tooltip).html() == tooltipTitle) {
			tooltip.html('<div class="title">' + tooltipTitle + '</div>' + tooltipContent);
		}

		if (waiting) {
			div.addClass('waiting');
		} else {
			div.removeClass('waiting');
		}

		if (errors) {
			div.addClass('errors');
		} else {
			div.removeClass('errors');
		}

		if (updatingCount > 0) {
			div.addClass('updating');
		} else {
			div.removeClass('updating');
		}

	},

	sendUpdate: function(url, data, externalAppName) {

		(function(url, data, externalAppName) {
			
			log(url + ': ' + data);
			
			GM_xmlhttpRequest({
				method: "POST",
				url: url,
				data: data,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
				onload: function(response) {

					var externalApp;
					
					log(externalAppName + ' replied with:');
					log(response);
					
					externalApp = modules.updateApps.externalApps[externalAppName];
					
					externalApp.updating = false;
					if (!externalApp.success(response)) {
						externalApp.error = true;
						externalApp.errorMessage = 'Invalid response';
					}
					modules.updateApps.updateTooltip();
				}
			});
		})(url, data, externalAppName);
	},

	retrieveAppKey: function(appName) {

		log('modules.updateApps.retrieveAppKey(' + appName + ')');

		var url;
		var key;
		var result;
		var sk;

		key = localStorage.getItem('modules.updateApps.externalApps.' + appName + '.key');
		if (undefined != key) {
			return key;
		}

		result = window.location.hash.match(/sk\=([0-9a-f]{5})/);
		sk = result ? result[1] : '';

		url = '/disclaimer?id=' + modules.updateApps.externalApps[appName].directoryId + ';sk=' + sk + ';rand=' + (Math.floor(Math.random()*999998) + 1);

		$.ajax({
			async: false,
			url: url,
			success: function(data) {

				var search;

				search = data.match(/name="key" value="([0-9a-f]+)"/);

				if (null != search) {
					key = search[1];
					localStorage.setItem('modules.updateApps.externalApps.' + appName + '.key', key);
				} else {
					log('key for ' + appName + ' not found');
					key = false;
				}

			},
			error: function() {
				log('ajax error while retrieving key for ' + appName);
				key = false;
			}
		});

		return key;

	},

	getItemNamesToIds: function() {

		var itemNamesToIdsUpdateTime;
		var itemNamesToIds;
		var time;
		var expiry;
		var url;

		itemNamesToIdsUpdateTime = localStorage.getItem('modules.updateApps.itemNamesToIdsUpdateTime');
		itemNamesToIds = localStorage.getItem('modules.updateApps.itemNamesToIds');

		time = new Date().getTime();
		expiry = 60 * 60 * 24 * 7 * 1000; // a week

		if (undefined == itemNamesToIds || undefined == itemNamesToIdsUpdateTime || time > (itemNamesToIdsUpdateTime + expiry) ) {
			// If Map Viewer goes down, this URL will need to be replaced. It returns
			// a JSON object containing all the items' names and IDs:
			//
			// {
			// "'Wake The Dead'":"97",
			// "A letter with no address":"189",
			// "Adjustable Spanner":"13",
			// ...
			// }

			url = 'https://raw.githubusercontent.com/Miudod2n/die2nitestuff/master/item-names-to-ids.json';

			GM_xmlhttpRequest({
				url: url,
				beforeSend: function(x) {
				    if(x && x.overrideMimeType) {
				        x.overrideMimeType("application/j-son;charset=UTF-8");
				        }
				        },
				        
				onload: function(response) {
					localStorage.setItem('modules.updateApps.itemNamesToIds', response.responseText);
					localStorage.setItem('modules.updateApps.itemNamesToIdsUpdateTime', new Date().getTime());
					modules.updateApps.updateApps();
				}
			});

			return false;
		} else {
			return eval('(' + itemNamesToIds + ')');
		}

	},

	getExtendedData: function() {

		var itemNamesToIds;
		var extendedData;
		var topologyEl;
		var topologyKey;
		var re;

		topologyEl = $('#campInfos p:nth-child(2)');

		if (topologyEl.length == 0) {
			return false;
		}

		itemNamesToIds = modules.updateApps.getItemNamesToIds();

		if (!itemNamesToIds) {
			return false;
		}

		extendedData = {
			hardcore: ($('.day .hard').length == 1),
			building: ($('.outSpot').length > 0),
			blueprint: ($('#campInfos').text().match(/(You will earn)|(You can obtain)/)),
			zombies: $('#zombiePts').text().replace(/[^0-9]/g, ''),
			depleted: ($('.driedZone').length > 0),
			items: []
		};

		for (topologyKey in modules.updateApps.campingTopologies) {
			re = new RegExp(modules.updateApps.campingTopologies[topologyKey]);
			if (topologyEl.html().match(re)) {
				extendedData.topology = topologyKey;
				break;
			}
		}

		$('.outInv li span, .outInv li span a').each(function() {

			var match;
			var name;
			var broken;
			var id;
			var item;

			if (!$(this).attr('onmouseover')) {
				return true;
			}

			match = $(this).attr('onmouseover').match(/'([^<]*)/);
			if (null == match) {
				return true;
			}

			name = match[1].trim().replace(/\\'/g, "'");			
			broken = $(this).hasClass('limited') || $(this).parent().hasClass('limited');
			id = itemNamesToIds[name];

			if (id) {
				item = {
					name: name,
					id: parseInt(itemNamesToIds[name]),
					broken: broken
				};
				extendedData.items.push(item);
			} else {
			// item not found, need to do something here.....
			}

			return true;
		});
		
		log('Extended data:');
		log(extendedData);
		
		return extendedData;
	}

};
