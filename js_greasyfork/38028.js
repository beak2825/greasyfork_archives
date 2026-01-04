// ==UserScript==
// @name        WME Draw Borders Poland
// @namespace
// @version     0.2
// @author      ronsek57 based on the original work of giovanni-cortinovis
// @description Draw Poland Borders on WME
// @include        https://beta.waze.com/*editor/*
// @include        https://beta.waze.com/*editor*
// @include        https://www.waze.com/*editor/*
// @include       https://www.waze.com/*/editor*
// @include        https://www.waze.com/*editor*
// @exclude      https://www.waze.com/*user/editor/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAABC0lEQVQoU32SPW7CQBBG3yRp4QJ0FhdLCgoabsIduA4FEhI1GAo3SRQtShTFu/ZEs+t1iAOx/Hlm5+d5RlpR55SLpzU/f9o2uq3ZG5IIGI8jQvWHlVztY5Yb6r2q6AG/mxPoWlOOiQjn0ykBdDTql8ig/5otZwB3PCKNcyodIDbH9++4Q2CcoCyRBlSWS7Sq0BAghGh7eY96O5vtFAIymeBWqwRgsUDLEvU1WHEsrNHao3WdzgN7VxS8rdeItwnmc/RwSH8fNlxptjopCl42G+QL9H42o93vIY9okFug4CE0yHTK63aLfII+PD71O1oy7xuBNlW25jcNdHre7ZAP0HjbLpQv4zA+rLG6bz6jeWGrGzaXAAAAAElFTkSuQmCC
// @grant       GM_xmlhttpRequest
// @copyright   2016+, giovanni-cortinovis, ronsek57
// @namespace https://greasyfork.org/users/107403
// @downloadURL https://update.greasyfork.org/scripts/38028/WME%20Draw%20Borders%20Poland.user.js
// @updateURL https://update.greasyfork.org/scripts/38028/WME%20Draw%20Borders%20Poland.meta.js
// ==/UserScript==

DrBPolandVersion = "0.2";

function bootstrapDrBPoland()
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

    setTimeout(initialiseDrBPoland, 2000);

}

function initialiseDrBPoland()
{
    // add new box to left of the map
    var addon = document.createElement('section');
    addon.id = "drbpoland-addon";

    addon.innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAABC0lEQVQoU32SPW7CQBBG3yRp4QJ0FhdLCgoabsIduA4FEhI1GAo3SRQtShTFu/ZEs+t1iAOx/Hlm5+d5RlpR55SLpzU/f9o2uq3ZG5IIGI8jQvWHlVztY5Yb6r2q6AG/mxPoWlOOiQjn0ykBdDTql8ig/5otZwB3PCKNcyodIDbH9++4Q2CcoCyRBlSWS7Sq0BAghGh7eY96O5vtFAIymeBWqwRgsUDLEvU1WHEsrNHao3WdzgN7VxS8rdeItwnmc/RwSH8fNlxptjopCl42G+QL9H42o93vIY9okFug4CE0yHTK63aLfII+PD71O1oy7xuBNlW25jcNdHre7ZAP0HjbLpQv4zA+rLG6bz6jeWGrGzaXAAAAAElFTkSuQmCC" />'
        + ' <b>' + 'WME Draw Borders Poland</b> &nbsp; v' + DrBPolandVersion;
    console.log('WME Draw Borders Poland: starting v' + DrBPolandVersion + '!');

    vectorLayer = new OpenLayers.Layer.Vector("City Borders", {
        displayInLayerSwitcher: true,
        uniqueName: "DrawBordersPoland",
        shortcutKey: "S+b"

    });

    Waze.map.addLayer(vectorLayer);

    var section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.id = "DrBPolandOptions";
    section.innerHTML = '<input type="button" id="_drbpolandDraw" value="Show borders" /><br>'
        + '<input type="checkbox" id="_drbpolandRandom" checked /> Random colors<br><hr></div>';
    addon.appendChild(section);

    var userTabs = getId('user-info');
    var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
    var tabContent = getElementsByClassName('tab-content', userTabs)[0];

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-DrBPoland" data-toggle="tab"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAALCAYAAAB24g05AAABC0lEQVQoU32SPW7CQBBG3yRp4QJ0FhdLCgoabsIduA4FEhI1GAo3SRQtShTFu/ZEs+t1iAOx/Hlm5+d5RlpR55SLpzU/f9o2uq3ZG5IIGI8jQvWHlVztY5Yb6r2q6AG/mxPoWlOOiQjn0ykBdDTql8ig/5otZwB3PCKNcyodIDbH9++4Q2CcoCyRBlSWS7Sq0BAghGh7eY96O5vtFAIymeBWqwRgsUDLEvU1WHEsrNHao3WdzgN7VxS8rdeItwnmc/RwSH8fNlxptjopCl42G+QL9H42o93vIY9okFug4CE0yHTK63aLfII+PD71O1oy7xuBNlW25jcNdHre7ZAP0HjbLpQv4zA+rLG6bz6jeWGrGzaXAAAAAElFTkSuQmCC" /></a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-DrBPoland";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);

    getId('_drbpolandDraw').onclick = DrBPolandDraw;

}

function DrBPolandDraw()
{
    var urPos = Waze.controller.map.calculateBounds();
    urPos.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

    GM_xmlhttpRequest({
        method: "GET",
        synchronous: true,
        url: "https://wmebr.info/borders_poland.php?bottom=" + urPos.bottom + "&top=" + urPos.top + "&left=" + urPos.left + "&right=" + urPos.right,
        headers: {
            "Accept": "text/xml"
        },
        onerror: function (response) {
            console.log('WME Draw Borders Poland: error!');
        },
        onload: function (response) {
            Confine = response.responseText;
            console.log("Chamado wmebr.info");
            if (Confine.length > 0) {

                var elenco = JSON.parse(Confine);

                for (var i = 0; i < elenco.length; i++) {
                    Borders_DrawBorderPoland(elenco[i].comune, elenco[i].coords);
                }


            }
        }
    });
}

function Borders_DrawBorderPoland(cityname, coordinateString)
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


    if (getId('_drbpolandRandom').checked) {
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

bootstrapDrBPoland();