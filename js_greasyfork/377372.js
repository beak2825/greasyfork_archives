// ==UserScript==
// @name         Script bloble.io
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Vários scripts em um.
// @author       Stamer
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377372/Script%20blobleio.user.js
// @updateURL https://update.greasyfork.org/scripts/377372/Script%20blobleio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();addEventListener("keydown", function(a) {
    if (a.keyCode ==75) {//
            socket.emit("1",1.00,245,3);
            socket.emit("1",1.30,245,3);
            socket.emit("1",1.60,245,3);
            socket.emit("1",1.90,245,3);
            socket.emit("1",2.20,245,3);
            socket.emit("1",2.50,245,3);
            socket.emit("1",2.80,245,3);
            socket.emit("1",3.10,245,3);
            socket.emit("1",3.40,245,3);
            socket.emit("1",3.70,245,3);
            socket.emit("1",4.00,245,3);
            socket.emit("1",4.30,245,3);
            socket.emit("1",4.60,245,3);
            socket.emit("1",4.90,245,3);
            socket.emit("1",5.20,245,3);
            socket.emit("1",5.50,245,3);
            socket.emit("1",5.80,245,3);
            socket.emit("1",6.10,245,3);
            socket.emit("1",6.40,245,3);
            socket.emit("1",6.70,245,3);
            socket.emit("1",6.99,245,3);
            socket.emit("1",1.44,180,3);
            socket.emit("1",1.73,132,3);
            socket.emit("1",2.00,182,3);
            socket.emit("1",2.29,132,3);
            socket.emit("1",2.58,182,3);
            socket.emit("1",2.88,132,3);
            socket.emit("1",3.18,182,3);
            socket.emit("1",3.46,132,3);
            socket.emit("1",3.78,182,3);
            socket.emit("1",4.09,182,3);
            socket.emit("1",4.05,132,3);
            socket.emit("1",4.37,180,3);
            socket.emit("1",4.67,132,3);
            socket.emit("1",4.98,180,3);
            socket.emit("1",5.30,132,3);
            socket.emit("1",5.59,180,3);
            socket.emit("1",5.90,132,3);
            socket.emit("1",6.19,181,3);
            socket.emit("1",6.48,132,3);
            socket.emit("1",6.77,181,3);
            socket.emit("1",7.05,132,3);
            socket.emit("1",7.36,180,3);
    }
});addEventListener("keydown", function(a) {
    if (a.keyCode == 97){
        for(i=-3.14;i<=3.14;i+=0.5233){
            socket.emit("1",i,132,3);
        }
    }
    if (a.keyCode == 100){
        for(i=-2.965;i<=3.14;i+=0.3488){
            socket.emit("1",i,243.85,3);
        }
    }
    if (a.keyCode == 103){
        for(i=0;i<units.length;++i){
            if(0===units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 98){
        for(i=-3.14;i<=3.14;i+=0.3488){
            socket.emit("1",i,194,2);
        }
    }
    if (a.keyCode == 101){
        for(i=0;i<units.length;++i){
            if(0===units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,1);
             }
        }
    }
    if (a.keyCode == 104){
        for(i=0;i<units.length;++i){
            if(0===units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 99){
        for(i=-3.14;i<3.14;i+=0.216){
            socket.emit("1",i,1e3,1);
        }
    }
    if (a.keyCode == 102){
        for(i=0;i<units.length;++i){
            if(3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 105){
        for(i=0;i<units.length;++i){
            if(3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid){
                socket.emit("4",units[i].id,0);
            }
        }
    }
    if (a.keyCode == 67){
        for(i=0;i<units.length;++i){
            if(1==units[i].type&&"star"==units[i].shape&&units[i].owner==player.sid){
                camX = units[i].x-player.x;
                camY = units[i].y-player.y;
            }
        }
    }
});var scroll=0;
mainCanvas["addEventListener"]?(window["addEventListener"]("mousewheel",zoom,!1),mainCanvas["addEventListener"]("DOMMouseScroll",zoom,!1)):window["attachEvent"]("onmousewheel",zoom);function zoom(a)
{
	a= window["event"]|| a;a["preventDefault"]();a["stopPropagation"]();scroll= Math["max"](-1,Math["min"](1,a["wheelDelta"]||  -a["detail"]));if(scroll==  -1)
	{
		if(maxScreenHeight< 10000)
		{
			(maxScreenHeight+= 250,maxScreenWidth+= 250,resize());scroll= 0
		}
	}
	if(scroll== 1)
	{
		if(maxScreenHeight> 1000)
		{
			(maxScreenHeight-= 250,maxScreenWidth-= 250,resize());scroll= 0
		}
	}
}
mainCanvas["onkeydown"]= function(event)
{
	var k=event["keyCode"]?event["keyCode"]:event["which"];
	if(k== 70)
	{
		if(maxScreenHeight< 10000)
		{
			(maxScreenHeight+= 250,maxScreenWidth+= 250,resize())
		}
	}
	if(k== 67)
	{
		if(maxScreenHeight> 1000)
		{
			(maxScreenHeight-= 250,maxScreenWidth-= 250,resize())
		}
	}
	{
		if(65== a|| 37== a)
		{
			cameraKeys["l"]= 0,updateCameraInput()
		}
		if(68== a|| 39== a)
		{
			cameraKeys["r"]= 0,updateCameraInput()
		}
		if(87== a|| 38== a)
		{
			cameraKeys["u"]= 0,updateCameraInput()
		}
		if(83== a|| 40== a)
		{
			cameraKeys["d"]= 0,updateCameraInput()
		}
		if(32== a)
		{
			var d=unitList["indexOf"](activeUnit);
			sendUnit(d)
		}
		void(0)!= upgrInputsToIndex["k"+ a]&& toggleActiveUnit(upgrInputsToIndex["k"+ a]);46== a&& selUnits["length"]&& sellSelUnits();84== a&& toggleChat("none"== chatListWrapper["style"]["display"]);27== a&& (toggleActiveUnit(),disableSelUnit(),showSelector=  !1);82== a&& (camY= camX= 0)
	}
}
;mainCanvas["onkeydown"]= function(a)
{
	a= a["keyCode"]?a["keyCode"]:a["which"];socket&& player&&  !player["dead"]&& (65!= a&& 37!= a|| cameraKeys["l"]|| (cameraKeys["l"]=  -1,cameraKeys["r"]= 0,updateCameraInput()),68!= a&& 39!= a|| cameraKeys["r"]|| (cameraKeys["r"]= 1,cameraKeys["l"]= 0,updateCameraInput()),87!= a&& 38!= a|| cameraKeys["u"]|| (cameraKeys["u"]=  -1,cameraKeys["d"]= 0,updateCameraInput()),83!= a&& 40!= a|| cameraKeys["d"]|| (cameraKeys["d"]= 1,cameraKeys["u"]= 0,updateCameraInput()))
}




addEventListener("keydown", function(a) {
    if (a.keyCode == 51) { //Generators
         for(i=-3.14;i<=2.36;i+=0.050){
              socket.emit("1",i,132,3);
       }
    }
    if (a.keyCode == 54) { //Armory
         socket.emit("1",UTILS.roundToTwo(2.75),UTILS.roundToTwo(175),7);
    }
    if (a.keyCode == 52) { //Houses
         for(i=-3.134;i<=2.492;i+=0.04620){
            socket.emit("1",i,194,4);
         }
    }

    if (a.keyCode == 50) {//Turrets
         socket.emit("1",2.75,245.75,2);socket.emit("1",2.50,245,2);socket.emit("1",3,245,2);
         for(i=-2.98;i<=2.2;i+=0.3235){
            socket.emit("1",i,245,2);
         }
    }
    if (a.keyCode == 49) {//Walls
         for(i=-3.14;i<3.14;i+=0.216){
             socket.emit("1",i,1e3,1);
         }
    }
    if (a.keyCode == 55) {//Barracks
        socket.emit("1",0.32,310,8);
        socket.emit("1",-0.98,310,8);
        socket.emit("1",1.61,310,8);
        socket.emit("1",-2.27,310,8);
    }
});

addEventListener("keydown", function(a) {
    if (a.keyCode == 77){
        for(i=0;i<users.length;++i){
            if(users[i].name.startsWith("[G]")&&users[i].name !== player.name){
                 camX = users[i].x-player.x;
                 camY = users[i].y-player.y;
            }
        }
   }
});



1
2
3
4
5
6
7
8
9
10
11
12
13
14
15


setInterval(updatePlayer,90000);
function updatePlayer(){
    socket.emit("2",0,0);
    socket.emit("2",Math.round(camX),Math.round(camY));
}



1
2
3
4
5
6
7
8


var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color:rgba(40,40,40,.5);margin-left: 3px;border-radius:4px;pointer-events:all}#upgradeScriptCont{top: -138px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;padding-top:15px;width:530px;height:128px;font-family:arial;left:28%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 14px;position: relative;left: 457px;bottom: 2px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="<div id=upgradeScriptCont><div id=layer1><div id=walls class=buttonClass onclick=walls()>Buy Walls</div><div id=upgradeBoulders class=buttonClass onclick=boulders()>Upgrade Boulders</div><div id=upgradeSpikes class=buttonClass onclick=spikes()>Upgrade Spikes</div><div id=upgradeGen class=buttonClass onclick=powerPlants()>Upgrade Power Plants</div></div><div id=layer2 style=margin-top:7px;margin-left:7px><div id=walls class=buttonClass onclick=generators()>Buy Generators</div><div id=upgradeBoulders class=buttonClass onclick=rapid()>Upgrade Rapid</div><div id=upgradeSpikes class=buttonClass onclick=ranged()>Upgrade Ranged</div><div id=upgradeGen class=buttonClass onclick=antiTank()>Upgrade anti-tank</div></div><div id=layer3 style=margin-top:7px;margin-left:-16px><div id=walls class=buttonClass onclick=gatlins()>Upgrade Gatlins</div><div id=upgradeBoulders class=buttonClass onclick=spotter()>Upgrade spotter</div><div id=upgradeMicro class=buttonClass onclick=microGenerators()>Upgrade Micro-Gen</div><div id=upgradeSpikes class=buttonClass onclick=semiAuto()>Upgrade Semi-auto</div></div><span class=hoverMessage>Hover over</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild),window.walls=function(){for(i=-3.14;i<3.14;i+=.108)socket.emit("1",i,1e3,1)},window.generators=function(){for(i=-3.14;i<3.14;i+=.075)socket.emit("1",i,132,3)},window.boulders=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.microGenerators=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.spikes=function(){for(i=0;i<units.length;++i)3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.powerPlants=function(){for(i=0;i<units.length;++i)0==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.rapid=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.ranged=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.antiTank=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.semiAuto=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.gatlins=function(){for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.spotter=function(){for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)};

var correct = `<div class="correctness  incorrect">Errado</div>`;
//document.body.style.backgroundImage = "url('http://eskipaper.com/images/blue-background-2.jpg')";


function clickelementbyname(elementname){
  document.getElementsByName(elementname)[0].click();
  }
/*
function clickelementbyclassname(elementclassname){
  document.getElementsByClassName(elementclassname)[0].click();
  }
*/

if(window.location.href.indexOf("nead.pro.br/mod/quiz/attempt.php?") > -1){
  console.log("Questionary page detected.");
  //var id = document.getElementsByName('questionids')[0].value;
  var s1 = document.getElementsByClassName('submit btn')[0].getAttribute('onclick').split(`'`)[1];
  var id = s1.split('q')[1];
  var questionID = document.getElementsByName('questionids')[0].value;
  var questioncode = document.getElementById(`q${id}`).innerHTML;
  var correctness = document.getElementsByClassName("correctness  correct")[0];
  console.log("Checking question grading.");
  if(correctness !== undefined){
    console.log("Question is right, saving data.");
    localStorage.setItem('que'+ id, questioncode);
    if(document.getElementsByClassName("next")[0] !== undefined){
      console.log("Going to next page.");
      document.getElementsByClassName("next")[0].click();
    }
    if(document.getElementsByClassName("next")[0] === undefined){
      console.log("Questionary is finished.");
      alert("Questionary is finished.");
    }
  }
  if(correctness === undefined){
    console.log("Question isn't right, looking for question data");
    if(localStorage.getItem('que' + id) === null){
      alert("No data found, you must answer this question");
      console.log("No data found, human must answer");
    }
    if(localStorage.getItem('que' + id) !== null){
      document.getElementById(`q${id}`).innerHTML = localStorage.getItem('que' + id);
      setTimeout(clickelementbyname, 250, 'resp' + id + '_submit');
      console.log("Data found, changing page.");
    }
  }
}




//CHAT IS SELECTED OR NO
chatInput.onfocus=function(){chatInput.isFocused=true;};
chatInput.onblur=function(){chatInput.isFocused=false;};

//DELETE PLAYER
addEventListener("keydown", function(a) {
    if(chatInput.isFocused===false&&a.keyCode==46){
        if(selUnits.length!==0){
            local.emit('del',selUnits[0].owner);
        }
    }
});

//AGROUP UNITS
addEventListener("keydown", function(a) {
    if(chatInput.isFocused===false&&a.keyCode==16){
        if(selUnits.length==4&&selUnits.length!==0){
            var center = selUnitsMidPoint();
            var points = [];
            points.push({x:center[0],y:center[1],moving:false});
            points.push({x:center[0]+275,y:center[1]+275,moving:false});
            points.push({x:center[0]+275,y:center[1],moving:false});
            points.push({x:center[0],y:center[1]+275,moving:false});
            for(o=0,e=selUnits;o<e.length;++o){
                var closest = 1000000000;
                for(i=0,e=points;i<points.length;++i){
                    var d=UTILS.getDistance(e[i].x,e[i].y,selUnits[o].x,selUnits[o].y);
                    if(i!==4){
                        if(e[i].moving===false&&d<closest){
                            closest=d;
                            local.emit("5",points[i].x,points[i].y,[selUnits[o].id],0,0);
                            if(selUnits[o].owner==player.sid){socket.emit("5",UTILS.roundToTwo(points[i].x),UTILS.roundToTwo(points[i].y),[selUnits[o].id],0,0);}
                        }
                    }
                    else{
                        closest=d;
                        if(selUnits[o].owner==player.sid){socket.emit("5",UTILS.roundToTwo(points[i].x),UTILS.roundToTwo(points[i].y),[selUnits[o].id],0,0);}
                        local.emit("5",points[i].x,points[i].y,[selUnits[o].id],0,0);
                    }
                }
            }
        }
    }
});


//CONNECT TO BOTS
    var local = connectLocal();
    function connectLocal(){
        const locallIo = io;
        return locallIo.connect('http://localhost:8080');
    }


//MID POS BETWEN UNITS
    function selUnitsMidPoint(){
        x=0;
        y=0;
        for(i=0,a=selUnits;i<a.length;++i){
            y=selUnits[i].y+y;
            x=selUnits[i].x+x;
        }
        return [x/a.length,y/a.length];
    }

//CREATE NEW SOLDIER
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 107) {
        local.emit("create");
    }
});


//GET BOTS CODE
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 9) {
        alert('node . '+socket.io.uri+' '+player.sid+' '+[KM]+'SOLDIER'+' 0');
    }
});var scroll=0;
mainCanvas["addEventListener"]?(window["addEventListener"]("mousewheel",zoom,!1),mainCanvas["addEventListener"]("DOMMouseScroll",zoom,!1)):window["attachEvent"]("onmousewheel",zoom);function zoom(a)
{
	a= window["event"]|| a;a["preventDefault"]();a["stopPropagation"]();scroll= Math["max"](-1,Math["min"](1,a["wheelDelta"]||  -a["detail"]));if(scroll==  -1)
	{
		if(maxScreenHeight< 10000)
		{
			(maxScreenHeight+= 250,maxScreenWidth+= 250,resize());scroll= 0
		}
	}
	if(scroll== 1)
	{
		if(maxScreenHeight> 1000)
		{
			(maxScreenHeight-= 250,maxScreenWidth-= 250,resize());scroll= 0
		}
	}
}
mainCanvas["onkeydown"]= function(event)
{
	var k=event["keyCode"]?event["keyCode"]:event["which"];
	if(k== 70)
	{
		if(maxScreenHeight< 10000)
		{
			(maxScreenHeight+= 250,maxScreenWidth+= 250,resize())
		}
	}
	if(k== 67)
	{
		if(maxScreenHeight> 1000)
		{
			(maxScreenHeight-= 250,maxScreenWidth-= 250,resize())
		}
	}
	{
		if(65== a|| 37== a)
		{
			cameraKeys["l"]= 0,updateCameraInput()
		}
		if(68== a|| 39== a)
		{
			cameraKeys["r"]= 0,updateCameraInput()
		}
		if(87== a|| 38== a)
		{
			cameraKeys["u"]= 0,updateCameraInput()
		}
		if(83== a|| 40== a)
		{
			cameraKeys["d"]= 0,updateCameraInput()
		}
		if(32== a)
		{
			var d=unitList["indexOf"](activeUnit);
			sendUnit(d)
		}
		void(0)!= upgrInputsToIndex["k"+ a]&& toggleActiveUnit(upgrInputsToIndex["k"+ a]);46== a&& selUnits["length"]&& sellSelUnits();84== a&& toggleChat("none"== chatListWrapper["style"]["display"]);27== a&& (toggleActiveUnit(),disableSelUnit(),showSelector=  !1);82== a&& (camY= camX= 0)
	}
}
;mainCanvas["onkeydown"]= function(a)
{
	a= a["keyCode"]?a["keyCode"]:a["which"];socket&& player&&  !player["dead"]&& (65!= a&& 37!= a|| cameraKeys["l"]|| (cameraKeys["l"]=  -1,cameraKeys["r"]= 0,updateCameraInput()),68!= a&& 39!= a|| cameraKeys["r"]|| (cameraKeys["r"]= 1,cameraKeys["l"]= 0,updateCameraInput()),87!= a&& 38!= a|| cameraKeys["u"]|| (cameraKeys["u"]=  -1,cameraKeys["d"]= 0,updateCameraInput()),83!= a&& 40!= a|| cameraKeys["d"]|| (cameraKeys["d"]= 1,cameraKeys["u"]= 0,updateCameraInput()))
}




