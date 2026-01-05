// ==UserScript==
// @name            TSWRP Calendar Events Filtering
// @description:en  Adds filters for TSW-RP Calendar
// @namespace       http://www.tsw-rp.com
// @include         http://tsw-rp.com/events
// @include         http://www.tsw-rp.com/events
// @version         5
// @grant           none
// @description Adds filters for TSW-RP Calendar
// @downloadURL https://update.greasyfork.org/scripts/16641/TSWRP%20Calendar%20Events%20Filtering.user.js
// @updateURL https://update.greasyfork.org/scripts/16641/TSWRP%20Calendar%20Events%20Filtering.meta.js
// ==/UserScript==

/*****
   Default filters. First text is what will be shown next to the checkbox,
   second text is a part of the event name that will be filtered
   ("RFG -" will filter out all events containing "RFG -" in title)
*****/
function getDefaultFilters() {
  return {
    "Radio Free Gaia": "RFG -,Anarchist Dictatorship,DJ Ashval",
    "GridStream Productions": "GSP -,DJ Daydreaming",
    "Happy Tentacle Radio": "Happy Tentacle Radio,DJ Dynamiks,The Fratelli",
    "PizzaNights": "PizzaNight",
    "MEZ raid": "MEZ training",
    "Seoul RP": "Seoul RP",
    "Tuesday Night RP": "TNRP - Tuesday Night RP",
    "Sunday Morning Gaming": "SMG - Sunday Morning Gaming",
  }
}



$(function() {
  initCalendarFilters();
});

$(document).ajaxComplete(function() {
  filterEvents();
});

function initCalendarFilters() {
  var allFilters = loadFilters();
  uncheckFiltersByPreferences(allFilters);
  renderFilteringContainer(allFilters);
}

// Loads and prepares both default and custom filters (custom are stored in browser's cookie)
function loadFilters() {
  var customFilters = readCookie("CalendarCustomFilters");
  for (var filterName in customFilters) {
    customFilters[filterName] = {"filter": customFilters[filterName], "checked": true, "custom": true};
  }
  var defaultFilters = getDefaultFilters();
  for (var filterName in defaultFilters) {
    defaultFilters[filterName] = {"filter": defaultFilters[filterName], "checked": true, "custom": false};
  }
  var allFilters = $.extend(defaultFilters, customFilters);
  return allFilters;
}

// Loads a list of filters that should be unchecked (stored in browser's cookie)
function uncheckFiltersByPreferences(filters) {
  var uncheckedFilters = readCookie("CalendarUncheckedFilters");
  if (uncheckedFilters != null) {
    for (var i = 0; i < uncheckedFilters.length; ++i) {
      var filterName = uncheckedFilters[i];
      if (filters[filterName]) {
        filters[filterName]["checked"] = false;
      }
    }
  }
}

