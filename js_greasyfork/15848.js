// ==UserScript==
// @name            Auto_bids
// @author          ZIKYN ILIA
// @description     Автоматические ставки
// @version         1.3
// @include         *csgodouble.com/
// @include         *csgodouble.com/index.php
// @encoding 	    utf-8
// @namespace       https://greasyfork.org/ru/scripts/15848-auto-bids
// @homepage        https://greasyfork.org/ru/scripts/15848-auto-bids
// @downloadURL https://update.greasyfork.org/scripts/15848/Auto_bids.user.js
// @updateURL https://update.greasyfork.org/scripts/15848/Auto_bids.meta.js
// ==/UserScript==

(function (window, undefined) {
	var w;
	if (typeof unsafeWindow != undefined) {
		w = unsafeWindow
	} else {
		w = window;
	}
	if (w.self != w.top) {
		return;
	}

	// Пользовательские настройки
	system = 0; // 0 - играем на нулях, 1 - на красное-чёрное

	if (system == 0) {
		start_from = 0; // Начинать ставить на нули, если прошло столько не нулей. Максимум - 9
		max_bids = 69; // Прекратить ставить и остановить скрипт после такого количества невыпадений
	} else if (system == 1) {
		max_bids = 9; // Прекратить ставить и остановить скрипт после такого количества невыпадений
	}

	var signal = new Audio();
	signal.src = 'http://www.flashkit.com/imagesvr_ce/flashkit/soundfx/Interfaces/Beeps/Electro_-S_Bainbr-7955/Electro_-S_Bainbr-7955_hifi.mp3';
	var r_search_player_id = new RegExp('<img class=\\"rounded\\" src=\\".*?\\"> <b>click-dick<\\/b> <span class=\\"caret\\">','i');
	stats = '';

	if (searchId(r_search_player_id)) {
		var start_btn = document.createElement('input');
		var stop_btn = document.createElement('input');
		var stats_btn = document.createElement('input');
		var message = document.createElement('div');
		var wrap_stats = document.createElement('div');
		var div_stats = document.createElement('div');
		start_btn.id = 'start_btn';
		stop_btn.id = 'stop_btn';
		stats_btn.id = 'stats_btn';
		message.id = 'message';
		wrap_stats.id= 'wrap_stats';
		div_stats.id = 'div_stats';
		message.style.float = 'left';
		message.style.margin = '6px 0 0 7px';
		wrap_stats.style.display = 'none';
		wrap_stats.style.height = '100%';
		wrap_stats.style.left = '0px';
		wrap_stats.style.position = 'absolute';
		wrap_stats.style.top = '0px';
		wrap_stats.style.width = '100%'; 
		wrap_stats.style.zIndex = '1001';
		div_stats.style.background = '#ffffff';
		div_stats.style.boxShadow = '0px 0px 15px 0px #000000';
		div_stats.style.display = 'none';
		div_stats.style.height = '300px';
		div_stats.style.left = w.innerWidth/2-150+'px';
		div_stats.style.overflow = 'auto';
		div_stats.style.position = 'fixed';
		div_stats.style.top = w.innerHeight/2-150+'px';
		div_stats.style.width = '300px';
		div_stats.style.zIndex = '1002';

		message.innerHTML = 'Готов';
		start_btn.className = 'btn btn-default';
		stop_btn.className = 'btn btn-default';
		stats_btn.className = 'btn btn-default';
		start_btn.type = 'button';
		stop_btn.type = 'button';
		stats_btn.type = 'button';
		start_btn.value = 'Старт';
		stop_btn.value = 'Стоп';
		stats_btn.value = 'Статс';
		start_btn.addEventListener('click', function() {startBids();}, false);
		stop_btn.addEventListener('click', function() {
			clearInterval(intervalID);
			document.getElementsByClassName('form-control input-lg')[0].value = '';
			document.getElementById('message').innerHTML = 'Остановлено';
		}, false);
		stats_btn.addEventListener('click', function() {
			document.getElementById('div_stats').innerHTML = stats;
			document.getElementById('wrap_stats').style.display = 'block';
			document.getElementById('div_stats').style.display = 'block';
		}, false);
		wrap_stats.addEventListener('click', function() {
			document.getElementById('wrap_stats').style.display = 'none';
			document.getElementById('div_stats').style.display = 'none';
		}, false);
		document.getElementsByClassName('btn-group')[0].appendChild(start_btn);
		document.getElementsByClassName('btn-group')[0].appendChild(stop_btn);
		document.getElementsByClassName('btn-group')[0].appendChild(stats_btn);
		document.getElementsByClassName('btn-group')[0].appendChild(message);
		document.getElementsByTagName('html')[0].appendChild(wrap_stats);
		document.getElementById('wrap_stats').appendChild(div_stats);
	}


	function startBids() {
		last_id = '0';
		bids = 0;
		last_bids = 0;
		r_search_rollid = new RegExp('data-rollid=\\"(\\d+)\\"','gi');

		red = document.getElementsByClassName('btn btn-danger btn-lg  btn-block betButton')[0];
		zero = document.getElementsByClassName('btn btn-success btn-lg  btn-block betButton')[0];
		black = document.getElementsByClassName('btn btn-inverse btn-lg  btn-block betButton')[0];

		bid_start = document.getElementsByClassName('form-control input-lg')[0].value;
		total_red = document.getElementsByClassName('mytotal')[0].innerHTML;
		total_zero = document.getElementsByClassName('mytotal')[1].innerHTML;
		total_black = document.getElementsByClassName('mytotal')[2].innerHTML;

		document.getElementById('message').innerHTML = 'Запущено';

		bid();
		intervalID = setInterval(bid, 2000);
	}

	function bid() {
		var arr_rollid = w.document.documentElement.innerHTML.match(r_search_rollid);
		var new_id = arr_rollid[9].substr(13, 6);

		if ((last_id != new_id || bids == 0) && (red.disabled == false && zero.disabled == false && black.disabled == false)) {
			last_id = new_id;
			var bid_zero = false;

			if (system == 1) {
				for (var i = 9; i >= 0; i--) {
					if (document.getElementById('past').getElementsByTagName('div')[i].className == 'ball ball-1') {
						put_on = 'black';
						break;
					} else if (document.getElementById('past').getElementsByTagName('div')[i].className == 'ball ball-8') {
						put_on = 'red';
						break;
					} else if (document.getElementById('past').getElementsByTagName('div')[i].className == 'ball ball-0') {
						bid_zero = true;
						continue;
					}
				}

				if (bids == 0 && w[put_on].disabled == false && w['total_'+put_on] == '0') {
					bid_color = put_on;
					document.getElementsByClassName('form-control input-lg')[0].value = bid_start;
					last_bids = bid_start;
					w[bid_color].click();
					bids++;
				} else if (bids <= (max_bids-1) && w[put_on].disabled == false && w['total_'+put_on] == '0') {
					if (bid_zero == false && bid_color != put_on) {
						bids = 0;
						last_bids = bid_start;
					} else if (bid_color == put_on) {
						last_bids = last_bids*2;
						document.getElementsByClassName('form-control input-lg')[0].value = last_bids;
						w[bid_color].click();
						bids++;
					}
				} else if (bids > (max_bids-1)) {
					document.getElementById('message').innerHTML = 'Не совпало '+max_bids+' раз';
					clearInterval(intervalID);
					document.getElementsByClassName('form-control input-lg')[0].value = '';
					bids = 0;
				}
			} else if (system == 0) {
				for (var i = 9; i >= ((10-start_from)-1); i--) {
					if (document.getElementById('past').getElementsByTagName('div')[i].className == 'ball ball-0') {
						bid_zero = true;
						break;
					}
				}
				if (!bid_zero && w['total_zero'] == '0' && bids<=max_bids) {
					if (bids==0) last_bids=bid_start;
					document.getElementsByClassName('form-control input-lg')[0].value = last_bids;
					document.getElementById('message').innerHTML = 'Поставили '+(bids+1)+' раз';
					w['zero'].click();
					bids++;
					if (bids==13) last_bids=bid_start*2;
					if (bids>13 && (bids-1) % 7==0) last_bids=last_bids*2;
				} else if (bids>max_bids) {
					clearInterval(intervalID);
					document.getElementById('message').innerHTML = 'Не совпало '+max_bids+' раз';
					document.getElementsByClassName('form-control input-lg')[0].value = '';
					bids = 0;
					stats += max_bids+'<br/>';
				} else if (bid_zero && bids != 0) {
					document.getElementsByClassName('form-control input-lg')[0].value = bid_start;
					document.getElementById('message').innerHTML = 'Ждём '+start_from+' пропусков от нуля';
					stats += (bids-1)+'<br/>';
					bids = 0;
				}
			}
		}
	}

	function searchId(r) {
		if (w.document.documentElement.innerHTML.search(r) != -1) {
			return true;
		} else {
			return false;
		}
	}
})(window);