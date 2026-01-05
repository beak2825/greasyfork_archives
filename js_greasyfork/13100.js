// ==UserScript==
// @name        OGame RaidsTable
// @description Tableau de raids
// @description:en Raids table
// @namespace   Xanatos
// @include     http://*.ogame.gameforge.com/game/index.php?page=messages*
// @exclude     http://*.ogame.gameforge.com/game/index.php?page=messages*messageId*
// @version     1.9.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13100/OGame%20RaidsTable.user.js
// @updateURL https://update.greasyfork.org/scripts/13100/OGame%20RaidsTable.meta.js
// ==/UserScript==

// Compatibility OGame 6.0.8

// images
var more_infos = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzRBNTJDRTU3NzY2MTFFNUExQTFGRDU3NkE5QzM1RTkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzRBNTJDRTY3NzY2MTFFNUExQTFGRDU3NkE5QzM1RTkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozNEE1MkNFMzc3NjYxMUU1QTFBMUZENTc2QTlDMzVFOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozNEE1MkNFNDc3NjYxMUU1QTFBMUZENTc2QTlDMzVFOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpQjHhcAAAN6SURBVHjarFbNThRBEK7qbXZhgXUhkEiIeiCgj4B34lt415MXDlxMPBhCohdPPIB3HsBw10cgQU9iYhQDLOCyuzNd9k9Vd8+skGAc2ExPT3V19fdVfTVIRLB4b3W12WrtNHVro9FQHTsVL0S48XK2uY08G2N6g+Fg3/62jr8eHuLC8srD9lT7U2dusduenQOlNZAx1hh5Ifmx3G/eNNmUZQFXF2dwdvLj9LLfX9eocHvmznx3ojUJo2EfYAi3vmwY9m88CN1swXRnvtu/+ratFcDGZHsWDBU2JIjmFJ3IWNmxCe/YCNnI8DuxA7Zz4ynrWyE+0faondIUPir+9z8Uh6Tss12IZXrBfmRDotLPe26tnQvAvUM7X1oa7EYz2uNvH8KLdBoPBoW7TDqbzWdPIzRvdt+HNbyJTwQONgZNxnOnY6oQxdMAb2pTgiHBACnVSDB2jYTP3iNXMi98EYdLvBFy6HGe7wZgjO4QLTB3iV1iH+LFoaadpc35eNZ4CgxpkDsfPxDDiyFQzBCJhHK664g/CUR2Y/feEGeUpO/fCqcM8wZ8YCRZy1XrfKJqBI58MgCfik9BAh0FrIUjIqrtY1K2+egTT0gBQkUqncjzIwmBICszvBj3GkuGKMMzlQdwAoUSCGqBSw/WaG5hyUrGqKJXLzefw79er9/uxqxzknZ6/N1mHScDGXMt6be9JBvBQxf8aWReAkf/YRfwyu3ploL1DDrorHJDMRpAkoe0Y52ZV1sv0njnXa1+woJc5PVEC3onPwN0DjaTQZcEM2zsa4vGQfXSBVKYmBW4ZC1VJUiyTmrAjVIfStU0DhGLmy8JYLiQ4arKlo7HjgRmskoY/QdZqRGYr3H1ZiudMlUVjoIEyYlq0OW1cS3pFEg3lOpN9qnnlZY2TZJ1dXWrJMh46w5qgRXbUMfMrwkc4d37azQ904HB1e/UUvPuKtjn3RCp8j4FKJtBFOTmZBsuz3uuTVDP7trJ8aesmfm7ST0q8JJzB7FBih5KrG6ZKV1m0oWyerXvvliIRTBAQexQnmVsUp+yY5Olr2+CJvnwY686pcvODzi/vPKopRsfG3qia8qyotCpX+afLJL6aT7T92illLLfCg2noafDonisfh19PhgU5fpgONwzVJ6HCKURphOKlOSfSmKHWZdONVaeD0bDPef7+OjLwR8BBgD83p/V5NpKbgAAAABJRU5ErkJggg=="/>';

