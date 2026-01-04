// ==UserScript==
// @name        make mal less bad
// @namespace   thewildsun
// @include     http://myanimelist.net/people/*
// @include     https://myanimelist.net/people/*
// @version     1.7
// @grant       none
// @require https://code.jquery.com/jquery-1.12.4.js
// @description on staff page, 1. add option to filter anime to those on user's list only (must be logged in) 2. add staff filter by role (e.g., Director) 3. bold rows where voice actor has main role 4. add row numbers
// @downloadURL https://update.greasyfork.org/scripts/420292/make%20mal%20less%20bad.user.js
// @updateURL https://update.greasyfork.org/scripts/420292/make%20mal%20less%20bad.meta.js
// ==/UserScript==

(async function() {  
  
	var $profile = $('a.header-profile-link');
	var TEXT_SHOW_FILTERED = 'Show from My List Only';
	var $allTr = $('a[href*="/anime/"]').closest('tr');
  
  console.log('allTr!', $allTr);

	var $series = [];
	var $filterCheckbox;

	var $staffHeader = $('div.normal_header:contains("Anime Staff Positions")');
	var $staffTable = $staffHeader.next('table');
	
	var $smalls = $('td.borderClass > div.spaceit_pad > small', $staffTable);
	var $staffTr = $smalls.closest('tr');
	var $voiceTr = $allTr.not($staffTr);

	function callback() {

		var $toShow = $allTr;

		var role = $selectRole.val();
    
		if (role) {
			$toShow = $($voiceTr);
			$.merge($toShow, getStaffFilteredRows(role));
		}
    
		if ($filterCheckbox) {
			if ($filterCheckbox.is(':checked')) {
				if ($toShow.length > 0) {

					var $listFilteredRows = getListFilteredRows($series);

					$toShow = $toShow.filter($listFilteredRows);
					$.merge($toShow, $listFilteredRows.not($staffTr))
				}
				else {
					$toShow = getListFilteredRows($series);
				}

			}
		}

		$('td.voiceActingRolesIndex').remove();

		$allTr.hide();
		$toShow.fadeIn();
    
    console.log('allTr', $allTr);
    console.log('toShow', $toShow);

		$('a[href*="/anime/"]:visible').closest('tr').each(function(i) {
			$(this).prepend('<td class="voiceActingRolesIndex">'+(i+1)+'</td>');
		});
	}

	function getListFilteredRows($series) {

		var $toShow = $([]);

		for (var i = 0; i < $series.length; i++) {
			$.merge($toShow, $('a[href*="/anime/'+($series[i])+'/"]').closest('tr'));
		}

		return $toShow;
	}

	function getStaffFilteredRows(role) {
		return $smalls.filter(function(){return this.innerHTML == role}).closest('tr');
	}

	// bold main roles
	$('div.spaceit_pad:contains("Main")').closest('tr').css('font-weight', 'bold');

	// select staff role
	var $selectRole = $('<select>', {id: 'selectRole', 'style': 'margin-left:5px'});
	var opts = 	(function(arr) {
				    var a = [];
				    for (var i=0, l=arr.length; i<l; i++)
				        if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
				            a.push(arr[i]);
				    return a;
				})($smalls.map(function(){return $(this).text()}));

	opts.sort();

	// populate select with roles
	$selectRole.append($('<option>', {value: ''}).text('All'));
	$.each(opts, function() { $selectRole.append($('<option>', {value: this}).text(this)); })

	$selectRole.change(callback);

	$staffHeader.append($selectRole);

	// filter to show anime from my list
	if ($profile.length > 0) {
		var username = $profile.text();
    
    let offset = 0;

    while(true) {
      console.log('offset',offset);
			let response = await fetch(`https://myanimelist.net/animelist/${username}/load.json?offset=${offset}`);
      let data = await response.json();
      console.log('data',data);
      if (data.length === 0) {
        console.log('break?');
        break;
      }
      
      $series = $series.concat(data.map(anime => anime.anime_id));
      offset += 300;
    }
    
    console.log('$series',$series);
    $filterCheckbox = $('<input>', {'type': 'checkbox', 'checked': 'checked'}).click(callback);

    var $label = $('<label>').text(TEXT_SHOW_FILTERED);
    $label.prepend($filterCheckbox);

    $('div#horiznav_nav').after($label);

    $selectRole.trigger('change');
		
	} else {
		$selectRole.trigger('change');
	}
})();