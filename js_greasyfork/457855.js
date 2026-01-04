// ==UserScript==
// @name				WME LiveMap Closures (phuz)
// @description 		Shows road closures (and comments) from Waze Live map in WME
// @include 			https://www.waze.com/editor*
// @include 			https://www.waze.com/*/editor*
// @include 			https://beta.waze.com/*
// @exclude				https://www.waze.com/*user/editor*
// @version 			1.16.17
// @namespace			https://greasyfork.org/en/users/668704-phuz
// @require             https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant               GM_info
// @grant               GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/457855/WME%20LiveMap%20Closures%20%28phuz%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457855/WME%20LiveMap%20Closures%20%28phuz%29.meta.js
// ==/UserScript==
/* global OpenLayers */
/* global W */
/* global I18n */

let rtcCommentLayer;
let myCSS = `#rtcCommentContainer {
position: absolute;
padding: 4em;
background: lightgray;
border: 1px double black;
border-radius: 1ex;
z-index: 777;
display: block;
}

table.rtcCommentTable td {
    padding: 4px;
}

table.rtcCommentTable th {
    padding: 4px;
}

#mydivheader {
cursor: move;
z-index: 777;
position: sticky;
background-color: #2f2f2f;
color: #FFFFFF;
}

.modalclose {
background: lightgray;
z-index: 800;
color: #FFFFFF;
line-height: 25px;
position: absolute;
right: -12px;
text-align: center;
top: -10px;
width: 24px;
text-decoration: none;
font-weight: bold;
-webkit-border-radius: 12px;
-moz-border-radius: 12px;
border-radius: 12px;
-moz-box-shadow: 1px 1px 3px #000;
-webkit-box-shadow: 1px 1px 3px #000;
box-shadow: 1px 1px 3px #000;
}

.modalclose:hover {
background: #00d9ff;
text-decoration: none;
}

hr.myhrline{
margin: 5px;
}
`

var epsg900913;
var epsg4326;
var closuresLayer;

var uOpenLayers;
var uWaze;

