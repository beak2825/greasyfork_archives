// ==UserScript==
// @name         WME New User Checker
// @namespace    https://greasyfork.org/ru/users/26764-alexletov-wme-nuc
// @version      0.6.2
// @description  New user checker
// @author       alexletov
// @include      https://www.waze.com/editor/*
// @include      https://www.waze.com/*/editor/*
// @include      https://editor-beta.waze.com/*
// @license      https://opensource.org/licenses/BSD-3-Clause
// @copyright    2015-2016 alexletov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16347/WME%20New%20User%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/16347/WME%20New%20User%20Checker.meta.js
// ==/UserScript==

var VERSION = '0.6.2 beta';
var DETAILED_ZOOM_LEVEL = 4;
var NEW_AREA_TIMEOUT = 500;

var user_ids = [];
var users_array = [];
var sattelite_visible = true;

var started = false;

var server_url;

var _try = 0;

var c_x = 0, c_y = 0, z = 0;

function newUserChecker_init() {
    try {
        if (!((typeof window.Waze.map !== undefined) && (undefined !== typeof window.Waze.map.events.register) && (undefined !== typeof window.Waze.selectionManager.events.register ) && (undefined !== typeof window.Waze.loginManager.events.register) )) {
            setTimeout(newUserChecker_init, 1000);
            return;
        }
    } catch (err) {
        setTimeout(newUserChecker_init, 1000);
        return;
    }

    console.log('WME New User Checker: init');

    newUserChecker_loadSettings();
    
    var userInfo = getElId("user-info");
    if (userInfo === null) {
      window.setTimeout(newUserChecker_init, 500);
      return;
    }
    
    var navTabs = userInfo.getElementsByTagName("ul");
    if (navTabs.length === 0) {
      window.setTimeout(newUserChecker_init, 500);
      return;
    }
    
    if (typeof navTabs[0] === undefined) {
      window.setTimeout(newUserChecker_init, 500);
      return;
    }
    var tabContents = userInfo.getElementsByTagName("div");
    if (tabContents.length === 0) {
      window.setTimeout(newUserChecker_init, 500);
      return;
    }

    if (typeof tabContents[0] === undefined) {
      window.setTimeout(newUserChecker_init, 500);
      return;
    }
    
    newUserChecker_showUI();

    $('#_bNUCProcessClick').click(newUserChecker_area);
    $('#_bNUCProcessSave').click(newUserChecker_saveSettings);
}

function newUserChecker_showUI() {
    addon = document.createElement('section');
    addon.innerHTML = '<b>WME New User Checker</b> v' + VERSION;

    section = document.createElement('p');
    section.style.paddingTop = "8px";
    section.style.textIndent = "16px";
    section.id = "newuserchecker_settings";
    section.innerHTML = '<button id="_bNUCProcessClick" name="_bNUCProcessClick" width="100%">Check area</button><br/>';
    section.innerHTML += 'Server url: <input id="_iNUCServerUrl" name="_iNUCServerUrl" type="text" value="' + ((server_url === undefined || server_url === null) ? '' : server_url ) + '" /><br />';
    section.innerHTML += '<button id="_bNUCProcessSave" name="_bNUCProcessSave" width="100%">Save</button><br/>';

    addon.appendChild(section);
    
    userTabs = getElId("user-tabs");
    userInfo = getElId("user-info");
    sidePanelPrefs = getElId("sidepanel-prefs");
    navTabs = getElClass("nav-tabs", userTabs)[0];
    tabContent = sidePanelPrefs.parentNode;    

    newtab = document.createElement('li');
    newtab.innerHTML = '<a href="#sidepanel-newuserchecker" data-toggle="tab">NUC</a>';
    navTabs.appendChild(newtab);

    addon.id = "sidepanel-newuserchecker";
    addon.className = "tab-pane";
    tabContent.appendChild(addon);
}

function newUserChecker_loadSettings() {
    server_url = localStorage.getItem("NUC_Server_Url");
}

function newUserChecker_saveSettings() {
    url = $('#_iNUCServerUrl').val();
    if (!isValidURL(url)) {
        $('#_iNUCServerUrl').val(server_url === null ? '' : server_url);
        alert(url + ' is not valid URL!');
        return;
    }
    
    server_url = url;

    localStorage.setItem("NUC_Server_Url", url);
}

function isValidURL(s) {    
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);    
}

