// ==UserScript==
// @name Slither.io auto play bot
// @include     http://slither.com/io
// @author      huesos315
// @description auto play bot for slither.io 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        *://Slither.com/io*
// @downloadURL https://update.greasyfork.org/scripts/502345/Slitherio%20auto%20play%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/502345/Slitherio%20auto%20play%20bot.meta.js
// ==/UserScript==

var el = document.getElementsByTagName('iframe');

for (var i = 0; i < el.length; i++) {
    var currentEl = el[i];
    currentEl.remove();
}

document.getElementById('logo').remove();
document.getElementById('tips').remove();
document.getElementById('fb').remove();
document.getElementById('twth').remove();


if (window.top != window.self) 

REALSCORE = 10;
REALDNA = [1,1,1,1,1,1,1,1,1,1,1,1];

BESTRANK = 1000;
BESTSCORE = 1;

printbot = function() {
	console.log("Dumping bot data:\nREALDNA = " + JSON.stringify(REALDNA) + ";\nREALSCORE = " + REALSCORE + ";\nBESTRANK = " + BESTRANK + ";\nBESTSCORE = " + BESTSCORE + ";");
}

savedna = function() {
	if(typeof(Storage) !== "undefined") {
		localStorage["REALSCORE"] = REALSCORE;
		localStorage["REALDNA"] = JSON.stringify(REALDNA);
		localStorage["BESTRANK"] = BESTRANK;
		localStorage["BESTSCORE"] = BESTSCORE;
	}		
}

cleardna = function() {
	localStorage.removeItem("REALSCORE");
	localStorage.removeItem("REALDNA");
	
	localStorage.removeItem("BESTRANK");
	localStorage.removeItem("BESTSCORE");
	
	REALSCORE = 30;
	BESTRANK = 1000;
	
	var distavoid = 90;
	var preykerroin = 5;
	var viholliskerroin = 544;
	var vaarakerroin = 200;
	var chargedistance = 500;
	var pakoondistance = 70;
	var keskikerroin = 2.0;
	var keskihakukerroin = 0.1;

	REALDNA = [distavoid,preykerroin,viholliskerroin,vaarakerroin,chargedistance,pakoondistance,keskikerroin,keskihakukerroin];
		
	TESTDNA = REALDNA.slice();
	TESTSCORE = REALSCORE;
	
	testingdna = 1;
	DNA = REALDNA.slice();
	
	savedna();
}

if(typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
	
	if (!localStorage.REALSCORE || !localStorage.REALDNA || !localStorage.BESTRANK || !localStorage.BESTSCORE) {
		cleardna();
	}
	else
	{
		REALSCORE = localStorage["REALSCORE"]*1;
		REALDNA = JSON.parse(localStorage["REALDNA"]);
		BESTRANK = localStorage["BESTRANK"]*1;
		BESTSCORE = localStorage["BESTSCORE"]*1;
	}
} else {
    // Sorry! No Web Storage support..
}


TESTDNA = REALDNA.slice();
TESTSCORE = REALSCORE;

testingdna = 1;
DNA = REALDNA.slice();

var injected_dead = true;

var lastscore = 0;
var bestscore = 0;

var lastrank = 0;
var bestrank = 1000;
var uhka = false;


var ruokakerroin = 1/40;
var ruokapower = 1;
var vihollispower = 2;
var vaarapower = 2;
var preypower = 1;
var keskipower = 1;


var preychase = true;

