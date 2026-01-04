// ==UserScript==
// @name        Karma clan Moomoo.io
// @namespace    https://greasyfork.org/es/scripts/398848-karma-clan-moomoo-io
// @version      1.0.1
// @description  Karma clan Moomoo.io【Mod Menu】 【AutoHeal 3X】【Weapons Effect's!】【New Hat-Macro】【InstaKill R】【Subscribe Button】【Hat-Acc-Hacking】【MooMod-Map】【Hotkey' V-Spike F-Trap/BoostPad H-Turret N-Windmill】【Circle's L-SpikeCircle O-TrapCircle I-WindmillCircle U-TUrretCircle】【Katana Key- numpat 1】【Musket Key- numpat 2】【Hat-Macro Z-TankGear BloodWings;C-TurretGear And ShadowWings;B-SoldierHelmet And CorruptXWings;M-SamuraiArmor And AngelWings ; Shift-BossterHat And MonkeyTail】
// @author       DamKarma
// @Download ZomMod     ZomMod For https://greasyfork.org/en/scripts/393976-zommod-the-hack-to-zombs-io-2020
        //    MooMoo.io
// @match        *://moomoo.io/*
// @match        *sandbox.moomoo.io/*
// @match        *dev.moomoo.io/*
// @grant        none
// @icon       https://i.dlpng.com/static/png/1376207_preview_preview.png
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js


// @downloadURL https://update.greasyfork.org/scripts/398848/Karma%20clan%20Moomooio.user.js
// @updateURL https://update.greasyfork.org/scripts/398848/Karma%20clan%20Moomooio.meta.js
// ==/UserScript==
// Elite Power Mod - Azerbaijan Hacker Team
// No Elite Power , Legend Power Mod - BEXTIYAR

document.getElementById('youtuberOf').innerHTML = '<a href="https://www.youtube.com/channel/UCbGfq-FhheeRoS7Tz7cp4PQ"><img src="https://anthoncode.com/wp-content/uploads/2019/07/boton-youtube-png-suscribete.png" alt="More Hack For Subscribe!" style="width:214px;height:75px;border:0;"></a>';

document.getElementById('loadingText').innerHTML = 'Loading';
document.getElementById('loadingText').style.color = 'black';

let newImg = document.createElement("img");
newImg.src = "https://vignette.wikia.nocookie.net/moom/images/c/c8/Apple-1.png/revision/latest?cb=20170920020406";
newImg.style = `position: absolute; top: 90px; left: 15px; z-index: 100000; width: 50px; height: 50px; cursor: pointer;`;
document.body.prepend(newImg);

newImg.addEventListener("click", () => {
       let w = window.open("https://www.youtube.com/channel/UCbGfq-FhheeRoS7Tz7cp4PQ", null, `height=650, width=1199, status=yes, toolbar=no, menubar=no, location=no`);
});



var sANC = 1;

var aNC = [255,255,1];

var rANC = [1,255];

var mk = document.getElementById("gameCanvas").getContext("2d");
var Laa = 0;
var Lab = 0;
var aVZ = 0;
var fBX = "<3 KatieW.";
var resForRANC = 1;

// 1920-1080

function rainbowColor(){
  if(resForRANC === 1){
    aNC = [255,0,0];
    resForRANC = 0;
  }
  if(aNC[0] === 255 && aNC[1] !== 255 && aNC[2] === 0){aNC[1] += 255/rANC[1];}
  if(aNC[0] !== 0 && aNC[1] === 255 && aNC[2] === 0){aNC[0] += 255/rANC[1]*-1;}
  if(aNC[0] === 0 && aNC[1] === 255 && aNC[2] !== 255){aNC[2] += 255/rANC[1];}
  if(aNC[0] === 0 && aNC[1] !== 0 && aNC[2] === 255){aNC[1] += 255/rANC[1]*-1;}
  if(aNC[0] !== 255 && aNC[1] === 0 && aNC[2] === 255){aNC[0] += 255/rANC[1];}
  if(aNC[0] === 255 && aNC[1] === 0 && aNC[2] !== 0){aNC[2] += 255/rANC[1]*-1;}
  if(aNC[0] < 0){aNC[0] = 0;} if(255 < aNC[0]){aNC[0] = 255;}
  if(aNC[1] < 0){aNC[1] = 0;} if(255 < aNC[1]){aNC[1] = 255;}
  if(aNC[2] < 0){aNC[2] = 0;} if(255 < aNC[2]){aNC[2] = 255;}
}

