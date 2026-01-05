// ==UserScript==
// @name         what.cd highlighting
// @namespace    
// @version      0.1
// @description  Adds an extra column of the ratio of seeds to leeches. Useful for looking at good torrents to seed
// @author       Jordan
// @match        https://what.cd/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10050/whatcd%20highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/10050/whatcd%20highlighting.meta.js
// ==/UserScript==

function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

$('.edition_info').attr('colspan',10);
$('.sign.leechers').after('<td>Ratio</td>');

// Loop all rows, calculate ratio, add to an array of ratios to get median later
all_ratios = [];
$('tr.group_torrent, tr.group').each(function() {
     var leechers = $(this).find('td.number_column:last').html();
     var seeders = $(this).find('td.number_column:last').prev().html();
     if(typeof leechers == 'undefined' || typeof seeders == 'undefined') {
     	// console.log('undefined');
     } else {
	     leechers = leechers.replace(',','');
	     seeders = seeders.replace(',','');
	 }
     var ratio = (leechers/seeders);
     if(typeof ratio != 'undefined' && !isNaN(ratio) && ratio != 'Infinity' ) {
     	all_ratios.push(ratio);
     }
});


// Get the median, get the max, find a point inbetween to give us useful highlighting
var ratio_median = median(all_ratios);
var max = Math.max.apply( Math, all_ratios );
var upper_fourth = ratio_median + ((max - ratio_median) / 3 );

// Loop again, this should probably have been unified with the looping above
// Output an extra cell per row, highlighted if above the target level
$('tr.group_torrent, tr.group').each(function() {
     var leechers = $(this).find('td.number_column:last').html();
     var seeders = $(this).find('td.number_column:last').prev().html();
     if(typeof leechers == 'undefined' || typeof seeders == 'undefined') {
     	// console.log('undefined');
     } else {
	     leechers = leechers.replace(',','');
	     seeders = seeders.replace(',','');
	 }
     // console.log(leechers + '/' + seeders + '=' + ratio);
     var ratio = (leechers/seeders).toFixed(2);
     if(typeof ratio != 'undefined' && !isNaN(ratio) ) {
     	all_ratios.push(ratio);
     	if(ratio > upper_fourth || ratio == 'Infinity') {
     		var style = 'font-weight:bold;';
     	} else {
     		var style = null;
     	}
        $(this).find('td.number_column:last').after('<td style="' + style + '">' + ratio + '</td>');
     }
});
