// ==UserScript==
// @name          Jira Hide unused bulk edit fields
// @namespace     randomecho.com
// @description   Hide fields from Bulk Edit screen that are not usually bulk edited
// @include       https://*.atlassian.net/secure/views/bulkedit/BulkChooseOperation!default.jspa
// @include       */secure/views/bulkedit/BulkChooseOperation!default.jspa
// @include       https://*.atlassian.net/secure/views/bulkedit/BulkEditDetails.jspa
// @include       */secure/views/bulkedit/BulkEditDetails.jspa
// @grant         none
// @copyright     2017 Soon Van
// @author        Soon Van - randomecho.com
// @license       http://opensource.org/licenses/BSD-3-Clause
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/33696/Jira%20Hide%20unused%20bulk%20edit%20fields.user.js
// @updateURL https://update.greasyfork.org/scripts/33696/Jira%20Hide%20unused%20bulk%20edit%20fields.meta.js
// ==/UserScript==

// Pre-selects the Edit Issues option on the Step 2 of 4 page before Operation Details
var bulkEditOptionOfPage2 = document.getElementById('bulk.edit.operation.name_id');
if (bulkEditOptionOfPage2) {
  bulkEditOptionOfPage2.checked = true;
}

function hideCustomFields() {
  var customFields = document.getElementsByClassName('checkbox');

  for (var i in customFields) {
    if (customFields[i].getAttribute('id').indexOf('cbcustomfield_') !== -1) {
        customFields[i].parentNode.parentNode.style.display = 'none';
    }
  }
}

function hideStandardFields() {
  var hideAwayFields = [
    'cbassignee',
    'cbcomment',
    'cbduedate',
    'cbenvironment',
    'cbissuetype',
    'cbpriority',
    'cbreporter',
    'cbversions',
  ];

  for (var i in hideAwayFields) {
    var fieldName = document.getElementById(hideAwayFields[i]);

    if (fieldName) {
      fieldName.parentNode.parentNode.style.display = 'none';
    }
  }
}

function hideUnusedTextFields() {
  var textField = document.getElementById('versions-textarea');

  if (textField) {
    textField.parentNode.parentNode.style.display = 'none';
  }
}

function hideUnusedFields() {
  hideStandardFields();

  setTimeout(function() {hideUnusedTextFields()}, 2000);

  hideCustomFields();
}

window.onload = hideUnusedFields();