function katie(){
  if(document.getElementById("actionBarItem0")){
    if(document.getElementById("actionBarItem3").style.display === "inline-block"){
      if(fBX !== 3){
        aVZ = [[0,480],[0,360],[0,255]];
        if(sANC === 1){aNC = [255,0,0];}
        fBX = 3;
      }

      aVZ[0][0] += 1;
      if(aVZ[0][1] <= aVZ[0][0]){
        aVZ[0][0] = 0;
      }
      aVZ[1][0] += 1;
      if(aVZ[1][1] <= aVZ[1][0]){
        aVZ[1][0] = 0;
      }
      aVZ[2][0] += 1;
      if(aVZ[2][1] <= aVZ[2][0]){
        aVZ[2][0] = 0;
      }

      mk.beginPath();
      mk.lineWidth = 24;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.625)";
      mk.arc(960,540,212,0+Math.PI/(aVZ[0][1]/2)*aVZ[0][0],7/8*Math.PI+Math.PI/(aVZ[0][1]/2)*aVZ[0][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 30;
      mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*220)+","+Math.round(aNC[1]/255*220)+","+Math.round(aNC[2]/255*220)+",0.625)";
      mk.arc(960,540,185,0+Math.PI/(aVZ[1][1]/2)*aVZ[1][0],2/3*Math.PI+Math.PI/(aVZ[1][1]/2)*aVZ[1][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 45;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.5)";
      mk.arc(960,540,85,0+Math.PI/(aVZ[2][1]/2)*aVZ[2][0],1/3*Math.PI+Math.PI/(aVZ[2][1]/2)*aVZ[2][0]);
      mk.stroke();
    }
    if(document.getElementById("actionBarItem4").style.display === "inline-block"){
      if(fBX !== 4){
        aVZ = [[0,360],[0,250],[0,225],[0,250]];
        if(sANC === 1){aNC = [255,0,0];}
        fBX = 4;
      }

      aVZ[0][0] += -1;
      if(aVZ[0][1] <= aVZ[0][0]){
        aVZ[0][0] = 0;
      }
      aVZ[1][0] += 1;
      if(aVZ[1][1] <= aVZ[1][0]){
        aVZ[1][0] = 0;
      }
      aVZ[2][0] += -1;
      if(aVZ[2][1] <= aVZ[2][0]){
        aVZ[2][0] = 0;
      }
      aVZ[3][0] += 1;
      if(aVZ[3][1] <= aVZ[3][0]){
        aVZ[3][0] = 0;
      }

      mk.beginPath();
      mk.lineWidth = 36;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.45)";
      mk.arc(960,540,251,0+Math.PI/(aVZ[0][1]/2)*aVZ[0][0],15/16*Math.PI+Math.PI/(aVZ[0][1]/2)*aVZ[0][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 46;
      mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*220)+","+Math.round(aNC[1]/255*220)+","+Math.round(aNC[2]/255*220)+",0.45)";
      mk.arc(960,540,210,0+Math.PI/(aVZ[1][1]/2)*aVZ[1][0],7/9*Math.PI+Math.PI/(aVZ[1][1]/2)*aVZ[1][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 32;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.383)";
      mk.arc(960,540,109,0+Math.PI/(aVZ[2][1]/2)*aVZ[2][0],2/3*Math.PI+Math.PI/(aVZ[2][1]/2)*aVZ[2][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 26;
      mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*235)+","+Math.round(aNC[1]/255*235)+","+Math.round(aNC[2]/255*235)+",0.383)";
      mk.arc(960,540,80,0+Math.PI/(aVZ[3][1]/2)*aVZ[3][0],7/8*Math.PI+Math.PI/(aVZ[3][1]/2)*aVZ[3][0]);
      mk.stroke();
    }
    if(document.getElementById("actionBarItem5").style.display === "inline-block"){
      if(fBX !== 5){
        aVZ = [[0,250,2.5,10,1.2]];
        if(sANC === 1){aNC = [255,0,255];}
        fBX = 5;
      }

      aVZ[0][0] += 1;
      if(aVZ[0][1] <= aVZ[0][0]){
        aVZ[0][0] = 0;
      }

      for(Laa = 0; Laa < Math.round(aVZ[0][1]/5*2); Laa++){
        mk.beginPath();
        mk.lineWidth = 26;
        mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*235)+","+Math.round(aNC[1]/255*235)+","+Math.round(aNC[2]/255*235)+",0.5)";
        mk.arc(960,540,200+Math.sin(aVZ[0][3]*Math.PI/(aVZ[0][1]/aVZ[0][2])*(Laa-aVZ[0][0]))*aVZ[0][3]*aVZ[0][4],0-2*Math.PI/aVZ[0][1]*Laa+2*Math.PI/aVZ[0][1]*aVZ[0][0],2*Math.PI/aVZ[0][1]-2*Math.PI/aVZ[0][1]*Laa+2*Math.PI/aVZ[0][1]*aVZ[0][0]);
        mk.stroke();
      }
    }
  }
}

function letThereBeLight(){
  if(rANC[0] === 1){
    rainbowColor();
  }
  katie();
  window.requestAnimationFrame(letThereBeLight);
}

window.requestAnimationFrame(letThereBeLight);

document.getElementById("desktopInstructions").innerHTML = "<br/>Karma Script'</a> <br>Auto Heal Insta Kill</a> <br>Hat-Hacking</a> <br>Acc-Hacking</a> <br>Hotkey,Circle's</a> <br>Hat-Macro</a> <br>ProMap</a> <br>Katana Key , </a> <br>Musket Key  ."
document.getElementById("desktopInstructions").style.color = "Black";

document.getElementById('adCard').remove();
document.getElementById('errorNotification').remove();

document.getElementById("setupCard").style.color = "Red";
document.getElementById("gameName").innerHTML = "Karma Clan"
document.getElementById("gameName").style.color = "black"

$
$('#guideCard').prepend('<a href = "https://discord.gg/TAG8ZBC">Discord Karma Clan</a> <br> ');
$('#guideCard').prepend({'color': 'black'});

({'position':'absolute','bottom':'72px','left':'20px','width':'420px','height':'236.25px','padding-bottom':'18px','margin-top':'0px'});(function(){var ID_FERANYZERIR=45;var ID_Booster_Hat=12;var ID_Bushido_Armor=16;var ID_Flipper_Hat=31;var ID_Medic_Gear=13;var ID_Winter_Cap=15;var ID_Emp_Helmet=22;var ID_Barbarian_Armor=26;var ID_Samurai_Armor=20;var ID_Tank_Gear=40;var ID_Bull_Helmet=7;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;var ID_Fez_Hat=35;var ID_Enigma_Hat=42;var ID_Blitz_Hat=43;var ID_Bob_XIII_Hat=49;var ID_Bummle_Hat=8;var ID_Straw_Hat=2;var ID_Cowboy_Hat=5;var ID_Ranger_Hat=4;var ID_Explorer_Hat=18;var ID_Marksman_Cap=1;var ID_Bush_Gear=10;var ID_Halo=48;var ID_Soldier_Helmet=6;var ID_Anti_Venom_Gear=23;var ID_Miners_Helmet=9;var ID_Musketeer_Hat=32;var ID_Plague_Mask=21;var ID_Bull_Mask=46;var ID_Windmill_Hat=14;var ID_Spike_Gear=11;var ID_Scavenger_Gear=27;var ID_Apple_Cap=50;var ID_Moo_Cap=51;var ID_Turret_Gear=53;var ID_Thief_Gear=52;document.addEventListener('keydown',function(e){if(e.keyCode===96&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_FERANYZERIR);}else if(e.keyCode===16&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Booster_Hat);}else if(e.keyCode===66&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bushido_Armor);}else if(e.keyCode===86&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Flipper_Hat);}else if(e.keyCode===85&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Medic_Gear);}else if(e.keyCode===20&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Winter_Cap);}else if(e.keyCode===89&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Emp_Helmet);}else if(e.keyCode===74&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Barbarian_Armor);}else if(e.keyCode===70&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Samurai_Armor);}else if(e.keyCode===17&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Tank_Gear);}else if(e.keyCode===18&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bull_Helmet);}else if(e.keyCode===97&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Moo_Head);}else if(e.keyCode===99&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Pig_Head);}else if(e.keyCode===98&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Fluff_Head);}else if(e.keyCode===219&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Pandou_Head);}else if(e.keyCode===80&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bear_Head);}else if(e.keyCode===221&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Monkey_Head);}else if(e.keyCode===79&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Polar_Head);}else if(e.keyCode===100&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Fez_Hat);}else if(e.keyCode===102&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Enigma_Hat);}else if(e.keyCode===76&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Blitz_Hat);}else if(e.keyCode===220&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bob_XIII_Hat);}else if(e.keyCode===222&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bummle_Hat);}else if(e.keyCode===103&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Straw_Hat);}else if(e.keyCode===104&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Cowboy_Hat);}else if(e.keyCode===105&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Ranger_Hat);}else if(e.keyCode===101&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Explorer_Hat);}else if(e.keyCode===72&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Marksman_Cap);}else if(e.keyCode===190&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bush_Gear);}else if(e.keyCode===110&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Halo);}else if(e.keyCode===77&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Soldier_Helmet);}else if(e.keyCode===78&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Anti_Venom_Gear);}else if(e.keyCode===188&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Miners_Helmet);}else if(e.keyCode===75&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Musketeer_Hat);}else if(e.keyCode===71&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Plague_Mask);}else if(e.keyCode===186&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Bull_Mask);}else if(e.keyCode===189&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Windmill_Hat);}else if(e.keyCode===90&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Spike_Gear);}else if(e.keyCode===73&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Scavenger_Gear);}else if(e.keyCode===187&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Apple_Cap);}else if(e.keyCode===191&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Moo_Cap);}else if(e.keyCode===84&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Turret_Gear);}else if(e.keyCode===67&&document.activeElement.id.toLowerCase()!=='chatbox'){storeEquip(ID_Thief_Gear);}});})();(function(){var ID_FERANYZERIR=45;var ID_Booster_Hat=12;var ID_Bushido_Armor=16;var ID_Flipper_Hat=31;var ID_Medic_Gear=13;var ID_Winter_Cap=15;var ID_Emp_Helmet=22;var ID_Barbarian_Armor=26;var ID_Samurai_Armor=20;var ID_Tank_Gear=40;var ID_Bull_Helmet=7;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;var ID_Fez_Hat=35;var ID_Enigma_Hat=42;var ID_Blitz_Hat=43;var ID_Bob_XIII_Hat=49;var ID_Bummle_Hat=8;var ID_Straw_Hat=2;var ID_Cowboy_Hat=5;var ID_Ranger_Hat=4;var ID_Explorer_Hat=18;var ID_Marksman_Cap=1;var ID_Bush_Gear=10;var ID_Halo=48;var ID_Soldier_Helmet=6;var ID_Anti_Venom_Gear=23;var ID_Miners_Helmet=9;var ID_Musketeer_Hat=32;var ID_Plague_Mask=21;var ID_Bull_Mask=46;var ID_Windmill_Hat=14;var ID_Spike_Gear=11;var ID_Scavenger_Gear=27;var ID_Apple_Cap=50;var ID_Moo_Cap=51;var ID_Turret_Gear=53;var ID_Thief_Gear=52;document.addEventListener('keydown',function(e){if(e.keyCode===96&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_FERANYZERIR);}else if(e.keyCode===16&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Booster_Hat);}else if(e.keyCode===66&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bushido_Armor);}else if(e.keyCode===86&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Flipper_Hat);}else if(e.keyCode===85&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Medic_Gear);}else if(e.keyCode===20&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Winter_Cap);}else if(e.keyCode===89&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Emp_Helmet);}else if(e.keyCode===74&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Barbarian_Armor);}else if(e.keyCode===70&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Samurai_Armor);}else if(e.keyCode===17&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Tank_Gear);}else if(e.keyCode===18&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bull_Helmet);}else if(e.keyCode===97&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Moo_Head);}else if(e.keyCode===99&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Pig_Head);}else if(e.keyCode===98&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Fluff_Head);}else if(e.keyCode===219&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Pandou_Head);}else if(e.keyCode===80&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bear_Head);}else if(e.keyCode===221&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Monkey_Head);}else if(e.keyCode===79&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Polar_Head);}else if(e.keyCode===100&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Fez_Hat);}else if(e.keyCode===102&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Enigma_Hat);}else if(e.keyCode===76&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Blitz_Hat);}else if(e.keyCode===220&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bob_XIII_Hat);}else if(e.keyCode===222&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bummle_Hat);}else if(e.keyCode===103&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Straw_Hat);}else if(e.keyCode===104&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Cowboy_Hat);}else if(e.keyCode===105&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Ranger_Hat);}else if(e.keyCode===101&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Explorer_Hat);}else if(e.keyCode===72&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Marksman_Cap);}else if(e.keyCode===190&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bush_Gear);}else if(e.keyCode===110&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Halo);}else if(e.keyCode===77&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Soldier_Helmet);}else if(e.keyCode===78&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Anti_Venom_Gear);}else if(e.keyCode===188&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Miners_Helmet);}else if(e.keyCode===75&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Musketeer_Hat);}else if(e.keyCode===71&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Plague_Mask);}else if(e.keyCode===186&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Bull_Mask);}else if(e.keyCode===189&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Windmill_Hat);}else if(e.keyCode===90&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Spike_Gear);}else if(e.keyCode===73&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Scavenger_Gear);}else if(e.keyCode===187&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Apple_Cap);}else if(e.keyCode===191&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Moo_Cap);}else if(e.keyCode===84&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Turret_Gear);}else if(e.keyCode===67&&document.activeElement.id.toLowerCase()!=='chatbox'){storeBuy(ID_Thief_Gear);}});})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var můjVar5;var můjVar6;var můjVar7;var změna=true;var ID_FΔZΣ=45;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;document.addEventListener('keydown',function(e){if(e.keyCode==116){e.preventDefault();if(změna){storeEquip(ID_Moo_Head);můjVar=setTimeout(function(){h1();},270);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);clearTimeout(můjVar5);clearTimeout(můjVar6);clearTimeout(můjVar7);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Moo_Head);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},270);}function h2(){storeEquip(ID_Pig_Head);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},270);}function h3(){storeEquip(ID_Fluff_Head);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},270);}function h4(){storeEquip(ID_Pandou_Head);clearTimeout(můjVar4);můjVar5=setTimeout(function(){h5();},270);}function h5(){storeEquip(ID_Bear_Head);clearTimeout(můjVar5);můjVar6=setTimeout(function(){h6();},270);}function h6(){storeEquip(ID_Monkey_Head);clearTimeout(můjVar6);můjVar7=setTimeout(function(){h7();},270);}function h7(){storeEquip(ID_Polar_Head);clearTimeout(můjVar7);můjVar=setTimeout(function(){h1();},270);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var změna=true;var ID_FΔZΣ=45;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;document.addEventListener('keydown',function(e){if(e.keyCode==120){e.preventDefault();if(změna){storeEquip(ID_Pandou_Head);můjVar=setTimeout(function(){h1();},270);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Pandou_Head);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},270);}function h2(){storeEquip(ID_Bear_Head);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},270);}function h3(){storeEquip(ID_Monkey_Head);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},270);}function h4(){storeEquip(ID_Polar_Head);clearTimeout(můjVar4);můjVar=setTimeout(function(){h1();},270);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var změna=true;var ID_FΔZΣ=45;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Bull_Mask=46;document.addEventListener('keydown',function(e){if(e.keyCode==121){e.preventDefault();if(změna){storeEquip(ID_Moo_Head);můjVar=setTimeout(function(){h1();},270);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Moo_Head);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},270);}function h2(){storeEquip(ID_Pig_Head);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},270);}function h3(){storeEquip(ID_Fluff_Head);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},270);}function h4(){storeEquip(ID_Bull_Mask);clearTimeout(můjVar4);můjVar=setTimeout(function(){h1();},270);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var můjVar5;var můjVar6;var můjVar7;var můjVar8;var můjVar9;var můjVar10;var můjVar11;var můjVar12;var můjVar13;var změna=true;var ID_FΔZΣ=45;var ID_Moo_Cap=51;var ID_Apple_Cap=50;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;var ID_Fez_Hat=35;var ID_Enigma_Hat=42;var ID_Blitz_Hat=43;var ID_Bob_XIII_Hat=49;document.addEventListener('keydown',function(e){if(e.keyCode==9){e.preventDefault();if(změna){storeEquip(ID_Moo_Cap);můjVar=setTimeout(function(){h1();},180);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);clearTimeout(můjVar5);clearTimeout(můjVar6);clearTimeout(můjVar7);clearTimeout(můjVar8);clearTimeout(můjVar9);clearTimeout(můjVar10);clearTimeout(můjVar11);clearTimeout(můjVar12);clearTimeout(můjVar13);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Moo_Cap);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},180);}function h2(){storeEquip(ID_Apple_Cap);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},180);}function h3(){storeEquip(ID_Moo_Head);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},180);}function h4(){storeEquip(ID_Pig_Head);clearTimeout(můjVar4);můjVar5=setTimeout(function(){h5();},180);}function h5(){storeEquip(ID_Fluff_Head);clearTimeout(můjVar5);můjVar6=setTimeout(function(){h6();},180);}function h6(){storeEquip(ID_Pandou_Head);clearTimeout(můjVar6);můjVar7=setTimeout(function(){h7();},180);}function h7(){storeEquip(ID_Bear_Head);clearTimeout(můjVar7);můjVar8=setTimeout(function(){h8();},180);}function h8(){storeEquip(ID_Monkey_Head);clearTimeout(můjVar8);můjVar9=setTimeout(function(){h9();},180);}function h9(){storeEquip(ID_Polar_Head);clearTimeout(můjVar9);můjVar10=setTimeout(function(){h10();},180);}function h10(){storeEquip(ID_Fez_Hat);clearTimeout(můjVar10);můjVar11=setTimeout(function(){h11();},180);}function h11(){storeEquip(ID_Enigma_Hat);clearTimeout(můjVar11);můjVar=setTimeout(function(){h12();},180);}function h12(){storeEquip(ID_Blitz_Hat);clearTimeout(můjVar12);můjVar=setTimeout(function(){h13();},180);}function h13(){storeEquip(ID_Bob_XIII_Hat);clearTimeout(můjVar13);můjVar=setTimeout(function(){h1();},180);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var můjVar5;var můjVar6;var můjVar7;var můjVar8;var můjVar9;var změna=true;var ID_FΔZΣ=45;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;var ID_Flipper_Hat=31;var ID_Bull_Mask=46;document.addEventListener('keydown',function(e){if(e.keyCode==117){e.preventDefault();if(změna){storeEquip(ID_Moo_Head);můjVar=setTimeout(function(){h1();},270);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);clearTimeout(můjVar5);clearTimeout(můjVar6);clearTimeout(můjVar7);clearTimeout(můjVar8);clearTimeout(můjVar9);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Moo_Head);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},270);}function h2(){storeEquip(ID_Pig_Head);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},270);}function h3(){storeEquip(ID_Fluff_Head);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},270);}function h4(){storeEquip(ID_Pandou_Head);clearTimeout(můjVar4);můjVar5=setTimeout(function(){h5();},270);}function h5(){storeEquip(ID_Bear_Head);clearTimeout(můjVar5);můjVar6=setTimeout(function(){h6();},270);}function h6(){storeEquip(ID_Monkey_Head);clearTimeout(můjVar6);můjVar7=setTimeout(function(){h7();},270);}function h7(){storeEquip(ID_Polar_Head);clearTimeout(můjVar7);můjVar8=setTimeout(function(){h8();},270);}function h8(){storeEquip(ID_Flipper_Hat);clearTimeout(můjVar8);můjVar9=setTimeout(function(){h9();},270);}function h9(){storeEquip(ID_Bull_Mask);clearTimeout(můjVar9);můjVar=setTimeout(function(){h1();},270);}})();(function(){var můjVar;var můjVar2;var změna=true;var ID_Bummle_Hat=8;var ID_FΔZΣ=45;var ID_Winter_Cap=15;document.addEventListener('keydown',function(e){if(e.keyCode==119){e.preventDefault();if(změna){storeEquip(ID_Bummle_Hat);můjVar=setTimeout(function(){h1();},125);}else{clearTimeout(můjVar);clearTimeout(můjVar2);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Bummle_Hat);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},125);}function h2(){storeEquip(ID_Winter_Cap);clearTimeout(můjVar2);můjVar=setTimeout(function(){h1();},125);}})();(function(){var můjVar;var můjVar2;var změna=true;var ID_Moo_Cap=51;var ID_FΔZΣ=45;var ID_Apple_Cap=50;document.addEventListener('keydown',function(e){if(e.keyCode==118){e.preventDefault();if(změna){storeEquip(ID_Moo_Cap);můjVar=setTimeout(function(){h1();},125);}else{clearTimeout(můjVar);clearTimeout(můjVar2);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Moo_Cap);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},125);}function h2(){storeEquip(ID_Apple_Cap);clearTimeout(můjVar2);můjVar=setTimeout(function(){h1();},125);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var změna=true;var ID_Bummle_Hat=8;var ID_Moo_Cap=51;var ID_FΔZΣ=45;var ID_Apple_Cap=50;var ID_Winter_Cap=15;document.addEventListener('keydown',function(e){if(e.keyCode==112){e.preventDefault();if(změna){storeEquip(ID_Bummle_Hat);můjVar=setTimeout(function(){h1();},180);}else{clearTimeout(můjVar);clearTimeout(můjVar2);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Bummle_Hat);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},180);}function h2(){storeEquip(ID_Moo_Cap);clearTimeout(můjVar2);můjVar=setTimeout(function(){h3();},180);}function h3(){storeEquip(ID_Apple_Cap);clearTimeout(můjVar3);můjVar=setTimeout(function(){h4();},180)}function h4(){storeEquip(ID_Winter_Cap);clearTimeout(můjVar4);můjVar=setTimeout(function(){h1();},180)}})();(function(){var můjVar;var můjVar2;var změna=true;var ID_Turret_Gear=53;var ID_FΔZΣ=45;var ID_Booster_Hat=12;document.addEventListener('keydown',function(e){if(e.keyCode==115){e.preventDefault();if(změna){storeEquip(ID_Turret_Gear);můjVar=setTimeout(function(){h1();},125);}else{clearTimeout(můjVar);clearTimeout(můjVar2);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_Turret_Gear);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},125);}function h2(){storeEquip(ID_Booster_Hat);clearTimeout(můjVar2);můjVar=setTimeout(function(){h1();},3075);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var můjVar5;var můjVar6;var můjVar7;var můjVar8;var můjVar9;var můjVar10;var můjVar11;var můjVar12;var můjVar13;var můjVar14;var můjVar15;var můjVar16;var můjVar17;var můjVar18;var můjVar19;var můjVar20;var můjVar21;var můjVar22;var můjVar23;var můjVar24;var můjVar25;var můjVar26;var můjVar27;var můjVar28;var můjVar29;var můjVar30;var můjVar31;var můjVar32;var můjVar33;var můjVar34;var můjVar35;var můjVar36;var můjVar37;var můjVar38;var můjVar39;var můjVar40;var můjVar41;var můjVar42;var můjVar43;var změna=true;var ID_FΔZΣ=45;var ID_Moo_Cap=51;var ID_Apple_Cap=50;var ID_Moo_Head=28;var ID_Pig_Head=29;var ID_Fluff_Head=30;var ID_Pandou_Head=36;var ID_Bear_Head=37;var ID_Monkey_Head=38;var ID_Polar_Head=44;var ID_Fez_Hat=35;var ID_Enigma_Hat=42;var ID_Blitz_Hat=43;var ID_Bob_XIII_Hat=49;var ID_Bummle_Hat=8;var ID_Straw_Hat=2;var ID_Winter_Cap=15;var ID_Cowboy_Hat=5;var ID_Ranger_Hat=4;var ID_Explorer_Hat=18;var ID_Flipper_Hat=31;var ID_Marksman_Cap=1;var ID_Bush_Gear=10;var ID_Halo=48;var ID_Soldier_Helmet=6;var ID_Anti_Venom_Gear=23;var ID_Medic_Gear=13;var ID_Miners_Helmet=9;var ID_Musketeer_Hat=32;var ID_Bull_Helmet=7;var ID_Emp_Helmet=22;var ID_Booster_Hat=12;var ID_Barbarian_Armor=26;var ID_Plague_Mask=21;var ID_Bull_Mask=46;var ID_Windmill_Hat=14;var ID_Spike_Gear=11;var ID_Turret_Gear=53;var ID_Samurai_Armor=20;var ID_Bushido_Armor=16;var ID_Scavenger_Gear=27;var ID_Tank_Gear=40;;var ID_Thief_Gear=52;document.addEventListener('keydown',function(e){if(e.keyCode==114){e.preventDefault();if(změna){storeEquip(ID_FΔZΣ);můjVar=setTimeout(function(){h1();},75);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);clearTimeout(můjVar5);clearTimeout(můjVar6);clearTimeout(můjVar7);clearTimeout(můjVar8);clearTimeout(můjVar9);clearTimeout(můjVar10);clearTimeout(můjVar11);clearTimeout(můjVar12);clearTimeout(můjVar13);clearTimeout(můjVar14);clearTimeout(můjVar15);clearTimeout(můjVar16);clearTimeout(můjVar17);clearTimeout(můjVar18);clearTimeout(můjVar19);clearTimeout(můjVar20);clearTimeout(můjVar21);clearTimeout(můjVar22);clearTimeout(můjVar23);clearTimeout(můjVar24);clearTimeout(můjVar25);clearTimeout(můjVar26);clearTimeout(můjVar27);clearTimeout(můjVar28);clearTimeout(můjVar29);clearTimeout(můjVar30);clearTimeout(můjVar31);clearTimeout(můjVar32);clearTimeout(můjVar33);clearTimeout(můjVar34);clearTimeout(můjVar35);clearTimeout(můjVar36);clearTimeout(můjVar37);clearTimeout(můjVar38);clearTimeout(můjVar39);clearTimeout(můjVar40);clearTimeout(můjVar41);clearTimeout(můjVar42);clearTimeout(můjVar43);storeEquip(ID_FΔZΣ);}změna=!změna;}});function h1(){storeEquip(ID_FΔZΣ);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},75);}function h2(){storeEquip(ID_Moo_Cap);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},75);}function h3(){storeEquip(ID_Apple_Cap);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},75);}function h4(){storeEquip(ID_Moo_Head);clearTimeout(můjVar4);můjVar5=setTimeout(function(){h5();},75);}function h5(){storeEquip(ID_Pig_Head);clearTimeout(můjVar5);můjVar6=setTimeout(function(){h6();},75);}function h6(){storeEquip(ID_Fluff_Head);clearTimeout(můjVar6);můjVar7=setTimeout(function(){h7();},75);}function h7(){storeEquip(ID_Pandou_Head);clearTimeout(můjVar7);můjVar8=setTimeout(function(){h8();},75);}function h8(){storeEquip(ID_Bear_Head);clearTimeout(můjVar8);můjVar9=setTimeout(function(){h9();},75);}function h9(){storeEquip(ID_Monkey_Head);clearTimeout(můjVar9);můjVar10=setTimeout(function(){h10();},75);}function h10(){storeEquip(ID_Polar_Head);clearTimeout(můjVar10);můjVar11=setTimeout(function(){h11();},75);}function h11(){storeEquip(ID_Fez_Hat);clearTimeout(můjVar11);můjVar12=setTimeout(function(){h12();},75);}function h12(){storeEquip(ID_Enigma_Hat);clearTimeout(můjVar12);můjVar13=setTimeout(function(){h13();},75);}function h13(){storeEquip(ID_Blitz_Hat);clearTimeout(můjVar13);můjVar14=setTimeout(function(){h14();},75);}function h14(){storeEquip(ID_Bob_XIII_Hat);clearTimeout(můjVar14);můjVar15=setTimeout(function(){h15();},75);}function h15(){storeEquip(ID_Bummle_Hat);clearTimeout(můjVar15);můjVar16=setTimeout(function(){h16();},75);}function h16(){storeEquip(ID_Straw_Hat);clearTimeout(můjVar16);můjVar17=setTimeout(function(){h17();},75);}function h17(){storeEquip(ID_Winter_Cap);clearTimeout(můjVar17);můjVar18=setTimeout(function(){h18();},75);}function h18(){storeEquip(ID_Cowboy_Hat);clearTimeout(můjVar18);můjVar19=setTimeout(function(){h19();},75);}function h19(){storeEquip(ID_Ranger_Hat);clearTimeout(můjVar19);můjVar20=setTimeout(function(){h20();},75);}function h20(){storeEquip(ID_Explorer_Hat);clearTimeout(můjVar20);můjVar21=setTimeout(function(){h21();},75);}function h21(){storeEquip(ID_Flipper_Hat);clearTimeout(můjVar21);můjVar22=setTimeout(function(){h22();},75);}function h22(){storeEquip(ID_Marksman_Cap);clearTimeout(můjVar22);můjVar23=setTimeout(function(){h23();},75);}function h23(){storeEquip(ID_Bush_Gear);clearTimeout(můjVar23);můjVar24=setTimeout(function(){h24();},75);}function h24(){storeEquip(ID_Halo);clearTimeout(můjVar24);můjVar25=setTimeout(function(){h25();},75);}function h25(){storeEquip(ID_Soldier_Helmet);clearTimeout(můjVar25);můjVar26=setTimeout(function(){h26();},75);}function h26(){storeEquip(ID_Anti_Venom_Gear);clearTimeout(můjVar26);můjVar27=setTimeout(function(){h27();},75);}function h27(){storeEquip(ID_Medic_Gear);clearTimeout(můjVar27);můjVar28=setTimeout(function(){h28();},75);}function h28(){storeEquip(ID_Miners_Helmet);clearTimeout(můjVar28);můjVar29=setTimeout(function(){h29();},75);}function h29(){storeEquip(ID_Musketeer_Hat);clearTimeout(můjVar29);můjVar30=setTimeout(function(){h30();},75);}function h30(){storeEquip(ID_Bull_Helmet);clearTimeout(můjVar30);můjVar31=setTimeout(function(){h31();},75);}function h31(){storeEquip(ID_Emp_Helmet);clearTimeout(můjVar31);můjVar32=setTimeout(function(){h32();},75);}function h32(){storeEquip(ID_Booster_Hat);clearTimeout(můjVar32);můjVar33=setTimeout(function(){h33();},75);}function h33(){storeEquip(ID_Barbarian_Armor);clearTimeout(můjVar33);můjVar34=setTimeout(function(){h34();},75);}function h34(){storeEquip(ID_Plague_Mask);clearTimeout(můjVar34);můjVar35=setTimeout(function(){h35();},75);}function h35(){storeEquip(ID_Bull_Mask);clearTimeout(můjVar35);můjVar36=setTimeout(function(){h36();},75);}function h36(){storeEquip(ID_Windmill_Hat);clearTimeout(můjVar36);můjVar37=setTimeout(function(){h37();},75);}function h37(){storeEquip(ID_Spike_Gear);clearTimeout(můjVar37);můjVar38=setTimeout(function(){h38();},75);}function h38(){storeEquip(ID_Turret_Gear);clearTimeout(můjVar38);můjVar39=setTimeout(function(){h39();},75);}function h39(){storeEquip(ID_Samurai_Armor);clearTimeout(můjVar39);můjVar40=setTimeout(function(){h40();},75);}function h40(){storeEquip(ID_Bushido_Armor);clearTimeout(můjVar40);můjVar41=setTimeout(function(){h41();},75);}function h41(){storeEquip(ID_Scavenger_Gear);clearTimeout(můjVar41);můjVar42=setTimeout(function(){h42();},75);}function h42(){storeEquip(ID_Tank_Gear);clearTimeout(můjVar42);můjVar=setTimeout(function(){h43();},75);}function h43(){storeEquip(ID_Thief_Gear);clearTimeout(můjVar43);můjVar=setTimeout(function(){h1();},75);}})();(function(){var můjVar;var můjVar2;var můjVar3;var můjVar4;var můjVar5;var můjVar6;var můjVar7;var můjVar8;var můjVar9;var můjVar10;var změna=true;var ID_0_0_0_0_0_0= 0;var ID_17_17_17_17=17;var ID_24_24_24_24=24;var ID_33_33_33_33=33;var ID_34_34_34_34=34;var ID_39_39_39_39=39;var ID_41_41_41_41=41;var ID_45_45_45_45=45;var ID_47_47_47_47=47;var ID_52_52_52_52=52;document.addEventListener('keydown',function(e){if(e.keyCode==93){e.preventDefault();if(změna){storeEquip(ID_0_0_0_0_0_0);můjVar=setTimeout(function(){h1();},180);}else{clearTimeout(můjVar);clearTimeout(můjVar2);clearTimeout(můjVar3);clearTimeout(můjVar4);clearTimeout(můjVar5);clearTimeout(můjVar6);clearTimeout(můjVar7);clearTimeout(můjVar8);clearTimeout(můjVar9);clearTimeout(můjVar10);storeEquip(ID_0_0_0_0_0_0);}změna=!změna;}});function h1(){storeEquip(ID_0_0_0_0_0_0);clearTimeout(můjVar);můjVar2=setTimeout(function(){h2();},180);}function h2(){storeEquip(ID_17_17_17_17);clearTimeout(můjVar2);můjVar3=setTimeout(function(){h3();},180);}function h3(){storeEquip(ID_24_24_24_24);clearTimeout(můjVar3);můjVar4=setTimeout(function(){h4();},180);}function h4(){storeEquip(ID_33_33_33_33);clearTimeout(můjVar4);můjVar5=setTimeout(function(){h5();},180);}function h5(){storeEquip(ID_34_34_34_34);clearTimeout(můjVar5);můjVar6=setTimeout(function(){h6();},180);}function h6(){storeEquip(ID_39_39_39_39);clearTimeout(můjVar6);můjVar7=setTimeout(function(){h7();},180);}function h7(){storeEquip(ID_41_41_41_41);clearTimeout(můjVar7);můjVar8=setTimeout(function(){h8();},180);}function h8(){storeEquip(ID_45_45_45_45);clearTimeout(můjVar8);můjVar9=setTimeout(function(){h9();},180);}function h9(){storeEquip(ID_47_47_47_47);clearTimeout(můjVar9);můjVar10=setTimeout(function(){h10();},180);}function h10(){storeEquip(ID_52_52_52_52);clearTimeout(můjVar10);můjVar=setTimeout(function(){h1();},180)}})();


