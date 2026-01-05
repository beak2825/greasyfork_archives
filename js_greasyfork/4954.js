// ==UserScript==
// @name        Spade World Boundary
// @description This adds a world boundary overlay to the Overviewer map of the Spade server.
// @namespace   http://ermarian.net/resources/minecraft/spade/
// @include     http://te.calref.net/~minecraft/spade/*
// @version     3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4954/Spade%20World%20Boundary.user.js
// @updateURL https://update.greasyfork.org/scripts/4954/Spade%20World%20Boundary.meta.js
// ==/UserScript==

circle = function (point, r, tileSet, opts, vertices) {
  opts.paths = [];
  for (var i = 0; i <= vertices; i++) {
    var angle = i / vertices * 2 * Math.PI;
    var p = polar(point, r, angle, tileSet);
    opts.paths.push(p);
  }
  return new google.maps.Polygon(opts);
}

cartesian = overviewer.util.fromWorldToLatLng;

polar = function (center, r, phi, tileSet) {
  return cartesian(center[0] + r * Math.cos(phi), center[1], center[2] + r * Math.sin(phi), tileSet);
}

/* Copied from overviewer.views.OverlayControlView.addItem.
 * The view and its DOM element are not exposed, so we need
 * to find the element and apply this static function to it.
 */
overlayControlAddItem = function(control, item) {
  var itemDiv = document.createElement('div');
  var itemInput = document.createElement('input');
  itemInput.type='checkbox';

  itemInput.checked =false;

  // give it a name
  $(itemInput).attr("_mc_overlayname", item.name);
  jQuery(itemInput).click((function(local_item) {
    return function(e) {
      item.action(local_item, e.target.checked);
    };
  })(item));

  $(".dropDown", control)[0].appendChild(itemDiv);
  itemDiv.appendChild(itemInput);
  var textNode = document.createElement('text');
  textNode.innerHTML = item.label + '<br/>';

  itemDiv.appendChild(textNode);
}

overviewer.views.WorldPolarView = Backbone.View.extend({
  render: function () {
    if (overviewer.collections.spawnMarker) {
      var curTileSet = overviewer.mapView.options.currentTileSet;
      var spawn = curTileSet.get('spawn');
      var circles = [];
      for (var i = 500; i <= 2500; i+=500) {
        var c = circle(spawn, i, curTileSet, {
          strokeColor: '#FF0000',
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillOpacity: 0,
          fillColor: '#00FF00'
        }, 100);
        circles.push(c);
      }
      var lineSymbol = {
        path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
      };
      circles[4].fillOpacity = 0.1;
      for (var i = 0; i < 360; i += 45) {
        var p = new google.maps.Polyline({
          path: [
            polar(spawn, 0, 0, curTileSet),
            polar(spawn, 3000, i * Math.PI / 180, curTileSet)
          ],
          icons: [{
            icon: lineSymbol,
            offset: '100%'
          }],

          strokeColor: '#FF0000',
          strokeWeight: 2,
          strokeOpacity: 0.5
        });
        circles.push(p);
      }
      return circles;
    }
  }
});

overviewer.views.WorldCartesianView = Backbone.View.extend({
  render: function () {
    var curTileSet = overviewer.mapView.options.currentTileSet;
    var grid = [];
    grid.push(new google.maps.Polyline({
      path: [
        cartesian(0, 64,  -3000, curTileSet),
        cartesian(0, 64, 3000, curTileSet)
      ],
      strokeColor: '#FFFF00',
      strokeWeight: 4,
      strokeOpacity: 0.75
    }));
    grid.push(new google.maps.Polyline({
      path: [
        cartesian(-3000, 64, 0, curTileSet),
        cartesian(3000, 64, 0, curTileSet)
      ],
      strokeColor: '#FFFF00',
      strokeWeight: 4,
      strokeOpacity: 0.75
    }));
    for (var i = 500; i <= 2500; i+=500) {
      grid.push(new google.maps.Polyline({
        path: [
          cartesian(i, 64,  -3000, curTileSet),
          cartesian(i, 64, 3000, curTileSet)
        ],
        strokeColor: '#FFFF00',
        strokeWeight: 2,
        strokeOpacity: 0.5
      }));
      grid.push(new google.maps.Polyline({
        path: [
          cartesian(-3000, 64, i, curTileSet),
          cartesian(3000, 64, i, curTileSet)
        ],
        strokeColor: '#FFFF00',
        strokeWeight: 2,
        strokeOpacity: 0.5
      }));
      grid.push(new google.maps.Polyline({
        path: [
          cartesian(-i, 64,  -3000, curTileSet),
          cartesian(-i, 64, 3000, curTileSet)
        ],
        strokeColor: '#FFFF00',
        strokeWeight: 2,
        strokeOpacity: 0.5
      }));
      grid.push(new google.maps.Polyline({
        path: [
          cartesian(-3000, 64, -i, curTileSet),
          cartesian(3000, 64, -i, curTileSet)
        ],
        strokeColor: '#FFFF00',
        strokeWeight: 2,
        strokeOpacity: 0.5
      }));
    }
    return grid;
  }
});

overviewer.util.ready(function () {
  var polar = (new overviewer.views.WorldPolarView()).render();
  var cartesian = (new overviewer.views.WorldCartesianView()).render();


  // Find the overlay menu:
  var overlayControl = overviewer.map.controls[google.maps.ControlPosition.TOP_RIGHT].j[2];

  overlayControlAddItem(
    overlayControl, {
      label: "Polar Grid",
      name:"polar",
      action: function(item, checked) {
        for (var e in polar) {
          polar[e].setMap(checked ? overviewer.map : null);
        }
      }
  });
  overlayControlAddItem(
    overlayControl, {
      label: "Cartesian Grid",
      name:"grid",
      action: function(item, checked) {
        for (var e in cartesian) {
          cartesian[e].setMap(checked ? overviewer.map : null);
        }
      }
  });
});
