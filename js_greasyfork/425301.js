// ==UserScript==
// @name         Hospital Filter [modified]
// @namespace    https://greasyfork.org/en/scripts/425301-hospital-filter-modified
// @version      0.4
// @description  Enables filters to remove/hide people from the hospital. modification: adds self hosped and RR filters for mugging
// @author       Cryosis7 [926640], modified by WhiskeyJack
// @match        *.torn.com/hospitalview.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/425301/Hospital%20Filter%20%5Bmodified%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/425301/Hospital%20Filter%20%5Bmodified%5D.meta.js
// ==/UserScript==

const ACTIVITY = [
	'offline',
	'idle',
	'online',
	'active'
];

var filters = GM_getValue('storedFilters') || {
	activity: 'active',
	time: '0h 0m',
	level: 0,
	chk: {
		activity: false,
		time: false,
		level: false,
		selfHosped: false
	}
};
var selfHospedStatus = ["Suffering from an acute hemolytic transfusion reaction",
	"Got a nasty surprise in the post.",
	"Fallen ill with radiation poisoning"];

$(document).ready(initialise)

function update() {
	$(".users-list").children().each(filterMember);
}

// Hides the current element(a player) based on the supplied filters
function filterMember() {
	let player = createPlayer(this);
	if (!player) {
		//console.log('problem with player');
		return
	}
	let show = true;
	if (filters.chk.activity) {
		if (filters.activity == 'active' && player.activity == 'offline')
			show = false;
		else if (filters.activity != 'active' && filters.activity != player.activity)
			show = false;
	}
	if (filters.chk.time && compareTime(player.time,filters.time))
		show = false;
	if (filters.chk.level && (parseInt(filters.level) > parseInt(player.level)))
		show = false;
	if (filters.chk.selfHosped && !selfHospedStatus.includes(player.status))
		show = false;
	if (filters.chk.RR && !player.status.includes("Shot themselves in the foot"))
		show = false;
	if (show)
		$(this).show();
	else
		$(this).hide();
}

// Returns an object with the stats as values (keys are the same as 'filters').
// @param {the element containing the player, found under '.player-info'} playerElement
function createPlayer(playerElement) {
	if (!$(playerElement).find("#iconTray li.iconShow").prop("title"))
		return;
	let time = $(playerElement).find("span.time").text();
	time = time.match(/\d{1,2}s/g) ? '0m' : time.match(/(\d{1,2}h )?(\d{1,2}m)/g)[0] // seconds would break this before
	return {
		activity: $(playerElement).find("#iconTray li.iconShow").prop("title").replace(/(<\/?b>)/g, "").toLowerCase(),
		level: parseInt($(playerElement).find("span.level").text().match(/\d+/g)[0]),
		time: time,
		status: $(playerElement).find("span.reason").text().substring(8)
	}
}

function initialise() {
	addStyles();
	drawFilterBar();
	setInitialValue();
	setObserver();
}

function setObserver() {
	var observer = new MutationObserver(filtersUpdated);
	observer.observe(document.querySelector('ul.users-list'), { attributes: true, childList: true });
}

// Creates and draws the filter bar onto the dom
function drawFilterBar() {
	// Creating the filter bar and adding it to the dom.
	let element = $(`
	  <div class="filter-container m-top10">
		<div class="title-gray top-round">Select Filters</div>

		<div class="cont-gray p10 bottom-round">
		  <button class="torn-btn right filter-button">Filter</button>
		</div>
	  </div>`);

	element = addFilterElements(element);
	$(".msg-info-wrap").after(element); // <- Adding to the dom.

	// Adding a checkbox listener to disable/enable the filters.
	$('input[type=checkbox]').change(filtersUpdated);

	// Adding a listbox listener to update when changed.
	$(element).find('select').change(function() {
		if ($(`input[type=checkbox][name=${this.name}]`).prop('checked'))
			filtersUpdated();
	});

	// Adding a listener to the filter button.
	$('.filter-button').click(filtersUpdated);
}