$("#ageBarContainer").append('</br><div id="hacktext"><div style="width: 100%;position: absolute;top: 100px;text-align: center;color: white;font-size: 12px;" id="bilgitext">Tab - Free Hats Mod | F1 Police Mod + Animal Caps | F2 ? | F3 All Hats | F4 Turret + Booster Hat| F5 or F6 - Animals Mod | F7 - Animal Caps | F8 - Police Mod | F9 Pandou + Bear + Monkey + Polar Head | F10 Animals Mod + Bull Mask</div><div style="width: 100%;position: absolute;bottom: 170px;text-align: center;color: darkgreen;font-size: 24px;" id="atext"></div><div style="width: 100%;position: absolute;bottom: 196px;text-align: center;color: black;font-size: 24px;" id="mtext"></div>');

$('#guideCard').prepend('<a href = "https://www.youtube.com/channel/UChujyWNvKA2u_TkpAvvWxqA?view_as=subscriber">Youtube</a> <br> ');
document.getElementById("linksContainer2").innerHTML = "Made By DamKarma";

document.getElementById("followText").innerHTML = "More Hack For Subscribe(Click To Subscribe Button)"

$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});

document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});

window.onbeforeunload = null;






let mouseX;
let mouseY;

let width;
let height;

setInterval(() => {
   if(clanToggle == 1) {
        doNewSend(["9", [null]]);
        doNewSend(["8", [animate(false, 5)]])
    }
    doNewSend(["testing", [6]]);
}, 200);

