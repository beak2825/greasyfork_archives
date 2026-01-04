// ==UserScript==
// @name         [MTurk Worker] Display Total Available HITs
// @namespace    https://turkerview.com/mturk-scripts/
// @version      1.0
// @description  Will provide a bar at the top of the page to mimic old functionality on www that displays the total available HITs. Will use # of page requests equal to the total available hit groups / 100.
// @author       ChrisTurk
// @include      https://worker.mturk.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.2.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/396134/%5BMTurk%20Worker%5D%20Display%20Total%20Available%20HITs.user.js
// @updateURL https://update.greasyfork.org/scripts/396134/%5BMTurk%20Worker%5D%20Display%20Total%20Available%20HITs.meta.js
// ==/UserScript==

$(document).ready(function(){
	$('.me-bar').find('.col-xs-5').prepend(`<span class="hidden-xs-down pull-left" id="fetchAllHITs" style="cursor: pointer;">Fetch Available</span>`);

	$('body').on('click', '#fetchAllHITs', function(){
		$('#fetchAllHITs').html(`<i class="fa fa-spinner fa-spin"></i> Fetching...`);
		fetch();
	});
});

function fetch(){
	let totalAvailable = 0;
	let deferreds = [];
	$.get(`https://worker.mturk.com/projects?format=json&page_size=100`).done(function(data){

		let maxPages = Math.floor(data.total_num_results/100);
		console.log(maxPages);

		data.results.forEach(function(object){
			totalAvailable = totalAvailable + object.assignable_hits_count;
		});

		console.log(totalAvailable);


		// we just do not even care about pres lol, past the first page truth be told the tally is negligible anyway most of the time
		// if it fails, it fails
		for (i = 2; i <= maxPages; i++){
			deferreds.push($.get(`https://worker.mturk.com/projects?format=json&page_size=100&page_number=${i}`));
		}

		$.when.all(deferreds).then(function(objects) {
			console.log("Resolved objects:", objects);

			objects.forEach(function(data){
				data[0].results.forEach(function(HIT){
					totalAvailable = totalAvailable + HIT.assignable_hits_count;
				});
			});

			console.log("Final tally: ", totalAvailable);
			$('#fetchAllHITs').html(`<span class="text-primary">${numberWithCommas(totalAvailable)}</span> Total Available HITs`);
		});

	});
}

if (typeof jQuery.when.all === 'undefined') {
    jQuery.when.all = function (deferreds) {
        return $.Deferred(function (def) {
            $.when.apply(jQuery, deferreds).then(
                function () {
                    def.resolveWith(this, [Array.prototype.slice.call(arguments)]);
                },
                function () {
                    def.rejectWith(this, [Array.prototype.slice.call(arguments)]);
                });
        });
    };
}

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};