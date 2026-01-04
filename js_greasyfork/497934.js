// ==UserScript==
// @name ThwRenameManager
// @version 5.0.1
// @description Benennt alle Fahrzeuge auf der Wache nach BOS-Richtlinien um (THW oder analoges RD)
// @author HerrWaldgott
// @include *://www.leitstellenspiel.de/buildings/*
// @grant none
// @namespace https://github.com/HerrWaldgott/LSS-Scripte/raw/main/ThwRenameManager.user.js
// @downloadURL https://update.greasyfork.org/scripts/497934/ThwRenameManager.user.js
// @updateURL https://update.greasyfork.org/scripts/497934/ThwRenameManager.meta.js
// ==/UserScript==
async function renameVehicle(vID, vName) {
  await $.post("/vehicles/" + vID, { "vehicle": { "caption": vName }, "authenticity_token": $("meta[name=csrf-token]").attr("content"), "_method": "put" });
}

(async function() {
  'use strict';

  await $.getScript("https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js");

  if (!sessionStorage.cBuildings || JSON.parse(sessionStorage.cBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.cBuildings).userId != user_id) {
    await $.getJSON('/api/buildings').done(data => sessionStorage.setItem('cBuildings', JSON.stringify({ lastUpdate: new Date().getTime(), value: LZString.compressToUTF16(JSON.stringify(data)), userId: user_id })));
  }
  var cBuildings = JSON.parse(LZString.decompressFromUTF16(JSON.parse(sessionStorage.cBuildings).value));

  if (!sessionStorage.cVehicles || JSON.parse(sessionStorage.cVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(sessionStorage.cVehicles).userId != user_id) {
    await $.getJSON('/api/vehicles').done(data => sessionStorage.setItem('cVehicles', JSON.stringify({ lastUpdate: new Date().getTime(), value: LZString.compressToUTF16(JSON.stringify(data)), userId: user_id })));
  }
  var cVehicles = JSON.parse(LZString.decompressFromUTF16(JSON.parse(sessionStorage.cVehicles).value));

  var buildingID = (window.location.href.split("/")[4]).replace("#", "");
  var building = cBuildings.filter(b => b.id == buildingID)[0];

  if (building.building_type == 9 && window.location.href == "https://www.leitstellenspiel.de/buildings/" + buildingID){
    $('dl.dl-horizontal').append(`
<dt><strong>Fahrz. umbenennen:</strong></dt>
<dd>
                <input type="text" class="form-controls" id="initialName" placeholder="Heros XY...">
                <a href="#" id="btnRename" class="btn btn-xs btn-default">Nach BOS umbenennen</a>
                <input id="withType" name="withType" type="checkbox">
                <label class="" for="withType">Typ hinzufügen</label>
</dd>
`);

    $('#btnRename').on('click', function() {
      var firstGKW = true;
      var firstMzGW = true;
      var firstMtwTz = true;
      var firstMtwO = true;
      $('#vehicle_table > tbody').children().each(async function() {
        var $vehicleRow = $(this);
        var $vehicleNameColumn = $vehicleRow.children()[1];
        var vehicleID = $vehicleNameColumn.childNodes[1].href.split("/")[4];
        var vehicleType = cVehicles.filter(v => v.id == vehicleID)[0].vehicle_type;
        var org = "";
        var type = "";
        var typeName = "";
        switch (vehicleType){
          case 39:
            if (firstGKW) {
              org = "22";
              firstGKW = false;
            } else {
              org = "27";
            }
            type = "/52";
            typeName = "(GKW)";
            break;
          case 41:
            if (firstMzGW) {
              org = "24";
              firstMzGW = false;
            } else {
              org = "28";
            }
            type = "/55";
            typeName = "(MzGW (FGr N))";
            break;
          case 40:
            if (firstMtwTz) {
              org = "21";
              firstMtwTz = false;
            } else {
              org = "26";
            }
            type = "/10";
            typeName = "(MTW-TZ)";
            break;
          case 93:
            org = "44";
            if (firstMtwO){
              type = "/22";
            } else {
              type = "/23";
            }
            typeName = "(MTW-O)";
            break;
          case 92:
            org = "";
            type = "Anh Hund";
            break;
          case 44:
            org = "";
            type = "Anh DLE";
            break;
          case 45:
            org = "41";
            type = "/35";
            typeName = "(MLW 5)";
            break;
          case 43:
            org = "41";
            type = "/72";
            typeName = "(BRmG R)";
            break;
          case 42:
            org = "41";
            type = "/62";
            typeName = "(LKW K 9)";
            break;
          case 69:
            org = "36";
            type = "/56";
            typeName = "(Tauchkraftwagen)";
            break;
          case 65:
            org = "36";
            type = "/64";
            typeName = "(LKW 7 Lkr 19 tm)";
            break;
          case 66:
            org = "";
            type = "Anh MzB";
            break;
          case 67:
            org = "";
            type = "Anh SchlB";
            break;
          case 68:
            org = "";
            type = "Anh MzAB";
            break;
          case 102:
            org = "";
            type = "Anh 7";
            break;
          case 101:
            org = "";
            type = "Anh SwPu";
            break;
          case 123:
            org = "47";
            type = "/43";
            typeName = "(LKW 7 Lbw (FGr WP))";
            break;
          case 100:
            org = "47";
            type = "/34";
            typeName = "(MLW 4)";
            break;
          case 122:
            org = "32";
            type = "/43";
            typeName = "(LKW 7 Lbw (FGr E))";
            break;
          case 112:
            org = "";
            type = "NEA200";
            break;
          case 110:
            org = "";
            type = "NEA50";
            break;
          case 124:
            org = "86";
            type = "/25";
            typeName = "(MTW-OV)";
            break;
          case 125:
            org = "76";
            type = "/25";
            typeName = "(MTW-Tr UL)";
            break;
          case 109:
            org = "38";
            type = "/55";
            typeName = "(MzGW SB)";
            break;
        }
        var vName = "";
        if (document.getElementById('withType').checked) {
          vName = $('#initialName').val() + " " + org + type + " " + typeName;
        } else {
          vName = $('#initialName').val() + " " + org + type;
        }
        await new Promise(resolve => {
          renameVehicle(vehicleID, vName);
          window.setTimeout(resolve, 100);
        });
      });
      location.reload();
    });
  }
  if ((building.building_type == 2 || building.building_type == 20) && window.location.href == "https://www.leitstellenspiel.de/buildings/" + buildingID){
    $('dl.dl-horizontal').append(`
<dt><strong>Fahrz. umbenennen:</strong></dt>
<dd>
                <input type="text" class="form-controls" id="initialName" placeholder="Heros XY...">
                <a href="#" id="btnRename" class="btn btn-xs btn-default">Nach BOS umbenennen</a>
                <input id="withType" name="withType" type="checkbox">
                <label class="" for="withType">Typ hinzufügen</label>
</dd>
`);

    $('#btnRename').on('click', function() {
      var indRTW = 1;
      var indNEF = 1;
      var indKTW = 1;
      var indLNA = 1;
      var indORGL = 1;
      var indGRTW = 1;
      var indNAW = 1;
      var indITW = 1;
      $('#vehicle_table > tbody').children().each(async function() {
        var $vehicleRow = $(this);
        var $vehicleNameColumn = $vehicleRow.children()[1];
        var vehicleID = $vehicleNameColumn.childNodes[1].href.split("/")[4];
        var vehicleType = cVehicles.filter(v => v.id == vehicleID)[0].vehicle_type;
        var count = "";
        var type = "";
        var typeName = "";

        switch (vehicleType){
          case 28://RTW
            count = ("0" + indRTW).substr(-2);
            indRTW += 1;
            type = "/83/";
            typeName = "(RTW)";
            break;
          case 29://NEF
            count = ("0" + indNEF).substr(-2);
            indNEF++;
            type = "/82/";
            typeName = "(NEF)";
            break;
          case 38://KTW
            count = ("0" + indKTW).substr(-2);
            indKTW++;
            type = "/85/";
            typeName = "(KTW)";
            break;
          case 55://LNA
            count = ("0" + indLNA).substr(-2);
            indLNA++;
            type = "/07/";
            typeName = "(LNA)";
            break;
          case 56://OrgL
            count = ("0" + indORGL).substr(-2);
            indORGL++;
            type = "/08/";
            typeName = "(OrgL)";
            break;
          case 73://GRTW
            count = ("0" + indGRTW).substr(-2);
            indGRTW++;
            type = "/88/";
            typeName = "(GRTW)";
            break;
          case 74://NAW
            count = ("0" + indNAW).substr(-2);
            indNAW++;
            type = "/81/";
            typeName = "(NAW)";
            break;
          case 97://ITW
            count = ("0" + indITW).substr(-2);
            indITW++;
            type = "/87/";
            typeName = "(ITW)";
            break;
          default:
            console.log("Rename ERROR: " + vehicleType + " not found!");
            break;
        }
        var vName = "";
        if (document.getElementById('withType').checked) {
          vName = $('#initialName').val() + type + count + " " + typeName;
        } else {
          vName = $('#initialName').val() + type + count;
        }
        await new Promise(resolve => {
          console.log(vName);
          renameVehicle(vehicleID, vName);
          window.setTimeout(resolve, 100);
        });
      });
      location.reload();
    });
  }
})();