setInterval(() => {
    if(messageToggle == 1) {
        doNewSend(["ch", [animate(true, 5)]])
    }
}, 200);

setInterval(() => {
    if(autoaim == true) {
        doNewSend(["2", [nearestEnemyAngle]]);
    }
}, 0);

setInterval(() => {
    if(hatToggle == 1) {
        if(oldHat != normalHat) {
            hat(normalHat);
            console.log("Tried. - Hat")
        }
        if(oldAcc != normalAcc) {
            acc(normalAcc);
            console.log("Tried. - Acc")
        }
        oldHat = normalHat;
        oldAcc = normalAcc
    }
}, 25);

function normal() {
    hat(normalHat);
    acc(normalAcc);
}

function aim(x, y){
     var cvs = document.getElementById("gameCanvas");
     cvs.dispatchEvent(new MouseEvent("mousemove", {
         clientX: x,
         clientY: y

     }));
}

let coreURL = new URL(window.location.href);
window.sessionStorage.force = coreURL.searchParams.get("fc");

var aimbot
var MooModMenu
var EnemyRadar
var nearestEnemy;
var nearestEnemyAngle;
var isEnemyNear;
var instaSpeed = 270;
var primary;
var secondary;
var foodType;
var wallType;
var spikeType;
var millType;
var mineType;
var boostType;
var turretType;
var spawnpadType;
var autoaim = false;
var tick = 1;
var oldHat;
var oldAcc;
var enemiesNear;
var normalHat;
var normalAcc;
var ws;
var msgpack5 = msgpack;
var boostDir;
let myPlayer = {
    id: null,
    x: null,
    y: null,
    dir: null,
    object: null,
    weapon: null,
    clan: null,
    isLeader: null,
    hat: null,
    accessory: null,
    isSkull: null
};