addEventListener("keydown", function(a) {
    if (a.keyCode == 51) { //Generators
         for(i=-3.14;i<=2.36;i+=0.050){
              socket.emit("1",i,132,3);
       }
    }
    if (a.keyCode == 54) { //Armory
         socket.emit("1",UTILS.roundToTwo(2.75),UTILS.roundToTwo(175),7);
    }
    if (a.keyCode == 52) { //Houses
         for(i=-3.134;i<=2.492;i+=0.04620){
            socket.emit("1",i,194,4);
         }
    }

    if (a.keyCode == 50) {//Turrets
         socket.emit("1",2.75,245.75,2);socket.emit("1",2.50,245,2);socket.emit("1",3,245,2);
         for(i=-2.98;i<=2.2;i+=0.3235){
            socket.emit("1",i,245,2);
         }
    }
    if (a.keyCode == 49) {//Walls
         for(i=-3.14;i<3.14;i+=0.216){
             socket.emit("1",i,1e3,1);
         }
    }
    if (a.keyCode == 55) {//Barracks
        socket.emit("1",0.32,310,8);
        socket.emit("1",-0.98,310,8);
        socket.emit("1",1.61,310,8);
        socket.emit("1",-2.27,310,8);
    }
});

addEventListener("keydown", function(a) {
    if (a.keyCode == 77){
        for(i=0;i<users.length;++i){
            if(users[i].name.startsWith("[G]")&&users[i].name !== player.name){
                 camX = users[i].x-player.x;
                 camY = users[i].y-player.y;
            }
        }
   }
});



