// ==UserScript==
// @name        WME Draw Borders Team India
// @namespace   
// @version     0.62
// @author      ronsek57 based on the original work of giovanni-cortinovis
// @description Draw India Borders on WME
// @include      https://beta.waze.com/*editor/*
// @include      https://www.waze.com/*editor/*
// @exclude      https://www.waze.com/*user/editor/*
// @icon        data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAdgB2AAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2S08A2fhnS4IbiKYaXY2yfZrfTpnluGRTtWNThd3ylBzksQTnnAu6r4Pt59TnPh9tRiu7ZhBJDd3DiG5VlDkoc4P93djqCOxr568J/HTUI7CDw54jtU8R2crBJr66u5XZ4nxzkbs4ODxzxwM4NVNV+NmoXlpcadocTeE0nlM89+91JNdOqrjZJK2cNgYB6dBwASfAnlOB+qtum7tX/vff/Xmmdf8ArLjacVXTei+Faq3p/Xkf/9k=
// @grant       GM_xmlhttpRequest
// @copyright   2018+, giovanni-cortinovis, ronsek57
// @downloadURL https://update.greasyfork.org/scripts/40152/WME%20Draw%20Borders%20Team%20India.user.js
// @updateURL https://update.greasyfork.org/scripts/40152/WME%20Draw%20Borders%20Team%20India.meta.js
// ==/UserScript==

DrBTeamIndiaVersion = "0.62";

function bootstrapDrBTeamIndia()
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

    setTimeout(initialiseDrBTeamIndia, 3000);

}


function initialiseDrBTeamIndia()
{
    // add new box to left of the map
    var addon = document.createElement('section');
    addon.id = "DrBTeamIndia-addon";

    addon.innerHTML = '<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAdgB2AAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2S08A2fhnS4IbiKYaXY2yfZrfTpnluGRTtWNThd3ylBzksQTnnAu6r4Pt59TnPh9tRiu7ZhBJDd3DiG5VlDkoc4P93djqCOxr568J/HTUI7CDw54jtU8R2crBJr66u5XZ4nxzkbs4ODxzxwM4NVNV+NmoXlpcadocTeE0nlM89+91JNdOqrjZJK2cNgYB6dBwASfAnlOB+qtum7tX/vff/Xmmdf8ArLjacVXTei+Faq3p/Xkf/9k=" />'
        + ' <b>' + 'WME Draw Borders Team India</b> &nbsp; v' + DrBTeamIndiaVersion;
    console.log('WME Draw Borders India: starting v' + DrBTeamIndiaVersion + '!');

    vectorLayer = new OpenLayers.Layer.Vector("City Borders", {
        displayInLayerSwitcher: true,
        visibility: true,
        uniqueName: "DrawBordersTeamIndia",
        shortcutKey: "S+b"
    });

    W.map.addLayer(vectorLayer);

    var section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.id = "DrBTeamIndiaOptions";
    section.innerHTML = '<input type="button" id="_DrBTeamIndiaDraw" value="Draw Borders" />&nbsp;'
        + '<input type="checkbox" id="_DrBTeamIndiaRandom" /> Random colors<br><hr></div>';
    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-DrBTeamIndia" data-toggle="tab"><img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQIAdgB2AAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAAQABADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD2S08A2fhnS4IbiKYaXY2yfZrfTpnluGRTtWNThd3ylBzksQTnnAu6r4Pt59TnPh9tRiu7ZhBJDd3DiG5VlDkoc4P93djqCOxr568J/HTUI7CDw54jtU8R2crBJr66u5XZ4nxzkbs4ODxzxwM4NVNV+NmoXlpcadocTeE0nlM89+91JNdOqrjZJK2cNgYB6dBwASfAnlOB+qtum7tX/vff/Xmmdf8ArLjacVXTei+Faq3p/Xkf/9k=" /></a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-DrBTeamIndia";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    getId('_DrBTeamIndiaDraw').onclick = DrBTeamIndiaDraw;


}

function DrBTeamIndiaDraw()
{
    var urPos = W.controller.map.calculateBounds();
    urPos.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

    GM_xmlhttpRequest({
        method: "GET",
        synchronous: true,
        url: "https://wmebr.info/general/borders_india.php?bottom=" + urPos.bottom + "&top=" + urPos.top + "&left=" + urPos.left + "&right=" + urPos.right,
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

function DrBTeamIndiaErase()
{
    console.log("WME BI: erasing layer");
    vectorLayer.getSource().clear();
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
            W.map.getProjectionObject() // to Spherical Mercator Projection
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


    if (getId('_DrBTeamIndiaRandom').checked) {
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

bootstrapDrBTeamIndia();