let healSpeed = 100;
var messageToggle = 0;
var clanToggle = 0;
let healToggle = 1;
let hatToggle = 1;

document.msgpack = msgpack;
function n(){
     this.buffer = new Uint8Array([0]);
     this.buffer.__proto__ = new Uint8Array;
     this.type = 0;
}

WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(m){
    if (!ws){
        document.ws = this;

        ws = this;
        socketFound(this);
    }
    this.oldSend(m);
};


function socketFound(socket){
    socket.addEventListener('message', function(message){
        handleMessage(message);
    });
}

function handleMessage(m){
    let temp = msgpack5.decode(new Uint8Array(m.data));
    let data;
    if(temp.length > 1) {
        data = [temp[0], ...temp[1]];
        if (data[1] instanceof Array){
            data = data;
        }
    } else {
      data = temp;
    }
    let item = data[0];
    if(!data) {return};

    if(item === "io-init") {
            let cvs = document.getElementById("gameCanvas");
            width = cvs.clientWidth;
            height = cvs.clientHeight;
            $(window).resize(function() {
                width = cvs.clientWidth;
                height = cvs.clientHeight;
            });
            cvs.addEventListener("mousemove", e => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });
        }

    if (item == "1" && myPlayer.id == null){
        myPlayer.id = data[1];
    }

    if (item == "33") {
        enemiesNear = [];
        for(let i = 0; i < data[1].length / 13; i++) {
            let playerInfo = data[1].slice(13*i, 13*i+13);
            if(playerInfo[0] == myPlayer.id) {
                myPlayer.x = playerInfo[1];
                myPlayer.y = playerInfo[2];
                myPlayer.dir = playerInfo[3];
                myPlayer.object = playerInfo[4];
                myPlayer.weapon = playerInfo[5];
                myPlayer.clan = playerInfo[7];
                myPlayer.isLeader = playerInfo[8];
                myPlayer.hat = playerInfo[9];
                myPlayer.accessory = playerInfo[10];
                myPlayer.isSkull = playerInfo[11];
            } else if(playerInfo[7] != myPlayer.clan || playerInfo[7] === null) {
                enemiesNear.push(playerInfo);
            }
        }
    }

    isEnemyNear = false;
    if(enemiesNear) {
        nearestEnemy = enemiesNear.sort((a,b) => dist(a, myPlayer) - dist(b, myPlayer))[0];
    }

    if(nearestEnemy) {
        nearestEnemyAngle = Math.atan2(nearestEnemy[2]-myPlayer.y, nearestEnemy[1]-myPlayer.x);
        if(Math.sqrt(Math.pow((myPlayer.y-nearestEnemy[2]), 2) + Math.pow((myPlayer.x-nearestEnemy[1]), 2)) < 190) {
            isEnemyNear = true;
            if(autoaim == false && myPlayer.hat != 6 && myPlayer.hat != 6) {
                normalHat = 6;
                if(primary != 8) {
                    normalAcc = 21
                }
            };
        }
    }
    if(isEnemyNear == false && autoaim == false) {
        normalAcc = 11;
        if (myPlayer.y < 2400){
            normalHat = 15;
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            normalHat = 31;
        } else {
	        normalHat = 12;
        }
    }
    if (!nearestEnemy) {
        nearestEnemyAngle = myPlayer.dir;
    }
    if(item == "h" && data[1] == myPlayer.id) {
        if(data[2] < 1000 && data[2] > 0 && healToggle == 1) {
            setTimeout( () => {
                place(foodType, null);
            }, healSpeed);

        }
    }
    update();
}