1
2
3
4
5
6
7
8
9
10
11
12
13
14
15


setInterval(updatePlayer,90000);
function updatePlayer(){
    socket.emit("2",0,0);
    socket.emit("2",Math.round(camX),Math.round(camY));
}



1
2
3
4
5
6
7
8


var headAppend=document.getElementsByTagName("head")[0],style=document.createElement("div");style.innerHTML="<style>#upgradeScriptCont,.buttonClass{background-color:rgba(40,40,40,.5);margin-left: 3px;border-radius:4px;pointer-events:all}#upgradeScriptCont{top: -138px;transition: 1s;margin-left:10px;position:absolute;padding-left:24px;margin-top:9px;padding-top:15px;width:530px;height:128px;font-family:arial;left:28%}#upgradeScriptCont:hover{top:0px}.buttonClass{color:#fff;padding:7px;height:19px;display:inline-block;cursor:pointer;font-size:15px}.hoverMessage{color: white;font-size: 14px;position: relative;left: 457px;bottom: 2px;pointer-events: none;}</style>",headAppend.appendChild(style);var contAppend=document.getElementById("gameUiContainer"),menuA=document.createElement("div");menuA.innerHTML="<div id=upgradeScriptCont><div id=layer1><div id=walls class=buttonClass onclick=walls()>Buy Walls</div><div id=upgradeBoulders class=buttonClass onclick=boulders()>Upgrade Boulders</div><div id=upgradeSpikes class=buttonClass onclick=spikes()>Upgrade Spikes</div><div id=upgradeGen class=buttonClass onclick=powerPlants()>Upgrade Power Plants</div></div><div id=layer2 style=margin-top:7px;margin-left:7px><div id=walls class=buttonClass onclick=generators()>Buy Generators</div><div id=upgradeBoulders class=buttonClass onclick=rapid()>Upgrade Rapid</div><div id=upgradeSpikes class=buttonClass onclick=ranged()>Upgrade Ranged</div><div id=upgradeGen class=buttonClass onclick=antiTank()>Upgrade anti-tank</div></div><div id=layer3 style=margin-top:7px;margin-left:-16px><div id=walls class=buttonClass onclick=gatlins()>Upgrade Gatlins</div><div id=upgradeBoulders class=buttonClass onclick=spotter()>Upgrade spotter</div><div id=upgradeMicro class=buttonClass onclick=microGenerators()>Upgrade Micro-Gen</div><div id=upgradeSpikes class=buttonClass onclick=semiAuto()>Upgrade Semi-auto</div></div><span class=hoverMessage>Hover over</span></div>",contAppend.insertBefore(menuA,contAppend.firstChild),window.walls=function(){for(i=-3.14;i<3.14;i+=.108)socket.emit("1",i,1e3,1)},window.generators=function(){for(i=-3.14;i<3.14;i+=.075)socket.emit("1",i,132,3)},window.boulders=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.microGenerators=function(){for(i=0;i<units.length;++i)3==units[i].type&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.spikes=function(){for(i=0;i<units.length;++i)3==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.powerPlants=function(){for(i=0;i<units.length;++i)0==units[i].type&&"hexagon"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.rapid=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.ranged=function(){for(i=0;i<units.length;++i)0==units[i].type&&1==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.antiTank=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,1)},window.semiAuto=function(){for(i=0;i<units.length;++i)0==units[i].type&&4==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.gatlins=function(){for(i=0;i<units.length;++i)0==units[i].type&&2==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)},window.spotter=function(){for(i=0;i<units.length;++i)0==units[i].type&&3==units[i].turretIndex&&"circle"==units[i].shape&&units[i].owner==player.sid&&socket.emit("4",units[i].id,0)};

var correct = `<div class="correctness  incorrect">Errado</div>`;
//document.body.style.backgroundImage = "url('http://eskipaper.com/images/blue-background-2.jpg')";


function clickelementbyname(elementname){
  document.getElementsByName(elementname)[0].click();
  }
/*
function clickelementbyclassname(elementclassname){
  document.getElementsByClassName(elementclassname)[0].click();
  }
*/

if(window.location.href.indexOf("nead.pro.br/mod/quiz/attempt.php?") > -1){
  console.log("Questionary page detected.");
  //var id = document.getElementsByName('questionids')[0].value;
  var s1 = document.getElementsByClassName('submit btn')[0].getAttribute('onclick').split(`'`)[1];
  var id = s1.split('q')[1];
  var questionID = document.getElementsByName('questionids')[0].value;
  var questioncode = document.getElementById(`q${id}`).innerHTML;
  var correctness = document.getElementsByClassName("correctness  correct")[0];
  console.log("Checking question grading.");
  if(correctness !== undefined){
    console.log("Question is right, saving data.");
    localStorage.setItem('que'+ id, questioncode);
    if(document.getElementsByClassName("next")[0] !== undefined){
      console.log("Going to next page.");
      document.getElementsByClassName("next")[0].click();
    }
    if(document.getElementsByClassName("next")[0] === undefined){
      console.log("Questionary is finished.");
      alert("Questionary is finished.");
    }
  }
  if(correctness === undefined){
    console.log("Question isn't right, looking for question data");
    if(localStorage.getItem('que' + id) === null){
      alert("No data found, you must answer this question");
      console.log("No data found, human must answer");
    }
    if(localStorage.getItem('que' + id) !== null){
      document.getElementById(`q${id}`).innerHTML = localStorage.getItem('que' + id);
      setTimeout(clickelementbyname, 250, 'resp' + id + '_submit');
      console.log("Data found, changing page.");
    }
  }
}




//CHAT IS SELECTED OR NO
chatInput.onfocus=function(){chatInput.isFocused=true;};
chatInput.onblur=function(){chatInput.isFocused=false;};

//DELETE PLAYER
addEventListener("keydown", function(a) {
    if(chatInput.isFocused===false&&a.keyCode==46){
        if(selUnits.length!==0){
            local.emit('del',selUnits[0].owner);
        }
    }
});

//AGROUP UNITS
addEventListener("keydown", function(a) {
    if(chatInput.isFocused===false&&a.keyCode==16){
        if(selUnits.length==4&&selUnits.length!==0){
            var center = selUnitsMidPoint();
            var points = [];
            points.push({x:center[0],y:center[1],moving:false});
            points.push({x:center[0]+275,y:center[1]+275,moving:false});
            points.push({x:center[0]+275,y:center[1],moving:false});
            points.push({x:center[0],y:center[1]+275,moving:false});
            for(o=0,e=selUnits;o<e.length;++o){
                var closest = 1000000000;
                for(i=0,e=points;i<points.length;++i){
                    var d=UTILS.getDistance(e[i].x,e[i].y,selUnits[o].x,selUnits[o].y);
                    if(i!==4){
                        if(e[i].moving===false&&d<closest){
                            closest=d;
                            local.emit("5",points[i].x,points[i].y,[selUnits[o].id],0,0);
                            if(selUnits[o].owner==player.sid){socket.emit("5",UTILS.roundToTwo(points[i].x),UTILS.roundToTwo(points[i].y),[selUnits[o].id],0,0);}
                        }
                    }
                    else{
                        closest=d;
                        if(selUnits[o].owner==player.sid){socket.emit("5",UTILS.roundToTwo(points[i].x),UTILS.roundToTwo(points[i].y),[selUnits[o].id],0,0);}
                        local.emit("5",points[i].x,points[i].y,[selUnits[o].id],0,0);
                    }
                }
            }
        }
    }
});


//CONNECT TO BOTS
    var local = connectLocal();
    function connectLocal(){
        const locallIo = io;
        return locallIo.connect('http://localhost:8080');
    }


//MID POS BETWEN UNITS
    function selUnitsMidPoint(){
        x=0;
        y=0;
        for(i=0,a=selUnits;i<a.length;++i){
            y=selUnits[i].y+y;
            x=selUnits[i].x+x;
        }
        return [x/a.length,y/a.length];
    }

//CREATE NEW SOLDIER
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 107) {
        local.emit("create");
    }
});


