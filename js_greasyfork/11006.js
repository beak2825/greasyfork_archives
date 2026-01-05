// ==UserScript==
// @id             iitc-plugin-virus-detect@kik0220
// @name           IITC Plugin: Virus Detect
// @category       Layer
// @version        0.0.6.20150627.4522
// @namespace      https://github.com/kik0220
// @description    [kik0220-2015-06-27-004522] Detect to use virus
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @include        https://www.ingress.com/mission/*
// @include        http://www.ingress.com/mission/*
// @match          https://www.ingress.com/mission/*
// @match          http://www.ingress.com/mission/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/11006/IITC%20Plugin%3A%20Virus%20Detect.user.js
// @updateURL https://update.greasyfork.org/scripts/11006/IITC%20Plugin%3A%20Virus%20Detect.meta.js
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

//PLUGIN AUTHORS: writing a plugin outside of the IITC build environment? if so, delete these lines!!
//(leaving them in place might break the 'About IITC' page or break update checks)
plugin_info.buildName = 'kik0220';
plugin_info.dateTimeVersion = '20150627.4522';
plugin_info.pluginId = 'virus-detect';
//END PLUGIN AUTHORS NOTE



// PLUGIN START ////////////////////////////////////////////////////////
window.VIRUS_DETECT_MAX_TIME = 3 * 60 * 60 * 1000; // in milliseconds
window.VIRUS_DETECT_MIN_ZOOM = 9;
window.VIRUS_DETECT_MIN_OPACITY = 0.3;

// use own namespace for plugin
window.plugin.virusDetect = function() {};

window.plugin.virusDetect.levelLayerGroup = null;

window.plugin.virusDetect.setup = function(){
  addHook('publicChatDataAvailable', window.plugin.virusDetect.handleData);
  window.plugin.virusDetect.levelLayerGroup = new L.LayerGroup();
  window.addLayerGroup('Virus Detect', window.plugin.virusDetect.levelLayerGroup, true);
};

window.plugin.virusDetect.stored = {};

window.plugin.virusDetect.getLimit = function(){
  return new Date().getTime() - window.VIRUS_DETECT_MAX_TIME;
};

window.plugin.virusDetect.discardOldData = function(){
  var limit = plugin.virusDetect.getLimit();
  $.each(plugin.virusDetect.stored, function(playerName, player){
    var i;
    var ev = player.events;
    for(i = 0; i < ev.length; i++){
      if(ev[i].time >= limit) break;
    }
    if(i === 0) return true;
    if(i === ev.length) return delete plugin.virusDetect.stored[playerName];
    plugin.virusDetect.stored[playerName].events.splice(0, i);
  });
};

window.plugin.virusDetect.eventHasLatLng = function(ev, lat, lng){
  var hasLatLng = false;
  $.each(ev.latlngs, function(ind, ll){
    if(ll[0] === lat && ll[1] === lng){
      hasLatLng = true;
      return false;
    }
  });
  return hasLatLng;
};

