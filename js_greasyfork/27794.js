// ==UserScript==
// @name         rTorrent Magnet Download
// @version      2.0.10
// @description  Add download link for rtorrent
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUNBQzQ3ODMzNDFEMTFFMzlFOEJCRDVCRkVFQjcwNjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUNBQzQ3ODQzNDFEMTFFMzlFOEJCRDVCRkVFQjcwNjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQ0FDNDc4MTM0MUQxMUUzOUU4QkJENUJGRUVCNzA2NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0FDNDc4MjM0MUQxMUUzOUU4QkJENUJGRUVCNzA2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgmETBgAAAC0SURBVHjaYvz//z8DMnB3d0cR2LlzJyMynxGmAabwsXwBw3V5T7AY+9+fDPZH/VA0gjWAFCMrRAcwjSBNjG5ubngVo2tiwSWB7jwYAGtgxGI1zF8gxjUkTUwg4j8epyDLgfzLxEAAIIcpIyMjxEk9Af8Z9PSegAWSjqJq6AbK6es/BZueDJRjATFACkGYiQnTQpgcCIM9DWOANP77948BPeZhciihNGHCBBQTkQGyHAgABBgALadaZy194PkAAAAASUVORK5CYII=
// @include      *
// @noframes
// @namespace https://greasyfork.org/users/13667
// @downloadURL https://update.greasyfork.org/scripts/27794/rTorrent%20Magnet%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/27794/rTorrent%20Magnet%20Download.meta.js
// ==/UserScript==

var domain = window.location.host.match(/(?:www\.)?(.*)/i);

var style = 'style="padding: 5px;"';
var action = 'appendTo';

/* domain specific settings */
if (domain) {
  switch (domain[1]) {
    case 'kickass.so':
    case 'kickass.to':
    case 'kat.cr':
      if($('#mainDetailsTable').length == 1)
        style = 'style="margin-left: 4px; vertical-align: top; padding: 7px 8px;" class="siteButton"';
      else
        style = 'style="margin-left: 4px; vertical-align: top; padding: 3px 4px;" class="siteButton"';
      break;
    case 'thepiratebay.org':
      style = 'style=""';
      //action = 'prependTo';
      break;
  }
}

/* specify button */
var buttons = [
  {
    title:	'Watch5',
    image:	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjMzNzQzNkUzN0Q5MTFFMzgwMkQ5NDMwNkE3ODk4MkYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjMzNzQzNkYzN0Q5MTFFMzgwMkQ5NDMwNkE3ODk4MkYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMzM3NDM2QzM3RDkxMUUzODAyRDk0MzA2QTc4OTgyRiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMzM3NDM2RDM3RDkxMUUzODAyRDk0MzA2QTc4OTgyRiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhRQNe8AAACvSURBVHjahJHBDcMgDEVtlI7QLtBLO0ZTFUbMBBkhB3pKtsg52QMaA27AqKklJOD/h7GN3nvIwxhTXFhrMT8jA2yczRtO5+TZbq79qwADQObCKCOBBKHW+tgsoOaXUH0vRcMmmZrrmvUGXXZIxdIPvpJpVK+Cf5E1GREj0N0GGB8LTM+18nf3AaZ2hbFdYg2UhshAqzoha7QCwBsCnXMgJ8/a9wGagzTkXZLaR4ABAJXiUzgoklpHAAAAAElFTkSuQmCC',
    href:	'//magic.home.lan/torrent/magnet.php?w=5&d=',
    style:  style,
    action: action,
  },
  {
    title:	'Watch1',
    image:	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RUNBQzQ3ODMzNDFEMTFFMzlFOEJCRDVCRkVFQjcwNjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RUNBQzQ3ODQzNDFEMTFFMzlFOEJCRDVCRkVFQjcwNjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFQ0FDNDc4MTM0MUQxMUUzOUU4QkJENUJGRUVCNzA2NyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFQ0FDNDc4MjM0MUQxMUUzOUU4QkJENUJGRUVCNzA2NyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgmETBgAAAC0SURBVHjaYvz//z8DMnB3d0cR2LlzJyMynxGmAabwsXwBw3V5T7AY+9+fDPZH/VA0gjWAFCMrRAcwjSBNjG5ubngVo2tiwSWB7jwYAGtgxGI1zF8gxjUkTUwg4j8epyDLgfzLxEAAIIcpIyMjxEk9Af8Z9PSegAWSjqJq6AbK6es/BZueDJRjATFACkGYiQnTQpgcCIM9DWOANP77948BPeZhciihNGHCBBQTkQGyHAgABBgALadaZy194PkAAAAASUVORK5CYII=',
    href:	'//magic.home.lan/torrent/magnet.php?w=1&d=',
    style:  style,
    action: action,
  },
];

function doJSON(e) {
  e.preventDefault();
  var request = new XMLHttpRequest();
  request.open('GET', this.href, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var data = JSON.parse(request.responseText);
      alert(data.msg + data.err);
    } else {
      alert("Server error: " + request.statusText);
    }
  };
  request.onerror = function() {
    console.debug(request);
    alert("Unable to connect");
  };
  request.send();
}

var magnets = document.querySelectorAll('a[href^="magnet"]');
for (var item of magnets) {
  for (var button of buttons) {
    var btn = document.createElement('a');
    btn.innerHTML = '<img ' + button.style + ' src="' + button.image + '" />';
    btn.title = button.title;
    btn.href = button.href + encodeURIComponent(item.href);
    btn.addEventListener('click', doJSON);
    if(button.action=='prependTo') {
      item.parentNode.insertBefore(btn, item);
      //item.parentElement.insertBefore(btn, item.parentElement.firstChild);
    } else {
      item.parentNode.insertBefore(btn, item.nextSibling);
      //item.parentElement.appendChild(btn);
    }
  }
}