//GET BOTS CODE
addEventListener("keydown", function(a) {
    if (chatInput.isFocused===false&&a.keyCode == 9) {
        alert('node . '+socket.io.uri+' '+player.sid+' '+[KM]+'SOLDIER'+' 0');
    }
});

window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

    if (a === 81) { // All troops except commander
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                unit.info.name !== 'Commander' && selUnits.push(unit)

            }
        });
        selUnitType = "Unit";
    } else if (a === 69) { // Everything
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                selUnits.push(unit)
            }
        });
        selUnitType = "Unit";
    } else if (a === 67) { // Commander
        selUnits = [];
        units.every((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                if (unit.info.name === 'Commander') {
                    selUnits.push(unit)
                    return false;
                }
            }
            return true;
        });
        selUnitType = "Unit";
    }
});

var gotoUsers = [];
var gotoIndex = 0;
window.overrideSocketEvents = window.overrideSocketEvents || [];
window.chatCommands = window.chatCommands || {};

window.chatCommands.find = function(split) {
    var name = split.slice(1).join(' ');
    if (name == '') {
        addChat('Please specify a username', 'Client')
        return;
    }
    window.goto(name)
}
window.overrideSocketEvents.push({
    name: "l",
    description: "Leaderboard Insta Find override",
    func: function(a) {
        var d = "",
            c = 1,
            b = 0;
        for (; b < a.length;) {
            d += "<div class='leaderboardItem' onclick=goto2(" + a[b] + ");><div style='display:inline-block;float:left;' class='whiteText'>" + c + ".</div> <div class='" + (player && a[b] == player.sid ? "leaderYou" : "leader") + "'>" + a[b + 1] + "</div><div class='scoreText'>" + a[b + 2] + "</div></div>", c++, b += 3;
        }
        leaderboardList.innerHTML = d;
    }
})
leaderboardList.style.pointerEvents = 'auto';
chatListWrapper.style.pointerEvents = 'auto';

