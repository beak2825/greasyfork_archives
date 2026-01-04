// ==UserScript==
// @name         War Filter
// @namespace    https://greasyfork.org/en/scripts/375473-faction-filter
// @version      2.1
// @description  Enables filters to remove/hide people from a faction page.
// @author       Cryosis7 [926640]
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/407720/War%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/407720/War%20Filter.meta.js
// ==/UserScript==

unsafeWindow.loadFilter = null;

$(document).ready(initialise)

/**
 * Initiation function that creates the filter bar and adds it to the dom.
 */
function initialise() {
    addStyles();

    const load = setInterval(function() {
        if(document.getElementsByClassName('status-wrap').length) {
            const wars = document.getElementsByClassName('status-wrap');
            for (let i = 0; i < wars.length; i++) {
                wars[i].addEventListener("click", function() {
                    mod_display();
                });
            }
            clearInterval(load);
        }
    }, 100);

    if (location.href.indexOf("#/war/") !== -1) {
        mod_display();
    }

}

function mod_display() {
    //wait for dynamically loaded content
    if(unsafeWindow.loadFilter) return;

    unsafeWindow.loadFilter = setInterval(function() {
        if (document.getElementsByClassName("faction-war").length) {
            drawFilterBar();
            setInitialValue();
            filter();

            //add watcher
            new MutationObserver(function(mutations) {
                //console.log(mutations[0].target);
                filter();
            }).observe(
                document.getElementsByClassName("members-list")[0], { subtree: true, childList: true }
            );
            clearInterval(unsafeWindow.loadFilter);
            unsafeWindow.loadFilter = null;
        }
    }, 100); // check every 100ms

}

/**
 * Creates and draws the filter bar onto the dom
 */
function drawFilterBar() {
    // Creating the filter bar and adding it to the dom.
    let element = $(`
  <div class="filter-container m-top10">
    <div class="title-gray top-round">Select Filters</div>
      <span>
        <input type="checkbox" name="join" id="join"/>
        <label for="join"> Hide Available</label><br>
      </span>
      <span>
        <input type="checkbox" name="enemy" id="enemy"/>
        <label for="enemy"> Hide Enemies</label><br>
      </span>
      <span>
        <input type="checkbox" name="your" id="your"/>
        <label for="your"> Hide Friendlies</label><br>
      </span>
      <span>
        <input type="checkbox" name="me" id="me"/>
        <label for="me"> Hide Me</label><br>
      </span>
    <div class="cont-gray p10 bottom-round">
    </div>
  </div>`);

    if (!document.getElementsByClassName("filter-container").length) {

        $(".faction-war").before(element);

        // Adding a checkbox listener to disable/enable the filters.
        $('input[type=checkbox]').change(function () {
            filter();
            let storedFilters = GM_getValue('wallFilter', {});
            storedFilters[$(this).attr("name")] = $(this).is(":checked");
            GM_setValue('wallFilter', storedFilters);
        });
    }

}


function filter() {
    document.querySelectorAll("input[type='checkbox']").forEach(checkbox => {

        if (checkbox.name === 'join' || checkbox.name === 'enemy' || checkbox.name === 'your') {
            [].forEach.call(document.querySelectorAll(`.${checkbox.name}`), function (el) {
                if(el.nodeName === 'LI') {
                    // check to see if it's me
                    let checkbox_me = document.getElementsByName("me")[0];

                    console.log(el.querySelector('.name'));

                    if(el.querySelector('.name') && el.querySelector('.name').href.indexOf(`/profiles.php?XID=${getCookie("uid")}`) !== -1) {
                        console.log(el);
                        if (checkbox_me.checked) {
                            $(el).hide();
                        } else {
                            $(el).show();
                        }
                        return;
                    }

                    if (checkbox.checked) {
                        $(el).hide();
                    } else {
                        $(el).show();
                    }
                }
            });
        }
    });
}

/**
 * Retrieves the initial values last used out of the cache and sets them
 */
function setInitialValue() {
    let storedFilters = GM_getValue('wallFilter', {});
    let filterContainer = $(".filter-container")

    for (let filter in storedFilters) {
        let domFilter = $(filterContainer).find(`input[name="${filter}"]`);
        domFilter.prop('checked', storedFilters[filter]);
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

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}