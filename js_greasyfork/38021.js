// ==UserScript==
// @name        WME Draw Borders Brazil
// @namespace   
// @version     0.31
// @author      ronsek57 based on the original work of giovanni-cortinovis
// @description Draw Brazil Borders on WME
// @include        https://beta.waze.com/*editor/*
// @include        https://beta.waze.com/*editor*
// @include        https://www.waze.com/*editor/*
// @include       https://www.waze.com/*/editor*
// @include        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/editor/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrUlEQVQ4T42TXUhTYRjH/8/O5nZs6tpQl58nv4qiIIxylZp9EIImQRbUXQQGQYH0cSHLvDQSuuiiiwgJLySvIog6RQZFplRqGoplx/xIt9T5NTe3nfeNnZlMK/B9L96X5/D8nh+H/0uILFo+196jyitXHlXkhMrtMfD4RK1oZtGgfzVHags6DoOOw5e2SOba4k+ZuXm7iMIa4b3GJxrDgfB4Dg6VMwx19jaTsbZYEXNSJYEIOloGLDeVmKcwoxrQ6Ytf5c84R4hz+N71y2SqLVJis1MkgXQaQAfApg+iNvkryhNcYBxo8qThljsLC0zQDCIABm/bgEzijSJFzErWAGGLSosb1ZZhND8qwNuPOdCRiiP7v6D0eCduurPxcn4jGAgqOBbbBmUyOQsVcXOilGUMoD7lGw6YPWhsrcSbrmz4J0MYHZoCYxxny7pRdaodj2dsqBmT4ArqEeiekGmDc59yKX9JumYfhkgMfr+Aqoar8C4GkGRPgD03AXNzPvx434eW243aL/SEBDhHM/CwlckUV+NQqnd7perkERgJ8C8ZUHbxPBgDiAgqYzCKBhw9aceVQzUaYC6kQ93PdNx/BZmMNQ7FkBovbTEtoSH9OwrM83DePYaO3jwEAyFN32gy4HRpD85VvMazWSuuj0oYDQgIdrlkstY5FFN6gqQjAQIIZ6xuVMWP40GzA22fs2DQcxzeO4ATFR2o/5WJp7NWcM60HPi7JmTacadQMWdapEgGSNNOFAK4nKRgjzijKb9YSMK9yQzMq3otROHNOIPnw7hM5U0lik2ySOHGlSQuxyY/1gOvqkf/UtyqIGkIzjDWPi7ThZaDfZk7bVsjGVzfUwgDwmY9z0eekN1u3RYTK26y2aykF/T/f0BRX/yqH9Ouaa4GaPDPyPWN/hvPfwNK/RFTDU287QAAAABJRU5ErkJggg==
// @grant       GM_xmlhttpRequest
// @copyright   2016+, giovanni-cortinovis, ronsek57
// @downloadURL https://update.greasyfork.org/scripts/38021/WME%20Draw%20Borders%20Brazil.user.js
// @updateURL https://update.greasyfork.org/scripts/38021/WME%20Draw%20Borders%20Brazil.meta.js
// ==/UserScript==

DrBBrazilVersion = "0.31";

function bootstrapDrBBrazil()
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

    setTimeout(initialiseDrBBrazil, 2000);

}