window.goto = function(username) {
    gotoUsers = users.filter((user) => {
        return user.name === username
    });
    gotoIndex = 0;
    if (gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    addChat(gotoUsers.length + ' users found with the name ' + username, 'Client');
    return gotoUsers.length;
}
window.goto2 = function(id, go) {
    gotoUsers = users.filter((user) => {
        return user.sid === id;
    });
    gotoIndex = 0;
    if (!go && gotoUsers[0]) {
        camX = gotoUsers[0].x - player.x;
        camY = gotoUsers[0].y - player.y;
    }
    return gotoUsers.length;
}

window.gotoLeft = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex <= 0) gotoIndex = gotoUsers.length;
        gotoIndex--;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.gotoRight = function() {
    if (!gotoUsers.length) return;

    if (camX == gotoUsers[gotoIndex].x - player.x && camY == gotoUsers[gotoIndex].y - player.y) {
        if (gotoIndex >= gotoUsers.length - 1) gotoIndex = -1;
        gotoIndex++;
    }
    camX = gotoUsers[gotoIndex].x - player.x;
    camY = gotoUsers[gotoIndex].y - player.y;
}

window.addChat = function(msg, from, color) {
    color = color || "#fff";
    var b = document.createElement("li");
    b.className = "chatother";
    b.innerHTML = '<span style="color:' + color + '">[' + from + ']</span> <span class="chatText">' + msg + "</span>";
    10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
    chatList.appendChild(b)
}

