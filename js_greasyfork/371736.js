// ==UserScript==
// @name         Bookies Odds Tracker
// @namespace    https://greasyfork.org/users/3898
// @version      0.5.15
// @description  Track already seen odds and plot them to help show changes.
// @author       Xiphias[187717]
// @match        https://www.torn.com/bookies.php*
// @require      https://code.jquery.com/jquery-1.12.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.navigate.min.js
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.deleteValue
// @grant       GM.addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/371736/Bookies%20Odds%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/371736/Bookies%20Odds%20Tracker.meta.js
// ==/UserScript==
/* jshint -W097 */
/*global
   GM.setValue, GM.getValue, GM_log, $, jQuery, document, window, alert, GM_getResourceText, GM_xmlhttpRequest, ping
 */

// TODO: Rewrite the flow of the script. From data comes in to plotting

function DEBUG(obj) {
    // console.log prints a snapshot of the object, but may not log the correct state
    // so use this hack to log the actual state
    console.log(JSON.parse(JSON.stringify(obj)));
}

var waitForEl = function(selector, callback) {
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

const TRACKED_ODDS = 'TrackedOdds';
// implementation

const noop = () => {}

const custom_fetch = (fetch, {
	onrequest = noop,
	onresponse = noop,
	onresult = noop,
	onbody = [],
}) => async (input, init) => {
	onrequest(input, init)
	const response = await fetch(input, init)
	onresponse(response)

	for (const handler of onbody) {
		if (handler.match(response)) {
			Promise.resolve(handler.execute(response.clone()))
				.then((result) => onresult(result))
		}
	}

	return response
}

const intercept_fetch = (options) => (unsafeWindow.fetch = custom_fetch(fetch, options))

// usage

intercept_fetch({
	onrequest: (input, init) => noop,
	onresponse: (response) => noop,

	onbody: [{
		match: (response) => response.url.includes('action=getMatchRunners'),
		execute: (response) => response.json().then((json) => {
            //DEBUG('got request - parsing started');
            saveData(json).then(([parsed_data, isActive]) => {
                createPlot(parsed_data, isActive);
            }).catch(err => {
                DEBUG("Error")
                DEBUG(err);
            });
            }),
	}],
})



//////
// BOOKIE TRACKER HALLELUJAH
////////

setFlotCharStyles();

function isMatchStillActive(data) {

    if (data.hasOwnProperty("odds")) {

        if (data.odds.length == 0) {
            return false;
        }

        var match = data.odds[0];

        if (match.hasOwnProperty("status")) {
            return match.status == "ACTIVE";
        }
    }

    return false;
}

function getMarketId(data) {
    if (data.hasOwnProperty("odds") && data.odds.length > 0) {
        return data.odds[0].marketId;
    }

    return null;
}

async function saveData(data) {
    var matchId = getMarketId(data);

    if (matchId == null) {
        return [null, false];
    }

    let loaded_match_data = await loadData(matchId);

    if (!isMatchStillActive(data)) {
        DEBUG("Match is no longer active. Just load odds.");
        return [loaded_match_data, false];
    }

    if (loaded_match_data != null) {

        for (var i = 0; i < loaded_match_data.odds.length; i++) {
            var loaded_match_entry = loaded_match_data.odds[i];
            var loaded_runner_id = loaded_match_entry.runnerId;

            var runnerId = -1;
            for(var index=0; index < data.odds.length; ++index) {
                var match_index = data.odds[index];
                if(match_index.runnerId == loaded_runner_id) {
                    runnerId = index;
                    break;
                }
            }
            if (runnerId < 0) {
                // Skip
                continue;
            }
            var new_match_entry = data.odds[runnerId];

            if (new_match_entry == null) {
                DEBUG("Undefined Entry");
                continue;
            }

            // Remove unnecessary properties to minimize storage space
            delete new_match_entry.selectionId;
            delete new_match_entry.sortPriority;

            var record = [getTimestamp(),new_match_entry.lastPriceTraded];

            if(loaded_match_entry.hasOwnProperty(TRACKED_ODDS)){
                var old_odds = loaded_match_entry[TRACKED_ODDS];
                old_odds.push(record);
            } else {
                new_match_entry[TRACKED_ODDS] = [record];
            }
        }

    } else {
        for (var j = 0; j < data.odds.length; j++) {
            var odds_record = [getTimestamp(),data.odds[j].lastPriceTraded];
            data.odds[j][TRACKED_ODDS] = [odds_record];
            // Remove unnecessary properties to minimize storage space
            delete data.odds[j].selectionId;
            delete data.odds[j].sortPriority;
        }
        loaded_match_data = data;
    }
    var new_data = loaded_match_data;

    await GM.setValue(matchId, new_data);
    return [new_data, true];
}

function getTimestamp() {
    var timestamp_in_milliseconds = new Date().getTime();
    return timestamp_in_milliseconds;
}

async function loadData(key) {
    let loaded_data = await GM.getValue(key, null);
    return loaded_data;
}

function setFlotCharStyles() {
    GM.addStyle("#legend-container {position: relative; top: 7px; background-color: #fff;padding: 2px;margin-bottom: 8px;border-radius: 3px 3px 3px 3px;border: 1px solid #E6E6E6;display: inline-block;margin: 0 auto;}");
    GM.addStyle("#plot-container {box-sizing: border-box;width: 100%;height: 400px;padding: 20px 15px 15px 15px;margin: 15px auto 30px auto;border: 1px solid #ddd;background: #fff;background: linear-gradient(#f6f6f6 0, #fff 50px);background: -o-linear-gradient(#f6f6f6 0, #fff 50px);background: -ms-linear-gradient(#f6f6f6 0, #fff 50px);background: -moz-linear-gradient(#f6f6f6 0, #fff 50px);background: -webkit-linear-gradient(#f6f6f6 0, #fff 50px);box-shadow: 0 3px 10px rgba(0,0,0,0.15);-o-box-shadow: 0 3px 10px rgba(0,0,0,0.1);-ms-box-shadow: 0 3px 10px rgba(0,0,0,0.1);-moz-box-shadow: 0 3px 10px rgba(0,0,0,0.1);-webkit-box-shadow: 0 3px 10px rgba(0,0,0,0.1);}");
    GM.addStyle(".demo-placeholder {width: 80%;height: 100%;font-size: 14px;line-height: 1.2em;float: left;}");

    // Fade in and out style
    GM.addStyle('.backgroundColorFadeInAndOut {-webkit-animation: fadeinout 2s linear forwards;animation: fadeinout 2s linear forwards;}');
    GM.addStyle('@-webkit-keyframes fadeinout {0% {background: trasparent;}/* Adding a step in the middle */50% {background: LightGreen  ;}100% {background: trasparent;}}');
    GM.addStyle('@keyframes fadeinout {0% {background: trasparent;}/* Adding a step in the middle */50% {background: LightGreen  ;}100% {background: trasparent;}}');
}


function createPlaceholder() {

    var placeholder = $('<div id="plot-container"> \
                            <div id="placeholder" class="demo-placeholder"></div> \
                            <div id="legend-container"></div> \
                         </div>');
    return placeholder;
}

function removePlaceholder() {
    if ($('#plot-container').length > 0) {
        $('#plot-container').remove();
    }
}



function getPlotOptions() {

    var options = {
        legend: {
            position:"nw",
            container: $('#legend-container')
        },
        series: {
            lines: {
                show: true
            },
            points: {
                show: true
            }
        },
        grid: {
            clickable: true,
            hoverable: true },
        xaxis: {
            mode: "time",
            timezone: "browser",
            timeformat: "%d/%m <br> %H:%M"
        },
        yaxis: {
        },
        zoom: {
            interactive: true
        },
        pan: {
            interactive: true
        }
    }
    return options;
}

function setPanRange(options, x_min, x_max, y_min, y_max, buffer) {
    if (!options.hasOwnProperty("xaxis")) {
        options.xaxis = {};
    }

    if (!options.hasOwnProperty("yaxis")) {
        options.yaxis = {};
    }

    options.xaxis.panRange = [x_min*(1.0-buffer), x_max*(1.0+buffer)];
    options.yaxis.panRange = [y_min*(1.0-buffer), y_max*(1.0+buffer)];
    return options;
}

/**
 * buffer is a number in the range (+0.0 - infinity)
 */
function setZoomRange(options, x_min, x_max, y_min, y_max, buffer) {
    if (!options.hasOwnProperty("xaxis")) {
        options.xaxis = {};
    }

    if (!options.hasOwnProperty("yaxis")) {
        options.yaxis = {};
    }

    options.xaxis.zoomRange = [null, (x_max-x_min)*(1+buffer)];
    options.yaxis.zoomRange = [null, y_max*(1+buffer)];
    return options;
}

function shouldPlot(data, isActive) {
    // Show a message if data only has one (1) recorded odds.
    if (data == null || (data.length == 0 || data[0].data.length <= 1)) {
        $('#plot-container').css('height', '100%');
        if (isActive) {
           $('#plot-container').text("Only one (1) entry recorded. Skipping plot.");
        } else {
           $('#plot-container').text("No data found for this match.");
        }
        $("#legend-container").hide();
        $("#placeholder").hide();
        $(".demo-placeholder").hide();
        return false;
    }

    return true;
}

function setMessage(message) {
    $('#plot-container').css('height', '100%');
    $('#plot-container').text(message);
    $("#legend-container").hide();
    $("#placeholder").hide();
    $(".demo-placeholder").hide();
}

/**
 * Source: https://stackoverflow.com/questions/23396945/getting-the-min-and-max-value-in-javascript-but-from-a-2d-array
 */
function getMinMaxOf2DIndex (arr, idx) {
    return {
        min: Math.min.apply(null, arr.map(function (e) { return e[idx]})),
        max: Math.max.apply(null, arr.map(function (e) { return e[idx]}))
    }
}

function getMinMax(series) {
    var limits = {};
    limits.xmin = Number.MAX_VALUE;
    limits.xmax = Number.MIN_VALUE;
    limits.ymin = Number.MAX_VALUE;
    limits.ymax = Number.MIN_VALUE;

    var xaxis_index = 0;
    var yaxis_index = 1;
    for (var i = 0; i < series.length; i++) {
        var entry = series[i];

        var xaxis_limits = getMinMaxOf2DIndex(entry.data, xaxis_index);
        var yaxis_limits = getMinMaxOf2DIndex(entry.data, yaxis_index);

        limits.xmin = Math.min(limits.xmin, xaxis_limits.min);
        limits.xmax = Math.max(limits.xmax, xaxis_limits.max);
        limits.ymin = Math.min(limits.ymin, yaxis_limits.min);
        limits.ymax = Math.max(limits.ymax, yaxis_limits.max);
    }

    return limits;
}

function createPlot(odds_data, isActive) {

    var react_root = $('#react-root');
    var active_bet = react_root.find('li.c-pointer.active > .info-wrap');

    waitForEl('li.c-pointer.active > .info-wrap > .bets-wrap', function() {
        removePlaceholder();

        // Hide old plot if user clicks to close and reopen a bet
        active_bet.parent().click(function() {
            if (!$(this).hasClass('active')) {
                removePlaceholder();
            }
        });

        var placeholder = createPlaceholder();
        active_bet.append(placeholder);

        if (odds_data == null || $.isEmptyObject(odds_data)) {
            setMessage("No data found for this match.");
            return;
        }

        var data = prepareDataForPlot(odds_data);

        if (!shouldPlot(data, isActive)){
            return;
        }

        var options = getPlotOptions();
        var limits = getMinMax(data);
        options = setZoomRange(options, limits.xmin, limits.xmax, limits.ymin, limits.ymax, 0.90);

        var plot;

        // Plot the data
        $(document).ready(function(){plot = $.plot($("#placeholder"), data, options);});

        // Set event handlers
        onPlotClick(odds_data, active_bet);
        onPlotHover();
        onPlotDblClick(plot, data, options);
    });
}

function onPlotClick(odds_data, active_bet) {
    $("#placeholder").bind("plotclick", function (event, pos, item) {
        if (item) {
            var runnerName = odds_data.odds[item.seriesIndex].name;

            if (runnerName == "The Draw") {
                runnerName = "Draw";
            }
            var runnerListElement = active_bet.find('div[class*="bet-cell"]:contains("' + runnerName + '")').parent();

            // To restart animation we have to set a delay betweel removing and adding class
            runnerListElement.removeClass('backgroundColorFadeInAndOut');
            setTimeout(function(){
                runnerListElement.addClass('backgroundColorFadeInAndOut');
            }, 50);
        }
    });
}

function onPlotHover() {
    $("#placeholder").bind("plothover", function (event, pos, item) {
        var tooltip = $("#tooltip-bookies-plot");
        if (item) {
            // check if tooltip for this item already exists
            if (tooltip.length == 0 ||
                tooltip.attr('data-index') != item.dataIndex ||
                tooltip.attr('data-series-index') != item.seriesIndex)
            {
                tooltip.remove();

                var x = new Date(item.datapoint[0]).toLocaleString();
                var y = item.datapoint[1].toFixed(2);
                showTooltip(item.pageX, item.pageY,item.series.label + ": (" + x + ", " + y+")", item.seriesIndex, item.dataIndex);
            }
        } else {
            // Remove tooltip since we are not hovering on any point on the plot
            tooltip.remove();
        }
    });
}

function onPlotDblClick(plot, data, options) {
    $("#placeholder").dblclick(function () {
        // Reset zoom
        var axes = plot.getAxes(),
            xaxis = axes.xaxis.options,
            yaxis = axes.yaxis.options;
        xaxis.min = null;
        xaxis.max = null;
        yaxis.min = null;
        yaxis.max = null;

        // redraw the plot
        plot.setupGrid();
        plot.draw();
    });

    return plot;
}

function showTooltip(x, y, contents, data_series_index, data_index) {
    var tooltip = $('<div id="tooltip-bookies-plot">' + contents + '</div>');
    tooltip.attr('data-series-index', data_series_index);
    tooltip.attr('data-index', data_index);
    tooltip.css( {
        position: 'absolute',
        display: 'none',
        top: y + 10,
        left: x + 15,
        border: '1px solid #fdd',
        'border-radius': '5px',
        padding: '4px',
        'background-color': 'black',
        color: '#f2f2f2',
        opacity: 0.79
    }).appendTo("body").fadeIn(200);
}

function prepareDataForPlot(odds_data) {
    var prepared_data = [];
    for (var i = 0; i < odds_data.odds.length; i++) {
        var match_data = odds_data.odds[i];
        var match_name = match_data.name;
        prepared_data.push({data:match_data.TrackedOdds, label: match_name, lines: {show:true}});
    }
    return prepared_data;
}
