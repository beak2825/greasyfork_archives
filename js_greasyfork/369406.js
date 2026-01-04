// ==UserScript==
// @name                WME LV Speedcams
// @author              someone, madnut
// @description         Overlay speedcams for Latvia
// @include             https://*waze.com/*editor*
// @exclude             https://*waze.com/*user/editor*
// @version             0.3.1
// @grant               GM_xmlhttpRequest
// @connect             google.com
// @require             https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @namespace           waze-ua
// @downloadURL https://update.greasyfork.org/scripts/369406/WME%20LV%20Speedcams.user.js
// @updateURL https://update.greasyfork.org/scripts/369406/WME%20LV%20Speedcams.meta.js
// ==/UserScript==

var divLMAO;
var SCLV_Layer;

function bootstrapSCLV() {
  var bGreasemonkeyServiceDefined = false;

  try {
    bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
  } catch (err) {
    /* Ignore */
  }

  if (typeof unsafeWindow === "undefined" || !bGreasemonkeyServiceDefined) {
    unsafeWindow = (function () {
      var dummyElem = document.createElement('p');
      dummyElem.setAttribute('onclick', 'return window;');
      return dummyElem.onclick();
    })();
  }

  setTimeout(initializeSCLV, 999);
}

function checkLayerNum() {
  var lvolLayer = null;
  for (var i = 0; i < W.map.layers.length; i++) {
    if (W.map.layers[i].uniqueName == '__speedcamlv')
      lvolLayer = i;
  }
  return lvolLayer;
}

function getSpeedcamLV() {

  SCLV_Layer.destroyFeatures();

  //var url_kmz = "http://www.google.com/maps/d/u/0/kml?mid=1DbGaups3ELitC9XYVVouGAZk3ps&lid=zqWgRc-lhNx4.khyZvhofiPWI";
  var url_kml = "https://www.google.com/maps/d/u/0/kml?mid=1DbGaups3ELitC9XYVVouGAZk3ps&forcekml=1";

  GM_xmlhttpRequest({
    url: url_kml,
    method: 'GET',
    timeout: 10000,
    onload: function (res) {
      var parser = new OL.Format.KML({
          extractStyles: true,
          extractAttributes: true
        });
      parser.internalProjection = W.map.getProjectionObject();
      parser.externalProjection = new OL.Projection("EPSG:4326");
      var features = parser.read(res.responseText);
      // TODO: customize features before adding
      SCLV_Layer.addFeatures(features);
    },
    onreadystatechange: function (res) {
      // loading
    },
    ontimeout: function (res) {
      alert("Request timeout!");
    },
    onerror: function (res) {
      alert("Request error!");
    }
  });
}

