// ==UserScript==
// @id             iitc-plugin-fracker-detect@kik0220
// @name           IITC Plugin: Fracker Detect
// @category       Layer
// @version        0.0.1.20150917.154202
// @namespace      https://github.com/kik0220
// @description    [kik0220-2015-09-17-154202] Detect to use Fracker
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/13690/IITC%20Plugin%3A%20Fracker%20Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/13690/IITC%20Plugin%3A%20Fracker%20Detect.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'kik0220';
plugin_info.dateTimeVersion = '20150917.154202';
plugin_info.pluginId = 'fracker-detect';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////
window.FRACKER_DETECT_MAX_TIME = 3 * 60 * 60 * 1000; // in milliseconds
window.FRACKER_DETECT_MIN_ZOOM = 9;

// use own namespace for plugin
window.plugin.frackerDetect = function() {};

window.plugin.frackerDetect.levelLayerGroup = null;

window.plugin.frackerDetect.setup = function(){
  addHook('publicChatDataAvailable', window.plugin.frackerDetect.handleData);
  window.plugin.frackerDetect.levelLayerGroup = new L.LayerGroup();
  window.addLayerGroup('Fracker Detect', window.plugin.frackerDetect.levelLayerGroup, true);
};

window.plugin.frackerDetect.stored = {};

window.plugin.frackerDetect.getLimit = function(){
  return new Date().getTime() - window.FRACKER_DETECT_MAX_TIME;
};

window.plugin.frackerDetect.discardOldData = function(){
  var limit = plugin.frackerDetect.getLimit();
  $.each(plugin.frackerDetect.stored, function(playerName, player){
    var i;
    var ev = player.events;
    for(i = 0; i < ev.length; i++){
      if(ev[i].time >= limit) break;
    }
    if(i === 0) return true;
    if(i === ev.length) return delete plugin.frackerDetect.stored[playerName];
    plugin.frackerDetect.stored[playerName].events.splice(0, i);
  });
};

window.plugin.frackerDetect.eventHasLatLng = function(ev, lat, lng){
  var hasLatLng = false;
  $.each(ev.latlngs, function(ind, ll){
    if(ll[0] === lat && ll[1] === lng){
      hasLatLng = true;
      return false;
    }
  });
  return hasLatLng;
};

window.plugin.frackerDetect.processNewData = function(data){
  var limit = plugin.frackerDetect.getLimit();
  $.each(data.result, function(ind, json){
    // skip old data
    if(json[1] < limit) return true;

    // find player and portal information
    var playerName, lat, lng, id = null, name, address, text;
    var skipThisMessage = true;
    $.each(json[2].plext.markup, function(ind, markup){
      switch(markup[0]){
      case 'TEXT':
        // Destroy link and field messages depend on where the link or
        // field was originally created. Therefore it’s not clear which
        // portal the player is at, so ignore it.
        if(markup[1].plain.indexOf(' deployed a Portal Fracker on ') !== -1){
          skipThisMessage = false;
        }
        break;
      case 'PLAYER':
        playerName = markup[1].plain;
        break;
      case 'PORTAL':
        // link messages are “player linked X to Y” and the player is at
        // X.
        lat = lat ? lat : markup[1].latE6 / 1E6;
        lng = lng ? lng : markup[1].lngE6 / 1E6;

        // no GUID in the data any more - but we need some unique string. use the latE6,lngE6
        id = markup[1].latE6 + "," + markup[1].lngE6;

        name = name ? name : markup[1].name;
        address = address ? address : markup[1].address;
        break;
      }
    });

    // skip unusable events
    if(!playerName || !lat || !lng || !id || skipThisMessage){
      return true;
    }
    text = '['+json[2].plext.team+']'+unescape(json[2].plext.text);

    var newEvent = {
      latlngs: [[lat, lng]],
      ids: [id],
      time: json[1],
      name: name,
      address: address,
      text: [text],
      uid: [json[0]]
    };

    var playerData = window.plugin.frackerDetect.stored[playerName];

    // short-path if this is a new player
    if(!playerData || playerData.events.length === 0) {
      plugin.frackerDetect.stored[playerName] = {
        nick: playerName,
        team: json[2].plext.team,
        events: [newEvent]
      };
      playerData = window.plugin.frackerDetect.stored[playerName];
    }
    // console.log('--------------------------debug------------------------------');
    // console.log(text);

    var evts = playerData.events;
    // there’s some data already. Need to find correct place to insert.
    var i;
    for(i = 0; i < evts.length; i++){
      if(evts[i].time > json[1]) break;
    }

    var cmp = Math.max(i - 1, 0);

    // so we have an event that happened at the same time. Most likely
    // this is multiple resos destroyed at the same time.
    if(evts[cmp].time === json[1] && evts[cmp].ids[0] === id){
      // for(var j = 0; j < evts[cmp].uid.length; j++){
      //  if(evts[cmp].uid[j] === json[0]){
      //    return true;
      //  }
      // }
      evts[cmp].uid.push(json[0]);
      evts[cmp].latlngs.push([lat, lng]);
      evts[cmp].ids.push(id);
      evts[cmp].text.push(text);
      plugin.frackerDetect.stored[playerName].events = evts;
      console.log('!!!!!!!!!!!!!!!!!!--------------------------Fracker Detected------------------------------!!!!!!!!!!!!!!!!!!');
      console.log(evts[cmp]);
      var m = '!!!!!!!  ['+json[2].plext.team+']'+playerName + '  !!!!!!!  used Fracker\n\n';
      var d = new Date(evts[cmp].time);
      var latlng = evts[cmp].latlngs[0][0] + ',' + evts[cmp].latlngs[0][1];
      m += d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + '\n' + 'at ' + evts[cmp].name + '\n' + evts[cmp].address + '\n';
      // m += d.toISOString().replace(/[TZ]/g,' ') + '\n' + 'at ' + evts[cmp].name + '\n' + evts[cmp].address + '\n';
      m += 'https://www.ingress.com/intel?ll=' + latlng + '&z=17&pll=' + latlng + '\n';
      /*for(var j = 0; j < evts[cmp].text.length; j++){
        m += evts[cmp].text[j] + '\n\n';
      }*/
      alert(m);
      return true;
    }

    // the time changed. Is the player still at the same location?

    // assume this is an older event at the same location. Then we need
    // to look at the next item in the event list. If this event is the
    // newest one, there may not be a newer event so check for that. If
    // it really is an older event at the same location, then skip it.
    if(evts[cmp + 1] && plugin.frackerDetect.eventHasLatLng(evts[cmp + 1], lat, lng))
      return true;

    // if this event is newer, need to look at the previous one
    var sameLocation = plugin.frackerDetect.eventHasLatLng(evts[cmp], lat, lng);

    // if it’s the same location, just update the timestamp. Otherwise
    // push as new event.
    if(sameLocation){
      evts.splice(i, 0, newEvent);
    }

    // update player data
    plugin.frackerDetect.stored[playerName].events = evts;
  });
};

window.plugin.frackerDetect.ago = function(time, now){
  var s = (now - time) / 1000;
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var returnVal = m + 'm';
  if(h > 0){
    returnVal = h + 'h' + returnVal;
  }
  return returnVal;
};

window.plugin.frackerDetect.handleData = function(data){
  if(window.map.getZoom() < window.FRACKER_DETECT_MIN_ZOOM) return;

  plugin.frackerDetect.discardOldData();
  plugin.frackerDetect.processNewData(data);
};

var setup = plugin.frackerDetect.setup;

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
