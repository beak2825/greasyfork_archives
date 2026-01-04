// ==UserScript==
// @name        WME Draw Borders India
// @namespace   
// @version     0.3
// @author      giovanni-cortinovis
// @description Draw India Borders on WME
// @include        https://beta.waze.com/*editor/*
// @include        https://beta.waze.com/*editor*
// @include        https://www.waze.com/*editor/*
// @include       https://www.waze.com/*/editor*
// @include        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/editor/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABWElEQVRYR+2WvWoCQRRGv4UkRtywYhIjBkHQQlwQ1E4fQcXHSKH2eYS0apWXENSnUGIjI0JioRZa+AOuQTArO2FWTBdwliybYqYe7j1z+O5lJDh8JIf7QwAIA6YB+pqmToRReupJAkAY+CcGKOWegt1OByFLNkOIx+8gy1fcgySxY44hJ8BgsESj8Y5YzAdWYThco1iMIpHwc0FYAthuv1CtviGXi2A2+wRzFwrdoN0eoVJJQ1FcZ0NYAuh25xiPN/B4LlGv92AYFKVSCrpuIBiUkck82gvQ6cwxnW7gdl+gVjsCsJcfDgYCARnZrM0AmrY3GxcKUUwmmhnCcFhBqzVCuZyC13ttrwFWvd9foNn8gKremiEkZIV8PoJk8uHs5uyipQycOrAwErJgEwRVvecK36nGD4DvxcW9B7ie+svl9fP+uAcEgDDguIG/SLTVGuJbLgw4buAb9uOrIctJWU8AAAAASUVORK5CYII=
// @grant       GM_xmlhttpRequest
// @copyright   2016+, giovanni-cortinovis
// @downloadURL https://update.greasyfork.org/scripts/33457/WME%20Draw%20Borders%20India.user.js
// @updateURL https://update.greasyfork.org/scripts/33457/WME%20Draw%20Borders%20India.meta.js
// ==/UserScript==

DrBIndiaVersion = "0.2";

function bootstrapDrBIndia()
{
    var bGreasemonkeyServiceDefined = false;

    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    } catch (err) { /* Ignore */
    }

    if (typeof unsafeWindow === "undefined" || !bGreasemonkeyServiceDefined) {
        unsafeWindow = (function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        })();
    }

    setTimeout(initialiseDrBIndia, 2000);

}

function initialiseDrBIndia()
{
    // add new box to left of the map
    var addon = document.createElement('section');
    addon.id = "drbindia-addon";

    addon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABWElEQVRYR+2WvWoCQRRGv4UkRtywYhIjBkHQQlwQ1E4fQcXHSKH2eYS0apWXENSnUGIjI0JioRZa+AOuQTArO2FWTBdwliybYqYe7j1z+O5lJDh8JIf7QwAIA6YB+pqmToRReupJAkAY+CcGKOWegt1OByFLNkOIx+8gy1fcgySxY44hJ8BgsESj8Y5YzAdWYThco1iMIpHwc0FYAthuv1CtviGXi2A2+wRzFwrdoN0eoVJJQ1FcZ0NYAuh25xiPN/B4LlGv92AYFKVSCrpuIBiUkck82gvQ6cwxnW7gdl+gVjsCsJcfDgYCARnZrM0AmrY3GxcKUUwmmhnCcFhBqzVCuZyC13ttrwFWvd9foNn8gKremiEkZIV8PoJk8uHs5uyipQycOrAwErJgEwRVvecK36nGD4DvxcW9B7ie+svl9fP+uAcEgDDguIG/SLTVGuJbLgw4buAb9uOrIctJWU8AAAAASUVORK5CYII=" />'
        + ' <b>' + 'WME Draw Borders India</b> &nbsp; v' + DrBIndiaVersion;
    console.log('WME Draw Borders India: starting v' + DrBIndiaVersion + '!');

    vectorLayer = new OpenLayers.Layer.Vector("City Borders", {
        displayInLayerSwitcher: true,
        uniqueName: "DrawBordersIndia",
        shortcutKey: "S+b"

    });

    Waze.map.addLayer(vectorLayer);

    var section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.id = "DrBIndiaOptions";
    section.innerHTML = '<input type="button" id="_drbindiaDraw" value="Districts borders" /><br>'
        + '<input type="checkbox" id="_drbindiaRandom" checked /> Random colors<br><hr></div>';
    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-DrBIndia" data-toggle="tab"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAtklEQVQ4T2NkoBAwUqifAWzA/5nG/8kxiDH9LONgMeD/fwwv3Lv3geHBg48MXFysDIaG4gzs7MwYvmQEAXAYoBnw9OkXhv37H4I1MDMzMoiJcTM4O8sTb8DZsy8YHj36xDB16jkGT08lBnV1IQZPT2WwYcgAjws+M+zb9wjkNgYWFiYGUVEuBhcXBeJdAFJ59y4oDD7Aw4CDgwW3AUId7GSlg3cVPyGBOPAGkJOMYXqok5kocQEA+sJOETECIbwAAAAASUVORK5CYII=" /></a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-DrBIndia";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    getId('_drbindiaDraw').onclick = DrBIndiaDraw;

}

function DrBIndiaDraw()
{
    var urPos = Waze.controller.map.calculateBounds();
    urPos.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

    GM_xmlhttpRequest({
        method: "GET",
        synchronous: true,
        url: "https://www.cortinovis.cloud/waze/borders_india.php?bottom=" + urPos.bottom + "&top=" + urPos.top + "&left=" + urPos.left + "&right=" + urPos.right,
        headers: {
            "Accept": "text/xml"
        },
        onerror: function (response) {
            console.log('WME Draw Borders India: error!');
        },
        onload: function (response) {
            Confine = response.responseText;
            if (Confine.length > 0) {

                var elenco = JSON.parse(Confine);

                for (var i = 0; i < elenco.length; i++) {
                    Borders_DrawBorderIndia(elenco[i].comune, elenco[i].coords);
                }


            }
        }
    });
}

function Borders_DrawBorderIndia(cityname, coordinateString)
{
    var tempVector = coordinateString.split(",");
    var polyPoints = new Array(tempVector.length);
    for (var i = 0; i < tempVector.length; i++)
    {
        var coordinateVector = tempVector[i].split(" ");
        polyPoints[i] = new OpenLayers.Geometry.Point(coordinateVector[0], coordinateVector[1]).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            Waze.map.getProjectionObject() // to Spherical Mercator Projection
        );
    }

    var polygon = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));

    var clone = (function () {
        return function (obj) {
            Clone.prototype = obj;
            return new Clone();
        };
        function Clone() {
        }
    }());


    if (getId('_drbindiaRandom').checked) {
        site_style = new Borders_Stile(getRandomColor(), cityname);
    } else {
        site_style = new Borders_Stile('#000000', cityname);
    }

    var poly = new OpenLayers.Feature.Vector(polygon, null, site_style);
    vectorLayer.addFeatures(poly);

}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function Borders_Stile(color, etichetta) {
    this.fill = false;
    this.stroke = true;
    this.strokeColor = color;
    this.strokeWidth = 4;
    this.label = etichetta;
    this.fontSize = 20;
    this.fontColor = color;
    this.fontWeight = "bold";
}

function getId(node) {
    return document.getElementById(node);
}

function getElementsByClassName(classname, node) {
    if (!node)
        node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++)
        if (re.test(els[i].className))
            a.push(els[i]);
    return a;
}

bootstrapDrBIndia();