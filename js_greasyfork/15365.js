// ==UserScript==
// @name         Craigslist apartment map view with filters
// @namespace    http://ivanjoukov.com/
// @version      0.1
// @description  Craigslist apartment search is most useful on the map view, since after all real estate is about location, location, location, but other factors matter too.  For example you probably want to see listings that are reasonably new but not just from today, but the current UI only lets you pick "Listed today" or no filter.  This tampermonkey script lets you eliminate listings by a configurable age range.
// @author       Ivan Joukov
// @include      http://*.craigslist.tld/search/apa
// @require      https://code.jquery.com/jquery-1.11.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15365/Craigslist%20apartment%20map%20view%20with%20filters.user.js
// @updateURL https://update.greasyfork.org/scripts/15365/Craigslist%20apartment%20map%20view%20with%20filters.meta.js
// ==/UserScript==
/* jshint -W097 */

this.$ = this.jQuery = jQuery.noConflict(true);

(function (window, document, $, undefined) {
    'use strict';

	// Sanity check that this has any chance of working
	if (!(CL && CL.banish && CL.maps)) {
		return;
	}

    var minAgeSlider, maxAgeSlider, $minDaysSpan, $maxDaysSpan, $filteringProgress;
    
    // Create and set up the slider elements that will form our UI
    minAgeSlider = document.createElement("INPUT");
    minAgeSlider.setAttribute("type", "range");
    minAgeSlider.setAttribute("min", "0");
    minAgeSlider.setAttribute("max", "30");
    minAgeSlider.value = 0;
    minAgeSlider.id = "minAgeSlider";

    maxAgeSlider = document.createElement("INPUT");
    maxAgeSlider.setAttribute("type", "range");
    maxAgeSlider.setAttribute("min", "0");
    maxAgeSlider.setAttribute("max", "30");
    maxAgeSlider.value = 30;
    maxAgeSlider.id = "maxAgeSlider";

    // Replace the default posted today checkbox with our UI
    $('.postedToday > input').remove();
    $('.postedToday').append("<div>Post min age <span id='minDays'>0</span> (days)<div>").append(minAgeSlider);
    $('.postedToday').append("<div>Posting max age <span id='maxDays'>30</span>(days)<div>").append(maxAgeSlider);
    $('.postedToday').append("<div>Filtering progress: <span id='filteringProgress'>100</span>%<div>");

    $minDaysSpan = $("#minDays");
    $maxDaysSpan = $("#maxDays");
    $filteringProgress = $("#filteringProgress");


    //Borrowed from https://davidwalsh.name/javascript-debounce-function
    // Because filtering is a pretty expensive operation, let's delay it until the user has finished adjusting the sliders
    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
				args = arguments,
				later = function () {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				},
				callNow = immediate && !timeout;
            window.clearTimeout(timeout);
            timeout = window.setTimeout(later, wait);
            if (callNow) {
				func.apply(context, args);
			}
        };
    }

    // Inspired by http://stackoverflow.com/a/10344560
    // This prevents locking the UI while doing the pretty slow/expensive filtering
    // The basic idea is rather than iterating over all the (possibly thousands) of listings in a single blocking call
    // We can break up the processing into small chunks, pausing often enough to allow the UI thread to run to prevent
    // UI locking from the user's perspective
    function processLargeArrayAsync(array, fn, maxTimePerChunk, context, done) {
        context = context || window;
        maxTimePerChunk = maxTimePerChunk || 200;
        var index = 0;

        function now() {
            return new Date().getTime();
        }

        function doChunk() {
            var startTime = now();
            while (index < array.length && (now() - startTime) <= maxTimePerChunk) {
                // callback called with args (value, index, array)
                fn.call(context, array[index], index, array);
                ++index;
            }
            if (index < array.length) {
                // set Timeout for async iteration
                window.setTimeout(doChunk, 1);
            } else {
                done.call(context);
            }
        }
        doChunk();
    }

	function inDateRange(dateToCheck, newestDate, oldestDate) {
        return dateToCheck > oldestDate && dateToCheck < newestDate;
    }

    function hideByDate(newestDate, oldestDate) {
        var containingPIDKeys = Object.keys(CL.maps.marker.containingPID),
			byIDKeys = Object.keys(CL.maps.marker.byID),
			totalLength = containingPIDKeys.length + byIDKeys.length,
			totalProcessed = 0,
			processMarker = function (key, index, keyArray) {
				var marker = this[key];
				if (!inDateRange(marker.marker.options.posteddate, newestDate, oldestDate)) {
					CL.banish.ban(key);
				} else {
					CL.banish.unban(key);
				}
				$filteringProgress.text(Math.round(100 * ++totalProcessed / totalLength));
			},
			doneCallback = function () {
				CL.banish.hide();
			};
        processLargeArrayAsync(containingPIDKeys, processMarker, 100, CL.maps.marker.containingPID, doneCallback);
        processLargeArrayAsync(byIDKeys, processMarker, 100, CL.maps.marker.byID, doneCallback);
    }

    // Do the cheap UI changes in real time    
    $('#minAgeSlider, #maxAgeSlider').on('input change', function () {
        $minDaysSpan.text(minAgeSlider.value);
        $maxDaysSpan.text(maxAgeSlider.value);
    });

    // But debounce and offload the really expensive filtering operation
    var debouncedHandleSliderChange = debounce(function () {
        var newestDate = Date.now() - (1000 * 60 * 60 * minAgeSlider.value),
			oldestDate = Date.now() - (1000 * 60 * 60 * maxAgeSlider.value);
        hideByDate(newestDate, oldestDate);
    }, 500);

    $('#minAgeSlider, #maxAgeSlider').on('change', debouncedHandleSliderChange);

})(window, document, jQuery);