function initialiseDrBBrazil()
{
    // add new box to left of the map
    var addon = document.createElement('section');
    addon.id = "drbbrazil-addon";

    addon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrUlEQVQ4T42TXUhTYRjH/8/O5nZs6tpQl58nv4qiIIxylZp9EIImQRbUXQQGQYH0cSHLvDQSuuiiiwgJLySvIog6RQZFplRqGoplx/xIt9T5NTe3nfeNnZlMK/B9L96X5/D8nh+H/0uILFo+196jyitXHlXkhMrtMfD4RK1oZtGgfzVHags6DoOOw5e2SOba4k+ZuXm7iMIa4b3GJxrDgfB4Dg6VMwx19jaTsbZYEXNSJYEIOloGLDeVmKcwoxrQ6Ytf5c84R4hz+N71y2SqLVJis1MkgXQaQAfApg+iNvkryhNcYBxo8qThljsLC0zQDCIABm/bgEzijSJFzErWAGGLSosb1ZZhND8qwNuPOdCRiiP7v6D0eCduurPxcn4jGAgqOBbbBmUyOQsVcXOilGUMoD7lGw6YPWhsrcSbrmz4J0MYHZoCYxxny7pRdaodj2dsqBmT4ArqEeiekGmDc59yKX9JumYfhkgMfr+Aqoar8C4GkGRPgD03AXNzPvx434eW243aL/SEBDhHM/CwlckUV+NQqnd7perkERgJ8C8ZUHbxPBgDiAgqYzCKBhw9aceVQzUaYC6kQ93PdNx/BZmMNQ7FkBovbTEtoSH9OwrM83DePYaO3jwEAyFN32gy4HRpD85VvMazWSuuj0oYDQgIdrlkstY5FFN6gqQjAQIIZ6xuVMWP40GzA22fs2DQcxzeO4ATFR2o/5WJp7NWcM60HPi7JmTacadQMWdapEgGSNNOFAK4nKRgjzijKb9YSMK9yQzMq3otROHNOIPnw7hM5U0lik2ySOHGlSQuxyY/1gOvqkf/UtyqIGkIzjDWPi7ThZaDfZk7bVsjGVzfUwgDwmY9z0eekN1u3RYTK26y2aykF/T/f0BRX/yqH9Ouaa4GaPDPyPWN/hvPfwNK/RFTDU287QAAAABJRU5ErkJggg==" />'
        + ' <b>' + 'WME Draw Borders Brazil</b> &nbsp; v' + DrBBrazilVersion;
    console.log('WME Draw Borders Brazil: starting v' + DrBBrazilVersion + '!');

    vectorLayer = new OpenLayers.Layer.Vector("City Borders", {
        displayInLayerSwitcher: true,
        uniqueName: "DrawBordersBrazil",
        shortcutKey: "S+b"

    });

    W.map.addLayer(vectorLayer);

    var section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.id = "DrBBrazilOptions";
    section.innerHTML = '<input type="button" id="_drbbrazilDraw" value="Show borders" /><br>'
        + '<input type="checkbox" id="_drbbrazilRandom" checked /> Random colors<br><hr></div>';
    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-DrBBrazil" data-toggle="tab"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACrUlEQVQ4T42TXUhTYRjH/8/O5nZs6tpQl58nv4qiIIxylZp9EIImQRbUXQQGQYH0cSHLvDQSuuiiiwgJLySvIog6RQZFplRqGoplx/xIt9T5NTe3nfeNnZlMK/B9L96X5/D8nh+H/0uILFo+196jyitXHlXkhMrtMfD4RK1oZtGgfzVHags6DoOOw5e2SOba4k+ZuXm7iMIa4b3GJxrDgfB4Dg6VMwx19jaTsbZYEXNSJYEIOloGLDeVmKcwoxrQ6Ytf5c84R4hz+N71y2SqLVJis1MkgXQaQAfApg+iNvkryhNcYBxo8qThljsLC0zQDCIABm/bgEzijSJFzErWAGGLSosb1ZZhND8qwNuPOdCRiiP7v6D0eCduurPxcn4jGAgqOBbbBmUyOQsVcXOilGUMoD7lGw6YPWhsrcSbrmz4J0MYHZoCYxxny7pRdaodj2dsqBmT4ArqEeiekGmDc59yKX9JumYfhkgMfr+Aqoar8C4GkGRPgD03AXNzPvx434eW243aL/SEBDhHM/CwlckUV+NQqnd7perkERgJ8C8ZUHbxPBgDiAgqYzCKBhw9aceVQzUaYC6kQ93PdNx/BZmMNQ7FkBovbTEtoSH9OwrM83DePYaO3jwEAyFN32gy4HRpD85VvMazWSuuj0oYDQgIdrlkstY5FFN6gqQjAQIIZ6xuVMWP40GzA22fs2DQcxzeO4ATFR2o/5WJp7NWcM60HPi7JmTacadQMWdapEgGSNNOFAK4nKRgjzijKb9YSMK9yQzMq3otROHNOIPnw7hM5U0lik2ySOHGlSQuxyY/1gOvqkf/UtyqIGkIzjDWPi7ThZaDfZk7bVsjGVzfUwgDwmY9z0eekN1u3RYTK26y2aykF/T/f0BRX/yqH9Ouaa4GaPDPyPWN/hvPfwNK/RFTDU287QAAAABJRU5ErkJggg==" /></a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-DrBBrazil";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    getId('_drbbrazilDraw').onclick = DrBBrazilDraw;

}

function DrBBrazilDraw()
{
    var urPos = Waze.controller.map.calculateBounds();
    urPos.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

    GM_xmlhttpRequest({
        method: "GET",
        synchronous: true,
        url: "https://wmebr.info/borders_brazil.php?bottom=" + urPos.bottom + "&top=" + urPos.top + "&left=" + urPos.left + "&right=" + urPos.right,
        headers: {
            "Accept": "text/xml"
        },
        onerror: function (response) {
            console.log('WME Draw Borders Brazil: error!');
        },
        onload: function (response) {
            Confine = response.responseText;
            if (Confine.length > 0) {

                var elenco = JSON.parse(Confine);

                for (var i = 0; i < elenco.length; i++) {
                    Borders_DrawBorderBrazil(elenco[i].comune, elenco[i].coords);
                }


            }
        }
    });
}

function Borders_DrawBorderBrazil(cityname, coordinateString)
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


    if (getId('_drbbrazilRandom').checked) {
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

bootstrapDrBBrazil();