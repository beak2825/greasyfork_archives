// ==UserScript==
// @name                WME Favorites
// @description         Waze Map Editor script that creates a list of favorite places next to the search field.
// @include             https://*.waze.com/editor/*
// @include             https://*.waze.com/*/editor/*
// @grant         		none
// @version             1.0.3
// @namespace https://greasyfork.org/users/11005
// @downloadURL https://update.greasyfork.org/scripts/10062/WME%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/10062/WME%20Favorites.meta.js
// ==/UserScript==



if ('undefined' == typeof __RTLM_PAGE_SCOPE_RUN__) {
  (function page_scope_runner() {
    // If we're _not_ already running in the page, grab the full source
    // of this script.
    var my_src = "(" + page_scope_runner.caller.toString() + ")();";

    // Create a script node holding this script, plus a marker that lets us
    // know we are running in the page scope (not the Greasemonkey sandbox).
    // Note that we are intentionally *not* scope-wrapping here.
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.textContent = "var __RTLM_PAGE_SCOPE_RUN__ = true;\n" + my_src;

    // Insert the script node into the page, so it will run, and immediately
    // remove it to clean up.  Use setTimeout to force execution "outside" of
    // the user script scope completely.
    setTimeout(function() {
          document.body.appendChild(script);
          document.body.removeChild(script);
        }, 1500);
  })();

  // Stop running, because we know Greasemonkey actually runs us in
  // an anonymous wrapper.
  return;
}



function FAV_Bootstrap() {
	var bGreasemonkeyServiceDefined = false;

	try {
		bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
	}
	catch (err) { /* Ignore */ }

	if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
		unsafeWindow    = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}

	/* begin running the code! */
	FAV_init();
}