function addImage(name, dscr, color, speed, lat, lon) {
  var coords = OL.Layer.SphericalMercator.forwardMercator(lon, lat);
  var point = new OL.Geometry.Point(coords.lon, coords.lat);
  var px = W.map.getPixelFromLonLat(new OL.LonLat(coords.lon, coords.lat));
  var imgRoot = '/assets';

  var attributes = {
    name: name,
    description: dscr,
    speed: speed,
    pixel: px
  };

  var icon;
  if (color.indexOf("green") > -1) {
    icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAPGSURBVHjarJZdaFtlGMf/52RJ87lmnSVja0BcsguF1lhJwW6B1dSkUDsI6ZpjapHRL84pSak91i61rWeHFBO8KIT0lCZNrtogsgsFkW164a13omidV8Iu9UbY5pg+XtQUupzTbm928bs4Fy//3/s+7/M+B0QEPSqVCqrVKjRNw/LyMmZmZiAIgqWnp+ea2+2+BWAPwG8A9lpbW7/p7u6eGh0dtYqiiEwmg42NDVSrVVQqFRhlEBFwnMDm5iZUVcXg4KBgOee6D44jAITTIJwH4QXsf3Mgyxnng2g0ek1RFGia9nwEqtUquqIXP+f4/4PVEKE80sgnbxJaQOA4evly8Kv6+qYEarUagkPhmwAIMad+8JMk2wkABSKXvt7d3WUX2NragiRJ74LnCMOtTxde572zBIDGx8elUqnEJpDL5WB98dRDAM8WXuckqOWs6++1tTUrk8DQ0JB0ZM2P49MIAaBIJHKdSaC9vf0O8+7rAOR2u79jEgDwCyxNCuy36B6rwF14mhTwgQDcZRX4qekSuEAAfmYS8Hq9Xz6PO+DxeG4zCSQSiXc4niPIXWzhH/cSAIrFYiKTgKqqcJ/z3GM+BYBsF07fVxSF7SEqlUpYWlq6bLKeIASfUaIPxJl5kmX57XK53NwsSCaTH3AmjvDWU0rEnASOo3g8fqNWqzU3jOoS8Xg8D4Ag+o4O//A1AkDBK+Gb9UHU1DCqs7Ozgws9Xd8DIJSuHll37yv+X2u1Gra3t1Eul8FcgmKxeICmadA0zWI543oEh0EpukHmU7Z/8vm8t1gsolAoHMAkkM/nD7G+vg5BEN4HQLhx6XB46SoBoL6+vu1CodCwlklgdXW1gWw2C+v5tgcNM+IiyOSyPFYU5WQ2m4WqqodgfgeeJJfLIRaLLQAgaLFDtQ8EAl/kcjkoitIAk8DCwoIusizbeYf5Ma7Y9sOvv06ciad0Ov2G3u6ZT2Bubk6XxcVFtL/UsXfwQgZALS77XysrK8hkMrowCYiiqEsqlUIoFProQAAgv99/S5ZlpFIpXZgEpqendRFFEclk8lX+BE+Y76z/donpdBqSJOnCJDAyMmJIIpGAqcX8CADxPP/v2NiYXxRFQ2kmgeHhYUMEQYDNZvsTAJnN5odTU1OYnJw0hEmgv7/fkIGBATidzt8BkN1u/yORSCAejxvCJBAOhw2JRqNoa2v7EQA5HI57oVAIvb29hjAJTExMGCJJEnw+37cAqKOj44fZ2VnDrhFFkU0gnU4bIssygsHgJgDq7Oz8bH5+3rAFj2vD/wYAevF106CHVtEAAAAASUVORK5CYII=";
  } else {
    icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAQXSURBVHjarNZdSFtnHMfx30lOjBrf6wvzZRNmqV1L0NpGUMjaYjAyKxi0nkyXOpnGnrhEMkOwceoOIY6EjcmCHjExGQONY+xiG2wXbmMvjMEGpSKzsx0bY+ugY91FBxus+t+FRLDmzPbJLr6Xh//nPE+e8wREhFTFYjHE43HIsozJyUmMjIzAarVmNDY2DhQXF6zxvGpLrea+53lu68iR/E8aGhrsfX19maIowufzYX5+HvF4HLFYDEoziAg4DLCwsAC/34/29nZr/Zn8eyoVR5VHQc8/B/K5Qc5BUHUtiONAJ+ry7pnN5gFJkiDL8v8DiMfjEL36dZ7n6GIn6Mb6o/Tnb40H+nHzceq3glQqjvovn/g2+XxagEQiAfdk/QYAWo0j5eD7e3cVBIAGXPrNlZUVdsDi4iIcDsczajVHb7/5YMOTffDO7paIYv9oJBJhAwSDQRia8rcvdj7c8GSX+0En63K3Z2ZmMpkAHR0dDkB5zw/r5xvHCAC1trZeYQKUlJSslVazvX2y43pQSXHhF0wAnue+uySkB3AOgnie22IF3By1pweYeAHE89xNVsAm6w8w2fAlEM9z15kAVVVV76kL0wOUVoMqKso+YgIIgvA0z3P0zef5TMOvX60gjgNZLBaRCeD3+1GrL7lzysC2CufOg548X7gtSRLbhygSiWBiYuKcLpenV/wPh1h4DZSZpSKPx3MhGo2mdxc82y9c0WSoKBp+MMRqHKRSc2QVOmcSiUR6l1ESYRU6XwVAn37I/+fwq18WEQByT9ZvJC+itC6jZMvLy3jKcuwHAHT3tkERoCoANZ197NdEIoGlpSVEo1Ewb8Hc3NxesixDluWM4ydzduy21FsRfAn0SIWWQqFQ1dzcHMLh8F5MgFAotK/Z2VnYbN1eALR1rWrf8Lu3DQSATKazb4TD4QPPMgGmp6cPFAgE0GQs2L7/jng9CCor1+5IkpQXCATg9/v3xfwduL9gMAiLxeIFQH/cOrUHgA50+nTd+8FgEJIkHYgJ4PV6U+bxeLKLy7Q7y9HdVbj2VTFpMlTkcrmaUr098wq43e6UjY+P40xz+a0W0y7g5SlQabnur6mpKfh8vpQxAURRTJnT6YTRaHwR2AU8UQeqra1Z83g8cDqdKWMCDA8Pp0wURfT29tZptSr6+rO85N8u0eVyweFwpIwJ0NPTo5ggCMjN1/4DgHiNasdmsx0VRVERzQTo7u5WzGq1Iisr6w4A0mg0f9vtdgwNDSnGBDCZTIq1tbUhJyfnJwCUnZ39uyAI6OrqUowJ0NLSopjZbEZRUdEGANLpdL8YjUY0NzcrxgQYHBxUzOFwoKam5mMAVFlZuT46Oqp4akRRZAO4XC7FPB4PDAbDAgDS6/VvjY2NKR7Bw47hvwMAZ66H8FWoXBEAAAAASUVORK5CYII=';
  }

  var style = {
    externalGraphic: icon,
    graphicWidth: 32,
    graphicHeight: 32,
    fillOpacity: 1,
    title: 'SpeedCam',
    cursor: 'help'
  };

  var imageFeature = new OL.Feature.Vector(point, attributes, style);

  SCLV_Layer.addFeatures([imageFeature]);
  //console.log('WME SCLV: Added SpeedCam at ' + lat + ',' + lon + '('+ px +')');
}

