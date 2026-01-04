// ==UserScript==
// @name        hearthstone deckcode
// @version     2.30
// @description hs deckcode
// @match *://bbs.nga.cn/read.php*
// @author      fbigame
// @namespace https://hs.fbigame.com
// @downloadURL https://update.greasyfork.org/scripts/386541/hearthstone%20deckcode.user.js
// @updateURL https://update.greasyfork.org/scripts/386541/hearthstone%20deckcode.meta.js
// ==/UserScript==

var img_ver = 13;

var fbi_postcontent0 = document.getElementById('postcontent0').innerHTML;
if (fbi_postcontent0 != undefined) {
	var deck_code_all = [];
    deck_codes = fbi_postcontent0.split('<br>');
    deck_codes.forEach(function(value, index, arr) {
        if (value.substring(0, 3) == 'AAE') {
            deck_code_all.push(value);
        }
    });
	var fbi_userinfo = document.getElementById('posterinfo0');
	var fbi_userinfo_divs = fbi_userinfo.childNodes;
	var fbi_deck_div = null;
	for (var i = 0; i < fbi_userinfo_divs.length; i++) {
		if (fbi_userinfo_divs[i].className == "stat_spacer") {
			fbi_deck_div = fbi_userinfo_divs[i];
		} else if (fbi_userinfo_divs[i].className == "stat") {
			var fbi_user_stat_div = fbi_userinfo_divs[i].childNodes;
			for (var j = 0; j < fbi_user_stat_div.length; j++) {
				if (fbi_user_stat_div[j].className == "stat_spacer") {
					fbi_deck_div = fbi_user_stat_div[j];
				}
			}
		}
	}
	if (fbi_deck_div !== null) {
		var ele = document.createElement("div");
		ele.innerHTML = '<style>.forumbox .postrow .stat_spacer{width:auto;}.cards_rebuild li{list-style:none}.deck_containter{padding-top:7px;width:200px;z-index:1001;font-size:14px!important;font-family:"Microsoft YaHei",Arial,Helvetica,sans-serif;margin:auto;}.deck_containter .deck_hero{width:200px;height:65px}.card-tile{padding-top:2px;color:#fff;position:relative;text-align:left;cursor:pointer;margin-top:1px;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000;height:34px;line-height:34px}.card-tile .card-gem{height:100%;float:left;position:relative;border-style:solid;border-color:black;border-width:1px 0 1px 1px;width:34px}.card-tile .card-cost{position:absolute;font-weight:bold;text-align:center;width:100%}.card-tile .rarity-common,.rarity-free{background:#858585}.card-tile .rarity-common,.rarity-rare{background:#315376}.card-tile .rarity-common,.rarity-epic{background:#644c82}.card-tile .rarity-common,.rarity-legendary{background:#855c25}.card-tile .card-frame{position:relative;border:solid 1px black;height:100%;overflow:hidden}.card-tile .card-frame .card-fade-countbox{position:absolute;width:100%;height:100%;background:linear-gradient(65deg,rgba(49,49,9,1) 0,rgba(49,49,49,1) calc(100% - 120px),rgba(49,49,49,0) calc(100% - 50px),rgba(49,49,49,0) 100%)}.card-tile .card-frame .card-fade-no-countbox{position:absolute;width:100%;height:100%;background:linear-gradient(65deg,rgba(49,49,9,1) 0,rgba(49,49,49,1) calc(100% - 96px),rgba(49,49,49,0) calc(100% - 26px),rgba(49,49,49,0) 100%)}.card-tile .card-frame .card-name{position:absolute;font-weight:bold;left:5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.card-tile .card-frame .card-asset{position:absolute;height:100%;background-color:#313131}.card-tile .card-countbox{float:right;position:relative;background-color:#313131;border-left:solid 1px black;height:100%}.card-tile .card-legendicon{position:absolute;top:-1px}.card-tile .card-count{position:absolute;width:100%;color:#f4d442;font-weight:bold;text-align:center}.card-tile .card-image{position:fixed;z-index:1000}.card-tile .predicted{opacity:.4;filter:grayscale(1)}.card-tile .predicted :hover{filter:grayscale(0)}.card-tile .predicted .craftable{opacity:.6}.card-tile .predicted .craftable a:hover,.card-tile .predicted .craftable a:focus{opacity:.8}.card-tile .predicted .craftable a:hover,.card-tile .predicted .craftable a:focus{cursor:pointer}.card-tile .predicted .craftable.card-image{filter:none}#card-tooltip .card-image-container{position:relative}#card-tooltip .card-image-subtitle{position:absolute;width:100%;left:0;text-align:center;bottom:5%;font-weight:bold;text-shadow:-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000,1px 1px 0 #000}.card-tooltip{background-color:rgba(0,0,0,0.95);border-radius:4px;border:1px rgba(255,255,255,0.25) solid;color:white;font-family:"Noto Sans",sans-serif;font-size:14px;font-weight:normal;margin-top:10px;min-width:250px;max-width:300px;padding:8px 8px;position:fixed;white-space:normal;pointer-events:none;z-index:1000}.no-background{background:transparent;border:unset}.card-image{position:absolute;z-index:1000;width:256px}</style><div id="tooltip-container"></div>';
		fbi_deck_div.appendChild(ele);
		
		var deck_index;
		var fbi_ajax = [];
		var ajax_status = false;
		var const_index = 0;
		for (deck_index = 0; deck_index < 1; deck_index ++) {
			console.log('deck_index: ' + deck_index);
			console.log('deck_code_all.length: ' + deck_code_all.length);
			var deck_code = deck_code_all[deck_index];
			if (ajax_status == true){
				const_index = deck_index;
			}
			if (deck_code != '') {
				var ele = document.createElement("div");
				ele.innerHTML = '<div class="deck_containter"><div id="cards_rebuild_' + deck_index + '" class="cards_rebuild"></div><div class="deck_wrap"><div id="cards_list_' + deck_index + '" class="cards_list"></div></div></div>';
				fbi_deck_div.appendChild(ele);
				
				
				fbi_ajax[const_index] = new XMLHttpRequest();
				
				fbi_ajax[const_index].open('get', 'https://hs.fbigame.com/ajax.php?mod=deck_decode&index=' + const_index + '&source=nga&deck_code=' + encodeURIComponent(deck_code));
				fbi_ajax[const_index].send();
				fbi_ajax[const_index].onreadystatechange = function() {
					if (fbi_ajax[const_index].readyState == 4 && fbi_ajax[const_index].status == 200) {
						ajax_status = true;
						var fbi_json = JSON.parse(fbi_ajax[const_index].responseText);
						if (fbi_json.ec == 0) {
							if (fbi_json.deck) {
								rebuild_deck_code(fbi_json.deck, fbi_json.index);
							} else {
								console.log('cant find deck');
							}
						} else {
							console.log(fbi_json.em);
						}
					}
				}
			
			} else {
				console.log('deck code empty');
			}
		}
	} else {
		console.log('cant find stat div');
	}
		
}
	
	
function rebuild_deck_code(deck, fbi_json_index) {
	var select_class = '';
	var class_name = '';
	window.all_cards = [];
	var decode_all_cards = '';
	for (var index in deck.cards) {
		for (var i = 0; i < deck.cards[index]; i ++ ) {
			if (decode_all_cards == '') {
				decode_all_cards += index;
			} else {
				decode_all_cards += '|' + index;
			}
		}
	};
	if (decode_all_cards != '') {
		var fbi_ajax = new XMLHttpRequest();
		fbi_ajax.open('get', 'https://hs.fbigame.com/ajax.php?mod=get_cards_detail&source=nga&cards=' + decode_all_cards);
		fbi_ajax.send();
		fbi_ajax.onreadystatechange = function() {
			if (fbi_ajax.readyState == 4 && fbi_ajax.status == 200) {
				var fbi_json = JSON.parse(fbi_ajax.responseText);
				if (fbi_json.ec == 0) {
					if (fbi_json.num > 0) {
						var all_cards = '';
						
						fbi_json.list.forEach(function(value, index, arr) {
							var datas = '';
							datas += 'data-CardID="' + value.CardID + '" ';
							datas += 'id="card_' + value.Id + '" ';
							datas += 'data-CARDNAME="' + value.CARDNAME + '" ';
							datas += 'data-COST="' + value.COST + '" ';
							datas += 'data-RARITY="' + value.RARITY + '" ';
							datas += 'data-auth_key="' + value.auth_key + '" ';
							all_cards += '<li ' + datas + '></li>';
						});
						console.log('cards_rebuild_' + fbi_json_index);
						document.getElementById('cards_rebuild_' + fbi_json_index).innerHTML = all_cards;
						for (var index in deck.cards) {
							for (var i = 0; i < deck.cards[index]; i ++ ) {
								add_to_deck(index, fbi_json_index);
							}
						}
					}
				}
			}
		}
	}
	return true;
}
function add_to_deck(id, index) {
	var card = document.getElementById('card_' + id);
	var cardid = card.attributes["data-cardid"].nodeValue;
	var name = card.attributes["data-cardname"].nodeValue;
	var cost = card.attributes["data-cost"].nodeValue;
	var card_rarity = card.attributes["data-rarity"].nodeValue;
	var auth_key = card.attributes["data-auth_key"].nodeValue;
	
	var rarity = '';
	switch (card_rarity) {
	case '1':
		rarity = 'rarity-free';
		break;
	case '2':
		rarity = 'rarity-free';
		break;
	case '3':
		rarity = 'rarity-rare';
		break;
	case '4':
		rarity = 'rarity-epic';
		break;
	case '5':
		rarity = 'rarity-legendary';
		break;
	}

	if (window.all_cards['"' + id + '"'] > 0) {
		window.all_cards['"' + id + '"'] = window.all_cards['"' + id + '"'] + 1;
		document.getElementById('card_count_' + id).innerHTML = window.all_cards['"' + id + '"'];
		removeClass(document.getElementById('card_countbox_' + id), 'hide');
		addClass(document.getElementById('card-fade-no-countbox_' + id), 'card-fade-countbox');
		removeClass(document.getElementById('card-fade-no-countbox_' + id), 'card-fade-no-countbox');
		document.getElementById('card_asset_' + id).setAttribute('style', 'right: 22px !important');
	} else {
		window.all_cards['"' + id + '"'] = 1;
		if (card_rarity == 5) {
			var num_show = '★';
			var count_box_hide = '';
			var card_fade_countbox = 'card-fade-countbox';
			var card_assets_style = 'right: 22px;';
		} else {
			var num_show = window.all_cards['"' + id + '"'];
			var count_box_hide = 'hide';
			var card_fade_countbox = 'card-fade-no-countbox';
			var card_assets_style = 'right: 0px;';
		}
		var cardinfo = '';
		cardinfo += '<div class="card-tile" name="card_tile" aria-label="' + name + '" data-cardid="' + cardid + '" data-id="' + id + '" data-cost="' + cost + '" data-rarity="' + rarity + '" data-auth_key="' + auth_key + '">';
		cardinfo += '<div class="card-gem ' + rarity + '">';
		cardinfo += '<span class="card-cost" style="font-size: 1.25em;">' + cost + '</span>';
		cardinfo += '</div>';
		cardinfo += '<div class="card-frame">';
		cardinfo += '<img id="card_asset_' + id + '" class="card-asset" src="https://hs.fbigame.com/static/images/tiles/' + cardid + '.png" alt="' + name + '" style="' + card_assets_style + '">';
		cardinfo += '<div id="card_countbox_' + id + '" class="card-countbox ' + count_box_hide + '" style="width: 24px;">';
		cardinfo += '<span id="card_count_' + id + '" class="card-count" data-id="' + id + '" style="font-size: 1.15em; top: 0px;">' + num_show + '</span>';
		cardinfo += '</div>';
		cardinfo += '<span id="' + card_fade_countbox + '_' + id + '" class="' + card_fade_countbox + '" data-id="' + id + '"></span>';
		cardinfo += '<span class="card-name" style="width: calc(100% - 28px);">' + name + '</span>';
		cardinfo += '</div>';
		cardinfo += '</div>';
		
		var ele = document.createElement("div");
		ele.innerHTML = cardinfo;
		document.getElementById('cards_list_' + index).appendChild(ele);
	}
	var card_tiles = document.getElementsByName('card_tile');
	var arr = [];
	for (var i = 0; i < card_tiles.length; i++) {
		arr.push(card_tiles[i]);
		card_tiles[i].addEventListener("mousemove",function(e){
			var iDiffX = e.pageX - this.offsetLeft;
			var iDiffY = e.pageY - this.offsetTop;
			var x = e.clientX - iDiffX + 90;
			var y = e.clientY - iDiffY - 191;
			show_tooltip(this.attributes["data-cardid"].nodeValue, this.attributes["data-auth_key"].nodeValue, x, y);
		},false);
		card_tiles[i].addEventListener("mouseout",function(e){
			hide_tooltip();
		},false);
	}
	arr.sort(function(a,b){
		return a.getAttribute('data-cost') - b.getAttribute('data-cost')
	});
	for(var i = 0; i < arr.length; i ++) {
		document.getElementById('cards_list_' + index).appendChild(arr[i]);
	}
}


