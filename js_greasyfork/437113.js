// ==UserScript==
// @name                WME Cameras
// @author		        J0N4S13
// @description         Overlay cameras
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @version             2023.01.30
// @grant               none
// @namespace https://greasyfork.org/users/218406
// @downloadURL https://update.greasyfork.org/scripts/437113/WME%20Cameras.user.js
// @updateURL https://update.greasyfork.org/scripts/437113/WME%20Cameras.meta.js
// ==/UserScript==

getCamarasIP();
//getCamarasBrisa();
//getCamaraBrisa();
initializeCameras();
var Cameras_Layer;
var camarasIP;
var camarasBrisa;
var camaraBrisa;


function getCamarasIP(){
    $.getJSON("https://external.wazept.com/cameras/getCamarasIP.php", function(data) {
        camarasIP = data.features;
    });
}

function getCamaraBrisa(){
    var settings = {
        "url": "https://external.wazept.com/cameras/getCamaraBrisa.php",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Cookie": "__cfduid=d9d39e1b66a6c549435973dd2c2f7cae11592957802"
        },
    };

    $.ajax(settings).done(function (response) {
        camaraBrisa = response
    });
}

function getCamarasBrisa(){
    $.getJSON("https://external.wazept.com/cameras/getCamarasBrisa.php", function(data) {
        camarasBrisa = data;
    });
}

function checkLayerNum()
{
    var lmaoLayer = null;
    for(var i = 0; i < W.map.layers.length; i++)
    {
        if(W.map.layers[i].uniqueName == '__cameras') lmaoLayer = i;
    }
    return lmaoLayer;
}

function getCameras(){
    if (!Cameras_Layer.getVisibility()) {
        return;
    }
    Cameras_Layer.destroyFeatures();
    $(camarasIP).each(function(){
        var lat = this.geometry.y;
        var long = this.geometry.x;
        addImage("IP", lat, long, this);
    });
    $(camarasBrisa).each(function(){
        var lat = parseFloat(this.Latitude);
        var long = parseFloat(this.Longitude);
        addImage("BRISA", lat, long, this);
    });
}

