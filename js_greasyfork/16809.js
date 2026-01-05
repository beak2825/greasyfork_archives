// ==UserScript==
// @name       Virtual Manager filtre på ansatte-søgning
// @namespace  http://mathemaniac.org/
// @version    1.0.1
// @description  Tilføjer filtrering (highlighting) til søgningen efter nye ansatte, så uegnede kandidater er nemmere at spotte.
// @match        http://www.virtualmanager.com/employees/search*
// @copyright  2016, Sebastian Paaske Tørholm
// @require    https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/16809/Virtual%20Manager%20filtre%20p%C3%A5%20ansatte-s%C3%B8gning.user.js
// @updateURL https://update.greasyfork.org/scripts/16809/Virtual%20Manager%20filtre%20p%C3%A5%20ansatte-s%C3%B8gning.meta.js
// ==/UserScript==
// Skal have samme rækkefølge som i tekstboksen.
var types = ["Ungdomsspillere","Målmandstræning","Markspillertræning","Disciplin","Potentialebedømmelse","Ledelse","Egenskabsbedømmelse","Motivation"];

var types_select = '<select name="val_type">' + $.map(types, function(e) { return "<option value='"+e+"'>" + e + '</option>'; }).join("") + '</select>';

var table = $('h2:contains(Personalesøgning) + div table');

// Taken from http://stackoverflow.com/a/8877261/79061
RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        var matchArray = [];
        for (i in match) {
            if (parseInt(i) == i) {
                matchArray.push(match[i]);
            }
        }
        matches.push(matchArray);
    }
    return matches;
}

var addFilter = $('<a>+ Tilføj filter</a>');
addFilter.click(function () {
    var newRow = $('<tr><td class="label">Filter:</td><td class="value">' + types_select + ' skal mindst være <input type="number" min="0" max="100" name="min_val" value="20"></td></tr>');
    $('#addRow').before(newRow);
});
var row = $('<tr id="addRow"><td class="label"></td><td class="value"></td></tr>');
$(table).append(row);
$('#addRow .label').append(addFilter);

var matches = /val_type=(.*?)&min_val=(\d+)/g.execAll(document.location.search);
var datastr = "";
$.each(matches, function (i, match) {
    addFilter.click();
    var row = $('#addRow').prev();
    $('select', row).val(decodeURIComponent(match[1]));
    $('input', row).val(match[2]);
    datastr += '&val_type=' + match[1] + '&min_val=' + match[2];
});

$('.pagination a').each( function () {
  var url = $(this).attr('href');
  url = url.replace(/(val_type|min_val)=[^&]*/g, '') + datastr;
  url = url.replace(/&&/g, '&');
  $(this).attr('href', url);
} );

GM_addStyle(".unimportant, .unimportant a { color: silver !important; }");

$('h2:contains(Søgeresultater) + div table tr:has(img)').each( function () {
   var row = $(this);
   var scoresheet = $('img[onmouseover]', row).attr('onmouseover');
   var scores = $.map(scoresheet.replace(/[^\d,]/g,'').replace(/^\d+,/,'').split(/,/), function (e) { return 1*e; });

   $.each(matches, function (i, match) {
      var type = types.indexOf(decodeURIComponent(match[1]));
      if (type < 0) return;
      if (scores[type] < match[2]) row.addClass('unimportant');
   });
});
