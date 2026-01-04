// ==UserScript==
// @name         Rocketer Utilities
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a lot new settings to the game https://rocketer.glitch.me/
// @author       DB423 (Impsaccrain)
// @match        http*://rocketer.glitch.me/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      DISTRIBUTION
// @downloadURL https://update.greasyfork.org/scripts/478829/Rocketer%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/478829/Rocketer%20Utilities.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.RocketerUtilities = localStorage.RocketerUtilities || JSON.stringify({ Options: { AuraState: 1, AutoRespawn: 0, Theme: 0 }, version: 1.4 });

    if (JSON.parse(localStorage.RocketerUtilities).version != 1.4) {
        localStorage.RocketerUtilities = JSON.stringify({ Options: { AuraState: 1, AutoRespawn: 0, Theme: 0 }, version: 1.4 });
    };

    const Utils = JSON.parse(localStorage.RocketerUtilities);
    const Options = Utils.Options;

    var settings = document.getElementById('settingsPopup');
    var closesettingspopup = document.getElementById('closeSettingsPopup');
    var themes = document.getElementById('theme');
    changetheme = function (selectObject) {
        colortheme = selectObject.value;
        let newutils = JSON.parse(localStorage.RocketerUtilities);
        newutils.Options.Theme = document.getElementById('theme').selectedIndex;
        newutils = JSON.stringify(newutils);
        localStorage.RocketerUtilities = newutils;
    }
    var playershape = 'circle';

    var whitetheme = document.createElement('option');
    whitetheme.value = 'whitetheme';
    whitetheme.textContent = 'White';
    themes.appendChild(whitetheme);

    var simplistic = document.createElement('option');
    simplistic.value = 'simplistic';
    simplistic.textContent = 'Simplistic';
    themes.appendChild(simplistic);

    for (let i = 3; i < 15; i++) {
        shapecolors[i].whitetheme = {
            color: "#FFFFFF",
            outline: "#FFFFFF",
            hitcolor: "#FFFFFF",
            hitoutline: "#FFFFFF",
        };
        shapecolors[i].simplistic = {
            color: shapecolors[i].default.color,
            outline: shapecolors[i].default.color,
            hitcolor: shapecolors[i].default.hitcolor,
            hitoutline: shapecolors[i].default.hitcolor,
        };
    };

    var chatstate = true;
    function toggleChat() {
        let chatinput = document.getElementById('chat');
        chatstate = !chatstate;
        if (!chatstate) {
            chatinput.style.display = 'none';
        } else {
            chatinput.style.display = 'block';
        };
    };

    var aurastate = Options.AuraState == 1 ? true : false;
    function toggleAura() {
        aurastate = !aurastate
        Options.AuraState = aurastate ? 1 : 0;
        localStorage.RocketerUtilities = JSON.stringify(Utils);
    };
    var autorespawn = Options.AutoRespawn == 1 ? true : false;
    function toggleAutoRespawn() {
        autorespawn = !autorespawn
        Options.AutoRespawn = autorespawn ? 1 : 0;
        localStorage.RocketerUtilities = JSON.stringify(Utils);
    };

    var chattoggle = document.createElement('label');
    chattoggle.className = 'switch';
    var cti = document.createElement('input');
    cti.type = 'checkbox';
    cti.checked = true;
    cti.onclick = toggleChat;
    var cts = document.createElement('span');
    cts.className = 'slider round';
    chattoggle.appendChild(cti);
    chattoggle.appendChild(cts);

    var auratoggle = document.createElement('label');
    auratoggle.className = 'switch';
    var ati = document.createElement('input');
    ati.type = 'checkbox';
    ati.checked = Options.AuraState == 1 ? false : true;
    ati.onclick = toggleAura;
    var ats = document.createElement('span');
    ats.className = 'slider round';
    auratoggle.appendChild(ati);
    auratoggle.appendChild(ats);

    var respawntoggle = document.createElement('label');
    respawntoggle.className = 'switch';
    var rti = document.createElement('input');
    rti.type = 'checkbox';
    rti.checked = Options.AutoRespawn == 1 ? true : false;
    rti.onclick = toggleAutoRespawn;
    var rts = document.createElement('span');
    rts.className = 'slider round';
    respawntoggle.appendChild(rti);
    respawntoggle.appendChild(rts);

    var utilities = document.createElement('span');
    utilities.style = 'font-weight: 700; font-size: 25px;';
    utilities.textContent = 'Rocketer Utilities';

    settings.appendChild(document.createElement('br'));
    settings.appendChild(document.createElement('br'));
    settings.appendChild(utilities);
    settings.appendChild(document.createElement('hr'));
    settings.appendChild(document.createTextNode("Chat "));
    settings.appendChild(chattoggle);
    settings.appendChild(document.createElement('br'));
    settings.appendChild(document.createElement('br'));
    settings.appendChild(document.createTextNode("Invisible auras "));
    settings.appendChild(auratoggle);
    settings.appendChild(document.createElement('br'));
    settings.appendChild(document.createElement('br'));
    settings.appendChild(document.createTextNode("Auto-respawn "));
    settings.appendChild(respawntoggle);

    var playershapediv = document.createElement('div');
    playershapediv.appendChild(document.createElement('br'));
    playershapediv.appendChild(document.createTextNode('Player shape: '));
    var playershapeselect = document.createElement('select');
    playershapeselect.id = 'player-shape-select'
    playershapeselect.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    playershapeselect.style.color = 'white';
    playershapeselect.style.borderRadius = '7px';
    playershapeselect.style.width = '100px';
    playershapeselect.style.height = '30px';

    var playershapecircle = document.createElement('option');
    playershapecircle.value = 'circle';
    playershapecircle.textContent = 'Circle';
    playershapeselect.appendChild(playershapecircle);

    var playershapesquare = document.createElement('option');
    playershapesquare.value = 'square';
    playershapesquare.textContent = 'Square';
    playershapeselect.appendChild(playershapesquare);

    var playershapetriangle = document.createElement('option');
    playershapetriangle.value = 'triangle';
    playershapetriangle.textContent = 'Triangle';
    playershapeselect.appendChild(playershapetriangle);

    playershapediv.appendChild(playershapeselect);

    setTimeout(function() {

    let changelogDisplayElement = document.getElementById('changelogDisplay');
    changelogDisplayElement.appendChild(document.createElement('br'));
    changelogDisplayElement.appendChild(document.createElement('br'));
    let rucspan = document.createElement('span');
    rucspan.id = 'rocketer-utils-changelog';
    let ruc = document.createTextNode('ROCKETER UTILITIES CHANGELOG - 1.4 - 6 December 2023');
    rucspan.style.color = 'orange';
    rucspan.appendChild(ruc);
    let rucp = document.createElement('p');
    function cct(text, br) {
        rucp.appendChild(document.createTextNode(text));
        if (br) {
            rucp.appendChild(document.createElement('br'));
        };
    };
    cct('- BUGFIX: Fixed the chat doubling itself', true);
    cct('- FEATURE: Added the smooth chat transitions (they didn\'t appear)', false)
    rucspan.appendChild(rucp);
    changelogDisplayElement.appendChild(rucspan);
    themes.selectedIndex = Options.Theme;
    changetheme(themes);

    }, 500);

    function newdrawplayer(canvas, object, fov, spawnProtect, playercolor, playeroutline, eternal, objectangle){//only barrels and body (no heath bars, names, and chats)
    const CRTP = document.getElementById('theme').value;
    //objectangle refers to angle rotated before triggering this function
    //fov is clientFovMultiplier for ctx, hctx is 1
      canvas.lineJoin = "round"; //make nice round corners
      //draw assets below body, e.g. rammer body base
      for (let assetID in object.assets){
        var asset = object.assets[assetID];
        if (asset.type == "under") {
          if (('angle' in asset) && asset.angle != 0) {
            canvas.rotate(asset.angle * Math.PI / 180);
          }
          canvas.translate(
            (object.width / fov) * asset.x,
            (object.width / fov) * asset.y
          );
          canvas.fillStyle = asset.color;
          canvas.strokeStyle = asset.outline;
          canvas.lineWidth = asset.outlineThickness / fov;
          if (asset.sides == 0) {
            canvas.beginPath();
            canvas.arc(0, 0, (object.width / fov) * asset.size, 0, 2 * Math.PI);
            canvas.fill();
            if (CRTP != 'simplistic') {
            canvas.stroke();
            };
          } else {
            canvas.beginPath();
            let baseSides = asset.sides;
            canvas.moveTo((object.width / fov) * asset.size, 0);
            for (let i = 1; i <= baseSides; i++) {
              canvas.lineTo((object.width / fov) * asset.size * Math.cos((i * 2 * Math.PI) / baseSides), (object.width / fov) * asset.size * Math.sin((i * 2 * Math.PI) / baseSides));
            }
            canvas.fill();
            if (CRTP != 'simplistic') {
            canvas.stroke();
            };
          }
          canvas.translate(
            (-object.width / fov) * asset.x,
            (-object.width / fov) * asset.y
          );
          if (('angle' in asset) && asset.angle != 0) {
            canvas.rotate(-asset.angle * Math.PI / 180);
          }
        }
      }

      //draw barrel
      canvas.lineWidth = 4 / fov;
      //weapon barrels
      for (let barrel in object.barrels){
        let thisBarrel = object.barrels[barrel];
        canvas.rotate((thisBarrel.additionalAngle * Math.PI) / 180); //rotate to barrel angle
        canvas.fillStyle = bodyColors.barrel.col;
        canvas.strokeStyle = bodyColors.barrel.outline;
        if (spawnProtect == "yes") {
          //if have spawn protection
          canvas.fillStyle = bodyColors.barrel.hitCol;
          canvas.strokeStyle = bodyColors.barrel.hitOutline;
        }
        //bullet barrel
        //note: barrelHeightChange refers to reduction in barrel height for barrel animation when shooting
        if (thisBarrel.barrelType == "bullet") {
          drawBulletBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //drone barrel
        else if (thisBarrel.barrelType == "drone") {
          drawDroneBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //trap barrel
        else if (thisBarrel.barrelType == "trap") {
          drawTrapBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //mine barrel
        else if (thisBarrel.barrelType == "mine") {
          drawMineBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //minion barrel
        else if (thisBarrel.barrelType == "minion") {
          drawMinionBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        canvas.rotate((-thisBarrel.additionalAngle * Math.PI) / 180); //rotate back
      }

      //draw player body
      canvas.fillStyle = playercolor;
      canvas.strokeStyle = playeroutline;
      if (eternal == "no") {
        //not a tier 6 tank
        canvas.beginPath();
        canvas.arc(0, 0, object.width / fov, 0, 2 * Math.PI);
        canvas.fill();
        if (CRTP != 'simplistic') {
            canvas.stroke();
        };
      } else {
        //if a tier 6 tank
        canvas.beginPath();
        let baseSides = 6;
        canvas.moveTo((object.width / fov), 0);
        for (var i = 1; i <= baseSides; i++) {
          canvas.lineTo((object.width / fov) * Math.cos((i * 2 * Math.PI) / baseSides), (object.width / fov) * Math.sin((i * 2 * Math.PI) / baseSides));
        }
        canvas.fill();
        if (CRTP != 'simplistic') {
            canvas.stroke();
        };
      }

      //barrels in body upgrade
      for (let barrel in object.bodybarrels){
        let thisBarrel = object.bodybarrels[barrel];
        canvas.rotate(thisBarrel.additionalAngle - objectangle); //rotate to barrel angle
        canvas.fillStyle = bodyColors.barrel.col;
        canvas.strokeStyle = bodyColors.barrel.outline;
        if (spawnProtect == "yes") {
          //if have spawn protection
          canvas.fillStyle = bodyColors.barrel.hitCol;
          canvas.strokeStyle = bodyColors.barrel.hitOutline;
        }
        //bullet barrel
        if (thisBarrel.barrelType == "bullet") {
          drawBulletBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //drone barrel
        else if (thisBarrel.barrelType == "drone") {
          drawDroneBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //trap barrel (doesnt exist atm)
        else if (thisBarrel.barrelType == "trap") {
          drawTrapBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //mine barrel (doesnt exist atm)
        else if (thisBarrel.barrelType == "mine") {
          drawMineBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        //minion barrel (doesnt exist atm)
        else if (thisBarrel.barrelType == "minion") {
          drawMinionBarrel(canvas,thisBarrel.x,thisBarrel.barrelWidth,thisBarrel.barrelHeight,thisBarrel.barrelHeightChange,fov)
        }
        canvas.rotate(-thisBarrel.additionalAngle + objectangle); //rotate back
      }
      //draw turret base
      if ('turretBaseSize' in object){
        canvas.fillStyle = bodyColors.barrel.col;
        canvas.strokeStyle = bodyColors.barrel.outline;
        canvas.beginPath();
        canvas.arc(0, 0, (object.width / clientFovMultiplier) * object.turretBaseSize, 0, 2 * Math.PI);
        canvas.fill();
        if (CRTP != 'simplistic') {
            canvas.stroke();
        };
      }

      //draw assets above body, e.g. aura assets
      for (let assetID in object.assets){
        var asset = object.assets[assetID];
        if (asset.type == "above") {
          if (('angle' in asset) && asset.angle != 0) {
            canvas.rotate(asset.angle * Math.PI / 180);
          }
          canvas.translate(
            (object.width / fov) * asset.x,
            (object.width / fov) * asset.y
          );
          canvas.fillStyle = asset.color;
          canvas.strokeStyle = asset.outline;
          canvas.lineWidth = asset.outlineThickness / fov;
          if (asset.sides == 0) {
            canvas.beginPath();
            canvas.arc(0, 0, (object.width / fov) * asset.size, 0, 2 * Math.PI);
            canvas.fill();
            if (CRTP != 'simplistic') {
                canvas.stroke();
            };
          } else {
            canvas.beginPath();
            let baseSides = asset.sides;
            canvas.moveTo((object.width / fov) * asset.size, 0);
            for (var i = 1; i <= baseSides; i++) {
              canvas.lineTo((object.width / fov) * asset.size * Math.cos((i * 2 * Math.PI) / baseSides), (object.width / fov) * asset.size * Math.sin((i * 2 * Math.PI) / baseSides));
            }
            canvas.fill();
            if (CRTP != 'simplistic') {
                canvas.stroke();
            };
          }
          canvas.translate(
            (-object.width / fov) * asset.x,
            (-object.width / fov) * asset.y
          );
          if (('angle' in asset) && asset.angle != 0) {
            canvas.rotate(-asset.angle * Math.PI / 180);
          }
        }
      }

      canvas.lineJoin = "miter"; //change back
  };
    function newdraw(object, id, playerstring, auraWidth) {
    const CRTP = document.getElementById('theme').value;
    //function for drawing objects on the canvas. need to provide aura width because this fuction cannot access variables outside
    var drawingX =
      (object.x - px) / clientFovMultiplier + canvas.width / 2; //calculate the location on canvas to draw object
    var drawingY =
      (object.y - py) / clientFovMultiplier + canvas.height / 2;

    if (object.type == "bullet") {
      //draw bullet
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = object.deadOpacity;
      }
      var chooseflash = 3;
      if (object.hit > 0 && object.bulletType != "aura") {
        //if shape is hit AND bullet is not aura, choose whether it's color is white or original color to create flashing effect
        chooseflash = Math.floor(Math.random() * 3); //random number 0, 1 or 2
      }
      if (chooseflash == 0) {
        ctx.fillStyle = "white";
      } else if (chooseflash == 1) {
        ctx.fillStyle = "pink";
      } else {
        if (object.ownsIt == "yes" || object.bulletType == "aura") {
          //if it's an aura or client's tank owns the bullet
          ctx.fillStyle = object.color;
        } else {
          ctx.fillStyle = "#f04f54"; //bullet color is red
        }
      }
      if (object.bulletType == "aura") {
        var choosing;
        if (aurastate && CRTP != 'simplistic') {
        choosing = Math.floor(Math.random() * 2); //choose if particle spawn
        } else {
        choosing = 0;
        };
        if (choosing == 1) {
          //spawn a particle
          var angleDegrees = Math.floor(Math.random() * 360); //choose angle in degrees
          var angleRadians = (angleDegrees * Math.PI) / 180; //convert to radians
          var randomDistFromCenter =
            Math.floor(Math.random() * object.width * 2) - object.width;
          radparticles[particleID] = {
            angle: angleRadians,
            x: object.x + randomDistFromCenter * Math.cos(angleRadians),
            y: object.y + randomDistFromCenter * Math.sin(angleRadians),
            width: 5,
            height: 5,
            speed: 1,
            timer: 30,
            maxtimer: 50,
            color: object.color,
            outline: object.outline,
            type: "particle",
          };
          particleID++;
        }
      }

      if (object.ownsIt == "yes" || object.bulletType == "aura") {
        //if it's an aura or client's tank owns the bullet
        ctx.strokeStyle = object.outline;
      } else {
        ctx.strokeStyle = "#b33b3f"; //bullet is red
      }


      //bullet is purple even if bullet belongs to enemy
      if (object.color == "#934c93") {
        ctx.fillStyle = object.color;
      }
      if (object.outline == "#660066") {
        ctx.strokeStyle = object.outline;
      }

      //team colors
      if (object.team == "blue" || object.team == "green" || object.team == "red" || object.team == "purple" || object.team == "eternal" || object.team == "magenta" || object.team == "fallen" || object.team == "celestial") {
        ctx.fillStyle = bodyColors[object.team].col;
        ctx.strokeStyle = bodyColors[object.team].outline;
      }

      if (object.bulletType == "aura"){
        //color is aura color, regardless of team
        ctx.fillStyle = object.color;
        ctx.strokeStyle = object.outline;
      }

      if (object.passive == "yes") {
        if (object.bulletType == "aura") {
          ctx.strokeStyle = "rgba(128,128,128,.2)";
          ctx.fillStyle = "rgba(128,128,128,.2)";
        } else {
          ctx.strokeStyle = "dimgrey";
          ctx.fillStyle = "grey";
        }
      }

      if (object.team=="mob"){
        //dune mob's bullets is the colo of mob
        ctx.fillStyle = botcolors[object.ownerName].color;
        ctx.strokeStyle = botcolors[object.ownerName].outline;
      }

      ctx.lineWidth = 4 / clientFovMultiplier;
      if (object.bulletType == "bullet" || object.bulletType == "aura") {
        if (!object.color.includes('rgba(56,183,100')){//not a heal aura
          ctx.beginPath();
          ctx.arc(
            drawingX,
            drawingY,
            object.width / clientFovMultiplier,
            0,
            2 * Math.PI
          );
          if (aurastate || object.bulletType != "aura") {
          ctx.fill();
          };
          if (object.bulletType == 'aura') {
          ctx.stroke();
          } else if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        }
        else{//8 sides for healing aura
          ctx.beginPath();
          ctx.moveTo((object.width / clientFovMultiplier) + drawingX, drawingY);
          for (var i = 1; i <= 8 + 1; i += 1) {
            ctx.lineTo(
              (object.width / clientFovMultiplier) *
                  Math.cos((i * 2 * Math.PI) / 8) + drawingX,
              (object.width / clientFovMultiplier) *
                  Math.sin((i * 2 * Math.PI) / 8) + drawingY
            );
          }
           if (aurastate || object.bulletType != "aura") {
          ctx.fill();
           };
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        }
      } else if (object.bulletType == "trap") {
        //width is the radius, so need to times two to get total width
        //note: x and y of object are the center of object, but when drawing rectangles, the x and y coordinates given need to be the top left corner of the rectangle, so need to minus the width and height
        ctx.fillRect(
          drawingX - object.width / clientFovMultiplier,
          drawingY - object.width / clientFovMultiplier,
          (object.width * 2) / clientFovMultiplier,
          (object.width * 2) / clientFovMultiplier
        );
          if (CRTP != 'simplistic') {
        ctx.strokeRect(
          drawingX - object.width / clientFovMultiplier,
          drawingY - object.width / clientFovMultiplier,
          (object.width * 2) / clientFovMultiplier,
          (object.width * 2) / clientFovMultiplier
        );
          };
      } else if (object.bulletType == "drone") {
        ctx.save();
        ctx.translate(drawingX, drawingY);
        ctx.rotate(object.moveAngle);
        //ctx.rotate((object.moveAngle*180/Math.PI - 90) *Math.PI/180);//cannot straightaway use the angle, must add 90 degrees to it, because 0 degrees is pointing right, but we are drawing the triangle upwards
        ctx.beginPath();
        ctx.moveTo(
          (object.width / clientFovMultiplier) * Math.cos(0),
          (object.width / clientFovMultiplier) * Math.sin(0)
        );
        for (var i = 1; i <= 3; i += 1) {
          ctx.lineTo(
            (object.width / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / 3),
            (object.width / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / 3)
          );
        }
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.restore();
      } else if (object.bulletType == "mine" || object.bulletType == "minion") {
        //console.log(object.moveAngle/Math.PI*180)
        //mine is trap with barrel, minion is bullet with barrel
        ctx.save();
        ctx.translate(drawingX, drawingY);
        ctx.rotate(object.moveAngle);
        //ctx.rotate((object.moveAngle*180/Math.PI - 90) *Math.PI/180);//cannot straightaway use the angle, must add 90 degrees to it, because 0 degrees is pointing right, but we are drawing the triangle upwards

        if (object.bulletType == "minion"){
          //draw barrels underneath
          var prevfill = ctx.fillStyle;
          var prevstroke = ctx.strokeStyle;//store previous bullet color so can change back later
          ctx.fillStyle = bodyColors.barrel.col;
          ctx.strokeStyle = bodyColors.barrel.outline;
          Object.keys(object.barrels).forEach((barrel) => {
          let thisBarrel = object.barrels[barrel];
          ctx.rotate(thisBarrel.additionalAngle); //rotate to barrel angle
          if (thisBarrel.barrelType == "bullet") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            };
          }
          //drone barrel
          else if (thisBarrel.barrelType == "drone") {
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              0
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                (thisBarrel.x * 2) / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                (thisBarrel.x * 2) / clientFovMultiplier,
              0
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          //trap barrel
          else if (thisBarrel.barrelType == "trap") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            };
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          //mine barrel
          else if (thisBarrel.barrelType == "mine") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            };
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
        //minion barrel
        else if (thisBarrel.barrelType == "minion") {
          ctx.fillRect(
            -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier,
            thisBarrel.barrelWidth / clientFovMultiplier,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier,
            thisBarrel.barrelWidth / clientFovMultiplier,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier
          );
          };
          ctx.fillRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier
          );
           if (CRTP != 'simplistic') {
          ctx.strokeRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier
          );
           };
          ctx.fillRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange)  / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /5/ clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange)  / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /5 /clientFovMultiplier
          );
          };
        }
          })
          ctx.fillStyle = prevfill;
          ctx.strokeStyle = prevstroke;
        }
        ctx.beginPath();
        if (object.bulletType == "mine"){//mine
          ctx.moveTo(
            (object.width / clientFovMultiplier) * Math.cos(0),
            (object.width / clientFovMultiplier) * Math.sin(0)
          );
          for (var i = 1; i <= 3; i += 1) {
            ctx.lineTo(
              (object.width / clientFovMultiplier) *
                Math.cos((i * 2 * Math.PI) / 3),
              (object.width / clientFovMultiplier) *
                Math.sin((i * 2 * Math.PI) / 3)
            );
          }
        }
        else{//minion
          ctx.arc(0, 0, object.width / clientFovMultiplier, 0, 2 * Math.PI);
        }
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.rotate(-object.moveAngle); //rotate back
        //BARREL FOR THE MINE TRAP
        if (object.bulletType == "mine"){
        Object.keys(object.barrels).forEach((barrel) => {
          let thisBarrel = object.barrels[barrel];
          ctx.rotate(thisBarrel.additionalAngle); //rotate to barrel angle
          ctx.fillStyle = "grey";
          ctx.strokeStyle = "#5e5e5e";
          if (thisBarrel.barrelType == "bullet") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            };
          }
          //drone barrel
          else if (thisBarrel.barrelType == "drone") {
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              0
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                (thisBarrel.x * 2) / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                (thisBarrel.x * 2) / clientFovMultiplier,
              0
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          //trap barrel
          else if (thisBarrel.barrelType == "trap") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            };
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          //mine barrel
          else if (thisBarrel.barrelType == "mine") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight -
                thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            };
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(
                thisBarrel.barrelHeight - thisBarrel.barrelHeightChange
              ) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
        //minion barrel
        else if (thisBarrel.barrelType == "minion") {
          ctx.fillRect(
            -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier,
            thisBarrel.barrelWidth / clientFovMultiplier,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier,
            thisBarrel.barrelWidth / clientFovMultiplier,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier
          );
          };
          ctx.fillRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier
          );
          };
          ctx.fillRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange)  / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /5/ clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange)  / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /5 /clientFovMultiplier
          );
          };
        }
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            thisBarrel.barrelWidth / clientFovMultiplier,
            0,
            2 * Math.PI
          );
          ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          ctx.rotate(-thisBarrel.additionalAngle); //rotate back
        });
      }

        ctx.restore();
      }
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = 1.0; //reset opacity
      }
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "bot") {
      //draw bot
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = object.deadOpacity;
      }
      ctx.lineWidth = 4 / clientFovMultiplier;
      ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
      ctx.save();
      ctx.translate(drawingX, drawingY);
      ctx.rotate(object.angle);
      //draw barrels
      if (object.name!="Pillbox"){//pillbox's barrel is visually a turret
        Object.keys(object.barrels).forEach((barrel) => {
          let thisBarrel = object.barrels[barrel];
          ctx.rotate(((thisBarrel.additionalAngle + 90) * Math.PI) / 180); //rotate to barrel angle
          ctx.fillStyle = bodyColors.barrel.col;
          ctx.strokeStyle = bodyColors.barrel.outline;
          if (thisBarrel.barrelType == "bullet") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            };
          }
          //drone barrel
          else if (thisBarrel.barrelType == "drone") {
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              0
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                (thisBarrel.x * 2) / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                (thisBarrel.x * 2) / clientFovMultiplier,
              0
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          //trap barrel
          else if (thisBarrel.barrelType == "trap") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            };
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          //mine barrel
          else if (thisBarrel.barrelType == "mine") {
            ctx.fillRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            if (CRTP != 'simplistic') {
            ctx.strokeRect(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier,
              thisBarrel.barrelWidth / clientFovMultiplier,
              (((thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            };
            ctx.beginPath();
            ctx.moveTo(
              -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.lineTo(
              -thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                clientFovMultiplier
            );
            ctx.lineTo(
              thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                thisBarrel.x / clientFovMultiplier,
              ((-(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                3) *
                2) /
                clientFovMultiplier
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
        //minion barrel
        else if (thisBarrel.barrelType == "minion") {
          ctx.fillRect(
            -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier,
            thisBarrel.barrelWidth / clientFovMultiplier,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier,
            thisBarrel.barrelWidth / clientFovMultiplier,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
              clientFovMultiplier
          );
          };
          ctx.fillRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) / 1.5 / clientFovMultiplier
          );
          };
          ctx.fillRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange)  / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /5/ clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            (-thisBarrel.barrelWidth * 1.5) / 2 / clientFovMultiplier +
              thisBarrel.x / clientFovMultiplier,
            -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange)  / clientFovMultiplier,
            (thisBarrel.barrelWidth / clientFovMultiplier) * 1.5,
            (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /5 /clientFovMultiplier
          );
          };
        }
          ctx.rotate((-(thisBarrel.additionalAngle + 90) * Math.PI) / 180); //rotate back
        });
      }
      if (object.name=="Cluster"){
        //draw the spawning barrels
        let barrelwidth = object.width*0.7;
        let barrelheight = object.width*1.2;
        ctx.fillStyle = bodyColors.barrel.col;
        ctx.strokeStyle = bodyColors.barrel.outline;
        ctx.save();
        ctx.rotate(90 * Math.PI / 180);
        for (let i = 0; i < 5; i++){
          if (i!=0){
            ctx.rotate(72 * Math.PI / 180); //rotate 72 for each barrel
          }
          ctx.beginPath();
          ctx.moveTo(
            -barrelwidth / 5 / clientFovMultiplier,
            0
          );
          ctx.lineTo(
            -barrelwidth / clientFovMultiplier,
            -barrelheight / clientFovMultiplier
          );
          ctx.lineTo(
            barrelwidth / clientFovMultiplier,
            -barrelheight / clientFovMultiplier
          );
          ctx.lineTo(
            barrelwidth / 5 / clientFovMultiplier,
            0
          );
          ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        }
        ctx.restore();
      }
      else if (object.name=="Infestor"){
        //draw the spawning barrels
        let barrelwidth = object.width*0.7;
        let barrelheight = object.width*1.2;
        ctx.fillStyle = bodyColors.barrel.col;
        ctx.strokeStyle = bodyColors.barrel.outline;
        ctx.save();
        for (let i = 0; i < 4; i++){//normal barrels
          if (i!=0){
            ctx.rotate(90 * Math.PI / 180);
          }
          ctx.fillRect(
            -barrelwidth / 2 / clientFovMultiplier,
            -barrelheight / clientFovMultiplier,
            barrelwidth / clientFovMultiplier,
            barrelheight / clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            -barrelwidth / 2 / clientFovMultiplier,
            -barrelheight / clientFovMultiplier,
            barrelwidth / clientFovMultiplier,
            barrelheight / clientFovMultiplier
          );
          };
        }
        ctx.restore();
        ctx.save();
        ctx.rotate(45 * Math.PI / 180);
        barrelwidth = object.width*0.6;
        barrelheight = object.width*2;
        for (let i = 0; i < 4; i++){//traplike barrels
          if (i!=0){
            ctx.rotate(90 * Math.PI / 180);
          }
          ctx.fillRect(
            -barrelwidth / 2 / clientFovMultiplier,
            -barrelheight * 0.55 / clientFovMultiplier,
            barrelwidth / clientFovMultiplier,
            barrelheight * 0.5 / clientFovMultiplier
          );
          if (CRTP != 'simplistic') {
          ctx.strokeRect(
            -barrelwidth / 2 / clientFovMultiplier,
            -barrelheight * 0.55 / clientFovMultiplier,
            barrelwidth / clientFovMultiplier,
            barrelheight * 0.5 / clientFovMultiplier
          );
          };
          ctx.beginPath();
          ctx.moveTo(
            -barrelwidth / 2 / clientFovMultiplier,
            -barrelheight * 0.55 / clientFovMultiplier
          );
          ctx.lineTo(
            -barrelwidth/1.7 / clientFovMultiplier,
            -barrelheight * 0.65 / clientFovMultiplier
          );
          ctx.lineTo(
            barrelwidth/1.7 / clientFovMultiplier,
            -barrelheight * 0.65 / clientFovMultiplier
          );
          ctx.lineTo(
            barrelwidth / 2 / clientFovMultiplier,
            -barrelheight * 0.55 / clientFovMultiplier
          );
          ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        }
        ctx.restore();
      }
      else if (object.name=="Champion"){
        //draw spikes
        var numberOfSpikes = 5;
        var outerRadius = object.width / clientFovMultiplier * 1.3;
        var innerRadius = object.width / clientFovMultiplier /1.3;
        var rot = (Math.PI / 2) * 3;//dont change this, or else will have strange extra lines
        var x = 0;
        var y = 0;
        ctx.fillStyle = bodyColors.barrel.col;
        ctx.strokeStyle = bodyColors.barrel.outline;
        ctx.save();
        ctx.rotate(90 * Math.PI / 180);
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.restore();
      }
      var chooseflash = 3;
      if (object.hit > 0) {
        //if shape is hit, choose whether it's color is white or original color to create flashing effect
        chooseflash = Math.floor(Math.random() * 3); //random number 0, 1 or 2
      }
      if (chooseflash == 0) {
        ctx.fillStyle = "white";
      } else if (chooseflash == 1) {
        ctx.fillStyle = "pink";
      } else {
        ctx.fillStyle = botcolors[object.name].color;
      }
      ctx.strokeStyle = botcolors[object.name].outline;
      //draw body
      if (object.side==0) {
        //draw circle
        ctx.beginPath();
        ctx.arc(0, 0, object.width / clientFovMultiplier, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      } else if (object.side>=0) {
        if (object.hasOwnProperty('randomPointsArrayX')){
          //draw for rock and boulder
          //POLYGON WITH IRREGULAR SIDES
          ctx.rotate(-object.angle); //rotate back so that rock wont rotate to face you
          var rockSides = object.side;
          ctx.beginPath();
          ctx.moveTo(
            0 + (object.width / clientFovMultiplier) * Math.cos(0),
            0 + (object.width / clientFovMultiplier) * Math.sin(0)
          );
          for (var i = 1; i <= rockSides; i += 1) {
            var XRandom = object.randomPointsArrayX[i - 1];
            var YRandom = object.randomPointsArrayY[i - 1];
            ctx.lineTo(XRandom + (object.width / clientFovMultiplier) * Math.cos((i * 2 * Math.PI) / rockSides),
              YRandom + (object.width / clientFovMultiplier) * Math.sin((i * 2 * Math.PI) / rockSides)
            );
          }
          ctx.fill();
          ctx.stroke();
        }
        else{//normal spawner
          if (object.name=="Cluster"||object.name=="Pursuer"||object.name=="Champion"||object.name=="Infestor"){
            //need to rotate 72/2 degrees so that pentagon not facing vertex towards player
            ctx.rotate(Math.PI/object.side);//2 PI / sides / 2
          }
          ctx.beginPath();
          ctx.moveTo((object.width / clientFovMultiplier), 0);
          for (var i = 1; i <= object.side + 1; i += 1) {
            ctx.lineTo(
              (object.width / clientFovMultiplier) *
                  Math.cos((i * 2 * Math.PI) / object.side),
              (object.width / clientFovMultiplier) *
                  Math.sin((i * 2 * Math.PI) / object.side)
            );
          }
          ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          if (object.name=="Cluster"||object.name=="Pursuer"){
            ctx.rotate(-Math.PI/object.side);//rotate back
            //draw circle on top
            ctx.fillStyle = bodyColors.barrel.col;//light grey
            ctx.strokeStyle = bodyColors.barrel.outline;
            ctx.beginPath();
            ctx.arc(0, 0, object.width/2 / clientFovMultiplier, 0, 2 * Math.PI);
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          else if (object.name=="Champion"){
            ctx.rotate(-Math.PI/object.side);//rotate back
            //draw circle on top
            ctx.fillStyle = "grey";//darker grey
            ctx.strokeStyle = "#5e5e5e";
            ctx.beginPath();
            ctx.arc(0, 0, object.width/2.5 / clientFovMultiplier, 0, 2 * Math.PI);
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          else if (object.name=="Infestor"){
            ctx.rotate(-Math.PI/object.side);//rotate back
            //draw circle on top
            ctx.fillStyle = bodyColors.barrel.col;//light grey
            ctx.strokeStyle = bodyColors.barrel.outline;
            ctx.beginPath();
            ctx.arc(0, 0, object.width/5 / clientFovMultiplier, 0, 2 * Math.PI);
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          else if (object.name=="Leech"){
            //draw circle on top
            ctx.fillStyle = bodyColors.barrel.col;//light grey
            ctx.strokeStyle = bodyColors.barrel.outline;
            ctx.beginPath();
            ctx.arc(0, 0, object.width/2 / clientFovMultiplier, 0, 2 * Math.PI);
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
          }
          else if (object.name=="Pillbox"){//pillbox's barrel is visually a turret
            ctx.lineJoin = "round"; //make nice round corners
            ctx.rotate(90 * Math.PI / 180);
            Object.keys(object.barrels).forEach((barrel) => {
              //note that you must use [barrel] instead of .barrel, if not there will be an error
              let thisBarrel = object.barrels[barrel];
              ctx.fillStyle = bodyColors.barrel.col;
              ctx.strokeStyle = bodyColors.barrel.outline;
              ctx.fillRect(
                -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                  thisBarrel.x,
                -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                  clientFovMultiplier,
                thisBarrel.barrelWidth / clientFovMultiplier,
                (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                  clientFovMultiplier
              );
              if (CRTP != 'simplistic') {
              ctx.strokeRect(
                -thisBarrel.barrelWidth / 2 / clientFovMultiplier +
                  thisBarrel.x,
                -(thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                  clientFovMultiplier,
                thisBarrel.barrelWidth / clientFovMultiplier,
                (thisBarrel.barrelHeight - thisBarrel.barrelHeightChange) /
                  clientFovMultiplier
              );
              };
            });
            ctx.rotate(-90 * Math.PI / 180);
            //draw turret base
            ctx.beginPath();
            ctx.arc(
              0,
              0,
              (object.width / clientFovMultiplier) * 0.6,
              0,
              2 * Math.PI
            );
            ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
            ctx.lineJoin = "miter"; //change back
          }
        }
      } else{//negative sides, draw a star! (cactus)
        var numberOfSpikes = -object.side;
        var outerRadius = object.width / clientFovMultiplier * 1.5;
        var innerRadius = object.width / clientFovMultiplier;

        var rot = (Math.PI / 2) * 3;//dont change this, or else will have strange extra lines
        var x = 0;
        var y = 0;
        ctx.rotate(-object.angle); //rotate back so that rock wont rotate to face you
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      }
      ctx.restore();
      if (object.health < object.maxhealth) {
        //draw health bar background
        var w = (object.width * 2) / clientFovMultiplier;
        var h = 7 / clientFovMultiplier;
        var r = h / 2;
        var x = drawingX - object.width / clientFovMultiplier;
        var y = drawingY + object.width / clientFovMultiplier + 10;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2.5 / clientFovMultiplier;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //draw health bar
        if (object.health > 0) {
          w = (w / object.maxhealth) * object.health;
          if (r * 2 > w) {
            //prevent weird shape when radius more than width
            r = w / 2;
            y += (h - w) / 2; //move health bar so that it is centered vertically in black bar
            h = w;
          }
          ctx.fillStyle = botcolors[object.name].color;
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5 / clientFovMultiplier;
      ctx.font = "700 " + 20 / clientFovMultiplier + "px Roboto";
      ctx.textAlign = "center";
      ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
      //note: if you stroke then fill, the words will be thicker and nicer. If you fill then stroke, the words are thinner.
      if ((showStaticMobName == "yes"||botcolors[object.name].static=="no") && (showMinionMobName == "yes"||botcolors[object.name].minion=="no")){//settings for showing static and minion names
        if (botcolors[object.name].specialty != "") {
          var specialtyText = " (" + botcolors[object.name].specialty + ")";
        } else {
          var specialtyText = "";
        }
        ctx.strokeText(
          object.name + specialtyText,
          drawingX,
          drawingY - object.width / clientFovMultiplier - 10
        );
        ctx.fillText(
          object.name + specialtyText,
          drawingX,
          drawingY - object.width / clientFovMultiplier - 10
        );
      }
      ctx.lineJoin = "miter"; //prevent spikes above the capital letter "M"
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = 1.0; //reset opacity
      }
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "shape") {
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = object.deadOpacity;
      }
      var radiantAuraSize =
        document.getElementById("sizevalue").innerHTML * auraWidth; //aura size determined by settings, but default is 5
      //draw shape
      ctx.save();
      ctx.translate(drawingX, drawingY);
      ctx.rotate((object.angle * Math.PI) / 180);
      if (object.hasOwnProperty("radtier")) {
        //radiant shape
        if (!radiantShapes.hasOwnProperty(id)) {
          var randomstate = Math.floor(Math.random() * 3); //randomly choose a color state for the radiant shape to start (if not when you spawn in cavern, all shapes same color)
          var randomtype = Math.floor(Math.random() * 2) + 1; //choose animation color type (1 or 2)
          if (randomtype == 1) {
            if (randomstate == 0) {
              radiantShapes[id] = {
                red: 255,
                blue: 0,
                green: 0,
                rgbstate: 1,
                radtype: randomtype,
              }; //keep track of radiant shape colors (done in client code)
            } else if (randomstate == 1) {
              radiantShapes[id] = {
                red: 199,
                blue: 0,
                green: 150,
                rgbstate: 2,
                radtype: randomtype,
              };
            } else if (randomstate == 2) {
              radiantShapes[id] = {
                red: -1,
                blue: 200,
                green: 0,
                rgbstate: 3,
                radtype: randomtype,
              };
            }
          } else {
            if (randomstate == 0) {
              radiantShapes[id] = {
                red: 118,
                blue: 168,
                green: 151,
                rgbstate: 1,
                radtype: randomtype,
              };
            } else if (randomstate == 1) {
              radiantShapes[id] = {
                red: 209,
                blue: 230,
                green: 222,
                rgbstate: 2,
                radtype: randomtype,
              };
            } else if (randomstate == 2) {
              radiantShapes[id] = {
                red: 234,
                blue: 240,
                green: 180,
                rgbstate: 3,
                radtype: randomtype,
              };
            }
          }
        }
        object.red = radiantShapes[id].red;
        object.blue = radiantShapes[id].blue;
        object.green = radiantShapes[id].green;
      }
      if (object.hasOwnProperty("red")) {
        //calculate color of spikes, which would be 20 higher than actual rgb value
        if (object.red + 150 <= 255) {
          var spikeRed = object.red + 150;
        } else {
          var spikeRed = 255;
        }
        if (object.blue + 150 <= 255) {
          var spikeBlue = object.blue + 150;
        } else {
          var spikeBlue = 255;
        }
        if (object.green + 150 <= 255) {
          var spikeGreen = object.green + 150;
        } else {
          var spikeGreen = 255;
        }
        if (object.radtier == 3) {
          //for high rarity radiant shapes, draw spikes
          ctx.rotate((extraSpikeRotate * Math.PI) / 180);
          ctx.fillStyle =
            "rgba(" +
            spikeRed +
            ", " +
            spikeGreen +
            ", " +
            spikeBlue +
            ", 0.7)";
          ctx.strokeStyle =
            "rgba(" +
            spikeRed +
            ", " +
            spikeGreen +
            ", " +
            spikeBlue +
            ", 0.3)";
          var numberOfSpikes = 6;
          var outerRadius =
            ((object.width * radiantAuraSize * 3) / clientFovMultiplier) *
            0.75;
          var innerRadius = (object.width / clientFovMultiplier) * 0.75;

          var rot = (Math.PI / 2) * 3;
          var x = 0;
          var y = 0;

          ctx.beginPath();
          ctx.moveTo(0, 0 - outerRadius);
          for (i = 0; i < numberOfSpikes; i++) {
            x = 0 + Math.cos(rot) * outerRadius;
            y = 0 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
            x = 0 + Math.cos(rot) * innerRadius;
            y = 0 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
          }
          ctx.lineTo(0, 0 - outerRadius);
          ctx.closePath();
          ctx.lineWidth = 3 / clientFovMultiplier;
          ctx.fill();
          ctx.stroke();
          ctx.rotate((-extraSpikeRotate * Math.PI) / 180);
        } else if (object.radtier == 4) {
          //for high rarity radiant shapes, draw spikes
          ctx.rotate((extraSpikeRotate1 * Math.PI) / 180);
          ctx.fillStyle =
            "rgba(" +
            spikeRed +
            ", " +
            spikeGreen +
            ", " +
            spikeBlue +
            ", 0.7)";
          ctx.strokeStyle =
            "rgba(" +
            spikeRed +
            ", " +
            spikeGreen +
            ", " +
            spikeBlue +
            ", 0.3)";
          var numberOfSpikes = 3;
          var outerRadius =
            (object.width * radiantAuraSize * 3) / clientFovMultiplier;
          var innerRadius = (object.width / clientFovMultiplier) * 0.5;
          var rot = (Math.PI / 2) * 3;
          var x = 0;
          var y = 0;
          ctx.beginPath();
          ctx.moveTo(0, 0 - outerRadius);
          for (i = 0; i < numberOfSpikes; i++) {
            x = 0 + Math.cos(rot) * outerRadius;
            y = 0 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
            x = 0 + Math.cos(rot) * innerRadius;
            y = 0 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
          }
          ctx.lineTo(0, 0 - outerRadius);
          ctx.closePath();
          ctx.lineWidth = 3 / clientFovMultiplier;
          ctx.fill();
          ctx.stroke();
          ctx.rotate((-extraSpikeRotate1 * Math.PI) / 180);
          ctx.rotate((extraSpikeRotate2 * Math.PI) / 180);
          var numberOfSpikes = 6;
          var outerRadius =
            ((object.width * radiantAuraSize * 3) / clientFovMultiplier) *
            0.5;
          var innerRadius = (object.width / clientFovMultiplier) * 0.5;
          var rot = (Math.PI / 2) * 3;
          var x = 0;
          var y = 0;
          ctx.beginPath();
          ctx.moveTo(0, 0 - outerRadius);
          for (i = 0; i < numberOfSpikes; i++) {
            x = 0 + Math.cos(rot) * outerRadius;
            y = 0 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
            x = 0 + Math.cos(rot) * innerRadius;
            y = 0 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
          }
          ctx.lineTo(0, 0 - outerRadius);
          ctx.closePath();
          ctx.lineWidth = 3 / clientFovMultiplier;
          ctx.fill();
          ctx.stroke();
          ctx.rotate((-extraSpikeRotate2 * Math.PI) / 180);
        } else if (object.radtier == 5) {
          //for high rarity radiant shapes, draw spikes
          ctx.rotate((extraSpikeRotate1 * Math.PI) / 180);
          ctx.fillStyle =
            "rgba(" +
            spikeRed +
            ", " +
            spikeGreen +
            ", " +
            spikeBlue +
            ", 0.7)";
          ctx.strokeStyle =
            "rgba(" +
            spikeRed +
            ", " +
            spikeGreen +
            ", " +
            spikeBlue +
            ", 0.3)";
          var numberOfSpikes = 3;
          var outerRadius =
            ((object.width * radiantAuraSize * 3) / clientFovMultiplier) *
            1.5;
          var innerRadius = (object.width / clientFovMultiplier) * 0.5;
          var rot = (Math.PI / 2) * 3;
          var x = 0;
          var y = 0;
          ctx.beginPath();
          ctx.moveTo(0, 0 - outerRadius);
          for (i = 0; i < numberOfSpikes; i++) {
            x = 0 + Math.cos(rot) * outerRadius;
            y = 0 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
            x = 0 + Math.cos(rot) * innerRadius;
            y = 0 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
          }
          ctx.lineTo(0, 0 - outerRadius);
          ctx.closePath();
          ctx.lineWidth = 3 / clientFovMultiplier;
          ctx.fill();
          ctx.stroke();
          ctx.rotate((-extraSpikeRotate1 * Math.PI) / 180);
          ctx.rotate((extraSpikeRotate2 * Math.PI) / 180);
          var numberOfSpikes = 3;
          var outerRadius =
            ((object.width * radiantAuraSize * 3) / clientFovMultiplier) *
            0.5;
          var innerRadius = (object.width / clientFovMultiplier) * 0.5;
          var rot = (Math.PI / 2) * 3;
          var x = 0;
          var y = 0;
          ctx.beginPath();
          ctx.moveTo(0, 0 - outerRadius);
          for (i = 0; i < numberOfSpikes; i++) {
            x = 0 + Math.cos(rot) * outerRadius;
            y = 0 + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
            x = 0 + Math.cos(rot) * innerRadius;
            y = 0 + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += Math.PI / numberOfSpikes;
          }
          ctx.lineTo(0, 0 - outerRadius);
          ctx.closePath();
          ctx.lineWidth = 3 / clientFovMultiplier;
          ctx.fill();
          ctx.stroke();
          ctx.rotate((-extraSpikeRotate2 * Math.PI) / 180);
        }
        //if shape is radiant
        //draw aura

        //old code where aura was a gradient
        /*
            const gradient = ctx.createRadialGradient(0, 0, object.width/clientFovMultiplier, 0, 0, object.width/clientFovMultiplier*radiantAuraSize);
            gradient.addColorStop(0, 'rgba(' + object.red + ', ' + object.green + ', ' + object.blue + ', 0.3)');
            gradient.addColorStop(0.5, 'rgba(' + object.red + ', ' + object.green + ', ' + object.blue + ', 0.1)');
            gradient.addColorStop(1, 'rgba(' + object.red + ', ' + object.green + ', ' + object.blue + ', 0.0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            */

        //old code where aura have shape
        ctx.fillStyle =
          "rgba(" +
          object.red +
          ", " +
          object.green +
          ", " +
          object.blue +
          ", 0.3)";
        ctx.strokeStyle =
          "rgba(" +
          object.red +
          ", " +
          object.green +
          ", " +
          object.blue +
          ", 0.3)";
        ctx.lineWidth = 3 / clientFovMultiplier;
        ctx.beginPath();

        var shapeaurasize = object.radtier;
        if (shapeaurasize > 3) {
          shapeaurasize = 3; //prevent huge auras
        }
        ctx.moveTo(
          0 +
            ((object.width * radiantAuraSize * shapeaurasize) /
              clientFovMultiplier) *
              Math.cos(0),
          0 +
            ((object.width * radiantAuraSize * shapeaurasize) /
              clientFovMultiplier) *
              Math.sin(0)
        );
        for (var i = 1; i <= object.sides + 1; i += 1) {
          ctx.lineTo(
            0 +
              ((object.width * radiantAuraSize * shapeaurasize) /
                clientFovMultiplier) *
                Math.cos((i * 2 * Math.PI) / object.sides),
            0 +
              ((object.width * radiantAuraSize * shapeaurasize) /
                clientFovMultiplier) *
                Math.sin((i * 2 * Math.PI) / object.sides)
          );
        }

        //ctx.arc(0, 0, object.width/clientFovMultiplier*radiantAuraSize, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        var shadeFactor = 3 / 4; //smaller the value, darker the shade
        ctx.strokeStyle =
          "rgb(" +
          object.red * shadeFactor +
          ", " +
          object.green * shadeFactor +
          ", " +
          object.blue * shadeFactor +
          ")";
        ctx.fillStyle =
          "rgb(" +
          object.red +
          ", " +
          object.green +
          ", " +
          object.blue +
          ")";
        if (object.hit > 0) {
          //if shape is hit
          ctx.strokeStyle =
            "rgb(" +
            (object.red * shadeFactor + 20) +
            ", " +
            (object.green * shadeFactor + 20) +
            ", " +
            (object.blue * shadeFactor + 20) +
            ")";
          ctx.fillStyle =
            "rgb(" +
            (object.red + 20) +
            ", " +
            (object.green + 20) +
            ", " +
            (object.blue + 20) +
            ")";
        }

        //choose whether a particle would spawn
        //particle spawn chance based on number of sides the shape has, so square has less particles
        if (spawnradparticle == "yes"){
          var chooseValue = 20 - object.sides * 2; //lower the number means more particles spawned
          if (chooseValue < 5) {
            //5 refers to mimimum particle spawn chance
            chooseValue = 5;
          }
          var choosing = Math.floor(Math.random() * chooseValue); //choose if particle spawn
          if (choosing == 1) {
            //spawn a particle
            var angleDegrees = Math.floor(Math.random() * 360); //choose angle in degrees
            var angleRadians = (angleDegrees * Math.PI) / 180; //convert to radians
            var randomDistFromCenter =
              Math.floor(Math.random() * object.width * 2) - object.width;
            radparticles[particleID] = {
              angle: angleRadians,
              x: object.x + randomDistFromCenter * Math.cos(angleRadians),
              y: object.y + randomDistFromCenter * Math.sin(angleRadians),
              width: 5,
              height: 5,
              speed: 1,
              timer: 50,
              maxtimer: 50,
              color:
                "rgba(" +
                object.red +
                "," +
                object.green +
                "," +
                object.blue +
                ",.5)",
              outline:
                "rgba(" +
                (object.red* shadeFactor + 20) +
                "," +
                (object.green* shadeFactor + 20) +
                "," +
                (object.blue* shadeFactor + 20) +
                ",.5)",
              type: "particle",
            };
            particleID++;
          }
        }
      } else {
        //if not radiant
        //get shape colors in client code based on theme
        ctx.fillStyle = shapecolors[object.sides][colortheme].color;
        ctx.strokeStyle = shapecolors[object.sides][colortheme].outline;
        if (object.hit > 0) {
          //if shape is hit
          ctx.fillStyle = shapecolors[object.sides][colortheme].hitcolor;
          ctx.strokeStyle =
            shapecolors[object.sides][colortheme].hitoutline;
        }
      }
      ctx.lineJoin = "round"; //make corners of shape round
      if (object.sides == "star") {
        //draw a star

        var numberOfSpikes = 5;
        var outerRadius = object.width / clientFovMultiplier;
        var innerRadius = (object.width / clientFovMultiplier / 3) * 2;

        var rot = (Math.PI / 2) * 3;
        var x = 0;
        var y = 0;

        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.lineWidth = 4 / clientFovMultiplier;
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.lineWidth = 4 / clientFovMultiplier;
        ctx.beginPath();
        ctx.moveTo(
          0 + (object.width / clientFovMultiplier) * Math.cos(0),
          0 + (object.width / clientFovMultiplier) * Math.sin(0)
        );
        for (var i = 1; i <= object.sides + 1; i += 1) {
          ctx.lineTo(
            0 +
              (object.width / clientFovMultiplier) *
                Math.cos((i * 2 * Math.PI) / object.sides),
            0 +
              (object.width / clientFovMultiplier) *
                Math.sin((i * 2 * Math.PI) / object.sides)
          );
        }
        ctx.fill();
        ctx.stroke();
      }
      ctx.lineJoin = "miter"; //change back to default
      ctx.restore(); //must restore to reset angle rotation so health bar wont be rotated sideways
      //draw shape's health bar
      if (object.health < object.maxhealth) {
        //draw health bar background
        var w = (object.width / clientFovMultiplier) * 2;
        var h = 7 / clientFovMultiplier;
        var r = h / 2;
        var x = drawingX - object.width / clientFovMultiplier;
        var y = drawingY + object.width / clientFovMultiplier + 10;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2.5 / clientFovMultiplier;//determines with of black area
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //draw health bar
        if (object.health > 0) {
          //dont draw health bar if negative health
          w = (w / object.maxhealth) * object.health;
          if (r * 2 > w) {
            //prevent weird shape when radius more than width
            r = w / 2;
            y += (h - w) / 2; //move health bar so that it is centered vertically in black bar
            h = w;
          }
          if (object.hasOwnProperty("red")) {
            //if shape is radiant
            ctx.fillStyle =
              "rgb(" +
              object.red +
              ", " +
              object.green +
              ", " +
              object.blue +
              ")";
          } else {
            ctx.fillStyle = shapecolors[object.sides][colortheme].color;
            if (object.sides==10||object.sides==11||object.sides==14){//these shapes are very dark, cannot see health bar
              ctx.fillStyle = shapecolors[12][colortheme].color;//use ddecagon's grey color for health bar
            }
          }
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = 1.0; //reset opacity
      }
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "spawner") {
      //spawner in sanctuary
      ctx.save();
      ctx.translate(drawingX, drawingY);
      ctx.rotate(object.angle);
      ctx.lineJoin = "round"; //make corners of shape round

      //actual body
      ctx.fillStyle = object.baseColor;
      ctx.strokeStyle = object.baseOutline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.basewidth6 / clientFovMultiplier) * Math.cos(0),
        0 + (object.basewidth6 / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.basewidth6 / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.basewidth6 / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.width / clientFovMultiplier) * Math.cos(0),
        0 + (object.width / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.width / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.width / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.baseColor;
      ctx.strokeStyle = object.baseOutline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.basewidth4 / clientFovMultiplier) * Math.cos(0),
        0 + (object.basewidth4 / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.basewidth4 / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.basewidth4 / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.lineWidth = 4 / clientFovMultiplier;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.basewidth5 / clientFovMultiplier) * Math.cos(0),
        0 + (object.basewidth5 / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.basewidth5 / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.basewidth5 / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.baseColor;
      ctx.strokeStyle = object.baseOutline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.basewidth1 / clientFovMultiplier) * Math.cos(0),
        0 + (object.basewidth1 / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.basewidth1 / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.basewidth1 / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.barrelColor;
      ctx.strokeStyle = object.barrelOutline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.basewidth2 / clientFovMultiplier) * Math.cos(0),
        0 + (object.basewidth2 / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.basewidth2 / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.basewidth2 / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.lineWidth = 4 / clientFovMultiplier;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.basewidth3 / clientFovMultiplier) * Math.cos(0),
        0 + (object.basewidth3 / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.basewidth3 / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.basewidth3 / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      //draw barrels
      ctx.fillStyle = object.barrelColor;
      ctx.strokeStyle = object.barrelOutline;
      //trapezoid at the tip
      var barrelwidth = 140;
      var barrelheight = 28;
      //rectangle
      var barrelwidth2 = 180;
      var barrelheight2 = 28;
      //base trapezoid
      var barrelwidth3 = 140;
      var barrelheight3 = 80;
      //note that trapezoids and rectangles are drawn differently

      var barrelDistanceFromCenter = (object.width * (Math.cos(Math.PI/object.sides)));//width of middle of polygon (less than width of circle)

      function drawSancBarrel(barNum){
        var barAngle = 360/object.sides*(barNum+0.5);//half of a side, cuz barrel is in between sides
        var barrelX = Math.cos((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter+ barrelheight+ barrelheight2+ barrelheight3);//object.width * 0.9
        var barrelY = Math.sin((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter+ barrelheight+ barrelheight2+ barrelheight3);
        var barrelX2 = Math.cos((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight2 + barrelheight3); //move rectangle barrel downwards
        var barrelY2 = Math.sin((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight2 + barrelheight3);
        var barrelX3 = Math.cos((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight3); //move base trapezoid barrel downwards
        var barrelY3 = Math.sin((barAngle * Math.PI) / 180) * (barrelDistanceFromCenter + barrelheight3);
        //base trapezoid
        ctx.save();
        ctx.translate(
          barrelX3 / clientFovMultiplier,
          barrelY3 / clientFovMultiplier
        );
        ctx.rotate(((barAngle - 90) * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(
          ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
          -barrelheight3 / clientFovMultiplier
        );
        ctx.lineTo(-barrelwidth3 / clientFovMultiplier, 0);
        ctx.lineTo(barrelwidth3 / clientFovMultiplier, 0);
        ctx.lineTo(
          ((barrelwidth3 / 3) * 2) / clientFovMultiplier,
          -barrelheight3 / clientFovMultiplier
        );
        ctx.lineTo(
          ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
          -barrelheight3 / clientFovMultiplier
        );
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.restore();
        //rectangle
        ctx.save();
        ctx.translate(
          barrelX2 / clientFovMultiplier,
          barrelY2 / clientFovMultiplier
        );
        ctx.rotate(((barAngle - 90) * Math.PI) / 180);
        ctx.fillRect(
          -barrelwidth2 / 2 / clientFovMultiplier,
          -barrelheight2 / clientFovMultiplier,
          barrelwidth2 / clientFovMultiplier,
          barrelheight2 / clientFovMultiplier
        );
        if (CRTP != 'simplistic') {
        ctx.strokeRect(
          -barrelwidth2 / 2 / clientFovMultiplier,
          -barrelheight2 / clientFovMultiplier,
          barrelwidth2 / clientFovMultiplier,
          barrelheight2 / clientFovMultiplier
        );
        };
        ctx.restore();
        //trapezium at the tip
        ctx.save();
        ctx.translate(
          barrelX / clientFovMultiplier,
          barrelY / clientFovMultiplier
        );
        ctx.rotate(((barAngle - 90) * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(-barrelwidth / 2 / clientFovMultiplier, 0);
        ctx.lineTo(
          -barrelwidth / clientFovMultiplier,
          -barrelheight / clientFovMultiplier
        );
        ctx.lineTo(
          barrelwidth / clientFovMultiplier,
          -barrelheight / clientFovMultiplier
        );
        ctx.lineTo(barrelwidth / 2 / clientFovMultiplier, 0);
        ctx.lineTo(-barrelwidth / 2 / clientFovMultiplier, 0);
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.restore();
      }

      for (let i = 0; i < object.sides; i++) {
        drawSancBarrel(i);
      }
      //draw aura
      ctx.fillStyle = object.auraColor;
      ctx.lineWidth = 4 / clientFovMultiplier;
      ctx.beginPath();
      ctx.moveTo(
        0 + (object.auraWidth / clientFovMultiplier) * Math.cos(0),
        0 + (object.auraWidth / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= object.sides + 1; i += 1) {
        ctx.lineTo(
          0 +
            (object.auraWidth / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / object.sides),
          0 +
            (object.auraWidth / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / object.sides)
        );
      }
      ctx.fill();
      ctx.lineJoin = "miter"; //change back
      ctx.restore();
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "player") {
      var spawnProtectionFlashDuration = 3; //higher number indicates longer duration between flashes.
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = object.deadOpacity;
      }
      //draw players
      ctx.save(); //save so later can restore
      //translate canvas to location of player so that the player is at 0,0 coordinates, allowing rotation around the center of player's body
      ctx.translate(drawingX, drawingY);

      let objectangle = object.angle;
      if (
        id == playerstring &&
        object.autorotate != "yes" &&
        object.fastautorotate != "yes"
      ) {
        //if this player is the tank that the client is controlling
        objectangle = clientAngle;
        ctx.rotate(clientAngle); //instead of using client's actual tank angle, use the angle to the mouse. this reduces lag effect
      } else {
        ctx.rotate(object.angle);
      }

      let spawnProtect = "no";
      if (object.spawnProtection < object.spawnProtectionDuration && object.spawnProtection % spawnProtectionFlashDuration == 0) {
        spawnProtect = "yes";
      }

      let playercolor = "undefined";
      let playeroutline = "undefined";
      let eternal = "no";
      if (object.team == "none") {
        if (id == playerstring) {
          playercolor = bodyColors.blue.col;
          playeroutline = bodyColors.blue.outline;
          if (object.hit > 0 || spawnProtect == "yes") {
            playercolor = bodyColors.blue.hitCol
            playeroutline = bodyColors.blue.hitOutline
          }
        }
        else{
          playercolor = bodyColors.red.col;
          playeroutline = bodyColors.red.outline;
          if (object.hit > 0 || spawnProtect == "yes") {
            playercolor = bodyColors.red.hitCol
            playeroutline = bodyColors.red.hitOutline
          }
        }
      } else if (object.team == "blue" || object.team == "green" || object.team == "red" || object.team == "purple" || object.team == "eternal" || object.team == "magenta" || object.team == "fallen" || object.team == "celestial") {
          playercolor = bodyColors[object.team].col;
          playeroutline = bodyColors[object.team].outline;
          if (object.hit > 0 || spawnProtect == "yes") {
            playercolor = bodyColors[object.team].hitCol;
            playeroutline = bodyColors[object.team].hitOutline;
          }
          if (object.team == "eternal"){
            eternal = "yes";
          }
      }
      if (object.developer == "yes") {
        //if a developer
        playercolor = object.color;
        playeroutline = object.outline;
      }

      //store player color for upgrade buttons
      if (id == playerstring){
        playerBodyCol = playercolor;
        playerBodyOutline = playeroutline;
      }

      drawPlayer(ctx, object, clientFovMultiplier, spawnProtect, playercolor, playeroutline, eternal, objectangle)//draw barrel and body
      ctx.restore(); //restore coordinates to saved

      //write player name if not the client's tank
      if (id != playerstring) {
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 8 / clientFovMultiplier;
        ctx.font = "700 " + 35 / clientFovMultiplier + "px Roboto";
        ctx.textAlign = "center";
        ctx.miterLimit = 2;//prevent text spikes, alternative to linejoin round
        //ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
        //note: if you stroke then fill, the words will be thicker and nicer. If you fill then stroke, the words are thinner.
        if (object.name == "unnamed"){
          //this guy is unnamed, add a 3 digit identifier
          let thisID = id.substr(id.length - 3);//last 3 digits of ID
          object.name += (" #" + thisID);
        }
        ctx.strokeText(
          object.name,
          drawingX,
          drawingY - (object.width + 40) / clientFovMultiplier
        );
        ctx.fillText(
          object.name,
          drawingX,
          drawingY - (object.width + 40) / clientFovMultiplier
        );
        //write player level
        ctx.font = "700 " + 18 / clientFovMultiplier + "px Roboto";
        ctx.strokeText(
          "Lvl " +
            object.level +
            " " +
            object.tankType +
            "-" +
            object.bodyType,
          drawingX,
          drawingY - (object.width + 10) / clientFovMultiplier
        );
        ctx.fillText(
          "Lvl " +
            object.level +
            " " +
            object.tankType +
            "-" +
            object.bodyType,
          drawingX,
          drawingY - (object.width + 10) / clientFovMultiplier
        );
        ctx.lineJoin = "miter"; //change it back
      }
      //draw player health
      if (object.health < object.maxhealth) {
        //draw health bar background
        var w = (object.width / clientFovMultiplier) * 2;
        var h = 7 / clientFovMultiplier;
        var r = h / 2;
        var x = drawingX - object.width / clientFovMultiplier;
        var y = drawingY + object.width / clientFovMultiplier + 10;
        ctx.fillStyle = "black";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2.5 / clientFovMultiplier;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        //draw health bar
        if (object.health > 0) {
          w = (w / object.maxhealth) * object.health;
          //if (id == playerstring) {
            //if this player is the tank that the client is controlling
            if (object.team == "none") {
              if (id == playerstring) {
                ctx.fillStyle = bodyColors.blue.col;
              }
              else{
                ctx.fillStyle = bodyColors.red.col;
              }
            } else if (object.team == "blue" || object.team == "red" || object.team == "purple" || object.team == "green" || object.team == "eternal" || object.team == "magenta" || object.team == "fallen" || object.team == "celestial") {
              ctx.fillStyle = bodyColors[object.team].col;
            }
          if (r * 2 > w) {
            //prevent weird shape when radius more than width
            r = w / 2;
            y += (h - w) / 2; //move health bar so that it is centered vertically in black bar
            h = w;
          }
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.arcTo(x + w, y, x + w, y + h, r);
          ctx.arcTo(x + w, y + h, x, y + h, r);
          ctx.arcTo(x, y + h, x, y, r);
          ctx.arcTo(x, y, x + w, y, r);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      //write chats
      if (chatstate) {
//write chats
      if (id != playerstring) {
        var firstChatY = object.width / clientFovMultiplier /5*4 + 55 / clientFovMultiplier;
      }
      else{
        var firstChatY = object.width / clientFovMultiplier /5*4;//chat nearer to player body if no need to display name
      }
      ctx.font = "700 25px Roboto";
      ctx.textAlign = "center";
      ctx.lineJoin = "round"; //prevent spikes above the capital letter "M"
      var xpadding = 15;
      var ypadding = 10;
      var lineheight = 30;

      var timeWhenChatRemove = 200;//when change on server code, remember to change here too

      if (!(chatlist[id])){//used for animating chat positions
        chatlist[id] = JSON.parse(JSON.stringify(object.chats));
      }
      else{
        let tempArray = [];
        let messages = {};//prevent bug when multiple chats have same message
        object.chats.forEach(function (item, index) {
          let occurence = 0;//prevent bug when multiple chats have same message
          let foundit = 0;
          for (var i = 0; i < chatlist[id].length; i++) {//check if oldchats hae this message, to preserve the position for animation
            if (chatlist[id][i].chat == item.chat){
              if (messages[item.chat]){//saw a chat with the exact same message before!
                if (messages[item.chat] <= occurence){//this is a different chat
                  let k = JSON.parse(JSON.stringify(chatlist[id][i]));
                  k.time = item.time;
                  tempArray.push(k);
                  messages[chatlist[id][i].chat]++;
                  foundit = 1;
                  break
                }
                else{//this is the same chat that you saw before, continue hunting for the chat
                  occurence++;
                }
              }
              else{
                let k = JSON.parse(JSON.stringify(chatlist[id][i]));
                k.time = item.time;
                tempArray.push(k);
                messages[chatlist[id][i].chat] = 1;
                foundit = 1;
                break
              }
            }
          }
          if (foundit == 0){//new chat message
            let k = JSON.parse(JSON.stringify(item));
            k.opacity = 0;
            tempArray.push(k);
          }
        });
        chatlist[id] = tempArray;
      }

      object.chats.slice().reverse().forEach((chatObj, index) => {//slice and reverse to loop though array backwards (so older messages are above)
        ctx.fillStyle = "rgba(69,69,69,.7)";

        var longestLine = 0;

        //multiline chat
        const wrapText = function(ctx, text, x, y, maxWidth, lineHeight) {
          // First, start by splitting all of our text into words, but splitting it into an array split by spaces
          let words = text.split(' ');
          let line = ''; // This will store the text of the current line
          let testLine = ''; // This will store the text when we add a word, to test if it's too long
          let lineArray = []; // This is an array of lines, which the function will return

          // Lets iterate over each word
          for(var n = 0; n < words.length; n++) {
              // Create a test line, and measure it..
              testLine += `${words[n]} `;
              let metrics = ctx.measureText(testLine);
              let testWidth = metrics.width;
              // If the width of this test line is more than the max width
              if (testWidth > maxWidth && n > 0) {
                  // Then the line is finished, push the current line into "lineArray"
                  line = line.slice(0, -1);//remove space at the end of the line
                  lineArray.push([line, x, y]);
                  let thislinewidth = ctx.measureText(line).width;
                  if (thislinewidth > longestLine){
                    longestLine = thislinewidth;
                  }
                  // Increase the line height, so a new line is started
                  y += lineHeight;
                  // Update line and test line to use this word as the first word on the next line
                  line = `${words[n]} `;
                  testLine = `${words[n]} `;
              }
              else {
                  // If the test line is still less than the max width, then add the word to the current line
                  line += `${words[n]} `;
              }
              // If we never reach the full max width, then there is only one line.. so push it into the lineArray so we return something
              if(n === words.length - 1) {
                  line = line.slice(0, -1);//remove space at the end of the line
                  lineArray.push([line, x, y]);
                  let thislinewidth = ctx.measureText(line).width;
                  if (thislinewidth > longestLine){
                    longestLine = thislinewidth;
                  }
              }
          }
          // Return the line array
          return lineArray;
        }

        let wrappedText = wrapText(ctx, chatObj.chat, drawingX, drawingY - firstChatY, 900, lineheight);//split message into multiline text
        //draw rect
        var w = longestLine + xpadding * 2;
        var h = lineheight * wrappedText.length + ypadding * 2;
        if (wrappedText.length == 1){//remove spacing between text for single-line text
          h = 25 + ypadding * 2;
        }
        var r = 15;
        var x = drawingX - longestLine / 2 - xpadding;
        var y = drawingY - firstChatY - ypadding - h - 20;//the actual y location of this chat message
        //aniamte towards this y position
        //remember that the loop is reversed, so indexes are reversed here too
        let thischat = chatlist[id][chatlist[id].length - 1 - index];
        let diffpos = 0;
        if (!thischat.y){
          thischat.y = y;
        }
        else{
          if (y > thischat.y){
            thischat.y+=(y - thischat.y)/2*deltaTime;
            if (y < thischat.y){
              thischat.y = y;
            }
          }
          else if (y < thischat.y){
            thischat.y-=(thischat.y - y)/2*deltaTime;
            if (y > thischat.y){
              thischat.y = y;
            }
          }
          if (Math.abs(y - thischat.y)<0.1){//small difference between current position and actual position
            thischat.y = y;
          }
          diffpos = y - thischat.y;
          y = thischat.y;
        }
        if (thischat.opacity < 1){
          thischat.opacity+=0.1;
        }
        ctx.globalAlpha = thischat.opacity;
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        ctx.fill();
        if (index == 0){
          //if this is first chat message, draw triangle
          let trianglewidth = 20;
          let triangleheight = 10;
          ctx.beginPath();
          ctx.moveTo(x + w/2 - trianglewidth/2, y + h);
          ctx.lineTo(x + w/2 + trianglewidth/2, y + h);
          ctx.lineTo(x + w/2, y + h + triangleheight);
          ctx.fill();
        }
        //write words
        ctx.fillStyle = "white";
        wrappedText.forEach(function(item) {
            ctx.fillText(item[0], item[1], item[2]-h-diffpos);//write text
        })
        ctx.globalAlpha = 1.0;
        firstChatY += (h + 10); //height of chat plus space between chats
      });
      ctx.lineJoin = "miter"; //change it back
      }
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = 1.0; //reset opacity
      }
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "portal") {
      //draw the aura below the portal
      var auraSpeed = 75; //higher number means slower speed
      var auraWidth = 4; //reative to portal size
      var portalAuraSize = object.timer % auraSpeed;
      var portalwidth = portalwidths[id]; //use this for portal width. it keeps track size changes when players touch portal
      var portalsizeincrease = portalwidths[id] / object.width; //increase in width when someone touch it (needed for the spikes)
      //first aura
      var opacityCalculation =
        1 - ((auraWidth / auraSpeed) * portalAuraSize) / auraWidth; //goes from 0 to 0.3
      if (opacityCalculation > 0.3) {
        //max opacity for portal aura
        opacityCalculation = 0.3;
      }
      if (object.hasOwnProperty("red")) {
        //if portal is radiant
        ctx.fillStyle =
          "rgba(" +
          object.red +
          ", " +
          object.green +
          ", " +
          object.blue +
          "," +
          opacityCalculation +
          ")";
      } else {
        ctx.fillStyle =
          "rgba(" + object.color + "," + opacityCalculation + ")";
      }
      ctx.beginPath();
      ctx.arc(
        drawingX,
        drawingY,
        (portalwidth * ((auraWidth / auraSpeed) * portalAuraSize)) /
          clientFovMultiplier,
        0,
        2 * Math.PI
      );
      ctx.fill();
      //second smaller aura
      portalAuraSize = (object.timer - auraSpeed / 2) % auraSpeed;
      if (portalAuraSize > 0) {
        var opacityCalculation =
          1 - ((auraWidth / auraSpeed) * portalAuraSize) / auraWidth;
        if (opacityCalculation > 0.3) {
          //max opacity for portal aura
          opacityCalculation = 0.3;
        }
        if (object.hasOwnProperty("red")) {
          //if portal is radiant
          ctx.fillStyle =
            "rgba(" +
            object.red +
            ", " +
            object.green +
            ", " +
            object.blue +
            "," +
            opacityCalculation +
            ")";
        } else {
          ctx.fillStyle =
            "rgba(" + object.color + "," + opacityCalculation + ")";
        }
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          (portalwidth * ((auraWidth / auraSpeed) * portalAuraSize)) /
            clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = object.deadOpacity;
      }
      //drawing portals
      //create gradient
      //const gradient = ctx.createRadialGradient(drawingX, drawingY, object.width/3/clientFovMultiplier, drawingX, drawingY, object.width/clientFovMultiplier);

      // Add two color stops
      //caluclate color of outline of portal based on time until it die
      var portalColorCalc = object.timer / object.maxtimer;
      var portalColor = 255 - portalColorCalc * 255;
      var portalRGB =
        "rgb(" +
        portalColor +
        "," +
        portalColor +
        "," +
        portalColor +
        ")";
      var portalRGBoutline =
        "rgb(" +
        (portalColor - 20) +
        "," +
        (portalColor - 20) +
        "," +
        (portalColor - 20) +
        ")";
      if (object.ruptured == 1) {
        //portal is ruptured!
        //draw the stars
        ctx.save(); //save so later can restore
        ctx.translate(drawingX, drawingY);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "lightgrey";
        ctx.lineWidth = 3 / clientFovMultiplier;
        ctx.lineJoin = "round";
        //first star: 3 spikes
        ctx.rotate((extraSpikeRotate * Math.PI) / 180);
        var numberOfSpikes = 3;
        var outerRadius =
          ((object.width * 3) / clientFovMultiplier) * portalsizeincrease;
        var innerRadius =
          (object.width / 3 / clientFovMultiplier) * portalsizeincrease;
        var rot = (Math.PI / 2) * 3;
        var x = 0;
        var y = 0;
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.rotate((-extraSpikeRotate * Math.PI) / 180);
        //second star: 6 spikes in opposite direction
        ctx.rotate(((360 - extraSpikeRotate) * 2 * Math.PI) / 180);
        var numberOfSpikes = 6;
        var outerRadius =
          ((object.width * 1.5) / clientFovMultiplier) *
          portalsizeincrease;
        var innerRadius =
          (object.width / 1.2 / clientFovMultiplier) * portalsizeincrease;
        var rot = (Math.PI / 2) * 3;
        var x = 0;
        var y = 0;
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.rotate((-(360 - extraSpikeRotate) * 2 * Math.PI) / 180);
        //third star: 6 spikes
        ctx.rotate((extraSpikeRotate * 2 * Math.PI) / 180);
        var numberOfSpikes = 6;
        var outerRadius =
          ((object.width * 1.5) / clientFovMultiplier) *
          portalsizeincrease;
        var innerRadius =
          (object.width / 1.2 / clientFovMultiplier) * portalsizeincrease;
        var rot = (Math.PI / 2) * 3;
        var x = 0;
        var y = 0;
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.rotate((-extraSpikeRotate * 2 * Math.PI) / 180);
        //fourth star: 6 dark spikes in opposite direction
        ctx.fillStyle = portalRGB;
        ctx.strokeStyle = portalRGBoutline;
        ctx.rotate(((360 - extraSpikeRotate) * 3 * Math.PI) / 180); //times 2 to make it faster
        var numberOfSpikes = 6;
        var outerRadius =
          ((object.width * 1.5) / clientFovMultiplier) *
          portalsizeincrease;
        var innerRadius =
          (object.width / 2 / clientFovMultiplier) * portalsizeincrease;
        var rot = (Math.PI / 2) * 3;
        var x = 0;
        var y = 0;
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.rotate((-(360 - extraSpikeRotate) * 3 * Math.PI) / 180);
        //fifth star: tiny black spikes
        ctx.rotate((extraSpikeRotate * 3 * Math.PI) / 180); //times 2 to make it faster
        var numberOfSpikes = 6;
        var outerRadius =
          ((object.width * 1.25) / clientFovMultiplier) *
          portalsizeincrease;
        var innerRadius =
          (object.width / 4 / clientFovMultiplier) * portalsizeincrease;
        var rot = (Math.PI / 2) * 3;
        var x = 0;
        var y = 0;
        ctx.beginPath();
        ctx.moveTo(0, 0 - outerRadius);
        for (i = 0; i < numberOfSpikes; i++) {
          x = 0 + Math.cos(rot) * outerRadius;
          y = 0 + Math.sin(rot) * outerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
          x = 0 + Math.cos(rot) * innerRadius;
          y = 0 + Math.sin(rot) * innerRadius;
          ctx.lineTo(x, y);
          rot += Math.PI / numberOfSpikes;
        }
        ctx.lineTo(0, 0 - outerRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.rotate((-extraSpikeRotate * 3 * Math.PI) / 180);
        ctx.restore();
        ctx.lineJoin = "miter";
      }
      ctx.fillStyle = portalRGB;
      ctx.strokeStyle = portalRGBoutline;
      ctx.lineWidth = 3 / clientFovMultiplier;
      ctx.beginPath();
      ctx.arc(
        drawingX,
        drawingY,
        portalwidth / clientFovMultiplier,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
      if (object.hasOwnProperty("deadOpacity")) {
        //if this is an animation of a dead object
        ctx.globalAlpha = 1.0; //reset opacity
      }

      //spawn particles
      var choosing = Math.floor(Math.random() * 3); //choose if particle spawn. Lower number means more particles
      if (choosing == 1) {
        var angleDegrees = Math.floor(Math.random() * 360); //choose angle in degrees
        var angleRadians = (angleDegrees * Math.PI) / 180; //convert to radians
        portalparticles[particleID] = {
          angle: angleRadians,
          x: object.x,
          y: object.y,
          width: 50,
          height: 50,
          speed: 10,
          timer: 30,
          maxtimer: 15, //difference between timer and maxtimer is the opacity change of the particle. Larger difference means more or less transparent
          color: "white",
          outline: "lightgrey",
          type: "particle",
        };
        particleID++;
      }

      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "Fixedportal") {
      //drawing rectangular fixed portals, e.g. the portal at top left corner of dune
      ctx.save(); //save so later can restore
      ctx.translate(drawingX, drawingY); //translate so white portal is at 0,0 coordinates so can rotate around center of portal
      ctx.rotate((object.angleDegrees * Math.PI) / 180); //rotate portal
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.fillRect(
        -object.width / 2 / clientFovMultiplier,
        -object.height / 2 / clientFovMultiplier,
        object.width / clientFovMultiplier,
        object.height / clientFovMultiplier
      );
      ctx.strokeRect(
        -object.width / 2 / clientFovMultiplier,
        -object.height / 2 / clientFovMultiplier,
        object.width / clientFovMultiplier,
        object.height / clientFovMultiplier
      );
      ctx.globalAlpha = 0.7; //transparency
      ctx.fillStyle = object.color2;
      ctx.fillRect(
        -object.width / clientFovMultiplier,
        -object.height / clientFovMultiplier,
        (object.width * 2) / clientFovMultiplier,
        (object.height * 2) / clientFovMultiplier
      );
      ctx.strokeRect(
        -object.width / clientFovMultiplier,
        -object.height / clientFovMultiplier,
        (object.width * 2) / clientFovMultiplier,
        (object.height * 2) / clientFovMultiplier
      );
      ctx.globalAlpha = 1.0; //reset transparency
      ctx.restore(); //restore after translating
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / 2 / clientFovMultiplier,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      }
    } else if (object.type == "particle") {
      //draw particles
      if (object.timer <= 10){
        ctx.globalAlpha = object.timer / 10;
      }
      //ctx.globalAlpha = object.timer / object.maxtimer;
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.lineWidth = 3 / clientFovMultiplier;
      ctx.beginPath();
      ctx.arc(
        drawingX,
        drawingY,
        object.width / clientFovMultiplier,
        0,
        2 * Math.PI
      );
      ctx.fill();
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else if (object.type == "wall") {
      //ctx.fillStyle = "#232323";
      ctx.fillStyle = "rgba(15, 15, 15, .5)";
      ctx.fillRect(
        drawingX,
        drawingY,
        object.w / clientFovMultiplier,
        object.h / clientFovMultiplier
      );
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.strokeRect(
          drawingX,
          drawingY,
          object.w / clientFovMultiplier,
          object.h / clientFovMultiplier
        );
      }
    } else if (object.type == "gate") {
      //ctx.fillStyle = "#232323";
      ctx.save();
      ctx.translate(drawingX, drawingY);
      ctx.rotate(object.angle/180*Math.PI);
      //draw white rectangle below
      ctx.fillStyle = "rgba(255,255,255,.7)";
      ctx.strokeStyle = "white";
      //FIRST WHITE RECTANGLE
      ctx.globalAlpha = 1.0 * (endGate - gateTimer) / (endGate - 1 - startGate);//gateTimer increases from 0.5 to 9, this equation makes the opacity decrease from 1 to 0
      ctx.fillRect(
        -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
         -object.width/2/clientFovMultiplier,
        object.height / clientFovMultiplier * gateTimer,
        object.width / clientFovMultiplier
      );
      ctx.strokeRect(
        -(object.height / clientFovMultiplier * gateTimer)/2 + object.height / clientFovMultiplier/2,
         -object.width/2/clientFovMultiplier,
        object.height / clientFovMultiplier * gateTimer,
        object.width / clientFovMultiplier
      );
      ctx.globalAlpha = 1.0;
      //SECOND WHITE RECTANGLE
      let gateTimer2 = gateTimer - endGate/2;
      if (gateTimer2 < startGate){
        gateTimer2 = endGate - (startGate - gateTimer2)
      }
      ctx.globalAlpha = 1.0 * (endGate - gateTimer2) / (endGate - 1 - startGate);//gateTimer increases from 1 to 7, this equation makes the opacity decrease from 1 to 0
      ctx.fillRect(
        -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
         -object.width/2/clientFovMultiplier,
        object.height / clientFovMultiplier * gateTimer2,
        object.width / clientFovMultiplier
      );
      ctx.strokeRect(
        -(object.height / clientFovMultiplier * gateTimer2)/2 + object.height / clientFovMultiplier/2,
         -object.width/2/clientFovMultiplier,
        object.height / clientFovMultiplier * gateTimer2,
        object.width / clientFovMultiplier
      );
      ctx.globalAlpha = 1.0;
      //draw actual black gate
      ctx.fillStyle = "black";
      ctx.fillRect(0,
         -object.width/2/clientFovMultiplier,
        object.height / clientFovMultiplier,
        object.width / clientFovMultiplier
      );
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.strokeRect(0,
         -object.width/2/clientFovMultiplier,
          object.height / clientFovMultiplier,
          object.width / clientFovMultiplier
        );
      }
      ctx.restore();
      //spawn particles
      var choosing = Math.floor(Math.random() * 3); //choose if particle spawn. Lower number means more particles
      if (choosing == 1) {
        var dir = Math.floor(Math.random() * 2); //choose angle in degrees
        if (dir == 0){
          var angleRadians = (object.angle) * Math.PI / 180; //convert to radians
        }
        else{
          var angleRadians = (object.angle - 180) * Math.PI / 180;
        }
        let randX = 0;
        let randY = 0;
        //code currently does not support particles for gates that are tilted
        //i dont see a need to add that in the near future
        if (object.angle == 0 || object.angle == 180 || object.angle == 360){
          randY = Math.floor(Math.random() * object.width) - object.width/2;
        }
        else if (object.angle == 90 || object.angle == 270){
          randX = Math.floor(Math.random() * object.width) - object.width/2;
        }
        portalparticles[particleID] = {
          angle: angleRadians,
          x: object.x + randX,
          y: object.y + randY,
          width: 50,
          height: 50,
          speed: 10,
          timer: 30,
          maxtimer: 15, //difference between timer and maxtimer is the opacity change of the particle. Larger difference means more or less transparent
          color: "white",
          outline: "lightgrey",
          type: "particle",
        };
        particleID++;
      }
    } else if (object.type == "def") {
      //base defender in 2tdm
      ctx.save();
      ctx.translate(drawingX, drawingY);
      ctx.rotate(object.angle);
      ctx.lineJoin = "round"; //make corners of shape round
      ctx.lineWidth = 4 / clientFovMultiplier;

      //draw octagon base
      var octagonWidth = object.width/5*6;
      ctx.fillStyle = bodyColors.asset.col;
      ctx.strokeStyle = bodyColors.asset.outline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (octagonWidth / clientFovMultiplier) * Math.cos(0),
        0 + (octagonWidth / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= 8 + 1; i += 1) {
        ctx.lineTo(
          0 +
            (octagonWidth / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / 8),
          0 +
            (octagonWidth / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / 8)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };


      //draw barrels
      ctx.fillStyle = bodyColors.barrel.col;
      ctx.strokeStyle = bodyColors.barrel.outline;
      //trapezoid at the tip
      var barrelwidth = 70;
      var barrelheight = 20;
      //rectangle
      var barrelwidth2 = 90;
      var barrelheight2 = 20;
      //base trapezoid
      var barrelwidth3 = 70;
      var barrelheight3 = 60;
      //note that trapezoids and rectangles are drawn differently

      for (let i = 0; i < 4; i++) {//draw 4 barrels
        var barrelAngle = 360/4*i;
        var barrelX = Math.cos((barrelAngle * Math.PI) / 180) * object.width * 1.4;
        var barrelY = Math.sin((barrelAngle * Math.PI) / 180) * object.width * 1.4;
        var barrelX2 =
          Math.cos((barrelAngle * Math.PI) / 180) *
          (object.width * 1.4 - barrelheight); //move rectangle barrel downwards
        var barrelY2 =
          Math.sin((barrelAngle * Math.PI) / 180) *
          (object.width * 1.4 - barrelheight);
        var barrelX3 =
          Math.cos((barrelAngle * Math.PI) / 180) *
          (object.width * 1.4 - barrelheight - barrelheight2); //move base trapezoid barrel downwards
        var barrelY3 =
          Math.sin((barrelAngle * Math.PI) / 180) *
          (object.width * 1.4 - barrelheight - barrelheight2);
        //base trapezoid
        ctx.save();
        ctx.translate(
          barrelX3 / clientFovMultiplier,
          barrelY3 / clientFovMultiplier
        );
        ctx.rotate(((barrelAngle - 90) * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(
          ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
          -barrelheight3 / clientFovMultiplier
        );
        ctx.lineTo(-barrelwidth3 / clientFovMultiplier, 0);
        ctx.lineTo(barrelwidth3 / clientFovMultiplier, 0);
        ctx.lineTo(
          ((barrelwidth3 / 3) * 2) / clientFovMultiplier,
          -barrelheight3 / clientFovMultiplier
        );
        ctx.lineTo(
          ((-barrelwidth3 / 3) * 2) / clientFovMultiplier,
          -barrelheight3 / clientFovMultiplier
        );
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.restore();
        //rectangle
        ctx.save();
        ctx.translate(
          barrelX2 / clientFovMultiplier,
          barrelY2 / clientFovMultiplier
        );
        ctx.rotate(((barrelAngle - 90) * Math.PI) / 180);
        ctx.fillRect(
          -barrelwidth2 / 2 / clientFovMultiplier,
          -barrelheight2 / clientFovMultiplier,
          barrelwidth2 / clientFovMultiplier,
          barrelheight2 / clientFovMultiplier
        );
        if (CRTP != 'simplistic') {
        ctx.strokeRect(
          -barrelwidth2 / 2 / clientFovMultiplier,
          -barrelheight2 / clientFovMultiplier,
          barrelwidth2 / clientFovMultiplier,
          barrelheight2 / clientFovMultiplier
        );
        };
        ctx.restore();
        //trapezium at the tip
        ctx.save();
        ctx.translate(
          barrelX / clientFovMultiplier,
          barrelY / clientFovMultiplier
        );
        ctx.rotate(((barrelAngle - 90) * Math.PI) / 180);
        ctx.beginPath();
        ctx.moveTo(-barrelwidth / 2 / clientFovMultiplier, 0);
        ctx.lineTo(
          -barrelwidth / clientFovMultiplier,
          -barrelheight / clientFovMultiplier
        );
        ctx.lineTo(
          barrelwidth / clientFovMultiplier,
          -barrelheight / clientFovMultiplier
        );
        ctx.lineTo(barrelwidth / 2 / clientFovMultiplier, 0);
        ctx.lineTo(-barrelwidth / 2 / clientFovMultiplier, 0);
        ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
        ctx.restore();
      }

      //draw body
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        object.width / clientFovMultiplier,
        0,
        2 * Math.PI
      );
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      var octagonWidth = object.width/5*4;
      ctx.fillStyle = bodyColors.asset.col;
      ctx.strokeStyle = bodyColors.asset.outline;
      ctx.beginPath();
      ctx.moveTo(
        0 + (octagonWidth / clientFovMultiplier) * Math.cos(0),
        0 + (octagonWidth / clientFovMultiplier) * Math.sin(0)
      );
      for (var i = 1; i <= 8 + 1; i += 1) {
        ctx.lineTo(
          0 +
            (octagonWidth / clientFovMultiplier) *
              Math.cos((i * 2 * Math.PI) / 8),
          0 +
            (octagonWidth / clientFovMultiplier) *
              Math.sin((i * 2 * Math.PI) / 8)
        );
      }
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      ctx.fillStyle = object.color;
      ctx.strokeStyle = object.outline;
      ctx.beginPath();
      ctx.arc(
        0,
        0,
        object.width/2 / clientFovMultiplier,
        0,
        2 * Math.PI
      );
      ctx.fill();
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };

      ctx.lineJoin = "miter"; //change back
      ctx.restore();
      if (showHitBox == "yes") {
        //draw hitbox
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
          drawingX,
          drawingY,
          object.width / clientFovMultiplier,
          0,
          2 * Math.PI
        );
          if (CRTP != 'simplistic') {
          ctx.stroke();
          };
      }
    }
  };

    function newbulletbarrel(canvas, x,width,height,shootChange, fov){//shootchange is change in barrel height when shooting
    canvas.fillRect(
      (x - width / 2) / fov,
      -(height - shootChange) / fov,
      width / fov,
      (height - shootChange) / fov
    );
    if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (x - width / 2) / fov,
      -(height - shootChange) / fov,
      width / fov,
      (height - shootChange) / fov
    );
    };
  };
    function newdronebarrel(canvas, x,width,height,shootChange, fov){
    canvas.beginPath();
    canvas.moveTo(
      -width / 2 / fov +
        x / fov,
      0
    );
    canvas.lineTo(
      -width / fov +
        x / fov,
      -(height - shootChange) / fov
    );
    canvas.lineTo(
      width / fov +
        (x * 2) / fov,
      -(height - shootChange) / fov
    );
    canvas.lineTo(
      width / 2 / fov +
        (x * 2) / fov,
      0
    );
    canvas.fill();
        if (document.getElementById('theme').value != 'simplistic') {
    canvas.stroke();
        };
  };
    function newtrapbarrel(canvas, x,width,height,shootChange, fov){
    canvas.fillRect(
      (x - width / 2) / fov,
      -(height - shootChange) * 0.67 / fov,
      width / fov,
      (height - shootChange) * 0.67 / fov
    );
            if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (x - width / 2) / fov,
      -(height - shootChange) * 0.67 / fov,
      width / fov,
      (height - shootChange) * 0.67 / fov
    );
            };
    canvas.beginPath();
    canvas.moveTo(
      (x - width / 2) / fov,
      -(height - shootChange) * 0.67 / fov
    );
    canvas.lineTo(
      (x - width) / fov,
      -(height - shootChange) / fov
    );
    canvas.lineTo(
      (x + width) / fov,
      -(height - shootChange) / fov
    );
    canvas.lineTo(
      (x + width / 2) / fov,
      -(height - shootChange) * 0.67 / fov
    );
    canvas.fill();
        if (document.getElementById('theme').value != 'simplistic') {
    canvas.stroke();
        };
  };
    function newminebarrel(canvas, x,width,height,shootChange, fov){
    canvas.fillRect(
      (x - width / 2) / fov,
      -(height - shootChange) / fov,
      width / fov,
      (height - shootChange) / fov
    );
    if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (x - width / 2) / fov,
      -(height - shootChange) / fov,
      width / fov,
      (height - shootChange) / fov
    );
    };
    canvas.fillRect(
      (-width * 1.5) / 2 / fov + x / fov,
      -(height - shootChange) * 0.67 / fov,
      (width / fov) * 1.5,
      (height - shootChange) * 0.67 / fov
    );
     if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (-width * 1.5) / 2 / fov + x / fov,
      -(height - shootChange) * 0.67 / fov,
      (width / fov) * 1.5,
      (height - shootChange) * 0.67 / fov
    );
     };
  };
    function newminionbarrel(canvas, x,width,height,shootChange, fov){
    canvas.fillRect(
      (x - width / 2) / fov,
      -(height - shootChange) / fov,
      width / fov,
      (height - shootChange) / fov
    );
    if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (x - width / 2) / fov,
      -(height - shootChange) / fov,
      width / fov,
      (height - shootChange) / fov
    );
    };
    canvas.fillRect(
      (x - width * 0.75) / fov,
      -(height - shootChange) / 1.5 / fov,
      (width / fov) * 1.5,
      (height - shootChange) / 1.5 / fov
    );
    if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (x - width * 0.75) / fov,
      -(height - shootChange) / 1.5 / fov,
      (width / fov) * 1.5,
      (height - shootChange) / 1.5 / fov
    );
    };
    canvas.fillRect(
      (x - width * 0.75) / fov,
      -(height - shootChange) / fov,
      (width / fov) * 1.5,
      (height - shootChange) / 5 / fov
    );
    if (document.getElementById('theme').value != 'simplistic') {
    canvas.strokeRect(
      (x - width * 0.75) / fov,
      -(height - shootChange) / fov,
      (width / fov) * 1.5,
      (height - shootChange) / 5 /fov
    );
    };
  };

    drawobjects = newdraw;
    drawPlayer = newdrawplayer;
    drawBulletBarrel = newbulletbarrel; drawDroneBarrel = newdronebarrel; drawTrapBarrel = newtrapbarrel; drawMineBarrel = newminebarrel; drawMinionBarrel = newminionbarrel;

    let pd = false;
    const editloop = () => {
        if (player.health <= 1 && !pd && gameStart == -1) {
            if (autorespawn) {
                document.getElementById('continue').click();
                document.getElementById('play').click();
            };
            pd = true;
        } else if (player.health > 1) {
            pd = false;
        };
        requestAnimationFrame(editloop);
    };
    editloop();
})();