function addImage(type, lat, long, detail) {
    var coords = OL.Layer.SphericalMercator.forwardMercator(long, lat);
    var point = new OL.Geometry.Point(coords.lon,coords.lat);
    var alertPx = W.map.getPixelFromLonLat(new OL.LonLat(coords.lon,coords.lat));
    var icon;
    var attributes;
    var style;
    if(type == "IP"){
        icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAjdJREFUWIXtlj9oE3EUxz8vXomCIA5tVbAEKUQ4rQi6SbtIZyeHqpWODgo2V3BqjPMlRTs6iZBJZ8HJooODCEoPDFSoCm2poCCCtA33HK70zP1Pk1CEfpdf8n6/33ufd7+733sGeyxjH+C/BNDacEHdfEXgEoDCG2luzMq9pS89BVDbVABckH/sAqcw8pNqm56h5ORE0K4BqG2uAscyk1ZNV22+i+UMdAywk3X76lfbVLEcSVqUCJAa/O5HyOVabdUzIR9JELEAapvricEB5ka8sbQYChzwtSaWE3mEkQCqCFX6UwGyazBuIvoJVE23i8GB+KPo3UV04Sa8e5K6LASgteECu83/xjMYOO3/H5tpeTd0vjgktxtfkwH0wIPE7yaoKw+9sbSYulQ3jQowlQggrjFKGsHlWTh3NRvgeAVelj3fylhwuv13IEOmLfqZXB7CRyAsCEwC0HcY7ryFrT/w6CKcv549sCrUzgZNr1IBJLdRxs17AFu/PWPfoeyZPx6HXyuRU3KweT8dYHppeaeqAbiuf90uv4YjJ+FooXVT/RqsfkhlC34BkQAhzY342T+/5Y0TdXj/FD69SN2epmiAkpML3YY/Pvu/6xNtB4orSJEAIqjarANePU8oNBm1FjcRewRiOYMd9AJBX8fbBtjeKJ1CdNSQ+BDFFTBis4hRd1oyD6JxAtpoz7rdlPog3uPU+eKQbhoVUUYBVFkQaZbFanwDwMruc1f9wPaFMpW6sFcA3dQ+wF9JaLei/FXMqwAAAABJRU5ErkJggg==';
        attributes = {
            type: type,
            url: detail.attributes.url1,
            pixel: alertPx
        };
        style = {
            externalGraphic: icon,
            graphicWidth: 32,
            graphicHeight: 32,
            title: 'IP',
            cursor: 'help'
        };
    }
    else if(type == "BRISA"){
        icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAqCAYAAADWFImvAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALWSURBVFhHvZg7aBRRFIYTn1tZLaRIaWGxrYWIjYWCYOwFW0FrC/sU2lirhYVYCqbRxSpFrILGImBhIIoIPmALUSGCKOv9JvuPZ+6c3bmzO7MXPu7sfcz59tyzk90shLZYweGG8WJAfuFtmhe5SDbQ6S51Lj7dXF159vLzpeevh21CDGIRcxT/vxkT3qY2IWZBBLN5ZCKGmKOs7EuE/pi3sG1W+q9+EntBEoGut7CK1a13Q9rujz13vorGRG5u7mQiG1++ufNVjES6gX2JwLK3sIqGRJaTRe5sf8gg8OX17Xy8cZHFg4eOewsJ2v84GD58+ymrB3qC2rFZRYhdKaLgXNMrI3B1400usjX4XtqbQiyyPCkjj99/HQ5+/c4C0rgmA0ggwzVrvP1VJIuIvT9/MwEdjcToyQYiSHl7J1FLhHdOQIlwPEBwpHiGqEmKee9eMbVE9O5pZIbACFCwOh4ro8YYa/i0qa7ieyeLEGRS09EgWNW8LCWLcBRNNDI4U0bssUzbJn20k0W8s6/T2E8dqU6oGbKj+yeLcINps8I+6kL7kVDT/ZNFBEVLvZDm1Mab0HqKWfVmH361RSykmCCkeNynhWC20Fmr1/bBN5OIBSlqgMCqJ47CzukPJOOI2/2NicToAeeN02yhQmsi40AOCYTsuCty4cmLHbtoHsQi2feR07fvX/cWt4krEvreuUf9NW9DW5REAnxv7AVOnrp19968fmy5IspK4AwcOHL0/Ikr124gdvbB2nobcrmI/V1jRAoyMVZu1gJ3RQI2K9kxBTIh4YnBtHL2aPLfvgFPRkIlKeGJQYpcSSSWARY4UlZsajmJFUQgkpFQSWqMWLKcfc2joiQiJgjlUmIGOY31yEzouV/5f2iSiYQ8sWnkCvA0D31BpCAjrFQNuYKglfMYrS+IWEpSIlEuFszFIjTvSozDFYNEOSsmNOcGrIMrBgliGZ3uUucfRGYIamB8WSUAAAAASUVORK5CYII=';
        attributes = {
            type: type,
            idCamera: detail.idCamara,
            pixel: alertPx
        };
        style = {
            externalGraphic: icon,
            graphicWidth: 32,
            graphicHeight: 32,
            title: 'Brisa',
            cursor: 'help'
        };
    }
    var imageFeature = new OL.Feature.Vector(point, attributes, style);
    Cameras_Layer.addFeatures([imageFeature]);
}

