// ==UserScript==
// @name         Munzee Map Sandbox
// @namespace    MunzeeMap
// @version      1.13.1
// @description  Improves Munzee Map Sandbox
// @author       sohcah
// @match        https://www.munzee.com/map*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393593/Munzee%20Map%20Sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/393593/Munzee%20Map%20Sandbox.meta.js
// ==/UserScript==

$(function () {
    'use strict';

    setTimeout(() => {
        if("__CZ__BROWSEACTIONS" in window) {
            alert("You seem to have the CuppaZee Browse extension installed. Please disable the 'Munzee Map Sandbox' userscript and use the 'Better Map Sandbox' tool in Browse instead.");
            return;
        }
    }, 1000);

    var hidden = [];
    window.maplibregl ||= new Proxy({}, {
        get: (target, prop) => {
            return window.mapboxgl?.[prop];
        }
    });
    window.mapboxgl ||= new Proxy({}, {
        get: (target, prop) => {
            return window.maplibregl?.[prop];
        }
    });
    window.toggleIcon = function(i) {
        if(hidden.includes(i)) {
            $(`.maplibregl-marker[style*="${i}"]`).css("visibility","visible");
            hidden = hidden.filter(x=>x!=i);
        } else {
            $(`.maplibregl-marker[style*="${i}"]`).css("visibility","hidden");
            hidden.push(i);
        }
    }
    var d = document.createElement('div');
    d.innerHTML = `<div id="filters"></div>`;
    var xd = d.firstChild;
    $('#inputbar')[0].append(xd)//${$('#inputbar')[0].innerHTML}`;
    setInterval(function () {
        var obj = {};
        var arr = Object.values(mapMarkers);
        $(`.maplibregl-marker[style*="${i}"]`).css("visibility","visible")
        for(var i of hidden) {
            $(`.maplibregl-marker[style*="${i}"]`).css("visibility","hidden")
        }
        for(var i = 0;i < arr.length;i++){
            var a = arr[i];
            var ic = a._element.style.backgroundImage.slice(5,-2);
            obj[ic] = (obj[ic]||0) + 1;
            //if(hidden.includes(ic)) {
            //    a._element.style.visibility = "hidden"
            //} else {
            //    a._element.style.visibility = "visible"
            //}
        }
        var x = Object.entries(obj);
        x.sort((a,b)=>b[1]-a[1]);
        var y = `<h4>Advanced Filtering Functionality is experimental</h4>`+x.map(i=>`
            <div onclick="toggleIcon('${i[0]}')" style="display:inline-block;border:1px solid ${hidden.includes(i[0])?'red':'green'};background-color:${hidden.includes(i[0])?'#ffaaaa':'#aaffaa'};padding:4px;margin:2px;border-radius:4px;">
               <img src="${i[0]}" style="height:32px;width:32px;"/><br/>
               ${i[1]}
            </div>
        `).join('');
        if($('#filters')[0].innerHTML.toLowerCase().replace(/[^0-9a-zA-Z]/g,'') != y.toLowerCase().replace(/[^0-9a-zA-Z]/g,'')) $('#filters')[0].innerHTML = y;
    },100)
    $('#showSBbuttons').click(function () {
        setTimeout(function () {
            mapSandbox.createItemElement = function (item) {
                var imageurl = 'https://i.ibb.co/3RKyg0m/Grey-Single-Surprise.png';
                var fn = htmlrep(username);

                var el = document.createElement('div');
                el.className = 'marker map-box-sb-marker';
                el.style.width = `32px`;
                el.style.height = `32px`;
                el.style.cursor = 'pointer';
                el.style.setProperty('background-size',"32px 32px","important");
                el.style.zIndex ="10000000";
                el.style.backgroundImage = 'url('+imageurl+')';
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    this.showItemPopup(item);
                }.bind(this));
                el.click();
                var bbtn = $('button.maplibregl-popup-close-button').click();
                return el;
            }
            mapSandbox.circles.basicScatter = { radius: 762, color: '#72ea5d' };
            mapSandbox.circles.catapultScatter = { radius: 402.336, color: '#b56000' };
            mapSandbox.circles.bowlingScatter = { radius: 228.6, color: '#00b52d' };
            mapSandbox.circles.joystickScatter = { radius: 457.2, color: '#b50087' };
            mapSandbox.circles.joystickSecondScatter = { radius: 213.36, color: '#8800b5' };
            mapSandbox.circles.capturePOI = { radius: 304.8, color: '#ff5500' };
            mapSandbox.showItemPopup = function (item) {
                map.panTo(item.coordinates);
                onCameraChanged();
                this.removePopup();
                this.selectedId = item.id;

                this.itemPopup = new maplibregl.Popup({
                    closeButton: false,
                    offset: 10,
                    anchor: "left",
                    maxWidth: 400
                });

                var itemContent = '<section id=\'createNewItem\' style=\'text-align:center;\'>';
                itemContent += '<input class="hidden-xs form-control" style=\'margin-bottom: 5px;\' id=\'popup_title\' type=\'text\' value=\'' + item.title + '\'>';
                //itemContent += '<input  class="hidden-xs" style=\'margin-left: 10px;\' id=\'saveSBtitle\' type=\'button\' value=\'Save Title\'>';
                itemContent += '<input style=\'margin-right: 10px;background-color:#aaffaa;\' class=\'hidden-xs btn btn-md\' id=\'openquickdeploymodal\' type=\'button\' value=\'Deploy\' data-toggle="modal" data-target="#quickdeploy_modal">';
                itemContent += '<input  class="hidden-xs btn btn-md" style=\'background-color:#ffaaaa;\' id=\'removeFromSB\' type=\'button\' value=\'Remove\'>';
                itemContent += '<span class="hidden-xs"><br />' + item.coordinates[1] + ' ' + item.coordinates[0] + '</span>';

                if (item.myOwn) {
                    itemContent += '<br />Own Munzee:<input style=\'margin-top: 5px; margin-left:10px;\' type=\'checkbox\' checked=\'checked\' id=\'check_SB_own\'/>';
                } else {
                    itemContent += '<br />Own Munzee:<input style=\'margin-top: 5px; margin-left:10px;\' type=\'checkbox\' id=\'check_SB_own\'/>';
                }
                var captureAreas = ['virtual|captureArea|Virtual', 'poi_filter|capturePOI|POI', 'blast_capture|blastArea|Blast'].map(function (i) {
                    return `<div style="display:inline-block;padding:4px;" id="newcheck_${i.split('|')[1]}"><img id="newcheckimg_${i.split('|')[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split('|')[0]}.png" /><br/><span style="color:red" id="newchecktext_${i.split('|')[1]}">${i.split('|')[2]}</span></div>`
                }).join('')
                itemContent += `<br /><div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:green;">Capture Areas</div>${captureAreas}</div>`

                var blockAreas = ['motel|motelArea|Motel/Trail','hotel|hotelArea|Hotel','virtualresort|resortArea|Resort','timeshare|tsArea|Timeshare','vacationcondo|condoArea|Condo','treehouse|treehouseArea|Treehouse','airmystery|airArea|Air Mystery','sirprizewheel|spwArea|Sir Prize Wheel'].map(function (i) {
                    return `<div style="display:inline-block;padding:4px;" id="newcheck_${i.split('|')[1]}"><img id="newcheckimg_${i.split('|')[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split('|')[0]}.png" /><br/><span style="color:red" id="newchecktext_${i.split('|')[1]}">${i.split('|')[2]}</span></div>`
                }).join('')
                itemContent += `<div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:red;">Blocked Areas</div>${blockAreas}</div>`

                var scatterAreas = ['scatter|basicScatter|Default','catapult|catapultScatter|Catapult','bowlingball|bowlingScatter|Bowling','joystickfull|joystickScatter|Joystick','joystickfull|joystickSecondScatter|Joystick #2'].map(function (i) {
                    return `<div style="display:inline-block;padding:4px;" id="newcheck_${i.split('|')[1]}"><img id="newcheckimg_${i.split('|')[1]}" style="height:36px;width:36px;filter:grayscale(1) opacity(0.4)" src="https://munzee.global.ssl.fastly.net/images/pins/${i.split('|')[0]}.png" /><br/><span style="color:red" id="newchecktext_${i.split('|')[1]}">${i.split('|')[2]}</span></div>`
                }).join('')
                itemContent += `<div style="text-align:center;max-width:300px;"><div style="font-size:1.5em;font-weight:bold;color:blue;">Scatter Areas</div>${scatterAreas}</div>`
                itemContent += '</section>';
                this.itemPopup.setLngLat(item.coordinates)
                    .setHTML(itemContent)
                    .addTo(map);

                for (var layer in mapSandbox.list[mapSandbox.selectedId].layers) {
                    if (mapSandbox.list[mapSandbox.selectedId].layers[layer]) {
                        $('#newcheckimg_' + layer).css('filter', 'none');
                        $('#newchecktext_' + layer).css('color', 'green');
                    }
                }

                $('#check_SB_own').change(function () {
                    if (!this.checked) {
                        mapSandbox.list[mapSandbox.selectedId].myOwn = 0;
                        if (mapSandbox.list[mapSandbox.selectedId].layers.ownArea) {
                            mapSandbox.removeLayer(mapSandbox.selectedId, 'ownArea');
                        }
                    } else {
                        mapSandbox.list[mapSandbox.selectedId].myOwn = 1;
                        if (circle) {
                            mapSandbox.drawCircle(mapSandbox.selectedId, 'ownArea');
                        }
                    }
                });

                function generate(layer) {
                    return function () {
                        if (!mapSandbox.list[mapSandbox.selectedId].layers[layer]) {
                            mapSandbox.drawCircle(mapSandbox.selectedId, layer);
                            $('#newcheckimg_' + layer).css('filter', 'none');
                            $('#newchecktext_' + layer).css('color', 'green');
                        } else {
                            mapSandbox.removeLayer(mapSandbox.selectedId, layer);
                            $('#newcheckimg_' + layer).css('filter', 'grayscale(1) opacity(0.4)');
                            $('#newchecktext_' + layer).css('color', 'red');
                        }
                    }
                }

                $('#newcheck_captureArea').click(generate('captureArea'));
                $('#newcheck_capturePOI').click(generate('capturePOI'));
                $('#newcheck_blastArea').click(generate('blastArea'));

                $('#newcheck_motelArea').click(generate('motelArea'));
                $('#newcheck_hotelArea').click(generate('hotelArea'));
                $('#newcheck_resortArea').click(generate('resortArea'));
                $('#newcheck_tsArea').click(generate('tsArea'));
                $('#newcheck_condoArea').click(generate('condoArea'));
                $('#newcheck_treehouseArea').click(generate('treehouseArea'));
                $('#newcheck_airArea').click(generate('airArea'));
                $('#newcheck_spwArea').click(generate('spwArea'));

                $('#newcheck_basicScatter').click(generate('basicScatter'));
                $('#newcheck_catapultScatter').click(generate('catapultScatter'));
                $('#newcheck_bowlingScatter').click(generate('bowlingScatter'));
                $('#newcheck_joystickScatter').click(generate('joystickScatter'));
                $('#newcheck_joystickSecondScatter').click(generate('joystickSecondScatter'));

                $('#popup_title').change(function () {
                    this.list[this.selectedId].title = $('#popup_title').val();
                }.bind(this));

                $('#removeFromSB').click(function () {
                    this.removeSelected();
                }.bind(this));
                let _this = this;
                $('#openquickdeploymodal').off().click(function () {
                    _this.list[_this.selectedId].title = $('#popup_title').val();
                    $('#quickdeployoptions').show();
                    $('#quickdeploybody').empty();
                });

                $('.qd-type').off().click(function () {
                    quick_deploy(
                        mapSandbox.list[mapSandbox.selectedId].marker.getLngLat().lat,
                        mapSandbox.list[mapSandbox.selectedId].marker.getLngLat().lng,
                        $(this).data('typeid'),
                        mapSandbox.list[mapSandbox.selectedId].title
                    );
                });
            }
        }, 250)
    });
});