function renderFilteringContainer(filters) {
  var $filterContainer = $("<div id='calendar-filters-cont'/>");
  $filterContainer.append("<h3>Event Filters:</h3>")
  var $filterList = $("<ul id='calendar-filters'/>");
  $filterContainer.append($filterList);
  $(".calendar-container").before($filterContainer);
  
  // Sort filters by label
  var filterNames = [];
  for (var filterName in filters) {
    filterNames.push(filterName);
  }
  filterNames = filterNames.sort();
  
  $.each(filterNames, function() {
    var filterName = this;
    var filter = filters[filterName];
    renderFilter($filterList, filterName, filter["filter"], filter["checked"], filter["custom"]);
  });
  
  // Render "Add Custom Filter"
  var $customFilterContainer = $("<div id='custom-filter-add-cont'/>");
  var $customFilterButtons = $("<div id='custom-filters-buttons'/>");
  var $showAddCustomFilterButton = $("<button style='margin: 0 10px; padding: 3px;'>Add Custom Filter</button>");
  $showAddCustomFilterButton.click(function() {
    $(this).parent().hide();
    $("#custom-filter-add-form").show();
  });
  $customFilterButtons.append($showAddCustomFilterButton);
  var $deleteCustomFiltersButton = $("<button style='padding: 3px;'>Delete Custom Filters</button>");
  $deleteCustomFiltersButton.click(function() {
    deleteCustomFilters();
  });
  $customFilterButtons.append($deleteCustomFiltersButton);
  $customFilterContainer.append($customFilterButtons);
  var $customFilterForm = $("<div id='custom-filter-add-form' style='display: none;'/>");
  $customFilterForm.append("<label for='custom-filter-name'>Name: </label><input type='text' id='custom-filter-name' style='margin-right: 10px;'/>");
  $customFilterForm.append("<label for='custom-filter-val'>Text to filter: </label><input type='text' id='custom-filter-val' style='margin-right: 10px;'/>");
  var $addCustomFilterButton = $("<button style='padding: 3px;'>Add</button>");
  $addCustomFilterButton.click(function() {
    addCustomFilter($("#custom-filter-name").val(), $("#custom-filter-val").val());
    $("#custom-filter-add-form").hide();
    $("#custom-filters-buttons").show();
  });
  $customFilterForm.append($addCustomFilterButton);
  $customFilterForm.append("<div style='font-size: 8pt; padding: 5px;'>All events that contain the 'Text to filter' in their title will be filtered. " +
                           "You can also specify multiple values separated by comma for filtering similar events that have different names. " +
                           "<br/>E.g. GridStream filter text is <strong>GSP,DJ Daydreaming</strong></div>");
  $customFilterContainer.append($customFilterForm);
  $filterContainer.append($customFilterContainer);
}

function renderFilter($filterList, filterName, filterValue, filterChecked, isCustom) {
  var $filterLi = $("<li style='display: inline-block; white-space: nowrap; padding: 5px 10px;'/>");
  var $filterCheckbox = $("<input type='checkbox' name='"+filterName+"' value='"+filterValue+"' data-custom-filter='"+isCustom+"'/>");
  $filterLi.append($filterCheckbox);
  $filterLi.append(" "+filterName);
  $filterList.append($filterLi);
  $filterCheckbox.prop("checked", filterChecked);
  $filterCheckbox.change(function() {
    filterChanged();
  });
}

function filterChanged() {
  filterEvents();
  saveUncheckFiltersPreferencies();
}

function filterEvents() {
  var $eventDivs = $(".calendar-container .fc-view-month > div > div");
  showAllEvents($eventDivs);
  $("#calendar-filters input:not(:checked)").each(function() {
    hideByNames($eventDivs, $(this).val());
  });
}

function showAllEvents($eventDivs) {
  $eventDivs.find(".fc-event-title").parent().parent().show();
  $eventDivs.find(".desc-wrapper").parent().parent().show();
}

function hideByNames($eventDivs, names) {
  $.each(names.split(","), function() {
    var textToFilter = this.trim();
    $eventDivs.find(".fc-event-title:contains(" + textToFilter + ")").parent().parent().hide();
    $eventDivs.find(".desc-wrapper:contains(" + textToFilter + ")").parent().parent().hide();
  });
}

function saveUncheckFiltersPreferencies() {
  var uncheckedFilters = [];
  $("#calendar-filters input:not(:checked)").each(function() {
    uncheckedFilters.push($(this).prop("name"));
  });
  storeCookie("CalendarUncheckedFilters", uncheckedFilters);
}

function addCustomFilter(name, value) {
  renderFilter($("#calendar-filters"), name, value, false, true);
  saveCustomFilters();
  filterEvents();
}

function saveCustomFilters() {
  var customFilters = {};
  $("#calendar-filters input[data-custom-filter='true']").each(function() {
    customFilters[$(this).prop("name")] = $(this).val();
  });
  storeCookie("CalendarCustomFilters", customFilters);
  saveUncheckFiltersPreferencies();
}

function deleteCustomFilters() {
  $("#calendar-filters input[data-custom-filter='true']").each(function() {
    $(this).closest("li").remove();
  });
  storeCookie("CalendarCustomFilters", {});
  saveUncheckFiltersPreferencies();
  filterEvents();
}

/*** Cookie related functions ***/

function storeCookie(name, value) {
  value = JSON.stringify(value);
  var date = new Date();
  date.setYear(date.getFullYear()+30);
  var expires = "; expires=" + date.toGMTString();
  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
    }
    return null;
}
