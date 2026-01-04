// ==UserScript==
// @name         Race Filter
// @namespace    https://greasyfork.org/en/scripts/389105-race-filter
// @version      0.2.2
// @description  Filter out long, private or priced races.
// @author       cryosis7 [926640]
// @match        https://www.torn.com/loader.php?sid=racing
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/389105/Race%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/389105/Race%20Filter.meta.js
// ==/UserScript==

const RACE_LENGTH = ['all', 'long', 'short'];
const PASSWORD = ['all', 'protected', 'public'];

$(document).ready(function() {
    var filters = GM_getValue('filters', {
        'raceLength': 'all',
        'passwordProtected': 'all',
        'minimumFee': '',
        'maximumFee': ''
    })
    var enabledFilters = GM_getValue('enabledFilters', {
        'raceLength': false,
        'passwordProtected': false,
        'joinFee': false
    });

    addStyles();
    createObserver();

    /**
     * Creates an observer that is triggered when the 'custom events' race tab is clicked.
     */
    function createObserver() {
        const raceContainer = $('#racingAdditionalContainer')[0];
        var observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                let customEventsWrap = $(mutation.addedNodes).filter('.custom-events-wrap');
                if ($(customEventsWrap).length > 0) {
                    $(mutation.addedNodes).filter('#racingAdditionalContainer').remove();
                    drawFilterBar(customEventsWrap);
                    filterRaces();
                }
            }
        });

        observer.observe(raceContainer, {
            childList: true
        });
    }

    /**
     * Applies the filters to the race list and hides any race that does not meet the criteria
     */
    function filterRaces() {
        let raceList = $('.events-list').children().not('.clear');
        $(raceList).each((index, race) => {
            let showRace = true;
            let checkboxes = $(".filter-container").find("input:checked");

            $(checkboxes).each((i, x) => {
                if (showRace) {
                    switch (x.name) {
                        case 'raceLength':
                            if ((filters.raceLength === 'long' && race.className === '') ||
                                (filters.raceLength === 'short' && race.className === 'long-time'))
                                showRace = false;
                            break;
                        case 'passwordProtected':
                            if ((filters.passwordProtected === 'protected' && race.className !== 'protected') ||
                                (filters.passwordProtected === 'public' && race.className === 'protected'))
                                showRace = false;
                            break;
                        case 'joinFee':
                            let joinFee = $(race).find('.fee').text().replace(/\D/g, "");
                            if ((filters.minimumFee != "" && parseInt(joinFee) < parseInt(filters.minimumFee)) ||
                                (filters.maximumFee != "" && parseInt(joinFee) > parseInt(filters.maximumFee)))
                                showRace = false;
                            break;
                    }
                }
            });

            if (showRace) $(race).show();
            else $(race).hide();
        });
    }

    /**
     * Draws the filter bar and adds it
     * @param {HTMLDivElement} customEventsWrap
     * The parent element that contains all the races. 
     */
    function drawFilterBar(customEventsWrap) {
        let filterBar = $(`
      <div class="filter-container m-top10">
        <div class="title-gray top-round">Select Filters</div>
        
        <div class="cont-gray p10 bottom-round">
          <button class="torn-btn right filter-button">Filter</button>
        </div>
      </div>`);

        addListboxes(filterBar);
        $(customEventsWrap).before(filterBar);

        // Adding a checkbox listener to disable/enable the filters.
        $(filterBar).find('input[type=checkbox]').change(function() {
            $('.filter-button').click();
        });

        // Adding a listbox listener to update when changed.
        $(filterBar).find('select').change(function() {
            ($(`input[type=checkbox][name=${this.name}]`).prop('checked', true))
            $('.filter-button').click();
        });

        // Adding a listener to the filter button.
        $('.filter-button').click(function() {
            $("input[type='checkbox']").each(function(index) {
                if ($(this).prop('checked')) {
                    switch (this.name) {
                        case 'raceLength':
                        case 'passwordProtected':
                            filters[this.name] = $(`select[name='${this.name}']`).val().toLowerCase();
                            break;
                        case 'joinFee':
                            filters.minimumFee = $('input[name="minimumFee"]').val().replace(/\D/g, "");
                            filters.maximumFee = $('input[name="maximumFee"]').val().replace(/\D/g, "");
                            break;
                    }
                }
            });

            for (let filterKey in enabledFilters)
                enabledFilters[filterKey] = $('.filter-container').find(`input[name="${filterKey}"]`).prop('checked');

            GM_setValue('filters', filters);
            GM_setValue('enabledFilters', enabledFilters);
            filterRaces();
        });
        fillFilters();
    }

    /**
     * Fills out the filter bar with the filters
     */
    function fillFilters() {
        let filterContainer = $(".filter-container");

        for (let filterKey in filters) {
            let domFilter = $(filterContainer).find(`[name="${filterKey}"]`);
            domFilter.eq(0).val(filters[filterKey]);
        }

        for (let filterKey in enabledFilters) {
            if (enabledFilters[filterKey])
                $(filterContainer).find(`input[name="${filterKey}"]`).prop('checked', true);
        }
    }

    /**
     * Adds the listboxes and their options to the filterbar.
     * @param {FilterBarElement} filterBar 
     * The filterbar that is being created
     */
    function addListboxes(filterBar) {
        let lengthElement = $(`
    <span style="padding-right: 15px">
      <label style="padding-right: 5px">Race Length</label>
      <select class="listbox" name="raceLength"></select>
      <input type="checkbox" name="raceLength" style="transform:translateY(25%)"/>
    </span>`);
        RACE_LENGTH.forEach(x => {
            $(lengthElement).children(".listbox").append(`<option value=${x}>${x[0].toUpperCase() + x.substr(1)}</option>`);
        });
        $(filterBar).children(".cont-gray").append(lengthElement);

        let passwordElement = $(`
    <span style="padding-right: 15px">
      <label style="padding-right: 5px">Password</label>
      <select class="listbox" name="passwordProtected"></select>
      <input type="checkbox" name="passwordProtected" style="transform:translateY(25%)"/>
    </span>`);
        PASSWORD.forEach(x => {
            $(passwordElement).children(".listbox").append(`<option value=${x}>${x[0].toUpperCase() + x.substr(1)}</option>`);
        });
        $(filterBar).children(".cont-gray").append(passwordElement);

        $(filterBar).children(".cont-gray").append($(`
    <span style="padding-right: 15px">
      Minimum: $
      <input type="text" name="minimumFee" size="4" style="margin-right:5px; padding: 2px"></select>
      Maximum: $
      <input type="text" name="maximumFee" size="4" style="margin-right: 5px; padding: 2px"></select>
      <input type="checkbox" name="joinFee" style="transform:translateY(25%)"/>
    </span>`));
    }

    /**
     * Adds some CSS styling required for the filter box.
     */
    function addStyles() {
        GM_addStyle(`
    .textbox {
      padding: 5px;
      border: 1px solid #ccc;
      width: 74px;
      text-align: left;
      height: 14px;
    }
    `);
    }
});