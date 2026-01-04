// ==UserScript==
// @name        WE Tools 2
// @namespace   DOBSS2
// @version     1.4.9
// @description village nevermind
// @author      DOBss
// @include		  /http[s]{0,1}://[a-z]{2}[0-9]{1,2}\.grepolis\.com/game*/
// @exclude     view-source://*
// @icon        https://dobss.gitlab.io/we-tools/WEToolsV2.png
// @iconURL     https://dobss.gitlab.io/we-tools/WEToolsV2.png
// @copyright	2016+
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @grant		GM_getResourceURL
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/30523/WE%20Tools%202.user.js
// @updateURL https://update.greasyfork.org/scripts/30523/WE%20Tools%202.meta.js
// ==/UserScript==

// #farm_town_2019_claim
var uw = unsafeWindow || window,
		$  = uw.jQuery || jQuery,
		GM = (typeof GM_info === 'object'),
		DOBSS_TIMERS = {next_exec: {}},
		DOBSS_TOWN_INFO = {},
		DOBSS_ISLAND_INFO = {},
		DOBSS_TRADE_ORD_IDS = [],
		DOBSS_TRADE_RESPONSE,
		DOBSS_SETTINGS = {},
		DOBSS_ALLIANCE_PACTS = {
			list: {},
			relations: {
					peace: [],
					neutral: [],
					war: []
			},
			getRelation: function(a){
				if(a == MM.getModelByNameAndPlayerId('Player').attributes.alliance_name)
					return 'alliance';

				for(var id in this.list){
					if(this.list[id].alliance_name == a || this.list[id].alliance_id == a)
						return this.list[id].relation;
				}
			},
			getId: function(a){
				if(a == MM.getModelByNameAndPlayerId('Player').attributes.alliance_name)
					return MM.getModelByNameAndPlayerId('Player').attributes.alliance_id;

				for(var id in this.list){
					if(this.list[id].alliance_name == a || this.list[id].alliance_id == a)
						return this.list[id].id;
				}
			}
		},
		DOBSS_WIN,
		i, x;

