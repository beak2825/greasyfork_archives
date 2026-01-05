// ==UserScript==
// @name        CubeCraft PreventMultiReports
// @namespace   de.rasmusantons
// @description Prevents you from accidentially creating multiple reports at once on reports.cubecraft.net
// @include     https://reports.cubecraft.net/report/create
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26114/CubeCraft%20PreventMultiReports.user.js
// @updateURL https://update.greasyfork.org/scripts/26114/CubeCraft%20PreventMultiReports.meta.js
// ==/UserScript==

var isBlocked = false;

$(document).off('click', '.create-report');
$(document).on('click', '.create-report', function(e) {
  var form = $('#report_form');
  var formData = new FormData($("#report_form")[0]);
  console.log(formData);
  if (!isBlocked) {
    isBlocked = true;
    $.ajax({
      type: "POST",
      url: '/validate_report',
      type: 'POST',
      data: formData,
      contentType: false,
      processData: false,
      success: function(data) {
        if(data == 'true'){
          form.submit();
        } else {
          $('#validation_message').html(data);
          $('html, body').animate({
            scrollTop: $("#validation_message").offset().top-250
          }, 500);
        }
      },
      error: function(data) {
        isBlocked = false;
      }
    });
  }
  e.preventDefault();
});