function doNewSend(sender){
    ws.send(new Uint8Array(Array.from(msgpack5.encode(sender))));
}

function acc(id) {
    doNewSend(["13c", [0, 0, 1]]);
    doNewSend(["13c", [0, id, 1]]);
}

function hat(id) {
    doNewSend(["13c", [0, id, 0]]);
}


function place(id, angle = Math.atan2(mouseY - height / 2, mouseX - width / 2)) {
    doNewSend(["5", [id, null]]);
    doNewSend(["c", [1, angle]]);
    doNewSend(["c", [0, angle]]);
    doNewSend(["5", [myPlayer.weapon, true]]);
}

function boostSpike() {
    if(boostDir == null) {
        boostDir = nearestEnemyAngle;
    }
    place(spikeType, boostDir + toRad(90));
    place(spikeType, boostDir - toRad(90));
    place(boostType, boostDir);
    doNewSend(["33", [boostDir]]);
}


var repeater = function(key, action, interval) {
    let _isKeyDown = false;
    let _intervalId = undefined;

    return {
        start(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = true;
                if(_intervalId === undefined) {
                    _intervalId = setInterval(() => {
                        action();
                        if(!_isKeyDown){
                            clearInterval(_intervalId);
                            _intervalId = undefined;
                            console.log("claered");
                        }
                    }, interval);
                }
            }
        },

        stop(keycode) {
            if(keycode == key && document.activeElement.id.toLowerCase() !== 'chatbox') {
                _isKeyDown = false;
            }
        }
    };


}

