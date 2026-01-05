// ==UserScript==
// @name         NZBKing Sorter
// @version      1.1.1
// @description  Sort NZBKing results by size
// @include      /^https?:\/\/(www\.)?nzbking\.com\/search\/\?q=.*$/
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/20473
// @downloadURL https://update.greasyfork.org/scripts/21943/NZBKing%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/21943/NZBKing%20Sorter.meta.js
// ==/UserScript==
var $table=$('.xMenuT');
var $rows = $table.find('tr');
var validItems = [];
var invalidItems = [];
var regex = /size: (\d+)(\w+)/;
// Filter invalid items (e.g. DMCA's or ads)
for (var i=1; i<$rows.length; i++) {
    var size = regex.exec($($rows[i]).find('span.d').text());
    if (size !== null)
        validItems.push($rows[i]);
    else
        invalidItems.push($rows[i]);
}
var bytesize = ['bytes', 'KB', 'MB', 'GB'];
validItems.sort(function(a, b) {
    var sizeA = regex.exec($(a).find('span.d').text());
    var sizeB = regex.exec($(b).find('span.d').text());
    if (bytesize.indexOf(sizeA[2]) < bytesize.indexOf(sizeB[2])) return 1;
    if (bytesize.indexOf(sizeA[2]) > bytesize.indexOf(sizeB[2])) return -1;
    if (parseInt(sizeA[1]) < parseInt(sizeB[1])) return 1;
    if (parseInt(sizeA[1]) > parseInt(sizeB[1])) return -1;
    return 0;
});
for (var i=validItems.length-1; i>=0; i--) {
    $table.find('tr').first().after(validItems[i]);
}