// ==UserScript==
// @name        Torrent9++
// @namespace   https://greasyfork.org/fr/users/11667-aymeric-maitre
// @description Make Torrent9 Better
// @include     http*://*torrents9.*/*
// @include     http*://*torrent9.*/*
// @include     http*://*lemonlemag.*/*
// @include     http*://*guitare-luthier.*/*
// @include     http*://*agence-webside.*/*
// @include     http*://*.t9.*/*
// @include     http*://t9.*/*
// @version     9.0.0
// @grant       none
// @icon        data:image/x-icon;base64,AAABAAIAEBAAAAAAIABoBAAAJgAAACAgAAAAACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAEAEAAAAAAAAAAAAAAAAAAAAAAAAnHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+oi0n/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//b0Ln///////v59//Mu5f/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/pIZB/5x6J/+skVP/7efc/9bJrP+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/6+VWP/8+/r/o4Q6/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//Nvpv//Pv6///////s5tz//f38/7afaf+ceif/nHon/5x6J/+ceif/qo5K/8Kuf/++qHf/nHon/5x6J/+0nGT//Pv6/7ega/+ceif/sJZa//j28//Crn//nHon/5x6J/+ceif/nHon/8Kuf///////9PHr/5x6J/+ceif/ybeL/+zn3f+ceif/nHon/5x6J//49vP/uaNu/5x6J/+ceif/nHon/5x6J//Crn////////Tx6/+ceif/nHon/7ukcf/49vL/oYE2/5x6J/+6pHH/+/n3/6SGPv+ceif/nHon/5x6J/+ceif/wq5////////08ev/nHon/5x6J/+dfC3/4NbA//Pw6v/g18T/+/n4/8aziv+ceif/nHon/5x6J/+ceif/nHon/8Kuf///////9PHr/5x6J/+ceif/nHon/5x6J/+2nmj/v6p6/6yRU/+ceif/nHon/5x6J/+ceif/nHon/5x6J//Crn////////Tx6/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/wq5////////08ev/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//08ev/////////////////////////////////wq5//5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/39bE/+jh1f/o4dX/6OHV/+jh1f/o4dX/6OHV/7mibf+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8AAP//AAD//wAA//8oAAAAIAAAAEAAAAABACAAAAAAAIAQAAAAAAAAAAAAAAAAAAAAAAAAnHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+4onT/sZhl/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+4onT//////////////////////+/q4v++qoP/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/7iidP/////////////////////////////////XzLb/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/qo9T/7GYZf+ceif/nHon/6qPU//RxKv////////////v6uL/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+4onT////////////RxKv/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//d1ML///////Tx7P+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/6qPU////////////7iidP+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/xbOR//Tx7P/////////////////v6uL/xbOR//r49v//////0cSr/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/9fMtv/////////////////////////////////////////////////RxKv/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/++qoP////////////v6uL/sZhl/5x6J/+ceif/sZhl/9fMtv/6+Pb//////+nj2P+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/18y2/+nj2P/p49j/6ePY/9fMtv+ceif/nHon/5x6J/+ceif/nHon/93Uwv//////9PHs/6OFP/+ceif/nHon/5x6J/+ceif/nHon/+nj2P//////6ePY/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//p49j/////////////////6ePY/5x6J/+ceif/nHon/5x6J/+ceif/7+ri///////j283/nHon/5x6J/+ceif/nHon/5x6J/+ceif/6ePY///////d1ML/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/+nj2P/////////////////p49j/nHon/5x6J/+ceif/nHon/5x6J////////////9HEq/+ceif/nHon/5x6J/+ceif/nHon/5x6J//6+Pb//////9HEq/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/6ePY/////////////////+nj2P+ceif/nHon/5x6J/+ceif/nHon/+nj2P//////49vN/5x6J/+ceif/nHon/5x6J/+ceif/uKJ0////////////vqqD/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//p49j/////////////////6ePY/5x6J/+ceif/nHon/5x6J/+ceif/y7ye////////////sZhl/5x6J/+ceif/nHon/6OFP//08ez//////+/q4v+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/+nj2P/////////////////p49j/nHon/5x6J/+ceif/nHon/5x6J/+jhT//7+ri///////6+Pb/18y2/7iidP/LvJ7/9PHs////////////uKJ0/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/6ePY/////////////////+nj2P+ceif/nHon/5x6J/+ceif/nHon/5x6J/+jhT//7+ri////////////////////////////+vj2/8Wzkf+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//p49j/////////////////6ePY/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/xbOR/93Uwv/p49j/3dTC/9HEq/+qj1P/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/+nj2P/////////////////p49j/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/6ePY/////////////////+nj2P+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//p49j/////////////////6ePY/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/+nj2P/////////////////p49j/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/6ePY/////////////////+nj2P+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/6ePY///////////////////////////////////////////////////////////////////////p49j/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J//p49j//////////////////////////////////////////////////////////////////////+nj2P+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/+nj2P//////////////////////////////////////////////////////////////////////6ePY/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/xbOR/9HEq//RxKv/0cSr/9HEq//RxKv/0cSr/9HEq//RxKv/0cSr/9HEq//RxKv/0cSr/9HEq//Fs5H/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/5x6J/+ceif/nHon/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/25365/Torrent9%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/25365/Torrent9%2B%2B.meta.js
// ==/UserScript==
(async function () {
	if (
            location.host.search(/torrents?9\./) < 0 
            && location.host.search(/t9\.pe/) < 0
            && location.host.search(/lemonlemag\.fr/) < 0
            && location.host.search(/agence-webside\.fr/) < 0
            && location.host.search(/guitare-luthier\.fr/) < 0
        ) {
		return;
	}
  if(typeof jQuery === "undefined") {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
    await new Promise(resolve => {
      let inter = setInterval(_ => {
        if (typeof jQuery !== "undefined") {
          clearInterval(inter)
          resolve()
        }
      }, 500)
    })
  }
  var script = document.createElement('script');
  script.src = '/themes/default/js/bootstrap.min.js';
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
  await new Promise(resolve => setTimeout(resolve , 2000))
	function refresh_modal_body(bool) {
		if (debug) console.log('Torrent9++: refresh_modal_body');
		if (bool === undefined)
			modal_save_change = 1;

		var modal = '';
		modal += '<table class="table">';
		modal += '<thead>';
		modal += '<tr>';
		modal += '<th>Words</th>';
		modal += '<th>Color</th>';
		modal += '<th></th>';
		modal += '</tr>';
		modal += '</thead>';
		modal += '<tbody>';

		for (var i = 0; i < colors_data.length; i++) {
			var color = colors_data[i];
			modal += '<tr>';
			modal += '<td><u>' + ((color.word != "__AD_OTHERWORD__") ? ((color.word != "__AD_ALREADYDOWNLOADED__") ? color.word : 'Already downladed') : 'No match (white to disable)') + '</u></td>';
			modal += '<td><input type="color" data-id="'+i+'" value="' + color.color + '"></td>';
			if (color.word != "__AD_OTHERWORD__" && color.word != "__AD_ALREADYDOWNLOADED__")
				modal += '<td><button type="button" data-id="'+i+'" class="AD_remove_color btn btn-danger">Remove</button></td>';
			else if (color.word === "__AD_ALREADYDOWNLOADED__")
				modal += '<td><button type="button" id="AD_EMPTY_LIST" class="btn btn-danger">Empty saved list</button></td>';
			modal += '</tr>';
		}

		modal += '<tr>';
		modal += '<td><input id="AD_new_color_word" type="text"></td>';
		modal += '<td><input id="AD_new_color_color" data-id="new" value="#F89585" type="color"></td>';
		modal += '<td><button type="button" class="AD_add_color btn btn-success">Add</button></td>';
		modal += '</tr>';

		modal += '</tbody>';
		modal += '</table>';

		modal += '<table class="table">';
		modal += '<thead>';
		modal += '<tr>';
		modal += '<th>Option</th>';
		modal += '<th>Status</th>';
		modal += '</tr>';
		modal += '</thead>';
		modal += '<tbody>';

		modal += '<tr>';
		modal += '<td>Color mode</td>';
		modal += '<td><input id="AD_check_enable_color_mode" type="checkbox" value="1" '+((option.enable_color_mode) ? 'checked' : '')+'></td>';
		modal += '</tr>';

		modal += '<tr>';
		modal += '<td>Show images</td>';
		modal += '<td><input id="AD_check_enable_pics" type="checkbox" value="1" '+((option.enable_pics) ? 'checked' : '')+'></td>';
		modal += '</tr>';

		modal += '<tr>';
		modal += '<td>Direct download</td>';
		if (enableQuery === false) {
			modal += '<td style="width: 220px !important;">not compatible with your version</td>';
		} else {
			modal += '<td><input id="AD_check_enable_direct_download" type="checkbox" value="1" '+((option.enable_direct_download) ? 'checked' : '')+'></td>';
		}
		modal += '</tr>';

		modal += '<tr>';
		modal += '<td>Show [SAISON] link</td>';
		modal += '<td><input id="AD_check_enable_show_season" type="checkbox" value="1" '+((option.enable_show_season) ? 'checked' : '')+'></td>';
		modal += '</tr>';

		modal += '<tr>';
		modal += '<td>Short name (length: 54)</td>';
		modal += '<td><input id="AD_check_enable_short_name" type="checkbox" value="1" '+((option.enable_short_name) ? 'checked' : '')+'></td>';
		modal += '</tr>';

		modal += '<tr>';
		modal += '<td>Preview width (in pixel)</td>';
		modal += '<td><input id="AD_change_preview_size" type="number" value="'+((option.preview_size) ? option.preview_size : 150)+'"></td>';
		modal += '</tr>';

		modal += '<tr>';
		modal += '<td>Show description on mouse over</td>';
		if (enableQuery === false) {
			modal += '<td style="width: 220px !important;">not compatible with your version</td>';
		} else {
			modal += '<td><input id="AD_check_enable_description" type="checkbox" value="1" '+((option.enable_description) ? 'checked' : '')+'></td>';
		}
		modal += '</tr>';

		modal += '</tbody>';
		modal += '</table>';
		$('body').find('div#myADColorModal').find('.modal-body').html(modal);
	}

	function gen_modal() {
		if (debug) console.log('Torrent9++: gen_modal');
		var modal = '<div class="modal fade" id="myADColorModal" role="dialog">';
		modal += '<div class="modal-dialog">';
		modal += '<div class="modal-content">';
		modal += '<div class="modal-header">';
		modal += '<button type="button" class="close" data-dismiss="modal">&times;</button>';
		modal += '<h4 class="modal-title">Torrent9++ parameters</h4>';
		modal += '</div>';
		modal += '<div class="modal-body">';
		modal += '</div>';
		modal += '<div class="modal-footer">';
		modal += '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>';
		modal += '</div>';
		modal += '</div></div></div>';
		$("body").prepend(modal);
		refresh_modal_body(1);
	}

	function getTorrentName(url) {
		if (debug) console.log('Torrent9++: getTorrentName');
		var name = url.replace(base_link, "");
		var index = name.indexOf("-proper-");
		if (index != -1) {
			name = name.substring(0, index);
		} else if ((index = name.indexOf("-truefrench-")) != -1) {
			name = name.substring(0, index);
		} else if ((index = name.indexOf("-french-")) != -1) {
			name = name.substring(0, index);
		} else if ((index = name.indexOf("-vostfr-")) != -1) {
			name = name.substring(0, index);
		}
		return name;
	}

	function set_param() {
		if (debug) console.log('Torrent9++: set_param');
		colorblue = 'rgb(133, 183, 248)';

		index = 0;
		modal_save_change = 0;
		allTorrentLink = [];

		base_link = '/get_torrent/';
		base_img = '/_pictures/';


		added_style = "";
		img_link = "";
		lien = "";

		colors_data = JSON.parse(localStorage.getItem("AD_colors_data"));
		option = JSON.parse(localStorage.getItem("AD_OPTION"));
		alreadyDownloaded = JSON.parse(localStorage.getItem("AD_ALREADY_DOWNLOADED") || "[]");

		if (option === null)
		{
			option = {
				enable_pics: true,
				enable_direct_download: true,
				enable_color_mode: true,
				enable_short_name: true,
				enable_description: true,
				preview_size: 100,
				enable_show_season: true
			};
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
		}

		if (option.enable_show_season === undefined)
			option.enable_show_season = true;

		if (option.preview_size === undefined)
			option.preview_size = 150;

		if (option.enable_short_name === undefined)
			option.enable_short_name = true;

		if (option.enable_description === undefined)
			option.enable_description = true;

		if (colors_data === null)
		{
			colors_data = [
				{word: "__AD_OTHERWORD__", color: "#FFFFFF"}, // #4AE77E
				{word: "__AD_ALREADYDOWNLOADED__", color: "#f4b942"},
				{word: "DVDSCR", color: "#F89585"},
				{word: "VOSTFR", color: "#F89585"},
				{word: " VO ", color: "#F89585"},
				{word: " TS ", color: "#F89585"}
			];
			localStorage.setItem("AD_colors_data", JSON.stringify(colors_data));
		}

		if (enableQuery === false) {
			option.enable_direct_download = false;
			option.enable_description = false;
		}
	}

	function main() {
		if (debug) console.log('Torrent9++: main');
		set_param();
		if (option.enable_pics) {
			$("<style type='text/css'>.table-bordered.cust-table > tbody > tr > td:nth-child(3) {color: #000;}.table-bordered.cust-table > tbody > tr > td:nth-child(4) {color: #008f0d;}.table-bordered.cust-table > tbody > tr > td:nth-child(5) {color: #b94309;}.table-bordered.cust-table > tbody > tr > td:nth-child(2) { text-align: left;}</style>").appendTo("head");
		}
		if ($("thead").length === 0) {
			$('tbody').each(function (){
				var thead = '<thead><tr>';
				if(option.enable_pics)
					thead +='<th class="col-md-1">Image</th>';
				thead +='<th class="">Nom du torrent</th>';
				thead +='<th style="width:90px">Taille</th>';
				thead +='<th style="width:100px">Seed</th>';
				thead +='<th style="width:100px">Leech</th>';
				if(option.enable_direct_download)
					thead +='<th class="col-md-1" style="white-space: nowrap;"><a href="#" id="AD_download_all_link" style="/*! font-size: 12px; */">Download All</a></th>';
				thead +='</tr></thead>';
				$(this).parent().prepend(thead);
			});
		}
		else
		{
			$('thead > tr').each(function (){
				var trow = $(this);
				if(option.enable_direct_download)
					trow.append('<th class="col-md-1" style="white-space: nowrap;"><a href="#" id="AD_download_all_link" style="/*! font-size: 12px; */">Download All</a></th>');
				if(option.enable_pics)
					trow.prepend('<th class="col-md-1">Image</th>');
			});
		}
		$('tbody > tr').each(function (){
			var trow = $(this);
			var Current_Link = trow.find('td').first().find('a');
			trow.find('td').each(function (){
				$(this).css('white-space', 'nowrap');
				if(option.enable_pics)
					$(this).css('height', option.preview_size/2.5*3+'px').css('line-height', option.preview_size/2.5*3+'px');
			});
			if (Current_Link.length > 0) {
				if (option.enable_color_mode)
				{
					var edited = 0;
					for (var i = 0; i < colors_data.length; i++)
					{
						if (colors_data[i].word == "__AD_OTHERWORD__")
							colorother = colors_data[i].color;
						else if (colors_data[i].word == "__AD_ALREADYDOWNLOADED__")
							colorAlreadyDownloaded = colors_data[i].color;
						else
						{
							var keyword = Current_Link.text().search(colors_data[i].word);
							if (keyword != - 1)
							{
								trow.css('background-color', colors_data[i].color);
								edited = 1;
							}
						}
					}
					if (!colorAlreadyDownloaded) {
						colors_data.push({word: "__AD_ALREADYDOWNLOADED__", color: "#f4b942"});
						colorAlreadyDownloaded = "#f4b942";
					}

					if (alreadyDownloaded.indexOf(getTorrentName(Current_Link.attr('href').split("/").slice(3).join("/"))) != -1) {
						trow.css('background-color', colorAlreadyDownloaded);
						edited = 1;
					}

					if (edited === 0 && colorother != "#FFFFFF" && colorother != "#ffffff" && colorother != "rgb(255, 255, 255)")
						trow.css('background-color', colorother);
				}
				if (option.enable_show_season) {
					var serie_data = Current_Link.text().match(/(.+)\sS(\d{2})E\d{2}.*(FRENCH|VOSTFR)/);
					if (serie_data !== null && serie_data.length == 4) {
                        var quality = "";
                        if (Current_Link.text().indexOf("720p") >= 0){
                            quality = "-720p";
                        } else if (Current_Link.text().indexOf("1080p") >= 0){
                            quality = "-1080p";
                        }
						var tmp_link = '/search_torrent/series-'+serie_data[3]+'/'+serie_data[1].replace(/[\W_]+/g,"-").trim()+'-s'+serie_data[2]+quality+'.html';
                        tmp_link = tmp_link.replace(/series-FRENCH/, 'series-francaise').toLowerCase().replace(/ /g, '-');
						trow.find('td').first().append(' <a href="' + BASE_URL+tmp_link + '">[S'+serie_data[2]+']</a>');
					}
				}
				var lien_split = Current_Link.attr('href').split("/");
				var LINK_title = lien_split[lien_split.length - 1];
				var LINK_id = lien_split[lien_split.length - 2];
				img_link = base_img + LINK_title + ".jpg";
				var $tmpIng;

				if(option.enable_pics)
				{
                    trow.prepend(
                        $('<tr>').append(
                            $('<a>')
                            .attr('href', Current_Link.attr('href'))
                            .attr('target','_blank')
                                .append(
                                    $tmpIng = $('<img>')
                                    .attr('title','Download')
                                    .attr('src', BASE_URL +img_link)
                                    .attr('style','width: '+option.preview_size+'px;')
                                )
                        )
                    );
					added_style = "height: 50px; line-height: 50px; ";
				}
				if (option.enable_direct_download || option.enable_description) {
					$.get(Current_Link.attr('href'), function(data) {
						var html = $.parseHTML( data );
						if(option.enable_direct_download) {
							var liens = $('a.btn.btn-danger.download', html);
                            liens.each(function( index ) {
                                lien = $( this ).attr("href");
                                if (lien.indexOf("/register/") < 0 && (lien.indexOf(location.host) >= 0 || (lien.indexOf("http://") < 0 && lien.indexOf("https://") < 0))){
                                    return false;
                                }
                                lien = undefined;
                            });
                            /*
                            if (lien.indexOf("/register/") >= 0){
                                var links = $('.movie-detail a', html);
                                for(i = 2; i < links.length; i++){
                                    lien = $(links[i]).attr('href');
                                    if (lien.indexOf("/register/") < 0){
                                        break;
                                    }
                                    lien = undefined;
                                }
                            }
                            */
                            if (lien) {
							    allTorrentLink.push({ download : lien, url: Current_Link.attr('href') });
							    trow.append('<td style="white-space: nowrap;'+ added_style +'"><a id="AD_download_link" title="Download" href="'+BASE_URL+lien+'" target="_blank" style="color:#000; font-size:12px; font-weight:bold;">Download</a></td>');
						    }
						}
						if(option.enable_description) {
							$('div.movie-information ul', html).remove();
              var description = $("div.movie-information", html).text().trim();
							if(!description){
								console.error("Torrent9++: Fail load description for", Current_Link.attr('href'));
                
            $('html').html(data)
								trow.attr('title', "Description non trouvé");
							} else {
								trow.attr('title', description);
							}
						}
						if(option.enable_pics) {
							$tmpIng.attr('src', $('div.movie-img img', html).attr('src'));
						}
					}).fail(function (r){console.error('Torrent9++: request error');});
				}
				if (option.enable_short_name && Current_Link.text().length > 51) {
					Current_Link.text(
						Current_Link.text()
							.replace('FRENCH','')
							.replace('VOSTFR','')
							.replace('DVDRIP','')
							.replace('BluRay','')
							.slice(0,54) + "..."
					);
				}
			} else {
				console.error('Torrent9++: No current link');
			}


			index++;
		});

		$('tr').mouseover(function () {
			if ($(this).parent().first()[0].localName != "thead") {
				colorstat = $(this).css('background-color');
				$(this).css('background-color', colorblue);
			}
		});

		$('tr').mouseout(function () {
			if ($(this).parent().first()[0].localName != "thead") {
				if (colorstat != "rgb(194, 226, 231)")
					$(this).css('background-color', colorstat);
				else
					$(this).css('background-color', '');
			}
		});

		$("body").on("click", "div.movie-detail div.row div.col-sm-6 div.download-btn a",function (event) {
			var name = getTorrentName(location.href.split("/")[5]);
			if (alreadyDownloaded.indexOf(name) == -1) {
				alreadyDownloaded.push(name);
				localStorage.setItem("AD_ALREADY_DOWNLOADED", JSON.stringify(alreadyDownloaded));
			}
		});

		$("body").on('click', '#AD_download_link', function(event) {
			$(this).parent().parent().css('background-color', colorAlreadyDownloaded);
			colorstat = colorAlreadyDownloaded;
			var name = getTorrentName($(this).parent().parent().find('td a').first().attr("href").split("/")[3]);
			if (alreadyDownloaded.indexOf(name) == -1) {
				alreadyDownloaded.push(name);
				localStorage.setItem("AD_ALREADY_DOWNLOADED", JSON.stringify(alreadyDownloaded));
			}
		});

		$("body").on('click', '#AD_download_all_link', function(event) {
			event.preventDefault();
			var myVar = setInterval(function(){ myTimer(); }, 1000);
			var allTorrentLink_i = allTorrentLink.length - 1;
			function myTimer() {
				if (allTorrentLink_i < 0) {
					clearInterval(myVar);
					return;
				}
				open(window.location.origin+allTorrentLink[allTorrentLink_i].download, "_blank");

				var name = getTorrentName(allTorrentLink[allTorrentLink_i].url.split("/")[3]);

				if (alreadyDownloaded.indexOf(name) == -1) {
					alreadyDownloaded.push(name);
					localStorage.setItem("AD_ALREADY_DOWNLOADED", JSON.stringify(alreadyDownloaded));
				}

				allTorrentLink_i--;
			}
		});

		$("body").on('change', '#AD_check_enable_pics', function(event) {
			option.enable_pics = !option.enable_pics;
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('change', '#AD_change_preview_size', function(event) {
			option.preview_size = $(this).val();
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('click', '#AD_EMPTY_LIST', function(event) {
			localStorage.setItem("AD_ALREADY_DOWNLOADED", "[]");
			var names = "";
			for(var k = 0; k < alreadyDownloaded.length; k++){
				names += alreadyDownloaded[k].url.replace(/-/g, " ") + "\n";
			}
			alert("List emptied:\n"+names);
			location.reload();
		});

		$("body").on('change', '#AD_check_enable_direct_download', function(event) {
			option.enable_direct_download = !option.enable_direct_download;
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('change', '#AD_check_enable_show_season', function(event) {
			option.enable_show_season = !option.enable_show_season;
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('change', '#AD_check_enable_short_name', function(event) {
			option.enable_short_name = !option.enable_short_name;
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('change', '#AD_check_enable_description', function(event) {
			option.enable_description = !option.enable_description;
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('change', '#AD_check_enable_color_mode', function(event) {
			option.enable_color_mode = !option.enable_color_mode;
			localStorage.setItem("AD_OPTION", JSON.stringify(option));
			refresh_modal_body();
		});

		$("body").on('click', '.AD_remove_color', function(event) {
			event.preventDefault();
			if (confirm("Sur ?")) {
				colors_data.splice($(this).data('id'), 1);
				localStorage.setItem("AD_colors_data", JSON.stringify(colors_data));
				refresh_modal_body();
			}
		});
		$("body").on('click', '.AD_add_color', function(event) {
			event.preventDefault();
			var $tr = $(this).parent().parent();
			var new_color = {
				word: $tr.find('#AD_new_color_word').val(),
				color: $tr.find('#AD_new_color_color').val()
			};
			if (new_color.word.trim() !== "" && new_color.color.trim() !== "") {
				colors_data.push(new_color);
				localStorage.setItem("AD_colors_data", JSON.stringify(colors_data));
				refresh_modal_body();
			}
		});
		$("body").on('change', 'input[type="color"]', function(event) {
			if ($(this).data('id') != "new") {
				if ($(this).val().trim() !== "") {
					colors_data[$(this).data('id')].color = $(this).val();
					localStorage.setItem("AD_colors_data", JSON.stringify(colors_data));
					refresh_modal_body();
				}
			}
		});
		$("body").on('click', '*[data-dismiss="modal"]', function(event) {
			if (modal_save_change)
				location.reload();
		});
		gen_modal();
		$("ul.nav.navbar-nav").append($('<li><a href="#">Torrent9++</a></li>').click(e => {
      e.preventDefault();
      $("#myADColorModal").modal('show')
    }));
	}

	// declaration des variable
    var BASE_URL;

	var debug = true;
	var colorblue;

	var index;
	var modal_save_change;
	var colorstat;
	var allTorrentLink;

	var base_link;
	var base_img;


	var added_style;
	var img_link;
	var lien;

	var colors_data ;
	var option;
	var alreadyDownloaded;

	var colorother;
	var colorAlreadyDownloaded;

	// jquery
	var $ = jQuery.noConflict(true);

	if ($("div.header-top a.link_logo").length < 1 && $("div.header-top .logo").length < 1) {
		return;
	}
    BASE_URL = location.origin.replace('ww1', 'www')+'/';
	if (document.querySelector("div#myADColorModal"))
	{
		if (debug) console.log('Torrent9++:Already executed');
		return 1;
	}
	if (debug) console.log('Torrent9++: Execution in progress...');

	// test de compatibilite
	var enableQuery = false;

	var test_link= $('a[href*="/torrent/"]');
	if ($('a[href*="/torrent/"]')) {
		if (debug) console.log('Torrent9++: compatibility testing..');
		$.get($('a[href*="/torrent/"]').first().attr('href'), function () {
			enableQuery = true;
			main();
		}).fail(function (){
			main();
		});
	} else {
		main();
	}

	if (debug) console.log('Torrent9++: Loaded');

})();