// ==UserScript==
// @name         Efficiency Stat Script
// @namespace    http://tampermonkey.net/
// @version      0.3.9
// @description  Shows efficiency (attack per piece + downstack per piece)
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399462/Efficiency%20Stat%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/399462/Efficiency%20Stat%20Script.meta.js
// ==/UserScript==

/**************************
   Efficiency Stat Script
**************************/


(function() {
    window.addEventListener('load', function(){

STAT_POS = 970;
STAT_NAME = "Eff"

STAT_POS2 = 1000;
STAT_NAME2 = "VS"

enable_playing = true
enable_replay = true
display_vsscore = true
display_eff = false


var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

x = true
count_downstack = false

function afterPlaceBlock() {
    if(this.clock == 0 && x){
      cat = this["v"]["kppElement"].id.slice(-1)
      if((GameCore['oldPieces'+cat] < this['placedBlocks']) || GameCore['oldPieces'+cat] == undefined){
          GameCore['downstack'+cat] += (GameCore['currentGarbage'+cat] - (JSON.stringify(this.matrix).split(8).length-1)/9)
          pieces = this['placedBlocks']
          GameCore['oldPieces'+cat] = pieces
          APP = this["gamedata"]["attack"] / pieces
          DPP = GameCore['downstack'+cat] / pieces
          EFF = (APP + DPP)
          time = this['actions'][this['ptr']]["t"]
          GameCore[STAT_NAME + "Timestamps"+cat] = GameCore[STAT_NAME + "Timestamps"+cat] || []
          GameCore[STAT_NAME + "Timestamps"+cat].push([(EFF).toFixed(2), time])
      } else {
          x = false
      }
    } else {
      x = false;
      ["1","2","P"].map(y=>{
        GameCore['downstack'+y] = 0;
      })
    }

}

function afterUpdateTextBar() {

    if(count_downstack){
        var change = (GameCore['currentGarbageP'] - (JSON.stringify(this.matrix).split(8).length-1)/9)
        if(change>0){
            GameCore['downstack'] += change
        }
        count_downstack = false
    }
    pieces = this["GameStats"]["stats"]["BLOCKS"].value
    APP = (this["gamedata"]["attack"] / pieces) || 0
    DPP = (GameCore['downstack'] / pieces) || 0
    if(display_vsscore){
      PPS = this['getPPS']()
      //console.log((APP + DPP)*PPS)
      if(this['GameStats'].get('VS'))this['GameStats'].get('VS').set(((APP + DPP)*PPS).toFixed(2));
    }
    if(display_eff){
      if(this['GameStats'].get('EFF'))this['GameStats'].get('EFF').set((APP + DPP).toFixed(2));
    }
}

function beforeCheckLineClears() {
  cat = this["v"]["kppElement"] ? this["v"]["kppElement"].id.slice(-1) : "P"
  GameCore['currentGarbage'+cat] = (JSON.stringify(this.matrix).split(8).length-1)/9;
  count_downstack = true
}

if(enable_playing | enable_replay){
  var checkLineClearsFunc = GameCore['prototype']['checkLineClears'].toString()
  var params = getParams(checkLineClearsFunc)
  checkLineClearsFunc = trim(beforeCheckLineClears.toString()) + trim(checkLineClearsFunc)
  GameCore['prototype']['checkLineClears'] = new Function(...params, checkLineClearsFunc);
}



if(enable_playing){
  if(typeof Game != "undefined"){

    checkLineClearsFunc = Game['prototype']['updateTextBar'].toString()
    checkLineClearsFunc = trim(checkLineClearsFunc) + trim(afterUpdateTextBar.toString())
    Game['prototype']['updateTextBar'] = new Function(...params, checkLineClearsFunc);

    var readyGoFunc = Game['prototype']["startReadyGo"].toString()
    readyGoFunc = `
    GameCore['downstack']=0;
    if(display_eff){
    this['GameStats'].addStat(new StatLine('EFF', '`+STAT_NAME+`', `+STAT_POS+`),true);
    }
    if(display_vsscore){
    this['GameStats'].addStat(new StatLine('VS', '`+STAT_NAME2+`', `+STAT_POS2+`),true);}` + trim(readyGoFunc)
    Game['prototype']["startReadyGo"] = new Function(readyGoFunc);





  }
}


if(enable_replay){

  var website = "jstris.jezevec10.com"
  var url = window.location.href
  var parts = url.split("/")

  if(typeof Replayer != "undefined"){
      Replayer["addStat"] = function(id,into,name) {
          var newStat = document.createElement("tr");
          newStat.innerHTML = '<td class="ter">'+name+'</td><td class="sval"><span id="'+id+'">0</span></td>'
          into.appendChild(newStat);
      }
  }

  if(parts[3]=="replay" && parts[2].endsWith(website) && parts.length>4){

      ["1","2","P"].map(y=>{GameCore['downstack'+y] = 0});
      var placeBlockFunc = GameCore['prototype']['placeBlock'].toString()
      var params2 = getParams(placeBlockFunc)
      placeBlockFunc =  trim(placeBlockFunc) + trim(afterPlaceBlock.toString())
      GameCore['prototype']['placeBlock'] = new Function(...params2, placeBlockFunc);

      if(parts[4]=="1v1"){
          if(display_eff){
              Replayer["addStat"](STAT_NAME+"Element1",document.getElementsByTagName("tbody")[0],STAT_NAME)
              Replayer["addStat"](STAT_NAME+"Element2",document.getElementsByTagName("tbody")[2],STAT_NAME)
          }
          if(display_vsscore){
              Replayer["addStat"](STAT_NAME2+"Element1",document.getElementsByTagName("tbody")[0],STAT_NAME2)
              Replayer["addStat"](STAT_NAME2+"Element2",document.getElementsByTagName("tbody")[2],STAT_NAME2)
          }
      } else {
          if(display_eff){
              Replayer["addStat"](STAT_NAME+"ElementP",document.getElementsByClassName("moreStats")[0],STAT_NAME)
          }
          if(display_vsscore){
              Replayer["addStat"](STAT_NAME2+"ElementP",document.getElementsByClassName("moreStats")[0],STAT_NAME2)
          }
      }

     Replayer['prototype']['getStat'] = function(cat) {
      if(stamps=GameCore[STAT_NAME+"Timestamps"+cat]){
        for (var i = 1; i < stamps.length; i++) {
          if(stamps[i][1]>this['clock']){
            return stamps[i-1][0]
          }
        }
        return stamps[stamps.length-1][0]
      }
      return 0
     };

     var oldTextBar = View.prototype.updateTextBar.toString();
     oldTextBar = trim(oldTextBar) + `;
     var cat = this.kppElement.id.slice(-1);
     if(display_eff){
     eval("`+STAT_NAME+`Element"+cat+"&&(`+STAT_NAME+`Element"+cat+".innerHTML = this.g.getStat(cat))");}
     if(display_vsscore){
     eval("`+STAT_NAME2+`Element"+cat+"&&(`+STAT_NAME2+`Element"+cat+".innerHTML = (PPS"+(cat=='P'?'':cat)+".innerHTML*this.g.getStat(cat)).toFixed(2))");
     }`

     View.prototype.updateTextBar = new Function(oldTextBar);

  }
}

    });
})();