function filtersUpdated() {
	$(".filter-container input[type='checkbox']").each(function() {
		filters.chk[this.name] = $(this).prop('checked');
	});

	filters.activity = $(`select[name='activity']`).val();

	let usersTime = convertToTime($(`input[type='text'][name='time']`).val());
	usersTime = usersTime == null ? '0h 0m' : usersTime
	filters.time = usersTime;
	$(`input[type='text'][name='time']`).val(usersTime);

	let usersLevel = parseInt($(`input[type='text'][name='level']`).val());
	usersLevel = (usersLevel == NaN && usersLevel < 0) ? 0 : usersLevel;
	filters.level = usersLevel;
	$(`input[type='text'][name='${this.name}']`).val(usersLevel);

	GM_setValue('storedFilters', filters);
	update();
}

// Appends the html filter options for each of the filters.
// @param {The filter box to add the elements to} element
function addFilterElements(element) {
	// Activity Listbox
	let activityElement = $(`
	  <span style="padding-right: 15px">
		<select class="listbox" name="activity"></select>
		<input type="checkbox" name="activity" style="transform:translateY(25%)"/>
	  </span>`);
	ACTIVITY.forEach(x => {
		$(activityElement).children(".listbox").append(`<option value=${x}>${x[0].toUpperCase() + x.substr(1)}</option>`);
	});
	$(element).children(".cont-gray").append(activityElement);

	// Time + Level Textboxes
	for (let v of ['time', 'level']) {
		let filter = v;
		let filterElement = $(`
		  <span style="padding-right: 15px">
			<label>${filter[0].toUpperCase() + filter.substr(1)}:
			<input type="text" name="${filter}" class="textbox" value="${filters[filter]}"/>
			<input type="checkbox" name="${filter}" style="transform:translateY(25%)"/>
			</label>
		  </span>
		  `);
		$(element).children(".cont-gray").append(filterElement);
	}

	// Self Hosped Checkbox
	$(element).children(".cont-gray").append(`
		  <span style="padding-right: 15px">
			<label>Self Hosped:
			<input type="checkbox" name="selfHosped" style="transform:translateY(25%)"/>
			</label>
		  </span>
		  `);

	// Mugged Checkbox
	$(element).children(".cont-gray").append(`
		  <span style="padding-right: 15px">
			<label>RR:
			<input type="checkbox" name="RR" style="transform:translateY(25%)"/>
			</label>
		  </span>
		  `);

	return element;
}

// Retrieves the initial values last used out of the cache and sets them
function setInitialValue() {
	for (let filter in filters) {
		if (filter == 'chk') {
			$(".filter-container").find(`[name="selfHosped"]`).prop('checked', filters.chk.selfHosped);
			$(".filter-container").find(`[name="RR"]`).prop('checked', filters.chk.mugged);
			continue;
		}
		let domFilter = $(".filter-container").find(`[name="${filter}"]`);
		domFilter.eq(0).val(filters[filter]);
		domFilter.eq(1).prop('checked', filters.chk[filter]);
	}
}

// Compares two time values, which are strings in 'XXh XXm' format and returns true if T1 > T2.
function compareTime(time1, time2) {
	let t1 = time1.replace(/[m ]/gi, '').split('h');
	let t2 = time2.replace(/[m ]/gi, '').split('h');
	t1 = t1.map(x => parseInt(x));
	t2 = t2.map(x => parseInt(x));
	if (t1.length === 1) t1.unshift(0);
	if (t2.length === 1) t2.unshift(0);

	if (t1[0] === t2[0])
		return t1[1] > t2[1];
	else return t1[0] > t2[0];
}

// Scrubs the users time input to a correct time value. Returns null if invalid input.
// @param {The time to be converted} time
function convertToTime(time) {
	if (/^(\d{1,2}[hm]? ?){1,2}$/.test(time)) {
		time = time.toLowerCase().replace(/[m ]/gi, '')
		time = time.split('h');
		if (time.length == 1) time.unshift('');
		time = time.map(x => x == '' ? '0' : x);
		return time.join('h ') + 'm';
	}
	return null;
}

function addStyles() {
	GM_addStyle(`
	  .textbox {
		padding: 5px;
		border: 1px solid #ccc;
		width: 40px;
		text-align: left;
		height: 16px;
	  }
	  .listbox {
		padding: 5px;
		border: 1px solid #ccc;
		border-radius: 5px;
		text-align: left;
	  }
	  `);
}