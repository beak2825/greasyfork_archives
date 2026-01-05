// ==UserScript==
// @name RPlace fixing script TESLA VERSION
// @namespace Violentmonkey Scripts
// @grant none
// @include https://www.reddit.com/place*
// @include https://www.reddit.com/r/place/*
// @description RPlace fixing script TESLA VERSION and SpaceX
// @version 0.0.1.20170403022644
// @downloadURL https://update.greasyfork.org/scripts/28645/RPlace%20fixing%20script%20TESLA%20VERSION.user.js
// @updateURL https://update.greasyfork.org/scripts/28645/RPlace%20fixing%20script%20TESLA%20VERSION.meta.js
// ==/UserScript==

var jsonversion = 0;
var scriptversion = 10;
var lastupdatenotice="";

var spacexlogo = {
  x: 714,
  y: 203,
  width: 64,
  height: 11,
  colors: [12,12,11,12,12,12,12,12,11,12,12,12,11,11,12,12,12,11,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
              12,12,11,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,12,12,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
              11,12,8 ,8 ,3 ,3 ,3 ,2 ,1 ,0 ,1 ,2 ,3 ,3 ,3 ,8 ,12,12,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,3,3,
              12,12,8 ,3 ,3 ,3 ,2 ,1 ,3 ,3 ,3 ,1 ,2 ,3 ,3 ,8 ,8 ,12,3,3,3,3,3,3,3,3,3,12,12,12,12,3,12,12,12,12,3, 3,12,3,3,3,12,12,12,12,3,12,12,12,12,3,12,12,3,3,3,2,2,3,3,3,3,3,
              12,12,8 ,3 ,3 ,3 ,1 ,3 ,2 ,3 ,2 ,3 ,1 ,3 ,3 ,3 ,8 ,12,3,3,2,2,2,3,3,2,3,12,3 ,3 ,3 ,3,12,3 ,3 ,12,3, 3,3,12,3,3,12,3,3,3,3,3,3,3,3,3,3,12,12,2,2,3,3,3,3,3,3,3,
              12,11,8 ,3 ,3 ,3 ,0 ,3 ,3 ,1 ,3 ,3 ,0 ,3 ,3 ,3 ,8 ,12,3,3,2,3,3,3,2,3,3,12,12,12,12,3,12,12,12,12,3,12,12,12,3,3,12,3,3,3,3,12,12,12,3,3,3,3,2,12,3,3,3,3,3,3,3,3,
              12,12,8 ,3 ,3 ,3 ,1 ,3 ,2 ,3 ,2 ,3 ,1 ,3 ,3 ,3 ,8 ,11,3,3,2,3,3,3,2,3,3,3,3,3,12,3,12,3,3,3,3,3,3,3,12,3,12,3,3,3,3,12,3,3,3,3,3,2,3,12,12,3,3,3,3,3,3,3,
              11,12,8 ,3 ,3 ,3 ,2 ,1 ,3 ,3 ,3 ,1 ,2 ,3 ,3 ,8 ,8 ,12,3,3,2,3,3,2,3,3,3,12,12,12,12,3,12,3,3,3,3,3,3,3,12,3,12,12,12,12,3,12,12,12,12,3,2,2,3,3,12,12,3,3,3,3,3,3,
              12,11,8 ,8 ,3 ,3 ,3 ,2 ,1 ,0 ,1 ,2 ,3 ,3 ,3 ,8 ,11,12,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
              12,12,12,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,8 ,12,12,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,
              11,12,12,12,11,12,12,12,12,12,11,12,12,11,11,12,12,11,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
};

var sprites = [spacexlogo];
var colorsABGR = [];


var placed = 0;

// hooks
var client;
var canvasse;
var jQuery;
var startTime;

var test = 0;
var teslamode = 1;

function updateColors(){
    var xmlhttp = new XMLHttpRequest();
    var url = "https://www.pdox.net/colors/colors.json?_=" + new Date().getTime();

    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            if (myArr.version != jsonversion) {
              console.log("New colors/loc data!");
              //console.log(myArr);
            }
            jsonversion = myArr.version;
            if(typeof myArr.latestversion != "undefined" && myArr.latestversion > scriptversion){
              if(lastupdatenotice != myArr.updatethescript2){
                setTimeout(function() { alert(myArr.updatethescript2); }, 1);
                lastupdatenotice = myArr.updatethescript2;
              }
            }
            if (myArr.sprites) {
                sprites = myArr.sprites;
            } else {
                spacexlogo = myArr.pepe;
                spacexlogo.colors = myArr.colors;
                sprites = [spacexlogo];
            }
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    setTimeout(updateColors, 30000);
}

r.placeModule("Pepe", function(e){

    updateColors();
    setTimeout(updateColors, 30000);

    setTimeout(function(){
    window.location="https://www.reddit.com/r/place/#x=732&y=153";
    
    client = e("client");
    canvasse = e("canvasse");
    jQuery = e("jQuery");
      
    startTime = new Date();

    for(var i=0; i<client.palette.length; i++){
      colorsABGR[i] = client.getPaletteColorABGR(i);
    }
    // Start
    if(!test){
      attempt();
    } else {
      drawTestPepe();
    }
  }, 2500);
    
  setTimeout(function(){window.location="https://www.reddit.com/r/place/";}, 2*60*1000);
});

function measure(){
  for (var idx=0; idx<sprites.length; idx++) {
     var pepe = sprites[idx];
     var goodcount = 0;
     var badcount = 0;
     for(var i=0; i<pepe.width*pepe.height; i++){
        if(pepe.colors[i] === -1){
          continue;
        }
        var targetPoint = getPoint(pepe, i);
        var pixelColor = getPixel(targetPoint.x, targetPoint.y);
        if(pixelColor !== colorsABGR[pepe.colors[i]]){
            badcount++;
        } else {
            goodcount++;
        }
     }
    var percent = (goodcount/(badcount+goodcount))*100;
     console.log("SPRITE " + idx + " / " + sprites[idx].name + ":" + " " + goodcount + " GOOD PIXELS, " + badcount + " BAD PIXELS , DONE: " + percent + "%");
    }
  return 0;
}

unsafeWindow.measure = measure;

function fixSprite(idx,done){
  var pepe = sprites[idx];
  var goodcount = 0;
  var badcount = 0;
  var badpixlist = [];
  for(var i=0; i<pepe.width*pepe.height; i++){
     if(pepe.colors[i] === -1){
       continue;
     }
     var targetPoint = getPoint(pepe, i);
     var pixelColor = getPixel(targetPoint.x, targetPoint.y);
     if(pixelColor !== colorsABGR[pepe.colors[i]]){
         badcount++;
         if(!done){
           badpixlist.push({x:targetPoint.x, y:targetPoint.y, i:i});
         }
     } else {
         goodcount++;
     }
  }
  if(badpixlist.length>0){
      var target = Math.round(Math.random()*(badpixlist.length-1));
      console.log("Random target: " + target);
      console.log("Fixing pixel (" + badpixlist[target].x + ", " + badpixlist[target].y + ")");
      client.setColor(pepe.colors[badpixlist[target].i]);
      client.drawTile(badpixlist[target].x, badpixlist[target].y);
      done = true;
      badcount--;
  }
  var percent = (goodcount/(badcount+goodcount))*100;
  console.log("SPRITE " + idx + " / " + sprites[idx].name + ":" + " " + goodcount + " GOOD PIXELS, " + badcount + " BAD PIXELS , DONE: " + percent + "%");
  return done;
}

function attempt(){
  var toWait = client.getCooldownTimeRemaining();
  if(toWait === 0){
    // later record end time
    var endTime = new Date();
    // time difference in ms
    var timeDiff = endTime - startTime;
    // strip the ms
    timeDiff /= 1000;
    // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
    var seconds = Math.round(timeDiff % 60);
    if(seconds > 30){
      window.location="https://www.reddit.com/r/place/";
      return 0;
    }
    console.log("REEEEEE");
    var done = false;
    if(teslamode){
      for (var idx=0; idx<sprites.length; idx++) {
         if(sprites[idx].name=="tesla")
            done = fixSprite(idx, done);
      }
    }
    for (var idx=0; idx<sprites.length; idx++) {
       done = fixSprite(idx, done);
    }
  }
  console.log("WAITIN...");
  setTimeout(attempt, Math.max(toWait, 10000) + Math.round(Math.random() * 3000));
}

function drawTestPepe(){
  for (var idx=0; idx<sprites.length; idx++) {
    var pepe = sprites[idx];
    var done = false;
    for(var i=0; i<pepe.width*pepe.height; i++){
      if(pepe.colors[i] === -1){
        continue;
      }
      var targetPoint = getPoint(pepe, i);
      canvasse.drawTileAt(targetPoint.x, targetPoint.y, colorsABGR[pepe.colors[i]]);
    }
  }
}

function getPoint(pepe, i){
  var x = i % pepe.width;
  return {
    x: pepe.x + x,
    y: pepe.y + (i - x) / pepe.width - pepe.height
  };
}

function getPixel(x, y){
  return canvasse.writeBuffer[canvasse.getIndexFromCoords(x, y)];
}