function initializeSCLV() {
  //console.log("WME SCLV: Initializing");
  var lvolVisibility = true;

  SCLV_Layer = new OL.Layer.Vector("LV Speedcams", {
      rendererOptions: {
        zIndexing: true
      },
      uniqueName: '__speedcamlv'
    });
  I18n.translations[I18n.locale].layers.name["__speedcamlv"] = "LV Speedcams";

  // restore saved settings
  if (localStorage.WME_LV_Speedcam) {
    //console.log("WME SCLV: loading options");
    var options = JSON.parse(localStorage.getItem("WME_LV_Speedcam"));

    lvolVisibility = options[0];
  }

  // overload the WME exit function
  var saveSCLVOptions = function () {
    if (localStorage) {
      //console.log("WME SCLV: saving options");
      var options = [];

      lvolVisibility = SCLV_Layer.visibility;
      options[0] = lvolVisibility;

      localStorage.setItem("WME_LV_Speedcam", JSON.stringify(options));
    }
  };

  window.addEventListener("beforeunload", saveSCLVOptions, false);

  function showSpeedCamPopup(f, pos) {
    //shift popup if SC panel is visible
    try {
      var scX = pos.x + 200;
      var scY = pos.y - 100;
      //console.log('WME SCLV: shift popup ('+scX+','+scY+')');
      divLMAO.style.top = scY + 'px';
      divLMAO.style.left = scX + 'px';
    } catch (e) {
      //console.log('WME SCLV: Could not shift popup');
    }

    var attributes = f.attributes;

    var scDescription = (attributes.description ? attributes.description : "");
    var scName = (attributes.name ? attributes.name : "");
    //var scSpeed = (attributes.speed ? attributes.speed : "");

    var reportDetail = "<b>NAME: </b>" + scName
       + "<br><b>DESCRIPTION: </b>" + scDescription;
    //   + "<br><b>SPEED: </b>" + scSpeed;

    document.getElementById("divLMAO").innerHTML = reportDetail;

    divLMAO.style.visibility = 'visible';
  }

  function hideSpeedCamPopup() {
    divLMAO.style.visibility = 'hidden';
    ////console.log('WME SCLV: popup divLMAO X:'+divLMAO.style.left+' Y:'+divLMAO.style.top);
  }

  SCLV_Layer.setZIndex(9999);
  W.map.addLayer(SCLV_Layer);
  W.map.addControl(new OL.Control.DrawFeature(SCLV_Layer, OL.Handler.Path));
  SCLV_Layer.setVisibility(lvolVisibility);

  var divPopupCheck = document.getElementById('divLMAO');
  if (divPopupCheck === null) {
    divLMAO = document.createElement('div');
    divLMAO.id = "divLMAO";
    divLMAO.style.position = 'absolute';
    divLMAO.style.visibility = 'hidden';
    divLMAO.style.zIndex = 1000;
    divLMAO.style.backgroundColor = '#FFFF80';
    divLMAO.style.borderWidth = '2px';
    divLMAO.style.borderStyle = 'solid';
    divLMAO.style.borderRadius = '5px';
    divLMAO.style.boxShadow = '5px 5px 5px rgba(50, 50, 50, 0.3)';
    divLMAO.style.padding = '5px';
    divLMAO.style.width = '700px';
    document.body.appendChild(divLMAO);
    //console.log('WME SCLV: Creating popup divLMAO');
  }

  //clear existing SCLV features
  SCLV_Layer.destroyFeatures();

  var lvolLayer = checkLayerNum();

  W.map.events.register("mousemove", W.map, function (e) {
    hideSpeedCamPopup();
    var pos = this.events.getMousePosition(e);
    var position = W.map.getLonLatFromPixel(pos);
    ////console.log('WME SCLV: coords xy = ' + position.x + ' ' + position.y);
    var lvolLayer = checkLayerNum();

    if (W.map.layers[lvolLayer]) {

      //var scCount = W.map.layers[lvolLayer].features.length;
      // //console.log('WME SCLV: Current Speedcam count = ' + scCount);

      var scFeatures = W.map.layers[lvolLayer].features;
      for (var j = 0; j < scFeatures.length; j++) {

        var lvolLayerVisibility = SCLV_Layer.getVisibility();
        var scX = scFeatures[j].geometry.x;
        var scY = scFeatures[j].geometry.y;
        if (lvolLayerVisibility === true && position.lon > scX - 20 && position.lon < scX + 20 && position.lat > scY - 30 && position.lat < scY + 30) {
          //console.log('WME SCLV: hover over Speedcam ('+scX+','+scY+')');
          showSpeedCamPopup(scFeatures[j], pos);
        }
      }
    }
  });

  //refresh if user moves map
  W.map.events.register("moveend", W.map, getSpeedcamLV);
  window.setTimeout(getSpeedcamLV(), 500);
}

bootstrapSCLV();
