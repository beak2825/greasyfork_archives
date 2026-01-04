// ==UserScript==
// @name         Faction Filter
// @namespace    https://greasyfork.org/en/scripts/375473-faction-filter
// @version      1.6
// @description  Enables filters to remove/hide people from a faction page.
// @author       Cryosis7 [926640]
// @match        https://www.torn.com/factions.php?step=profile&*ID=*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/375473/Faction%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/375473/Faction%20Filter.meta.js
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
    status: 'okay',
    position: undefined,
};

$(document).ready(initialise)

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
 * Updates the player list based on the currently selected filters.
 */
function update() {
    document.querySelectorAll('#faction-info-members ul.table-body li.table-row').forEach(playerElement => {
        let player = {
            activity: playerElement.querySelector('.member li.iconShow').title.replace(/<\/?b>/g, "").toLowerCase(),
            level: playerElement.querySelector('.lvl').textContent.replace(/\D/g, ''),
            status: playerElement.querySelector(".status span").textContent.toLowerCase(),
            position: playerElement.querySelector('.ellipsis').textContent,
        }

        let show = true;
        document.querySelectorAll('.filter-container input[type="checkbox"]').forEach(checkbox => {
            if (checkbox.checked) {
                if (checkbox.name === 'activity') {
                    if (filters.activity === 'active') {
                        if (player.activity === 'offline')
                            show = false;
                    }
                    else if (filters.activity !== player.activity)
                        show = false;
                } else if (checkbox.name === 'status') {
                    if (filters.status !== player.status)
                        show = false;
                } else if (checkbox.name === 'level') {
                    if (filters.level < parseInt(player[checkbox.name]))
                        show = false;
                } else if (checkbox.name === 'position') {
                    if (filters.position !== player.position)
                        show = false;
                }
            }
        });

        if (show)
            $(playerElement).show();
        else
            $(playerElement).hide();
    });
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
    $("#faction-info-members").before(element); // <- Adding to the dom.

    // Adding a checkbox listener to disable/enable the filters.
    $('input[type=checkbox]').change(function () {
        $('.filter-button').click();
    });

    // Adding a listbox listener to update when changed.
    $(element).find('select').change(function () {
        if ($(`input[type=checkbox][name=${this.name}]`).prop('checked'))
            $('.filter-button').click();
    });

    // Adding a listener to the filter button.
    $('.filter-button').click(function () {
        let storedFilters = {}
        document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
            if (checkbox.checked) {
                if (checkbox.name === 'activity' || checkbox.name === 'status' || checkbox.name === 'position')
                    filters[checkbox.name] = storedFilters[checkbox.name] = document.querySelector(`select[name='${checkbox.name}']`).value;
                else if (checkbox.name === 'level') {
                    let input = parseInt(document.querySelector(`input[type='text'][name='level']`).value);
                    if (input !== NaN && input >= 0)
                        filters.level = storedFilters.level = input;
                    else
                        document.querySelector(`input[type='text'][name='level']`).value = '0';
                }
            }
        });

        GM_setValue('storedFilters', storedFilters)
        update();
    });
}

/**
 * Appends the html filter options for each of the filters.
 * @param {element} element The element to append the filters to.
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
    let filterElement = $(`
      <span style="padding-right: 15px">
        <label>Level:</label>
        <input type="text" name="level" class="textbox" value="0"/>
        <input type="checkbox" name="level" style="transform:translateY(25%)"/>
      </span>
      `);
    $(element).children(".cont-gray").append(filterElement);

    // Status Listbox
    let statusElement = $(`
    <span style="padding-right: 15px">
        <select class="listbox" name="status"></select>
        <input type="checkbox" name="status" style="transform:translateY(25%)"/>
    </span>`);
    STATUS.forEach(x => {
        $(statusElement).children(".listbox").append(`<option value=${x}>${x[0].toUpperCase() + x.substr(1)}</option>`);
    });
    $(element).children(".cont-gray").append(statusElement);

    // Position Listbox
    let positionElement = $(`
    <span style="padding-right: 15px">
        <select class="listbox" name="position"></select>
        <input type="checkbox" name="position" style="transform:translateY(25%)"/>
    </span>`);
    let positions = Array
        .from(document.querySelectorAll('.table-row .ellipsis'))
        .map(element => element.textContent)
        .filter((value, index, array) => array.indexOf(value) === index);
    positions.forEach(x => {
        $(positionElement).children(".listbox").append(`<option value=${x}>${x}</option>`);
    });
    $(element).children(".cont-gray").append(positionElement);

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