(function() {
	'use strict';

	function saveValue(name, val){
		if(GM)
			GM_setValue(Game.world_id+name, val);
		else
			localStorage.setItem(Game.world_id+name, val);
	}

	function deleteValue(name){
		if(GM)
			GM_deleteValue(Game.world_id+name);
		else
			localStorage.removeItem(Game.world_id+name);
	}

	function loadValue(name, default_val){
		var value;
		if(GM)
			value = GM_getValue(Game.world_id+name, default_val);
		else
			value = localStorage.getItem(Game.world_id+name) || default_val;

		if(typeof value === "string"){
			try{
			   value = JSON.parse(value);
			}catch(e){}
		}

		return value;
	}

	function dobss_magic(DOBSS_ISLAND){
		if(DOBSS_SETTINGS.captain && uw.Game.premium_features.captain >= uw.Timestamp.now()){
			dobss_captain_magic();
			return;
		}

		var cur_town   = uw.ITowns.getTown(uw.Game.townId),
			DOBSS_TOWN = dobss_island_active_town(DOBSS_ISLAND);

		console.log(DOBSS_TOWN, uw.Game.townId, DOBSS_ISLAND);
		if(DOBSS_TOWN && uw.Game.townId != DOBSS_TOWN){
			uw.old_town = uw.Game.townId;
			HelperTown.townSwitch(DOBSS_TOWN);
			$('#ui_box .btn_jump_to_town').trigger('click');
			$('.nui_main_menu .circle_button.dobss_villages').removeClass('storage active').addClass('suspend');
			setTimeout(dobss_magic, 1000, DOBSS_ISLAND);
			return;
		}else
			$('#ui_box .btn_jump_to_town').trigger('click');

		if(!$('#notification_area .botcheck').length){
			if(dobss_is_storage_full(cur_town)){
				$('.nui_main_menu .circle_button.dobss_villages').removeClass('active suspend').addClass('storage').tooltip("WE-Tools: "+(DM.getl10n('dobss', "tooltips").auto_farm || "Auto-claim farms' resources"));
				$('.nui_main_menu .circle_button.dobss_stop_farm').addClass('disabled');
				if($('#town_groups_list').length)
					$('.town_groups_list .town_group .item.selected').removeClass('active').addClass('storage');

				var coords = cur_town.getIslandCoordinateX()+'|'+cur_town.getIslandCoordinateY();

				clearTimeout(DOBSS_TIMERS[coords][uw.Game.townId]);
				DOBSS_TIMERS[coords][uw.Game.townId] = 0;
				delete DOBSS_TIMERS.next_exec[uw.Game.townId];

				if(uw.old_town){
					HelperTown.townSwitch(uw.old_town);
					$('#ui_box .btn_jump_to_town').trigger('click');
					uw.old_town = 0;
				}

				return;
			}

			DOBSS_WIN = $('.window_curtain .classic_window.farm_town');
			$('.nui_main_menu .circle_button.dobss_villages').removeClass('storage suspend').addClass('active').tooltip("WE-Tools: "+(DM.getl10n('dobss', "tooltips").auto_farm_active || "Auto-claim farms' resources (active)"));
			$('.nui_main_menu .circle_button.dobss_stop_farm').removeClass('disabled').tooltip("WE-Tools: "+(DM.getl10n('dobss', "tooltips").stop_auto_farm || "Stop auto-claim"));
			if($('#town_groups_list').length)
				$('.town_groups_list .town_group .item.selected').removeClass('storage').addClass('active');

			if(!DOBSS_WIN.length){
				var farms  = $('.tile.farm_town.owned[data-same_island="true"]'), positions = [];

				if(farms.length){
					farms.each(function(i){
						positions.push($(this).offset().left);
					});

					FarmTownWindowFactory.openWindow(parseInt(farms.eq(positions.indexOf(Math.min.apply(null, positions))).attr('data-id')));
					uw.farm_win_closed = true;
					setTimeout(dobss_magic, 500, DOBSS_ISLAND);
				}else if(!uw.farm_reposition){
					$(".btn_jump_to_coordination").trigger('btn:click');
					uw.farm_reposition = true;
					setTimeout(dobss_magic, 500, DOBSS_ISLAND);
				}else
					uw.farm_reposition = false;
			}else{
				DOBSS_WIN	 = DOBSS_WIN.eq(0);
				var minimized = $('#minimized_windows_area .box[cid="'+DOBSS_WIN.attr('id').substr(7)+'"]');

				if(minimized.length){
					minimized.find('.maximize').trigger('click');
					uw.farm_was_minimized = true;
				}

				i = 0;
				x = 0;
				dobss_harvest();
			}
		}
	}

	function dobss_gotoNext(){
		if(!DOBSS_WIN.find('.actions_locked_banner').is('.cooldown') || DOBSS_WIN.find('.actions_locked_banner').is('.hidden'))
			setTimeout(dobss_gotoNext, 200);
		else{
			DOBSS_WIN.find(".village_info .btn_next").trigger('click');
			x = 0;
			dobss_harvest();
		}
	}

	function dobss_harvest(){
		if(x<10){
			var town	 = uw.ITowns.getTown(uw.Game.townId),
				coords   = town.getIslandCoordinateX()+'|'+town.getIslandCoordinateY(),
				timeLeft = DOBSS_WIN.find('.actions_locked_banner .pb_bpv_unlock_time').text().split(':'),
				farms	= uw.GPWindowMgr._collections.farm_towns.getAllForIslandViaXY(town.getIslandCoordinateX(),town.getIslandCoordinateY());

			if(i>=Object.keys(farms).length){
				timeLeft = (parseInt(timeLeft[0])*3600 + parseInt(timeLeft[1])*60 + parseInt(timeLeft[2])+3)*1000+Math.ceil(Math.random()*4000);

				if(typeof DOBSS_TIMERS[coords] == 'undefined')
					DOBSS_TIMERS[coords] = {};
				if(typeof DOBSS_TIMERS[coords][uw.Game.townId] == 'undefined')
					DOBSS_TIMERS[coords][uw.Game.townId] = 0;

				clearTimeout(DOBSS_TIMERS[coords][uw.Game.townId]);
				DOBSS_TIMERS.next_exec[uw.Game.townId] = (new Date()).getTime()+timeLeft;
				DOBSS_TIMERS[coords][uw.Game.townId]	= setTimeout(dobss_magic, timeLeft, coords);

				if(uw.farm_was_minimized){
					DOBSS_WIN.find('.minimize').trigger('click');
					uw.farm_was_minimized = false;
				}else if(uw.farm_win_closed){
					DOBSS_WIN.find('.close').trigger('click');
					uw.farm_win_closed = false;
				}

				if(uw.old_town){
					HelperTown.townSwitch(uw.old_town);
					// $(".btn_jump_to_coordination").trigger('btn:click');
					$('#ui_box .btn_jump_to_town').trigger('click');
					uw.old_town = 0;
				}

				return;
			}else if(DOBSS_WIN.find('.actions_locked_banner').is('.cooldown') && !DOBSS_WIN.find('.actions_locked_banner').is('.hidden')){
				x++;
				setTimeout(dobss_harvest, 200);
				return;
			}else
				DOBSS_WIN.find(".action_wrapper .card_click_area").eq(DOBSS_SETTINGS.harvest_nth).trigger('click');
		}

		i++;
		dobss_gotoNext();
	}

	function dobss_captain_magic(){
		uw.captain_harvest_towns	= $.extend({}, DOBSS_SETTINGS.harvest_towns);
		uw.captain_magic			= Object.keys(uw.captain_harvest_towns).length > 0;
		uw.captain_magic_first	  = true;
		// uw.wtf = false;
		GPWindowMgr.Create(GPWindowMgr.TYPE_FARM_TOWN_OVERVIEWS, _('Farming villages'), {});
	}

	function dobss_captain_harvester(){
		var coord   = Object.keys(uw.captain_harvest_towns)[0],
			coords  = coord.split('|'),
			town_el = uw.captain_harvest_towns[coord] ? $('#fto_town_list .fto_town[data-town_id="'+uw.captain_harvest_towns[coord]+'"]') : $('#fto_town_list .fto_town[data-island_x="'+coords[0]+'"][data-island_y="'+coords[1]+'"]');

		town_el.trigger('click');

		if(uw.captain_magic_first){
			// uw.captain_magic_first = false;
			setTimeout(function(){ uw.captain_magic_first = false; dobss_captain_harvester(); }, 1500);
			return;
		}/* else
			uw.wtf = true; */

		// setTimeout(dobss_captain_harvest, 1000, town_el);
	}

	function dobss_captain_harvest(town_el){
		if(!town_el.is('.active')){
			town_el.trigger('click');
			setTimeout(dobss_captain_harvest, 1000, town_el);
			return;
		}

		if($('#fto_claim_button').is('.disabled'))
			dobss_captain_next();
		else{
			var town_id = town_el.attr('data-town_id');

			if(dobss_is_storage_full(uw.ITowns.getTown(town_id))){
				if(DOBSS_SETTINGS.autofarm_full_switch !== 0){
					var alternative = dobss_get_alternative_town(town_id);

					if(alternative){
						uw.captain_harvest_towns[Object.keys(uw.captain_harvest_towns)[0]] = alternative;
						setTimeout(dobss_captain_harvester, 1000+Math.ceil(Math.random()*1500));
						return;
					}
				}

				dobss_captain_next();
				return;
			}
			// uw.captain_magic_active = town_el.attr('data-town_id');
			$('#farm_town_options .fto_time_checkbox').eq(DOBSS_SETTINGS.harvest_nth).trigger('click');
			$('#fto_claim_button').trigger('click');
		}
	}

	function dobss_captain_next(){
		if(Object.keys(uw.captain_harvest_towns).length > 1){
			delete uw.captain_harvest_towns[Object.keys(uw.captain_harvest_towns)[0]];
			setTimeout(dobss_captain_harvester, 1000+Math.ceil(Math.random()*1500));
		}else{
			uw.captain_magic		 = false;
			uw.captain_magic_first   = true;
			uw.captain_harvest_towns = {};
			DOBSS_TIMERS.captain	 = setTimeout(dobss_captain_magic, (new Date()).getTime()-DOBSS_TIMERS.next_exec.captain);
			setTimeout(function(){ $('#farm_town_list').parents('.ui-dialog').find('.ui-dialog-titlebar-close').trigger('click'); }, 1000);
		}
	}

	function dobss_calculate_limit(cur_town){
		var production = cur_town.getProduction();

		return Math.floor(((production.wood + production.stone + production.iron) / 3) * 2);
	}

	function dobss_is_storage_full(cur_town){
		var cur_resources	= cur_town.resources(),
			cur_limit		= dobss_calculate_limit(cur_town);

		return	cur_resources.storage - cur_resources.wood < cur_limit ||
				cur_resources.storage - cur_resources.stone < cur_limit ||
				cur_resources.storage - cur_resources.iron < cur_limit;
	}

	function dobss_get_free_storage(cur_town){
		var cur_resources	= cur_town.resources(),
			cur_limit		= dobss_calculate_limit(cur_town),
			storage			= cur_resources.storage - Math.max.apply(null, [cur_resources.wood, cur_resources.stone, cur_resources.iron]);

		return storage < cur_limit ? 0 : storage;
	}

	function dobss_get_alternative_town(town_id){
		var townsData = dobss_get_towns_islands(),
			island, resources;

		loop: for(island in townsData){
			for(var x=0, len=townsData[island].length; x<len; x++){
				if(townsData[island][x].value == town_id)
					break loop;
			}
		}

		if(townsData[island].length>1){
			townsData = townsData[island];
			resources = townsData.slice();
			for(var y=0, reslen=resources.length; y<reslen; y++)
				resources[y] = dobss_get_free_storage(uw.ITowns.getTown(resources[y].value));

			var max = Math.max.apply(null, resources);
			if(max > 0){
				var index = resources.indexOf(DOBSS_SETTINGS.autofarm_full_switch == 2 ? Math.min.apply(null, resources.filter(function(x){ return x> 0; })) : max);

				return townsData[index].value;
			}
		}

		return 0;
	}

	function dobss_distribute_resources(){
		uw.resource_distribution = true;
		GPWindowMgr.Create(GPWindowMgr.TYPE_TOWN, uw.ITowns.getTown(DOBSS_TRADE_ORD_IDS[0]).name, {action: 'trading'}, {id: DOBSS_TRADE_ORD_IDS[0]});
		// setTimeout(function(){ dobss_trade_resources(); }, 1000);
		// $("#trade_tab .curr2").each(function(){ console.log(parseInt($(this).text().substr(2))); })
	}

	function dobss_trade_resources(){
		console.log(DOBSS_TRADE_RESPONSE);
		var town	  = uw.ITowns.getTown(DOBSS_TRADE_ORD_IDS[0]),
			resources = town.resources(),
			space	 = [resources.wood, resources.stone, resources.iron],
			capacity  = (resources.storage - Math.max.apply(null, space) - dobss_calculate_limit(town))*3,
			amount	= capacity > DOBSS_TRADE_RESPONSE.json.data.max_capacity ? DOBSS_TRADE_RESPONSE.json.data.max_capacity : capacity,
			div	   = Math.floor(amount / 3),
			remainder = amount % 3;
		// console.log(town, resources, space, capacity, amount, div, remainder);

		$("#trade_tab .resource_selector input").val(div);
		if(remainder--)
			$("#trade_tab #trade_type_wood input").val(function(i,val){ return ++val; });
		if(remainder--)
			$("#trade_tab #trade_type_stone input").val(function(i,val){ return ++val; });

		$("#trade_tab .resource_selector input").trigger('blur');
		$("#trade_tab .btn_trade_button").trigger('click');
		$('.nui_main_menu .circle_button.dobss_villages').trigger('click');
	}

	function dobss_island_active_town(coords){
		var timers = $.extend({}, DOBSS_TIMERS[coords]);

		timers = Object.keys(timers).reduce(function(a,b){ return timers[a] > timers[b] ? a : b; });

		if(dobss_is_storage_full(uw.ITowns.getTown(timers))){
			if(DOBSS_SETTINGS.autofarm_full_switch !== 0){
				var alternative = dobss_get_alternative_town(timers);

				if(alternative)
					return alternative;
			}
		}

		return DOBSS_TIMERS[coords][timers] ? timers : false;
	}

	function dobss_town_switch(){
		var cur_town = uw.ITowns.getTown(uw.Game.townId);

		$('.nui_main_menu .circle_button').removeClass('disabled active storage');

		if(DOBSS_SETTINGS.captain && uw.Game.premium_features.captain > uw.Timestamp.now()){
			var towns = [];

			for(var coord in DOBSS_SETTINGS.harvest_towns)
				towns.push(DOBSS_SETTINGS.harvest_towns[coord]);

			$('.nui_main_menu .circle_button.dobss_stop_farm').removeClass('disabled active');

			if(Object.keys(DOBSS_SETTINGS.harvest_towns).length === 0)
				$('.nui_main_menu .circle_button.dobss_stop_farm, .nui_main_menu .circle_button.dobss_villages').addClass('disabled');
			else{
				if(typeof DOBSS_TIMERS.next_exec.captain == 'undefined')
					$('.nui_main_menu .circle_button.dobss_stop_farm').addClass('disabled');
				else if($.inArray(uw.Game.townId, towns) >= 0)
					$('.nui_main_menu .circle_button.dobss_villages').addClass('active');
			}
		}else{
			var farms	= uw.GPWindowMgr._collections.farm_towns.getAllForIslandViaXY(cur_town.getIslandCoordinateX(), cur_town.getIslandCoordinateY()),
				coords	= cur_town.getIslandCoordinateX()+'|'+cur_town.getIslandCoordinateY();

			if(!Object.keys(farms).length){
				$('.nui_main_menu .circle_button.dobss_villages').removeClass('active storage').addClass('disabled');
				$('.nui_main_menu .circle_button.dobss_stop_farm').addClass('disabled');
			}else if(DOBSS_TIMERS[coords][uw.Game.townId]){
				$('.nui_main_menu .circle_button.dobss_villages').removeClass('disabled').addClass('active');
				$('.nui_main_menu .circle_button.dobss_stop_farm').removeClass('disabled');
			}else{
				$('.nui_main_menu .circle_button.dobss_villages').removeClass('disabled active');
				$('.nui_main_menu .circle_button.dobss_stop_farm').addClass('disabled');
			}
		}

		if(dobss_is_storage_full(cur_town))
			$('.nui_main_menu .circle_button.dobss_villages').addClass('storage');
		else
			$('.nui_main_menu .circle_button.dobss_villages').removeClass('storage');
	}

	function dobss_town_groups_list(){
		if($('#town_groups_list').length){
			$('.town_groups_list .town_group .item').each(function(){
				if(!$(this).attr('data-townid')) return true;

				var town		= uw.ITowns.getTown($(this).attr('data-townid')),
					coords		= town.getIslandCoordinateX()+'|'+town.getIslandCoordinateY(),
					resources	= town.resources(),
					res_types	= ['wood', 'stone', 'iron'],
					limit		= dobss_calculate_limit(town),
					farms		= uw.GPWindowMgr._collections.farm_towns.getAllForIslandViaXY(town.getIslandCoordinateX(), town.getIslandCoordinateY()),
					towns		= [],
					full		= '',
					res_all		= 0;

				for(var coord in DOBSS_SETTINGS.harvest_towns)
					towns.push(DOBSS_SETTINGS.harvest_towns[coord]);

				$(this).removeClass('active storage no_farms').find('span.storage_label').remove();
				if(!Object.keys(farms).length)
					$(this).addClass('no_farms');
				else if((typeof DOBSS_TIMERS.next_exec.captain != 'undefined' && $.inArray(parseInt($(this).attr('data-townid')), towns) >= 0) || DOBSS_TIMERS[coords][$(this).attr('data-townid')])
					$(this).addClass('active');

				$(this).attr('data-res-all', 0);

				for(var i=1; i<4; i++){
					if(resources.storage - resources[res_types[i-1]] < limit){
						$(this).attr('data-res-'+res_types[i-1], resources.storage);
						res_all += resources.storage;
						full += '|'+res_types[i-1].charAt(0).toUpperCase();
					}else{
						$(this).attr('data-res-'+res_types[i-1], resources[res_types[i-1]]);
						res_all += resources[res_types[i-1]];
					}
				}

				$(this).attr('data-res-all', res_all);

				if(full.length)
					$(this).addClass('storage').append('<span class="storage_label">['+(full.length==6 ? 'A' : full.substr(1))+']</span>');
			});

			$('.town_groups_list .town_group .group_name').filter(function(){ return !$(this).children('[data-groupid="0"]').length; })
				.append(
					'<div class="sort">'+
						'<div class="storage" data-type="all">A</div>'+
						'<div class="storage" data-type="wood">W</div>'+
						'<div class="storage" data-type="stone">S</div>'+
						'<div class="storage" data-type="iron">I</div>'+
						($('#dio_town_list').length ? '<div class="percent">%</div>' : '')+
						'<div class="default">&#8226;</div>'+
					'</div>'
				);

			$('.town_groups_list .town_group .group_name .sort div').on('click', function(){
				if($(this).is('.active'))
					$(this).toggleClass('reverse');

				$(this).addClass('active').siblings().removeClass('active reverse');

				var group_id	= $(this).parents('.town_group').attr('class').match(/town_group_([\-0-9]+)/)[1],
						active		= $(this),
						list			= $(this).parents('.town_group').find('.group_towns'),
						items			= list.find('.item').get();

				saveValue('WE_town_group_sort_'+group_id, active[0].className.split(/\s+/)[0]+(active.is('.storage') ? '[data-type="'+active.attr('data-type')+'"]' : ''));
				saveValue('WE_town_group_sort_'+group_id+'_reverse', $(this).is('.reverse'));

				items.sort(active.is('.storage') ? dobss_sort_storage : active.is('.percent') ? dobss_sort_percent : dobss_sort_alphabetical);

				$.each(items, function(i, item){
					list.append(item);
					items[i] = parseInt($(item).attr('data-townid'));
				});

				saveValue('WE_town_group_sort_'+group_id+'_list', items);
			});

			$('.town_groups_list .town_group').each(function(){
				var group_id	= $(this).attr('class').match(/town_group_([\-0-9]+)/)[1],
					active		= loadValue('WE_town_group_sort_'+group_id, 'default');

				if(loadValue('WE_town_group_sort_'+group_id+'_reverse', false))
					$('.group_name .sort div.'+active, this).addClass('active');

				$('.group_name .sort div.'+active, this).trigger('click');
			});
		}
	}

	function dobss_sort_alphabetical(a, b){
		var tA = uw.ITowns.getTown($(a).attr('data-townid')).getName().replace(/\s+/g, ''),
				tB = uw.ITowns.getTown($(b).attr('data-townid')).getName().replace(/\s+/g, '');

		return tA.localeCompare(tB, 'hu', {sensitivity: 'base'})*($(a).parents('.town_group').find('.group_name .sort div.active').is('.reverse') ? -1 : 1);
	}

	function dobss_sort_storage(a, b){
		var type	= $(a).parents('.town_group').find('.group_name .sort div.active').attr('data-type'),
			resA	= parseInt($(a).attr('data-res-'+type)),
			resB	= parseInt($(b).attr('data-res-'+type)),
			reverse	= $(a).parents('.town_group').find('.group_name .sort div.active').is('.reverse') ? -1 : 1;
		return (resA > resB ? -1 : resA < resB ? 1 : dobss_sort_alphabetical(a, b)*reverse)*reverse;
	}

	function dobss_sort_percent(a, b){
		var pA		= parseInt($(a).find('.pop_percent').text()),
			pB		= parseInt($(b).find('.pop_percent').text()),
			reverse	= $(a).parents('.town_group').find('.group_name .sort div.active').is('.reverse') ? -1 : 1;

		return (pA > pB ? -1 : pA < pB ? 1 : dobss_sort_alphabetical(a, b)*reverse)*reverse;
	}

	function dobss_get_towns_islands(placeholder){
		var towns		= MM.getOnlyCollectionByName('Town').getTowns(),
				townsData	= {},
				farms, town;

		for(var x=0; x<towns.length; x++){
			town	= uw.ITowns.getTown(towns[x].getId());
			farms	= uw.GPWindowMgr._collections.farm_towns.getAllForIslandViaXY(town.getIslandCoordinateX(), town.getIslandCoordinateY());
			if(Object.keys(farms).length){
				if(typeof townsData[towns[x].getIslandId()] == 'undefined')
					townsData[towns[x].getIslandId()] = placeholder ? [{value: 0, name: '- None -'}] : [];

				townsData[towns[x].getIslandId()].push({value: towns[x].getId(), name: towns[x].getName()});
			}
		}

		return townsData;
	}

	function dobss_get_island_info(islands, callback, parameters){
		DOBSS_ISLAND_INFO = {};
		var x, len;

		for(x=0, len=islands.length; x<len; x++){
			$.ajax({
				type:				"GET",
				url:				"/game/island_info?town_id="+uw.Game.townId+"&action=index&h="+uw.Game.csrfToken+"&json="+encodeURIComponent(JSON.stringify({island_id: islands[x], town_id: uw.Game.townId, nl_init: true}))+"&_=" + uw.Game.server_time,
				islandId:		islands[x],
				islLength:	islands.length,
				_callback:	callback,
				success:		function(data){
					DOBSS_ISLAND_INFO[this.islandId] = data.json.json;
					DOBSS_ISLAND_INFO[this.islandId].town_list = DOBSS_ISLAND_INFO[this.islandId].town_list.sort(function(a,b){ return a.name.replace(/\s+/g, '').localeCompare(b.name.replace(/\s+/g, ''), 'hu', {sensitivity: 'base'}); });
					if(Object.keys(DOBSS_ISLAND_INFO).length == this.islLength) this._callback.apply(this, parameters || []);
				}
			});
		}
	}

	function dobss_get_alliance_pacts(){
		DOBSS_ALLIANCE_PACTS.list = {};
		DOBSS_ALLIANCE_PACTS.relations.peace = [];
		DOBSS_ALLIANCE_PACTS.relations.neutral = [];
		DOBSS_ALLIANCE_PACTS.relations.war = [];

		var pacts = MM.getOnlyCollectionByName('AlliancePact').models;

		for(var x=0; x<pacts.length; x++){
			var id = pacts[x].attributes.alliance_1_id == Game.alliance_id ? 2 : 1;

			DOBSS_ALLIANCE_PACTS.list[pacts[x].attributes['alliance_'+id+'_id']] = {
				alliance_id:	 pacts[x].attributes['alliance_'+id+'_id'],
				alliance_name: pacts[x].attributes['alliance_'+id+'_name'],
				creation_date: pacts[x].attributes.creation_date,
				id:						 pacts[x].attributes.id,
				relation:			 pacts[x].attributes.relation
			};
			DOBSS_ALLIANCE_PACTS.relations[pacts[x].attributes.relation].push(pacts[x].attributes['alliance_'+id+'_id']);
		}
	}

	function dobss_get_alliance_names(){
		if(!DOBSS_ALLIANCE_PACTS.list.length)
			dobss_get_alliance_pacts();

		var alliances = DOBSS_ALLIANCE_PACTS.relations.peace.slice().map(function(v){ return DOBSS_ALLIANCE_PACTS.list[v].alliance_name; });

		alliances.push(MM.getModelByNameAndPlayerId('Player').attributes.alliance_name);
		return alliances;
	}

	function dobss_get_pact_towns(islands){
		var alliances		= dobss_get_alliance_names(),
				pact_towns	= {},
				x, y, len, tlen;

		if(typeof islands == 'undefined'){
			var towns			= MM.getOnlyCollectionByName('Town').getTowns();
			islands		= [];

			for(x=0, len=towns.length; x<len; x++){
				if(islands.indexOf(towns[x].getIslandId())<0)
					islands.push(towns[x].getIslandId());
			}
		}

		for(x=0, len=islands.length; x<len; x++){
			for(y=0, tlen=DOBSS_ISLAND_INFO[islands[x]].town_list.length; y<tlen; y++){
				var town = DOBSS_ISLAND_INFO[islands[x]].town_list[y];
				if(town.pid != Game.player_id && alliances.indexOf(town.player_alliance) > -1){
					if(typeof pact_towns[islands[x]] == 'undefined')
						pact_towns[islands[x]] = {
							ix: 				town.ix,
							iy:					town.iy,
							res:				DOBSS_ISLAND_INFO[islands[x]].resource.plenty[0].toUpperCase()+DOBSS_ISLAND_INFO[islands[x]].resource.rare[0].toLowerCase(),
							town_list:	[]
						};

					pact_towns[islands[x]].town_list.push({
						id:			town.id,
						name:		town.name,
						data:		town.data,
						pid:		town.pid,
						player:	town.player,
						alliance_id:		DOBSS_ALLIANCE_PACTS.getId(town.player_alliance),
						alliance_name:	town.player_alliance,
						relation:				DOBSS_ALLIANCE_PACTS.getRelation(town.player_alliance)
					});
				}
			}
		}

		return pact_towns;
	}

	function dobss_get_town_info(islands, callback){
		DOBSS_TOWN_INFO = {};
		var towns = dobss_get_pact_towns(islands),
				tlen	= 0,
				island, x, len;

				for(island in towns)
					tlen += towns[island].town_list.length;

		for(island in towns){
			for(x=0, len=towns[island].town_list.length; x<len; x++)
				$.ajax({
					type:			"GET",
					url:			"/game/town_info?town_id="+uw.Game.townId+"&action=support&h="+uw.Game.csrfToken+"&json="+encodeURIComponent(JSON.stringify({id: towns[island].town_list[x].id, town_id: uw.Game.townId, nl_init: true}))+"&_=" + uw.Game.server_time,
					townId:		towns[island].town_list[x].id,
					tlen:			tlen,
					_callback:callback,
					success:	function(data){
						DOBSS_TOWN_INFO[this.townId] = data.json.json;
						if(Object.keys(DOBSS_TOWN_INFO).length == this.tlen) this._callback();
					}
				});
		}
	}

	function createWindowType(name, title, width, height, minimizable, position){
		function WndHandler(wndhandle) {
			this.wnd = wndhandle;
		}

		Function.prototype.inherits.call(WndHandler, WndHandlerDefault);
		WndHandler.prototype.getDefaultWindowOptions = function () {
			return {
				position:			position,
				width:				width,
				height:				height,
				minimizable:	minimizable,
				title:				title
			};
		};
		GPWindowMgr.addWndType(name, "", WndHandler, 1);
	}

	function dobss_openSentinels(loaded){
		var content	=
					'<div id="dobss_sentinels" class="box_content">'+
						'<div class="cont_wrap"/>'+
					'</div>',
				towns			= MM.getOnlyCollectionByName('Town').getTowns(),
				islands		= [],
				loaded		= true,
				island, len, g, x;

		for(x=0, len=towns.length; x<len; x++){
			if(islands.indexOf(towns[x].getIslandId())<0)
				islands.push(towns[x].getIslandId());
		}

		if(!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DOBSS_SENTINELS))
			Layout.wnd.Create(GPWindowMgr.TYPE_DOBSS_SENTINELS).setContent(content);

		Layout.showAjaxLoader();

		if(Object.keys(DOBSS_ISLAND_INFO).length != Object.keys(islands).length){
			loaded = false;
			dobss_get_island_info(islands, dobss_get_town_info, [islands, dobss_openSentinels]);
		}else{
			towns	= dobss_get_pact_towns(islands);
			len		= 0;
			for(island in towns)
				len += towns[island].town_list.length;

			if(Object.keys(DOBSS_TOWN_INFO).length != len){
				loaded = false;
				dobss_get_town_info(islands, dobss_openSentinels);
			}
		}

		if(loaded){
			var h;

			for(island in towns){
				h = $('<ul/>');
				g = $('<fieldset/>')
					.append(
						'<legend>'+
							'<span class="bbcodes bbcodes_island">'+
								'<a class="gp_island_link" href="#'+
									btoa('{"tp":"island","id":'+island+',"ix":'+towns[island].ix+',"iy":'+towns[island].iy+',"res":"'+towns[island].res+'","lnk":true,"wn":""}')+
								'">'+(DM.getl10n('dobss','island') || "Island")+' '+island+'</a>'+
							'</span>'+
							'<span class="icon_wrap">'+
								'<span class="icon good">OK</span>'+
								'<span class="count"></span>'+
							'</span>'+
						'</legend>'
					).append($('<div class="wrap clearfix"/>')).find('.wrap');

				var nCount = 0;

				for(x=0, len=DOBSS_ISLAND_INFO[island].town_list.length; x<len; x++){
					if(DOBSS_ISLAND_INFO[island].town_list[x].pid == Game.player_id)
						g.before('<div class="bbcodes bbcodes_town"><a class="gp_town_link" href="#'+DOBSS_ISLAND_INFO[island].town_list[x].data+'">'+DOBSS_ISLAND_INFO[island].town_list[x].name+'</a></div>');
				}

				for(x=0, len=towns[island].town_list.length; x<len; x++){
					var town = towns[island].town_list[x],
							icon = ['good','OK'];

					if(!Object.keys(DOBSS_TOWN_INFO[town.id].active_player_supporting_units).length){
						icon = ['bad','NOT OK'];
						nCount++;
					}

					h.append(
						'<li>'+
							'<span class="icon '+icon[0]+'">'+icon[1]+'</span>'+
							'<div id="sentinel_flag_'+town.id+'" class="flag town '+town.relation+'"><div class="flagpole town"></div></div>'+
							'<a class="gp_town_link" href="#'+town.data+'">'+town.name+'</a>'+
							(town.relation == 'peace' ? ' (<a href="javascript:void(0)" onclick="Layout.allianceProfile.open(\''+town.alliance_name+'\','+town.alliance_id+')">'+town.alliance_name+'</a>)' : '')+
							'<span class="attack_planner">'+
								'<span class="attack_town_button" data-island="'+island+'" data-offset="'+x+'"></span>'+
							'</span>'+
						'</li>'
					);
				}

				if(nCount)
					g.siblings('legend').find('.icon').removeClass('good').addClass('bad').text('NOT OK').siblings('.count').text(nCount);

				$('#dobss_sentinels .cont_wrap').append(g.append(h).parent());
			}

			$('#dobss_sentinels fieldset legend').on('click', function(e){
				if(!$(e.target).is('.gp_island_link'))
					$(this).siblings('.wrap').stop().slideToggle();
			});

			$('#dobss_sentinels .attack_town_button').on('click', function(e){
				var island	= parseInt($(this).attr('data-island')),
						town		= dobss_get_pact_towns()[island].town_list[parseInt($(this).attr('data-offset'))];

				if(MM.getOnlyCollectionByName('Town').getTowns().filter(function(v){ return v.id == Game.townId; })[0].getIslandId() != island){
					for(var x=0, len=DOBSS_ISLAND_INFO[island].town_list.length; x<len; x++){
						if(DOBSS_ISLAND_INFO[island].town_list[x].pid == Game.player_id){
							HelperTown.townSwitch(DOBSS_ISLAND_INFO[island].town_list[x].id);
							break;
						}
					}
				}

				var window_options = {
					origin_town_id: Game.townId,
					id : town.id,
					preselect : true,
					preselect_units: {}
				};
				window_options.preselect_units[DOBSS_SETTINGS.sentinels_unit] = DOBSS_SETTINGS.sentinels_unit_count;
				GPWindowMgr.Create(GPWindowMgr.TYPE_TOWN, town.name, {action: 'support'}, window_options);
			});

			Layout.hideAjaxLoader();
		}
	}

	function dobss_openSettings(){
		var content		=
				'<div id="dobss_settings" class="box_content">'+
					'<div class="left"></div>'+
					'<div class="right"></div>'+
				'</div>',
			townsData	= dobss_get_towns_islands(true),
			f		= $('<fieldset/>'),
			ff	= $('<fieldset/>'),
			fff	= $('<fieldset/>'),
			g		= $('<fieldset/>'),
			h, island;

		if(!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DOBSS_SETTINGS))
			Layout.wnd.Create(GPWindowMgr.TYPE_DOBSS_SETTINGS).setContent(content);

		Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DOBSS_SETTINGS).getJQCloseButton().get(0).onclick = function(){
			$('.nui_main_menu .circle_button.dobss_settings').removeClass("checked");
		};

		Layout.showAjaxLoader();
		if(Object.keys(DOBSS_ISLAND_INFO).length != Object.keys(townsData).length)
			dobss_get_island_info(Object.keys(townsData), dobss_openSettings);
		else{
			var c = function(a, b, c, d){
				return $('<div/>', {
					'class':	'checkbox_new',
					id:			'WE_'+b
					// style:		''
				}).checkbox({
					caption:	a,
					checked:	DOBSS_SETTINGS[b] || c,
					cid:		'WE_'+b,
					disabled:	false || d
				});
			},
			d = function(a, b, c, d, e){
				var h = $('<div class="wrap clearfix"/>'),
					params = {
						disabled:	false || e,
						list_pos:	'left',
						value:		DOBSS_SETTINGS[b],
						options:	c
					};
				h.append('<label for="WE_'+b+'">'+a+'</label>')
				 .append($("<div/>", {
					id:				'WE_'+b,
					"class":		'dropdown default',
					style:			d || '',
					'data-value':	DOBSS_SETTINGS[b]
				}).dropdown(params).data(params).on("dd:change:value", function(e, val, oldVal, el){
					el.attr('data-value', val);
				}));
				return h;
			},
			t = function(a, b, c){
				return $('<div class="wrap clearfix">'+
					'<label for="WE_'+b+'">'+a+'</label>'+
					'<div class="textbox">'+
						'<div class="left"/>'+
						'<div class="right"/>'+
						'<div class="middle">'+
							'<div class="ie7fix"><input type="text" tabindex="1" id="WE_'+b+'" value="'+(c || DOBSS_SETTINGS[b])+'" size="10"></div>'+
						'</div>'+
					'</div>'+
				'</div>');
			};


			f.append($('<legend/>').text(DM.getl10n('dobss','settings').general || 'General'));
			f.append(d(
				DM.getl10n('dobss','settings').harvest_nth.label || 'Interval',
				'harvest_nth',
				[
					{value: 0, name: DM.getl10n('dobss','settings').harvest_nth.opt1 || '5/10 min'},
					{value: 1, name: DM.getl10n('dobss','settings').harvest_nth.opt2 || '20/40 min'},
					{value: 2, name: DM.getl10n('dobss','settings').harvest_nth.opt3 || '1,5/3 hours'},
					{value: 3, name: DM.getl10n('dobss','settings').harvest_nth.opt4 || '4/8 hours'}
				]
			));
			f.append(d(
				DM.getl10n('dobss','settings').full_switch.label || 'If storage is full',
				'autofarm_full_switch',
				[
					{value: 0, name: DM.getl10n('dobss','settings').full_switch.opt1 || 'stop farming'},
					{value: 1, name: DM.getl10n('dobss','settings').full_switch.opt2 || 'switch to town with most free storage'},
					{value: 2, name: DM.getl10n('dobss','settings').full_switch.opt3 || 'switch to town with less free storage'}
				]
			));
			f.append(d(
				DM.getl10n('dobss','settings').timing.label || 'Farming mode',
				'autofarm_timing',
				[
					{value: 1, name: DM.getl10n('dobss','settings').timing.opt1 || 'all islands at once'},
					{value: 2, name: DM.getl10n('dobss','settings').timing.opt2 || 'separately - manual timing'}
				],
				void 0,
				DOBSS_SETTINGS.captain && uw.Game.premium_features.captain > uw.Timestamp.now()
			));
			f.append(t(
				DM.getl10n('dobss','settings').notification_timeout || 'Notification timeout (sec)',
				'notification_timeout',
				DOBSS_SETTINGS.notification_timeout/1000
			));
			f.append(c(DM.getl10n('dobss','settings').auto_start || 'Auto start farming', 'auto_start'));

			ff.append($('<legend/>').text(DM.getl10n('dobss','settings').premium || 'Premium features'));
			ff.append(
				c(
					DM.getl10n('dobss','settings').captain || 'Captain - use farm town overview',
					'captain',
					DOBSS_SETTINGS.captain,
					uw.Game.premium_features.captain < uw.Timestamp.now()
				).on("cbx:check", function(){
					var params = $.extend($('#WE_autofarm_timing').data(), {
						disabled:	$(this).is('.checked'),
						value:		parseInt($('#WE_autofarm_timing').attr('data-value'))
					});

					$('#WE_autofarm_timing').dropdown(params).data(params);
				})
			);

			fff.append($('<legend/>').text(DM.getl10n('dobss','sentinels').title || 'Sentinels'));
			fff.append(d(
				DM.getl10n('dobss','sentinels').unit || 'Unit to be sent',
				'sentinels_unit',
				Object.keys(GameData.units)
					.reduce(function(a,b){
						a.push({
							value:	GameData.units[b].id,
							name:		GameData.units[b].name[0].toUpperCase()+GameData.units[b].name.slice(1)
						});

						return a;
					}, [])
					.slice(1) // remove militia
			));
			fff.append(t(
				DM.getl10n('dobss','sentinels').unit_count || 'Unit count',
				'sentinels_unit_count'
			));

			g = g.append($('<legend/>').text((DM.getl10n('dobss','settings').towns || 'Auto farm in towns')+' ('+Object.keys(townsData).length+')')).append($('<div class="cont_wrap"/>')).find('.cont_wrap');
			for(island in townsData) {
				var val = loadValue('WE_harvest_towns_'+island, 0);

				townsData[island] = townsData[island].sort(function (a, b){
					return a.name.localeCompare(b.name);
				});

				var town	= uw.ITowns.getTown(townsData[island][1].value);
				var res		= DOBSS_ISLAND_INFO[island].resource.plenty[0].toUpperCase()+DOBSS_ISLAND_INFO[island].resource.rare[0].toLowerCase();
				h = $('<div class="wrap clearfix"/>');
				h.append('<span class="bbcodes bbcodes_island"><a class="gp_island_link" href="#'+btoa('{"tp":"island","id":'+island+',"ix":'+town.getIslandCoordinateX()+',"iy":'+town.getIslandCoordinateY()+',"res":"'+res+'","lnk":true,"wn":""}')+'">'+(DM.getl10n('dobss','island') || "Island")+' '+island+'</a></span>')
				 .append(
					$("<div/>", {
						id:				'WE_harvest_towns_'+island,
						"class":		'dropdown default island_sel',
						style:			'width: 180px;',
						'data-value':	val
					}).dropdown({
						list_pos:	'left',
						value:		loadValue('WE_harvest_towns_'+island, 0),
						options:	townsData[island]
					}).on("dd:change:value", function(e, val, oldVal, el){
						el.attr('data-value', val);
					})
				);
				g.append(h);
			}

			$('#dobss_settings>.left').append(f, ff, fff);
			$('#dobss_settings>.right')
				.append(g.parent())
				.append($("<div/>", {"class":"button_new", id: "DOBSS_SAVE", name: DM.getl10n('dobss','settings').save || "Save"}).button({caption: DM.getl10n('dobss','settings').save || "Save"}));

			$('#DOBSS_SAVE').on('click', function(e){
				e.stopPropagation();

				$('#dobss_settings .checkbox_new').each(function(){
					saveValue($(this).attr('id'), $(this).is('.checked'));
				});

				$('#dobss_settings .dropdown').each(function(){
					saveValue($(this).attr('id'), $(this).attr('data-value'));
				});

				$('#dobss_settings .textbox input').each(function(){
					if(!isNaN(parseInt($(this).val())))
						saveValue($(this).attr('id'), $(this).is('#WE_notification_timeout') ? parseInt($(this).val())*1000 : parseInt($(this).val()));
					else
						saveValue($(this).attr('id'), $(this).val());
				});

				dobss_loadSettings();
				HumanMessage.success(DM.getl10n('dobss','settings').settings_succes || 'Settings have been saved successfuly');
				return false;
			});

			Layout.hideAjaxLoader();
		}
	}

	function dobss_loadSettings(){
		var towns		= uw.ITowns.getTowns(),
			townsData	= dobss_get_towns_islands();

		DOBSS_SETTINGS = {
			harvest_towns:		{},
			auto_start:				loadValue('WE_auto_start', false),
			captain:					loadValue('WE_captain', uw.Game.premium_features.captain >= uw.Timestamp.now()),
			autofarm_timing:	loadValue('WE_autofarm_timing', 1),
			harvest_nth:			loadValue('WE_harvest_nth', 0),
			sentinels_unit:		loadValue('WE_sentinels_unit', 'sword'),
			sentinels_unit_count:	loadValue('WE_sentinels_unit_count', 1),
			notification_timeout:	loadValue('WE_notification_timeout', 4000),
			autofarm_full_switch:	loadValue('WE_autofarm_full_switch', 0)
		};

		for(var island in townsData){
			var val = loadValue('WE_harvest_towns_'+island, 0);
			if(val)
				DOBSS_SETTINGS.harvest_towns[towns[townsData[island][0].value].getIslandCoordinateX()+'|'+towns[townsData[island][0].value].getIslandCoordinateY()] = val;
		}
		console.log(DOBSS_SETTINGS);
	}

	function dobss_get_lang(){
		var langs = ["en", "hu"],
				i = langs.indexOf(Game.market_id);

		return i>=0 ? langs[i] : "en";
	}

	function dobss_send_notif(title, text, data){
		var dobss_notif = new Notification("WE-Tools "+title, {
				lang: dobss_get_lang(),
				body: text,
				data: data
		});

		dobss_notif.onclick = function(){
			window.focus();

			if(this.data.type == 'attack_planner'){
				var date = new Date(this.data.attack.send_at*1000);

				date = date.getDate()+'.'+(date.getMonth()<9 ? '0' : '')+(date.getMonth()+1)+'.|'+date.getHours()+':'+(date.getMinutes()<10 ? '0' : '')+(date.getMinutes()-1)+':'+(date.getSeconds()<10 ? '0' : '')+date.getSeconds();
				$('#notification_area .notification.planed_attack').filter(function(){
					return $('.notification_date', this).text() == date;
				}).trigger('click');
			}
		};

		if(DOBSS_SETTINGS.notification_timeout>0)
			setTimeout(function(){ dobss_notif.close(); }, DOBSS_SETTINGS.notification_timeout);
	}

	function dobss_get_notif(count){
		var txt = "You are being attacked on Grepolis (%s)!\n%d attacks incoming.";

		switch(dobss_get_lang()){
			case "hu":
				txt = "Megtámadtak Grepolis-on (%s)!\n%d bejövő támadás.";
		}

		return txt.replace(/%s/, Game.world_id).replace(/%d/, count);
	}

	function dobss_get_planner_notif(attack){
		var txt = "The planned attack from %s1 to %s2 is comming.";

		switch(dobss_get_lang()){
			case "hu":
				txt = "Közeleg %s1 tervezett támadása %s2 ellen.";
		}

		return txt.replace(/%s1/, attack.origin_town_name).replace(/%s2/, attack.target_town_name);
	}

	function dobss_init(){
		var towns = uw.ITowns.getTowns(), coords;

		uw.old_town								= 0;
		uw.farm_win_closed				= false;
		uw.farm_was_minimized			= false;
		uw.farm_reposition				= false;
		uw.resource_distribution	= false;
		uw.captain_magic					= false;
		uw.captain_magic_first		= false;
		uw.captain_magic_next			= false;
		// uw.captain_magic_active		= 0;
		uw.captain_harvest_towns	= {};
		dobss_loadSettings();

		$('.nui_main_menu .bottom').append(
			'<div class="circle_button dobss_villages"><div class="icon"></div></div>'+
			'<div class="circle_button dobss_settings settings"><div class="icon"></div></div>'+
			'<div class="circle_button dobss_stop_farm disabled"><div class="icon"></div></div>'
		);

		if(window.location.href.match(/http[s]{0,1}:\/\/hu[0-9]{1,2}\.grepolis\.com\/game*/)){
			DM.loadData({
				l10n: {
					dobss: {
						settings: {
							general: "Általános",
							harvest_nth:		{
								label:	"Időintervallum",
								opt1:		"5/10 perc",
								opt2:		"20/40 perc",
								opt3:		"1,5/3 óra",
								opt4:		"4/8 óra"
							},
							full_switch: {
								label:	"Ha tele van a raktár",
								opt1:		"sarcolás leállítása",
								opt2:		"váltás a legtöbb szabad raktárhelyel rendelkező városra",
								opt3:		"váltás a legkevesebb szabad raktárhelyel rendelkező városra"
							},
							timing: {
								label:	"Sarcolás módja",
								opt1:		"minden szigetet egyszerre",
								opt2:		"szigetenként - manuális időzítés"
							},
							auto_start:	"Sarcolás automatikus indítása",
							premium:		"Prémium funkciók",
							towns:			"Automatikus sarcolás a városokban",
							captain:		"Kapitány - falu áttekintő használata",
							save:				"Mentés",
							settings_succes: 			"A beállítások sikeresen mentve",
							notification_timeout:	"Értesítések időtartama (mp)"
						},
						tooltips: {
							auto_farm:				"Falvak automatikus sarcolása",
							auto_farm_active:	"Falvak automatikus sarcolása (aktív)",
							stop_auto_farm:		"Automatikus sarcolás leállítása",
							// building_orders:	"Építés tervező",
							active:						" (active)"
						},
						sentinels: {
							title:			"Őrszemek",
							unit:				"Küldendő egység",
							unit_count: "Egységszám"
						},
						markfailed:	"Sikertelenek kijelölése",
						marknew:		"Újak kijelölése",
						island:			"Sziget"
					}
				}
			});
		}

		$('head').append('<link rel="stylesheet" media="all" href="">');

		DOBSS_WIN = $('.window_curtain .classic_window.farm_town');
		for(var id in towns){
			coords = towns[id].getIslandCoordinateX()+'|'+towns[id].getIslandCoordinateY();
			if(typeof DOBSS_TIMERS[coords] == 'undefined')
				DOBSS_TIMERS[coords] = {};

			DOBSS_TIMERS[coords][id] = 0;
		}
		DOBSS_TIMERS.captain = 0;

		$('.nui_main_menu .circle_button.dobss_villages').on('click', function(){
			if(!$(this).is('.suspend')){
				var town   = uw.ITowns.getTown(uw.Game.townId),
					coords = town.getIslandCoordinateX()+'|'+town.getIslandCoordinateY(),
					active = dobss_island_active_town(coords),
					farms  = uw.GPWindowMgr._collections.farm_towns.getAllForIslandViaXY(town.getIslandCoordinateX(),town.getIslandCoordinateY());

				dobss_town_switch();
				if(!Object.keys(farms).length || DOBSS_TIMERS[coords][uw.Game.townId])
					return;

				else if(Object.keys(DOBSS_TIMERS[coords]).length > 1){
					if(active){
						if(active == uw.Game.townId)
							return;

						else{
							DOBSS_TIMERS[coords][uw.Game.townId]   = DOBSS_TIMERS[coords][active];
							DOBSS_TIMERS.next_exec[uw.Game.townId] = DOBSS_TIMERS.next_exec[active];
							DOBSS_TIMERS[coords][active]		   = 0;
							delete DOBSS_TIMERS.next_exec[active];
							HelperTown.townSwitch(uw.Game.townId);
							dobss_town_groups_list();
							return;
						}
					}
				}

				dobss_magic(coords);
			}
		}).tooltip("WE-Tools: "+(DM.getl10n('dobss', "tooltips").auto_farm || "Auto-claim farms' resources"));

		$('.nui_main_menu .circle_button.dobss_stop_farm').on('click', function(){
			if(!$(this).is('.disabled')){
				if(DOBSS_TIMERS.captain){
					clearTimeout(DOBSS_TIMERS.captain);
					DOBSS_TIMERS.captain = 0;
					delete DOBSS_TIMERS.next_exec.captain;
				}else{
					var town   = uw.ITowns.getTown(uw.Game.townId),
						coords = town.getIslandCoordinateX()+'|'+town.getIslandCoordinateY();

					clearTimeout(DOBSS_TIMERS[coords][uw.Game.townId]);
					DOBSS_TIMERS[coords][uw.Game.townId] = 0;
					delete DOBSS_TIMERS.next_exec[uw.Game.townId];
				}

				$('.nui_main_menu .circle_button.dobss_villages').removeClass('active suspend');
				$(this).addClass('disabled');
			}
		});

		createWindowType("DOBSS_SETTINGS", "WE-Tools: "+(DM.getl10n("layout", "config_buttons").settings || "Settings"), 800, 470, true, ["center", "center", 100, 100]);

		$('.nui_main_menu .circle_button.dobss_settings').on('click', function(){
			if(!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DOBSS_SETTINGS)){
				dobss_openSettings();
				$(this).addClass("checked");
			}else{
				Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DOBSS_SETTINGS).close();
				$(this).removeClass("checked");
			}
		}).tooltip("WE-Tools: "+(DM.getl10n("layout", "config_buttons").settings || "Settings"));

		$('#overviews_link_hover_menu .subsection:last').after(
			'<li class="subsection we">'+
				'<a class="adviser" name="we"><span class="we">WE-Tools</span></a>'+
				'<ul>'+
					'<li class="outer_units"><a href="#" id="we_overviews_sentinel">Őrszemek</a></li>'+
				'</ul>'+
			'</li>'
		);

		createWindowType("DOBSS_SENTINELS", "WE-Tools: "+(DM.getl10n('dobss', 'sentinels').title || "Sentinels"), 500, 400, true, ["center", "center", 100, 100]);

		$('#we_overviews_sentinel').on('click', function(){
			if(!Layout.wnd.getOpenFirst(GPWindowMgr.TYPE_DOBSS_SENTINELS))
				dobss_openSentinels();
		}).tooltip("WE-Tools: "+(DM.getl10n('dobss', 'sentinels').title || "Sentinels"));

		$(document).ajaxComplete(function(e, xhr, opt){
			var url = opt.url.split("?"), action = "", response;

			if(typeof(url[1]) !== "undefined" && typeof(url[1].split(/&/)[1]) !== "undefined")
				action = url[0].substr(5) + "/" + url[1].split(/&/)[1].substr(7);

			if(opt.url.indexOf('action=trading') > -1 && DOBSS_TRADE_ORD_IDS.length){
				DOBSS_TRADE_RESPONSE = $.parseJSON(xhr.responseText);
				setTimeout(dobss_trade_resources, 1000);
			}else if(action == '/farm_town_overviews/index'){
				if(uw.captain_magic)
					dobss_captain_harvester();
			}else if(action == '/farm_town_overviews/get_farm_towns_for_town'){
				var json = $.parseJSON(decodeURIComponent(opt.url).match(/json=(\{.*\})&/)[1]);

				if(!uw.captain_magic_first && uw.captain_harvest_towns[Object.keys(uw.captain_harvest_towns)[0]] == json.current_town_id){
					response = $.parseJSON(xhr.responseText);
					setTimeout(dobss_captain_harvest, 1000, $('#fto_town_list .fto_town[data-town_id="'+json.current_town_id+'"]'));
				}
			}else if(action == '/farm_town_overviews/claim_loads'){
				response = $.parseJSON(xhr.responseText);

				if(uw.captain_magic){
					if(typeof response.json.error=='undefined')
						DOBSS_TIMERS.next_exec.captain = (new Date()).getTime()+((response._srvtime - response.json.handled_farms[Object.keys(response.json.handled_farms)[0]].lootable_at)*1000)+3000+Math.ceil(Math.random()*4000);

					dobss_captain_next();
				}
			}else if(action.startsWith('/report/')){
				if(!$('#dobss_markfailed').length){
					$('#report_form .game_list_footer label:last').after('<label id="dobss_markfailed">'+(DM.getl10n('dobss', "markfailed") || 'Mark failed')+'<input type="checkbox" onclick="uw.markfailed(this.checked);"></label>');

					uw.markfailed = function(checked){
						$('#report_list li.report_item').each(function(){
							$('input[type="checkbox"]', this).prop('checked', $('img[alt="lost"]', this).length && checked);
						});
					};
				}

				if(!$('#dobss_marknew').length){
					$('#report_form .game_list_footer label:last').after('<label id="dobss_marknew">'+(DM.getl10n('dobss', "marknew") || 'Mark failed')+'<input type="checkbox" onclick="uw.marknew(this.checked);"></label>');

					uw.marknew = function(checked){
						$('#report_list li.report_item').each(function(){
							$('input[type="checkbox"]', this).prop('checked', $('img[alt="new"]', this).length && checked);
						});
					};
				}
			}
		});

		if(DOBSS_SETTINGS.auto_start)
			setTimeout(function(){ $('.nui_main_menu .circle_button.dobss_villages').trigger('click'); }, 2000);
		else
			setTimeout(dobss_town_switch, 2000);

		var c = 0;
		while(uw.layout_main_controller.sub_controllers[c].name != 'town_name_area') c++;
		uw.layout_main_controller.sub_controllers[c].controller.town_groups_list_view.old_render = uw.layout_main_controller.sub_controllers[c].controller.town_groups_list_view.render;
		uw.layout_main_controller.sub_controllers[c].controller.town_groups_list_view.render = function(){
			uw.layout_main_controller.sub_controllers[c].controller.town_groups_list_view.old_render();
			dobss_town_groups_list();
		};

		HelperTown._getTSPrototype().origTownSwitch = HelperTown._getTSPrototype().townSwitch;
		HelperTown._getTSPrototype().townSwitch = function(town_id){
			this.origTownSwitch(town_id);
			dobss_town_switch();
		};

		HelperTown.orig_switchToNextTown = HelperTown.switchToNextTown;
		HelperTown.orig_switchToPreviousTown = HelperTown.switchToPreviousTown;
		HelperTown.switchToPreviousTown = function(){ HelperTown.switchPrevNext('Previous'); };
		HelperTown.switchToNextTown = function(){ HelperTown.switchPrevNext('Next'); };
		HelperTown.switchPrevNext = function(dir){
			var list = loadValue('WE_town_group_sort_'+MM.getCollections().TownGroup[0].getActiveGroupId()+'_list', []);

			if(list.length){
				var x = list.indexOf(uw.Game.townId);

				if(x>=0){
					x += dir == 'Next' ? 1 : -1;
					if(x==list.length)
						x = 0;
					else if(x<0)
						x = list.length-1;

					HelperTown.townSwitch(list[x]);
				}else
					HelperTown['orig_switchTo'+dir+'Town']();
			}else
				HelperTown['orig_switchTo'+dir+'Town']();
		};

		$('.nui_main_menu .content ul li').filter('.forum, .chat').hide().eq(0).parent().height('auto');
	}

	$.Observer(GameEvents.game.load).subscribe([c], dobss_init);
	$.Observer(GameEvents.attack.incoming).subscribe(function(e,d){
		if(Notification.permission === "granted")
			dobss_send_notif("Attack Notifier", dobss_get_notif(d.count), {type: 'attack'});
		else if(Notification.permission !== "denied"){
				alert("Please give WE-Tools permission to send notifications");
				Notification.requestPermission(function(p){
					"permission" in Notification || (Notification.permission = p), "granted" === p ? dobss_send_notif("Attack Notifier", dobss_get_notif(d.count), {type: 'attack'}) : alert(dobss_get_notif(d.count));
				});
		}else
			alert(dobss_get_notif(d.count));
	});
	$.Observer(GameEvents.attack.planner_reminder).subscribe(function(e,d){
		$.ajax({
	    type:			"GET",
	    url:			"/game/attack_planer?town_id="+uw.Game.townId+"&action=attacks&h="+uw.Game.csrfToken+"&json="+encodeURIComponent(JSON.stringify({attack_id: d.attack_id, town_id: uw.Game.townId, nl_init: true}))+"&_=" + uw.Game.server_time,
			n_att_id:	 d.attack_id,
			success:	function(data){
				var attacks = data.json.data.attacks.slice();

				for(var x=0, len=attacks.length; x<len; x++){
					if(attacks[x].id == this.n_att_id){
						if(Notification.permission === "granted")
							dobss_send_notif("Attack Planner Notifier", dobss_get_planner_notif(attacks[x]), {type: 'attack_planner', attack: attacks[x]});
						else if(Notification.permission !== "denied"){
								alert("Please give WE-Tools permission to send notifications");
								Notification.requestPermission(function(p){
									"permission" in Notification || (Notification.permission = p), "granted" === p ? dobss_send_notif("Attack Planner Notifier", dobss_get_planner_notif(attacks[x]), {type: 'attack_planner', attack: attacks[x]}) : alert(dobss_get_planner_notif(attacks[x]));
								});
						}else
							alert(dobss_get_planner_notif(attacks[x]));
					}
				}
	    }
		});
	});

	$('body').on('mousewheel', '#main_area, .ui_city_overview', function(e){
		e.stopPropagation();

		var views  = [false, 'city_overview', 'island_view', 'strategic_map'],
				delta  = -e.originalEvent.detail || e.originalEvent.wheelDelta,
				scroll = views.indexOf($('.bull_eye_buttons .checked').get(0).getAttribute("name"))+(delta < 0 ? 1 : -1);

		if(scroll>0 && scroll<4)
			$('.bull_eye_buttons .'+views[scroll]).click();

		return false;
	});

	$(document).mousedown(function(e){
    if(e.which == 2 && !$(e.target).parents('.ui-dialog').length){
			e.preventDefault();
			$('.bull_eye_buttons .btn_jump_to_town').trigger('click');
      return false;
    }

    return true;
	});
})();