const healer = repeater(81, () => {place(foodType)}, 0);
const boostPlacer = repeater(70, () => {place(boostType)}, 0);
const spikePlacer = repeater(86, () => {place(spikeType)}, 0);
const millPlacer = repeater(78, () => {place(millType)}, 0);
const turretPlacer = repeater(72, () => {place(turretType)}, 0);
const wallPlacer = repeater(74, () => {place(wallType)}, 0);

document.addEventListener('keydown', (e)=>{
    spikePlacer.start(e.keyCode);
    healer.start(e.keyCode);
    boostPlacer.start(e.keyCode);
    wallPlacer.start(e.keycode);
    millPlacer.start(e.keyCode);
    turretPlacer.start(e.keyCode);

    if (e.keyCode == 73 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<5;i++){
             let angle = myPlayer.dir + toRad(i * 72);
             place(millType, angle)
        }
    }
        if (e.keyCode == 80 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 72);
             place(wallType, angle)
        }
    }

    if (e.keyCode == 85 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(turretType, angle)
        }
    }
    if (e.keyCode == 79 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(boostType, angle)
        }
    }
    if (e.keyCode == 76 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        for (let i=0;i<4;i++){
             let angle = myPlayer.dir + toRad(i * 90);
             place(spikeType, angle)
        }
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(40);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(40);
        } else {
	        hat(40);
        }
        acc(18);
    }
        if (e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(12);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(12);
        } else {
	        hat(12);
        }
        acc(11);
    }
        if (e.keyCode == 67 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(53);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(53);
        } else {
	        hat(53);
        }
        acc(19);
    }
        if (e.keyCode == 77 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(20);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(20);
        } else {
	        hat(20);
        }
        acc(13);
    }
        if (e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        if (myPlayer.y < 2400){
            hat(6);
        } else if (myPlayer.y > 6850 && myPlayer.y < 7550){
            hat(6);
        } else {
	        hat(6);
        }
        acc(21);
    }
    if (e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hat(20);
    }

    if(e.keyCode == 82 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 18, 1]]);
        doNewSend(["c", [1]]);
        setTimeout( () => {
                    doNewSend(["13c", [0, 53, 0]]);
                    doNewSend(["13c", [0, 0, 1]]);
                    doNewSend(["13c", [0, 21, 1]]);
                    doNewSend(["5", [secondary, true]]);
        }, instaSpeed - 200);

        setTimeout( () => {
            doNewSend(["5", [primary, true]]);
            doNewSend(["c", [0, null]]);
                    doNewSend(["13c", [0, 6, 0]]);
                    doNewSend(["13c", [0, 0, 1]]);
                    doNewSend(["13c", [0, 21, 1]]);
            autoaim = false;
        }, instaSpeed);
    }

    if(e.keyCode == 32 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        autoaim = true;
        doNewSend(["5", [primary, true]]);
        doNewSend(["13c", [0, 7, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 18, 1]]);
        doNewSend(["c", [0]]);

        setTimeout( () => {
        doNewSend(["13c", [0, 6, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 21, 1]]);
        }, 100);

        setTimeout( () => {
        doNewSend(["c", [0, null]]);
        doNewSend(["13c", [0, 12, 0]]);
        doNewSend(["13c", [0, 0, 1]]);
        doNewSend(["13c", [0, 11, 1]]);
            autoaim = false;
        }, 200);
    }

    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        messageToggle = (messageToggle + 1) % 2;
    }

    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        clanToggle = (clanToggle + 1) % 2;
    }

    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        healToggle = (healToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "Heal: OFF | Hat: OFF"
            } else {
                document.title = "Heal: OFF | Hat: ON"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "Heal: ON | Hat: OFF"
            } else {
                document.title = "Heal: ON | Hat: ON"
            }
        }
    }
    if(e.keyCode == 97 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [4]]);
    }

    if(e.keyCode == 98 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [15]]);
    }
    if(e.keyCode == 100 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [28]]);
    }
    if(e.keyCode == 101 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        doNewSend(["6", [25]]);
        doNewSend(["6", [25]]);
    }
    if(e.keyCode == 1 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        hatToggle = (hatToggle + 1) % 2;
        if(healToggle == 0) {
            if(hatToggle == 0) {
                document.title = "Heal: OFF | Hat: OFF"
            } else {
                document.title = "Heal: OFF | Hat: ON"
            }
        } else {
            if(hatToggle == 0) {
                document.title = "Heal: ON | Hat: OFF"
            } else {
                document.title = "Heal: ON | Hat: ON"
            }
        }
    }
})