var learnrate = 0.3;
var	precision = 100;


	
INJECTED = function() {
	var kerroin = 10000;
	if (animating) {
		if (snake) {
			accelerate = false;
			injected_dead = false;
			
			//xm = grd-snake.xx;
			//ym = grd-snake.yy;
			
			xt = 0;
			yt = 0;
			
			mindist = grd;
			
			
			for (var i = 0; i < preys.length; i++) {
				xtd = (preys[i].xx-snake.xx);
				ytd = (preys[i].yy-snake.yy);
				
				dist = Math.sqrt(xtd*xtd + ytd*ytd);
				
				xt += xtd/Math.pow(dist,preypower+1)*DNA[1];
				yt += ytd/Math.pow(dist,preypower+1)*DNA[1];
				
				if (dist < DNA[4] && preychase)
				{
					accelerate = true;
				}
			}

			uhka = false;
			for (var i = 0; i < snakes.length; i++) {
				//alert(myStringArray[i]);
				
				target = snakes[i];
				
				if (snake.id!=target.id)
				{
					xtd = (target.xx-snake.xx);
					ytd = (target.yy-snake.yy);
					
					dist = Math.sqrt(xtd*xtd + ytd*ytd)-DNA[0];
					dist = Math.max(1, dist);
					
					xt += -xtd/Math.pow(dist,vihollispower+1)*DNA[2];
					yt += -ytd/Math.pow(dist,vihollispower+1)*DNA[2];
					
					
					
					if (dist < DNA[5])
					{
						accelerate = true;
					}
					
					if (dist<mindist)
					{
						uhka = target;
						mindist = dist;
						/*if (mindist<300)
						{
							accelerate = true;
						}*/
					}
					
					parts = target.pts;
					for (var k = 0; k < parts.length; k++)
					{
						part = parts[k];
					
						xtd = (part.xx-snake.xx);
						ytd = (part.yy-snake.yy);
						
						dist = Math.sqrt(xtd*xtd + ytd*ytd)-DNA[0];
						dist = Math.max(1, dist);
						
						xt += -xtd/Math.pow(dist,vaarapower+1)*DNA[3];
						yt += -ytd/Math.pow(dist,vaarapower+1)*DNA[3];
					}
		
				}
			}
			
						
			if (!(preychase && preys.length>0))
			{
				for (var i = 0; i < foods_c; i++) {
					//alert(myStringArray[i]);
					
					xtd = (foods[i].xx-snake.xx);
					ytd = (foods[i].yy-snake.yy);
					
					dist = Math.sqrt(xtd*xtd + ytd*ytd);
					
					//xt += Math.pow(ruokakerroin*foods[i].fw,2)*xtd/Math.pow(dist,ruokapower+1);
					//yt += Math.pow(ruokakerroin*foods[i].fw,2)*ytd/Math.pow(dist,ruokapower+1);
					xt += Math.pow(foods[i].gr,2)*xtd/Math.pow(dist,ruokapower+1);
					yt += Math.pow(foods[i].gr,2)*ytd/Math.pow(dist,ruokapower+1);
				}
						
				xtd = (grd-snake.xx);
				ytd = (grd-snake.yy);
				
				dist = Math.sqrt(xtd*xtd + ytd*ytd);
				
				xt += xtd/Math.pow(grd-dist,keskipower+1)*DNA[6];
				yt += ytd/Math.pow(grd-dist,keskipower+1)*DNA[6];
				
				xt += xtd/grd*DNA[7];
				yt += ytd/grd*DNA[7];
				
				
			}
			
			xm = xt*kerroin;
			ym = yt*kerroin;
			
			lsxm = -xm;
			lsym = -ym;
			
			if (accelerate)
			{
				setAcceleration(1);
			}
			else
			{
				setAcceleration(0);
			}
			
			//console.log("xx:" +  view_xx + "yy:" + view_yy);
			//console.log("snake.xx:" +  snake.xx + "snake.yy:" + snake.yy);
			//console.log("snake.fx:" +  snake.fx + "snake.fy:" + snake.fy);
			//console.log("fvx:" +  fvx + "fvy:" + fvy);
			//console.log("");
			
			//console.log("foods_c:" + foods_c);
			//console.log("snakes.length:" + snakes.length);
			
			//console.log("D:" + Math.sqrt(xm*xm + ym*ym));
			
			lastscore = Math.floor(150 * (fpsls[snake.sct] + snake.fam / fmlts[snake.sct] - 1) - 50) / 10;
			if (!lastscore)
			{
				lastscore = 1;
			}
			lastrank = rank;
			if (!lastrank)
			{
				lastrank = 500;
			}
		}
		else
		{
			if (!injected_dead)
			{
				injected_dead = true;
				
				if (lastscore>bestscore)
				{
					console.log("Last score: " + lastscore + "(new best)");
					bestscore = lastscore;
					
					BESTSCORE = bestscore;
				}
				else
				{
					console.log("Last score: " + lastscore + " Best: " + bestscore);
				}
				
				if (lastrank<bestrank)
				{
					console.log("Last rank: " + lastrank + "(new best)");
					bestrank = lastrank;
					
					BESTRANK = bestrank;
				}
				else
				{
					console.log("Last rank: " + lastrank + " Best: " + bestrank);
				}
				
				if (testingdna>0)
				{
					TESTSCORE = lastscore/(lastrank+1);

				}
				else
				{
					REALSCORE = (REALSCORE+lastscore/lastrank)/2;
				}
				lastscore = 0;

				for (var key in DNA)
				{		
					if (TESTSCORE > REALSCORE)
					{
						var mul = TESTSCORE/REALSCORE
						REALDNA[key] = (REALDNA[key] + TESTDNA[key]*mul)/(1+mul);
						REALDNA[key] = Math.round(REALDNA[key]*precision)/precision;
					}

					if (testingdna<0)
					{
						TESTDNA[key] = REALDNA[key] + REALDNA[key]*(Math.random() - Math.random())*learnrate;
						TESTDNA[key] = Math.round(TESTDNA[key]*precision)/precision;
					}
				}
				
				savedna();

				testingdna = -testingdna;

				if (testingdna>0)
				{
					DNA = TESTDNA.slice();
				}
				else
				{
					DNA = REALDNA.slice();
				}
				//console.log("DNA = [" + DNA + "];");
				
				setTimeout(connect, 3000);
				//console.log("Reconnecting");
			}
		}
	}
}

var injectbot = function() {
	if (typeof(redraw) != "undefined")
	{
		oldredraw = redraw;

		redraw = function() {
			INJECTED();
			oldredraw();
		}
		console.log("injected")
		window.onmousemove = null;
	}
	else
	{
		setTimeout(injectbot, 1000);
		console.log("retrying")
	}
}
injectbot();