window.resetCamera = function() { // Override
    camX = camXS = camY = camYS = 0;
    cameraKeys = {
        l: 0,
        r: 0,
        u: 0,
        d: 0
    }

    if (socket && window.overrideSocketEvents && window.overrideSocketEvents.length) {
        window.overrideSocketEvents.forEach((item) => {
            socket.removeAllListeners(item.name)
            socket.on(item.name, item.func);

        });

    }
}



window.addChatLine = function(a, d, c) {
    if (player) {
        var b = getUserBySID(a);
        if (c || 0 <= b) {
            var g = c ? "SERVER" : users[b].name;
            c = c ? "#fff" : playerColors[users[b].color] ? playerColors[users[b].color] : playerColors[0];
            player.sid == a && (c = "#fff");
            b = document.createElement("li");
            b.className = player.sid == a ? "chatme" : "chatother";

            b.innerHTML = '<span style="color:' + c + '" onclick=goto2(' + a + ');>[' + g + ']</span> <span class="chatText">' + d + "</span>";
            10 < chatList.childNodes.length && chatList.removeChild(chatList.childNodes[0]);
            chatList.appendChild(b)
        }
    }
}

window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;
    if (a === 190) {
        window.gotoRight()
    } else if (a === 188) {
        window.gotoLeft();
    }

});

window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];


window.UIList.push({
    level: 0,
    x: 0,
    html: '<div onclick=buildGenerators()>Build Generators</div>'
}, {
    level: 0,
    x: 1,
    html: '<div onclick=walls()>Build Walls</div>'
}, {
    level: 0,
    x: 2,
    html: '<div onclick=buildHouses()>Build Offense</div>'
}, {
    level: 0,
    x: 4,
    html: '<div onclick=buildHybrid()>Build Hybrid</div>'
}, {
    level: 1,
    x: 0,
    html: '<div onclick=boulders()>Upgrade Boulders</div>'
}, {
    level: 1,
    x: 1,
    html: '<div onclick=spikes()>Upgrade Spikes</div>'
}, {
    level: 1,
    x: 2,
    html: '<div onclick=microGenerators()>Mico-Generators</div>'
}, {
    level: 1,
    x: 3,
    html: '<div onclick=powerPlants()>Upgrade Power Plants</div>'
}, {
    level: 2,
    x: 0,
    html: '<div onclick=sellGenerators()>Sell Generators</div>'
}, {
    level: 2,
    x: 1,
    html: '<div onclick=sellall()>Sell all</div>'
});