document.addEventListener('keyup', (e)=>{
    spikePlacer.stop(e.keyCode);
    boostPlacer.stop(e.keyCode);
    wallPlacer.stop(e.keycode);
    millPlacer.stop(e.keyCode);
    turretPlacer.stop(e.keyCode);
    healer.stop(e.keyCode);
    if(e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') {
        setTimeout( () => {
            doNewSend(["33", [null]]);
            boostDir = null;
        }, 1);
    }
})


function isElementVisible(e) {
    return (e.offsetParent !== null);
}


function toRad(angle) {
    return angle * 0.01745329251;
}

function dist(a, b){
    return Math.sqrt( Math.pow((b.y-a[2]), 2) + Math.pow((b.x-a[1]), 2) );
}

function animate(space, chance) {
    let result = '';
    let characters;
    if(space) {
        characters = 'Unete a Karma Clan.';
    } else {
        characters = 'gg';
    }
    if(space) {
        characters = characters.padStart((30 - characters.length) / 2 + characters.length)
        characters = characters.padEnd(30);
    }
    let count = 0;
    for (let i = 0; i < characters.length; i++ ) {
       if(Math.floor(Math.random() * chance) == 1 && characters.charAt(i) != "" && count < 2 && characters.charAt(i) != "") {
           result += "";
           count++
       } else {
           result += characters.charAt(i);
       }
    }
    return result;
}

document.title = "Karma Clan"

function update() {
    for (let i=0;i<9;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            primary = i;
        }
    }

    for (let i=9;i<16;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            secondary = i;
        }
    }

    for (let i=16;i<19;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            foodType = i - 16;
        }
    }

    for (let i=19;i<22;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            wallType = i - 16;
        }
    }

    for (let i=22;i<26;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            spikeType = i - 16;
        }
    }

    for (let i=26;i<29;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            millType = i - 16;
        }
    }

    for (let i=29;i<31;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            mineType = i - 16;
        }
    }

    for (let i=31;i<33;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString()))){
            boostType = i - 16;
        }
    }

    for (let i=33;i<39;i++){
        if (isElementVisible(document.getElementById("actionBarItem" + i.toString())) && i != 36){
            turretType = i - 16;
        }
    }

    spawnpadType = 36;
}