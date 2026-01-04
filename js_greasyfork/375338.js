// ==UserScript==
// @name         Hall-Of-Fame Filter
// @namespace    https://greasyfork.org/en/scripts/375338-hall-of-fame-filter
// @version      0.3.1
// @description  Allows filters for the Hall Of Fame
// @author       cryosis7 [926640]
// @match        *.torn.com/halloffame.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375338/Hall-Of-Fame%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/375338/Hall-Of-Fame%20Filter.meta.js
// ==/UserScript==


$(window).load(function() {

    var filters = {};

    initialise();

    function updateHOF() {
        // First identify if the headings have changed and the filters need to be updated.
        let headingWrapper = $('.table-titles').children().splice(2, 4);
        let headings = [];
        $(headingWrapper).each(function(i) {
            let heading = $(this).text().toLowerCase();
            headings.push(heading.replace(/[^a-z ]/gi, ''));
        });

        let keys = Object.keys(filters);
        for (let i = 0; i < 4; i++) {
            if (keys[i] != headings[i]) {
                resetFilters();
                $(".filter-container").remove();
                drawFilterBar();
                $(".filter-button").click();
                break;
            }
        }

        let playerList = $(".players-list").children();

        $(playerList).each(filterHOF);
    }

    /**
     * Hides the child(the current player) based on the supplied filters
     * @param {The index of a child element from the parent class defined with '.players-list'} index 
     */
    function filterHOF(index) {
        let playerData = $(this).find(".player-info").children().splice(3, 4);
        let player = createPlayer($(playerData));

        // Is the player above or below the filters
        let show = true;
        for (let key in filters) {
            let fValue = parseInt(filters[key]);
            let pValue = parseInt(player[key]);
            if (fValue && fValue < pValue)
                show = false;
        }

        if (show)
            $(this).show();
        else
            $(this).hide();
    }

    /**
     * Returns an object with the visible fields as keys and values.
     * @param {the raw data about the player, found under '.player-info'} rawData 
     */
    function createPlayer(rawData) {
        // Getting the headings
        let headingWrapper = $('.table-titles').children().splice(2, 4);
        let headings = [];
        $(headingWrapper).each(function(i) {
            let heading = $(this).text().toLowerCase();
            headings.push(heading.replace(/[^a-z ]/gi, ''));
        });

        // Getting the stats
        let data = [];
        $(rawData).each(function(index) {
            let str = $(this).text().replace(/\D/g, '');
            data.push(str);
        });

        let player = {};
        for (let i = 0; i < 4; i++)
            player[headings[i]] = data[i];

        return player;
    }

    /**
     * Initiation function to be run at the beginning.
     */
    function initialise() {
        // Initiates the filters equal to the players, if found.
        resetFilters();
        addStyles();
        drawFilterBar();

        // Will set up observer to watch the rank list and update when changed.
        const playerList = $(".hall-of-fame-list-wrap")[0];
        var observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.addedNodes.length > 0)
                    updateHOF();
            }
        });

        observer.observe(playerList, {
            childList: true
        });

        $(".filter-button").click();
    }

    function resetFilters() {
        filters = {};
        const playerRawData = $(".bg-green").find(".player-info").children().splice(3, 4);
        if (playerRawData.length > 0) {
            filters = createPlayer(playerRawData);
        } else {
            let headings = [];
            let headingWrapper = $('.table-titles').children().splice(2, 4);
            $(headingWrapper).each(function(i) {
                let heading = $(this).text().toLowerCase();
                headings.push(heading.replace(/[^a-z ]/gi, ''));
                headings.forEach(x => filters[x] = 0);
            });
        }
    }

    function drawFilterBar() {
        let HOFContainer = $(".hall-of-fame-wrap").first();
        let delimiter = $(HOFContainer).find("hr[class|='delimiter']");

        // Creating the filter bar and adding it to the dom.
        let element = $(`
    <div class="filter-container">
      <div class="title-gray top-round">Select Filters</div>
      
      <div class="cont-gray p10 bottom-round">
        <button class="torn-btn right filter-button">Filter</button>
      </div>
    </div>`);

        element = addFilterElements(element);
        $(delimiter).after(element); // <- Adding to the dom.

        // Adding a checkbox listener to disable the textbox's.
        $('input[type=checkbox]').change(function() {
            $(`input[type='text'][name='${this.name}']`).prop('disabled', !this.checked);
            $('.filter-button').click();
        });

        // Adding a listener to the filter button.
        $('.filter-button').click(function() {
            // Assigning Values or Setting to 0
            $("input[type='checkbox']").each(function(index) {
                if ($(this).prop('checked'))
                    filters[this.name] = $(`input[type='text'][name='${this.name}']`).val();
                else
                    filters[this.name] = 0;
            });

            updateHOF();
        });
    }

    /**
     * Appends the html filter options for each of the current filters.
     * @param {The filter box to add the elements to} element 
     */
    function addFilterElements(element) {
        for (let filter in filters) {
            let filterElement = $(` 
        <span style="padding-right: 10px">     
          <label>${filter[0].toUpperCase() + filter.substr(1)}:
          <input type="text" name="${filter}" class="textbox" value="${filters[filter]}" disabled/>
          <input type="checkbox" name="${filter}" style="transform:translateY(25%)"/>
          </label>
        </span>
        `);
            $(element).children(".cont-gray").append(filterElement);
        }
        return element
    }

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
})