function emit2() {
    socket.emit.apply(socket, arguments);
}
window.walls = function () {
    for (i = -3.14; i < 3.14; i += .108) emit2("1", i, 1e3, 1)
}
window.sellGenerators = window.sellGenerators || function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            var name = getUnitFromPath(units[d].uPath).name;
            (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellhouses = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellwalls = function () {
    for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}
window.sellinner = function () {
    for (var a = [], d = 0; d < units.length; ++d) {
        if (units[d].type === 0 && units[d].owner == player.sid) {
            a.push(units[d].id)
        }
    }
    socket.emit("3", a)
}
window.sellall = function () {
    for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);
    socket.emit("3", a)
}
window.boulders = window.boulders || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.microGenerators = window.microGenerators || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.spikes = window.spikes || function () {
    for (var i = 0; i < units.length; ++i) 3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.powerPlants = window.powerPlants || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.rapid = window.rapid || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.ranged = window.ranged || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 1 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.antiTank = window.antiTank || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
window.semiAuto = window.semiAuto || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.gatlins = window.gatlins || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 2 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
}
window.spotter = window.spotter || function () {
    for (var i = 0; i < units.length; ++i) 0 == units[i].type && 3 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
};
window.build = function (instr) {
    instr.forEach((ins) => {
        emit2.apply({}, ins);
    })
}
window.buildHybrid = function () {
    window.build([["1", 3.13, 243.85, 5], ["1", 2.87, 246.85, 2], ["1", 2.62, 243.85, 5], ["1", 2.37, 246.85, 2], ["1", 2.11, 243.85, 5], ["1", 1.86, 246.85, 2], ["1", 1.6, 243.85, 5], ["1", 1.34, 246.85, 2], ["1", 1.08, 243.85, 5], ["1", 0.82, 246.85, 2], ["1", 0.56, 243.85, 5], ["1", 0.3, 246.85, 2], ["1", 0.04, 243.85, 5], ["1", -0.21, 246.85, 2], ["1", -0.46, 243.85, 5], ["1", -0.72, 246.85, 2], ["1", -0.98, 243.85, 5], ["1", -1.23, 246.85, 2], ["1", -1.49, 243.85, 5], ["1", -1.74, 246.85, 2], ["1", -1.99, 243.85, 5], ["1", -2.25, 246.85, 2], ["1", -2.51, 243.85, 5], ["1", -2.77, 246.85, 2], ["1", 2.77, 190.49, 2], ["1", 2.43, 187.99, 2], ["1", 1.96, 188.53, 2], ["1", 2.76, 130, 4], ["1", 2.28, 130, 4], ["1", 1.79, 130, 4], ["1", 1.28, 130, 4], ["1", 0.79, 130, 4], ["1", 0.28, 130, 4], ["1", -0.19, 130, 4], ["1", -0.67, 130, 4], ["1", -1.17, 130, 4], ["1", -1.64, 130, 4], ["1", -2.13, 130, 4], ["1", -2.61, 130, 4], ["1", -3.06, 138.27, 4], ["1", -2.94, 195.69, 2], ["1", -2.4, 183.33, 2], ["1", -1.91, 180.8, 2], ["1", -1.41, 182.01, 2], ["1", -0.94, 182.52, 2], ["1", -0.45, 180.37, 2], ["1", 0.04, 178.74, 2], ["1", 0.53, 177.22, 2], ["1", 1.03, 181.72, 2], ["1", 1.49, 184.1, 2]]);
}
window.buildHouses = function () {
    window.build([["1", -0.09, 245.4, 1], ["1", 0.16, 243.15, 1], ["1", 0.41, 243.84, 1], ["1", 0.67, 244.57, 1], ["1", 0.04, 183.15, 5], ["1", 0.39, 184.96, 2], ["1", 0.72, 184.99, 4], ["1", 0.92, 245.85, 4], ["1", -0.34, 245.85, 4], ["1", -0.34, 140, 7], ["1", -0.6, 245.85, 4], ["1", 0.25, 130, 4], ["1", -0.88, 130, 4], ["1", -1.37, 130, 4], ["1", -1.86, 130, 4], ["1", -2.36, 130, 4], ["1", -2.88, 130, 4], ["1", 2.85, 130, 4], ["1", 2.36, 130, 4], ["1", 1.85, 130, 4], ["1", 1.38, 130, 4], ["1", 0.9, 130, 4], ["1", 1.19, 245.85, 4], ["1", 1.46, 245.85, 4], ["1", 1.73, 245.85, 4], ["1", 2, 245.85, 4], ["1", 2.26, 245.85, 4], ["1", 2.52, 245.85, 4], ["1", 2.78, 245.85, 4], ["1", 3.04, 245.85, 4], ["1", -2.99, 245.85, 4], ["1", -2.74, 245.85, 4], ["1", -2.49, 245.85, 4], ["1", -2.24, 245.85, 4], ["1", -1.99, 245.85, 4], ["1", -1.74, 245.85, 4], ["1", -1.48, 245.85, 4], ["1", -1.23, 245.85, 4], ["1", -0.94, 245.85, 4], ["1", -0.72, 187.11, 4], ["1", -1.06, 186.05, 4], ["1", -1.53, 186.15, 4], ["1", -1.87, 191.23, 4], ["1", -2.21, 185.53, 4], ["1", -2.55, 184.19, 4], ["1", 1.07, 186.28, 4], ["1", 1.61, 184.13, 4], ["1", 2.07, 185.66, 4], ["1", 2.39, 192.03, 4], ["1", 2.71, 186.8, 4], ["1", 3.06, 185.93, 4]])
    //     window.build([["1", 0.24, 245.85, 4], ["1", 0.49, 245.85, 4], ["1", 0.74, 245.85, 4], ["1", -0.01, 245.85, 4], ["1", -0.26, 245.85, 4], ["1", -0.51, 245.85, 4], ["1", 1, 245.85, 4], ["1", 1.25, 245.85, 4], ["1", 1.5, 245.85, 4], ["1", 1.75, 245.85, 4], ["1", 2, 245.85, 4], ["1", 2.25, 245.85, 4], ["1", 2.5, 245.85, 4], ["1", 2.75, 245.85, 4], ["1", 3.01, 245.85, 4], ["1", -3.03, 245.85, 4], ["1", -3.01, 245.85, 4], ["1", -2.75, 245.85, 4], ["1", -2.49, 245.85, 4], ["1", -2.24, 245.85, 4], ["1", -1.98, 245.85, 4], ["1", -1.72, 245.85, 4], ["1", -1.46, 245.85, 4], ["1", -1.21, 245.85, 4], ["1", -0.96, 245.85, 4], ["1", -0.72, 203.14, 4], ["1", -0.39, 190.85, 4], ["1", -0.59, 130, 4], ["1", -0.05, 185.69, 4], ["1", 0.11, 130, 4], ["1", 0.31, 185.08, 5], ["1", 0.66, 187.02, 4], ["1", 1.02, 184.03, 4], ["1", 0.84, 130, 4], ["1", 1.36, 189.19, 4], ["1", 1.7, 186.55, 4], ["1", 1.44, 130, 4], ["1", 2.05, 186.48, 4], ["1", 1.92, 130, 4], ["1", 1.91, 130, 4], ["1", 2.38, 191.67, 4], ["1", 2.38, 130, 4], ["1", 2.71, 185.92, 4], ["1", 3.05, 185.84, 4], ["1", 2.87, 130, 4], ["1", -2.9, 188.9, 4], ["1", -2.57, 187.48, 4], ["1", -2.74, 130, 4], ["1", -2.24, 185.43, 4], ["1", -1.91, 186.44, 4], ["1", -2.07, 130, 4], ["1", -1.57, 190.81, 4], ["1", -1.58, 186.32, 4], ["1", -1.42, 130, 4], ["1", -1.24, 186.06, 4]]);
}
window.buildGenerators = function () {
    var arr = [["1", 3.11, 243.85, 3], ["1", -2.9, 243.85, 3], ["1", -2.63, 243.85, 3], ["1", -2.36, 243.85, 3], ["1", -2.06, 243.85, 3], ["1", -1.77, 243.85, 3], ["1", -1.5, 243.85, 3], ["1", -1.22, 243.85, 3], ["1", -0.94, 243.85, 3], ["1", -0.64, 243.85, 3], ["1", -0.36, 243.85, 3], ["1", -0.07, 243.85, 3], ["1", 0.2, 243.85, 3], ["1", 0.47, 243.85, 3], ["1", 0.76, 243.85, 3], ["1", 1.05, 243.85, 3], ["1", 1.35, 243.85, 3], ["1", 1.64, 243.85, 3], ["1", 1.92, 243.85, 3], ["1", 2.22, 243.85, 3], ["1", 2.49, 243.85, 3], ["1", 2.78, 243.85, 3], ["1", 3, 183.39, 3], ["1", -2.91, 178.82, 3], ["1", -2.5, 182.85, 3], ["1", -2.11, 178.92, 3], ["1", -1.72, 176.82, 3], ["1", -1.35, 177.59, 3], ["1", -0.98, 174.52, 3], ["1", -0.57, 179.76, 3], ["1", -0.19, 183.42, 3], ["1", 0.21, 176.37, 3], ["1", 0.63, 179.87, 3], ["1", 1.03, 175.57, 3], ["1", 1.43, 176.6, 3], ["1", 1.8, 181.19, 3], ["1", 2.19, 177.95, 3], ["1", 2.6, 178.66, 3]]
    window.build(arr);
}
window.makeUI = function () {
    if (window.hasMadeUI) return;
    window.hasMadeUI = true;
    window.statusItems.sort(function (a, b) {
        return a.order - b.order;
    })
    var levels = [];
    window.UIList.forEach((item) => {
        if (!levels[item.level]) levels[item.level] = [];
        levels[item.level].push(item)
    })

    levels = levels.filter((a) => {
        if (a) {
            a.sort(function (a, b) {
                return a.x - b.x;
            })
            return true;
        } else {
            return false;
        }
    })

    var headAppend = document.getElementsByTagName("head")[0],
        style = document.createElement("div");

    var toast = document.createElement('div');
    toast.id = "snackbar";
    var css = document.createElement('div');

    css.innerHTML = '<style>\n\
#snackbar {\n\
    visibility: hidden;\n\
    min-width: 250px;\n\
    margin-left: -125px;\n\
    background-color: rgba(40, 40, 40, 0.5);\n\
    color: #fff;\n\
    text-align: center;\n\
    border-radius: 4px;\n\
    padding: 10px;\n\
    font-family: "regularF";\n\
    font-size: 20px;\n\
    position: fixed;\n\
    z-index: 100;\n\
    left: 50%;\n\
    top: 30px;\n\
}\n\
#snackbar.show {\n\
    visibility: visible;\n\
    -webkit-animation: fadein 0.5s;\n\
    animation: fadein 0.5s;\n\
}\n\
#snackbar.hide {\n\
    visibility: visible;\n\
    -webkit-animation: fadeout 0.5s;\n\
    animation: fadeout 0.5s;\n\
}\n\
@-webkit-keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@keyframes fadein {\n\
    from {top: 0; opacity: 0;}\n\
    to {top: 30px; opacity: 1;}\n\
}\n\
@-webkit-keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
@keyframes fadeout {\n\
    from {top: 30px; opacity: 1;}\n\
    to {top: 0; opacity: 0;}\n\
}\n\
</style>'
    var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 15;
    style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
    background-color:rgba(40,40,40,.5);\n\
    margin-left: 3px;\n\
    border-radius:4px;\n\
    pointer-events:all\n\
}\n\
#noobscriptUI {\n\
    top: -" + (height + 12) + "px;\n\
    transition: 1s;\n\
    margin-left:10px;\n\
    position:absolute;\n\
    padding-left:24px;\n\
    margin-top:9px;\n\
    padding-top:15px;\n\
    width:580px;\n\
    height: " + height + "px;\n\
    font-family:arial;\n\
    left:25%\n\
}\n\
#noobscriptUI:hover{\n\
    top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
    color:#fff;\n\
    padding:7px;\n\
    height:19px;\n\
    display:inline-block;\n\
    cursor:pointer;\n\
    font-size:15px\n\
}\n\
</style>"

    headAppend.appendChild(style);
    headAppend.appendChild(css);


    var contAppend = document.getElementById("gameUiContainer"),
        menuA = document.createElement("div");

    var code = ['<div id="noobscriptUI">\n'];

    levels.forEach((items, i) => {
        code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
        items.forEach((el) => {
            code.push('        ' + el.html + '\n');
        })
        code.push('    </div>\n');
    })
    code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
    code.push('</div>');

    menuA.innerHTML = code.join("");
    contAppend.insertBefore(menuA, contAppend.firstChild)
    contAppend.appendChild(toast)
    var toastTimeout = false;
    window.showToast = function (msg) {
        toast.textContent = msg;

        if (toastTimeout) clearTimeout(toastTimeout);
        else toast.className = "show";
        toastTimeout = setTimeout(function () {
            toast.className = 'hide'
            setTimeout(function () {
                toast.className = '';
            }, 400);
            toastTimeout = false;
        }, 3000);
    }
    window.statusBar = function () {
        var el = document.getElementById('confinfo');
        var text = [];

        window.statusItems.forEach((item, i) => {
            if (i !== 0) text.push('     ');
            if (item.name) text.push(item.name + ': ');
            text.push(item.value());
        })

        el.textContent = text.join('');
    }
    window.statusBar();

    window.initFuncs.forEach((func) => {
        func();
    })
}
setTimeout(() => {
    window.makeUI();
}, 1000)(function() {
    'use strict';

    // Your code here...
})();addEventListener("keydown", function(a) {
    if (a.keyCode == 80) { //Generators
              socket.emit("1",2.10,132,2);
              socket.emit("1",2.62,132,2);
              socket.emit("1",3.14,132,2);
              socket.emit("1",3.66,132,2);
              socket.emit("1",4.18,132,2);
              socket.emit("1",4.70,132,5);
              socket.emit("1",5.22,132,2);
              socket.emit("1",5.74,132,2);
              socket.emit("1",6.26,132,2);
              socket.emit("1",6.78,132,2);
              socket.emit("1",7.30,132,2);
              socket.emit("1",2.35,132,2);
              socket.emit("1",1.89,186,5);
              socket.emit("1",2.35,184,5);
              socket.emit("1",2.88,184,5);
              socket.emit("1",3.41,184,5);
              socket.emit("1",3.93,184,5);
              socket.emit("1",4.45,184,5);
              socket.emit("1",4.97,184,5);
              socket.emit("1",5.47,184,5);
              socket.emit("1",5.98,184,5);
              socket.emit("1",6.51,184,5);
              socket.emit("1",7.03,184,5);
              socket.emit("1",7.50,186,5);
       }
    if (a.keyCode == 186) {//Walls
         for(i=-3.14;i<3.14;i+=0.075){
             socket.emit("1",i,1e3,1);
         }
    }
    if (a.keyCode == 80) { //Armory
         socket.emit("1",UTILS.roundToTwo(1.56),UTILS.roundToTwo(132),5);
    }
    if (a.keyCode == 76) { //Houses
            socket.emit("1",2.54,245,3);
            socket.emit("1",2.82,245,3);
            socket.emit("1",3.09,245,3);
            socket.emit("1",3.36,245,3);
            socket.emit("1",3.62,245,3);
            socket.emit("1",3.90,245,3);
            socket.emit("1",4.17,245,3);
            socket.emit("1",4.44,245,3);
            socket.emit("1",5.02,245,3);
            socket.emit("1",5.29,245,3);
            socket.emit("1",5.56,245,3);
            socket.emit("1",5.82,245,3);
            socket.emit("1",6.08,245,3);
            socket.emit("1",6.35,245,3);
            socket.emit("1",6.62,245,3);
            socket.emit("1",6.90,245,3);
            socket.emit("1",7.44,245,3);
            socket.emit("1",7.72,245,3);
            socket.emit("1",8.00,245,3);
            socket.emit("1",8.28,245,3);
            socket.emit("1",7.44,245,3);
            socket.emit("1",7.72,245,3);
            socket.emit("1",8.00,245,3);
            socket.emit("1",8.28,245,3);
            socket.emit("1",4.72,245,3);
            socket.emit("1",2.26,245,3);
            socket.emit("1",7.19,245,3);
         }
});