var lineWidth = [
    [4, 5],
    [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [10, 12],
    [12, 14],
    [14, 16],
    [15, 17],
    [16, 18],
    [17, 19]
];


function drawLine(line) {
    var linePoints = [];

    var zoom = uWaze.map.getZoom() - 12;
    if (zoom >= lineWidth.length) {
        zoom = lineWidth.length - 1;
    }

    var p = new uOpenLayers.Geometry.Point(line[0].x, line[0].y).transform(epsg4326, epsg900913);
    linePoints.push(p);
    for (var i = 1; i < line.length - 1; i++) {
        var lp1 = line[i];
        var lp2 = line[i + 1];

        var dif_lon = Math.abs(lp1.x - lp2.x);
        var dif_lat = Math.abs(lp1.y - lp2.y);

        if (dif_lon < 0.0000001 && dif_lat < 0.0000001) continue;
        p = new uOpenLayers.Geometry.Point(lp1.x, lp1.y).transform(epsg4326, epsg900913);
        linePoints.push(p);
    }
    p = new uOpenLayers.Geometry.Point(line[line.length - 1].x, line[line.length - 1].y).transform(epsg4326, epsg900913);
    linePoints.push(p);
    var lineString = new uOpenLayers.Geometry.LineString(linePoints);
    var lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#000000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][1] });
    closuresLayer.addFeatures(lineFeature);
    lineString = new uOpenLayers.Geometry.LineString(linePoints);
    lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FF0000', strokeDashstyle: 'solid', strokeLinecap: 'round', strokeWidth: lineWidth[zoom][0] });
    closuresLayer.addFeatures(lineFeature);
    lineString = new uOpenLayers.Geometry.LineString(linePoints);
    lineFeature = new uOpenLayers.Feature.Vector(lineString, null, { strokeColor: '#FFFFFF', strokeDashstyle: 'dot', strokeLinecap: 'square', strokeWidth: lineWidth[zoom][0] });
    closuresLayer.addFeatures(lineFeature);
}


function getRoutingURL() {
    var server;
    if (typeof (uWaze.location) === 'undefined') {
        server = uWaze.app.getAppRegionCode();
    } else {
        server = uWaze.location.code;
    }
    var routingURL = 'https://www.waze.com';
    if (~document.URL.indexOf('https://beta.waze.com')) {
        routingURL = 'https://beta.waze.com';
    }

    switch (server) {
        case 'usa':
            routingURL += '/rtserver/web/TGeoRSS';
            break;
        case 'row':
            routingURL += '/row-rtserver/web/TGeoRSS';
            break;
        case 'il':
            routingURL += '/il-rtserver/web/TGeoRSS';
            break;
        default:
            routingURL += '/rtserver/web/TGeoRSS';
    }

    return routingURL;
}


function requestClosures() {
    var zoom = uWaze.map.getZoom() - 12;
    if (zoom >= 0) {
        if (closuresLayer.getVisibility()) {
            var extent = uWaze.map.getExtent();
            var oh = 500;
            var pLB = new uOpenLayers.Geometry.Point(extent.left - oh, extent.bottom - oh).transform(epsg900913, epsg4326);
            var pRT = new uOpenLayers.Geometry.Point(extent.right + oh, extent.top + oh).transform(epsg900913, epsg4326);
            var data = {
                ma: "600",
                mj: "100",
                mu: "100",
                types: "traffic,alerts",
                left: pLB.x,
                right: pRT.x,
                bottom: pLB.y,
                top: pRT.y
            };
            var url = getRoutingURL();

            $.ajax({
                dataType: "json",
                url: url,
                data: data,
                success: function (json) {
                    if (json.error != undefined) {
                    } else {
                        if (W.map.getLayersByName('rtcCommentLayer').length >= 1) {
                            rtcCommentLayer.clearMarkers();
                        }
                        closuresLayer.destroyFeatures();
                        var ids = [];
                        if ("undefined" !== typeof (json.jams)) {
                            var numjams = json.jams.length;
                            var numAlerts = 0;
                            if (json.alerts) {
                                numAlerts = json.alerts.length;
                            }
                            for (var i = 0; i < numjams; i++) {
                                var jam = json.jams[i];
                                if (jam.delay === -1) {
                                    drawLine(jam.line);
                                    for (var j = 0; j < numAlerts; j++) {
                                        var alerts = json.alerts[j];
                                        if (alerts.uuid == jam.blockingAlertUuid) {
                                            if (alerts.comments) {
                                                let hasText = false;
                                                let comment = []
                                                let timestamp = [];
                                                let user = [];
                                                for (var k = 0; k < alerts.comments.length; k++) {
                                                    if (alerts.comments[k].isThumbsUp == false) {
                                                        comment.push(alerts.comments[k].text);
                                                        timestamp.push(alerts.comments[k].reportMillis);
                                                        user.push(alerts.comments[k].reportBy);
                                                        hasText = true;
                                                        //build the comment history
                                                    }
                                                }
                                                if (hasText) {
                                                    let x = jam.line[Math.trunc(jam.line.length / 2)].x;
                                                    let y = jam.line[Math.trunc(jam.line.length / 2)].y;
                                                    drawCommentMarker(alerts.reportDescription, comment, timestamp, x, y, user);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}


function changeLayer() {
    localStorage.DrawLiveMapClosures = closuresLayer.getVisibility();
    requestClosures();
}


function liveMapClosures_init() {
    closuresLayer = new uOpenLayers.Layer.Vector("LiveMap closures", {
        displayInLayerSwitcher: true,
        uniqueName: "__DrawLiveMapClosures"
    });
    uWaze.map.addLayer(closuresLayer);
    W.map.getOLMap().setLayerIndex(closuresLayer, 10);
    if (localStorage.DrawLiveMapClosures) {
        closuresLayer.setVisibility(localStorage.DrawLiveMapClosures == "true");
    } else {
        closuresLayer.setVisibility(true);
    }
    var roadGroupSelector = document.getElementById('layer-switcher-group_road');
    if (roadGroupSelector != null) {
        var roadGroup = roadGroupSelector.parentNode.parentNode.getElementsByTagName("UL")[0];
        var toggler = document.createElement('li');
        var checkbox = document.createElement("wz-checkbox");
        checkbox.id = 'layer-switcher-item_livemap_closures';
        checkbox.className = "hydrated";
        checkbox.disabled = !roadGroupSelector.checked;
        checkbox.checked = closuresLayer.getVisibility();
        checkbox.appendChild(document.createTextNode("LiveMap closures"));
        toggler.appendChild(checkbox);
        roadGroup.appendChild(toggler);
        checkbox.addEventListener('click', function (e) {
            closuresLayer.setVisibility(e.target.checked);
        });
        roadGroupSelector.addEventListener('click', function (e) {
            closuresLayer.setVisibility(e.target.checked && checkbox.checked);
            checkbox.disabled = !e.target.checked;
        });
    }

    var alertsLayer = uWaze.map.getLayerByUniqueName('__livemap_alerts');
    if (typeof (alertsLayer) !== "undefined") {
        var closuresLayerZIdx = closuresLayer.getZIndex();
        var alertsLayerZIdx = alertsLayer.getZIndex();
        if (closuresLayerZIdx > alertsLayerZIdx) {
            closuresLayer.setZIndex(alertsLayerZIdx);
            alertsLayer.setZIndex(closuresLayerZIdx);
        }
    }

    uWaze.map.events.register("zoomend", null, requestClosures);
    uWaze.map.events.register("moveend", null, requestClosures);
    uWaze.map.events.register("changelayer", null, changeLayer);
    requestClosures();
}

function liveMapClosures_bootstrap() {
    uWaze = unsafeWindow.W;
    uOpenLayers = unsafeWindow.OpenLayers;

    if (typeof (uOpenLayers) === 'undefined' || typeof (uWaze) === 'undefined' || typeof (uWaze.map) === 'undefined' || document.querySelector('.list-unstyled.togglers .group') === null) {
        setTimeout(liveMapClosures_bootstrap, 500);
    } else {
        epsg900913 = new uOpenLayers.Projection("EPSG:900913");
        epsg4326 = new uOpenLayers.Projection("EPSG:4326");
        if (!OpenLayers.Icon) {
            installIcon();
        }
        rtcCommentLayer = new OpenLayers.Layer.Markers('rtcCommentLayer');
        W.map.addLayer(rtcCommentLayer);
        GM_addStyle(myCSS);
        liveMapClosures_init();
    }
}

//Generate the Advisory markers
function drawCommentMarker(title, comments, datetime, x, y, user) {
    let commentWhite = 'data:image/gif;base64,R0lGODlhHgAaAPcAAP////7+/v39/fz8/Pv7+/r6+vn5+fj4+Pf39/b29vX19fT09PPz8/Ly8vHx8fDw8O/v7+zs7Ovr6+rq6unp6efn5+bm5uXl5eTk5OPj497e3t3d3dvb29ra2tXV1dTU1NHR0dDQ0M7OzszMzMvLy8jIyMbGxsTExMPDw8LCwsHBwb6+vry8vLq6urm5ubi4uLa2trS0tKysrKurq6ioqKenp6ampqSkpKOjo6KioqGhoZ+fn56enpqampiYmJWVlZOTk5CQkI6Ojo2NjYqKioaGhoWFhYSEhIODg4GBgX9/f3x8fHp6enZ2dnV1dXNzc3JycnFxcXBwcGxsbGtra2pqamlpaWhoaGdnZ2VlZWNjY2JiYmBgYF9fX15eXltbW1lZWVhYWFZWVlNTU1JSUlFRUVBQUE9PT05OTk1NTUhISEZGRkNDQ0JCQkBAQD4+Pj09PTw8PDs7Ozo6Ojc3NzY2NjU1NTQ0NDMzMy8vLy4uLi0tLSwsLCoqKikpKSgoKCcnJyUlJSQkJCEhIR8fHx4eHhsbGxgYGBYWFhUVFRQUFBMTExERERAQEA4ODgwMDAgICAUFBQQEBAMDAwICAgEBAQAAAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAJcALAAAAAAeABoAAAj/AC8JHEhQxI0jVsiUqTJERgiCECMSlDMp0BovVLKEgWOoEhuJIC8xopOkBAUDAFICUJCBhRRAhEIO9LPnBgSVOHNWEGLoTchJWC7kHJrTA5pGEictQUm0aUoHVR5BJIQlgNOrABKM6UOwUASsWDEwGvgIB1iwPKTmODThLNYIimhEKZOTQo8YVgEcqLGjgUoVPjTk7DKFJE4FYixZmpFSiGInBACokGRpjgWcPdQQ+oETAyXFV1KuUfwHAYAiii2dwDnjzhkpOA1AsbRoRUobkywFsQpCkCUwD3DqcGNETgGcCU58wDnChACVHFLcxCkli4tIHdxeXQAIyKU8TLQ7eIVBaaAlEuKHMrjTZOCYPRLS43SSCKKdMxvyah9ApJJEQGUcp10GVvgnUR1NPAXWAzjowUdIh6DwAhV3cJHDBw08l5IBFrSARBxIhVSFI3FUksYlYCACCR5mbLHFF20MMgkdMglkiR5KSPSEFlpcUSNENvwo5CUBAQA7';
    let commentGreen = 'data:image/gif;base64,R0lGODlhHgAaAHAAACH5BAEAACUALAAAAAAeABoAhQAAAIWFhWdnZ1ZWVjMzMyEhIUNDQy6lTz4+PhERESfEUxDRRg7RRRzPTiy3UyLKUnZ2dgwMDKysrGxsbC2VSxnQTS6qUSq9VBsbGy2vUiuIRZOTkxbRS7m5uS0tLSgoKE9PT87OzkhISHFxcWNjYwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb/wJJwSBQGBIOBIFBsOocEQMFwqB4ICYDh+YwQHosFY8wIhy+FBHdY+JrF5PL7gSFwAYK4nvwOD9RNABBhe4VmYwIARQUCcIWPfAMFRAmEkJdlEUMAlpiPZooSlZ2ee2EREhMUnQtgca58D3xhFgIEF44MAwAAsgwPvBBjC7wEjq0GCb5kvAAZYxq8GGUXzccPBAMOehAAo2W8G2ILGAADnQ8GAR56b3KHfbkXAh2c7ceHw6QMCRslBRdKtdMDbFMugXoIQBgiCWGhC5qIEABxUGA1J1McIlLkhICDipAWFMDAJUGIBQ4KHIAV5wyCiE8SRRFRYkAEAAQMWKBwJYudETUlcDJpAkGAUaBFJCBdWiIIADs=';
    let commentYellow = 'data:image/gif;base64,R0lGODlhHgAaAHAAACH5BAEAACoALAAAAAAeABoAhQAAAIWFhWdnZ1ZWVjMzMyEhIUNDQ7+3JdLJI8e/JbewJhEREeneHP/yAPruDtvRIfHmFxYWFgUFBXx8fBsbG/bqE6ysrGxsbK6nJu/kGPTpFE9PT3Z2djo6OkhISJ6XJeLYH3FxcY2NjVlZWbm5uZOTkygoKC0tLcPDw4SEhAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbrQJVwSBQGBIOBIFBsOocEQMFweCQUhgXA8HwuTJmGeEwGFRbdYYHgILvdmgX3CRC87+4BwAng4P9jAntEC3aAhwMFhIeMDWhCAG2NgA57FguTjAsWAhhvYWQaGnBvCQIEo2QeAJFiGax+YqwEbg5ZDG6sAAliH6wRYiC6tQQDIG4hAJhiGqwiYxEAI8QBJm+SlG8IAiQAmYcRJSoFD994lUPe5m8mE0OJ62QPj1AG8Q3CTlPrgk8dx5k0FFDkBYUDBAUOpLoGIkqaCwA6bFExQIIUAwkOKCCghUAaSCaYNJmg5MLHIhZOqlQRBAA7';
    let commentRed = 'data:image/gif;base64,R0lGODlhHgAaAHAAACH5BAEAAH4ALAAAAAAeABoAhgAAAISEhGlpaVJSUlFRUWpqao2NjTs7OwMDAyUlJUZGRrM2O8A3PLs3PK02Oj09PRsbGwEBAUNDQxERETc3N9I1O+okLOweJewcJOweJuknLsU2PCcnJx8fHykpKS0tLeMtNOwdJdoyOT4+PmdnZ+shKU5OThAQEHx8fAwMDFNTUyoqKh4eHuIuNOEvNqKiohgYGBQUFKioqHFxcaQ1Od8wNucpMOQtNOEvNewdJOkmLd4wN+wfJ7Q2O2xsbFZWVuUsM3V1dQQEBDo6OkhISN0xNwICAr43PJUyNigoKNU0OuolLTQ0NE9PT3JychMTE+kmLpCQkOsiKiQkJFlZWeIuNUBAQIWFhesjK+wgKGVlZbm5uQUFBZOTky8vL802O+gpMHZ2dsk2PBUVFTU1NdczOTY2Nso2PC4uLiwsLMPDw+goL7Y2O9M0Ojw8PA4ODk1NTRYWFggICDMzM1BQULg2O7A2O0JCQiEhIX9/f3Nzc2NjY2hoaKampgAAAAAAAAf/gH6Cg4SCVyQ/PyRXhY2Og3MAeBJ1lQ4SEwASj48Tc0VLFxijpBdLZ3gTnIN4c6EXoqSysBcuECOcACS0sr2lF1iYjgBhsb7HGLQkAIV4u8jQo7A/eIQTxtHQF6qCKUDZ2bAuzDLX2ODH2zIzDr5F2CAgs0W9Fw0kn70/AABLo0X8wkjjNwcbEAkQ6MniB6DOKCT88CQTwdCfNCBzmnzpNQPABIsg+HWRBgEAFYMjrszxFWqWMVMtZX0hsQXAuWQuweHp4ufDGXTZljATZBMotDlhBv34YPTYGW6QmtxEB9ARniZNRy17NOenURBJPnCaoGZJnTkOQExd8mVIilUkICaMAEDEz49MGS2NKDlnFVE8ARzN2LOHhN9CMg4r9hMIADs=';
    let commentIcon;
    let lastCommentTime = moment(new Date(parseInt(datetime[datetime.length - 1])), "DD.MM.YYYY").startOf('day');
    let timeNow = moment(new Date(Date.now()), "DD.MM.YYYY").startOf('day');
    let daysSinceLastMessage = timeNow.diff(lastCommentTime, 'days');
    if (daysSinceLastMessage < 4) { commentIcon = commentGreen; }
    if (daysSinceLastMessage >= 4) { commentIcon = commentYellow; }
    if (daysSinceLastMessage >= 10) { commentIcon = commentRed; }
    var size = new OpenLayers.Size(30, 26);
    var offset = new OpenLayers.Pixel(size.w * 0.5, -size.h);
    var icon = new OpenLayers.Icon(commentIcon, size, offset);
    var epsg4326 = new OpenLayers.Projection("EPSG:4326"); //WGS 1984 projection
    var projectTo = W.map.getProjectionObject(); //The map projection (Spherical Mercator)
    var lonLat = new OpenLayers.LonLat(x, y).transform(epsg4326, projectTo);
    var newMarker = new OpenLayers.Marker(lonLat, icon);
    newMarker.title = title;
    newMarker.comments = comments;
    newMarker.timestamp = datetime;
    newMarker.user = user;
    newMarker.location = lonLat;
    newMarker.events.register('click', newMarker, popup);
    rtcCommentLayer.addMarker(newMarker);
}

//Generate the Popup
function popup(evt) {
    $("#rtcCommentContainer").remove();
    $("#rtcCommentContainer").hide();
    var popupHTML;
    W.map.moveTo(this.location);
    let user;
    let htmlString = '<div id="rtcCommentContainer" style="max-width:500px;margin: 1;text-align: center;padding: 5px;z-index: 1100">' +
        '<a href="#close" id="gmCloseDlgBtn" title="Close" class="modalclose" style="color:#FF0000;">X</a>' +
        '<table border=1 class="rtcCommentTable"><tr><td colspan=3><div id="mydivheader" style="min-height: 20px;">' + this.title + '</div></td></tr>'
    htmlString += '<tr><th>Date / Time</th><th>Comment</th><th>By</th>';
    for (let i = 0; i < this.comments.length; i++) {
        if (this.user[i]) {
            user = '<a target="_blank" href="https://www.waze.com/user/editor/' + this.user[i] + '">' + this.user[i] + '</a>';
        } else {
            user = "<font color=red>Unknown</font>";
        }
        htmlString += '<tr><td width=200 align=right>' + moment(new Date(this.timestamp[i])).format('LLL') + '</td><td align=left>' + this.comments[i] + '</td><td align=center>' + user + '</td></tr>';
    }
    htmlString += '</table></div>'
    //moment(new Date(this.timestamp[i])).format('LLL')
    popupHTML = ([htmlString]);
    $("body").append(popupHTML);
    //Position the modal based on the position of the click event
    $("#rtcCommentContainer").css({ left: document.getElementById("user-tabs").offsetWidth + W.map.getPixelFromLonLat(W.map.getCenter()).x - document.getElementById("rtcCommentContainer").clientWidth - 10 });
    $("#rtcCommentContainer").css({ top: document.getElementById("left-app-head").offsetHeight + W.map.getPixelFromLonLat(W.map.getCenter()).y - (document.getElementById("rtcCommentContainer").clientHeight / 2) });
    $("#rtcCommentContainer").show();
    //Add listener for popup's "Close" button
    $("#gmCloseDlgBtn").click(function () {
        $("#rtcCommentContainer").remove();
        $("#rtcCommentContainer").hide();
    });
    dragElement(document.getElementById("rtcCommentContainer"));
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById("mydivheader")) {
        // if present, the header is where you move the DIV from:
        document.getElementById("mydivheader").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function installIcon() {
    console.log('Installing OpenLayers.Icon');
    OpenLayers.Icon = OpenLayers.Class({
        url: null,
        size: null,
        offset: null,
        calculateOffset: null,
        imageDiv: null,
        px: null,
        initialize: function (a, b, c, d) {
            this.url = a;
            this.size = b || { w: 20, h: 20 };
            this.offset = c || { x: -(this.size.w / 2), y: -(this.size.h / 2) };
            this.calculateOffset = d;
            a = OpenLayers.Util.createUniqueID("OL_Icon_");
            let div = this.imageDiv = OpenLayers.Util.createAlphaImageDiv(a);
            $(div.firstChild).removeClass('olAlphaImg'); // LEAVE THIS LINE TO PREVENT WME-HARDHATS SCRIPT FROM TURNING ALL ICONS INTO HARDHAT WAZERS --MAPOMATIC
        },
        destroy: function () { this.erase(); OpenLayers.Event.stopObservingElement(this.imageDiv.firstChild); this.imageDiv.innerHTML = ""; this.imageDiv = null; },
        clone: function () { return new OpenLayers.Icon(this.url, this.size, this.offset, this.calculateOffset); },
        setSize: function (a) { null !== a && (this.size = a); this.draw(); },
        setUrl: function (a) { null !== a && (this.url = a); this.draw(); },
        draw: function (a) {
            OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, this.size, this.url, "absolute");
            this.moveTo(a);
            return this.imageDiv;
        },
        erase: function () { null !== this.imageDiv && null !== this.imageDiv.parentNode && OpenLayers.Element.remove(this.imageDiv); },
        setOpacity: function (a) { OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, null, null, null, null, null, null, a); },
        moveTo: function (a) {
            null !== a && (this.px = a);
            null !== this.imageDiv && (null === this.px ? this.display(!1) : (
                this.calculateOffset && (this.offset = this.calculateOffset(this.size)),
                OpenLayers.Util.modifyAlphaImageDiv(this.imageDiv, null, { x: this.px.x + this.offset.x, y: this.px.y + this.offset.y })
            ));
        },
        display: function (a) { this.imageDiv.style.display = a ? "" : "none"; },
        isDrawn: function () { return this.imageDiv && this.imageDiv.parentNode && 11 != this.imageDiv.parentNode.nodeType; },
        CLASS_NAME: "OpenLayers.Icon"
    });
}

liveMapClosures_bootstrap();
