// ==UserScript==
// @name        TM Clean UI
// @namespace   https://trophymanager.com
// @match       https://trophymanager.com/*
// @grant       none
// @version     0.6
// @author      lorde_jim
// @description 7/7/2023, 8:23:11 AM
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/470319/TM%20Clean%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/470319/TM%20Clean%20UI.meta.js
// ==/UserScript==

(function () {
    'use strict';

const WIN_COLOR = '#44ac45';
	const DRAW_COLOR = 'darkorange';
	const LOSE_COLOR = '#eb3f30';
	const UPCOMING_COLOR = 'grey';
	const LAST_MATCHES = 5;
	const LAST_HEADER = "Form";
	const WIN = 'W';
	const DRAW = 'D';
	const LOSE = 'L';
	const UPCOMING = '?'

	let first = true;
	let startMatchIndex = 0;
	let teams = [];

	[...document.querySelector('#overall_table').querySelectorAll('tr')]
	.forEach((row, i) => {
		if (!i) return;
		row.style.height = '24px';
	})

	function addTableHeader() {
		let header = $('#overall_table thead tr');
		let streak = document.createElement('TH');
		let arrowLeft = document.createElement('IMG');
		arrowLeft.src = 'https://trophymanager.com/pics/cf_mini_arrow_left.png';
		arrowLeft.style.marginRight = '4px'
		arrowLeft.addEventListener('click', () => {
			if(startMatchIndex > -1) {
				startMatchIndex -= LAST_MATCHES;
				// if (startMatchIndex < 0) startMatchIndex = 0;
				applyResults(startMatchIndex)
			}
		})
		streak.appendChild(arrowLeft);
		let contentEl = document.createElement('SPAN');
		contentEl.textContent = LAST_HEADER;
		streak.appendChild(contentEl);
		let arrowRight = document.createElement('IMG');
		arrowRight.src = 'https://trophymanager.com/pics/cf_mini_arrow_right.png';
		arrowRight.style.marginLeft = '4px'
		arrowRight.addEventListener('click', () => {
			if (startMatchIndex < 29) {
				startMatchIndex += LAST_MATCHES;
				applyResults(startMatchIndex)
			}
		})
		streak.appendChild(arrowRight);
		$(streak).addClass('align_center');
		$(streak).addClass('header');

		header.append(streak);
	}

	function generateMatchsHistory() {
		let url = $('.content_menu .calendar').attr('href').split(`/`).filter(el => el.length);
		const params = {
			'type': url[1],
			'var1': url[2],
			'var2': url.length > (3) ? url[3] : '',
			'var3': url.length > (4) ? url[4] : ''
		};
		$.post('/ajax/fixtures.ajax.php', params, data => {
			if (data != null) {
				const keys = Object.keys(data);
				let matches = [];
				keys.forEach(key => matches = [...matches, ...data[key].matches]);
				teams = matches.reduce((carry, item) => {
					let hometeam = carry.find(team => team.id === item.hometeam);
					let awayteam = carry.find(team => team.id === item.awayteam);

					if (hometeam) hometeam.matches.push(item)
					else carry.push({id: item.hometeam, name: item.hometeam_name, matches: [item], element: null})

					if (awayteam) awayteam.matches.push(item);
					else carry.push({id: item.awayteam, name: item.awayteam_name, matches: [item], element: null})

					return carry;
				}, []);
				applyResults();
			}
		}, 'json');
	}

	function adjustHighlight(row) {
		row.children().last().removeClass('highlight_td_right');
	}

	function adjustBorder(cell) {
		cell.removeClass('highlight_td_right_std');
	}

	function getTeamResults(team) {
		let results = [];
		const start = startMatchIndex < 0 ? 0 : startMatchIndex;
		team.matches.slice(start, startMatchIndex + LAST_MATCHES).forEach(match => {
			let result = {};
			let otherTeam = null;
			const isHome = match.hometeam === team.id;
			if (isHome) {
				otherTeam = teams.find(team => team.id === match.awayteam);
			} else {
				otherTeam = teams.find(team => team.id === match.hometeam);
			}
			result.element = otherTeam.element;
			if (match.result) {
				let score = match.result.split('-');
				score[0] = parseInt(score[0]);
				score[1] = parseInt(score[1]);
				result.tooltip = match.hometeam_name + ' ' + match.result + ' ' + match.awayteam_name;
				result.matchLink = $(match.match_link).attr('href');
				if (score[0] > score[1])
					result.result = isHome ? WIN : LOSE;
				else if (score[0] < score[1])
					result.result = isHome ? LOSE : WIN;
				else
					result.result = DRAW;
			} else {
                result.matchLink = $(match.match_link).attr('href');
				result.tooltip = match.hometeam_name + ' - ' + match.awayteam_name;
				result.result = UPCOMING
			}
			results.push(result);
		})
		return results;
	}
    const nodes = document.querySelector('.column2_a').querySelector('.box_body').childNodes;
    document.querySelector('.column2_a').querySelector('.box_body').querySelector('.std').style.margin = '0';
    document.querySelector('.column2_a').querySelector('.box_body').querySelector('.std').style.padding = '0';
    document.querySelector('.column2_a').querySelector('.box_footer').remove();
    document.querySelector('.column2_a').querySelector('.box_body').style.marginBottom = '8px';
    nodes[9].remove();
    document.querySelector('#overall_table').classList.remove('border_bottom');
    [...document.querySelectorAll('#overall_table tbody tr')]
        .forEach((row, i) => {
        row.addEventListener('mouseover', event => {
            event.preventDefault();
        });
        row.style.height = '32px';

        const columns = [...row.querySelectorAll('td')];
        columns.forEach(column => {
            column.classList.remove('border_right', 'highlight_td_left', 'highlight_td_right');
        });
        columns[1].style.paddingLeft = '8px';
        columns[1].querySelector('img').style.marginRight = '4px';
        let standingsColumn = columns[0];
        standingsColumn.classList.remove('align_right');
        standingsColumn.classList.add('align_center');
        if(!i) standingsColumn.style.backgroundColor = '#007700';
        if(i && i < 4) standingsColumn.style.backgroundColor = 'rgb(19, 90, 19)';
        if(i > 9 && i < 14) standingsColumn.style.backgroundColor = 'rgb(111, 19, 19)';
        if(i > 13) standingsColumn.style.backgroundColor = "#990000";
        let pointsColumn = columns[8];
        pointsColumn.classList.remove('align_right', 'border_right');
        pointsColumn.classList.add('align_center');
        pointsColumn.style.fontWeight = 'bold';
        row.classList.remove('promotion');
        row.classList.remove('promotion_playoff');
        row.classList.remove('relegation_playoff');
        row.classList.remove('relegation');
        row.style.backgroundColor = i % 2 ? 'rgb(48, 48, 48)' : 'rgb(34, 34, 34)';

    });
	function applyResults(index = null) {
		[...document.querySelectorAll('#overall_table tbody td a')]
		.forEach(teamEl => {
			const id = teamEl.getAttribute('club_link');
			if (!id) return;
			let team = teams.find(team => team.id === id);
			team.element = teamEl.parentElement.parentElement;
		});
		[...document.querySelectorAll('#overall_table tbody td a')]
		.forEach((teamEl, i) => {
			const id = teamEl.getAttribute('club_link');
			if (!id) return;
			let team = teams.find(team => team.id === id);
			const lastMatchIndex = team.matches.findIndex(match => !match.result);
			startMatchIndex = index !== null ? index : lastMatchIndex - LAST_MATCHES;
            if(startMatchIndex < 0) startMatchIndex = 0;
			let results = getTeamResults(team);
			let streak = null;
			if (first) {
				let row = teamEl.parentElement.parentElement;

				adjustBorder($(row).children().last());
				if ($(row).children().first().hasClass('highlight_td')) {
					adjustHighlight($(row));
				}
				streak = row.insertCell(-1);
				$(streak).addClass('cell_padding');
				$(streak).css('display', 'flex');
				$(streak).css('justify-content', 'space-between');
				$(streak).css('align-items', 'center');
				$(streak).css('height', '32px');
				$(streak).css('padding', '0 6px');
				$(streak).css('font-size', '12px');
				$(streak).css('letter-spacing', '2px');
				$(streak).css('cursor', 'default');
				$(streak).disableSelection();

				if ($(row).children().first().hasClass('highlight_td')) {
					$(streak).addClass('highlight_td');
				}
			} else {
				let row = teamEl.parentElement.parentElement;
				streak = row.lastChild;
			}
			appendSchedule(streak, results);
		});
		if (first) {
			addTableHeader();
		}
		first = false;
	}

	const appendSchedule = (streak, results) => {
		streak.innerHTML = '';
		for (const result of results) {
			let res = document.createElement('A');
			res.style.display = 'block';
			res.style.color = 'white';
			res.style.borderRadius = '2px';
			res.style.width = '16px';
			res.style.height = '16px';
			res.style.textAlign = 'center';
			res.style.paddingLeft = '2px';
			res.style.paddingBottom = '2px';
			res.style.cursor = 'pointer';
			$(res).attr('href', result.matchLink);
			$(res).attr('target', '_blank');
			$(res).attr('title', result.tooltip);
			res.addEventListener('mouseover', () => {
				[...result.element.querySelectorAll('td')].forEach(column => column.classList.add('promotion'))
			})
			res.addEventListener('mouseleave', () => {
				[...result.element.querySelectorAll('td')].forEach(column => column.classList.remove('promotion'))
			})
			switch (result.result) {
				case WIN:
					$(res).css('background-color', WIN_COLOR);
					res.textContent = 'W';
					break;
				case DRAW:
					$(res).css('background-color', DRAW_COLOR);
					res.textContent = 'D';
					break;
				case LOSE:
					$(res).css('background-color', LOSE_COLOR);
					res.textContent = 'L';
					break;
				case UPCOMING:
					$(res).css('background-color', UPCOMING_COLOR);
					res.textContent = '?';
					break;
				default:
					break;
			}
			streak.appendChild(res);
		}
	}

	generateMatchsHistory();

  function enlargeTable() {
    $('div.main_center').css('width', '1100px');
    $('.column2_a').css('width', '590px');
  }

  enlargeTable()


  /**
   * Show team logos
   */
  let teamIds = []
  function getAllTeamIds() {
    $('#overall_table').find('[club_link]').each(function(index, team) {
      teamIds.push($(team).attr('club_link'))
    })

    teamIds.map(loadTeam)
  }

  getAllTeamIds()

  /**
   * Load team information
   */
  function loadTeam(id) {
    $.post('/ajax/tooltip.ajax.php', {club_id: id}, data => {
			if (data != null) {
				const logo = data.club.logo_url
        $('#overall_table [club_link="' + id + '"]').parent().prepend('<img src="' + logo + '" width="26px" height="26px" />')
        $('#overall_table [club_link="' + id + '"]').parent().html('<div style="display: flex;align-items: center;gap: 4px;">' + $('#overall_table [club_link="' + id + '"]').parent().html() + '</div>')
			}
		}, 'json');
  }
})();