// app
(function()
{
	Element.prototype.hasClass = function(className) {
		return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
	};	
	
	function trim(string)
	{return string.replace(/(^\s*)|(\s*$)/g,'');} 
	
	function numberWithCommas(x)
	{
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	}

	function removeElement(node)
	{
		node.parentNode.removeChild(node);
	}

	function extractRess(res)
	{
		if(/:/.test(res.textContent)) {
			res =trim(res.textContent.split(':')[1]);
		}
		else {
			res=trim(res.textContent);
		}
		
		if(/^[0-9]{1,3}\.[0-9]{3}$/.test(res))
			res=res.replace(/\./g,'');
		else if (/^[0-9]{1,3}(\.|,)[0-9]{1,3}Md/.test(res))
			res=res.replace(/,/g,'.').replace(/Md/g,'')*1000000000;
		else if (/^[0-9]{1,3}(\.|,)[0-9]{1,3}M/.test(res))
			res=res.replace(/,/g,'.').replace(/M/g,'')*1000000;
		
		return parseInt(res);       
	}
	
	function raidsTable_init()
	{
		if(document.querySelector('#chatBar'))
		{
			var uiid20_ul = document.querySelector("#ui-id-20 .tab_inner:first-child");
		}
		else
		{
			var uiid20_ul = document.querySelector("#ui-id-14 .tab_inner:first-child");
		}
		var raidsTable = document.querySelector("#raidsTable_container");
		
		// on affiche le tableau s'il n'existe pas déjà
		if (uiid20_ul && !raidsTable)
		{
			// on récupère tous les messages
			var computed_messages = [];
			var total_resources = 0;
			var total_pt = 0;
			var total_gt = 0;
			var raw_messages = uiid20_ul.querySelectorAll('li.msg'), i;
			for(i = 0; i < raw_messages.length; i++)
			{
				var current_raw_message = raw_messages[i];
				var computed_message_built = {};
				
				if(current_raw_message.querySelectorAll('.espionageDefText').length == 0)
				{
					// message id
					computed_message_built.id = current_raw_message.getAttribute('data-msg-id');
					
					// joueur
					var player = current_raw_message.querySelectorAll('.msg_content')[0].querySelectorAll('div')[0];
					var player_html_nodes = player.children;
					var player_html = "", k = 0;
					for(k = 1; k < player_html_nodes.length-1; k++)
					{
						if(k > 1)
						{
							player_html += ' ';
						}
						player_html += player_html_nodes[k].innerHTML
					}
					computed_message_built.player = player_html;
					
					
					// coordonnées
					var coordinates_node = current_raw_message.querySelectorAll('.msg_head')[0].querySelectorAll('.msg_title')[0].querySelectorAll('a')[0];
					computed_message_built.coordinates_url = coordinates_node.getAttribute('href');
					var planetIcon = '';
					if(coordinates_node.querySelectorAll('figure')[0].hasClass('moon'))
					{
						planetIcon = ' <figure class="planetIcon moon tooltip js_hideTipOnMobile" title=""></figure>';
					}
					computed_message_built.coordinates = coordinates_node.innerHTML.match(/\[.+\]/)[0] + planetIcon;
					
					
					// activité
					var activity_node = current_raw_message.querySelectorAll('.msg_content')[0].querySelectorAll('.compacting')[0].querySelectorAll('.fright')[0];
					computed_message_built.activity_min = "";
					computed_message_built.activity_color = 'inherit';
					if(activity_node.querySelectorAll('font')[0])
					{
						computed_message_built.activity_min = activity_node.querySelectorAll('font')[0].innerHTML.match(/\d+/)[0] + 'm.';
						computed_message_built.activity_color = activity_node.querySelectorAll('font')[0].getAttribute('color');
						
						computed_message_built.player += ' <span style="color:'+computed_message_built.activity_color+'">'+computed_message_built.activity_min+'</span>';
					}
					
					
					// pourcentage butin
					try
					{
						var booty = current_raw_message.querySelectorAll('.msg_content')[0].querySelectorAll('div')[2].querySelectorAll('span')[0];
						booty = booty.innerHTML;
						var regex = /[\d\.]+/g;
						booty = booty.match(regex)[0];
						booty = parseInt(booty);
						//booty = current_raw_message.getElementsByClassName('ctn ctn4')[3].textContent.replace(/[^0-9]/g,'');
						computed_message_built.booty = booty;
					}
					catch(err)
					{
						var booty = 100;
						computed_message_built.booty = booty;
					}
					
					
					// ressources
					var ress = current_raw_message.getElementsByClassName('resspan');
					var metal = extractRess(ress[0]);
					var crystal = extractRess(ress[1]);
					var deut = extractRess(ress[2]);
					var resources = parseInt(booty/100*(metal+crystal+deut));
					total_resources += resources;
					var fret = parseInt(resources*1.1);
					computed_message_built.raw_resources = resources;
					computed_message_built.resources = numberWithCommas(resources);
					
					// gt
					computed_message_built.gt = Math.round(fret/25000);
					total_gt += computed_message_built.gt;
					
					// pt
					computed_message_built.pt = Math.round(fret/5000);
					total_pt += computed_message_built.pt;

					// liens transporteurs
					var link=current_raw_message.getElementsByClassName('msg_actions clearfix')[0].getElementsByTagName('a')[2].href;
					var APIkey = current_raw_message.getElementsByClassName('icon_apikey')[0].title.split('-')[3];
					computed_message_built.linkGT = link+'&am203='+computed_message_built.gt+'&addGT='+APIkey;
					computed_message_built.linkPT = link+'&am202='+computed_message_built.pt+'&addGT='+APIkey;
					
					// flotte
					try
					{
						var fleet = current_raw_message.querySelectorAll('.msg_content')[0].querySelectorAll('div')[3].querySelectorAll('span')[0].getAttribute('title');
						computed_message_built.fleet = fleet;
					}
					catch(err)
					{
						var fleet = undefined;
						computed_message_built.fleet = fleet;
					}

					// recycleurs
					if(fleet !== undefined)
					{
						recycler = computed_message_built.fleet.replace(/\./g , '');
						recycler = recycler/20000;
						computed_message_built.recycler_30 = Math.round(recycler*0.3);
						computed_message_built.recycler_50 = Math.round(recycler*0.5);
						computed_message_built.recycler_60 = Math.round(recycler*0.6);
						computed_message_built.recycler_70 = Math.round(recycler*0.7);
					}
					
					// défense
					try
					{
						var defense = current_raw_message.querySelectorAll('.msg_content')[0].querySelectorAll('div')[3].querySelectorAll('span')[1].getAttribute('title');
						computed_message_built.defense = defense;
					}
					catch(err)
					{
						var defense = undefined;
						computed_message_built.defense = defense;
					}
					
					// bouton d'attaque
					var attack_button = current_raw_message.querySelectorAll('.msg_actions')[0].querySelectorAll('a')[2].getAttribute('href');
					computed_message_built.attack_button = attack_button;
					
					// détails
					var more_button = current_raw_message.querySelectorAll('.msg_actions')[0].querySelectorAll('a');
					more_button = more_button[more_button.length-1].getAttribute('href');
					computed_message_built.more_button = more_button;
					
					if(i%2 == 0)
					{
						current_raw_message.style.backgroundColor = '#111';
					}
					current_raw_message.setAttribute('id', 'anchor'+computed_message_built.id);
					computed_messages.push(computed_message_built);
				}
			}
			
			if(computed_messages.length > 0)
			{
				// re-ordonnement
				computed_messages.sort(function(a, b) {
					if(a.raw_resources > b.raw_resources)
					{
						return -1;
					}
					else
					{
						return 1;
					}
					
					return 0;
				});
				
				// construction du tableau
				var table = '<div style="text-align: center">Pillage : '+numberWithCommas(total_resources)+' | PT : '+numberWithCommas(total_pt)+' | GT : '+numberWithCommas(total_gt)+'</div>';
				table += '<table id="raidsTable" class="content_table">';
				table += '<tr class="ct_head_row">';
				table += '<th class="ct_th">#</th>';
				table += '<th class="ct_th">Joueur</th>';
				table += '<th class="ct_th">Position</th>';
				table += '<th class="ct_th">Flotte</th>';
				table += '<th class="ct_th">Défense</th>';
				table += '<th class="ct_th">Pillage</th>';
				table += '<th class="ct_th">GT</th>';
				table += '<th class="ct_th">PT</th>';
				table += '<th class="ct_th"></th>';
				table += '<th class="ct_th"></th>';
				table += '<th class="ct_th"></th>';
				table += '</tr>';
						
				var j;
				for(j = 0; j < computed_messages.length; j++)
				{
					var tr_class = j%2 == 0 ? 'odd' : 'even';
					var tr_row = j+1;
					var current_computed_message = computed_messages[j];
					
					var attack = '<a href="'+current_computed_message.attack_button+'">';
					attack += '<span class="icon_nf icon_attack"></span>';
					attack += '</a>';
					
					var del_button = '<li class="msg" data-msg-id="' + current_computed_message.id + '">';
					del_button += '<a class="fright" onclick="this.parentNode.parentNode.parentNode.style.display=\'none\';document.querySelector(\'#anchor' + current_computed_message.id + '\').style.display=\'none\'" href="javascript:void(0);">'; // 
					del_button += '<span title="" class="icon_nf icon_refuse js_actionKill tooltip js_hideTipOnMobile"></span>';
					del_button += '</a></li>';

					var more_button = '<a class="fright txt_link overlay" data-overlay-title="Plus de détails" href="'+current_computed_message.more_button+'">'+more_infos+'</a>';
					
					var recycler_title = "Aucune info.";
					var fleet_title = "NaN";
					if(current_computed_message.fleet !== undefined)
					{
						recycler_title = "<b><u>Recycleurs nécessaires</u></b>";
						recycler_title += "<br />30% : " + current_computed_message.recycler_30;
						recycler_title += "<br />50% : " + current_computed_message.recycler_50;
						recycler_title += "<br />60% : " + current_computed_message.recycler_60;
						recycler_title += "<br />70% : " + current_computed_message.recycler_70;
						
						fleet_title = current_computed_message.fleet;
					}
					
					var defense_title = "NaN";
					if(current_computed_message.defense !== undefined)
					{
						var defense_title = current_computed_message.defense;
					}

					
					table += '<tr class="' + tr_class + '" id="msg_'+current_computed_message.id+'" data-id="'+current_computed_message.id+'">';
					table += '<td class="ct_td"><a href="#anchor'+current_computed_message.id+'">#'+tr_row+'</a></td>';
					table += '<td class="ct_td">' + current_computed_message.player + '</td>';
					table += '<td class="ct_td"><a href="' + current_computed_message.coordinates_url + '">' + current_computed_message.coordinates + '</a></td>';
					table += '<td class="ct_td tooltipLeft" title="'+recycler_title+'">' + fleet_title + '</td>';
					table += '<td class="ct_td">' + current_computed_message.defense + '</td>';
					table += '<td class="ct_td tooltipLeft" title="'+current_computed_message.booty+'%">' + current_computed_message.resources + '</td>';
					table += '<td class="ct_td"><a href="'+current_computed_message.linkGT+'">' + current_computed_message.gt + '</a></td>';
					table += '<td class="ct_td"><a href="'+current_computed_message.linkPT+'">' + current_computed_message.pt + '</a></td>';
					table += '<td class="ct_td">'+attack+'</td>';
					table += '<td class="ct_td">'+more_button+'</td>';
					table += '<td class="ct_td">'+del_button+'</td>';
					table += '</tr>';
				}
				
				table += '</table>';
			
				var containerElement = document.createElement("div");
				containerElement.innerHTML = table;
				containerElement.id ='raidsTable_container';
				containerElement.style.clear = 'both';
				uiid20_ul.insertBefore(containerElement, uiid20_ul.firstChild);
			}
		}
	}
	
	setInterval(raidsTable_init, 50);
})();
