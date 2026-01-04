// ==UserScript==
// @name         Faction Filter
// @namespace    https://greasyfork.org/en/scripts/375473-faction-filter
// @version      1.3.2
// @description  Enables filters to remove/hide people from a faction page.
// @author       Cryosis7 [926640]
// @match        https://www.torn.com/factions.php?step=profile&*ID=*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/398406/Faction%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/398406/Faction%20Filter.meta.js
// ==/UserScript==

const ACTIVITY = [
    'offline',
    'idle',
    'online',
    'active'
];
const STATUS = [
    'okay',
    'hospital',
    'traveling',
    'jail',
];
var filters = {
    activity: 'offline',
    level: 0,
    days: 0,
    status: 'okay',
};

$(window).load(initialise)

function update() {
    $(".member-list").children().each(filterMember);
}

/**
 * Hides the current element(a player) based on the supplied filters
 */
function filterMember() {
    let player = createPlayer(this);

    // Checking the filters
    let show = true;
    let checkboxes = $(".filter-container").find("input[type='checkbox']");
    $(checkboxes).each(function() {
        if ($(this).prop('checked')) {
            if (this.name === 'activity') {
                if (filters.activity === 'active') {
                    if (player.activity === 'offline')
                        show = false;
                } else if (filters.activity !== player.activity)
                    show = false;
            } else if (this.name === 'status') {
                if (filters.status !== player.status)
                    show = false;
            } else if (this.name === 'level' || this.name === 'days') {
                if (parseInt(filters[this.name]) < parseInt(player[this.name]))
                    show = false;
            }
        }
    });

    if (show)
        $(this).show();
    else
        $(this).hide();
}

/**
 * Returns an object with the stats as values (keys are the same as 'filters').
 * @param {the element containing the player, found under '.player-info'} playerElement
 */
function createPlayer(playerElement) {
    return {
        activity: $(playerElement).find("#iconTray li.iconShow").prop("title").replace(/(<\/?b>)/g, "").toLowerCase(),
        level: parseInt($(playerElement).find(".lvl").text().match(/\d+/g)[0]),
        days: parseInt($(playerElement).find(".days").text().match(/\d+/g)[0]),
        status: $(playerElement).find(".status").children().last().text().toLowerCase()
    }
}

/**
 * Initiation function that creates the filter bar and adds it to the dom.
 */
function initialise() {
    addStyles();
    drawFilterBar();
    setInitialValue();
    $(".filter-button").click();
}

/**
 * Creates and draws the filter bar onto the dom
 */
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
    $(".faction-info-wrap").last().before(element); // <- Adding to the dom.

    // Adding a checkbox listener to disable/enable the filters.
    $('input[type=checkbox]').change(function() {
        $('.filter-button').click();
    });

    // Adding a listbox listener to update when changed.
    $(element).find('select').change(function() {
        if ($(`input[type=checkbox][name=${this.name}]`).prop('checked'))
            $('.filter-button').click();
    });

    // Adding a listener to the filter button.
    $('.filter-button').click(function() {
        let storedFilters = {}
        $("input[type='checkbox']").each(function() {
            if ($(this).prop('checked')) {
                if (this.name === 'activity' || this.name === 'status')
                    filters[this.name] = storedFilters[this.name] = $(`select[name='${this.name}']`).val();
                else if (this.name === 'level' || this.name === 'days') {
                    let input = parseInt($(`input[type='text'][name='${this.name}']`).val());
                    if (input !== NaN && input >= 0)
                        filters[this.name] = storedFilters[this.name] = input;
                    else
                        $(`input[type='text'][name='${this.name}']`).val('');
                }
            }
        });

        GM_setValue('storedFilters', storedFilters)
        update();
    });
}

/**
 * Appends the html filter options for each of the filters.
 * @param {The filter box to add the elements to} element
 */
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

    // Days + Level Textboxes
    for (let i = 1; i < 3; i++) {
        let filter = Object.keys(filters)[i];
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

    // Status Listboxes
    let statusElement = $(`
  <span style="padding-right: 15px">
    <select class="listbox" name="status"></select>
    <input type="checkbox" name="status" style="transform:translateY(25%)"/>
  </span>`);
    STATUS.forEach(x => {
        $(statusElement).children(".listbox").append(`<option value=${x}>${x[0].toUpperCase() + x.substr(1)}</option>`);
    });
    $(element).children(".cont-gray").append(statusElement);

    return element
}

/**
 * Retrieves the initial values last used out of the cache and sets them
 */
function setInitialValue() {
    let storedFilters = GM_getValue('storedFilters', {});
    let filterContainer = $(".filter-container")

    for (let filter in storedFilters) {
        let domFilter = $(filterContainer).find(`[name="${filter}"]`);
        domFilter.eq(0).val(storedFilters[filter]);
        domFilter.eq(1).prop('checked', true);
    }
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