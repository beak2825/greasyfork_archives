// ==UserScript==
// @name        IITC plugin: OKEY companion
// @version     0.0.5
// @author      Odrick
// @description OKEY companion
// @match       https://*.ingress.com/intel*
// @match       http://*.ingress.com/intel*
// @match       https://*.ingress.com/mission/*
// @match       http://*.ingress.com/mission/*
// @id          iitc-plugin-okey-companion@odrick
// @category    Layer
// @license     MIT
// @include     https://*.ingress.com/intel*
// @include     http://*.ingress.com/intel*
// @include     https://*.ingress.com/mission/*
// @include     http://*.ingress.com/mission/*
// @grant       none
// @namespace https://greasyfork.org/users/410740
// @downloadURL https://update.greasyfork.org/scripts/399628/IITC%20plugin%3A%20OKEY%20companion.user.js
// @updateURL https://update.greasyfork.org/scripts/399628/IITC%20plugin%3A%20OKEY%20companion.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
    if(typeof window.plugin !== 'function') window.plugin = function() {};

    plugin_info.buildName = 'OKEY companion';
    plugin_info.dateTimeVersion = '20200405202000';
    plugin_info.pluginId = 'iitc-plugin-okey-companion@odrick';

    var mineImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABACAMAAAC5rg4sAAABLFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnv8BYpwCk+oBjN4CdbkBmfMBVIEBn/4AoP8Am/gBkOcAn/4AnfsBj+QAHTMCf8sBSXUBMVEBlu8BbrABPmYBl/IBjuICXpgAIz0Anv0CiNkBGS4ABQ0Aeb8BRW8AFCYAEiMCe8UBZaIBXJMCWI0ATHkBQWsBOVwCkukBgc0CdrwBcLIBa6oAWIoCTn8BNlkBIToADBkAof8ClO0BkeUDhdUDaKcCYp4BXI8CU4UBO2EBLUoAHTEAmvUBhdMBfsgDcrcCYJoANVUBECAAChYBKUYBFSb+WmnNAAAAHHRSTlMA+nUb6zoG5KNsDfjZx78m8s+xlX5iXE5HLvxXyM983AAAAtJJREFUSMft1VlX2kAUwPGhbuBel6rtvYBUQkIhmgQisgsIgoL7VrVq+/2/Q+8Q00Ac0vjQt/4fOIfJ72iSuYdhX2YCb5sPBQQFGQuA/0IMoBB2dQ1Uw716BfCB9CYOlzzm+qXlWo7YWokN1MyBVUYfWJUcHQVX1497rpXwaL1jYvTWp+7eoyzhdtpD72w5oRK+SSA6C9tvNDqZNYC7JDoJdfw1jBahIjtfhbr5zaqu4z3hwzvra1WsU/BaTULEQ/vbvlhHiwM8D3ZtscZkwxadP3gvLwt0wyD+vQqunqK0LGXcGp75H5HzvSHciRFOaKK9zPCHM44d22uZtFLOiXf+JsnvhuY4m2lrAKp9F2INpTJdl5uGyffvQafPg7rXVP2QcLCHnPcMagnHSpd/ndhc2caRgp/5PrNwPA1+9E39gHC4fudL36pcX6klX/osjryTtD99wnHcp+5m+VvsZHs+NI/rrwD/NUAjzdN86hTydv+ZjsffoWO/is/v0ED51kqSJ3lqpWprO7d+Stpai6BSAepwpD4+xa1LrqcA1AjKbaDyI3RBt/79OlsgnjUQN4HaEeqjGEr7AJ8/McbGZonvIpb5gVoxUXY/5bWEUg1ghjDnHwGK54ipEv9pU5Tc8BusKqhrhNeZ1fQcwF6K9pzzjjSsKwpGCI9PcGnxJeItxGiXLqdLg7ot44FKeIM5TQbpwqOMhuray01EIwswtcCGWqZLFzJG+txANAv8iCrT7RGeHWOuVvhZYj0QbYDCj4RSE/G8CDBH2F2In6QS6jX+U3hEH0V6rSl6rfPTTNBqgDaC3i1JXpfup/UCsDTJhK0RL8RQ2edYTaLMT+8gYXETiwD1U1Qurdm5ILwscjYf78+beaHp2H/QFebVAvGfCZSl/hxByMvaMxZFlGh3Aque1J6x3HmsQHjNEzoz1msALE4wP03OA1hD548HA4GpDdGV3/pHNCng3k+SAAAAAElFTkSuQmCC';
    var theirsImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABACAMAAAC5rg4sAAAAtFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/nQ7/YQD/kgD/dAD/iwD/mAP/nw7/jwD/UwD/mgj/jgD/lgH/fgAAHTL/XAD/RgD/bgD/PgD/eQD/MAD/VwD/TAAAIz0AESL/OAABGS4AFCYABQ3/hwAACxj/NAD/ggABITr/agD/ZwD/UgD/LAABKUYkJkiOAAAAFXRSTlMA+nUb68pdOinko2wN2b/ysZV+TkchcwXbAAACa0lEQVRIx+2V23KiQBCGx02iRhNz7CaCZgBB8IR41uz7v9d2Owg4BYRc7F2+C6vo+mqc7vlhRLNRQK9bVO0I0YD6dAWAb2icgIj0qgfwh+w+XmNv2d7o5Y/UtnK4S1B4Tq4qM9sEjdN4pVWMcnuMaH7VtPc7RImOX2GPMY8RDTGHU2nPAEb2d/YgAc0YjOyx2HZHisDBHcnj5NErsSFhJpFkSJgW22ac00O4cCjZtx2l66XyKizqMuIZWB5obE0qS0+3YREiEW4gz9Si2jAoOktPJgFkshiGSyiys93MvQOtN7nsoshOd+Pa5/NzHQ51UJUqQ2Ied1mdwSAXJ2l8m9hlmL5afp18J6sPfKhjR8EHRzwY1bK/Jmx7k0UtezhId1LbHtS093PuczrfVNj6VD4Bfm2AyGeCmraLzPq/2YPBD2wrjhc/sIGovxObkZU2eomdottb+2Lzi2UAMS61t6ywfQ/Ab9YBiLDE9h319++iTfrcRuxnq+v2zEI5BWg0hRA3j6SvEcMVN0Oe3uVJopwpmfU7gHiH6C6UvryeIN87AcnvQvFA+sqlM2d9Kq9tQ306b1tsKv2ZdBqkueeWFnn7QPKE5LbI0VEt2hPtLPtUmwPck5znBQCO53UIm2w/uaLWJD/eCI3XrCE+AB7vgnrZxQB3JOt0zy2iM+NPIf/ENFaXxtp7EAU0G3QQarbMno9sA/Asinkj3bcQpyxPbHV7d0QZrac0Y5ydI8kvopzWrcrbMUhy9CqqaJP+l8YtzzmCbqWcZMwk/VPlqBKVseXO8kl+qxSzjG0igKeWqEUPQIWuHp1GQ+VI5x8CI986TrMu/wAAAABJRU5ErkJggg==';
    var mineTheirsImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAABACAMAAAC5rg4sAAABFFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnv//nQ7/YQD/kgACdbkBjN7/UwABkOYBmfMBYpwBjuIAHTIAEiT/mAP/lQAAoP//nw7/mggAnfsAm/gCf8v/XAABbrACk+sAIz0BGS4ABQ3/jgD/SgD/PgD/MQAATHsBSXUBPWQACxgCiNkCX5kBQm0BMVH/eQD/VwAChdQBWYwBITr/fgD/dQD/bwD/aQD/RAD/NwABgc0Ce8UAeb8CaagBXJMBOVwBNlkBK0j/iwAAmvUBZaICU4X/hwABcLL/hAD/LADPVa/mAAAAGXRSTlMAtPsMy2ZTNhvt5de/qqGWewbz3iaEbEYZf2BY0wAAAqJJREFUSMft1VlX2kAYxvERq9Z97fLOgAjiACaIgiwKbiAq4K5V237/79FnSNKQnCEdL3rn/yaHkx/nZHkzwyZjmubmSdMqYzEyb54RnWyGeiXUj4cqEo1Br/NgmUdCzUsRLOFpOz3UdZmcirmsn+XrJIV6vdqnYPHRepeL59+GutPm3BK5aoTe5UPZm/2KGCoXqQ+ItsCjdd6NJyXOim03vb7ecjpJ8zbwlfuzqNc75HZQ4MDk1tLrpPS5OCOvrl7zzIMnzv/i/TOh0Q8Z8B/3FKr+DGwVw5rkLUe3zQBuZYErNd27PC54A4j8MTwr6998w7ua0nG3NnQVek3yhqNr/Al3dpEDTtRIr/2rQcLpohw9g42Ur634Pye2fOPpRM9kvlOO3q6SiW6c7EHHa1tG+ulU6WJdGulU3r0SYw1sqDulFHSr1DTRSOkNog9N9HCoahjqHa46+m86n3+HTksp36EJGWs7oypEavve015hXa94urHH7RdCP0fqfgKfntIzRPiy+B2h2xG6l8OXh+MSWwMvYXVaJ7Sr1dWssFo4LjLGPs+CH3F+ozbUF8jwXW5Ywqq6GPwTkWxjJ5FqabPtcvAJqn2nNrgMp3Hw/R28c8XPC0Edd5bO2ASgy8fA17HzdHD6UA7rLnAdeJL5LS/gBHjmNPQusd5XSsDfWKBFnLrjfG/AM9A9d4t6U3iKhVoa3CJPN0i9gMHjlRdC/JJEK8Dhvg5ukacPcHyqKvyG5R6Pdfo70zQRG2zDBXBVpyLEZZNoZpxpmwTHJm+fO3Pk7N6rwPqmVsAxY5vAmKMu8KzOeXya6FHNWM2dozkW1Rr4E7YSy5mj+SjrzViSC2sDeCGSejNWbmd7wF8ioT9jzT7wBDNpeY5QDNiML8TU0Gn6A0UaGVbryENXAAAAAElFTkSuQmCC';

    var e = {};
    var viewLayer = null;
    var display = {};

    ////////////////////////////////////////

    function getKeys() {
        if(window.plugin.okey.latest_research) {
            return Object.keys(window.plugin.okey.latest_research);
        }

        let res = [];

        var keys = window.plugin.okey.keys.keys;
        for(var i=0; i<keys.length; i++) {
            res.push(keys[i].guid);
        }

        return res;
    }

    function getPortalFromList(guid) {
        var keys = window.plugin.okey.keys.keys;
        for(var i=0; i<keys.length; i++) {
            if(keys[i].guid === guid) return keys[i];
        }
        return null;
    }

    function getMineCount(guid) {
        var info;
        var cnt = 0;

        if(window.plugin.okey.latest_research) {
            info = window.plugin.okey.latest_research[guid];
            if(info) {
                for(var n=0; n<info.length; n++) {
                    if(info[n].agent === window.plugin.okey.user.ign) {
                        cnt += info[n].count;
                    }
                }
            }
        }
        else {
            info = getPortalFromList(guid);
            if(info) {
                var keychains = Object.keys(info.keychains);
                cnt = 0;
                for(n=0; n<keychains.length; n++) {
                    cnt += info.keychains[keychains[n]];
                }
            }
        }

        return cnt;
    }

    function getTheirsCount(guid) {
        if(!window.plugin.okey.latest_research) return 0;

        var info = window.plugin.okey.latest_research[guid];
        if(!info) return 0;

        var cnt = 0;

        for(var n=0; n<info.length; n++) {
            if(info[n].agent !== window.plugin.okey.user.ign) {
                cnt += info[n].count;
            }
        }

        return cnt;
    }

    function getLocation(guid) {
        var info = getPortalFromList(guid);
        if(info) return new L.LatLng(info.lat, info.lng);

        if(!window.plugin.okey.layer_group_keys) return null;
        if(!window.plugin.okey.layer_group_keys._layers) return null;

        var layers = Object.keys(window.plugin.okey.layer_group_keys._layers);
        var layer = window.plugin.okey.layer_group_keys._layers[layers[0]];

        layers = Object.keys(layer._layers);

        for(var i=0; i<layers.length; i++) {
            var marker = layer._layers[layers[i]];

            if(marker.options.portal.guid === guid) {
                return marker._latlng;
            }
        }

        return null;
    }

    function createNewMarkers() {
        var keys = getKeys();
        var displayIds = Object.keys(display);

        for(var i=0; i<keys.length; i++) {
            var guid = keys[i];

            if(displayIds.indexOf(guid) < 0) {

                var location = getLocation(guid);

                if(location) {
                    var mineCnt = getMineCount(guid);
                    var theirsCnt = getTheirsCount(guid);

                    if(mineCnt > 0 || theirsCnt > 0) {
                        var image;

                        if(mineCnt > 0) {
                            if(theirsCnt > 0) image = mineTheirsImage;
                            else image = mineImage;
                        }
                        else {
                            image = theirsImage;
                        }

                        var icon = L.icon({
                            iconUrl: image,
                            iconSize: [22, 32],
                            iconAnchor: [11, 32]
                        });

                        var marker = L.marker(location, {
                            icon: icon,
                            portal: {
                                guid: guid,
                                lat: location.lat,
                                lng: location.lng,
                                name: ''
                            }
                        }).addTo(viewLayer);

                        marker.on('click', handleMarkerClick);

                        var mineLabel = L.marker(location, {
                            icon: L.divIcon({
                                className: 'iitc-plugin-okey-companion-main-count-label',
                                iconAnchor: [9, 32],
                                iconSize: [17, 14],
                                html: mineCnt + '',
                                clickable: false
                            }),
                            guid: guid + '_keys_mine_count',
                            clickable: false
                        });
                        mineLabel.addTo(viewLayer);

                        var theirsLabel = L.marker(location, {
                            icon: L.divIcon({
                                className: 'iitc-plugin-okey-companion-theirs-count-label',
                                iconAnchor: [9, 21],
                                iconSize: [17, 14],
                                html: theirsCnt + '',
                                clickable: false
                            }),
                            guid: guid + '_keys_theirs_count',
                            clickable: false
                        });
                        theirsLabel.addTo(viewLayer);

                        display[guid] = {
                            marker: marker,
                            mineLabel: mineLabel,
                            theirsLabel: theirsLabel
                        };
                    }
                }
            }
        }
    }

    function handleMarkerClick() {
        if(!window.plugin.okey.latest_research) return;

        var event = {};
        event.target = this;

        var name = this.options.portal.lat + ',' + this.options.portal.lng;
        if(window.portals[this.options.portal.guid] && window.portals[this.options.portal.guid].options.data.title) name = window.portals[this.options.portal.guid].options.data.title;

        this.options.portal.name = name;

        window.plugin.okey.key_on_click_listener(event);
    }

    function deleteOldMarkers() {
        var displayIds = Object.keys(display);

        for(var i=0; i<displayIds.length; i++) {
            var guid = displayIds[i];

            var mineCnt = getMineCount(guid);
            var theirsCnt = getTheirsCount(guid);

            if((!mineCnt && !theirsCnt) || !display[guid].mineLabel.getElement() || !display[guid].theirsLabel.getElement()) {
                viewLayer.removeLayer(display[guid].marker);
                viewLayer.removeLayer(display[guid].mineLabel);
                viewLayer.removeLayer(display[guid].theirsLabel);
                delete display[guid];
            }
        }
    }

    function updateMarkersValue() {
        var displayIds = Object.keys(display);

        for(var i=0; i<displayIds.length; i++) {
            var guid = displayIds[i];

            var mineCnt = getMineCount(guid);
            var theirsCnt = getTheirsCount(guid);

            if(mineCnt > 0) {
                mineCnt += '';

                var element = display[guid].mineLabel.getElement();
                if(element) {
                    element.style.display = 'block';
                    element.style.pointerEvents = 'none';
                }
                if(element && element.innerHTML !== mineCnt) {
                    element.innerHTML = mineCnt;
                }
            }
            else {
                element = display[guid].mineLabel.getElement();
                if(element) element.style.display = 'none';
            }

            if(theirsCnt > 0) {
                theirsCnt += '';

                element = display[guid].theirsLabel.getElement();
                if(element) {
                    element.style.display = 'block';
                    element.style.pointerEvents = 'none';
                }
                if(element && element.innerHTML !== theirsCnt) {
                    element.innerHTML = theirsCnt;
                }
            }
            else {
                element = display[guid].theirsLabel.getElement();
                if(element) element.style.display = 'none';
            }

            var image;

            if(mineCnt > 0) {
                if(theirsCnt > 0) image = mineTheirsImage;
                else image = mineImage;
            }
            else {
                image = theirsImage;
            }

            element = display[guid].marker.getElement();
            if(element && element.src !== image) element.src = image;
        }
    }

    function update() {
        if(!window.plugin.okey.keys || !window.plugin.okey.keys.keys) return;

        createNewMarkers();
        deleteOldMarkers();
        updateMarkersValue();
    }

    ////////////////////////////////////////

    window.plugin.OKEYCompanion = e;

    function setup() {
        if(!window.plugin.okey) {
            alert('OKEY companion: OKEY required');
            return;
        }

        $("<style>").prop("type", "text/css").html(".iitc-plugin-okey-companion-main-count-label, .iitc-plugin-okey-companion-theirs-count-label {pointer-events: none!important; background-color: rgba(0,0,0,0.5); font-size: 11px; text-align: center; color: #a4dcff; font-family: monospace; text-align: center; pointer-events: none; -webkit-text-size-adjust:none; } .iitc-plugin-okey-companion-theirs-count-label {color: #ffcd84}").appendTo("head");

        viewLayer = new L.LayerGroup();
        window.addLayerGroup('OKEY companion', viewLayer, false);

        setInterval(update, 1000);
    }

    setup.info = plugin_info;

    if (!window.bootPlugins) window.bootPlugins = [];
    window.bootPlugins.push(setup);
    if (window.iitcLoaded && typeof setup === 'function') setup();
}

var script = document.createElement('script');
var info = {};

if(typeof GM_info !== 'undefined' && GM_info && GM_info.script) {
    info.script = {
        version: GM_info.script.version,
        name: GM_info.script.name,
        description: GM_info.script.description
    };
}

var textContent = document.createTextNode('('+ wrapper +')('+ JSON.stringify(info) +')');
script.appendChild(textContent);
(document.body || document.head || document.documentElement).appendChild(script);