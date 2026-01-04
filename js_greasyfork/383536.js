// ==UserScript==
// @name         SensCritique : Merges & Deletes
// @namespace    sc-merges-deletes
// @version      0.1
// @description  Coche automatiquement les fusions et suppressions.
// @author       Emilien
// @match        http://admin.senscritique.com/tasks/pendingMerges
// @match        http://admin.senscritique.com/tasks/pendingDeletes
// @grant        none
// @icon		     https://www.senscritique.com/favicon-32x32.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/383536/SensCritique%20%3A%20Merges%20%20Deletes.user.js
// @updateURL https://update.greasyfork.org/scripts/383536/SensCritique%20%3A%20Merges%20%20Deletes.meta.js
// ==/UserScript==


$("td:contains('ThoRCX')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});
$("td:contains('Senscritchaiev')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});
$("td:contains('Camden')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});
$("td:contains('Raton')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});
$("td:contains('ifhan')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});
$("td:contains('MagnusLeague')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});
$("td:contains('Thekla')").each(function() {
  $(this).parent().find("input[type='checkbox']").prop('checked', true);
  $(this).parent().css('border-left', '3px solid #6cbd33');
});