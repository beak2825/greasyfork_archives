// ==UserScript==
// @name         [Ned] Trigger Status Updater
// @namespace    localhost
// @version      2.1
// @description  Trigger Status Updater
// @author       Ned (Ned@Autoloop.com)
// @match        https://csa.autoloop.us/CustomerTrigger/Customer/*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16148/%5BNed%5D%20Trigger%20Status%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/16148/%5BNed%5D%20Trigger%20Status%20Updater.meta.js
// ==/UserScript==

//Make Button
$('.form-actions').prepend('<a class="btn btn-primary" id="tsdCopy"> Match All</a>').click(function() {
  //Fix Dropdowns
  $("#trigger-status tr td:nth-child(4)").each(function(index) {
    var loopStatus = $(this).text().trim();
    if ($(this).hasClass('loop-setting-differs')) {
      _changeStatus(loopStatus, index);
    }
    if ($(this).hasClass('loop-setting-unknown')) { //NA
      _changeStatus('', index);
    }
    _changeTextbox(loopStatus, index);
  });
  function _changeStatus(loopStatus, index) {
    $("#trigger-status select").each(function(selectIndex) {
      if (selectIndex == index) {
        if (loopStatus == 'Declined')
          $(this).val(5);
        if (loopStatus == 'Active')
          $(this).val(2);
        if (loopStatus == 'Batched')
          $(this).val(1);
        if (loopStatus == '')
          $(this).val(8);
      }
    });
  }
  function _changeTextbox(loopStatus, index) {
    $("#trigger-status input[type='text']").each(function(textIndex) {
      if (textIndex == index && $(this).val().length<=0) {
        if (loopStatus == '') {
          $(this).val('-N/A');
        }
        else {
          $(this).val('-Per Enrollment');
        }
      }
    });
  }

  //Fix CheckBoxes
  $("#trigger-status :checkbox").each(function(index) {
    if ($(this).parent().hasClass('loop-setting-differs')) {
      if($(this).prop('checked'))
        $(this).prop('checked', false);
      if(!$(this).prop('checked'))
        $(this).prop('checked', true);
    }
  });
});
//Move bar to above table
$('.key').append($('.form-actions'))