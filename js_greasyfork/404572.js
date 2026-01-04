// ==UserScript==
// @name        [KR] Rommel power infinito
// @namespace    none
// @version      1.1
// @description  hihihi
// @author[KM]
// @match        http://bloble.io/*
// @match        http://www.bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404572/%5BKR%5D%20Rommel%20power%20infinito.user.js
// @updateURL https://update.greasyfork.org/scripts/404572/%5BKR%5D%20Rommel%20power%20infinito.meta.js
// ==/UserScript==


var scroll=0;
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