window.plugin.virusDetect.processNewData = function(data){
  var limit = plugin.virusDetect.getLimit();
  $.each(data.result, function(ind, json){
    // skip old data
    if(json[1] < limit) return true;

    // find player and portal information
    var playerName, playerTeam, lat, lng, id = null, name, portalTeam, address, text;
    var skipThisMessage = true;
    $.each(json[2].plext.markup, function(ind, markup){
      switch(markup[0]){
      case 'TEXT':
        // Destroy link and field messages depend on where the link or
        // field was originally created. Therefore it’s not clear which
        // portal the player is at, so ignore it.
        if(markup[1].plain.indexOf(' destroyed a Resonator ') !== -1){
          skipThisMessage = false;
        }
        break;
      case 'PLAYER':
        playerName = markup[1].plain;
        playerTeam = markup[1].team;
//        console.log(markup[1]);
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
        portalTeam = portalTeam ? portalTeam : markup[1].team;
//        console.log(markup[1]);
        break;
      }
    });

    // skip unusable events
    if(!playerName || !lat || !lng || !id || skipThisMessage){
      return true;
    }
    text = '['+json[2].plext.team.slice(0, 3)+']'+unescape(json[2].plext.text);
//    console.log(json[2].plext);

    var newEvent = {
      latlngs: [[lat, lng]],
      ids: [id],
      time: json[1],
      name: name,
      address: address,
      text: [text],
      uid: [json[0]],
      playerTeam: playerTeam,
      portalTeam: portalTeam,
      done: false
    };

    var playerData = window.plugin.virusDetect.stored[playerName];

    // short-path if this is a new player
    if(!playerData || playerData.events.length === 0) {
      plugin.virusDetect.stored[playerName] = {
        nick: playerName,
        team: playerTeam,
        events: [newEvent]
      };
      return true;
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
      for(var j = 0; j < evts[cmp].uid.length; j++){
        if(evts[cmp].uid[j] === json[0]){
          return true;
        }
      }
      evts[cmp].uid.push(json[0]);
      evts[cmp].latlngs.push([lat, lng]);
      evts[cmp].ids.push(id);
      evts[cmp].text.push(text);
      plugin.virusDetect.stored[playerName].events = evts;
      if((evts[cmp].uid.length > 7 || playerTeam === portalTeam) && !evts[cmp].done){
        console.log('!!!!!!!!!!!!!!!!!!--------------------------Virus Detected------------------------------!!!!!!!!!!!!!!!!!!');
        console.log(evts[cmp]);
        var virus = ( portalTeam === "ENLIGHTENED" ? "JARVIS" : "ADA");
        var m = '!!!!!!!  ['+json[2].plext.team.slice(0, 3)+'] '+playerName + ' used ' + virus + ' !!!!!!!\n\n';
        var d = new Date(evts[cmp].time);
        var latlng = evts[cmp].latlngs[0][0] + ',' + evts[cmp].latlngs[0][1];
        m += d.toLocaleDateString() + ' ' + d.toLocaleTimeString() + '\n' + 'at ' + evts[cmp].name + '\n' + evts[cmp].address + '\n';
        // m += d.toISOString().replace(/[TZ]/g,' ') + '\n' + 'at ' + evts[cmp].name + '\n' + evts[cmp].address + '\n';
        m += 'https://www.ingress.com/intel?ll=' + latlng + '&z=17&pll=' + latlng + '\n';
        /*for(var j = 0; j < evts[cmp].text.length; j++){
          m += evts[cmp].text[j] + '\n\n';
        }*/
        var a = alert(m);
        $(a.parent()).css("width", "auto");
        evts[cmp].done = true;
      }
      return true;
    }

    // the time changed. Is the player still at the same location?

    // assume this is an older event at the same location. Then we need
    // to look at the next item in the event list. If this event is the
    // newest one, there may not be a newer event so check for that. If
    // it really is an older event at the same location, then skip it.
    if(evts[cmp + 1] && plugin.virusDetect.eventHasLatLng(evts[cmp + 1], lat, lng))
      return true;

    // if this event is newer, need to look at the previous one
    var sameLocation = plugin.virusDetect.eventHasLatLng(evts[cmp], lat, lng);

    // if it’s the same location, just update the timestamp. Otherwise
    // push as new event.
    if(sameLocation){
      evts.splice(i, 0, newEvent);
    }

    // update player data
    plugin.virusDetect.stored[playerName].events = evts;
  });
};

window.plugin.virusDetect.ago = function(time, now){
  var s = (now - time) / 1000;
  var h = Math.floor(s / 3600);
  var m = Math.floor((s % 3600) / 60);
  var returnVal = m + 'm';
  if(h > 0){
    returnVal = h + 'h' + returnVal;
  }
  return returnVal;
};

window.plugin.virusDetect.handleData = function(data){
  if(window.map.getZoom() < window.VIRUS_DETECT_MIN_ZOOM) return;

  plugin.virusDetect.discardOldData();
  plugin.virusDetect.processNewData(data);
};

var setup = plugin.virusDetect.setup;

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

