// ==UserScript==
// @name         CF-rating-chart-patch
// @version      0.1.0
// @description  Some modification to make Codeforces rating chart better
// @match        *://codeforces.com/profile/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/393171/CF-rating-chart-patch.user.js
// @updateURL https://update.greasyfork.org/scripts/393171/CF-rating-chart-patch.meta.js
// ==/UserScript==
 
const oldCode = String.raw`
    grid: { hoverable: true, markings: markings }
};

var plot = $.plot($("#placeholder"), datas, options);

function showTooltip(x, y, contents) {
    $('<div id="tooltip">' + contents + '</div>').css( {
        position: 'absolute',
        display: 'none',
        top: y - 20,
        left: x + 10,
        border: '1px solid #fdd',
        padding: '2px',
        'font-size' : '11px',
        'background-color': '#fee',
        opacity: 0.80
    }).appendTo("body").fadeIn(200);
}

var ctx = plot.getCanvas().getContext("2d");

var prev = -1;
$("#placeholder").bind("plothover", function (event, pos, item) {
    if (item) {
        if (prev != item.dataIndex) {
            $("#tooltip").remove();
            var params = data[item.seriesIndex][item.dataIndex];

            var total = params[1];
            var change = params[5] > 0 ? "+" + params[5] : params[5];
            var contestName = params[11];
            var contestId = params[2];
            var contestUrl = params[7];
            var rank = params[6];
            var title = params[8];
            var html = "= " + total + " (" + change + "), " + title + "<br/>"
                            + "Rank: " + rank + "<br/>"
                            + "<a href='" + contestUrl + "'>" + contestName + "</a>";
            if (change > 0)
                html += "<br/><a style='font-weight: bold;' href=\"/bestRatingChanges/" + params[10] + "\">Share it!</a>";
            showTooltip(item.pageX, item.pageY, html);
            setTimeout(function () {
                $("#tooltip").fadeOut(200);
                prev = -1;
            }, 4000);
            prev = item.dataIndex;
        }
    }
});`;

const newCode = '\ngrid: { hoverable: true, clickable: true, markings: markings } };' + (function(){
	// NOTE: toString does not work 100% of the time. Use String.raw instead if it doesn't work.
	var plot = $.plot($("#placeholder"), datas, options);

	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css( {
			position: 'absolute',
			display: 'none',
			top: y - 20,
			left: x,
			border: '1px solid #fdd',
			padding: '2px',
			'font-size' : '11px',
			'background-color': '#fee',
			opacity: 0.80
		}).appendTo("body").fadeIn(200);
	}

	var ctx = plot.getCanvas().getContext("2d");

	$("#placeholder").bind("plotclick", function (event, pos, item) {
		if (item) {
			var params = data[item.seriesIndex][item.dataIndex];

			var total = params[1];
			var change = params[5] > 0 ? "+" + params[5] : params[5];
			var contestName = params[11];
			var contestId = params[2];
			var contestUrl = params[7];
			var rank = params[6];
			var title = params[8];

			window.open(contestUrl)
		}
	});

	var prev = -1;
	var tooltipFadeoutTimeoutId = null;

	function clearTooltipFadeout () {
		if (tooltipFadeoutTimeoutId !== null)
			clearTimeout(tooltipFadeoutTimeoutId);
	}

	function tooltipFadeout () {
		$("#tooltip").fadeOut(200);
		prev = -1;
		tooltipFadeoutTimeoutId = null;
	}

	document.addEventListener('click', function (event) {
		if (event.target.id !== 'tooltip')
			tooltipFadeout();
	});

	function setTooltipFadeout () {
		clearTooltipFadeout();
		tooltipFadeoutTimeoutId = setTimeout(tooltipFadeout, 4000);
	}

	$("#placeholder").bind("plothover", function (event, pos, item) {
		if (item) {
			if (prev != item.dataIndex) {
				$("#tooltip").remove();
				var params = data[item.seriesIndex][item.dataIndex];

				var total = params[1];
				var change = params[5] > 0 ? "+" + params[5] : params[5];
				var contestName = params[11];
				var contestId = params[2];
				var contestUrl = params[7];
				var rank = params[6];
				var title = params[8];
				var html = "= " + total + " (" + change + "), " + title + "<br/>"
								+ "Rank: " + rank + "<br/>"
								+ "<a href='" + contestUrl + "'>" + contestName + "</a>";
				if (change > 0)
					html += "<br/><a style='font-weight: bold;' href=\"/bestRatingChanges/" + params[10] + "\">Share it!</a>";
				showTooltip(item.pageX, item.pageY, html);
				prev = item.dataIndex;

				$("#tooltip").bind("mouseenter", clearTooltipFadeout).bind("mouseleave", setTooltipFadeout);
			}
		} else {
			setTooltipFadeout();
		}
	}).bind("mouseleave", setTooltipFadeout);
	// this will always work because mouseleave of placeholder is fired before
	// mouseenter of tooltip (stackoverflow.com/q/10011493)

}).toString().replace(/}$/,'').replace(/^function.*?(\s*)\s*{/,'')


var script_modified = false;
new MutationObserver(function(mutations, observer){
	for (let r of mutations){
		let t=r.target
		if(t.tagName==='SCRIPT'){
			var ind = t.innerHTML.indexOf(oldCode);
			if (ind >= 0) {
				t.innerHTML = t.innerHTML.substr(0, ind) + newCode + t.innerHTML.substr(ind+oldCode.length)
				observer.disconnect();
				script_modified = true;
				console.log('CF script modified')
				return;
			}
		}
	}
}).observe(document,{
	childList:true,
	subtree:true,
});

window.addEventListener('load', function(){
	if (!script_modified)
		console.log('NOTE: script is not working')
})