function newUserChecker_checkArea() {
    var key;
    var updated_by;
    var updated_on;
    var use_created = false;

    for (key in Waze.model.segments.objects) {
        var segment = Waze.model.segments.objects[key];
        updated_by = segment.attributes.updatedBy;
        use_created = false;

        if (updated_by === undefined || updated_by == -1) {
            updated_by = segment.attributes.createdBy;
            use_created = true;
        }

        if (updated_by === undefined) {
            continue;
        }       

        updated_on = segment.attributes.updatedOn;
        if (updated_on === undefined || use_created) {
            updated_on = segment.attributes.createdOn;
        }

        if (user_ids[updated_by] === undefined) {
            user_ids[updated_by] = {updatedOn: updated_on, type: "segment", id: key, lat: Waze.map.center.lat, lon: Waze.map.center.lon, z: Waze.map.zoom};
        } else {
            if (user_ids[updated_by].updatedOn < updated_on) {
                user_ids[updated_by].updatedOn = updated_on;
                user_ids[updated_by].type = "segment";
                user_ids[updated_by].id = key;
                user_ids[updated_by].lat = Waze.map.center.lat;
                user_ids[updated_by].lon = Waze.map.center.lon;
                user_ids[updated_by].z = Waze.map.zoom;
            }
        }
    }

    for (key in Waze.model.venues.objects) {
        var venue = Waze.model.venues.objects[key];
        updated_by = venue.attributes.updatedBy;
        use_created = false;

        if (updated_by === undefined || updated_by == -1) {
            updated_by = venue.attributes.createdBy;
            use_created = true;
        }

        if (updated_by === undefined) {
            continue;
        }

        updated_on = venue.attributes.updatedOn;
        if (updated_on === undefined || use_created) {
            updated_on = venue.attributes.createdOn;
        }

        if (user_ids[updated_by] === undefined) {
            user_ids[updated_by] = {updatedOn: updated_on, type: "venue", id: key, lat: Waze.map.center.lat, lon: Waze.map.center.lon, z: Waze.map.zoom};
        } else {
            if (user_ids[updated_by].updatedOn < updated_on) {
                user_ids[updated_by].updatedOn = updated_on;
                user_ids[updated_by].type = "venue";
                user_ids[updated_by].id = key;
                user_ids[updated_by].lat = Waze.map.center.lat;
                user_ids[updated_by].lon = Waze.map.center.lon;
                user_ids[updated_by].z = Waze.map.zoom;
            }
        }
    }

    for (key in Waze.model.users.objects) {
        if (users_array[key] === undefined) {
            users_array[key] = Waze.model.users.objects[key];
        }
    }
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}

function newUserChecker_area() {
    function proceed_check() {
        if(!started) {
            Waze.model.events.unregister("mergeend", null, proceed_check);
            Waze.map.setCenter([prev_x, prev_y], prev_zoom);

            newUserChecker_showResults();
            return;
        }

        if (Waze.controller.bounds.right <= right) {
            if (Waze.controller.bounds.top <= top) {
                newUserChecker_checkArea();
                y = Waze.controller.bounds.top;
                Waze.map.moveTo([x, y], DETAILED_ZOOM_LEVEL);
            } else {
                y = bottom;
                x = Waze.controller.bounds.right;
                Waze.map.moveTo([x, y], DETAILED_ZOOM_LEVEL);
            }
            //setTimeout(proceed_check, NEW_AREA_TIMEOUT);
        } else {
            started = false;
            var mainButton = document.getElementById('_bNUCProcessClick');
            mainButton.innerHTML = 'Check area';
            Waze.model.events.unregister("mergeend", null, proceed_check);

            Waze.map.setCenter([prev_x, prev_y], prev_zoom);
            // Here we need to process the results!
            newUserChecker_showResults();
        }    
    }


    if (!started) {
        started = true;
        _try++;
        var mainButton = document.getElementById('_bNUCProcessClick');
        mainButton.innerHTML = 'Stop checking area';

        user_ids = [];

        var bottom = Waze.controller.bounds.bottom;
        var left = Waze.controller.bounds.left;
        var right = Waze.controller.bounds.right;
        var top = Waze.controller.bounds.top;

        var prev_x = Waze.map.center.lon;
        var prev_y = Waze.map.center.lat;
        c_x = prev_x;
        c_y = prev_y;
        var prev_zoom = Waze.map.zoom;
        z = prev_zoom;

        var x = left;
        var y = bottom;

        for (var i = 0; i < Waze.map.layers.length; i++) {
            if (Waze.map.layers[i].uniqueName == "satellite_imagery") {
                sattelite_visible = Waze.map.layers[i].getVisibility();
                Waze.map.layers[i].setVisibility(false);
                break;
            } 
        }

        Waze.model.events.register("mergeend", null, proceed_check);

        Waze.map.moveTo([x, y], DETAILED_ZOOM_LEVEL);
        if (prev_zoom > DETAILED_ZOOM_LEVEL) {
            bottom = Waze.controller.bounds.bottom;
            left = Waze.controller.bounds.left;
            right = Waze.controller.bounds.right;
            top = Waze.controller.bounds.top;

            prev_x = Waze.map.center.lon;
            prev_y = Waze.map.center.lat;
            prev_zoom = Waze.map.zoom;

            x = left;
            y = bottom;
        }
        //proceed_check();
    }
    else {
        started = false;
        var _mainButton = document.getElementById('_bNUCProcessClick');
        _mainButton.innerHTML = 'Check area';
    }
}