function initializeCameras(e)
{
    if (e && e.user === null) {
        return;
    }
    if (typeof W === "undefined" || typeof W.loginManager === "undefined" || typeof W.map === 'undefined' || typeof OL === 'undefined' || document.querySelector('.list-unstyled.togglers .group') === null) {
        setTimeout(initializeCameras, 100);
        return;
    }
    if (!W.loginManager.user) {
        W.loginManager.events.register("login", null, initializeCameras);
        W.loginManager.events.register("loginStatus", null, initializeCameras);
        if (!W.loginManager.user) {
            return;
        }
    }
    function showAlertPopup(f){
        divCameras.style.top = '175px';
        divCameras.style.left = '375px';
        var attributes = f.attributes;
        var reportDetail;
        if(attributes.type == "IP"){
            reportDetail = '<video width="320" height="240" autoplay controls><source src="' + attributes.url + '" type="video/mp4"></video>'
        }
        else if(attributes.type == "BRISA"){
            reportDetail = '<img src="data:image/png;base64, ' + camaraBrisa + '" />'
        }
        document.getElementById("divCameras").innerHTML = reportDetail;
        divCameras.style.visibility = 'visible';
    }

    function hideAlertPopup(){
        divCameras.style.visibility = 'hidden';
        divCameras.style.top = '175px';
        divCameras.style.left = '375px';
    }

    function saveLMAOOptions() {
        if (localStorage) {
            var options = [];
            camerasVisibility = document.getElementById("layer-switcher-item_cameras").checked;
            options[0] = camerasVisibility;
            localStorage.setItem("WMECameras", JSON.stringify(options));
        }
    }

    function registerKeyShortcut(actionName, callback, keyName) {
        I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members[keyName] = actionName;
        W.accelerators.addAction(keyName, {group: 'default'});
        W.accelerators.events.register(keyName, null, callback);
        W.accelerators._registerShortcuts({[""]: keyName});
    }

    var camerasVisibility = true;
    Cameras_Layer = new OL.Layer.Vector("Cameras",{
        rendererOptions: { zIndexing: true },
        uniqueName: '__cameras'
    }												 );
    if (localStorage.WMECameras) {
        var options = JSON.parse(localStorage.getItem("WMECameras"));
        camerasVisibility = options[0];
    }
    window.addEventListener("beforeunload", saveLMAOOptions, false);
    var otherGroupSelector = document.getElementById('layer-switcher-group_display');
    if (otherGroupSelector !== null) {
        var otherGroup = otherGroupSelector.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("UL")[0];
        var toggler = document.createElement('li');
        var togglerContainer = document.createElement('div');
        togglerContainer.className = 'wz-checkbox';
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'layer-switcher-item_cameras';
        checkbox.className = 'toggle';
        checkbox.checked = Cameras_Layer.getVisibility();
        checkbox.addEventListener('click', function(e) {
            Cameras_Layer.setVisibility(e.target.checked);
        });
        otherGroupSelector.addEventListener('click', function(e) {
            Cameras_Layer.setVisibility(e.target.checked & checkbox.checked);
            checkbox.disabled = !e.target.checked;
        });
        togglerContainer.appendChild(checkbox);
        var label = document.createElement('label');
        label.htmlFor = checkbox.id;
        var labelText = document.createElement('span');
        labelText.className = 'label-text';
        labelText.appendChild(document.createTextNode("Cameras"));
        label.appendChild(labelText);
        togglerContainer.appendChild(label);
        toggler.appendChild(togglerContainer);
        otherGroup.appendChild(toggler);
    }
    W.map.addControl(new OL.Control.DrawFeature(Cameras_Layer, OL.Handler.Path));
    W.map.addLayer(Cameras_Layer);
    Cameras_Layer.setVisibility(camerasVisibility);
    getCameras();
    var divPopupCheck = document.getElementById('divCameras');
    if (divPopupCheck === null){
        var divCameras = document.createElement('div');
        divCameras.id = "divCameras";
        divCameras.style.position = 'absolute';
        divCameras.style.visibility = 'hidden';
        divCameras.style.top = '175px';
        divCameras.style.left = '375px';
        divCameras.style.zIndex = 1000;
        divCameras.style.backgroundColor = 'aliceblue';
        divCameras.style.borderWidth = '3px';
        divCameras.style.borderStyle = 'ridge';
        divCameras.style.borderRadius = '10px';
        divCameras.style.boxShadow = '5px 5px 10px Silver';
        divCameras.style.padding = '4px';
        document.body.appendChild(divCameras);
    }
    W.map.events.register("mousemove", W.map, function(e) {
        hideAlertPopup();
        var position = this.events.getMousePosition(e);
        var lmaoLayer = checkLayerNum();
        if(W.map.layers[lmaoLayer].features.length > 0){
            var alertFeatures = W.map.layers[lmaoLayer];
            for(var j = 0; j < W.map.layers[lmaoLayer].features.length; j++){
                var alertX = alertFeatures.features[j].attributes.pixel.x;
                var alertY = alertFeatures.features[j].attributes.pixel.y;
                if(Cameras_Layer.getVisibility() === true && position.x > alertX - 10 && position.x < alertX + 10 && position.y > alertY - 10 && position.y < alertY + 20){
                    showAlertPopup(alertFeatures.features[j]);
                }
            }
        }
    });
    W.map.events.register("zoomend", null, getCameras);
    W.map.events.register("moveend", null, getCameras);
}