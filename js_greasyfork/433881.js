// ==UserScript==
// @name        [WM] Internet Explorer
// @description n/a
// @version     25.2.21.0
// @author      Folky
// @namespace   https://github.com/folktroll/
// @license     MIT
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Internet_Explorer_10%2B11_logo.svg/244px-Internet_Explorer_10%2B11_logo.svg.png
// @include     /^https:\/\/(aslive\.)?admin\.mergermarket\.com\/.*$/
// @downloadURL https://update.greasyfork.org/scripts/433881/%5BWM%5D%20Internet%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/433881/%5BWM%5D%20Internet%20Explorer.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function () {
  'use strict';

  const missing_min_max = ['newwealth_eventtypeid', 'share_stake', 'income_value', 'asset_value', 'detail_yearbirth', 'newwealth_value', 'detail_numchildren', 'opportunityID', 'newwealth_maxValue']
  missing_min_max.forEach((n) => {
    const e = document.querySelector("input[name=" + n + "]")
    if (e) {
      e.min = e.max = null
    }
  })

  const missing_input_id = ['retainedadvisor_AddName', 'retainedadvisor_AddID', 'acq_acquaintancesysid', 'newwealth_notes_displayflag', 'edu_dtsfrom', 'edu_dtsto', 'edu_details']
  missing_input_id.forEach((n) => {
    const e = document.querySelector("input[name=" + n + "]")
    if (e) {
      e.id = n
    }
  })

  const missing_select_id = ['addr_countrycode', 'addr_state', 'newwealth_eventtype']
  missing_select_id.forEach((n) => {
    const e = document.querySelector("select[name=" + n + "]")
    if (e) {
      e.id = n
    }
  })
})();

// phonedetails fix
window.addEventListener("load", onLoad)

function onLoad() {
  const editLinks = document.querySelectorAll('#phonedetailstable_rowlinks > a.editBtn')
  editLinks.forEach((editLink) => {
    editLink.rowID = editLink.parentElement.parentElement.id
    editLink.tableID = editLink.parentElement.parentElement.parentElement.parentElement.id
    editLink.addEventListener("click", editRowFix, false)
  })

  function editRowFix(evt) {
    const rowID = evt.currentTarget.rowID
    const tableID = evt.currentTarget.tableID

    for (var i = 0; i < cols.length; i++) {
      if (cols[i].tableid == tableID && cols[i].cloneof != "") {
        var destinationDiv = "#" + cols[i].colname + "Cloned_" + rowID;
        var selectedValue = $("#" + cols[i].colname + "_" + rowID).attr("value");

        console.log(destinationDiv, selectedValue, $(destinationDiv)[0], $(destinationDiv)[0].tagName.toLowerCase())
        if ($(destinationDiv)[0].childNodes[0].tagName.toLowerCase() == "select") {
          $(destinationDiv + " option[value='" + selectedValue + "']").attr("selected", "selected");
        }
      }
    }
  }
}