function FAV_init() {

	getQueryStringAsObject=function(e){var t,r,o,n,p,l,c,a={},u=function(e){return decodeURIComponent(e).replace(/\+/g," ")},i=e.split("?"),s=i[1],y=/([^&;=]+)=?([^&;]*)/g;for(p=function(e){return"object"!=typeof e&&(r=e,e={},e.length=0,r&&Array.prototype.push.call(e,r)),e};o=y.exec(s);)t=o[1].indexOf("["),c=u(o[2]),0>t?(n=u(o[1]),"zoom"==n?c=parseInt(c):("lat"==n||"lon"==n)&&(c=parseFloat(c)),a[n]?(a[n]=p(a[n]),Array.prototype.push.call(a[n],c)):a[n]=c):(n=u(o[1].slice(0,t)),l=u(o[1].slice(t+1,o[1].indexOf("]",t))),a[n]=p(a[n]),l?a[n][l]=c:Array.prototype.push.call(a[n],c));return a};

	var imgSort = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAgCAYAAAD0S5PyAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAA6hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgICAgICAgICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iPgogICAgICAgICA8eG1wOk1vZGlmeURhdGU+MjAxNS0wNS0xNFQyMTowNTozNjwveG1wOk1vZGlmeURhdGU+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+UGl4ZWxtYXRvciAzLjMuMjwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj41PC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6WFJlc29sdXRpb24+NzI8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xNzwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MzI8L2V4aWY6UGl4ZWxZRGltZW5zaW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KbAvF7QAAAEpJREFUSA1jYBgFoyEwlEKAEeTYqM75/2GOXlaeiFMMpgadZkIXIIdPFUPIsZg2enAGIrbAxuUEqoQJVQzB5cJR8dEQGA2BoRICAAcAEAuD4JOKAAAAAElFTkSuQmCC';
	var imgHeart = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAABCRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+CiAgICAgICAgIDx0aWZmOlJlc29sdXRpb25Vbml0PjI8L3RpZmY6UmVzb2x1dGlvblVuaXQ+CiAgICAgICAgIDx0aWZmOkNvbXByZXNzaW9uPjU8L3RpZmY6Q29tcHJlc3Npb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj43MjwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxYRGltZW5zaW9uPjQ4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj40ODwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAg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';
	var cmdCtrl = (navigator.platform.indexOf('Mac')>=0) ? 'cmd' : 'ctrl';



	var FAVstyle = '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">';
	FAVstyle += '<style id="FAVstyle">';
	FAVstyle += '#map-search .input-wrapper {width: 400px;} #map-search .input-wrapper input {width: 300px}';
	FAVstyle += 'ul#favloc {position: absolute; margin: -74px 0 0 310px; text-align: left; display: inline; padding: 15px 4px 17px 0; list-style: none} ul#favloc li {display: inline-block; margin-right: -4px; position: relative; padding: 0;} ul#favloc>li>a {display: inline-block; padding: 17px 15px;}  ul#favloc>li:hover, ul#favloc.visible {background: #D4E7ED; color: #5A899F} ul#favloc li ul {padding: 10px 20px 20px 20px; position: absolute; top: 48px; left: -20px; width: 300px; display: none; visibility: hidden;}';
	FAVstyle += 'ul#favloc li ul li {display: block; min-height: 32px; cursor: move; color: #5A899F; padding: 0;} ul#favloc li ul li:hover {background: #bfdce4 url(' + imgSort + ') center right no-repeat; border-radius: 0 5px 5px 0;} ul#favloc li:hover ul, ul#favloc.visible li ul {display: block; visibility: visible}';
	FAVstyle += 'ul#favloc li ul li a {border-bottom: 1px solid #BEDCE5; background: #D4E7ED; display: block; width: 247px; color: #5A899F; padding: 7px 5px 7px 15px; font-size: 12px; font-weight: 600; cursor: pointer;} ul#favloc li ul li a:hover, ul#favloc li ul li:hover a {background-color: #bfdce4; text-decoration: none;}';
	FAVstyle += 'ul#favloc li ul li a .fr {display: none; float: right;} ul#favloc li ul li:hover a .fr {display: inline-block; padding: 1px 4px 2px 4px;} ul#favloc li ul li a .fr:hover {color: #000;}';
	FAVstyle += 'ul#favloc li ul li.add-favloc {background: transparent;} ul#favloc li ul li.add-favloc a {border-color: #bfdce4; border-radius: 0 0 5px 5px;}';
	FAVstyle += 'ul#favloc i.fa-crosshairs, ul#favloc i.fa-plus-circle {margin-right: 5px;}';
	FAVstyle += '</style>';


	$('head').append(FAVstyle);





	function checkFavName(favName) {
		var f = (localStorage.WME_Favorites) ? JSON.parse(localStorage.WME_Favorites) : {};
		if (f.hasOwnProperty(favName)) {
			var i = 2;
			saveName = favName + ' ' + i;
			while (f.hasOwnProperty(saveName)) {
				i++;
				saveName = favName + ' ' + i;
			}
			return saveName;
		}
		else {
			return favName;
		}
	}





	function addFavLoc() {

		$('ul#favloc').addClass('visible');
		var WazePermalink = $('.WazeControlPermalink a.fa-link').attr('href');
		var w = getQueryStringAsObject(WazePermalink);

		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json?address=' + w.lat + ',' + w.lon + '&key=AIzaSyBSNGQYKnxf2oFR_GkIcEm1I-Om0b7nALs', function(data) {
			var geocodeName = data.results[1].formatted_address;
			var newFavName = prompt('Please enter location name', geocodeName);

			if (newFavName != null) {

				var saveName = checkFavName(newFavName);

				f[saveName] = WazePermalink;
				localStorage.setItem('WME_Favorites', JSON.stringify(f, null, 4));
				$('.add-favloc.disabled').before('<li><a href="' + WazePermalink + '" class="favloc"><i class="fa fa-crosshairs"></i> <span class="favName">' + saveName + '</span> <i class="fr fa fa-trash-o delete-favloc" data-item="' + saveName + '" title="Delete favorite location"></i><i class="fr fa fa-pencil edit-favloc" data-item="' + saveName + '" title="Rename / Relocate ('+cmdCtrl+'+click) location"></i></a></li>');
				$('.sortable').sortable('refresh');
				console.log('WME Favorites: "' + saveName + '" added');
			}

		});

		return false;

	}





	function editFavLoc(e, t) {

		$('ul#favloc').addClass('visible');
		var favName = t.siblings('.favName').html();

		if (e.ctrlKey || e.metaKey) {
			var r = confirm('Relocate "' + favName + '" to the current location?');
			if (r == true) {
				t.parents('.favloc').attr('href', $('.WazeControlPermalink a.fa-link').attr('href'));
				console.log('WME Favorites: "' + favName + '" relocated to new location');
			}
		}
		else {
			var r = prompt('Rename favorite location:', favName);
			if (r != null && r != favName) {
				var saveName = checkFavName(r);
				t.siblings('.favName').html(saveName);
				console.log('WME Favorites: "' + favName + '" renamed to "' + saveName + '"');
			}
		}

		updateFavLocList();
		return false;

	}





	function deleteFavLoc() {
		$('ul#favloc').addClass('visible');
		var fn = $(this).attr('data-item');
		var d = confirm('Delete favorite location "' + fn + '"?');
		if (d == true) {
			delete f[fn];
			$(this).closest('li').remove();
			localStorage.setItem('WME_Favorites', JSON.stringify(f, null, 4));
			console.log('WME Favorites: "' + fn + '" deleted');
		}

		return false;
	}





	function updateFavLocList() {
		var nf = {};
		$('#favloc li ul li:not(.disabled)').each(function() {
			var nfName = $('span.favName', this).html();
			var nfHref = $('a', this).attr('href');
			nf[nfName] = nfHref;
		});
		localStorage.setItem('WME_Favorites', JSON.stringify(nf, null, 4));
	}





	function openFavLoc() {
		var w = getQueryStringAsObject($(this).attr('href'));
		var xy = OpenLayers.Layer.SphericalMercator.forwardMercator(w.lon, w.lat);
		unsafeWindow.Waze.map.setCenter(xy);
		unsafeWindow.Waze.map.zoomTo(w.zoom);
		return false;
	}





	var f = (localStorage.WME_Favorites) ? JSON.parse(localStorage.WME_Favorites) : {};

	var favlocList = '<ul id="favloc">';
	favlocList += '<li class="add-favloc"><a href="#"><img src="' + imgHeart + '" height="24" width="24" id="fav-loc"></a>';
	favlocList += '<ul class="sortable">';
	$.each(f, function(fName, fHref) {
		favlocList += '<li><a href="' + fHref + '" class="favloc"><i class="fa fa-crosshairs"></i> <span class="favName">' + fName + '</span> <i class="fr fa fa-trash-o delete-favloc" data-item="' + fName + '" title="Delete favorite location"></i><i class="fr fa fa-pencil edit-favloc" data-item="' + fName + '" title="Rename / Relocate ('+cmdCtrl+'+click) location"></i></a></li>';
	});
	favlocList += '<li class="add-favloc disabled"><a href="#"><i class="fa fa-plus-circle"></i> Add current location</a></li>';
	favlocList += '</ul></li></ul>';


	$('#search').after(favlocList);





	$('.sortable')
		.sortable({items: ':not(.disabled)'})
		.bind('sortupdate', function() {
			$('ul#favloc').addClass('visible');
			updateFavLocList();
		});

	$(document)
		.on('click', '.add-favloc>a', addFavLoc)
		.on('click', '.favloc', openFavLoc)
		.on('click', '.edit-favloc', function(event) {editFavLoc(event, $(this)); return false;})
		.on('click', '.delete-favloc', deleteFavLoc)
		.on('click', function(event) {
			if (!$(event.target).closest('#favloc').length) {
				$('#favloc').removeClass('visible');
			}
		});


}



$(document).ready(FAV_Bootstrap);