function show_tooltip(cardid, auth_key, x, y) {
	var content = '';
	content += '<div id="card-tooltip" class="card-tooltip no-background" role="tooltip" style="left: 506px; top: 118px;">';
	content += '<img class="card-image" src="https://res.fbigame.com/hs/v' + img_ver + '/' + cardid + '.png?auth_key=' + auth_key + '">';
	content += '</div>';
	document.getElementById('tooltip-container').innerHTML = content;
	document.getElementById('card-tooltip').setAttribute('style', 'left: ' + x + 'px !important;top: ' + y + 'px !important');
	document.getElementById('tooltip-container').setAttribute('style', 'display:block');
}
function hide_tooltip() {
	document.getElementById('tooltip-container').setAttribute('style', 'display:none');
}

function addClass(obj, cls) {
    var obj_class = obj.className,
    blank = (obj_class != '') ? ' ': '';
    added = obj_class + blank + cls;
    obj.className = added;
}

function removeClass(obj, cls) {
    var obj_class = ' ' + obj.className + ' ';
    obj_class = obj_class.replace(/(\s+)/gi, ' '),
    removed = obj_class.replace(' ' + cls + ' ', ' ');
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');
    obj.className = removed;
}

function hasClass(obj, cls) {
    var obj_class = obj.className,
    obj_class_lst = obj_class.split(/\s+/);
    x = 0;
    for (x in obj_class_lst) {
        if (obj_class_lst[x] == cls) {
            return true;
        }
    }
    return false;
}