function newUserChecker_showResults() {
    var user_names = [];
    var string = '<table border="1px solid"><tr><td><b>id</b></td><td><b>User</b></td><td><b>Level</b></td><td><b>Edit time</b></td><td><b>Edit type</b></td><td><b>Segment/Venue id</b></td><td><b>Zoom</b></td></tr>';

    var data_to_process = [];
    for (var key in user_ids) {
        if (key != parseInt(key, 10)) {
            continue;
        }

        if (user_ids[key] === undefined) {
            continue;
        }

        var user = users_array[key];
        if (user === undefined) {
            continue;
        }

        if (user_names.indexOf(user.userName) >= 0) {
            continue;
        }

        var user_data = new Object({});
        user_data.userName = user.userName;
        user_data.userId = key;
        user_data.userLevel = user.normalizedLevel;
        user_data.updatedOn = user_ids[key].updatedOn;
        user_data.objectType = user_ids[key].type;
        user_data.objectId = user_ids[key].id;
        user_data.zoom = user_ids[key].z;
        var newCoordinates = (new OpenLayers.Geometry.Point(user_ids[key].lon, user_ids[key].lat)).transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
        user_data.lat = newCoordinates.y;
        user_data.lon = newCoordinates.x;
        data_to_process.push(user_data);
        string += '<tr><td>' + key + '</td><td>' + user.userName + '</td><td>' + user.normalizedLevel + '</td><td>' + timeConverter(user_ids[key].updatedOn) + '</td><td>' + user_ids[key].type + '</td><td>' + user_ids[key].id + '</td><td>' + user_ids[key].z + '</td></tr>';
        user_names.push(user.userName);
    }




    string += '</table><input type="button" id="_bNUCSendClick' + _try + '" class="_bNUCSendClick' + _try + '" value="Send" />';
    var data_generated = new Object({});
    data_generated.userName = Waze.loginManager.user.userName;
    data_generated.userId = Waze.loginManager.user.id;
    data_generated.userLevel = Waze.loginManager.user.normalizedLevel;
    data_generated.data = data_to_process;
    var a = document.createElement("a");
    a.download = "export.txt";
    a.href = "data:text/plain;base64," + btoa(JSON.stringify(data_generated));
    a.innerHTML = "Download as JSON";
     $('<div id="dialog-new-user-report" class="dialog-new-user-report">'
      + string
      + '<br /></div>').append(a).dialog({modal: true, title: 'Editors report', show: 'slide', hide: 'slide', width : 'auto', height : 600, resizable: true, closeOnEscape:true, focus:true});
    $('#_bNUCSendClick' + _try).click(function() {
        var request = JSON.stringify(data_generated);
        $.ajax({
            url: server_url,
            type: "POST",
            dataType: "jsonp",
            data: {data: request},
            success: function (resp) {
                alert("Status: " + resp.code + "\r\nMessage: " + resp.message);
                console.log(resp);
            },
            error: function (xhr, status) {
                alert("Error: " + status);
            }
        });
    });

    for (var i = 0; i < Waze.map.layers.length; i++) {
        if (Waze.map.layers[i].uniqueName == "satellite_imagery") {
            Waze.map.layers[i].setVisibility(sattelite_visible);
        }
    }
}

/* helper function */
function getElClass(classname, node) {
    if (!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++)
        if (re.test(els[i].className)) a.push(els[i]);
    return a;
}

function getElId(node) {
    return document.getElementById(node);
}

newUserChecker_init();
