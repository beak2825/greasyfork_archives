// ==UserScript==
// @name         Keyboard Display Script
// @namespace    http://tampermonkey.net/
// @version      0.2201
// @description  shows keyboard inputs on screen
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385653/Keyboard%20Display%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385653/Keyboard%20Display%20Script.meta.js
// ==/UserScript==

/**************************
   Keyboard Display Script
**************************/

(function() {
    window.addEventListener('load', function(){

shiftRight = 0;


if(typeof Game != "undefined" || typeof Replayer != "undefined"){

if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}
if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}


var kbhold=document.createElement("div");
kbhold.id="keyboardHolder";
kbhold.style.position="absolute"
kbhold.style.left = (myCanvas.getBoundingClientRect().left - 300) + "px";
kbhold.style.top = (myCanvas.getBoundingClientRect().top + 100) + "px";


if(typeof Replayer != "undefined" && typeof Game == "undefined") {
    Replayer["pressKey"] = function(num,type){
        //type: 0=release 1=down 2=press
	document.getElementsByClassName("kbkey")[num].style.backgroundColor = type?"lightgoldenrodyellow":""
	if(type==2){
		setTimeout(x=>{document.getElementsByClassName("kbkey")[num].style.backgroundColor = ""},20)
	}

}
kbhold.style.left = (myCanvas.getBoundingClientRect().right + 200) + "px";
kbhold.style.top = (myCanvas.getBoundingClientRect().top + 200) + "px";
}

document.body.appendChild(kbhold);

var f='<R>M{text-align:center;position: absolute;font-size:15px`{]-Q:QIspacing:0;Nred`td|th|Uwp8o_000000;]:inherit`UT_34ff34`Ujy2k_f8a102`UO_f8ff00;}</RYbo"Yps"KPJV"Ptr^Tq180~TqSD~TqHDZ[CCWZXtr^OqHL~OqCWZ[&lt;[v[&gt;X/JK>~</td^|{padding:10px 5pxIR:solidIwidth:2px`q kbkey">`;}M.tg _{]-N#^PtdV-]border[~jy2kqZ~wp8o">YPdiv id="kX</tdP/trPV class="tgU.tg-Ttc3eRstyleQcollapseP><Op39mNcolor:M#kbo KP/divJtableI;]-';var g=0;var i=0;for(i in g='IJKMNOPQRTUVXYZ[]^_`q|~')var e=f.split(g[i]),f=e.join(e.pop())
keyboardHolder.innerHTML = f

if(typeof Game == "undefined"){
	keyboardHolder.style.left = (parseFloat(keyboardHolder.style.left) + shiftRight) + "px"
}


if(typeof Game != "undefined") {

    document['addEventListener']('keydown', press);
document['addEventListener']('keyup', press);
function press(e) {
	if(~Game['set2ings'].indexOf(e.keyCode)){
		var corresponding = [6,8,1,2,3,5,4,0][Game['set2ings'].indexOf(e.keyCode)]
		document.getElementsByClassName("kbkey")[corresponding].style.backgroundColor = ["lightgoldenrodyellow",""][+(e.type=="keyup")]
	}
}


	var set2ings = Game['prototype']['readyGo'].toString()
	set2ings = "Game['set2ings']=this.Settings.controls;" + trim(set2ings)
	Game['prototype']['readyGo'] = new Function(set2ings);

	var updateTextBarFunc = Game['prototype']['updateTextBar'].toString()
	updateTextBarFunc = trim(updateTextBarFunc) + ";kps.innerHTML='KPS: '+(this.getKPP()*this.placedBlocks/this.clock).toFixed(2)"
	Game['prototype']['updateTextBar'] = new Function(updateTextBarFunc);
} else {



var website = "jstris.jezevec10.com"
var url = window.location.href
var parts = url.split("/")

if(parts[3]=="replay" && parts[2].endsWith(website)){

	fetch("https://"+parts[2]+"/replay/data?id="+ (parts.length==6?(parts[5]+"&live=1"):(parts[4])))
		.then(function(response) {
		    return response.json();
		})
		.then(function(jsonResponse) {
			var das = jsonResponse.c.das
			var playT = Replayer['prototype']['playUntilTime'].toString()
			var playTparams = getParams(playT);


			var insert1 = `
			kps.innerHTML="KPS: "+(this.getKPP()*this.placedBlocks/(this.clock/1000)).toFixed(2)
			this["delayedActions"] = []
			for (var i = 0; i < this["actions"].length; i++) {
				var action = JSON.parse(JSON.stringify(this["actions"][i]));
				if(action.a == 2 || action.a == 3){
					action.t = (action.t-`+das+`)>0 ? (action.t-`+das+`) : 0
				}
				this["delayedActions"].push(action)
			}

			this["delayedActions"].sort(function(a, b) {
    			return a.t - b.t;
			});

			var oldVals = [this["timer"],this["ptr"]]

			while (`+playTparams[0]+` >= this['delayedActions'][this['ptr']]['t']) {
			    if (this['ptr']) {
			        this['timer'] += (this['delayedActions'][this['ptr']]['t'] - this['delayedActions'][this['ptr'] - 1]['t']) / 1000
			    };
			    if(this['delayedActions'][this['ptr']]["a"] == 2){
			    	Replayer["pressKey"](6,1)
			    }
				if(this['delayedActions'][this['ptr']]["a"] == 3){
			    	Replayer["pressKey"](8,1)
			    }

			    this['ptr']++;
			    if (this['delayedActions']['length'] === this['ptr']) {
			        this['reachedEnd'] = true;
			        break
			    }
			};

			this["timer"] = oldVals[0]
			this["ptr"] = oldVals[1]`

			var insert2 = `
			var highlight = [[6,2],[8,2],[6,0],[8,0],[3,2],[5,2],[0,2],[2,2],[1,2],,[4,2]][this['actions'][this['ptr']]["a"]]
			if(highlight){
				Replayer["pressKey"](...highlight)
			};
			`

			playT = playT.replace(";",insert1+";")
			playT = playT.replace("1000};","1000};"+insert2)
			Replayer['prototype']['playUntilTime'] = new Function(...playTparams, trim(playT));



		});
}


}

}


    });
})();