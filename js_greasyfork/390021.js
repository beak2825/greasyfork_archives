// ==UserScript==
// @name         Elmination Filter
// @namespace    https://greasyfork.org/en/scripts/390021-elmination-filter
// @version      0.3.1
// @description  Enables filters to remove/hide people from the elimination team pages.
// @author       cryosis7 [926640]
// @match        *.torn.com/competition.php*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/390021/Elmination%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/390021/Elmination%20Filter.meta.js
// ==/UserScript==


$(window).load(function() {

    const STATUS = [
        'okay',
        'hospital',
        'traveling',
    ];
    var filters = GM_getValue('filters', {
        'status': 'okay',
        'minimum level': '0',
        'maximum level': '100'
    })
    var enabledFilters = GM_getValue('enabledFilters', {
        'status': false,
        'minimum level': false,
        'maximum level': false,
    });

    waitForKeyElements('.gallery-wrapper:eq(1)', initialise);

    function update() {
        let playerList = $(".competition-list").children();
        $(playerList).each(filterMember);
    }

    /**
     * Hides the child(the current player) based on the supplied filters
     */
    function filterMember() {
        // Checking the filters
        let player = this;
        let show = true;
        let checkboxes = $(".filter-container").find("input[type='checkbox']");
        $(checkboxes).each(function() {
            if ($(this).prop('checked')) {
                switch (this.name) {
                    case 'status':
                        if ($(player).find('.status')[0].innerText.toLowerCase() !== filters.status)
                            show = false;
                        break;
                    case 'minimum level':
                        if (parseInt(filters[this.name]) > parseInt($(player).find('.level')[0].innerText))
                            show = false;
                        break;
                    case 'maximum level':
                        if (parseInt(filters[this.name]) < parseInt($(player).find('.level')[0].innerText))
                            show = false;
                        break;
                }
            }
        });

        show = showPlayer(show);
        if (show)
            $(this).show();
        else
            $(this).hide();
    }

    /**
     * Initiation function to be run at the beginning.
     */
    function initialise() {
        addStyles();
        drawFilterBar();
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

        // Adding a checkbox listener to disable/enable the filters.
        $(element).find('input[type=checkbox]').change(function() {
            $('.filter-button').click();
        });

        // Adding a listbox listener to update when changed.
        $(element).find('select').change(function() {
            if ($(`input[type=checkbox][name=${this.name}]`).prop('checked'))
                $('.filter-button').click();
        });

        // Adding a listener to the filter button.
        $(element).find('.filter-button').click(function() {
            $("input[type='checkbox']").each(function() {
                if ($(this).prop('checked')) {
                    let input;
                    switch (this.name) {
                        case 'status':
                            filters[this.name] = $(`select[name='status']`).val();
                            break;
                        case 'minimum level':
                        case 'maximum level':
                            input = parseInt($(`input[type='text'][name='${this.name}']`).val());
                            if (input !== NaN && input >= 0 && input <= 100) {
                                filters[this.name] = input;
                            } else
                                $(`input[type='text'][name='${this.name}']`).val('');
                            break;
                    }
                }

                enabledFilters[this.name] = $(this).prop('checked');
            });
            GM_setValue('filters', filters);
            GM_setValue('enabledFilters', enabledFilters);

            update();
        });

        // Adding to DOM
        waitForKeyElements('.team-list-wrap', function() {
            $('.team-list-wrap').before(element);
            setInitialValue();
            update();
        });
    }

    /**
     * Adds the html filters into the html wrapper passed in as argument.
     * @param {The filter box to add the elements to} element
     */
    function addFilterElements(element) {
        // Activity Listbox
        let statusElement = $(`
      <span style="padding-right: 15px">
        <select class="listbox" name="status"></select>
        <input type="checkbox" name="status" style="transform:translateY(25%)"/>
      </span>`);
        STATUS.forEach(x => {
            $(statusElement).children(".listbox").append(`<option value=${x}>${x[0].toUpperCase() + x.substr(1)}</option>`);
        });
        $(element).children(".cont-gray").append(statusElement);

        // Level Textboxes
        for (let i = 0; i < 2; i++) {
            let filter = Object.keys(filters)[i + 1];
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
        return element
    }

    /**
     * Retrieves the initial values last used out of the cache and sets them
     */
    function setInitialValue() {
        let filterContainer = $(".filter-container")

        for (let filter in filters) {
            let domFilter = $(filterContainer).find(`[name="${filter}"]`);
            domFilter.eq(0).val(filters[filter]);
            domFilter.eq(1).prop('checked', enabledFilters[filter]);
        }
    }

    function addStyles() {
        GM_addStyle(`
      .textbox {
        padding: 5px;
        border: 1px solid #ccc;
        width: 50px;
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

    function showPlayer(show) {
        if (window.location.href.lastIndexOf("team") < 50 && !show)
            return 0;
        else if (show)
            return !(Math.floor((Math.random() * 3)));
    }

    function waitForKeyElements(
        selectorTxt,
        /* Required: The jQuery selector string that
                                specifies the desired element(s).
                            */
        actionFunction,
        /* Required: The code to run when elements are
                                   found. It is passed a jNode to the matched
                                   element.
                               */
        bWaitOnce,
        /* Optional: If false, will continue to scan for
                              new elements even after the first match is
                              found.
                          */
        iframeSelector
        /* Optional: If set, identifies the iframe to
                                  search.
                              */
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            /*--- Found target node(s).  Go through each and act if they
                are new.
            */
            targetNodes.each(function() {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction(jThis);
                    if (cancelFound)
                        btargetsFound = false;
                    else
                        jThis.data('alreadyFound', true);
                }
            });
        } else {
            btargetsFound = false;
        }

        //--- Get the timer-control variable for this selector.
        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            //--- The only condition where we need to clear the timer.
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            //--- Set a timer, if needed.
            if (!timeControl) {
                timeControl = setInterval(function() {
                        waitForKeyElements(selectorTxt,
                            actionFunction,
                            bWaitOnce,
                            iframeSelector
                        );
                    },
                    300
                );
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
})