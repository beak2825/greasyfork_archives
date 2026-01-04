// ==UserScript==
// @name         Munzee Map Sandbox Radii
// @namespace    MunzeeMap
// @version      1.3
// @description  Allows you to display POI Capture and Scatter Radii in Sandbox mode
// @author       MOBlox
// @match        https://www.munzee.com/map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375763/Munzee%20Map%20Sandbox%20Radii.user.js
// @updateURL https://update.greasyfork.org/scripts/375763/Munzee%20Map%20Sandbox%20Radii.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    $('#showSBbuttons').click(function() {
        setTimeout(function(){
    mapSandbox.circles.basicScatter = {radius: 762, color: '#72ea5d'};
    mapSandbox.circles.catapultScatter = {radius: 402.336, color: '#b56000'};
    mapSandbox.circles.bowlingScatter = {radius: 228.6, color: '#00b52d'};
    mapSandbox.circles.joystickScatter = {radius: 457.2, color: '#b50087'};
    mapSandbox.circles.joystickSecondScatter = {radius: 213.36, color: '#8800b5'};
    mapSandbox.circles.capturePOI = {radius: 304.8, color: '#ff5500'};
    mapSandbox.showItemPopup = function (item) {
            this.removePopup();
            this.selectedId = item.id;

            this.itemPopup = new mapboxgl.Popup({
                closeButton: true,
                offset: 35
            });

            var itemContent = '<br> <section id=\'createNewItem\'>';
            itemContent += '<input class="hidden-xs" style=\'margin-bottom: 5px; width:180px;\' id=\'popup_title\' type=\'text\' value=\'' + item.title + '\'>';
            itemContent += '<input  class="hidden-xs" style=\'margin-left: 10px;\' id=\'saveSBtitle\' type=\'button\' value=\'save\'>';
            itemContent += '<span class="hidden-xs"><br />' + item.coordinates[1] + '<br />' + item.coordinates[0] + '</span>';

            if (item.myOwn) {
                itemContent += '<br />own Munzee:<input style=\'margin-top: 5px; margin-left:10px;\' type=\'checkbox\' checked=\'checked\' id=\'check_SB_own\'/>';
            } else {
                itemContent += '<br />own Munzee:<input style=\'margin-top: 5px; margin-left:10px;\' type=\'checkbox\' id=\'check_SB_own\'/>';
            }
            itemContent += '<br />show capture area for Virtual:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_captureArea\'/>';
            itemContent += '<br />show capture area for POI:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_capturePOI\'/>';
            itemContent += '<br />show blocked area for Motel/Trail:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_motelArea\'/>';
            itemContent += '<br />show blocked area for Hotel:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_hotelArea\'/>';
            itemContent += '<br />show blocked area for Virtual Resort:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_resortArea\'/>';
            itemContent += '<br />show blocked area for Time Share:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_tsArea\'/>';
            itemContent += '<br />show blocked area for Air Mystery:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_airArea\'/>';
            itemContent += '<br />show blast capture area:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_blastArea\'/>';
            itemContent += '<br />show basic scatter area:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_basicScatter\'/>';
            itemContent += '<br />show catapult scatter area:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_catapultScatter\'/>';
            itemContent += '<br />show bowling scatter area:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_bowlingScatter\'/>';
            itemContent += '<br />show joystick scatter area:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_joystickScatter\'/>';
            itemContent += '<br />show joystick second scatter area:<input style=\'margin-top: 4px; margin-left:10px;\' type=\'checkbox\' id=\'check_joystickSecondScatter\'/>';
            itemContent += '<br /><input style=\'margin-top: 5px; margin-right: 10px;\' class=\'hidden-xs\' id=\'openquickdeploymodal\' type=\'button\' value=\'Quick Deploy\' data-toggle="modal" data-target="#quickdeploy_modal">';
            itemContent += '<input  class="hidden-xs" style=\'margin-top: 5px;\' id=\'removeFromSB\' type=\'button\' value=\'remove\'>';
            itemContent += '</section>';
            this.itemPopup.setLngLat(item.coordinates)
                .setHTML(itemContent)
                .addTo(map);

            for (var layer in mapSandbox.list[mapSandbox.selectedId].layers) {
                if (mapSandbox.list[mapSandbox.selectedId].layers[layer]) {
                    $('#check_'+layer).attr('checked', 'checked');
                }
            }

            $('#check_SB_own').change(function() {
              if (!this.checked) {
                    mapSandbox.list[mapSandbox.selectedId].myOwn = 0;
                    if (mapSandbox.list[mapSandbox.selectedId].layers.ownArea) {
                        mapSandbox.removeLayer(mapSandbox.selectedId, 'ownArea');
                    }
                }  else {
                    mapSandbox.list[mapSandbox.selectedId].myOwn = 1;
                    if (circle) {
                        mapSandbox.drawCircle(mapSandbox.selectedId, 'ownArea');
                    }
                }
            });

            $('#check_captureArea').change(function( ) {
              if (this.checked) {
                mapSandbox.drawCircle(mapSandbox.selectedId, 'captureArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.captureArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'captureArea');
                }
              }
            });

            $('#check_motelArea').change(function( ) {
              if (this.checked) {
                    mapSandbox.drawCircle(mapSandbox.selectedId, 'motelArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.motelArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'motelArea');
                }
              }
            });

            $('#check_hotelArea').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'hotelArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.hotelArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'hotelArea');
                }
              }
            });

            $('#check_resortArea').change(function( ) {
              if (this.checked) {
                    mapSandbox.drawCircle(mapSandbox.selectedId, 'resortArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.resortArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'resortArea');
                }
              }
            });

            $('#check_tsArea').change(function( ) {
              if (this.checked) {
                    mapSandbox.drawCircle(mapSandbox.selectedId, 'tsArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.tsArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'tsArea');
                }
              }
            });

            $('#check_airArea').change(function( ) {
              if (this.checked) {
                    mapSandbox.drawCircle(mapSandbox.selectedId, 'airArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.airArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'airArea');
                }
              }
            });

            $('#check_blastArea').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'blastArea');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.blastArea) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'blastArea');
                }
              }
            });

            $('#check_basicScatter').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'basicScatter');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.basicScatter) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'basicScatter');
                }
              }
            });

            $('#check_catapultScatter').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'catapultScatter');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.catapultScatter) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'catapultScatter');
                }
              }
            });

            $('#check_bowlingScatter').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'bowlingScatter');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.bowlingScatter) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'bowlingScatter');
                }
              }
            });

            $('#check_joystickScatter').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'joystickScatter');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.joystickScatter) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'joystickScatter');
                }
              }
            });

            $('#check_joystickSecondScatter').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'joystickSecondScatter');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.joystickSecondScatter) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'joystickSecondScatter');
                }
              }
            });

            $('#check_capturePOI').change(function( ) {
              if (this.checked) {
                 mapSandbox.drawCircle(mapSandbox.selectedId, 'capturePOI');
              } else {
                if (mapSandbox.list[mapSandbox.selectedId].layers.capturePOI) {
                    mapSandbox.removeLayer(mapSandbox.selectedId, 'capturePOI');
                }
              }
            });

            $('#saveSBtitle').click(function() {
                this.list[this.selectedId].title = $('#popup_title').val();
            }.bind(this));

            $('#removeFromSB').click(function() {
                this.removeSelected();
            }.bind(this));

            $('#openquickdeploymodal').off().click(function() {
              $('#quickdeployoptions').show();
              $('#quickdeploybody').empty();
            });

            $('.qd-type').off().click(function() {
                quick_deploy(
                    mapSandbox.list[mapSandbox.selectedId].marker.getLngLat().lat,
                    mapSandbox.list[mapSandbox.selectedId].marker.getLngLat().lng,
                    $(this).data('typeid'),
                    mapSandbox.list[mapSandbox.selectedId].title
                );
            });
        }},1000)
    });
});